import React from "react";
import { Route, Routes } from "react-router-dom";
import Timeline from "../components/AdminPanel/Navbar-Sidebar/Timeline";
import Profile from "../components/AdminPanel/HRMS/Profile/Profile.jsx";
import UserDashboard from "../components/AdminPanel/HRMS/User/UserDashboard";
import UserWiseDashboard from "../components/AdminPanel/HRMS/User/UserWIseDashboard/UserWiseDashboard";
// import KRA from "../components/AdminPanel/HRMS/KRA/KRA";
// import UserWiseResponsibility from "../components/AdminPanel/HRMS/UserResponsbility/UserWiseResponsibility/UserWiseResponsibility";
import DesignationOverview from "../components/AdminPanel/HRMS/Designation/DesignationOverview";
import DesignationUpdate from "../components/AdminPanel/HRMS/Designation/DesignationUpdate";
import Designation from "../components/AdminPanel/HRMS/Designation/Designation";
import UserMaster from "../components/AdminPanel/HRMS/User/UserMaster";
import UserLoginHistory from "../components/AdminPanel/HRMS/User/UserDashboard/LoginHistory/UserLoginHistory";
import UserOverview from "../components/AdminPanel/HRMS/User/UserOverview";
import UserUpdate from "../components/AdminPanel/HRMS/User/UserUpdate";
import UserView from "../components/AdminPanel/HRMS/User/UserView";
import UserAuthDetail from "../components/AdminPanel/HRMS/UserAuthDetail/UserAuthDetail";
import UserHierarchy from "../components/AdminPanel/HRMS/User/UserHierarchy";
import UserGraphs from "../components/AdminPanel/HRMS/User/UserGraphs";
import AddEmailTemp from "../components/AdminPanel/HRMS/User/AddEmailTemp";
import EmailTempOverview from "../components/AdminPanel/HRMS/User/EmailTempOverview";
import EditEmailTemp from "../components/AdminPanel/HRMS/User/EditEmailTemp";
import EmailEvent from "../components/AdminPanel/HRMS/User/EmailEvent/EmailEvent";
import DesiDeptAuth from "../components/AdminPanel/HRMS/Designation/DesiDeptAuth";
import UserSingle from "../components/AdminPanel/HRMS/User/UserSingle";
import OrgTree from "../components/AdminPanel/WFH/OrgTree/OrgTree";
import UserDirectory from "./../components/AdminPanel/HRMS/User/UserDirectory";
import UserSummary from "../components/AdminPanel/WFH/UserSummary/UserSummary";
import OfficeMastOverview from "../components/AdminPanel/HRMS/Sitting/OfficeMastOverview";
import CommonRoom from "../components/AdminPanel/HRMS/Sitting/CommonRoom";
import SittingRoomWise from "../components/AdminPanel/HRMS/Sitting/SittingRoomWise.jsx";
import SittingOverview from "../components/AdminPanel/HRMS/Sitting/SittingOverview.jsx";
import JobTypeMaster from "../components/AdminPanel/HRMS/JobType/JobTypeMaster.jsx";
import Hobbies from "../components/AdminPanel/HRMS/Hobbies/Hobbies.jsx";
import HobbiesOverview from "../components/AdminPanel/HRMS/Hobbies/HobbiesOverview.jsx";
// import UserResposOverview from "../components/AdminPanel/HRMS/UserResponsbility/UserResposOverview.jsx";
// import UserResponsbility from "../components/AdminPanel/HRMS/UserResponsbility/UserResponsbility.jsx";
// import UserResponsbilityUpdate from "../components/AdminPanel/HRMS/UserResponsbility/userResponsbilityUpdate.jsx";
import ObjectMaster from "../components/AdminPanel/Object/ObjectMaster.jsx";
import ObjectOverview from "../components/AdminPanel/Object/ObjectOverview.jsx";
import ObjectUpdate from "../components/AdminPanel/Object/ObjectUpdate.jsx";
import DepartmentOverview from "../components/AdminPanel/HRMS/Department/DepartmentOverview.jsx";
import DepartmentMaster from "../components/AdminPanel/HRMS/Department/DepartmentMaster.jsx";
import DepartmentUpdate from "../components/AdminPanel/HRMS/Department/DepartmentUpdate.jsx";
import MajorDepartmentMast from "../components/AdminPanel/HRMS/Department/MajorDepartment/MajorDepartmentMast.jsx";
import MajorDepartmentOverview from "../components/AdminPanel/HRMS/Department/MajorDepartment/MajorDepartmentOverview.jsx";
import MajorDepartmentUpdate from "../components/AdminPanel/HRMS/Department/MajorDepartment/MajorDepartmentUpdate.jsx";
import RoleMaster from "../components/AdminPanel/HRMS/Role/RoleMaster.jsx";
import RoleOverView from "../components/AdminPanel/HRMS/Role/RoleOverview.jsx";
import RoleMastUpdate from "../components/AdminPanel/HRMS/Role/RoleMastUpdate.jsx";
import IncompleteProfileUsers from "../components/AdminPanel/WFH/IncompleteProfileUsers.jsx";
import SubDepartmentOverview from "../components/AdminPanel/HRMS/Department/SubDepartmentOverview.jsx";
import SubDepartmentMaster from "../components/AdminPanel/HRMS/Department/SubDepartmentMaster.jsx";
import SubDepartmentUpdate from "../components/AdminPanel/HRMS/Department/SubDepartmentUpdate.jsx";
// /HRMS/Sitting/SittingRoomWise.jsx
function UserRoutes() {
  return (
    <Routes>
      <Route path="/user-timeline" element={<Timeline />} />
      <Route path="/user-profile" element={<Profile />} />

      <Route path="/users-dashboard" element={<UserDashboard />} />
      <Route
        path="/dashboard_department_wise_user/:id"
        element={<UserWiseDashboard />}
      />

      {/* <Route path="/kra/:id" element={<KRA />} />
      <Route
        path="/user-wise-responsibility/:id"
        element={<UserWiseResponsibility />}
      /> */}

      <>
        <Route path="/designation-overview" element={<DesignationOverview />} />
        <Route
          path="/designation-update/:desi_id"
          element={<DesignationUpdate />}
        />
        <Route path="/designation-master" element={<Designation />} />
      </>

      <>
        <Route path="/user" element={<UserMaster />} />

        <>
          <Route path="/user-login-history" element={<UserLoginHistory />} />
          <Route path="/user-overview/:id" element={<UserOverview />} />
          <Route path="/user-update/:id" element={<UserUpdate />} />
          <Route path="/user_view/:id" element={<UserView />} />
          <Route path="/user-auth-detail/:id" element={<UserAuthDetail />} />
          <Route
            path="/user-directory"
            element={<UserDirectory />} // pending
          />
          <Route path="/user-hierarchy" element={<UserHierarchy />} />
          {/* <Route
                                                            path="/user-single/:id"
                                                            element={<UserSingle />}
                                                        /> */}
          <Route path="/user-graph" element={<UserGraphs />} />
          <Route path="/email-template" element={<AddEmailTemp />} />
          <Route
            path="/email-template-overview"
            element={<EmailTempOverview />}
          />
          <Route
            path="/email-template-update/:id"
            element={<EditEmailTemp />}
          />
          <Route path="/email-events" element={<EmailEvent />} />
          {/* DesiDeptAuth Routing  */}
          <Route path="/desi-dept-auth/:id" element={<DesiDeptAuth />} />
        </>
        {/* )} */}
        <Route path="/user-single/:id" element={<UserSingle />} />
        <Route path="/org-tree" element={<OrgTree />} />
        <Route path="/user-summary" element={<UserSummary />} />
      </>

      <>
        <Route
          path="/office-mast-overview/:room/:shift"
          element={<OfficeMastOverview />}
        />
        <Route path="/common-room" element={<CommonRoom />} />
        <Route
          path="/office-sitting-room-wise/:selectedRoom/:shift"
          element={<SittingRoomWise />}
        />
      </>

      <>
        <Route path="/sitting-overview/:shift" element={<SittingOverview />} />
      </>

      <Route path="/jobType" element={<JobTypeMaster />} />
      <Route path="/hobbies/:id" element={<Hobbies />} />
      <Route path="hobbies-overview" element={<HobbiesOverview />} />

      <Route
        path="/wfh-incomplete-user-overview"
        element={<IncompleteProfileUsers />}
      />

      {/* <>
        <Route path="/user-respons-overivew" element={<UserResposOverview />} />
        <Route path="/user-responsbility" element={<UserResponsbility />} />
        <Route
          path="/user-respons-update"
          element={<UserResponsbilityUpdate />}
        />
      </> */}

      <>
        <Route path="/object-master" element={<ObjectMaster />} />
        <Route path="/object-overview" element={<ObjectOverview />} />
        <Route path="/object-update/:id" element={<ObjectUpdate />} />
      </>

      <>
        <Route path="/department-overview" element={<DepartmentOverview />} />
        <Route path="/department-master" element={<DepartmentMaster />} />
        <Route path="/department-update" element={<DepartmentUpdate />} />

        <Route
          path="/sub-department-overview"
          element={<SubDepartmentOverview />}
        />
        <Route
          path="/sub-department-master"
          element={<SubDepartmentMaster />}
        />
        <Route
          path="/sub-department-update/:id"
          element={<SubDepartmentUpdate />}
        />

        <Route
          path="/major-department-mast"
          element={<MajorDepartmentMast />}
        />
        <Route
          path="/major-department-overview"
          element={<MajorDepartmentOverview />}
        />
        <Route
          path="/major-department-update/:id"
          element={<MajorDepartmentUpdate />}
        />
      </>

      <>
        <Route path="/role" element={<RoleMaster />} />
        <Route path="/role-overview" element={<RoleOverView />} />
        <Route path="/role-update" element={<RoleMastUpdate />} />
      </>
    </Routes>
  );
}

export default UserRoutes;
