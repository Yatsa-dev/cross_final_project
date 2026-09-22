import { useEffect, useState } from 'react';

import { readJson, STORAGE_KEYS } from '../storage/persistence';
import { hydrate } from '../store/hydrate';
import { store } from '../store';

// Reads everything persisted before the first frame, so the app never flashes
// an empty cart or the wrong theme and then corrects itself.
export function useBootstrap() {
  const [state, setState] = useState({ isReady: false, savedThemeMode: undefined });

  useEffect(() => {
    let active = true;

    const restore = async () => {
      const [savedState, savedThemeMode] = await Promise.all([
        readJson(STORAGE_KEYS.STATE),
        readJson(STORAGE_KEYS.THEME),
      ]);

      if (!active) return;
      if (savedState) store.dispatch(hydrate(savedState));
      setState({ isReady: true, savedThemeMode: savedThemeMode ?? undefined });
    };

    restore();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
