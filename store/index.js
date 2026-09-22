import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import favoritesReducer from './favoritesSlice';
import ordersReducer from './ordersSlice';
import { persistMiddleware } from './persistMiddleware';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistMiddleware),
});
