import jwtDecode from "jwt-decode";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "../Finance/Loader/Loader.jsx";
import Profile from "./HRMS/Pantry/UserPanel/Profile/Profile.jsx";
import PostStats from "../Stats/PostStats.jsx";
import OutstandingPaymentReceiveReport from "../Finance/Sales Management/PaymentReleaseReport/OutstandingPaymentReceiveReport.jsx";
import ErrorPage from "../../ErrorPage.jsx";
import CalenderCreation from "../Operation/Calender/CalenderCreation.jsx";
import PurchaseTransactions from "../Purchase/PurchaseTransactions.jsx";
import OpCalender from "../AbOpreation/Calender/OpCalender.jsx";
import VendorOutstandingOverview from "../Purchase/PurchaseVendor/VendorOutstandingOverview.jsx";
import OperationShortcodeUpdater from "../AbOpreation/OperationShortcodeUpdater.jsx";
import CampaignExecution from "../Operation/Execution/CampaignExecution.jsx";
import SittingRoomWise from "./HRMS/Sitting/SittingRoomWise.jsx";
import UserLoginHistory from "./HRMS/User/UserDashboard/LoginHistory/UserLoginHistory.jsx";
import CommonRoom from "./HRMS/Sitting/CommonRoom.jsx";
// import { useAPIGlobalContext } from "./APIContext/APIContext.jsx";
import Ledger from "../Purchase/PurchaseVendor/Ledger.jsx";
import HomePantry from "../NewPantry/HomePantry.jsx";
import PantryUserDashboard from "../Pantry/PantryUserDashboard.jsx";
import PantryAdminDashboard from "../Pantry/PantryAdminDashboard.jsx";
import VendorStatement from "../Finance/Sales Management/Outstanding/VendorStatement.jsx";
import VendorStatementView from "../Finance/Sales Management/Outstanding/VendorStatementView.jsx";
import VendorInventory from "./VendorSales/VendorInventory.jsx";
import VendorInventoryDetails from "./VendorSales/VendorInventoryDetails.jsx";
import AddVendorPage from "./VendorSales/AddVendorPage.jsx";
import CommunityRoutes from "../../routes/CommunityRoutes.jsx";
import SalesRoutes from "../../routes/SalesRoutes.jsx";
import UnfetchedPages from "./PageMS/InventoryDashboard/UnfetchedPages.jsx";
import PageLogs from "./PageMS/PageOverview/PageLogs.jsx";
// const SalesRoutes = lazy(() =>
//     import("../../routes/SalesRoutes.jsx")
// );
import LoaderTwo from "../../utils/LoaderTwo.jsx";


import { useAPIGlobalContext } from "./APIContext/APIContext.jsx";
import InventoryRoutes from "../../routes/InventoryRoutes.jsx";
import Miscellaneous from "../../routes/Miscellaneous.jsx";
import FinanceRoutes from "../../routes/FinanceRoutes.jsx";
const PendingAuditOutstandingTotal = lazy(() =>
    import("../Purchase/PurchaseVendor/PendingAuditOutstandingTotal.jsx")
);
const PurchaseDashboard = lazy(() => import("../Purchase/Dashboard.jsx"));

const PurchaseReport = lazy(() =>
    import("../Purchase/purchase-report/PurchaseReport.jsx")
);

const RecordCampaign = lazy(() =>
    import("./Operation/RecordCampaign/RecordCampaign.jsx")
);
const NavSideBar = lazy(() => import("./Navbar-Sidebar/NavSideBar.jsx"));
const UserMaster = lazy(() => import("./HRMS/User/UserMaster.jsx"));
const UserView = lazy(() => import("./HRMS/User/UserView.jsx"));
const VendorSalesOverview = lazy(() =>
    import("./VendorSales/VendorSalesOverview.jsx")
);
const UserUpdate = lazy(() => import("./HRMS/User/UserUpdate.jsx"));

const UserOverview = lazy(() => import("./HRMS/User/UserOverview.jsx"));
const RoleMaster = lazy(() => import("./HRMS/Role/RoleMaster.jsx"));
const RoleOverView = lazy(() => import("./HRMS/Role/RoleOverview.jsx"));
const RoleMastUpdate = lazy(() => import("./HRMS/Role/RoleMastUpdate.jsx"));
const DepartmentOverview = lazy(() =>
    import("./HRMS/Department/DepartmentOverview.jsx")
);
const DepartmentMaster = lazy(() =>
    import("./HRMS/Department/DepartmentMaster.jsx")
);
const DepartmentUpdate = lazy(() =>
    import("./HRMS/Department/DepartmentUpdate.jsx")
);
const ProductMaster = lazy(() => import("./Product/ProductMaster.jsx"));
const ProductOverview = lazy(() => import("./Product/ProductOverview.jsx"));
const ProductUpdate = lazy(() => import("./Product/ProductUpdate.jsx"));
const SittingOverview = lazy(() => import("./HRMS/Sitting/SittingOverview.jsx"));
const OfficeMastOverview = lazy(() =>
    import("./HRMS/Sitting/OfficeMastOverview.jsx")
);
const UserResposOverview = lazy(() =>
    import("./HRMS/UserResponsbility/UserResposOverview.jsx")
);
const UserResponsbility = lazy(() =>
    import("./HRMS/UserResponsbility/UserResponsbility.jsx")
);
const UserResponsbilityUpdate = lazy(() =>
    import("./HRMS/UserResponsbility/userResponsbilityUpdate.jsx")
);
const UserAuthDetail = lazy(() =>
    import("./HRMS/UserAuthDetail/UserAuthDetail.jsx")
);
const ObjectMaster = lazy(() => import("./Object/ObjectMaster.jsx"));
const ObjectOverview = lazy(() => import("./Object/ObjectOverview.jsx"));
const ObjectUpdate = lazy(() => import("./Object/ObjectUpdate.jsx"));

const DeliverdOrder = lazy(() =>
    import("./HRMS/Pantry/DeliverdOrder/DeliverdOrder.jsx")
);
const PendingOrder = lazy(() =>
    import("./HRMS/Pantry/PendingOrder/PendingOrder.jsx")
);
const Dashboard = lazy(() => import("./Dashboard/Dashboard.jsx"));
const TransferReq = lazy(() => import("./HRMS/Pantry/TransferReq/TransferReq.jsx"));
const AllOrder = lazy(() => import("./HRMS/Pantry/AllOrders/AllOrders.jsx"));
const DesignationOverview = lazy(() =>
    import("./HRMS/Designation/DesignationOverview.jsx")
);
const Designation = lazy(() => import("./HRMS/Designation/Designation.jsx"));
const DesignationUpdate = lazy(() =>
    import("./HRMS/Designation/DesignationUpdate.jsx")
);
const ResponsibilityMast = lazy(() =>
    import("./HRMS/UserResponsbility/Responsbility/ResponsibilityMast.jsx")
);
const ResponsiblityOverview = lazy(() =>
    import("./HRMS/UserResponsbility/Responsbility/ResponsiblityOverview.jsx")
);
const ResponsibilityUpdate = lazy(() =>
    import("./HRMS/UserResponsbility/Responsbility/ResponsibilityUpdate.jsx")
);

const DeclinedOrder = lazy(() =>
    import("./HRMS/Pantry/DeclinedOrder/DeclinedOrder.jsx")
);
const UserDirectory = lazy(() => import("./HRMS/User/UserDirectory.jsx"));
const AdminPreOnboarding = lazy(() =>
    import("./AdminPreOnboarding/AdminPreOnboarding.jsx")
);
const Attendence = lazy(() => import("./WFH/Attendence.jsx"));
const AttendanceOverview = lazy(() => import("./WFH/AttendanceOverview.jsx"));
const UserDashboard = lazy(() => import("./HRMS/User/UserDashboard.jsx"));

const KRA = lazy(() => import("./HRMS/KRA/KRA.jsx"));
const UserWiseResponsibility = lazy(() =>
    import(
        "./HRMS/UserResponsbility/UserWiseResponsibility/UserWiseResponsibility.jsx"
    )
);
const UserWiseDashboard = lazy(() =>
    import("./HRMS/User/UserWIseDashboard/UserWiseDashboard.jsx")
);
const SalaryWFH = lazy(() => import("./WFH/SalaryGeneration/SalaryWFH.jsx"));
const SalarySummary = lazy(() => import("./WFH/SalarySummary/SalarySummary.jsx"));
const UserHierarchy = lazy(() => import("./HRMS/User/UserHierarchy.jsx"));
const UserSingle = lazy(() => import("./HRMS/User/UserSingle.jsx"));

const DashboardWFHUser = lazy(() => import("./WFH/DashboardWFHUser.jsx"));
const DashboardWFHCardDetails = lazy(() =>
    import("./WFH/DashboardWFHCardDetails.jsx")
);
const WFHDOverview = lazy(() => import("./WFH/WFHDOverview.jsx"));
const Reason = lazy(() => import("./HRMS/Reason/Reason.jsx"));
const SubDepartmentMaster = lazy(() =>
    import("./HRMS/Department/SubDepartmentMaster.jsx")
);
const SubDepartmentOverview = lazy(() =>
    import("./HRMS/Department/SubDepartmentOverview.jsx")
);
const SubDepartmentUpdate = lazy(() =>
    import("./HRMS/Department/SubDepartmentUpdate.jsx")
);
// const ExecutionInventory = lazy(() =>
//     import("../Execution/ExecutionInventory.jsx")
// );
const ExecutionPending = lazy(() => import("../Execution/ExecutionPending.jsx"));
const PreOnboardVerifyDetails = lazy(() =>
    import("./AdminPreOnboarding/PreOnboardVerifyDetails.jsx")
);
const PreOnboardUserDetailsProfile = lazy(() =>
    import("./AdminPreOnboarding/PreOnboardUserDetailsProfile.jsx")
);
const PreOnboardingOverview = lazy(() =>
    import("./AdminPreOnboarding/PreOnboardOverview.jsx")
);
const OnboardExtendDateOverview = lazy(() =>
    import("./AdminPreOnboarding/OnboardExtendDateOverview.jsx")
);
const ExecutionDone = lazy(() => import("../Execution/Done/ExecutionDone.jsx"));
const ExecutionAccepted = lazy(() =>
    import("../Execution/Accepted/ExecutionAccepted.jsx")
);

const ExecutionRejected = lazy(() =>
    import("../Execution/Rejected/ExecutionRejected.jsx")
);

const SalaryDashboard = lazy(() =>
    import("./WFH/SalaryGeneration/SalaryDashboard.jsx")
);
const CampignAdmin = lazy(() => import("./CampaginAdmin/CampignAdmin.jsx"));
/* Sarcasm start*/
const SarcasmDashboard = lazy(() => import("../sarcasm/content-from/index"));
const SarcasmBlog = lazy(() => import("../sarcasm/blog-managment/index"));
const BlogDetail = lazy(() =>
    import("../sarcasm/blog-managment/blog-detail/index")
);
const SarcasmCategory = lazy(() =>
    import("../sarcasm/category-management/index")
);

const BillingOverview = lazy(() =>
    import("./HRMS/WFH/AnalyticDashboard/Billing/BillingOverview.jsx")
);
const BillingMast = lazy(() =>
    import("./HRMS/WFH/AnalyticDashboard/Billing/BillingMast.jsx")
);
const BillingUpdate = lazy(() =>
    import("./HRMS/WFH/AnalyticDashboard/Billing/BillingUpdate.jsx")
);
const AccountsOverviewWFH = lazy(() =>
    import("./AccountsDepartment/AccountsOverviewWFH.jsx")
);
const WFHSingleUser = lazy(() => import("./WFH/WFHSingleUser/WFHSingleUser.jsx"));
const CocUpdate = lazy(() => import("./AdminPreOnboarding/CocUpdate.jsx"));
const CocMaster = lazy(() => import("./AdminPreOnboarding/CocMaster.jsx"));
const CocOverview = lazy(() => import("./AdminPreOnboarding/CocOverview.jsx"));
const NotificationHistory = lazy(() =>
    import("./AdminPreOnboarding/NotificationHistory.jsx")
);
const CocHistory = lazy(() => import("./AdminPreOnboarding/CocHistory.jsx"));
const LoginHistory = lazy(() => import("./AdminPreOnboarding/LoginHistory.jsx"));
const PreonboardingDocuments = lazy(() =>
    import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocuments.jsx")
);
const PreonboardingDocumentOverview = lazy(() =>
    import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentOverview.jsx")
);
const PreonboardingDocumentsUpdate = lazy(() =>
    import("./AdminPreOnboarding/AdminPreDocuments/PreonboardingDocumentsUpdate.jsx")
);

const SelfAudit = lazy(() => import("./AssetNotifier/SelfAudit.jsx"));
const AllTransactions = lazy(() =>
    import(
        "../Finance/Sales Management/SalesDashboardAllTransactions/AllTransactions.jsx"
    )
);
const ApprovalInvoice = lazy(() => import("../Finance/ApprovalInvoice.jsx"));
const BalancePaymentList = lazy(() =>
    import("../Finance/Sales Management/Outstanding/BalancePaymentList.jsx")
);
const IncentivePayment = lazy(() =>
    import("../Finance/Sales Management/Incentive/IncentiveParent.jsx")
);
const PaymentMode = lazy(() =>
    import("../Finance/Sales Management/PaymentModeFolder/PaymentMode.jsx")
);
const PendingApprovalRefund = lazy(() =>
    import("../Finance/PendingApprovalRefund.jsx")
);
const PendingApprovalsUpdate = lazy(() =>
    import(
        "../Finance/Sales Management/PaymentRequestUpdate/PendingApprovalsUpdate.jsx"
    )
);
const PendingInvoice = lazy(() =>
    import("../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoice.jsx")
);
const RefundRequests = lazy(() => import("../Finance/RefundRequests.jsx"));
const PaymentSummary = lazy(() => import("../Finance/PaymentSummary.jsx"));
const PendingInvoiceCustomerDeatils = lazy(() =>
    import(
        "../Finance/Sales Management/Invoice/PendingInvoice/PendingInvoiceCustomerDeatils.jsx"
    )
);
const InvoiceCreated = lazy(() =>
    import("../Finance/Sales Management/Invoice/InvoiceCreated/InvoiceCreated.jsx")
);
const PendingPaymentsList = lazy(() =>
    import("../Finance/PendingPaymentsList.jsx")
);
const CityMaster = lazy(() => import("../Execution/cityMast/CityMaster.jsx"));
const WFHUserOverview = lazy(() => import("./WFH/WFHUserOverview.jsx"));
const IncompleteProfileUsers = lazy(() =>
    import("./WFH/IncompleteProfileUsers.jsx")
);

const UserGraphs = lazy(() => import("./HRMS/User/UserGraphs.jsx"));
const Hobbies = lazy(() => import("./HRMS/Hobbies/Hobbies.jsx"));
const HobbiesOverview = lazy(() => import("./HRMS/Hobbies/HobbiesOverview.jsx"));
const AddEmailTemp = lazy(() => import("./HRMS/User/AddEmailTemp.jsx"));
const EmailTempOverview = lazy(() => import("./HRMS/User/EmailTempOverview.jsx"));
const EditEmailTemp = lazy(() => import("./HRMS/User/EditEmailTemp.jsx"));
const AssetVisibleToTagedPerosn = lazy(() =>
    import("./HRMS/Sim/AssetVisibleToTagedPerson/AssetVisibleToTagedPerosn.jsx")
);

const AssetSingleUser = lazy(() =>
    import("./HRMS/Sim/AssetSingeUser/AssetSingleUser.jsx")
);

const AssetVisibleToHr = lazy(() =>
    import("./HRMS/Sim/AssetVisibleToHr/AssetVisibleToHr.jsx")
);
const AssetManager = lazy(() => import("./HRMS/Sim/AssetManager/AssetManager.jsx"));
const WFHAllSalary = lazy(() => import("./WFH/WFHAllSalary.jsx"));

const PendingPaymentRequest = lazy(() =>
    import(
        "../Finance/Purchase Management/PendingPaymentRequest/PendingPaymentRequest.jsx"
    )
);
const PaymentDone = lazy(() =>
    import("../Finance/Purchase Management/PaymentDone/PaymentDone.jsx")
);
const PurchaseManagementAllTransaction = lazy(() =>
    import(
        "../Finance/Purchase Management/PurchaseManagementAllTransactionDashboard/PurchaseManagementAllTransaction.jsx"
    )
);
const Discard = lazy(() =>
    import("../Finance/Purchase Management/Discard/Discard.jsx")
);
const JobTypeMaster = lazy(() => import("./HRMS/JobType/JobTypeMaster.jsx"));

const FinanceWFHDashboard = lazy(() =>
    import("../Finance Dashboard/FinanceWFHDashboard.jsx")
);
const WFHTemplateOverview = lazy(() =>
    import("./WFH/WFHSingleUser/WFHTemplateOverview.jsx")
);
const ViewEditDigiSignature = lazy(() =>
    import("./HRMS/WFH/AnalyticDashboard/DigitalSignature/ViewEditDigiSignature.jsx")
);
const DesiDeptAuth = lazy(() =>
    import("./HRMS/Designation/DesiDeptAuth.jsx")
);


const DisputeOverview = lazy(() => import("./WFH/Dispute/DisputeOverview.jsx"));
const FinanceDashboard = lazy(() =>
    import("../Finance/Dashboard/FinanceDashboard.jsx")
);
const SalesExecutiveIncentiveRequestReleaseList = lazy(() =>
    import("../Finance/SalesExecutiveIncentiveRequestReleaseList.jsx")
);
const AssetDashboard = lazy(() => import("./HRMS/Sim/AssetDashboard.jsx"));
const EmailEvent = lazy(() => import("./HRMS/User/EmailEvent/EmailEvent.jsx"));
const AssetSummary = lazy(() => import("./HRMS/Sim/AssetSummary.jsx"));
const WFHDRegister = lazy(() => import("./WFH/WFHDRegister/WFHDRegister.jsx"));
const UpdateDocument = lazy(() => import("./WFH/UpdateDocument.jsx"));
const HRTemplateOverview = lazy(() => import("./WFH/HRTemplateOverview.jsx"));
const WFHDUpdate = lazy(() => import("./WFH/WFHDRegister/WFHDUpdate.jsx"));
const WFHDBankUpdate = lazy(() => import("./WFH/WFHDBankUpdate.jsx"));
const PaymentModeMast = lazy(() =>
    import("../Finance/Sales Management/PaymentModeFolder/PaymentModeMast.jsx")
);
const PaymentModeTransactionList = lazy(() =>
    import(
        "../Finance/Sales Management/PaymentModeFolder/PaymentModeTransactionList.jsx"
    )
);
const TotalNDG = lazy(() => import("./WFH/TotalNDG.jsx"));
const TDSdeduct = lazy(() =>
    import("../Finance/Purchase Management/TDSDeducted/TDSdeduct.jsx")
);
const GSThold = lazy(() =>
    import("../Finance/Purchase Management/GSTHold/GSThold.jsx")
);

const RepairRetrunSummary = lazy(() =>
    import("./HRMS/Sim/RepairRetrunSummary.jsx")
);
const AnnouncementPost = lazy(() => import("./Announcement/AnnoucementPost.jsx"));
const AnnouncementView = lazy(() => import("./Announcement/AnnouncementView.jsx"));

const GstNongstIncentiveReport = lazy(() =>
    import(
        "../Finance/Sales Management/Incentive/IncentiveComponents/GstNongstIncentiveReport.jsx"
    )
);
const AssetRepairSummary = lazy(() =>
    import("./HRMS/Sim/AssetRepairSummaryHR.jsx")
);
const VendorSummary = lazy(() => import("./HRMS/Sim/VendorSummary.jsx"));
const Invoice = lazy(() =>
    import("../Finance/Sales Management/Invoice/Invoice.jsx")
);
const PurchasePrice = lazy(() => import("./PageMS/PurchasePrice.jsx"));
const UserSummary = lazy(() => import("./WFH/UserSummary/UserSummary.jsx"));
const Timeline = lazy(() => import("./Navbar-Sidebar/Timeline.jsx"));
const SaleBooking = lazy(() =>
    import("../Finance/Sales Management/SaleBooking/SaleBooking.jsx")
);
const Stats = lazy(() => import("./PageMS/Stats.jsx"));
const AuditPurchase = lazy(() => import("../Purchase/AuditPurchase.jsx"));
const AdvancePurchaseOverview = lazy(() =>
    import("../Purchase/AdvancePurchaseOverview.jsx")
);
const OrgTree = lazy(() => import("./WFH/OrgTree/OrgTree.jsx"));

const PaymentModePaymentDetails = lazy(() =>
    import(
        "../Finance/Sales Management/PaymentModeFolder/PaymentModePaymentDetails.jsx"
    )
);
const BalanceTransactionList = lazy(() =>
    import("../Finance/Sales Management/Outstanding/BalanceTransactionList.jsx")
);
const Overview = lazy(() =>
    import(
        "../Finance/Purchase Management/PendingPaymentRequest/Components/Overview.jsx"
    )
);
const IncentiveParent = lazy(() =>
    import("../Finance/Sales Management/Incentive/IncentiveParent.jsx")
);
const ReleasedAmountIncentive = lazy(() =>
    import("../Finance/ReleasedAmountIncentive.jsx")
);
const RefundPayment = lazy(() => import("../Finance/RefundPayment.jsx"));
const PaymentDoneTransactionList = lazy(() =>
    import(
        "../Finance/Purchase Management/PaymentDone/Components/PaymentDoneTransactionList.jsx"
    )
);
const PageStats = lazy(() => import("./PageMS/PageStats.jsx"));




const NewDocumentCom = lazy(() => import("./WFH/NewDocumentCom.jsx"));

const AnalyticDashboard = lazy(() =>
    import("./HRMS/WFH/AnalyticDashboard/AnalyticDashboard.jsx")
);
const MajorDepartmentMast = lazy(() =>
    import("./HRMS/Department/MajorDepartment/MajorDepartmentMast.jsx")
);
const MajorDepartmentOverview = lazy(() =>
    import("./HRMS/Department/MajorDepartment/MajorDepartmentOverview.jsx")
);
const MajorDepartmentUpdate = lazy(() =>
    import("./HRMS/Department/MajorDepartment/MajorDepartmentUpdate.jsx")
);
const PageAddition = lazy(() => import("../Boosting/PageAddition.jsx"));
const RecentlyBoosted = lazy(() => import("../Boosting/RecentlyBoosted.jsx"));
const DefaultService = lazy(() => import("../Boosting/DefaultService.jsx"));


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

                                        {/*START Inside This section only HRMS ROUTES are visible */}

                                        {/* User Profile Routing Here  */}
                                        <Route path="/user-timeline" element={<Timeline />} />
                                        <Route path="/user-profile" element={<Profile />} />

                                        {isUserManagementVisible && (
                                            <>
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
                                            </>
                                        )}
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
                                                    <Route
                                                        path="/designation-master"
                                                        element={<Designation />}
                                                    />
                                                </>
                                            )}

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
                                                        {/* DesiDeptAuth Routing  */}
                                                        <Route
                                                            path="/desi-dept-auth/:id"
                                                            element={<DesiDeptAuth />}
                                                        />
                                                    </>
                                                )}
                                            <Route path="/user-single/:id" element={<UserSingle />} />
                                        </>

                                        {/* Attendence  */}

                                        <Route path="/org-tree" element={<OrgTree />} />

                                        {contextData &&
                                            contextData[11] &&
                                            contextData[11].view_value === 1 && (
                                                <>
                                                    <Route
                                                        path="/wfhd-register"
                                                        element={<WFHDRegister />}
                                                    />
                                                    <Route path="/total-NDG" element={<TotalNDG />} />
                                                    <Route
                                                        path="/wfhd-update/:id"
                                                        element={<WFHDUpdate />}
                                                    />
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
                                                    <Route
                                                        path="/billing-master"
                                                        element={<BillingMast />}
                                                    />
                                                    <Route
                                                        path="/billing-update/:id"
                                                        element={<BillingUpdate />}
                                                    />
                                                    <Route
                                                        path="/attendence-overview"
                                                        element={<AttendanceOverview />}
                                                    />
                                                    <Route
                                                        path="/attendence-mast"
                                                        element={<Attendence />}
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
                                                    <Route
                                                        path="/wfhd-overview"
                                                        element={<WFHDOverview />}
                                                    />
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
                                                    <Route path="/salaryWFH" element={<SalaryWFH />} />
                                                    <Route
                                                        path="/all-salary"
                                                        element={<WFHAllSalary />}
                                                    />
                                                    <Route
                                                        path="/salary-summary"
                                                        element={<SalarySummary />}
                                                    />
                                                </>
                                            )}
                                        <Route
                                            path="/wfh-single-user"
                                            element={<WFHSingleUser />}
                                        />

                                        <Route path="/stats" element={<Stats />} />
                                        {<Route path="/pageStats/:id" element={<PageStats />} />}
                                        {/* Salary */}

                                        <Route path="/user-summary" element={<UserSummary />} />
                                        {/* <Route path="/salaryWFH" element={<SalaryWFH />} /> */}

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
                                            path="/wfh-update-document/:user_id"
                                            element={<UpdateDocument />}
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
                                        {contextData &&
                                            contextData[5] &&
                                            contextData[5].view_value === 1 && (
                                                <>
                                                    <Route
                                                        path="/asset-dashboard"
                                                        element={<AssetDashboard />}
                                                    />
                                                    <Route
                                                        path="/asset_summary"
                                                        element={<AssetSummary />}
                                                    />

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
                                                    <Route
                                                        path="/asset-manager"
                                                        element={<AssetManager />}
                                                    />
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
                                            )}

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

                                        {contextData &&
                                            contextData[1] &&
                                            contextData[1].view_value === 1 && (
                                                <>
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
                                                </>
                                            )}





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



                                        {/* 
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
                                            path="/vendor-statement"
                                            element={<VendorStatement />}
                                        />
                                        <Route
                                            path="/vendor-statement-view/:id"
                                            element={<VendorStatementView />}
                                        />
                                        <Route
                                            path="/finance-transaction-list/:invoice_req_id"
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
                                        {/* <Route
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
                                            path="/audited-outstanding-total"
                                            element={<PendingAuditOutstandingTotal />}
                                        />

                                        <Route
                                            path="/vendor-inventory"
                                            element={<VendorInventory />}
                                        />
                                        <Route
                                            path="/vendor-inventory/:id"
                                            element={<VendorInventoryDetails />}
                                        />
                                        <Route
                                            path="/vendor-pages/:id"
                                            element={<AddVendorPage />}
                                        />

                                        <Route
                                            path="/pending-outstanding-total"
                                            element={<PendingAuditOutstandingTotal />}
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





                                      
                                        <Route
                                            path="/finance-gst-nongst-incentive-report"
                                            element={<GstNongstIncentiveReport />}
                                        />
                                        <Route
                                            path="/finance-incentive-parent"
                                            element={<IncentiveParent />}
                                        />
                                     
                                        <Route
                                            path="/payment-summary/:id"
                                            element={<PaymentSummary />}
                                        /> */}



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

                                        <Route path="/calender" element={<CalenderCreation />} />
                                        <Route
                                            path="/record-campaign"
                                            element={<RecordCampaign />}
                                        />
                                        <Route
                                            path="/campaign_execution"
                                            element={<OperationShortcodeUpdater />}
                                        />
                                        <Route path="/op-calender" element={<OpCalender />} />


                                        {/* HOBBIES */}
                                        <Route path="/hobbies/:id" element={<Hobbies />} />
                                        <Route
                                            path="hobbies-overview"
                                            element={<HobbiesOverview />}
                                        />


                                        <Route path="/campaign-admin" element={<CampignAdmin />} />



                                        {/* ------------------------Job Type ----------------------------- */}
                                        <Route path="/jobType" element={<JobTypeMaster />} />
                                        {/*------------------------ Execution --------------------------------*/}
                                        <Route path="/cityMsater" element={<CityMaster />} />

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



                                        {SalesRoutes({ contextData })}
                                        {InventoryRoutes()}
                                        {CommunityRoutes({ contextData })}
                                        {Miscellaneous()}
                                        {FinanceRoutes()}


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

                                        {/*  Vendor Sales Start */}
                                        <Route
                                            path="vendor-sale-overview"
                                            element={<VendorSalesOverview />}
                                        />
                                        {/*  Vendor Sales End */}

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
                                        <Route
                                            path="/purchased-record"
                                            element={<AuditPurchase />}
                                        />
                                        <Route
                                            path="/advanced-purchase-overview"
                                            element={<AdvancePurchaseOverview />}
                                        />
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
                                        <Route
                                            path="/recently-boosted"
                                            element={<RecentlyBoosted />}
                                        />
                                        <Route
                                            path="/default-service"
                                            element={<DefaultService />}
                                        />
                                        {/* Boosting End */}
                                    </Route>
                                    {/* Pantry */}
                                    {/* {contextData &&
                      contextData[29] &&
                      contextData[29]?.view_value === 1 && ( */}
                                    <>
                                        <Route path="/pantry" element={<PantryUserDashboard />} />
                                        <Route
                                            path="/pantry-admin"
                                            element={<PantryAdminDashboard />}
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



{/* Expense Routing here  */ }
{/* <Route
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
                                        /> */}


// const ExpenseMangementMaster = lazy(() =>
//     import("./ExpenseManagement/ExpenseMangementMaster.jsx")
// );
// const ExpenseOverview = lazy(() =>
//     import("./ExpenseManagement/ExpenseOverview.jsx")
// );
// const ExpenseManagementUpdate = lazy(() =>
//     import("./ExpenseManagement/ExpenseManagementUpdate.jsx")
// );