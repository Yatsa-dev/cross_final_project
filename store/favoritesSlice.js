import { createSlice } from '@reduxjs/toolkit';

import { hydrate } from './hydrate';

// Only identifiers are stored. Titles, prices and photos come from the API and
// a copy on disk would go stale the moment the menu changes.
//
// The key is category + id, not the id alone: /hot and /iced reuse ids, so four
// drinks would otherwise share a favourite flag with an unrelated drink.
export const favoriteKey = (category, drinkId) => `${category}:${drinkId}`;

const initialState = {
  keys: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: {
      reducer: (state, action) => {
        const key = action.payload;
        const index = state.keys.indexOf(key);

        if (index === -1) {
          state.keys.push(key);
          return;
        }
        state.keys.splice(index, 1);
      },
      prepare: (category, drinkId) => ({ payload: favoriteKey(category, drinkId) }),
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      const saved = action.payload?.favorites;
      if (Array.isArray(saved?.keys)) state.keys = saved.keys;
    });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const selectFavoriteKeys = (state) => state.favorites.keys;

export const selectFavoritesCount = (state) => state.favorites.keys.length;

// Takes the key so a single card can subscribe to its own flag without being
// re-rendered when an unrelated drink is favourited.
export const selectIsFavorite = (state, key) => state.favorites.keys.includes(key);

export default favoritesSlice.reducer;
