const { query } = require('./config/database');

async function checkFriendsTables() {
  try {
    // Verificar tablas
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('friendships', 'friend_messages', 'shared_goals')
    `);
    
    console.log('Tablas de amigos encontradas:');
    console.log(tables.rows);
    
    // Si no hay tablas, mostrar instrucciones
    if (tables.rows.length === 0) {
      console.log('\n NO SE ENCONTRARON TABLAS DE AMIGOS');
      console.log('Debes ejecutar el archivo: backend/database/friends_schema.sql');
      console.log('\nInstrucciones:');
      console.log('1. Abre pgAdmin');
      console.log('2. Conéctate a la base de datos "useri7_db"');
      console.log('3. Abre Query Tool');
      console.log('4. Ejecuta el archivo friends_schema.sql');
    } else {
      console.log(`\nSe encontraron ${tables.rows.length} tablas`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkFriendsTables();
