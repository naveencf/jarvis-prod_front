import "./App.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Protected from "./Login/Protected";
import Home from "./components/Home";
import Admin from "./components/AdminPanel/Admin";
import Profile from "./components/Pantry/UserPanel/Profile/Profile";
import User from "./components/Pantry/UserPanel/User";
import Delivery from "./components/Pantry/DeliveryPanel/Delivery";
import SimOverview from "./components/Sim/SimOverview";
import SimMaster from "./components/Sim/SimMaster";
import SimUpdate from "./components/Sim/SimUpdate";
import SimAllocationOverview from "./components/Sim/SimAllocationOverview";
import UpdateCaseStudy from "./components/AdminPanel/RegisterCampaign/CaseStudies/UpdateCaseStudy";

import SimSummary from "./components/Sim/SimSummary";
import IpMaster from "./components/IntellectualProperty/IpMaster";
import IpOverview from "./components/IntellectualProperty/IpOverview";
import IpUpdate from "./components/IntellectualProperty/IpUpdate";
import IpCountUpdate from "./components/IntellectualProperty/IpCountUpdate";
import BrandMaster from "./components/Brand/BrandMaster";
import BrandOverview from "./components/Brand/BrandOverview";
import BrandUpdate from "./components/Brand/BrandUpdate";
import IpHistory from "./components/IntellectualProperty/IpHistory";
import OrderHistory from "./components/Pantry/UserPanel/OrderHistory";
import BrandView from "./components/Brand/BrandView";
import SimDashboard from "./components/Sim/SimDashboard";
import PreOnboardingUserMaster from "./components/PreOnboarding/PreOnboardingUserMaster";
import IpGraph from "./components/IntellectualProperty/IpGraph";
// import Notification from "./Notification";
import PendingOrderSingleUser from "./components/Pantry/UserPanel/PendingOrderSingleUser";
import { APIContext } from "./components/AdminPanel/APIContext/APIContext";
import AssetCategoryMaster from "./components/Sim/AssetCategory/AssetCategoryMaster";
import AssetCategoryOverview from "./components/Sim/AssetCategory/AssetCategoryOverview";
import AssetCategoryUpdate from "./components/Sim/AssetCategory/AssetCategoryUpdate";
import BrandMast from "./components/Sim/Brand/BrandMast";
import ModalMast from "./components/Sim/ModalName/ModalMast";
import RepairReason from "./components/Sim/RepairReasonMast/RepairReason";
import RepairRequest from "./components/Sim/RepairRequest/RepairRequest";

import ForgetPassword from "./Login/Forget/ForgetPassword";
import AssetSubCategoryMaster from "./components/Sim/AssetCategory/AssetSubCategoryMaster";
import AssetSubCategoryOverview from "./components/Sim/AssetCategory/AssetSubCategoryOverview";
import AssetSubCategoryUpdate from "./components/Sim/AssetCategory/AssetSubCategoryUpdate";
import VenderOverView from "./components/Sim/Vender/VenderOverView";
import VenderMaster from "./components/Sim/Vender/VenderMaster";
import VendorUpdate from "./components/Sim/Vender/VendorUpdate";
import SingleAssetUserDetails from "./components/Sim/SingleAssetUserDetails";
import { useEffect, useState } from "react";

import DataBrandMaster from "./components/Datas/DataBrandMaster";
import DataBrandOverview from "./components/Datas/DataBrandOverview";
import DataBrandUpdate from "./components/Datas/DataBrandUpdate";
import DataBrandView from "./components/Datas/DataBrandView";
import DataCategory from "./components/Datas/DataCategory/DataCategory";
import DataSubCategory from "./components/Datas/DataSubCategory/DataSubCategory";
import Platform from "./components/Datas/Platform/Platform";
import ContentType from "./components/Datas/ContentType/ContentType";
import DataBrand from "./components/Datas/DataBrand/DataBrand";
import Dashboard from "./components/Datas/Dashboard";
import BrandCaseStudy from "./components/AdminPanel/RegisterCampaign/CaseStudies/BrandCaseStudy";
import CaseStudyDashboard from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyDashboard";
import CaseStudyplateform from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyplateform";
import CaseStudyView from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyView";
import AccountInfo from "./components/AdminPanel/Sales/Account/AccountInfoComponent/AccountInfo";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      <div>{isOnline ? <h1></h1> : alert("No Internet Connection")}</div>

      {/* <Notification /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/" element={<Protected />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/pre-onboard-user-from"
              element={<PreOnboardingUserMaster />}
            />

            <Route path="/pantry-user" element={<User />} />
            <Route path="/pantry-delivery" element={<Delivery />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route
              path="/pending-order-single-user"
              element={<PendingOrderSingleUser />}
            />
          </Route>
          <Route
            path="/admin/*"
            element={
              <APIContext>
                <Admin />
              </APIContext>
            }
          />

          {/* sim */}
          <Route path="/sim-overview/:id" element={<SimOverview />} />
          <Route
            path="/singleAssetDetails/:id"
            element={<SingleAssetUserDetails />}
          />
          <Route path="/sim-master" element={<SimMaster />} />
          <Route path="/sim-update/:id" element={<SimUpdate />} />
          <Route path="/sim-dashboard" element={<SimDashboard />} />
          <Route
            path="/sim-allocation-overview"
            element={<SimAllocationOverview />}
          />
          <Route path="/sim-summary/:id" element={<SimSummary />} />

          <Route
            path="/asset-category-master"
            element={<AssetCategoryMaster />}
          />
          <Route
            path="/asset-category-overview"
            element={<AssetCategoryOverview />}
          />
          <Route
            path="/asset-category-update/:id"
            element={<AssetCategoryUpdate />}
          />
          {/* Asset sub cat */}
          <Route
            path="/asset/subCategory"
            element={<AssetSubCategoryMaster />}
          />
          <Route path="/brand-mast" element={<BrandMast />} />
          <Route path="/modal-mast" element={<ModalMast />} />
          <Route path="/repair-reason" element={<RepairReason />} />
          <Route path="/repair-request" element={<RepairRequest />} />

          <Route
            path="/asset/subCategory/overview"
            element={<AssetSubCategoryOverview />}
          />
          <Route
            path="/asset/subcategory-update/:id"
            element={<AssetSubCategoryUpdate />}
          />
          {/* vender pages */}

          <Route path="/venderOverView" element={<VenderOverView />} />
          <Route path="/vendorMaster" element={<VenderMaster />} />
          <Route path="/vendorUpdate/:id" element={<VendorUpdate />} />

          <Route path="/ip-overview" element={<IpOverview />} />
          <Route path="/ip-master" element={<IpMaster />} />
          <Route path="/ip-update/:id" element={<IpUpdate />} />

          <Route path="/ip-history/:id" element={<IpHistory />} />
          <Route path="/ip-countupdate/:id" element={<IpCountUpdate />} />
          <Route path="/ip-graph/:id" element={<IpGraph />} />

          <Route path="/brand-master" element={<BrandMaster />} />
          <Route path="/brand-overview" element={<BrandOverview />} />
          <Route path="/brand-update/:id" element={<BrandUpdate />} />
          <Route path="/brand-view/:id" element={<BrandView />} />

          {/* ------------------------------ case Study start----------------------------------------- */}
          <Route path="/case-study/brand" element={<BrandCaseStudy />} />
          <Route path="/casestudy-dashboard" element={<CaseStudyDashboard />} />
          <Route path="/case-platform" element={<CaseStudyplateform />} />
          <Route path="/casestudy-update/:id" element={<UpdateCaseStudy />} />
          <Route path="/caseStudy-view/:id" element={<CaseStudyView />} />

          {/* ------------------------------ case Study end----------------------------------------- */}

          <Route path="/data-brand-dashboard" element={<Dashboard />} />
          <Route path="/data-brand-master" element={<DataBrandMaster />} />
          <Route path="/data-brand-overview" element={<DataBrandOverview />} />
          <Route path="/data-brand-update/:id" element={<DataBrandUpdate />} />
          <Route path="/data-brand-view/:id" element={<DataBrandView />} />
          <Route path="/data-brand-category" element={<DataCategory />} />
          <Route
            path="/data-brand-sub-category"
            element={<DataSubCategory />}
          />
          <Route path="/data-platform" element={<Platform />} />
          <Route path="/data-content-type" element={<ContentType />} />
          <Route path="/data-brand" element={<DataBrand />} />

          {/* Execution history */}
          {/* sales Account Info Page route */}
          <Route path="/sales-account-info/:id" element={<AccountInfo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
