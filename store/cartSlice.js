import { createSlice } from '@reduxjs/toolkit';

import { hydrate } from './hydrate';

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

// Prices arrive from the API as strings like "55 ₴", so the numeric value is
// parsed only where arithmetic is needed and never stored twice.
const priceToNumber = (price) => Number(String(price).replace(/[^\d]/g, '')) || 0;

// The cart starts empty and is restored from storage at launch. It used to
// open with a local seed, which made sense only while nothing could be added
// from the menu.
const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // A repeated drink increases the quantity of the existing line instead of
    // creating a duplicate row. The category is part of the match because the
    // API reuses ids between /hot and /iced.
    addItem: (state, action) => {
      const drink = action.payload;
      const existing = state.items.find(
        (item) => item.drinkId === drink.id && item.category === drink.category
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY);
        return;
      }

      state.items.push({
        id: `${drink.category}-${drink.id}-${Date.now()}`,
        drinkId: drink.id,
        category: drink.category,
        title: drink.title,
        options: drink.volume,
        price: drink.price,
        imageUrl: drink.imageUrl,
        quantity: MIN_QUANTITY,
      });
    },

    // Puts every line of a past order back into the cart. The lines are already
    // in cart shape, so nothing has to be fetched from the API to repeat.
    repeatOrder: {
      reducer: (state, action) => {
        action.payload.lines.forEach((line) => {
          const existing = state.items.find(
            (item) => item.drinkId === line.drinkId && item.category === line.category
          );

          if (existing) {
            existing.quantity = Math.min(existing.quantity + line.quantity, MAX_QUANTITY);
            return;
          }
          state.items.push(line);
        });
      },
      // Ids are built here because a reducer must stay pure, and the index keeps
      // them unique when several lines are added within the same millisecond.
      prepare: (lines) => ({
        payload: {
          lines: lines.map((line, index) => ({
            ...line,
            id: `${line.category}-${line.drinkId}-${Date.now()}-${index}`,
          })),
        },
      }),
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;

      // Dropping to zero removes the line, which is what the stepper's minus
      // button should do at the last unit.
      if (quantity < MIN_QUANTITY) {
        state.items = state.items.filter((entry) => entry.id !== id);
        return;
      }

      item.quantity = Math.min(quantity, MAX_QUANTITY);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      const saved = action.payload?.cart;
      if (Array.isArray(saved?.items)) state.items = saved.items;
    });
  },
});

export const { addItem, repeatOrder, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + priceToNumber(item.price) * item.quantity, 0);

export default cartSlice.reducer;
