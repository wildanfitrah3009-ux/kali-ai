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
Default 10 request/menit per IP (endpoint `/api/chat`). Atur `rpm` per key di
`api_keys.json` untuk batas per-user.

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
