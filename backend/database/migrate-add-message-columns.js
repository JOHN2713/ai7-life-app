// Script para agregar columnas message y message_type a goal_reminders
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'useri7_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando migración...');
    
    // Verificar si las columnas ya existen
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'goal_reminders' 
      AND column_name IN ('message', 'message_type');
    `;
    
    const existingColumns = await client.query(checkQuery);
    const columnNames = existingColumns.rows.map(row => row.column_name);
    
    if (columnNames.includes('message') && columnNames.includes('message_type')) {
      console.log('Las columnas ya existen, no se requiere migración');
      return;
    }
    
    // Agregar columnas
    if (!columnNames.includes('message')) {
      console.log('Agregando columna message...');
      await client.query(`
        ALTER TABLE goal_reminders 
        ADD COLUMN message TEXT;
      `);
      console.log('Columna message agregada');
    }
    
    if (!columnNames.includes('message_type')) {
      console.log('Agregando columna message_type...');
      await client.query(`
        ALTER TABLE goal_reminders 
        ADD COLUMN message_type VARCHAR(50) DEFAULT 'motivacion';
      `);
      console.log('Columna message_type agregada');
    }
    
    console.log('Migración completada exitosamente');
    
  } catch (error) {
    console.error('Error en la migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar migración
migrate()
  .then(() => {
    console.log('Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
