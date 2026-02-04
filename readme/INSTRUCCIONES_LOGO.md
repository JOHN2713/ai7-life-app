# 📱 Instrucciones para agregar el logo

## Paso 1: Preparar tu imagen del logo

1. Guarda tu archivo de logo (PNG preferiblemente con fondo transparente)
2. Nómbralo como: **logo.png**
3. Colócalo en esta ruta:

```
ai7-life-app/
└── assets/
    └── images/
        └── logo.png   <-- Aquí va tu logo
```

## Paso 2: Formato recomendado

- **Formato**: PNG con transparencia
- **Tamaño recomendado**: 512x512 px o 1024x1024 px
- **Peso**: Menos de 500KB para mejor rendimiento

## Paso 3: Si usas otro nombre de archivo

Si tu logo tiene otro nombre (por ejemplo: `logo-ai7.png`), actualiza la línea 20 en:
`src/screens/SplashScreen.js`

Cambia:
```javascript
source={require('../../assets/images/logo.png')}
```

Por:
```javascript
source={require('../../assets/images/TU-NOMBRE-DE-ARCHIVO.png')}
```

## 🎨 Colores configurados

- **Color principal (AI7)**: #00B89F (turquesa/verde azulado)
- **Color texto secundario**: #999999 (gris)
- **Fondo**: #FFFFFF (blanco)

## ✅ Una vez agregues el logo:

1. Recarga la app presionando **'r'** en la terminal
2. O presiona **Ctrl+C** y ejecuta `npm start` nuevamente
