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
import { baseUrl, insightsBaseUrl } from "../../../../../utils/config";
import ReadableList from "./ReadableList";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import PayThroughVendorDialog from "./PayThroughVendorDialog";

function PayVendorDialog(props) {
  const { toastAlert, toastError } = useGlobalContext();
  const {
    rowData,
    paymentAmout,
    setPaymentAmount,
    netAmount,
    setNetAmount,
    baseAmount,
    payDialog,
    setPayDialog,
    userName,
    callApi,
    rowSelectionModel,
    filterData, GSTHoldAmount, setGSTHoldAmount,

  } = props;


  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const userEmail = decodedToken.email;
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
  const [paymentStatus, setPaymentStatus] = useState("Full");
  const [payRemark, setPayRemark] = useState("Creativefuel");
  const [payMentProof, setPayMentProof] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [vendorDetail, setVendorDetail] = useState({});
  const [vendorBankDetail, setVendorBankDetail] = useState([]);
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  // const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [payThroughVendor, setPayThroughVendor] = useState(false);
  const [gatewayPaymentMode, setGatewayPaymentMode] = useState("NEFT");
  const [preview, setPreview] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    dayjs(new Date()).add(5, "hours").add(30, "minutes").$d.toGMTString()
  );

  useEffect(() => {
    handleCalculatePaymentAmount();
    if (paymentAmout > 0 && paymentAmout <= 10000) {
      setGatewayPaymentMode("IMPS")
    }
  }, [TDSPercentage, GSTHoldAmount, TDSDeduction, gstHold]);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_all_payment_mode`).then((res) => {
      if (res.status == 200) {

        setPaymentModeData(res?.data);
        const defaultOption = res?.data.find((res) => {
          return res.payment_mode == 'PineLab'
        })
        setPaymentMode(defaultOption?.payment_mode)
        // console.log(defaultOption, "paymentModeData", res.data)
      }
    });

    axios.get(`${baseUrl}` + `v1/bank_details_by_vendor_id/${rowData?.vendor_id}?isNumberId=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status == 200) {
        // setVendorDetail(res.data.data)
        setVendorBankDetail(res.data.data)
        console.log(res.data.data, "res.data.data")
      }
    });
  }, []);



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
  console.log(rowData, "rowData")
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
    formData.append("status", 1);
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
      .then((res) => {
        if (res.status == 200) {

          const phpFormData = new FormData();

          phpFormData.append("clientReferenceId", `${rowData?.request_id}_${(Number(rowData?.trans_count) + 1)}`);
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
          phpFormData.append("proccessingAmount", 0);
          phpFormData.append("getway_process_amt", paymentAmout);
          phpFormData.append("tds_deduction", TDSValue);
          phpFormData.append("gst_Hold_Bool", gstHold ? 1 : 0);
          phpFormData.append("tds_Deduction_Bool", TDSDeduction ? 1 : 0);
          phpFormData.append("tds_percentage", TDSPercentage);
          phpFormData.append("payment_getway_status", "SUCCESS");
          // phpFormData.append("getway_process_amt", paymentAmout);

          // payment_getway_status,
          // getway_process_amt,
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
              if (res.status == 200) {
                toastAlert("Payment Done Successfully");
              } else {

                toastError("There is some error while uploading data on Php")
              }

              // whatsappApi.callWhatsAPI(
              //   "Extend Date by User",
              //   JSON.stringify(9109266387),
              //   rowData.vendor_name,
              //   [paymentAmout, rowData.vendor_name, rowData.mob1]
              // );
            });

          // setPaymentMode("Razor Pay");
          setPayRemark("");
          setPayMentProof("");
          handleClosePayDialog();
          setPaymentAmount(0);
          setNetAmount("");
          callApi();
        } else {
          toastError("There is some error while uploading data on Jarvis")
        }
      });
  };
  // console.log(vendorBankDetail, "vendorBankDetail")
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
      setPaymentStatus("Partial");
    } else {
      setPaymentStatus("Full");
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
      setPaymentAmount(Number(paymentAmount) - Number(rowData?.proccessingAmount));
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



  const handleClosePayDialog = () => {
    setPayDialog(false);
    setPaymentMode("Razor Pay");
    setPayRemark("");
    setPayMentProof("");
    setPaymentAmount(0);
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

  const handleOpenPayThroughVendor = () => {
    if (paymentAmout > 100000) {
      toastAlert("You are allow to pay below 10,000")
      return;
    }
    else if (!rowSelectionModel || rowSelectionModel[0]?.mob1?.length != 10) {
      console.log(rowSelectionModel, "rowSelectionModel")
      toastError("Invalid Mobile Number")
      return;
    }
    else if (!paymentAmout || paymentAmout == "" || !paymentAmout > 0) {
      toastError("Invalid Amount")
      return;
    } else if (rowSelectionModel?.ifsc == "") {
      toastError("Invalid IFSC Code")
      return;
    }
    let mailTo = userEmail;
    if (!userEmail || userEmail == "") {
      mailTo = "naveen@creativefuel.io";
    }
    setPayThroughVendor(true);
    try {

      axios
        .post(insightsBaseUrl + `v1/payment_otp_send`, {
          "email": mailTo
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        }).then((res) => {

          if (res.status == 200) {
            toastAlert("OTP sent to registered Id successfully")
          } else if (res.status == 401) {
            toastAlert("You are not authorizied make this payment")
          }
        })
    } catch (error) {
      toastAlert(error)
    }

  };

  return (
    <div>
      {/*Dialog Box */}

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
          <ReadableList rowData={rowData} vendorDetail={vendorDetail} vendorBankDetail={vendorBankDetail} selectedBankIndex={selectedBankIndex}
            setSelectedBankIndex={setSelectedBankIndex} />
          <Divider />

          <div className="row gap-3">
            <>
              <FormControlLabel
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
                const currentValue = e.target.value;

                // Ensure input is a valid number or empty
                if (/^\d*$/.test(currentValue)) {
                  if (currentValue === "") {
                    setPaymentAmount(""); // Allow empty value
                    setPaymentStatus("");
                    setGatewayPaymentMode("");
                  } else {
                    const numericValue = Number(currentValue)
                    const paymentProcessingAmount = Number(rowData?.proccessingAmount)
                    // (Number(row?.outstandings) - Number(row?.proccessingAmount)) > 0
                    if (numericValue + paymentProcessingAmount <= +rowData.balance_amount) {
                      // if (numericValue + paymentProcessingAmount <= +rowData.balance_amount) {
                      setPaymentAmount(numericValue);

                      // Set Gateway Payment Mode
                      if (numericValue < 1000) {
                        setGatewayPaymentMode("IMPS");
                      }

                      // Set Payment Status
                      if (numericValue < Math.floor(netAmount)) {
                        setPaymentStatus("Partial");
                      } else {
                        setPaymentStatus("Full");
                      }
                    } else {
                      toastError(
                        "Payment Amount should be less than or equal to Remainning Amount"
                      );
                    }
                  }
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
              value={paymentAmout === "" ? "" : (paymentAmout)}
            />

            {/* {TDSValue && (
              <TextField
                // className="col"
                // autoFocus
                // margin="dense"
                id="amount"
                label="Adjust Amount"
                type="number"
                variant="outlined"
                // fullWidth
                readOnly
                value={adjustAmount}
                InputProps={{
                  readOnly: true,
                }}
              />
            )} */}
          </div>
          <div className="row gap-3">
            <TextField
              className="col mt-2"
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
          {paymentMode != "PineLab" ? <Button
            variant="contained"
            // className="mx-2"
            size="small"
            onClick={(e) => handlePayVendorClick(e)}
            disabled={!paymentMode || !paymentAmout}
          >
            Pay Vendor
          </Button> :
            <Button
              // className="btn btn-success cmnbtn btn_sm ms-2"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleOpenPayThroughVendor}
              disabled={!paymentAmout > 0}
            >
              Pay Through Gateway
            </Button>}
        </DialogActions>
      </Dialog>


      {payThroughVendor && <PayThroughVendorDialog
        setPayThroughVendor={setPayThroughVendor}
        payThroughVendor={payThroughVendor}
        rowSelectionModel={rowSelectionModel}
        filterData={filterData}
        paymentStatus={paymentStatus}
        handlePayVendorClick={handlePayVendorClick}
        handleClosePayDialog={handleClosePayDialog}
        gatewayPaymentMode={gatewayPaymentMode}
        setGatewayPaymentMode={setGatewayPaymentMode}
        rowData={rowData}
        paymentAmout={paymentAmout}
        userName={userName}
        payRemark={payRemark}
        TDSValue={TDSValue}
        GSTHoldAmount={GSTHoldAmount}
        gstHold={gstHold}
        TDSDeduction={TDSDeduction}
        TDSPercentage={TDSPercentage}
        paymentDate={paymentDate}
        vendorBankDetail={vendorBankDetail}
        adjustAmount={adjustAmount}
        callApi={callApi}
        selectedBankIndex={selectedBankIndex}
        setSelectedBankIndex={setSelectedBankIndex}

      />}

    </div>
  );
}

export default PayVendorDialog;
