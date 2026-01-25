-- Agregar campo para guardar el mensaje personalizado del recordatorio
-- Ejecutar este script en la base de datos useri7_db

ALTER TABLE goal_reminders 
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'motivacion';

-- Comentarios
COMMENT ON COLUMN goal_reminders.message IS 'Mensaje personalizado generado por IA para este recordatorio';
COMMENT ON COLUMN goal_reminders.message_type IS 'Tipo de mensaje: motivacion, recordatorio, alerta, felicitacion, animo';
