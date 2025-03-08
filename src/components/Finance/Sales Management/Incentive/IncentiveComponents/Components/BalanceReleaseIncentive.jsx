import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
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
import { formatIndianNumber } from "../../../../../../utils/formatIndianNumber";

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
  const [maxIncentiveForNow, setMaxIncentiveForNow] = useState(0);
  const [payingAmount, setPayingAmount] = useState(null);
  const [payingAmountSet, setPayingAmountSet] = useState(null);
  const [userBookingsData, setUserBookingsData] = useState([]);

  const token = sessionStorage.getItem("token");

  const SettlesaleBooking = (data, temppayingAmount) => {
    const result = [];
    let cumulativeSum = 0;

    for (const row of data) {
      if (cumulativeSum + row.earnedIncentiveAmount <= temppayingAmount) {
        result.push(row);
        cumulativeSum += row.earnedIncentiveAmount;
      } else {
        break;
      }
    }

    return { result, settleAmount: cumulativeSum, remainingAdjustAmount: temppayingAmount - cumulativeSum };
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (payingAmount) {

    setPayingAmountSet(true);
    // }
    // Destructure necessary data
    const { _id: incentiveRequestId, updated_by: updatedBy } = selectedData;




    const { result, settleAmount, remainingAdjustAmount } = SettlesaleBooking(userBookingsData?.incentiveCalculationDashboard, (Number(payingAmount) + Number(userBookingsData?.userData?.adjustment_incentive_amount)));
    // // console.log(result, userBookingsData?.incentiveCalculationDashboard.length, settleAmount, remainingAdjustAmount)

    // Build saleBookingIds array using optional chaining to prevent undefined errors
    const saleBookingIds = [
      ...(result?.map((c) => c._id) || [])

    ];
    // // console.log(saleBookingIds, "saleBookingIds", userBookingsData?.userData?.adjustment_incentive_amount)

    // Format payment date
    const formattedPaymentDate = moment(paymentDate).format("YYYY/MM/DD");

    // Construct payload
    const payload = {
      incentive_request_id: incentiveRequestId,
      sale_booking_ids: saleBookingIds,
      finance_released_amount: Number(payingAmount),
      account_number: accountNo,
      payment_ref_no: paymentRef,
      payment_date: formattedPaymentDate,
      remarks: remarks,
      updated_by: updatedBy,
      incentive_invoices: balRelInvc,
      adjustment_incentive_amount: Number(remainingAdjustAmount?.toFixed()),
    };

    // // console.log(payload, "payloadyload")
    // return;
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
      // setIsFormSubmitted(true);
    } catch (error) {
      // console.error("Error releasing campaigns:", error);
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

  const ValidatePayment = (event) => {
    const temmpPayingAmount = event.target.value;
    if (temmpPayingAmount <= maxIncentiveForNow) {

      setPayingAmount(temmpPayingAmount)
      setPayingAmountSet(false)
    }
  }
  const handleClose = () => {
    setModalOpen(false)
    setPayingAmount(null)
    // // // console.log("first")
  }

  const totalIncentiveRemaining = userBookingsData?.incentiveCalculationDashboard?.reduce(
    (sum, c) => sum + c.earnedIncentiveAmount,
    0
  );
  // console.log(totalIncentiveRemaining, "totalIncentiveRemaining", userBookingsData?.incentiveCalculationDashboard)
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isModalOpen}
        onClose={() => handleClose()}
      >
        <DialogTitle>Incentive Release - {selectedData?.sales_executive_name}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
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
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {`₹ ${formatIndianNumber(selectedData.user_requested_amount?.toFixed())}`}
              >
                <ListItemText primary="Requested Amount" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {`₹ ${formatIndianNumber(maxIncentiveForNow?.toFixed())}`}
              >
                <ListItemText primary="Max Amount Allowed" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {`₹ ${formatIndianNumber(totalIncentiveRemaining?.toFixed() - userBookingsData?.userData?.adjustment_incentive_amount)}`}
              >
                <ListItemText primary="Total Incentive Remaining" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {<input
                  className="form-control"
                  type="number"
                  value={payingAmount}
                  placeholder="Amount Paid"
                  required
                  onFocusCapture={() => setPayingAmountSet(true)}
                  onChange={(e) => ValidatePayment(e)}
                />}
              >
                <ListItemText primary="Releasing Amount" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {<input
                  type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={accountNo}
                  placeholder="Last four Digit"

                  onChange={(e) => {
                    return e?.target?.value?.length <= 4
                      ? setAccountNo(e.target.value)
                      : toastError("Please enter valid account number");
                  }}
                  required
                />}
              >
                <ListItemText primary="Benificary Account Number" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {<input
                  // type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="Transaction ID or Ref No."
                  required
                />}
              >
                <ListItemText primary="Payment Ref Number" />
              </ListItem>
              <ListItem
                // key={value}
                disableGutters
                secondaryAction=
                {<>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker

                      value={paymentDate}
                      className="mt-3 w-100 mb"
                      format="DD/MM/YYYY"
                      onChange={(e) => setPaymentDate(e)}
                      label="Transaction Date"
                    />
                  </LocalizationProvider>
                </>
                }
              >
                <ListItemText primary="Payment Date" />
              </ListItem>
            </List>
            {/* <label>Requested Amount</label>
            <input
              type="number"
              className="form-control"
              value={selectedData.user_requested_amount}
              readOnly
            /> */}

            {/* <label>Balance To Release</label>
            <input
              type="number"
              className="form-control"
              value={
                selectedData.finance_released_amount
                  ? selectedData.finance_released_amount
                  : 0
              }
              readOnly
            /> */}

            {/* <label>
              Max Amount <sup className="text-danger">*</sup>
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              required
              value={maxIncentiveForNow?.toFixed()}
            /> */}
            {/* <input
              className="form-control"
              id="images"
              name="images"
              required
              value={payingAmount?.toFixed()}
            /> */}

            <IncentiveRelease
              selectedRow={selectedData}
              setp_Total={setp_Total}
              setIncentiveRelease={setIncentiveRelease}
              setp_TotalTrue={setp_TotalTrue}
              setp_TotalFalse={setp_TotalFalse}
              setMaxIncentiveForNow={setMaxIncentiveForNow}
              payingAmount={payingAmount}
              payingAmountSet={payingAmountSet}
              userBookingsData={userBookingsData} setUserBookingsData={setUserBookingsData}
            />

            {/* <label> Releasing Amount</label>
            <input
              className="form-control"
              type="number"
              value={payingAmount}
              // readOnly
              onChange={(e) => ValidatePayment(e)}
            /> */}

            {/* <label> Payment Type</label>
            <input
              className="form-control"
              type="text"
              value={paymentType}
              readOnly
            /> */}

            {/* {paymentType === "Partial Payment" && (
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
            )} */}

            {/* <label>
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
            /> */}
            {/* <label>Payment ref number </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => setPaymentRef(e.target.value)}
              required
            /> */}

            {/* <div className="row"> */}
            <label htmlFor="paymentProof">Payment Proof/ScreenShot</label>
            <input
              type="file"
              className="form-control mt-3"
              id="paymentProof"
              onChange={handleFileChange}
            />
            {/* </div> */}
            {/* <label>Remarks</label> */}
            <input
              type="text"
              className="form-control mt-3"
              value={remarks}
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={paymentDate}
                className="mt-3 w-100 mb"
                format="DD/MM/YYYY"
                onChange={(e) => setPaymentDate(e)}
                label="Payment Date"
              />
            </LocalizationProvider> */}
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
