import AsyncStorage from '@react-native-async-storage/async-storage';

// One namespace per concern. The version suffix lets a future shape change
// ignore old payloads instead of crashing on them.
export const STORAGE_KEYS = {
  STATE: 'brewgo:state:v1',
  THEME: 'brewgo:theme:v1',
};

// Writes are debounced: a quantity stepper can fire several actions per second
// and every one of them would otherwise hit the disk.
const WRITE_DELAY_MS = 300;

export async function readJson(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // A corrupted or unreadable entry must not block startup: the app simply
    // starts from its default state.
    return null;
  }
}

export async function writeJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is a convenience, never a requirement for the app to work.
  }
}

export function createDebouncedWriter(key) {
  let timer = null;
  let pending = null;

  return (value) => {
    pending = value;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      writeJson(key, pending);
    }, WRITE_DELAY_MS);
  };
}
