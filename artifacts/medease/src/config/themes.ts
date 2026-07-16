/**
 * Theme configuration for white-label and branding.
 * CSS variables are defined in styles/globals.css; this file holds metadata.
 */
export const themes = {
  default: {
    id: 'default',
    label: "Med'ease",
    primaryHue: 222,
  },
} as const;

export type ThemeId = keyof typeof themes;

export const defaultThemeId: ThemeId = 'default';
