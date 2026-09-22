import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { palettes, THEME_MODES } from '../theme/palettes';
import { STORAGE_KEYS, writeJson } from '../storage/persistence';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialMode = THEME_MODES.LIGHT }) {
  // The stored value is checked against the palettes rather than trusted:
  // an old or corrupted entry must not leave the app without colours.
  const [mode, setMode] = useState(() =>
    palettes[initialMode] ? initialMode : THEME_MODES.LIGHT
  );

  // The provider is mounted only after the saved mode has been read, so this
  // first write repeats the stored value instead of clobbering it.
  useEffect(() => {
    writeJson(STORAGE_KEYS.THEME, mode);
  }, [mode]);

  const toggleTheme = useCallback(
    () => setMode((current) => (current === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT)),
    []
  );

  // The value is memoised on mode: without it every render would hand consumers
  // a new object and re-render the whole tree on unrelated state changes.
  const value = useMemo(
    () => ({
      mode,
      colors: palettes[mode],
      isDark: mode === THEME_MODES.DARK,
      toggleTheme,
      setMode,
    }),
    [mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme має викликатись усередині ThemeProvider');
  }

  return context;
}
