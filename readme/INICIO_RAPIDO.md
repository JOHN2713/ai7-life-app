# 🚀 Inicio Rápido - AI7 Life App

## ⚡ Setup en 3 pasos

### 1️⃣ Crear la Base de Datos

**Opción A - Script automático (Windows):**
```powershell
cd backend
.\setup-database.bat
```

**Opción B - Comando manual:**
```powershell
# Crear base de datos
psql -U postgres -c "CREATE DATABASE useri7_db;"

# Inicializar tablas
cd backend
psql -U postgres -d useri7_db -f database/schema.sql
```

### 2️⃣ Iniciar el Backend

```powershell
# En una terminal
cd backend
npm run dev
```

✅ Deberías ver: `🚀 Servidor corriendo en http://localhost:3000`

### 3️⃣ Iniciar la App

```powershell
# En OTRA terminal
npm start
```

Luego presiona `a` (Android), `i` (iOS) o `w` (Web)

---

## 🎯 Credenciales de Prueba

Puedes crear un usuario nuevo o usar el backend directamente.

### Crear Usuario de Prueba:

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Usuario Test\",\"email\":\"test@ai7life.com\",\"password\":\"test12345\",\"birthDate\":\"1995-05-15\"}'
```

### Login:
- **Email:** test@ai7life.com
- **Password:** test12345

---

## 🔧 Troubleshooting Rápido

### Backend no conecta a la base de datos

```powershell
# Verificar que PostgreSQL esté corriendo
sc query postgresql-x64-14

# Iniciarlo si no está corriendo
net start postgresql-x64-14
```

### Frontend no conecta con el backend

**Para Android Emulator:**
Edita `src/services/api.js`:
```javascript
const API_URL = 'http://10.0.2.2:3000/api';
```

**Para dispositivo físico (mismo WiFi):**
```powershell
# Obtener tu IP
ipconfig
# Busca "IPv4 Address" (ej: 192.168.1.100)
```

Edita `src/services/api.js`:
```javascript
const API_URL = 'http://192.168.1.100:3000/api';
```

### Ver usuarios registrados

```powershell
psql -U postgres -d useri7_db -c "SELECT name, email, created_at FROM users;"
```

---

## 📱 Características Implementadas

✅ Registro de usuarios con:
- Nombre
- Email único
- Contraseña (mínimo 8 caracteres, encriptada)
- Fecha de nacimiento (opcional)
- Avatar automático generado por DiceBear

✅ Login con JWT
✅ Validación de datos
✅ Base de datos PostgreSQL
✅ API REST completa

---

## 📚 Documentación Completa

Ver [INSTRUCCIONES_SETUP.md](INSTRUCCIONES_SETUP.md) para guía detallada.

Ver [backend/README.md](backend/README.md) para documentación del API.
