# 🗄️ Guía para Crear la Base de Datos

## ⚠️ El script setup-database.bat falló porque psql no está en el PATH

## ✅ SOLUCIÓN: Usar pgAdmin (Interfaz Gráfica)

### Método 1: Usando pgAdmin 4 (RECOMENDADO - MÁS FÁCIL)

#### Paso 1: Abrir pgAdmin
1. Busca **"pgAdmin 4"** en el menú inicio de Windows
2. Abre la aplicación (puede tardar un poco en cargar)

#### Paso 2: Conectarse al servidor
1. En el panel izquierdo verás **"Servers"**
2. Expande **"Servers"** → **"PostgreSQL 14"** (o tu versión)
3. Te pedirá la contraseña: **`admin`**

#### Paso 3: Crear la base de datos
1. Clic derecho en **"Databases"**
2. Selecciona **"Create"** → **"Database..."**
3. En **"Database"** escribe: `useri7_db`
4. En **"Owner"** selecciona: `postgres`
5. Clic en **"Save"**

#### Paso 4: Ejecutar el script
1. Clic derecho en la base de datos **"useri7_db"** que acabas de crear
2. Selecciona **"Query Tool"** (se abrirá un editor SQL)
3. Abre el archivo: `backend/database/CREAR_BASE_DE_DATOS.sql`
4. Copia **TODO** el contenido del archivo
5. Pégalo en el Query Tool de pgAdmin
6. Presiona **F5** o clic en el botón ▶️ **"Execute"**

#### Paso 5: Verificar
Si ves estos mensajes, ¡todo funcionó!:
```
Tabla users creada exitosamente!
Total de usuarios: 1
```

---

### Método 2: Usando DBeaver (Alternativa)

#### Si tienes DBeaver instalado:

1. Abre **DBeaver**
2. Conecta a PostgreSQL (host: localhost, usuario: postgres, password: admin)
3. Clic derecho en **"Databases"** → **"Create New Database"**
4. Nombre: `useri7_db`
5. Clic en **"OK"**
6. Clic derecho en `useri7_db` → **"SQL Editor"** → **"New SQL Script"**
7. Copia y pega el contenido de `backend/database/CREAR_BASE_DE_DATOS.sql`
8. Presiona **Ctrl+Enter** para ejecutar

---

### Método 3: Configurar psql en el PATH (Para usuarios avanzados)

Si quieres que funcione el script `.bat`, necesitas agregar psql al PATH:

#### Paso 1: Encontrar la ruta de psql
La ruta típica es:
```
C:\Program Files\PostgreSQL\14\bin
```
O para otras versiones:
```
C:\Program Files\PostgreSQL\15\bin
C:\Program Files\PostgreSQL\16\bin
```

#### Paso 2: Agregar al PATH
1. Presiona **Windows + R**
2. Escribe: `sysdm.cpl` y presiona Enter
3. Ve a la pestaña **"Opciones avanzadas"**
4. Clic en **"Variables de entorno"**
5. En **"Variables del sistema"** busca **"Path"** y haz doble clic
6. Clic en **"Nuevo"**
7. Pega la ruta: `C:\Program Files\PostgreSQL\14\bin` (ajusta según tu versión)
8. Clic en **"Aceptar"** en todas las ventanas
9. **Cierra y vuelve a abrir** todas las terminales

#### Paso 3: Verificar
```powershell
psql --version
```

Deberías ver algo como: `psql (PostgreSQL) 14.x`

#### Paso 4: Ejecutar el script
```powershell
cd backend
.\setup-database.bat
```

---

## 🎯 Después de crear la base de datos

Una vez que hayas creado la base de datos con cualquiera de los métodos, puedes:

### 1. Iniciar el backend
```powershell
cd backend
npm run dev
```

Deberías ver:
```
✅ Conectado a PostgreSQL
⏰ Hora del servidor: ...
🚀 Servidor corriendo en http://localhost:3000
```

### 2. Verificar que funciona
```powershell
# En otra terminal
curl http://localhost:3000/health
```

Debería responder:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### 3. Iniciar la app
```powershell
# En la raíz del proyecto
npm start
```

---

## ❓ Preguntas Frecuentes

### ¿Necesito instalar algo más?
No, solo necesitas:
- ✅ PostgreSQL instalado (ya lo tienes)
- ✅ pgAdmin 4 (viene con PostgreSQL)

### ¿Qué hago si no encuentro pgAdmin?
Reinstala PostgreSQL desde: https://www.postgresql.org/download/windows/
Asegúrate de marcar la opción **"pgAdmin 4"** durante la instalación.

### ¿Puedo usar otra herramienta?
Sí, cualquier cliente PostgreSQL funciona:
- pgAdmin 4 (recomendado, viene con PostgreSQL)
- DBeaver (gratis, muy popular)
- DataGrip (de pago)
- Azure Data Studio con extensión PostgreSQL
- Incluso Visual Studio Code con extensión PostgreSQL

---

## ✅ Resumen

**Opción más fácil:**
1. Abre pgAdmin
2. Crea base de datos `useri7_db`
3. Ejecuta el script `CREAR_BASE_DE_DATOS.sql`
4. Inicia el backend: `npm run dev`
5. ¡Listo! 🎉
