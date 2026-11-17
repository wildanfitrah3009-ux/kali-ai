# Web AI â€” API Gateway

API kompatibel OpenAI dengan tambahan auth per-user, rate-limit, usage metering,
fallback multi-provider, dan cache.

Base URL lokal: `http://127.0.0.1:8000`

## Autentikasi

Endpoint `/v1/*` memerlukan header:

```
Authorization: Bearer <API_KEY>
```

Daftar key ada di `api_keys.json`. Set `GATEWAY_REQUIRE_KEY=0` di `.env` untuk
membuka endpoint tanpa auth (tidak disarankan untuk publik).

## Endpoint

### GET /v1/models
Daftar model aktif.

### POST /v1/chat/completions
Kompatibel dengan OpenAI Chat Completions.

Body:
```json
{
  "messages": [{"role": "user", "content": "Halo"}],
  "stream": false,
  "temperature": 0.4,
  "max_tokens": 512
}
```

Contoh curl:
```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H "Authorization: Bearer wai_demo_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Halo"}]}'
```

Streaming (SSE): set `"stream": true`.

### GET /v1/usage
Ringkasan pemakaian (request, token, biaya estimasi) untuk user pemilik key.

### GET /api/info
Info provider & model (publik, tanpa auth).

### GET /docs
Dokumentasi interaktif Swagger UI (otomatis dari FastAPI).

## Rate limit
- `/api/chat`: 10 request/menit per IP (slowapi).
- `/v1/chat/completions`: **per API key**, sesuai field `rpm` di `api_keys.json`
  (sliding window 60 detik). Bila terlampaui â†’ HTTP 429 + header `Retry-After`.

## Manajemen API key (CLI)

```bash
# buat key baru (rpm = batas per menit)
python web/manage_keys.py add --name alice --plan free --rpm 10
# daftar key (ter-mask)
python web/manage_keys.py list
# aktif / nonaktif
python web/manage_keys.py disable --name alice
python web/manage_keys.py enable  --name alice
```

Key disimpan di `web/api_keys.json` (di-ignore Git). Contoh tersedia di
`web/api_keys.example.json`.

## Billing / usage
Setiap request dicatat ke `usage.json`:
- `tokens_in`, `tokens_out` (estimasi ~4 karakter/token)
- `cost_usd` dihitung dari `PRICE_PER_1K_INPUT` / `PRICE_PER_1K_OUTPUT`

## Cache
Respons non-streaming di-cache in-memory selama `CACHE_TTL_SECONDS` (default 120).

## Deploy (Docker + HTTPS)

```bash
docker compose up -d --build
```

Edit `Caddyfile`, ganti `example.com` dengan domain Anda (A record harus
mengarah ke server). Caddy menerbitkan HTTPS otomatis.
