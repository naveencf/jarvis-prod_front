import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Stack,
  Autocomplete,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { Select, FormControl, InputLabel } from "@mui/material";
import {
  useAddPurchaseMutation,
  useAdvancedPaymentSettlementMutation,
  useDeletePurchaseRequestMutation,
  useGetAdvancedPaymentQuery,
  useGetVendorFinancialDetailQuery,
  useGetVendorPaymentRequestsQuery,
  useGetVendorRecentInvoicesDetailQuery,
  useUpdatePurchaseRequestMutation,
} from "../../Store/API/Purchase/PurchaseRequestPaymentApi";
import { useEffect } from "react";
import { baseUrl, insightsBaseUrl, phpBaseUrl } from "../../../utils/config";
import axios from "axios";
import formatString from "../../../utils/formatString";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import { useGetVendorDocumentByVendorDetailQuery } from "../../Store/reduxBaseURL";
import VendorAdvanceSettlement from "./VendorAdvanceSettlement";
import VendorAdavanceRequest from "./VendorAdavanceRequest";
import CloseIcon from "@mui/icons-material/Close";
import PDFExtractorForInvoice from "../../Finance/Purchase Management/PendingPaymentRequest/Components/PDFExtractorForInvoice";
import RecentInvoices from "../../Finance/Purchase Management/PendingPaymentRequest/Components/RecentInvoices";
import VendorValidation from "./VendorValidation";

const PaymentRequestFromPurchase = ({
  reqestPaymentDialog,
  setReqestPaymentDialog,
  vendorDetail,
  setVendorDetail,
  userName,
}) => {
  const token = sessionStorage.getItem("token");
  const { data: venodrDocuments, isLoading: isVendorDocumentsLoading } =
    useGetVendorDocumentByVendorDetailQuery(vendorDetail._id);
  const { data: InvoiceDetails, isLoading: invoicesRequestLoading, refetch: refetchInvoicesDetail, isFetching: vendorRequestFetching } = useGetVendorRecentInvoicesDetailQuery(vendorDetail?._id);
  // // console.log(InvoiceDetails?.recent_invoices, "data")
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [addPurchase, { isLoading, isSuccess, isError }] =
    useAddPurchaseMutation();
  const [updatePurchaseRequest, { isLoading: UpdateLoading }] =
    useUpdatePurchaseRequestMutation();
  const [deletePurchaseRequest] = useDeletePurchaseRequestMutation();
  const {
    isLoading: requestLoading,
    error,
    refetch: refetchPaymentRequest,
  } = useGetVendorPaymentRequestsQuery();
  const [vendorPhpDetail, setVendorPhpDetail] = useState("");
  const [vendorBankDetail, setVendorBankDetail] = useState("");
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const [extractedData, setExtractedData] = useState({});
  const [formData, setFormData] = useState({
    vendor_id: vendorDetail?.vendor_id,
    outstanding: 0,
    request_amount: 0,
    gst_amount: 0,
    base_amount: 0,
    priority: "high",
    invc_no: "",
    invc_date: "",
    remark_audit: "",
    invc_img: "",
    request_by: userName,
    outstandings: 0,
    payment_type: "payment",
    // advanced_payment_id: null,
    advance_name: "",
    at_price: "",
    // for_campaign_id: "",
    // for_brand_id: "",
    no_of_post: "",
    page_list: [],
    page_name: "",
    // page_id: null,
  });
  const [isGSTAvailable, setIsGSTAvailable] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("payment");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [isPDF, setIsPDF] = React.useState(false);
  const [mandateDocuments, setMandateDocuments] = useState(false);
  const [maxAllowedOutstanding, setMaxAllowedOutstanding] = useState(0);
  const [tdsDeductionMandatory, setTdsDeductionMandatory] = useState(false);
  const { data: vendorInvoices, isLoading: invoicesLoading } =
    useGetVendorFinancialDetailQuery(vendorDetail._id);

  useEffect(() => {
    if (extractedData.accountNumber && vendorBankDetail) {
      const bankIndex = vendorBankDetail.findIndex(
        (bank) => bank.account_number == extractedData.accountNumber
      );
      setSelectedBankIndex(bankIndex);
    }
  }, [extractedData]);


  useEffect(() => {

    if (InvoiceDetails && InvoiceDetails?.pending_partial_invoices && InvoiceDetails?.pending_partial_invoices.length > 0) {
      // const totals = getInvoiceTotals(InvoiceDetails?.pending_partial_invoices);
      // // console.log(totals);
      const VendorCurrentOutstanding = getOutstandingText();
      let tempTotalPaidWithPendingAmount = InvoiceDetails.totalBaseAmount - InvoiceDetails.totalPaidWithPendingAmount;
      if (tempTotalPaidWithPendingAmount < 0) {
        tempTotalPaidWithPendingAmount = 0;
      }
      setMaxAllowedOutstanding((InvoiceDetails.vendor_outstandings - tempTotalPaidWithPendingAmount)?.toFixed());
      setVendorBankDetail(InvoiceDetails?.bank_details || []);
      // console.log(InvoiceDetails.vendor_outstandings - tempTotalPaidWithPendingAmount, "maxAllowedOutstanding", tempTotalPaidWithPendingAmount, "InvoiceDetails.vendor_outstandings", InvoiceDetails.vendor_outstandings);
    }
  }, [vendorInvoices, InvoiceDetails]);


  function getInvoiceTotals(pendingInvoices) {
    return pendingInvoices.reduce(
      (totals, invoice) => {
        totals.request_amount += invoice.request_amount || 0;
        totals.paid_amount += invoice.paid_amount || 0;
        totals.outstandings += invoice.outstandings || 0;
        return totals;
      },
      { request_amount: 0, paid_amount: 0, outstandings: 0 }
    );
  }

  // useEffect(() => {
  //   if (vendorDetail) {
  //     // axios
  //     //   .post(phpBaseUrl + `?view=getvendorDataListvid`, {
  //     //     vendor_id: vendorDetail?.vendor_id,
  //     //   })
  //     //   .then((res) => {
  //     //     if (res.status == 200) {
  //     //       setVendorPhpDetail(res.data.body);
  //     //       // // console.log(res.data.body, 'vendorDetail', vendorDetail);
  //     //     }
  //     //   });
  //     // axios
  //     //   .get(
  //     //     `${baseUrl}` +
  //     //     `v1/bank_details_by_vendor_id/${vendorDetail?.vendor_id}?isNumberId=true`,
  //     //     {
  //     //       headers: {
  //     //         Authorization: `Bearer ${token}`,
  //     //       },
  //     //     }
  //     //   )
  //     //   .then((res) => {
  //     //     if (res.status == 200) {
  //     //       setVendorBankDetail(res.data.data);
  //     //       // // console.log(res.data.data, 'res.data.data');
  //     //     }
  //     //   });
  //   }
  // }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // gives YYYY-MM-DD
  };
  // // console.log(maxAllowedOutstanding, "maxAllowedOutstanding")
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;

    setFormData((prev) => {
      if (!prev) return {}; // Ensure prev is always defined

      const updatedData = { ...prev, [name]: value };
      // const outstandingPhp = Number(vendorPhpDetail?.[0]?.outstanding) || 0;
      const outstandingVendor =
        Number(vendorDetail?.vendor_outstandings) ||
        Number(vendorDetail?.outstandings) ||
        0;
      const totalOutstanding = (outstandingVendor) * 1.18;

      if (
        selectedPaymentType === "payment" &&
        // vendorPhpDetail?.length &&
        (numericValue > totalOutstanding)
      ) {
        toastError(
          "Payment is not allowed more than outstanding. You can request Advance or Upfront Payment"
        );
        return prev; // Preserve previous state
      } else if (selectedPaymentType === "payment" && numericValue > maxAllowedOutstanding) {
        toastError(
          "You are not allowed to request more than " + maxAllowedOutstanding
        );
        return prev;
      }
      // Handle GST Calculation Logic
      if (name === "base_amount") {
        if (isGSTAvailable) {
          updatedData.request_amount = (numericValue * 1.18).toFixed(2); // Adding 18%
          updatedData.gst_amount = (numericValue * 0.18).toFixed(2);
        } else {
          updatedData.request_amount = numericValue.toFixed(2);
          updatedData.gst_amount = "0";
        }
      }

      if (name === "request_amount") {
        if (isGSTAvailable) {
          updatedData.gst_amount = ((numericValue * 18) / 118).toFixed(2);
          updatedData.base_amount = (
            numericValue - updatedData.gst_amount
          ).toFixed(2);
        } else {
          updatedData.base_amount = numericValue.toFixed(2);
          updatedData.gst_amount = "0";
        }
      }
      return updatedData;
    });
  };
  // console.log(vendorDetail, "vendorDetail");
  useEffect(() => {
    // Request Edit Case
    if (vendorDetail && vendorDetail.request_id && vendorBankDetail) {
      // Find matching bank index
      const bankIndex = vendorBankDetail.findIndex((bank) =>
        vendorDetail.account_number
          ? bank.account_number === vendorDetail.account_number
          : bank.upi_id === vendorDetail.vpa
      );
      setSelectedPaymentType(vendorDetail?.payment_type);
      // If a matching bank is found, set the selected index
      if (bankIndex !== -1) {
        setSelectedBankIndex(bankIndex);
      }
      setFormData((prev) => ({
        ...prev,
        base_amount: vendorDetail.base_amount,
        gst_amount: vendorDetail.gst_amount,
        request_amount: vendorDetail.request_amount,
        // invc_date: vendorDetail.invc_date || "",
        // invc_date: formatDate(apiResponse.invc_date),
        invc_date: vendorDetail.invc_date
          ? vendorDetail.invc_date.split("T")[0]
          : "", // handles ISO date
        remark_audit: vendorDetail.remark_audit,
        invc_img: vendorDetail.invc_img,
        invc_no: vendorDetail.invc_no,
      }));
      setSelectedFileName(vendorDetail.invc_img);
      if (vendorDetail.gst_amount > 0) {
        setIsGSTAvailable(true);
      }
    } else {
      // // console.log("Adding Request");
      // setSelectedBankIndex(""); // Reset when adding a new request
    }
  }, [vendorDetail, vendorBankDetail]);

  useEffect(() => {
    if (venodrDocuments && venodrDocuments.length > 0) {
      const hasGST = venodrDocuments.some(
        (doc) => doc.document_name === "GST" && doc.document_no !== ""
      );

      const hasPanCard = venodrDocuments.some(
        (doc) => doc.document_name === "Pan Card" && doc.document_no !== ""
      );
      setIsGSTAvailable(hasGST);
      // Call handleGSTChange when GST is available
      handleGSTChange(hasGST);
      // Check if both documents are available
      if (hasGST || hasPanCard) {
        setMandateDocuments(true);
        // console.log("Both documents available");
      }
    }
  }, [venodrDocuments]); // Updated dependency to watch vendorDocuments

  const handleGSTChange = (isChecked) => {
    // // console.log(isChecked, "hasGST")
    setIsGSTAvailable(isChecked);
    setFormData((prev) => {
      const requestAmount = parseFloat(prev.request_amount) || 0;
      const updatedData = { ...prev, gst: isChecked };

      if (isChecked) {
        updatedData.gst_amount = ((requestAmount * 18) / 118).toFixed(2);
        updatedData.base_amount = (
          requestAmount - updatedData.gst_amount
        ).toFixed(2);
      } else {
        updatedData.gst_amount = "0.00";
        updatedData.base_amount = requestAmount.toFixed(2);
      }

      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const modifiedFile = new File([file], file.name.replace(/#/g, ""), {
      type: file.type,
    });
    if (modifiedFile) {
      let verify =
        modifiedFile.name?.split(".")?.pop()?.toLowerCase() === "pdf";
      setIsPDF(verify);
      setSelectedFileName(modifiedFile.name);
      setFormData({ ...formData, invc_img: modifiedFile });
      setOpenImageDialog(true);
      // Create a URL for the selected modifiedFile
      const url = URL.createObjectURL(modifiedFile);
      setViewImgSrc(url);
      setSelectedFile(modifiedFile);
    }
  };
  const validateDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return "Invalid date format. Use DD-MM-YYYY.";
    }
    return "";
  };
  console.log(tdsDeductionMandatory, "tdsDeductionMandatory")
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tdsDeductionMandatory) {
      toastError("For Tds, GST or PAN required in Vendor Account Detail, Vendor Payment limit reached");
      return;
    } else if (selectedFileName != "") {
      // // console.log(selectedFileName, "selectedFileName")
      if (!formData.invc_no) {
        toastError("Invoice number is required.");
        return;
      }
      const dateError = validateDate(formData.invc_date);
      if (dateError) {
        toastError(dateError);
        return;
      }
    }
    // Ensure request amount is not 0
    else if (formData.request_amount === 0) {
      toastError("Request amount cannot be 0.");
      return;
    } else if (formData.request_amount >= 30000 && selectedFileName == "") {
      toastError("Invoice in mandatory for amount above 30k. ");
      return;
    } else if (formData.request_amount >= 30000 && !mandateDocuments) {
      toastError(
        "Vendor Profile is incomplete.Please add GST or PAN details first."
      );
      return;
    }

    if (
      selectedPaymentType === "advanced" &&
      (!formData.at_price || !formData.no_of_post || !formData.page_name)
    ) {
      toastError("Please fill all the details");
      return;
    }

    // Ensure selected bank details are valid before submitting
    const selectedBank = vendorBankDetail[selectedBankIndex];
    if (!selectedBank) {
      toastError("Please select a valid bank.");
      return;
    }
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "outstanding") {
        // Exclude 'outstanding' key
        payload.append(key, formData[key]);
      }
    });

    // Append the selected bank details to the payload
    payload.append("accountNumber", selectedBank?.account_number);
    payload.append("branchCode", selectedBank?.ifsc);
    payload.append("vpa", selectedBank?.upi_id || "");
    payload.append("is_bank_verified", selectedBank?.is_verified);

    // console.log(formData.invc_date, "payload");
    try {
      await addPurchase(payload).unwrap();
      toastAlert("Payment requested successfully!");
      refetchPaymentRequest();
      setFormData({
        gst: false,
        outstandings: 0,
        request_amount: 0,
        gst_amount: 0,
        base_amount: 0,
        priority: "",
        invc_no: "",
        invc_date: "",
        remark_audit: "",
        invc_img: "",
      });
      setSelectedFileName("");
      setReqestPaymentDialog(false);
    } catch (error) {
      // console.error("Failed to add purchase:", error);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (tdsDeductionMandatory && !mandateDocuments) {
      toastError("For tds GST or PAN required as Vendor Payment limit reached");
      return;
    } else if (selectedFileName != "") {
      // // console.log(selectedFileName, "selectedFileName")
      if (!formData.invc_no) {
        toastError("Invoice number is required.");
        return;
      }
      const dateError = validateDate(formData.invc_date);
      if (dateError) {
        toastError(dateError);
        return;
      }
    }
    // Ensure request amount is not 0
    else if (formData.request_amount === 0) {
      toastError("Request amount cannot be 0.");
      return;
    } else if (formData.request_amount >= 30000 && selectedFileName == "") {
      toastError("Invoice in mandatory for amount above 30k. ");
      return;
    } else if (formData.request_amount >= 30000 && !mandateDocuments) {
      toastError(
        "Vendor Profile is incomplete.Please add GST or PAN details first."
      );
      return;
    }
    // Ensure selected bank details are valid before submitting
    const selectedBank = vendorBankDetail[selectedBankIndex];
    if (!selectedBank) {
      toastError("Please select a valid bank.");
      return;
    }
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "outstanding") {
        // Exclude 'outstanding' key
        payload.append(key, formData[key]);
      }
    });

    // Append the selected bank details to the payload
    payload.append("accountNumber", selectedBank?.account_number);
    payload.append("branchCode", selectedBank?.ifsc);
    payload.append("vpa", selectedBank?.upi_id || "");
    payload.append("is_bank_verified", selectedBank?.is_verified);

    try {
      await updatePurchaseRequest({
        _id: vendorDetail._id,
        formData: payload,
      }).unwrap();

      toastAlert("Payment request updated successfully!");
      refetchPaymentRequest();
      setFormData({
        gst: false,
        outstandings: 0,
        request_amount: 0,
        gst_amount: 0,
        base_amount: 0,
        priority: "",
        invc_no: "",
        invc_date: "",
        remark_audit: "",
        invc_img: "",
      });
      setSelectedFileName("");
      setReqestPaymentDialog(false);
    } catch (error) {
      // console.error("Failed to add purchase:", error);
    }
  };
  const handleCloseDialog = () => {
    setReqestPaymentDialog(false);
    setVendorDetail("");
    setVendorPhpDetail("");
    setVendorBankDetail("");
    setSelectedBankIndex(0);
  };
  const handleDeleteRequest = async () => {
    if (
      window.confirm("Are you sure you want to delete this purchase request?")
    ) {
      try {
        await deletePurchaseRequest(vendorDetail._id).unwrap();
        toastAlert("Purchase request deleted successfully!");
        refetchPaymentRequest();
        setFormData({
          gst: false,
          outstandings: 0,
          request_amount: 0,
          gst_amount: 0,
          base_amount: 0,
          priority: "",
          invc_no: "",
          invc_date: "",
          remark_audit: "",
          invc_img: "",
        });
        setSelectedFileName("");
        setReqestPaymentDialog(false);
      } catch (error) {
        // console.error("Error deleting purchase request:", error);
      }
    }
  };
  const handleBankChange = (event) => {
    setSelectedBankIndex(event.target.value);
  };
  const handlePaymentTypeChange = (event) => {
    let paymentType = event.target.value?.toLowerCase();

    setSelectedPaymentType(paymentType);
    setFormData((prev) => {
      const updatedData = { ...prev, payment_type: paymentType };

      return updatedData;
    });
  };
  const handlePennyDropforVendor = async () => {
    if (vendorBankDetail[selectedBankIndex]?.account_number == "") {
      toastAlert(
        "Penny drop is only for Bank Account and Account Number is missing"
      );
      return;
    }
    const payload = {
      accountNumber: vendorBankDetail[selectedBankIndex]?.account_number,
      branchCode: vendorBankDetail[selectedBankIndex]?.ifsc,
      createdBy: userID,
      vendorId: vendorBankDetail[selectedBankIndex]?.vendor_id,
      vendorName: vendorDetail?.vendor_name,
      vendorPhpId: vendorBankDetail[selectedBankIndex]?.php_vendor_id,
      zohoVendorId: "1111",
      isTestingData: false,
      vendorBankDetailId: vendorBankDetail[selectedBankIndex]?._id,
      // "remarks": "Penny Drop"
    };
    // Step 1: Get the JWT token
    const getTokenResponse = await axios.get(
      insightsBaseUrl + `v1/payment_gateway_access_token`
    );
    const getWayToken = getTokenResponse?.data?.data;
    try {
      axios
        .post(`${insightsBaseUrl}` + `v1/create_penny_drope`, payload, {
          headers: {
            Authorization: `Bearer ${getWayToken}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            toastAlert("Penny Drop Successfully initiated");
          }
        });
    } catch (error) {
      // console.log(error);
    }
  };
  const handleRemoveFile = () => {
    setSelectedFileName(""); // Clear the selected file name
    setViewImgSrc(""); // Clear the invoice preview
    setOpenImageDialog(false); // Close the left side preview
    setSelectedFile("");
    setReqestPaymentDialog(false);
  };

  const getOutstandingText = () => {
    // const phpOutstanding = Number(vendorPhpDetail?.[0]?.outstanding) || 0;
    const vendorOutstanding =
      Number(vendorDetail?.vendor_outstandings ?? vendorDetail?.outstandings) ||
      0;
    // const total = phpOutstanding + vendorOutstanding;

    // return `${phpOutstanding} + (${vendorOutstanding}) = ${total}`;
    return `${(vendorOutstanding.toFixed())}`;
  };

  // Then use it like this:
  // <ListItemText primary="Outstanding" secondary={getOutstandingText()} />;
  const rowData = { ...vendorDetail, vendor_obj_id: vendorDetail._id };

  return (
    <Dialog
      open={reqestPaymentDialog}
      onClose={() => setReqestPaymentDialog(false)}
      maxWidth={openImageDialog ? "xl" : "md"} // Dynamically set maxWidth
      fullWidth
    >
      <VendorValidation InvoiceDetails={InvoiceDetails} selectedBankIndex={selectedBankIndex} setTdsDeductionMandatory={setTdsDeductionMandatory} />
      <Stack direction="row" spacing={2}>
        {openImageDialog && (
          <Stack minWidth="50%">
            <>
              {!isPDF ? (
                <img src={viewImgSrc} alt="img" />
              ) : (
                <div style={{ width: "100%", height: "100vh" }}>
                  <iframe
                    // src={viewImgSrc}
                    src={`${viewImgSrc}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="file"
                    width="100%"
                    height="100%"
                  />
                  <PDFExtractorForInvoice
                    file={selectedFile}
                    setExtractedData={setExtractedData}
                  />
                </div>
              )}
            </>
          </Stack>
        )}
        {/* Right side (always visible) */}
        {/* <Stack width={openImageDialog ? "50%" : "100%"}> */}
        <Stack minWidth='50%'>
          <DialogTitle>Request Payment</DialogTitle>
          <DialogContent>
            <Stack direction="row" justifyContent="space-between">
              <List>
                <ListItem>
                  <ListItemText
                    primary="Vendor Name"
                    secondary={formatString(vendorDetail?.vendor_name)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mobile"
                    secondary={vendorDetail?.vendor_category}
                  />
                </ListItem>


                <ListItem>
                  <ListItemText
                    primary={`Outstanding : ${getOutstandingText()}`}
                    secondary={`Requested : ${InvoiceDetails?.totalBaseAmount}`}
                  />

                </ListItem>
                <ListItem>

                  <ListItemText
                    primary={`Max Allow to Request : ${maxAllowedOutstanding}`}
                    secondary={`Pending Requested Payment : ${InvoiceDetails?.totalOutstandings}`}

                  />

                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Account Number"
                    secondary={
                      vendorBankDetail[selectedBankIndex]?.account_number
                    }
                  />
                </ListItem>
                {extractedData &&
                  extractedData != {} &&
                  extractedData.accountNumber &&
                  extractedData.accountNumber !=
                  vendorBankDetail[selectedBankIndex]?.account_number && (
                    <Typography variant="caption" color="error" sx={{ pt: 0 }}>
                      Account Number in Invoice : {extractedData.accountNumber}
                    </Typography>
                  )}
              </List>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Page"
                    secondary={vendorDetail?.primary_page_name}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Address"
                    secondary={vendorDetail?.home_address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Account Verified"
                    secondary={
                      vendorBankDetail[selectedBankIndex]?.is_verified
                        ? "Yes"
                        : "No"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="IFSC"
                    secondary={vendorBankDetail[selectedBankIndex]?.ifsc}
                  />
                </ListItem>
                {extractedData &&
                  extractedData != {} &&
                  extractedData.ifscCode &&
                  extractedData.ifscCode !=
                  vendorBankDetail[selectedBankIndex]?.ifsc && (
                    <Typography variant="caption" color="error" sx={{ pt: 0 }}>
                      IFSC differ from Invoice : {extractedData.ifscCode}
                    </Typography>
                  )}
                {/* <ListItem>
                  <ListItemText primary="outstanding" secondary={formData.address} />
              </ListItem> */}
              </List>
            </Stack>
            {vendorBankDetail != "" && (
              <FormControl fullWidth sx={{ maxWidth: 360 }}>
                <InputLabel id="bank-select-label">Select Bank</InputLabel>
                <Select
                  labelId="bank-select-label"
                  value={selectedBankIndex}
                  onChange={handleBankChange}
                  label="Select Bank"
                >
                  {vendorBankDetail?.map((bank, index) => (
                    <MenuItem key={index} value={index}>
                      {`${bank.bank_name || "UPI"} : ${bank.account_number || bank.upi_id
                        }`}
                      {/* {bank?.ifsc != "" ? ` IFSC : ${bank?.ifsc}` : ""} */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {/* <Button
              disabled={vendorBankDetail[selectedBankIndex]?.is_verified}
              onClick={handlePennyDropforVendor}
              sx={{ ml: 1 }}
              variant="contained"
              color="success"
            >
              Penny Drop
            </Button> */}
            <RecentInvoices rowData={rowData} setOpenImageDialog={setOpenImageDialog} setViewImgSrc={setViewImgSrc} />
            <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
              {selectedValues.length === 0 && (
                <TextField
                  autoComplete="off"
                  type="number"
                  onWheel={(e) => e.target.blur()} // Prevents scroll from changing number value
                  label="Request Amount (With GST if applicable)"
                  name="request_amount"
                  value={formData?.request_amount}
                  onChange={handleChange}
                  fullWidth
                />
              )}
              {selectedValues.length === 0 && (
                <FormControlLabel
                  sx={{ width: 200 }}
                  control={
                    <Checkbox
                      checked={isGSTAvailable}
                      onChange={(e) => handleGSTChange(e.target.checked)}
                    />
                  }
                  label="Add GST (18%)"
                />
              )}

              <Stack direction="row" spacing={2}>
                {selectedValues.length === 0 && (
                  <TextField
                    label="GST Amount"
                    value={formData?.gst_amount}
                    inputProps={{ readOnly: true }}
                  />
                )}
                <TextField
                  label="Base Amount (Excl. GST)"
                  name="base_amount"
                  onChange={handleChange}
                  value={formData?.base_amount}
                />
                {selectedValues.length === 0 && (
                  <FormControl
                    fullWidth
                    sx={{ maxWidth: 360 }}
                    disabled={!!vendorDetail?.request_id}
                  >
                    <InputLabel id="bank-select-label">Payment Type</InputLabel>
                    <Select
                      labelId="bank-select-label"
                      value={selectedPaymentType}
                      onChange={handlePaymentTypeChange}
                      label="Payment Type"
                    >
                      <MenuItem value="payment">Payment</MenuItem>
                      <MenuItem value="advanced">Advance</MenuItem>
                      <MenuItem value="upfront">Upfront</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>

              {(selectedPaymentType === "advanced" ||
                selectedPaymentType === "upfront") && (
                  <VendorAdavanceRequest
                    formData={formData}
                    setFormData={setFormData}
                    vendorId={vendorDetail._id}
                  />
                )}
              {selectedValues.length === 0 && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Invoice No#"
                    name="invc_no"
                    value={formData?.invc_no}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="Invoice Date"
                    name="invc_date"
                    value={formData?.invc_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>)}
              {selectedValues.length === 0 && (
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" component="label">
                    Upload Invoice
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {selectedFileName && (
                    <div style={{ color: "green", marginTop: "8px" }}>
                      Selected File: {selectedFileName}
                    </div>
                  )}
                  <IconButton
                    aria-label="close"
                    onClick={handleRemoveFile}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              )}
              <TextField
                label="Remark"
                name="remark_audit"
                value={formData?.remark_audit}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </DialogContent>
          <DialogActions>
            <VendorAdvanceSettlement
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              vendorDetail={vendorDetail}
              vendorId={vendorDetail?._id}
              formData={formData}
              handleCloseDialog={handleCloseDialog}
            />
            <Stack direction="row" spacing={1}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              {vendorDetail && vendorDetail.request_id ? (
                <Button
                  variant="contained"
                  onClick={handleEditSubmit}
                  disabled={
                    formData?.request_amount == 0 ||
                      selectedValues?.length > 0 ||
                      UpdateLoading
                      ? true
                      : false
                  }
                >
                  {/* {UpdateLoading ? 'Submitting...' : 'Edit Payment Request'} */}
                  Edit Payment Request
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    formData?.request_amount == 0 || selectedValues?.length > 0
                      ? true
                      : false
                  }
                >
                  {isLoading ? "Submitting..." : "Request Payment"}
                </Button>
              )}
              {vendorDetail && vendorDetail.request_id && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteRequest}
                >
                  Delete
                </Button>
              )}
            </Stack>
          </DialogActions>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default PaymentRequestFromPurchase;
