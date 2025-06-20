import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import moment from "moment";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../../../../utils/config";
import { useGlobalContext } from "../../../../../../Context/Context";
import CircularProgress from "@mui/material/CircularProgress";
import { useUpdateOutstandingBalancePaymentMutation } from "../../../../../Store/API/Finance/OutstandingNew";
// import { useUpdateOutstandingBalancePaymentMutation } from "../../../../../Store/API/Finance/OutstandingApi";

function DialogforBalancePaymentUpdate(props) {
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;

  const {
    paidPercentage,
    paymentDetails,
    dropdownData,
    ImageModalOpen,
    setImageModalOpen,
    paymentDate,
    setPaymentDate,
    balAmount,
    setBalAmount,
    paidAmountData,
    paidAmount,
    setPaidAmount,
    paymentRefNo,
    singleRow,
    setPaymentRefNo,
    setPaymentDetails,
    setPaidPercentage,
    getData,
    setCloseDialog,
    paymentRefImg,
    setPaymentRefImg,
  } = props;

  const [
    updateOutstandingBalancePayment,
    {
      isLoading: updateOutstandingBalancePaymentLoading,
      isError: updateOutstandingBalancePaymentError,
      isSuccess: updateOutstandingBalancePaymentSuccess,
    },
  ] = useUpdateOutstandingBalancePaymentMutation();

  const [showField, setShowField] = useState(false);
  const [paymentType, setPaymentType] = useState({ label: "", value: "" });
  console.log(singleRow, "singleRow")
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setPaymentRefNo("");
    setPaymentRefImg("");
    setPaymentType({ label: "", value: "" });
    setPaymentDetails("");
    setPaidAmount([]);
    setPaidPercentage("");
    setPaymentDate(null);
  };
  // console.log("balance update")
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("sale_booking_id", singleRow?.sale_booking_id);
      formData.append("account_id", singleRow?.account_id || "");
      formData.append("payment_ref_no", paymentRefNo || "");
      formData.append("payment_detail_id", paymentDetails?.id || "");
      formData.append("payment_screenshot", paymentRefImg || "");
      formData.append("payment_amount", paidAmount || "");
      formData.append("payment_date", paymentDate || "");
      formData.append("created_by", loginUserId || "");
      formData.append("invoice_req_id", singleRow._id);
      // formData.append("connected_booking_id", );

      await updateOutstandingBalancePayment(formData).unwrap();
      getData();
      setBalAmount("");
      setPaymentRefNo("");
      setPaymentRefImg("");
      setPaymentType({ label: "", value: "" });
      setPaymentDetails("");
      setPaidAmount("");
      setImageModalOpen(false);
      toastAlert("Data updated successfully");
    } catch (error) {
      toastAlert("Failed to update data. Please try again.", "error");
    }
  };
  // console.log(singleRow, "singleRow")
  const handlePaymentDetails = (e, id) => {
    if (id) {
      setPaymentDetails(id);
    }
  };

  // TDS DIALOG FUNCTION:-
  const handleOpenTDSFields = (row) => {
    // if (!paymentDetails && paidPercentage < 90) {
    //   toastError("Please Fill Payment Details");
    // } else {
    setImageModalOpen(false);
    setCloseDialog(true);
    // }
  };

  const handleCloseTDSFields = () => {
    setCloseDialog(false);
  };
  // console.log(dropdownData, "dropdownData")
  return (
    <Dialog
      onClose={handleCloseImageModal}
      aria-labelledby="customized-dialog-title"
      open={ImageModalOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Payment Update for {singleRow?.invoice_number}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseImageModal}
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
        <div className="row">
          <div className="col-md-12 ">
            <form onSubmit={handleSubmit}>
              {/* <div className="form-group col-12">
      
              </div> */}
              <div className="form-group mt-3">

              </div>
              <label >Account Name : {singleRow?.party_name} </label>
              {/* <label >Invoice Number : {singleRow?.invoice_number} </label> */}
              {/* <label htmlFor="paid-amount">Payment Date</label> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <DatePicker
                  className="form-control mt-3"
                  label="Payment Date"
                  value={paymentDate}
                  format="DD/MM/YYYY"
                  onChange={setPaymentDate}
                />
              </LocalizationProvider>
              <div className="form-group mt-3">
                <label >Balance Amount : ₹{balAmount}      |        Paid Amount :  ₹{paidAmountData}</label>

                {/* <label >Paid Amount :  {paidAmountData}</label> */}
                {/* <label htmlFor="images">{balAmount}</label> */}
                {/* <input
                  type="number"
                  className="form-control"
                  id="balance Amount"
                  // name="balance Amount"
                  label='Balance Amount'
                  value={balAmount}
                  readOnly
                  required
                /> */}
              </div>
              <div className="form-group mt-3">
                {/* <label htmlFor="images">Paid Amount :  {paidAmountData}</label> */}
                {/* <label htmlFor="images">{paidAmountData}</label> */}
                {/* <input
                  type="number"
                  className="form-control"
                  id="paid Amount"
                  name="paid Amount"
                  value={paidAmountData}
                  readOnly
                  required
                /> */}
                <TextField
                  variant="outlined"
                  className="form-control "
                  placeholder="Transaction Amount"
                  label="Transaction Amount"
                  value={paidAmount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!isNaN(inputValue) && inputValue !== "") {
                      const parsedValue = parseFloat(inputValue);
                      if (parsedValue <= balAmount) {
                        setPaidAmount(parsedValue);
                        setShowField(true);
                        setPaymentType(
                          parsedValue == balAmount
                            ? { label: "Full", value: "full" }
                            : { label: "Partial", value: "partial" }
                        );
                      } else {
                        toastError(
                          "Paid amount should be less than or equal to the balance amount"
                        );
                      }
                    } else {
                      toastError("Please enter a valid numeric value");
                      setPaidAmount("");
                      setShowField(false);
                    }
                  }}
                />
              </div>
              {/* <label htmlFor="paid-amount" className="pb-2">
                Paid Amount
              </label> */}

              {showField && paidAmount > 0 && (
                <div className="row">
                  <div className="col-md-12 ">
                    <div className="form-group">
                      <label htmlFor="images">Remaining Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        id="remaining amount"
                        name="remaining amount"
                        value={balAmount - paidAmount}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-12 ">
                    <div className="form-group">
                      <label htmlFor="images">Paid Percentage %</label>
                      <input
                        type="number"
                        className="form-control"
                        id="paid %"
                        name="paid %"
                        value={paidPercentage}
                        readOnly
                        required
                      />
                    </div>
                  </div> */}
                </div>
              )}

              <div className="form-group mt-3">
                {/* <label htmlFor="images">Payment Reference Number</label> */}
                {/* <input
                  type="text"
                  className="form-control"
                  id="images"
                  // name="images"
                  // id="combo-box-demo"
                  label="Payment Reference Number"
                  value={paymentRefNo}
                  onChange={(e) => setPaymentRefNo(e.target.value)}
                /> */}
                <TextField
                  variant="outlined"
                  className="form-control "
                  placeholder="Payment Reference Number"
                  label="Payment Reference Number"
                  value={paymentRefNo}
                  onChange={(e) => setPaymentRefNo(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">

                {/* <label htmlFor="paid-amount">Payment Details *</label> */}
                <Autocomplete
                  className="my-2 mt-3"
                  id="combo-box-demo"
                  // label="Payment Details"
                  placeholder="Payment Details"
                  options={
                    dropdownData &&
                    dropdownData?.map((item) => ({
                      label: item.title,
                      id: item._id,
                      payment_mode_id: item.payment_mode_id,
                    }))
                  }
                  onChange={(e, id) => handlePaymentDetails(e, id)}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Payment Details" />
                  )}
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Payment Reference Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={(e) => setPaymentRefImg(e.target.files[0])}
                />
              </div>
              {/* <Autocomplete
                className="my-2 mt-3"
                id="combo-box-demo"
                value={paymentType}
                readOnly
                options={[
                  { label: "Full", value: "full" },
                  { label: "Partial", value: "partial" },
                ]}
                onChange={(e, value) => {
                  setPaymentType(value);
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Status" variant="outlined" />
                )}
              /> */}
            </form>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={
            paidAmount === 0 ||
            paidAmount === "" ||
            paymentDetails === "" ||
            // paidPercentage >= 90 ||
            updateOutstandingBalancePaymentLoading
          }
          variant="contained"
          autoFocus
          onClick={(e) => handleSubmit(e)}
        >
          {updateOutstandingBalancePaymentLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Save"
          )}
        </Button>
        {/* {paidPercentage >= 90 ? ( */}
        {singleRow?.invoice_tds_amount == 0 && <Button variant="contained" color="success" autoFocus onClick={handleOpenTDSFields}>
          TdS
        </Button>}
        {/* ) : (
          ""
        )} */}
      </DialogActions>
    </Dialog>
  );
}

export default DialogforBalancePaymentUpdate;
