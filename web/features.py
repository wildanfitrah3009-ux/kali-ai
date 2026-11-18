"""Fitur tambahan Kali AI: deteksi bahasa, ekstraksi file lampiran, memori."""

import re
import json
import io
from pathlib import Path

# ---------------------------------------------------------------------------
# 1. Deteksi bahasa sederhana berbasis kata kunci
# ---------------------------------------------------------------------------
_LANG_HINTS = {
    'id': (' yang ', ' dan ', ' saya ', ' kamu ', ' tidak ', ' dengan ', ' untuk ', ' apa ', ' bagaimana '),
    'en': (' the ', ' and ', ' you ', ' not ', ' with ', ' for ', ' what ', ' how ', ' is '),
    'ja': ('\u306e', '\u306f', '\u3092', '\u3067\u3059', '\u307e\u3059', '\u304f\u3060\u3055\u3044'),
    'zh': ('\u7684', '\u662f', '\u6211', '\u4f60', '\u4e0d', '\u4e86', '\u4ec0\u4e48'),
    'ko': ('\uc758', '\ub294', '\uc744', '\uc785\ub2c8\ub2e4', '\ud569\ub2c8\ub2e4', '\uc788\uc2b5\ub2c8\ub2e4'),
}


def detect_language(text: str, fallback: str = 'id') -> str:
    t = ' ' + (text or '').lower() + ' '
    scores = {}
    for lang, hints in _LANG_HINTS.items():
        scores[lang] = sum(t.count(h) for h in hints)
    if re.search(r'[\u3040-\u30ff]', text):
        scores['ja'] += 5
    if re.search(r'[\u4e00-\u9fff]', text):
        scores['zh'] += 3
    if re.search(r'[\uac00-\ud7af]', text):
        scores['ko'] += 5
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else fallback


# ---------------------------------------------------------------------------
# 2. Ekstraksi teks dari file lampiran
# ---------------------------------------------------------------------------
def extract_text(filename: str, data: bytes) -> str:
    name = (filename or '').lower()
    try:
        if name.endswith('.txt') or name.endswith('.md') or name.endswith('.csv'):
            return data.decode('utf-8', errors='ignore')
        if name.endswith('.pdf'):
            try:
                from pypdf import PdfReader
            except ImportError:
                from PyPDF2 import PdfReader  # type: ignore
            reader = PdfReader(io.BytesIO(data))
            return '\n'.join((p.extract_text() or '') for p in reader.pages)
        if name.endswith('.docx'):
            from docx import Document
            d = Document(io.BytesIO(data))
            return '\n'.join(p.text for p in d.paragraphs if p.text)
        if name.endswith('.xlsx'):
            from openpyxl import load_workbook
            wb = load_workbook(io.BytesIO(data), read_only=True, data_only=True)
            out = []
            for ws in wb.worksheets:
                for row in ws.iter_rows(values_only=True):
                    cells = [str(c) for c in row if c is not None]
                    if cells:
                        out.append(' | '.join(cells))
            return '\n'.join(out)
        if name.endswith('.pptx'):
            from pptx import Presentation
            prs = Presentation(io.BytesIO(data))
            out = []
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, 'text') and shape.text:
                        out.append(shape.text)
            return '\n'.join(out)
    except Exception as e:
        return f'[Gagal membaca file: {e}]'
    return '[Format file tidak didukung untuk dibaca otomatis]'


# ---------------------------------------------------------------------------
# 3. Memori lintas sesi sederhana (disimpan per-file JSON)
# ---------------------------------------------------------------------------
_MEM_DIR = Path(__file__).parent / '.memory'


def _mem_path(session_id: str) -> Path:
    safe = re.sub(r'[^a-zA-Z0-9_-]', '', session_id or 'default')[:64] or 'default'
    _MEM_DIR.mkdir(exist_ok=True)
    return _MEM_DIR / f'{safe}.json'


def load_memory(session_id: str, limit: int = 10) -> list:
    p = _mem_path(session_id)
    if not p.exists():
        return []
    try:
        items = json.loads(p.read_text(encoding='utf-8'))
        return items[-limit:]
    except Exception:
        return []


def add_memory(session_id: str, user: str, assistant: str, keep: int = 30) -> None:
    p = _mem_path(session_id)
    items = []
    if p.exists():
        try:
            items = json.loads(p.read_text(encoding='utf-8'))
        except Exception:
            items = []
    items.append({'u': (user or '')[:500], 'a': (assistant or '')[:800]})
    items = items[-keep:]
    try:
        p.write_text(json.dumps(items, ensure_ascii=False), encoding='utf-8')
    except Exception:
        pass


# ---------------------------------------------------------------------------
# 4. Profil pengguna jangka panjang (nama, profesi, preferensi)
# ---------------------------------------------------------------------------
def _profile_path(session_id: str) -> Path:
    safe = re.sub(r'[^a-zA-Z0-9_-]', '', session_id or 'default')[:64] or 'default'
    _MEM_DIR.mkdir(exist_ok=True)
    return _MEM_DIR / f'profile_{safe}.json'


def load_profile(session_id: str) -> dict:
    p = _profile_path(session_id)
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding='utf-8'))
    except Exception:
        return {}


def save_profile(session_id: str, data: dict) -> dict:
    cur = load_profile(session_id)
    for k in ('name', 'profession', 'preferences'):
        if isinstance(data.get(k), str) and data[k].strip():
            cur[k] = data[k].strip()[:300]
    try:
        _profile_path(session_id).write_text(json.dumps(cur, ensure_ascii=False), encoding='utf-8')
    except Exception:
        pass
    return cur


def build_profile_context(session_id: str) -> str:
    prof = load_profile(session_id)
    if not prof:
        return ''
    parts = []
    if prof.get('name'):
        parts.append('Nama pengguna: ' + prof['name'])
    if prof.get('profession'):
        parts.append('Profesi: ' + prof['profession'])
    if prof.get('preferences'):
        parts.append('Preferensi: ' + prof['preferences'])
    if not parts:
        return ''
    return '\n\nProfil pengguna (gunakan untuk personalisasi, jangan diulang mentah):\n- ' + '\n- '.join(parts)


# ---------------------------------------------------------------------------
# 5. Ringkasan otomatis percakapan panjang (disimpan per sesi)
# ---------------------------------------------------------------------------
def _summary_path(session_id: str) -> Path:
    safe = re.sub(r'[^a-zA-Z0-9_-]', '', session_id or 'default')[:64] or 'default'
    _MEM_DIR.mkdir(exist_ok=True)
    return _MEM_DIR / f'summary_{safe}.txt'


def load_summary(session_id: str) -> str:
    p = _summary_path(session_id)
    if not p.exists():
        return ''
    try:
        return p.read_text(encoding='utf-8')[:4000]
    except Exception:
        return ''


def save_summary(session_id: str, text: str) -> None:
    try:
        _summary_path(session_id).write_text((text or '')[:4000], encoding='utf-8')
    except Exception:
        pass


def build_memory_context(session_id: str, limit: int = 8) -> str:
    items = load_memory(session_id, limit)
    if not items:
        return ''
    lines = ['\n\nRingkasan memori percakapan sebelumnya (untuk konteks, jangan diulang mentah):']
    for it in items:
        lines.append('- User: ' + it['u'][:200] + '\n  Kali: ' + it['a'][:200])
    return '\n'.join(lines)
