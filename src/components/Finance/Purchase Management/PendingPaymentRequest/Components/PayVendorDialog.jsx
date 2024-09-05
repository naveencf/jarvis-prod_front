import React from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import ReadableList from "./ReadableList";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";

function PayVendorDialog(props) {
  const { toastAlert, toastError } = useGlobalContext();
  const {
    loading,
    setLoading,
    phpRemainderData,
    rowData,
    setRowData,
    paymentAmout,
    setPaymentAmount,
    netAmount,
    setNetAmount,
    baseAmount,
    setBaseAmount,
    payDialog,
    setPayDialog,
    userName,
    callApi,
  } = props;

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  //   const [netAmount, setNetAmount] = useState("");
  //   const [paymentAmout, setPaymentAmount] = useState("");
  //   const [baseAmount, setBaseAmount] = useState(0);
  //   const [loading, setLoading] = useState(false);
  //   const [payDialog, setPayDialog] = useState(true);
  const [TDSDeduction, setTDSDeduction] = useState(false);
  const [TDSPercentage, setTDSPercentage] = useState(1);
  const [isTDSMandatory, setIsTDSMandatory] = useState(false);
  const [isTDSDeducted, setIsTDSDeducted] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [gstHold, setGstHold] = useState(false);
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [paymentMode, setPaymentMode] = useState(null);
  const [TDSValue, setTDSValue] = useState(0);
  const [tdsAdjustAmount, setTdsAdjustAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Full-Payment");
  const [payRemark, setPayRemark] = useState("");
  const [payMentProof, setPayMentProof] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [preview, setPreview] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    dayjs(new Date()).add(5, "hours").add(30, "minutes").$d.toGMTString()
  );

  useEffect(() => {
    handleCalculatePaymentAmount();
  }, [TDSPercentage, GSTHoldAmount, TDSDeduction, gstHold]);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_all_payment_mode`).then((res) => {
      setPaymentModeData(res?.data);
    });
  }, []);

  // useEffect(() => {
  //   const initialAdjustmentAmt = netAmount - Math.floor(paymentAmout);
  //   const formattedAdjustmentAmt = initialAdjustmentAmt.toFixed(1);
  //   setAdjustAmount(formattedAdjustmentAmt);
  // }, [rowData, paymentAmout]);

  useEffect(() => {
    const isTDSMandatory =
      rowData?.totalFY > 100000 || rowData?.totalFY > 25000;
    const isTDSDeducted = rowData?.TDSDeduction === "1";
    setIsTDSMandatory(isTDSMandatory);
    setIsTDSDeducted(isTDSDeducted);

    if (isTDSMandatory && !isTDSDeducted) {
      setTDSDeduction(true);
    }
  }, [rowData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPayMentProof(file);
    setPreview(URL.createObjectURL(file));
  };

  const openImgDialog = () => {
    setOpenDialog(true);
  };

  const handleGstHold = (e) => {
    setGstHold(e.target.checked);
    setGSTHoldAmount(rowData.gst_amount);
  };

  const handlePayVendorClick = (e) => {
    e.preventDefault();
    // displayRazorpay(paymentAmout);
    // return;
    const formData = new FormData();
    formData.append("request_id", rowData.request_id);
    formData.append("vendor_id", rowData.vendor_id);
    formData.append("request_by", rowData.request_by);
    formData.append("request_amount", rowData.request_amount);
    formData.append("priority", rowData.priority);
    formData.append("status", 1); //status will be Change Soon
    formData.append("evidence", payMentProof);
    formData.append("payment_mode", paymentMode);
    formData.append("payment_amount", paymentAmout);
    formData.append("payment_by", userID);
    formData.append("remark_finance", payRemark);
    formData.append("invc_no", rowData.invc_no);
    formData.append("invc_Date", rowData.invc_Date);
    formData.append("invc_remark", rowData.invc_remark);
    formData.append("remark_audit", rowData.remark_audit);
    formData.append("outstandings", rowData.outstandings);
    formData.append("vendor_name", rowData.vendor_name);
    formData.append("name", rowData.name);
    formData.append("request_date", rowData.request_date);
    formData.append("payment_date", paymentDate);
    formData.append("gst_hold", rowData.gst_amount);
    formData.append("gst_hold_amount", GSTHoldAmount);
    formData.append("tds_deduction", TDSValue);
    formData.append("gst_Hold_Bool", gstHold);
    formData.append("tds_Deduction_Bool", TDSDeduction);
    formData.append("tds_percentage", TDSPercentage);

    axios
      .post(baseUrl + "phpvendorpaymentrequest", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        const phpFormData = new FormData();
        phpFormData.append("request_id", rowData.request_id);
        phpFormData.append("payment_amount", paymentAmout);
        phpFormData.append(
          "payment_date",
          new Date(paymentDate)?.toISOString().slice(0, 19).replace("T", " ")
        );
        phpFormData.append("payment_by", userName);
        phpFormData.append("evidence", payMentProof);
        phpFormData.append("finance_remark", payRemark);
        phpFormData.append("status", 1);
        phpFormData.append("payment_mode", paymentMode);
        phpFormData.append("gst_hold", rowData.gst_amount);
        phpFormData.append("adjust_amt", TDSValue ? adjustAmount : 0);
        phpFormData.append("gst_hold_amount", GSTHoldAmount);
        phpFormData.append("request_amount", rowData.request_amount);
        phpFormData.append("tds_deduction", TDSValue);
        phpFormData.append("gst_Hold_Bool", gstHold ? 1 : 0);
        phpFormData.append("tds_Deduction_Bool", TDSDeduction ? 1 : 0);
        phpFormData.append("tds_percentage", TDSPercentage);
        axios
          .post(
            "https://purchase.creativefuel.io/webservices/RestController.php?view=updatePaymentrequestNew",
            phpFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            toastAlert("Payment Done Successfully");

            whatsappApi.callWhatsAPI(
              "Extend Date by User",
              JSON.stringify(9109266387),
              rowData.vendor_name,
              [paymentAmout, rowData.vendor_name, rowData.mob1]
            );
          });

        setPaymentMode("Razor Pay");
        setPayRemark("");
        setPayMentProof("");
        handleClosePayDialog();
        setPaymentAmount("");
        setNetAmount("");
        callApi();
      });
  };

  const handleTDSDeduction = (e) => {
    // console.log(e.target.checked, "e.target.checked", TDSPercentage, TDSValue);
    setTDSDeduction(e.target.checked);
    setTDSPercentage(1);
  };

  const handleCalculatePaymentAmount = () => {
    // if (gstHold && TDSDeduction) {
    //   setPaymentStatus("Fully Paid GST Hold and TDS Deduction");
    // } else if (gstHold) {
    //   setPaymentStatus("Fully Paid GST Hold");
    // } else if (TDSDeduction) {
    //   setPaymentStatus("Fully Paid TDS Deduction");
    // } else {
    //   setPaymentStatus("Fully-Paid");
    // }

    if (paymentAmout < Math.floor(netAmount)) {
      setPaymentStatus("Partial-Payment");
    } else {
      setPaymentStatus("Full-Payment");
    }

    let paymentAmount = rowData.balance_amount;
    let baseamount = baseAmount;
    let tdsvalue = 0;

    if (TDSDeduction) {
      tdsvalue = (baseamount * TDSPercentage) / 100;
      paymentAmount = paymentAmount - tdsvalue;
    }
    if (gstHold) {
      paymentAmount = paymentAmount - GSTHoldAmount;
    }
    // tdsvalue = Math.round(tdsvalue);
    setTDSValue(tdsvalue);
    // setPaymentAmount(paymentAmount);
    if (rowData?.TDSDeduction !== "1") {
      setPaymentAmount(paymentAmount);
    }
    setNetAmount(paymentAmount);
    setAdjustAmount((paymentAmount - Math.floor(paymentAmount)).toFixed(2));
    setTdsAdjustAmount((paymentAmount - Math.floor(paymentAmount)).toFixed(2));
  };

  const handleGSTHoldInputChange = (e) => {
    if (e.target.value > rowData.gst_amount) {
      toastError("GST Hold Amount can't be greater than GST Amount");
    } else {
      setGSTHoldAmount(e.target.value);
    }
  };

  const getPaymentStatus = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Full-Paid";
      case "2":
        return "Discard";
      case "3":
        return "Partial";
      default:
        return "";
    }
  };
  const handleClosePayDialog = () => {
    setPayDialog(false);
    setPaymentMode("Razor Pay");
    setPayRemark("");
    setPayMentProof("");
    setPaymentAmount("");
    setNetAmount("");
    setTDSDeduction(false);
    setGstHold(false);
  };

  const handleTdspercentageChange = (e, value) => {
    setTDSPercentage(value);

    const currentValue = e.target.value;
    if (/^\d+$/.test(currentValue) || currentValue === "") {
      // setPaymentAmount(currentValue);
      if (currentValue <= +rowData.balance_amount) {
        setNetAmount(currentValue);

        // setAdjustAmount(currentValue - Math.floor(currentValue))
      } else {
        toastError(
          "Payment Amount should be less than or equal to Requested Amount"
        );
      }
    } else {
      setNetAmount("");
    }
  };
  return (
    <div>
      {/*Dialog Box */}
      {/* {!payDialog ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: "28%",
            width: "50%",
            zIndex: "222",
          }}
        >
        
          <Loader/>
        </div>
      ) : ( */}
      <Dialog open={payDialog} onClose={handleClosePayDialog}>
        <DialogTitle>Vendor Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePayDialog}
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
          {/* <div className="row gap-3"> */}

          <ReadableList rowData={rowData} />
          <Divider />

          {/* <Divider /> */}
          <div className="row gap-3">
            <>
              <FormControlLabel
                // className="col-md-3"
                control={
                  <Checkbox
                    onChange={handleTDSDeduction}
                    checked={TDSDeduction}
                    disabled={isTDSDeducted}
                  />
                }
                label="TDS Deduction"
              />

              {TDSDeduction && (
                <>
                  <Autocomplete
                    onChange={(e, value) => handleTdspercentageChange(e, value)}
                    disablePortal
                    className="col-md-3 mt-2"
                    sx={{ maxWidth: "20%" }}
                    value={TDSPercentage}
                    id="combo-box-demo"
                    options={[1, 2, 10]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="TDS %"
                        // placeholder="TDS %"
                      />
                    )}
                    disable={true}
                  />
                  <TextField
                    className="col-md-3 mt-2"
                    value={TDSValue}
                    autoFocus
                    readOnly
                    margin="dense"
                    variant="outlined"
                    id="name"
                    label="TDS Amount"
                    disable={true}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    className="col-md-3 mt-2"
                    disable={true}
                    autoFocus
                    type="number"
                    margin="dense"
                    id="name"
                    label=" Net Amount *"
                    variant="outlined"
                    fullWidth
                    value={netAmount}
                  />
                </>
              )}
            </>
          </div>
          <div className="row gap-3">
            <TextField
              className="col"
              value={`₹${rowData.request_amount}`}
              autoFocus
              margin="dense"
              id="name"
              sx={{ ml: 2 }}
              // disabled
              readOnly
              label="Amount Requested"
              type="text"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="col"
              value={`₹${rowData.balance_amount}`}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Balance Amount"
              type="text"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className="col-md-4 me-3"
              value={`₹${rowData.request_amount - rowData.gst_amount}`}
              autoFocus
              margin="dense"
              id="name"
              // disabled
              readOnly
              label="Base Amount"
              type="text"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          <div className="row">
            <FormControlLabel
              className="col-md-5"
              control={
                <Checkbox
                  onChange={handleGstHold}
                  disabled={rowData.gst_amount == 0}
                />
              }
              label="GST Hold"
            />

            {gstHold && (
              <TextField
                className="col"
                value={GSTHoldAmount}
                // onChange={handleGSTHoldInputChange}
                autoFocus
                margin="dense"
                id="name"
                label="GST Hold"
                variant="standard"
              />
            )}
          </div>
          <div className="row gap-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                className="col mt-2"
                defaultValue={dayjs()}
                autoFocus
                label="Payment Date "
                onChange={(newValue) => {
                  setPaymentDate(
                    newValue.add(5, "hours").add(30, "minutes").$d.toGMTString()
                  );
                }}
                disableFuture
                views={["year", "month", "day"]}
              />
            </LocalizationProvider>
            {/* <Autocomplete
            onChange={(e, value) => setPaymentMode(value)}
            disablePortal
            className="col mt-1"
            id="combo-box-demo"
            options={
              paymentModeData.length > 0
                ? paymentModeData?.map((item) => item.payment_mode)
                : []
            }
            fullWidth={true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Payment Mode *"
                placeholder="Payment Mode"
              />
            )}
          /> */}

            <Autocomplete
              onChange={(e, value) => setPaymentMode(value || null)}
              className="col mt-1"
              id="combo-box-demo"
              options={paymentModeData.map((item) => item.payment_mode)}
              value={paymentMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Mode *"
                  placeholder="Payment Mode"
                />
              )}
            />
          </div>
          <div className="row gap-3">
            <TextField
              onChange={(e) => {
                // rowData.balance_amount;

                const currentValue = e.target.value;
                if (/^\d+$/.test(currentValue) || currentValue === "") {
                  // setPaymentAmount(currentValue);
                  if (currentValue <= +rowData.balance_amount) {
                    setPaymentAmount(currentValue);
                    // setAdjustAmount( rowData.balance_amount  - currentValue - TDSValue)
                    // setPaymentStatus;
                  } else {
                    toastError(
                      "Payment Amount should be less than or equal to Requested Amount"
                    );
                  }
                } else {
                  setPaymentAmount("");
                }

                if (currentValue < Math.floor(netAmount)) {
                  setPaymentStatus("Partial-Payment");
                } else {
                  setPaymentStatus("Full-Payment");
                }
              }}
              className="col"
              autoFocus
              type="number"
              margin="dense"
              id="name"
              label="Paid Amount *"
              variant="outlined"
              fullWidth
              value={
                paymentAmout == 0 ? paymentAmout : Math.floor(paymentAmout)
              }
            />

            {TDSValue && (
              <TextField
                // onChange={(e) => setAdjustAmount(e.target.value)}
                // multiline
                className="col"
                autoFocus
                margin="dense"
                id="amount"
                label="Adjust Amount"
                type="number"
                variant="outlined"
                fullWidth
                readOnly
                value={adjustAmount}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          </div>
          <div className="row gap-3">
            <TextField
              className="col"
              onChange={(e, value) => setPaymentStatus(value)}
              value={paymentStatus}
              autoFocus
              margin="dense"
              id="name"
              // sx={{ml:2}}
              // disabled
              readOnly
              label="Payment Status"
              type="text"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              onChange={(e) => setPayRemark(e.target.value)}
              multiline
              className="col mt-2"
              autoFocus
              margin="dense"
              id="name"
              label="Remark"
              type="text"
              variant="outlined"
              fullWidth
              value={payRemark}
            />
          </div>
          <div className="row">
            <div className="form-group mt-3">
              <div className="row">
                <label htmlFor="paymentProof">Payment Proof/ScreenShot</label>

                <input
                  type="file"
                  className="form-control col-md-6"
                  id="paymentProof"
                  onChange={handleFileChange}
                  // onClick={openImgDialog}
                />
                <Button
                  variant="contained"
                  className="col-md-5 ms-3"
                  fullWidth
                  onClick={openImgDialog}
                >
                  view image
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="mx-2"
            // fullWidth
            onClick={(e) => handlePayVendorClick(e)}
            disabled={!paymentMode || !paymentAmout}
          >
            Pay Vendor
          </Button>
        </DialogActions>
      </Dialog>
      {/* )} */}
    </div>
  );
}

export default PayVendorDialog;
