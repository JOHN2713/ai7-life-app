// Script de prueba para verificar URLs de DiceBear
const testUrls = [
  'https://api.dicebear.com/7.x/avataaars/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/bottts/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/fun-emoji/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/lorelei/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/micah/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/miniavs/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/notionists/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/personas/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
  'https://api.dicebear.com/7.x/pixel-art/png?seed=johnyv1305@gmail.com&size=200&backgroundColor=transparent',
];

console.log('URLs de prueba para DiceBear:\n');
testUrls.forEach((url, index) => {
  const style = url.match(/\/7\.x\/([^/]+)\//)[1];
  console.log(`${index + 1}. ${style}:`);
  console.log(`   ${url}\n`);
});

console.log('Copia cualquiera de estas URLs en tu navegador para verificar que funcionan correctamente.');
console.log('\nSi las URLs funcionan en el navegador pero no en la app, puede ser un problema de:');
console.log('- Cache de imágenes en React Native');
console.log('- Permisos de red en la app');
console.log('- CORS (aunque DiceBear normalmente no tiene este problema)');
