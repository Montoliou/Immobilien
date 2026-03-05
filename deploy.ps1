param(
  [switch]$SkipBuild,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$args = @()
if ($SkipBuild) { $args += "--skip-build" }
if ($DryRun) { $args += "--dry-run" }

python ".\\scripts\\deploy_yorkliving.py" @args
