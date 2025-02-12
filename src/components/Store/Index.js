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
import DirectPuchaseApi from "./API/Purchase/DirectPuchaseApi";

const store = configureStore({
  reducer: {
    ...salesReducers,
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    [PageBaseURL.reducerPath]: PageBaseURL.reducer,
    [TagCategoryApi.reducerPath]: TagCategoryApi.reducer,
    [CatAssignment.reducerPath]: CatAssignment.reducer,
    [OutstandingApi.reducerPath]: OutstandingApi.reducer,
    [InvoiceRequestApi.reducerPath]: InvoiceRequestApi.reducer,
    [SaleBookingTdsApi.reducerPath]: SaleBookingTdsApi.reducer,
    [OutstandingNewApi.reducerPath]: OutstandingNewApi.reducer,
    [OperationApi.reducerPath]: OperationApi.reducer,
    [PurchaseRequestPaymentApi.reducerPath]: PurchaseRequestPaymentApi.reducer,
    [DirectPuchaseApi.reducerPath]: DirectPuchaseApi.reducer,
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
      .concat(TagCategoryApi.middleware)
      .concat(CatAssignment.middleware)
      .concat(OutstandingApi.middleware)
      .concat(InvoiceRequestApi.middleware)
      .concat(SaleBookingTdsApi.middleware)
      .concat(OperationApi.middleware)
      .concat(PurchaseRequestPaymentApi.middleware)
      .concat(OutstandingNewApi.middleware)
      .concat(DirectPuchaseApi.middleware),
});
setupListeners(store.dispatch);

export default store;
