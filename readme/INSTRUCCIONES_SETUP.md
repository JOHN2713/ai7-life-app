# 🚀 Guía de Instalación y Configuración - AI7 Life App

## 📦 1. INSTALACIÓN COMPLETA

### Backend y Frontend
Las dependencias ya están instaladas. Si necesitas reinstalar:

```powershell
# Frontend
cd "c:\Users\USUARIO\Desktop\AI7 LIFE\ai7-life-app"
npm install

# Backend
cd backend
npm install
```

---

## 🗄️ 2. CONFIGURAR LA BASE DE DATOS POSTGRESQL

### Opción A: Usar psql (Recomendado)

```powershell
# 1. Crear la base de datos
psql -U postgres -c "CREATE DATABASE useri7_db;"

# 2. Ejecutar el script de inicialización
cd "c:\Users\USUARIO\Desktop\AI7 LIFE\ai7-life-app\backend"
psql -U postgres -d useri7_db -f database/schema.sql
```

### Opción B: Usar pgAdmin (Interfaz Gráfica)

1. Abre **pgAdmin 4**
2. Conéctate a tu servidor PostgreSQL (localhost)
3. Clic derecho en "Databases" → "Create" → "Database"
4. Nombre: `useri7_db`
5. Owner: `postgres`
6. Guardar
7. Clic derecho en `useri7_db` → "Query Tool"
8. Abre el archivo `backend/database/schema.sql`
9. Copia todo el contenido y pégalo en Query Tool
10. Presiona F5 o clic en "Execute"

### Opción C: Usar DBeaver (Alternativa)

1. Abre **DBeaver**
2. Conéctate a PostgreSQL
3. Clic derecho en "Databases" → "Create New Database"
4. Nombre: `useri7_db`
5. Abre SQL Editor (SQL Editor → New SQL Script)
6. Copia el contenido de `backend/database/schema.sql`
7. Ejecuta el script (Ctrl+Enter)

### Verificar la creación

```powershell
psql -U postgres -d useri7_db -c "SELECT * FROM users;"
```

---

## 🚀 3. INICIAR LA APLICACIÓN

### Paso 1: Iniciar el Backend

```powershell
# Abrir una terminal en VSCode (Terminal → New Terminal)
cd "c:\Users\USUARIO\Desktop\AI7 LIFE\ai7-life-app\backend"
npm run dev
```

**Deberías ver:**
```
✅ Conectado a PostgreSQL
⏰ Hora del servidor: ...
🚀 Servidor corriendo en http://localhost:3000
📊 Environment: development
🗄️  Database: useri7_db
```

### Paso 2: Iniciar el Frontend (en otra terminal)

```powershell
# Abrir OTRA terminal (Terminal → New Terminal)
cd "c:\Users\USUARIO\Desktop\AI7 LIFE\ai7-life-app"
npm start
```

Opciones:
- Presiona `a` para abrir en Android
- Presiona `i` para abrir en iOS
- Presiona `w` para abrir en web
- Escanea el QR con Expo Go app

---

## 🧪 4. PROBAR LA APLICACIÓN

### Crear un nuevo usuario

1. Abre la app
2. Ve a "Registro"
3. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Email**: tu@email.com
   - **Password**: mínimo 8 caracteres
   - **Fecha de Nacimiento**: 1990-01-15 (opcional)
   - Acepta términos
4. Presiona "Confirmar"

### Iniciar sesión

1. Ve a "Login"
2. Ingresa:
   - **Email**: el email que registraste
   - **Password**: tu contraseña
3. Presiona "Login"

---

## 🔧 5. TROUBLESHOOTING

### ❌ Error: "Cannot connect to PostgreSQL"

**Solución 1:** Verificar que PostgreSQL esté corriendo
```powershell
# Ver estado del servicio
sc query postgresql-x64-14

# Iniciar el servicio
net start postgresql-x64-14
```

**Solución 2:** Verificar credenciales en `backend/.env`
```env
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=useri7_db
DB_HOST=localhost
DB_PORT=5432
```

### ❌ Error: "Port 3000 already in use"

Cambiar el puerto en `backend/.env`:
```env
PORT=3001
```

Y actualizar `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### ❌ Error: "Network request failed" en la app

**Causa:** El frontend no puede conectarse al backend.

**Soluciones:**

1. **Si usas Android emulator:**
   ```javascript
   // En src/services/api.js
   const API_URL = 'http://10.0.2.2:3000/api';
   ```

2. **Si usas Expo Go en tu teléfono:**
   ```powershell
   # Obtener tu IP local
   ipconfig
   # Busca "IPv4 Address" en tu red WiFi (ej: 192.168.1.100)
   ```
   
   ```javascript
   // En src/services/api.js
   const API_URL = 'http://192.168.1.100:3000/api';
   ```

3. **Verificar que el backend esté corriendo:**
   - Abre http://localhost:3000 en tu navegador
   - Deberías ver: `{"message":"🚀 AI7 Life API Server"...}`

### ❌ Error: "relation 'users' does not exist"

La base de datos no está inicializada correctamente.

```powershell
# Volver a ejecutar el script
cd backend
psql -U postgres -d useri7_db -f database/schema.sql
```

---

## 📱 6. CONFIGURACIÓN PARA DIFERENTES DISPOSITIVOS

### Android Emulator
```javascript
// src/services/api.js
const API_URL = 'http://10.0.2.2:3000/api';
```

### iOS Simulator
```javascript
// src/services/api.js
const API_URL = 'http://localhost:3000/api';
```

### Dispositivo Físico (WiFi)
```javascript
// src/services/api.js
const API_URL = 'http://TU_IP_LOCAL:3000/api';
// Ejemplo: 'http://192.168.1.100:3000/api'
```

Para obtener tu IP:
```powershell
ipconfig
```
Busca "IPv4 Address" en la sección de tu adaptador WiFi.

---

## 🎯 7. VERIFICACIÓN RÁPIDA

### Test del Backend
```powershell
# Health check
curl http://localhost:3000/health

# Debería responder:
# {"status":"ok","database":"connected","timestamp":"..."}
```

### Test de Registro (con curl)
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\"}'
```

### Test de Login (con curl)
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"password123\"}'
```

---

## 📊 8. ESTRUCTURA DE LA BASE DE DATOS

La tabla `users` tiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único generado automáticamente |
| name | VARCHAR(255) | Nombre completo del usuario |
| email | VARCHAR(255) | Email único del usuario |
| password_hash | VARCHAR(255) | Contraseña encriptada con bcrypt |
| birth_date | DATE | Fecha de nacimiento (opcional) |
| avatar_url | VARCHAR(500) | URL del avatar (generado automáticamente) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

## 🎨 9. AVATARES

Los avatares se generan automáticamente usando la API de DiceBear:
- URL: `https://api.dicebear.com/7.x/avataaars/svg?seed={email}`
- Cada usuario tiene un avatar único basado en su email
- No requiere configuración adicional

---

## 📝 10. COMANDOS ÚTILES

```powershell
# Ver todos los usuarios registrados
psql -U postgres -d useri7_db -c "SELECT id, name, email, created_at FROM users;"

# Borrar todos los usuarios (reiniciar)
psql -U postgres -d useri7_db -c "DELETE FROM users;"

# Ver logs del backend en tiempo real
cd backend
npm run dev

# Reiniciar expo cache
cd ..
npx expo start -c
```

---

## ✅ TODO LISTO!

Si todo está configurado correctamente:
1. ✅ Backend corriendo en http://localhost:3000
2. ✅ Base de datos PostgreSQL conectada
3. ✅ Frontend corriendo en Expo
4. ✅ Puedes registrar usuarios y hacer login

**¡Ahora puedes usar la aplicación!** 🎉
