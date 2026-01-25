const express = require('express');
const router = express.Router();
const {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
} = require('../controllers/friendsController');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Búsqueda de usuarios
router.get('/search', searchUsers);

// Solicitudes de amistad
router.post('/request', sendFriendRequest);
router.put('/request/:friendshipId/accept', acceptFriendRequest);
router.delete('/request/:friendshipId/reject', rejectFriendRequest);

// Lista de amigos
router.get('/', getFriends);
router.get('/pending', getPendingRequests);
router.delete('/:friendId', removeFriend);

module.exports = router;
