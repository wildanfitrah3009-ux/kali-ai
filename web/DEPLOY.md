# Panduan Deploy Web AI API ke Publik

Panduan langkah-demi-langkah menaikkan API ke VPS dengan HTTPS.

## Prasyarat
- VPS (mis. Ubuntu 22.04, 1 vCPU / 1 GB RAM cukup untuk mulai)
- Domain (mis. `api.domainanda.com`)
- Akses SSH ke VPS

## 1. Arahkan domain
Di panel DNS domain Anda, buat record:
```
Tipe: A
Nama: api
Nilai: <IP_VPS_ANDA>
TTL: 300
```

## 2. Siapkan VPS
```bash
ssh root@<IP_VPS>
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin git
```

## 3. Ambil kode
```bash
git clone <URL_REPO_ANDA> webai
cd webai/web
```

## 4. Konfigurasi
Salin contoh lalu isi:
```bash
cp .env.example .env
nano .env   # isi OPENROUTER_API_KEY / provider lain
```
Buat key API pertama:
```bash
cp api_keys.example.json api_keys.json
python3 -c "import uuid;print('wai_'+uuid.uuid4().hex)"   # salin hasilnya ke api_keys.json
```

## 5. Set domain di Caddy
```bash
nano Caddyfile   # ganti example.com -> api.domainanda.com
```

## 6. Jalankan
```bash
docker compose up -d --build
docker compose logs -f   # pantau; tunggu sertifikat HTTPS terbit
```

## 7. Uji
```bash
curl https://api.domainanda.com/health
curl https://api.domainanda.com/v1/models
curl https://api.domainanda.com/v1/chat/completions \
  -H "Authorization: Bearer <API_KEY_ANDA>" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Halo"}]}'
```

## 8. Perawatan
- Update: `git pull && docker compose up -d --build`
- Log: `docker compose logs -f app`
- Backup `api_keys.json` & `usage.json` secara berkala

## Keamanan
- Jangan commit `.env` / `api_keys.json` (sudah di-ignore)
- Rotasi API key provider bila bocor
- Batasi `rpm` per user di `api_keys.json`
