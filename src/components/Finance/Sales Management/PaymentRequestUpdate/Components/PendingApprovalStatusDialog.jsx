import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import { useGlobalContext } from "../../../../../Context/Context";
import { Navigate } from "react-router-dom";

const PendingApprovalStatusDialog = ({
  statusDialog,
  handleCloseStatusDialog,
  reasonField,
  setReasonField,
  getData,
  rowData,
  status,
  setStatus,
}) => {
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem("token");

  const handleStatusSubmit = async (e) => {
    e.preventDefault();

    const confirmation = confirm(
      "Are you sure you want to reject this payment?"
    );

    if (confirmation) {
      const payload = {
        payment_approval_status: status,
        action_reason: reasonField,
        payment_amount: rowData?.payment_amount,
      };

      await axios
        .put(
          baseUrl + `sales/finance_approval_payment_update/${rowData?._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toastAlert("Status Reject Successfully");
            handleCloseStatusDialog();
          }
        })
        .catch((err) => {
          toastAlert(err, "Status Failed");
          handleCloseStatusDialog();
        })
        .finally(() => {
          console.log("HELLO----");
          getData();
          Navigate(-1);
          setStatus("");
        });
    }
  };
  return (
    <Dialog
      open={statusDialog}
      onClose={handleCloseStatusDialog}
      fullWidth
      maxWidth="md"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <DialogTitle>
        Add Rejected Reason
        <IconButton
          aria-label="close"
          onClick={handleCloseStatusDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="outlined-multiline-flexible"
          label="Reason for Rejection"
          multiline
          maxRows={4}
          onChange={(e) => setReasonField(e.target.value)}
        />
        {/* <TextField
          label="Reason for Rejection"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          // value={reasonField}
          onChange={(e) => setReasonField(e.target.value)}
        /> */}
        <Button onClick={(e) => handleStatusSubmit(e)}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PendingApprovalStatusDialog;
