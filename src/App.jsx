import "./App.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "../src/components/PreOnboarding/onboardcss/onboard_style.css";
import "../src/components/PreOnboarding/onboardcss/onboard_responsive.css";
import "../src/components/PreOnboarding/onboardcss/onboard_animate.min.css";
import { Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
const Login = lazy(() => import("./Login/Login"));
// import SimUpdate from "./components/Sim/SimUpdate";
const SimUpdate = lazy(() => import("./components/Sim/SimUpdate"));
// import PreOnboardingUserMaster from "./components/PreOnboarding/PreOnboardingUserMaster";
const PreOnboardingUserMaster = lazy(() =>
  import("./components/PreOnboarding/PreOnboardingUserMaster")
);

import {
  APIContext,
  ApiContextData,
} from "./components/AdminPanel/APIContext/APIContext";
// import ForgetPassword from "./Login/Forget/ForgetPassword";
// import AccountInfo from "./components/AdminPanel/Sales/Account/AccountInfoComponent/AccountInfo";
// import Profile from "./components/Pantry/UserPanel/Profile/Profile";
// import User from "./components/Pantry/UserPanel/User";
// import Delivery from "./components/Pantry/DeliveryPanel/Delivery";
// import OrderHistory from "./components/Pantry/UserPanel/OrderHistory";
// import PendingOrderSingleUser from "./components/Pantry/UserPanel/PendingOrderSingleUser";
// import Loader from "./components/Finance/Loader/Loader";
// import Learning from "./components/SuperTracker/CommunityManagement/Learning/Learning";
// import ErrorPage from "./ErrorPage";
// import { AppProvider } from "./Context/Context";

// const SimUpdate = lazy(() => import("./components/Sim/SimUpdate"));
// const PreOnboardingUserMaster = lazy(() =>
//   import("./components/PreOnboarding/PreOnboardingUserMaster")
// );
// const APIContext = lazy(() =>
//   import("./components/AdminPanel/APIContext/APIContext")
// );
const ForgetPassword = lazy(() => import("./Login/Forget/ForgetPassword"));
const AccountInfo = lazy(() =>
  import(
    "./components/AdminPanel/Sales/Account/AccountInfoComponent/AccountInfo"
  )
);
const Profile = lazy(() =>
  import("./components/Pantry/UserPanel/Profile/Profile")
);
const User = lazy(() => import("./components/Pantry/UserPanel/User"));
const Delivery = lazy(() =>
  import("./components/Pantry/DeliveryPanel/Delivery")
);
const OrderHistory = lazy(() =>
  import("./components/Pantry/UserPanel/OrderHistory")
);
const PendingOrderSingleUser = lazy(() =>
  import("./components/Pantry/UserPanel/PendingOrderSingleUser")
);
const Loader = lazy(() => import("./components/Finance/Loader/Loader"));
const Learning = lazy(() =>
  import("./components/SuperTracker/CommunityManagement/Learning/Learning")
);
const ErrorPage = lazy(() => import("./ErrorPage"));
import { AppProvider } from "./Context/Context";

// import Protected from "./Login/Protected";
// import Admin from "./components/AdminPanel/Admin";
// import Home from "./components/Home";
// import SimOverview from "./components/Sim/SimOverview";
// import SimMaster from "./components/Sim/SimMaster";
// import SimAllocationOverview from "./components/Sim/SimAllocationOverview";
// import UpdateCaseStudy from "./components/AdminPanel/RegisterCampaign/CaseStudies/UpdateCaseStudy";

// import SimSummary from "./components/Sim/SimSummary";
// import IpMaster from "./components/IntellectualProperty/IpMaster";
// import IpOverview from "./components/IntellectualProperty/IpOverview";
// import IpUpdate from "./components/IntellectualProperty/IpUpdate";
// import IpCountUpdate from "./components/IntellectualProperty/IpCountUpdate";

// import BrandMaster from "./components/Brand/BrandMaster";
// import BrandOverview from "./components/Brand/BrandOverview";
// import BrandUpdate from "./components/Brand/BrandUpdate";
// import IpHistory from "./components/IntellectualProperty/IpHistory";
// import BrandView from "./components/Brand/BrandView";
// import SimDashboard from "./components/Sim/SimDashboard";
// import IpGraph from "./components/IntellectualProperty/IpGraph";

// import Notification from "./Notification";

// import AssetCategoryMaster from "./components/Sim/AssetCategory/AssetCategoryMaster";
// import AssetCategoryOverview from "./components/Sim/AssetCategory/AssetCategoryOverview";
// import AssetCategoryUpdate from "./components/Sim/AssetCategory/AssetCategoryUpdate";
// import BrandMast from "./components/Sim/Brand/BrandMast";
// import ModalMast from "./components/Sim/ModalName/ModalMast";
// import RepairReason from "./components/Sim/RepairReasonMast/RepairReason";
// import RepairRequest from "./components/Sim/RepairRequest/RepairRequest";

// import AssetSubCategoryMaster from "./components/Sim/AssetCategory/AssetSubCategoryMaster";
// import AssetSubCategoryOverview from "./components/Sim/AssetCategory/AssetSubCategoryOverview";
// import AssetSubCategoryUpdate from "./components/Sim/AssetCategory/AssetSubCategoryUpdate";
// import VenderOverView from "./components/Sim/Vender/VenderOverView";
// import VenderMaster from "./components/Sim/Vender/VenderMaster";
// import VendorUpdate from "./components/Sim/Vender/VendorUpdate";
// import SingleAssetUserDetails from "./components/Sim/SingleAssetUserDetails";

// import DataBrandMaster from "./components/Datas/DataBrandMaster";
// import DataBrandOverview from "./components/Datas/DataBrandOverview";
// import DataBrandUpdate from "./components/Datas/DataBrandUpdate";
// import DataBrandView from "./components/Datas/DataBrandView";
// import DataCategory from "./components/Datas/DataCategory/DataCategory";
// import DataSubCategory from "./components/Datas/DataSubCategory/DataSubCategory";

// import Platform from "./components/Datas/Platform/Platform";
// import ContentType from "./components/Datas/ContentType/ContentType";
// import DataBrand from "./components/Datas/DataBrand/DataBrand";
// import Dashboard from "./components/Datas/Dashboard";
// import BrandCaseStudy from "./components/AdminPanel/RegisterCampaign/CaseStudies/BrandCaseStudy";
// import CaseStudyDashboard from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyDashboard";
// import CaseStudyplateform from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyplateform";
// import CaseStudyView from "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyView";

const Protected = lazy(() => import("./Login/Protected"));
const Home = lazy(() => import("./components/Home"));
const Admin = lazy(() => import("./components/AdminPanel/Admin"));
// const Profile = lazy(() =>
//   import("./components/Pantry/UserPanel/Profile/Profile")
// );
// const User = lazy(() => import("./components/Pantry/UserPanel/User"));
// const Delivery = lazy(() =>
//   import("./components/Pantry/DeliveryPanel/Delivery")
// );
const SimOverview = lazy(() => import("./components/Sim/SimOverview"));
const SimMaster = lazy(() => import("./components/Sim/SimMaster"));

const SimAllocationOverview = lazy(() =>
  import("./components/Sim/SimAllocationOverview")
);
const UpdateCaseStudy = lazy(() =>
  import("./components/AdminPanel/RegisterCampaign/CaseStudies/UpdateCaseStudy")
);

const SimSummary = lazy(() => import("./components/Sim/SimSummary"));
const IpMaster = lazy(() =>
  import("./components/IntellectualProperty/IpMaster")
);
const IpOverview = lazy(() =>
  import("./components/IntellectualProperty/IpOverview")
);
const IpUpdate = lazy(() =>
  import("./components/IntellectualProperty/IpUpdate")
);
const IpCountUpdate = lazy(() =>
  import("./components/IntellectualProperty/IpCountUpdate")
);

const BrandMaster = lazy(() => import("./components/Brand/BrandMaster"));
const BrandOverview = lazy(() => import("./components/Brand/BrandOverview"));
const BrandUpdate = lazy(() => import("./components/Brand/BrandUpdate"));
const IpHistory = lazy(() =>
  import("./components/IntellectualProperty/IpHistory")
);
// const OrderHistory = lazy(() =>
//   import("./components/Pantry/UserPanel/OrderHistory")
// );
const BrandView = lazy(() => import("./components/Brand/BrandView"));
const SimDashboard = lazy(() => import("./components/Sim/SimDashboard"));
const IpGraph = lazy(() => import("./components/IntellectualProperty/IpGraph"));

// const PendingOrderSingleUser = lazy(() =>
//   import("./components/Pantry/UserPanel/PendingOrderSingleUser")
// );

const AssetCategoryMaster = lazy(() =>
  import("./components/Sim/AssetCategory/AssetCategoryMaster")
);
const AssetCategoryOverview = lazy(() =>
  import("./components/Sim/AssetCategory/AssetCategoryOverview")
);
const AssetCategoryUpdate = lazy(() =>
  import("./components/Sim/AssetCategory/AssetCategoryUpdate")
);
const BrandMast = lazy(() => import("./components/Sim/Brand/BrandMast"));
const ModalMast = lazy(() => import("./components/Sim/ModalName/ModalMast"));
const RepairReason = lazy(() =>
  import("./components/Sim/RepairReasonMast/RepairReason")
);
const RepairRequest = lazy(() =>
  import("./components/Sim/RepairRequest/RepairRequest")
);

// const ForgetPassword = lazy(() => import("./Login/Forget/ForgetPassword"));
const AssetSubCategoryMaster = lazy(() =>
  import("./components/Sim/AssetCategory/AssetSubCategoryMaster")
);
const AssetSubCategoryOverview = lazy(() =>
  import("./components/Sim/AssetCategory/AssetSubCategoryOverview")
);
const AssetSubCategoryUpdate = lazy(() =>
  import("./components/Sim/AssetCategory/AssetSubCategoryUpdate")
);
const VenderOverView = lazy(() =>
  import("./components/Sim/Vender/VenderOverView")
);
const VenderMaster = lazy(() => import("./components/Sim/Vender/VenderMaster"));
const VendorUpdate = lazy(() => import("./components/Sim/Vender/VendorUpdate"));
const SingleAssetUserDetails = lazy(() =>
  import("./components/Sim/SingleAssetUserDetails")
);

const DataBrandMaster = lazy(() =>
  import("./components/Datas/DataBrandMaster")
);
const DataBrandOverview = lazy(() =>
  import("./components/Datas/DataBrandOverview")
);
const DataBrandUpdate = lazy(() =>
  import("./components/Datas/DataBrandUpdate")
);
const DataBrandView = lazy(() => import("./components/Datas/DataBrandView"));
const DataCategory = lazy(() =>
  import("./components/Datas/DataCategory/DataCategory")
);
const DataSubCategory = lazy(() =>
  import("./components/Datas/DataSubCategory/DataSubCategory")
);

const Platform = lazy(() => import("./components/Datas/Platform/Platform"));
const ContentType = lazy(() =>
  import("./components/Datas/ContentType/ContentType")
);
const DataBrand = lazy(() => import("./components/Datas/DataBrand/DataBrand"));
const Dashboard = lazy(() => import("./components/Datas/Dashboard"));
const BrandCaseStudy = lazy(() =>
  import("./components/AdminPanel/RegisterCampaign/CaseStudies/BrandCaseStudy")
);
const CaseStudyDashboard = lazy(() =>
  import(
    "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyDashboard"
  )
);
const CaseStudyplateform = lazy(() =>
  import(
    "./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyplateform"
  )
);
const CaseStudyView = lazy(() =>
  import("./components/AdminPanel/RegisterCampaign/CaseStudies/CaseStudyView")
);

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    console.log("errorcought");
    const handleGlobalError = (event) => {
      console.error("Received Global API Error:", event.detail);
      alert(event.detail); // Show error message to the user
    };

    window.addEventListener("globalApiError", handleGlobalError);

    return () => {
      window.removeEventListener("globalApiError", handleGlobalError);
    };
  });

  useEffect(() => {
    // this code may cause vulnerability so please  inform pratyush  to reserch on it and i am adding this comment for my self

    const handleGlobalClick = (event) => {
      // Check if the user pressed Ctrl (Windows/Linux) or Meta (macOS) while clicking

      if (event.ctrlKey || event.metaKey) {
        localStorage.setItem("token", sessionStorage.getItem("token"));
        setTimeout(() => {
          localStorage.removeItem("token");
        }, 10000);
      }
    };

    window.onmousedown = (event) => {
      if (event.button == 1 || event.buttons == 4) {
        localStorage.setItem("token", sessionStorage.getItem("token"));
        setTimeout(() => {
          localStorage.removeItem("token");
        }, 10000);
      }
    };

    // Add a global click event listener
    document.addEventListener("click", handleGlobalClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  if (localStorage.getItem("token"))
    sessionStorage.setItem("token", localStorage.getItem("token"));

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

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token")
  //   console.log("inside useEffect");
  //   const isTokenExpired = () => {
  //     try {
  //       const tokenData = JSON.parse(atob(token.split(".")[1]));
  //       return tokenData.exp * 1000 < Date.now();
  //     } catch {
  //       return true;
  //     }
  //   };
  //   console.log("isToken Expired:", isTokenExpired());
  //   if (!token || isTokenExpired()) {
  //     sessionStorage.clear();
  //     navigate("/login");
  //   }
  // }, [navigate, pathName]);

  return (
    <>
      <div>{isOnline ? <h1></h1> : alert("No Internet Connection")}</div>

      {/* <Notification /> */}

      <Routes>
        <Route
          path="/login"
          element={
            <Suspense
              fallback={
                <div>
                  <Loader />
                </div>
              }
            >
              <Login />
            </Suspense>
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* sim */}

        <Route path="/" element={<Protected />}>
          <Route
            path="/"
            element={
              <AppProvider>
                <Home />{" "}
              </AppProvider>
            }
          />
          <Route
            path="/pre-onboard-user-from"
            element={
              <AppProvider>
                <PreOnboardingUserMaster />
              </AppProvider>
            }
          />

          <Route
            path="/pantry-user"
            element={
              <AppProvider>
                <User />{" "}
              </AppProvider>
            }
          />
          <Route
            path="/pantry-delivery"
            element={
              <AppProvider>
                <Delivery />{" "}
              </AppProvider>
            }
          />
          <Route
            path="/profile"
            element={
              <AppProvider>
                <Profile />{" "}
              </AppProvider>
            }
          />
          <Route
            path="/order-history"
            element={
              <AppProvider>
                <OrderHistory />{" "}
              </AppProvider>
            }
          />
          <Route
            path="/pending-order-single-user"
            element={
              <AppProvider>
                <PendingOrderSingleUser />{" "}
              </AppProvider>
            }
          />
        </Route>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div>
                  <Loader />
                </div>
              }
            >
              <AppProvider>
                <APIContext>
                  <Admin />
                </APIContext>
              </AppProvider>
            </Suspense>
          }
        />

        <Route
          path="/sim-overview/:id"
          element={
            <AppProvider>
              <SimOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/singleAssetDetails/:id"
          element={
            <AppProvider>
              <SingleAssetUserDetails />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/sim-master"
          element={
            <AppProvider>
              <SimMaster />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/sim-update/:id"
          element={
            <AppProvider>
              <SimUpdate />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/sim-dashboard"
          element={
            <AppProvider>
              <SimDashboard />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/sim-allocation-overview"
          element={
            <AppProvider>
              <SimAllocationOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/sim-summary/:id"
          element={
            <AppProvider>
              <SimSummary />{" "}
            </AppProvider>
          }
        />

        <Route
          path="/asset-category-master"
          element={
            <AppProvider>
              <AssetCategoryMaster />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/asset-category-overview"
          element={
            <AppProvider>
              <AssetCategoryOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/asset-category-update/:id"
          element={
            <AppProvider>
              <AssetCategoryUpdate />{" "}
            </AppProvider>
          }
        />
        {/* Asset sub cat  */}
        <Route
          path="/asset/subCategory"
          element={
            <AppProvider>
              <AssetSubCategoryMaster />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/brand-mast"
          element={
            <AppProvider>
              <BrandMast />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/modal-mast"
          element={
            <AppProvider>
              <ModalMast />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/repair-reason"
          element={
            <AppProvider>
              <RepairReason />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/repair-request"
          element={
            <AppProvider>
              <RepairRequest />{" "}
            </AppProvider>
          }
        />

        <Route
          path="/asset/subCategory/overview"
          element={
            <AppProvider>
              <AssetSubCategoryOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/asset/subcategory-update/:id"
          element={
            <AppProvider>
              <AssetSubCategoryUpdate />{" "}
            </AppProvider>
          }
        />
        {/* vender pages  */}

        <Route
          path="/venderOverView"
          element={
            <AppProvider>
              <VenderOverView />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/vendorMaster"
          element={
            <AppProvider>
              <VenderMaster />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/vendorUpdate/:id"
          element={
            <AppProvider>
              <VendorUpdate />{" "}
            </AppProvider>
          }
        />

        <Route
          path="/ip-overview"
          element={
            <AppProvider>
              <IpOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/ip-master"
          element={
            <AppProvider>
              <IpMaster />
            </AppProvider>
          }
        />
        <Route
          path="/ip-update/:id"
          element={
            <AppProvider>
              <IpUpdate />{" "}
            </AppProvider>
          }
        />

        <Route
          path="/ip-history/:id"
          element={
            <AppProvider>
              <IpHistory />
            </AppProvider>
          }
        />
        <Route
          path="/ip-countupdate/:id"
          element={
            <AppProvider>
              <IpCountUpdate />
            </AppProvider>
          }
        />
        <Route
          path="/ip-graph/:id"
          element={
            <AppProvider>
              <IpGraph />
            </AppProvider>
          }
        />

        <Route
          path="/brand-master"
          element={
            <AppProvider>
              {" "}
              <BrandMaster />
            </AppProvider>
          }
        />
        <Route
          path="/brand-overview"
          element={
            <AppProvider>
              <BrandOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/brand-update/:id"
          element={
            <AppProvider>
              {" "}
              <BrandUpdate />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/brand-view/:id"
          element={
            <AppProvider>
              <BrandView />{" "}
            </AppProvider>
          }
        />

        {/* ------------------------------ case Study start-----------------------------------------  */}
        <Route
          path="/case-study/brand"
          element={
            <AppProvider>
              {" "}
              <BrandCaseStudy />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/casestudy-dashboard"
          element={
            <AppProvider>
              {" "}
              <CaseStudyDashboard />
            </AppProvider>
          }
        />
        <Route
          path="/case-platform"
          element={
            <AppProvider>
              <CaseStudyplateform />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/casestudy-update/:id"
          element={
            <AppProvider>
              <UpdateCaseStudy />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/caseStudy-view/:id"
          element={
            <AppProvider>
              <CaseStudyView />{" "}
            </AppProvider>
          }
        />

        {/* ------------------------------ case Study end-----------------------------------------  */}

        <Route
          path="/data-brand-dashboard"
          element={
            <AppProvider>
              <Dashboard />
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-master"
          element={
            <AppProvider>
              <DataBrandMaster />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-overview"
          element={
            <AppProvider>
              <DataBrandOverview />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-update/:id"
          element={
            <AppProvider>
              <DataBrandUpdate />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-view/:id"
          element={
            <AppProvider>
              <DataBrandView />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-category"
          element={
            <AppProvider>
              <DataCategory />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand-sub-category"
          element={
            <AppProvider>
              <DataSubCategory />
            </AppProvider>
          }
        />
        <Route
          path="/data-platform"
          element={
            <AppProvider>
              <Platform />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-content-type"
          element={
            <AppProvider>
              <ContentType />{" "}
            </AppProvider>
          }
        />
        <Route
          path="/data-brand"
          element={
            <AppProvider>
              <DataBrand />{" "}
            </AppProvider>
          }
        />

        {/* Execution history */}
        {/* sales Account Info Page route  */}
        <Route
          path="/sales-account-info/:id"
          element={
            <AppProvider>
              <APIContext>
                <AccountInfo />
              </APIContext>
            </AppProvider>
          }
        />
        <Route
          path="/instaapi/community/learning"
          element={
            <AppProvider>
              <Learning />{" "}
            </AppProvider>
          }
        />

        <Route
          path="*"
          element={
            <AppProvider>
              <ErrorPage />{" "}
            </AppProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
