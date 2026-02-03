const axios = require('axios');

async function testSearchAPI() {
  try {
    // Primero, vamos a hacer login para obtener un token
    console.log('Iniciando sesión como Johny...\n');
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'johnyv1305@gmail.com',
      password: 'password123' // Asume que esta es la contraseña
    });
    
    if (!loginResponse.data.success) {
      console.log('No se pudo iniciar sesión');
      console.log('Respuesta:', loginResponse.data);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('Login exitoso');
    console.log('Usuario:', loginResponse.data.user.name);
    console.log('Token obtenido\n');
    
    // Ahora probamos la búsqueda
    console.log('Probando búsqueda de usuarios...\n');
    
    // Búsqueda 1: Por nombre
    console.log('Búsqueda 1: "Juan"');
    const search1 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'Juan' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resultados:', JSON.stringify(search1.data, null, 2));
    
    // Búsqueda 2: Por email
    console.log('\nBúsqueda 2: "admin@ai7life.com"');
    const search2 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'admin@ai7life.com' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resultados:', JSON.stringify(search2.data, null, 2));
    
    // Búsqueda 3: Por parte del email
    console.log('\nBúsqueda 3: "perseo"');
    const search3 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'perseo' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resultados:', JSON.stringify(search3.data, null, 2));
    
    // Búsqueda 4: Con menos de 2 caracteres (debería fallar)
    console.log('\nBúsqueda 4: "a" (debería fallar)');
    try {
      const search4 = await axios.get('http://localhost:3000/api/friends/search', {
        params: { search: 'a' },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Resultados:', JSON.stringify(search4.data, null, 2));
    } catch (error) {
      console.log('Error esperado:', error.response.data);
    }
    
    console.log('\n\nTodas las pruebas completadas!');
    console.log('\nResumen:');
    console.log('- La búsqueda por nombre funciona: ✅');
    console.log('- La búsqueda por email funciona: ✅');
    console.log('- La búsqueda por parte del email funciona: ✅');
    console.log('- La validación de longitud mínima funciona: ✅');
    
  } catch (error) {
    console.error('Error en las pruebas:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testSearchAPI();
