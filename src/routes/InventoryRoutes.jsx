import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
// import React from 'react'
import InventoryDashboard from "../components/AdminPanel/PageMS/InventoryDashboard/InventoryDashboard";
import CategoryOverview from "../components/AdminPanel/PageMS/Category/CategoryOverview";
import SubCategoryOverview from "../components/AdminPanel/PageMS/SubCategory/SubCategoryOverview";
import TagCategory from "../components/AdminPanel/PageMS/InventoryDashboard/TagCategory";
import GroupLinkType from "../components/AdminPanel/PageMS/GroupLinkType";
import VendorMaster from "../components/AdminPanel/PageMS/VendorMaster";
// import PlanMaking from '../components/inventory/plan-making/PlanMaking'
// import PlanMakingBeta from '../components/inventory/plan-making-beta/PlanMakingBeta'
import PlanUpload from "../components/AdminPanel/Inventory/Plan-upload/PlanUpload";
import VendorOverview from "../components/AdminPanel/PageMS/VendorOverview";
import PageMaster from "../components/AdminPanel/PageMS/PageMaster";
import PageAssignmentUser from "../components/AdminPanel/PageMS/PageAssignmentUser";
import PageAssignmentUserAdd from "../components/AdminPanel/PageMS/PageAssignmentUserAdd";
import PageOverviewNew from "../components/AdminPanel/PageMS/PageOverviewNew";
import PageLogs from "../components/AdminPanel/PageMS/PageOverview/PageLogs";
import PurchasePrice from "../components/AdminPanel/PageMS/PurchasePrice";
import UnfetchedPages from "../components/AdminPanel/PageMS/InventoryDashboard/UnfetchedPages.jsx";
// import PlanHomeBeta from '../components/inventory/plan-making-beta/PlanHomeBeta.jsx'
import BulkVendor from "../components/AdminPanel/PageMS/Vendor/BulkVendor/BulkVendor.jsx";
import PageEdit from "../components/AdminPanel/PageMS/PageEdit.jsx";
// import UnfetchedPages from "./../components/AdminPanel/PageMS/UnfetchedPages.jsx";
const PlanPricing = lazy(() =>
  import("../components/inventory/plan-making/PlanPricing.jsx")
);
// import PlanPricingHome from "../inventory/plan-pricing/PlanPricingHome.jsx";
import PlanHomeBeta from '../components/inventory/plan-making-beta/PlanHomeBeta.jsx'
import PlanMaking from '../components/inventory/plan-making/PlanMaking.jsx'
const PlanMakingTableBeta = lazy(() =>
  import("../components/inventory/plan-making-beta/PlanMakingBeta.jsx")
);
const PlanMakingPricing = lazy(() =>
  import("../components/inventory/plan-making/PlanPricing.jsx")
);
const PlanMakingTable = lazy(() =>
  import("../components/inventory/plan-making/PlanMaking.jsx")
);

function InventoryRoutes() {
  return (
    <Routes>
      <Route path="/pms-inventory-dashboard" element={<InventoryDashboard />} />
      <Route
        path="/pms-inventory-category-overview"
        element={<CategoryOverview />}
      />
      <Route path="/pms-page-sub-category" element={<SubCategoryOverview />} />
      <Route path="/pms-unfetch-pages" element={<UnfetchedPages />} />
      <Route path="/pms-tag-Category" element={<TagCategory />} />
      <Route path="/pms-group-link-type" element={<GroupLinkType />} />
      <Route path="/pms-vendor-master" element={<VendorMaster />} />
      <Route path="/pms-plan-making" element={<PlanMaking />} />
      <Route path="/pms-plan-making-beta" element={<PlanHomeBeta />} />
      {/* <Route
                path="/pms-plan-making-beta"
                element={<PlanMakingBeta />}
            /> */}
      <Route
        path="/pms-plan-making-beta/:id"
        element={<PlanMakingTableBeta />}
      />
      <Route path="/pms-plan-pricing" element={<PlanPricing />} />
      <Route path="/pms-plan-pricing/:id" element={<PlanMakingPricing />} />
      <Route path="/pms-plan-making/:id" element={<PlanMakingTable />} />
      <Route path="/pms-plan-upload" element={<PlanUpload />} />
      <Route path="/pms-vendor-master/:_id" element={<VendorMaster />} />
      <Route path="/pms-vendor-overview" element={<VendorOverview />} />
      {/* /> */}
      <Route path="/pms-page-master" element={<PageMaster />} /> // Page Master
      on jarvis
      <Route
        path="/pms-page-cat-assignment-overview"
        element={<PageAssignmentUser />}
      />
      <Route
        path="/pms-page-cat-assignment-add"
        element={<PageAssignmentUserAdd />}
      />
      <Route path="/pms-page-overview" element={<PageOverviewNew />} />
      <Route path="/pms-page-logs" element={<PageLogs />} />
      <Route path="/pms-purchase-price/:id" element={<PurchasePrice />} />
      <Route path="/pms-page-edit/:pageMast_id" element={<PageEdit />} />
      <Route path="/pms-bulk-vendor-overview" element={<BulkVendor />} />
    </Routes>
  );
}

export default InventoryRoutes;
