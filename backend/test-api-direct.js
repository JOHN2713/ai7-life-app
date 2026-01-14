require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

// Listar modelos disponibles
function listModels() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models?key=${API_KEY}`,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Probar generación con un modelo
function testGeneration(modelName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{ text: 'Hola, ¿cómo estás?' }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('API Key:', API_KEY ? API_KEY.substring(0, 20) + '...' : 'NO configurada');
  console.log('\n=== Listando modelos disponibles ===\n');
  
  try {
    const models = await listModels();
    
    if (models.models) {
      console.log('Modelos encontrados:');
      models.models.forEach(model => {
        console.log(`\n- ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Métodos: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Probar el primer modelo que soporte generateContent
      const contentModel = models.models.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );
      
      if (contentModel) {
        const modelId = contentModel.name.replace('models/', '');
        console.log(`\n\n=== Probando generación con: ${modelId} ===\n`);
        const result = await testGeneration(modelId);
        console.log(`Status: ${result.status}`);
        if (result.status === 200) {
          const json = JSON.parse(result.data);
          console.log('✓ ¡Funciona!');
          console.log('Respuesta:', json.candidates[0].content.parts[0].text.substring(0, 100));
        } else {
          console.log('Error:', result.data);
        }
      }
    } else if (models.error) {
      console.log('Error:', models.error.message);
    } else {
      console.log('Respuesta inesperada:', JSON.stringify(models, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
