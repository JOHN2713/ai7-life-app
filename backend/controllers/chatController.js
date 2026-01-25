const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuración del modelo y prompt del sistema
const SYSTEM_PROMPT = `Eres un coach de salud y bienestar llamado "AI7 Coach". Tu rol es:

1. Ayudar con nutrición, alimentación saludable y planes de comida
2. Motivar y apoyar en el desarrollo de buenos hábitos de vida
3. Dar consejos sobre ejercicio, descanso y bienestar general
4. Ser empático, motivador y positivo en tus respuestas
5. Usar un lenguaje cercano y amigable en español

REGLAS ESTRICTAS DE FORMATO - LEE ESTO CON ATENCIÓN:
- NUNCA uses asteriscos (*) o dobles asteriscos (**) en ningún lugar
- NUNCA uses símbolos de markdown como # _ ~ o \`
- NO escribas palabras entre asteriscos como **palabra** o *palabra*
- Para títulos o subtítulos, usa texto normal seguido de dos puntos (:)
- Para enfatizar, usa MAYÚSCULAS COMPLETAS en palabras clave
- Para listas numeradas escribe: 1. Texto, 2. Texto, 3. Texto
- Para viñetas usa solo guión y espacio: - Texto
- Escribe de forma conversacional y natural como si hablaras
- COMPLETA SIEMPRE tus respuestas hasta el final

TEMAS PERMITIDOS:
- Nutrición, salud, ejercicio, buenos hábitos, motivación y bienestar
- Para otros temas: "Soy AI7 Coach, especializado en nutrición y bienestar. ¿En qué puedo ayudarte con tu salud?"

EJEMPLO CORRECTO de respuesta:
Usuario: "¿Cómo empiezo a correr?"
Tú: "Hola! Qué EXCELENTE iniciativa estás tomando! 🎉

Para iniciar el hábito de correr, te sugiero comenzar gradualmente:

FASE 1: Primeras semanas
- Alterna caminar 2 minutos y trotar 1 minuto
- Duración total: 20-30 minutos
- Frecuencia: 3 veces por semana

FASE 2: Siguientes semanas
- Aumenta progresivamente el tiempo trotando
- Reduce el tiempo caminando
- Mantén la frecuencia

CONSEJOS IMPORTANTES:
- Usa calzado deportivo adecuado
- Hidrátate antes y después
- Escucha a tu cuerpo

Estás listo para empezar esta gran aventura! 💪"

EJEMPLO INCORRECTO (NO HAGAS ESTO):
"**Fase 1:** Primeras semanas" ❌
"*Consejos importantes:* Usa calzado" ❌

Recuerda: Escribe TODO en texto plano sin símbolos especiales.`;

// Función para limpiar markdown de las respuestas
const cleanMarkdown = (text) => {
  if (!text) return text;
  
  // Eliminar negritas (**texto** o __texto__)
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');
  text = text.replace(/__(.+?)__/g, '$1');
  
  // Eliminar itálicas (*texto* o _texto_)
  text = text.replace(/\*(.+?)\*/g, '$1');
  text = text.replace(/_(.+?)_/g, '$1');
  
  // Eliminar código inline (`texto`)
  text = text.replace(/`(.+?)`/g, '$1');
  
  // Eliminar encabezados markdown (### texto)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  return text;
};

// Respuestas predefinidas para cuando hay límite de cuota
const FALLBACK_RESPONSES = [
  "¡Hola! 😊 Estoy aquí para ayudarte con tus metas de salud y bienestar. ¿Qué te gustaría lograr hoy?",
  "¡Excelente que estés aquí! 💪 Cuéntame, ¿en qué aspecto de tu salud te gustaría trabajar?",
  "Me encantaría ayudarte con tus objetivos de bienestar. ¿Tienes alguna meta específica en mente?",
  "Recuerda que cada pequeño paso cuenta. 🌟 ¿Hay algún hábito que quieras mejorar hoy?",
  "¡Genial! Estoy aquí para apoyarte. ¿Necesitas consejos sobre nutrición, ejercicio o motivación?"
];

const getRandomFallbackResponse = () => {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
};

// Enviar mensaje al chat
const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Verificar API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key de Gemini no configurada',
        message: 'Por favor, configura GEMINI_API_KEY en el archivo .env'
      });
    }

    // Configurar el modelo
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // Aumentado para evitar respuestas cortadas
      },
    });

    // Construir el historial de conversación
    let fullPrompt = SYSTEM_PROMPT + '\n\n';
    
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += 'Historial de conversación:\n';
      conversationHistory.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'Usuario' : 'AI7 Coach'}: ${msg.content}\n`;
      });
    }
    
    fullPrompt += `\nUsuario: ${message}\nAI7 Coach:`;

    // Generar respuesta
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let aiMessage = response.text();
    
    // Limpiar cualquier markdown que pueda quedar
    aiMessage = cleanMarkdown(aiMessage);

    res.json({
      success: true,
      message: aiMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en chat:', error);
    
    // Manejar errores específicos de Gemini
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'Error de autenticación con Gemini API',
        message: 'Verifica que tu API key sea válida'
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
      console.log('Límite de cuota alcanzado, usando respuesta predefinida');
      // En lugar de devolver error, devolver respuesta predefinida
      return res.json({
        success: true,
        message: getRandomFallbackResponse(),
        timestamp: new Date().toISOString(),
        fallback: true,
        quotaExceeded: true
      });
    }

    res.status(500).json({ 
      error: 'Error al procesar el mensaje',
      message: 'Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener mensaje de bienvenida
const getWelcomeMessage = async (req, res) => {
  try {
    const welcomeMessage = `¡Hola! Soy AI7 Coach, ¿en qué puedo ayudarte? 😊`;

    res.json({
      success: true,
      message: welcomeMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener mensaje de bienvenida:', error);
    res.status(500).json({ error: 'Error al obtener mensaje de bienvenida' });
  }
};

module.exports = {
  sendMessage,
  getWelcomeMessage,
};
