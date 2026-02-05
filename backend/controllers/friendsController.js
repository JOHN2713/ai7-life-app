const { query } = require('../config/database');

// Buscar usuarios por nombre o email
const searchUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { search } = req.query;

    console.log(' [Friends Controller] Búsqueda de usuarios');
    console.log('   Usuario que busca:', userId);
    console.log('   Término de búsqueda:', search);

    if (!search || search.trim().length < 2) {
      console.log(' Búsqueda rechazada: menos de 2 caracteres');
      return res.status(400).json({
        success: false,
        error: 'Debes ingresar al menos 2 caracteres para buscar'
      });
    }

    const result = await query(
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
      [userId, `%${search.toLowerCase()}%`]
    );

    const users = result.rows || result;
    console.log(' Usuarios encontrados:', users.length);
    users.forEach(u => console.log(`      - ${u.name} (${u.email}) - ${u.friendship_status}`));

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('[Friends Controller] Error al buscar usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar usuarios'
    });
  }
};

// Enviar solicitud de amistad
const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        success: false,
        error: 'El ID del amigo es requerido'
      });
    }

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        error: 'No puedes enviarte una solicitud a ti mismo'
      });
    }

    // Verificar si ya existe una solicitud
    const existingResult = await query(
      `SELECT * FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) 
       OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );
    const existing = existingResult.rows || existingResult;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una solicitud entre estos usuarios'
      });
    }

    // Crear solicitud
    const insertResult = await query(
      `INSERT INTO friendships (user_id, friend_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [userId, friendId]
    );
    const result = insertResult.rows || insertResult;

    res.json({
      success: true,
      message: 'Solicitud de amistad enviada',
      friendship: result[0]
    });

  } catch (error) {
    console.error('[Friends Controller] Error al enviar solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error al enviar solicitud de amistad'
    });
  }
};

// Aceptar solicitud de amistad
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendshipId } = req.params;

    // Verificar que la solicitud existe y es para el usuario actual
    const friendshipResult = await query(
      `SELECT * FROM friendships 
       WHERE id = $1 AND friend_id = $2 AND status = 'pending'`,
      [friendshipId, userId]
    );
    const friendship = friendshipResult.rows || friendshipResult;

    if (friendship.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    // Actualizar estado
    await query(
      `UPDATE friendships 
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [friendshipId]
    );

    res.json({
      success: true,
      message: 'Solicitud aceptada'
    });

  } catch (error) {
    console.error('[Friends Controller] Error al aceptar solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error al aceptar solicitud'
    });
  }
};

// Rechazar solicitud de amistad
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendshipId } = req.params;

    await query(
      `DELETE FROM friendships 
       WHERE id = $1 AND friend_id = $2 AND status = 'pending'`,
      [friendshipId, userId]
    );

    res.json({
      success: true,
      message: 'Solicitud rechazada'
    });

  } catch (error) {
    console.error('[Friends Controller] Error al rechazar solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error al rechazar solicitud'
    });
  }
};

// Obtener lista de amigos
const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const friendsResult = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar_url,
        f.created_at as friends_since
      FROM friendships f
      INNER JOIN users u ON 
        (f.friend_id = u.id AND f.user_id = $1) OR
        (f.user_id = u.id AND f.friend_id = $1)
      WHERE f.status = 'accepted' AND u.id != $1
      ORDER BY u.name`,
      [userId]
    );
    const friends = friendsResult.rows || friendsResult;

    res.json({
      success: true,
      friends
    });

  } catch (error) {
    console.error('[Friends Controller] Error al obtener amigos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener lista de amigos'
    });
  }
};

// Obtener solicitudes pendientes
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requestsResult = await query(
      `SELECT 
        f.id as friendship_id,
        u.id as user_id,
        u.name,
        u.email,
        u.avatar_url,
        f.created_at
      FROM friendships f
      INNER JOIN users u ON f.user_id = u.id
      WHERE f.friend_id = $1 AND f.status = 'pending'
      ORDER BY f.created_at DESC`,
      [userId]
    );
    const requests = requestsResult.rows || requestsResult;

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('[Friends Controller] Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener solicitudes pendientes'
    });
  }
};

// Eliminar amistad
const removeFriend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;

    await query(
      `DELETE FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR 
              (user_id = $2 AND friend_id = $1)) 
       AND status = 'accepted'`,
      [userId, friendId]
    );

    res.json({
      success: true,
      message: 'Amistad eliminada'
    });

  } catch (error) {
    console.error('[Friends Controller] Error al eliminar amistad:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar amistad'
    });
  }
};

// ========================================
// MENSAJERÍA ENTRE AMIGOS
// ========================================

// Enviar mensaje a un amigo
const sendMessageToFriend = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, message } = req.body;

    console.log('[Friends Controller] Enviando mensaje');
    console.log('   De:', senderId);
    console.log('   Para:', receiverId);

    if (!receiverId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El ID del receptor y el mensaje son requeridos'
      });
    }

    // Verificar que son amigos
    const friendshipResult = await query(
      `SELECT * FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR 
              (user_id = $2 AND friend_id = $1)) 
       AND status = 'accepted'`,
      [senderId, receiverId]
    );
    const friendship = friendshipResult.rows || friendshipResult;

    if (friendship.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'No son amigos'
      });
    }

    // Insertar mensaje
    const messageResult = await query(
      `INSERT INTO friend_messages (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [senderId, receiverId, message.trim()]
    );
    const newMessage = (messageResult.rows || messageResult)[0];

    console.log('Mensaje enviado:', newMessage.id);

    res.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('[Friends Controller] Error al enviar mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error al enviar mensaje'
    });
  }
};

// Obtener conversación con un amigo
const getConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    console.log('[Friends Controller] Obteniendo conversación');
    console.log('   Usuario:', userId);
    console.log('   Amigo:', friendId);

    // Verificar que son amigos
    const friendshipResult = await query(
      `SELECT * FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR 
              (user_id = $2 AND friend_id = $1)) 
       AND status = 'accepted'`,
      [userId, friendId]
    );
    const friendship = friendshipResult.rows || friendshipResult;

    if (friendship.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'No son amigos'
      });
    }

    // Obtener mensajes
    const messagesResult = await query(
      `SELECT 
        m.*,
        s.name as sender_name,
        s.avatar_url as sender_avatar
       FROM friend_messages m
       INNER JOIN users s ON m.sender_id = s.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId, friendId, limit, offset]
    );
    const messages = (messagesResult.rows || messagesResult).reverse(); // Invertir para mostrar más antiguos primero

    // Marcar mensajes como leídos
    await query(
      `UPDATE friend_messages 
       SET is_read = TRUE 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE`,
      [userId, friendId]
    );

    console.log('Mensajes obtenidos:', messages.length);

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('[Friends Controller] Error al obtener conversación:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener conversación'
    });
  }
};

// Obtener lista de conversaciones (con último mensaje)
const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('[Friends Controller] Obteniendo conversaciones');
    console.log('   Usuario:', userId);

    const conversationsResult = await query(
      `SELECT DISTINCT ON (friend_id)
        f.id as friend_id,
        f.name,
        f.email,
        f.avatar_url,
        m.message as last_message,
        m.created_at as last_message_time,
        m.sender_id = $1 as is_sent,
        (SELECT COUNT(*) FROM friend_messages 
         WHERE receiver_id = $1 AND sender_id = f.id AND is_read = FALSE) as unread_count
       FROM (
         SELECT u.id, u.name, u.email, u.avatar_url
         FROM friendships fs
         INNER JOIN users u ON 
           (fs.friend_id = u.id AND fs.user_id = $1) OR
           (fs.user_id = u.id AND fs.friend_id = $1)
         WHERE fs.status = 'accepted' AND u.id != $1
       ) f
       LEFT JOIN friend_messages m ON 
         (m.sender_id = $1 AND m.receiver_id = f.id) OR 
         (m.sender_id = f.id AND m.receiver_id = $1)
       ORDER BY f.id, m.created_at DESC NULLS LAST`,
      [userId]
    );
    const conversations = conversationsResult.rows || conversationsResult;

    console.log('Conversaciones encontradas:', conversations.length);

    res.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error('[Friends Controller] Error al obtener conversaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener conversaciones'
    });
  }
};

// Marcar mensajes como leídos
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.params;

    await query(
      `UPDATE friend_messages 
       SET is_read = TRUE 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE`,
      [userId, friendId]
    );

    res.json({
      success: true,
      message: 'Mensajes marcados como leídos'
    });

  } catch (error) {
    console.error('[Friends Controller] Error al marcar mensajes como leídos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al marcar mensajes como leídos'
    });
  }
};

// Obtener total de mensajes no leídos
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM friend_messages
       WHERE receiver_id = $1 AND is_read = FALSE`,
      [userId]
    );
    const count = (countResult.rows || countResult)[0];

    // También obtener conteo por amigo
    const byFriendResult = await query(
      `SELECT 
        sender_id as friend_id,
        COUNT(*) as count
       FROM friend_messages
       WHERE receiver_id = $1 AND is_read = FALSE
       GROUP BY sender_id`,
      [userId]
    );
    const byFriend = byFriendResult.rows || byFriendResult;

    res.json({
      success: true,
      total: parseInt(count.total) || 0,
      byFriend: byFriend.reduce((acc, item) => {
        acc[item.friend_id] = parseInt(item.count);
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('[Friends Controller] Error al obtener mensajes no leídos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener mensajes no leídos'
    });
  }
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
  sendMessageToFriend,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount,
};
