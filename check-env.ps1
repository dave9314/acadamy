
# Check if .env file has required variables
if (Test-Path .env) {
    Write-Host "✅ .env file exists"
    $env_content = Get-Content .env -Raw
    if ($env_content -match "DATABASE_URL") { Write-Host "✅ DATABASE_URL configured" }
    if ($env_content -match "NEXTAUTH_SECRET") { Write-Host "✅ NEXTAUTH_SECRET configured" }
    if ($env_content -match "NEXTAUTH_URL") { Write-Host "✅ NEXTAUTH_URL configured" }
} else {
    Write-Host "❌ .env file missing"
}
