const express = require('express');
const router = express.Router();
const { sendMessage, getWelcomeMessage } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/chat/message - Enviar mensaje al chat (requiere autenticación)
router.post('/message', authenticateToken, sendMessage);

// GET /api/chat/welcome - Obtener mensaje de bienvenida
router.get('/welcome', authenticateToken, getWelcomeMessage);

module.exports = router;