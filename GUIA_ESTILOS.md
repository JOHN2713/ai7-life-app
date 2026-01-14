# GUÍA DE ESTILOS - MiSaludApp

## 🎨 Colores (COLORS)

Los colores están centralizados en `src/constants/colors.ts`:

```typescript
import { COLORS } from '../constants/colors';

// Colores primarios
COLORS.primary        // #00AC83 - Verde turquesa (headers, botones activos)
COLORS.primaryAlt     // #00B89F - Turquesa alternativo

// Neutrales
COLORS.white          // #FFFFFF
COLORS.black          // #000000

// Grises
COLORS.gray           // #999999
COLORS.textGray       // #666666 (texto secundario)
COLORS.lightGray      // #F5F5F5 (backgrounds)
COLORS.border         // #E0E0E0
COLORS.placeholder    // #F0F0F0

// Texto
COLORS.textTitle      // #000000 (títulos)
COLORS.textSecondary  // #666666 (descripción)

// Verdes adicionales
COLORS.lightGreen     // #E8FFF5
COLORS.palletGreen    // #E0F8F3

// Status
COLORS.success        // #00AC83
COLORS.error          // #FF6B6B
COLORS.warning        // #FFB800
COLORS.info           // #5B5BD6
```

## 🔤 Tipografía (TYPOGRAPHY)

```typescript
import { TYPOGRAPHY } from '../constants/typography';

// Font Family
TYPOGRAPHY.fontFamily  // 'Manrope'

// Font Weights
TYPOGRAPHY.fontWeights.regular     // '400'
TYPOGRAPHY.fontWeights.semiBold    // '600'
TYPOGRAPHY.fontWeights.bold        // '700'

// Font Sizes
TYPOGRAPHY.fontSizes.xs      // 12
TYPOGRAPHY.fontSizes.sm      // 13
TYPOGRAPHY.fontSizes.base    // 14
TYPOGRAPHY.fontSizes.md      // 15
TYPOGRAPHY.fontSizes.lg      // 16
TYPOGRAPHY.fontSizes.xl      // 18
TYPOGRAPHY.fontSizes['2xl']  // 20
TYPOGRAPHY.fontSizes['3xl']  // 24
TYPOGRAPHY.fontSizes['4xl']  // 28

// Predefined Styles
TYPOGRAPHY.styles.h1         // Títulos principales (28px, bold)
TYPOGRAPHY.styles.h2         // Títulos secundarios (24px, bold)
TYPOGRAPHY.styles.h3         // Subtítulos (20px, bold)
TYPOGRAPHY.styles.h4         // Headers de componentes (18px, bold)
TYPOGRAPHY.styles.body       // Texto normal (15px, regular)
TYPOGRAPHY.styles.label      // Etiquetas (14px, semiBold)
TYPOGRAPHY.styles.caption    // Texto pequeño (12px, semiBold)
```

## 📏 Espaciado y Bordes (SPACING, BORDER_RADIUS)

```typescript
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

// Espaciado
SPACING.xs       // 4px
SPACING.sm       // 8px
SPACING.md       // 12px
SPACING.lg       // 16px
SPACING.xl       // 20px
SPACING['2xl']   // 24px
SPACING['3xl']   // 32px
SPACING['4xl']   // 40px

// Border Radius
BORDER_RADIUS.sm      // 8px
BORDER_RADIUS.md      // 12px
BORDER_RADIUS.lg      // 16px
BORDER_RADIUS.xl      // 20px
BORDER_RADIUS.full    // 30px
```

## 🌟 Sombras (SHADOWS)

```typescript
import { SHADOWS } from '../constants/spacing';

// Sombra suave (cards, textos)
SHADOWS.soft

// Sombra media (cards principales)
SHADOWS.medium

// Sombra fuerte (botones, overlay)
SHADOWS.strong
```

## 🎯 Estilos Globales (GlobalStyles)

Para componentes reutilizables:

```typescript
import { GlobalStyles } from '../constants/globalStyles';

const styles = StyleSheet.create({
  container: GlobalStyles.screenPadding,
  title: GlobalStyles.h2,
  button: GlobalStyles.buttonPrimary,
  buttonText: GlobalStyles.buttonPrimaryText,
  input: GlobalStyles.textInput,
  card: GlobalStyles.card,
});
```

## 📝 Ejemplo Práctico

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

export default function ExampleComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Título</Text>
      <Text style={styles.description}>Descripción del componente</Text>
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
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.textTitle,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
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
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    textAlign: 'center',
  },
});
```

## ⚠️ Importes Recomendados

Para mantener consistencia, siempre importa desde `../constants`:

```typescript
// ✅ CORRECTO
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

// ❌ NO RECOMENDADO
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
// etc...
```

## 🎨 Paleta de Colores Completa

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | #00AC83 | Headers, botones, acciones principales |
| Primary Alt | #00B89F | Estados hover, variantes |
| White | #FFFFFF | Fondos, tarjetas |
| Black | #000000 | Texto principal |
| Gray | #999999 | Texto secundario |
| Text Gray | #666666 | Descripción |
| Light Gray | #F5F5F5 | Fondos de inputs |
| Border | #E0E0E0 | Bordes |
| Placeholder | #F0F0F0 | Inputs vacíos |
| Light Green | #E8FFF5 | Background verde claro |
| Pallet Green | #E0F8F3 | Background verde pastel |
| Success | #00AC83 | Confirmaciones |
| Error | #FF6B6B | Errores críticos |
| Error Alt | #D65B5B | Errores secundarios |
| Warning | #FFB800 | Advertencias |
| Info | #5B5BD6 | Información |

## 🚀 Checklist para Nueva Pantalla

- [ ] Importar constantes de `../constants`
- [ ] Usar colores del objeto `COLORS`
- [ ] Usar tipografía consistente
- [ ] Aplicar espaciado con `SPACING`
- [ ] Usar `BORDER_RADIUS` estándar
- [ ] Aplicar `SHADOWS` cuando sea necesario
- [ ] Revisar que sea consistente con el proyecto AI7
