import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Button, MenuItem, List, ListItem, ListItemText, Stack, Autocomplete } from '@mui/material';
import { Select, FormControl, InputLabel } from '@mui/material';
import { useAddPurchaseMutation, useAdvancedPaymentSettlementMutation, useDeletePurchaseRequestMutation, useGetAdvancedPaymentQuery, useGetVendorPaymentRequestsQuery, useUpdatePurchaseRequestMutation } from '../../Store/API/Purchase/PurchaseRequestPaymentApi';
import { useEffect } from 'react';
import { baseUrl, insightsBaseUrl, phpBaseUrl } from '../../../utils/config';
import axios from 'axios';
import formatString from '../../../utils/formatString';
import { useGlobalContext } from '../../../Context/Context';
import jwtDecode from 'jwt-decode';
import { useGetVendorDocumentByVendorDetailQuery } from '../../Store/reduxBaseURL';
import VendorAdvanceSettlement from './VendorAdvanceSettlement';
import VendorAdavanceRequest from './VendorAdavanceRequest';

const PaymentRequestFromPurchase = ({ reqestPaymentDialog, setReqestPaymentDialog, vendorDetail, setVendorDetail, userName }) => {
  const token = sessionStorage.getItem('token');
  const { data: venodrDocuments, isLoading: isVendorDocumentsLoading } =
    useGetVendorDocumentByVendorDetailQuery(vendorDetail._id);
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [addPurchase, { isLoading, isSuccess, isError }] = useAddPurchaseMutation();
  const [updatePurchaseRequest, { isLoading: UpdateLoading }] = useUpdatePurchaseRequestMutation();
  const [deletePurchaseRequest] = useDeletePurchaseRequestMutation();
  const { data, isLoading: requestLoading, error, refetch: refetchPaymentRequest } = useGetVendorPaymentRequestsQuery();
  const [vendorPhpDetail, setVendorPhpDetail] = useState('');
  const [vendorBankDetail, setVendorBankDetail] = useState('');
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [formData, setFormData] = useState({
    vendor_id: vendorDetail?.vendor_id,
    outstanding: vendorPhpDetail[0]?.outstanding,
    request_amount: 0,
    gst_amount: 0,
    base_amount: 0,
    priority: 'high',
    invc_no: '',
    invc_date: '',
    remark_audit: '',
    invc_img: '',
    request_by: userName,
    outstandings: 0,
    payment_type: 'payment',
    // advanced_payment_id: null,
    advance_name: "",
    at_price: "",
    // for_campaign_id: "",
    // for_brand_id: "",
    no_of_post: "",
    page_list: [],
    page_name: "",
    page_id: null,
    // accountNumber: vendorBankDetail[selectedBankIndex]?.account_number,
    // branchCode: vendorBankDetail[selectedBankIndex]?.ifsc,
    // vpa: vendorBankDetail[selectedBankIndex]?.vpa,
  });
  const [isGSTAvailable, setIsGSTAvailable] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState("payment");



  useEffect(() => {
    if (vendorDetail) {

      axios
        .post(phpBaseUrl + `?view=getvendorDataListvid`, {
          vendor_id: vendorDetail?.vendor_id,
        })
        .then((res) => {
          if (res.status == 200) {
            setVendorPhpDetail(res.data.body);
            // console.log(res.data.body, 'vendorDetail', vendorDetail);
          }
        });
      axios
        .get(`${baseUrl}` + `v1/bank_details_by_vendor_id/${vendorDetail?.vendor_id}?isNumberId=true`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            setVendorBankDetail(res.data.data);
            // console.log(res.data.data, 'res.data.data');
          }
        });
    }
  }, []);

  // console.log(vendorDetail, "vendorDetail")

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;

    setFormData((prev) => {
      if (!prev) return {}; // Ensure prev is always defined

      const updatedData = { ...prev, [name]: value };

      if (
        selectedPaymentType === "payment" &&
        vendorPhpDetail?.length
        && numericValue > (Number(vendorPhpDetail[0]?.outstanding) + Number(vendorDetail?.vendor_outstandings))
      ) {
        toastError("Payment is not allowed more than outstanding. You can request Advance or Upfront Payment");
        return prev; // Return previous state to avoid breaking the component
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
          updatedData.base_amount = (numericValue - updatedData.gst_amount).toFixed(2);
        } else {
          updatedData.base_amount = numericValue.toFixed(2);
          updatedData.gst_amount = "0";
        }
      }


      return updatedData;
    });
  };



  useEffect(() => {
    if (vendorDetail && vendorDetail.request_id && vendorBankDetail) {
      // console.log("Editing Request", vendorDetail);

      // Find matching bank index
      const bankIndex = vendorBankDetail.findIndex((bank) =>
        vendorDetail.account_number
          ? bank.account_number === vendorDetail.account_number
          : bank.upi_id === vendorDetail.vpa
      );
      setSelectedPaymentType(vendorDetail?.payment_type)
      // payment_type
      // If a matching bank is found, set the selected index
      if (bankIndex !== -1) {
        setSelectedBankIndex(bankIndex);
      }
      setFormData((prev) => ({
        ...prev,
        base_amount: vendorDetail.base_amount,
        gst_amount: vendorDetail.gst_amount,
        request_amount: vendorDetail.request_amount,
        invc_date: vendorDetail.invc_date || "",
        remark_audit: vendorDetail.remark_audit,
        invc_img: vendorDetail.invc_img,

      }));
      setSelectedFileName(vendorDetail.invc_img)
      if (vendorDetail.gst_amount > 0) {
        setIsGSTAvailable(true);
      }
    }
    else {
      console.log("Adding Request");
      // setSelectedBankIndex(""); // Reset when adding a new request
    }
  }, [vendorDetail, vendorBankDetail]);

  useEffect(() => {
    if (venodrDocuments && venodrDocuments.length > 0) {
      const hasGST = venodrDocuments.some(
        (doc) => doc.document_name === "GST" && doc.document_no != ""
      );

      setIsGSTAvailable(hasGST);

      // Call handleGSTChange when GST is available
      handleGSTChange(hasGST);
    }
  }, [vendorDetail]);

  const handleGSTChange = (isChecked) => {
    // console.log(isChecked, "hasGST")
    setIsGSTAvailable(isChecked);
    setFormData((prev) => {
      const requestAmount = parseFloat(prev.request_amount) || 0;
      const updatedData = { ...prev, gst: isChecked };

      if (isChecked) {
        updatedData.gst_amount = ((requestAmount * 18) / 118).toFixed(2);
        updatedData.base_amount = (requestAmount - updatedData.gst_amount).toFixed(2);
      } else {
        updatedData.gst_amount = "0.00";
        updatedData.base_amount = requestAmount.toFixed(2);
      }

      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setFormData({ ...formData, invc_img: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure request amount is not 0
    if (formData.request_amount === 0) {
      toastError("Request amount cannot be 0.");
      return;
    }
    // Ensure selected bank details are valid before submitting
    const selectedBank = vendorBankDetail[selectedBankIndex];
    if (!selectedBank) {
      toastError('Please select a valid bank.');
      return;
    }
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "outstanding") { // Exclude 'outstanding' key
        payload.append(key, formData[key]);
      }
    });

    // Append the selected bank details to the payload
    payload.append("accountNumber", selectedBank?.account_number);
    payload.append("branchCode", selectedBank?.ifsc);
    payload.append("vpa", selectedBank?.upi_id || "");
    payload.append("is_bank_verified", selectedBank?.is_verified);


    try {
      // console.log(vendorPhpDetail[0]?.outstanding, "vendorPhpDetail[0]?.outstanding")
      // return;
      // const tempOutstanding =parseInt(vendorPhpDetail[0]?.outstanding);
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
      console.error("Failed to add purchase:", error);
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Ensure request amount is not 0
    if (formData.request_amount == 0) {
      toastError("Request amount cannot be 0.");
      return;
    }
    // Ensure selected bank details are valid before submitting
    const selectedBank = vendorBankDetail[selectedBankIndex];
    if (!selectedBank) {
      toastError('Please select a valid bank.');
      return;
    }
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "outstanding") { // Exclude 'outstanding' key
        payload.append(key, formData[key]);
      }
    });

    // Append the selected bank details to the payload
    payload.append("accountNumber", selectedBank?.account_number);
    payload.append("branchCode", selectedBank?.ifsc);
    payload.append("vpa", selectedBank?.upi_id || "");
    payload.append("is_bank_verified", selectedBank?.is_verified);


    try {
      // console.log(vendorPhpDetail[0]?.outstanding, "vendorPhpDetail[0]?.outstanding")
      // return;
      // const tempOutstanding =parseInt(vendorPhpDetail[0]?.outstanding);
      await updatePurchaseRequest({ _id: vendorDetail._id, formData: payload }).unwrap();

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
      console.error("Failed to add purchase:", error);
    }
  };
  const handleCloseDialog = () => {
    setReqestPaymentDialog(false)
    setVendorDetail("");
    setVendorPhpDetail("")
    setVendorBankDetail("");
    setSelectedBankIndex(0);
  }
  // const handleDeleteRequest = async () => {
  //   try {
  //     const payload = new FormData();
  //     // Append the selected bank details to the payload
  //     payload.append("accountNumber", selectedBank?.account_number);
  //     await updatePurchaseRequest(payload).unwrap();
  //     toastAlert("Purchase Deleted Successfully!");
  //     setFormData({
  //       gst: false,
  //       outstandings: 0,
  //       request_amount: 0,
  //       gst_amount: 0,
  //       base_amount: 0,
  //       priority: "",
  //       invc_no: "",
  //       invc_date: "",
  //       remark_audit: "",
  //       invc_img: "",
  //     });
  //     setSelectedFileName("");
  //     setReqestPaymentDialog(false);
  //   } catch (error) {
  //     console.error("Failed to add purchase:", error);
  //   }
  //   setReqestPaymentDialog(false)
  //   setVendorDetail("");
  //   setVendorPhpDetail("")
  //   setVendorBankDetail("");
  //   setSelectedBankIndex(0);

  // }
  const handleDeleteRequest = async () => {
    if (window.confirm("Are you sure you want to delete this purchase request?")) {
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
        console.error("Error deleting purchase request:", error);
      }
    }
  };
  const handleBankChange = (event) => {
    setSelectedBankIndex(event.target.value);
  };
  const handlePaymentTypeChange = (event) => {
    let paymentType = event.target.value?.toLowerCase();
    // console.log(paymentType, "paymentType")
    // if (paymentType = "advance") {
    //   paymentType = "advanced"
    // }
    setSelectedPaymentType(paymentType);
    setFormData((prev) => {
      const updatedData = { ...prev, payment_type: paymentType };

      return updatedData;
    });
  };
  const handlePennyDropforVendor = async () => {
    if (vendorBankDetail[selectedBankIndex]?.account_number == "") {
      toastAlert("Penny drop is only for Bank Account and Account Number is missing");
      return;
    }
    const payload = {
      "accountNumber": vendorBankDetail[selectedBankIndex]?.account_number,
      "branchCode": vendorBankDetail[selectedBankIndex]?.ifsc,
      "createdBy": userID,
      "vendorId": vendorBankDetail[selectedBankIndex]?.vendor_id,
      "vendorName": vendorBankDetail[selectedBankIndex]?.account_holder_name,
      "vendorPhpId": vendorBankDetail[selectedBankIndex]?.php_vendor_id,
      "zohoVendorId": "1111",
      "isTestingData": false,
      "vendorBankDetailId": vendorBankDetail[selectedBankIndex]?._id,
      // "remarks": "Penny Drop"
    }
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

            toastAlert("Penny Drop Successfully initiated")
          }

        });
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Dialog
      open={reqestPaymentDialog}
      onClose={() => setReqestPaymentDialog(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Request Payment</DialogTitle>
      <DialogContent>
        <Stack direction="row" justifyContent="space-between">
          <List>
            <ListItem>
              <ListItemText primary="Vendor Name" secondary={formatString(vendorDetail?.vendor_name)} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mobile" secondary={vendorDetail?.vendor_category} />
            </ListItem>

            <ListItem>
              <ListItemText primary="Address" secondary={vendorDetail?.home_address} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Account Number" secondary={vendorBankDetail[selectedBankIndex]?.account_number} />
            </ListItem>
          </List>
          <List>
            <ListItem>
              <ListItemText primary="Page" secondary={vendorDetail?.primary_page_name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Outstanding" secondary={`${vendorPhpDetail[0]?.outstanding} + ${vendorDetail?.vendor_outstandings} = ${(Number(vendorPhpDetail[0]?.outstanding) + Number(vendorDetail?.vendor_outstandings))}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Account Verified" secondary={vendorBankDetail[selectedBankIndex]?.is_verified ? "Yes" : "No"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="IFSC" secondary={vendorBankDetail[selectedBankIndex]?.ifsc} />
            </ListItem>
            {/* <ListItem>
                            <ListItemText primary="outstanding" secondary={formData.address} />
                        </ListItem> */}
          </List>
        </Stack>
        {vendorBankDetail != '' && (
          <FormControl fullWidth sx={{ maxWidth: 360 }}>
            <InputLabel id="bank-select-label">Select Bank</InputLabel>
            <Select labelId="bank-select-label" value={selectedBankIndex} onChange={handleBankChange} label="Select Bank">
              {vendorBankDetail?.map((bank, index) => (
                <MenuItem key={index} value={index}>
                  {`${bank.bank_name || "UPI"} : ${bank.account_number || bank.upi_id}`}
                  {/* {bank?.ifsc != "" ? ` IFSC : ${bank?.ifsc}` : ""} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button onClick={handlePennyDropforVendor} sx={{ ml: 1 }} variant="contained" color='success'>
          Penny Drop
        </Button>
        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          {selectedValues.length === 0 && <TextField
            autoComplete="off"
            type="number"
            label="Request Amount (With GST)" name="request_amount" value={formData?.request_amount} onChange={handleChange} fullWidth />}
          {selectedValues.length === 0 && <FormControlLabel sx={{ width: 200 }} control={<Checkbox checked={isGSTAvailable} onChange={(e) => handleGSTChange(e.target.checked)} />} label="Add GST (18%)" />}

          <Stack direction="row" spacing={2}>
            {selectedValues.length === 0 && <TextField label="GST Amount" value={formData?.gst_amount} inputProps={{ readOnly: true }} />}
            <TextField label="Base Amount (Excl. GST)" name="base_amount" onChange={handleChange} value={formData?.base_amount} />
            <FormControl fullWidth sx={{ maxWidth: 360 }} disabled={!!vendorDetail?.request_id}>
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

          </Stack>

          {selectedPaymentType === "advanced" || selectedPaymentType === "upfront" &&
            <VendorAdavanceRequest formData={formData} setFormData={setFormData} vendorId={vendorDetail._id} />
          }
          <Stack direction="row" spacing={2}>
            <TextField label="Invoice No#" name="invc_no" value={formData?.invc_no} onChange={handleChange} fullWidth />
            <TextField type="date" label="Invoice Date" name="invc_date" value={formData?.invc_date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" component="label">
              Upload Invoice
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {selectedFileName && <div style={{ color: 'green', marginTop: '8px' }}>Selected File: {selectedFileName}</div>}
          </Stack>
          <TextField label="Remark" name="remark_audit" value={formData?.remark_audit} onChange={handleChange} fullWidth />
        </div>
      </DialogContent>
      <DialogActions>
        <VendorAdvanceSettlement selectedValues={selectedValues} setSelectedValues={setSelectedValues} vendorDetail={vendorDetail} vendorId={vendorDetail?._id} formData={formData} handleCloseDialog={handleCloseDialog} />
        <Stack direction='row' spacing={1}>

          <Button onClick={handleCloseDialog}>Cancel</Button>
          {(vendorDetail && vendorDetail.request_id) ? <Button variant="contained" onClick={handleEditSubmit} disabled={formData?.request_amount == 0 || selectedValues?.length > 0 || UpdateLoading ? true : false}>
            {/* {UpdateLoading ? 'Submitting...' : 'Edit Payment Request'} */}
            Edit Payment Request
          </Button> :

            <Button variant="contained" onClick={handleSubmit} disabled={formData?.request_amount == 0 || selectedValues?.length > 0 ? true : false}>
              {isLoading ? 'Submitting...' : 'Request Payment'}
            </Button>

          }
          {vendorDetail && vendorDetail.request_id && <Button variant="contained" color='error' onClick={handleDeleteRequest}>Delete</Button>}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentRequestFromPurchase;
