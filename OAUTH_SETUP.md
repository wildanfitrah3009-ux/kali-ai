# Panduan Setup Login (GitHub + Lokal)

Login OAuth sudah terpasang di kode. Kita memakai GitHub (gratis, tanpa
kartu kredit) + login lokal (email/password). Google TIDAK dipakai.

---

## 1. GitHub OAuth (gratis)

1. Buka https://github.com/settings/developers
2. Klik OAuth Apps -> New OAuth App.
   - Application name: Kali AI
   - Homepage URL: http://127.0.0.1:8000
   - Authorization callback URL: http://127.0.0.1:8000/auth/github/callback
3. Klik Register application.
4. Salin Client ID.
5. Klik Generate a new client secret, lalu salin Client Secret (hanya tampil sekali).

## 2. Isi web/.env

```
GITHUB_CLIENT_ID=...isi...
GITHUB_CLIENT_SECRET=...isi...
OAUTH_REDIRECT_BASE=http://127.0.0.1:8000
```

OAUTH_REDIRECT_BASE harus SAMA PERSIS dengan callback URL yang didaftarkan.
Untuk produksi ganti ke https://domain-anda.com dan daftarkan URI itu juga.

## 3. Restart server

```
python -m uvicorn web.server:app --host 0.0.0.0 --port 8000
```

## 4. Verifikasi

```
python web/check_oauth.py
```

Harus muncul: Providers aktif: ['github']

Buka http://127.0.0.1:8000 -> halaman login menampilkan tombol GitHub
+ form email/password (login lokal).

## Login lokal (cadangan, tanpa kredensial apa pun)

- Halaman login juga punya form email + password.
- Untuk daftar akun, endpoint POST /auth/register {email, password, name}.
- Database user: web/.memory/users.db (otomatis dibuat).

## Catatan

- GitHub OAuth 100% gratis, tanpa kartu kredit.
- Untuk produksi (domain publik) gunakan HTTPS.
- Jangan bagikan Client Secret.
