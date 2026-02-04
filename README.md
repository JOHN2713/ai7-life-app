# AI7 Life App

Aplicación móvil de gestión de vida personal con autenticación completa, construida con React Native (Expo) y backend Node.js + PostgreSQL.

## Características

- **Sistema de Autenticación Completo**
  - Registro de usuarios con validación
  - Login con JWT
  - Encriptación de contraseñas (bcrypt)
  - Tokens con expiración
  
- **Gestión de Usuarios**
  - Perfiles con avatar automático
  - Fecha de nacimiento
  - Datos persistentes en PostgreSQL

- **Interfaz Moderna**
  - Diseño limpio y profesional
  - Navegación fluida
  - Feedback visual en tiempo real

## Inicio Rápido

### 1. Instalar dependencias
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configurar base de datos
```bash
cd backend
.\setup-database.bat
```

### 3. Iniciar aplicación
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm start
```

📚 **Ver [INICIO_RAPIDO.md](INICIO_RAPIDO.md) para guía detallada**

## Estructura del Proyecto

```
ai7-life-app/
├── backend/                 # API REST con Node.js + Express
│   ├── config/             # Configuración (database)
│   ├── controllers/        # Lógica de negocio
│   ├── database/           # Scripts SQL
│   ├── routes/             # Rutas del API
│   └── server.js           # Servidor Express
├── src/
│   ├── screens/            # Pantallas de la app
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   └── ...
│   ├── components/         # Componentes reutilizables
│   ├── navigation/         # Navegación
│   ├── services/           # API client (axios)
│   └── constants/          # Constantes (colores, etc)
├── assets/                 # Recursos (imágenes, fuentes)
└── App.js                  # Punto de entrada
```

## Tecnologías

### Frontend
- **React Native** 0.81.5
- **Expo** 54.0
- **React Navigation** 7.x
- **Axios** - Cliente HTTP
- **AsyncStorage** - Almacenamiento local

### Backend
- **Node.js** + **Express** 4.x
- **PostgreSQL** - Base de datos
- **bcrypt** - Encriptación
- **JWT** - Autenticación
- **dotenv** - Variables de entorno

## Base de Datos

**PostgreSQL** con la siguiente configuración:
- Database: `useri7_db`
- Usuario: `postgres`
- Password: `admin`
- Puerto: `5432`

## Ejecutar en diferentes dispositivos

### Web
```bash
npm start
# Presiona 'w'
```

### Android Emulator
```bash
npm start
# Presiona 'a'
```
Cambiar URL en `src/services/api.js` a `http://10.0.2.2:3000/api`

### iOS Simulator (Mac)
```bash
npm start
# Presiona 'i'
```

### Dispositivo Físico
1. Obtener tu IP: `ipconfig` (Windows)
2. Cambiar URL en `src/services/api.js` a `http://TU_IP:3000/api`
3. Escanear QR con Expo Go

**Ver [CONFIGURACION_RED.md](CONFIGURACION_RED.md) para más detalles**

## Testing

### Probar el API
```powershell
cd backend
.\test-api.ps1
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Documentación

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía de inicio rápido
- **[INSTRUCCIONES_SETUP.md](INSTRUCCIONES_SETUP.md)** - Setup completo paso a paso
- **[CONFIGURACION_RED.md](CONFIGURACION_RED.md)** - Configuración de red
- **[RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md)** - Resumen técnico
- **[backend/README.md](backend/README.md)** - Documentación del API
- **[backend/api-docs.yaml](backend/api-docs.yaml)** - Especificación OpenAPI

## API Endpoints

### Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "birthDate": "1990-01-15"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

#### Verificar Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

## Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado.

## Equipo

AI7 Life Team - 2026

---

## Soporte

Si tienes problemas:

1. Revisa [INSTRUCCIONES_SETUP.md](INSTRUCCIONES_SETUP.md) - Troubleshooting
2. Verifica que PostgreSQL esté corriendo
3. Verifica que el backend esté en puerto 3000
4. Revisa la configuración de red según tu dispositivo

---

**¡Desarrollado con ❤️ para mejorar tu vida!**

## Notas

- La app está lista para recibir las pantallas personalizadas
- La navegación está preparada pero comentada hasta agregar más screens
- Todos los componentes usan JavaScript (puedes migrar a TypeScript si lo prefieres)
