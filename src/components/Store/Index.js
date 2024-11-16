import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";
import { reduxBaseURL } from "./reduxBaseURL";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorMaster from "./VendorMaster";
import pageMaster from "./PageMaster";
import { PageBaseURL } from "./PageBaseURL";
import SalesAccountApi from "./API/Sales/SalesAccountApi";
import SalesAccountTypeApi from "./API/Sales/SalesAccountTypeApi";
import CompanyTypeApi from "./API/Sales/CompanyTypeApi";
import BrandCategoryTypeApi from "./API/Sales/BrandCategoryTypeApi";
import SaleBookingApi from "./API/Sales/SaleBookingApi";
import BrandApi from "./API/Sales/BrandApi";
import DocumentTypeApi from "./API/Sales/DocumentTypeApi";
import PointOfContactApi from "./API/Sales/PointOfContactApi";
import AccountDocumentApi from "./API/Sales/AccountDocumentApi";
import SaleServiceApi from "./API/Sales/SalesServiceApi";
import DocumentOverviewApi from "./API/Sales/DocumentOverview";
import GetGstDetailApi from "./API/Sales/GetGstDetailApi";
import ExecutionApi from "./API/Sales/ExecutionApi";
import RecordServicesApi from "./API/Sales/RecordServicesApi";
import CreditApprovalApi from "./API/Sales/CreditApprovalApi";
import PageSlice from "./Page-slice";
import PaymentUpdateApi from "./API/Sales/PaymentUpdateApi";
import PaymentModeApi from "./API/Sales/PaymentModeApi";
import PaymentDetailsApi from "./API/Sales/PaymentDetailsApi";
import SaleStatusApi from "./API/Sales/SalesStatusApi";
import FinancePaymentModeApi from "./API/Finance/FinancePaymentModeApi";
import AgencyApi from "./API/Sales/AgencyApi";
import ExecutionCampaignApi from "./API/Sales/ExecutionCampaignApi";
import IncentivePlanApi from "./API/Sales/IncentivePlanApi";
import InvoiceParticularApi from "./API/Sales/InvoiceParticularApi";
import DepartmentApi from "./API/Sales/DepartmentApi";
import TargetCompetitionApi from "./API/Sales/TargetCompetitionApi";
import SalePocApi from "./API/Sales/SalesPocApi";
import SalesReportApi from "./API/Sales/SalesReportApi";
import IncentiveSharingApi from "./API/Sales/IncentiveSharingApi";
import TagCategoryApi from "./API/Inventory/TagCategoryAPI";
import CatAssignment from "./API/Inventory/CatAssignment";
import InvoiceRequestApi from "./API/Finance/InvoiceRequestApi";
import OutstandingApi from "./API/Finance/OutstandingApi";
import SaleBookingTdsApi from "./API/Finance/SaleBookingTdsApi";

const store = configureStore({
  reducer: {
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    executon,
    PageOverview,
    vendorMaster,
    pageMaster,
    PageSlice,
    [SalesAccountApi.reducerPath]: SalesAccountApi.reducer,
    [SalesAccountTypeApi.reducerPath]: SalesAccountTypeApi.reducer,
    [CompanyTypeApi.reducerPath]: CompanyTypeApi.reducer,
    [BrandCategoryTypeApi.reducerPath]: BrandCategoryTypeApi.reducer,
    [PageBaseURL.reducerPath]: PageBaseURL.reducer,
    [SaleBookingApi.reducerPath]: SaleBookingApi.reducer,
    [BrandApi.reducerPath]: BrandApi.reducer,
    [DocumentTypeApi.reducerPath]: DocumentTypeApi.reducer,
    [PointOfContactApi.reducerPath]: PointOfContactApi.reducer,
    [AccountDocumentApi.reducerPath]: AccountDocumentApi.reducer,
    [SaleServiceApi.reducerPath]: SaleServiceApi.reducer,
    [DocumentOverviewApi.reducerPath]: DocumentOverviewApi.reducer,
    [GetGstDetailApi.reducerPath]: GetGstDetailApi.reducer,
    [ExecutionApi.reducerPath]: ExecutionApi.reducer,
    [RecordServicesApi.reducerPath]: RecordServicesApi.reducer,
    [CreditApprovalApi.reducerPath]: CreditApprovalApi.reducer,
    [PaymentUpdateApi.reducerPath]: PaymentUpdateApi.reducer,
    [PaymentModeApi.reducerPath]: PaymentModeApi.reducer,
    [PaymentDetailsApi.reducerPath]: PaymentDetailsApi.reducer,
    [SaleStatusApi.reducerPath]: SaleStatusApi.reducer,
    [FinancePaymentModeApi.reducerPath]: FinancePaymentModeApi.reducer,
    [AgencyApi.reducerPath]: AgencyApi.reducer,
    [ExecutionCampaignApi.reducerPath]: ExecutionCampaignApi.reducer,
    [IncentivePlanApi.reducerPath]: IncentivePlanApi.reducer,
    [InvoiceParticularApi.reducerPath]: InvoiceParticularApi.reducer,
    [DepartmentApi.reducerPath]: DepartmentApi.reducer,
    [TargetCompetitionApi.reducerPath]: TargetCompetitionApi.reducer,
    [SalePocApi.reducerPath]: SalePocApi.reducer,
    [SalesReportApi.reducerPath]: SalesReportApi.reducer,
    [IncentiveSharingApi.reducerPath]: IncentiveSharingApi.reducer,
    [TagCategoryApi.reducerPath]: TagCategoryApi.reducer,
    [CatAssignment.reducerPath]: CatAssignment.reducer,
    [InvoiceRequestApi.reducerPath]: InvoiceRequestApi.reducer,
    [OutstandingApi.reducerPath]: OutstandingApi.reducer,
    [SaleBookingTdsApi.reducerPath]: SaleBookingTdsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reduxBaseURL.middleware)
      .concat(SalesAccountApi.middleware)
      .concat(SalesAccountTypeApi.middleware)
      .concat(CompanyTypeApi.middleware)
      .concat(BrandCategoryTypeApi.middleware)
      .concat(PageBaseURL.middleware)
      .concat(SaleBookingApi.middleware)
      .concat(BrandApi.middleware)
      .concat(DocumentTypeApi.middleware)
      .concat(PointOfContactApi.middleware)
      .concat(AccountDocumentApi.middleware)
      .concat(SaleServiceApi.middleware)
      .concat(DocumentOverviewApi.middleware)
      .concat(GetGstDetailApi.middleware)
      .concat(ExecutionApi.middleware)
      .concat(RecordServicesApi.middleware)
      .concat(CreditApprovalApi.middleware)
      .concat(PaymentUpdateApi.middleware)
      .concat(PaymentModeApi.middleware)
      .concat(PaymentDetailsApi.middleware)
      .concat(SaleStatusApi.middleware)
      .concat(FinancePaymentModeApi.middleware)
      .concat(AgencyApi.middleware)
      .concat(ExecutionCampaignApi.middleware)
      .concat(IncentivePlanApi.middleware)
      .concat(InvoiceParticularApi.middleware)
      .concat(DepartmentApi.middleware)
      .concat(TargetCompetitionApi.middleware)
      .concat(SalePocApi.middleware)
      .concat(SalesReportApi.middleware)
      .concat(IncentiveSharingApi.middleware)
      .concat(TagCategoryApi.middleware)
      .concat(TagCategoryApi.middleware)
      .concat(CatAssignment.middleware)
      .concat(InvoiceRequestApi.middleware)
      .concat(OutstandingApi.middleware)
      .concat(SaleBookingTdsApi.middleware),
});
setupListeners(store.dispatch);

export default store;
