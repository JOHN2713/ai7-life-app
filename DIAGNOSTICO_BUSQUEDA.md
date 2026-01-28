# 🔧 DIAGNÓSTICO: Sistema de Búsqueda de Amigos

## Cambios Realizados

He agregado logs de debugging extensivos en:
1. ✅ FriendsScreen.js - Para ver qué pasa en el frontend
2. ✅ api.js - Para ver las peticiones HTTP
3. ✅ server.js - Para ver las peticiones que llegan al backend
4. ✅ friendsController.js - Para ver la ejecución de la búsqueda

## Pasos para Diagnosticar

### 1. Reiniciar el Backend
```bash
cd backend
# Detener el proceso actual (Ctrl+C)
npm start
```

### 2. Recargar la App
- En el dispositivo/emulador, sacude el dispositivo o presiona Ctrl+M (Android) / Cmd+D (iOS)
- Selecciona "Reload"
- O simplemente reinicia la app

### 3. Realizar una Búsqueda
- Ve a la pestaña "Buscar" en Amigos
- Escribe "Juan" o cualquier nombre
- **Observa los logs en dos lugares:**

#### A) Logs del Metro Bundler (Terminal donde ejecutaste npm start)
Deberías ver algo como:
```
🔍 Buscando usuarios con término: Juan
🌐 API: Buscando usuarios con término: Juan
🔗 API URL: http://192.168.1.214:3000/api
📥 API: Respuesta recibida: { success: true, users: [...] }
✅ Usuarios encontrados: 1
```

#### B) Logs del Backend (Terminal donde está el servidor)
Deberías ver algo como:
```
📥 GET /api/friends/search - 2026-01-27T...
   Query: { search: 'Juan' }
🔍 [Friends Controller] Búsqueda de usuarios
   Usuario que busca: d39bb205-81fa-40cd-96f1-a924978ce142
   Término de búsqueda: Juan
   ✅ Usuarios encontrados: 1
      - Juan (diseno@perseo.ec) - none
```

## Problemas Comunes y Soluciones

### ❌ Error: "Error de conexión"
**Causa:** La app no puede conectarse al backend
**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica que tu dispositivo y PC estén en el mismo WiFi
3. Verifica que la IP en apiConfig.js sea: 192.168.1.214

### ❌ Error: "401 Unauthorized"
**Causa:** Token inválido o expirado
**Solución:**
1. Cierra sesión en la app
2. Vuelve a iniciar sesión

### ❌ No aparecen logs de API en Metro Bundler
**Causa:** React Native no está mostrando los console.logs
**Solución:**
1. En el dispositivo: Sacude → Debug → Enable Remote JS Debugging
2. Abre Chrome DevTools (http://localhost:8081/debugger-ui/)
3. Los logs aparecerán en la consola de Chrome

### ❌ Aparecen logs pero dice "0 usuarios encontrados"
**Causa:** El usuario está buscándose a sí mismo o no hay usuarios con ese nombre
**Solución:**
- Verifica qué usuario está logueado
- Prueba con otros nombres: "Admin", "Johny", "Juan"

## Configuración de API según Dispositivo

En: `src/services/apiConfig.js`

```javascript
// DISPOSITIVO FÍSICO (Expo Go en teléfono):
export const API_URL = 'http://192.168.1.214:3000/api';

// ANDROID EMULATOR:
export const API_URL = 'http://10.0.2.2:3000/api';

// iOS SIMULATOR o WEB:
export const API_URL = 'http://localhost:3000/api';
```

## Próximos Pasos

1. **Reinicia el backend** para aplicar los nuevos logs
2. **Recarga la app**
3. **Intenta buscar** "Juan"
4. **Copia los logs** que veas (tanto del Metro Bundler como del backend)
5. **Compártelos conmigo** para poder diagnosticar el problema exacto

---

## Usuarios Disponibles para Buscar

- **Admin User** - admin@ai7life.com
- **Johny** - johnyv1305@gmail.com
- **Juan** - diseno@perseo.ec

(No puedes buscar el usuario con el que estás logueado)
