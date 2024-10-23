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

const PayThroughVendorDialog = (props) => {
  const {
    payThroughVendor,
    setPayThroughVendor,
    rowSelectionModel,
    filterData,
  } = props;

  const handleClosePayThroughVendor = () => {
    setPayThroughVendor(false);
  };

  // useEffect(() => {
  //   const initialAdjustmentAmt = netAmount - paymentAmout;
  //   const formattedAdjustmentAmt = initialAdjustmentAmt?.toFixed(1);
  //   setAdjustAmount(formattedAdjustmentAmt);
  // }, [rowData, paymentAmout]);

  const doPayment = async (e) => {
    try {
      // Step 1: Get the JWT token
      const getTokenResponse = await axios.get(
        `${baseUrl}generate_plural_payment_jwt_token`
      );
      const token = getTokenResponse?.data?.data;

      if (!token) {
        console.error("Error: Token not received.");
        return;
      }
      if (!rowSelectionModel || rowSelectionModel?.length === 0) {
        console.error("Error: No rows selected.");
        return;
      }
      if (!filterData || filterData?.length === 0) {
        console.error("Error: Filter data is empty or missing.");
        return;
      }
      const selectedRow = filterData.find(
        (row) => row.request_id === rowSelectionModel[0]
      );
      if (!selectedRow) {
        console.error("Error: Selected row not found in filterData.");
        return;
      }

      console.log(selectedRow, "selectedRow--->>>");

      const paymentPayload = {
        clientReferenceId: selectedRow?.request_id || "0",
        payeeName: selectedRow?.vendor_name,
        accountNumber: selectedRow?.account_no,
        branchCode: selectedRow?.ifsc,
        email: selectedRow?.email || "naveen@creativefuel.io",
        phone: selectedRow?.mob1 || "9109102483",
        amount: {
          currency: "INR",
          value: selectedRow?.balance_amount || 0,
        },
        mode: "NEFT",
        remarks: selectedRow?.remark_audit || "No Remark",
      };

      const payResponse = await axios.post(
        baseUrl + `create_payout`,
        paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment successful:", payResponse);
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
