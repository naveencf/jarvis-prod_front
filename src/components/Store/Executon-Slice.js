import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  row: [],
};

const executonSlice = createSlice({
  name: "executon",
  initialState,
  reducers: {
    addRow: (state, action) => {
      state.row = [action.payload];
    },
  },
});

export const { addRow } = executonSlice.actions;
export default executonSlice.reducer;
