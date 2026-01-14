const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const SALT_ROUNDS = 10;

// Generar URL de avatar usando DiceBear API
const generateAvatarUrl = (email) => {
  const seed = encodeURIComponent(email);
  // Usar PNG para mejor compatibilidad con React Native
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=200`;
};

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios',
        fields: { name: !!name, email: !!email, password: !!password }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 8 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Generar avatar
    const avatarUrl = generateAvatarUrl(email);

    // Insertar nuevo usuario
    const result = await query(
      `INSERT INTO users (name, email, password_hash, birth_date, avatar_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, birth_date, avatar_url, created_at`,
      [name, email.toLowerCase(), passwordHash, birthDate || null, avatarUrl]
    );

    const user = result.rows[0];

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son obligatorios' 
      });
    }

    // Buscar usuario por email
    const result = await query(
      `SELECT id, name, email, password_hash, birth_date, avatar_url, created_at 
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Actualizar último login (opcional)
    await query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      `SELECT id, name, email, birth_date, avatar_url, created_at 
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Error al verificar token:', error);
    res.status(500).json({ error: 'Error al verificar token' });
  }
};

// Actualizar avatar del usuario
const updateAvatar = async (req, res) => {
  try {
    const { avatar_url } = req.body;
    const userId = req.user.userId; // Del middleware de autenticación

    // Validar que se proporcione el avatar_url
    if (!avatar_url) {
      return res.status(400).json({ error: 'URL del avatar es requerida' });
    }

    // Validar formato de URL
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(avatar_url)) {
      return res.status(400).json({ error: 'URL del avatar inválida' });
    }

    // Actualizar el avatar en la base de datos
    const result = await query(
      `UPDATE users 
       SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, name, email, birth_date, avatar_url, created_at, updated_at`,
      [avatar_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    res.json({
      message: 'Avatar actualizado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    res.status(500).json({ error: 'Error al actualizar avatar' });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  updateAvatar,
};
