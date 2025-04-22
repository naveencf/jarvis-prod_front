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
import SalesBonusApi from "../API/Sales/SalesBonusApi";

export const salesMiddlewares = [
  BrandApi.middleware,
  SalesAccountApi.middleware,
  SalesAccountTypeApi.middleware,
  CompanyTypeApi.middleware,
  SaleBookingApi.middleware,
  DocumentTypeApi.middleware,
  PointOfContactApi.middleware,
  AccountDocumentApi.middleware,
  SaleServiceApi.middleware,
  DocumentOverviewApi.middleware,
  GetGstDetailApi.middleware,
  ExecutionApi.middleware,
  RecordServicesApi.middleware,
  CreditApprovalApi.middleware,
  PaymentUpdateApi.middleware,
  PaymentModeApi.middleware,
  PaymentDetailsApi.middleware,
  SaleStatusApi.middleware,
  FinancePaymentModeApi.middleware,
  AgencyApi.middleware,
  ExecutionCampaignApi.middleware,
  IncentivePlanApi.middleware,
  InvoiceParticularApi.middleware,
  DepartmentApi.middleware,
  TargetCompetitionApi.middleware,
  SalePocApi.middleware,
  SalesReportApi.middleware,
  IncentiveSharingApi.middleware,
  SalesCategoryApi.middleware,
  IncentiveStatementApi.middleware,
  BrandCategoryTypeApi.middleware,
  SalesBonusApi.middleware,
];
