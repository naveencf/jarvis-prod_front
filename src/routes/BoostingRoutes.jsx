import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PageAddition from '../components/Boosting/PageAddition'
import RecentlyBoosted from '../components/Boosting/RecentlyBoosted'
import DefaultService from '../components/Boosting/DefaultService'

function BoostingRoutes() {
    return (
        <Routes>
            <Route path="/page-addition" element={<PageAddition />} />
            <Route
                path="/recently-boosted"
                element={<RecentlyBoosted />}
            />
            <Route
                path="/default-service"
                element={<DefaultService />}
            />
        </Routes>
    )
}

export default BoostingRoutes