import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalContext } from "../../../../../Context/Context";

const BankDetailPendingPaymentDialog = (props) => {
  const { bankDetail, handleCloseBankDetail, bankDetailRowData } = props;
  const { toastAlert } = useGlobalContext();

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

        {/* <TextField
        //   id="outlined-multiline-static"
        //   multiline
        //   value={`${bankDetailRowData[0]?.payment_details} +
        //       "\n" +
        //       "Mob:" +
        //       ${bankDetailRowData[0]?.mob1} +
        //       "\n" +
        //       ${
        //         bankDetailRowData[0]?.email
        //           ? "Email:" + bankDetailRowData[0]?.email
        //           : ""
        //       }`}
        //   rows={4}
        //   defaultValue="Default Value"
        //   variant="outlined"
        // /> */}
        <div className="p-2">
          {" "}
          {bankDetailRowData[0]?.payment_details.replace("\r\n", " and ")}
        </div>
        <div className="p-2"> {`Mob: ${bankDetailRowData[0]?.mob1}`}</div>
        <div className="p-2">
          {bankDetailRowData[0]?.email
            ? `Email: ${bankDetailRowData[0]?.email}`
            : ""}
        </div>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              bankDetailRowData[0]?.payment_details
            );
            toastAlert("Copied to clipboard");
          }}
        >
          Copy
        </Button>
      </Dialog>
    </div>
  );
};

export default BankDetailPendingPaymentDialog;
