import React from "react";
import {
  Alert,
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
  Stack,
  TextField, Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { baseUrl, insightsBaseUrl, phpBaseUrl } from "../../../../../utils/config";
import ReadableList from "./ReadableList";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import PayThroughVendorDialog from "./PayThroughVendorDialog";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import ImageView from "../../../ImageView";
import PDFExtractorForInvoice from "./PDFExtractorForInvoice";
import { useGetVendorDocumentByVendorDetailQuery } from '../../../../Store/reduxBaseURL';

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
    filterData, GSTHoldAmount, setGSTHoldAmount, setRefetch, refetch

  } = props;

  // getVendorFinancialDetail
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
  const [paymentIntiated, setPaymentIntiated] = useState(false);
  const [vendorPhpDetail, setVendorPhpDetail] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    dayjs(new Date()).add(5, "hours").add(30, "minutes").$d.toGMTString()
  );
  const [openImageDialog, setOpenImageDialog] = useState(true);
  const [isPDF, setIsPDF] = React.useState(false);
  const [viewImgSrc, setViewImgSrc] = useState(rowData.invoice_file_url);

  const [extractedData, setExtractedData] = useState({});
  // const { data: vendorInvoices, isLoading: requestLoading, } = useGetVendorFinancialDetail(vendorDetail?.vendor_obj_id);
  // console.log(vendorInvoices, "vendorInvoices")
  const { data: vendorDocuments, isLoading: isVendorDocumentsLoading } =
    useGetVendorDocumentByVendorDetailQuery(vendorDetail?._id);
  // console.log(vendorDetail)
  useEffect(() => {
    if (vendorDocuments && vendorDocuments.length > 0) {
      const hasGST = vendorDocuments.find(
        (doc) => doc.document_name === "GST" && doc.document_no !== ""
      );

      const panCard = vendorDocuments.find(
        (doc) => doc.document_name === "Pan Card" && doc.document_no !== ""
      );

      let tdsPercentage = 2; // Default TDS if no documents available

      if (hasGST) {
        const seventhChar = hasGST.document_no.charAt(6).toUpperCase(); // Get 7th character of GST
        tdsPercentage = seventhChar === "P" ? 1 : 2;
      } else if (panCard) {
        const fifthChar = panCard.document_no.charAt(4).toUpperCase(); // Get 5th character of PAN
        tdsPercentage = (fifthChar === "F" || fifthChar === "C") ? 2 : 1;
      }
      setTDSPercentage(tdsPercentage);
      console.log(`TDS Percentage: ${tdsPercentage}`);
    }
  }, [vendorDocuments]);

  useEffect(() => {
    let verify = viewImgSrc?.split(".")?.pop()?.toLowerCase() === "pdf";
    setIsPDF(verify);
  }, [viewImgSrc]);
  useEffect(() => {
    handleCalculatePaymentAmount();
    if (paymentAmout > 0 && paymentAmout <= 1000) {
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
        // if(res.data.data)
        setVendorBankDetail(res.data.data)
        // console.log(res.data.data, "res.data.data")
      }
    });
    axios.get(`${baseUrl}` + `v1/vendordata/${rowData?.vendor_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status == 200) {
        // console.log(res.data.data)
        setVendorDetail(res.data.data)
        // findPhpOutstanding(res.data.data)
      }
    });

  }, []);

  // console.log(venodrDocuments, "venodrDocuments", rowData)
  const findPhpOutstanding = (vendorDetailfromphp) => {
    axios
      .post(phpBaseUrl + `?view=getvendorDataListvid`, {
        vendor_id: vendorDetailfromphp?.vendor_id,
      })
      .then((res) => {
        if (res.status == 200) {
          setVendorPhpDetail(res.data.body);
          // console.log(res.data.body, 'vendorDetail', vendorDetail);
        }
      });
  }

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
  // console.log(rowData, "rowData")
  const handlePayVendorClick = (e) => {
    e.preventDefault();

    setPaymentIntiated(true);
    const phpFormData = new FormData();

    phpFormData.append("clientReferenceId", `${rowData?.request_id}_${(Number(rowData?.transaction_count) + 1)}`);
    phpFormData.append("request_id", rowData.request_id);
    phpFormData.append("payment_amount", paymentAmout);
    phpFormData.append("vendor_id", rowData.vendor_id);
    phpFormData.append(
      "payment_date",
      new Date(paymentDate)?.toISOString().slice(0, 19).replace("T", " ")
    );
    phpFormData.append("payment_by", userName);
    phpFormData.append("evidence", payMentProof);
    phpFormData.append("finance_remark", rowData.remark_audit);
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
    phpFormData.append("accountNumber", rowData.accountNumber?.trim(),);
    phpFormData.append("branchCode", rowData.branchCode?.trim());
    // phpFormData.append("getway_process_amt", paymentAmout);

    // payment_getway_status,
    // getway_process_amt,
    axios
      .put(
        baseUrl + `v1/vendor_payment_transactions`,
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
          setPayRemark("");
          setPayMentProof("");
          handleClosePayDialog();
          setPaymentAmount(0);
          setNetAmount("");
          callApi();
          setPaymentIntiated(false);
        } else {
          setPaymentIntiated(false);
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

    // } else {
    //   toastError("There is some error while uploading data on Jarvis")
    // }
    // });
  };
  // console.log(vendorBankDetail, "vendorBankDetail")
  const handleTDSDeduction = (e) => {
    // console.log(e.target.checked, "e.target.checked", TDSPercentage, TDSValue);
    setTDSDeduction(e.target.checked);
    setTDSPercentage(1);
  };

  const handleCalculatePaymentAmount = () => {


    if (paymentAmout < Math.floor(netAmount)) {
      setPaymentStatus("Partial");
    } else {
      setPaymentStatus("Full");
    }

    let paymentAmount = rowData.outstandings - rowData.tds_deduction;
    let baseamount = baseAmount;
    let tdsvalue = 0;

    if (TDSDeduction) {
      tdsvalue = ((baseamount * TDSPercentage) / 100).toFixed();
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
      if (currentValue <= +rowData.outstandings) {
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

  const handleOpenPayThroughVendor = (resendOtp) => {
    if (paymentAmout > 700000) {
      toastAlert("You are allow to pay below 7,00,000")
      return;
    }
    // else if (!rowSelectionModel || rowSelectionModel[0]?.mob1?.length != 10) {
    //   console.log(rowSelectionModel, "rowSelectionModel")
    //   toastError("Invalid Mobile Number")
    //   return;
    // }
    else if (!paymentAmout || paymentAmout == "" || !paymentAmout > 0) {
      toastError("Invalid Amount")
      return;
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(rowSelectionModel?.ifsc)) {
      toastError("Invalid IFSC Code");
      return;
    }

    let mailTo = userEmail;
    if (!userEmail || userEmail == "") {
      mailTo = "naveen@creativefuel.io";
    }
    if (resendOtp == "resendOtp") {

      setPaymentIntiated(true);
      try {

        axios
          .post(insightsBaseUrl + `v1/payment_otp_send`, {
            "email": mailTo,
            "amount": paymentAmout
            // headers: {
            //   "Content-Type": "multipart/form-data",
            // },
          }).then((res) => {
            // console.log(res)
            if (res.status == 200) {
              toastAlert("OTP sent to registered Id successfully")
              setPayThroughVendor(true);
            } else {
              toastAlert("You are not authorizied make this payment")
            }
            setPaymentIntiated(false);
          })
      } catch (error) {
        toastAlert("There some issue")
        setPaymentIntiated(false);
      }
    } else {
      setPayThroughVendor(true);
    }

  };
  // console.log("outstanding", vendorDetail, rowData)
  return (
    <div>


      <Dialog open={payDialog} onClose={handleClosePayDialog}
        maxWidth='xl' fullWidth
      >
        <Stack direction='row' spacing={2}>
          <Stack minWidth='50%'>

            {openImageDialog &&
              <>

                {!isPDF ? (
                  <img src={viewImgSrc} alt="img" />
                ) : (
                  <div style={{ width: "100%", height: "100vh", }}>
                    <iframe
                      // src={viewImgSrc}
                      src={`${viewImgSrc}#toolbar=0&navpanes=0&scrollbar=0`}
                      title="file"
                      width="100%"
                      height="100%"

                    />
                  </div>
                )}
              </>
            }
          </Stack>
          <Stack>
            <DialogTitle>Vendor Payment</DialogTitle>
            {
              extractedData && extractedData != {} && (
                <Alert severity={extractedData?.isCorrect ? "success" : "warning"}>{extractedData?.isCorrect ? `Checked Creativefuel spell.` : `Check Company Detail or Spelling.`}</Alert>
              )
            }
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
              <ReadableList extractedData={extractedData} rowData={rowData} vendorDetail={vendorDetail} vendorBankDetail={vendorBankDetail} selectedBankIndex={selectedBankIndex}
                setSelectedBankIndex={setSelectedBankIndex} openImageDialog={openImageDialog} setOpenImageDialog={setOpenImageDialog} />
              <Divider />



              <div className="row gap-3">
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleTDSDeduction}
                        checked={TDSDeduction}
                        disabled={rowData?.tds_deduction > 0}
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
                  value={`₹${rowData.outstandings - rowData.tds_deduction}`}
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

              {/* <div className="row">
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
          </div> */}
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
                  onWheel={(e) => e.target.blur()} // <-- THIS LINE prevents scroll changes
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
                        // This will prevent negative outstanding and gst amount management in ledger
                        if (numericValue + paymentProcessingAmount >= (Number(vendorDetail?.vendor_outstandings + Number(vendorPhpDetail[0]?.outstanding)) * 1.18) && rowData?.payment_type == "payment") {
                          // console.log(numericValue + paymentProcessingAmount, (vendorDetail?.vendor_outstandings * 1.18))
                          toastError(
                            "Payment Amount should be less than vendor total outstanding Amount or Pay Advance"
                          );
                          return;
                        }
                        if (numericValue + paymentProcessingAmount <= rowData.outstandings - rowData.tds_deduction) {
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
                        }
                        else {
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



              <PDFExtractorForInvoice file={viewImgSrc} setExtractedData={setExtractedData} />
            </DialogContent>
            <DialogActions>
              {paymentMode != "PineLab" ? <Button
                variant="contained"
                // className="mx-2"
                size="small"
                onClick={(e) => handlePayVendorClick(e)}
                disabled={!paymentMode || !paymentAmout || paymentIntiated}
              >
                Pay Vendor
              </Button> :
                <Button
                  // className="btn btn-success cmnbtn btn_sm ms-2"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleOpenPayThroughVendor('sameOtp')}
                  disabled={!paymentAmout > 0 || paymentIntiated}
                >
                  Pay Through Gateway
                </Button>}
            </DialogActions>
          </Stack >

        </Stack >
      </Dialog >
      {payThroughVendor && <PayThroughVendorDialog
        setPayThroughVendor={setPayThroughVendor}
        payThroughVendor={payThroughVendor}
        rowSelectionModel={rowSelectionModel}
        filterData={filterData}
        paymentStatus={paymentStatus}
        handleOpenPayThroughVendor={handleOpenPayThroughVendor}
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
        setRefetch={setRefetch}
        refetch={refetch}
      />
      }

    </div >
  );
}

export default PayVendorDialog;
