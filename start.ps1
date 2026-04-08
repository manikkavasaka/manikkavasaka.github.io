# ════════════════════════════════════════════════════════════════════════════
#  MK Shopzone — Full-Stack Launch Script
#  Starts both the AI backend (FastAPI) and frontend (Vite) in one command.
#  Usage:  .\start.ps1
# ════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   MK Shopzone — AI Growth Engine Launcher v4.0          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Resolve paths ─────────────────────────────────────────────────────────
$root    = $PSScriptRoot
$venvPip = Join-Path $root "backend\.venv\Scripts\python.exe"
$envFile = Join-Path $root ".env"

# ── Check first-time setup ────────────────────────────────────────────────
if (-not (Test-Path $venvPip)) {
    Write-Host "  ⚠  Backend not set up yet. Running setup first…" -ForegroundColor Yellow
    & "$root\setup_backend.ps1"
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

if (-not (Test-Path $envFile)) {
    Copy-Item "$root\.env.example" "$root\.env"
    Write-Host "  ℹ  .env created from .env.example — add your API keys when ready." -ForegroundColor Cyan
}

# ── Load .env into current session ────────────────────────────────────────
Get-Content $envFile -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_ -match '^\s*([^#=]+?)\s*=\s*(.+)\s*$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
    }
}

# ── Launch FastAPI backend in a new window ─────────────────────────────────
Write-Host "→ Starting FastAPI AI Backend on http://localhost:8000…" -ForegroundColor Yellow
$backendCmd = "Set-Location '$root'; Write-Host '🚀 AI Backend Starting…' -ForegroundColor Green; & '$venvPip' -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload; Read-Host 'Press Enter to close'"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

# Give the backend 3 s to initialise before starting the frontend
Start-Sleep -Seconds 3

# ── Launch Vite frontend in a new window ───────────────────────────────────
Write-Host "→ Starting Vite Frontend on http://localhost:5173…" -ForegroundColor Yellow
$frontendCmd = "Set-Location '$root'; Write-Host '🌐 Vite Dev Server Starting…' -ForegroundColor Cyan; npm run dev; Read-Host 'Press Enter to close'"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

# ── Summary ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅  Both servers launching in separate windows!        ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║   🌐  Frontend:   http://localhost:5173                  ║" -ForegroundColor Green
Write-Host "║   🤖  AI API:     http://localhost:8000                  ║" -ForegroundColor Green
Write-Host "║   📊  Dashboard:  http://localhost:8000/admin            ║" -ForegroundColor Green
Write-Host "║   📖  API Docs:   http://localhost:8000/docs             ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║   Vite proxies /api/* → FastAPI automatically.          ║" -ForegroundColor Green
Write-Host "║   Close the two new terminal windows to stop servers.   ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
