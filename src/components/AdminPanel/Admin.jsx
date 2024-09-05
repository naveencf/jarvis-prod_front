import { Route, Routes } from "react-router-dom";
// import { useGlobalContext } from "../../Context/Context";
import SittingMaster from "./Sitting/SittingMaster";
import NavSideBar from "./Navbar-Sidebar/NavSideBar";
import UserMaster from "./User/UserMaster";
import UserView from "./User/UserView";
import UserUpdate from "./User/UserUpdate";
import UserOverview from "./User/UserOverview";
import RoleMaster from "./Role/RoleMaster";
import RoleOverView from "./Role/RoleOverview";
import RoleMastUpdate from "./Role/RoleMastUpdate";
import DepartmentOverview from "./Department/DepartmentOverview";
import DepartmentMaster from "./Department/DepartmentMaster";
import DepartmentUpdate from "./Department/DepartmentUpdate";
import ProductMaster from "./Product/ProductMaster";
import ProductOverview from "./Product/ProductOverview";
import ProductUpdate from "./Product/ProductUpdate";
import SittingOverview from "./Sitting/SittingOverview";
import SittingUpdate from "./Sitting/SittingUpdate";
import OfficeMast from "./Office/OfficeMaster";
import OfficeMastOverview from "./Office/OfficeMastOverview";
import OfficeMastUpdate from "./Office/OfficeMastUpdate";
import UserResposOverview from "./UserResponsbility/UserResposOverview";
import UserResponsbility from "./UserResponsbility/UserResponsbility";
import UserResponsbilityUpdate from "./UserResponsbility/userResponsbilityUpdate";
import UserAuthDetail from "./UserAuthDetail/UserAuthDetail";
import ObjectMaster from "./Object/ObjectMaster";
import ObjectOverview from "./Object/ObjectOverview";
import ObjectUpdate from "./Object/ObjectUpdate";
import DeliverdOrder from "../Pantry/DeliverdOrder/DeliverdOrder";
import PendingOrder from "../Pantry/PendingOrder/PendingOrder";
import Dashboard from "./Dashboard/Dashboard";
import TransferReq from "../Pantry/TransferReq/TransferReq";
import AllOrder from "../Pantry/AllOrders/AllOrders";
import DesignationOverview from "./Designation/DesignationOverview";
import Designation from "./Designation/Designation";
import DesignationUpdate from "./Designation/DesignationUpdate";
// import { useGlobalContext } from "../../Context/Context";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import LogoCategoryMaster from "./LogoCategory/LogoCategoryMaster";
import LogoCategoryOverview from "./LogoCategory/LogoCategoryOverview";
import LogoCategoryUpdate from "./LogoCategory/LogoCategoryUpdate";
import PantryHome from "../Pantry/PantryHome/PantryHome";
import ResponsibilityMast from "./UserResponsbility/Responsbility/ResponsibilityMast";
import ResponsiblityOverview from "./UserResponsbility/Responsbility/ResponsiblityOverview";
import ResponsibilityUpdate from "./UserResponsbility/Responsbility/ResponsibilityUpdate";
import IpTypeMaster from "./IpType/IpTypeMaster";
import IpTypeOverview from "./IpType/IpTypeOverview";
import IpTypeUpdate from "./IpType/IpTypeUpdate";
import PlatformMaster from "./Platform/PlatformMaster";
import PlatformOverview from "./Platform/PlatformOverview";
import PlatformUpdate from "./Platform/PlatformUpdate";
import DeclinedOrder from "../Pantry/DeclinedOrder/DeclinedOrder";
import UserDirectory from "./User/UserDirectory";
import AdminPreOnboarding from "./AdminPreOnboarding/AdminPreOnboarding";
import Attendence from "./WFH/Attendence";
import AttendanceOverview from "./WFH/AttendanceOverview";
import UserDashboard from "./User/UserDashboard/UserDashboard";
import KRA from "./KRA/KRA";
import UserWiseResponsibility from "./UserResponsbility/UserWiseResponsibility/UserWiseResponsibility";
import UserWiseDashboard from "./User/UserWIseDashboard/UserWiseDashboard";
import SalaryWFH from "./WFH/SalaryGeneration/SalaryWFH";
import SalarySummary from "./WFH/SalarySummary/SalarySummary";
import UserHierarchy from "./User/UserHierarchy";
import UserSingle from "./User/UserSingle";
import DashboardWFHUser from "./WFH/DashboardWFHUser";
import DashboardWFHCardDetails from "./WFH/DashboardWFHCardDetails";
import WFHDOverview from "./WFH/WFHDOverview";
import LeadApp from "../LeadManagement/LeadApp";
import LeadManagement from "../LeadManagement/LeadManagement";
import EditLead from "../LeadManagement/EditLead";
import LeadHome from "../LeadManagement/LeadHome";
import SELeadTable from "../LeadManagement/SELeadTable";
import Reason from "./Reason/Reason";
import SubDepartmentMaster from "./Department/SubDepartmentMaster";
import SubDepartmentOverview from "./Department/SubDepartmentOverview";
import SubDepartmentUpdate from "./Department/SubDepartmentUpdate";
import ExecutionInventory from "../Execution/ExecutionInventory";
import ExecutionPending from "../Execution/ExecutionPending";
import OverviewIndex from "../Execution/overview/OverviewIndex";
import ExecutionDetail from "../Execution/ExecutionDetail";
// import InstaAPIHome from "../InstaApi.jsx/InstaAPIHome";
// import InstaPageDashboard from "../InstaApi.jsx/InstaPageDashboard";
// import InstaPostDashboard from "../InstaApi.jsx/InstaPostDashboard";
// import InstaPageDetail from "../InstaApi.jsx/InstaPageDetail";
// import ExecutionUpdate from "../Execution/ExecutionUpdate";
// import CronExpression from "../InstaApi.jsx/CronExpression";
// import InstaApiContext from "../InstaApi.jsx/InstaApiContext";
import PreOnboardVerifyDetails from "./AdminPreOnboarding/PreOnboardVerifyDetails";
import PreOnboardUserDetailsProfile from "./AdminPreOnboarding/PreOnboardUserDetailsProfile";
import PreOnboardingOverview from "./AdminPreOnboarding/PreOnboardOverview";
import OnboardExtendDateOverview from "./AdminPreOnboarding/OnboardExtendDateOverview";
// import AuditorTrack from "../InstaApi.jsx/Auditor/AuditorTrack";
import ExecutionDone from "../Execution/Done/ExecutionDone";
import ExecutionAccepted from "../Execution/Accepted/ExecutionAccepted";
import RegisterCampaign from "./RegisterCampaign/RegisterCampaign";
import ExecutionRejected from "../Execution/Rejected/ExecutionRejected";
import RegisteredCampaign from "./RegisterCampaign/RegisteredCampaign";
import SalaryDashboard from "./WFH/SalaryGeneration/SalaryDashboard";
import CampignAdmin from "./CampaginAdmin/CampignAdmin";
import BrandMaster from "./RegisterCampaign/BrandMaster";
import CategoryMaster from "./RegisterCampaign/CategoryMaster";
import ContentType from "./RegisterCampaign/ContentType";
import CampaignCommitment from "./RegisterCampaign/CampaignCommitment";
import ContentCreater from "./RegisterCampaign/ContentCreater";
import CheckPageFollowers from "./RegisterCampaign/CheckPageFollowers";
import SubCategoryMaster from "./RegisterCampaign/SubCategoryMaster";
import CreaterDashboard from "./RegisterCampaign/CreaterDashboard";
import BillingOverview from "./WFH/Billing/BillingOverview";
import BillingMast from "./WFH/Billing/BillingMast";
import BillingUpdate from "./WFH/Billing/BillingUpdate";
// import InterpretorPage from "../InstaApi.jsx/Interpretor/InterpretorPage";
// import InterpretorPostDashboard from "../InstaApi.jsx/Interpretor/InterpretorPostDashboard";
// import InterpretorPageDashboard from "../InstaApi.jsx/Interpretor/InterpretorPageDashboard";
// import AdminPageView from "../InstaApi.jsx/InstaAdmin/AdminPageView";
// import AdminPostView from "../InstaApi.jsx/InstaAdmin/AdminPostView";
// import AuditorPageView from "../InstaApi.jsx/Auditor/AuditorPageView";
// import InterpretorContext from "../InstaApi.jsx/Interpretor/InterpretorContext";
// import AnalyticsDashboard from "../InstaApi.jsx/Analytics/AnalyticsDashboard";
import AccountsOverviewWFH from "./AccountsDepartment/AccountsOverviewWFH";
import WFHSingleUser from "./WFH/WFHSingleUser/WFHSingleUser";
import ExecutionAll from "../Execution/ExecutionAll";
import ExecutionOwn from "../Execution/ExecutionOwn";
import ExecutionOther from "../Execution/ExecutionOther";
import CocUpdate from "./AdminPreOnboarding/CocUpdate";
import CocMaster from "./AdminPreOnboarding/CocMaster";
import CocOverview from "./AdminPreOnboarding/CocOverview";
import NotificationHistory from "./AdminPreOnboarding/NotificationHistory";
import CocHistory from "./AdminPreOnboarding/CocHistory";
import LoginHistory from "./AdminPreOnboarding/LoginHistory";
import PreonboardingDocuments from "./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocuments";
import PreonboardingDocumentOverview from "./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentOverview";
import PreonboardingDocumentsUpdate from "./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentsUpdate";
import PlanOverview from "./RegisterCampaign/PlanOverview";
// import PhaseCreation from "./RegisterCampaign/PhaseCreation";
// import PlanCreation from "./RegisterCampaign/PlanCreation";
import ExeUPdate from "../Execution/ExeUPdate";
import ExeHistory from "../Execution/ExeHistory";
import { SelfAudit } from "./AssetNotifier/SelfAudit";
import StatsAllPagesDetail from "../Execution/StatsAllPagesDetail";
import ExecutionDashboard from "../Execution/ExecutionDashboard";
import AllTransactions from "../Finance/AllTransactions";
import ApprovalInvoice from "../Finance/ApprovalInvoice";
import BalancePaymentList from "../Finance/Sales Management/Outstanding/BalancePaymentList";
import IncentivePayment from "../Finance/Sales Management/Incentive/IncentiveParent";
import PaymentMode from "../Finance/Sales Management/PaymentModeFolder/PaymentMode";
import PendingApprovalRefund from "../Finance/PendingApprovalRefund";
import PendingApprovalsUpdate from "../Finance/Sales Management/PaymentRequestUpdate/PendingApprovalsUpdate";
import PendingInvoice from "../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoice";
import RefundRequests from "../Finance/RefundRequests";
import SaleBookingClose from "../Finance/Sales Management/SaleBooking/Components/SaleBookingClose";
import SaleBookingVerify from "../Finance/Sales Management/SaleBooking/Components/SaleBookingVerify";
import PaymentSummary from "../Finance/PaymentSummary";
import PendingInvoiceCustomerDeatils from "../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoiceCustomerDeatils";
import InvoiceCreated from "../Finance/Sales Management/Invoice/InvoiceCreated/InvoiceCreated";
import PendingPaymentsList from "../Finance/PendingPaymentsList";
import CityMaster from "../Execution/cityMast/CityMaster";
import Experties from "./RegisterCampaign/Experties/Experties";
import PagePerformanceDashboard from "../Execution/PagePerformanceDashboard";
import ExcusionCampaign from "./RegisterCampaign/ExcusionCampaign";
import ExpertiesOverview from "./RegisterCampaign/Experties/ExpertiesOverview";
import ExpertiesUpdate from "./RegisterCampaign/Experties/ExpertUpdate";
import PhaseDashboard from "./RegisterCampaign/PhaseDashboard/PhaseDashboard";
import ReplacementDashobard from "./RegisterCampaign/ReplacementDashboard/ReplacementDashboard";
import AssignmentDashobard from "./RegisterCampaign/AssignmentDashboard/AssignmentDashboard";
import WFHUserOverview from "./WFH/WFHUserOverview";
import CreateAssign from "./RegisterCampaign/CreateAssign";
import PagePerformanceAnalytics from "../Execution/PagePerformanceAnalytics";
import IncompleteProfileUsers from "./WFH/IncompleteProfileUsers";
import UserGraphs from "./User/UserGraphs";
import Hobbies from "./Hobbies/Hobbies";
import HobbiesOverview from "./Hobbies/HobbiesOverview";
import AddEmailTemp from "./User/AddEmailTemp";
import EmailTempOverview from "./User/EmailTempOverview";
import EditEmailTemp from "./User/EditEmailTemp";
import ManagerDashboard from "./RegisterCampaign/ManagerDashboard/ManagerDashboard";
import ManagerCampaign from "./RegisterCampaign/ManagerCampaignDashboard/ManagerCampaign";
import AssetVisibleToTagedPerosn from "../Sim/AssetVisibleToTagedPerson/AssetVisibleToTagedPerosn";
import AssetSingleUser from "../Sim/AssetSingeUser/AssetSingleUser";
import AssetVisibleToHr from "../Sim/AssetVisibleToHr/AssetVisibleToHr";
import AssetManager from "../Sim/AssetManager/AssetManager";
import WFHAllSalary from "./WFH/WFHAllSalary";
import PendingPaymentRequest from "../Finance/Purchase Management/PendingPaymentRequest/PendingPaymentRequest";
import PaymentDone from "../Finance/PaymentDone";
import PurchaseManagementAllTransaction from "../Finance/PurchaseManagementAllTransaction";
import Discard from "../Finance/Discard";
import JobTypeMaster from "../JobType/JobTypeMaster";
import FinanceWFHDashboard from "../Finance Dashboard/FinanceWFHDashboard";
import WFHTemplateOverview from "./WFH/WFHSingleUser/WFHTemplateOverview";
import ViewEditDigiSignature from "./WFH/DigitalSignature/ViewEditDigiSignature";
import PlancreationNew from "./RegisterCampaign/PlancreationNew";
import TempPlanCreation from "./RegisterCampaign/tempPlan/TempPlanCreation";
import PhasecreationNew from "./RegisterCampaign/PhasecreationNew";
import DesiDeptAuth from "../AdminPanel/Designation/DesiDeptAuth";
import PlanDashboard from "./RegisterCampaign/PlanDashboard/PlanDashboard";
import CreateAgency from "./RegisterCampaign/Masters/CreateAgency";
import CreateGoal from "./RegisterCampaign/Masters/CreateGoal";
import CreateIndustry from "./RegisterCampaign/Masters/CreateIndustry";
import AgencyOverview from "./RegisterCampaign/Masters/AgencyOverview";
import GoalOverview from "./RegisterCampaign/Masters/GoalOverview";
import IndustryOverview from "./RegisterCampaign/Masters/IndustryOverview";
import CreateService from "./RegisterCampaign/Masters/CreateService";
import ServicesOverview from "./RegisterCampaign/Masters/ServicesOverview";
import TaskStatusDeptWiseMaster from "../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseMaster";
import TaskStatusDeptWiseOverview from "../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseOverview";
import TaskStatusDeptWiseUpdate from "../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseUpdate";
import DisputeOverview from "./WFH/Dispute/DisputeOverview";
import FinanceDashboard from "../Finance/Dashboard/FinanceDashboard";
import SalesExecutiveIncentiveRequestReleaseList from "../Finance/SalesExecutiveIncentiveRequestReleaseList";
import AssetDashboard from "../Sim/AssetDashboard";
import { baseUrl } from "../../utils/config";
import CreatePlan from "./RegisterCampaign/Plan/CreatePlan";
import EmailEvent from "./User/EmailEvent/EmailEvent";
import AllPlan from "./RegisterCampaign/Plan/AllPlanData";
import AllPlanData from "./RegisterCampaign/Plan/AllPlanData";
import AllPlanOverview from "./RegisterCampaign/Plan/AllPlanOverview";
import AssetSummary from "../Sim/AssetSummary";
import CaseStudyOperation from "./RegisterCampaign/CaseStudies/CaseStudyOperation";
import WFHDRegister from "./WFH/WFHDRegister/WFHDRegister";
import UpdateDocument from "./WFH/UpdateDocument";
import HRTemplateOverview from "./WFH/HRTemplateOverview";

import WFHDUpdate from "./WFH/WFHDRegister/WFHDUpdate";
import WFHDBankUpdate from "./WFH/WFHDBankUpdate";
import PaymentModeMast from "../Finance/Sales Management/PaymentModeFolder/PaymentModeMast";
import PaymentModeTransactionList from "../Finance/Sales Management/PaymentModeFolder/PaymentModeTransactionList";
import TotalNDG from "./WFH/TotalNDG";

import TaskPending from "../Finance/TaskPending";
import TaskDone from "../Finance/TaskDone";
import TDSdeduct from "../Finance/TDSdeduct";
import GSThold from "../Finance/GSThold";

import NewExcelFile from "./RegisterCampaign/Plan/NewExcelFile";

import TempExecution from "./RegisterCampaign/tempPlan/TempExecution";
import AccountType from "./Customer/AccountType";
import AccountMaster from "./Customer/BrandNameType";
import OwnershipMaster from "./Customer/OwnershipMaster";
import OpsCustomerMast from "./Customer/OpsCustomerMast";
import OpsCustomerOverview from "./Customer/OpsCustomerOverview";
import OpsCustomerUpdate from "./Customer/OpsCustomerUpdate";
import CustomerContOverview from "./Customer/CustomerContOverview";
import CustomerContMaster from "./Customer/CustomerContMaster";
import CustomerContUpdate from "./Customer/CustomerContUpdate";
import OpsDocMast from "./Customer/OpsDocMast";

import VendorType from "./PageMS/VendorType";
import PageCategory from "./PageMS/PageCategory";
import ProfileType from "./PageMS/ProfileType";
import PageOwnership from "./PageMS/PageOwnership";
import PmsPlatform from "./PageMS/PmsPlatform";
import PayMethod from "./PageMS/PayMethod";
import PayCycle from "./PageMS/PayCycle";
import GroupLinkType from "./PageMS/GroupLinkType";
import VendorMaster from "./PageMS/VendorMaster";
import VendorOverview from "./PageMS/VendorOverview";
import VendorEdit from "./PageMS/VendorEdit";
import PMSpriceTypeMast from "./PageMS/PMSpriceTypeMast";
import PMSplatformPriceTypeMast from "./PageMS/PMSplatformPriceTypeMast";
import VendorGroupLink from "./PageMS/VendorGroupLink";
import PageMaster from "./PageMS/PageMaster";
import PageOverview from "./PageMS/PageOverview";
import RepairRetrunSummary from "../Sim/RepairRetrunSummary";
import VendorPagePriceOverview from "./PageMS/VendorPagePriceOverview";
import VendorPagePriceMaster from "./PageMS/VendorPagePriceMaster";
import EditVendorPagePrice from "./PageMS/EditVendorPagePrice";
import PageEdit from "./PageMS/PageEdit";
import AnnouncementPost from "./Announcement/AnnoucementPost";
import AnnouncementView from "./Announcement/AnnouncementView";
import PMSmaster from "./PageMS/PMSmaster";
import OperationCampaigns from "./RegisterCampaign/OperationCampaigns";
import OperationDashboards from "./RegisterCampaign/OperationDashboards";
import OperationContents from "./RegisterCampaign/OperationContents";
import GstNongstIncentiveReport from "../Finance/Sales Management/Incentive/IncentiveComponents/GstNongstIncentiveReport";
import AssetRepairSummary from "../Sim/AssetRepairSummaryHR";
import VendorSummary from "../Sim/VendorSummary";
import SalesDashboard from "./Sales/SalesDashboard";
import SalesServicesOverview from "./Sales/SalesServices/SalesServicesOverview";
import SalesServicesCreate from "./Sales/SalesServices/SalesServicesCreate";
import SalesServicesUpdate from "./Sales/SalesServices/SalesServicesUpdate";
import Invoice from "../Finance/Sales Management/Invoice/Invoice";
import CreditApprovalReasonCreate from "./Sales/CreditApprovalReason/CreditApprovalReasonCreate";
import CreditApprovalReasonView from "./Sales/CreditApprovalReason/CreditApprovalReasonView";
import CreditApprovalReasonUpdate from "./Sales/CreditApprovalReason/CreditApprovalReasonUpdate";
import CustomerDocumentMaster from "./Customer/CustomerDocumentMaster";
import CustomerDocumentOverview from "./Customer/CustomerDocumentOverview";
import NewExpertUpdate from "./RegisterCampaign/Experties/NewExpertUpdate";
import IncentiveCreate from "./Sales/IncentivePlan/IncentiveCreate";
import IncentiveOverview from "./Sales/IncentivePlan/IncentiveOverview";
import IncentiveUpdate from "./Sales/IncentivePlan/IncentiveUpdate";
import CustomerContactDetails from "./Customer/Contectdetailes/CustomerContactDetails";
import PurchasePrice from "./PageMS/PurchasePrice";
import UserSummary from "./WFH/UserSummary/UserSummary";
import PageAssignmentUpdate from "./ExpenseManagement/ExpenseManagementUpdate";
import CustomerDocumentDetails from "./Customer/DocumentDetails/CustomerDocumentDetails";
import CustomerDocumentUpdate from "./Customer/CustomerDocumentUpdate";
import OperationDashboard from "./RegisterCampaign/OperationDashboard/OperationDashboard";
import CreateSaleBooking from "./Sales/SaleBooking/CreateSaleBooking";
import ViewSaleBooking from "./Sales/SaleBooking/ViewSaleBooking";
import Timeline from "./Navbar-Sidebar/Timeline";
import SaleBooking from "../Finance/Sales Management/SaleBooking/SaleBooking";

import Stats from "./PageMS/Stats";
import OperationMasters from "./Operation/Masters/OperationMasters";
import RegisteredCampaigns from "./Operation/RegisteredCampaigns";
import PlanCreation from "./Operation/PlanCreation";
import PhaseCreation from "./Operation/PhaseCreation";
import CampaignExecutions from "./Operation/CampaignExecutionOverview/CampaignExecutions";
import CreatePaymentUpdate from "./Sales/PaymentUpdate/CreatePaymentUpdate";
import CreatePaymentMode from "./Sales/PaymentMode/CreatePaymentMode";
import ViewPaymentMode from "./Sales/PaymentMode/ViewPaymentMode";
import EditPaymentMode from "./Sales/PaymentMode/EditPaymentMode";
import CreatePaymentDetails from "./Sales/PaymentDetails/CreatePaymentDetails";
import ViewPaymentDetails from "./Sales/PaymentDetails/ViewPaymentDetails";
import EditPaymentDetails from "./Sales/PaymentDetails/EditPayementDetails";
import OrgTree from "./WFH/OrgTree/OrgTree";

import PaymentModePaymentDetails from "../Finance/Sales Management/PaymentModeFolder/PaymentModePaymentDetails";
import BalanceTransactionList from "../Finance/Sales Management/Outstanding/BalanceTransactionList";
import Overview from "../Finance/Purchase Management/PendingPaymentRequest/Components/Overview";
import IncentiveParent from "../Finance/Sales Management/Incentive/IncentiveParent";
import DeletedSaleBooking from "./Sales/SaleBooking/DeletedSaleBooking";
import RejectedPaymentRequest from "./Sales/PaymentRequest/RejectedPaymentRequest";
import PendingPaymentRequestSales from "./Sales/PaymentRequest/PendingPaymentRequestSales";
import RecordServices from "./Sales/RecordService/RecordServices";
import ReleasedAmountIncentive from "../Finance/ReleasedAmountIncentive";
import RefundPayment from "../Finance/RefundPayment";
import RegisterCampaigns from "./Operation/RegisterCampaigns";
import PendingCreditApproval from "../Finance/CreditApproval/CreditApproval";
import CreditApproval from "../Finance/CreditApproval/CreditApproval";
import ViewPaymentUpdate from "./Sales/PaymentUpdate/ViewPaymentUpdate";
import { FinanceContextComponent } from "../../Context/FinanceContext";
import CreateSalesAccount from "./Sales/Account/CreateSalesAccount";
import SalesAccountOverview from "./Sales/Account/SalesAccountOverview";
import PaymentDoneTransactionList from "../Finance/PaymentDoneTransactionList";
// import PageStats from "./PageMS/PageStats";
// import PaymentDoneTransactionList from "./Finance/PaymentDoneTransactionList";
import PageStats from "./PageMS/PageStats";
import PlanMaking from "../AdminPanel/PageMS/PlanMaking";
import CreateDocumentType from "./Sales/Account/CreateDocumentType";
import DocumentTypeOverview from "./Sales/Account/DocumentTypeOverview";
import PlanOverView from "./Operation/Plan/CampPlanOverview";
import CampPlanOverview from "./Operation/Plan/CampPlanOverview";
import EditPage from "./PageMS/EditPage/EditPage";
import ViewOutstanding from "./Sales/SaleBooking/Outstanding/ViewOutstanding";
import IncentiveDashboard from "./Sales/Incenti Dashboard/IncentiveDashboard";
import NewDocumentCom from "./WFH/NewDocumentCom";
import UserIncentive from "./Sales/Incenti Dashboard/UserIncentive";
import EarnedAndUnearned from "./Sales/Incenti Dashboard/EarnedAndUnearned";
import IncentiveRequest from "./Sales/Incenti Dashboard/IncentiveRequest";
import IncentiveSettlement from "./Sales/Incentive Settlement/IncentiveSettlement";

import ExpenseMangementMaster from "./ExpenseManagement/ExpenseMangementMaster";
import ExpenseOverview from "./ExpenseManagement/ExpenseOverview";
import ExpenseManagementUpdate from "./ExpenseManagement/ExpenseManagementUpdate";
import ViewInvoiceRequest from "./Sales/Invoice/ViewInvoiceRequest";
import AnalyticDashboard from "./WFH/AnalyticDashboard/AnalyticDashboard";
import CommunityManager from "../SuperTracker/CommunityManagement/CommunityManager";
import CommunityPageView from "../SuperTracker/CommunityManagement/CommunityPageView";
import CommunityHome from "../SuperTracker/CommunityManagement/CommunityHome";
import CommunityUser from "../SuperTracker/CommunityManagement/CommunityUser";
import CommunityManagerView from "../SuperTracker/CommunityManagement/CommunityManagerView";
import MeetingPagesOverView from "../SuperTracker/MeetingPages/MeetingPagesOverView";
import OverviewMeetingVia from "../SuperTracker/MeetingPages/OverviewMeetingVia";
import PaymentUpdateBankWise from "./Sales/PaymentUpdate/PaymentUpdateBankWise";
import MajorDepartmentMast from "./Department/MajorDepartment/MajorDepartmentMast";
import MajorDepartmentOverview from "./Department/MajorDepartment/MajorDepartmentOverview";
import MajorDepartmentUpdate from "./Department/MajorDepartment/MajorDepartmentUpdate";

const Admin = () => {
  const [contextData, setData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setData(res.data);
        });
    }
  }, [userID]);

  return (
    <>
      <div id="wrapper">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <div className="page_content">
              <Routes>
                <Route path="/" element={<NavSideBar />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/all-pending-order" element={<PendingOrder />} />
                  <Route path="/transfer-req" element={<TransferReq />} />
                  <Route path="/all-order" element={<AllOrder />} />
                  <Route
                    path="/all-declined-order"
                    element={<DeclinedOrder />}
                  />
                  <Route
                    path="/all-deliverd-order"
                    element={<DeliverdOrder />}
                  />
                  <Route path="/users-dashboard" element={<UserDashboard />} />
                  <Route
                    path="/dashboard_department_wise_user/:id"
                    element={<UserWiseDashboard />}
                  />
                  <Route path="/kra/:id" element={<KRA />} />
                  <Route
                    path="/user-wise-responsibility/:id"
                    element={<UserWiseResponsibility />}
                  />
                  {contextData &&
                    contextData[10] &&
                    contextData[10].view_value === 1 && (
                      <>
                        <Route
                          path="/designation-overview"
                          element={<DesignationOverview />}
                        />
                        <Route
                          path="/designation-update/:desi_id"
                          element={<DesignationUpdate />}
                        />
                      </>
                    )}
                  <Route path="/designation-master" element={<Designation />} />

                  <>
                    {((contextData &&
                      contextData[0] &&
                      contextData[0].view_value === 1) ||
                      (contextData &&
                        contextData[37] &&
                        contextData[37].view_value === 1) ||
                      (contextData &&
                        contextData[38] &&
                        contextData[38].view_value === 1)) && (
                      <Route path="/user" element={<UserMaster />} />
                    )}

                    {/* User Profile Routing Here  */}
                    <Route path="/user-timeline" element={<Timeline />} />

                    {contextData &&
                      contextData[0] &&
                      contextData[0].view_value === 1 && (
                        <>
                          <Route
                            path="/user-overview/:id"
                            element={<UserOverview />}
                          />
                          <Route
                            path="/user-update/:id"
                            element={<UserUpdate />}
                          />
                          <Route path="/user_view/:id" element={<UserView />} />
                          <Route
                            path="/user-auth-detail/:id"
                            element={<UserAuthDetail />}
                          />
                          <Route
                            path="/user-directory"
                            element={<UserDirectory />}
                          />
                          <Route
                            path="/user-hierarchy"
                            element={<UserHierarchy />}
                          />
                          <Route
                            path="/user-single/:id"
                            element={<UserSingle />}
                          />
                          <Route path="/user-graph" element={<UserGraphs />} />
                          <Route
                            path="/email-template"
                            element={<AddEmailTemp />}
                          />
                          <Route
                            path="/email-template-overview"
                            element={<EmailTempOverview />}
                          />
                          <Route
                            path="/email-template-update/:id"
                            element={<EditEmailTemp />}
                          />
                          <Route
                            path="/email-events"
                            element={<EmailEvent />}
                          />
                        </>
                      )}
                  </>

                  {/* Attendence  */}

                  <Route path="/org-tree" element={<OrgTree />} />

                  <Route path="/wfhd-register" element={<WFHDRegister />} />
                  <Route path="/total-NDG" element={<TotalNDG />} />
                  <Route path="/wfhd-update/:id" element={<WFHDUpdate />} />
                  <Route
                    path="/wfhd-new-documentcom/:id"
                    element={<NewDocumentCom />}
                  />

                  <Route
                    path="/salary-dashboard/:id"
                    element={<SalaryDashboard />}
                  />
                  <Route
                    path="/billing-overview"
                    element={<BillingOverview />}
                  />
                  <Route path="/billing-master" element={<BillingMast />} />
                  <Route
                    path="/billing-update/:id"
                    element={<BillingUpdate />}
                  />
                  <Route
                    path="/attendence-overview"
                    element={<AttendanceOverview />}
                  />
                  <Route path="/attendence-mast" element={<Attendence />} />
                  <Route path="/stats" element={<Stats />} />
                  {<Route path="/pageStats/:id" element={<PageStats />} />}
                  {/* Salary */}
                  <Route path="/salaryWFH" element={<SalaryWFH />} />

                  <Route path="/user-summary" element={<UserSummary />} />
                  {/* <Route path="/salaryWFH" element={<SalaryWFH />} /> */}

                  <Route path="/all-salary" element={<WFHAllSalary />} />
                  <Route path="/salary-summary" element={<SalarySummary />} />
                  {/* Accounts/Finance */}
                  <Route
                    path="/accounts-finance-overview"
                    element={<AccountsOverviewWFH />}
                  />
                  <Route
                    path="/accounts-finance-dashboard"
                    element={<FinanceWFHDashboard />}
                  />
                  <Route path="/wfh-single-user" element={<WFHSingleUser />} />
                  <Route
                    path="/wfh-template-overview"
                    element={<WFHTemplateOverview />}
                  />
                  <Route
                    path="hr-template-overview"
                    element={<HRTemplateOverview />}
                  />
                  <Route
                    path="view-edit-digital-signature"
                    element={<ViewEditDigiSignature />}
                  />
                  <Route
                    path="/wfh-user-dashboard"
                    element={<DashboardWFHUser />}
                  />
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
                  <Route
                    path="/wfhd-bank-update/:user_id"
                    element={<WFHDBankUpdate />}
                  />
                  <Route
                    path="/wfh-update-document/:user_id"
                    element={<UpdateDocument />}
                  />
                  {/* DesiDeptAuth Routing  */}
                  <Route
                    path="/desi-dept-auth/:id"
                    element={<DesiDeptAuth />}
                  />
                  <Route
                    path="/dispute-overview"
                    element={<DisputeOverview />}
                  />

                  {/* <Route
                    path="/wfh-user-dashboard"
                    element={<DashboardWFHUser />}
                  />
                  <Route
                    path="/wfh-dashboard-overview/:id"
                    element={<DashboardWFHCardDetails />}
                  /> */}
                  <Route
                    path="/wfh-incomplete-user-overview"
                    element={<IncompleteProfileUsers />}
                  />
                  {contextData &&
                    contextData[1] &&
                    contextData[1].view_value === 1 && (
                      <>
                        <Route
                          path="/user-respons-overivew"
                          element={<UserResposOverview />}
                        />
                        <Route
                          path="/user-responsbility"
                          element={<UserResponsbility />}
                        />
                        <Route
                          path="/user-respons-update"
                          element={<UserResponsbilityUpdate />}
                        />
                      </>
                    )}
                  {contextData &&
                    contextData[2] &&
                    contextData[2].view_value === 1 && (
                      <>
                        <Route
                          path="/object-master"
                          element={<ObjectMaster />}
                        />
                        <Route
                          path="/object-overview"
                          element={<ObjectOverview />}
                        />
                        <Route
                          path="/object-update/:id"
                          element={<ObjectUpdate />}
                        />
                      </>
                    )}
                  {contextData &&
                    contextData[3] &&
                    contextData[3].view_value === 1 && (
                      <>
                        <Route
                          path="/department-overview"
                          element={<DepartmentOverview />}
                        />
                        <Route
                          path="/department-master"
                          element={<DepartmentMaster />}
                        />
                        <Route
                          path="/department-update"
                          element={<DepartmentUpdate />}
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
                    )}
                  {contextData &&
                    contextData[4] &&
                    contextData[4].view_value === 1 && (
                      <>
                        <Route path="/role" element={<RoleMaster />} />
                        <Route
                          path="/role-overview"
                          element={<RoleOverView />}
                        />
                        <Route
                          path="/role-update"
                          element={<RoleMastUpdate />}
                        />
                      </>
                    )}
                  {contextData &&
                    contextData[5] &&
                    contextData[5].view_value === 1 && (
                      <>
                        <Route
                          path="/product-master"
                          element={<ProductMaster />}
                        />
                        <Route
                          path="/product-overview"
                          element={<ProductOverview />}
                        />
                        <Route
                          path="/product-update"
                          element={<ProductUpdate />}
                        />
                      </>
                    )}
                  {/* {contextData &&
                    contextData[5] &&
                    contextData[5].view_value === 1 && ( */}
                  <>
                    <Route
                      path="/asset-dashboard"
                      element={<AssetDashboard />}
                    />
                    <Route path="/asset_summary" element={<AssetSummary />} />

                    <Route path="/self-audit" element={<SelfAudit />} />

                    {/* Asset Section  */}
                    <Route
                      path="/asset-visible-to-hr"
                      element={<AssetVisibleToHr />}
                    />
                    <Route
                      path="/asset-visible-to-taged-person"
                      element={<AssetVisibleToTagedPerosn />}
                    />
                    <Route path="/asset-manager" element={<AssetManager />} />
                    <Route
                      path="/asset-single-user"
                      element={<AssetSingleUser />}
                    />
                    <Route
                      path="/asset-repair-return-summary"
                      element={<RepairRetrunSummary />}
                    />
                    <Route
                      path="/asset-repair-summary"
                      element={<AssetRepairSummary />}
                    />
                    <Route
                      path="/asset-vendor-summary"
                      element={<VendorSummary />}
                    />
                  </>
                  {/* )} */}
                  {contextData &&
                    contextData[6] &&
                    contextData[6].view_value === 1 && (
                      <>
                        <Route path="/office-mast" element={<OfficeMast />} />
                        <Route
                          path="/office-mast-overview"
                          element={<OfficeMastOverview />}
                        />
                        <Route
                          path="/office-mast-update"
                          element={<OfficeMastUpdate />}
                        />
                      </>
                    )}
                  {contextData &&
                    contextData[7] &&
                    contextData[7].view_value === 1 && (
                      <>
                        <Route
                          path="/sitting-master"
                          element={<SittingMaster />}
                        />
                        <Route
                          path="/sitting-overview"
                          element={<SittingOverview />}
                        />
                        <Route
                          path="/sitting-update"
                          element={<SittingUpdate />}
                        />
                      </>
                    )}
                  <Route
                    path="/responsibility-master"
                    element={<ResponsibilityMast />}
                  />
                  <Route
                    path="/responsibility-overview"
                    element={<ResponsiblityOverview />}
                  />
                  <Route
                    path="/responsibility-update/:id"
                    element={<ResponsibilityUpdate />}
                  />
                  <Route
                    path="/logo-category-master"
                    element={<LogoCategoryMaster />}
                  />
                  <Route
                    path="/logo-category-overview"
                    element={<LogoCategoryOverview />}
                  />
                  <Route
                    path="/logo-category-update/:id"
                    element={<LogoCategoryUpdate />}
                  />
                  <Route path="/pantry-home" element={<PantryHome />} />
                  <Route path="/iptype-master" element={<IpTypeMaster />} />
                  <Route path="/iptype-overview" element={<IpTypeOverview />} />
                  <Route path="/iptype-update/:id" element={<IpTypeUpdate />} />
                  <Route path="/platform-master" element={<PlatformMaster />} />
                  <Route
                    path="/platform-overview"
                    element={<PlatformOverview />}
                  />
                  <Route
                    path="/platform-update/:id"
                    element={<PlatformUpdate />}
                  />
                  <Route
                    path="/pre-onboarding"
                    element={<AdminPreOnboarding />}
                  />
                  <Route
                    path="/pre-onboard-extend-date-overview"
                    element={<OnboardExtendDateOverview />}
                  />
                  <Route
                    path="/pre-onboard-coc-master"
                    element={<CocMaster />}
                  />
                  <Route
                    path="/pre-onboard-coc-overview"
                    element={<CocOverview />}
                  />
                  <Route
                    path="/pre-onboard-all-notifications"
                    element={<NotificationHistory />}
                  />
                  <Route
                    path="/finance-alltransactions"
                    element={<AllTransactions />}
                  />
                  <Route
                    path="/finance-approveinvoice"
                    element={<ApprovalInvoice />}
                  />
                  <Route
                    path="/finance-balancepayment"
                    element={<BalancePaymentList />}
                  />
                  <Route
                    path="/finance-transaction-list/:sale_booking_id"
                    element={<BalanceTransactionList />}
                  />
                  <Route
                    path="/finance-incentivepayment"
                    element={<IncentivePayment />}
                  />
                  <Route
                    path="/finance-paymentmode"
                    element={<PaymentMode />}
                  />
                  <Route path="/payment-TDS_deduct" element={<TDSdeduct />} />
                  <Route path="/payment-GST_hold" element={<GSThold />} />
                  <Route
                    path="/finance-pendingapproverefund"
                    element={<PendingApprovalRefund />}
                  />
                  <Route
                    path="/finance-refundpayment"
                    element={<RefundPayment />}
                  />
                  <Route
                    path="/finance-pendingapproveupdate"
                    element={<PendingApprovalsUpdate />}
                  />
                  <Route
                    path="/finance-pendinginvoice"
                    element={<PendingInvoice />}
                  />
                  <Route path="/finance-invoice" element={<Invoice />} />
                  <Route
                    path="/finance-pendinginvoice/customer-details/:id"
                    element={<PendingInvoiceCustomerDeatils />}
                  />
                  <Route
                    path="/finance-createdinvoice"
                    element={<InvoiceCreated />}
                  />
                  <Route
                    path="/finance-pendingpaymentslist"
                    element={<PendingPaymentsList />}
                  />
                  <Route
                    path="/finance-pendingrequests"
                    element={<RefundRequests />}
                  />
                  <Route
                    path="/finance-salebooking"
                    element={<SaleBooking />}
                  />
                  {/* <Route
                    path="/finance-salebookingclose"
                    element={<SaleBookingClose />}
                  />
                  <Route
                    path="/finance-salebookingverify"
                    element={<SaleBookingVerify />}
                  /> */}
                  <Route
                    path="/finance-pruchasemanagement-pendingpaymentrequest"
                    element={<PendingPaymentRequest />}
                  />
                  <Route path="/finance-overview" element={<Overview />} />
                  <Route
                    path="/payment-mode-master"
                    element={<PaymentModeMast />}
                  />
                  <Route
                    path="/finance-payment-mode-transactionlist/:id"
                    element={<PaymentModeTransactionList />}
                  />
                  <Route
                    path="/finance-pruchasemanagement-paymentdone"
                    element={<PaymentDone />}
                  />
                  <Route
                    path="/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
                    element={<PaymentDoneTransactionList />}
                  />
                  <Route
                    path="/finance-dashboard"
                    element={<FinanceDashboard />}
                  />
                  <Route
                    path="/Incentive-Request-Released-List/:incentive_request_id"
                    element={<SalesExecutiveIncentiveRequestReleaseList />}
                  />
                  <Route
                    path="/Incentive-balance-Released/:incentive_request_id"
                    element={<ReleasedAmountIncentive />}
                  />
                  <Route
                    path="/Incentive-Payment-Mode-Payment-Details"
                    element={<PaymentModePaymentDetails />}
                  />
                  <Route
                    path="/finance-pruchasemanagement-alltransaction"
                    element={<PurchaseManagementAllTransaction />}
                  />
                  <Route
                    path="/finance-pruchasemanagement-discardpayment"
                    element={<Discard />}
                  />
                  {/* task components */}
                  <Route
                    path="/finance-task-pending"
                    element={<TaskPending />}
                  />
                  <Route path="/finance-task-done/:id" element={<TaskDone />} />
                  {/*  ==============*/}
                  {/* GST Nongst Incentive Report */}
                  <Route
                    path="/finance-gst-nongst-incentive-report"
                    element={<GstNongstIncentiveReport />}
                  />
                  <Route
                    path="/finance-incentive-parent"
                    element={<IncentiveParent />}
                  />
                  {/* ========================== */}
                  <Route
                    path="/payment-summary/:id"
                    element={<PaymentSummary />}
                  />
                  <Route
                    path="/pre-onboard-coc-update/:id"
                    element={<CocUpdate />}
                  />
                  <Route
                    path="/pre-onboard-coc-history/:id"
                    element={<CocHistory />}
                  />
                  <Route
                    path="/pre-onboard-user-login-history"
                    element={<LoginHistory />}
                  />
                  <Route
                    path="/only-pre-onboard-user-data"
                    element={<PreOnboardVerifyDetails />}
                  />
                  <Route
                    path="/pre-onboarding-overview"
                    element={<PreOnboardingOverview />}
                  />
                  <Route
                    path="/preOnboard-user-details-profile/:id"
                    element={<PreOnboardUserDetailsProfile />}
                  />
                  <Route
                    path="/preonboarding-documents"
                    element={<PreonboardingDocuments />}
                  />
                  <Route
                    path="/preonboarding-documents-overview"
                    element={<PreonboardingDocumentOverview />}
                  />
                  <Route
                    path="/preonboarding-documents-update/:id"
                    element={<PreonboardingDocumentsUpdate />}
                  />
                  <Route
                    path="/announcement-post"
                    element={<AnnouncementPost />}
                  />
                  <Route
                    path="/announcement-view"
                    element={<AnnouncementView />}
                  />
                  <Route path="/reason" element={<Reason />} />
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
                    path="/operation-campaigns"
                    element={<OperationCampaigns />}
                  />
                  <Route
                    path="/operation-dashboards"
                    element={<OperationDashboards />}
                  />
                  <Route
                    path="/operation-contents"
                    element={<OperationContents />}
                  />
                  <Route
                    path="/register-campaign"
                    element={<RegisterCampaign />}
                  />
                  <Route path="/create-plan" element={<CreatePlan />} />
                  {/* HOBBIES */}
                  <Route path="/hobbies/:id" element={<Hobbies />} />
                  <Route
                    path="hobbies-overview"
                    element={<HobbiesOverview />}
                  />
                  {/* ----------------------Case Studies -----------------------------*/}
                  <Route
                    path="/operation/case-study"
                    element={<CaseStudyOperation />}
                  />

                  {/* Phase Dashboard here  */}
                  <Route path="/phase-dashboard" element={<PhaseDashboard />} />
                  <Route path="/direct_allPlan" element={<AllPlanData />} />
                  <Route
                    path="/all-planoverview/:id"
                    element={<AllPlanOverview />}
                  />

                  <Route
                    path="/plan-dashboard/:id"
                    element={<PlanDashboard />}
                  />
                  <Route
                    path="/replacement-dashboard"
                    element={<ReplacementDashobard />}
                  />
                  <Route
                    path="/operationDashboard"
                    element={<OperationDashboard />}
                  />
                  <Route
                    path="/assignment-dashboard"
                    element={<AssignmentDashobard />}
                  />
                  <Route
                    path="/manager-dashboard/:id"
                    element={<ManagerDashboard />}
                  />
                  <Route
                    path="/manager-campaign"
                    element={<ManagerCampaign />}
                  />
                  <Route path="/experties" element={<Experties />} />
                  <Route
                    path="/experties-overview"
                    element={<ExpertiesOverview />}
                  />
                  <Route
                    path="/expeties-update/:id"
                    element={<NewExpertUpdate />}
                  />
                  <Route
                    path="/registered-campaign"
                    element={<RegisteredCampaign />}
                  />
                  <Route path="/campaign-admin" element={<CampignAdmin />} />
                  <Route
                    path="/createrdashboard"
                    element={<CreaterDashboard />}
                  />
                  <Route path="/planOverview/:id" element={<PlanOverview />} />
                  <Route path="/phase/:id" element={<PhasecreationNew />} />
                  <Route
                    path="/planCreation/:id"
                    element={<PlancreationNew />}
                  />
                  <Route path="/tempExcel" element={<NewExcelFile />} />
                  {/* <Route path="/phase/:id" element={<PhaseCreation />} /> */}
                  <Route
                    path="/planCreation/:id"
                    element={<PlancreationNew />}
                  />
                  <Route
                    path="/tempplanCreation/:id"
                    element={<TempPlanCreation />}
                  />
                  <Route path="/createAssign/:id" element={<CreateAssign />} />
                  <Route
                    path="/checkPageFollowers"
                    element={<CheckPageFollowers />}
                  />
                  <Route path="/brandmaster" element={<BrandMaster />} />
                  <Route path="/agency" element={<CreateAgency />} />
                  <Route path="/goal" element={<CreateGoal />} />
                  <Route path="/industry" element={<CreateIndustry />} />
                  <Route path="/service" element={<CreateService />} />
                  <Route path="/overview/agency" element={<AgencyOverview />} />
                  <Route path="/overview/goal" element={<GoalOverview />} />
                  <Route
                    path="/overview/industry"
                    element={<IndustryOverview />}
                  />
                  <Route
                    path="/overview/service"
                    element={<ServicesOverview />}
                  />
                  <Route path="/contenttype" element={<ContentType />} />
                  <Route
                    path="/campaigncommitment"
                    element={<CampaignCommitment />}
                  />
                  <Route path="/categorymaster" element={<CategoryMaster />} />
                  <Route path="/subcategory" element={<SubCategoryMaster />} />
                  <Route path="/contentcreater" element={<ContentCreater />} />
                  <Route
                    path="/excusionCampaign"
                    element={<ExcusionCampaign />}
                  />
                  <Route path="/tempexcusion" element={<TempExecution />} />
                  {/* ----------------------lead source routes -----------------------------*/}
                  <Route
                    path="/exploreleads"
                    element={
                      <LeadApp>
                        <LeadHome />{" "}
                      </LeadApp>
                    }
                  />
                  <Route
                    path="/newlead"
                    element={
                      <LeadApp>
                        <LeadManagement />
                      </LeadApp>
                    }
                  />
                  <Route
                    path="/updatelead"
                    element={
                      <LeadApp>
                        <EditLead />
                      </LeadApp>
                    }
                  />
                  <Route
                    path="/:id"
                    element={
                      <LeadApp>
                        <SELeadTable />
                      </LeadApp>
                    }
                  />
                  {/* ------------------------Job Type ----------------------------- */}
                  <Route path="/jobType" element={<JobTypeMaster />} />
                  {/*------------------------ Execution --------------------------------*/}
                  <Route path="/cityMsater" element={<CityMaster />} />
                  <Route
                    path="/exeexecution/dashboard"
                    element={<ExecutionDashboard />}
                  />
                  <Route
                    path="/exeexecution/PagePerformanceDashboard"
                    element={<PagePerformanceDashboard />}
                  />
                  <Route
                    path="/exeexecution/PagePerformanceAnalytics"
                    element={<PagePerformanceAnalytics />}
                  />
                  <Route path="/exe-update/:id" element={<ExeUPdate />} />
                  <Route path="/exe-history/:id" element={<ExeHistory />} />
                  <Route path="/execution" element={<OverviewIndex />} />
                  <Route path="/exeexecution/all" element={<ExecutionAll />} />
                  <Route
                    path="/exeexecution/allpagesdetail"
                    element={<StatsAllPagesDetail />}
                  />
                  <Route path="/exeexecution/own" element={<ExecutionOwn />} />
                  <Route
                    path="/exeexecution/other"
                    element={<ExecutionOther />}
                  />
                  <Route
                    path="/exeexecution/pending"
                    element={
                      <ExecutionPending />

                      // </LeadApp>
                    }
                  />
                  <Route
                    path="/exeexecution/done"
                    element={<ExecutionDone />}
                  />
                  <Route
                    path="/exeexecution/accepted"
                    element={<ExecutionAccepted />}
                  />
                  <Route
                    path="/exeexecution/rejected"
                    element={<ExecutionRejected />}
                  />
                  <Route
                    path="/exeinventory"
                    element={
                      <ExecutionInventory />

                      // </LeadApp>
                    }
                  />
                  <Route
                    path="/exeexecution/:id"
                    element={<ExecutionDetail />}
                  />
                  {/* -------------------Insta Api--------------------------- */}
                  {/* <Route
                    path="/instaapi"
                    element={
                      <InstaApiContext>
                        <InstaAPIHome />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/:creatorName"
                    element={
                      <InstaApiContext>
                        <InstaPageDashboard />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/all/:creatorName"
                    element={
                      <InstaApiContext>
                        <AdminPageView />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/interpretor/:creatorName"
                    element={
                      <InstaApiContext>
                        <InterpretorContext>
                          <InterpretorPageDashboard />
                        </InterpretorContext>
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/auditor/:creatorName"
                    element={
                      <InstaApiContext>
                        <AuditorPageView />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/all/:creatorName/:shortCode"
                    element={
                      <InstaApiContext>
                        <AdminPostView />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/:creatorName/:shortCode"
                    element={
                      <InstaApiContext>
                        <InstaPostDashboard />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/:creatorName/track/:shortCode"
                    element={
                      <InstaApiContext>
                        <CronExpression />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/analytics/:creatorName"
                    element={
                      <InstaApiContext>
                        <InstaPageDetail />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/analytic"
                    element={
                      <InstaApiContext>
                        <AnalyticsDashboard />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/track"
                    element={
                      <InstaApiContext>
                        <AuditorTrack />
                      </InstaApiContext>
                    }
                  />
                  <Route
                    path="/instaapi/interpretor/:creatorName/:shortCode"
                    element={
                      <InstaApiContext>
                        <InterpretorContext>
                          <InterpretorPostDashboard />
                        </InterpretorContext>
                      </InstaApiContext>
                    }
                  />

                  <Route
                    path="/instaapi/interpretor/:creatorName/post"
                    element={
                      <InstaApiContext>
                        <InterpretorContext>
                          <InterpretorPostDashboard />
                        </InterpretorContext>
                      </InstaApiContext>
                    }
                  /> */}

                  {/* TASK MANAGEMENT */}

                  <Route
                    path="/task-status-dept-wise-master"
                    element={<TaskStatusDeptWiseMaster />}
                  />
                  <Route
                    path="/task-status-dept-wise-overview"
                    element={<TaskStatusDeptWiseOverview />}
                  />
                  <Route
                    path="/task-status-update-dept-wise/:id"
                    element={<TaskStatusDeptWiseUpdate />}
                  />
                  {/* TASK MANAGEMENT */}

                  <Route path="/account-type" element={<AccountType />} />
                  <Route path="/account-master" element={<AccountMaster />} />
                  <Route
                    path="/ownership-master"
                    element={<OwnershipMaster />}
                  />
                  <Route
                    path="/ops-customer-mast"
                    element={<OpsCustomerMast />}
                  />
                  <Route
                    path="/ops-customer-overview"
                    element={<OpsCustomerOverview />}
                  />
                  <Route
                    path="/ops-customer-update/:id"
                    element={<OpsCustomerUpdate />}
                  />
                  <Route
                    path="/customer-cont-overview"
                    element={<CustomerContOverview />}
                  />
                  <Route
                    path="/customer-cont-master"
                    element={<CustomerContMaster />}
                  />
                  <Route
                    path="/customer-cont-update/:id"
                    element={<CustomerContUpdate />}
                  />
                  <Route path="/ops-doc-mast" element={<OpsDocMast />} />
                  <Route
                    path="/customer-document-master"
                    element={<CustomerDocumentMaster />}
                  />
                  <Route
                    path="/customer-contact-details/:customer_id"
                    element={<CustomerContactDetails />}
                  />
                  <Route
                    path="/customer-document-overview"
                    element={<CustomerDocumentOverview />}
                  />
                  <Route
                    path="/customer-document-update/:id"
                    element={<CustomerDocumentUpdate />}
                  />
                  <Route
                    path="/customer-document-master"
                    element={<CustomerDocumentMaster />}
                  />
                  <Route
                    path="/customer-document-details/:customer_id"
                    element={<CustomerDocumentDetails />}
                  />

                  <Route path="/pms-vendor-type" element={<VendorType />} />
                  <Route path="/pms-page-category" element={<PageCategory />} />
                  <Route path="/pms-profile-type" element={<ProfileType />} />
                  <Route
                    path="/pms-page-ownership"
                    element={<PageOwnership />}
                  />
                  <Route path="/pms-platform" element={<PmsPlatform />} />
                  <Route path="/pms-pay-method" element={<PayMethod />} />
                  <Route path="/pms-pay-cycle" element={<PayCycle />} />
                  <Route
                    path="/pms-group-link-type"
                    element={<GroupLinkType />}
                  />
                  {/* <Route
                    path="/pms-vendor-edit/:_id"
                    element={<VendorEdit />}
                  /> */}
                  <Route path="/pms-vendor-master" element={<VendorMaster />} />
                  <Route path="/pms-plan-making" element={<PlanMaking />} />
                  <Route
                    path="/pms-vendor-master/:_id"
                    element={<VendorMaster />}
                  />
                  <Route
                    path="/pms-vendor-overview"
                    element={<VendorOverview />}
                  />
                  <Route
                    path="/pms-price-type"
                    element={<PMSpriceTypeMast />}
                  />
                  <Route
                    path="/pms-platform-price-type"
                    element={<PMSplatformPriceTypeMast />}
                  />
                  <Route
                    path="/pms-vendor-group-link"
                    element={<VendorGroupLink />}
                  />
                  <Route
                    path="/pms-vendor-group-link/:vendorMast_name"
                    element={<VendorGroupLink />}
                  />
                  <Route
                    path="/pms-vendor-group-link/:vendorMast_name"
                    element={<VendorGroupLink />}
                  />
                  <Route path="/pms-page-master" element={<PageMaster />} />
                  <Route path="/pms-page-overview" element={<PageOverview />} />
                  <Route
                    path="/pms-purchase-price/:id"
                    element={<PurchasePrice />}
                  />
                  <Route
                    path="/pms-page-edit/:pageMast_id"
                    element={<PageEdit />}
                  />
                  {/* <Route
                    path="/pms-page-edit/:pageMast_id"
                    element={<EditPage />}
                  /> */}
                  <Route
                    path="/pms-vendor-page-price-overview"
                    element={<VendorPagePriceOverview />}
                  />
                  <Route
                    path="/pms-vendor-page-price-master"
                    element={<VendorPagePriceMaster />}
                  />
                  <Route
                    path="/pms-vendor-page-price-master/:vendorMast_name"
                    element={<VendorPagePriceMaster />}
                  />
                  <Route
                    path="/pms-vendor-page-price-master/:vendorMast_name"
                    element={<VendorPagePriceMaster />}
                  />
                  <Route
                    path="/pms-vendor-page-price-master/:id"
                    element={<EditVendorPagePrice />}
                  />
                  <Route path="/pms-master" element={<PMSmaster />} />

                  {/* Sales Module Routing here start-------------------  */}

                  <Route path="/sales-dashboard" element={<SalesDashboard />} />
                  <Route
                    path="/create-sales-services/:id/:method"
                    element={<SalesServicesCreate />}
                  />
                  <Route
                    path="/create-sales-services"
                    element={<SalesServicesCreate />}
                  />
                  <Route
                    path="/update-sales-services/:id/:post"
                    element={<SalesServicesUpdate />}
                  />
                  <Route
                    path="/sales-services-overview"
                    element={<SalesServicesOverview />}
                  />

                  {/* Sales  harshal start*/}
                  <Route
                    path="/create-credit-reason-approval"
                    element={<CreditApprovalReasonCreate />}
                  />
                  <Route
                    path="/view-credit-reason-approval"
                    element={<CreditApprovalReasonView />}
                  />
                  <Route
                    path="/user-incenitve"
                    element={<IncentiveRequest />}
                  />
                  <Route
                    path="/sales-incentive-settlement-overview"
                    element={<IncentiveSettlement />}
                  />
                  <Route
                    path="/update-credit-reason-approval/:id"
                    element={<CreditApprovalReasonUpdate />}
                  />
                  <Route
                    path="/create-sales-booking/:editId/:un_id"
                    element={<CreateSaleBooking />}
                  />
                  <Route
                    path="/create-sales-booking"
                    element={<CreateSaleBooking />}
                  />
                  <Route
                    path="/view-sales-booking"
                    element={<ViewSaleBooking />}
                  />
                  <Route
                    path="/sales-user-incentve"
                    element={<UserIncentive />}
                  />
                  <Route
                    path="/create-payment-mode"
                    element={<CreatePaymentMode />}
                  />
                  <Route
                    path="/incentive-status/:id"
                    element={<EarnedAndUnearned />}
                  />
                  <Route
                    path="/view-payment-mode"
                    element={<ViewPaymentMode />}
                  />
                  <Route
                    path="/edit-payment-mode/:id"
                    element={<EditPaymentMode />}
                  />
                  <Route
                    path="/create-payment-details"
                    element={<CreatePaymentDetails />}
                  />
                  <Route
                    path="/view-payment-details"
                    element={<ViewPaymentDetails />}
                  />
                  <Route
                    path="/view-Outstanding-details"
                    element={<ViewOutstanding />}
                  />
                  <Route
                    path="/edit-payment-details/:id"
                    element={<EditPaymentDetails />}
                  />

                  <Route
                    path="/create-payment-update/:id"
                    element={<CreatePaymentUpdate />}
                  />
                  <Route
                    path="/view-payment-update"
                    element={<ViewPaymentUpdate />}
                  />
                  <Route
                    path="/payment-update-bank-wise/:id"
                    element={<PaymentUpdateBankWise />}
                  />
                  <Route
                    path="/view-invoice-request"
                    element={<ViewInvoiceRequest />}
                  />

                  <Route
                    path="/deleted-sales-booking"
                    element={<DeletedSaleBooking />}
                  />
                  <Route
                    path="/pending-payment-request-sales"
                    element={<PendingPaymentRequestSales />}
                  />

                  <Route
                    path="/rejected-payment-request-sales"
                    element={<RejectedPaymentRequest />}
                  />

                  <Route path="/record-servcies" element={<RecordServices />} />

                  <Route path="/credit-approval" element={<CreditApproval />} />
                  <Route
                    path="/create-sales-account/:id"
                    element={<CreateSalesAccount />}
                  />

                  <Route
                    path="/sales-account-overview"
                    element={<SalesAccountOverview />}
                  />

                  <Route
                    path="/sales-document-type-master"
                    element={<CreateDocumentType />}
                  />
                  <Route
                    path="/sales-document-type-overview"
                    element={<DocumentTypeOverview />}
                  />
                  <Route
                    path="/sales-incentive-dashboard"
                    element={<IncentiveDashboard />}
                  />

                  {/* Sales Harshal end */}
                  <Route
                    path="/sales-incentive-create"
                    element={<IncentiveCreate />}
                  />
                  <Route
                    path="/sales-incentive-overview"
                    element={<IncentiveOverview />}
                  />
                  <Route
                    path="/sales-incentive-update/:id"
                    element={<IncentiveUpdate />}
                  />
                  {/* Expense Routing here  */}
                  <Route
                    path="/expense-Overview"
                    element={<ExpenseOverview />}
                  />
                  <Route
                    path="/create-expenseMangementMaster"
                    element={<ExpenseMangementMaster />}
                  />
                  <Route
                    path="/update-expense/:id"
                    element={<ExpenseManagementUpdate />}
                  />

                  {/* //exe operation */}
                  <Route
                    path="/exeoperation/master"
                    element={<OperationMasters />}
                  />
                  <Route
                    path="/op-register-campaign"
                    element={<RegisterCampaigns />}
                  />
                  <Route
                    path="/op-registered-campaign"
                    element={<RegisteredCampaigns />}
                  />
                  <Route
                    path="/op-plan-creation/:id"
                    element={<PlanCreation />}
                  />

                  <Route
                    path="/op-phase-creation/:id"
                    element={<PhaseCreation />}
                  />
                  <Route
                    path="/op-campaign-executions"
                    element={<CampaignExecutions />}
                  />

                  {/* new pla over view  */}
                  <Route
                    path="/op-plan-overview/:id"
                    element={<CampPlanOverview />}
                  />

                  {/* Community Management */}

                  {contextData &&
                    contextData[25] &&
                    contextData[25].view_value === 1 && (
                      <>
                        <Route
                          path="/instaapi/community"
                          element={<CommunityHome />}
                        />
                        <Route
                          path="/instaapi/community/manager"
                          element={<CommunityManager />}
                        />

                        <Route
                          path="/instaapi/community/manager/:creatorName"
                          element={<CommunityPageView />}
                        />
                        <Route
                          path="/instaapi/community/user"
                          element={<CommunityUser />}
                        />
                        <Route
                          path="/instaapi/community/managerView"
                          element={<CommunityManagerView />}
                        />
                        <Route
                          path="/instaapi/community/meetingPage"
                          element={<MeetingPagesOverView />}
                        />
                        <Route
                          path="/instaapi/community/overviewMeetingVia"
                          element={<OverviewMeetingVia />}
                        />
                      </>
                    )}
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Admin;
