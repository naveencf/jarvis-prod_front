import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import PlanPricing from './PlanPricing';
import { baseUrl } from '../../../utils/config';
import { AppContext } from '../../../Context/Context';

const rows = [
  {
    id: 1,
    platformCount: 3,
    planName: 'Basic',
    costPrice: 10,
    sellingPrice: 15,
    pages: 5,
    postCount: 10,
    storyCount: 3,
    description: 'Basic plan for small businesses',
  },
  {
    id: 2,
    platformCount: 5,
    planName: 'Standard',
    costPrice: 20,
    sellingPrice: 30,
    pages: 10,
    postCount: 25,
    storyCount: 5,
    description: 'Standard plan for growing businesses',
  },
  {
    id: 3,
    platformCount: 7,
    planName: 'Premium',
    costPrice: 50,
    sellingPrice: 70,
    pages: 20,
    postCount: 50,
    storyCount: 10,
    description: 'Premium plan for large businesses',
  },
];

const columns = [
  { field: 'platformCount', headerName: 'No of Platform', width: 150 },
  { field: 'planName', headerName: 'Plan Name', width: 150 },
  { field: 'costPrice', headerName: 'Cost Price', width: 120 },
  { field: 'sellingPrice', headerName: 'Selling Price', width: 120 },
  { field: 'pages', headerName: 'No of Pages', width: 120 },
  { field: 'postCount', headerName: 'Post Count', width: 120 },
  { field: 'storyCount', headerName: 'Story Count', width: 120 },
  { field: 'description', headerName: 'Description', width: 250 },
];

function PlanHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [openDialog, setOpenDialog] = useState(false);
  const [planRows, setPlanRows] = useState([]);
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
    try {
      const response = await fetch(
        `http://35.225.122.157:8080/api/v1/planxlogs`
      );
      const data = await response.json();
      console.log(data);
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
  };
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
      setPlanDetails({
        ...planDetails,
        accountName: selectedAccount ? selectedAccount.account_name : '',
        accountId: selectedAccount ? selectedAccount._id : '',
        brandId: selectedAccount ? selectedAccount.brand_id : '',
      });
    }
    // Handle user selection from usersDataContext
    else if (name === 'salesExecutiveId') {
      const selectedUser = usersDataContext.find((user) => user._id === value);
      setPlanDetails({
        ...planDetails,
        salesExecutiveId: selectedUser ? selectedUser._id : '',
      });
    } else {
      setPlanDetails({
        ...planDetails,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async () => {
    const apiUrl = 'http://35.225.122.157:8080/api/v1/planxlogs';

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
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(planData),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Plan created successfully:', result);
        const planId = result?.data?._id;
        navigate(`/admin/pms-plan-making/${planId}`);
      } else {
        console.error('Failed to create plan:', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    setOpenDialog(false);
  };

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
          {/* <TextField
            margin="dense"
            label="Cost Price"
            name="costPrice"
            type="number"
            fullWidth
            value={planDetails.costPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Selling Price"
            name="sellingPrice"
            type="number"
            fullWidth
            value={planDetails.sellingPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="No of Pages"
            name="noOfPages"
            type="number"
            fullWidth
            value={planDetails.noOfPages}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Post Count"
            name="postCount"
            type="number"
            fullWidth
            value={planDetails.postCount}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Story Count"
            name="storyCount"
            type="number"
            fullWidth
            value={planDetails.storyCount}
            onChange={handleInputChange}
          /> */}
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={planDetails.description}
            onChange={handleInputChange}
          />

          {/* Account Name Dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Account Name</InputLabel>
            <Select
              name="accountName"
              value={planDetails.accountName}
              onChange={handleInputChange}
              label="Account Name"
            >
              {accounts.map((account) => (
                <MenuItem key={account._id} value={account.account_name}>
                  {account.account_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sales Executive Dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Sales Executive</InputLabel>
            <Select
              name="salesExecutiveId"
              value={planDetails.salesExecutiveId}
              onChange={handleInputChange}
              label="Sales Executive"
            >
              {filteredUsers?.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.user_login_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

      {activeTab === 'Tab1' && (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={planRows} // Use fetched data
            columns={[
              {
                field: 'platformCount',
                headerName: 'No of Platform',
                width: 150,
              },
              { field: 'planName', headerName: 'Plan Name', width: 150 },
              { field: 'costPrice', headerName: 'Cost Price', width: 120 },
              {
                field: 'sellingPrice',
                headerName: 'Selling Price',
                width: 120,
              },
              { field: 'pages', headerName: 'No of Pages', width: 120 },
              { field: 'postCount', headerName: 'Post Count', width: 120 },
              { field: 'storyCount', headerName: 'Story Count', width: 120 },
              { field: 'description', headerName: 'Description', width: 250 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onRowClick={handleRowClick} // Handle row click event
          />
        </Box>
      )}
      {activeTab === 'Tab3' && <PlanPricing />}
    </div>
  );
}

export default PlanHome;
