<#
Preview and optionally remove legacy files listed in ../legacy_removal_candidates.txt

Usage:
  # Preview only (default)
  pwsh ./scripts/legacy_removal_preview.ps1

  # Actually remove (DANGEROUS) - only run after CI pass and review
  pwsh ./scripts/legacy_removal_preview.ps1 -Remove
#>

param(
  [switch]$Remove
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$list = Join-Path $root "..\legacy_removal_candidates.txt"

if (-not (Test-Path $list)) {
  Write-Error "Candidate list not found: $list"
  exit 2
}

$files = Get-Content $list | Where-Object { $_ -and -not ($_ -match '^\s*//') }

Write-Host "Legacy removal preview: ${files.Count} entries"

foreach ($f in $files) {
  if (Test-Path $f) {
    Write-Host "[FOUND] $f"
  } else {
    Write-Host "[MISSING] $f"
  }
}

if ($Remove) {
  Write-Host "\nRemoving files..."
  foreach ($f in $files) {
    if (Test-Path $f) {
      Remove-Item -LiteralPath $f -Force
      Write-Host "Removed: $f"
    } else {
      Write-Host "Skipped (missing): $f"
    }
  }
  Write-Host "Removal complete. Commit changes and run CI before merging." 
} else {
  Write-Host "\nRun with -Remove to actually delete files (only after CI verification)."
}
