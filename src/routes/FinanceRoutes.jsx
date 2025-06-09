import React from 'react'
import AllTransactions from '../components/Finance/Sales Management/SalesDashboardAllTransactions/AllTransactions'
import ApprovalInvoice from '../components/Finance/ApprovalInvoice'
import BalancePaymentList from '../components/Finance/Sales Management/Outstanding/BalancePaymentList'
import VendorStatement from '../components/Finance/Sales Management/Outstanding/VendorStatement'
import VendorStatementView from '../components/Finance/Sales Management/Outstanding/VendorStatementView'
import BalanceTransactionList from '../components/Finance/Sales Management/Outstanding/BalanceTransactionList'
import IncentivePayment from '../components/Finance/Sales Management/Incentive/IncentiveComponents/IncentivePayment'
import OutstandingPaymentReceiveReport from '../components/Finance/Sales Management/PaymentReleaseReport/OutstandingPaymentReceiveReport'
import PaymentMode from '../components/Finance/Sales Management/PaymentModeFolder/PaymentMode'
import TDSdeduct from '../components/Finance/Purchase Management/TDSDeducted/TDSdeduct'
import GSThold from '../components/Finance/Purchase Management/GSTHold/GSThold'
import PendingApprovalRefund from '../components/Finance/PendingApprovalRefund'
import RefundPayment from '../components/Finance/RefundPayment'
import PendingInvoice from '../components/Finance/Sales Management/Invoice/PendingInvoice/PendingInvoice'
import Invoice from '../components/Finance/Sales Management/Invoice/Invoice'
import PendingInvoiceCustomerDeatils from '../components/Finance/Sales Management/Invoice/PendingInvoice/PendingInvoiceCustomerDeatils'
import InvoiceCreated from '../components/Finance/Sales Management/Invoice/InvoiceCreated/InvoiceCreated'
import PendingPaymentsList from '../components/Finance/PendingPaymentsList'
import RefundRequests from '../components/Finance/RefundRequests'
import SaleBooking from '../components/Finance/Sales Management/SaleBooking/SaleBooking'
import PendingPaymentRequest from '../components/Finance/Purchase Management/PendingPaymentRequest/PendingPaymentRequest'
import Overview from '../components/Finance/Purchase Management/PendingPaymentRequest/Components/Overview'
import PaymentModeMast from '../components/Finance/Sales Management/PaymentModeFolder/PaymentModeMast'
import PaymentModeTransactionList from '../components/Finance/Sales Management/PaymentModeFolder/PaymentModeTransactionList'
import PaymentDone from '../components/Finance/Purchase Management/PaymentDone/PaymentDone'
import PaymentDoneTransactionList from '../components/Finance/Purchase Management/PaymentDone/Components/PaymentDoneTransactionList'
import PurchaseTransactions from '../components/Purchase/PurchaseTransactions'
import PendingAuditOutstandingTotal from '../components/Purchase/PurchaseVendor/PendingAuditOutstandingTotal'
import VendorInventory from '../components/AdminPanel/VendorSales/VendorInventory'
import VendorInventoryDetails from '../components/AdminPanel/VendorSales/VendorInventoryDetails'
import AddVendorPage from '../components/AdminPanel/VendorSales/AddVendorPage'
import FinanceDashboard from '../components/Finance/Dashboard/FinanceDashboard'
import SalesExecutiveIncentiveRequestReleaseList from '../components/Finance/SalesExecutiveIncentiveRequestReleaseList'
import ReleasedAmountIncentive from '../components/Finance/ReleasedAmountIncentive'
import PaymentModePaymentDetails from '../components/Finance/Sales Management/PaymentModeFolder/PaymentModePaymentDetails'
import PurchaseManagementAllTransaction from '../components/Finance/Purchase Management/PurchaseManagementAllTransactionDashboard/PurchaseManagementAllTransaction'
import Discard from '../components/Finance/Purchase Management/Discard/Discard'
import { Route } from 'react-router-dom'
import { lazy } from 'react'
import GstNongstIncentiveReport from '../components/Finance/Sales Management/Incentive/IncentiveComponents/GstNongstIncentiveReport.jsx'
import IncentiveParent from '../components/Finance/Sales Management/Incentive/IncentiveParent.jsx'
import PaymentSummary from '../components/Finance/PaymentSummary.jsx'
const PendingApprovalsUpdate = lazy(() =>
    import(
        "../components/Finance/Sales Management/PaymentRequestUpdate/PendingApprovalsUpdate.jsx"
    )
);
// Finance/Sales Management/PaymentRequestUpdate/PendingApprovalsUpdate.jsx

function FinanceRoutes() {
    return (
        <>

            <Route
                path="/finance-alltransactions"
                element={<AllTransactions />}
            />
            <Route
                path="/finance-approveinvoice"
                element={<ApprovalInvoice />}
            />
            <Route
                path="/finance-balancepayment"
                element={<BalancePaymentList />}
            />

            <Route
                path="/vendor-statement"
                element={<VendorStatement />}
            />
            <Route
                path="/vendor-statement-view/:id"
                element={<VendorStatementView />}
            />
            <Route
                path="/finance-transaction-list/:invoice_req_id"
                element={<BalanceTransactionList />}
            />

            <Route
                path="/finance-incentivepayment"
                element={<IncentivePayment />}
            />
            <Route
                path="/finance-payment-release-report"
                element={<OutstandingPaymentReceiveReport />}
            />
            <Route
                path="/finance-paymentmode"
                element={<PaymentMode />}
            />
            <Route path="/payment-TDS_deduct" element={<TDSdeduct />} />
            <Route path="/payment-GST_hold" element={<GSThold />} />
            <Route
                path="/finance-pendingapproverefund"
                element={<PendingApprovalRefund />}
            />
            <Route
                path="/finance-refundpayment"
                element={<RefundPayment />}
            />
            <Route
                path="/finance-pendingapproveupdate"
                element={<PendingApprovalsUpdate />} // pending
            />
            <Route
                path="/finance-pendinginvoice"
                element={<PendingInvoice />}
            />
            <Route path="/finance-invoice" element={<Invoice />} />
            <Route
                path="/finance-pending-invoice/customer-details/:id"
                element={<PendingInvoiceCustomerDeatils />}
            />
            <Route
                path="/finance-createdinvoice"
                element={<InvoiceCreated />}
            />
            <Route
                path="/finance-pendingpaymentslist"
                element={<PendingPaymentsList />}
            />
            <Route
                path="/finance-pendingrequests"
                element={<RefundRequests />}
            />
            <Route
                path="/finance-salebooking"
                element={<SaleBooking />}
            />
            <Route
                path="/finance-salebooking"
                element={<SaleBooking />}
            />
            {/* <Route
                    path="/finance-salebookingclose"
                    element={<SaleBookingClose />}
                  />
                  <Route
                    path="/finance-salebookingverify"
                    element={<SaleBookingVerify />}
                  /> */}
            <Route
                path="/finance-pruchasemanagement-pendingpaymentrequest"
                element={<PendingPaymentRequest />}
            />
            <Route path="/finance-overview" element={<Overview />} />
            <Route
                path="/payment-mode-master"
                element={<PaymentModeMast />}
            />
            <Route
                path="/finance-payment-mode-transactionlist/:id"
                element={<PaymentModeTransactionList />}
            />
            <Route
                path="/finance-pruchasemanagement-paymentdone"
                element={<PaymentDone />}
            />
            <Route
                path="/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
                element={<PaymentDoneTransactionList />}
            />
            <Route
                path="/purchase-transaction"
                element={<PurchaseTransactions />}
            />
            <Route
                path="/audited-outstanding-total"
                element={<PendingAuditOutstandingTotal />}
            />

            <Route
                path="/vendor-inventory"
                element={<VendorInventory />}
            />
            <Route
                path="/vendor-inventory/:id"
                element={<VendorInventoryDetails />}
            />
            <Route
                path="/vendor-pages/:id"
                element={<AddVendorPage />}
            />

            <Route
                path="/pending-outstanding-total"
                element={<PendingAuditOutstandingTotal />}
            />
            <Route
                path="/finance-dashboard"
                element={<FinanceDashboard />}
            />
            <Route
                path="/Incentive-Request-Released-List/:incentive_request_id"
                element={<SalesExecutiveIncentiveRequestReleaseList />}
            />
            <Route
                path="/Incentive-balance-Released/:incentive_request_id"
                element={<ReleasedAmountIncentive />}
            />
            <Route
                path="/Incentive-Payment-Mode-Payment-Details"
                element={<PaymentModePaymentDetails />}
            />
            <Route
                path="/finance-pruchasemanagement-alltransaction"
                element={<PurchaseManagementAllTransaction />}
            />
            <Route
                path="/finance-pruchasemanagement-discardpayment"
                element={<Discard />}
            />





            {/*  ==============*/}
            {/* GST Nongst Incentive Report */}
            <Route
                path="/finance-gst-nongst-incentive-report"
                element={<GstNongstIncentiveReport />}
            />
            <Route
                path="/finance-incentive-parent"
                element={<IncentiveParent />}
            />
            {/* ========================== */}
            <Route
                path="/payment-summary/:id"
                element={<PaymentSummary />}
            />
        </>
    )
}

export default FinanceRoutes