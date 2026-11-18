"""Autentikasi sederhana berbasis password + cookie token."""
import os
import hmac
import hashlib
import time
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

_PASSWORD = os.getenv('APP_PASSWORD', '').strip()
_SECRET = os.getenv('APP_SECRET', 'kali-secret-change-me').strip()
_TTL = 60 * 60 * 24 * 7  # 7 hari


def auth_enabled() -> bool:
    return bool(_PASSWORD)


def _sign(payload: str) -> str:
    return hmac.new(_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()


def make_token() -> str:
    ts = str(int(time.time()))
    return ts + '.' + _sign(ts)


def verify_token(token: str) -> bool:
    try:
        ts, sig = token.split('.', 1)
        if _sign(ts) != sig:
            return False
        return (int(time.time()) - int(ts)) < _TTL
    except Exception:
        return False


def _has_oauth_session(request: Request) -> bool:
    try:
        import oauth
        tok = request.cookies.get('kali_user')
        return bool(tok and oauth.verify_session(tok))
    except Exception:
        return False


def is_authed(request: Request) -> bool:
    # Sesi login user (GitHub/lokal) dianggap sah lebih dulu.
    if _has_oauth_session(request):
        return True
    if not auth_enabled():
        return True
    tok = request.cookies.get('kali_auth') or request.headers.get('x-auth-token')
    return bool(tok and verify_token(tok))


def require_auth(request: Request):
    if not is_authed(request):
        raise HTTPException(401, 'Perlu login.')
