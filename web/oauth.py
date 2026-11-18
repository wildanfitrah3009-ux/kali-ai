"""Login OAuth (Google & GitHub) + database user SQLite."""
import os
import time
import sqlite3
import secrets
import hashlib
import hmac
from pathlib import Path

_DB = Path(__file__).parent / '.memory' / 'users.db'
_DB.parent.mkdir(exist_ok=True)


def _conn():
    c = sqlite3.connect(_DB)
    c.row_factory = sqlite3.Row
    return c


def init_db():
    with _conn() as c:
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider TEXT, provider_id TEXT, email TEXT, name TEXT, avatar TEXT,
            password_hash TEXT, created_at INTEGER,
            UNIQUE(provider, provider_id)
        )''')
    return True


def upsert_user(provider, provider_id, email='', name='', avatar=''):
    with _conn() as c:
        row = c.execute('SELECT * FROM users WHERE provider=? AND provider_id=?', (provider, provider_id)).fetchone()
        if row:
            c.execute('UPDATE users SET email=?, name=?, avatar=? WHERE id=?', (email or row['email'], name or row['name'], avatar or row['avatar'], row['id']))
            return dict(c.execute('SELECT * FROM users WHERE id=?', (row['id'],)).fetchone())
        cur = c.execute('INSERT INTO users (provider, provider_id, email, name, avatar, created_at) VALUES (?,?,?,?,?,?)',
                        (provider, provider_id, email, name, avatar, int(time.time())))
        return dict(c.execute('SELECT * FROM users WHERE id=?', (cur.lastrowid,)).fetchone())


def get_user(uid):
    with _conn() as c:
        row = c.execute('SELECT * FROM users WHERE id=?', (uid,)).fetchone()
        return dict(row) if row else None


def _hash_pw(pw, salt=None):
    salt = salt or secrets.token_hex(8)
    h = hashlib.pbkdf2_hmac('sha256', pw.encode(), salt.encode(), 120000).hex()
    return f'{salt}${h}'


def create_local_user(email, password, name=''):
    with _conn() as c:
        if c.execute('SELECT 1 FROM users WHERE provider=? AND email=?', ('local', email)).fetchone():
            return None
        cur = c.execute('INSERT INTO users (provider, provider_id, email, name, password_hash, created_at) VALUES (?,?,?,?,?,?)',
                        ('local', email, email, name or email, _hash_pw(password), int(time.time())))
        return dict(c.execute('SELECT * FROM users WHERE id=?', (cur.lastrowid,)).fetchone())


def verify_local(email, password):
    with _conn() as c:
        row = c.execute('SELECT * FROM users WHERE provider=? AND email=?', ('local', email)).fetchone()
    if not row or not row['password_hash']:
        return None
    salt, h = row['password_hash'].split('$', 1)
    if hmac.compare_digest(_hash_pw(password, salt).split('$', 1)[1], h):
        return dict(row)
    return None


# --- State & sesi OAuth ---
_SECRET = os.getenv('APP_SECRET', 'kali-secret-change-me')
if _SECRET == 'kali-secret-change-me':
    import logging as _logging
    _logging.getLogger('webai').warning(
        'APP_SECRET belum diset â€” memakai default TIDAK AMAN. '
        'Set APP_SECRET acak sebelum mengaktifkan login/OAuth di publik.'
    )

def make_state():
    s = secrets.token_urlsafe(24)
    sig = hmac.new(_SECRET.encode(), s.encode(), hashlib.sha256).hexdigest()[:16]
    return s + '.' + sig


def verify_state(state):
    try:
        s, sig = state.rsplit('.', 1)
        return hmac.compare_digest(hmac.new(_SECRET.encode(), s.encode(), hashlib.sha256).hexdigest()[:16], sig)
    except Exception:
        return False


def make_session(uid):
    payload = f'{uid}.{int(time.time())}'
    sig = hmac.new(_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return payload + '.' + sig


def verify_session(token):
    try:
        uid, ts, sig = token.split('.')
        payload = f'{uid}.{ts}'
        if not hmac.compare_digest(hmac.new(_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest(), sig):
            return None
        if time.time() - int(ts) > 60 * 60 * 24 * 30:
            return None
        return int(uid)
    except Exception:
        return None


def oauth_config():
    return {
        'google': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID', ''),
            'client_secret': os.getenv('GOOGLE_CLIENT_SECRET', ''),
            'auth_url': 'https://accounts.google.com/o/oauth2/v2/auth',
            'token_url': 'https://oauth2.googleapis.com/token',
            'scope': 'openid email profile',
        },
        'github': {
            'client_id': os.getenv('GITHUB_CLIENT_ID', ''),
            'client_secret': os.getenv('GITHUB_CLIENT_SECRET', ''),
            'auth_url': 'https://github.com/login/oauth/authorize',
            'token_url': 'https://github.com/login/oauth/access_token',
            'scope': 'read:user user:email',
        },
    }
