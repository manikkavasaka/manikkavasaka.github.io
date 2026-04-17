# MK Shopzone — Local Claude Launcher
# This script bridges the Claude Code CLI with a local Ollama Llama 3.1 model.

# 1. Configuration
$OLLAMA_URL = "http://127.0.0.1:11434/v1"
$MODEL = "llama3.1:latest"

Write-Host "🚀 Launching Local Claude (Llama 3.1) @ $OLLAMA_URL" -ForegroundColor Cyan

# 2. Set ALL possible Environment Variables for Claude Code
$env:ANTHROPIC_BASE_URL = $OLLAMA_URL
$env:ANTHROPIC_API_URL = $OLLAMA_URL
$env:ANTHROPIC_API_KEY = "ollama-local-bypass"
$env:CLAUDE_BASE_URL = $OLLAMA_URL
$env:CLAUDE_API_KEY = "ollama-local-bypass"

# 3. Launch
Write-Host "Using model: $MODEL" -ForegroundColor Green
Write-Host "NOTE: If it asks for login, please ignore or try a fresh session." -ForegroundColor Gray
& claude --model $MODEL
