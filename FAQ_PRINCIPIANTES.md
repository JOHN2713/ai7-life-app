# ❓ PREGUNTAS FRECUENTES - GUÍA PARA PRINCIPIANTES

## 🤔 Preguntas Básicas

### P: ¿Qué es Node.js?
**R:** Node.js es un programa que permite ejecutar código JavaScript fuera del navegador. Lo necesitas para instalar las librerías de la app.

**¿Cómo sé si lo tengo instalado?**
Abre Terminal/Símbolo del Sistema y escribe:
```bash
node --version
```
Si ves un número (ej: v18.0.0), está instalado. Si no, descárgalo de https://nodejs.org/

---

### P: ¿Qué es npm?
**R:** npm es el "App Store" de Node.js. Se instala automáticamente con Node.js y se usa para descargar librerías.

**Verificar:**
```bash
npm --version
```

---

### P: ¿Qué es React Native?
**R:** Es un framework para crear apps para iPhone y Android usando código JavaScript. Escribes una sola vez y funciona en ambos.

---

### P: ¿Qué es Expo?
**R:** Es una plataforma que facilita el desarrollo con React Native. Con Expo Go (la app) puedes ver cambios en tiempo real sin compilar.

---

## 🚀 Preguntas de Instalación

### P: Hago `npm install` y me da error. ¿Qué hago?

**R:** Intenta esto en orden:

1. **Borra la carpeta de node_modules:**
```bash
# En Mac/Linux:
rm -r node_modules

# En Windows:
rmdir /s node_modules
```

2. **Borra el archivo package-lock.json:**
```bash
rm package-lock.json
```

3. **Reinstala:**
```bash
npm install
```

Si sigue fallando, es probable que sea un problema de red. Intenta:
```bash
npm install --verbose
```

---

### P: ¿Cuánto tiempo tarda npm install?
**R:** Generalmente 2-5 minutos si tienes buena conexión a internet. La primera vez tarda más.

---

### P: ¿Puedo usar WiFi de datos (celular)?
**R:** Sí, pero es más lento. Se recomienda WiFi de casa o trabajo.

---

## ⚙️ Preguntas Técnicas

### P: ¿Qué significa "node_modules"?
**R:** Es la carpeta donde se guarda toda el código de las librerías. Es NORMAL que sea muy grande (500+ MB). Nunca la toques manualmente.

---

### P: ¿Puedo borrar node_modules?
**R:** Sí, siempre que tengas el archivo `package.json`. Puedes ejecutar `npm install` de nuevo para restaurarlo.

---

### P: ¿Qué es TypeScript?
**R:** TypeScript es JavaScript con "seguridad de tipos". Te ayuda a encontrar errores antes de que salgan a producción.

**No necesitas entenderlo en detalle.** Solo sigue los patrones en el código.

---

### P: ¿Qué diferencia hay entre .ts y .tsx?
**R:** 
- **.ts** = TypeScript (código lógico)
- **.tsx** = TypeScript + JSX (código con componentes visuales)

Los archivos de pantallas terminan en **.tsx**

---

## 📱 Preguntas sobre Expo Go

### P: ¿Dónde descargo Expo Go?
**R:** 
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/us/app/expo-go/id982107779

---

### P: ¿Por qué veo un código QR?
**R:** Ese código QR es el "boleto" para acceder a tu app desde el teléfono. Se genera cada vez que ejecutas `npm start`.

---

### P: ¿Escaneo el QR y dice "No se puede conectar"?
**R:** Asegúrate de que:
1. Tu teléfono está en la misma WiFi que tu PC
2. No hay firewall bloqueando la conexión
3. La computadora y el teléfono están en la misma red

**Para verificar:**
En tu PC, abre Terminal y ejecuta:
```bash
ipconfig
```
Busca "IPv4 Address" y verifica que comience con la misma serie que tu WiFi (ej: 192.168.x.x)

---

### P: ¿Puedo usar datos móviles en lugar de WiFi?
**R:** No recomendado. Expo Go funciona mejor con WiFi porque necesita comunicarse en tiempo real.

---

## 🐛 Preguntas sobre Errores

### P: Veo "Metro Bundler failed" ¿Qué es eso?
**R:** Metro es el compilador de React Native. Falla cuando hay un error en el código.

**Solución:**
1. Lee el mensaje de error en rojo
2. Ve al archivo que menciona el error
3. Busca la línea problemática
4. Compara con un ejemplo que funcione
5. Ejecuta: `npm start -- --clear`

---

### P: ¿Por qué me dice "Cannot find module"?
**R:** Significa que falta importar algo o la ruta es incorrecta.

**Verificar:**
1. ¿Existe el archivo en esa ruta?
2. ¿Está correctamente exportado?
3. ¿La ruta está correcta? (`.` = carpeta actual, `..` = carpeta anterior)

---

### P: ¿Qué hago si la app se queda en "Loading..." para siempre?
**R:** 
1. En tu PC, presiona `Ctrl + C` para detener
2. Ejecuta: `npm start -- --clear`
3. Espera a que termine de compilar (puede tomar 2-3 minutos)
4. Escanea el nuevo código QR

---

## 💻 Preguntas sobre el Código

### P: ¿Cómo agrego un nuevo color?
**R:** Abre `src/constants/colors.ts`:

```typescript
export const COLORS = {
  primary: '#00AC83',
  miColorNuevo: '#FF0000',  // ← Agrega aquí
  // ...
};
```

Luego úsalo:
```typescript
import { COLORS } from '../constants';

style={{ color: COLORS.miColorNuevo }}
```

---

### P: ¿Cómo cambio el nombre de la app?
**R:** Abre `app.json`:

```json
{
  "expo": {
    "name": "Mi Nuevo Nombre",  // ← Cambia aquí
    "slug": "mi-app",
    // ...
  }
}
```

---

### P: ¿Cómo agrego un icono personalizador?
**R:** Reemplaza estos archivos en la carpeta `assets/`:

- `icon.png` - Icono de la app (1024x1024)
- `splash-icon.png` - Pantalla de carga (1024x1024)
- `adaptive-icon.png` - Icono adaptativo Android (1024x1024)

---

### P: ¿Debo entender todo el código para comenzar?
**R:** No. Comienza por:
1. Leer los comentarios en el código
2. Cambiar valores simples (colores, textos)
3. Ejecutar y ver cambios en vivo
4. Gradualmente entender la estructura

**Con Expo Go ves cambios en segundos.** Usa eso para aprender.

---

## 🔐 Preguntas sobre Firebase

### P: ¿Qué es Firebase?
**R:** Es una base de datos en la nube de Google. Te permite guardar datos (metas, entrenamientos) que se sincronizan entre dispositivos.

---

### P: ¿Debo configurar Firebase?
**R:** No es obligatorio para empezar. La app funciona sin ella. Pero para guardar datos en la nube:

1. Crea cuenta en https://firebase.google.com
2. Crea un proyecto
3. Copia las credenciales
4. Pégalas en `src/config/firebase.ts`

---

### P: ¿Los datos se pierden si cierro la app?
**R:** Sin Firebase, SÍ. Con Firebase, NO.

---

## 🎨 Preguntas sobre Diseño

### P: ¿Por qué usan colores específicos?
**R:** El proyecto sigue el diseño de AI7 Life App. Los colores (#00AC83, etc.) no son aleatorios. Están elegidos para:
- Ser profesionales
- Ser accesibles (fáciles de leer)
- Mantener consistencia

---

### P: ¿Puedo cambiar toda la paleta de colores?
**R:** Sí. Edita `src/constants/colors.ts` y cambia todos los valores.

---

## 🚢 Preguntas sobre Publicación

### P: ¿Cómo publico mi app en Google Play?
**R:** Necesitas:
1. Cuenta de Google Play ($25 único pago)
2. APK compilado
3. Screenshots y descripción
4. Seguir guía: https://docs.expo.dev/build/setup/

---

### P: ¿Cómo publico en App Store (iOS)?
**R:** Necesitas:
1. Cuenta de Apple Developer ($99/año)
2. Certificado digital
3. IPA compilado
4. Seguir guía: https://docs.expo.dev/build/setup/

---

### P: ¿Cuánto cuesta publicar?
**R:** 
- **Google Play:** $25 (único)
- **App Store:** $99 (anual)
- **Desarrollo:** GRATIS si usas Expo Go

---

## 🤯 Preguntas Conceptuales

### P: ¿Cómo funciona React Native?
**R:** Simple:
1. Escribes código en JavaScript
2. React Native lo traduce a código nativo (Java para Android, Swift para iOS)
3. Tu teléfono lo ejecuta

**Ventaja:** Escribes una sola vez, funciona en ambas plataformas.

---

### P: ¿Qué es "estado" en React?
**R:** Es la información que cambia en tu app (número de pasos, lista de metas, etc.)

```typescript
const [pasos, setpasos] = useState(0);  // 0 es el valor inicial
setpasos(100);  // Cambiar el estado
```

---

### P: ¿Qué es un "componente"?
**R:** Un bloque reutilizable de UI. Ejemplo:

```typescript
// Componente: Botón personalizado
function MiBoton() {
  return <TouchableOpacity><Text>Presiona</Text></TouchableOpacity>;
}

// Usarlo en múltiples lugares
<MiBoton />
<MiBoton />
```

---

## 🆘 Mi Pregunta No Está Aquí

**Soluciones:**
1. Busca en Google el error exacto
2. Consulta la documentación oficial:
   - https://reactnative.dev
   - https://docs.expo.dev
   - https://react.dev
3. Busca en Stack Overflow
4. Pregunta en comunidades de React Native

---

## 📚 Recursos Recomendados

### Para Aprender React Native
- https://reactnative.dev/docs/getting-started
- https://www.freecodecamp.org/news/react-native-tutorial/
- https://www.youtube.com/results?search_query=react+native+tutorial

### Para Aprender JavaScript
- https://developer.mozilla.org/es/docs/Web/JavaScript
- https://javascript.info/
- https://www.youtube.com/results?search_query=javascript+para+principiantes

### Para Aprender TypeScript
- https://www.typescriptlang.org/docs/
- https://www.youtube.com/results?search_query=typescript+tutorial

---

## 🎓 Camino de Aprendizaje Sugerido

### Semana 1
- [ ] Instala todo (Node.js, descargar proyecto)
- [ ] Entiende la estructura de carpetas
- [ ] Cambia algunos colores y textos
- [ ] Observa cambios en vivo en Expo Go

### Semana 2
- [ ] Lee el código de pantallas existentes
- [ ] Entiende cómo funcionan los componentes
- [ ] Intenta agregar una pantalla nueva simple

### Semana 3
- [ ] Aprende sobre "estado" (useState)
- [ ] Crea un componente personalizado
- [ ] Investiga Firebase

### Semana 4
- [ ] Conecta con Firebase
- [ ] Prueba guardando y leyendo datos
- [ ] Piensa en características nuevas

---

**¿Necesitas más ayuda?** Consulta los otros archivos de documentación o busca online. ¡El aprendizaje es un viaje! 🚀

---

**Versión:** 1.0.0  
**Última actualización:** Enero 14, 2026  
**Dificultad:** ⭐ Principiante (totalmente explicado)
