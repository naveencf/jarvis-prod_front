import { Button, Dialog, DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const PaymentDoneBankDetailDialog = (props) => {
  const { bankDetail, bankDetailRowData, setBankDetail } = props;

  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  const getFormattedBankDetails = () => {
    const paymentDetails = bankDetailRowData[0]?.payment_details || "N/A";
    const mobile = bankDetailRowData[0]?.mob1 || "N/A";
    const email = bankDetailRowData[0]?.email
      ? `Email: ${bankDetailRowData[0]?.email}`
      : "";

    return `${paymentDetails}\nMob: ${mobile}\n${email}`;
  };
  console.log(bankDetailRowData, "bankDetailRowData--->>>");
  return (
    <div>
      <Dialog
        open={bankDetail}
        onClose={handleCloseBankDetail}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Bank Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseBankDetail}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <TextField
          id="outlined-multiline-static"
          multiline
          //   value={
          //     bankDetailRowData[0]?.payment_details +
          //     "\n" +
          //     "Mob:" +
          //     bankDetailRowData[0]?.mob1 +
          //     "\n" +
          //     (bankDetailRowData[0]?.email
          //       ? "Email:" + bankDetailRowData[0].email
          //       : "")
          //   }
          value={getFormattedBankDetails()}
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
        <Button
          //   onClick={() => {
          //     navigator?.clipboard?.writeText(
          //       bankDetailRowData[0]?.payment_details
          //     );
          //     toastAlert("Copied to clipboard");
          //   }}

          onClick={() => {
            navigator?.clipboard?.writeText(getFormattedBankDetails());
            toastAlert("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Dialog>
    </div>
  );
};

export default PaymentDoneBankDetailDialog;
