const express = require('express');
const router = express.Router();
const { register, login, verifyToken, updateAvatar, getUsers } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken);

// NUEVA RUTA: GET /api/auth/users - Obtener lista de usuarios para amigos
router.get('/users', getUsers);

// PUT /api/auth/avatar - Actualizar avatar (requiere autenticación)
router.put('/avatar', authenticateToken, updateAvatar);

module.exports = router;
