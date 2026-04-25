# Test Email with Debug Output

Write-Host "=== Testing Email Service with Debug Logging ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Register a new user
$random = Get-Random -Maximum 999999
$username = "testuser$random"
$email = "anushchinnasamy@gmail.com"

Write-Host "Test 1: Registration (Welcome Email)" -ForegroundColor Yellow
Write-Host "Username: $username"
Write-Host "Email: $email"
Write-Host ""

$body = "{`"username`":`"$username`",`"email`":`"$email`",`"password`":`"Test@1234`"}"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)"
    Write-Host "  Response: $($response.Content)"
} catch {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Error: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "Waiting 3 seconds for email to be sent..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Test 2: Forgot Password (Reset Email)" -ForegroundColor Yellow
Write-Host "Email: $email"
Write-Host ""

$body2 = "{`"email`":`"$email`"}"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/forgot-password" -Method Post -Body $body2 -ContentType "application/json" -UseBasicParsing
    Write-Host "✓ Forgot password successful!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)"
    Write-Host "  Response: $($response.Content)"
} catch {
    Write-Host "✗ Forgot password failed" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "  Error: $($reader.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "=== Check Backend Logs for Email Debug Info ===" -ForegroundColor Cyan
Write-Host "Look for lines containing:" -ForegroundColor White
Write-Host "  - 'EMAIL SERVICE: sendWelcomeEmail called'"
Write-Host "  - 'EMAIL SERVICE: sendPasswordResetEmail called'"
Write-Host "  - 'Email enabled: true'"
Write-Host "  - 'Sending email via SMTP...'"
Write-Host "  - '✅ Email sent successfully'"
Write-Host "  - '❌ Failed to send email' (if there's an error)"
Write-Host ""
Write-Host "Check your Gmail inbox: $email" -ForegroundColor Yellow
