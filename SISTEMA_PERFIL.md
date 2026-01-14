# 👤 Sistema de Perfil - Documentación

## ✅ Implementación Completada

Sistema completo de perfil de usuario con selector de avatares usando la API de DiceBear.

---

## 🎨 Características

### 📱 **ProfileScreen**
- Muestra avatar actual del usuario
- Información del usuario (nombre, email)
- Menú de opciones
- Botón de cerrar sesión
- Al hacer clic en la tarjeta de usuario, navega a EditProfileScreen

### ✏️ **EditProfileScreen**
- Vista previa del avatar actual
- Información completa del usuario:
  - Nombre
  - Email
  - Fecha de nacimiento
- **Selector de estilos de avatar** (9 opciones):
  - avataaars
  - bottts
  - fun-emoji
  - lorelei
  - micah
  - miniavs
  - notionists
  - personas
  - pixel-art
- **Variaciones del avatar**: 6 variaciones diferentes por estilo
- Botón para guardar el avatar seleccionado

---

## 🔄 Flujo de Uso

```
┌─────────────────┐
│  ProfileScreen  │
│                 │
│  [Avatar]       │
│  Nombre         │
│  Email          │
│                 │
│  [Clic aquí] ──────┐
└─────────────────┘  │
                     │
                     ▼
           ┌──────────────────┐
           │ EditProfileScreen│
           │                  │
           │ Preview Avatar   │
           │ Info Usuario     │
           │ Estilos [9]      │
           │ Variaciones [6]  │
           │ [Guardar]        │
           └──────────────────┘
                     │
                     │ Guardar
                     ▼
           ┌──────────────────┐
           │   API Backend    │
           │ PUT /auth/avatar │
           └──────────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │  Base de Datos   │
           │  UPDATE avatar   │
           └──────────────────┘
```

---

## 🔌 API Backend

### **Endpoint: Actualizar Avatar**

```
PUT /api/auth/avatar
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=user@example.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Avatar actualizado exitosamente",
  "user": {
    "id": "uuid",
    "name": "Usuario",
    "email": "user@example.com",
    "birth_date": "1990-01-01",
    "avatar_url": "https://...",
    "created_at": "2026-01-13T...",
    "updated_at": "2026-01-13T..."
  }
}
```

**Errores:**
- `400`: URL del avatar inválida o faltante
- `401`: Token inválido o expirado
- `404`: Usuario no encontrado
- `500`: Error del servidor

---

## 🎨 DiceBear API

### **Estilos Disponibles**

1. **avataaars** - Avatares estilo Sketch App
2. **bottts** - Robots coloridos
3. **fun-emoji** - Emojis divertidos
4. **lorelei** - Personajes femeninos
5. **micah** - Ilustraciones modernas
6. **miniavs** - Avatares minimalistas
7. **notionists** - Estilo Notion
8. **personas** - Personas realistas
9. **pixel-art** - Arte pixelado retro

### **Formato de URL**

```
https://api.dicebear.com/7.x/{style}/svg?seed={seed}
```

**Parámetros:**
- `{style}`: Uno de los 9 estilos disponibles
- `{seed}`: Cadena única para generar el avatar (email, nombre, etc.)

**Ejemplos:**
```
https://api.dicebear.com/7.x/avataaars/svg?seed=juan@gmail.com
https://api.dicebear.com/7.x/bottts/svg?seed=maria123
https://api.dicebear.com/7.x/pixel-art/svg?seed=usuario456
```

---

## 📁 Archivos Modificados/Creados

### **Frontend**

#### **Nuevos:**
- `src/screens/EditProfileScreen.js` - Pantalla de edición de perfil

#### **Modificados:**
- `src/screens/ProfileScreen.js`:
  - Carga datos reales del usuario desde AsyncStorage
  - Muestra avatar, nombre y email
  - Navega a EditProfileScreen al hacer clic
  - Implementa logout con limpieza de datos

- `src/services/api.js`:
  - Agregada función `updateAvatar(avatarUrl)`

- `src/navigation/AppNavigator.js`:
  - Agregada ruta 'EditProfile'

### **Backend**

#### **Nuevos:**
- `backend/middleware/auth.js` - Middleware de autenticación JWT

#### **Modificados:**
- `backend/controllers/authController.js`:
  - Agregada función `updateAvatar`
  
- `backend/routes/auth.js`:
  - Agregada ruta `PUT /auth/avatar` (protegida)

---

## 🔐 Seguridad

### **Autenticación**
- El endpoint de actualizar avatar requiere JWT token válido
- El middleware `authenticateToken` verifica el token en cada petición
- El userId se extrae del token, no del body (previene suplantación)

### **Validaciones**
- URL del avatar debe tener formato válido (https?://)
- Token debe estar presente en headers Authorization
- Usuario debe existir en la base de datos

---

## 📊 Base de Datos

### **Campo avatar_url**
- Tipo: `VARCHAR(500)`
- Nullable: Sí (tiene valor por defecto)
- Se actualiza automáticamente `updated_at` con TRIGGER

### **Query de Actualización**
```sql
UPDATE users 
SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;
```

---

## 🎯 Casos de Uso

### **1. Usuario ve su perfil**
```
ProfileScreen carga → getUserData() → Muestra avatar + info
```

### **2. Usuario edita avatar**
```
ProfileScreen → Clic en tarjeta → EditProfileScreen
↓
Selecciona estilo → Selecciona variación → Vista previa actualizada
↓
Clic en Guardar → updateAvatar() → Backend actualiza BD
↓
Alert de éxito → Navega a ProfileScreen → Avatar actualizado
```

### **3. Usuario cierra sesión**
```
Clic en Cerrar Sesión → clearAllData() → Navigation.reset('Login')
```

---

## 🧪 Testing

### **Probar en la App:**

1. **Ver Perfil:**
   - Ir a la pestaña Perfil
   - Verificar que se muestre avatar, nombre y email

2. **Editar Avatar:**
   - Hacer clic en la tarjeta de usuario
   - Navegar entre los 9 estilos
   - Seleccionar diferentes variaciones
   - Guardar y verificar actualización

3. **Persistencia:**
   - Cerrar y abrir la app
   - Verificar que el avatar se mantenga
   - Verificar que el avatar aparezca en todas las pantallas

### **Probar Backend:**

```powershell
# 1. Login para obtener token
$response = Invoke-RestMethod -Uri "http://192.168.1.214:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@test.com","password":"password123"}'

$token = $response.token

# 2. Actualizar avatar
Invoke-RestMethod -Uri "http://192.168.1.214:3000/api/auth/avatar" `
  -Method PUT `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"avatar_url":"https://api.dicebear.com/7.x/bottts/svg?seed=test"}'
```

---

## 📱 Screenshots del Flujo

```
┌──────────────────────┐     ┌──────────────────────┐
│   ProfileScreen      │     │  EditProfileScreen   │
│                      │     │                      │
│  ╭─────────╮         │     │    ╭─────────╮      │
│  │ [avatar]│ Usuario ├────→│    │ Preview │      │
│  ╰─────────╯         │     │    ╰─────────╯      │
│  email@test.com      │     │                      │
│                      │     │  👤 Nombre: Usuario  │
│  ○ Perfil            │     │  ✉️  Email: email@   │
│  ○ Historial         │     │  📅 Fecha: 01/01/90  │
│  ○ Dirección         │     │                      │
│  ○ Gamificación      │     │  [avataaars][bottts] │
│  ○ Centro ayuda      │     │  [fun-emoji][lorelei]│
│  ○ Sugerencias       │     │                      │
│  ○ Sobre nosotros    │     │  [Guardar Avatar]    │
│  ○ Cerrar Sesión     │     │                      │
└──────────────────────┘     └──────────────────────┘
```

---

## ✅ Funcionalidades Implementadas

- ✅ Mostrar información del usuario en ProfileScreen
- ✅ Mostrar avatar actual
- ✅ Navegación a pantalla de edición
- ✅ Selector de 9 estilos de avatar
- ✅ 6 variaciones por estilo
- ✅ Vista previa en tiempo real
- ✅ Endpoint backend para actualizar avatar
- ✅ Middleware de autenticación
- ✅ Validaciones de seguridad
- ✅ Actualización en base de datos
- ✅ Persistencia del avatar
- ✅ Función de logout

---

## 🚀 Próximos Pasos Sugeridos

1. Agregar edición de nombre
2. Agregar edición de fecha de nacimiento
3. Implementar cambio de contraseña
4. Agregar foto de perfil personalizada (además de DiceBear)
5. Estadísticas del usuario
6. Configuración de notificaciones
