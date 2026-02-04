# 📱 Sistema de Metas Frontend - Guía de Uso

## ✅ Archivos Creados/Modificados

### Nuevos Archivos:
1. **src/screens/CreateGoalScreen.js** - Pantalla completa de creación de metas (3 pasos)

### Archivos Modificados:
1. **src/services/api.js** - Agregado `goalsAPI` con todas las funciones
2. **src/screens/GoalsScreen.js** - Actualizado para listar y gestionar metas
3. **src/navigation/AppNavigator.js** - Agregada ruta CreateGoal

---

## 🎯 Funcionalidades Implementadas

### GoalsScreen (Pantalla Principal)
- ✅ Lista de metas activas del usuario
- ✅ Tarjetas con progreso visual
- ✅ Botón "Completar hoy" para cada meta
- ✅ Estado vacío cuando no hay metas
- ✅ Pull to refresh
- ✅ Navegación a crear meta

### CreateGoalScreen (3 Pasos)

#### **Paso 1: Sugerencias**
- Lista de 8 plantillas predefinidas del backend
- Botón "+ Crear Meta" para meta personalizada
- Cada plantilla muestra: icono, nombre, descripción

#### **Paso 2: Configurar Meta**
- Tarjeta de meta seleccionada con icono y color
- Campo: Nombre del reto
- Selector de duración: 3d, 7d, 14d, 21d, 30d
- Botón Continuar al paso 3

#### **Paso 3: Resumen**
- Tarjeta de resumen con estadísticas
- Ilustración motivacional
- Botón "Continuar" que crea la meta

---

## 🔌 API Integrada

### Funciones disponibles en `goalsAPI`:

```javascript
// Obtener todas las metas
await goalsAPI.getUserGoals(activeOnly);

// Obtener plantillas
await goalsAPI.getTemplates();

// Crear meta
await goalsAPI.createGoal(goalData);

// Completar meta (marcar día de hoy)
await goalsAPI.completeGoal(goalId);

// Obtener estadísticas
await goalsAPI.getStats();
```

---

## 🎨 Diseño

### Colores Dinámicos
Cada meta puede tener su propio color que se aplica a:
- Icono de fondo
- Barra de progreso
- Botón de completar
- Tarjeta de resumen

### Iconos Soportados
```javascript
water, walk, fitness, book, tooth, meditation, study, sleep, default
```

---

## 🚀 Flujo de Usuario

1. **Usuario sin metas** → Ve estado vacío → Click "Crear una meta"
2. **Pantalla de sugerencias** → Elige plantilla o crea personalizada
3. **Configurar meta** → Define nombre, duración
4. **Resumen** → Confirma y crea
5. **Regresa a GoalsScreen** → Ve su nueva meta en la lista
6. **Cada día** → Click "Completar hoy" → Progreso actualizado

---

## ⚙️ Próximos Pasos Sugeridos

### Funcionalidades Adicionales:
1. **Editar meta** - Pantalla para modificar metas existentes
2. **Ver detalles** - Tap en tarjeta para ver historial completo
3. **Notificaciones** - Recordatorios en las horas configuradas
4. **Estadísticas** - Pantalla con gráficos de progreso
5. **Compartir** - Compartir logros en redes sociales
6. **Racha** - Mostrar días consecutivos completados

### Mejoras de UX:
1. Animaciones al completar meta
2. Confetti o celebración al completar 100%
3. Badges o medallas por logros
4. Filtros: Todas / Activas / Completadas
5. Búsqueda de metas

---

## 🐛 Posibles Errores y Soluciones

### Error: "No se pudieron cargar las metas"
- Verificar que el backend esté corriendo en puerto 3000
- Verificar conexión a internet
- Revisar que el usuario esté autenticado (token válido)

### Error: "No se pudo crear la meta"
- Verificar que el nombre no esté vacío
- Verificar que duration_days esté entre 1-7
- Revisar logs del backend

### Las plantillas no cargan
- Verificar que ejecutaste `goals_seed.sql`
- Verificar endpoint `/api/goals/templates`

---

## 📝 Notas Importantes

1. **Autenticación requerida**: Todas las operaciones (excepto templates) requieren token JWT
2. **Refresh automático**: Al volver a GoalsScreen se recargan las metas
3. **Solo metas activas**: Por defecto solo muestra metas activas (`is_active = true`)
4. **Progreso calculado**: El backend calcula automáticamente `progress` basado en días completados

---

## 🧪 Cómo Probar

1. **Iniciar backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar app**:
   ```bash
   npm start
   ```

3. **Flujo de prueba**:
   - Login con usuario existente
   - Ir a tab "Metas"
   - Click "Crear una meta"
   - Seleccionar "Beber agua"
   - Configurar 7 días
   - Confirmar creación
   - Verificar que aparece en la lista
   - Click "Completar hoy"
   - Ver progreso actualizado (14% = 1/7 días)

---

## 🎨 Capturas vs Implementación

### ✅ Implementado según capturas:
- Header verde con "Crear Meta"
- Botón "+ Crear Meta" en la parte superior
- Tarjetas de sugerencias con icono y descripción
- Progress bar en paso 2 y 3
- Selector de duración con botones (3d, 7d, etc.)
- Tarjeta de resumen colorida
- Botón "Continuar" en verde

### 📝 Adaptaciones:
- "Meta diaria" está hardcodeado (puedes hacerlo dinámico)
- Ilustraciones usan iconos de Ionicons
- Colores dinámicos según template
