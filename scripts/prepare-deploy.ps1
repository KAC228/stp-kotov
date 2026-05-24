# Сборка статического сайта для выгрузки на reg.ru
# Запуск из папки ksd-site:  powershell -ExecutionPolicy Bypass -File .\scripts\prepare-deploy.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "=== Сборка Next.js (output: export) ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$out = Join-Path $root "out"
if (-not (Test-Path $out)) {
  Write-Error "Папка out не найдена после сборки."
}

$required = @("index.html", "send.php", "_next", "404.html", "partnership.html")
foreach ($name in $required) {
  if (-not (Test-Path (Join-Path $out $name))) {
    Write-Warning "Нет ожидаемого файла/папки: $name"
  }
}

$zip = Join-Path $root ("deploy-" + (Get-Date -Format "yyyy-MM-dd_HH-mm") + ".zip")
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $out "*") -DestinationPath $zip -CompressionLevel Optimal

Write-Host ""
Write-Host "Готово." -ForegroundColor Green
Write-Host "  Файлы для FTP:  $out"
Write-Host "  Архив (опц.):   $zip"
Write-Host ""
Write-Host "На хостинг заливайте СОДЕРЖИМОЕ папки out (не саму папку out)." -ForegroundColor Yellow
Write-Host "Подробно: DEPLOY-REG.RU.md"
