import React from "react";
import { Route, Routes } from "react-router-dom";
import WFHDRegister from "../components/AdminPanel/WFH/WFHDRegister/WFHDRegister";
import TotalNDG from "../components/AdminPanel/WFH/TotalNDG";
import WFHDUpdate from "../components/AdminPanel/WFH/WFHDRegister/WFHDUpdate";
import NewDocumentCom from "../components/AdminPanel/WFH/NewDocumentCom";
import SalaryDashboard from "../components/AdminPanel/WFH/SalaryGeneration/SalaryDashboard";
import BillingOverview from "../components/AdminPanel/HRMS/WFH/AnalyticDashboard/Billing/BillingOverview";
import BillingMast from "../components/AdminPanel/HRMS/WFH/AnalyticDashboard/Billing/BillingMast";
import BillingUpdate from "../components/AdminPanel/HRMS/WFH/AnalyticDashboard/Billing/BillingUpdate";
import AttendanceOverview from "../components/AdminPanel/WFH/AttendanceOverview";
import Attendence from "../components/AdminPanel/WFH/Attendence";
import WFHTemplateOverview from "../components/AdminPanel/WFH/WFHSingleUser/WFHTemplateOverview";
import HRTemplateOverview from "../components/AdminPanel/WFH/HRTemplateOverview";
// import ViewEditDigiSignature from '../components/AdminPanel/HRMS/WFH/AnalyticDashboard/DigitalSignature/ViewEditDigiSignature'
import { lazy, Suspense } from "react";
const ViewEditDigiSignature = lazy(() =>
  import(
    "../components/AdminPanel/HRMS/WFH/AnalyticDashboard/DigitalSignature/ViewEditDigiSignature"
  )
);

import DashboardWFHUser from "../components/AdminPanel/WFH/DashboardWFHUser";
import DashboardWFHCardDetails from "../components/AdminPanel/WFH/DashboardWFHCardDetails";
import WFHDOverview from "../components/AdminPanel/WFH/WFHDOverview";
import AnalyticDashboard from "../components/AdminPanel/HRMS/WFH/AnalyticDashboard/AnalyticDashboard";
import WFHUserOverview from "../components/AdminPanel/WFH/WFHUserOverview";
import WFHDBankUpdate from "../components/AdminPanel/WFH/WFHDBankUpdate";
import SalaryWFH from "../components/AdminPanel/WFH/SalaryGeneration/SalaryWFH";
import WFHAllSalary from "../components/AdminPanel/WFH/WFHAllSalary";
import SalarySummary from "../components/AdminPanel/WFH/SalarySummary/SalarySummary";
import WFHSingleUser from "../components/AdminPanel/WFH/WFHSingleUser/WFHSingleUser";

function UserWFHDRoutes({ contextData }) {
  return (
    <Routes>
      <>
        <Route path="/wfhd-register" element={<WFHDRegister />} />
        <Route path="/total-NDG" element={<TotalNDG />} />
        <Route path="/wfhd-update/:id" element={<WFHDUpdate />} />
        <Route path="/wfhd-new-documentcom/:id" element={<NewDocumentCom />} />

        <Route path="/salary-dashboard/:id" element={<SalaryDashboard />} />
        <Route path="/billing-overview" element={<BillingOverview />} />
        <Route path="/billing-master" element={<BillingMast />} />
        <Route path="/billing-update/:id" element={<BillingUpdate />} />
        <Route path="/attendence-overview" element={<AttendanceOverview />} />
        <Route path="/attendence-mast" element={<Attendence />} />

        <Route
          path="/wfh-template-overview"
          element={<WFHTemplateOverview />}
        />
        <Route path="hr-template-overview" element={<HRTemplateOverview />} />
        <Route
          path="view-edit-digital-signature"
          element={<ViewEditDigiSignature />}
        />
        <Route path="/wfh-user-dashboard" element={<DashboardWFHUser />} />
        <Route
          path="/wfh-dashboard-overview/:id"
          element={<DashboardWFHCardDetails />}
        />
        <Route path="/wfhd-overview" element={<WFHDOverview />} />
        <Route
          path="/wfhd-analytic-dashbaord"
          element={<AnalyticDashboard />}
        />
        <Route
          path="/wfh-users-overview/:deptId"
          element={<WFHUserOverview />}
        />
        <Route path="/wfhd-bank-update/:user_id" element={<WFHDBankUpdate />} />
        <Route path="/salaryWFH" element={<SalaryWFH />} />
        <Route path="/all-salary" element={<WFHAllSalary />} />
        <Route path="/salary-summary" element={<SalarySummary />} />
      </>
      <Route path="/wfh-single-user" element={<WFHSingleUser />} />
    </Routes>
  );
}

export default UserWFHDRoutes;
