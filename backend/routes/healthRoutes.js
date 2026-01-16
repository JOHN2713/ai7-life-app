// backend/routes/healthRoutes.js - Versión corregida
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { validateHealthData } = require('../middleware/validation/healthValidation');

// Middleware de autenticación
//const authMiddleware = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
//router.use(authMiddleware);

// Rutas
router.post('/submit', validateHealthData, healthController.submitHealthData);
router.get('/', healthController.getHealthData);
router.get('/:email', healthController.getHealthData);
router.put('/', healthController.updateHealthData);
router.put('/:email', healthController.updateHealthData);
router.get('/stats/summary', healthController.getHealthStats);

// Ruta de verificación
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Módulo de salud funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;