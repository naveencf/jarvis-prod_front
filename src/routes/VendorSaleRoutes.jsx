import React from 'react'
import { Route, Routes } from 'react-router-dom'
import VendorSalesOverview from '../components/AdminPanel/VendorSales/VendorSalesOverview'
import VendorInventory from '../components/AdminPanel/VendorSales/VendorInventory'
import AddVendorPage from '../components/AdminPanel/VendorSales/AddVendorPage'

function VendorSaleRoutes() {
    return (
        <Routes>
            <Route
                path="vendor-sale-overview"
                element={<VendorSalesOverview />}
            />
            <Route
                path="vendor-inventory"
                element={<VendorInventory />}
            />
            <Route
                path="vendor-inventory/:id"
                element={<AddVendorPage/>}
            />
        </Routes>
    )
}

export default VendorSaleRoutes