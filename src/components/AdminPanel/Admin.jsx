import jwtDecode from "jwt-decode";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "../Finance/Loader/Loader";
import CategoryWisePagesHistoey from "../SuperTracker/CommunityManagement/CategoryWisePagesHistoey";
import Profile from "./HRMS/Pantry/UserPanel/Profile/Profile";
import PostStats from "../Stats/PostStats";
import BulkVendor from "./PageMS/Vendor/BulkVendor/BulkVendor";
import InventoryDashboard from "./PageMS/InventoryDashboard/InventoryDashboard";
import CategoryOverview from "./PageMS/Category/CategoryOverview";

import SubCategoryOverview from "./PageMS/SubCategory/SubCategoryOverview";
import OutstandingPaymentReceiveReport from "../Finance/Sales Management/PaymentReleaseReport/OutstandingPaymentReceiveReport";
import AllVendorWiseList from "./PageMS/Vendor/BulkVendor/AllVendorWiseList";
import ErrorPage from "../../ErrorPage";
import MonthWiseSalesView from "./Sales/SaleBooking/MonthWiseSalesView";
import TagCategory from "./PageMS/InventoryDashboard/TagCategory";
import PlanRequest from "../Finance/Sales Management/PlanRequest/PlanRequest";
import CalenderCreation from "../Operation/Calender/CalenderCreation";
import PurchaseTransactions from "../Purchase/PurchaseTransactions";
import PlanPricingHome from "../inventory/plan-pricing/PlanPricingHome";
import NewCampaignExecutions from "../AbOpreation/NewCampaignExecutions";
import OpCalender from "../AbOpreation/Calender/OpCalender";
import VendorOutstandingOverview from "../Purchase/PurchaseVendor/VendorOutstandingOverview";
import OperationShortcodeUpdater from "../AbOpreation/OperationShortcodeUpdater";
import CampaignExecution from "../Operation/Execution/CampaignExecution";
import UnfetchedPages from "../inventory/plan-pricing/UnFetchPages";
import SittingRoomWise from "./HRMS/Sitting/SittingRoomWise";
// import UserLoginHistory from "./User/UserDashboard/LoginHistory/UserLoginHistory";
import UserLoginHistory from "./HRMS/User/UserDashboard/LoginHistory/UserLoginHistory";

import CommonRoom from "./HRMS/Sitting/CommonRoom";
import { useAPIGlobalContext } from "./APIContext/APIContext";
import OperationDashboard from "../UnusedCode/UnusedOp/OperationDashboard/OperationDashboard";
// import OperationDashboard from "../UnusedCode/Plan/OperationDashboard/OperationDashboard";
import Ledger from "../Purchase/PurchaseVendor/Ledger";
import HomePantry from "../NewPantry/HomePantry";
import PantryUserDashboard from "../Pantry/PantryUserDashboard";
const IncentiveStatements = lazy(() =>
  import("./Sales/Incenti Dashboard/IncentiveStatements")
);
const PurchaseDashboard = lazy(() => import("../Purchase/Dashboard"));

const PurchaseReport = lazy(() => import("../Purchase/purchase-report/PurchaseReport"))

const SalesProductCU = lazy(() => import("./Sales/Product/SalesProductCU"));
const SalesProductOverview = lazy(() =>
  import("./Sales/Product/SalesProductOverview")
);
const ViewSalesPoc = lazy(() => import("../AdminPanel/Sales/ViewSalesPoc"));
const NavSideBar = lazy(() => import("./Navbar-Sidebar/NavSideBar"));
const UserMaster = lazy(() => import("./HRMS/User/UserMaster"));
const UserView = lazy(() => import("./HRMS/User/UserView"));

const UserUpdate = lazy(() => import("./HRMS/User/UserUpdate"));

const UserOverview = lazy(() => import("./HRMS/User/UserOverview"));
const RoleMaster = lazy(() => import("./HRMS/Role/RoleMaster"));
const RoleOverView = lazy(() => import("./HRMS/Role/RoleOverview"));
const RoleMastUpdate = lazy(() => import("./HRMS/Role/RoleMastUpdate"));
const DepartmentOverview = lazy(() =>
  import("./HRMS/Department/DepartmentOverview")
);
const DepartmentMaster = lazy(() =>
  import("./HRMS/Department/DepartmentMaster")
);
const DepartmentUpdate = lazy(() =>
  import("./HRMS/Department/DepartmentUpdate")
);
const ProductMaster = lazy(() => import("./Product/ProductMaster"));
const ProductOverview = lazy(() => import("./Product/ProductOverview"));
const ProductUpdate = lazy(() => import("./Product/ProductUpdate"));
const SittingOverview = lazy(() => import("./HRMS/Sitting/SittingOverview"));
const OfficeMastOverview = lazy(() =>
  import("./HRMS/Sitting/OfficeMastOverview")
);
const UserResposOverview = lazy(() =>
  import("./HRMS/UserResponsbility/UserResposOverview")
);
const UserResponsbility = lazy(() =>
  import("./HRMS/UserResponsbility/UserResponsbility")
);
const UserResponsbilityUpdate = lazy(() =>
  import("./HRMS/UserResponsbility/userResponsbilityUpdate")
);
const UserAuthDetail = lazy(() =>
  import("./HRMS/UserAuthDetail/UserAuthDetail")
);

const ObjectMaster = lazy(() => import("./Object/ObjectMaster"));
const ObjectOverview = lazy(() => import("./Object/ObjectOverview"));
const ObjectUpdate = lazy(() => import("./Object/ObjectUpdate"));

const DeliverdOrder = lazy(() =>
  import("./HRMS/Pantry/DeliverdOrder/DeliverdOrder")
);
const PendingOrder = lazy(() =>
  import("./HRMS/Pantry/PendingOrder/PendingOrder")
);
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const TransferReq = lazy(() => import("./HRMS/Pantry/TransferReq/TransferReq"));
const AllOrder = lazy(() => import("./HRMS/Pantry/AllOrders/AllOrders"));
const DesignationOverview = lazy(() =>
  import("./HRMS/Designation/DesignationOverview")
);
const Designation = lazy(() => import("./HRMS/Designation/Designation"));
const DesignationUpdate = lazy(() =>
  import("./HRMS/Designation/DesignationUpdate")
);
const LogoCategoryMaster = lazy(() =>
  import("./LogoCategory/LogoCategoryMaster")
);
const LogoCategoryOverview = lazy(() =>
  import("./LogoCategory/LogoCategoryOverview")
);
const LogoCategoryUpdate = lazy(() =>
  import("./LogoCategory/LogoCategoryUpdate")
);
const PantryHome = lazy(() => import("./HRMS/Pantry/PantryHome/PantryHome"));
const ResponsibilityMast = lazy(() =>
  import("./HRMS/UserResponsbility/Responsbility/ResponsibilityMast")
);
const ResponsiblityOverview = lazy(() =>
  import("./HRMS/UserResponsbility/Responsbility/ResponsiblityOverview")
);
const ResponsibilityUpdate = lazy(() =>
  import("./HRMS/UserResponsbility/Responsbility/ResponsibilityUpdate")
);
const IpTypeMaster = lazy(() => import("./IpType/IpTypeMaster"));
const IpTypeOverview = lazy(() => import("./IpType/IpTypeOverview"));
const IpTypeUpdate = lazy(() => import("./IpType/IpTypeUpdate"));
const PlatformMaster = lazy(() => import("./Platform/PlatformMaster"));
const PlatformOverview = lazy(() => import("./Platform/PlatformOverview"));
const PlatformUpdate = lazy(() => import("./Platform/PlatformUpdate"));
const DeclinedOrder = lazy(() =>
  import("./HRMS/Pantry/DeclinedOrder/DeclinedOrder")
);
const UserDirectory = lazy(() => import("./HRMS/User/UserDirectory"));
const AdminPreOnboarding = lazy(() =>
  import("./AdminPreOnboarding/AdminPreOnboarding")
);
const Attendence = lazy(() => import("./WFH/Attendence"));
const AttendanceOverview = lazy(() => import("./WFH/AttendanceOverview"));
const UserDashboard = lazy(() => import("./HRMS/User/UserDashboard"));

const KRA = lazy(() => import("./HRMS/KRA/KRA"));
const UserWiseResponsibility = lazy(() =>
  import(
    "./HRMS/UserResponsbility/UserWiseResponsibility/UserWiseResponsibility"
  )
);
const UserWiseDashboard = lazy(() =>
  import("./HRMS/User/UserWIseDashboard/UserWiseDashboard")
);
const SalaryWFH = lazy(() => import("./WFH/SalaryGeneration/SalaryWFH"));
const SalarySummary = lazy(() => import("./WFH/SalarySummary/SalarySummary"));
const UserHierarchy = lazy(() => import("./HRMS/User/UserHierarchy"));
const UserSingle = lazy(() => import("./HRMS/User/UserSingle"));

const DashboardWFHUser = lazy(() => import("./WFH/DashboardWFHUser"));
const DashboardWFHCardDetails = lazy(() =>
  import("./WFH/DashboardWFHCardDetails")
);
const WFHDOverview = lazy(() => import("./WFH/WFHDOverview"));
const LeadApp = lazy(() => import("../LeadManagement/LeadApp"));
const LeadManagement = lazy(() => import("../LeadManagement/LeadManagement"));
const EditLead = lazy(() => import("../LeadManagement/EditLead"));
const LeadHome = lazy(() => import("../LeadManagement/LeadHome"));
const SELeadTable = lazy(() => import("../LeadManagement/SELeadTable"));
const Reason = lazy(() => import("./HRMS/Reason/Reason"));
const SubDepartmentMaster = lazy(() =>
  import("./HRMS/Department/SubDepartmentMaster")
);
const SubDepartmentOverview = lazy(() =>
  import("./HRMS/Department/SubDepartmentOverview")
);
const SubDepartmentUpdate = lazy(() =>
  import("./HRMS/Department/SubDepartmentUpdate")
);
const ExecutionInventory = lazy(() =>
  import("../Execution/ExecutionInventory")
);
const ExecutionPending = lazy(() => import("../Execution/ExecutionPending"));
const OverviewIndex = lazy(() => import("../Execution/overview/OverviewIndex"));
const ExecutionDetail = lazy(() => import("../Execution/ExecutionDetail"));
const PreOnboardVerifyDetails = lazy(() =>
  import("./AdminPreOnboarding/PreOnboardVerifyDetails")
);
const PreOnboardUserDetailsProfile = lazy(() =>
  import("./AdminPreOnboarding/PreOnboardUserDetailsProfile")
);
const PreOnboardingOverview = lazy(() =>
  import("./AdminPreOnboarding/PreOnboardOverview")
);
const OnboardExtendDateOverview = lazy(() =>
  import("./AdminPreOnboarding/OnboardExtendDateOverview")
);
const ExecutionDone = lazy(() => import("../Execution/Done/ExecutionDone"));
const ExecutionAccepted = lazy(() =>
  import("../Execution/Accepted/ExecutionAccepted")
);
// const RegisterCampaign = lazy(() =>
//   import("./RegisterCampaign/RegisterCampaign")
// );
const ExecutionRejected = lazy(() =>
  import("../Execution/Rejected/ExecutionRejected")
);
// const RegisteredCampaign = lazy(() =>
//   import("./RegisterCampaign/RegisteredCampaign")
// );
const SalaryDashboard = lazy(() =>
  import("./WFH/SalaryGeneration/SalaryDashboard")
);
const CampignAdmin = lazy(() => import("./CampaginAdmin/CampignAdmin"));
// const BrandMaster = lazy(() => import("./RegisterCampaign/BrandMaster"));
/* Sarcasm start*/
const SarcasmDashboard = lazy(() => import("../sarcasm/content-from/index"));
const SarcasmBlog = lazy(() => import("../sarcasm/blog-managment/index"));
const BlogDetail = lazy(() =>
  import("../sarcasm/blog-managment/blog-detail/index")
);
const SarcasmCategory = lazy(() =>
  import("../sarcasm/category-management/index")
);
/* Sarcasm end*/
// const CategoryMaster = lazy(() => import("./RegisterCampaign/CategoryMaster"));
// const ContentType = lazy(() => import("./RegisterCampaign/ContentType"));
// const CampaignCommitment = lazy(() =>
//   import("./RegisterCampaign/CampaignCommitment")
// );
// const ContentCreater = lazy(() => import("./RegisterCampaign/ContentCreater"));
// const CheckPageFollowers = lazy(() =>
//   import("./RegisterCampaign/CheckPageFollowers")
// );
// const SubCategoryMaster = lazy(() =>
//   import("./RegisterCampaign/SubCategoryMaster")
// );
// const CreaterDashboard = lazy(() =>
//   import("./RegisterCampaign/CreaterDashboard")
// );
const BillingOverview = lazy(() =>
  import("./HRMS/WFH/AnalyticDashboard/Billing/BillingOverview")
);
const BillingMast = lazy(() =>
  import("./HRMS/WFH/AnalyticDashboard/Billing/BillingMast")
);
const BillingUpdate = lazy(() =>
  import("./HRMS/WFH/AnalyticDashboard/Billing/BillingUpdate")
);
const AccountsOverviewWFH = lazy(() =>
  import("./AccountsDepartment/AccountsOverviewWFH")
);
const WFHSingleUser = lazy(() => import("./WFH/WFHSingleUser/WFHSingleUser"));
const ExecutionAll = lazy(() => import("../Execution/ExecutionAll"));
const ExecutionOwn = lazy(() => import("../Execution/ExecutionOwn"));
const ExecutionOther = lazy(() => import("../Execution/ExecutionOther"));
const CocUpdate = lazy(() => import("./AdminPreOnboarding/CocUpdate"));
const CocMaster = lazy(() => import("./AdminPreOnboarding/CocMaster"));
const CocOverview = lazy(() => import("./AdminPreOnboarding/CocOverview"));
const NotificationHistory = lazy(() =>
  import("./AdminPreOnboarding/NotificationHistory")
);
const CocHistory = lazy(() => import("./AdminPreOnboarding/CocHistory"));
const LoginHistory = lazy(() => import("./AdminPreOnboarding/LoginHistory"));
const PreonboardingDocuments = lazy(() =>
  import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocuments")
);
const PreonboardingDocumentOverview = lazy(() =>
  import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentOverview")
);
const PreonboardingDocumentsUpdate = lazy(() =>
  import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentsUpdate")
);
// const PlanOverview = lazy(() => import("./RegisterCampaign/PlanOverview"));
const ExeUPdate = lazy(() => import("../Execution/ExeUPdate"));
const ExeHistory = lazy(() => import("../Execution/ExeHistory"));

const SelfAudit = lazy(() => import("./AssetNotifier/SelfAudit"));
const StatsAllPagesDetail = lazy(() =>
  import("../Execution/StatsAllPagesDetail")
);
const ExecutionDashboard = lazy(() =>
  import("../Execution/ExecutionDashboard")
);
const AllTransactions = lazy(() =>
  import(
    "../Finance/Sales Management/SalesDashboardAllTransactions/AllTransactions"
  )
);
const ApprovalInvoice = lazy(() => import("../Finance/ApprovalInvoice"));
const BalancePaymentList = lazy(() =>
  import("../Finance/Sales Management/Outstanding/BalancePaymentList")
);
const IncentivePayment = lazy(() =>
  import("../Finance/Sales Management/Incentive/IncentiveParent")
);
const PaymentMode = lazy(() =>
  import("../Finance/Sales Management/PaymentModeFolder/PaymentMode")
);
const PendingApprovalRefund = lazy(() =>
  import("../Finance/PendingApprovalRefund")
);
const PendingApprovalsUpdate = lazy(() =>
  import(
    "../Finance/Sales Management/PaymentRequestUpdate/PendingApprovalsUpdate"
  )
);
const PendingInvoice = lazy(() =>
  import("../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoice")
);
const RefundRequests = lazy(() => import("../Finance/RefundRequests"));
const SaleBookingClose = lazy(() =>
  import("../Finance/Sales Management/SaleBooking/Components/SaleBookingClose")
);
const SaleBookingVerify = lazy(() =>
  import("../Finance/Sales Management/SaleBooking/Components/SaleBookingVerify")
);
const PaymentSummary = lazy(() => import("../Finance/PaymentSummary"));
const PendingInvoiceCustomerDeatils = lazy(() =>
  import(
    "../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoiceCustomerDeatils"
  )
);
const InvoiceCreated = lazy(() =>
  import("../Finance/Sales Management/Invoice/InvoiceCreated/InvoiceCreated")
);
const PendingPaymentsList = lazy(() =>
  import("../Finance/PendingPaymentsList")
);
const CityMaster = lazy(() => import("../Execution/cityMast/CityMaster"));
// const Experties = lazy(() => import("./RegisterCampaign/Experties/Experties"));
const PagePerformanceDashboard = lazy(() =>
  import("../Execution/PagePerformanceDashboard")
);
// const ExcusionCampaign = lazy(() =>
//   import("./RegisterCampaign/ExcusionCampaign")
// );
// const ExpertiesOverview = lazy(() =>
//   import("./RegisterCampaign/Experties/ExpertiesOverview")
// );
// const ExpertiesUpdate = lazy(() =>
//   import("./RegisterCampaign/Experties/ExpertUpdate")
// );
// const PhaseDashboard = lazy(() =>
//   import("../UnusedCode/PhaseDashboard/PhaseDashboard")
// );
// const ReplacementDashobard = lazy(() =>
//   import("./RegisterCampaign/ReplacementDashboard/ReplacementDashboard")
// );
// const AssignmentDashobard = lazy(() =>
//   import("./RegisterCampaign/AssignmentDashboard/AssignmentDashboard")
// );
const WFHUserOverview = lazy(() => import("./WFH/WFHUserOverview"));
// const CreateAssign = lazy(() => import("./RegisterCampaign/CreateAssign"));
const PagePerformanceAnalytics = lazy(() =>
  import("../Execution/PagePerformanceAnalytics")
);
const IncompleteProfileUsers = lazy(() =>
  import("./WFH/IncompleteProfileUsers")
);

const UserGraphs = lazy(() => import("./HRMS/User/UserGraphs"));
const Hobbies = lazy(() => import("./HRMS/Hobbies/Hobbies"));
const HobbiesOverview = lazy(() => import("./HRMS/Hobbies/HobbiesOverview"));
const AddEmailTemp = lazy(() => import("./HRMS/User/AddEmailTemp"));
const EmailTempOverview = lazy(() => import("./HRMS/User/EmailTempOverview"));
const EditEmailTemp = lazy(() => import("./HRMS/User/EditEmailTemp"));
// const ManagerDashboard = lazy(() =>
//   import("./RegisterCampaign/ManagerDashboard/ManagerDashboard")
// );
const ManagerCampaign = lazy(() =>
  import("../UnusedCode/UnusedOp/ManagerCampaignDashboard/ManagerCampaign")
);
const AssetVisibleToTagedPerosn = lazy(() =>
  import("./HRMS/Sim/AssetVisibleToTagedPerson/AssetVisibleToTagedPerosn")
);

const AssetSingleUser = lazy(() =>
  import("./HRMS/Sim/AssetSingeUser/AssetSingleUser")
);

const AssetVisibleToHr = lazy(() =>
  import("./HRMS/Sim/AssetVisibleToHr/AssetVisibleToHr")
);
const AssetManager = lazy(() => import("./HRMS/Sim/AssetManager/AssetManager"));
const WFHAllSalary = lazy(() => import("./WFH/WFHAllSalary"));

const PendingPaymentRequest = lazy(() =>
  import(
    "../Finance/Purchase Management/PendingPaymentRequest/PendingPaymentRequest"
  )
);
const PaymentDone = lazy(() =>
  import("../Finance/Purchase Management/PaymentDone/PaymentDone")
);
const PurchaseManagementAllTransaction = lazy(() =>
  import(
    "../Finance/Purchase Management/PurchaseManagementAllTransactionDashboard/PurchaseManagementAllTransaction"
  )
);
const Discard = lazy(() =>
  import("../Finance/Purchase Management/Discard/Discard")
);
const JobTypeMaster = lazy(() => import("./HRMS/JobType/JobTypeMaster"));

const FinanceWFHDashboard = lazy(() =>
  import("../Finance Dashboard/FinanceWFHDashboard")
);
const WFHTemplateOverview = lazy(() =>
  import("./WFH/WFHSingleUser/WFHTemplateOverview")
);
const ViewEditDigiSignature = lazy(() =>
  import("./HRMS/WFH/AnalyticDashboard/DigitalSignature/ViewEditDigiSignature")
);
// const PlancreationNew = lazy(() =>
//   import("./RegisterCampaign/PlancreationNew")
// );
// const TempPlanCreation = lazy(() =>
//   import("./RegisterCampaign/tempPlan/TempPlanCreation")
// );
// const PhasecreationNew = lazy(() =>
//   import("./RegisterCampaign/PhasecreationNew")
// );
const DesiDeptAuth = lazy(() =>
  import("../AdminPanel/HRMS/Designation/DesiDeptAuth")
);
// const PlanDashboard = lazy(() =>
//   import("../UnusedCode/PlanDashboard/PlanDashboard")
// );
// const CreateAgency = lazy(() =>
//   import("./RegisterCampaign/Masters/CreateAgency")
// );
// const CreateGoal = lazy(() => import("./RegisterCampaign/Masters/CreateGoal"));
// const CreateIndustry = lazy(() =>
//   import("./RegisterCampaign/Masters/CreateIndustry")
// );
// const AgencyOverview = lazy(() =>
//   import("./RegisterCampaign/Masters/AgencyOverview")
// );
// const GoalOverview = lazy(() =>
//   import("./RegisterCampaign/Masters/GoalOverview")
// );
// const IndustryOverview = lazy(() =>
//   import("./RegisterCampaign/Masters/IndustryOverview")
// );
// const CreateService = lazy(() =>
//   import("./RegisterCampaign/Masters/CreateService")
// );
// const ServicesOverview = lazy(() =>
//   import("./RegisterCampaign/Masters/ServicesOverview")
// );
const TaskStatusDeptWiseMaster = lazy(() =>
  import("../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseMaster")
);
const TaskStatusDeptWiseOverview = lazy(() =>
  import(
    "../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseOverview"
  )
);
const TaskStatusDeptWiseUpdate = lazy(() =>
  import("../TaskManagement/Pages/TaskStatusDeptWise/TaskStatusDeptWiseUpdate")
);
const DisputeOverview = lazy(() => import("./WFH/Dispute/DisputeOverview"));
const FinanceDashboard = lazy(() =>
  import("../Finance/Dashboard/FinanceDashboard")
);
const SalesExecutiveIncentiveRequestReleaseList = lazy(() =>
  import("../Finance/SalesExecutiveIncentiveRequestReleaseList")
);
const AssetDashboard = lazy(() => import("./HRMS/Sim/AssetDashboard"));
// const CreatePlan = lazy(() => import("./RegisterCampaign/Plan/CreatePlan"));
const EmailEvent = lazy(() => import("./HRMS/User/EmailEvent/EmailEvent"));

// const AllPlan = lazy(() => import("./RegisterCampaign/Plan/AllPlanData"));
// const AllPlanData = lazy(() => import("./RegisterCampaign/Plan/AllPlanData"));
// const AllPlanOverview = lazy(() =>
//   import("./RegisterCampaign/Plan/AllPlanOverview")
// );
const AssetSummary = lazy(() => import("./HRMS/Sim/AssetSummary"));
// const CaseStudyOperation = lazy(() =>
//   import("./RegisterCampaign/CaseStudies/CaseStudyOperation")
// );
const WFHDRegister = lazy(() => import("./WFH/WFHDRegister/WFHDRegister"));
const UpdateDocument = lazy(() => import("./WFH/UpdateDocument"));
const HRTemplateOverview = lazy(() => import("./WFH/HRTemplateOverview"));
const WFHDUpdate = lazy(() => import("./WFH/WFHDRegister/WFHDUpdate"));
const WFHDBankUpdate = lazy(() => import("./WFH/WFHDBankUpdate"));
const PaymentModeMast = lazy(() =>
  import("../Finance/Sales Management/PaymentModeFolder/PaymentModeMast")
);
const PaymentModeTransactionList = lazy(() =>
  import(
    "../Finance/Sales Management/PaymentModeFolder/PaymentModeTransactionList"
  )
);
const TotalNDG = lazy(() => import("./WFH/TotalNDG"));
const TaskPending = lazy(() => import("../Finance/TaskPending"));
const TaskDone = lazy(() => import("../Finance/TaskDone"));
const TDSdeduct = lazy(() =>
  import("../Finance/Purchase Management/TDSDeducted/TDSdeduct")
);
const GSThold = lazy(() =>
  import("../Finance/Purchase Management/GSTHold/GSThold")
);
// const NewExcelFile = lazy(() => import("./RegisterCampaign/Plan/NewExcelFile"));
// const TempExecution = lazy(() =>
//   import("./RegisterCampaign/tempPlan/TempExecution")
// );
const AccountType = lazy(() => import("./Customer/AccountType"));
const AccountMaster = lazy(() => import("./Customer/BrandNameType"));
const OwnershipMaster = lazy(() => import("./Customer/OwnershipMaster"));
const OpsCustomerMast = lazy(() => import("./Customer/OpsCustomerMast"));
const OpsCustomerOverview = lazy(() =>
  import("./Customer/OpsCustomerOverview")
);
const OpsCustomerUpdate = lazy(() => import("./Customer/OpsCustomerUpdate"));
const CustomerContOverview = lazy(() =>
  import("./Customer/CustomerContOverview")
);
const CustomerContMaster = lazy(() => import("./Customer/CustomerContMaster"));
const CustomerContUpdate = lazy(() => import("./Customer/CustomerContUpdate"));
const OpsDocMast = lazy(() => import("./Customer/OpsDocMast"));
const VendorType = lazy(() => import("./PageMS/VendorType"));
const PageCategory = lazy(() => import("./PageMS/PageCategory"));
const ProfileType = lazy(() => import("./PageMS/ProfileType"));
const PageOwnership = lazy(() => import("./PageMS/PageOwnership"));
const PmsPlatform = lazy(() => import("./PageMS/PmsPlatform"));
const PayMethod = lazy(() => import("./PageMS/PayMethod"));
const PayCycle = lazy(() => import("./PageMS/PayCycle"));
const GroupLinkType = lazy(() => import("./PageMS/GroupLinkType"));
const VendorMaster = lazy(() => import("./PageMS/VendorMaster"));
const VendorOverview = lazy(() => import("./PageMS/VendorOverview"));
const VendorEdit = lazy(() => import("./PageMS/VendorEdit"));
const PMSpriceTypeMast = lazy(() => import("./PageMS/PMSpriceTypeMast"));
const PMSplatformPriceTypeMast = lazy(() =>
  import("./PageMS/PMSplatformPriceTypeMast")
);
const VendorGroupLink = lazy(() => import("./PageMS/VendorGroupLink"));
const PageMaster = lazy(() => import("./PageMS/PageMaster"));
const PageOverviewNew = lazy(() => import("./PageMS/PageOverviewNew"));
const PageAssignmentUser = lazy(() => import("./PageMS/PageAssignmentUser"));
const PageAssignmentUserAdd = lazy(() =>
  import("./PageMS/PageAssignmentUserAdd")
);
const RepairRetrunSummary = lazy(() =>
  import("./HRMS/Sim/RepairRetrunSummary")
);
const VendorPagePriceOverview = lazy(() =>
  import("./PageMS/VendorPagePriceOverview")
);
const VendorPagePriceMaster = lazy(() =>
  import("./PageMS/VendorPagePriceMaster")
);
const EditVendorPagePrice = lazy(() => import("./PageMS/EditVendorPagePrice"));
const PageEdit = lazy(() => import("./PageMS/PageEdit"));
const AnnouncementPost = lazy(() => import("./Announcement/AnnoucementPost"));
const AnnouncementView = lazy(() => import("./Announcement/AnnouncementView"));
const PMSmaster = lazy(() => import("./PageMS/PMSmaster"));
// const OperationCampaigns = lazy(() =>
//   import("./RegisterCampaign/OperationCampaigns")
// );
// const OperationDashboards = lazy(() =>
//   import("./RegisterCampaign/OperationDashboards")
// );
// const OperationContents = lazy(() =>
//   import("./RegisterCampaign/OperationContents")
// );
const GstNongstIncentiveReport = lazy(() =>
  import(
    "../Finance/Sales Management/Incentive/IncentiveComponents/GstNongstIncentiveReport"
  )
);
const AssetRepairSummary = lazy(() =>
  import("./HRMS/Sim/AssetRepairSummaryHR")
);
const VendorSummary = lazy(() => import("./HRMS/Sim/VendorSummary"));
const SalesDashboard = lazy(() => import("./Sales/SalesDashboard"));
const SalesServicesOverview = lazy(() =>
  import("./Sales/SalesServices/SalesServicesOverview")
);
const SalesServicesCreate = lazy(() =>
  import("./Sales/SalesServices/SalesServicesCreate")
);
const SalesServicesUpdate = lazy(() =>
  import("./Sales/SalesServices/SalesServicesUpdate")
);
const Invoice = lazy(() =>
  import("../Finance/Sales Management/Invoice/Invoice")
);
const CreditApprovalReasonCreate = lazy(() =>
  import("./Sales/CreditApprovalReason/CreditApprovalReasonCreate")
);
const CreditApprovalReasonView = lazy(() =>
  import("./Sales/CreditApprovalReason/CreditApprovalReasonView")
);
const CreditApprovalReasonUpdate = lazy(() =>
  import("./Sales/CreditApprovalReason/CreditApprovalReasonUpdate")
);
const CustomerDocumentMaster = lazy(() =>
  import("./Customer/CustomerDocumentMaster")
);
const CustomerDocumentOverview = lazy(() =>
  import("./Customer/CustomerDocumentOverview")
);
// const NewExpertUpdate = lazy(() =>
//   import("./RegisterCampaign/Experties/NewExpertUpdate")
// );
const IncentiveCreate = lazy(() =>
  import("./Sales/IncentivePlan/IncentiveCreate")
);
const IncentiveOverview = lazy(() =>
  import("./Sales/IncentivePlan/IncentiveOverview")
);
const IncentiveUpdate = lazy(() =>
  import("./Sales/IncentivePlan/IncentiveUpdate")
);
const CustomerContactDetails = lazy(() =>
  import("./Customer/Contectdetailes/CustomerContactDetails")
);
const PurchasePrice = lazy(() => import("./PageMS/PurchasePrice"));
const UserSummary = lazy(() => import("./WFH/UserSummary/UserSummary"));
const PageAssignmentUpdate = lazy(() =>
  import("./ExpenseManagement/ExpenseManagementUpdate")
);
const CustomerDocumentDetails = lazy(() =>
  import("./Customer/DocumentDetails/CustomerDocumentDetails")
);
const CustomerDocumentUpdate = lazy(() =>
  import("./Customer/CustomerDocumentUpdate")
);

const CreateSaleBooking = lazy(() =>
  import("./Sales/SaleBooking/CreateSaleBooking")
);
const ViewSaleBooking = lazy(() =>
  import("./Sales/SaleBooking/ViewSaleBooking")
);
const Timeline = lazy(() => import("./Navbar-Sidebar/Timeline"));
const SaleBooking = lazy(() =>
  import("../Finance/Sales Management/SaleBooking/SaleBooking")
);
const Stats = lazy(() => import("./PageMS/Stats"));
const OperationMasters = lazy(() =>
  import("./Operation/Masters/OperationMasters")
);
const RegisteredCampaigns = lazy(() =>
  import("./Operation/RegisteredCampaigns")
);
const PlanCreation = lazy(() => import("./Operation/PlanCreation"));
const PhaseCreation = lazy(() => import("./Operation/PhaseCreation"));
const AuditPurchase = lazy(() => import("../Purchase/AuditPurchase"));
const CampaignExecutions = lazy(() =>
  import("./Operation/CampaignExecutionOverview/CampaignExecutions")
);

const CreatePaymentUpdate = lazy(() =>
  import("./Sales/PaymentUpdate/CreatePaymentUpdate")
);
const CreatePaymentMode = lazy(() =>
  import("./Sales/PaymentMode/CreatePaymentMode")
);
const ViewPaymentMode = lazy(() =>
  import("./Sales/PaymentMode/ViewPaymentMode")
);
const EditPaymentMode = lazy(() =>
  import("./Sales/PaymentMode/EditPaymentMode")
);
const CreatePaymentDetails = lazy(() =>
  import("./Sales/PaymentDetails/CreatePaymentDetails")
);
const ViewPaymentDetails = lazy(() =>
  import("./Sales/PaymentDetails/ViewPaymentDetails")
);
const EditPaymentDetails = lazy(() =>
  import("./Sales/PaymentDetails/EditPayementDetails")
);
const OrgTree = lazy(() => import("./WFH/OrgTree/OrgTree"));

const PaymentModePaymentDetails = lazy(() =>
  import(
    "../Finance/Sales Management/PaymentModeFolder/PaymentModePaymentDetails"
  )
);
const BalanceTransactionList = lazy(() =>
  import("../Finance/Sales Management/Outstanding/BalanceTransactionList")
);
const Overview = lazy(() =>
  import(
    "../Finance/Purchase Management/PendingPaymentRequest/Components/Overview"
  )
);
const IncentiveParent = lazy(() =>
  import("../Finance/Sales Management/Incentive/IncentiveParent")
);
const DeletedSaleBooking = lazy(() =>
  import("./Sales/SaleBooking/DeletedSaleBooking")
);
const RejectedPaymentRequest = lazy(() =>
  import("./Sales/PaymentRequest/RejectedPaymentRequest")
);
const PendingPaymentRequestSales = lazy(() =>
  import("./Sales/PaymentRequest/PendingPaymentRequestSales")
);
const RecordServices = lazy(() =>
  import("./Sales/RecordService/RecordServices")
);
const ReleasedAmountIncentive = lazy(() =>
  import("../Finance/ReleasedAmountIncentive")
);
const RefundPayment = lazy(() => import("../Finance/RefundPayment"));
const RegisterCampaigns = lazy(() => import("./Operation/RegisterCampaigns"));
const CreditApproval = lazy(() =>
  import("../Finance/CreditApproval/CreditApproval")
);
const ViewPaymentUpdate = lazy(() =>
  import("./Sales/PaymentUpdate/ViewPaymentUpdate")
);
const CreateSalesAccount = lazy(() =>
  import("./Sales/Account/CreateSalesAccount")
);
const SalesAccountOverview = lazy(() =>
  import("./Sales/Account/SalesAccountOverview")
);
const PaymentDoneTransactionList = lazy(() =>
  import(
    "../Finance/Purchase Management/PaymentDone/Components/PaymentDoneTransactionList"
  )
);
const PageStats = lazy(() => import("./PageMS/PageStats"));
const PlanMaking = lazy(() => import("../inventory/plan-making/index"));
const PlanMakingBeta = lazy(() =>
  import("../inventory/plan-making-beta/index")
);
const PlanMakingTableBeta = lazy(() =>
  import("../inventory/plan-making-beta/PlanMakingBeta")
);
const PlanMakingPricing = lazy(() =>
  import("../inventory/plan-pricing/PlanPricing")
);
const PlanPricing = lazy(() => import("../inventory/plan-pricing/index"));
const PlanMakingTable = lazy(() =>
  import("../inventory/plan-making/PlanMaking")
);

const PlanUpload = lazy(() =>
  import("../AdminPanel/Inventory/Plan-upload/index")
);
const CreateDocumentType = lazy(() =>
  import("./Sales/Account/CreateDocumentType")
);
const DocumentTypeOverview = lazy(() =>
  import("./Sales/Account/DocumentTypeOverview")
);
const PlanOverView = lazy(() => import("./Operation/Plan/CampPlanOverview"));
const CampPlanOverview = lazy(() =>
  import("./Operation/Plan/CampPlanOverview")
);
const EditPage = lazy(() => import("./PageMS/EditPage/EditPage"));
const ViewOutstanding = lazy(() =>
  import("./Sales/SaleBooking/Outstanding/ViewOutstanding")
);
const IncentiveDashboard = lazy(() =>
  import("./Sales/Incenti Dashboard/IncentiveDashboard")
);
const NewDocumentCom = lazy(() => import("./WFH/NewDocumentCom"));
const UserIncentive = lazy(() =>
  import("./Sales/Incenti Dashboard/UserIncentive")
);
const EarnedAndUnearned = lazy(() =>
  import("./Sales/Incenti Dashboard/EarnedAndUnearned")
);
const IncentiveRequest = lazy(() =>
  import("./Sales/Incenti Dashboard/IncentiveRequest")
);
const IncentiveSettlement = lazy(() =>
  import("./Sales/Incentive Settlement/IncentiveSettlement")
);
const CreateTargetCompetition = lazy(() =>
  import("./Sales/TargetCompetition/CreateTargetCompetition")
);
const ViewTargetCompetition = lazy(() =>
  import("./Sales/TargetCompetition/ViewTargetCompetition")
);
const ExpenseMangementMaster = lazy(() =>
  import("./ExpenseManagement/ExpenseMangementMaster")
);
const ExpenseOverview = lazy(() =>
  import("./ExpenseManagement/ExpenseOverview")
);
const ExpenseManagementUpdate = lazy(() =>
  import("./ExpenseManagement/ExpenseManagementUpdate")
);
const ViewInvoiceRequest = lazy(() =>
  import("./Sales/Invoice/ViewInvoiceRequest")
);
const AnalyticDashboard = lazy(() =>
  import("./HRMS/WFH/AnalyticDashboard/AnalyticDashboard")
);

const CommunityManager = lazy(() =>
  import("../SuperTracker/CommunityManagement/CommunityManager")
);
const CommunityPageView = lazy(() =>
  import("../SuperTracker/CommunityManagement/CommunityPageView")
);
const CommunityHome = lazy(() =>
  import("../SuperTracker/CommunityManagement/CommunityHome")
);
const CommunityUser = lazy(() =>
  import("../SuperTracker/CommunityManagement/CommunityUser")
);
const CommunityManagerView = lazy(() =>
  import("../SuperTracker/CommunityManagement/CommunityManagerView")
);
const MeetingPagesOverView = lazy(() =>
  import("../SuperTracker/MeetingPages/MeetingPagesOverView")
);
const OverviewMeetingVia = lazy(() =>
  import("../SuperTracker/MeetingPages/OverviewMeetingVia")
);
const PaymentUpdateBankWise = lazy(() =>
  import("./Sales/PaymentUpdate/PaymentUpdateBankWise")
);
const MajorDepartmentMast = lazy(() =>
  import("./HRMS/Department/MajorDepartment/MajorDepartmentMast")
);
const MajorDepartmentOverview = lazy(() =>
  import("./HRMS/Department/MajorDepartment/MajorDepartmentOverview")
);
const MajorDepartmentUpdate = lazy(() =>
  import("./HRMS/Department/MajorDepartment/MajorDepartmentUpdate")
);
const AllAssignedCategory = lazy(() =>
  import("../SuperTracker/CommunityManagement/AllAssignedCategory")
);
const SalesReport = lazy(() => import("./Sales/SaleBooking/SalesReport"));
const PageAddition = lazy(() => import("../Boosting/PageAddition"))
const RecentlyBoosted = lazy(() => import("../Boosting/RecentlyBoosted"))
const DefaultService = lazy(() => import("../Boosting/DefaultService"))

const Admin = () => {
  // const [contextData, setData] = useState([]);
  const { contextData } = useAPIGlobalContext();
  const location = useLocation();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const isPantryRoute = location.pathname.includes("pantry");
  return (
    <>
      <Suspense
        fallback={
          <div>
            <Loader />
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
                    <Route
                      path="/all-pending-order"
                      element={<PendingOrder />}
                    />
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
                    <Route
                      path="/users-dashboard"
                      element={<UserDashboard />}
                    />
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
                    <Route
                      path="/designation-master"
                      element={<Designation />}
                    />

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

                      <Route path="/user-profile" element={<Profile />} />
                      {contextData &&
                        contextData[0] &&
                        contextData[0].view_value === 1 && (
                          <>
                            <Route
                              path="/user-login-history"
                              element={<UserLoginHistory />}
                            />
                            <Route
                              path="/user-overview/:id"
                              element={<UserOverview />}
                            />
                            <Route
                              path="/user-update/:id"
                              element={<UserUpdate />}
                            />
                            <Route
                              path="/user_view/:id"
                              element={<UserView />}
                            />
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
                            {/* <Route
                              path="/user-single/:id"
                              element={<UserSingle />}
                            /> */}
                            <Route
                              path="/user-graph"
                              element={<UserGraphs />}
                            />
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
                      <Route path="/user-single/:id" element={<UserSingle />} />
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
                    <Route
                      path="/wfh-single-user"
                      element={<WFHSingleUser />}
                    />
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
                          <Route
                            path="/new-pantry-user"
                            element={<HomePantry />}
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
                      )}
                    {contextData &&
                      contextData[7] &&
                      contextData[7].view_value === 1 && (
                        <>
                          <Route
                            path="/sitting-overview/:shift"
                            element={<SittingOverview />}
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
                    <Route
                      path="/iptype-overview"
                      element={<IpTypeOverview />}
                    />
                    <Route
                      path="/iptype-update/:id"
                      element={<IpTypeUpdate />}
                    />
                    <Route
                      path="/platform-master"
                      element={<PlatformMaster />}
                    />
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
                      path="/finance-payment-release-report"
                      element={<OutstandingPaymentReceiveReport />}
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
                      path="/finance-pending-invoice/customer-details/:id"
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
                      path="/purchase-transaction"
                      element={<PurchaseTransactions />}
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
                    <Route
                      path="/finance-task-done/:id"
                      element={<TaskDone />}
                    />
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
                    {/* <Route
                      path="/operation-campaigns"
                      element={<OperationCampaigns />}
                    /> */}
                    {/* <Route
                      path="/operation-dashboards"
                      element={<OperationDashboards />}
                    /> */}
                    {/* <Route
                      path="/operation-contents"
                      element={<OperationContents />}
                    /> */}
                    <Route path="/calender" element={<CalenderCreation />} />
                    <Route
                      path="/campaign_execution"
                      element={<OperationShortcodeUpdater />}
                    />
                    <Route path="/op-calender" element={<OpCalender />} />

                    {/* <Route
                      path="/register-campaign"
                      element={<RegisterCampaign />}
                    /> */}
                    {/* <Route path="/create-plan" element={<CreatePlan />} /> */}
                    {/* HOBBIES */}
                    <Route path="/hobbies/:id" element={<Hobbies />} />
                    <Route
                      path="hobbies-overview"
                      element={<HobbiesOverview />}
                    />
                    {/* ----------------------Case Studies -----------------------------*/}
                    {/* <Route
                      path="/operation/case-study"
                      element={<CaseStudyOperation />}
                    /> */}

                    {/* Phase Dashboard here  */}
                    {/* <Route
                      path="/phase-dashboard"
                      element={<PhaseDashboard />}
                    /> */}
                    {/* <Route path="/direct_allPlan" element={<AllPlanData />} /> */}
                    {/* <Route
                      path="/all-planoverview/:id"
                      element={<AllPlanOverview />}
                    /> */}

                    {/* <Route
                      path="/plan-dashboard/:id"
                      element={<PlanDashboard />}
                    /> */}
                    {/* <Route
                      path="/replacement-dashboard"
                      element={<ReplacementDashobard />}
                    /> */}
                    <Route
                      path="/operationDashboard"
                      element={<OperationDashboard />}
                    />
                    {/* <Route
                      path="/assignment-dashboard"
                      element={<AssignmentDashobard />}
                    /> */}
                    {/* <Route
                      path="/manager-dashboard/:id"
                      element={<ManagerDashboard />}
                    /> */}
                    {/* <Route
                      path="/manager-campaign"
                      element={<ManagerCampaign />}
                    /> */}
                    {/* <Route path="/experties" element={<Experties />} /> */}
                    {/* <Route
                      path="/experties-overview"
                      element={<ExpertiesOverview />}
                    /> */}
                    {/* <Route
                      path="/expeties-update/:id"
                      element={<NewExpertUpdate />}
                    /> */}
                    {/* <Route
                      path="/registered-campaign"
                      element={<RegisteredCampaign />}
                    /> */}
                    <Route path="/campaign-admin" element={<CampignAdmin />} />
                    {/* <Route
                      path="/createrdashboard"
                      element={<CreaterDashboard />}
                    /> */}
                    {/* <Route
                      path="/planOverview/:id"
                      element={<PlanOverview />}
                    /> */}
                    {/* <Route path="/phase/:id" element={<PhasecreationNew />} />
                    <Route
                      path="/planCreation/:id"
                      element={<PlancreationNew />}
                    /> */}
                    {/* <Route path="/tempExcel" element={<NewExcelFile />} /> */}
                    {/* <Route path="/phase/:id" element={<PhaseCreation />} /> */}
                    {/* <Route
                      path="/planCreation/:id"
                      element={<PlancreationNew />}
                    />
                    <Route
                      path="/tempplanCreation/:id"
                      element={<TempPlanCreation />}
                    /> */}
                    {/* <Route
                      path="/createAssign/:id"
                      element={<CreateAssign />}
                    /> */}
                    {/* <Route
                      path="/checkPageFollowers"
                      element={<CheckPageFollowers />}
                    /> */}
                    {/* <Route path="/brandmaster" element={<BrandMaster />} /> */}
                    {/* <Route path="/agency" element={<CreateAgency />} />
                    <Route path="/goal" element={<CreateGoal />} />
                    <Route path="/industry" element={<CreateIndustry />} />
                    <Route path="/service" element={<CreateService />} />
                    <Route
                      path="/overview/agency"
                      element={<AgencyOverview />}
                    />
                    <Route path="/overview/goal" element={<GoalOverview />} />
                    <Route
                      path="/overview/industry"
                      element={<IndustryOverview />}
                    />
                    <Route
                      path="/overview/service"
                      element={<ServicesOverview />}
                    /> */}
                    {/* <Route path="/contenttype" element={<ContentType />} /> */}
                    {/* <Route
                      path="/campaigncommitment"
                      element={<CampaignCommitment />}
                    /> */}
                    {/* <Route
                      path="/categorymaster"
                      element={<CategoryMaster />}
                    /> */}
                    {/* <Route
                      path="/subcategory"
                      element={<SubCategoryMaster />}
                    /> */}
                    {/* <Route
                      path="/contentcreater"
                      element={<ContentCreater />}
                    /> */}
                    {/* <Route
                      path="/excusionCampaign"
                      element={<ExcusionCampaign />}
                    /> */}
                    {/* <Route path="/tempexcusion" element={<TempExecution />} /> */}
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
                    <Route
                      path="/exeexecution/all"
                      element={<ExecutionAll />}
                    />
                    <Route
                      path="/exeexecution/allpagesdetail"
                      element={<StatsAllPagesDetail />}
                    />
                    <Route
                      path="/exeexecution/own"
                      element={<ExecutionOwn />}
                    />
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

                    <Route
                      path="/pms-bulk-vendor-overview"
                      element={<AllVendorWiseList />}
                    />
                    {/* <Route
                       path="/pms-bulk-vendor-overview"
                       element={<BulkVendor />}
                    /> */}
                    <Route
                      path="/pms-inventory-dashboard"
                      element={<InventoryDashboard />}
                    />
                    <Route
                      path="/pms-inventory-category-overview"
                      element={<CategoryOverview />}
                    />

                    <Route path="/pms-vendor-type" element={<VendorType />} />
                    <Route
                      path="/pms-page-category"
                      element={<PageCategory />}
                    />
                    <Route
                      path="/pms-page-sub-category"
                      element={<SubCategoryOverview />}
                    />
                    <Route
                      path="/pms-unFatched-pages"
                      element={<UnfetchedPages />}
                    />
                    <Route path="/pms-tag-Category" element={<TagCategory />} />
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
                    <Route
                      path="/pms-vendor-master"
                      element={<VendorMaster />}
                    />
                    <Route path="/pms-plan-making" element={<PlanMaking />} />
                    <Route
                      path="/pms-plan-making-beta"
                      element={<PlanMakingBeta />}
                    />
                    <Route
                      path="/pms-plan-making-beta/:id"
                      element={<PlanMakingTableBeta />}
                    />

                    <Route path="/pms-plan-pricing" element={<PlanPricing />} />
                    <Route
                      path="/pms-plan-pricing/:id"
                      element={<PlanMakingPricing />}
                    />
                    <Route
                      path="/pms-plan-making/:id"
                      element={<PlanMakingTable />}
                    />
                    <Route path="/pms-plan-upload" element={<PlanUpload />} />
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
                    <Route
                      path="/pms-page-cat-assignment-overview"
                      element={<PageAssignmentUser />}
                    />
                    <Route
                      path="/pms-page-cat-assignment-add"
                      element={<PageAssignmentUserAdd />}
                    />
                    <Route
                      path="/pms-page-overview"
                      element={<PageOverviewNew />}
                    />
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

                    <Route
                      path="/sales-dashboard"
                      element={<SalesDashboard />}
                    />
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

                    {/* Sales  Pratyush start*/}
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
                      path="/sales-plan-request"
                      element={<PlanRequest />}
                    />
                    <Route
                      path="/sales-user-report"
                      element={<SalesReport />}
                    />
                    <Route
                      path="/Sales-Point-Of-Contact"
                      element={<ViewSalesPoc />}
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

                    <Route
                      path="/record-servcies"
                      element={<RecordServices />}
                    />

                    <Route
                      path="/credit-approval"
                      element={<CreditApproval />}
                    />
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
                    <Route
                      path="/create-target-competition"
                      element={<CreateTargetCompetition />}
                    />
                    <Route
                      path="/create-target-competition/:id"
                      element={<CreateTargetCompetition />}
                    />
                    <Route
                      path="/view-target-competition"
                      element={<ViewTargetCompetition />}
                    />
                    <Route
                      path="/monthwise-sales-booking"
                      element={<MonthWiseSalesView />}
                    />
                    <Route path="/product" element={<SalesProductOverview />} />
                    <Route path="/product/:task" element={<SalesProductCU />} />
                    <Route
                      path="/incentive-statement"
                      element={<IncentiveStatements />}
                    />

                    {/* Sales Pratyush end */}
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
                    <Route
                      path="/campaign_executions"
                      element={<NewCampaignExecutions />}
                    />

                    {/* new pla over view  */}
                    <Route
                      path="/op-plan-overview/:id"
                      element={<CampPlanOverview />}
                    />

                    {/* Community Management */}

                    {contextData &&
                      contextData[25] &&
                      contextData[25]?.view_value == 1 && (
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
                            path="/instaapi/community/allAssignedcategory"
                            element={<AllAssignedCategory />}
                          />
                          <Route
                            path="/instaapi/community/managerView"
                            element={<CommunityManagerView />}
                          />
                          <Route
                            path="/instaapi/community/categoryWise/pagesHistoey"
                            element={<CategoryWisePagesHistoey />}
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
                    {/* Sarcasm Start*/}
                    {contextData &&
                      contextData[29] &&
                      contextData[29]?.view_value === 1 && (
                        <>
                          <Route
                            path="/sarcasm/post-content"
                            element={<SarcasmDashboard />}
                          />
                          <Route
                            path="/sarcasm/sarcasm-category"
                            element={<SarcasmCategory />}
                          />
                          <Route
                            path="/sarcasm/sarcasm-blog"
                            element={<SarcasmBlog />}
                          />
                          <Route
                            path="/sarcasm/sarcasm-blog/:id"
                            element={<BlogDetail />}
                          />
                        </>
                      )}
                    {/* Sarcasm End */}

                    {/* Post stats from Insights */}
                    {contextData &&
                      contextData[54] &&
                      contextData[54]?.view_value === 1 && (
                        <Route path="/statics" element={<PostStats />} />
                      )}
                    {/* Purchase Transaction */}
                    <Route path="/ledger/:id" element={<Ledger />} />
                    <Route
                      path="/vendor_outstanding"
                      element={<VendorOutstandingOverview />}
                    />
                    <Route
                      path="/record-purchase"
                      element={<CampaignExecution />}
                    />
                    <Route path="/audit-purchase" element={<AuditPurchase />} />
                    <Route
                      path="/purchase-report"
                      element={<PurchaseReport />}
                    />
                    <Route
                      path="/purchase-dashboard"
                      element={<PurchaseDashboard />}
                    />

                    {/* Boosting Start */}
                    <Route path="/page-addition" element={<PageAddition />} />
                    <Route path="/recently-boosted" element={<RecentlyBoosted />} />
                    <Route path="/default-service" element={<DefaultService />} />
                    {/* Boosting End */}
                  </Route>
                  {/* Pantry */}
                  {/* {contextData &&
                      contextData[29] &&
                      contextData[29]?.view_value === 1 && ( */}
                  <>
                    <Route
                      path="/pantry"
                      element={<PantryUserDashboard />}
                    />

                  </>
                  {/* )} */}
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
