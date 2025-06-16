import React from 'react'
import { Route, Routes } from 'react-router-dom'
import VendorSalesOverview from '../components/AdminPanel/VendorSales/VendorSalesOverview'
import VendorInventory from '../components/AdminPanel/VendorSales/VendorInventory'
import AddVendorPage from '../components/AdminPanel/VendorSales/AddVendorPage'
import VendorInventoryDetails from '../components/AdminPanel/VendorSales/VendorInventoryDetails'

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
                path="vendor-add-pages/:id"
                element={<AddVendorPage />}
            />
            <Route
                path="vendor-pages/:id"
                element={<VendorInventoryDetails />}
            />
            <Route
                path="vendor-inventory/:id"
                element={<VendorInventoryDetails/>}
            />
        </Routes>
    )
}

export default VendorSaleRoutes