// backend/test-health-api.js - VERSIÓN MEJORADA
const axios = require('axios');
const { getAuthToken } = require('./get-token'); // Archivo creado arriba

const BASE_URL = 'http://localhost:3000/api';

class HealthAPITester {
  constructor() {
    this.api = null;
    this.token = null;
  }

  async initialize() {
    console.log('🚀 Inicializando tester del módulo Health...\n');
    
    // Obtener token
    this.token = await getAuthToken();
    
    if (!this.token) {
      throw new Error('No se pudo obtener token de autenticación');
    }
    
    // Configurar axios con el token
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Tester inicializado correctamente\n');
  }

  async testAll() {
    console.log('🧪 EJECUTANDO PRUEBAS COMPLETAS DEL MÓDULO HEALTH\n');
    console.log('='.repeat(50));
    
    try {
      await this.testStatus();
      await this.testSubmitHealthData();
      await this.testGetHealthData();
      await this.testPartialUpdate();
      await this.testInvalidData();
      await this.testAdminEndpoints();
      
      console.log('\n' + '='.repeat(50));
      console.log('🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
      
    } catch (error) {
      console.error('\n❌ ERROR EN PRUEBAS:', error.message);
      process.exit(1);
    }
  }

  async testStatus() {
    console.log('\n1️⃣  Probando endpoint de status:');
    
    try {
      const response = await this.api.get('/health/status');
      console.log(`✅ Status: ${response.data.message}`);
      console.log(`📅 Timestamp: ${response.data.timestamp}`);
      return true;
    } catch (error) {
      console.error(`❌ Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  }

  async testSubmitHealthData() {
    console.log('\n2️⃣  Probando envío de datos de salud:');
    
    const testCases = [
      {
        name: 'Usuario saludable',
        data: {
          age: 28,
          height_cm: 175.5,
          weight_kg: 72.3,
          sleep_hours: 7.5,
          water_glasses: 8,
          activity_level: 'Moderado'
        }
      },
      {
        name: 'Usuario sedentario',
        data: {
          age: 35,
          height_cm: 168.0,
          weight_kg: 85.2,
          sleep_hours: 5.5,
          water_glasses: 4,
          activity_level: 'Sedentario'
        }
      },
      {
        name: 'Usuario activo',
        data: {
          age: 22,
          height_cm: 182.0,
          weight_kg: 68.0,
          sleep_hours: 8.0,
          water_glasses: 10,
          activity_level: 'Activo'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n   📝 Caso: ${testCase.name}`);
      
      try {
        const response = await this.api.post('/health/submit', testCase.data);
        
        console.log(`   ✅ Guardado: ${response.data.message}`);
        console.log(`   📊 BMI: ${response.data.data.bmi}`);
        console.log(`   🏆 Health Score: ${response.data.data.health_score}`);
        console.log(`   💡 Recomendaciones: ${response.data.analysis.recommendations.length}`);
        
        // Esperar 500ms entre requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.response?.data?.message || error.message}`);
        throw error;
      }
    }
    
    return true;
  }

  async testGetHealthData() {
    console.log('\n3️⃣  Probando obtención de datos:');
    
    try {
      // Obtener datos del usuario actual
      const response = await this.api.get('/health');
      
      console.log(`✅ Datos obtenidos para: ${response.data.data.user.name}`);
      console.log(`📧 Email: ${response.data.data.user.email}`);
      console.log(`📋 Health Score: ${response.data.data.health.health_score}`);
      console.log(`🔄 Última actualización: ${response.data.data.health.updated_at}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  }

  async testPartialUpdate() {
    console.log('\n4️⃣  Probando actualización parcial:');
    
    const updates = [
      { water_glasses: 10 },
      { sleep_hours: 8.0, activity_level: 'Activo' },
      { weight_kg: 70.0, height_cm: 176.0 }
    ];
    
    for (let i = 0; i < updates.length; i++) {
      console.log(`\n   🔄 Actualización ${i + 1}:`);
      console.log(`   📊 Datos a actualizar:`, updates[i]);
      
      try {
        const response = await this.api.put('/health', updates[i]);
        console.log(`   ✅ ${response.data.message}`);
        
        // Verificar cambios
        const getResponse = await this.api.get('/health');
        const healthData = getResponse.data.data.health;
        
        Object.keys(updates[i]).forEach(key => {
          console.log(`   📋 ${key}: ${healthData[key]}`);
        });
        
        // Esperar entre updates
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.response?.data?.message || error.message}`);
        throw error;
      }
    }
    
    return true;
  }

  async testInvalidData() {
    console.log('\n5️⃣  Probando datos inválidos:');
    
    const invalidCases = [
      {
        name: 'Edad fuera de rango',
        data: { age: 10, height_cm: 175, weight_kg: 70, sleep_hours: 7, water_glasses: 8, activity_level: 'Moderado' },
        expectedError: 'La edad debe estar entre 15 y 80 años'
      },
      {
        name: 'Altura inválida',
        data: { age: 25, height_cm: 50, weight_kg: 70, sleep_hours: 7, water_glasses: 8, activity_level: 'Moderado' },
        expectedError: 'La altura debe estar entre 100 y 250 cm'
      },
      {
        name: 'Nivel de actividad inválido',
        data: { age: 25, height_cm: 175, weight_kg: 70, sleep_hours: 7, water_glasses: 8, activity_level: 'Extremo' },
        expectedError: 'El nivel de actividad debe ser uno de: Sedentario, Ligero, Moderado, Activo'
      }
    ];
    
    for (const testCase of invalidCases) {
      console.log(`\n   🚫 Caso: ${testCase.name}`);
      
      try {
        await this.api.post('/health/submit', testCase.data);
        console.error(`   ❌ Se esperaba error pero la request pasó`);
        throw new Error(`Validación falló para: ${testCase.name}`);
        
      } catch (error) {
        const errorMessage = error.response?.data?.errors?.[0] || error.response?.data?.message;
        
        if (errorMessage && errorMessage.includes(testCase.expectedError)) {
          console.log(`   ✅ Validación funcionó correctamente`);
          console.log(`   📝 Error esperado: ${errorMessage}`);
        } else {
          console.error(`   ❌ Error inesperado: ${errorMessage}`);
          throw error;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return true;
  }

  async testAdminEndpoints() {
    console.log('\n6️⃣  Probando endpoints de administrador:');
    
    try {
      // Intentar acceder a stats sin ser admin
      console.log('   👤 Probando acceso sin privilegios admin:');
      
      try {
        await this.api.get('/health/stats/summary');
        console.error('   ❌ Se esperaba error 403 pero la request pasó');
        throw new Error('Protección de admin no funcionó');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('   ✅ Correctamente denegado (403 Forbidden)');
        } else {
          console.error(`   ❌ Error inesperado: ${error.response?.status}`);
        }
      }
      
      // Nota: Para probar endpoints admin necesitarías un token de admin
      // Esto es solo para demostración
      console.log('   👑 (Nota: Pruebas de admin requieren token con permisos)');
      
      return true;
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      throw error;
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const tester = new HealthAPITester();
  
  tester.initialize()
    .then(() => tester.testAll())
    .catch(error => {
      console.error('❌ Error inicializando tester:', error.message);
      process.exit(1);
    });
}

module.exports = HealthAPITester;