# Test Email Functionality

Write-Host "=== Testing Email Service ===" -ForegroundColor Cyan

# Test 1: Register a new user (should send welcome email)
Write-Host "`n1. Testing Registration (Welcome Email)..." -ForegroundColor Yellow
$username = "emailtest$(Get-Random -Maximum 99999)"
$registerBody = @{
    username = $username
    email = "anushchinnasamy@gmail.com"
    password = "Test@1234"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  Username: $username"
    Write-Host "  Check your email for welcome message"
} catch {
    Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Forgot Password (should send reset email)
Write-Host "`n2. Testing Forgot Password (Reset Email)..." -ForegroundColor Yellow
$forgotBody = @{
    email = "anushchinnasamy@gmail.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/auth/forgot-password" -Method Post -Body $forgotBody -ContentType "application/json"
    Write-Host "✓ Forgot password request successful!" -ForegroundColor Green
    Write-Host "  Check your email for password reset link"
} catch {
    Write-Host "✗ Forgot password failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "Check your inbox at: anushchinnasamy@gmail.com" -ForegroundColor White
