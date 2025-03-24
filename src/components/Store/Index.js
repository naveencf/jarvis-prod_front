import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";
import { reduxBaseURL } from "./reduxBaseURL";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorMaster from "./VendorMaster";
import pageMaster from "./PageMaster";
import { PageBaseURL } from "./PageBaseURL";
import PageSlice from "./Page-slice";
import TagCategoryApi from "./API/Inventory/TagCategoryAPI";
import CatAssignment from "./API/Inventory/CatAssignment";
import InvoiceRequestApi from "./API/Finance/InvoiceRequestApi";
import OutstandingApi from "./API/Finance/OutstandingApi";
import SaleBookingTdsApi from "./API/Finance/SaleBookingTdsApi";
import OutstandingNewApi from "./API/Finance/OutstandingNew";
import OperationApi from "./API/Operation/OperationApi";
import PurchaseRequestPaymentApi from "./API/Purchase/PurchaseRequestPaymentApi";
import { salesReducers } from "./Reducer/SalesReducer";
import { salesMiddlewares } from "./Middleware/SalesMiddleware";
import DirectPurchaseApi from "./API/Purchase/DirectPurchaseApi";
import { purchaseApi } from "../Purchase/api/purchaseApiSlice";
import PantryApi from "./API/Pantry/PantryApi";
import BoostingApi from "./API/Boosting/BoostingApi";

const store = configureStore({
  reducer: {
    ...salesReducers,
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    [PageBaseURL.reducerPath]: PageBaseURL.reducer,
    [TagCategoryApi.reducerPath]: TagCategoryApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [CatAssignment.reducerPath]: CatAssignment.reducer,
    [OutstandingApi.reducerPath]: OutstandingApi.reducer,
    [InvoiceRequestApi.reducerPath]: InvoiceRequestApi.reducer,
    [SaleBookingTdsApi.reducerPath]: SaleBookingTdsApi.reducer,
    [OutstandingNewApi.reducerPath]: OutstandingNewApi.reducer,
    [OperationApi.reducerPath]: OperationApi.reducer,
    [PurchaseRequestPaymentApi.reducerPath]: PurchaseRequestPaymentApi.reducer,
    [DirectPurchaseApi.reducerPath]: DirectPurchaseApi.reducer,
    [PantryApi.reducerPath]: PantryApi.reducer,
    [BoostingApi.reducerPath]: DirectPurchaseApi.reducer,

    executon,
    PageOverview,
    vendorMaster,
    pageMaster,
    PageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(...salesMiddlewares)
      .concat(reduxBaseURL.middleware)
      .concat(PageBaseURL.middleware)
      .concat(purchaseApi.middleware)
      .concat(TagCategoryApi.middleware)
      .concat(CatAssignment.middleware)
      .concat(OutstandingApi.middleware)
      .concat(InvoiceRequestApi.middleware)
      .concat(SaleBookingTdsApi.middleware)
      .concat(OperationApi.middleware)
      .concat(PurchaseRequestPaymentApi.middleware)
      .concat(OutstandingNewApi.middleware)
      .concat(DirectPurchaseApi.middleware)
      .concat(PantryApi.middleware)
      .concat(BoostingApi.middleware),
});
setupListeners(store.dispatch);

export default store;
