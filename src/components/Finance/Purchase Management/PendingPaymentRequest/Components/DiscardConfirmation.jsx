import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import React from "react";
import axios from "axios";
// import { set } from "date-fns";
import { baseUrl } from "../../../../../utils/config";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DiscardConfirmation({
  rowData,
  setShowDiscardModal,
  userID,
  callApi,
  userName,
}) {
  const [open, setOpen] = React.useState(true);
  const [discardRemark, setDiscardRemark] = React.useState("");
  const handleClose = () => {
    setShowDiscardModal(false);
  };

  const handleConfirm = () => {
    axios
      .post(baseUrl + "phpvendorpaymentrequest", {
        request_id: rowData.request_id,
        vendor_id: rowData.vendor_id,
        request_by: rowData.request_by,
        request_amount: rowData.request_amount,
        priority: rowData.priority,
        status: 2,
        payment_by: userID,
        remark_finance: discardRemark,
        invc_no: rowData.invc_no,
        invc_remark: rowData.invc_remark,
        outstandings: rowData.outstandings,
        invc_Date: rowData.invc_Date,
        vendor_name: rowData.vendor_name,
        name: rowData.name,
        request_date: rowData.request_date,
        gst_hold: rowData.gst_amount,
        tds_deduction: 0,
      })
      .then((res) => {
        const phpFormData = new FormData();
        phpFormData.append("request_id", rowData.request_id);
        phpFormData.append("payment_amount", rowData.payment_amount);
        phpFormData.append(
          "payment_date",
          new Date()?.toISOString().slice(0, 19).replace("T", " ")
        );
        phpFormData.append("payment_by", userName);
        phpFormData.append("evidence", "");
        phpFormData.append("finance_remark", discardRemark);
        phpFormData.append("status", 2);
        phpFormData.append("payment_mode", "");
        phpFormData.append("gst_hold", rowData.gst_amount);
        phpFormData.append("tds_deduction", 0);

        // const phpPayload = {
        //   request_id: rowData.request_id,
        //   payment_amount: rowData.payment_amount,
        //   payment_date: new Date()
        //     ?.toISOString()
        //     .slice(0, 19)
        //     .replace("T", " "),
        //   payment_by: userName,
        //   evidence: "",
        //   finance_remark: discardRemark,
        //   status: 2,
        //   payment_mode: "",
        //   gst_hold: rowData.gst_amount,
        //   tds_deduction: 0,
        // };
        axios
          .post(
            "https://purchase.creativefuel.io/webservices/RestController.php?view=updatePaymentrequestdiscard",
            phpFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then(() => {
            // toastAlert("Payment Done Successfully");
            callApi();
            setShowDiscardModal(false);
            setDiscardRemark("");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure you want to discard this transaction?
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
          <TextField
            multiline
            label="Reason for Discard"
            value={discardRemark}
            onChange={(e) => setDiscardRemark(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            autoFocus
            onClick={handleClose}
          >
            NO
          </Button>
          <Button
            variant="contained"
            color="error"
            autoFocus
            onClick={handleConfirm}
          >
            Yes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
