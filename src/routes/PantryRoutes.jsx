import React from 'react'
import { Route } from 'react-router-dom'
import PantryUserDashboard from '../components/Pantry/PantryUserDashboard'
import PantryAdminDashboard from '../components/Pantry/PantryAdminDashboard'

function PantryRoutes() {
    return (
        <>
            <Route path="/pantry" element={<PantryUserDashboard />} />
            <Route
                path="/pantry-admin"
                element={<PantryAdminDashboard />}
            />
        </>
    )
}

export default PantryRoutes