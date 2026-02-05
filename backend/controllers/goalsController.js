const { query } = require('../config/database');


const getUserGoals = async (req, res) => {
  try {
    const { userId } = req.user; // Del middleware de autenticación
    const { active_only } = req.query;

    let sqlQuery = `
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('day', gd.day_of_week)
          ) FILTER (WHERE gd.id IS NOT NULL),
          '[]'
        ) as days,
        (
          SELECT COUNT(*)
          FROM goal_completions gc
          WHERE gc.goal_id = g.id
        ) as completions_count,
        (
          SELECT COUNT(*)
          FROM goal_completions gc
          WHERE gc.goal_id = g.id
          AND gc.completion_date >= g.start_date
          AND gc.completion_date <= g.end_date
        ) as total_completed_days,
        g.duration_days as total_days
      FROM goals g
      LEFT JOIN goal_days gd ON g.id = gd.goal_id
      WHERE g.user_id = $1
    `;

    const params = [userId];

    if (active_only === 'true') {
      sqlQuery += ` AND g.is_active = true`;
    }

    sqlQuery += `
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `;

    const result = await query(sqlQuery, params);

    // Calcular progreso para cada meta
    const goals = result.rows.map(goal => ({
      ...goal,
      progress: goal.total_days > 0 
        ? Math.round((goal.total_completed_days / goal.total_days) * 100) 
        : 0
    }));

    res.json({
      success: true,
      count: goals.length,
      goals
    });

  } catch (error) {
    console.error('Error al obtener metas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las metas'
    });
  }
};

// ========================================
// OBTENER UNA META POR ID
// ========================================
const getGoalById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const sqlQuery = `
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('day', gd.day_of_week)
          ) FILTER (WHERE gd.id IS NOT NULL),
          '[]'
        ) as days,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', gr.id,
              'reminder_time', gr.reminder_time,
              'is_active', gr.is_active
            )
          ) FILTER (WHERE gr.id IS NOT NULL),
          '[]'
        ) as reminders,
        (
          SELECT COUNT(*)
          FROM goal_completions gc
          WHERE gc.goal_id = g.id
        ) as completions_count,
        (
          SELECT COUNT(*)
          FROM goal_completions gc
          WHERE gc.goal_id = g.id
          AND gc.completion_date >= g.start_date
          AND gc.completion_date <= g.end_date
        ) as total_completed_days,
        g.duration_days as total_days
      FROM goals g
      LEFT JOIN goal_days gd ON g.id = gd.goal_id
      LEFT JOIN goal_reminders gr ON g.id = gr.goal_id
      WHERE g.id = $1 AND g.user_id = $2
      GROUP BY g.id
    `;

    const result = await query(sqlQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    // Calcular progreso
    const goal = result.rows[0];
    goal.progress = goal.total_days > 0 
      ? Math.round((goal.total_completed_days / goal.total_days) * 100) 
      : 0;

    res.json({
      success: true,
      goal: goal
    });

  } catch (error) {
    console.error('Error al obtener meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la meta'
    });
  }
};

// ========================================
// CREAR UNA NUEVA META
// ========================================
const createGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      name,
      description,
      icon,
      color,
      start_date,
      duration_days,
      time_of_day, // Array de horas
      days, // Array de días de la semana [0-6]
      frequency
    } = req.body;

    // Validaciones
    if (!name || !duration_days) {
      return res.status(400).json({
        success: false,
        error: 'El nombre y la duración son obligatorios'
      });
    }

    if (duration_days < 1 || duration_days > 365) {
      return res.status(400).json({
        success: false,
        error: 'La duración debe ser entre 1 y 365 días'
      });
    }

    // Calcular fecha de fin
    const startDate = start_date || new Date().toISOString().split('T')[0];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(duration_days) - 1);

    // Insertar la meta
    const insertGoalQuery = `
      INSERT INTO goals (
        user_id, name, description, icon, color,
        start_date, end_date, duration_days,
        time_of_day, frequency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const goalResult = await query(insertGoalQuery, [
      userId,
      name,
      description || null,
      icon || 'default',
      color || '#3B82F6',
      startDate,
      endDate.toISOString().split('T')[0],
      duration_days,
      time_of_day || [],
      frequency || 'daily'
    ]);

    const goal = goalResult.rows[0];

    // Insertar días de la semana si se proporcionaron
    if (days && Array.isArray(days) && days.length > 0) {
      const dayInsertPromises = days.map(day => {
        return query(
          'INSERT INTO goal_days (goal_id, day_of_week) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [goal.id, day]
        );
      });
      await Promise.all(dayInsertPromises);
    }

    // Crear recordatorios basados en time_of_day
    if (time_of_day && Array.isArray(time_of_day) && time_of_day.length > 0) {
      const reminderInsertPromises = time_of_day.map(time => {
        return query(
          'INSERT INTO goal_reminders (goal_id, reminder_time) VALUES ($1, $2)',
          [goal.id, time]
        );
      });
      await Promise.all(reminderInsertPromises);
    }

    res.status(201).json({
      success: true,
      message: 'Meta creada exitosamente',
      goal
    });

  } catch (error) {
    console.error('Error al crear meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la meta'
    });
  }
};

// ========================================
// ACTUALIZAR UNA META
// ========================================
const updateGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const {
      name,
      description,
      icon,
      color,
      time_of_day,
      days,
      is_active
    } = req.body;

    // Verificar que la meta pertenece al usuario
    const checkQuery = 'SELECT id FROM goals WHERE id = $1 AND user_id = $2';
    const checkResult = await query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    // Actualizar la meta
    const updateQuery = `
      UPDATE goals
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        icon = COALESCE($3, icon),
        color = COALESCE($4, color),
        time_of_day = COALESCE($5, time_of_day),
        is_active = COALESCE($6, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `;

    const updateResult = await query(updateQuery, [
      name,
      description,
      icon,
      color,
      time_of_day,
      is_active,
      id,
      userId
    ]);

    // Actualizar días si se proporcionaron
    if (days && Array.isArray(days)) {
      // Eliminar días existentes
      await query('DELETE FROM goal_days WHERE goal_id = $1', [id]);
      
      // Insertar nuevos días
      if (days.length > 0) {
        const dayInsertPromises = days.map(day => {
          return query(
            'INSERT INTO goal_days (goal_id, day_of_week) VALUES ($1, $2)',
            [id, day]
          );
        });
        await Promise.all(dayInsertPromises);
      }
    }

    res.json({
      success: true,
      message: 'Meta actualizada exitosamente',
      goal: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la meta'
    });
  }
};

// ========================================
// ELIMINAR UNA META
// ========================================
const deleteGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await query(deleteQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Meta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la meta'
    });
  }
};

// ========================================
// MARCAR META COMO COMPLETADA (del día)
// ========================================
const completeGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { date, notes } = req.body;

    // Verificar que la meta pertenece al usuario
    const checkQuery = 'SELECT id, start_date, end_date FROM goals WHERE id = $1 AND user_id = $2';
    const checkResult = await query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    const completionDate = date || new Date().toISOString().split('T')[0];

    // Insertar cumplimiento
    const insertQuery = `
      INSERT INTO goal_completions (goal_id, completion_date, notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (goal_id, completion_date) 
      DO UPDATE SET 
        completed_at = CURRENT_TIMESTAMP,
        notes = EXCLUDED.notes
      RETURNING *
    `;

    const result = await query(insertQuery, [id, completionDate, notes || null]);

    res.json({
      success: true,
      message: 'Meta completada para hoy',
      completion: result.rows[0]
    });

  } catch (error) {
    console.error('Error al completar meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al completar la meta'
    });
  }
};

// ========================================
// DESMARCAR META COMO COMPLETADA
// ========================================
const uncompleteGoal = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { date } = req.body;

    const completionDate = date || new Date().toISOString().split('T')[0];

    // Verificar que la meta pertenece al usuario
    const checkQuery = 'SELECT id FROM goals WHERE id = $1 AND user_id = $2';
    const checkResult = await query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    // Eliminar el cumplimiento
    const deleteQuery = `
      DELETE FROM goal_completions
      WHERE goal_id = $1 AND completion_date = $2
      RETURNING *
    `;

    const result = await query(deleteQuery, [id, completionDate]);

    res.json({
      success: true,
      message: 'Cumplimiento eliminado',
      deleted: result.rows.length > 0
    });

  } catch (error) {
    console.error('Error al desmarcar meta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al desmarcar la meta'
    });
  }
};

// ========================================
// OBTENER HISTORIAL DE CUMPLIMIENTO
// ========================================
const getGoalHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // Verificar que la meta pertenece al usuario
    const checkQuery = 'SELECT id FROM goals WHERE id = $1 AND user_id = $2';
    const checkResult = await query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    // Obtener historial
    const historyQuery = `
      SELECT *
      FROM goal_completions
      WHERE goal_id = $1
      ORDER BY completion_date DESC
    `;

    const result = await query(historyQuery, [id]);

    res.json({
      success: true,
      count: result.rows.length,
      history: result.rows
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el historial'
    });
  }
};

// ========================================
// OBTENER PLANTILLAS DE METAS PREDEFINIDAS
// ========================================
const getGoalTemplates = async (req, res) => {
  try {
    const templatesQuery = `
      SELECT 
        name,
        description,
        icon,
        color,
        duration_days,
        time_of_day,
        frequency
      FROM goals
      WHERE user_id = '00000000-0000-0000-0000-000000000000'
      ORDER BY name ASC
    `;

    const result = await query(templatesQuery);

    res.json({
      success: true,
      count: result.rows.length,
      templates: result.rows
    });

  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las plantillas de metas'
    });
  }
};

// ========================================
// ESTADÍSTICAS DE METAS
// ========================================
const getGoalStats = async (req, res) => {
  try {
    const { userId } = req.user;

    const statsQuery = `
      SELECT 
        COUNT(*) as total_goals,
        COUNT(*) FILTER (WHERE is_active = true) as active_goals,
        COUNT(*) FILTER (WHERE is_completed = true) as completed_goals,
        COALESCE(SUM(
          (SELECT COUNT(*) FROM goal_completions gc WHERE gc.goal_id = g.id)
        ), 0) as total_completions
      FROM goals g
      WHERE g.user_id = $1
    `;

    const result = await query(statsQuery, [userId]);

    res.json({
      success: true,
      stats: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las estadísticas'
    });
  }
};

module.exports = {
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
};
