import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PaymentDetailDailog({
  handleClosePaymentDetailDialog,
  openPaymentDetailDialog,
  paymentDialogDetails,
}) {
  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpenPaymentDetailDialog}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClosePaymentDetailDialog}
        aria-labelledby="customized-dialog-title"
        open={openPaymentDetailDialog}
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Payment Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePaymentDetailDialog}
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
          <Typography gutterBottom>
            Total Paid Amount : {paymentDialogDetails?.total_paid_amount}
          </Typography>
          <hr />
          <Typography gutterBottom>
            Credit Approval Amount :{" "}
            {paymentDialogDetails?.credit_approval_amount}
          </Typography>
          <hr />
          <Typography gutterBottom>
  Credit Approval Date: {new Date(paymentDialogDetails?.credit_approval_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
</Typography>

          <hr />
          <Typography gutterBottom>
            Credit Approval By : {paymentDialogDetails?.credit_approval_by}
          </Typography>
          <hr />
          <Typography gutterBottom>
            Campaign Amount : {paymentDialogDetails?.campaign_amount}
          </Typography>
          <hr />
          <Typography gutterBottom>
            Campaign Amount Without GST:{" "}
            {paymentDialogDetails?.campaign_amount_without_gst}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
