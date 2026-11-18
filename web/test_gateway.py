"""Test untuk gateway OpenAI-compatible (/v1/*).

Tidak memanggil penyedia AI sungguhan: fungsi stream_fn di server diganti mock.
Jalankan: .venv/Scripts/python.exe -m pytest web/test_gateway.py -q
"""
import os
import sys
import json
import asyncio
from pathlib import Path

import pytest

WEB_DIR = Path(__file__).parent
if str(WEB_DIR) not in sys.path:
    sys.path.insert(0, str(WEB_DIR))

os.environ.setdefault('AI_PROVIDER', 'openai')
os.environ.setdefault('OPENAI_API_KEY', 'dummy-key-for-tests')
os.environ['GATEWAY_REQUIRE_KEY'] = '1'
os.environ['CACHE_TTL_SECONDS'] = '120'

from fastapi.testclient import TestClient  # noqa: E402

import gateway  # noqa: E402
import server  # noqa: E402

TEST_KEY = 'wai_test_key_123'
TEST_NAME = 'pytest-user'


@pytest.fixture(scope='module')
def client(tmp_path_factory):
    # arahkan file key & usage ke folder sementara
    tmp = tmp_path_factory.mktemp('gw')
    gateway.KEYS_PATH = tmp / 'api_keys.json'
    gateway.USAGE_PATH = tmp / 'usage.json'
    gateway.KEYS_PATH.write_text(
        json.dumps({'keys': [{'key': TEST_KEY, 'name': TEST_NAME, 'plan': 'free', 'rpm': 5, 'active': True}]}),
        encoding='utf-8',
    )

    # mock provider: kembalikan beberapa delta lalu selesai
    async def fake_stream(messages, system, temperature, max_tokens):
        for part in ['Halo', ', ', 'dunia', '!']:
            await asyncio.sleep(0)
            yield part

    server.STREAM_FNS = [fake_stream]
    gateway._CACHE.clear()

    return TestClient(server.app)


@pytest.fixture(autouse=True)
def _reset_rate_limit():
    gateway._RATE.clear()
    yield
    gateway._RATE.clear()


def auth_header(key=TEST_KEY):
    return {'Authorization': f'Bearer {key}'}


def test_models_public(client):
    r = client.get('/v1/models')
    assert r.status_code == 200
    data = r.json()
    assert data['object'] == 'list'
    assert data['data'][0]['id']


def test_chat_requires_auth(client):
    r = client.post('/v1/chat/completions', json={'messages': [{'role': 'user', 'content': 'hi'}]})
    assert r.status_code == 401


def test_chat_rejects_bad_key(client):
    r = client.post('/v1/chat/completions', headers=auth_header('wrong'),
                    json={'messages': [{'role': 'user', 'content': 'hi'}]})
    assert r.status_code == 401


def test_chat_rejects_empty(client):
    r = client.post('/v1/chat/completions', headers=auth_header(), json={'messages': []})
    assert r.status_code == 400


def test_chat_non_streaming_and_usage(client):
    payload = {'messages': [{'role': 'user', 'content': 'Halo gateway'}], 'stream': False}
    r = client.post('/v1/chat/completions', headers=auth_header(), json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data['choices'][0]['message']['content'] == 'Halo, dunia!'
    assert data['usage']['total_tokens'] > 0

    # usage tercatat untuk user ini
    u = client.get('/v1/usage', headers=auth_header())
    assert u.status_code == 200
    totals = u.json()['totals']
    assert totals['requests'] >= 1
    assert totals['tokens_out'] > 0


def test_cache_hit(client):
    payload = {'messages': [{'role': 'user', 'content': 'Pertanyaan cache unik'}], 'stream': False}
    r1 = client.post('/v1/chat/completions', headers=auth_header(), json=payload)
    assert r1.status_code == 200
    # usage sebelum permintaan kedua
    before = client.get('/v1/usage', headers=auth_header()).json()['totals']['requests']
    r2 = client.post('/v1/chat/completions', headers=auth_header(), json=payload)
    assert r2.status_code == 200
    assert r2.json()['choices'][0]['message']['content'] == r1.json()['choices'][0]['message']['content']
    after = client.get('/v1/usage', headers=auth_header()).json()['totals']['requests']
    # cache hit TIDAK menambah usage
    assert after == before


def test_rate_limit_per_key(client):
    # key uji punya rpm=5; habiskan kuota lalu pastikan 429
    gateway._RATE.clear()
    payload = {'messages': [{'role': 'user', 'content': 'rate limit'}], 'stream': False}
    codes = []
    for _ in range(6):
        r = client.post('/v1/chat/completions', headers=auth_header(), json=payload)
        codes.append(r.status_code)
    assert 429 in codes
    # minimal satu request sukses sebelum kena limit
    assert 200 in codes


def test_streaming(client):
    gateway._RATE.clear()  # pastikan kuota rate-limit bersih
    payload = {'messages': [{'role': 'user', 'content': 'stream ya'}], 'stream': True}
    with client.stream('POST', '/v1/chat/completions', headers=auth_header(), json=payload) as resp:
        assert resp.status_code == 200
        body = ''.join(resp.iter_text())
    assert 'data:' in body
    assert '[DONE]' in body
    assert 'Halo' in body
