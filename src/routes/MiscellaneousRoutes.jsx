import React, { lazy } from 'react'
import ExpenseOverview from '../components/AdminPanel/ExpenseManagement/ExpenseOverview.jsx'
import ExpenseManagementUpdate from '../components/AdminPanel/ExpenseManagement/ExpenseManagementUpdate.jsx'
import { Route, Routes } from 'react-router-dom';
import OperationShortcodeUpdater from '../components/AbOpreation/OperationShortcodeUpdater.jsx';
import PendingOrder from '../components/AdminPanel/HRMS/Pantry/PendingOrder/PendingOrder.jsx';
import TransferReq from '../components/AdminPanel/HRMS/Pantry/TransferReq/TransferReq.jsx';
import AllOrder from '../components/AdminPanel/HRMS/Pantry/AllOrders/AllOrders.jsx';
import DeclinedOrder from '../components/AdminPanel/HRMS/Pantry/DeclinedOrder/DeclinedOrder.jsx';
import DeliverdOrder from '../components/AdminPanel/HRMS/Pantry/DeliverdOrder/DeliverdOrder.jsx';
const ExpenseMangementMaster = lazy(() =>
    import("../components/AdminPanel/ExpenseManagement/ExpenseMangementMaster.jsx")
);

function MiscellaneousRoutes() {
    return (
        <Routes>
            <Route
                path="/expense-Overview"
                element={<ExpenseOverview />}
            />
            <Route
                path="/create-expenseMangementMaster"
                element={<ExpenseMangementMaster />}
            />
            <Route
                path="/update-expense/:id"
                element={<ExpenseManagementUpdate />}
            />

            {/* <Route
                                  path="/operation-campaigns"
                                  element={<OperationCampaigns />}
                                /> */}
            {/* <Route
                                  path="/operation-dashboards"
                                  element={<OperationDashboards />}
                                /> */}
            {/* <Route
                                  path="/operation-contents"
                                  element={<OperationContents />}
                                /> */}

            {/* <Route
                path="/campaign_execution"
                element={<OperationShortcodeUpdater />}
            /> */}  {/* Route not in use*/}
            {/* pantry old */}
            <Route
                path="/all-pending-order"
                element={<PendingOrder />}
            />
            <Route path="/transfer-req" element={<TransferReq />} />
            <Route path="/all-order" element={<AllOrder />} />
            <Route
                path="/all-declined-order"
                element={<DeclinedOrder />}
            />
            <Route
                path="/all-deliverd-order"
                element={<DeliverdOrder />}
            />
            {/* <>
                                                    <Route
                                                        path="/product-master"
                                                        element={<ProductMaster />}
                                                    />
                                                    <Route
                                                        path="/product-overview"
                                                        element={<ProductOverview />}
                                                    />
                                                    <Route
                                                        path="/product-update"
                                                        element={<ProductUpdate />}
                                                    />
                                                    <Route
                                                        path="/new-pantry-user"
                                                        element={<HomePantry />}
                                                    />
                                                </> */}

            {/* {contextData &&
                contextData[1] &&
                contextData[1].view_value === 1 && (
                    <>
                        <Route
                            path="/responsibility-master"
                            element={<ResponsibilityMast />}
                        />
                        <Route
                            path="/responsibility-overview"
                            element={<ResponsiblityOverview />}
                        />
                        <Route
                            path="/responsibility-update/:id"
                            element={<ResponsibilityUpdate />}
                        />
                    </>
                )} */}
            {/* <Route path="/cityMsater" element={<CityMaster />} />  */}
        </Routes>
    )
}

export default MiscellaneousRoutes