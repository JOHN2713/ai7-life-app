class HealthCalculator {
  /**
   * Calcula el IMC (Índice de Masa Corporal)
   * @param {number} weight_kg - Peso en kilogramos
   * @param {number} height_cm - Altura en centímetros
   * @returns {number} IMC redondeado a 2 decimales
   */
  static calculateBMI(weight_kg, height_cm) {
    const heightM = height_cm / 100;
    const bmi = weight_kg / (heightM * heightM);
    return Math.round(bmi * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Calcula la puntuación de salud (0-100)
   * @param {Object} data - Datos de salud
   * @returns {number} Puntuación total
   */
  static calculateHealthScore(data) {
    let score = 0;
    const bmi = this.calculateBMI(data.weight_kg, data.height_cm);

    // 1. PUNTUACIÓN IMC (30 puntos máx)
    if (bmi >= 18.5 && bmi <= 24.9) {
      score += 30; // Saludable
    } else if ((bmi >= 17 && bmi < 18.5) || (bmi > 24.9 && bmi <= 27)) {
      score += 20; // Bajo peso leve o sobrepeso leve
    } else if ((bmi >= 16 && bmi < 17) || (bmi > 27 && bmi <= 30)) {
      score += 10; // Moderado
    } else {
      score += 5; // Necesita atención
    }

    // 2. PUNTUACIÓN SUEÑO (30 puntos máx)
    if (data.sleep_hours >= 7 && data.sleep_hours <= 9) {
      score += 30; // Óptimo (7-9 horas)
    } else if (data.sleep_hours >= 6 && data.sleep_hours < 7) {
      score += 20; // Aceptable (6-7 horas)
    } else if (data.sleep_hours >= 5 && data.sleep_hours < 6) {
      score += 10; // Insuficiente (5-6 horas)
    } else {
      score += 5; // Muy insuficiente
    }

    // 3. PUNTUACIÓN AGUA (20 puntos máx)
    if (data.water_glasses >= 8) {
      score += 20; // Óptimo (8+ vasos)
    } else if (data.water_glasses >= 6) {
      score += 15; // Bueno (6-7 vasos)
    } else if (data.water_glasses >= 4) {
      score += 10; // Regular (4-5 vasos)
    } else {
      score += 5; // Bajo (0-3 vasos)
    }

    // 4. PUNTUACIÓN ACTIVIDAD (20 puntos máx)
    const activityPoints = {
      'Sedentario': 5,
      'Ligero': 10,
      'Moderado': 15,
      'Activo': 20
    };
    score += activityPoints[data.activity_level] || 5;

    // Asegurar que no pase de 100
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Genera recomendaciones personalizadas
   * @param {Object} data - Datos de salud
   * @returns {Array} Lista de recomendaciones
   */
  static generateRecommendations(data) {
    const recommendations = [];
    const bmi = this.calculateBMI(data.weight_kg, data.height_cm);

    // Recomendaciones basadas en IMC
    if (bmi > 30) {
      recommendations.push({
        type: 'IMC',
        priority: 'alta',
        message: 'Tu IMC indica obesidad. Recomendamos consultar con un nutricionista y aumentar la actividad física gradualmente.'
      });
    } else if (bmi > 25) {
      recommendations.push({
        type: 'IMC',
        priority: 'media',
        message: 'Tienes sobrepeso. Te sugerimos reducir 300-500 calorías diarias y hacer ejercicio moderado 3-4 veces por semana.'
      });
    } else if (bmi < 18.5) {
      recommendations.push({
        type: 'IMC',
        priority: 'media',
        message: 'Tu peso está por debajo de lo recomendado. Asegúrate de consumir suficientes proteínas y calorías nutritivas.'
      });
    }

    // Recomendaciones basadas en sueño
    if (data.sleep_hours < 6) {
      recommendations.push({
        type: 'Sueño',
        priority: 'alta',
        message: 'Duermes menos de 6 horas. Para una salud óptima, intenta dormir 7-9 horas. Crea una rutina antes de dormir y evita pantallas 1 hora antes.'
      });
    } else if (data.sleep_hours > 9) {
      recommendations.push({
        type: 'Sueño',
        priority: 'baja',
        message: 'Duermes más de 9 horas. Aunque el descanso es importante, dormir en exceso puede afectar tu energía. Intenta mantener 7-9 horas.'
      });
    }

    // Recomendaciones basadas en agua
    if (data.water_glasses < 8) {
      recommendations.push({
        type: 'Hidratación',
        priority: 'media',
        message: `Tomas ${data.water_glasses} vasos de agua. Intenta llegar a 8 vasos diarios. Lleva una botella de agua contigo y toma un vaso antes de cada comida.`
      });
    }

    // Recomendaciones basadas en actividad
    if (data.activity_level === 'Sedentario') {
      recommendations.push({
        type: 'Actividad',
        priority: 'alta',
        message: 'Eres sedentario. Comienza con 15-20 minutos de caminata diaria. Cada semana aumenta 5 minutos hasta llegar a 30 minutos al día.'
      });
    } else if (data.activity_level === 'Ligero') {
      recommendations.push({
        type: 'Actividad',
        priority: 'media',
        message: 'Tu actividad es ligera. Intenta incluir 2-3 días de ejercicio moderado por semana, como natación, ciclismo o yoga.'
      });
    }

    // Recomendación positiva si todo está bien
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'General',
        priority: 'baja',
        message: '¡Excelentes hábitos! Tu estilo de vida es saludable. Mantén esta rutina y considera agregar variedad a tu ejercicio.'
      });
    }

    return recommendations;
  }

  /**
   * Obtiene la categoría del IMC
   * @param {number} bmi 
   * @returns {string} Categoría
   */
  static getBMICategory(bmi) {
    if (bmi < 16) return 'Delgadez severa';
    if (bmi < 17) return 'Delgadez moderada';
    if (bmi < 18.5) return 'Delgadez leve';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidad grado I';
    if (bmi < 40) return 'Obesidad grado II';
    return 'Obesidad grado III';
  }
}

module.exports = HealthCalculator;