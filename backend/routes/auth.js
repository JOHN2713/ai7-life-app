const express = require('express');
const router = express.Router();
const { register, login, verifyToken, updateAvatar } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken);

// PUT /api/auth/avatar - Actualizar avatar (requiere autenticación)
router.put('/avatar', authenticateToken, updateAvatar);

module.exports = router;
