// src/constants/typography.ts
// Tipografía basada en Manrope font family

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: 'Manrope',
  
  // Font Weights (números para React Native)
  fontWeights: {
    regular: 400 as any,
    semiBold: 600 as any,
    bold: 700 as any,
  },

  // Font Sizes
  fontSizes: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Predefined Text Styles
  styles: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as any,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as any,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 20,
      fontWeight: '700' as any,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700' as any,
      lineHeight: 1.3,
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as any,
      lineHeight: 1.5,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '400' as any,
      lineHeight: 1.5,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as any,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '600' as any,
      lineHeight: 1.5,
    },
    small: {
      fontSize: 13,
      fontWeight: '400' as any,
      lineHeight: 1.5,
    },
  },
};
