import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Ledger from '../components/Purchase/PurchaseVendor/Ledger'
import VendorOutstandingOverview from '../components/Purchase/PurchaseVendor/VendorOutstandingOverview'
import CampaignExecution from '../components/Operation/Execution/CampaignExecution'
import AuditPurchase from '../components/Purchase/AuditPurchase'
import AdvancePurchaseOverview from '../components/Purchase/AdvancePurchaseOverview'
import PurchaseReport from '../components/Purchase/purchase-report/PurchaseReport'
// import PurchaseDashboard from '../components/Finance/Dashboard/PurchaseDashboard'
import Dashboard from '../components/Purchase/Dashboard'
import PendingPaymentRequest from '../components/Finance/Purchase Management/PendingPaymentRequest/PendingPaymentRequest'
import PurchaseTransactions from '../components/Purchase/PurchaseTransactions'
function PurchaseRoutes() {
    // useEffect(() => {
    //     const loadAndInject = async () => {
    //         const { default: DirectPurchaseApi } = await import("../components/Store/API/Purchase/DirectPurchaseApi");
    //         injectReducer(DirectPurchaseApi.reducerPath, DirectPurchaseApi.reducer);
    //         store.dispatch(
    //             DirectPurchaseApi.util.prefetch("getPurchaseList", undefined, { force: false })
    //         );
    //     };
    //     loadAndInject();
    // }, []);
    return (
        <Routes>
            <Route path="/ledger/:id" element={<Ledger />} />
            <Route
                path="/vendor_outstanding"
                element={<VendorOutstandingOverview />}
            />
            <Route
                path="/record-purchase"
                element={<CampaignExecution />}
            />
            <Route
                path="/purchased-record"
                element={<AuditPurchase />}
            />
            <Route
                path="/advanced-purchase-overview"
                element={<AdvancePurchaseOverview />}
            />
            <Route
                path="/vendor-advanced-purchase-overview"
                element={<AdvancePurchaseOverview />}
            />
            <Route
                path="/purchase-report"
                element={<PurchaseReport />}
            />
            <Route
                path="/purchase-dashboard"
                element={<Dashboard />}
            />
            <Route
                path="/vendor-advance-outstanding"
                element={<VendorOutstandingOverview />}
            />
            <Route
                path="/pending-payment-request"
                element={<PendingPaymentRequest />}
            />
            <Route
                path="/purchase-transaction"
                element={<PurchaseTransactions />}
            />
        </Routes>
    );
}
export default PurchaseRoutes;
// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Ledger from '../components/Purchase/PurchaseVendor/Ledger'
// import VendorOutstandingOverview from '../components/Purchase/PurchaseVendor/VendorOutstandingOverview'
// import CampaignExecution from '../components/Operation/Execution/CampaignExecution'
// import AuditPurchase from '../components/Purchase/AuditPurchase'
// import AdvancePurchaseOverview from '../components/Purchase/AdvancePurchaseOverview'
// import PurchaseReport from '../components/Purchase/purchase-report/PurchaseReport'
// import PurchaseDashboard from '../components/Finance/Dashboard/PurchaseDashboard'
// function PurchaseRoutes() {
//     return (
//         <Routes>
//             {/* Purchase Transaction */}
//             <Route path="/ledger/:id" element={<Ledger />} />
//             <Route
//                 path="/vendor_outstanding"
//                 element={<VendorOutstandingOverview />}
//             />
//             <Route
//                 path="/record-purchase"
//                 element={<CampaignExecution />}
//             />
//             <Route
//                 path="/purchased-record"
//                 element={<AuditPurchase />}
//             />
//             <Route
//                 path="/advanced-purchase-overview"
//                 element={<AdvancePurchaseOverview />}
//             />
//             <Route
//                 path="/purchase-report"
//                 element={<PurchaseReport />}
//             />
//             <Route
//                 path="/purchase-dashboard"
//                 element={<PurchaseDashboard />}
//             />
//         </Routes>
//     )
// }
// export default PurchaseRoutes










