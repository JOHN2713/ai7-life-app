# 🔧 Troubleshooting - Sistema de Avatares

## Problema: Avatares no se muestran en EditProfileScreen

### ✅ Cambios Realizados

1. **URLs Simplificadas:**
   - Antes: `...svg?seed=...`
   - Ahora: `...png?seed=...&size=200`
   - Eliminado `backgroundColor=transparent` que podía causar problemas

2. **Formato de Imagen:**
   - Cambiado de SVG a PNG para mejor compatibilidad con React Native
   - SVG puede tener problemas de renderizado en dispositivos móviles

3. **Manejo de Errores:**
   - Agregado `onError` en componentes Image
   - Placeholders visuales cuando falla la carga
   - Console.log para debugging

4. **Extracción del Estilo Actual:**
   - La pantalla ahora detecta el estilo de avatar que el usuario ya tiene
   - Seed inicial usa email o nombre del usuario

### 🧪 Verificación de URLs

Las URLs de DiceBear se están generando correctamente:

```
https://api.dicebear.com/7.x/avataaars/png?seed=johnyv1305@gmail.com&size=200
https://api.dicebear.com/7.x/bottts/png?seed=johnyv1305@gmail.com&size=200
https://api.dicebear.com/7.x/fun-emoji/png?seed=johnyv1305@gmail.com&size=200
...
```

**Prueba en navegador:** Copia cualquiera de estas URLs en tu navegador para verificar que funcionan.

---

## 🔍 Posibles Causas del Problema

### 1. **Cache de React Native**
React Native puede estar cacheando imágenes antiguas o fallidas.

**Solución:**
```bash
# Limpiar cache de Metro Bundler
npx react-native start --reset-cache

# O en Expo
expo start -c
```

### 2. **Permisos de Red**
La app necesita permisos para descargar imágenes de internet.

**Verificar en app.json:**
```json
{
  "expo": {
    "android": {
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    }
  }
}
```

### 3. **Componente Image no Optimizado**
El componente `Image` de React Native puede tener problemas con URLs externas.

**Mejorar con:**
- `resizeMode="contain"` ✅ Ya agregado
- `defaultSource` para imagen placeholder
- Usar `FastImage` (librería externa) si persiste

### 4. **Conexión a Internet**
Verificar que el dispositivo tenga acceso a internet y pueda resolver DNS.

**Prueba:**
```javascript
fetch('https://api.dicebear.com/7.x/avataaars/png?seed=test&size=200')
  .then(response => console.log('DiceBear accesible:', response.status))
  .catch(error => console.log('Error:', error));
```

### 5. **Rate Limiting de DiceBear**
DiceBear puede limitar requests si se hacen demasiados rápido.

**Solución:**
- Las URLs son consistentes (mismo seed = misma imagen)
- React Native debería cachearlas automáticamente

---

## 🛠️ Soluciones para Probar

### Opción 1: Limpiar Cache de la App

```bash
# En el directorio del proyecto
expo start -c
```

### Opción 2: Usar FastImage (Recomendado)

FastImage es más eficiente para imágenes remotas:

```bash
expo install react-native-fast-image
```

Luego en EditProfileScreen.js:
```javascript
import FastImage from 'react-native-fast-image';

// Reemplazar <Image> por <FastImage>
<FastImage
  source={{ 
    uri: generateAvatarUrl(style, seed),
    priority: FastImage.priority.normal,
  }}
  style={styles.styleAvatar}
  resizeMode={FastImage.resizeMode.contain}
/>
```

### Opción 3: Verificar en Metro Bundler

Cuando ejecutes la app, mira la consola de Metro Bundler para ver:
- Errores de red
- Advertencias de Image
- Console.logs que agregamos

### Opción 4: Probar con URL Hardcodeada

Temporalmente, reemplaza la URL generada por una hardcodeada para verificar:

```javascript
<Image
  source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=test&size=200' }}
  style={styles.avatarPreview}
  resizeMode="contain"
/>
```

Si esta funciona, el problema está en la generación de URLs.
Si no funciona, es un problema de red/permisos.

---

## 📱 Debugging en el Dispositivo

### Ver Console.logs en la App

1. **Expo Go:**
   - Abre el menú (agita el dispositivo)
   - Selecciona "Debug Remote JS"
   - Abre Chrome DevTools

2. **React Native Debugger:**
   ```bash
   npx react-native log-android
   # o
   npx react-native log-ios
   ```

### Verificar URLs Generadas

Los console.log que agregamos mostrarán:
```
Generando avatar: avataaars con seed: johnyv1305@gmail.com
Generando avatar: bottts con seed: johnyv1305@gmail.com
...
```

---

## ✅ Checklist de Verificación

- [ ] Backend está corriendo (puerto 3000)
- [ ] App se conecta al backend (login funciona)
- [ ] URLs de DiceBear funcionan en navegador
- [ ] Permisos de internet en app.json
- [ ] Cache de Metro Bundler limpia
- [ ] Console.logs visibles en debugging
- [ ] Componente Image tiene `resizeMode="contain"`
- [ ] Placeholders de error se muestran si falla

---

## 🚀 Próximos Pasos Si Persiste

1. **Implementar FastImage**
2. **Agregar loading spinner** mientras carga la imagen
3. **Implementar retry logic** si falla la carga
4. **Cachear imágenes localmente** con AsyncStorage
5. **Usar avatares locales** como fallback

---

## 📞 Estado Actual

- ✅ URLs de DiceBear generadas correctamente
- ✅ Formato PNG implementado
- ✅ Manejo de errores agregado
- ✅ Console.logs para debugging
- ✅ Backend actualizado
- ⏳ Esperando prueba en dispositivo con debugging

**Siguiente paso:** Ejecutar la app con debugging activo y revisar console.logs.
