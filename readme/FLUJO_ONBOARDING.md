# 🎯 Flujo de Onboarding - Solo en Registro

```
                        ┌─────────────────────┐
                        │   ABRIR LA APP      │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   SPLASH SCREEN     │
                        │   (3 segundos)      │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  ¿Tiene token guardado?     │
                    └──────────┬──────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
            NO  │                             │  SÍ
                │                             │
        ┌───────▼────────┐          ┌────────▼─────────┐
        │  LOGIN SCREEN  │          │      MAIN        │
        └───────┬────────┘          │  (App Home)      │
                │                   └──────────────────┘
                │                            
    ┌───────────┴──────────┐                 
    │                      │                 
    │ Login       Register │                 
    │                      │                 
    ▼                      ▼                 
┌────────┐          ┌──────────────┐         
│ Login  │          │  Registro    │         
│ exitoso│          │  exitoso     │         
└───┬────┘          └──────┬───────┘         
    │                      │                 
    │ DIRECTO              │                 
    │ a Main               │                 
    │                      │                 
    │               ┌──────▼───────────┐     
    │               │   ONBOARDING     │     
    │               │  (3 pantallas)   │     
    │               └──────┬───────────┘     
    │                      │                 
    │                      │ Completar       
    │                      │                 
    ▼                      ▼                 
┌──────────────────────────────────┐         
│             MAIN                 │         
│         (App Home)               │         
└──────────────────────────────────┘         
```

---

## 📱 Estados de la Aplicación

### 🔴 **Estado: Sin Token (No autenticado)**
```
[Splash] → [Login] → [Main]
```
- Usuario debe hacer login o registrarse
- LOGIN: va directo a Main ✅
- REGISTER: va a Onboarding → Main ✅

### 🟢 **Estado: Con Token**
```
[Splash] → [Main]
```
- Usuario con sesión activa
- Va directo a Main
- Sin verificaciones adicionales

---

## 🔄 Casos Especiales

### 📲 **Primera Instalación - REGISTRO**
```
Splash → Login → Register → Onboarding → Main
                             ↓
                    (marca onboarding_completed)
```

### 📲 **Primera Instalación - LOGIN (cuenta existente)**
```
Splash → Login → Main ✅
(NO onboarding, va directo)
```

### 🔁 **Segunda Apertura**
```
Splash → Main ✅
(lee token y va directo)
```

### 🚪 **Después de Logout**
```
Logout → Login → Main ✅
(NO onboarding, va directo)
```

---

## 💾 Almacenamiento en AsyncStorage

```javascript
// Después de registro exitoso
{
  '@ai7life:token': 'eyJhbGciOiJIUzI1NiIs...',
  '@ai7life:user': '{"id":"uuid","name":"Juan","email":"..."}'
}

// Después de completar onboarding
{
  '@ai7life:token': 'eyJhbGciOiJIUzI1NiIs...',
  '@ai7life:user': '{"id":"uuid","name":"Juan","email":"..."}',
  '@ai7life:onboarding_completed': 'true' ✅
}

// Después de logout
{
  '@ai7life:onboarding_completed': 'true' ✅
  // token y user se borran
}
```

---

## 🎬 Animación del Flujo

### **Usuario Nuevo - Primera Vez**
```
1. 🎨 Splash (3s) → animación logo
2. 🔐 Login → botón "Registrarse"
3. 📝 Register → completar formulario
4. ✅ Registro exitoso
5. 📱 Onboarding pantalla 1/3 → swipe
6. 📱 Onboarding pantalla 2/3 → swipe
7. 📱 Onboarding pantalla 3/3 → "Comenzar"
8. 🎉 Main (Home)
   └─ ✅ Flag guardado
```

### **Usuario Recurrente - Segunda Vez**
```
1. 🎨 Splash (3s) → animación logo
   ├─ Verifica token ✅
   └─ Verifica onboarding ✅
2. 🎉 Main (Home) ⚡ DIRECTO
```

**Tiempo total:**
- Primera vez: ~30 segundos (con lectura)
- Siguientes: ~3 segundos (solo splash)

---

## ⚙️ Configuración de Navegación

### **AppNavigator.js**
```javascript
<Stack.Navigator initialRouteName="Splash">
  <Stack.Screen name="Splash" />      {/* Punto de entrada */}
  <Stack.Screen name="Login" />        {/* Si no hay token */}
  <Stack.Screen name="Register" />     {/* Desde login */}
  <Stack.Screen name="Onboarding" />   {/* Si no completó */}
  <Stack.Screen name="Main" />         {/* Tab Navigator */}
</Stack.Navigator>
```

### **Decisiones de Navegación**

| Componente | Condición | Destino |
|------------|-----------|---------|
| SplashScreen | Sin token | Login |
| SplashScreen | Token + No onboarding | Onboarding |
| SplashScreen | Token + Onboarding ✅ | Main |
| LoginScreen | Login exitoso + No onboarding | Onboarding |
| LoginScreen | Login exitoso + Onboarding ✅ | Main |
| RegisterScreen | Registro exitoso | Onboarding |
| OnboardingScreen | Completar última pantalla | Main |

---

## 🎯 Resumen de Comportamiento

### ✅ **Lo que SÍ pasa:**
- ✅ Onboarding se muestra solo la primera vez
- ✅ Usuarios recurrentes van directo a Main
- ✅ Después de logout, no se muestra onboarding
- ✅ El estado persiste entre aperturas de la app
- ✅ Splash verifica automáticamente el estado

### ❌ **Lo que NO pasa:**
- ❌ No se muestra onboarding cada vez
- ❌ No se pierde el estado al cerrar la app
- ❌ No se requiere login cada vez
- ❌ No hay pantallas innecesarias

---

## 🚀 Próximos Pasos

1. **Agregar botón de logout en ProfileScreen**
2. **Implementar refresh token**
3. **Agregar "Volver a ver onboarding" en configuración**
4. **Manejar tokens expirados automáticamente**
5. **Agregar animaciones de transición entre pantallas**

---

**Documentación completa:** [ONBOARDING_SISTEMA.md](ONBOARDING_SISTEMA.md)
