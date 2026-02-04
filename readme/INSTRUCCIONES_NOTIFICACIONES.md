# Configurar Historial de Notificaciones

## Paso 1: Crear la tabla en la base de datos

Ejecuta este SQL en tu base de datos MySQL:

```sql
-- Crear ENUM type para tipos de notificación (si no existe)
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('motivacion', 'recordatorio', 'alerta', 'felicitacion', 'animo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla de historial de notificaciones
CREATE TABLE IF NOT EXISTS notification_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID,
  goal_name VARCHAR(255),
  reminder_id UUID,
  type notification_type DEFAULT 'recordatorio',
  message TEXT NOT NULL,
  scheduled_time TIMESTAMP,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL,
  CONSTRAINT fk_reminder FOREIGN KEY (reminder_id) REFERENCES goal_reminders(id) ON DELETE SET NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_sent ON notification_history(user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_goal ON notification_history(goal_id);
CREATE INDEX IF NOT EXISTS idx_read ON notification_history(user_id, is_read);
```

## Paso 2: Insertar datos de prueba (opcional)

Para probar la funcionalidad, primero obtén tu user_id y goal_id:

```sql
-- Ver tus usuarios
SELECT id, name, email FROM users;

-- Ver tus metas (reemplaza 'TU_USER_ID' con el id del paso anterior)
SELECT id, name FROM goals WHERE user_id = 'TU_USER_ID';
```

Luego inserta notificaciones de prueba (reemplaza los UUIDs con tus datos reales):

```sql
-- Ejemplo: Insertar notificaciones de prueba
INSERT INTO notification_history 
  (user_id, goal_id, goal_name, type, message, sent_at, is_read) 
VALUES
  ('TU_USER_ID_AQUI', 'TU_GOAL_ID_AQUI', 'Hacer ejercicio', 'motivacion', '¡Es tu momento de brillar! Hacer ejercicio te acerca a tu mejor versión cada día 💪✨', NOW() - INTERVAL '2 hours', FALSE),
  ('TU_USER_ID_AQUI', 'TU_GOAL_ID_AQUI', 'Beber agua', 'recordatorio', '⏰ Recordatorio amistoso: es momento de Beber agua. ¡Tú puedes hacerlo! 💚', NOW() - INTERVAL '5 hours', TRUE),
  ('TU_USER_ID_AQUI', 'TU_GOAL_ID_AQUI', 'Meditar', 'alerta', '⚡ ¡Alerta! Es hora de cumplir con Meditar. ¡No dejes pasar esta oportunidad! 💪', NOW() - INTERVAL '1 day', FALSE),
  ('TU_USER_ID_AQUI', 'TU_GOAL_ID_AQUI', 'Caminar', 'felicitacion', '🎉 ¡INCREÍBLE! Caminar completado. Tu dedicación es inspiradora. ¡Sigue así! 🏆✨', NOW() - INTERVAL '2 days', TRUE),
  ('TU_USER_ID_AQUI', NULL, 'Leer', 'animo', '💫 No pasa nada. Mañana es una nueva oportunidad para Leer. ¡Confío en ti! 💚', NOW() - INTERVAL '3 days', FALSE);
```

## Paso 3: Verificar la instalación

Verifica que la tabla se creó correctamente:

```sql
-- Ver estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'notification_history';

-- Contar notificaciones
SELECT COUNT(*) FROM notification_history;

-- Ver todas las notificaciones
SELECT * FROM notification_history ORDER BY sent_at DESC;
```

## Funcionalidad Implementada

✅ **NotificationsScreen**: Pantalla que muestra el historial de notificaciones
✅ **Botón en HomeScreen**: El ícono de campana ahora navega a notificaciones
✅ **Backend**: Endpoints para obtener historial y marcar como leídas
✅ **Base de datos**: Tabla para almacenar historial de notificaciones
✅ **API Frontend**: Funciones para consumir los endpoints

## Uso

1. Toca el ícono de campana (🔔) en el HomeScreen
2. Verás todas las notificaciones recibidas
3. Puedes tocar una notificación para ir al detalle de la meta
4. Las notificaciones no leídas tienen un punto azul
5. Pull to refresh para actualizar la lista

## Próximos pasos

Para que las notificaciones se guarden automáticamente cuando se envían:
- Modificar el servicio de notificaciones para que al enviar una push notification, también guarde en esta tabla
- Integrar con el sistema de recordatorios existente
