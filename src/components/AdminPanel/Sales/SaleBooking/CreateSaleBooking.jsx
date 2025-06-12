import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import CreateRecordServices from "../Account/CreateRecordServices";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import { useGstDetailsMutation } from "../../../Store/API/Sales/GetGstDetailApi";
import { useGetSingleDocumentOverviewQuery } from "../../../Store/API/Sales/DocumentOverview";
import BrandRegistration from "./BrandRegistration";
import Modal from "react-modal";
import {
  useAddSaleBookingMutation,
  useEditSaleBookingMutation,
  useGetIndividualSaleBookingQuery,
} from "../../../Store/API/Sales/SaleBookingApi";

import {
  useEditMultipleRecordServicesMutation,
  useGetSingleRecordServiceQuery,
} from "../../../Store/API/Sales/RecordServicesApi";
import {
  useGetAllCreditApprovalsQuery,
  useGetCreditApprovalDetailQuery,
} from "../../../Store/API/Sales/CreditApprovalApi";

import CampaignModal from "./CampaignModal";
import Loader from "../../../Finance/Loader/Loader";
import EditCampaign from "./EditCampaign";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import convertNumberToIndianString from "../../../../utils/convertNumberToIndianString";
import SalesSubmitDialog from "./SalesSubmitDialog";
import ShareIncentive from "../Account/ShareIncentive";
import FetchSheet from "./FetchSheet";
import { useGetIncentiveSharingDetailsQuery } from "../../../Store/API/Sales/IncentiveSharingApi";
import CreateBrand from "../Account/CreateBrand";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/Sales/BrandCategoryTypeApi";

const todayDate = new Date().toISOString().split("T")[0];

const CreateSaleBooking = () => {
  const { editId, un_id } = useParams();
  const account_info = useLocation();
  const token = getDecodedToken();
  const loginUserId = token.id;

  let newSaleBookingData;

  let loginUserIdForApi;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserIdForApi = token.id;
  }

  const navigate = useNavigate();
  const { loginUserData } = useAPIGlobalContext();
  const {
    data: recordServiceData,
    error: recordServiceError,
    isLoading: recordServiceLoading,
    refetch: recordServiceRefetch,
  } = useGetSingleRecordServiceQuery(editId, { skip: !editId });
  const userCreditLimit = loginUserData?.user_credit_limit;

  const [addsaledata, { isLoading: addsaleLoading, error: addsaleError }] =
    useAddSaleBookingMutation();

  const [
    updateRecordServices,
    {
      isLoading: updateRecordServicesLoading,
      error: updateRecordServicesError,
    },
  ] = useEditMultipleRecordServicesMutation();
  const {
    data: allBrands,
    error: allBrandsError,
    isLoading: allBrandsLoading,
  } = useGetAllBrandQuery();
  const [
    updateSalesBooking,
    { isLoading: updateSalesBookingLoading, error: updateSalesBookingError },
  ] = useEditSaleBookingMutation();
  const {
    data: allAccounts,
    error: allAccoutsError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery(loginUserIdForApi);

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
  } = useGetAllBrandCategoryTypeQuery();

  const {
    data: salesdata,
    error: salesError,
    isLoading: salesLoading,
  } = useGetIndividualSaleBookingQuery(`${un_id}`, { skip: !un_id });
  const { data: serviceTypes } = useGetAllSaleServiceQuery();

  const [getGst, { data: gstData, isLoading: gstLoading, error: gstError }] =
    useGstDetailsMutation();

  const { toastAlert, toastError } = useGlobalContext();
  const [campaignName, setCampaignName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [validateService, setValidateService] = useState([]);
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [addGst, setAddGst] = useState(false);
  const [netAmount, setNetAmount] = useState(0);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState();
  const [creditApprovalList, setCreditApprovalList] = useState([]);
  const [selectedCreditApp, setSelectedCreditApp] = useState("");
  const [reasonCreditApproval, setReasonCreditApproval] = useState("");
  const [selectedReasonDays, setSelectedReasonDays] = useState(0);
  const [selectedReasonType, setSelectedReasonType] = useState("");
  const [balancePayDate, setBalancePayDate] = useState("");
  // const [executiveSelfCredit, setExecutiveSelfCredit] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [incentiveCheck, setIncentiveCheck] = useState(false);
  const [recServices, setRecServices] = useState([]);
  const [gstAvailable, setGstAvailable] = useState();
  const [modalContentType, setModalContentType] = useState(false);
  const [incentiveSharing, setIncentiveSharing] = useState([]);
  const [planLink, setPlanLink] = useState("");
  const [isValidRec, setIsValidRec] = useState([
    {
      sale_booking_id: false,
      sales_service_master_id: false,
      amount: false,
      no_of_hours: false,
      goal: false,
      day: false,
      quantity: false,
      brand_name: false,
      hashtag: false,
      individual_amount: false,
      start_date: false,
      end_date: false,
      per_month_amount: false,
      no_of_creators: false,
      deliverables_info: false,
      remarks: false,
    },
  ]);
  const [isValidate, setIsValidate] = useState({
    campaignName: false,
    selectedAccount: false,
    selectedBrand: false,
    bookingDate: false,
    baseAmount: false,
    selectedPaymentStatus: false,

    excelFile: false,
    selectedCreditApp: false,
    reasonCreditApproval: false,
    balancePayDate: false,
  });

  const [submitDialog, setSubmitDialog] = useState(false);
  const paymentStatusList = [
    {
      value: "sent_for_payment_approval",
      label: "Sent For Payment Approval",
    },
    {
      value: "self_credit_used",
      label: `Use Self Credit (₹${loginUserData.user_available_limit})`,
    },
  ];
  const logToken = sessionStorage.getItem("token");

  const {
    data: singleDocumentOverviewData,
    error: singleDocumentOverviewError,
    isLoading: singleDocumentOverviewLoading,
  } = useGetSingleDocumentOverviewQuery(`${selectedAccount}`, {
    skip: !selectedAccount,
  });

  const {
    refetch: getIncentiveSharingDetails,
    data: getincentiveSharingData,
    isError: getincentiveSharingError,
    isLoading: getincentiveSharingLoading,
  } = useGetIncentiveSharingDetailsQuery(selectedAccount, {
    skip: !selectedAccount,
  });

  const {
    data: allCreditApprovals,
    error: allCreditApprovalsError,
    isLoading: allCreditApprovalsLoading,
  } = useGetAllCreditApprovalsQuery();

  useEffect(() => {
    const fetchcampaign = async () => {
      try {
        const campaignList = await axios.get(
          `${baseUrl}exe_campaign_name_wise`,
          { headers: { Authorization: `Bearer ${logToken}` } }
        );
        setCampaignList(campaignList.data.data);
      } catch (error) {
        toastError(error);
      }
    };

    fetchcampaign();
  }, [modalContentType, allCreditApprovals]);

  useEffect(() => {
    if (gstData) {
      setAddGst(true);
    }
  }, [gstData]);

  useEffect(() => {
    setCreditApprovalList(allCreditApprovals);
  }, [allCreditApprovals]);

  const handleGstChange = (e) => {
    setAddGst(e.target.checked);
    if (!e.target.checked) {
      setGstAmount(0);
    } else {
      const gst = baseAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
    }
  };

  useEffect(() => {
    if (editId) {
      setCampaignName(salesdata?.campaign_id);
      setSelectedAccount(salesdata?.account_id);
      setSelectedBrand(salesdata?.brand_id);
      setBookingDate(salesdata?.sale_booking_date?.split("T")[0]);
      setBaseAmount(salesdata?.base_amount);
      setAddGst(salesdata?.gst_status);
      setGstAmount(salesdata?.gst_amount);
      setNetAmount(salesdata?.campaign_amount);
      setExcelFile(salesdata?.record_service_file);
      setSelectedCreditApp(salesdata?.reason_credit_approval);
      setSelectedPaymentStatus(
        paymentStatusList.find(
          (item) => item.value == salesdata?.payment_credit_status
        )
      );
      setCampaignName(salesdata?.campaign_id);
      setBalancePayDate(salesdata?.balance_payment_ondate?.split("T")[0]);
      setIncentiveCheck(
        salesdata?.incentive_status?.toLowerCase() == "no-incentive"
      );
      setRecServices(recordServiceData);
    }
  }, [salesdata]);
  useEffect(() => {
    if (account_info?.state?.account_data) {
      setSelectedAccount(account_info?.state?.account_data?.account_id);
    }
  }, [account_info?.state?.account_data]);

  useEffect(() => {
    salesdata?.brand_id ||
      setSelectedBrand(
        allAccounts?.find((item) => item?.account_id == selectedAccount)
          ?.brand_id
      );
  }, [selectedAccount, allAccounts]);

  const validateRecordServices = (recServices, validateService) => {
    const errors = [];
    recServices?.forEach((record, index) => {
      if (record.sales_service_master_id === "") {
        setIsValidRec((prev) =>
          prev.map((item, idx) =>
            idx === index ? { ...item, sales_service_master_id: true } : item
          )
        );
        errors.push(`Record ${index + 1}: Service Type is required.`);
      }
      const serviceValidation = validateService.find(
        (service) => service._id === record.sales_service_master_id
      );

      if (serviceValidation) {
        if (serviceValidation.amount_status && !record.amount) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, amount: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Amount is required.`);
        }
        if (serviceValidation.no_of_hours_status && !record.no_of_hours) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, no_of_hours: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Number of Hours is required.`);
        }
        if (serviceValidation.goal_status && !record.goal) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, goal: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Goal is required.`);
        }
        if (serviceValidation.brand_name_status && !record.brand_name) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, brand_name: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Brand Name is required.`);
        }
        if (serviceValidation.quantity_status && !record.quantity) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, quantity: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Quantity is required.`);
        }
        if (serviceValidation.day_status && !record.day) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, day: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Day is required.`);
        }
        if (serviceValidation.hashtag && !record.hashtag) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, hashtag: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Hashtag is required.`);
        }
        if (serviceValidation.start_end_date_status && !record.start_date) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, start_date: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Start Date is required.`);
        }
        if (serviceValidation.start_end_date_status && !record.end_date) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, end_date: true } : item
            )
          );
          errors.push(`Record ${index + 1}: End Date is required.`);
        }
        if (
          serviceValidation.per_month_amount_status &&
          !record.per_month_amount
        ) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, per_month_amount: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Per Month Amount is required.`);
        }
        if (serviceValidation.no_of_creators && !record.no_of_creators) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, no_of_creators: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Number of Creators is required.`);
        }
        if (serviceValidation.deliverables_info && !record.deliverables_info) {
          setIsValidRec((prev) =>
            prev.map((item, idx) =>
              idx === index ? { ...item, deliverables_info: true } : item
            )
          );
          errors.push(`Record ${index + 1}: Deliverables Info is required.`);
        }
      }
    });

    return errors;
  };

  useEffect(() => {
    if (
      singleDocumentOverviewData?.data?.length > 0 &&
      !singleDocumentOverviewLoading
    ) {
      setGstAvailable(
        singleDocumentOverviewData?.data?.find(
          (item) => item?.document_name?.toLowerCase() == "gst no."
        )?.document_no
      );
    }
  }, [
    selectedAccount,
    singleDocumentOverviewData,
    singleDocumentOverviewLoading,
  ]);
  useEffect(() => {
    if (gstAvailable !== undefined)
      getGst({
        // flag: 1,
        gstNo: gstAvailable,
      }).unwrap();
  }, [gstAvailable]);
  useEffect(() => {
    if (addGst) {
      const gst = baseAmount * 0.18;
      const gstRound = gst.toFixed(2);
      setGstAmount(gstRound);
      const net = baseAmount * 1.18;
      const netRound = net.toFixed(2);
      setNetAmount(netRound);
    } else {
      setNetAmount(baseAmount);
    }
  }, [baseAmount, addGst]);

  const handleSubmit = async (e, draft) => {
    e.preventDefault();

    if (!selectedAccount) {
      setIsValidate((prev) => ({ ...prev, selectedAccount: true }));
    }
    if (!selectedBrand) {
      setIsValidate((prev) => ({ ...prev, selectedBrand: true }));
    }
    if (!campaignName) {
      setIsValidate((prev) => ({
        ...prev,
        campaignName: true,
      }));
    }
    if (!bookingDate) {
      setIsValidate((prev) => ({ ...prev, bookingDate: true }));
    }
    if (!baseAmount) {
      setIsValidate((prev) => ({ ...prev, baseAmount: true }));
    }
    if (!selectedPaymentStatus) {
      setIsValidate((prev) => ({ ...prev, selectedPaymentStatus: true }));
    }

    if (!excelFile) {
      setIsValidate((prev) => ({ ...prev, excelFile: true }));
    }
    if (baseAmount === 0) {
      toastError("Base amount cannot be 0");
    }
    if (
      selectedPaymentStatus?.value === "self_credit_used" &&
      !selectedCreditApp
    ) {
      setIsValidate((prev) => ({ ...prev, selectedCreditApp: true }));
    }
    if (
      selectedPaymentStatus?.value === "self_credit_used" &&
      !balancePayDate
    ) {
      setIsValidate((prev) => ({ ...prev, balancePayDate: true }));
    }

    if (
      selectedPaymentStatus?.value === "self_credit_used" &&
      selectedReasonType === "own_reason" &&
      !reasonCreditApproval
    ) {
      setIsValidate((prev) => ({ ...prev, reasonCreditApproval: true }));
    }

    if (
      selectedPaymentStatus?.value === "self_credit_used" &&
      selectedReasonDays > 0 &&
      !balancePayDate
    ) {
      setIsValidate((prev) => ({ ...prev, balancePayDate: true }));
    }

    if (
      selectedPaymentStatus?.value === "self_credit_used" &&
      selectedReasonDays > 0 &&
      balancePayDate < todayDate
    ) {
      toastError("Balance payment date should be greater than today's date.");
    }
    if (
      !selectedAccount ||
      !selectedBrand ||
      !bookingDate ||
      !baseAmount ||
      !selectedPaymentStatus ||
      !excelFile ||
      baseAmount === 0 ||
      (selectedPaymentStatus?.value === "self_credit_used" &&
        !selectedCreditApp) ||
      (selectedPaymentStatus?.value === "self_credit_used" &&
        selectedReasonType === "own_reason" &&
        !reasonCreditApproval) ||
      (selectedPaymentStatus?.value === "self_credit_used" &&
        selectedReasonDays > 0 &&
        !balancePayDate) ||
      (selectedPaymentStatus?.value === "self_credit_used" &&
        selectedReasonDays > 0 &&
        balancePayDate < todayDate)
    ) {
      toastError("Please fill all the required fields.");
      return;
    }

    try {
      // Check if 'sent for payment approval' is selected and there are no record services
      if (
        selectedPaymentStatus?.value === "sent_for_payment_approval" &&
        recServices?.length === 0
      ) {
        toastError(
          "Please add record services before sending for payment approval."
        );
        return;
      }
      setIsValidRec(recServices);

      const recordServiceErrors = validateRecordServices(
        recServices,
        validateService
      );

      if (recordServiceErrors.length > 0) {
        return;
      }

      const formData = new FormData();
      formData.append("plan_link", planLink);
      formData.append("account_id", selectedAccount);
      formData.append("sale_booking_date", bookingDate);
      formData.append("base_amount", baseAmount);
      formData.append("gst_amount", gstAmount);
      formData.append("gst_status", gstAmount !== 0);
      formData.append("net_amount", netAmount);
      formData.append("campaign_amount", netAmount);
      formData.append(
        "campaign_name",
        campaignList.find((item) => item._id === campaignName)
          ?.exe_campaign_name || ""
      );
      formData.append("campaign_id", campaignName);
      formData.append(
        "payment_credit_status",
        selectedPaymentStatus?.value || ""
      );
      formData.append("record_service_file", excelFile);
      formData.append(
        "credit_approval_status",
        selectedPaymentStatus?.value === "self_credit_used"
          ? "self_credit_used"
          : "pending"
      );

      if (selectedPaymentStatus?.value === "self_credit_used") {
        formData.append("reason_credit_approval", selectedCreditApp);
        formData.append(
          "reason_credit_approval_own_reason",
          reasonCreditApproval
        );
      }

      formData.append("brand_id", selectedBrand || "");
      formData.append("balance_payment_ondate", balancePayDate);
      formData.append(
        "incentive_status",
        incentiveCheck ? "no-incentive" : "incentive"
      );
      formData.append("is_draft_save", draft);
      if (baseAmount === 0) {
        toastError("Base amount cannot be 0");
        return;
      }
      getincentiveSharingData?.services?.length > 0
        ? (formData.append("is_incentive_sharing", true),
          formData.append(
            "account_percentage",
            getincentiveSharingData?.account_percentage
          ))
        : formData.append("is_incentive_sharing", false);
      const recServiceData = recServices.map((record) => {
        return {
          ...record,
          service_percentage: getincentiveSharingData?.services?.find(
            (data) => data.service_id === record?.sales_service_master_id
          )?.service_percentage,
          incentive_sharing_users_array:
            getincentiveSharingData?.services?.find(
              (data) => data?.service_id === record?.sales_service_master_id
            )?.incentive_sharing_users,
        };
      });

      if (editId === undefined) {
        formData.append("created_by", loginUserId);
        formData.append("record_services", JSON.stringify(recServiceData));

        const salesResponse = await addsaledata(formData).unwrap();

        // newSaleBookingId = salesResponse.data.sale_booking_id;
        newSaleBookingData = salesResponse.data;
      } else {
        // For updating an existing sale booking
        formData.append("updated_by", loginUserId);

        // Convert FormData to an object for updating
        const formDataObj = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });

        await updateSalesBooking({ ...formDataObj, id: un_id }).unwrap();
        await updateRecordServices({
          id: editId,
          record_services: recServiceData,
          is_incentive_sharing: getincentiveSharingData?.services?.length > 0,
          account_percentage:
            getincentiveSharingData?.account_percentage || 100,

          old_sales_booking_created_by: salesdata.created_by,
          updated_by: loginUserId,
        }).unwrap();
      }

      toastAlert(
        `Sale booking ${editId ? "updated" : "created"} successfully.`
      );
      setSubmitDialog(true);
      openModal("SalesSumitDialog");

      // if (selectedPaymentStatus?.value === "sent_for_payment_approval") {
      //   navigate(`/admin/sales/create-payment-update/0`, {
      //     state: { sales_user: newSaleBookingData }, // your additional data here
      //   });
      // } else {
      //   navigate("/admin/sales/view-sales-booking");
      // }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 666) {
        toastError("Sale booking created but email not sent");
        navigate("/admin/sales/view-sales-booking");
        return;
      }

      toastError(
        error.message || "An error occurred while creating the sale booking."
      );
    }
  };

  const handlePaymentStatusSelect = (selectedOption) => {
    setSelectedPaymentStatus(selectedOption);
    setIsValidate((prev) => ({ ...prev, selectedPaymentStatus: false }));
  };

  const handleReasonCreditApp = (selectedOption) => {
    setSelectedCreditApp(selectedOption.value);
    setSelectedReasonDays(selectedOption.days);
    setSelectedReasonType(selectedOption.reasonType);
    setReasonCreditApproval("");
    setIsValidate((prev) => ({ ...prev, selectedCreditApp: false }));
    setIsValidate((prev) => ({ ...prev, balancePayDate: false }));
  };
  useEffect(() => {
    if (selectedReasonDays > 0) {
      const currentDate = new Date();
      const newDate = new Date(
        currentDate.setDate(currentDate.getDate() + selectedReasonDays)
      );
      setBalancePayDate(newDate.toISOString().split("T")[0]);
    }
  }, [selectedReasonDays]);

  const handleAddRecServices = () => {
    setRecServices([
      ...recServices,
      {
        sale_booking_id: "",
        sales_service_master_id: "",
        amount: remainingAmount,
        no_of_hours: "",
        goal: "",
        day: "",
        quantity: "",
        brand_name: "",
        hashtag: "",
        individual_amount: "",
        start_date: "",
        end_date: "",
        per_month_amount: "",
        no_of_creators: "",
        deliverables_info: "",
        remarks: "",
        created_by: loginUserId,
      },
    ]);
  };

  const openModal = (contentType) => {
    setModalContentType(contentType);
  };

  const closeModal = () => {
    setModalContentType(null);
  };

  useEffect(() => {
    if (selectedBrand !== null) {
      setIsValidate((prev) => ({ ...prev, selectedBrand: false }));
    }
  }, [selectedBrand]);
  useEffect(() => {
    if (selectedAccount !== null) {
      setIsValidate((prev) => ({ ...prev, selectedAccount: false }));
    }
  }, [selectedAccount]);
  useEffect(() => {
    if (campaignName !== "") {
      setIsValidate((prev) => ({ ...prev, campaignName: false }));
    }
  }, [campaignName]);

  let load;
  if (
    singleDocumentOverviewLoading ||
    allAccountLoading ||
    allBrandsLoading ||
    allCreditApprovalsLoading ||
    salesLoading ||
    updateRecordServicesLoading ||
    addsaleLoading ||
    updateSalesBookingLoading ||
    recordServiceLoading
  )
    load = true;
  else load = false;

  const renderModalContent = () => {
    switch (modalContentType) {
      case "SheetLink":
        return (
          <FetchSheet
            closeModal={closeModal}
            setExcelFile={setExcelFile}
            excelFile={excelFile}
            setPlanLink={setPlanLink}
          />
        );
      case "ShareIncentive":
        return (
          <ShareIncentive
            setIncentiveSharing={setIncentiveSharing}
            incentiveSharing={incentiveSharing}
            closeModal={closeModal}
          />
        );
      case "SalesSumitDialog":
        return (
          <SalesSubmitDialog
            response={"Success"}
            selectedPaymentStatus={selectedPaymentStatus}
            id={editId}
            setSubmitDialog={setSubmitDialog}
            closeModal={closeModal}
            newSaleBookingData={newSaleBookingData}
          />
        );

      case "CampaignModal":
        return (
          <CampaignModal
            loginUserId={loginUserId}
            selectedBrand={selectedBrand}
            setCampaignName={setCampaignName}
            allBrands={allBrands}
            closeModal={closeModal}
          />
        );

      case "EditCampaign":
        return (
          <EditCampaign
            loginUserId={loginUserId}
            campaignList={campaignList}
            campaignName={campaignName}
            closeModal={closeModal}
          />
        );
      case "addBrand":
        return (
          <CreateBrand
            allBrandCatType={allBrandCatType}
            loginUserId={loginUserId}
            closeModal={closeModal}
            accountName={
              allAccounts?.find((item) => item?.account_id === selectedAccount)
                ?.account_name
            }
            setSelectedBrand={setSelectedBrand}
            setSelectedCategoryParent={setSelectedCategory}
            id={0}
            selectedBrand={selectedBrand}
          />
        );
    }
  };

  return (
    <>
      {load && <Loader />}
      <Modal
        className="salesModal"
        isOpen={modalContentType}
        onRequestClose={closeModal}
        contentLabel="modal"
        preventScroll={true}
        shouldCloseOnOverlayClick={false}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            maxWidth: "900px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <div className="d-flex">
          <div className="icon-1 flex-end" onClick={() => closeModal()}>
            <i className="bi bi-x" />
          </div>
        </div>
        {renderModalContent()}
      </Modal>

      <FormContainer mainTitle="Sale Booking" link={true} />
      {/* <div className="w-100">
        <div className="card gstinfo-card flex-row sb">
          {gstLoading && <p>Loading...</p>}
          {gstError && toastError(gstError)}
          {!gstLoading && (
            <>
              <p>
                {" "}
                Sales Executive Credit Limit:{" "}
                <span>{userCreditLimit} Total Used</span>
              </p>

              <p>
                Sales Executive Credit Limit:{" "}
                <span>10000 Total Available Credit</span>
              </p>

              <p>
                Limit:
                <span>20000</span>
              </p>
            </>
          )}
        </div>
      </div> */}
      <>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Create</h5>
          </div>
          <div className="card-body row">
            {/* <FieldContainer
              fieldGrid={4}
              astric
              label="Campaign Name"
              placeholder="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            /> */}
            <div className="col-4">
              <CustomSelect
                fieldGrid={12}
                label="Accounts"
                dataArray={allAccounts}
                optionId="account_id"
                optionLabel="account_name"
                selectedId={selectedAccount}
                setSelectedId={setSelectedAccount}
                disabled={account_info?.state?.account_data}
                required
              />
              Account Type:{" "}
              <span style={{ color: "green" }}>
                {
                  allAccounts?.find(
                    (item) => item?.account_id == selectedAccount
                  )?.account_type_name
                }
              </span>
              {isValidate.selectedAccount && (
                <div className="form-error">Please select an account</div>
              )}
            </div>
            <div className="col-4  gap-2">
              <div className="col-12 flex-row">
                <CustomSelect
                  fieldGrid={10}
                  label="Brand"
                  dataArray={allBrands}
                  optionId="_id"
                  optionLabel="brand_name"
                  selectedId={selectedBrand}
                  setSelectedId={setSelectedBrand}
                  required
                  disabled={
                    (account_info?.state &&
                      account_info?.state?.account_data?.account_type_name !==
                        "Agency") ||
                    allAccounts?.find(
                      (item) => item?.account_id == selectedAccount
                    )?.account_type_name !== "Agency"
                  }
                />
                <button
                  type="button"
                  className="btn iconBtn btn-outline-primary mt25"
                  disabled={!selectedAccount}
                  onClick={() => openModal("addBrand")}
                >
                  +
                </button>
              </div>
              {isValidate.selectedBrand && (
                <div className="form-error ml-4">Please select a brand</div>
              )}

              {/* <div className="col-1 mt-4 flex-row gap-1">
                <div className="mt-2">
                  <button className="btn cmnbtn btn-primary">
                    <BrandRegistration userID={loginUserId} />
                  </button>
                </div>
              </div> */}
            </div>
            <div className="col-4 flex-row gap-2">
              <div className="col-10">
                <CustomSelect
                  fieldGrid={12}
                  placeholder="Enter campaign Name"
                  label="Campaign Name"
                  dataArray={campaignList?.filter((data) =>
                    editId ? data : !data.is_sale_booking_created
                  )}
                  optionId="_id"
                  optionLabel="exe_campaign_name"
                  selectedId={campaignName}
                  setSelectedId={setCampaignName}
                  disabled={editId ? true : false}
                  required
                />
                {isValidate.campaignName && (
                  <div className="form-error">Please enter a campaign name</div>
                )}
              </div>
              {
                <div className="col-md-4 mt-2 flex-row gap-2">
                  <button
                    title="edit"
                    type="button"
                    className="btn cmn btn_sm btn btn-primary mt-4 "
                    onClick={() =>
                      openModal(editId ? "EditCampaign" : "CampaignModal")
                    }
                  >
                    {editId ? <i className="bi bi-pencil" /> : "+"}
                  </button>
                </div>
              }
            </div>
            {gstAvailable && (
              <div className="col-12">
                <div className="card gstinfo-card">
                  {gstLoading && <p>Loading...</p>}
                  {!gstLoading && (
                    <>
                      <p>
                        {" "}
                        Company Name:{" "}
                        <span>{gstData?.legal_name?.value || "N/A"}</span>
                      </p>

                      <p>
                        GST No.: <span>{gstData?.gstin?.value || "N/A"}</span>
                      </p>

                      <p>
                        Address:
                        <span>{gstData?.primary_address?.value || "N/A"}</span>
                      </p>
                      <p>
                        Registration Date:
                        <span>
                          {DateISOtoNormal(gstData?.registration_date?.value) ||
                            "N/A"}
                        </span>
                      </p>
                      <p>
                        Constitution:
                        <span>{gstData?.constitution?.value || "N/A"}</span>
                      </p>
                      <p>
                        Status:
                        <span>{gstData?.status?.value || "N/A"}</span>
                      </p>
                      <p>
                        Tax Payer Type:
                        <span>{gstData?.tax_payer_type?.value || "N/A"}</span>
                      </p>
                      <p>
                        Trade Name:
                        <span>{gstData?.trade_name?.value || "N/A"}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            <FieldContainer
              label="Sale Booking Date"
              fieldGrid={4}
              astric={true}
              type="date"
              value={bookingDate}
              max={todayDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            <div className="col-4">
              <FieldContainer
                label="Base Amount"
                fieldGrid={12}
                placeholder="Enter amount here"
                astric={true}
                type="number"
                value={baseAmount}
                onChange={(e) => {
                  setBaseAmount(e.target.value);
                  setIsValidate({
                    ...isValidate,
                    baseAmount: e.target.value === "",
                  });
                }}
              />
              {isValidate.baseAmount && (
                <div className="form-error">Please enter Base Amount</div>
              )}
              <span className="successText">
                {convertNumberToIndianString(baseAmount)}
              </span>

              {/* <div className="col-md-6 flex-row">
                <button
                  type="button"
                  className="btn cmnbtn btn-primary"
                  onClick={() => {
                    openModal("ShareIncentive");
                  }}
                >
                  Share Incentive
                </button>
              </div> */}

              <div className="form-group ml-4 sb form-sub d-flex">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="addGst"
                  checked={addGst}
                  onChange={handleGstChange}
                />
                <label className="mt-3" htmlFor="addGst">
                  +18% GST
                </label>
              </div>

              {/* <div className="flex-col gap-1 ">
                  <p>Gst Amount: Rs.{gstAmount}</p>
                  <p>Net / Campaign Amount: Rs.{netAmount}</p>
                </div> */}
            </div>

            {
              <>
                <div className="col-4">
                  <FieldContainer
                    label="GST Amount"
                    fieldGrid={12}
                    type="number"
                    value={gstAmount}
                    disabled={true}
                  />
                  <span className="successText">
                    {convertNumberToIndianString(gstAmount)}
                  </span>
                </div>
                <div className="col-4">
                  <FieldContainer
                    label="Net / Campaign Amount"
                    fieldGrid={12}
                    type="number"
                    value={netAmount}
                    disabled={true}
                  />
                  <span className="successText">
                    {convertNumberToIndianString(netAmount)}
                  </span>
                </div>
              </>
            }

            <div className="form-group col-4">
              <label className="form-label">
                Payment Status <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={paymentStatusList}
                value={selectedPaymentStatus}
                onChange={handlePaymentStatusSelect}
                required
              />
              {selectedPaymentStatus?.value == "self_credit_used" &&
                netAmount > loginUserData?.user_credit_limit && (
                  <div className="d-flex flex-column">
                    <div style={{ color: "red" }}>
                      Limit is exausted, Please update payment details or ask
                      admin to increase limit.
                    </div>
                    <div style={{ color: "green" }}>
                      Increase By : ₹
                      {netAmount - loginUserData?.user_credit_limit}
                    </div>
                  </div>
                )}

              {isValidate.selectedPaymentStatus && (
                <div className="form-error">Please select a payment status</div>
              )}
            </div>

            {selectedPaymentStatus?.value === "self_credit_used" && (
              <>
                <div className="form-group col-4">
                  <label className="form-label">
                    Payment Terms<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={creditApprovalList?.map((option) => ({
                      days: option.day_count,
                      value: option._id,
                      label: option.reason,
                      reasonType: option.reason_type,
                    }))}
                    value={{
                      value: selectedCreditApp,
                      label:
                        creditApprovalList?.find(
                          (item) => item?._id == selectedCreditApp
                        )?.reason || "",
                    }}
                    onChange={handleReasonCreditApp}
                    required
                  />
                  {isValidate.selectedCreditApp && (
                    <div className="form-error">Please select a reason</div>
                  )}
                </div>
                {selectedReasonType === "own_reason" && (
                  <div className="col-4">
                    <FieldContainer
                      label="Reason Credit Approval"
                      placeholder={"Enter Reason"}
                      fieldGrid={12}
                      value={reasonCreditApproval}
                      onChange={(e) => {
                        setReasonCreditApproval(e.target.value);
                        setIsValidate({
                          ...isValidate,
                          reasonCreditApproval: e.target.value === "",
                        });
                      }}
                      required={selectedReasonType === "own_reason"}
                      astric={selectedReasonType === "own_reason"}
                    />
                    {isValidate.reasonCreditApproval && (
                      <div className="form-error">Please enter a reason</div>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="col-4 ">
              <FieldContainer
                label="Balance Payment Date"
                type="date"
                fieldGrid={12}
                value={balancePayDate}
                onChange={(e) => {
                  setBalancePayDate(e.target.value);

                  setIsValidate((prev) => ({
                    ...prev,
                    balancePayDate: e.target.value === "",
                  }));
                }}
                required={selectedPaymentStatus?.value === "self_credit_used"}
                astric={selectedPaymentStatus?.value === "self_credit_used"}
              />
              {isValidate.balancePayDate && (
                <div className="form-error">
                  Please select a balance payment date
                </div>
              )}
            </div>
            <div className="col-4 flex-row gap-2">
              <div className={`${editId ? "col-10" : "col-12"}`}>
                <FieldContainer
                  label="Plan Upload"
                  type="file"
                  name="Image"
                  fieldGrid={12}
                  accept=".xls, .xlsx"
                  onChange={(e) => {
                    setExcelFile(e.target.files[0]),
                      setIsValidate({
                        ...isValidate,
                        excelFile: e.target.files[0] === null,
                      });
                  }}
                  required={true}
                  astric
                />
                {isValidate.excelFile && (
                  <div className="form-error">Please upload an excel file</div>
                )}
              </div>
              {editId && (
                <>
                  <div className="mt-2">
                    <a
                      href={salesdata?.recordServiceFileURL}
                      title="download Excel File"
                    >
                      <button className="cmnbtn btn btn-primary btn_sm mt-4">
                        <i className="bi bi-download "></i>
                      </button>
                    </a>
                    File: {salesdata?.record_service_file}
                  </div>
                </>
              )}

              <div className="form-group col-3 mt-5 mr-2 pl-4">
                <input
                  className="form-check-input "
                  type="checkbox"
                  checked={incentiveCheck}
                  onChange={(e) => setIncentiveCheck(e.target.checked)}
                />

                <label className="mr-2 d-flex">
                  No Incentive
                  <i
                    style={{ cursor: "pointer" }}
                    className="bi bi-info-circle-fill warningText"
                    title="Please enable no incentive in case of competitive pricing."
                  />
                </label>
              </div>
            </div>
            {/* sheet link  */}
            {/* <div className="col-md-6 flex-row pb-3">
              <button
                type="button"
                className="btn cmnbtn btn-primary"
                onClick={() => {
                  openModal("SheetLink");
                }}
              >
                Upload Sheet Link
              </button>
            </div> */}
          </div>
        </div>

        <CreateRecordServices
          records={recServices}
          setRecords={setRecServices}
          serviceTypes={serviceTypes}
          baseAmount={baseAmount}
          setValidateService={setValidateService}
          isValidRec={isValidRec}
          setIsValidRec={setIsValidRec}
          getincentiveSharingData={getincentiveSharingData}
          setRemainingAmount={setRemainingAmount}
          remainingAmount={remainingAmount}
        />
        {/* <ExcelToInputFields /> */}
        <div className="flex-row sb">
          <button
            className="btn cmnbtn btn-primary mb-4"
            onClick={(e) => handleSubmit(e, !recServices?.length > 0)}
          >
            {recServices?.length > 0
              ? addsaleLoading ||
                updateSalesBookingLoading ||
                updateRecordServicesLoading
                ? "Submitting"
                : "Submit"
              : "Save as Draft"}
          </button>
          <button
            className="btn cmnbtn btn-secondary mb-4"
            onClick={handleAddRecServices}
          >
            Add Record Service
          </button>
        </div>
      </>
    </>
  );
};

export default CreateSaleBooking;
