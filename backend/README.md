# AI7 Life Backend API

Backend API para la aplicación AI7 Life construido con Node.js, Express y PostgreSQL.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Registro y login de usuarios
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Generación automática de avatares
- ✅ Base de datos PostgreSQL
- ✅ Validación de datos

## 📋 Requisitos

- Node.js 16+ 
- PostgreSQL 12+
- npm o yarn

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/useri7_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=useri7_db
DB_USER=postgres
DB_PASSWORD=admin

PORT=3000
NODE_ENV=development

JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=7d
```

### 3. Crear la base de datos

**Opción A: Usando psql (recomendado)**

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE useri7_db;"

# Ejecutar el script de inicialización
psql -U postgres -d useri7_db -f database/schema.sql
```

**Opción B: Usando npm scripts**

```bash
npm run create-db
npm run init-db
```

**Opción C: Manualmente con pgAdmin o DBeaver**

1. Abre pgAdmin o DBeaver
2. Conéctate al servidor PostgreSQL
3. Crea una base de datos llamada `useri7_db`
4. Ejecuta el contenido del archivo `database/schema.sql`

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints

### Autenticación

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "birthDate": "1990-01-01"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "birthDate": "1990-01-01",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=juan@example.com",
    "createdAt": "2026-01-13T..."
  }
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Verificar token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Health Check

```http
GET /health
```

## 🗄️ Esquema de Base de Datos

### Tabla: users

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del usuario |
| name | VARCHAR(255) | Nombre completo |
| email | VARCHAR(255) | Email único |
| password_hash | VARCHAR(255) | Contraseña encriptada |
| birth_date | DATE | Fecha de nacimiento |
| avatar_url | VARCHAR(500) | URL del avatar |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT expiran en 7 días (configurable)
- CORS configurado para orígenes específicos
- Validación de datos en todas las rutas

## 🎨 Avatares

Los avatares se generan automáticamente usando [DiceBear API](https://dicebear.com/) con el estilo "avataaars" basado en el email del usuario.

## 📝 Scripts NPM

- `npm start` - Inicia el servidor
- `npm run dev` - Inicia en modo desarrollo con nodemon
- `npm run create-db` - Crea la base de datos
- `npm run init-db` - Inicializa el esquema

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   sc query postgresql-x64-14
   
   # Iniciar el servicio si no está corriendo
   net start postgresql-x64-14
   ```

2. Verifica las credenciales en `.env`

3. Asegúrate de que la base de datos existe:
   ```bash
   psql -U postgres -l
   ```

### Puerto 3000 ya en uso

Cambia el puerto en el archivo `.env`:
```env
PORT=3001
```

## 📄 Licencia

ISC
