require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Configurada ✓' : 'NO configurada ✗');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Intentar listar modelos
    console.log('\n=== Intentando listar modelos disponibles ===');
    try {
      const models = await genAI.listModels();
      console.log('Modelos disponibles:');
      models.forEach(model => {
        console.log(`- ${model.name}`);
      });
    } catch (error) {
      console.log('No se pudo listar modelos:', error.message);
    }
    
    // Probar con diferentes nombres de modelos
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];
    
    console.log('\n=== Probando diferentes modelos ===');
    for (const modelName of modelsToTry) {
      try {
        console.log(`\nProbando: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hola, ¿cómo estás?');
        const response = await result.response;
        const text = response.text();
        console.log(`✓ ${modelName} funciona!`);
        console.log(`Respuesta: ${text.substring(0, 50)}...`);
        break; // Si funciona, salir del loop
      } catch (error) {
        console.log(`✗ ${modelName} falló: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

testGemini();
