// backend/middleware/validation/healthValidation.js
const validateHealthData = (req, res, next) => {
  const data = req.body;
  const errors = [];

  // Validación de edad
  if (data.age === undefined || data.age === null) {
    errors.push('La edad es requerida');
  } else if (data.age < 15 || data.age > 80) {
    errors.push('La edad debe estar entre 15 y 80 años');
  }

  // Validación de altura
  if (data.height_cm === undefined || data.height_cm === null) {
    errors.push('La altura es requerida');
  } else if (data.height_cm < 100 || data.height_cm > 250) {
    errors.push('La altura debe estar entre 100 y 250 cm');
  }

  // Validación de peso
  if (data.weight_kg === undefined || data.weight_kg === null) {
    errors.push('El peso es requerido');
  } else if (data.weight_kg < 30 || data.weight_kg > 300) {
    errors.push('El peso debe estar entre 30 y 300 kg');
  }

  // Validación de horas de sueño
  if (data.sleep_hours === undefined || data.sleep_hours === null) {
    errors.push('Las horas de sueño son requeridas');
  } else if (data.sleep_hours < 4 || data.sleep_hours > 12) {
    errors.push('Las horas de sueño deben estar entre 4 y 12 horas');
  }

  // Validación de vasos de agua
  if (data.water_glasses === undefined || data.water_glasses === null) {
    errors.push('Los vasos de agua son requeridos');
  } else if (data.water_glasses < 0 || data.water_glasses > 12) {
    errors.push('Los vasos de agua deben estar entre 0 y 12');
  }

  // Validación de nivel de actividad
  const validActivities = ['Sedentario', 'Ligero', 'Moderado', 'Activo'];
  if (!data.activity_level || !validActivities.includes(data.activity_level)) {
    errors.push(`El nivel de actividad debe ser uno de: ${validActivities.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

module.exports = { validateHealthData };