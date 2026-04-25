# Quick Database Fix Script
# This script will recreate the database with the correct schema

Write-Host "=== URL Shortener Database Fix ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop backend
Write-Host "Step 1: Stopping backend..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
if ($javaProcesses) {
    $javaProcesses | Stop-Process -Force
    Write-Host "✅ Backend stopped" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "⚠️  No backend process found (already stopped)" -ForegroundColor Yellow
}

# Step 2: Drop and recreate database
Write-Host ""
Write-Host "Step 2: Recreating database..." -ForegroundColor Yellow
Write-Host "Running: DROP DATABASE IF EXISTS urlshortener;" -ForegroundColor Gray

$env:PGPASSWORD = "password"
& psql -U postgres -c "DROP DATABASE IF EXISTS urlshortener;" 2>&1 | Out-Null
& psql -U postgres -c "CREATE DATABASE urlshortener;" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database recreated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to recreate database" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is running and credentials are correct" -ForegroundColor Yellow
    Write-Host "Default: username=postgres, password=password, port=5432" -ForegroundColor Gray
    exit 1
}

# Step 3: Start backend
Write-Host ""
Write-Host "Step 3: Starting backend..." -ForegroundColor Yellow
Write-Host "This will take 10-15 seconds..." -ForegroundColor Gray

Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "mvnw.cmd spring-boot:run" -WindowStyle Minimized

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Step 4: Verify
Write-Host ""
Write-Host "Step 4: Verifying backend..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend might still be starting..." -ForegroundColor Yellow
    Write-Host "Wait a few more seconds and check: http://localhost:8080/actuator/health" -ForegroundColor Gray
}

# Step 5: Instructions
Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Open: http://localhost:5173/register" -ForegroundColor White
Write-Host "2. Register with:" -ForegroundColor White
Write-Host "   - Username: testuser" -ForegroundColor Gray
Write-Host "   - Email: test@example.com" -ForegroundColor Gray
Write-Host "   - Password: password123" -ForegroundColor Gray
Write-Host "3. Try login with email: test@example.com" -ForegroundColor White
Write-Host "4. Try forgot password with email" -ForegroundColor White
Write-Host ""
Write-Host "✅ Database fix complete!" -ForegroundColor Green
Write-Host ""
