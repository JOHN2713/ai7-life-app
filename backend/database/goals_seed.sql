-- Datos iniciales: Metas predefinidas comunes
-- Estas metas pueden servir como plantillas o ejemplos para los usuarios

-- Nota: Este script inserta metas de ejemplo para el usuario con ID específico
-- En producción, estas serían plantillas que el usuario puede elegir

-- ========================================
-- CREAR USUARIO PLANTILLA (si no existe)
-- ========================================
INSERT INTO users (
    id,
    name,
    email,
    password_hash,
    birth_date
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Sistema - Plantillas',
    'templates@ai7life.system',
    '$2b$10$placeholder.hash.for.template.user',
    '2000-01-01'
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- METAS PREDEFINIDAS
-- ========================================

-- Meta 1: Salir a caminar
INSERT INTO goals (
    user_id, 
    name, 
    description, 
    icon, 
    color, 
    start_date,
    end_date,
    duration_days, 
    time_of_day, 
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Plantilla (user_id ficticio)
    'Salir a caminar',
    'Caminar al menos 30 minutos al día para mejorar la salud cardiovascular',
    'walk',
    '#10B981',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['07:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 2: Cepillarse los dientes
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Cepillarme 3 veces al día',
    'Mantener una buena higiene bucal cepillándose después de cada comida',
    'tooth',
    '#3B82F6',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['08:00', '14:00', '21:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 3: Leer un libro
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Leer un libro',
    'Dedicar tiempo a la lectura diaria para expandir conocimientos',
    'book',
    '#8B5CF6',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['21:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 4: Beber agua
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Beber agua',
    'Mantenerse hidratado bebiendo agua regularmente durante el día',
    'water',
    '#06B6D4',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['09:00', '12:00', '15:00', '18:00', '21:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 5: Hacer ejercicio
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Hacer ejercicio',
    'Realizar actividad física para mantenerse en forma',
    'fitness',
    '#EF4444',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['06:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 6: Meditar
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Meditar',
    'Practicar meditación para reducir el estrés y mejorar el bienestar mental',
    'meditation',
    '#F59E0B',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['07:00', '19:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- Meta 7: Estudiar
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Estudiar',
    'Dedicar tiempo al estudio o aprendizaje de nuevas habilidades',
    'study',
    '#6366F1',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '4 days',
    5,
    ARRAY['16:00']::TIME[],
    'custom'
) ON CONFLICT DO NOTHING;

-- Meta 8: Dormir 8 horas
INSERT INTO goals (
    user_id,
    name,
    description,
    icon,
    color,
    start_date,
    end_date,
    duration_days,
    time_of_day,
    frequency
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Dormir 8 horas',
    'Mantener un horario de sueño saludable',
    'sleep',
    '#EC4899',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '6 days',
    7,
    ARRAY['22:00']::TIME[],
    'daily'
) ON CONFLICT DO NOTHING;

-- ========================================
-- NOTA IMPORTANTE
-- ========================================
-- Estas metas usan un user_id ficticio (000...) como plantillas
-- En la aplicación, cuando un usuario quiera usar una meta predefinida,
-- se creará una nueva meta con su user_id real basada en esta plantilla
