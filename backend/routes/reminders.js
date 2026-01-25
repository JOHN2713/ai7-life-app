const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  generateMotivationalMessage,
  createGoalReminder,
  getGoalReminders,
  updateGoalReminder,
  deleteGoalReminder,
  getAllUserReminders,
  getNotificationHistory,
  markNotificationAsRead,
} = require('../controllers/reminderController');

// ========================================
// VALIDACIONES
// ========================================

const validateReminderTime = () => {
  return body('reminderTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('El formato de hora debe ser HH:MM (ej: 14:30)');
};

// ========================================
// RUTAS PÚBLICAS
// ========================================

// Generar mensaje motivacional con IA (puede ser público para testing)
router.post('/generate-message', [
  body('goalName').notEmpty().withMessage('El nombre de la meta es requerido'),
  body('messageType').optional().isIn(['motivacion', 'alerta', 'recordatorio', 'felicitacion', 'animo'])
], generateMotivationalMessage);

// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================

router.use(authenticateToken);

// Obtener todos los recordatorios del usuario
router.get('/user', getAllUserReminders);

// ========================================
// RUTAS DE NOTIFICACIONES (ANTES de las rutas con parámetros)
// ========================================

// Obtener historial de notificaciones
router.get('/notifications/history', getNotificationHistory);

// Marcar notificación como leída
router.put('/notifications/:notificationId/read', markNotificationAsRead);

// ========================================
// RUTAS DE RECORDATORIOS
// ========================================

// Crear recordatorio para una meta
router.post('/', [
  body('goalId').isUUID().withMessage('goalId debe ser un UUID válido'),
  validateReminderTime(),
  body('isActive').optional().isBoolean()
], createGoalReminder);

// Obtener recordatorios de una meta específica
router.get('/goal/:goalId', getGoalReminders);

// Actualizar recordatorio
router.put('/:reminderId', [
  validateReminderTime().optional(),
  body('isActive').optional().isBoolean()
], updateGoalReminder);

// Eliminar recordatorio
router.delete('/:reminderId', deleteGoalReminder);

module.exports = router;
