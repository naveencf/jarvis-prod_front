import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PlanPricing from './PlanPricing';
import View from '../../AdminPanel/Sales/Account/View/View';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';

// Sample data for the table
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

// Define columns for the table
const columns = [
  {
    key: "S.NO",
    name: "S.no",
    renderRowCell: (row, index) => index + 1,
    width: 80,
  },
 
  
  // { field: 'platformCount', headerName: 'No of Platform', width: 150 },
  // { field: 'planName', headerName: 'Plan Name', width: 150 },
  // { field: 'costPrice', headerName: 'Cost Price', width: 120 },
  // { field: 'sellingPrice', headerName: 'Selling Price', width: 120 },
  // { field: 'pages', headerName: 'No of Pages', width: 120 },
  // { field: 'postCount', headerName: 'Post Count', width: 120 },
  // { field: 'storyCount', headerName: 'Story Count', width: 120 },
  // { field: 'description', headerName: 'Description', width: 250 },
];
function PlanHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Tab1');

  const handlePlanMaking = () => {
    const randomId = Math.floor(Math.random() * 10000);
    navigate(`/admin/pms-plan-making/${randomId}`);
  };
  useEffect(()=>{
    axios.get(`${baseUrl}v1/planxlogs`).then((res)=>{
      if(res.status == 200){
        console.log(res.data.data)
      }
    })
  },[])
  return (
    <div>
      <button onClick={handlePlanMaking}>Plan Making Button</button>
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
        <div>
          <Box sx={{ height: 400, width: '100%' }}>
            {/* <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            /> */}
             <View
                      columns={columns}
                      data={rows}
                      isLoading={false}
                      title={"PlanX Overview"}
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName={"PlanX_Overview"}
                    />
          </Box>
        </div>
      )}
      {activeTab === 'Tab3' && (
        <div>
          <PlanPricing />
        </div>
      )}
    </div>
  );
}
export default PlanHome;
