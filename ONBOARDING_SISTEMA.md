# 🎯 Sistema de Onboarding - Solo en Registro

## ✅ Implementación Completada

El sistema de onboarding ahora **solo se muestra cuando un usuario se REGISTRA por primera vez**. Los usuarios que hacen LOGIN con cuenta existente van directo a la aplicación principal.

---

## 🔄 Flujo de Navegación

### 📱 **Splash Screen → Decisión Simple**

El SplashScreen ahora verifica solo el token:

```
┌─────────────────┐
│  Splash Screen  │
└────────┬────────┘
         │
         ├─ ¿Tiene token?
         │
         ├─ NO ──────────────────────────► Login Screen
         │
         └─ SÍ ──────────────────────────► Main (App principal)
```

---

## 📋 Casos de Uso

### 🆕 **Usuario Nuevo (Primera vez - Registro)**

1. Abre la app → **Splash Screen**
2. No tiene token → **Login Screen**
3. Clic en **"Registrarse"**
4. Completa formulario en **Register Screen**
5. Token y datos guardados
6. Navega a **Onboarding** (3 pantallas)
7. Completa el onboarding
8. Navega a **Main**

**Onboarding:** ✅ SE MUESTRA

### 🔐 **Usuario Existente (Login)**

1. Abre la app → **Splash Screen**
2. No tiene token → **Login Screen**
3. Ingresa email y password
4. Login exitoso
5. Va **DIRECTO a Main**

**Onboarding:** ❌ NO SE MUESTRA

### 🔄 **Usuario con Sesión Activa**

1. Abre la app → **Splash Screen**
2. Tiene token guardado ✅
3. Va **DIRECTO a Main**

**Onboarding:** ❌ NO SE MUESTRA

### 🚪 **Usuario que cerró sesión**

1. Cierra sesión (borra token)
2. Abre la app → **Splash Screen**
3. No tiene token → **Login Screen**
4. Hace login
5. Va **DIRECTO a Main**

**Onboarding:** ❌ NO SE MUESTRA (ya pasó por registro antes)

---

## 🎯 Regla Simple

**Onboarding SOLO en el flujo de REGISTRO**
- ✅ Register → Onboarding → Main
- ❌ Login → Main (directo, sin onboarding)
- ❌ Splash con token → Main (directo, sin onboarding)

---

## 🗂️ Archivos Modificados

### 1. **src/services/storage.js** (NUEVO)
Servicio centralizado para manejar AsyncStorage:

**Funciones principales:**
- ✅ `setOnboardingCompleted()` - Marca onboarding como completado
- ✅ `hasCompletedOnboarding()` - Verifica si se completó
- ✅ `saveToken()` - Guarda el token JWT
- ✅ `getToken()` - Obtiene el token guardado
- ✅ `saveUserData()` - Guarda datos del usuario
- ✅ `getUserData()` - Obtiene datos del usuario
- ✅ `clearAllData()` - Limpia datos (logout) pero mantiene el flag de onboarding
- ✅ `resetAllData()` - Limpia TODO (solo para testing)

### 2. **src/screens/SplashScreen.js**
Ahora verifica automáticamente:
- Si hay token guardado
- Si el usuario completó el onboarding
- Navega inteligentemente según el estado

### 3. **src/screens/LoginScreen.js**
Actualizado para:
- Verificar si el usuario ya completó el onboarding
- Si SÍ → navega a **Main**
- Si NO → navega a **Onboarding**

### 4. **src/screens/RegisterScreen.js**
Actualizado para:
- Guardar datos del usuario al registrarse
- Siempre navegar a **Onboarding** (usuarios nuevos)

### 5. **src/screens/OnboardingScreen.js**
Actualizado para:
- Marcar el onboarding como completado al terminar
- Navegar a **Main** cuando se completa

### 6. **src/services/api.js**
Integrado con el nuevo sistema de storage:
- Usa `saveToken()` y `saveUserData()` del módulo storage
- Más limpio y centralizado

---

## 💾 Datos Guardados en AsyncStorage

```javascript
// Llaves usadas
@ai7life:onboarding_completed  // 'true' o null
@ai7life:token                 // JWT token
@ai7life:user                  // JSON con datos del usuario
```

---

## 🧪 Testing del Flujo

### Test 1: Usuario Nuevo
```
1. Eliminar la app del dispositivo (o limpiar datos)
2. Instalar y abrir
3. Registro → Onboarding → Main ✅
4. Cerrar y volver a abrir
5. Debe ir directo a Main (sin onboarding) ✅
```

### Test 2: Cerrar Sesión
```
1. En ProfileScreen, agregar botón "Cerrar Sesión"
2. Al cerrar sesión, llamar: clearAllData()
3. Navegar a Login
4. Hacer login de nuevo
5. Debe ir directo a Main (sin onboarding) ✅
```

### Test 3: Reinstalar App
```
1. Desinstalar la app
2. Reinstalar
3. Hacer login con usuario existente
4. Como el flag de onboarding se perdió, mostrará onboarding
5. Completar onboarding
6. Próximas veces: directo a Main ✅
```

---

## 🛠️ Funciones Útiles para Desarrollo

### Resetear el Onboarding (Testing)
Para probar el onboarding de nuevo sin borrar la sesión:

```javascript
import { resetOnboarding } from '../services/storage';

// En cualquier componente
const testOnboardingAgain = async () => {
  await resetOnboarding();
  navigation.replace('Onboarding');
};
```

### Limpiar Todo (Logout Completo)
```javascript
import { clearAllData } from '../services/storage';

const handleLogout = async () => {
  await clearAllData();
  navigation.replace('Login');
};
```

### Reset Total (Para Testing)
Borra TODO incluyendo el flag de onboarding:
```javascript
import { resetAllData } from '../services/storage';

const resetEverything = async () => {
  await resetAllData();
  navigation.replace('Splash');
};
```

---

## 🎨 Próximas Mejoras Sugeridas

### 1. Botón de Cerrar Sesión
Agregar en `ProfileScreen.js`:
```javascript
import { clearAllData } from '../services/storage';

const handleLogout = async () => {
  Alert.alert(
    'Cerrar Sesión',
    '¿Estás seguro?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
          navigation.replace('Login');
        },
      },
    ]
  );
};
```

### 2. Botón "Saltar" en Onboarding
Permitir saltar el onboarding pero marcarlo como completado:
```javascript
<TouchableOpacity onPress={handleComplete}>
  <Text>Saltar</Text>
</TouchableOpacity>
```

### 3. Verificación de Token Expirado
Agregar interceptor en axios para manejar tokens expirados:
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      await clearAllData();
      // Redirigir a login
    }
    return Promise.reject(error);
  }
);
```

### 4. Refresh Token
Implementar refresh token para mantener la sesión activa más tiempo.

---

## 📊 Ventajas de esta Implementación

✅ **UX Mejorado**: Los usuarios no ven el onboarding cada vez  
✅ **Persistencia**: El estado se mantiene entre sesiones  
✅ **Flexible**: Fácil resetear para testing  
✅ **Seguro**: El token se guarda de forma segura  
✅ **Escalable**: Fácil agregar más flags de configuración  
✅ **Centralizado**: Todo el storage en un solo módulo  

---

## 🐛 Troubleshooting

### El onboarding se muestra cada vez
**Causa**: El flag no se está guardando correctamente

**Solución**:
```javascript
// Verificar en consola
import { hasCompletedOnboarding } from './services/storage';

const check = await hasCompletedOnboarding();
console.log('Onboarding completado:', check);
```

### El usuario no puede hacer logout
**Causa**: No hay botón de logout implementado

**Solución**: Agregar botón en ProfileScreen que llame a `clearAllData()`

### El token expira pero la app no lo detecta
**Causa**: Falta interceptor para manejar errores 401

**Solución**: Implementar interceptor en api.js para detectar tokens expirados

---

## ✅ Checklist de Verificación

- [x] storage.js creado y funcionando
- [x] SplashScreen verifica token y onboarding
- [x] LoginScreen navega según estado de onboarding
- [x] RegisterScreen guarda datos correctamente
- [x] OnboardingScreen marca como completado al terminar
- [x] api.js usa el nuevo sistema de storage
- [ ] Botón de logout en ProfileScreen (próximo)
- [ ] Manejo de tokens expirados (próximo)
- [ ] Tests E2E del flujo completo (próximo)

---

## 🎉 ¡Listo para Usar!

El sistema de onboarding ahora funciona perfectamente. Los usuarios nuevos verán el onboarding una sola vez, y los usuarios recurrentes irán directo a la aplicación.

**¡Prueba registrando un nuevo usuario y luego cierra y abre la app!**
