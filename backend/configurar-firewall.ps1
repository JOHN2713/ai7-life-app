# Script para permitir el puerto 3000 en el Firewall de Windows
# Ejecutar como Administrador (Click derecho → Ejecutar como administrador)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AI7 LIFE - Configurar Firewall" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    New-NetFirewallRule -DisplayName "Node.js AI7 Life Backend" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 3000 `
        -Profile Any `
        -ErrorAction Stop
    
    Write-Host "✅ Regla de firewall creada exitosamente" -ForegroundColor Green
    Write-Host "   El puerto 3000 ahora acepta conexiones externas`n" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "✅ La regla de firewall ya existe" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error al crear la regla:" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)`n" -ForegroundColor Red
        Write-Host "⚠️  Puedes configurarlo manualmente:" -ForegroundColor Yellow
        Write-Host "   1. Busca 'Firewall de Windows Defender' en el menú inicio" -ForegroundColor Gray
        Write-Host "   2. Configuración avanzada → Reglas de entrada → Nueva regla" -ForegroundColor Gray
        Write-Host "   3. Puerto TCP 3000 → Permitir conexión`n" -ForegroundColor Gray
    }
}

Write-Host "Presiona cualquier tecla para cerrar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
