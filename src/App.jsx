import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PreventBackNavigation from "./utils/PreventBackNavigation";
import { AppProvider } from "./Context/Context";
import { APIContext } from "./components/AdminPanel/APIContext/APIContext";
import "./App.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./components/PreOnboarding/onboardcss/onboard_style.css";
import "./components/PreOnboarding/onboardcss/onboard_responsive.css";
import "./components/PreOnboarding/onboardcss/onboard_animate.min.css";
// ⚡ Lazy Load Heavy Pages Only
const Home = lazy(() => import("./components/Home"));
const Admin = lazy(() => import("./components/AdminPanel/Admin"));
const PreOnboardingUserMaster = lazy(() =>
  import("./components/PreOnboarding/PreOnboardingUserMaster")
);
const AccountInfo = lazy(() =>
  import(
    "./components/AdminPanel/Sales/Account/AccountInfoComponent/AccountInfo"
  )
);
const Learning = lazy(() =>
  import("./components/SuperTracker/CommunityManagement/Learning/Learning")
);
const ErrorPage = lazy(() => import("./ErrorPage"));

// 🚀 Directly Import Lightweight Pages
import Login from "./Login/Login";
import ForgetPassword from "./Login/Forget/ForgetPassword";
import Protected from "./Login/Protected";
import Loader from "./components/Finance/Loader/Loader";
import LoaderTwo from "./utils/LoaderTwo";
import LoaderOne from "./utils/LoaderOne";
import jwtDecode from "jwt-decode";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ✅ One-time token sync on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      sessionStorage.setItem("token", storedToken);
    }
  }, []);

  // ✅ Clean online/offline listener
  useEffect(() => {
    const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  // ✅ Global error catcher
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error("API Error:", event.detail);
      alert(event.detail);
    };
    window.addEventListener("globalApiError", handleGlobalError);
    return () => {
      window.removeEventListener("globalApiError", handleGlobalError);
    };
  }, []);

  //   // 🔐 Determine onboarding status
  let shouldShowPreOnboarding = false;
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded?.onboard_status == 2) {
        shouldShowPreOnboarding = true;
      }
    } catch (err) {
      console.error("Token decode failed:", err);
    }
  }
  console.log(shouldShowPreOnboarding, "shouldShowPreOnboarding");
  return (
    <>
      <PreventBackNavigation />

      {/* Optional: show a banner if offline */}
      {!isOnline && (
        <div className="offline-banner">⚠ No Internet Connection</div>
      )}

      <Suspense fallback={<LoaderTwo />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<Protected />}>
            <Route
              index
              element={
                <AppProvider>
                  <Home />
                </AppProvider>
              }
            />
            {shouldShowPreOnboarding && (
              <Route
                path="/preonboard/pre-onboard-user-form"
                element={
                  <AppProvider>
                    <PreOnboardingUserMaster />
                  </AppProvider>
                }
              />
            )}
            {!shouldShowPreOnboarding && (
              <Route
                path="/admin/*"
                element={
                  // <Suspense fallback={<LoaderTwo />}>
                  <AppProvider>
                    <APIContext>
                      <Admin />
                    </APIContext>
                  </AppProvider>
                  // </Suspense>
                }
              />
            )}

            <Route
              path="/sales-account-info/:id"
              element={
                // <Suspense fallback={<Loader />}>
                <AppProvider>
                  <APIContext>
                    <AccountInfo />
                  </APIContext>
                </AppProvider>
                // </Suspense>S
              }
            />

            <Route
              path="*"
              element={
                <AppProvider>
                  <ErrorPage />
                </AppProvider>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

// import { Suspense, lazy, useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import PreventBackNavigation from "./utils/PreventBackNavigation";
// import { AppProvider } from "./Context/Context";
// import { APIContext } from "./components/AdminPanel/APIContext/APIContext";
// import jwtDecode from "jwt-decode";

// import "./App.css";
// import "./assets/css/style.css";
// import "./assets/css/responsive.css";
// import "./components/PreOnboarding/onboardcss/onboard_style.css";
// import "./components/PreOnboarding/onboardcss/onboard_responsive.css";
// import "./components/PreOnboarding/onboardcss/onboard_animate.min.css";

// // ⚡ Lazy Load Heavy Pages Only
// const Home = lazy(() => import("./components/Home"));
// const Admin = lazy(() => import("./components/AdminPanel/Admin"));
// const PreOnboardingUserMaster = lazy(() => import("./components/PreOnboarding/PreOnboardingUserMaster"));
// const AccountInfo = lazy(() => import("./components/AdminPanel/Sales/Account/AccountInfoComponent/AccountInfo"));
// const Learning = lazy(() => import("./components/SuperTracker/CommunityManagement/Learning/Learning"));
// const ErrorPage = lazy(() => import("./ErrorPage"));

// // 🚀 Directly Import Lightweight Pages
// import Login from "./Login/Login";
// import ForgetPassword from "./Login/Forget/ForgetPassword";
// import Protected from "./Login/Protected";
// import Loader from "./components/Finance/Loader/Loader";
// import LoaderTwo from "./utils/LoaderTwo";
// import LoaderOne from "./utils/LoaderOne";

// function App() {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       sessionStorage.setItem("token", storedToken);
//     }
//   }, []);

//   useEffect(() => {
//     const handleOnlineStatusChange = () => setIsOnline(navigator.onLine);
//     window.addEventListener("online", handleOnlineStatusChange);
//     window.addEventListener("offline", handleOnlineStatusChange);
//     return () => {
//       window.removeEventListener("online", handleOnlineStatusChange);
//       window.removeEventListener("offline", handleOnlineStatusChange);
//     };
//   }, []);

//   useEffect(() => {
//     const handleGlobalError = (event) => {
//       console.error("API Error:", event.detail);
//       alert(event.detail);
//     };
//     window.addEventListener("globalApiError", handleGlobalError);
//     return () => {
//       window.removeEventListener("globalApiError", handleGlobalError);
//     };
//   }, []);

//   // 🔐 Determine onboarding status
//   let shouldShowPreOnboarding = false;
//   const token = sessionStorage.getItem("token");
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       if (decoded?.onboard_status == 2) {
//         shouldShowPreOnboarding = true;
//       }
//     } catch (err) {
//       console.error("Token decode failed:", err);
//     }
//   }
//   console.log(shouldShowPreOnboarding, "shouldShowPreOnboarding")
//   return (
//     <>
//       <PreventBackNavigation />

//       {!isOnline && <div className="offline-banner">⚠ No Internet Connection</div>}

//       <Suspense fallback={<LoaderTwo />}>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/forget-password" element={<ForgetPassword />} />

//           {/* Protected Routes */}
//           <Route
//             path="/*"
//             element={
//               <Protected>
//                 <AppProvider>
//                   <APIContext>
//                     <Routes>
//                       <Route index element={<Home />} />

//                       {shouldShowPreOnboarding && (
//                         <Route path="pre-onboard-user-form" element={<PreOnboardingUserMaster />} />
//                       )}s

//                       <Route path="admin/*" element={<Admin />} />
//                       <Route path="sales-account-info/:id" element={<AccountInfo />} />
//                       <Route path="instaapi/community/learning" element={<Learning />} />
//                       <Route path="*" element={<ErrorPage />} />
//                     </Routes>
//                   </APIContext>
//                 </AppProvider>
//               </Protected>
//             }
//           />
//         </Routes>
//       </Suspense>
//     </>
//   );
// }

// export default App;
