import React, { lazy } from 'react'
import ExpenseOverview from '../components/AdminPanel/ExpenseManagement/ExpenseOverview'
import ExpenseManagementUpdate from '../components/AdminPanel/ExpenseManagement/ExpenseManagementUpdate'
import { Route } from 'react-router-dom';
const ExpenseMangementMaster = lazy(() =>
    import("../components/AdminPanel/ExpenseManagement/ExpenseMangementMaster.jsx")
);

function Miscellaneous() {
    return (
        <>
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

        </>
    )
}

export default Miscellaneous