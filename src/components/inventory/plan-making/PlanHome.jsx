import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import PlanPricing from './PlanPricing';
import { baseUrl } from '../../../utils/config';
import { AppContext } from '../../../Context/Context';
import CustomTable from '../../CustomTable/CustomTable';
import { FaEdit } from 'react-icons/fa';

function PlanHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [openDialog, setOpenDialog] = useState(false);
  const [planRows, setPlanRows] = useState([]);
  const [duplicatePlanId, setDuplicatePlanId] = useState(null);

  const [planDetails, setPlanDetails] = useState({
    planName: '',
    costPrice: '',
    sellingPrice: '',
    noOfPages: '',
    postCount: '',
    storyCount: '',
    description: '',
    salesExecutiveId: '',
    accountId: '',
    brandId: '',
    brief: '',
    planStatus: 'close',
    planSaved: false,
    createdBy: 938,
  });
  const [accounts, setAccounts] = useState([]); // State to store account data
  const [loading, setLoading] = useState(true);
  const storedToken = sessionStorage.getItem('token');
  const { usersDataContext } = useContext(AppContext); // Getting users from context

  const filteredUsers = usersDataContext.filter(
    (user) =>
      user.department_name === 'Community Management' ||
      user.department_name === 'Sales'
  );

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${baseUrl}accounts/get_all_account`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}v1/planxlogs`);
      const data = await response.json();
      if (data.success) {
        // Map API response to match DataGrid row structure
        const formattedRows = data?.data?.map((plan, index) => ({
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
      console.error('Error fetching plans:', error);
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
    if (name === 'accountName') {
      const selectedAccount = accounts.find(
        (account) => account.account_name === value
      );
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        accountName: selectedAccount ? selectedAccount.account_name : '',
        accountId: selectedAccount ? selectedAccount._id : '',
        brandId: selectedAccount ? selectedAccount.brand_id : '',
      }));
    }
    // Handle user selection from usersDataContext
    else if (name === 'salesExecutiveId') {
      const selectedUser = usersDataContext.find((user) => user.user_name === value);
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        salesExecutiveId: selectedUser ? selectedUser._id : '',
      }));
    } else {
      setPlanDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };
 

  const handleFormSubmit = async () => {
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(planData),
      });

      const result = await response.json();
      if (result.success) {
        const newPlanId = result?.data?._id;
        navigate(`/admin/pms-plan-making/${newPlanId}`);
      } else {
        console.error('Failed to create plan:', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    setOpenDialog(false);
    setDuplicatePlanId(null); // Reset duplicate plan ID
  };

  const handleDuplicateClick = (params) => {
    const planId = params.id; // Get the original plan's ID
    setDuplicatePlanId(planId); // Track the plan ID being duplicated

    // Clear the form fields
    setPlanDetails({
      planName: '',
      costPrice: '',
      sellingPrice: '',
      noOfPages: '',
      postCount: '',
      storyCount: '',
      description: '',
      salesExecutiveId: '',
      accountId: '',
      brandId: '',
      brief: '',
      planStatus: 'close',
      planSaved: false,
      createdBy: 938,
    });

    setOpenDialog(true); // Open the dialog
  };
  const columns = [
    {
      key: 'serial_no',
      name: 'S.No',
      renderRowCell: (row, index) => (
        <div style={{ textAlign: 'center' }}>{index + 1}</div>
      ),
      width: 70,
      showCol: true,
    },
    {
      key: 'platform_count',
      name: 'No of Platform',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.platformCount}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'plan_name',
      name: 'Plan Name',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.planName}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'cost_price',
      name: 'Cost Price',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.costPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'selling_price',
      name: 'Selling Price',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.sellingPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'pages',
      name: 'No of Pages',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.pages}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'post_count',
      name: 'Post Count',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.postCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'story_count',
      name: 'Story Count',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.storyCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'description',
      name: 'Description',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.description}</div>
      ),
      width: 250,
      showCol: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      renderRowCell: (row) => (
        <div>
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
            <FaEdit />{' '}
          </button>
        </div>
      ),
      width: 150,
      showCol: true,
    },
  ];
  return (
    <div>
      <Button variant="contained" onClick={handlePlanMaking}>
        Plan Making Button
      </Button>

      {/* Plan Making Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create a New Plan</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Plan Name"
            name="planName"
            fullWidth
            value={planDetails.planName}
            onChange={handleInputChange}
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
            label="Budget"
            name="sellingPrice"
            fullWidth
            value={planDetails.sellingPrice}
            onChange={handleInputChange}
          />

          <Autocomplete
            name="accountName"
            disablePortal
            onChange={(event, value) => {
              const selectedAccount = accounts.find(
                (account) => account.account_name === value
              );
              setPlanDetails((prevDetails) => ({
                ...prevDetails,
                accountName: selectedAccount
                  ? selectedAccount.account_name
                  : '',
                accountId: selectedAccount ? selectedAccount._id : '',
                brandId: selectedAccount ? selectedAccount.brand_id : '',
              }));
            }}
            options={accounts.map((account) => account.account_name)}
            renderInput={(params) => (
              <TextField {...params} label="Account Name" />
            )}
          />
          <Autocomplete
            disablePortal
            name="salesExecutiveId"
            onChange={(event, value) => {
              const selectedUser = usersDataContext.find(
                (user) => user.user_name === value
              );
              setPlanDetails((prevDetails) => ({
                ...prevDetails,
                salesExecutiveId: selectedUser ? selectedUser._id : '',
              }));
            }}
            options={filteredUsers?.map((user) => user?.user_name)}
            renderInput={(params) => (
              <TextField {...params} label="Sales Executive" />
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
          <Button onClick={handleFormSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div className="tabs">
        <button
          className={activeTab === 'Tab1' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab1')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'Tab2' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab2')}
        >
          Statistics
        </button>
        <button
          className={activeTab === 'Tab3' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab3')}
        >
          Plan Pricing
        </button>
      </div>
      {/* <CustomTable
              isLoading={SalesLoading || userLoading}
              columns={columns}
              data={SalesData}
              Pagination
              tableName={"SalesBookingDetails"}
            /> */}
      {activeTab === 'Tab1' && (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomTable
            isLoading={loading}
            columns={columns}
            data={planRows?.reverse()}
            Pagination
            tableName={'PlanMakingDetails'}
          />
        </Box>
      )}
      {activeTab === 'Tab3' && <PlanPricing />}
    </div>
  );
}

export default PlanHome;
