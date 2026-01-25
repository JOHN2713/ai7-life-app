# INSTRUCCIONES: Sistema de Amigos - Configuración

## ✅ COMPLETADO

Se ha creado el sistema completo de amigos con las siguientes funcionalidades:

### 📁 Archivos Creados

#### Backend:
1. **backend/database/friends_schema.sql** - Schema PostgreSQL con 3 tablas:
   - `friendships`: Gestión de amistades (pending/accepted/rejected)
   - `friend_messages`: Mensajes entre amigos
   - `shared_goals`: Metas compartidas con permisos

2. **backend/controllers/friendsController.js** - Controlador con funciones:
   - `searchUsers()` - Buscar usuarios por nombre/email
   - `sendFriendRequest()` - Enviar solicitud de amistad
   - `acceptFriendRequest()` - Aceptar solicitud
   - `rejectFriendRequest()` - Rechazar solicitud
   - `getFriends()` - Obtener lista de amigos
   - `getPendingRequests()` - Solicitudes pendientes
   - `removeFriend()` - Eliminar amistad

3. **backend/routes/friends.js** - Rutas API:
   - GET `/api/friends/search?search=texto` - Buscar usuarios
   - POST `/api/friends/request` - Enviar solicitud
   - PUT `/api/friends/request/:friendshipId/accept` - Aceptar
   - DELETE `/api/friends/request/:friendshipId/reject` - Rechazar
   - GET `/api/friends` - Lista de amigos
   - GET `/api/friends/pending` - Solicitudes pendientes
   - DELETE `/api/friends/:friendId` - Eliminar amigo

4. **backend/server.js** - Actualizado con rutas de amigos

#### Frontend:
1. **src/screens/FriendsScreen.js** - Pantalla principal con 3 tabs:
   - **Mis Amigos**: Lista de amigos con avatares
   - **Solicitudes**: Pendientes de aceptar/rechazar
   - **Buscar**: Búsqueda de usuarios para agregar

2. **src/services/api.js** - Actualizado con `friendsAPI`:
   - Todas las funciones para gestión de amigos
   
3. **src/constants/colors.js** - Ampliado con colores adicionales

4. **src/navigation/AppNavigator.js** - Agregada ruta Friends

5. **src/screens/HomeScreen.js** - Nueva tarjeta "Mis Amigos"

---

## 🔧 PRÓXIMOS PASOS

### 1. Ejecutar el Schema de Base de Datos

Debes ejecutar el archivo SQL para crear las tablas de amigos. Tienes dos opciones:

#### Opción A: Desde pgAdmin
1. Abre pgAdmin
2. Conéctate a la base de datos `useri7_db`
3. Click derecho en la base de datos → Query Tool
4. Abre el archivo: `backend/database/friends_schema.sql`
5. Presiona F5 o click en el botón Execute

#### Opción B: Desde línea de comandos (si tienes psql configurado)
```bash
cd backend/database
psql -U postgres -d useri7_db -f friends_schema.sql
```

### 2. Reiniciar el Backend

```bash
cd backend
npm start
```

El servidor mostrará las nuevas rutas de amigos disponibles.

### 3. Probar la App

1. Inicia la app React Native:
   ```bash
   npm start
   ```

2. Navega a la pantalla de Amigos:
   - Desde HomeScreen → Click en tarjeta "Mis Amigos"
   - O navegación directa

3. **Funcionalidades disponibles**:
   - ✅ Buscar usuarios por nombre o email
   - ✅ Enviar solicitudes de amistad
   - ✅ Ver solicitudes recibidas
   - ✅ Aceptar/rechazar solicitudes
   - ✅ Ver lista de amigos
   - ✅ Eliminar amistades (mantén presionado)
   - ✅ Indicadores de estado (Amigos, Pendiente, etc.)

---

## 📊 Estructura de la Base de Datos

### Tabla: friendships
```sql
- id (SERIAL PRIMARY KEY)
- user_id (UUID) - Usuario que envía solicitud
- friend_id (UUID) - Usuario que recibe solicitud
- status (ENUM: pending/accepted/rejected/blocked)
- created_at, updated_at
- UNIQUE(user_id, friend_id)
- CHECK: No autosolicitudes
```

### Tabla: friend_messages
```sql
- id (SERIAL PRIMARY KEY)
- sender_id (UUID)
- receiver_id (UUID)
- message (TEXT)
- is_read (BOOLEAN)
- created_at
```

### Tabla: shared_goals
```sql
- id (SERIAL PRIMARY KEY)
- goal_id (UUID)
- user_id (UUID)
- shared_by_id (UUID)
- can_edit (BOOLEAN)
- can_view_progress (BOOLEAN)
- created_at
```

---

## 🎨 Características de la UI

### FriendsScreen
- **Diseño moderno** con tabs superiores
- **Búsqueda en tiempo real** (mínimo 2 caracteres)
- **Badges de estado** con colores:
  - Verde: Amigos
  - Amarillo: Solicitud pendiente
  - Rojo/Verde: Aceptar/rechazar
- **Avatares** personalizados (DiceBear)
- **Pull-to-refresh** para actualizar listas
- **Estados vacíos** con íconos y mensajes
- **Loading states** con ActivityIndicator

---

## 🚀 Funcionalidades Futuras (No Implementadas Aún)

1. **Chat entre amigos**: Usar tabla `friend_messages`
2. **Metas compartidas**: Sistema colaborativo con permisos
3. **Notificaciones push**: Cuando llegan solicitudes
4. **Perfil de amigos**: Ver estadísticas de amigos
5. **Feed social**: Ver progreso de amigos
6. **Grupos**: Metas en equipo

---

## ⚠️ Notas Importantes

- Las solicitudes de amistad son **unidireccionales**
- Solo el receptor puede aceptar/rechazar
- Al eliminar un amigo se borra la relación completa
- La búsqueda es case-insensitive
- Máximo 20 resultados en búsqueda
- PostgreSQL usa UUIDs para user_id

---

## 🐛 Troubleshooting

### Error: "Token no proporcionado"
- Verifica que el usuario esté autenticado
- Revisa que AsyncStorage tenga `@ai7life:token`

### Error: "Ya existe una solicitud"
- Verifica si ya son amigos o hay solicitud pendiente
- Actualiza la lista de amigos

### No aparecen resultados en búsqueda
- Verifica que haya usuarios registrados
- Mínimo 2 caracteres requeridos
- Revisa que el backend esté corriendo

---

## ✅ Checklist de Verificación

- [ ] Schema SQL ejecutado en useri7_db
- [ ] Backend reiniciado y corriendo
- [ ] App React Native iniciada
- [ ] Navegación a FriendsScreen funciona
- [ ] Búsqueda de usuarios responde
- [ ] Enviar solicitud funciona
- [ ] Ver solicitudes pendientes funciona
- [ ] Aceptar/rechazar funciona
- [ ] Lista de amigos se muestra

---

**Fecha de creación**: 25/01/2025  
**Sistema**: AI7 Life App  
**Funcionalidad**: Sistema Social de Amigos
