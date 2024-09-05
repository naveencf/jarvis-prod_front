import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import {
  Paper,
  Button,
  Drawer,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SummaryDetails from "../SummrayDetailes";
import { DataGrid } from "@mui/x-data-grid";
import { useGlobalContext } from "../../../../Context/Context";
import FormItem from "antd/es/form/FormItem";
import FormContainer from "../../../AdminPanel/FormContainer"


const AllPlanData = () => {
  const { toastAlert, toastError } = useGlobalContext();

  const navigate = useNavigate();
  const [allPlan, setAllPlan] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const getData = async () => {
    const res = await axios.get(`${baseUrl}directplan`);
    setAllPlan(res?.data?.result);
  };

  useEffect(() => {
    getData();
  }, []);

  const goAllPlanOverview = (params) => {
    navigate(`/admin/all-planoverview/${params.row._id}`);
  };

  const excelDownload = (params) => {
    
    setExcelData({pages:params?.row?.pages,planName:params?.row?.planName});
    setDrawerOpen(true);
  };

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const deleteSinglePlan = async (row) => {
    try {
      await axios.delete(`${baseUrl}directplan/${row._id}`);
      getData(); 
      handleCloseDialog();
      toastAlert("Delete plan Successfully")
    } catch (error) {
      console.error(error);
    }
  };

  const createDirectPlan = () => {
    navigate("/admin/create-plan");
  };

  const col = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = allPlan.findIndex(row => row._id === params.row._id);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "planName", headerName: "Plan", width: 150 },
    { field: "createdAt", headerName: "Date", width: 200 },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <button
          className="btn btn-outline-primary"
          onClick={() => goAllPlanOverview(params)}
        >
          Plan Overview
        </button>
      ),
    },
    {
      field: "Excel",
      headerName: "Summary",
      width: 200,
      renderCell: (params) => (
        <button
        className="btn btn-outline-success"
          onClick={() => excelDownload(params)}
        >
          Summary
        </button>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      width: 200,
      renderCell: (params) => (
        <button
          className="btn btn-outline-danger icon-1"
          onClick={() => handleOpenDialog(params.row)}
        >
         <i className=" bi bi-trash"></i>
        </button>
      ),
    },
  ];

  return (
    <div className="master-card-css">

      <FormContainer mainTitle="All Plan" link="true" />

      <div className="card">
        <div className="card-header sb">
          {/* <h5>Plans</h5> */}
          <div className="pack">

          <button  className=" btn btn-outline-danger" onClick={createDirectPlan}>
          Create Plan
        </button>
          </div>
        </div>
        <div className="card-body body-padding">
        <DataGrid rows={allPlan} columns={col} getRowId={(row) => row._id} pageSize={5} />

        </div>
      </div>
      
      
      <Drawer anchor={"right"} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="body-padding h-100">

        <SummaryDetails payload={excelData.pages} campName={excelData.planName} drawer={true} />
        </div>
      </Drawer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle color="secondary">Confirm Delete </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button onClick={() => deleteSinglePlan(selectedRow)} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllPlanData;
