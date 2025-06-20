import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
// import PlanPricing from '../plan-making/PlanPricing';
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
// import { FaEdit } from 'react-icons/fa';
import Swal from "sweetalert2";
import View from "../../AdminPanel/Sales/Account/View/View";
import AddIcon from "@mui/icons-material/Add";
// import FormContainer from '../../AdminPanel/FormContainer';
import jwtDecode from "jwt-decode";
import {
  useGetAllPageListQuery,
  useGetOperationContentCostQuery,
  useUpdateOperationContentCostMutation,
} from "../../Store/PageBaseURL";
import PlanXStatusDialog from "../plan-making/StatusDialog";
//   import PlanXHeader from "./PlanXHeader";
import PageDialog from "../plan-making/PageDialog";
// import { CiStickyNote } from 'react-icons/ci';
import PlanXNoteModal from "../plan-making/PlanXNoteModal";
import DataGridOverviewColumns from "../plan-making/DataGridOverviewColumns";
import numberToWords from "../../../utils/convertNumberToIndianString";
import CostUpdateModal from "../plan-making/CostUpdateModa";
import DateWiseFilter from "../plan-making/DateWiseFilter";
import HighestPlanRequest from "../plan-making/HighestPlanRequest";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import DateSelector from "./DateSelector";

function PlanHomeBeta() {
  const navigate = useNavigate();
  const { data: getOperationContentCost, isLoading } =
    useGetOperationContentCostQuery();
  const [updateOperationContentCost] = useUpdateOperationContentCostMutation();
  const [activeTab, setActiveTab] = useState("Tab1");
  const [openDialog, setOpenDialog] = useState(false);
  const [openPageDialog, setPageDialog] = useState(false);
  const [planRows, setPlanRows] = useState([]);
  const [filteredPlanRows, setFilteredPlanRows] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [duplicatePlanId, setDuplicatePlanId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusDialogPlan, setStatusDialogPlan] = useState(null);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [planxLoading, setPlanxLoading] = useState(false)
  const [selectedPages, setSelectedPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [priceFormData, setPriceFormData] = useState();
  const [descriptions, setDescriptions] = useState([]);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState();
  const [searchValue, setSearchValue] = useState();
  const [selectedOption, setSelectedOption] = useState("current");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { toastError } = useGlobalContext();
  const { loginUserData: jobType, contextData } = useAPIGlobalContext();
  const [planDetails, setPlanDetails] = useState({
    planName: "",
    costPrice: "",
    sellingPrice: "",
    brandType: "existing",
    noOfPages: "",
    postCount: "",
    storyCount: "",
    description: "",
    salesExecutiveId: "",
    accountId: "",
    brandId: "",
    brief: "",
    planStatus: "open",
    planSaved: false,
    createdBy: 938,
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const storedToken = sessionStorage.getItem("token");
  const { id } = jwtDecode(storedToken);
  const decodedToken = jwtDecode(storedToken);
  const [pagequery, setPagequery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(1);
  console.log("first reached")
  const generateSuggestions = (value) => {
    const baseValue = parseFloat(value) || 0;
    if (baseValue === 0) return [];

    const units = [
      { multiplier: 1000, label: "k" },
      { multiplier: 100000, label: "lakh" },
      { multiplier: 10000000, label: "crore" },
    ];

    return units.map((unit) => {
      const multipliedValue = baseValue * unit.multiplier;
      const labelValue =
        multipliedValue >= unit.multiplier
          ? multipliedValue / unit.multiplier
          : baseValue;

      return {
        value: multipliedValue,
        label: `${labelValue} ${unit.label}`,
      };
    });
  };

  const handleInputChangeWithSuggestions = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update the displayed input value
    if (value <= 100) {
      setSuggestions(generateSuggestions(value));
    }
  };
  const handleCostInputChange = (e) => {
    setPriceFormData({ ...priceFormData, [e.target.name]: e.target.value });
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.value);
    handleInputChange({
      target: { name: "sellingPrice", value: suggestion.value },
    }); // Update the parent state
    setSuggestions([]); // Clear suggestions after selection
  };
  const { data: pageList, isLoading: isPageListLoading } =
    useGetAllPageListQuery({ decodedToken, id, pagequery });

  const { userContextData } = useAPIGlobalContext();

  const userID = decodedToken.id;

  const salesUsers = userContextData?.filter(
    (user) => user?.department_name === "Sales"
  );
  const globalFilteredUsers = userContextData?.filter((user) =>
    user?.user_name?.toLowerCase()?.includes(searchInput?.toLowerCase())
  );
  const fetchDescriptions = async () => {
    try {
      const response = await fetch(`${baseUrl}v1/planxnote`);
      if (response.ok) {
        const data = await response.json();
        setDescriptions(data?.data);
      } else {
        console.error("Failed to fetch descriptions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchDescriptions();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleAddDescription = async (newDescription) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}v1/planxnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "ABCD",
          description: newDescription,
          status: "InActive",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const description = result.data;
        setDescriptions((prev) => [...prev, description]);
      } else {
        console.error("Failed to add description");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDescription = async (index) => {
    const currentDescription = descriptions[index];
    const newDescription = prompt(
      "Enter new description:",
      currentDescription.description
    );

    try {
      const response = await fetch(`${baseUrl}v1/planxnote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentDescription._id,
          title: "ABCD",
          description: newDescription,
          status: "Active",
        }),
      });

      if (response.ok) {
        // Update the description in the state
        setDescriptions((prev) =>
          prev.map((desc, i) =>
            i === index ? { ...desc, description: newDescription } : desc
          )
        );
      } else {
        console.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handlePlanxNoteStatusChange = async (index, status) => {
    const currentDescription = descriptions[index];
    try {
      const response = await fetch(`${baseUrl}v1/planxnote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentDescription._id,
          status: status,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // console.log('PUT result:', result);

        // Update the status in the state
        setDescriptions((prev) =>
          prev.map((desc, i) =>
            i === index ? { ...desc, status: status } : desc
          )
        );
      } else {
        console.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isShowPlan =
    contextData && contextData[72] && contextData[72].view_value === 1;

  const handleDeleteDescription = async (index) => {
    const descriptionToDelete = descriptions[index];

    try {
      const response = await fetch(
        `${baseUrl}v1/planxnote/${descriptionToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // console.log('Successfully deleted:', descriptionToDelete);

        setDescriptions((prev) => prev.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete description");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${baseUrl}accounts/get_all_account`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!planDetails.planName) newErrors.planName = "Plan Name is required";
    if (!inputValue) newErrors.inputValue = "Budget is required";
    if (
      (planDetails.brandType === "existing" && !planDetails.accountId) ||
      !planDetails.accountName
    ) {
      newErrors.accountName = "Account Name is required";
      setTimeout(() => {
        newErrors.accountName = "";
        setErrors({ ...newErrors });
      }, 5000);
    }
    if (!planDetails.salesExecutiveId)
      newErrors.salesExecutiveId = "Sales Executive is required";
    return newErrors;
  };

  const fetchPlans = async ({
    page = 1,
    limit = 10,
    search = "",
    startDate,
    endDate,
  } = {}) => {
    setLoading(true);
    try {
      const queryParams = [];
      if (page) queryParams.push(`page=${page}`);
      if (limit) queryParams.push(`limit=${limit}`);
      if (search) queryParams.push(`plan_name=${encodeURIComponent(search)}`);
      if (!search) {
        if (startDate) queryParams.push(`startDate=${startDate}`);
        if (endDate) queryParams.push(`endDate=${endDate}`);
      }

      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const response = await fetch(`${baseUrl}v1/planxlogs${queryString}`);
      const data = await response.json();
      if (data.success) {
        const formattedRows = data?.data?.data
          ?.filter((plan) => plan.plan_status !== 'pricing')
          ?.map((plan) => ({
            sales_executive_name: plan.sales_executive_name,
            brief: plan.brief,
            plan_status: plan.plan_status,
            created_by_name: plan.created_by_name,
            id: plan._id,
            platformCount: plan.no_of_pages,
            planName: plan.plan_name,
            costPrice: plan.cost_price,
            sellingPrice: plan.selling_price,
            pages: plan.no_of_pages,
            postCount: plan.post_count,
            storyCount: plan.story_count,
            description: plan.description,
            account_id: plan.account_id,
            sales_executive_id: plan.sales_executive_id,
            account_name: plan.account_name,
            createdAt: plan.createdAt,
            not_available_pages: plan.not_available_pages,
            brand_id: plan.brand_id,
            planx_log_file: plan.planx_log_file,
            own_pages_cost_price: plan.own_pages_cost_price,
            sales_executive_created: plan.sales_executive_created,
          }));

        setPlanRows(formattedRows);
        setFilteredPlanRows(formattedRows);
        // setTotalPages(data?.data?.data.)
        // Optional: total pages if API returns pagination meta
        setTotalPages(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setLoading(false);
  };

  // const filterPlans = (criteria) => {
  //   let filtered;
  //   const today = new Date();
  //   const startOfToday = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   );
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   const startOfLastMonth = new Date(
  //     today.getFullYear(),
  //     today.getMonth() - 1,
  //     1
  //   );
  //   const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  //   switch (criteria) {
  //     case "today":
  //       filtered = planRows.filter(
  //         (plan) => new Date(plan.createdAt) >= startOfToday
  //       );
  //       break;
  //     case "thisMonth":
  //       filtered = planRows.filter(
  //         (plan) => new Date(plan.createdAt) >= startOfMonth
  //       );
  //       break;
  //     case "lastMonth":
  //       filtered = planRows.filter((plan) => {
  //         const createdAt = new Date(plan.createdAt);
  //         return createdAt >= startOfLastMonth && createdAt <= endOfLastMonth;
  //       });
  //       break;
  //     case "RequestPlan":
  //       filtered = planRows.filter((plan) => plan?.sales_executive_created);
  //       break;
  //     default:
  //       filtered = planRows; // Show all plans
  //   }
  //   setFilteredPlans(filtered);
  // };

  // Updated handleRowClick to handle "Duplicate" action
  const handleRowClick = (params) => {
    const planId = params.id; // Get the plan's _id from the clicked row
    navigate(`/admin/inventory/pms-plan-making-beta/${planId}`);
  };
  const handleEditClick = (row) => {
    const selectedAccount = accounts.find((acc) => acc._id === row.account_id);
    const selectedUser = userContextData.find(
      (user) => user.user_id === row.sales_executive_id
    );

    setPlanDetails({
      planName: row.planName,
      costPrice: row.costPrice,
      sellingPrice: row.sellingPrice,
      noOfPages: row.pages,
      postCount: row.postCount,
      storyCount: row.storyCount,
      description: row.description,
      salesExecutiveId: row.sales_executive_id,
      accountId: row.account_id,
      brandId: row.brandId,
      brief: row.brief,
      brandType: "existing",
      brand_id: row.brand_id,
      planStatus: row.plan_status,
      planSaved: false,
      createdBy: row.created_by,
      accountName: selectedAccount ? selectedAccount.account_name : '',
      salesExecutiveName: selectedUser ? selectedUser.user_name : '',
    });
    setSelectedPlanId(row.id);
    setIsEdit(true);
    setOpenDialog(true);
  };

  // Fetch accounts data from API
  useEffect(() => {
    fetchAccounts();
    fetchPlans({
      page: page,
      limit: limit,
      search: search,
      startDate: startDate,
      endDate: endDate,
    });
    if (getOperationContentCost) {
      setPriceFormData(getOperationContentCost);
    }
  }, [getOperationContentCost, page, search, startDate, endDate]);
  const handlePlanMaking = () => {
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle account selection
    if (name === "accountName") {
      const selectedAccount = accounts.find(
        (account) => account.account_name === value
      );
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        accountName: selectedAccount ? selectedAccount.account_name : "",
        accountId: selectedAccount ? selectedAccount._id : "",
        brandId: selectedAccount ? selectedAccount.brand_id : "",
      }));
    }
    // Handle user selection from userContextData
    else if (name === "salesExecutiveId") {
      const selectedUser = userContextData.find(
        (user) => user.user_name === value
      );
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        salesExecutiveId: selectedUser ? selectedUser._id : "",
      }));
    } else {
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleOpenDialog = (pages) => {
    setSelectedPages(pages);
    setPageDialog(true);
  };
  const handleClosePageDialog = () => {
    setPageDialog(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 1048576) {
      // 1MB = 1048576 bytes
      toastError("File size exceeds 1MB. Please select a smaller file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleFormSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitLoader(true);
    // Create a FormData object
    const formData = new FormData();

    // Append plan data to formData
    formData.append("plan_name", planDetails.planName);
    // formData.append('cost_price', parseFloat(planDetails.costPrice));
    formData.append("selling_price", parseFloat(inputValue));
    // formData.append('no_of_pages', parseInt(planDetails.noOfPages, 10));
    // formData.append('post_count', parseInt(planDetails.postCount, 10));
    // formData.append('story_count', parseInt(planDetails.storyCount, 10));
    formData.append("description", planDetails.description);
    formData.append("sales_executive_id", planDetails.salesExecutiveId);
    if (planDetails.accountId) {
      formData.append("account_id", planDetails?.accountId);
    }
    if (planDetails.brandId || planDetails.brand_id) {
      formData.append(
        "brand_id",
        planDetails?.brandId || planDetails?.brand_id
      );
    }
    if (planDetails.brandType === 'new') {
      formData.append('soft_account_name', planDetails.accountName); 
    }
    // content_cost,
    // twitter_trend_cost,
    // ugc_video_cost,
    // twitter_trend_count,
    // ugc_video_count,
    // twitter_trend_serviceName,
    // net_profit,
    formData.append("ugc_video_cost", Number(priceFormData?.ugc_video_cost));
    formData.append("content_cost", Number(priceFormData?.content_cost));
    formData.append(
      "twitter_trend_cost",
      Number(priceFormData?.twitter_trend_cost)
    );
    formData.append("brief", planDetails?.brief);
    formData.append("plan_status", planDetails?.planStatus);
    formData.append("plan_saved", planDetails?.planSaved);
    // if (planDetails.createdBy) {
    formData.append("created_by", userID);
    // }

    if (isEdit) {
      formData.append("id", selectedPlanId);
    }
    if (duplicatePlanId) {
      formData.append("duplicate_planx_id", duplicatePlanId);
    }
    if (file) {
      formData.append("planxlogfile", file);
    }

    try {
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(`${baseUrl}v1/planxlogs`, {
        method,
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Swal.fire({
        //   icon: 'success',
        //   title: `Plan saved successfully! ${
        //     isEdit ? '' : `Total plan created ${result.data.totalRecords}`
        //   }`,
        //   preConfirm: () => {
        //     const planId = result.data._id;
        //     isEdit ? '' : navigate(`/admin/inventory/pms-plan-making/${planId}`);
        //   },
        // });
        const planId = result.data._id;
        if (isEdit) {
          fetchPlans();
        } else {
          navigate(`/admin/inventory/pms-plan-making/${planId}`);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to save plan",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again later.",
      });
    }
    setSubmitLoader(false);
    setOpenDialog(false);
    setIsEdit(false);
    setSelectedPlanId(null);
  };

  const isSubmitDisabled =
    submitLoader ||
    !planDetails.planName ||
    !inputValue ||
    (planDetails.brandType === "existing" && !planDetails.accountId) ||
    !planDetails.salesExecutiveId;
  const handleDuplicateClick = (params) => {
    const planId = params.id;
    setDuplicatePlanId(planId);

    // Clear the form fields
    setPlanDetails({
      planName: "",
      costPrice: "",
      sellingPrice: "",
      noOfPages: "",
      postCount: "",
      storyCount: "",
      description: "",
      salesExecutiveId: "",
      accountId: "",
      brandId: "",
      brief: "",
      brandType: "existing",
      planStatus: "open",
      planSaved: false,
      createdBy: 938,
    });

    setOpenDialog(true);
  };

  const handleStatusChange = (row) => {
    setStatusDialog(true);
    setStatusDialogPlan(row);
    setSelectedPlanId(row.id);
  };
 
  const { columns } = DataGridOverviewColumns({
    handleOpenDialog,
    handleStatusChange,
    handleDuplicateClick,
    handleRowClick,
    handleEditClick,
    isShowPlan,
  });

  const sortedPlanRows = planRows.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const finalPlanList = filteredPlans.length ? filteredPlans : sortedPlanRows;
  const dateWiseFilteredData = filteredPlanRows;
  useEffect(() => {
    if (inputValue <= 100) {
      setSuggestions(generateSuggestions(inputValue));
    }
  }, [inputValue]);

  const handleCostUpdate = async () => {
    try {
      await updateOperationContentCost(priceFormData);
      alert("Updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div>
      <PageDialog
        open={openPageDialog}
        onClose={handleClosePageDialog}
        notFoundPages={selectedPages}
      />
      {/* Plan Making Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          minWidth: 500,
        }}
      >
        <DialogTitle>{isEdit ? "Edit Plan" : "Create a New Plan"}</DialogTitle>
        <DialogContent>
          <div
            className="thm_form pt8 d-flex flex-column rowGap12"
            style={{ width: "30rem" }}
          >
            {/* Toggle between Existing or New Brand/Agency */}
            <TextField
              select
              label="Brand/Agency Type *"
              value={planDetails.brandType || "existing"}
              onChange={(e) =>
                setPlanDetails((prevDetails) => ({
                  ...prevDetails,
                  brandType: e.target.value,
                  accountName:
                    e.target.value === "new" ? "" : planDetails.accountName,
                }))
              }
              fullWidth
            >
              <MenuItem value="existing">Existing Brand/Agency</MenuItem>
              <MenuItem value="new">New Brand/Agency</MenuItem>
            </TextField>

            {planDetails.brandType === "existing" ? (
              <Autocomplete
                options={accounts}
                getOptionLabel={(option) => option.account_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option._id === value?._id
                }
                defaultValue={
                  accounts.find(
                    (acc) => acc.account_name === planDetails.accountName
                  ) || null
                }
                onChange={(event, value) => {
                  setPlanDetails((prevDetails) => ({
                    ...prevDetails,
                    accountId: value ? value._id : "",
                    accountName: value ? value.account_name : "",
                    accountTypeName: value ? value.account_type_name : "",
                    brandId: value ? value.brand_id : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Account Name *"
                  // error={!!errors.accountName}
                  // helperText={errors.accountName}
                  />
                )}
              />
            ) : (
              <TextField
                margin="dense"
                label="New Account Name *"
                name="accountName"
                fullWidth
                value={planDetails.accountName}
                onChange={(e) =>
                  setPlanDetails((prevDetails) => ({
                    ...prevDetails,
                    accountName: e.target.value,
                    accountId: "",
                    accountTypeName: "",
                    brandId: "",
                  }))
                }
              // error={!!errors.accountName}
              // helperText={errors.accountName}
              />
            )}
            {planDetails.accountTypeName && (
              <div
                style={{
                  marginLeft: "0.4rem",
                  color: "green",
                  fontSize: "0.775rem",
                }}
              >
                Account Type: {planDetails.accountTypeName}
              </div>
            )}
            <span style={{ color: "red", fontSize: "0.775rem" }}>
              {errors.accountName}
            </span>

            {planDetails?.accountTypeName && (
              <div
                style={{
                  marginLeft: "0.4rem",
                  color: "#555",
                  fontSize: "0.775rem",
                }}
              >
                Account Type: {planDetails.accountTypeName}
              </div>
            )}

            <TextField
              className="mb16"
              margin="dense"
              label="Plan Name* (sheet name will be same)"
              name="planName"
              fullWidth
              value={planDetails.planName}
              onChange={handleInputChange}
              error={!!errors.planName}
              helperText={errors.planName}
            />

            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={planDetails.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Selling Price *"
              name="sellingPrice"
              fullWidth
              type="number"
              value={inputValue}
              onChange={handleInputChangeWithSuggestions}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
            />
            {inputValue > 100 && (
              <div
                style={{
                  marginLeft: "0.4rem",
                  color: "#555",
                  fontSize: "0.775rem",
                }}
              >
                {numberToWords(inputValue)}
              </div>
            )}
            {suggestions.length > 0 && inputValue <= 100 && (
              <div>
                {suggestions.map((suggestion, index) => (
                  <button
                    style={{
                      border: "none",
                      padding: "0.25rem",
                      borderRadius: "5px",
                      margin: "0.2rem",
                    }}
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}

            <Autocomplete
              options={searchInput ? globalFilteredUsers : salesUsers}
              getOptionLabel={(option) => option.user_name || ""}
              defaultValue={
                userContextData.find(
                  (user) => user.user_id === planDetails.salesExecutiveId
                ) || null
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onInputChange={(event, value) => setSearchInput(value)}
              onChange={(event, value) => {
                setPlanDetails((prevDetails) => ({
                  ...prevDetails,
                  salesExecutiveId: value ? value.user_id : "",
                  salesExecutiveName: value ? value.user_name : "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sales Executive *"
                  error={!!errors.salesExecutiveId}
                  helperText={errors.salesExecutiveId}
                />
              )}
            />

            <TextField
              margin="dense"
              label="Brief"
              name="brief"
              fullWidth
              value={planDetails.brief}
              onChange={handleInputChange}
            />

            {/* File Upload and Remove Section */}
            <div className="file-upload-section">
              <input type="file" onChange={handleFileChange} />
              {file && (
                <div className="file-preview">
                  <span>{file.name}</span>
                  <Button onClick={handleFileRemove} color="secondary">
                    Remove File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="btn cmnbtn btn-danger" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            className="btn cmnbtn btn-primary"
            onClick={handleFormSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {statusDialog && (
        <PlanXStatusDialog
          setPlanDetails={setPlanDetails}
          statusDialogPlan={statusDialogPlan}
          statusDialog={statusDialog}
          setStatusDialog={setStatusDialog}
          fetchPlans={fetchPlans}
        />
      )}
      <PlanXNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        descriptions={descriptions}
        onEdit={handleEditDescription}
        onDelete={handleDeleteDescription}
        onAdd={handleAddDescription}
        statusChange={handlePlanxNoteStatusChange}
      />
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Plan X Overview </h5>
          <div className="flexCenter colGap8">
            <button
              className="btn cmnbtn btn-primary btn_sm"
              onClick={() => setIsCostModalOpen(true)}
            >
              Update Operation & content cost
            </button>
            {isShowPlan && (
              <Link onClick={handlePlanMaking}>
                <button className="btn cmnbtn btn-primary btn_sm">
                  Create Plan <AddIcon />
                </button>
              </Link>
            )}
            <Link to="/admin/inventory/pms-plan-pricing">
              <button className="btn cmnbtn btn-primary btn_sm">
                Plan Pricing
              </button>
            </Link>
          </div>
        </div>

        <CostUpdateModal
          isOpen={isCostModalOpen}
          onClose={() => setIsCostModalOpen(false)}
          formData={priceFormData}
          onChange={handleCostInputChange}
          onUpdate={handleCostUpdate}
          isLoading={isLoading}
        />
        <div className="tabs">
          <button
            className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
            onClick={() => setActiveTab("Tab1")}
          >
            Overview
          </button>
          <button
            className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
            onClick={() => setActiveTab("Tab2")}
          >
            Date Wise Filter
          </button>
          <button
            className={activeTab === "Tab3" ? "active btn btn-primary" : "btn"}
            disabled={true}
            onClick={() => setActiveTab("Tab3")}
          >
            Highest Plan Request
          </button>
        </div>
        <div className="card-body p0 noCardHeader">
          <div className="data_tbl thm_table table-responsive">
            {activeTab === "Tab1" && (
              <div>
                <DateSelector
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
                <div className="mt-2 mb-1 ml-1">
                  <TextField
                    label="Search Plans"
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
                <View
                  isLoading={loading}
                  columns={columns}
                  data={finalPlanList}
                  pagination={[10, 50, 100]}
                  tableName={"PlanMakingDetails"}
                  version={1}
                  cloudPagination={true}
                  pageNavigator={{
                    prev: {
                      disabled: page === 1,
                      onClick: () => setPage((prev) => Math.max(prev - 1, 1)),
                    },
                    next: {
                      disabled: totalPages?.totalPages < limit,
                      onClick: () => setPage((prev) => prev + 1),
                    },
                    totalRows: totalPages?.totalRecords || 0,
                    currentPage: totalPages?.page,
                  }}
                  showExport={isShowPlan}
                />
              </div>
            )}
            {/* {activeTab === 'Tab3' && <PlanPricing />} */}
            {activeTab === "Tab3" && <HighestPlanRequest planRows={planRows} />}
            {activeTab === "Tab2" && (
              <div>
                <DateWiseFilter
                  planRows={planRows}
                  setFilteredPlanRows={setFilteredPlanRows}
                  setPlanxLoading={setPlanxLoading}
                />
                <View
                  isLoading={loading || planxLoading}
                  columns={columns}
                  data={dateWiseFilteredData}
                  pagination={[100, 200]}
                  tableName={"PlanMakingDetails"}
                  version={1}
                  showExport={isShowPlan}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanHomeBeta;
