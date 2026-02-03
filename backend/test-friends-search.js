const { query } = require('./config/database');

async function testSearch() {
  try {
    const userId = 'd39bb205-81fa-40cd-96f1-a924978ce142'; // Johny
    const searchTerm = 'Juan';
    
    console.log(`Buscando usuarios con el término: "${searchTerm}"`);
    console.log(`Usuario actual: Johny (${userId})\n`);
    
    const users = await query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.avatar_url,
        u.created_at,
        CASE 
          WHEN f.status = 'accepted' THEN 'friend'
          WHEN f.status = 'pending' AND f.user_id = $1 THEN 'request_sent'
          WHEN f.status = 'pending' AND f.friend_id = $1 THEN 'request_received'
          ELSE 'none'
        END as friendship_status
      FROM users u
      LEFT JOIN friendships f ON 
        (f.user_id = $1 AND f.friend_id = u.id) OR 
        (f.friend_id = $1 AND f.user_id = u.id)
      WHERE 
        u.id != $1 AND
        (LOWER(u.name) LIKE $2 OR LOWER(u.email) LIKE $2)
      ORDER BY u.name
      LIMIT 20`,
      [userId, `%${searchTerm.toLowerCase()}%`]
    );
    
    console.log('Resultados de búsqueda:');
    console.log(JSON.stringify(users.rows, null, 2));
    
    // Probar con otro término
    console.log('\n\nBuscando usuarios con el término: "admin"');
    
    const users2 = await query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.avatar_url,
        u.created_at,
        CASE 
          WHEN f.status = 'accepted' THEN 'friend'
          WHEN f.status = 'pending' AND f.user_id = $1 THEN 'request_sent'
          WHEN f.status = 'pending' AND f.friend_id = $1 THEN 'request_received'
          ELSE 'none'
        END as friendship_status
      FROM users u
      LEFT JOIN friendships f ON 
        (f.user_id = $1 AND f.friend_id = u.id) OR 
        (f.friend_id = $1 AND f.user_id = u.id)
      WHERE 
        u.id != $1 AND
        (LOWER(u.name) LIKE $2 OR LOWER(u.email) LIKE $2)
      ORDER BY u.name
      LIMIT 20`,
      [userId, `%admin%`]
    );
    
    console.log('Resultados de búsqueda:');
    console.log(JSON.stringify(users2.rows, null, 2));
    
    // Probar búsqueda por email
    console.log('\n\nBuscando usuarios con el término: "perseo"');
    
    const users3 = await query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.avatar_url,
        u.created_at,
        CASE 
          WHEN f.status = 'accepted' THEN 'friend'
          WHEN f.status = 'pending' AND f.user_id = $1 THEN 'request_sent'
          WHEN f.status = 'pending' AND f.friend_id = $1 THEN 'request_received'
          ELSE 'none'
        END as friendship_status
      FROM users u
      LEFT JOIN friendships f ON 
        (f.user_id = $1 AND f.friend_id = u.id) OR 
        (f.friend_id = $1 AND f.user_id = u.id)
      WHERE 
        u.id != $1 AND
        (LOWER(u.name) LIKE $2 OR LOWER(u.email) LIKE $2)
      ORDER BY u.name
      LIMIT 20`,
      [userId, `%perseo%`]
    );
    
    console.log('Resultados de búsqueda:');
    console.log(JSON.stringify(users3.rows, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSearch();
