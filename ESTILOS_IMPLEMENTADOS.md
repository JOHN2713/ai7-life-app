# 🎨 MiSaludApp - Estandarización de Estilos

Este proyecto ahora sigue los mismos estándares de diseño que **AI7 Life App** para garantizar coherencia visual y facilitar futuras integraciones.

## 📋 Cambios Realizados

### 1. **Colores Centralizados**
- Se actualizó la paleta de colores a `#00AC83` (verde turquesa) como color primario
- Se agregaron nuevos colores secundarios para mantener consistencia con AI7 Life App
- Ubicación: `src/constants/colors.ts`

### 2. **Sistema de Tipografía**
- Se creó un sistema de tipografía basado en la familia Manrope
- Incluye variables para tamaños, pesos y estilos predefinidos
- Ubicación: `src/constants/typography.ts`

### 3. **Espaciado y Bordes**
- Se estandarizó el espaciado con valores predefinidos (4px, 8px, 12px, etc.)
- Se definieron border radius consistentes (8px, 12px, 16px, 20px, 30px)
- Se agregaron estilos de sombra (soft, medium, strong)
- Ubicación: `src/constants/spacing.ts`

### 4. **Estilos Globales**
- Se creó una biblioteca de estilos reutilizables
- Incluye componentes básicos (headers, botones, inputs, cards)
- Ubicación: `src/constants/globalStyles.ts`

### 5. **Exportación Centralizada**
- Se creó `src/constants/index.ts` para importar fácilmente todos los estilos
- Simplifica los imports en las pantallas

## 🚀 Cómo Usar

### Importación Estándar

```typescript
// ✅ RECOMENDADO
import { 
  COLORS, 
  TYPOGRAPHY, 
  SPACING, 
  BORDER_RADIUS, 
  SHADOWS,
  GlobalStyles 
} from '../constants';

// ❌ NO RECOMENDADO
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
// etc...
```

### Ejemplo de Uso

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Título</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Presionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: 700,
    color: COLORS.textTitle,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.strong,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 700,
    textAlign: 'center',
  },
});
```

## 📁 Estructura de Archivos

```
src/constants/
├── index.ts              # Exporta todos los estilos y colores
├── colors.ts             # Paleta de colores
├── typography.ts         # Sistema de tipografía
├── spacing.ts            # Espaciado, bordes y sombras
└── globalStyles.ts       # Estilos reutilizables
```

## 🎯 Guía de Colores Rápida

| Uso | Color | Variable |
|-----|-------|----------|
| Primario | #00AC83 | `COLORS.primary` |
| Texto Principal | #000000 | `COLORS.textTitle` |
| Texto Secundario | #666666 | `COLORS.textSecondary` |
| Fondo de Input | #F5F5F5 | `COLORS.lightGray` |
| Bordes | #E0E0E0 | `COLORS.border` |
| Éxito | #00AC83 | `COLORS.success` |
| Error | #FF6B6B | `COLORS.error` |
| Advertencia | #FFB800 | `COLORS.warning` |

## 📐 Tamaños de Fuente

| Nivel | Tamaño | Variable |
|-------|--------|----------|
| Muy Grande | 28px | `TYPOGRAPHY.fontSizes['4xl']` |
| Grande | 24px | `TYPOGRAPHY.fontSizes['3xl']` |
| Mediano | 20px | `TYPOGRAPHY.fontSizes['2xl']` |
| Normal | 16px | `TYPOGRAPHY.fontSizes.lg` |
| Pequeño | 14px | `TYPOGRAPHY.fontSizes.base` |
| Muy Pequeño | 12px | `TYPOGRAPHY.fontSizes.xs` |

## ⚙️ Font Weights

```
Regular:   fontWeight: 400
SemiBold:  fontWeight: 600
Bold:      fontWeight: 700
```

## 💡 Consejos de Desarrollo

1. **Siempre usa las constantes** - No hardcodees colores ni tamaños
2. **Mantén la consistencia** - Revisa los archivos de constantes antes de agregar nuevos estilos
3. **Usa GlobalStyles** - Para componentes reutilizables, usa los estilos predefinidos
4. **Sombras** - Usa `SHADOWS.soft` para elementos secundarios, `SHADOWS.strong` para botones
5. **Espaciado** - Usa múltiplos de 4px para mantener alineación visual

## 📚 Documentación Completa

Para una guía más detallada sobre cómo usar los estilos, consulta [GUIA_ESTILOS.md](./GUIA_ESTILOS.md)

## 🔄 Compatibilidad con AI7 Life App

Este proyecto ahora es completamente compatible con los estándares del proyecto AI7 Life App. Los pull requests no deberían generar conflictos de estilo.

### Cambios de Configuración
- ✅ Color primario actualizado a #00AC83 (desde #20A57F)
- ✅ Tipografía estandarizada según AI7
- ✅ Espaciado y bordes alineados
- ✅ Sistema de sombras consistente

## 🤝 Contribuciones

Antes de hacer cambios visuales:

1. Revisa la paleta de colores en `src/constants/colors.ts`
2. Verifica que uses la tipografía consistente
3. Mantén el espaciado basado en la escala de SPACING
4. Consulta la guía de estilos si tienes dudas

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026  
**Basado en:** AI7 Life App Design System
