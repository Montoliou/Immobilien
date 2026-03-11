param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceRoot = Join-Path $repoRoot 'skills'
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' }
$codexSkillRoot = Join-Path $codexHome 'skills'
$sharedSkills = @(
  'mlp-design-guide-v3',
  'finanz-audit-skill',
  'yorkliving-delivery-playbook'
)

if (-not (Test-Path $sourceRoot)) {
  throw "Skills-Ordner nicht gefunden: $sourceRoot"
}

New-Item -ItemType Directory -Path $codexSkillRoot -Force | Out-Null

foreach ($skillName in $sharedSkills) {
  $sourcePath = Join-Path $sourceRoot $skillName
  $targetPath = Join-Path $codexSkillRoot $skillName

  if (-not (Test-Path $sourcePath)) {
    throw "Skill nicht gefunden: $sourcePath"
  }

  if (Test-Path $targetPath) {
    Remove-Item $targetPath -Recurse -Force
  }

  Copy-Item $sourcePath $targetPath -Recurse -Force
  Write-Host "Synchronisiert: $skillName -> $targetPath"
}

Write-Host 'Codex-Skills aus dem Repo wurden synchronisiert.'
Write-Host 'Restart Codex to pick up new skills.'
