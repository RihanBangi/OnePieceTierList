Write-Host "====================================="
Write-Host " OnePieceTierList Deployment Script"
Write-Host "====================================="

Write-Host ""
Write-Host "1. Restoring API packages..."

dotnet restore ".\OnePieceTierList.API\OnePieceTierList.API.csproj"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Restore failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Building API..."

dotnet build ".\OnePieceTierList.API\OnePieceTierList.API.csproj" `
    --configuration Release `
    --no-restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3. Building React application..."

Set-Location ".\OnePieceTierList.Client"

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed!" -ForegroundColor Red
    exit 1
}

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "React build failed!" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "====================================="
Write-Host " Deployment checks completed!"
Write-Host "====================================="