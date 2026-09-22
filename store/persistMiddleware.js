import { createDebouncedWriter, STORAGE_KEYS } from '../storage/persistence';
import { hydrate } from './hydrate';

const write = createDebouncedWriter(STORAGE_KEYS.STATE);

// Only what is worth restoring is written back. Menu data is deliberately left
// out: it belongs to the API and a stale copy on disk would be worse than a
// fresh request.
const persistable = (state) => ({
  cart: state.cart,
  orders: state.orders,
  favorites: state.favorites,
});

// Writing after the reducer ran means the snapshot already includes this action.
// Hydration is skipped, otherwise startup would immediately rewrite what it read.
export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type !== hydrate.type) write(persistable(store.getState()));
  return result;
};
