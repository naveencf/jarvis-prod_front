import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

const initialState = {
  showAddModal: false,
  modalType: "",
  showInfoModal: false,
  rowData: {},
  statsUpdate: false,
  showRightSlidder: false
};

const pageMasterSlice = createSlice({
  name: "pageMaster",
  initialState,
  reducers: {
    setOpenShowAddModal(state) {
      state.showAddModal = true;
    },
    setShowRightSlidder(state,action) {
      state.showRightSlidder = action.payload;
    },
    setCloseShowAddModal(state) {
      state.showAddModal = false;
    },
    setModalType(state, action) {
      state.modalType = action.payload;
    },
    setOpenShowPageInfoModal(state) {
      state.showInfoModal = true;
    },
    setCloseShowPageInfoModal(state) {
      state.showInfoModal = false;
    },
    setRowData(state, action) {
      state.rowData = action.payload;
    },
    setStatsUpdate(state, action) {
      state.statsUpdate = action.payload;
    },
  },
});
export const {
  setOpenShowAddModal,
  setCloseShowAddModal,
  setModalType,
  setOpenShowPageInfoModal,
  setCloseShowPageInfoModal,
  setRowData,
  setStatsUpdate,
  setShowRightSlidder
} = pageMasterSlice.actions;
export default pageMasterSlice.reducer;
