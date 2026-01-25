const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getUserGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  uncompleteGoal,
  getGoalHistory,
  getGoalTemplates,
  getGoalStats
} = require('../controllers/goalsController');

// ========================================
// VALIDACIONES
// ========================================

const validateCreateGoal = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 255 })
    .withMessage('El nombre no puede exceder 255 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('duration_days')
    .notEmpty()
    .withMessage('La duración es obligatoria')
    .isInt({ min: 1, max: 365 })
    .withMessage('La duración debe ser entre 1 y 365 días'),
  
  body('time_of_day')
    .optional()
    .isArray()
    .withMessage('time_of_day debe ser un array'),
  
  body('days')
    .optional()
    .isArray()
    .withMessage('days debe ser un array'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El icono no puede exceder 100 caracteres'),
  
  body('color')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('El color debe estar en formato hex (#RRGGBB)'),
  
  body('frequency')
    .optional()
    .isIn(['daily', 'custom'])
    .withMessage('La frecuencia debe ser daily o custom')
];

const validateUpdateGoal = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El nombre no puede exceder 255 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('time_of_day')
    .optional()
    .isArray()
    .withMessage('time_of_day debe ser un array'),
  
  body('days')
    .optional()
    .isArray()
    .withMessage('days debe ser un array'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active debe ser booleano')
];

const validateGoalId = [
  param('id')
    .notEmpty()
    .withMessage('El ID de la meta es obligatorio')
    .isUUID()
    .withMessage('El ID debe ser un UUID válido')
];

const validateCompleteGoal = [
  body('date')
    .optional()
    .isDate()
    .withMessage('La fecha debe ser válida (YYYY-MM-DD)'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
];

// ========================================
// RUTAS PÚBLICAS (sin autenticación)
// ========================================

// Obtener plantillas de metas predefinidas
router.get('/templates', getGoalTemplates);

// ========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ========================================

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(authenticateToken);

// Obtener todas las metas del usuario
// Query params: ?active_only=true
router.get('/', getUserGoals);

// Obtener estadísticas de metas del usuario
router.get('/stats', getGoalStats);

// Obtener una meta específica por ID
router.get('/:id', validateGoalId, getGoalById);

// Obtener historial de cumplimiento de una meta
router.get('/:id/history', validateGoalId, getGoalHistory);

// Crear una nueva meta
router.post('/', validateCreateGoal, createGoal);

// Actualizar una meta existente
router.put('/:id', [...validateGoalId, ...validateUpdateGoal], updateGoal);

// Eliminar una meta
router.delete('/:id', validateGoalId, deleteGoal);

// Marcar meta como completada (para una fecha específica)
router.post('/:id/complete', [...validateGoalId, ...validateCompleteGoal], completeGoal);

// Desmarcar meta como completada
router.post('/:id/uncomplete', [...validateGoalId, ...validateCompleteGoal], uncompleteGoal);

module.exports = router;
