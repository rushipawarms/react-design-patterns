import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { count: 0, total: 0 },
  reducers: {
    add: (state, action) => {
      state.count += 1;
      state.total += action.payload.price;
    },
    reset: (state) => {
      state.count = 0;
      state.total = 0;
    },
  },
});

export const { add, reset } = cartSlice.actions;
export default cartSlice.reducer;