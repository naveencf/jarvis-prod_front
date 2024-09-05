import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Box, TextField } from "@mui/material";
import ReplacePagesModal from "./ReplacePagesModal";
import ReplacementRecord from "./ReplacementRecord";
import millify from "millify";
import exportToCSV from "../../../utils/ExcelConverter";
import generatePdf from "../../../utils/PdfConverter";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const PageOverview = ({ selectData, setrender, stage, id, phase_id }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const naviagte = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selection, setSelections] = useState();
  const [realData, setRealData] = useState([]);
  const [updatePayload, setUpdatePayload] = useState({ campaignId: id })
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedRowForDelete, setSelectedRowForDelete] = useState(null);

  const handleDeletePlanData = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    const data = selectData.filter((page) => {
      if (
        page.replacement_status == "pending" ||
        page.replacement_status == "replacement" ||
        page.replacement_status == "inactive" ||
        page.replacement_status == "active"
      ) {
        return page;
      }
    });
    setRealData(data);
  }, [selectData]);

  const handleDeleteSinglePlan = (params) => {
    setSelectedRowForDelete(params.row);
    setOpenDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    const pageName = selectedRowForDelete?.page_name;
    if (selectedRowForDelete.isExecuted) {
      toastError("Can't delete page, it is already executed");
    } else {
      try {
        let deleteEndpoint = stage === 'plan' ? 'campaignplan/singleplan' : 'campaignphase/singlephase';
        const deleteData = await axios.post(
          `${baseUrl}${deleteEndpoint}`,
          { page: selectedRowForDelete, deletion_requested_by: "test" }
        );
        toastAlert(`Delete ${pageName} Page Successfully`);
        setrender();
      } catch (error) {
        console.log(error);
      }
    }
    setOpenDeleteConfirmation(false);
  };

  const handleInputChange = (e, params) => {
    if (params.field == "postPerPage") {
      setUpdatePayload({ ...updatePayload, postPerPage: Number(e.target.value), p_id: params.row.p_id })
    } else if (params.field == "storyPerPage") {
      setUpdatePayload({ ...updatePayload, storyPerPage: Number(e.target.value), p_id: params.row.p_id })
    }
  }

  const updateSinglePlan = async () => {
    if (stage == "plan") {
      try {
        const response = await axios.put(`${baseUrl}` + `updateplan`, updatePayload)
        console.log(response)
        toastAlert(response.data.message)
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("update not implement here")
    }
  }

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = selectData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },

    {
      field: "cat_name",
      headerName: "Category Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
      valueFormatter: (params) => millify(params.value),
    },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
      renderCell: (params) => {

        return (
          <TextField
            defaultValue={params?.row?.postPerPage}
            onChange={(e) => handleInputChange(e, params)}
          />
        );
      },
    },
    {
      field: "storyPerPage",
      headerName: "story",
      width: 150,
      renderCell: (params) => {
        return (
          <TextField
            defaultValue={params?.row?.storyPerPage}
            onChange={(e) => handleInputChange(e, params)}
          />
        );
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button className="icon-1" onClick={() => updateSinglePlan(params)} color="primary">
              <i className="bi bi-pencil" />
            </button>
            <button className="icon-1" onClick={() => handleDeleteSinglePlan(params)} color="error">
              <i className="bi bi-trash" />
            </button>
          </>
        );
      },
    },
    {
      field: "replace",
      headerName: "Replace Pages",
      width: 150,
      renderCell: (params) => {
        return (
          params.row.replacement_status == "inactive" && (
            <button className="icon-1" onClick={() => handleOpenModal(params.row)}>
              <i className="bi bi-arrow-repeat" />
            </button>
          )
        );
      },
    },
    {
      field: "replacerecord",
      headerName: "Replace Pages",
      width: 150,
      renderCell: (params) => {
        return params.row.replacement_id ? (
          <button className="icon-1" onClick={() => handleOpenModalRecord(params.row)}>
            <i className="bi bi-arrow-repeat" />
          </button>
        ) : (
          "N/A"
        );
      },
    },
  ];

  const handleOpenModal = (row) => {
    setSelections(row);
    setIsModalOpen(true);
  };
  const handleOpenModalRecord = (row) => {
    setSelections(row);
    setIsRecordOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setrender();
  };
  const handleCloseModalRecord = () => {
    setIsRecordOpen(false);
  };
  const handleExportClick = () => {
    exportToCSV(realData, "page_data");
  };

  const handleDownloadPdf = () => {
    generatePdf(realData);
  };
  const handlePlanDashboard = () => {
    naviagte(`/admin/plan-dashboard/${id}`);
  };

  const handleDeletePlan = async () => {
    if (stage == 'plan') {
      handleDeleteDialogClose();
      const deleteData = await axios.delete(
        `${baseUrl}` + `campaignplan/bulk/${id}`
      );
      naviagte("/admin/registered-campaign");
      toastAlert("Plan Delete Successfully !!");
    } else {
      handleDeleteDialogClose();
      const deleteData = await axios.delete(
        `${baseUrl}` + `campaignphase/bulk/${phase_id}`
      );
      toastAlert("Phase Delete Successfully !!");
      setrender()
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header sb">
          <div className="gap16">
            {" "}
            <Button
              onClick={handleExportClick}
              className="btn cmnbtn btn_sm btn-success"
              variant="text"
              color="success"
              sx={{ fontSize: "30px" }}
              title="Download Excel"
            >
              <SiMicrosoftexcel />
            </Button>
            <Button
              onClick={handleDownloadPdf}
              className="btn cmnbtn btn_sm btn-danger"
              variant="text"
              color="error"
              title="Download Pdf"
            >
              <PictureAsPdfIcon sx={{ fontSize: "40px" }} />
            </Button>
            <Button
              onClick={handlePlanDashboard}
              variant="outlined"
              color="secondary"
              className="btn cmnbtn btn_sm btn-primary"

            >
              Plan Dashboard
            </Button>
          </div>
          <div className="gap16">
            <Button
              variant="outlined"
              color="success"
              className="btn cmnbtn btn_sm btn-success"

            >
              Edit
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeletePlanData}
              color="error"
              className="btn cmnbtn btn_sm btn-danger"

            >
              Delete
            </Button>

          </div>

        </div>
        <div className="card-body">

          <DataGrid
            rows={realData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.p_id}
            tooo
            getRowClassName={(params) => {
              return params.row.replacement_status == "pending"
                ? "unavailable"
                : "available";
            }}
            sx={{
              ml: 2,
              ".unavailable": {
                bgcolor: " #FF4433",
                "&:hover": {
                  bgcolor: "#E30B5C",
                },
              },
            }}
          />
        </div>
      </div>
      <>
        <ReplacePagesModal
          open={isModalOpen}
          selection={selection}
          handleClose={handleCloseModal}
          planData={selectData}
          stage={stage}
        />
        <ReplacementRecord
          open={isRecordOpen}
          handleClose={handleCloseModalRecord}
          data={selection}
        />
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" color="secondary">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Are you sure you want to delete this ${stage}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeletePlan} variant="outlined" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteConfirmation}
          onClose={() => setOpenDeleteConfirmation(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" color="secondary">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">

              {`Are you sure you want to delete  ${stage === 'plan' ? 'Single page !!' : ''}`}

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteConfirmation(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="outlined" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default PageOverview;
