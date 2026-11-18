# run_server.ps1 â€” start server Web AI secara aman (idempoten).
# Jalankan dari folder root workspace:  powershell -ExecutionPolicy Bypass -File web/run_server.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$py = Join-Path $root '.venv\Scripts\python.exe'
if (-not (Test-Path $py)) { $py = 'python' }

Write-Host '[*] Menghentikan instance uvicorn lama (jika ada)...' -ForegroundColor Cyan
$old = Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
    Where-Object { $_.CommandLine -like '*uvicorn*server:app*' }
foreach ($p in $old) {
    try { Stop-Process -Id $p.ProcessId -Force; Write-Host "    stopped PID $($p.ProcessId)" }
    catch { Write-Host "    gagal stop PID $($p.ProcessId): $_" -ForegroundColor Yellow }
}
Start-Sleep -Milliseconds 800

Write-Host '[*] Menjalankan uvicorn (satu instance)...' -ForegroundColor Cyan
$out = Join-Path $root 'webai-uvicorn.log'
$err = Join-Path $root 'webai-uvicorn.err.log'
$args = @('-m','uvicorn','server:app','--app-dir','web','--host','127.0.0.1','--port','8000')
Start-Process -FilePath $py -ArgumentList $args -WorkingDirectory $root -WindowStyle Hidden `
    -RedirectStandardOutput $out -RedirectStandardError $err

Write-Host '[*] Menunggu server siap...' -ForegroundColor Cyan
$ok = $false
for ($i = 1; $i -le 20; $i++) {
    Start-Sleep -Milliseconds 500
    try {
        $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/health' -TimeoutSec 3
        if ($r.status -eq 'ok') { $ok = $true; break }
    } catch { }
}

if ($ok) {
    $up = $r.upstream
    Write-Host "[OK] Server hidup di http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "     provider=$($r.provider)  model=$($r.model)"
    if ($up) { Write-Host "     upstream reachable=$($up.reachable)  model_present=$($up.model_present)" }
} else {
    Write-Host "[X] Server gagal start. Cek log: $err" -ForegroundColor Red
    exit 1
}
