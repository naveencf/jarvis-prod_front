import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import axios from "axios";
import { baseUrl } from '../../../utils/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DeleteCity({
  openDeleteCityName,
  handleCloseDeleteCityName,
  rowData,
  toastAlert,
  callApi,
}) {
  const handleDeleteCityName = (rowData) => {
    axios
      .delete(`${baseUrl}` + `delete_city/${rowData._id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          toastAlert("success", "City Deleted Successfully");
          callApi();
          handleCloseDeleteCityName();
        }
      });
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleCloseDeleteCityName}
        aria-labelledby="customized-dialog-title"
        open={openDeleteCityName}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Delete
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDeleteCityName}
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
          Are you sure you want to delete this city?
        </DialogContent>
        <DialogActions>
          <div className="w-100 sb">

            <Button
              autoFocus
              color="error"
              variant="contained"
              onClick={handleCloseDeleteCityName}
            >
              No
            </Button>
            <Button
              autoFocus
              onClick={() => handleDeleteCityName(rowData)}
              variant="contained"
            >
              Yes
            </Button>
          </div>

        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
