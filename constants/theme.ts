/**
 * Design tokens — use these with StyleSheet.create() or inline styles
 * for components that don't support className (SafeAreaView, Pressable
 * pressed states, Animated.View, etc.). See AGENTS.md style exception rules.
 *
 * For className-based styling use the Tailwind utilities in global.css.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  primary: {
    linguaPurple: "#6c4ef5",
    linguaDeepPurple: "#5b3bf6",
    linguaBlue: "#4d88ff",
    linguaGreen: "#21c16b",
  },
  semantic: {
    success: "#21c16b",
    warning: "#ffcb00",
    streak: "#ff8a00",
    error: "#ff4d4f",
    info: "#4d88ff",
  },
  neutral: {
    textPrimary: "#001328",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    surface: "#f6f7fb",
    background: "#ffffff",
  },
} as const;

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Match the keys used in useFonts() in app/_layout.tsx

export const fonts = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// lineHeight = Math.round(fontSize * multiplier)
// H1: 32 × 1.2 = 38   H2: 24 × 1.3 = 31   H3: 20 × 1.3 = 26
// H4: 16 × 1.4 = 22   bodyLg: 16 × 1.6 = 26  bodyMd: 14 × 1.6 = 22
// bodySm: 13 × 1.6 = 21  caption: 11 × 1.4 = 15

export const typography = {
  h1: { fontSize: 32, lineHeight: 38, fontFamily: fonts.bold },
  h2: { fontSize: 24, lineHeight: 31, fontFamily: fonts.semiBold },
  h3: { fontSize: 20, lineHeight: 26, fontFamily: fonts.semiBold },
  h4: { fontSize: 16, lineHeight: 22, fontFamily: fonts.medium },
  bodyLarge: { fontSize: 16, lineHeight: 26, fontFamily: fonts.regular },
  bodyMedium: { fontSize: 14, lineHeight: 22, fontFamily: fonts.regular },
  bodySmall: { fontSize: 13, lineHeight: 21, fontFamily: fonts.regular },
  caption: { fontSize: 11, lineHeight: 15, fontFamily: fonts.regular },
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  screenPadding: 24,
} as const;
