import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React from "react";
import { baseUrl } from "../../../../../utils/config";
import { useEffect } from "react";

const PayThroughVendorDialog = (props) => {
  const { payThroughVendor, setPayThroughVendor, rowSelectionModel } = props;

  const handleClosePayThroughVendor = () => {
    setPayThroughVendor(false);
  };

  const doPayment = async (e) => {
    try {
      const getTokenResponse = await axios.get(
        baseUrl + `generate_plural_payment_jwt_token`
      );
      const token = getTokenResponse.data.data;
      console.log(token, "getTokenResponse->>>>");

      // const paymentPayload = {
      //   clientReferenceId: "abcd1234",
      //   payeeName: "Abhishek", // Corrected name capitalization
      //   accountNumber: "1234567890", // Use a valid account number
      //   branchCode: "001122", // Use a valid branch code
      //   email: "ascs739@gmail.com",
      //   phone: "7000436496",
      //   amount: { currency: "INR", value: 3000 },
      //   remarks: "Payment remarks here", // Add a meaningful remark
      //   mode: "IMPS", // Options: IMPS, NEFT, RTGS, UPI
      // };
      const paymentPayload = {
        clientReferenceId: "1062",
        payeeName: "Neetika Ligga",
        accountNumber: "040403873332190801",
        branchCode: "CSBK0000404",
        email: "ligga@icloud.com",
        phone: "9993009092",
        amount: {
          currency: "INR",
          value: 20000000,
        },
        mode: "RTGS",
        remarks: "Testing transaction",
      };

      const payResponse = await axios?.post(
        baseUrl + `create_payout`,
        paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment successful:", payResponse?.data);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <Dialog
      open={payThroughVendor}
      onClose={handleClosePayThroughVendor}
      fullWidth
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Pay Through Vendor</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClosePayThroughVendor}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={doPayment}
        >
          Pay Through Vendor
        </Button>

        {/* Uncomment and ensure activeAccordionIndex, filterData, and columns are passed as props if needed */}
        {/* <DataGrid
          rows={
            activeAccordionIndex === 0
              ? filterData
              : activeAccordionIndex === 1
              ? filterData
              : []
          }
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => filterData?.indexOf(row)}
        /> */}
      </DialogContent>
    </Dialog>
  );
};

export default PayThroughVendorDialog;
