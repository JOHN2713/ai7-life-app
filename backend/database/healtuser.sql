
-- Tabla simple y eficiente
CREATE TABLE IF NOT EXISTS user_health_data (
    id SERIAL PRIMARY KEY,
    
    -- Email como referencia principal (más fácil para desarrollo)
    user_email VARCHAR(255) NOT NULL UNIQUE REFERENCES users(email) ON DELETE CASCADE,
    
    -- Campos de salud básicos
    age INTEGER,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    sleep_hours DECIMAL(3,1),
    water_glasses INTEGER,
    activity_level VARCHAR(20),
    
    -- Campos calculados
    bmi DECIMAL(5,2),
    health_score INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice único ya está por la UNIQUE constraint
-- CREATE INDEX idx_health_email ON user_health_data(user_email);

-- Insertar datos de prueba (MUCHO MÁS SENCILLO)
INSERT INTO user_health_data 
    (user_email, age, height_cm, weight_kg, sleep_hours, water_glasses, activity_level)
VALUES 
    ('admin@ai7life.com', 28, 175.0, 70.5, 7.5, 8, 'Moderado')
ON CONFLICT (user_email) DO NOTHING;

-- Ver datos
SELECT 
    '✅ Tabla creada exitosamente' as status,
    u.name,
    h.*
FROM user_health_data h
JOIN users u ON h.user_email = u.email;