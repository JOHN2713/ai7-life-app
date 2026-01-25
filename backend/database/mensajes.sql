-- Borrar si existía con error (opcional)
-- DROP TABLE IF EXISTS mensajes;

CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receptor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices corregidos (Sin el prefijo de la tabla adentro)
CREATE INDEX IF NOT EXISTS idx_mensajes_emisor ON mensajes(emisor_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_receptor ON mensajes(receptor_id);

COMMENT ON TABLE mensajes IS 'Tabla para almacenar los mensajes del chat entre usuarios';