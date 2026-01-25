# 🔔 Sistema de Recordatorios con IA - Guía Completa

## 📋 Descripción General

El sistema de recordatorios permite a los usuarios recibir notificaciones push personalizadas para sus metas. Los mensajes son generados dinámicamente por IA (Google Gemini) para proporcionar motivación, alertas y recordatorios únicos.

## 🎯 Características Principales

### 1. **Notificaciones Push Locales**
- Notificaciones programadas que se ejecutan en el dispositivo
- Soporte para notificaciones diarias y semanales
- Compatible con Android e iOS
- Sonido y vibración configurables

### 2. **Mensajes Generados por IA** 🤖
El sistema puede generar 5 tipos de mensajes:

- **Motivación** 💪: Mensajes inspiradores para comenzar el día
- **Recordatorio** ⏰: Recordatorios amables sobre la meta
- **Alerta** ⚡: Alertas para incentivar la acción
- **Felicitación** 🎉: Celebrar logros cuando se completa una meta
- **Ánimo** 🌟: Mensajes empáticos cuando no se completa una meta

### 3. **Gestión Completa (CRUD)**
- Crear múltiples recordatorios por meta
- Editar horarios de recordatorios
- Activar/pausar recordatorios individualmente
- Eliminar recordatorios
- Ver todos los recordatorios del usuario

## 🏗️ Arquitectura del Sistema

### **Backend**

#### Endpoints (`/api/reminders`)

```
POST   /generate-message          - Generar mensaje con IA (público para testing)
GET    /user                      - Obtener todos los recordatorios del usuario
POST   /                          - Crear recordatorio
GET    /goal/:goalId              - Obtener recordatorios de una meta
PUT    /:reminderId               - Actualizar recordatorio
DELETE /:reminderId               - Eliminar recordatorio
```

#### Controlador: `reminderController.js`

**Funciones principales:**
- `generateMotivationalMessage()` - Usa Gemini AI para generar mensajes
- `createGoalReminder()` - Crea recordatorio en BD
- `getGoalReminders()` - Obtiene recordatorios de una meta
- `updateGoalReminder()` - Actualiza hora o estado activo
- `deleteGoalReminder()` - Elimina recordatorio
- `getAllUserReminders()` - Lista todos los recordatorios del usuario

#### Modelo de IA: Gemini 2.0 Flash Exp

```javascript
{
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.8,
    maxOutputTokens: 100,
  }
}
```

**Prompts optimizados:**
- Máximo 60 caracteres por mensaje
- Personalización con nombre del usuario
- Incluyen emojis relevantes
- Sin comillas ni texto adicional

### **Frontend**

#### Servicio: `notificationService.js`

**Clase principal: `NotificationService`**

Métodos disponibles:
- `initialize()` - Inicializa permisos y configuración
- `requestPermissions()` - Solicita permisos al usuario
- `getExpoPushToken()` - Obtiene token para notificaciones push
- `setupNotificationChannel()` - Configura canal en Android
- `scheduleDailyNotification()` - Programa notificación diaria
- `scheduleWeeklyNotification()` - Programa notificación semanal
- `scheduleGoalReminders()` - Programa múltiples recordatorios para una meta
- `cancelNotification()` - Cancela una notificación específica
- `cancelAllNotifications()` - Cancela todas las notificaciones

**Configuración de notificaciones:**
```javascript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

#### Pantalla: `GoalRemindersScreen.js`

**Características:**
- Lista de recordatorios existentes
- Botón para agregar nuevos recordatorios
- Modal con selector de hora (formato HH:MM)
- Selector de tipo de mensaje (4 opciones)
- Vista previa del mensaje generado por IA
- Switch para activar/desactivar recordatorios
- Botón de eliminar con confirmación

**Flujo de creación:**
1. Usuario toca "Agregar Recordatorio"
2. Ingresa hora en formato HH:MM (ej: 14:30)
3. Selecciona tipo de mensaje (motivación, recordatorio, etc.)
4. Opcionalmente ve vista previa del mensaje IA
5. Confirma y se crea el recordatorio
6. El sistema programa la notificación local

#### Integración en `GoalDetailScreen`

Botón agregado:
```javascript
<TouchableOpacity
  onPress={() => navigation.navigate('GoalReminders', { 
    goalId: goal.id, 
    goalName: goal.name 
  })}
>
  <Ionicons name="notifications-outline" />
  <Text>Gestionar Recordatorios</Text>
</TouchableOpacity>
```

## 📱 Uso para el Usuario

### **Crear un Recordatorio**

1. Ir a una meta desde Home o Goals
2. Tocar en la meta para ver detalles
3. Tocar "Gestionar Recordatorios"
4. Tocar "Agregar Recordatorio"
5. Ingresar hora (ej: 08:00, 14:30, 20:00)
6. Seleccionar tipo de mensaje
7. (Opcional) Ver vista previa del mensaje
8. Tocar "Crear"

### **Vista Previa de Mensaje IA**

Permite ver cómo será el mensaje antes de crear el recordatorio:
- Toca "Vista Previa del Mensaje"
- El sistema genera un mensaje de ejemplo
- Puedes regenerar cuantas veces quieras
- Cada mensaje es único gracias a la IA

### **Gestionar Recordatorios Existentes**

- **Activar/Pausar**: Usa el switch junto a cada recordatorio
- **Eliminar**: Toca el ícono de basura → Confirma
- **Ver todos**: La lista muestra todos los recordatorios con hora y estado

## 🔧 Configuración

### **Permisos Necesarios**

**Android (`app.json`):**
```json
"permissions": [
  "RECEIVE_BOOT_COMPLETED",
  "VIBRATE",
  "SCHEDULE_EXACT_ALARM",
  "POST_NOTIFICATIONS"
]
```

**iOS (`app.json`):**
```json
"infoPlist": {
  "UIBackgroundModes": ["remote-notification"]
}
```

### **Plugin de Expo Notifications**

```json
"plugins": [
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#2ECC71",
      "sounds": ["./assets/notification-sound.wav"],
      "mode": "production"
    }
  ]
]
```

## 🔍 API de Recordatorios

### **Crear Recordatorio**

```javascript
POST /api/reminders
Authorization: Bearer <token>

Body:
{
  "goalId": "uuid-de-la-meta",
  "reminderTime": "14:30",
  "isActive": true
}

Response:
{
  "success": true,
  "reminder": {
    "id": "uuid",
    "goal_id": "uuid-de-la-meta",
    "reminder_time": "14:30",
    "is_active": true,
    "created_at": "2026-01-18T..."
  }
}
```

### **Generar Mensaje Motivacional**

```javascript
POST /api/reminders/generate-message

Body:
{
  "goalName": "Caminar 30 minutos",
  "messageType": "motivacion",
  "userName": "Juan"
}

Response:
{
  "success": true,
  "message": "¡Vamos Juan! Tus 30 min de caminata te esperan 💪🚶",
  "messageType": "motivacion"
}
```

### **Obtener Recordatorios de Meta**

```javascript
GET /api/reminders/goal/:goalId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "reminders": [
    {
      "id": "uuid",
      "goal_id": "uuid-de-meta",
      "reminder_time": "08:00",
      "is_active": true
    },
    {
      "id": "uuid",
      "goal_id": "uuid-de-meta",
      "reminder_time": "18:00",
      "is_active": false
    }
  ]
}
```

## 🎨 Mensajes de Ejemplo Generados por IA

### Motivación 💪
- "¡Hoy es tu día para brillar! Camina 30 min 🌟"
- "Tu salud te lo agradecerá. ¡A caminar! 💚"
- "Cada paso cuenta. ¡Vamos por esos 30 minutos! 🚶‍♂️"

### Recordatorio ⏰
- "⏰ Es hora: 30 minutos de caminata esperan"
- "🔔 Recordatorio: Tu meta de caminar está activa"
- "⏰ Momento de moverte. ¡Sal a caminar! 👟"

### Alerta ⚡
- "⚡ ¡No te olvides! Caminar 30 min hoy"
- "⏰ ¡Atención! Tu meta de caminata te espera"
- "⚠️ ¡Último recordatorio! Camina 30 min"

### Felicitación 🎉
- "🎉 ¡Increíble! Completaste tu caminata 🏆"
- "👏 ¡Genial! 30 minutos conquistados ✨"
- "🌟 ¡Excelente trabajo! Meta cumplida 💪"

### Ánimo 🌟
- "💫 Mañana es un nuevo día. ¡Tú puedes!"
- "🌟 No te rindas. Cada día es una oportunidad"
- "💚 Sigue adelante. ¡El progreso toma tiempo!"

## 🚀 Ejemplos de Código

### **Programar Notificación Diaria**

```javascript
import notificationService from './services/notificationService';

await notificationService.scheduleDailyNotification(
  '14:30',
  '⏰ Recordatorio: Caminar 30 minutos',
  '¡Es hora de moverte! Sal a caminar 💪',
  { goalId: 'uuid-meta', type: 'goal-reminder' }
);
```

### **Generar y Usar Mensaje de IA**

```javascript
import { remindersAPI } from './services/api';

const response = await remindersAPI.generateMotivationalMessage(
  'Caminar 30 minutos',
  'motivacion',
  'Juan'
);

console.log(response.message);
// "¡Vamos Juan! Tus 30 min de caminata te esperan 💪🚶"
```

### **Inicializar Notificaciones en App**

```javascript
// App.js
import notificationService from './src/services/notificationService';

useEffect(() => {
  const init = async () => {
    await notificationService.initialize();
  };
  init();
}, []);
```

## 📊 Base de Datos

### **Tabla: goal_reminders**

```sql
CREATE TABLE goal_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  reminder_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id`: Identificador único del recordatorio
- `goal_id`: Referencia a la meta
- `reminder_time`: Hora del recordatorio (formato TIME: HH:MM:SS)
- `is_active`: Si el recordatorio está activo o pausado
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

## ⚙️ Variables de Entorno

Asegúrate de tener en `.env`:

```env
GEMINI_API_KEY=tu-api-key-de-gemini
```

## 🧪 Testing

### **Probar Generación de Mensajes**

```bash
# Endpoint público para testing
curl -X POST http://localhost:3000/api/reminders/generate-message \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "Leer 30 páginas",
    "messageType": "motivacion",
    "userName": "María"
  }'
```

### **Probar Notificación Inmediata**

```javascript
await notificationService.scheduleImmediateNotification(
  'Test de Notificación',
  'Este es un mensaje de prueba 🔔',
  { test: true }
);
```

## 📱 Consideraciones de Plataforma

### **Android**
- Requiere permisos explícitos desde Android 13+
- Usa canales de notificación configurables
- Soporta alarmas exactas para notificaciones precisas

### **iOS**
- Requiere confirmación del usuario para permisos
- Las notificaciones pueden agruparse
- Soporta sonidos personalizados

### **Web**
- No soporta notificaciones push nativas
- Usar Web Push API para navegadores

## 🎯 Próximos Pasos / Mejoras Futuras

- [ ] Notificaciones push remotas (usando servidor Expo)
- [ ] Estadísticas de interacción con notificaciones
- [ ] Recordatorios basados en ubicación
- [ ] Múltiples horarios por recordatorio
- [ ] Personalización de sonidos por meta
- [ ] Notificaciones con acciones rápidas ("Completar ahora")
- [ ] Historial de notificaciones enviadas
- [ ] A/B testing de mensajes de IA
- [ ] Análisis de efectividad de recordatorios

## 🐛 Troubleshooting

### **Las notificaciones no aparecen**
1. Verifica permisos en Configuración del dispositivo
2. Revisa que `notificationService.initialize()` se llame en App.js
3. Usa `getScheduledNotifications()` para ver notificaciones programadas

### **Mensajes de IA no se generan**
1. Verifica `GEMINI_API_KEY` en .env
2. Revisa límites de API de Gemini
3. Mira logs del backend para errores

### **Formato de hora inválido**
- Usar formato HH:MM (24 horas)
- Ejemplos válidos: "08:00", "14:30", "23:59"
- Ejemplos inválidos: "8:00", "2:30 PM", "25:00"

## 📚 Recursos

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Google Gemini API](https://ai.google.dev/docs)
- [React Native Push Notifications](https://reactnative.dev/docs/pushnotificationios)

---

**Versión:** 1.0.0  
**Última actualización:** 18 de enero de 2026  
**Autor:** AI7 Life Team
