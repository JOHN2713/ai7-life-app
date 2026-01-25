-- Schema para el sistema de metas (Goals)
-- Base de datos: useri7_db

-- Crear extensión para UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLA: goals (Metas)
-- ========================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Nombre del icono (ej: 'walk', 'book', 'water')
    color VARCHAR(20) DEFAULT '#3B82F6', -- Color hex para la UI
    
    -- Fechas y duración
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days >= 1 AND duration_days <= 365),
    
    -- Hora(s) de realización
    time_of_day TIME[], -- Array de horas (ej: ['08:00', '14:00', '20:00'])
    
    -- Frecuencia
    frequency VARCHAR(20) DEFAULT 'daily', -- 'daily', 'custom'
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    is_completed BOOLEAN DEFAULT false,
    
    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_active ON goals(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_goals_dates ON goals(start_date, end_date);

-- ========================================
-- TABLA: goal_days (Días de la semana para cada meta)
-- ========================================
CREATE TABLE IF NOT EXISTS goal_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    -- 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(goal_id, day_of_week)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_goal_days_goal_id ON goal_days(goal_id);

-- ========================================
-- TABLA: goal_reminders (Recordatorios)
-- ========================================
CREATE TABLE IF NOT EXISTS goal_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notification_sent BOOLEAN DEFAULT false,
    last_sent_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_goal_reminders_goal_id ON goal_reminders(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_reminders_active ON goal_reminders(is_active) WHERE is_active = true;

-- ========================================
-- TABLA: goal_completions (Cumplimiento diario)
-- ========================================
CREATE TABLE IF NOT EXISTS goal_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(goal_id, completion_date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_goal_completions_goal_id ON goal_completions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_completions_date ON goal_completions(completion_date);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para actualizar updated_at en goals
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en goal_reminders
CREATE TRIGGER update_goal_reminders_updated_at BEFORE UPDATE ON goal_reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- COMENTARIOS EN LAS TABLAS
-- ========================================

COMMENT ON TABLE goals IS 'Tabla de metas de usuarios';
COMMENT ON COLUMN goals.id IS 'ID único de la meta (UUID)';
COMMENT ON COLUMN goals.user_id IS 'ID del usuario propietario';
COMMENT ON COLUMN goals.name IS 'Nombre de la meta';
COMMENT ON COLUMN goals.description IS 'Descripción detallada de la meta';
COMMENT ON COLUMN goals.icon IS 'Icono representativo (walk, book, water, etc)';
COMMENT ON COLUMN goals.color IS 'Color en formato hex para la UI';
COMMENT ON COLUMN goals.duration_days IS 'Duración en días (1-365)';
COMMENT ON COLUMN goals.time_of_day IS 'Array de horas para realizar la meta';
COMMENT ON COLUMN goals.frequency IS 'Frecuencia: daily o custom';

COMMENT ON TABLE goal_days IS 'Días de la semana en que aplica cada meta';
COMMENT ON COLUMN goal_days.day_of_week IS '0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado';

COMMENT ON TABLE goal_reminders IS 'Recordatorios configurados para cada meta';
COMMENT ON TABLE goal_completions IS 'Registro de cumplimiento diario de metas';
