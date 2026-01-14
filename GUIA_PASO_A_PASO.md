# 🎬 GUÍA VISUAL PASO A PASO

Este archivo te guía visualmente a través de cada paso. ¡No necesitas experiencia previa!

---

## PASO 1: Descargar Node.js

### ¿Por qué?
Node.js es necesario para instalar las librerías de la app.

### Pasos:

1. **Abre tu navegador** (Chrome, Firefox, Safari, etc.)

2. **Ve a:** https://nodejs.org/

   ![Screenshot imaginario de nodejs.org]

3. **Haz click en el botón grande verde** que dice **"Download LTS"**

   - LTS = "Long Term Support" = Versión estable

4. **Descarga el instalador** para tu sistema:
   - Windows: nodejs-...-x64.msi
   - Mac: nodejs-...-x64.pkg
   - Linux: sigue las instrucciones

5. **Abre el instalador descargado**

6. **Sigue todos los pasos por defecto:**
   - Click "Next"
   - Click "Next"
   - Click "Install"
   - Click "Finish"

7. **Reinicia tu computadora** (importante)

---

## PASO 2: Verificar que Node.js está Instalado

### En Windows:

1. **Presiona:** `Windows + R`
2. **Escribe:** `cmd`
3. **Presiona:** Enter
4. **Escribe:** `node --version`
5. **Presiona:** Enter

**Resultado esperado:** `v18.0.0` (o similar)

### En Mac:

1. **Abre Terminal:** Cmd + Space, escribe "Terminal"
2. **Escribe:** `node --version`
3. **Presiona:** Enter

**Resultado esperado:** `v18.0.0` (o similar)

### En Linux:

1. **Abre Terminal**
2. **Escribe:** `node --version`
3. **Presiona:** Enter

**Resultado esperado:** `v18.0.0` (o similar)

---

## PASO 3: Descargar el Proyecto

### Opción A: Desde GitHub (con Git)

Si clonaste el repositorio, ya tienes la carpeta. Salta al Paso 4.

### Opción B: Descargando ZIP

1. **Busca la carpeta del proyecto** en tu explorador
2. **Asegúrate de estar en:** `C:\Users\TuUsuario\Downloads\PROYECTO\MiSaludApp` (Windows)
   o en tu carpeta de descargas (Mac/Linux)

---

## PASO 4: Abrir Terminal en la Carpeta del Proyecto

### En Windows:

1. **Abre la carpeta:** `C:\Users\TuUsuario\Downloads\PROYECTO\MiSaludApp`

2. **Click derecho en la carpeta vacía**

3. **Selecciona:** "Abrir PowerShell aquí" o "Abrir símbolo del sistema aquí"

   ```
   └─ Carpeta MiSaludApp
      └─ Click derecho aquí
         └─ Abrir PowerShell aquí
   ```

### En Mac:

1. **Abre Finder** (Cmd + Space, escribe "Finder")

2. **Navega a tu carpeta MiSaludApp**

3. **Click derecho en la carpeta**

4. **Selecciona:** "New Terminal at Folder"

### En Linux:

1. **Abre Archivos** (gestor de archivos)

2. **Navega a tu carpeta MiSaludApp**

3. **Click derecho → Abrir Terminal aquí**

---

## PASO 5: Instalar Dependencias

### En la terminal que abriste, escribe:

```bash
npm install
```

### Presiona Enter

```
┌────────────────────────────────────────┐
│ > npm install                          │
│ > npm WARN deprecated ...              │
│ > added 798 packages ...               │
│ > up to date in 3m                     │
└────────────────────────────────────────┘
```

**¿Cuánto tarda?** 2-5 minutos (depende de tu internet)

**¿Qué está pasando?** Se están descargando ~800 librerías necesarias para la app

---

## PASO 6: Iniciar el Servidor

### En la misma terminal, escribe:

```bash
npm start
```

### Presiona Enter

**Verás algo como esto:**

```
┌────────────────────────────────────────┐
│ > npm start                            │
│ > Starting Metro Bundler              │
│ > ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄              │
│ > █                                █  │
│ > █    [QR CODE AQUÍ]             █  │
│ > █                                █  │
│ > ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀             │
│ > › Scan the QR code above with    │
│ >   Expo Go                         │
│ > › Metro waiting on exp://...     │
│ > › Press s to switch to dev build │
│ > › Press a to open Android        │
│ > › Press w to open web            │
│ > › Press j to open debugger       │
│ > › Press r to reload app          │
│ > › Press m to toggle menu         │
└────────────────────────────────────────┘
```

**¡IMPORTANTE!** No cierres esta terminal. La necesitas corriendo.

---

## PASO 7: Descargar Expo Go en tu Teléfono

### En Android:

1. **Abre Google Play Store** en tu teléfono
2. **Busca:** "Expo Go"
3. **Haz click en:** Expo, Inc.
4. **Haz click en:** "Instalar"
5. **Espera a que se instale**

### En iPhone:

1. **Abre App Store** en tu teléfono
2. **Busca:** "Expo Go"
3. **Haz click en:** Expo, Inc.
4. **Haz click en:** "Obtener"
5. **Usa Face ID o contraseña**
6. **Espera a que se instale**

---

## PASO 8: Conectar tu Teléfono a la App

### Asegúrate que:
- ✅ Tu PC y teléfono están en la **misma WiFi**
- ✅ El servidor sigue corriendo en la terminal (paso 6)
- ✅ Tu teléfono tiene Expo Go instalado

### En Android:

1. **Abre Expo Go** en tu teléfono

2. **Toca el botón "+" o "Scan QR"**

3. **Apunta la cámara al código QR** que ves en la terminal de tu PC

4. **Espera a que cargue...**

   ```
   Cargando...
   Preparando la app...
   ¡Listo!
   ```

### En iPhone:

1. **Abre la app Cámara**

2. **Apunta al código QR** de la terminal de tu PC

3. **Toca la notificación:** "Open in Expo Go"

4. **Se abrirá Expo Go automáticamente**

5. **Espera a que cargue**

---

## 🎉 ¡FELICIDADES!

Si ves tu app en el teléfono, **¡COMPLETASTE LA INSTALACIÓN!**

```
┌─────────────────────────────┐
│  Tu App Está Ejecutándose   │
│  en tu teléfono             │
│  🎊 FELICIDADES 🎊          │
└─────────────────────────────┘
```

---

## PASO 9: Hacer Cambios

### Ahora puedes:

1. **Abre el código** en un editor (Visual Studio Code recomendado)

2. **Haz un cambio pequeño**, por ejemplo:
   
   Abre: `src/screens/HomeScreen.tsx`
   
   Cambia:
   ```typescript
   <Text>Resumen</Text>
   ```
   
   A:
   ```typescript
   <Text>Mi Resumen Personalizado</Text>
   ```

3. **Guarda el archivo** (Ctrl + S)

4. **Mira tu teléfono**
   
   ¡Debería aparecer el cambio en 2-3 segundos! 🚀

---

## PASO 10: Descargar Visual Studio Code (Recomendado)

Si no tienes un editor de código:

1. **Ve a:** https://code.visualstudio.com/

2. **Descarga para tu sistema**

3. **Instala normalmente**

4. **Abre la carpeta MiSaludApp** en VS Code:
   - File → Open Folder
   - Selecciona la carpeta MiSaludApp

5. **¡Ahora puedes editar cómodamente!**

---

## ⚡ RESUMEN RÁPIDO

| Paso | Acción | Comando |
|------|--------|---------|
| 1 | Descargar Node.js | Ir a nodejs.org |
| 2 | Verificar instalación | `node --version` |
| 3 | Tener el proyecto | Descargar ZIP |
| 4 | Abrir terminal | Click derecho en carpeta |
| 5 | Instalar librerías | `npm install` |
| 6 | Iniciar servidor | `npm start` |
| 7 | Instalar Expo Go | App Store / Play Store |
| 8 | Escanear QR | Con Expo Go |
| 9 | Ver tu app | ¡En tu teléfono! |
| 10 | Editar código | Cualquier editor |

---

## 🆘 Algo Salió Mal?

### Si ves error en la terminal:

1. **Lee el error** (la parte en rojo)

2. **Busca en Google** exactamente ese error

3. **Intenta las soluciones** sugeridas en Google

4. **Si nada funciona:** Reinicia todo desde cero

### Si el código QR no aparece:

1. **Ctrl + C** para detener
2. `npm start -- --clear`
3. Espera a que compile de nuevo

### Si no se conecta tu teléfono:

1. **Verifica WiFi:** PC y teléfono en misma red
2. **Abre Expo Go** en tu teléfono
3. **Escanea el código QR** de nuevo
4. **Si sigue sin funcionar:** Reinicia WiFi en ambos dispositivos

---

## 🎓 Siguiente Paso

Ahora que tu app está corriendo, puedes:

1. **Leer README.md** - Explicación completa
2. **Consultar GUIA_ESTILOS.md** - Cómo usar colores y estilos
3. **Explorar el código** - Entiende cómo funciona
4. **Hacer cambios** - Personaliza tu app
5. **Agregar características** - Nuevas pantallas, funciones, etc.

---

## 📞 Necesitas Ayuda?

```
Consulta:
→ FAQ_PRINCIPIANTES.md (Preguntas comunes)
→ README.md (Explicación general)
→ GUIA_ESTILOS.md (Colores y diseño)
→ Google (Cualquier error específico)
```

---

**¡Bienvenido al desarrollo de apps! 🚀**

Recuerda: Todos comenzamos siendo principiantes. Tómate tu tiempo, aprende gradualmente, y ¡diviértete programando!

---

**Versión:** 1.0.0  
**Dificultad:** ⭐ Principiante (paso a paso visual)  
**Tiempo estimado:** 30 minutos
