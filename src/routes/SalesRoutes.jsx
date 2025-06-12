import  { lazy, Suspense } from "react";
import { Route, Routes, } from 'react-router-dom'
const SalesDashboard = lazy(() => import('../components/AdminPanel/Sales/SalesDashboard'));
const ViewSaleBooking = lazy(() => import('../components/AdminPanel/Sales/SaleBooking/ViewSaleBooking'));
const SalesReport = lazy(() => import('../components/AdminPanel/Sales/SaleBooking/SalesReport'));
const IncentiveDashboard = lazy(() => import('../components/AdminPanel/Sales/Incenti Dashboard/IncentiveDashboard'));
const MonthWiseSalesView = lazy(() => import('../components/AdminPanel/Sales/SaleBooking/MonthWiseSalesView'));
const ViewInvoiceRequest = lazy(() => import('../components/AdminPanel/Sales/Invoice/ViewInvoiceRequest'));
import SalesServicesCreate from '../components/AdminPanel/Sales/SalesServices/SalesServicesCreate';
// import SalesServicesUpdate from '../components/AdminPanel/Sales/SalesServices/SalesServicesUpdate';
import SalesServicesOverview from '../components/AdminPanel/Sales/SalesServices/SalesServicesOverview';
import CreditApprovalReasonCreate from '../components/AdminPanel/Sales/CreditApprovalReason/CreditApprovalReasonCreate';
import CreditApprovalReasonView from '../components/AdminPanel/Sales/CreditApprovalReason/CreditApprovalReasonView';
import IncentiveRequest from '../components/AdminPanel/Sales/Incenti Dashboard/IncentiveRequest';
import IncentiveSettlement from '../components/AdminPanel/Sales/Incentive Settlement/IncentiveSettlement';
import CreditApprovalReasonUpdate from '../components/AdminPanel/Sales/CreditApprovalReason/CreditApprovalReasonUpdate';
import CreateSaleBooking from '../components/AdminPanel/Sales/SaleBooking/CreateSaleBooking';
import UserIncentive from '../components/AdminPanel/Sales/Incenti Dashboard/UserIncentive';
import PlanRequest from '../components/Finance/Sales Management/PlanRequest/PlanRequest';
import SalesBonusSlab from '../components/AdminPanel/Sales/ Bonus/SaleBonusSlab';
import BonusMastAddEdit from '../components/AdminPanel/Sales/ Bonus/BonusMast/BonusMastAddEdit';
import BonusSlabMastAddEdit from '../components/AdminPanel/Sales/ Bonus/BonusSlabMast/BonusSlabMastAddEdit';
// import BonusSlabOverview from '../components/AdminPanel/Sales/ Bonus/BonusSlabMast/BonusSlabOverview';
import BonusMastOverview from '../components/AdminPanel/Sales/ Bonus/BonusMast/BonusMastOverview';
import SalesBonusOverview from '../components/AdminPanel/Sales/ Bonus/SalesBonusOverview';
import SalesBonusSummary from '../components/AdminPanel/Sales/ Bonus/SalesBonusSummary';
import ViewSalesPoc from '../components/AdminPanel/Sales/ViewSalesPoc';
import CreatePaymentMode from '../components/AdminPanel/Sales/PaymentMode/CreatePaymentMode';
import EarnedAndUnearned from '../components/AdminPanel/Sales/Incenti Dashboard/EarnedAndUnearned';
import ViewPaymentMode from '../components/AdminPanel/Sales/PaymentMode/ViewPaymentMode';
import EditPaymentMode from '../components/Finance/EditPaymentMode';
import CreatePaymentDetails from '../components/AdminPanel/Sales/PaymentDetails/CreatePaymentDetails';
import ViewPaymentDetails from '../components/AdminPanel/Sales/PaymentDetails/ViewPaymentDetails';
import ViewOutstanding from '../components/AdminPanel/Sales/SaleBooking/Outstanding/ViewOutstanding';
import EditPaymentDetails from '../components/AdminPanel/Sales/PaymentDetails/EditPayementDetails';
import CreatePaymentUpdate from '../components/AdminPanel/Sales/PaymentUpdate/CreatePaymentUpdate';
import ViewPaymentUpdate from '../components/AdminPanel/Sales/PaymentUpdate/ViewPaymentUpdate';
import PaymentUpdateBankWise from '../components/AdminPanel/Sales/PaymentUpdate/PaymentUpdateBankWise';
import DeletedSaleBooking from '../components/AdminPanel/Sales/SaleBooking/DeletedSaleBooking';
// import PendingPaymentRequestSales from '../components/AdminPanel/Sales/PaymentRequest/PendingPaymentRequestSales';
// import RejectedPaymentRequest from '../components/AdminPanel/Sales/PaymentRequest/RejectedPaymentRequest';
// import RecordServices from '../components/AdminPanel/Sales/Account/CreateRecordServices';
// import CreditApproval from '../components/Finance/CreditApproval/CreditApproval';
import CreateSalesAccount from '../components/AdminPanel/Sales/Account/CreateSalesAccount';
import SalesAccountOverview from '../components/AdminPanel/Sales/Account/SalesAccountOverview';
import CreateDocumentType from '../components/AdminPanel/Sales/Account/CreateDocumentType';
import DocumentTypeOverview from '../components/AdminPanel/Sales/Account/DocumentTypeOverview';
import ViewTargetCompetition from '../components/AdminPanel/Sales/TargetCompetition/ViewTargetCompetition';
import SalesProductOverview from '../components/AdminPanel/Sales/Product/SalesProductOverview';
import SalesProductCU from '../components/AdminPanel/Sales/Product/SalesProductCU';
import IncentiveStatements from '../components/AdminPanel/Sales/Incenti Dashboard/IncentiveStatements';
import RecordServiceDistribution from '../components/AdminPanel/Sales/SaleBooking/RecordServiceDistribution';
import IncentiveCreate from '../components/AdminPanel/Sales/IncentivePlan/IncentiveCreate';
import IncentiveOverview from '../components/AdminPanel/Sales/IncentivePlan/IncentiveOverview';
import IncentiveUpdate from '../components/AdminPanel/Sales/IncentivePlan/IncentiveUpdate';
import LoaderTwo from "../utils/LoaderTwo";
// import SalesDashboard from "../components/Finance/Dashboard/SalesDashboard";
const CreateTargetCompetition = lazy(() =>
  import(
    "./../components/AdminPanel/Sales/TargetCompetition/CreateTargetCompetition"
  )
);

const SalesRoutes = ({ contextData }) => {
  return (
    <Suspense fallback={<LoaderTwo/>}>
    <Routes>
      <Route path="/sales-dashboard" element={<SalesDashboard />} />
      <Route
        path="/create-sales-services/:id/:method"
        element={<SalesServicesCreate />}
      />
      <Route path="/create-sales-services" element={<SalesServicesCreate />} />
      {/* <Route
                path="/update-sales-services/:id/:post"
                element={<SalesServicesUpdate />}
            /> */}{" "}
      {/* Route not in use*/}
      <Route
        path="/sales-services-overview"
        element={<SalesServicesOverview />}
      />
      <Route
        path="/create-credit-reason-approval"
        element={<CreditApprovalReasonCreate />}
      />
      <Route
        path="/view-credit-reason-approval"
        element={<CreditApprovalReasonView />}
      />
      <Route path="/user-incenitve" element={<IncentiveRequest />} />
      <Route
        path="/sales-incentive-settlement-overview"
        element={<IncentiveSettlement />}
      />
      <Route
        path="/update-credit-reason-approval/:id"
        element={<CreditApprovalReasonUpdate />}
      />
      <Route
        path="/create-sales-booking/:editId/:un_id"
        element={<CreateSaleBooking />}
      />
      <Route path="/create-sales-booking" element={<CreateSaleBooking />} />
      <Route path="/view-sales-booking" element={<ViewSaleBooking />} />
      <Route path="/sales-user-incentive" element={<UserIncentive />} />
      <Route path="/sales-plan-request" element={<PlanRequest />} />
      <Route path="/sales-bonus-slab/:id" element={<SalesBonusSlab />} />
      <Route
        path="/sales-bonus-master-add-edit/:id"
        element={<BonusMastAddEdit />}
      />
      <Route
        path="/sales-bonus-slab-master-add-edit/:id"
        element={<BonusSlabMastAddEdit />}
      />
      {/* <Route
                path="/sales-bonus-salb-overview"
                element={<BonusSlabOverview />}
            /> */}{" "}
      {/* Route is not in use */}
      <Route path="/sales-bonus-list" element={<BonusMastOverview />} />
      <Route path="/sales-bonus-overview" element={<SalesBonusOverview />} />
      <Route path="/sales-bonus-summary/:id" element={<SalesBonusSummary />} />
      <Route path="/sales-user-report" element={<SalesReport />} />
      <Route path="/Sales-Point-Of-Contact" element={<ViewSalesPoc />} />
      <Route path="/create-payment-mode" element={<CreatePaymentMode />} />
      <Route path="/incentive-status/:id" element={<EarnedAndUnearned />} />
      <Route path="/view-payment-mode" element={<ViewPaymentMode />} />
      <Route path="/edit-payment-mode/:id" element={<EditPaymentMode />} />
      <Route
        path="/create-payment-details"
        element={<CreatePaymentDetails />}
      />
      <Route path="/view-payment-details" element={<ViewPaymentDetails />} />
      <Route path="/view-Outstanding-details" element={<ViewOutstanding />} />
      <Route
        path="/edit-payment-details/:id"
        element={<EditPaymentDetails />}
      />
      <Route
        path="/create-payment-update/:id"
        element={<CreatePaymentUpdate />}
      />
      <Route path="/view-payment-update" element={<ViewPaymentUpdate />} />
      <Route
        path="/payment-update-bank-wise/:id"
        element={<PaymentUpdateBankWise />}
      />
      <Route path="/view-invoice-request" element={<ViewInvoiceRequest />} />
      <Route path="/deleted-sales-booking" element={<DeletedSaleBooking />} />
      {/* <Route
                path="/pending-payment-request-sales"
                element={<PendingPaymentRequestSales />}
            /> */}{" "}
      {}
      {/* <Route
                path="/rejected-payment-request-sales"
                element={<RejectedPaymentRequest />}
            /> */}{" "}
      {/* Route is not in use */}
      {/* <Route
                path="/record-servcies"
                element={<RecordServices />}
            /> */}{" "}
      {/* Route is not in use */}
      {/* <Route
                path="/credit-approval"
                element={<CreditApproval />}
            /> */}{" "}
      {/* Route is not in use */}
      <Route
        path="/create-sales-account/:id"
        element={<CreateSalesAccount />}
      />
      <Route
        path="/sales-account-overview"
        element={<SalesAccountOverview />}
      />
      <Route
        path="/sales-document-type-master"
        element={<CreateDocumentType />}
      />
      <Route
        path="/sales-document-type-overview"
        element={<DocumentTypeOverview />}
      />
      <Route
        path="/sales-incentive-dashboard"
        element={<IncentiveDashboard />}
      />
      <Route
        path="/create-target-competition"
        element={<CreateTargetCompetition />}
      />
      <Route
        path="/create-target-competition/:id"
        element={<CreateTargetCompetition />}
      />
      <Route
        path="/view-target-competition"
        element={<ViewTargetCompetition />}
      />
      <Route path="/monthwise-sales-booking" element={<MonthWiseSalesView />} />
      <Route path="/product" element={<SalesProductOverview />} />
      <Route path="/product/:task" element={<SalesProductCU />} />
      <Route path="/incentive-statement" element={<IncentiveStatements />} />
      <Route
        path="/sales-service-distribution"
        element={<RecordServiceDistribution />}
      />
      <Route path="/sales-incentive-create" element={<IncentiveCreate />} />
      <Route path="/sales-incentive-overview" element={<IncentiveOverview />} />
      <Route path="/sales-incentive-update/:id" element={<IncentiveUpdate />} />
      {/* </Suspense> */}
    </Routes>
    </Suspense>
  );
};

export default SalesRoutes;
