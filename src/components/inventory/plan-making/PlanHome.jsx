import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import PlanPricing from "./PlanPricing";
import { baseUrl } from "../../../utils/config";
import { AppContext } from "../../../Context/Context";
import CustomTable from "../../CustomTable/CustomTable";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import View from "../../AdminPanel/Sales/Account/View/View";
import AddIcon from "@mui/icons-material/Add";

function PlanHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tab1");
  const [openDialog, setOpenDialog] = useState(false);
  const [planRows, setPlanRows] = useState([]);
  const [duplicatePlanId, setDuplicatePlanId] = useState(null);
  const [errors, setErrors] = useState({});

  const [planDetails, setPlanDetails] = useState({
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
    planStatus: "close",
    planSaved: false,
    createdBy: 938,
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const storedToken = sessionStorage.getItem("token");
  const { usersDataContext } = useContext(AppContext);

  const salesUsers = usersDataContext?.filter(
    (user) => user?.department_name === "Sales"
  );

  const globalFilteredUsers = usersDataContext?.filter((user) =>
    user?.user_name?.toLowerCase()?.includes(searchInput?.toLowerCase())
  );

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
    if (!planDetails.sellingPrice)
      newErrors.sellingPrice = "Budget is required";
    if (!planDetails.accountId)
      newErrors.accountName = "Account Name is required";
    if (!planDetails.salesExecutiveId)
      newErrors.salesExecutiveId = "Sales Executive is required";
    return newErrors;
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}v1/planxlogs`);
      const data = await response.json();
      if (data.success) {
        // Map API response to match DataGrid row structure
        const formattedRows = data?.data?.map((plan) => ({
          id: plan._id, // Use _id as the row ID
          platformCount: plan.no_of_pages,
          planName: plan.plan_name,
          costPrice: plan.cost_price,
          sellingPrice: plan.selling_price,
          pages: plan.no_of_pages,
          postCount: plan.post_count,
          storyCount: plan.story_count,
          description: plan.description,
        }));
        setPlanRows(formattedRows); // Set rows with API data
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
    setLoading(false);
  };

  // Updated handleRowClick to handle "Duplicate" action
  const handleRowClick = (params) => {
    const planId = params.id; // Get the plan's _id from the clicked row
    navigate(`/admin/pms-plan-making/${planId}`);
  };

  // Fetch accounts data from API
  useEffect(() => {
    fetchAccounts();
    fetchPlans();
  }, []);

  const handlePlanMaking = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
    // Handle user selection from usersDataContext
    else if (name === "salesExecutiveId") {
      const selectedUser = usersDataContext.find(
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

  const handleFormSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const planData = {
      plan_name: planDetails.planName,
      cost_price: parseFloat(planDetails.costPrice),
      selling_price: parseFloat(planDetails.sellingPrice),
      no_of_pages: parseInt(planDetails.noOfPages, 10),
      post_count: parseInt(planDetails.postCount, 10),
      story_count: parseInt(planDetails.storyCount, 10),
      description: planDetails.description,
      sales_executive_id: parseInt(planDetails.salesExecutiveId, 10),
      account_id: planDetails.accountId,
      brand_id: planDetails.brandId,
      brief: parseInt(planDetails.brief, 10),
      plan_status: planDetails.planStatus,
      plan_saved: planDetails.planSaved,
      created_by: planDetails.createdBy,
      ...(duplicatePlanId && { duplicate_planx_id: duplicatePlanId }),
    };

    try {
      const response = await fetch(`${baseUrl}v1/planxlogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(planData),
      });

      const result = await response.json();

      if (result.success) {
        const newPlanId = result.data._id;
        navigate(`/admin/pms-plan-making/${newPlanId}`);
      } else {
        // Show SweetAlert if the plan name already exists
        Swal.fire({
          icon: "error",
          title: "Duplicate Plan",
          text: result.message, // "Plan with the same name already exists"
        });
        setPlanDetails({});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again later.",
      });
    }

    setOpenDialog(false);
  };

  const isSubmitDisabled =
    !planDetails.planName ||
    !planDetails.sellingPrice ||
    !planDetails.accountId ||
    !planDetails.salesExecutiveId;

  const handleDuplicateClick = (params) => {
    const planId = params.id; // Get the original plan's ID
    setDuplicatePlanId(planId); // Track the plan ID being duplicated

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
      planStatus: "close",
      planSaved: false,
      createdBy: 938,
    });

    setOpenDialog(true); // Open the dialog
  };
  const columns = [
    {
      key: "serial_no",
      name: "S.No",
      renderRowCell: (row, index) => (
        <div style={{ textAlign: "center" }}>{index + 1}</div>
      ),
      width: 70,
      showCol: true,
    },
    {
      key: "platform_count",
      name: "No of Platform",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.platformCount}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: "plan_name",
      name: "Plan Name",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.planName}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: "brief",
      name: "brief",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row?.brief}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: "cost_price",
      name: "Cost Price",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.costPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: "selling_price",
      name: "Selling Price",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.sellingPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: "pages",
      name: "No of Pages",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.pages}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: "post_count",
      name: "Post Count",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.postCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: "story_count",
      name: "Story Count",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.storyCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: "description",
      name: "Description",
      renderRowCell: (row) => (
        <div style={{ cursor: "pointer" }}>{row.description}</div>
      ),
      width: 250,
      showCol: true,
    },
    {
      key: "actions",
      name: "Actions",
      renderRowCell: (row) => (
        <div  className="flexCenter colGap8">
          <button
            onClick={() => handleDuplicateClick(row)}
            className="btn btn-primary cmnbtn btn_sm"
          >
            Duplicate
          </button>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowClick(row)}
          >
            <FaEdit />{" "}
          </button>
        </div>
      ),
      width: 150,
      showCol: true,
    },
  ];
  console.log(planRows,"planRows")
  return (
    <div>
      {/* <Button variant="contained" onClick={handlePlanMaking}>
        Plan Making Button
      </Button> */}

      {/* Plan Making Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create a New Plan</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Plan Name *"
            name="planName"
            fullWidth
            value={planDetails.planName}
            onChange={handleInputChange}
            error={!!errors.planName}
            helperText={errors.planName}
          />
          <Autocomplete
            options={accounts}
            getOptionLabel={(option) => option.account_name || ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, value) => {
              setPlanDetails((prevDetails) => ({
                ...prevDetails,
                accountId: value ? value._id : "",
                accountName: value ? value.account_name : "",
                brandId: value ? value.brand_id : "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Account Name *"
                error={!!errors.accountName}
                helperText={errors.accountName}
              />
            )}
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
            label="Budget *"
            name="sellingPrice"
            fullWidth
            value={planDetails.sellingPrice}
            onChange={handleInputChange}
            error={!!errors.sellingPrice}
            helperText={errors.sellingPrice}
          />
          <Autocomplete
            options={searchInput ? globalFilteredUsers : salesUsers}
            getOptionLabel={(option) => option.user_name || ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onInputChange={(event, value) => setSearchInput(value)}
            onChange={(event, value) => {
              setPlanDetails((prevDetails) => ({
                ...prevDetails,
                salesExecutiveId: value ? value._id : "",
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div className="card">
        <div className="card-header flexCenterBetween">
          <div className="flexCenter colGap8" >
            <Link
            onClick={handlePlanMaking}
              // to={`/admin/pms-page-master`}
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Create Plan <AddIcon />
            </Link>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Overview
        </button>

        <button
          className={activeTab === "Tab3" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab3")}
        >
          Plan Pricing
        </button>
      </div>
      <div className="card">
        <div className="card-body p0">
          <div className="data_tbl thm_table table-responsive">
            {activeTab === "Tab1" && (
              <View
                isLoading={loading}
                columns={columns}
                title={"Plan Overview"}
                data={planRows?.reverse()}
                Pagination={[100, 200]}
                tableName={"PlanMakingDetails"}
              />
            )}
            {activeTab === "Tab3" && <PlanPricing />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanHome;
