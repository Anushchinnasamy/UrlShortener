$body = '{"username":"testuser999","email":"test@example.com","password":"Test@1234"}'

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Success: $($response.StatusCode)"
    Write-Host $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Response: $errorBody"
    }
}
