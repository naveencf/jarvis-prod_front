import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import IncentiveRelease from "../../../../../AdminPanel/Sales/Incenti Dashboard/IncentiveRelease";
import { useGlobalContext } from "../../../../../../Context/Context";
import axios from "axios";
import { baseUrl } from "../../../../../../utils/config";

const BalanceReleaseIncentive = (props) => {
  const {
    setModalOpen,
    isModalOpen,
    getData,
    selectedData,
    setAccountNo,
    setPaymentRef,
    accountNo,
    paymentRef,
    remarks,
    setRemarks,
    setBalanceReleaseAmount,
    balanceReleaseAmount,
  } = props;
  const { toastAlert, toastError } = useGlobalContext();
  const [balRelInvc, setBalRelInvc] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [selectedTrue, setp_TotalTrue] = useState(0);
  const [selectedFalse, setp_TotalFalse] = useState(0);
  const [total, setp_Total] = useState(0);
  const [incentiveRelease, setIncentiveRelease] = useState();
  const [partialPaymentReason, setPartialPaymentReason] = useState("");
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));

  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure necessary data
    const { _id: incentiveRequestId, updated_by: updatedBy } = selectedData;

    // Build saleBookingIds array using optional chaining to prevent undefined errors
    const saleBookingIds = [
      ...(selectedTrue?.map((c) => c._id) || []),
      ...(selectedFalse?.map((c) => c._id) || []),
    ];

    // Format payment date
    const formattedPaymentDate = moment(paymentDate).format("YYYY/MM/DD");

    // Construct payload
    const payload = {
      incentive_request_id: incentiveRequestId,
      sale_booking_ids: saleBookingIds,
      finance_released_amount: total,
      account_number: accountNo,
      payment_ref_no: paymentRef,
      payment_date: formattedPaymentDate,
      remarks: remarks,
      updated_by: updatedBy,
      incentive_invoices: balRelInvc,
    };

    try {
      // Send PUT request
      await axios.put(
        `${baseUrl}/sales/incentive_request_release_by_finance/${incentiveRequestId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getData();
      setModalOpen(false);
      toastAlert("Data updated successfully.");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error releasing campaigns:", error);
      toastError(
        `Error releasing campaigns: ${error?.response?.data?.message || error?.message
        }`
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBalRelInvc(file);
  };

  useEffect(() => {
    balanceReleaseAmount * 1 + selectedData.released_amount * 1 ==
      selectedData.request_amount
      ? setPaymentType("Full Payment")
      : setPaymentType("Partial Payment");
    setPartialPaymentReason("");
  }, [balanceReleaseAmount]);
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogTitle>Balance Release</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Request Amount</label>
            <input
              type="number"
              className="form-control"
              value={selectedData.user_requested_amount}
              readOnly
            />

            <label>Balance To Release</label>
            <input
              type="number"
              className="form-control"
              value={
                selectedData.finance_released_amount
                  ? selectedData.finance_released_amount
                  : 0
              }
              readOnly
            />

            <label>
              Paid Amount <sup className="text-danger">*</sup>
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              required
              value={total}
            />

            <IncentiveRelease
              selectedRow={selectedData}
              setp_Total={setp_Total}
              setIncentiveRelease={setIncentiveRelease}
              setp_TotalTrue={setp_TotalTrue}
              setp_TotalFalse={setp_TotalFalse}
            />

            <label> Payment Type</label>
            <input
              className="form-control"
              type="text"
              value={paymentType}
              readOnly
            />

            {paymentType === "Partial Payment" && (
              <div>
                <label>
                  Partial Payment Reason <sup className="text-danger">*</sup>
                </label>
                <Autocomplete
                  placeholder="Partial Payment Reason"
                  disablePortal
                  value={partialPaymentReason}
                  onChange={(e, value) => setPartialPaymentReason(value)}
                  options={[
                    "Fund Management",
                    "Tax Deduction",
                    "Bad Debt Adjustment",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={paymentType === "Partial Payment"}
                    />
                  )}
                />
              </div>
            )}

            <label>
              Last 4 digit of account Number{" "}
              <sup className="text-danger">*</sup>
            </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => {
                return e?.target?.value?.length <= 4
                  ? setAccountNo(e.target.value)
                  : toastError("Please enter valid account number");
              }}
              required
            />
            <label>Payment ref number </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => setPaymentRef(e.target.value)}
              required
            />

            <div className="row">
              <label htmlFor="paymentProof">Payment Proof/ScreenShot</label>
              <input
                type="file"
                className="form-control mt-3"
                id="paymentProof"
                onChange={handleFileChange}
              />
            </div>
            <label>Remarks</label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={paymentDate}
                className="mt-3 w-100 mb"
                format="DD/MM/YYYY"
                onChange={(e) => setPaymentDate(e)}
                label="Payment Date"
              />
            </LocalizationProvider>
            <button
              type="submit"
              className="btn btn-primary d-block"
              style={{ marginTop: "15px" }}
            >
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BalanceReleaseIncentive;
