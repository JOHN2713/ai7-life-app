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
