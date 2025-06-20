import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../../../utils/config";
import { useGlobalContext } from "../../../../../../Context/Context";
import {
  // useUpdateOutstandingBalancePaymentMutation,
  // useUpdateOutstandingSaleBookingCloseMutation,
} from "../../../../../Store/API/Finance/OutstandingApi";
import { useUpdateOutstandingBalancePaymentMutation, useUpdateOutstandingSaleBookingCloseMutation } from "../../../../../Store/API/Finance/OutstandingNew";
import { useState } from "react";
import { useEffect } from "react";

function TDSDialog(props) {
  const { toastAlert, toastError } = useGlobalContext();
  const {
    getData,
    tdsFieldSaleBookingId,
    closeDialog,
    setCloseDialog,
    balAmount,
    paidAmount,
    tdsPercentage,
    singleRow,
    paymentRefNo,
    paymentDetails,
    paymentRefImg,
    setPaymentRefImg, setTDSPercentage, baseAmount
  } = props;
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;
  const [tdsAmount, setTdsAmount] = useState(0);
  useEffect(() => {
    setTdsAmount(balAmount)
    setTDSPercentage((balAmount / baseAmount) * 100)
  }, [balAmount, paidAmount])
  console.log(balAmount, "balAmount", paidAmount, baseAmount, singleRow)
  const [
    updateOutstandingBalancePayment,
    {
      isLoading: updateOutstandingBalancePaymentLoading,
      isError: updateOutstandingBalancePaymentError,
      isSuccess: updateOutstandingBalancePaymentSuccess,
    },
  ] = useUpdateOutstandingBalancePaymentMutation();
  const [
    updateOutstandingSaleBookingClose,
    {
      isLoading: updateOutstandingSaleBookingCloseLoading,
      isError: updateOutstandingSaleBookingCloseError,
      isSuccess: updateOutstandingSaleBookingCloseSuccess,
    },
  ] = useUpdateOutstandingSaleBookingCloseMutation();

  const handleCloseTDSFields = () => {
    setCloseDialog(false);
  };

  const handleSaveTDS = async (e) => {
    e.preventDefault();

    if (!singleRow?.sale_booking_id || !paidAmount) {
      toastAlert("Please fill in all required fields", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sale_booking_id", singleRow.sale_booking_id);
      formData.append("account_id", singleRow.account_id || "");
      formData.append("payment_ref_no", paymentRefNo || "");
      formData.append("payment_detail_id", paymentDetails?.id || "");
      formData.append("payment_screenshot", paymentRefImg || "");
      formData.append("payment_amount", paidAmount);
      formData.append("created_by", loginUserId);
      formData.append("invoice_req_id", singleRow._id);

      paymentDetails && await updateOutstandingBalancePayment(formData).unwrap();

      const tdsClosePayload = {
        id: tdsFieldSaleBookingId,
        // tds_amount: tdsAmount,
        // tds_percentage: tdsPercentage,
        invoice_tds_amount: tdsAmount,
        invoice_tds_percentage: tdsPercentage,
        invoice_req_id: singleRow._id
      };
      const tdsResponse = await updateOutstandingSaleBookingClose(
        tdsClosePayload
      ).unwrap();

      if (tdsResponse) {
        handleCloseTDSFields();
        toastAlert("Sale Booking Shifted To TDS Open Successfully", "success");
        getData();
      }
    } catch (error) {
      console.error("Error during TDS save:", error);
      toastAlert("Failed to save TDS. Please try again.", "error");
    }
  };
  const handleTdsChange = (e) => {
    console.log(e.target.value)
    // if (e.target.value) {

    setTdsAmount(e.target.value)
    setTDSPercentage((e.target.value / baseAmount) * 100)
    // }
  }
  return (
    <Dialog
      open={closeDialog}
      onClose={handleCloseTDSFields}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>TDS</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseTDSFields}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers={true}
        sx={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="row">
          <div className="col-md-12 ">
            <div className="form-group">
              <label htmlFor="images">TDS Amount</label>
              <input
                type="number"
                className="form-control"
                id="TDS Amount"
                name="TDS Amount"
                value={(tdsAmount)}
                // readOnly
                onChange={(e) => handleTdsChange(e)}
                required
              />
            </div>
          </div>
          <div className="col-md-12 ">
            <div className="form-group">
              <label htmlFor="images">TDS Percentage</label>
              <input
                type="number"
                className="form-control"
                id="TDS Percentage"
                name="TDS Percentage"
                value={tdsPercentage}
                readOnly
                required
              />
            </div>
          </div>
        </div>
        <div className="pack w-100 mt-3 sb">
          <div></div>
          <div className="pack gap16">
            {tdsAmount > 0 && tdsPercentage <= 20 && <Button variant="contained" onClick={(e) => handleSaveTDS(e)}>
              Update
            </Button>}
            <Button variant="contained" onClick={handleCloseTDSFields}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TDSDialog;
