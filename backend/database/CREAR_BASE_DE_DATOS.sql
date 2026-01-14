-- ========================================
-- AI7 LIFE - Script de Creación de Base de Datos
-- ========================================
-- Ejecutar este script completo en pgAdmin o tu cliente PostgreSQL
-- 
-- INSTRUCCIONES:
-- 1. Abre pgAdmin 4
-- 2. Conecta a tu servidor PostgreSQL
-- 3. Clic derecho en "Databases" → "Create" → "Database"
-- 4. Nombre: useri7_db
-- 5. Owner: postgres
-- 6. Clic en "Save"
-- 7. Clic derecho en "useri7_db" → "Query Tool"
-- 8. Copia y pega TODO este script
-- 9. Presiona F5 o clic en el botón "Execute"
-- ========================================

-- Crear extensión para UUID (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eliminar tabla si existe (para re-ejecutar el script)
DROP TABLE IF EXISTS users CASCADE;

-- Crear tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    birth_date DATE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice en el email para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios en las tablas
COMMENT ON TABLE users IS 'Tabla de usuarios de AI7 Life';
COMMENT ON COLUMN users.id IS 'ID único del usuario (UUID)';
COMMENT ON COLUMN users.name IS 'Nombre completo del usuario';
COMMENT ON COLUMN users.email IS 'Email único del usuario';
COMMENT ON COLUMN users.password_hash IS 'Contraseña encriptada con bcrypt';
COMMENT ON COLUMN users.birth_date IS 'Fecha de nacimiento del usuario';
COMMENT ON COLUMN users.avatar_url IS 'URL del avatar del usuario';

-- Insertar usuario de prueba (opcional - password: admin123)
-- Puedes comentar esta línea si no quieres un usuario de prueba
INSERT INTO users (name, email, password_hash, birth_date, avatar_url) VALUES
('Admin User', 'admin@ai7life.com', '$2b$10$rGZ5JqE9h8P8hxKX5xXvPuu0T4E4vXY/tX5KsK2JKxX3cKZqvXK2e', '1990-01-01', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
ON CONFLICT (email) DO NOTHING;

-- Verificar que todo se creó correctamente
SELECT 'Tabla users creada exitosamente!' as status;
SELECT 'Total de usuarios: ' || COUNT(*)::text as info FROM users;

-- Mostrar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================
-- Si ves "Tabla users creada exitosamente!" entonces todo está bien
-- Ahora puedes iniciar el backend con: npm run dev
