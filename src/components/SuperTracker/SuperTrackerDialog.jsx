import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { Avatar, Badge, Button, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function SuperTrackerDialog({ open, setOpen, selectedRows }) {
  const [confirmation, setConfirmation] = React.useState(false);

  const handleSubmit = () => {
    setConfirmation(true);
  };
  const handleClose = () => {
    setOpen(false);
    setConfirmation(false);
  };

  const columns = [
    {
      field: "sno",
      headerName: "Avatar",
      width: 70,
      editable: false,
      renderCell: (params) => {
        const instagramProfileUrl = `https://www.instagram.com/${params.row.page_name}/`;

        return (
          <Link
            to={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              src={`https://storage.googleapis.com/insights_backend_bucket/cr/${params.row.page_name.toLowerCase()}.jpg`}
            />
          </Link>
        );
      },
    },

    {
      field: "page_name",
      headerName: "Page name",
      width: 220,
    },
    {
      field: "tracking", // Assuming "status" is the name of the field
      headerName: "Status",
      width: 100,
      sortable: true,
      valueGetter: (params) => {
        if (params.row.tracking) {
          // //console.log("found")
          return 1;
          // return <Badge color="success" variant="dot" />;
        } else {
          // //console.log("first",params.row._id)
          return 0;
        }
      },
      renderCell: (params) => {
        if (params.row.tracking) {
          //console.log("found")
          // return 1
          return <Badge color="success" variant="dot" />;
        } else {
          //console.log("first",params.row._id)
          return <Badge color="error" variant="dot" />;
        }
      },
    },

    {
      field: "page_category_id",
      headerName: "Category",
      width: 200,
      // editable: true,
    },

    {
      field: "tracking_cron",
      headerName: "Cron",
      width: 200,
      // editable: true,
    },
  ];

  const handleFormSubmit = async (event) => {
    handleClose();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const { name, priority } = formJson;
    // Extract the page names from selectedRows
    const pageNames = selectedRows.map((row) => row.page_name);
    // console.log(name,priority,pageNames,"pageNames")
    try {
      const response = await axios.post(
        "https://insights.ist:8080/api/v1/community/add_super_tracker_and_page",
        {
          st_name: name,
          priority: priority,
          pages: pageNames,
        }
      );
      // console.log("API response:", response.data);
     if(response.status == 200){
      alert("Super tracker saved successfully.")
     }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Super Tracker
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DataGrid
            rows={selectedRows}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSubmit}>
            Save Super-Tracker
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Dialog
        open={confirmation}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit,
        }}
      >
        <DialogTitle>Super Tracker Name</DialogTitle>
        <DialogContent>
          To add supertracker, please enter supertracker here.
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Super Tracker Name"
            // type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="priority"
            label="Priority"
            // type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
