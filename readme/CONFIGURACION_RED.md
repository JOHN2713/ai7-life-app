# 🌐 Configuración de Red - AI7 Life App

Este documento explica cómo configurar la URL del API según dónde estés ejecutando la app.

## 📍 Ubicación del archivo a modificar

**Archivo:** `src/services/api.js`

**Línea a modificar:**
```javascript
const API_URL = 'http://localhost:3000/api';
```

---

## 🖥️ Configuraciones según dispositivo

### 1. **Navegador Web (Expo Web)**
```javascript
const API_URL = 'http://localhost:3000/api';
```
✅ Funciona directamente porque el navegador corre en la misma máquina que el backend.

---

### 2. **iOS Simulator (Mac)**
```javascript
const API_URL = 'http://localhost:3000/api';
```
✅ El simulador de iOS usa la red del host, así que `localhost` funciona.

---

### 3. **Android Emulator (AVD)**
```javascript
const API_URL = 'http://10.0.2.2:3000/api';
```
⚠️ **Importante:** Android Emulator no puede usar `localhost`. `10.0.2.2` es la IP especial que redirige al localhost del host.

**¿Por qué?** En Android Emulator:
- `localhost` = el emulador mismo
- `10.0.2.2` = la máquina host (tu PC)

---

### 4. **Dispositivo Físico (Teléfono/Tablet via WiFi)**

#### Paso 1: Obtener tu IP local

**Windows:**
```powershell
ipconfig
```
Busca "Adaptador de LAN inalámbrica Wi-Fi" → "Dirección IPv4"

**Ejemplo:** `192.168.1.100`

#### Paso 2: Configurar la URL
```javascript
const API_URL = 'http://192.168.1.100:3000/api';
```

#### Paso 3: Asegúrate de estar en la misma red WiFi
- Tu PC y tu teléfono deben estar conectados al **mismo WiFi**
- Algunos routers pueden bloquear la comunicación entre dispositivos. Si no funciona, revisa la configuración del router (busca "AP Isolation" y desactívala)

---

## 🔧 Configuración Avanzada - Múltiples Entornos

Si quieres soportar múltiples entornos automáticamente:

### Opción 1: Detectar plataforma

```javascript
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiUrl = () => {
  // Si es web, usa localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  
  // Si es Android Emulator
  if (Platform.OS === 'android' && Constants.isDevice === false) {
    return 'http://10.0.2.2:3000/api';
  }
  
  // Si es iOS Simulator
  if (Platform.OS === 'ios' && Constants.isDevice === false) {
    return 'http://localhost:3000/api';
  }
  
  // Si es dispositivo físico, usa tu IP local
  return 'http://192.168.1.100:3000/api'; // CAMBIAR POR TU IP
};

const API_URL = getApiUrl();
```

### Opción 2: Variables de entorno (Recomendado)

**1. Instalar expo-constants si no está:**
```bash
npx expo install expo-constants
```

**2. Crear archivo `.env` en la raíz:**
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

**3. Usar en `api.js`:**
```javascript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
```

**4. Configurar `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL
    }
  }
}
```

---

## 🧪 Probar la conexión

### Método 1: Desde tu navegador
Abre: http://localhost:3000/health

Deberías ver:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Método 2: Desde terminal
```powershell
curl http://localhost:3000/health
```

### Método 3: Desde dispositivo físico
Abre en el navegador del teléfono: `http://TU_IP:3000/health`

Por ejemplo: http://192.168.1.100:3000/health

---

## ⚠️ Problemas Comunes

### "Network request failed"

**Causa:** La app no puede conectar con el backend.

**Soluciones:**

1. **Verifica que el backend esté corriendo:**
   ```powershell
   # En la terminal del backend deberías ver:
   🚀 Servidor corriendo en http://localhost:3000
   ```

2. **Verifica la URL en `api.js` según tu dispositivo:**
   - Web/iOS Simulator: `http://localhost:3000/api`
   - Android Emulator: `http://10.0.2.2:3000/api`
   - Dispositivo físico: `http://TU_IP:3000/api`

3. **Firewall de Windows:**
   - Asegúrate de que Node.js tenga permiso en el firewall
   - Ve a: Panel de Control → Firewall de Windows → Permitir aplicaciones

4. **Mismo WiFi:**
   - Verifica que PC y teléfono estén en la misma red WiFi

### "Connection timeout"

1. Verifica que no haya otros servicios usando el puerto 3000:
   ```powershell
   netstat -ano | findstr :3000
   ```

2. Si el puerto está ocupado, cambia el puerto en `backend/.env`:
   ```env
   PORT=3001
   ```
   
   Y actualiza `api.js`:
   ```javascript
   const API_URL = 'http://localhost:3001/api';
   ```

### "CORS error"

El backend ya está configurado para CORS, pero si tienes problemas, verifica `backend/server.js`:

```javascript
app.use(cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  credentials: true
}));
```

---

## 🎯 Configuración Recomendada por Escenario

| Escenario | URL a usar | Notas |
|-----------|------------|-------|
| Desarrollo local en web | `http://localhost:3000/api` | Default, funciona directo |
| iOS Simulator | `http://localhost:3000/api` | Usa red del host |
| Android Emulator | `http://10.0.2.2:3000/api` | IP especial para host |
| Dispositivo en WiFi | `http://192.168.1.X:3000/api` | Cambiar X por tu IP |
| Producción | `https://tudominio.com/api` | Requiere servidor cloud |

---

## 📚 Recursos Adicionales

- [Expo Network Debugging](https://docs.expo.dev/guides/troubleshooting-networking/)
- [React Native Networking](https://reactnative.dev/docs/network)
- [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking)

---

## 💡 Tips

1. **Durante desarrollo:** Usa tu IP local en lugar de localhost para que funcione en todos los dispositivos
2. **Antes de hacer commit:** No hagas commit de tu IP local, déjala como localhost
3. **Para testing:** Usa el script `backend/test-api.ps1` para verificar que el API funciona
4. **Expo Go:** Asegúrate de que tu PC y tu teléfono estén en la misma red WiFi
