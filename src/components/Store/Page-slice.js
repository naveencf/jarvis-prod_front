import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  showPageInfoModal: false,
  pageRow: {},
};
const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setShowPageInfoModal(state, action) {
      state.showPageInfoModal = action.payload;
    },
    setPageRow(state, action) {
      state.pageRow = action.payload;
    },
  },
});

export const { setShowPageInfoModal , setPageRow } = pageSlice.actions;
export default pageSlice.reducer;
