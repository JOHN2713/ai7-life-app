# 🤖 Configuración del Chat con IA - Google Gemini

## ✅ Implementación Completada

Chat completo con IA usando Google Gemini API. El coach AI7 responde sobre nutrición, buenos hábitos y motivación.

---

## 🔑 Obtener API Key de Google Gemini (GRATIS)

### **Paso 1: Ve a Google AI Studio**
1. Abre tu navegador
2. Ve a: https://makersuite.google.com/app/apikey
3. Inicia sesión con tu cuenta de Google

### **Paso 2: Crear API Key**
1. Haz clic en **"Create API key"**
2. Selecciona un proyecto existente o crea uno nuevo
3. Copia la API key generada

### **Paso 3: Configurar en el Backend**
1. Abre el archivo: `backend/.env`
2. Reemplaza `tu_api_key_aqui` con tu API key real:
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Guarda el archivo
4. Reinicia el servidor backend

---

## 🚀 Características Implementadas

### **Backend (Node.js + Express)**
- ✅ Controller: `chatController.js`
- ✅ Routes: `chat.js`
- ✅ Integración con Google Gemini API
- ✅ Sistema de prompts para mantener contexto
- ✅ Manejo de errores y límites de API
- ✅ Autenticación requerida (JWT)

### **Frontend (React Native)**
- ✅ Interfaz de chat moderna y fluida
- ✅ Burbujas de mensaje (usuario y AI)
- ✅ Indicador de "escribiendo..."
- ✅ Scroll automático
- ✅ KeyboardAvoidingView para iOS/Android
- ✅ Historial de conversación
- ✅ Timestamps en mensajes

---

## 🎯 Configuración del AI Coach

### **Personalidad del AI:**
- 🤖 Nombre: AI7 Coach
- 💚 Rol: Coach de salud y bienestar
- 🥗 Especialidades: Nutrición, ejercicio, buenos hábitos, motivación
- 😊 Tono: Amigable, empático y positivo
- 🚫 Límites: Solo responde sobre temas de salud y bienestar

### **Comportamiento:**
```
✅ Pregunta: "¿Qué debo comer para desayunar?"
Respuesta: Consejos detallados sobre desayuno saludable

✅ Pregunta: "Estoy desmotivado con el ejercicio"
Respuesta: Motivación y consejos para retomar el ejercicio

❌ Pregunta: "¿Quién ganó el partido?"
Respuesta: "Soy AI7 Coach, un agente especializado en nutrición, buenos hábitos y motivación. ¿En qué puedo ayudarte con tu salud y bienestar?"
```

---

## 📡 Endpoints del API

### **1. Enviar Mensaje**
```
POST /api/chat/message
Authorization: Bearer <token>

Body:
{
  "message": "¿Qué debo comer para desayunar?",
  "conversationHistory": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "¡Hola! ¿En qué puedo ayudarte?" }
  ]
}

Response:
{
  "success": true,
  "message": "Un desayuno saludable debe incluir...",
  "timestamp": "2026-01-13T..."
}
```

### **2. Mensaje de Bienvenida**
```
GET /api/chat/welcome
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "¡Hola! 👋 Soy AI7 Coach...",
  "timestamp": "2026-01-13T..."
}
```

---

## 🧪 Pruebas

### **Prueba 1: API Backend**
```powershell
# Obtener mensaje de bienvenida
$token = "tu_jwt_token"
Invoke-RestMethod -Uri "http://192.168.1.214:3000/api/chat/welcome" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}

# Enviar mensaje
Invoke-RestMethod -Uri "http://192.168.1.214:3000/api/chat/message" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{"message":"Hola, ¿cómo estás?"}'
```

### **Prueba 2: En la App**
1. Inicia sesión en la app
2. Ve a la pestaña "Chat"
3. Escribe un mensaje
4. Verifica que el AI responda

### **Preguntas de Prueba:**
- ✅ "¿Qué debo comer para desayunar?"
- ✅ "Estoy cansado todo el tiempo, ¿qué puedo hacer?"
- ✅ "Dame una rutina de ejercicios para principiantes"
- ✅ "¿Cómo puedo dormir mejor?"
- ❌ "¿Cuál es la capital de Francia?" (debe responder que solo ayuda con salud)

---

## 📊 Límites de la API (Versión Gratuita)

**Google Gemini Free Tier:**
- ✅ 60 peticiones por minuto
- ✅ 1,500 peticiones por día
- ✅ Suficiente para desarrollo y uso personal

**Nota:** Si necesitas más, Google ofrece planes pagos.

---

## 🔧 Troubleshooting

### **Error: "API key de Gemini no configurada"**
**Solución:**
1. Verifica que `GEMINI_API_KEY` esté en `backend/.env`
2. La API key debe ser válida (obtén una en Google AI Studio)
3. Reinicia el servidor backend

### **Error: "Límite de uso alcanzado"**
**Solución:**
- Espera unos minutos (límite por minuto)
- O espera hasta mañana (límite diario)
- O usa otra API key

### **Error: "Token inválido"**
**Solución:**
- Asegúrate de estar logueado en la app
- El token JWT debe ser válido
- Verifica que el backend esté corriendo

### **El chat no responde**
**Solución:**
1. Verifica que el backend esté corriendo (puerto 3000)
2. Verifica la conexión a internet
3. Revisa la consola del backend para ver errores
4. Verifica que la API key de Gemini sea válida

---

## 🎨 Personalización

### **Cambiar el Prompt del Sistema:**
Edita `backend/controllers/chatController.js`:
```javascript
const SYSTEM_PROMPT = `Eres un coach de salud...`;
```

### **Ajustar Parámetros del Modelo:**
```javascript
generationConfig: {
  temperature: 0.7,  // 0.0 - 1.0 (más alto = más creativo)
  topK: 40,          // Número de tokens considerados
  topP: 0.95,        // Probabilidad acumulativa
  maxOutputTokens: 500, // Longitud máxima de respuesta
}
```

### **Cambiar Límite de Caracteres:**
En `ChatScreen.js`:
```javascript
<TextInput
  maxLength={500}  // Cambia este valor
  ...
/>
```

---

## 📱 Capturas del Flujo

```
┌─────────────────────────┐
│      Chat Screen        │
│                         │
│  [AI7 Coach Avatar]     │
│  AI7 Coach              │
│  Tu asistente...        │
│─────────────────────────│
│                         │
│  🤖 ¡Hola! Soy AI7...   │
│     Coach...            │
│                    9:30 │
│                         │
│      Hola, ¿cómo      │
│      puedo comer      │
│      mejor?           │
│  9:31                   │
│                         │
│  🤖 ¡Excelente         │
│     pregunta! Para...   │
│                   9:31  │
│                         │
│─────────────────────────│
│  [Escribe mensaje...] 📤│
└─────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] API Key de Gemini obtenida
- [ ] API Key configurada en `backend/.env`
- [ ] Backend reiniciado con las nuevas rutas
- [ ] Paquete `@google/generative-ai` instalado
- [ ] App se conecta al backend
- [ ] Chat muestra mensaje de bienvenida
- [ ] Chat responde a mensajes del usuario
- [ ] AI mantiene contexto en la conversación
- [ ] AI rechaza preguntas fuera de contexto

---

## 🚀 Próximas Mejoras

1. **Historial persistente:** Guardar conversaciones en la base de datos
2. **Compartir conversaciones:** Exportar chat como PDF/texto
3. **Sugerencias rápidas:** Botones con preguntas comunes
4. **Modo voz:** Integrar reconocimiento de voz
5. **Imágenes:** Permitir enviar fotos de comidas para análisis
6. **Estadísticas:** Mostrar temas más consultados
7. **Notificaciones:** Recordatorios diarios del coach
