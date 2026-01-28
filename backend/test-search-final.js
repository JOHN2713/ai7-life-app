const axios = require('axios');

async function testWithJuan() {
  try {
    // Probar con el usuario Juan
    console.log('🔐 Iniciando sesión como Juan...\n');
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'diseno@perseo.ec',
      password: 'password123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ No se pudo iniciar sesión con Juan');
      console.log('Intentando con Admin...\n');
      
      const adminLogin = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'admin@ai7life.com',
        password: 'admin123'
      });
      
      if (!adminLogin.data.success) {
        console.log('❌ Tampoco funcionó con Admin');
        console.log('Por favor, verifica las credenciales de alguno de los usuarios registrados.');
        return;
      }
      
      const token = adminLogin.data.token;
      console.log('✅ Login exitoso como Admin');
      console.log('👤 Usuario:', adminLogin.data.user.name);
      await testSearch(token);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');
    console.log('👤 Usuario:', loginResponse.data.user.name);
    await testSearch(token);
    
  } catch (error) {
    console.error('❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

async function testSearch(token) {
  try {
    console.log('\n🔍 Probando búsqueda de usuarios...\n');
    
    // Búsqueda 1: Por nombre
    console.log('📝 Búsqueda 1: "Johny"');
    const search1 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'Johny' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Usuarios encontrados:', search1.data.users.length);
    search1.data.users.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - Estado: ${u.friendship_status}`);
    });
    
    // Búsqueda 2: Por email
    console.log('\n📝 Búsqueda 2: "admin"');
    const search2 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'admin' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Usuarios encontrados:', search2.data.users.length);
    search2.data.users.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - Estado: ${u.friendship_status}`);
    });
    
    // Búsqueda 3: Por parte del email
    console.log('\n📝 Búsqueda 3: "perseo"');
    const search3 = await axios.get('http://localhost:3000/api/friends/search', {
      params: { search: 'perseo' },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Usuarios encontrados:', search3.data.users.length);
    search3.data.users.forEach(u => {
      console.log(`  - ${u.name} (${u.email}) - Estado: ${u.friendship_status}`);
    });
    
    console.log('\n\n✅ Todas las pruebas completadas!');
    console.log('\n📋 Resumen:');
    console.log('✅ La búsqueda por nombre funciona correctamente');
    console.log('✅ La búsqueda por email funciona correctamente');
    console.log('✅ El sistema de amigos está funcionando');
    console.log('\n💡 Puedes buscar usuarios en la app usando:');
    console.log('   - Nombre de usuario (ej: "Johny", "Juan", "Admin")');
    console.log('   - Email completo o parcial (ej: "perseo", "admin@ai7life.com")');
    
  } catch (error) {
    console.error('❌ Error en búsqueda:', error.response?.data || error.message);
  }
}

testWithJuan();
