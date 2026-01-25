const { query } = require('../config/database');

// ========================================
// BÚSQUEDA DE USUARIOS
// ========================================

// Buscar usuarios por nombre o email
const searchUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { search } = req.query;

    if (!search || search.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Debes ingresar al menos 2 caracteres para buscar'
      });
    }

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
      [userId, `%${search.toLowerCase()}%`]
    );

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar usuarios'
    });
  }
};

// ========================================
// SOLICITUDES DE AMISTAD
// ========================================

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
    const existing = await query(
      `SELECT * FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) 
       OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una solicitud entre estos usuarios'
      });
    }

    // Crear solicitud
    const result = await query(
      `INSERT INTO friendships (user_id, friend_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [userId, friendId]
    );

    res.json({
      success: true,
      message: 'Solicitud de amistad enviada',
      friendship: result[0]
    });

  } catch (error) {
    console.error('Error al enviar solicitud:', error);
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
    const friendship = await query(
      `SELECT * FROM friendships 
       WHERE id = $1 AND friend_id = $2 AND status = 'pending'`,
      [friendshipId, userId]
    );

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
    console.error('Error al aceptar solicitud:', error);
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
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error al rechazar solicitud'
    });
  }
};

// ========================================
// LISTA DE AMIGOS
// ========================================

// Obtener lista de amigos
const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const friends = await query(
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

    res.json({
      success: true,
      friends
    });

  } catch (error) {
    console.error('Error al obtener amigos:', error);
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

    const requests = await query(
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

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
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
    console.error('Error al eliminar amistad:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar amistad'
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
};
