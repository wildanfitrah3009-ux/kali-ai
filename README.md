# Web AI (Kali AI)

Aplikasi chat AI berbasis Python (FastAPI/Starlette) + React (UMD) untuk frontend.

## Struktur

- `web/server.py` - backend API utama.
- `web/features.py` - deteksi bahasa, ekstraksi file, memori, profil, ringkasan.
- `web/auth.py` - autentikasi password + cookie.
- `web/tools.py` - tool-calling aman (calculate, current_time, system_info).
- `web/exporters.py` - ekspor Word/Excel/PowerPoint.
- `web/static/` - sumber frontend (`*.jsx`, i18n.js).
  - `web/static/dist/` - hasil kompilasi Babel yang dimuat browser.
- `web/package.json` - script `build:ui` (Babel).

## PENTING: frontend memakai file hasil kompilasi

Browser TIDAK memuat file `.jsx`. `index.html` memuat file dari `web/static/dist/`.
Setiap kali mengubah file `.jsx`, wajib build ulang:

```bash
npm --prefix web run build:ui
```

Setelah build, naikkan query `?v=N` pada `<script>` terkait di `index.html`
(atau hard-refresh Ctrl+Shift+R) agar browser memuat file baru.

## Menjalankan

```bash
python -m uvicorn web.server:app --reload --port 8000
```

Buka `http://127.0.0.1:8000`.

Untuk akses dari perangkat lain di LAN:

```bash
python -m uvicorn web.server:app --host 0.0.0.0 --port 8000
```

## Test

```bash
python -m pytest web/test_smoke.py -q
```

## Konfigurasi (web/.env)

- AI_PROVIDER / OPENAI_BASE_URL / OPENAI_API_KEY / OPENAI_MODEL - provider AI.
- TEMPERATURE, MAX_TOKENS, MAX_HISTORY_MESSAGES, MAX_MESSAGE_CHARS, MAX_CONTEXT_CHARS.
- WEB_SEARCH, SEARCH_RESULTS, TAVILY_API_KEY, BRAVE_API_KEY.
- APP_PASSWORD (kosong = login nonaktif), APP_SECRET.

## Fitur

### Chat & AI
- Toleransi typo & konteks percakapan.
- Deteksi bahasa otomatis (id/en/ja/zh/ko).
- Memori lintas sesi (`web/.memory/`).
- Profil pengguna jangka panjang (nama, profesi, preferensi).
- Ringkasan otomatis percakapan panjang.
- Vision (baca gambar) bila model mendukung multimodal.
- TTS (suara jawaban) via Web Speech API browser.
- Tool-calling aman (mode Nalar): kalkulator, waktu, info sistem.

### Dokumen
- Ekspor Word (.docx) format laporan akademik: A4, margin 4-4-3-3, Times New Roman 12pt, spasi 1.5, justify, page break per BAB.
- Ekspor Excel (.xlsx) dan PowerPoint (.pptx).
- Tabel HTML dikonversi jadi tabel Word asli.

### Lampiran
- Ekstraksi isi file: txt, md, csv, pdf, docx, xlsx, pptx.

### Lainnya
- Rate-limit per-sesi (header X-Session-Id) dengan fallback IP.
- Autentikasi password opsional (APP_PASSWORD).
- Antarmuka multi-bahasa (id/en/ja/zh/ko).

## i18n

Teks UI via `window.getKaliText(key, language)` dari `web/static/i18n.js`.
Saat menambah teks UI baru, tambahkan key ke semua bahasa.
