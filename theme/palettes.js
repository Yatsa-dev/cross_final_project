// Two palettes with identical keys, so any component can switch between them
// without knowing which theme is active. Key names mirror the Figma styles.
//
// Note on `espresso` / `textOnDark`: espresso is the fill of primary buttons and
// accent circles, textOnDark is the label drawn on top of it. In the dark theme
// those roles invert — the fill becomes light and the label dark — but the pair
// keeps working because components always use them together.
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const light = {
  espresso: '#2B1B14',
  coffee: '#7A4E2D',
  caramel: '#C98B5E',

  cream: '#FBF6F1',
  card: '#FFFFFF',
  muted: '#F2E9E1',

  textPrimary: '#1F1712',
  textSecondary: '#7A6A5F',
  textOnDark: '#FFFFFF',

  border: '#E7DCD2',
  success: '#2F7D5B',
};

const dark = {
  espresso: '#EADFD5',
  coffee: '#D2A77C',
  caramel: '#C98B5E',

  cream: '#16100D',
  card: '#211A16',
  muted: '#2C231E',

  textPrimary: '#F6EFE9',
  textSecondary: '#B3A398',
  textOnDark: '#1F1712',

  border: '#3A2E27',
  success: '#5CBF92',
};

export const palettes = {
  [THEME_MODES.LIGHT]: light,
  [THEME_MODES.DARK]: dark,
};

// Shadows are tinted with the same brown in both themes, so the colour is kept
// outside the palettes — it is not a themed surface.
export const SHADOW_TINT = '#2B1B14';
