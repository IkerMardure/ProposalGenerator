# Script sencillo para añadir variables de entorno a .env.local
Param()

$envFile = Join-Path -Path (Get-Location) -ChildPath ".env.local"
if (-not (Test-Path $envFile)) {
    "# .env.local - variables de entorno para desarrollo" | Out-File -FilePath $envFile -Encoding utf8
}

function Set-EnvVar([string]$key, [string]$value) {
    $content = Get-Content $envFile -Raw
    if ($content -match "^$key=") {
        $content = $content -replace "(?m)^$key=.*","$key=$value"
    } else {
        $content = $content + "`n$key=$value"
    }
    $content | Out-File -FilePath $envFile -Encoding utf8
}

Write-Host "Agregar STRIPE_WEBHOOK_SECRET (deja vacío para omitir):"
$wh = Read-Host
if ($wh -ne "") { Set-EnvVar -key 'STRIPE_WEBHOOK_SECRET' -value $wh; Write-Host "STRIPE_WEBHOOK_SECRET guardado en .env.local" }

Write-Host "Agregar STRIPE_SECRET_KEY (sk_...) — servidor (deja vacío para omitir):"
$sk = Read-Host
if ($sk -ne "") { Set-EnvVar -key 'STRIPE_SECRET_KEY' -value $sk; Write-Host "STRIPE_SECRET_KEY guardado en .env.local" }

Write-Host "Agregar OPENAI_API_KEY (deja vacío para omitir):"
$oa = Read-Host
if ($oa -ne "") { Set-EnvVar -key 'OPENAI_API_KEY' -value $oa; Write-Host "OPENAI_API_KEY guardado en .env.local" }

Write-Host "Hecho. Revisa .env.local y no lo subas a git."
