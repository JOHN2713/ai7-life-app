-- Script de inicialización completo
-- Ejecutar este script como superusuario de PostgreSQL

-- Crear la base de datos (si no existe)
-- Nota: Este comando debe ejecutarse fuera de una transacción
-- psql -U postgres -c "CREATE DATABASE useri7_db;"

-- Conectarse a la base de datos
\c useri7_db;

-- Ejecutar el schema
\i schema.sql;

-- Insertar usuario de prueba (opcional)
-- Password: admin123 (ya hasheado con bcrypt)
INSERT INTO users (name, email, password_hash, birth_date, avatar_url) VALUES
('Admin User', 'admin@ai7life.com', '$2b$10$rGZ5JqE9h8P8hxKX5xXvPuu0T4E4vXY/tX5KsK2JKxX3cKZqvXK2e', '1990-01-01', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');

-- Verificar la creación
SELECT * FROM users;

\echo 'Base de datos useri7_db inicializada correctamente!'
