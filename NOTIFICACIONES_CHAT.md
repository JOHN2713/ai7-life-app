# 🔔 SISTEMA DE NOTIFICACIONES Y BADGES PARA CHAT

## ✅ IMPLEMENTACIÓN COMPLETA

Se ha implementado un sistema completo de notificaciones push y badges visuales para mensajes no leídos.

---

## 📁 Archivos Creados/Modificados

### Backend

#### 1. **backend/controllers/friendsController.js**
Nueva función agregada:
- `getUnreadCount()` - Obtiene el total de mensajes no leídos y el conteo por cada amigo

#### 2. **backend/routes/friends.js**
Nueva ruta:
- `GET /api/friends/messages/unread-count` - Obtener conteo de mensajes no leídos

### Frontend

#### 3. **src/contexts/UnreadMessagesContext.js** ✨ NUEVO
Context global para gestionar el estado de mensajes no leídos:
- ✅ Actualización automática cada 15 segundos
- ✅ Listener de notificaciones
- ✅ Estado compartido entre componentes
- ✅ Total de mensajes no leídos
- ✅ Conteo por amigo

#### 4. **src/components/ChatTabIcon.js** ✨ NUEVO
Icono personalizado para la tab de Chat:
- ✅ Badge rojo con contador
- ✅ Se actualiza automáticamente
- ✅ Muestra 99+ si son más de 99 mensajes

#### 5. **App.js**
- ✅ Agregado `UnreadMessagesProvider` para envolver toda la app

#### 6. **src/navigation/MainTabNavigator.js**
- ✅ Usa `ChatTabIcon` personalizado con badge

#### 7. **src/screens/FriendsScreen.js**
- ✅ Usa context de mensajes no leídos
- ✅ Muestra badges en cada amigo con mensajes pendientes
- ✅ Badge numérico en avatar
- ✅ Punto rojo en icono de chat

#### 8. **src/screens/FriendChatScreen.js**
- ✅ Detecta mensajes nuevos cada 5 segundos
- ✅ Envía notificación push cuando llega mensaje nuevo
- ✅ Solo notifica mensajes del amigo (no propios)
- ✅ Marca automáticamente como leído al abrir el chat

#### 9. **src/services/api.js**
Nueva función en `friendsAPI`:
- `getUnreadCount()` - Obtiene conteo de mensajes no leídos

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1. Notificaciones Push

**Cuándo se envían:**
- ✅ Cuando llega un mensaje nuevo de un amigo
- ✅ Solo si estás en el chat con ese amigo (verifica cada 5s)
- ✅ No se notifica tus propios mensajes

**Contenido de la notificación:**
```javascript
{
  title: "💬 Juan Pérez",
  body: "Hola! ¿Cómo estás?",
  data: {
    type: 'friend_message',
    friendId: '...',
    friendName: 'Juan Pérez'
  }
}
```

### 2. Badges Visuales

#### A) Badge en Tab de Chat (Barra de navegación)
- 🔴 Número rojo en la esquina del icono
- 📊 Muestra el total de mensajes no leídos de TODOS los amigos
- 🔄 Se actualiza cada 15 segundos automáticamente
- ⚡ Se actualiza inmediatamente al recibir notificación

#### B) Badge en Avatar del Amigo
- 🔴 Círculo rojo con número
- 📊 Muestra cuántos mensajes no leídos tiene ESE amigo específico
- 📍 Ubicado en la esquina superior derecha del avatar

#### C) Punto Rojo en Icono de Chat
- 🔴 Pequeño punto rojo
- 📊 Indica visualmente que hay mensajes sin leer
- 📍 Ubicado en el icono de chat al lado derecho

---

## 🔄 FLUJO DE ACTUALIZACIÓN

```
1. Usuario A envía mensaje a Usuario B
   ↓
2. Usuario B está en otra pantalla
   ↓
3. Context actualiza contador (cada 15s)
   ↓
4. Badge en Tab de Chat se actualiza → 🔴 1
   ↓
5. Usuario B ve el badge y va a Amigos
   ↓
6. Ve badge en avatar de Usuario A → 🔴 1
   ↓
7. Abre el chat con Usuario A
   ↓
8. Mensajes se marcan como leídos
   ↓
9. Badges desaparecen → ✅
```

---

## 💻 USO DEL CONTEXTO

### En cualquier componente funcional:

```javascript
import { useUnreadMessages } from '../contexts/UnreadMessagesContext';

function MiComponente() {
  const { 
    totalUnread,      // Total de mensajes no leídos
    unreadByFriend,   // { friendId: count, ... }
    loadUnreadCounts, // Función para refrescar manualmente
  } = useUnreadMessages();

  return (
    <View>
      <Text>Total: {totalUnread}</Text>
      {/* Usar el conteo */}
    </View>
  );
}
```

---

## 🎨 DISEÑO DE LOS BADGES

### Badge Numérico (Avatar)
```
┌─────────────┐
│  [Avatar]   │
│      🔴 3   │ ← Badge rojo con número
└─────────────┘
```

### Badge Tab (Navegación)
```
Tab Bar:
[Home]  [Goals]  [💬 Chat 🔴 5]  [Profile]
                        ↑
                 Badge en tab
```

### Punto Rojo (Icono Chat)
```
┌─────────────────────────┐
│ Juan Pérez              │
│ juan@email.com     💬🔴 │ ← Punto en icono
└─────────────────────────┘
```

---

## ⚙️ CONFIGURACIÓN

### Intervalos de Actualización

| Componente | Intervalo | Descripción |
|------------|-----------|-------------|
| UnreadMessagesContext | 15 segundos | Actualización global del contador |
| FriendChatScreen | 5 segundos | Verificar nuevos mensajes en chat activo |
| FriendsScreen | Al recibir notificación | Actualización reactiva |

### Modificar intervalos:

**Context (15s → 30s):**
```javascript
// src/contexts/UnreadMessagesContext.js
const interval = setInterval(loadUnreadCounts, 30000);
```

**Chat (5s → 3s):**
```javascript
// src/screens/FriendChatScreen.js
const interval = setInterval(checkNewMessages, 3000);
```

---

## 🔧 PERSONALIZACIÓN

### Cambiar Color del Badge

```javascript
// En los estilos
unreadBadge: {
  backgroundColor: COLORS.error, // ← Cambiar por otro color
  ...
}
```

### Cambiar Formato del Contador

```javascript
// En renderFriendItem
unreadCount > 99 ? '99+' : unreadCount
// Cambiar a:
unreadCount > 9 ? '9+' : unreadCount // Máximo 9
```

### Deshabilitar Notificaciones en Chat Activo

```javascript
// En FriendChatScreen.js, función checkNewMessages
// Comentar o eliminar el bloque:
/*
await Notifications.scheduleNotificationAsync({
  ...
});
*/
```

---

## 📊 RESPUESTA DE LA API

### GET /api/friends/messages/unread-count

**Response:**
```json
{
  "success": true,
  "total": 5,
  "byFriend": {
    "friend-id-1": 3,
    "friend-id-2": 2
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Los badges no aparecen
1. Verifica que el backend esté corriendo
2. Revisa la consola para errores de API
3. Verifica que hay mensajes no leídos en la BD:
   ```sql
   SELECT COUNT(*) FROM friend_messages WHERE is_read = FALSE;
   ```

### El badge no se actualiza
1. Espera 15 segundos (intervalo del context)
2. Sal y vuelve a entrar a la pantalla
3. Verifica que el Context esté en App.js

### Las notificaciones no aparecen
1. Verifica permisos de notificaciones
2. Asegúrate de estar en un dispositivo físico (no funcionan en todos los simuladores)
3. Revisa que el chat esté detectando mensajes nuevos (logs en consola)

### El contador es incorrecto
1. Verifica que los mensajes se marquen como leídos al abrir el chat
2. Revisa la consulta SQL en `getUnreadCount`
3. Forza una actualización: `loadUnreadCounts()`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Endpoint para conteo de mensajes no leídos
- [x] Context global para compartir estado
- [x] Provider en App.js
- [x] Badge en tab de navegación
- [x] Badge en avatar de amigo
- [x] Punto rojo en icono de chat
- [x] Notificaciones push al recibir mensaje
- [x] Actualización automática de contadores
- [x] Marcado automático como leído
- [x] Listener de notificaciones
- [x] Manejo de estados de carga
- [x] Diseño responsive

---

## 🚀 PRÓXIMAS MEJORAS (Opcionales)

- [ ] **Sonido personalizado** para notificaciones de chat
- [ ] **Vibración** al recibir mensaje
- [ ] **Badge en HomeScreen** con total de mensajes
- [ ] **Lista de conversaciones** con última actividad
- [ ] **WebSockets** para actualización en tiempo real (sin polling)
- [ ] **Notificaciones agrupadas** por amigo
- [ ] **Vista previa** del mensaje en la notificación
- [ ] **Acción rápida** "Responder" desde notificación
- [ ] **Modo silencioso** para ciertos amigos
- [ ] **Estadísticas** de mensajes enviados/recibidos

---

¡El sistema de notificaciones y badges está **100% funcional** y listo para usar! 🎉
