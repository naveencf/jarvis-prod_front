import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tagCategories: [],
  platforms: [],
  showTagCategoriesModal: false,
  showWhatsappModal: false,
  venodrRowData: [],
  showPageModal: false,
  showVendorNotAssignedModal: false,
  showBankDetailsModal: false,
  rowData:""
};

const pageOverviewSlice = createSlice({
  name: "pageOverview",
  initialState,
  reducers: {
    setTagCategories(state, action) {
      state.tagCategories = action.payload;
    },
    closeTagCategoriesModal(state) {
      state.showTagCategoriesModal = false;
    },
    openTagCategoriesModal(state) {
      state.showTagCategoriesModal = true;
    },
    setPlatform(state, action) {
      state.platforms = action.payload;
    },
    setShowPageHealthColumn(state, action) {
      state.showPageHelathColumn = action.payload;
    },
    setShowWhatsappModal(state) {
      state.showWhatsappModal = true;
    },
    setCloseWhatsappModal(state) {
      state.showWhatsappModal = false;
    },
    setVendorRowData(state, action) {
      state.venodrRowData = action.payload;
    },
    setShowPageModal(state) {
      state.showPageModal = true;
    },
    setClosePageModal(state) {
      state.showPageModal = false;
    },
    setShowVendorNotAssignedModal(state) {
      state.showVendorNotAssignedModal = true;
    },
    setCloseVendorNotAssignedModal(state) {
      state.showVendorNotAssignedModal = false;
    },
    setShowBankDetailsModal(state) {
      state.showBankDetailsModal = true;
    },
    setCloseBankDetailsModal(state) {
      state.showBankDetailsModal = false;
  },
  setRowData(state, action) {
    state.rowData = action.payload;
  },
}
});

export const {
  setTagCategories,
  closeTagCategoriesModal,
  openTagCategoriesModal,
  setPlatform,
  setShowPageHealthColumn,
  setShowWhatsappModal,
  setCloseWhatsappModal,
  setVendorRowData,
  setShowPageModal,
  setClosePageModal,
  setShowVendorNotAssignedModal,
  setCloseVendorNotAssignedModal,
  setShowBankDetailsModal,
  setCloseBankDetailsModal,
  setRowData,
} = pageOverviewSlice.actions;
export default pageOverviewSlice.reducer;
