# ════════════════════════════════════════════════════════════════════════════
#  MK Shopzone — AI Growth Engine Setup Script
#  Run once to configure your backend environment.
#  Usage:  .\setup_backend.ps1
# ════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   MK Shopzone — AI Backend Setup v4.0                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check Python ──────────────────────────────────────────────────────────
Write-Host "→ Checking Python installation..." -ForegroundColor Yellow
$pythonCmd = $null
foreach ($cmd in @("python", "python3", "py")) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        $pythonCmd = $cmd
        break
    }
}

if (-not $pythonCmd) {
    Write-Host "  ❌  Python not found! Install from https://python.org" -ForegroundColor Red
    exit 1
}

$pyVersion = & $pythonCmd --version 2>&1
Write-Host "  ✅  $pyVersion" -ForegroundColor Green

# ── 2. Create virtual environment ────────────────────────────────────────────
Write-Host ""
Write-Host "→ Setting up virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.venv")) {
    & $pythonCmd -m venv backend\.venv
    Write-Host "  ✅  Virtual environment created at backend\.venv" -ForegroundColor Green
} else {
    Write-Host "  ℹ️   Virtual environment already exists." -ForegroundColor Cyan
}

# ── 3. Activate venv & install packages ──────────────────────────────────────
Write-Host ""
Write-Host "→ Installing Python dependencies..." -ForegroundColor Yellow
& backend\.venv\Scripts\pip.exe install --upgrade pip --quiet
& backend\.venv\Scripts\pip.exe install -r backend\requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅  All packages installed successfully." -ForegroundColor Green
} else {
    Write-Host "  ❌  Package installation failed. Check errors above." -ForegroundColor Red
    exit 1
}

# ── 4. Create .env from .env.example ─────────────────────────────────────────
Write-Host ""
Write-Host "→ Configuring environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  ✅  .env created from .env.example" -ForegroundColor Green
    Write-Host "  ⚠️   IMPORTANT: Open .env and fill in your API keys before running!" -ForegroundColor Yellow
} else {
    Write-Host "  ℹ️   .env already exists — skipped." -ForegroundColor Cyan
}

# ── 5. Summary ──────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅  Setup Complete!                                    ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║   Next steps:                                            ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║   1.  Edit your API keys:   notepad .env                 ║" -ForegroundColor Green
Write-Host "║   2.  Start the backend:    python backend\run.py --reload║" -ForegroundColor Green
Write-Host "║   3.  View API docs:        http://localhost:8000/docs   ║" -ForegroundColor Green
Write-Host "║   4.  Admin dashboard:      http://localhost:8000/admin  ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║   (Keep this terminal open alongside  npm run dev)       ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
