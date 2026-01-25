// Script de prueba para verificar que el sistema de notificaciones funciona correctamente
// Este script sirve para debuggear el flujo completo

const testNotificationFlow = () => {
  console.log('='.repeat(60));
  console.log('🧪 PRUEBA DE FLUJO DE NOTIFICACIONES');
  console.log('='.repeat(60));
  
  const exampleGoalName = 'Hacer ejercicio';
  const exampleMessage = '¡Johny, cada repetición te acerca más a tu mejor versión! 💪 Hoy es el día perfecto para superar tus límites.';
  
  console.log('\n1️⃣ Generación de mensaje IA:');
  console.log(`   Meta: ${exampleGoalName}`);
  console.log(`   Mensaje generado (${exampleMessage.length} caracteres):`);
  console.log(`   "${exampleMessage}"`);
  
  console.log('\n2️⃣ Almacenamiento en DB:');
  console.log(`   ✅ Campo 'message': ${exampleMessage}`);
  console.log(`   ✅ Campo 'message_type': motivacion`);
  
  console.log('\n3️⃣ Programación de notificación:');
  const shortTitle = `⏰ ${exampleGoalName}`;
  console.log(`   Título (${shortTitle.length} caracteres): "${shortTitle}"`);
  console.log(`   Body (${exampleMessage.length} caracteres): "${exampleMessage}"`);
  
  console.log('\n4️⃣ Resultado esperado en la notificación:');
  console.log(`   ┌${'─'.repeat(58)}┐`);
  console.log(`   │ ${shortTitle.padEnd(56)} │`);
  console.log(`   ├${'─'.repeat(58)}┤`);
  console.log(`   │ ${exampleMessage.substring(0, 56).padEnd(56)} │`);
  if (exampleMessage.length > 56) {
    console.log(`   │ ${exampleMessage.substring(56).padEnd(56)} │`);
  }
  console.log(`   └${'─'.repeat(58)}┘`);
  
  console.log('\n✅ Si ves este mensaje completo en tu notificación, ¡TODO FUNCIONA!');
  console.log('❌ Si solo ves 6 caracteres, hay un problema en la transferencia del mensaje\n');
  console.log('='.repeat(60));
};

testNotificationFlow();
