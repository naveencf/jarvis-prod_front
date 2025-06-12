import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ExecutionPending from '../components/Execution/ExecutionPending'
import ExecutionDone from '../components/Execution/Done/ExecutionDone'
import ExecutionAccepted from '../components/Execution/Accepted/ExecutionAccepted'
import ExecutionRejected from '../components/Execution/Rejected/ExecutionRejected'

function ExecutionRoutes() {
    return (
        <Routes>
            <Route
                path="/pending"
                element={
                    <ExecutionPending />
                }
            />
            <Route
                path="/done"
                element={<ExecutionDone />}
            />
            <Route
                path="/accepted"
                element={<ExecutionAccepted />}
            />
            <Route
                path="/rejected"
                element={<ExecutionRejected />}
            />
        </Routes>
    )
}

export default ExecutionRoutes