import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import CampaignDetailes from "../CampaignDetailes";
import AssignmentCard from "./AssignmentCard";
import { Modal, Button, Typography, Box } from "@mui/material";
import { data } from "jquery";
import { DataGrid } from "@mui/x-data-grid";
//import './assignmentDashboardData';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const AssignmentDashboard = () => {

  const [dashboardData, setDashboardData] = useState({})
  const [open, setOpen] = useState(false)
  const [modalData, setModalData] = useState([])
  const [modalHeading,setModalHeading]=useState("")

  //function to fetch dashboard data

  const getDashboardData = async () => {
    const response = await axios.post(
      `${baseUrl}` + `assignment/campaign/dashboard`, { campaignId: "65cb302ed247bcefa25594fb" }
    )
    setDashboardData(response.data.result)
  }

  // Function to handle click and open the modal
  const handleOpenModal = (param,name) => {
    setModalData(param)
    setModalHeading(name)
    setOpen(true);
  };
  console.log(modalData)

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalHeading("")
    setModalData([])
    setOpen(false);
  };

  console.log(dashboardData)
  useEffect(() => {
    getDashboardData()
  }, [])

  const columnForModal = [
    {
      field: 'page_name',
      headerName: 'Page',
      width: 70
    },
    {
      field: 'cat_name',
      headerName: 'Category',
      width: 70
    },
    {
      field: 'postPerPage',
      headerName: 'Post',
      width: 70
    },
    {
      field: 'storyPerPage',
      headerName: 'Story',
      width: 70
    },
    {
      field: 'ass_status',
      headerName: 'Status',
      width: 70
    },
    {
      field: 'exp_name',
      headerName: 'Executor',
      width: 70
    },
    
    
  ]
  return (
    <>

      <div>
        <h3>Assignment Details</h3>
      </div>
      <div>
        <CampaignDetailes />
      </div>
      {/* cid={singlePhaseData} */}


      {dashboardData._id && <div className="section">
        <h4>Assignment Dashboards</h4>

        <AssignmentCard data={{ name: "Total number of Post", value: dashboardData?.total_number_of_post }} />
        <AssignmentCard data={{ name: "Total number of story", value: dashboardData?.total_number_of_story }} />
        <span onClick={() => handleOpenModal(dashboardData?.all_assignments[0]?.assignments,"Total number of assignment")}>

          <AssignmentCard data={{ name: "Total number of assignment", value: dashboardData?.total_no_of_assgnments }} />
        </span>

        <span onClick={() => handleOpenModal(dashboardData?.executor_wise_assignments[0]?.assignedPages,"assignment accepted")}>

        <AssignmentCard data={{ name: "Total number of assignment accepted", value: dashboardData?.total_assignments_accepted }} />
        </span>
        <AssignmentCard data={{ name: "Total number of Execution Remaining", value: dashboardData?.execution_remaining }} />
        <AssignmentCard data={{ name: "Total number of Execution", value: dashboardData?.total_no_of_execution }} />
        <AssignmentCard data={{ name: "Total number of Replacement", value: dashboardData?.total_no_of_replacement }} />
        <AssignmentCard data={{ name: "Total number of assignments verified", value: dashboardData?.total_number_of_assignment_varification }} />
        <AssignmentCard data={{ name: "Assignment Accepted %", value: dashboardData?.assignment_accepted_percentage + "%" }} />
        <AssignmentCard data={{ name: "Assignment executed %", value: dashboardData?.assignment_executed_percentage + "%" }} />
        <AssignmentCard data={{ name: "Assignment verified percentage", value: dashboardData?.assignment_verified_percentage + "%" }} />
        <AssignmentCard data={{ name: "Total number of Categories", value: dashboardData?.category_wise_page_model[0].total_categories }} />
        <AssignmentCard data={{ name: "Executed assignments", value: dashboardData?.executed_assignments[0]?.count }} />
        <AssignmentCard data={{ name: "Execution pending assignments", value: dashboardData?.execution_pending_assignments[0]?.count }} />
        <AssignmentCard data={{ name: "Preassigment executors", value: dashboardData?.executor_wise_PreAssignments[0]?.total_executors }} />
        <AssignmentCard data={{ name: "Total number of Post Verified", value: dashboardData?.post_verified[0]?.count }} />
        <AssignmentCard data={{ name: "Total number of story Verified", value: dashboardData?.story_verified[0]?.count }} />
        <AssignmentCard data={{ name: "Total number of Rejected Assignment", value: dashboardData?.rejected_assignments[0]?.count }} />
        {/* <AssignmentCard data={{name:"Total number of Post",value:dashboardData?.unAssigned_assignments[0]?.count}}/> */}
        {/* <AssignmentCard data={{name:"Total number of Post",value:dashboardData?.total_number_of_post}}/>
       <AssignmentCard data={{name:"Total number of Post",value:dashboardData?.total_number_of_post}}/> */}
        {/* Add more data points as needed */}
      </div>
      }

      <Modal open={open} onClose={handleCloseModal}>
        {/* Content of the modal */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalHeading}
          </Typography>
          <DataGrid
            rows={modalData}
            columns={columnForModal}
            getRowId={(row)=>row.p_id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            // checkboxSelection
          />
        </Box>
      </Modal>
    </>
  );
};

export default AssignmentDashboard;
