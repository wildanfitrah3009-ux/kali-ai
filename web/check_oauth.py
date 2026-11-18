"""Cek status konfigurasi OAuth. Jalankan: python web/check_oauth.py"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

pairs = [
    ('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'),
    ('GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'),
]
base = os.getenv('OAUTH_REDIRECT_BASE', '')
print('OAUTH_REDIRECT_BASE:', base or '(kosong)')
ready = []
for cid, csec in pairs:
    name = cid.split('_')[0].lower()
    ok = bool(os.getenv(cid)) and bool(os.getenv(csec))
    print(f'{name}: ' + ('SIAP' if ok else 'BELUM diisi'))
    if ok:
        ready.append(name)
print('Providers aktif:', ready if ready else 'tidak ada')
if base:
    for p in ready:
        print(f'  redirect {p}: {base.rstrip("/")}/auth/{p}/callback')
