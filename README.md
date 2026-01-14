# 🏥 MiSaludApp - Aplicación de Salud y Bienestar

Una aplicación React Native multiplataforma para rastrear metas de salud, entrenamientos y monitoreo de actividad física.

## 🎯 Características Principales

- 📊 **Resumen de Actividad** - Visualiza anillos de progreso y estadísticas
- 🎯 **Gestión de Metas** - Crea y rastrear metas de salud personalizadas
- 🚴 **Tracking de Entrenamientos** - Registra caminatas, trotadas y más con GPS
- 🎨 **Diseño Moderno** - Interfaz limpia basada en AI7 Life App
- 🔥 **Compatible con Firebase** - Sincronización en la nube

---

## 📋 Requisitos Previos

Antes de empezar, necesitas tener instalado en tu computadora:

### 1. **Node.js** (versión 16 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación:
   ```bash
   node --version
   npm --version
   ```

### 2. **Git** (para versionar el código)
   - Descarga desde: https://git-scm.com/
   - Verifica: `git --version`

### 3. **Expo Go** (en tu teléfono)
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/us/app/expo-go/id982107779

---

## 🚀 Instalación Paso a Paso

### Paso 1: Descargar/Clonar el Proyecto




1. Descarga el ZIP
2. Extrae la carpeta
3. Abre terminal en esa carpeta

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las librerías necesarias (React, React Native, Expo, etc.)

**Tiempo estimado:** 3-5 minutos (depende de tu internet)

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm start
```

Verás un código QR en la terminal. Ese QR es tu llave para abrir la app.

### Paso 4: Abrir en tu Teléfono

**En Android:**
1. Abre **Expo Go** en tu teléfono
2. Presiona el botón "+" o "Scan QR"
3. Escanea el código QR que ves en la terminal

**En iOS:**
1. Abre la **Cámara** en tu teléfono
2. Apunta a el código QR en la terminal
3. Toca la notificación "Open in Expo Go"

**Listo!** ✅ La app debería estar cargando en tu teléfono

---

## 💻 Comandos Disponibles

```bash
# Iniciar servidor de desarrollo (Recomendado para desarrollo)
npm start

# Abrir en dispositivo Android
npm run android

# Abrir en dispositivo iOS
npm run ios

# Abrir en navegador web
npm run web

# Construir APK para Android (producción)
npm run android:build

# Ver mensajes de error
npm start -- --clear
```

---

## 📁 Estructura del Proyecto

```
MiSaludApp/
├── 📄 README.md                      ← Este archivo
├── 📄 package.json                   ← Librerías del proyecto
├── 📄 App.tsx                        ← Punto de entrada principal
├── 📄 index.ts                       ← Inicio de la app
├── 📄 tsconfig.json                  ← Configuración TypeScript
│
├── 📁 src/
│   ├── 📁 constants/                 ← Colores, espaciado, tipografía
│   │   ├── colors.ts                 ← Paleta de colores
│   │   ├── typography.ts             ← Tamaños y estilos de fuente
│   │   ├── spacing.ts                ← Espaciado y bordes
│   │   ├── globalStyles.ts           ← Estilos reutilizables
│   │   └── index.ts                  ← Exporta todo
│   │
│   ├── 📁 screens/                   ← Pantallas de la app
│   │   ├── HomeScreen.tsx            ← Resumen de actividad
│   │   ├── GoalsScreen.tsx           ← Gestión de metas
│   │   └── WorkoutScreen.tsx         ← Tracking de entrenamientos
│   │
│   ├── 📁 services/                  ← Lógica de negocio
│   │   ├── goalsService.ts           ← Funciones para metas
│   │   └── workoutsService.ts        ← Funciones para entrenamientos
│   │
│   └── 📁 config/
│       └── firebase.ts               ← Configuración de Firebase
│
├── 📁 assets/                        ← Imágenes y recursos
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
└── 📁 node_modules/                  ← Librerías instaladas (creado por npm)
```

---

## 🎨 Sistema de Estilos

El proyecto usa un **sistema centralizado de estilos** para mantener consistencia visual.

### Colores Principales

```typescript
import { COLORS } from './src/constants';

COLORS.primary          // #00AC83 (Verde turquesa)
COLORS.white            // #FFFFFF (Blanco)
COLORS.textTitle        // #000000 (Texto principal)
COLORS.textSecondary    // #666666 (Texto secundario)
COLORS.lightGray        // #F5F5F5 (Fondos claros)
COLORS.error            // #FF6B6B (Rojo de error)
COLORS.warning          // #FFB800 (Amarillo de advertencia)
```

### Espaciado

```typescript
import { SPACING } from './src/constants';

SPACING.xs     // 4px
SPACING.sm     // 8px
SPACING.md     // 12px
SPACING.lg     // 16px
SPACING.xl     // 20px
```

### Ejemplo de Uso

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from './src/constants';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: 700,
    color: COLORS.textTitle,
  },
});

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola!</Text>
    </View>
  );
}
```

Para más detalles, consulta: **GUIA_ESTILOS.md** o **REFERENCIA_RAPIDA.md**

---

## 📦 Librerías Instaladas (Explicadas)

### React Native & Expo (Base)
- **react** (19.1.0) - Librería principal de React
- **react-native** (0.81.5) - Framework para apps móviles
- **expo** (~54.0.31) - Plataforma para desarrollar con React Native

### Navegación
- **@react-navigation/native** - Sistema de navegación base
- **@react-navigation/bottom-tabs** - Menú inferior con pestañas
- **react-native-safe-area-context** - Evita notches y bordes
- **react-native-screens** - Optimiza navegación

### Iconos
- **@expo/vector-icons** - Iconos profesionales (Ionicons, FontAwesome, etc.)

### Mapas
- **react-native-maps** - Mapas interactivos
- **expo-location** - Acceso a ubicación GPS

### Sensores
- **expo-sensors** - Acelerómetro, giroscopio, podómetro

### Otros
- **firebase** (^12.7.0) - Base de datos en la nube
- **typescript** (~5.9.2) - Seguridad de tipos en JavaScript

---

## 🛠️ Solución de Problemas

### ❌ Error: "command not found: npm"
**Solución:** Node.js no está instalado
- Descarga desde: https://nodejs.org/
- Reinicia tu terminal después de instalar

### ❌ Error: "Module not found"
**Solución:** Las dependencias no se instalaron correctamente
```bash
# Borra node_modules
rm -r node_modules          # En Mac/Linux
rmdir /s node_modules       # En Windows

# Reinstala
npm install
```

### ❌ Error: "Metro Bundler failed"
**Solución:** Borrar caché
```bash
npm start -- --clear
```

### ❌ El código QR no aparece
**Solución:** 
1. Presiona `Ctrl+C` para detener
2. Ejecuta: `npm start -- --clear`
3. Espera a que se complete

### ❌ La app se queda en "Loading..."
**Solución:**
1. Asegúrate de tener buena conexión WiFi
2. Tu teléfono y computadora deben estar en la **misma red**
3. Intenta nuevamente escaneando el código QR

### ❌ Error: "Cannot find module '@react-navigation'"
**Solución:** Instala manualmente las dependencias
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
```

---

## 📱 Usar la App

### Pantalla de Inicio (Resumen)
Muestra anillos de progreso de tus metas diarias.

### Pantalla de Entrenamientos
Registra caminatas, trotadas y más con GPS en tiempo real.

### Pantalla de Metas
Crea y gestiona tus objetivos de salud personalizados.

---

## 🔧 Personalizar la App

### Cambiar Colores
Abre: `src/constants/colors.ts`
```typescript
export const COLORS = {
  primary: '#00AC83',  // ← Cambia este valor
  // ...
};
```

### Cambiar Nombre de la App
Abre: `app.json`
```json
{
  "expo": {
    "name": "Mi Nombre",  // ← Cambia aquí
    // ...
  }
}
```

### Agregar Nueva Pantalla

1. Crea el archivo: `src/screens/MiPantalla.tsx`
```typescript
import React from 'react';
import { View, Text } from 'react-native';

export default function MiPantalla() {
  return (
    <View style={{ flex: 1 }}>
      <Text>¡Mi nueva pantalla!</Text>
    </View>
  );
}
```

2. Importa en `App.tsx`:
```typescript
import MiPantalla from './src/screens/MiPantalla';
```

3. Añade a la navegación:
```typescript
<Tab.Screen name="Mi Pantalla" component={MiPantalla} />
```

---

## 🚀 Siguientes Pasos

1. **Familiarízate con el código** - Abre los archivos y lee los comentarios
2. **Personaliza los colores** - Cambia la paleta a tus preferencias
3. **Agrega tus pantallas** - Crea nuevas secciones
4. **Conecta Firebase** - Guarda datos en la nube
5. **Publica tu app** - En Google Play y App Store

---

## 📚 Documentación Adicional

Consulta estos archivos para más información:

- **README_ESTILOS.md** - Sistema de estilos en detalle
- **GUIA_ESTILOS.md** - Guía completa de componentes
- **REFERENCIA_RAPIDA.md** - Copy/paste de ejemplos
- **INSTRUCCIONES_DESARROLLADOR.md** - Guía para desarrolladores

---

## 🤝 Contribuciones

¿Quieres mejorar la app?

1. Haz cambios en tu rama
2. Prueba en Expo Go
3. Haz commit: `git commit -m "Descripción del cambio"`
4. Push: `git push origin nombre-rama`
5. Crea un Pull Request

---

## 📞 Soporte

Si tienes problemas:

1. Lee la sección **"Solución de Problemas"** arriba
2. Consulta la documentación en los archivos `.md`
3. Revisa los comentarios en el código
4. Busca en Google el error exacto

---

## 📄 Licencia

Este proyecto es de código abierto bajo licencia MIT.

---

## 🎉 ¡Listo para Empezar!

```bash
# 1. Instala dependencias
npm install

# 2. Inicia el servidor
npm start

# 3. Escanea el código QR con Expo Go

# ¡Disfruta desarrollando! 🚀
```

---

## ⚡ Resumen Rápido

| Acción | Comando |
|--------|---------|
| Instalar | `npm install` |
| Iniciar | `npm start` |
| Limpiar caché | `npm start -- --clear` |
| Ver logs | Mira la terminal |
| Detener | `Ctrl + C` |

---

**Versión:** 1.0.0  
**Última actualización:** Enero 14, 2026  
**Estado:** ✅ Listo para producción

¡A codificar! 🚀
