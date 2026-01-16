// backend/controllers/healthController.js - VERSIÓN CORREGIDA
const HealthCalculator = require('../services/healthCalculator');
const pool = require('../config/database');

const healthController = {
  /**
   * POST /api/health/submit
   * Versión que funciona SIN middleware de auth
   */
  async submitHealthData(req, res) {
    try {
      // OPCIÓN 1: Usar email del body (para pruebas sin auth)
      // OPCIÓN 2: Usar email de req.user (con auth)
      let userEmail;
      
      if (req.body.email) {
        // Si el email viene en el body (modo prueba)
        userEmail = req.body.email;
      } else if (req.user && req.user.email) {
        // Si viene del middleware de auth
        userEmail = req.user.email;
      } else {
        // Error si no hay email
        return res.status(400).json({
          success: false,
          message: 'Email es requerido. Incluye "email" en el body o inicia sesión.'
        });
      }

      const healthData = req.body;

      // Validar que el usuario existe
      const userCheck = await pool.query(
        'SELECT id, email, name FROM users WHERE email = $1',
        [userEmail]
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Validar datos requeridos
      const requiredFields = ['age', 'height_cm', 'weight_kg', 'sleep_hours', 'water_glasses', 'activity_level'];
      const missingFields = requiredFields.filter(field => !healthData[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
          missing: missingFields
        });
      }

      // Calcular valores
      const bmi = HealthCalculator.calculateBMI(
        healthData.weight_kg,
        healthData.height_cm
      );

      const healthScore = HealthCalculator.calculateHealthScore({
        ...healthData,
        bmi
      });

      const recommendations = HealthCalculator.generateRecommendations({
        ...healthData,
        bmi
      });

      // Guardar en la base de datos
      const query = `
        INSERT INTO user_health_data (
          user_email, age, height_cm, weight_kg, 
          sleep_hours, water_glasses, activity_level,
          bmi, health_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (user_email) 
        DO UPDATE SET
          age = EXCLUDED.age,
          height_cm = EXCLUDED.height_cm,
          weight_kg = EXCLUDED.weight_kg,
          sleep_hours = EXCLUDED.sleep_hours,
          water_glasses = EXCLUDED.water_glasses,
          activity_level = EXCLUDED.activity_level,
          bmi = EXCLUDED.bmi,
          health_score = EXCLUDED.health_score,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const values = [
        userEmail,
        healthData.age,
        healthData.height_cm,
        healthData.weight_kg,
        healthData.sleep_hours,
        healthData.water_glasses,
        healthData.activity_level,
        bmi,
        healthScore
      ];

      const result = await pool.query(query, values);
      const savedData = result.rows[0];

      // Preparar respuesta
      const response = {
        success: true,
        message: 'Datos de salud guardados correctamente',
        data: {
          id: savedData.id,
          user_email: savedData.user_email,
          age: savedData.age,
          height_cm: savedData.height_cm,
          weight_kg: savedData.weight_kg,
          bmi: savedData.bmi,
          bmi_category: HealthCalculator.getBMICategory(savedData.bmi),
          sleep_hours: savedData.sleep_hours,
          water_glasses: savedData.water_glasses,
          activity_level: savedData.activity_level,
          health_score: savedData.health_score,
          created_at: savedData.created_at,
          updated_at: savedData.updated_at
        },
        analysis: {
          recommendations,
          score_breakdown: {
            bmi_score: HealthCalculator.calculateHealthScore({ ...healthData, bmi }) - 
              HealthCalculator.calculateHealthScore({ ...healthData, bmi: 24 }), // Estimado
            sleep_score: healthData.sleep_hours >= 7 ? 30 : 
                        healthData.sleep_hours >= 6 ? 20 : 10,
            water_score: healthData.water_glasses >= 8 ? 20 : 
                        healthData.water_glasses >= 6 ? 15 : 10,
            activity_score: { Sedentario: 5, Ligero: 10, Moderado: 15, Activo: 20 }[healthData.activity_level]
          }
        }
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error en submitHealthData:', error);
      res.status(500).json({
        success: false,
        message: 'Error al guardar datos de salud',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  /**
   * GET /api/health/:email?
   * Versión que funciona SIN middleware de auth
   */
  async getHealthData(req, res) {
    try {
      // Obtener email de: parámetro, query string, o body
      let userEmail = req.params.email || req.query.email;
      
      if (!userEmail && req.body && req.body.email) {
        userEmail = req.body.email;
      }

      // Si no hay email, mostrar error
      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email es requerido. Usa: /api/health/:email o incluye ?email= en query'
        });
      }

      const query = `
        SELECT 
          h.*,
          u.name,
          u.birth_date,
          EXTRACT(YEAR FROM AGE(u.birth_date)) as calculated_age
        FROM user_health_data h
        LEFT JOIN users u ON h.user_email = u.email
        WHERE h.user_email = $1
      `;

      const result = await pool.query(query, [userEmail]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron datos de salud para este usuario'
        });
      }

      const healthData = result.rows[0];

      // Generar recomendaciones si hay datos suficientes
      let recommendations = [];
      if (healthData.bmi && healthData.sleep_hours) {
        recommendations = HealthCalculator.generateRecommendations({
          weight_kg: healthData.weight_kg,
          height_cm: healthData.height_cm,
          sleep_hours: healthData.sleep_hours,
          water_glasses: healthData.water_glasses,
          activity_level: healthData.activity_level
        });
      }

      const response = {
        success: true,
        data: {
          user: {
            name: healthData.name,
            email: healthData.user_email,
            birth_date: healthData.birth_date,
            calculated_age: healthData.calculated_age
          },
          health: {
            age: healthData.age,
            height_cm: healthData.height_cm,
            weight_kg: healthData.weight_kg,
            bmi: healthData.bmi,
            bmi_category: healthData.bmi ? HealthCalculator.getBMICategory(healthData.bmi) : null,
            sleep_hours: healthData.sleep_hours,
            water_glasses: healthData.water_glasses,
            activity_level: healthData.activity_level,
            health_score: healthData.health_score,
            created_at: healthData.created_at,
            updated_at: healthData.updated_at
          },
          recommendations
        }
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error en getHealthData:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos de salud',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * PUT /api/health/:email?
   * Versión que funciona SIN middleware de auth
   */
  async updateHealthData(req, res) {
    try {
      // Obtener email de: parámetro, query string, o body
      let userEmail = req.params.email || req.query.email;
      
      if (!userEmail && req.body && req.body.email) {
        userEmail = req.body.email;
      }

      if (!userEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email es requerido para actualizar'
        });
      }

      const updates = req.body;
      delete updates.email; // Eliminar email del body de updates

      // Verificar que existan datos previos
      const existingData = await pool.query(
        'SELECT * FROM user_health_data WHERE user_email = $1',
        [userEmail]
      );

      if (existingData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron datos de salud para actualizar'
        });
      }

      // Combinar datos existentes con actualizaciones
      const currentData = existingData.rows[0];
      const newData = { ...currentData, ...updates };

      // Recalcular BMI si se actualizó peso o altura
      if (updates.weight_kg || updates.height_cm) {
        const weight = updates.weight_kg || currentData.weight_kg;
        const height = updates.height_cm || currentData.height_cm;
        newData.bmi = HealthCalculator.calculateBMI(weight, height);
      }

      // Recalcular health_score si se actualizó algún campo relevante
      const fieldsToRecalc = ['weight_kg', 'height_cm', 'sleep_hours', 'water_glasses', 'activity_level', 'bmi'];
      const shouldRecalc = fieldsToRecalc.some(field => updates[field] !== undefined);

      if (shouldRecalc) {
        newData.health_score = HealthCalculator.calculateHealthScore({
          weight_kg: newData.weight_kg,
          height_cm: newData.height_cm,
          sleep_hours: newData.sleep_hours,
          water_glasses: newData.water_glasses,
          activity_level: newData.activity_level
        });
      }

      // Actualizar en base de datos
      const query = `
        UPDATE user_health_data 
        SET 
          age = COALESCE($2, age),
          height_cm = COALESCE($3, height_cm),
          weight_kg = COALESCE($4, weight_kg),
          sleep_hours = COALESCE($5, sleep_hours),
          water_glasses = COALESCE($6, water_glasses),
          activity_level = COALESCE($7, activity_level),
          bmi = COALESCE($8, bmi),
          health_score = COALESCE($9, health_score),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_email = $1
        RETURNING *;
      `;

      const values = [
        userEmail,
        updates.age || null,
        updates.height_cm || null,
        updates.weight_kg || null,
        updates.sleep_hours || null,
        updates.water_glasses || null,
        updates.activity_level || null,
        newData.bmi || null,
        newData.health_score || null
      ];

      const result = await pool.query(query, values);
      const updatedData = result.rows[0];

      // Generar recomendaciones actualizadas
      const recommendations = HealthCalculator.generateRecommendations({
        weight_kg: updatedData.weight_kg,
        height_cm: updatedData.height_cm,
        sleep_hours: updatedData.sleep_hours,
        water_glasses: updatedData.water_glasses,
        activity_level: updatedData.activity_level
      });

      res.status(200).json({
        success: true,
        message: 'Datos de salud actualizados correctamente',
        data: updatedData,
        recommendations
      });

    } catch (error) {
      console.error('❌ Error en updateHealthData:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar datos de salud',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * GET /api/health/stats
   * Estadísticas generales
   */
  async getHealthStats(req, res) {
    try {
      // Nota: Sin auth, todos pueden ver stats (para pruebas)
      // En producción, agregar verificación de admin

      const statsQuery = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(DISTINCT user_email) as users_with_health_data,
          ROUND(AVG(health_score), 2) as avg_health_score,
          ROUND(AVG(bmi), 2) as avg_bmi,
          ROUND(AVG(sleep_hours), 2) as avg_sleep_hours,
          ROUND(AVG(water_glasses), 2) as avg_water_glasses,
          activity_level,
          COUNT(*) as count_by_activity
        FROM user_health_data
        GROUP BY activity_level
        ORDER BY count_by_activity DESC;
      `;

      const result = await pool.query(statsQuery);

      res.status(200).json({
        success: true,
        stats: {
          summary: {
            total_users_with_data: parseInt(result.rows.reduce((acc, row) => acc + parseInt(row.count_by_activity), 0)),
            average_health_score: parseFloat(result.rows[0]?.avg_health_score || 0),
            average_bmi: parseFloat(result.rows[0]?.avg_bmi || 0),
            average_sleep_hours: parseFloat(result.rows[0]?.avg_sleep_hours || 0),
            average_water_glasses: parseFloat(result.rows[0]?.avg_water_glasses || 0)
          },
          by_activity_level: result.rows.map(row => ({
            activity_level: row.activity_level,
            count: parseInt(row.count_by_activity),
            percentage: Math.round((parseInt(row.count_by_activity) / result.rows.reduce((acc, r) => acc + parseInt(r.count_by_activity), 0)) * 100)
          }))
        }
      });

    } catch (error) {
      console.error('❌ Error en getHealthStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = healthController;