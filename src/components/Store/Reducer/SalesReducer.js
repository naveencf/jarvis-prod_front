import SalesAccountApi from "../API/Sales/SalesAccountApi";
import SalesAccountTypeApi from "../API/Sales/SalesAccountTypeApi";
import CompanyTypeApi from "../API/Sales/CompanyTypeApi";
import SaleBookingApi from "../API/Sales/SaleBookingApi";
import DocumentTypeApi from "../API/Sales/DocumentTypeApi";
import PointOfContactApi from "../API/Sales/PointOfContactApi";
import AccountDocumentApi from "../API/Sales/AccountDocumentApi";
import SaleServiceApi from "../API/Sales/SalesServiceApi";
import DocumentOverviewApi from "../API/Sales/DocumentOverview";
import GetGstDetailApi from "../API/Sales/GetGstDetailApi";
import ExecutionApi from "../API/Sales/ExecutionApi";
import RecordServicesApi from "../API/Sales/RecordServicesApi";
import CreditApprovalApi from "../API/Sales/CreditApprovalApi";
import PaymentUpdateApi from "../API/Sales/PaymentUpdateApi";
import PaymentModeApi from "../API/Sales/PaymentModeApi";
import PaymentDetailsApi from "../API/Sales/PaymentDetailsApi";
import SaleStatusApi from "../API/Sales/SalesStatusApi";
import FinancePaymentModeApi from "../API/Finance/FinancePaymentModeApi";
import AgencyApi from "../API/Sales/AgencyApi";
import ExecutionCampaignApi from "../API/Sales/ExecutionCampaignApi";
import IncentivePlanApi from "../API/Sales/IncentivePlanApi";
import InvoiceParticularApi from "../API/Sales/InvoiceParticularApi";
import DepartmentApi from "../API/Sales/DepartmentApi";
import TargetCompetitionApi from "../API/Sales/TargetCompetitionApi";
import SalePocApi from "../API/Sales/SalesPocApi";
import SalesReportApi from "../API/Sales/SalesReportApi";
import IncentiveSharingApi from "../API/Sales/IncentiveSharingApi";
import SalesCategoryApi from "../API/Sales/salesCategoryApi";
import IncentiveStatementApi from "../API/Sales/IncentiveSettelmentApi";
import BrandApi from "../API/Sales/BrandApi";
import BrandCategoryTypeApi from "../API/Sales/BrandCategoryTypeApi";

export const salesReducers = {
  [BrandApi.reducerPath]: BrandApi.reducer,
  [SalesAccountApi.reducerPath]: SalesAccountApi.reducer,
  [SalesAccountTypeApi.reducerPath]: SalesAccountTypeApi.reducer,
  [CompanyTypeApi.reducerPath]: CompanyTypeApi.reducer,
  [SaleBookingApi.reducerPath]: SaleBookingApi.reducer,
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
  [SalesCategoryApi.reducerPath]: SalesCategoryApi.reducer,
  [IncentiveStatementApi.reducerPath]: IncentiveStatementApi.reducer,
  [BrandCategoryTypeApi.reducerPath]: BrandCategoryTypeApi.reducer,
};
