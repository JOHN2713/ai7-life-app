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

IMPORTANTE:
- Solo puedes hablar sobre: nutrición, salud, ejercicio, buenos hábitos, motivación y bienestar
- Si te preguntan sobre otros temas (política, tecnología, programación, etc.), debes responder: "Soy AI7 Coach, un agente especializado en nutrición, buenos hábitos y motivación. ¿En qué puedo ayudarte con tu salud y bienestar?"
- Mantén las respuestas concisas (máximo 200 palabras)
- Usa emojis ocasionalmente para hacer las conversaciones más amigables
- Siempre termina preguntando si pueden ayudar en algo más relacionado con salud

Ejemplo de respuestas:
Usuario: "¿Qué debo comer para desayunar?"
Tú: "¡Excelente pregunta! 🌅 Un desayuno balanceado debería incluir: proteínas (huevos, yogurt griego), carbohidratos complejos (avena, pan integral) y frutas. Evita azúcares refinados. ¿Te gustaría que te dé un ejemplo de menú?"

Usuario: "¿Quién ganó las elecciones?"
Tú: "Soy AI7 Coach, un agente especializado en nutrición, buenos hábitos y motivación. ¿En qué puedo ayudarte con tu salud y bienestar?"`;

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
        maxOutputTokens: 500,
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
    const aiMessage = response.text();

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

    if (error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Límite de uso alcanzado',
        message: 'Has alcanzado el límite de peticiones. Intenta más tarde.'
      });
    }

    res.status(500).json({ 
      error: 'Error al procesar el mensaje',
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
