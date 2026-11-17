"""Gateway layer untuk Web AI API.

Modul ini menambahkan (tanpa mengubah alur chat lama):
- Auth per-user API key (header Authorization: Bearer <key>)
- Rate-limit per API key
- Usage metering / billing (token + biaya estimasi per request)
- Cache respons sederhana (in-memory, TTL)

API key disimpan di file JSON (web/api_keys.json). Format tiap entri:
{
  "key": "wai_xxx",
  "name": "user-a",
  "plan": "free",
  "rpm": 10,
  "active": true
}
"""
import os
import json
import time
import hashlib
import threading
from pathlib import Path
from typing import Optional

from fastapi import Header, HTTPException

BASE_DIR = Path(__file__).parent
KEYS_PATH = BASE_DIR / 'api_keys.json'
USAGE_PATH = BASE_DIR / 'usage.json'

_LOCK = threading.Lock()
_CACHE: dict[str, tuple[float, str]] = {}
CACHE_TTL = int(os.getenv('CACHE_TTL_SECONDS', '120'))


def _load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return default


def load_keys() -> dict:
    data = _load_json(KEYS_PATH, {'keys': []})
    keys = {}
    for item in data.get('keys', []):
        k = (item.get('key') or '').strip()
        if k:
            keys[k] = item
    return keys


def require_key(authorization: Optional[str] = Header(default=None)) -> dict:
    """Dependency FastAPI: validasi API key dari header Authorization."""
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(401, 'API key diperlukan. Gunakan header: Authorization: Bearer <key>')
    token = authorization.split(' ', 1)[1].strip()
    entry = load_keys().get(token)
    if not entry or not entry.get('active', True):
        raise HTTPException(401, 'API key tidak valid atau tidak aktif.')
    entry = dict(entry)
    entry['key'] = token
    return entry


def record_usage(api_key: str, name: str, provider: str, model: str,
                 tokens_in: int, tokens_out: int) -> None:
    """Catat pemakaian. Biaya estimasi per 1K token (USD) bisa diatur via env."""
    price_in = float(os.getenv('PRICE_PER_1K_INPUT', '0.0'))
    price_out = float(os.getenv('PRICE_PER_1K_OUTPUT', '0.0'))
    cost = (tokens_in / 1000.0) * price_in + (tokens_out / 1000.0) * price_out
    rec = {
        'ts': time.time(),
        'key': api_key[:8] + '...',
        'name': name,
        'provider': provider,
        'model': model,
        'tokens_in': tokens_in,
        'tokens_out': tokens_out,
        'cost_usd': round(cost, 6),
    }
    with _LOCK:
        data = _load_json(USAGE_PATH, {'events': [], 'totals': {}})
        data['events'].append(rec)
        data['events'] = data['events'][-5000:]  # batasi ukuran
        t = data['totals'].get(name) or {'requests': 0, 'tokens_in': 0, 'tokens_out': 0, 'cost_usd': 0.0}
        t['requests'] += 1
        t['tokens_in'] += tokens_in
        t['tokens_out'] += tokens_out
        t['cost_usd'] = round(t['cost_usd'] + cost, 6)
        data['totals'][name] = t
        try:
            USAGE_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
        except Exception:
            pass


def estimate_tokens(text: str) -> int:
    """Estimasi kasar: ~4 karakter per token."""
    return max(1, len(text or '') // 4)


def cache_key(model: str, messages: list, system: str) -> str:
    raw = model + '||' + system + '||' + json.dumps(messages, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()


def cache_get(key: str) -> Optional[str]:
    item = _CACHE.get(key)
    if not item:
        return None
    ts, value = item
    if time.time() - ts > CACHE_TTL:
        _CACHE.pop(key, None)
        return None
    return value


def cache_set(key: str, value: str) -> None:
    if CACHE_TTL <= 0:
        return
    with _LOCK:
        if len(_CACHE) > 1000:
            # buang entri tertua sederhana
            for k in list(_CACHE.keys())[:200]:
                _CACHE.pop(k, None)
        _CACHE[key] = (time.time(), value)


def usage_summary() -> dict:
    return _load_json(USAGE_PATH, {'events': [], 'totals': {}}).get('totals', {})


# ---------------------------------------------------------------------------
# Rate-limit per API key (sliding window in-memory)
# ---------------------------------------------------------------------------
_RATE: dict[str, list[float]] = {}
_RATE_LOCK = threading.Lock()


def check_rate_limit(key: str, rpm: int) -> None:
    """Lempar HTTPException 429 bila key melebihi rpm per menit."""
    if not rpm or rpm <= 0:
        return
    now = time.time()
    window_start = now - 60.0
    with _RATE_LOCK:
        hits = [t for t in _RATE.get(key, []) if t >= window_start]
        if len(hits) >= rpm:
            retry = int(60 - (now - hits[0])) + 1
            _RATE[key] = hits
            raise HTTPException(
                429,
                f'Rate limit terlampaui ({rpm}/menit). Coba lagi dalam {max(retry, 1)} detik.',
                headers={'Retry-After': str(max(retry, 1))},
            )
        hits.append(now)
        _RATE[key] = hits


def generate_key(name: str, plan: str = 'free', rpm: int = 10) -> dict:
    """Buat key baru, simpan ke api_keys.json, kembalikan entri."""
    import uuid
    new_key = 'wai_' + uuid.uuid4().hex
    entry = {'key': new_key, 'name': name, 'plan': plan, 'rpm': rpm, 'active': True}
    with _LOCK:
        data = _load_json(KEYS_PATH, {'keys': []})
        data.setdefault('keys', []).append(entry)
        KEYS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
    return entry
