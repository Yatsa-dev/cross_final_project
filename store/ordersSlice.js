import { createSlice } from '@reduxjs/toolkit';

import { hydrate } from './hydrate';

// A pickup order goes through these two states only: the app has no courier
// stage, so anything beyond "ready" would be invented.
export const ORDER_STATUS = {
  PREPARING: 'preparing',
  DONE: 'done',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PREPARING]: 'Готується',
  [ORDER_STATUS.DONE]: 'Виконано',
};

// Every ninth drink is free, so the card fills up over eight cups.
export const LOYALTY_GOAL = 8;

const initialState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // The whole cart is copied into the order: history has to keep showing what
    // was bought even after the menu or its prices change.
    placeOrder: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      // Numbers and timestamps are generated here rather than in the reducer,
      // which must stay pure to remain predictable.
      prepare: ({ items, total, time, payment }) => ({
        payload: {
          id: `${Date.now()}`,
          number: String(1000 + Math.floor(Math.random() * 9000)),
          createdAt: new Date().toISOString(),
          status: ORDER_STATUS.PREPARING,
          items,
          total,
          time,
          payment,
        },
      }),
    },

    markOrderDone: (state, action) => {
      const order = state.items.find((item) => item.id === action.payload);
      if (order) order.status = ORDER_STATUS.DONE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrate, (state, action) => {
      const saved = action.payload?.orders;
      if (saved?.items) state.items = saved.items;
    });
  },
});

export const { placeOrder, markOrderDone } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.items;

export const selectOrderById = (state, orderId) =>
  state.orders.items.find((order) => order.id === orderId) ?? null;

// Loyalty counts cups, not orders: a single order of three drinks fills three
// slots on the card.
export const selectLoyaltyCups = (state) =>
  state.orders.items.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

export default ordersSlice.reducer;
