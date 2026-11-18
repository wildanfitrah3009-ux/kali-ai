# Panduan Setup OAuth (Google + GitHub)

Login OAuth sudah terpasang di kode. Yang kurang hanya kredensial.
Ikuti langkah ini, lalu isi `web/.env` dan restart server.

---

## 1. Google

1. Buka https://console.cloud.google.com/
2. Buat project (mis. "Kali AI").
3. Menu: APIs & Services -> OAuth consent screen -> pilih External -> Create.
   Isi nama app, email support, email developer. Save.
4. Menu: APIs & Services -> Credentials -> Create Credentials -> OAuth client ID.
   - Application type: Web application
   - Authorized redirect URI:
     http://127.0.0.1:8000/auth/google/callback
     (produksi: https://domain-anda.com/auth/google/callback)
5. Salin Client ID dan Client Secret.

## 2. GitHub

1. Buka https://github.com/settings/developers
2. OAuth Apps -> New OAuth App.
   - Application name: Kali AI
   - Homepage URL: http://127.0.0.1:8000
   - Authorization callback URL: http://127.0.0.1:8000/auth/github/callback
3. Salin Client ID, lalu Generate a new client secret dan salin.

## 3. Isi web/.env

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
OAUTH_REDIRECT_BASE=http://127.0.0.1:8000
```

OAUTH_REDIRECT_BASE harus SAMA PERSIS dengan redirect URI yang didaftarkan.
Untuk produksi ganti ke https://domain-anda.com dan daftarkan URI itu juga.

## 4. Restart server

```
python -m uvicorn web.server:app --host 0.0.0.0 --port 8000
```

## 5. Verifikasi

Buka: http://127.0.0.1:8000/api/auth-status
Harus muncul "providers": ["google","github"].
Halaman login akan menampilkan tombol Google dan GitHub.

## Catatan

- Untuk produksi (domain publik), Google & GitHub mewajibkan HTTPS.
- Jangan bagikan Client Secret.
- Tombol login lokal (email/password) tetap tersedia sebagai cadangan.
- Database user: web/.memory/users.db (otomatis dibuat).
