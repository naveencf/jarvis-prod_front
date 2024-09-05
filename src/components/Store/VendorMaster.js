import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddVendorModal: false,
  showViewVendorModal: false,
  showVendorInfoModal: false,
  vendorRowData: [],
  showAddPlatformModal: false,
  modalType: "",
};

const vendorMaster = createSlice({
  name: "vendorMaster",
  initialState,
  reducers: {
    setShowAddVendorModal(state) {
      state.showAddVendorModal = true;
    },
    setCloseAddVendorModal(state) {
      state.showAddVendorModal = false;
    },
    setShowViewVendorModal(state) {
      state.showViewVendorModal = true;
    },
    setCloseViewVendorModal(state) {
      state.showViewVendorModal = false;
    },
    handleChangeVendorInfoModal(state) {
      state.showVendorInfoModal = !state.showVendorInfoModal;
    },
    setVendorRowData(state, action) {
      state.vendorRowData = action.payload;
    },
    setPlatformModal(state) {
      state.showAddPlatformModal = !state.showAddPlatformModal;
    },
    setModalType(state, action) {
      state.modalType = action.payload;
    },
  },
});

export const {
  setShowAddVendorModal,
  setCloseAddVendorModal,
  setShowViewVendorModal,
  setCloseViewVendorModal,
  handleChangeVendorInfoModal,
  setVendorRowData,
  setModalType,
} = vendorMaster.actions;
export default vendorMaster.reducer;
