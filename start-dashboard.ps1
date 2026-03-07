param(
  [int]$Port = 5174,
  [string]$BindHost = '127.0.0.1'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dashboardPath = Join-Path $repoRoot 'dashboard'
$url = "http://${BindHost}:${Port}/"

if (-not (Test-Path $dashboardPath)) {
  throw "Dashboard-Ordner nicht gefunden: $dashboardPath"
}

Set-Location $dashboardPath

if (-not (Test-Path (Join-Path $dashboardPath 'node_modules'))) {
  Write-Host 'Installiere Abhaengigkeiten...'
  npm install
}

try {
  $existing = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
  if ($existing.StatusCode -ge 200) {
    Write-Host "Nutze laufenden Dev-Server: $url"
    Start-Process $url
    exit 0
  }
}
catch {
}

Write-Host "Starte Dev-Server auf $url"
Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-ExecutionPolicy', 'Bypass',
  '-Command', "Set-Location '$dashboardPath'; npm run dev:open"
)

$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -ge 200) {
      $ready = $true
      break
    }
  }
  catch {
  }
}

if (-not $ready) {
  throw "Dev-Server wurde nicht rechtzeitig unter $url erreicht."
}

Start-Process $url
Write-Host "Browser geoeffnet: $url"

