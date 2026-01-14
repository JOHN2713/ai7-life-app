// src/constants/globalStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';
import { TYPOGRAPHY } from './typography';

export const GlobalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screenPadding: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },

  // Headers
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  } as any,

  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: 700,
    color: COLORS.white,
  } as any,

  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 400,
    color: COLORS.white,
    marginTop: SPACING.sm,
    opacity: 0.9,
  } as any,

  // Typography
  h1: {
    fontSize: TYPOGRAPHY.fontSizes['4xl'],
    fontWeight: 700,
    color: COLORS.textTitle,
  } as any,

  h2: {
    fontSize: TYPOGRAPHY.fontSizes['3xl'],
    fontWeight: 700,
    color: COLORS.textTitle,
  } as any,

  h3: {
    fontSize: TYPOGRAPHY.fontSizes['2xl'],
    fontWeight: 700,
    color: COLORS.textTitle,
  } as any,

  h4: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: 700,
    color: COLORS.textTitle,
  } as any,

  body: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 400,
    color: COLORS.textSecondary,
    lineHeight: 22,
  } as any,

  bodyMedium: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: 400,
    color: COLORS.textSecondary,
    lineHeight: 24,
  } as any,

  label: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 600,
    color: COLORS.textTitle,
  } as any,

  caption: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: 600,
    color: COLORS.textGray,
  } as any,

  // Buttons
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.strong,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,

  buttonPrimaryText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 700,
    color: COLORS.white,
  } as any,

  buttonSecondary: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,

  buttonSecondaryText: {
    fontSize: TYPOGRAPHY.fontSizes.base,
    fontWeight: 700,
    color: COLORS.textTitle,
  } as any,

  // Inputs
  textInput: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.base,
    color: COLORS.textTitle,
  } as any,

  textInputPlaceholder: {
    color: COLORS.placeholder,
  },

  // Cards
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  } as any,

  cardSmall: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.soft,
  } as any,

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },

  // Spacers
  spacerSm: {
    height: SPACING.sm,
  },

  spacerMd: {
    height: SPACING.md,
  },

  spacerLg: {
    height: SPACING.lg,
  },

  spacerXl: {
    height: SPACING.xl,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Section
  section: {
    marginBottom: SPACING['2xl'],
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: 700,
    color: COLORS.textTitle,
    marginBottom: SPACING.md,
  } as any,

  sectionSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    fontWeight: 400,
    color: COLORS.textGray,
    marginBottom: SPACING.lg,
  } as any,
});
