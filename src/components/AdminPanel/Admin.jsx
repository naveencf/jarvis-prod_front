import jwtDecode from "jwt-decode";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoaderTwo from "../../utils/LoaderTwo.jsx";
import { useAPIGlobalContext } from "./APIContext/APIContext.jsx";
import ErrorPage from "../../ErrorPage.jsx";
const NavSideBar = lazy(() => import("./Navbar-Sidebar/NavSideBar.jsx"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard.jsx"));
const InventoryRoutes = lazy(() => import("../../routes/InventoryRoutes"));
const PurchaseRoutes = lazy(() => import("../../routes/PurchaseRoutes"));
const SarcasmRoutes = lazy(() => import("../../routes/SarcasmRoutes"));
const SalesRoutes = lazy(() => import("../../routes/SalesRoutes"));
const PreOnboardRoutes = lazy(() => import("../../routes/PreOnboardRoutes"));
const UserRoutes = lazy(() => import("../../routes/UserRoutes"));
const UserWFHDRoutes = lazy(() => import("../../routes/UserWFHDRoutes"));
// const MiscellaneousRoutes = lazy(() => import("../../routes/MiscellaneousRoutes"));
const VendorSaleRoutes = lazy(() => import("../../routes/VendorSaleRoutes"));
const FinanceRoutes = lazy(() => import("../../routes/FinanceRoutes"));
const OperationRoutes = lazy(() => import("../../routes/OperationRoutes"));
const ExecutionRoutes = lazy(() => import("../../routes/ExecutionRoutes"));
const BoostingRoutes = lazy(() => import("../../routes/BoostingRoutes"));
const PantryRoutes = lazy(() => import("../../routes/PantryRoutes"));
const CommunityRoutes = lazy(() => import("../../routes/CommunityRoutes"));

const Admin = () => {
    // const [contextData, setData] = useState([]);
    const { contextData } = useAPIGlobalContext();
    const location = useLocation();
    const storedToken = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);
    const userID = decodedToken.id;
    const isPantryRoute = location.pathname.includes("pantry");
    const isUserManagementVisible = [0, 1, 2, 6, 16, 21, 23].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isSalesVisible = [52, 63].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isInventoryVisible = [51].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isPurchaseVisible = [64].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isSarcasmVisible = [29].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isOperationVisible = [42].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isCommunityVisible = [25].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isFinanceVisible = [44].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isVendorSaleVisible = [70].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isBoostingVisible = [69].some(
        (index) => contextData[index]?.view_value === 1
    );
    const isPantryVisible = [15, 71].some(
        (index) => contextData[index]?.view_value === 1
    );
    return (
        <>
            <Suspense
                fallback={
                    <div>
                        <LoaderTwo />
                    </div>
                }
            >
                <div id="wrapper" className={isPantryRoute ? "hkDashboard" : ""}>
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <div className="page_content">
                                <Routes>
                                    <Route path="/" element={<NavSideBar />}>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="preonboard/*" element={isUserManagementVisible && <Suspense fallback={<LoaderTwo />}><PreOnboardRoutes /></Suspense>} />  // Sales Routes shifting pending
                                        <Route path="user/*" element={isUserManagementVisible && <Suspense fallback={<LoaderTwo />}><UserRoutes /></Suspense>} />  // Sales Routes shifting pending
                                        <Route path="wfhd/*" element={isUserManagementVisible && <Suspense fallback={<LoaderTwo />}><UserWFHDRoutes /></Suspense>} />  // Sales Routes shifting pending
                                        <Route path="operation/*" element={isOperationVisible && <Suspense fallback={<LoaderTwo />}><OperationRoutes /></Suspense>} />  
                                        <Route path="execution/*" element={isOperationVisible && <Suspense fallback={<LoaderTwo />}><ExecutionRoutes /></Suspense>} />  
                                        <Route path="sales/*" element={isSalesVisible && <Suspense fallback={<LoaderTwo />}><SalesRoutes /></Suspense>} />   
                                        <Route path="community/*" element={isCommunityVisible && <Suspense fallback={<LoaderTwo />}><CommunityRoutes /></Suspense>} />  
                                        <Route path="inventory/*" element={isInventoryVisible && <Suspense fallback={<LoaderTwo />}><InventoryRoutes /></Suspense>} />
                                        {/* <Route path="miscellaneous/*" element={<Suspense fallback={<LoaderTwo />}><MiscellaneousRoutes /></Suspense>} />// Sales Routes shifting pending */}
                                        <Route path="finance/*" element={isFinanceVisible && <Suspense fallback={<LoaderTwo />}><FinanceRoutes /></Suspense>} />// Testing pending
                                        <Route path="purchase/*" element={isPurchaseVisible && <Suspense fallback={<LoaderTwo />}><PurchaseRoutes /></Suspense>} />
                                        <Route path="sarcasm/*" element={isSarcasmVisible && <Suspense fallback={<LoaderTwo />}><SarcasmRoutes /></Suspense>} />
                                        <Route path="vendor-sale/*" element={isVendorSaleVisible && <Suspense fallback={<LoaderTwo />}><VendorSaleRoutes /></Suspense>} />
                                        <Route path="boosting/*" element={isBoostingVisible && <Suspense fallback={<LoaderTwo />}><BoostingRoutes /></Suspense>} />// Sales Routes shifting pending



                                    </Route>
                                    <Route path="pantry/*" element={isPantryVisible && <Suspense fallback={<LoaderTwo />}><PantryRoutes /></Suspense>} /> 
                                    {/* {PantryRoutes()} */}
                                    <Route path="**" element={<ErrorPage />} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};
export default Admin;









