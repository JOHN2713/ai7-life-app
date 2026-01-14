# 🎨 REFERENCIA RÁPIDA DE ESTILOS

## Importar
```typescript
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
```

## 🎨 Colores Principales
```
COLORS.primary        #00AC83 (Verde)
COLORS.white          #FFFFFF
COLORS.textTitle      #000000
COLORS.textSecondary  #666666
COLORS.lightGray      #F5F5F5
COLORS.border         #E0E0E0
COLORS.error          #FF6B6B
COLORS.warning        #FFB800
COLORS.success        #00AC83
```

## 🔤 Tamaños de Fuente
```
TYPOGRAPHY.fontSizes.xs       12px
TYPOGRAPHY.fontSizes.sm       13px
TYPOGRAPHY.fontSizes.base     14px
TYPOGRAPHY.fontSizes.md       15px
TYPOGRAPHY.fontSizes.lg       16px
TYPOGRAPHY.fontSizes.xl       18px
TYPOGRAPHY.fontSizes['2xl']   20px
TYPOGRAPHY.fontSizes['3xl']   24px
TYPOGRAPHY.fontSizes['4xl']   28px
```

## 📏 Espaciado
```
SPACING.xs     4px
SPACING.sm     8px
SPACING.md     12px
SPACING.lg     16px
SPACING.xl     20px
SPACING['2xl'] 24px
SPACING['3xl'] 32px
SPACING['4xl'] 40px
```

## 🎯 Border Radius
```
BORDER_RADIUS.sm      8px
BORDER_RADIUS.md      12px
BORDER_RADIUS.lg      16px
BORDER_RADIUS.xl      20px
BORDER_RADIUS.full    30px
```

## 🌟 Sombras
```
...SHADOWS.soft     Para elementos secundarios
...SHADOWS.medium   Para cards
...SHADOWS.strong   Para botones
```

## 💡 Ejemplos Comunes

### Container
```typescript
paddingHorizontal: SPACING.xl,
paddingVertical: SPACING.lg,
backgroundColor: COLORS.white,
```

### Título
```typescript
fontSize: TYPOGRAPHY.fontSizes['2xl'],
fontWeight: 700,
color: COLORS.textTitle,
```

### Botón
```typescript
backgroundColor: COLORS.primary,
paddingVertical: SPACING.lg,
borderRadius: BORDER_RADIUS.md,
...SHADOWS.strong,
```

### Input
```typescript
backgroundColor: COLORS.lightGray,
borderColor: COLORS.border,
borderRadius: BORDER_RADIUS.md,
paddingHorizontal: SPACING.lg,
```

### Card
```typescript
backgroundColor: COLORS.white,
borderRadius: BORDER_RADIUS.lg,
padding: SPACING.xl,
...SHADOWS.medium,
```

## 🚀 Uso Rápido
```typescript
// Importar
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants';

// Crear estilos
const styles = StyleSheet.create({
  view: { flex: 1, padding: SPACING.xl, backgroundColor: COLORS.white },
  text: { fontSize: TYPOGRAPHY.fontSizes.base, color: COLORS.textTitle },
  button: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, ...SHADOWS.strong },
});

// Usar
<View style={styles.view}>
  <Text style={styles.text}>Hola</Text>
  <TouchableOpacity style={styles.button} />
</View>
```

---
Guarda esta página como referencia 📌
