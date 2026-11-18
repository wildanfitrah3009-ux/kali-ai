"""Cek status konfigurasi login (GitHub OAuth). Jalankan: python web/check_oauth.py"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

base = os.getenv('OAUTH_REDIRECT_BASE', '')
print('OAUTH_REDIRECT_BASE:', base or '(kosong)')

gh_id = bool(os.getenv('GITHUB_CLIENT_ID'))
gh_sec = bool(os.getenv('GITHUB_CLIENT_SECRET'))
gh_ok = gh_id and gh_sec
print('github:', 'SIAP' if gh_ok else 'BELUM diisi')
print('Providers aktif:', ['github'] if gh_ok else 'tidak ada (login lokal tetap tersedia)')
if gh_ok and base:
    print('  redirect github:', base.rstrip('/') + '/auth/github/callback')
