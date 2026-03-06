param(
  [switch]$Install,
  [switch]$Build
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dashboardPath = Join-Path $repoRoot "dashboard"
$skillPath = Join-Path $repoRoot "SKILL.md"
$memoryPath = Join-Path $repoRoot "PROJECT_MEMORY.md"

Write-Host "Project root: $repoRoot"

if (-not (Test-Path $skillPath)) {
  throw "Missing SKILL.md in repository root."
}

if (-not (Test-Path $memoryPath)) {
  throw "Missing PROJECT_MEMORY.md in repository root."
}

if (-not (Test-Path $dashboardPath)) {
  throw "Missing dashboard folder."
}

Write-Host "Loaded: SKILL.md + PROJECT_MEMORY.md"
Set-Location $dashboardPath

if ($Install -or -not (Test-Path (Join-Path $dashboardPath "node_modules"))) {
  Write-Host "Installing dependencies..."
  npm install
}

if ($Build) {
  Write-Host "Running build..."
  npm run build
}

Write-Host "Init complete."
Write-Host "Start dev server with: .\\start-dashboard.ps1 or npm run dev:open"
