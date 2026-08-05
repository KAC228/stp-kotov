# Build static site for reg.ru upload
# From ksd-site: powershell -ExecutionPolicy Bypass -File .\scripts\prepare-deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "=== Next.js build (output: export) ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$out = Join-Path $root "out"
if (-not (Test-Path $out)) {
  Write-Error "Folder 'out' not found after build."
}

$required = @(
  "index.html",
  "send.php",
  "send.config.php.example",
  "pay.php",
  "pay-status.php",
  "tbank-notify.php",
  "pay.config.php.example",
  "lib/tbank.php",
  "data/catalog-prices.json",
  "images/og-image.jpg",
  "images/partners/formfactor.svg",
  "images/partners/fliben.svg",
  "_next",
  "404.html",
  "partnership.html",
  "our-partners.html"
)

foreach ($name in $required) {
  $path = Join-Path $out $name
  if (-not (Test-Path $path)) {
    Write-Warning "Missing: $name"
  }
}

foreach ($secretName in @("send.config.php", "pay.config.php")) {
  $configInOut = Join-Path $out $secretName
  if (Test-Path $configInOut) {
    Remove-Item $configInOut -Force
    Write-Host "Removed $secretName from out (secrets stay off the zip)." -ForegroundColor Yellow
  }
}

$stamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$zip = Join-Path $root ("deploy-" + $stamp + ".zip")
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $out "*") -DestinationPath $zip -CompressionLevel Optimal

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "  FTP files:  $out"
Write-Host "  Zip:        $zip"
Write-Host ""
Write-Host "Upload CONTENTS of out/ to hosting root (not the out folder itself)." -ForegroundColor Yellow
Write-Host "See DEPLOY-REG.RU.md"
