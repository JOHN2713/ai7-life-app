const { GoogleGenerativeAI } = require('@google/generative-ai');
const { query } = require('../config/database');

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Controller para Recordatorios con IA
 */

// ========================================
// MENSAJES PREDEFINIDOS (FALLBACK)
// ========================================
const PREDEFINED_MESSAGES = {
  motivacion: [
    '¡Es tu momento de brillar! {goal} te acerca a tu mejor versión cada día 💪✨',
    'Hoy es el día perfecto para dar lo mejor en {goal}. ¡Tú puedes lograrlo! 🌟🚀',
    '¡Vamos con todo! Cada esfuerzo en {goal} cuenta para tu éxito. Dale! 🔥💪',
    'Tu mejor versión está esperándote. {goal} es tu camino hacia la grandeza 🌟💫',
    '¡A brillar hoy! {goal} es tu oportunidad de ser increíble. ¡Adelante! ✨🎯',
    'Cada día es una nueva oportunidad para {goal}. ¡Hazlo con pasión! 💚🌱',
    '¡Tú puedes! {goal} está al alcance de tus manos. Da el primer paso hoy 🚀💪',
    'Hagámoslo realidad! {goal} es tu compromiso contigo mismo. ¡Vamos! 🔥⚡'
  ],
  recordatorio: [
    '⏰ Recordatorio amistoso: es momento de {goal}. ¡Tú puedes hacerlo! 💚',
    '🔔 Hey! No olvides {goal}. Tu yo del futuro te lo agradecerá 🙌',
    '⏰ Momento perfecto para {goal}. Tu meta te está esperando 🎯',
    '🔔 Es hora de {goal}. Cada paso cuenta hacia tu objetivo 💪',
    '⏰ Recordatorio: {goal} es ahora. ¡Dale con confianza! ✨',
    '🔔 No lo pospongas más. {goal} te espera para brillar hoy 🌟',
    '⏰ Tu compromiso: {goal}. Hazlo realidad en este momento 🚀',
    '🔔 Hora programada: {goal}. Demuestra de qué estás hecho 💪'
  ],
  alerta: [
    '⚡ ¡Alerta! Es hora de cumplir con {goal}. ¡No dejes pasar esta oportunidad! 💪',
    '⏰ ¡Atención! {goal} es ahora. Tu determinación te llevará al éxito 🔥',
    '⚠️ ¡No lo olvides! {goal} te espera. Es tu momento de actuar 🚀',
    '⏰ ¡Importante! {goal} hoy es clave para tu progreso. ¡Vamos! 💯',
    '⚡ ¡Recuerda! {goal} es tu prioridad ahora. ¡Hazlo suceder! ⚡',
    '⏰ ¡Urgente! {goal} pendiente. Tu compromiso cuenta hoy más que nunca 🎯',
    '⚠️ ¡Hey! {goal} te está llamando. No dejes para después ✨',
    '⏰ ¡Última llamada! {goal} es ahora o nunca. ¡Demuéstralo! 💪'
  ],
  felicitacion: [
    '🎉 ¡INCREÍBLE! {goal} completado. Tu dedicación es inspiradora. ¡Sigue así! 🏆✨',
    '🌟 ¡GENIAL! {goal} logrado con éxito. Estás imparable, sigue brillando 💪🔥',
    '🎊 ¡EXCELENTE! {goal} cumplido. Tu esfuerzo vale oro. ¡Celebra este logro! 🏅✨',
    '🏆 ¡BRAVO! {goal} conquistado. Eres un ejemplo de perseverancia 🌟💚',
    '✨ ¡FANTÁSTICO! {goal} hecho realidad. Tu constancia da frutos 🎯🚀',
    '🎉 ¡CRACK! {goal} superado con éxito. Sigue cosechando victorias 💪⚡',
    '🌟 ¡IMPRESIONANTE! {goal} alcanzado. Tu disciplina inspira a otros 🏆💫',
    '👏 ¡MUY BIEN! {goal} completado. Cada logro te hace más fuerte 💚✨'
  ],
  animo: [
    '💫 No pasa nada. Mañana es una nueva oportunidad para {goal}. ¡Confío en ti! 💚',
    '🌟 Está bien, todos tenemos días difíciles. {goal} te espera mañana con nuevas fuerzas 🌱',
    '💚 Sigue adelante, no te rindas. {goal} es un proceso, no una carrera ✨',
    '✨ Cada día es un nuevo comienzo para {goal}. Lo importante es levantarse 💪',
    '🌱 Paso a paso llegarás. {goal} requiere paciencia y constancia 🌟',
    '💪 No te desanimes. {goal} sigue ahí esperándote. ¡Mañana lo lograrás! 💫',
    '🌟 Tu esfuerzo vale, aunque hoy no salió. {goal} es tuyo, solo sigue intentando 💚',
    '💫 Respira y confía. {goal} será tuyo. El progreso no es lineal ✨🌱'
  ]
};

// ========================================
// GENERAR MENSAJE MOTIVACIONAL CON IA
// ========================================
const generateMotivationalMessage = async (req, res) => {
  try {
    const { goalName, messageType = 'motivacion', userName } = req.body;

    if (!goalName) {
      return res.status(400).json({
        success: false,
        error: 'El nombre de la meta es requerido'
      });
    }

    let message = '';
    let usedAI = false;

    // Intentar generar con IA si hay API key
    if (process.env.GEMINI_API_KEY) {
      try {
        // Prompts mejorados para mensajes más elaborados
        const prompts = {
          motivacion: `Eres un coach de vida motivacional y empático. Genera un mensaje inspirador y personalizado (entre 80-120 caracteres) para${userName ? ` ${userName}` : ' alguien'} que está comprometido con su meta de: "${goalName}".

Requisitos:
- Usa un tono cercano, motivador y positivo
- Hazlo sentir capaz y entusiasmado
- Incluye 1-2 emojis relevantes y motivadores
- Personaliza el mensaje para esta meta específica
- Menciona un beneficio o resultado positivo
- NO uses comillas, solo el mensaje directo

Ejemplos del estilo deseado:
"¡${userName || 'Campeón'}, cada paso cuenta! Tu meta de ${goalName} te acerca a tu mejor versión 💪✨"
"¡Hoy es tu día para brillar! ${goalName} es tu camino hacia el éxito que mereces 🌟🚀"`,
          
          alerta: `Eres un asistente personal amable pero firme. Genera un mensaje de recordatorio motivador (entre 70-110 caracteres) para${userName ? ` ${userName}` : ' alguien'} sobre su meta: "${goalName}".

Requisitos:
- Usa un tono amigable pero que incentive la acción inmediata
- Incluye sensación de urgencia positiva (sin presionar negativamente)
- Agrega 1-2 emojis de alerta/tiempo
- Hazlo sentir que es el momento perfecto para actuar
- NO uses comillas, solo el mensaje directo

Ejemplos del estilo deseado:
"⏰ ${userName || 'Hey'}, es el momento! Tu compromiso con ${goalName} te está esperando. ¡Vamos! 💪"
"⚡ No dejes pasar la oportunidad! ${goalName} es ahora. Tu yo del futuro te lo agradecerá 🙌"`,
          
          recordatorio: `Eres un recordatorio amigable y cercano. Genera un mensaje de recordatorio personalizado (entre 70-100 caracteres) para${userName ? ` ${userName}` : ' alguien'} sobre: "${goalName}".

Requisitos:
- Tono amable, directo y positivo
- Recuérdalo de forma natural y cálida
- Incluye 1-2 emojis apropiados
- Haz que suene como un amigo recordándole algo importante
- NO uses comillas, solo el mensaje directo

Ejemplos del estilo deseado:
"🔔 ${userName || 'Hola'}! Recordatorio amigable: es momento de ${goalName}. ¡Tú puedes! 💚"
"⏰ ${userName || 'Hey amigo'}, tu meta ${goalName} está esperándote. ¡Dale! 🎯"`,

          felicitacion: `Eres un coach celebrando un logro importante. Genera un mensaje de felicitación entusiasta (entre 80-120 caracteres) para${userName ? ` ${userName}` : ' alguien'} que completó su meta: "${goalName}".

Requisitos:
- Celebra el logro con genuino entusiasmo
- Reconoce el esfuerzo y la dedicación
- Incluye 2-3 emojis de celebración
- Hazlo sentir orgulloso y motivado para continuar
- NO uses comillas, solo el mensaje directo

Ejemplos del estilo deseado:
"🎉 ¡INCREÍBLE ${userName || 'campeón'}! Completaste ${goalName}. Tu dedicación es inspiradora 🏆✨💪"
"🌟 ¡WOW! ${goalName} cumplido. Eres imparable${userName ? ` ${userName}` : ''}! Celebra este logro 🎊🔥"`,

          animo: `Eres un coach empático y comprensivo. Genera un mensaje de ánimo reconfortante (entre 80-120 caracteres) para${userName ? ` ${userName}` : ' alguien'} que no completó su meta: "${goalName}" hoy.

Requisitos:
- Sé empático y comprensivo (sin juzgar)
- Motiva a seguir intentando con optimismo
- Recuérdele que los contratiempos son normales
- Incluye 1-2 emojis cálidos y positivos
- Transmite esperanza y confianza
- NO uses comillas, solo el mensaje directo

Ejemplos del estilo deseado:
"💫 ${userName || 'Hey'}, está bien. Mañana es una nueva oportunidad para ${goalName}. ¡Confío en ti! 💚"
"🌟 No te preocupes${userName ? ` ${userName}` : ''}. Cada día es un nuevo comienzo. ${goalName} te espera 🌱✨"`
        };

        const selectedPrompt = prompts[messageType] || prompts.motivacion;

        // Configurar el modelo (mismo que el chat)
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.9, // Aumentar creatividad
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200, // Aumentar límite para mensajes más largos
          }
        });

        // Generar mensaje con timeout de 10 segundos (más tiempo para mensajes elaborados)
        const result = await Promise.race([
          model.generateContent(selectedPrompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);

        const response = await result.response;
        message = response.text().trim();
        message = message.replace(/^["']|["']$/g, '');
        usedAI = true;

        console.log(`🤖 Mensaje ${messageType} generado con IA:`, message);

      } catch (aiError) {
        console.warn('⚠️ Error al usar IA, usando mensaje predefinido:', aiError.message);
        // Continuar con fallback
      }
    }

    // Usar mensaje predefinido si la IA falló o no hay API key
    if (!message) {
      const messageTemplates = PREDEFINED_MESSAGES[messageType] || PREDEFINED_MESSAGES.motivacion;
      const randomTemplate = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      message = randomTemplate.replace('{goal}', goalName);
      
      if (userName && messageType === 'motivacion') {
        message = message.replace('¡', `¡${userName}, `);
      }

      console.log(`📝 Mensaje ${messageType} predefinido:`, message);
    }

    res.json({
      success: true,
      message,
      messageType,
      generatedWithAI: usedAI
    });

  } catch (error) {
    console.error('Error al generar mensaje motivacional:', error);
    
    // Fallback final
    const { goalName, messageType = 'motivacion' } = req.body;
    const messageTemplates = PREDEFINED_MESSAGES[messageType] || PREDEFINED_MESSAGES.motivacion;
    const fallbackMessage = messageTemplates[0].replace('{goal}', goalName || 'tu meta');

    res.json({
      success: true,
      message: fallbackMessage,
      messageType,
      generatedWithAI: false,
      warning: 'Usando mensaje predefinido debido a un error'
    });
  }
};

// ========================================
// CREAR RECORDATORIO PARA UNA META
// ========================================
const createGoalReminder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { goalId, reminderTime, isActive = true, message = null, messageType = 'motivacion' } = req.body;

    if (!goalId || !reminderTime) {
      return res.status(400).json({
        success: false,
        error: 'goalId y reminderTime son requeridos'
      });
    }

    // Verificar que la meta pertenece al usuario
    const goalCheck = await query(
      'SELECT id, name FROM goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );

    if (goalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    const goalName = goalCheck.rows[0].name;

    // Si no se proporciona mensaje, generar uno
    let finalMessage = message;
    if (!finalMessage) {
      // Usar mensaje predefinido
      const messageTemplates = PREDEFINED_MESSAGES[messageType] || PREDEFINED_MESSAGES.motivacion;
      const randomTemplate = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      finalMessage = randomTemplate.replace('{goal}', goalName);
    }

    // Insertar recordatorio con mensaje
    const result = await query(
      `INSERT INTO goal_reminders (goal_id, reminder_time, is_active, message, message_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [goalId, reminderTime, isActive, finalMessage, messageType]
    );

    res.json({
      success: true,
      reminder: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear recordatorio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear recordatorio'
    });
  }
};

// ========================================
// OBTENER RECORDATORIOS DE UNA META
// ========================================
const getGoalReminders = async (req, res) => {
  try {
    const { userId } = req.user;
    const { goalId } = req.params;

    // Verificar que la meta pertenece al usuario
    const goalCheck = await query(
      'SELECT id FROM goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );

    if (goalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Meta no encontrada'
      });
    }

    // Obtener recordatorios
    const result = await query(
      `SELECT * FROM goal_reminders 
       WHERE goal_id = $1 
       ORDER BY reminder_time`,
      [goalId]
    );

    res.json({
      success: true,
      reminders: result.rows
    });

  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recordatorios'
    });
  }
};

// ========================================
// ACTUALIZAR RECORDATORIO
// ========================================
const updateGoalReminder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { reminderId } = req.params;
    const { reminderTime, isActive } = req.body;

    // Verificar que el recordatorio pertenece al usuario
    const reminderCheck = await query(
      `SELECT gr.* FROM goal_reminders gr
       JOIN goals g ON gr.goal_id = g.id
       WHERE gr.id = $1 AND g.user_id = $2`,
      [reminderId, userId]
    );

    if (reminderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recordatorio no encontrado'
      });
    }

    // Actualizar recordatorio
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (reminderTime !== undefined) {
      updates.push(`reminder_time = $${paramCount++}`);
      values.push(reminderTime);
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay campos para actualizar'
      });
    }

    values.push(reminderId);
    const result = await query(
      `UPDATE goal_reminders 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    res.json({
      success: true,
      reminder: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar recordatorio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar recordatorio'
    });
  }
};

// ========================================
// ELIMINAR RECORDATORIO
// ========================================
const deleteGoalReminder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { reminderId } = req.params;

    // Verificar que el recordatorio pertenece al usuario
    const reminderCheck = await query(
      `SELECT gr.* FROM goal_reminders gr
       JOIN goals g ON gr.goal_id = g.id
       WHERE gr.id = $1 AND g.user_id = $2`,
      [reminderId, userId]
    );

    if (reminderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recordatorio no encontrado'
      });
    }

    await query('DELETE FROM goal_reminders WHERE id = $1', [reminderId]);

    res.json({
      success: true,
      message: 'Recordatorio eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar recordatorio:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar recordatorio'
    });
  }
};

// ========================================
// OBTENER TODOS LOS RECORDATORIOS DEL USUARIO
// ========================================
const getAllUserReminders = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await query(
      `SELECT 
        gr.*,
        g.name as goal_name,
        g.icon as goal_icon,
        g.color as goal_color
       FROM goal_reminders gr
       JOIN goals g ON gr.goal_id = g.id
       WHERE g.user_id = $1 AND gr.is_active = true
       ORDER BY gr.reminder_time`,
      [userId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      reminders: result.rows
    });

  } catch (error) {
    console.error('Error al obtener recordatorios del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener recordatorios'
    });
  }
};

// ========================================
// HISTORIAL DE NOTIFICACIONES
// ========================================

// Obtener historial de notificaciones del usuario
const getNotificationHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const notifications = await query(
      `SELECT 
        nh.*,
        COALESCE(g.name, nh.goal_name) as goal_name,
        g.color,
        g.icon
      FROM notification_history nh
      LEFT JOIN goals g ON nh.goal_id = g.id
      WHERE nh.user_id = $1
      ORDER BY nh.sent_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    // Obtener el total
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM notification_history WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(totalResult[0]?.total || 0);

    res.json({
      success: true,
      notifications,
      total,
      hasMore: (parseInt(offset) + notifications.length) < total
    });

  } catch (error) {
    console.error('Error al obtener historial de notificaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener historial de notificaciones'
    });
  }
};

// Marcar notificación como leída
const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    await query(
      'UPDATE notification_history SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );

    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      success: false,
      error: 'Error al marcar notificación'
    });
  }
};

module.exports = {
  generateMotivationalMessage,
  createGoalReminder,
  getGoalReminders,
  updateGoalReminder,
  deleteGoalReminder,
  getAllUserReminders,
  getNotificationHistory,
  markNotificationAsRead,
};
