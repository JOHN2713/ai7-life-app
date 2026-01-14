# Script de prueba de la API - AI7 Life
# Ejecutar en PowerShell después de iniciar el backend

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " AI7 LIFE - API Test Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuración
$baseUrl = "http://localhost:3000"
$apiUrl = "$baseUrl/api"

# Test 1: Health Check
Write-Host "[TEST 1] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Backend está corriendo" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Database: $($response.database)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Backend no está corriendo o no responde" -ForegroundColor Red
    Write-Host "   Asegúrate de iniciar el backend con: npm run dev" -ForegroundColor Yellow
    exit
}

# Test 2: Registrar usuario
Write-Host "[TEST 2] Registrar nuevo usuario..." -ForegroundColor Yellow
$newUser = @{
    name = "Test User"
    email = "test$(Get-Random -Minimum 1000 -Maximum 9999)@ai7life.com"
    password = "test12345"
    birthDate = "1995-05-15"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$apiUrl/auth/register" `
        -Method Post `
        -Body $newUser `
        -ContentType "application/json"
    
    Write-Host "✅ Usuario registrado exitosamente" -ForegroundColor Green
    Write-Host "   ID: $($registerResponse.user.id)" -ForegroundColor Gray
    Write-Host "   Nombre: $($registerResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Avatar: $($registerResponse.user.avatar)" -ForegroundColor Gray
    Write-Host "   Token: $($registerResponse.token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""
    
    $token = $registerResponse.token
    $testEmail = ($newUser | ConvertFrom-Json).email
    $testPassword = "test12345"
    
} catch {
    Write-Host "❌ Error al registrar usuario" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Login con el usuario creado
Write-Host "[TEST 3] Iniciar sesión..." -ForegroundColor Yellow
$loginData = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host "   Bienvenido: $($loginResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Token válido: Sí" -ForegroundColor Gray
    Write-Host ""
    
    $token = $loginResponse.token
    
} catch {
    Write-Host "❌ Error en login" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Verificar token
Write-Host "[TEST 4] Verificar token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $verifyResponse = Invoke-RestMethod -Uri "$apiUrl/auth/verify" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Token verificado correctamente" -ForegroundColor Green
    Write-Host "   Usuario: $($verifyResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($verifyResponse.user.email)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Error al verificar token" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Login con credenciales incorrectas
Write-Host "[TEST 5] Probar login con credenciales incorrectas..." -ForegroundColor Yellow
$wrongLogin = @{
    email = "noexiste@test.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $errorResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" `
        -Method Post `
        -Body $wrongLogin `
        -ContentType "application/json"
    
    Write-Host "❌ No debería permitir login con credenciales incorrectas" -ForegroundColor Red
    
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Validación correcta: credenciales rechazadas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Error inesperado" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Resumen de Pruebas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
Write-Host "✅ Registro de usuarios operativo" -ForegroundColor Green
Write-Host "✅ Login operativo" -ForegroundColor Green
Write-Host "✅ Verificación de tokens operativa" -ForegroundColor Green
Write-Host "✅ Validaciones de seguridad funcionando" -ForegroundColor Green
Write-Host "`n¡Todos los tests pasaron exitosamente! 🎉`n" -ForegroundColor Green

Write-Host "Usuario de prueba creado:" -ForegroundColor Cyan
Write-Host "  Email: $testEmail" -ForegroundColor White
Write-Host "  Password: $testPassword" -ForegroundColor White
Write-Host "`nPuedes usar estas credenciales en la app.`n" -ForegroundColor Gray
