# 🎯 API de Metas - Documentación

## Índice
- [Endpoints](#endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Instrucciones de Instalación](#instrucciones-de-instalación)

---

## Endpoints

### 1. Obtener Plantillas de Metas
**GET** `/api/goals/templates`

Obtiene las metas predefinidas disponibles como plantillas.

**Autenticación:** No requerida

**Respuesta:**
```json
{
  "success": true,
  "count": 8,
  "templates": [
    {
      "name": "Salir a caminar",
      "description": "Caminar al menos 30 minutos al día...",
      "icon": "walk",
      "color": "#10B981",
      "duration_days": 7,
      "time_of_day": ["07:00"],
      "frequency": "daily"
    }
  ]
}
```

---

### 2. Obtener Todas las Metas del Usuario
**GET** `/api/goals`

Obtiene todas las metas del usuario autenticado.

**Autenticación:** Requerida (Bearer Token)

**Query Parameters:**
- `active_only` (opcional): `true` para obtener solo metas activas

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "goals": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Beber agua",
      "description": "Mantenerse hidratado...",
      "icon": "water",
      "color": "#06B6D4",
      "start_date": "2026-01-18",
      "end_date": "2026-01-24",
      "duration_days": 7,
      "time_of_day": ["09:00", "12:00", "15:00"],
      "frequency": "daily",
      "is_active": true,
      "is_completed": false,
      "days": [
        {"day": 1},
        {"day": 2}
      ],
      "completions_count": 3,
      "total_completed_days": 3,
      "total_days": 7,
      "progress": 43,
      "created_at": "2026-01-18T10:00:00Z",
      "updated_at": "2026-01-18T10:00:00Z"
    }
  ]
}
```

---

### 3. Obtener Meta por ID
**GET** `/api/goals/:id`

Obtiene una meta específica con todos sus detalles.

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Respuesta:**
```json
{
  "success": true,
  "goal": {
    "id": "uuid",
    "name": "Leer un libro",
    "description": "Dedicar tiempo a la lectura...",
    "icon": "book",
    "color": "#8B5CF6",
    "days": [{"day": 1}, {"day": 3}, {"day": 5}],
    "reminders": [
      {
        "id": "uuid",
        "reminder_time": "21:00:00",
        "is_active": true
      }
    ],
    "completions_count": 2
  }
}
```

---

### 4. Crear Nueva Meta
**POST** `/api/goals`

Crea una nueva meta para el usuario autenticado.

**Autenticación:** Requerida

**Body:**
```json
{
  "name": "Hacer ejercicio",
  "description": "Realizar actividad física diaria",
  "icon": "fitness",
  "color": "#EF4444",
  "duration_days": 7,
  "time_of_day": ["06:00", "18:00"],
  "days": [1, 2, 3, 4, 5],
  "frequency": "custom"
}
```

**Campos:**
- `name` *(requerido)*: Nombre de la meta (máx. 255 caracteres)
- `description` *(opcional)*: Descripción (máx. 1000 caracteres)
- `icon` *(opcional)*: Nombre del icono (default: "default")
- `color` *(opcional)*: Color hex (default: "#3B82F6")
- `duration_days` *(requerido)*: Duración en días (1-7)
- `time_of_day` *(opcional)*: Array de horas ["HH:MM"]
- `days` *(opcional)*: Array de días [0-6] (0=Domingo, 6=Sábado)
- `frequency` *(opcional)*: "daily" o "custom" (default: "daily")
- `start_date` *(opcional)*: Fecha de inicio (default: hoy)

**Respuesta:**
```json
{
  "success": true,
  "message": "Meta creada exitosamente",
  "goal": {
    "id": "uuid",
    "name": "Hacer ejercicio",
    "duration_days": 7,
    "start_date": "2026-01-18",
    "end_date": "2026-01-24"
  }
}
```

---

### 5. Actualizar Meta
**PUT** `/api/goals/:id`

Actualiza una meta existente.

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Body (todos opcionales):**
```json
{
  "name": "Nuevo nombre",
  "description": "Nueva descripción",
  "icon": "nuevo-icono",
  "color": "#FF0000",
  "time_of_day": ["07:00", "19:00"],
  "days": [1, 3, 5],
  "is_active": false
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Meta actualizada exitosamente",
  "goal": { /* meta actualizada */ }
}
```

---

### 6. Eliminar Meta
**DELETE** `/api/goals/:id`

Elimina una meta (y todos sus datos relacionados).

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Respuesta:**
```json
{
  "success": true,
  "message": "Meta eliminada exitosamente"
}
```

---

### 7. Marcar Meta Como Completada
**POST** `/api/goals/:id/complete`

Marca la meta como completada para una fecha específica.

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Body:**
```json
{
  "date": "2026-01-18",
  "notes": "Completado exitosamente"
}
```

**Campos:**
- `date` *(opcional)*: Fecha de cumplimiento (default: hoy)
- `notes` *(opcional)*: Notas adicionales (máx. 500 caracteres)

**Respuesta:**
```json
{
  "success": true,
  "message": "Meta completada para hoy",
  "completion": {
    "id": "uuid",
    "goal_id": "uuid",
    "completion_date": "2026-01-18",
    "completed_at": "2026-01-18T15:30:00Z",
    "notes": "Completado exitosamente"
  }
}
```

---

### 8. Desmarcar Meta Como Completada
**POST** `/api/goals/:id/uncomplete`

Elimina el registro de cumplimiento para una fecha específica.

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Body:**
```json
{
  "date": "2026-01-18"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cumplimiento eliminado",
  "deleted": true
}
```

---

### 9. Obtener Historial de Cumplimiento
**GET** `/api/goals/:id/history`

Obtiene el historial completo de cumplimiento de una meta.

**Autenticación:** Requerida

**Parámetros de URL:**
- `id`: UUID de la meta

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "history": [
    {
      "id": "uuid",
      "goal_id": "uuid",
      "completion_date": "2026-01-18",
      "completed_at": "2026-01-18T15:30:00Z",
      "notes": "Completado exitosamente",
      "created_at": "2026-01-18T15:30:00Z"
    }
  ]
}
```

---

### 10. Obtener Estadísticas de Metas
**GET** `/api/goals/stats`

Obtiene estadísticas generales de las metas del usuario.

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "success": true,
  "stats": {
    "total_goals": 10,
    "active_goals": 7,
    "completed_goals": 3,
    "total_completions": 45
  }
}
```

---

## Modelos de Datos

### Goal (Meta)
```typescript
{
  id: UUID
  user_id: UUID
  name: string (max 255)
  description: string | null
  icon: string (max 100)
  color: string (hex)
  start_date: Date
  end_date: Date
  duration_days: number (1-7)
  time_of_day: Time[] | null
  frequency: 'daily' | 'custom'
  is_active: boolean
  is_completed: boolean
  created_at: Timestamp
  updated_at: Timestamp
}
```

### Goal Day
```typescript
{
  id: UUID
  goal_id: UUID
  day_of_week: number (0-6)
  created_at: Timestamp
}
```

### Goal Reminder
```typescript
{
  id: UUID
  goal_id: UUID
  reminder_time: Time
  is_active: boolean
  notification_sent: boolean
  last_sent_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
}
```

### Goal Completion
```typescript
{
  id: UUID
  goal_id: UUID
  completion_date: Date
  completed_at: Timestamp
  notes: string | null
  created_at: Timestamp
}
```

---

## Ejemplos de Uso

### Crear Meta de "Beber Agua"
```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beber agua",
    "description": "Mantenerse hidratado durante el día",
    "icon": "water",
    "color": "#06B6D4",
    "duration_days": 7,
    "time_of_day": ["09:00", "12:00", "15:00", "18:00", "21:00"],
    "frequency": "daily"
  }'
```

### Marcar Meta como Completada (hoy)
```bash
curl -X POST http://localhost:3000/api/goals/UUID/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "¡Logrado!"
  }'
```

### Obtener Metas Activas
```bash
curl http://localhost:3000/api/goals?active_only=true \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Instrucciones de Instalación

### 1. Crear las tablas en la base de datos

```bash
# Ejecutar el schema de metas
psql -U postgres -d useri7_db -f backend/database/goals_schema.sql

# Cargar datos iniciales (plantillas)
psql -U postgres -d useri7_db -f backend/database/goals_seed.sql
```

### 2. Verificar que el servidor esté corriendo

```bash
cd backend
npm start
```

### 3. Probar el endpoint de plantillas

```bash
curl http://localhost:3000/api/goals/templates
```

---

## Códigos de Estado HTTP

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación en los datos enviados
- `401 Unauthorized` - Token de autenticación inválido o faltante
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Notas Importantes

1. **Días de la semana**: Se usan números del 0-6 donde:
   - 0 = Domingo
   - 1 = Lunes
   - 2 = Martes
   - 3 = Miércoles
   - 4 = Jueves
   - 5 = Viernes
   - 6 = Sábado

2. **Formato de horas**: Usar formato 24 horas "HH:MM" (ej: "14:30", "09:00")

3. **Duración**: Las metas pueden durar de 1 a 7 días

4. **Autenticación**: Todas las rutas excepto `/templates` requieren token JWT en el header Authorization

5. **Cascada**: Al eliminar una meta, se eliminan automáticamente:
   - Días asociados
   - Recordatorios
   - Registros de cumplimiento
