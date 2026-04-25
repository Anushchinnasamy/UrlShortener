# Final Email Test

Write-Host "=== Backend Email Service Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Register with unique email
Write-Host "Test 1: Registration (Welcome Email)" -ForegroundColor Yellow
$random = Get-Random -Maximum 999999
$body = "{`"username`":`"user$random`",`"email`":`"anushchinnasamy+test$random@gmail.com`",`"password`":`"Test@1234`"}"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)"
    Write-Host "  Response: $($response.Content)"
    Write-Host "  Check email: anushchinnasamy+test$random@gmail.com" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Error: $($reader.ReadToEnd())"
    }
}

Write-Host ""

# Test 2: Forgot Password
Write-Host "Test 2: Forgot Password (Reset Email)" -ForegroundColor Yellow
$body2 = '{"email":"anushchinnasamy@gmail.com"}'

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/forgot-password" -Method Post -Body $body2 -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Forgot password successful!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)"
    Write-Host "  Response: $($response.Content)"
    Write-Host "  Check email: anushchinnasamy@gmail.com" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Forgot password failed" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Error: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host "Check your Gmail inbox for:" -ForegroundColor White
Write-Host "  1. Welcome email (if registration succeeded)"
Write-Host "  2. Password reset email"
