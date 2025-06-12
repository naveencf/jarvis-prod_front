import React from 'react'
import AssetDashboard from '../components/AdminPanel/HRMS/Sim/AssetDashboard'
import AssetSummary from '../components/AdminPanel/HRMS/Sim/AssetSummary'
import { SelfAudit } from '../components/AdminPanel/AssetNotifier/SelfAudit'
import AssetVisibleToHr from '../components/AdminPanel/HRMS/Sim/AssetVisibleToHr/AssetVisibleToHr'
import AssetVisibleToTagedPerosn from '../components/AdminPanel/HRMS/Sim/AssetVisibleToTagedPerson/AssetVisibleToTagedPerosn'
import AssetSingleUser from '../components/AdminPanel/HRMS/Sim/AssetSingeUser/AssetSingleUser'
import RepairRetrunSummary from '../components/AdminPanel/HRMS/Sim/RepairRetrunSummary'
import AssetRepairSummary from '../components/AdminPanel/HRMS/Sim/AssetRepairSummaryHR'
import VendorSummary from '../components/AdminPanel/HRMS/Sim/VendorSummary'
import { Routes } from 'react-router-dom'

function AssestsRoute() {
    return (
        <Routes>
            <Route
                path="/asset-dashboard"
                element={<AssetDashboard />}
            />
            <Route
                path="/asset_summary"
                element={<AssetSummary />}
            />

            <Route path="/self-audit" element={<SelfAudit />} />

            {/* Asset Section  */}
            <Route
                path="/asset-visible-to-hr"
                element={<AssetVisibleToHr />}
            />
            <Route
                path="/asset-visible-to-taged-person"
                element={<AssetVisibleToTagedPerosn />}
            />
            <Route
                path="/asset-manager"
                element={<AssetManager />} // pending
            />
            <Route
                path="/asset-single-user"
                element={<AssetSingleUser />}
            />
            <Route
                path="/asset-repair-return-summary"
                element={<RepairRetrunSummary />}
            />
            <Route
                path="/asset-repair-summary"
                element={<AssetRepairSummary />}
            />
            <Route
                path="/asset-vendor-summary"
                element={<VendorSummary />}
            />
        </Routes>
    )
}

export default AssestsRoute