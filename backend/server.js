const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/healthRoutes');

const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/user-chat', require('./routes/userChat'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 AI7 Life API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Ruta de health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    message: 'AI7 Life Health Module API',
    endpoints: {
      submit: 'POST /api/health/submit',
      getData: 'GET /api/health',
      update: 'PUT /api/health',
      stats: 'GET /api/health/stats (admin)'
    },
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  Servidor iniciado pero sin conexión a la base de datos');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Servidor corriendo en:`);
      console.log(`   http://localhost:${PORT}`);
      console.log(`   http://192.168.100.13:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`\n📍 Endpoints disponibles:`);
      console.log(`   GET  /              - Información del API`);
      console.log(`   GET  /health        - Health check`);
      console.log(`   POST /api/auth/register - Registrar usuario`);
      console.log(`   POST /api/auth/login    - Iniciar sesión`);
      console.log(`\n✨ Listo para recibir peticiones!\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
