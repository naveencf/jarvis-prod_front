import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Button, MenuItem, List, ListItem, ListItemText, Stack } from '@mui/material';
import { Select, FormControl, InputLabel } from '@mui/material';
import { useAddPurchaseMutation } from '../../Store/API/Purchase/PurchaseRequestPaymentApi';
import { useEffect } from 'react';
import { baseUrl, phpBaseUrl } from '../../../utils/config';
import axios from 'axios';
import formatString from '../../../utils/formatString';
import { useGlobalContext } from '../../../Context/Context';

const PaymentRequestFromPurchase = ({ reqestPaymentDialog, setReqestPaymentDialog, vendorDetail, setVendorDetail, userName }) => {
  const token = sessionStorage.getItem('token');
  const [addPurchase, { isLoading, isSuccess, isError }] = useAddPurchaseMutation();
  const [vendorPhpDetail, setVendorPhpDetail] = useState('');
  const [vendorBankDetail, setVendorBankDetail] = useState('');
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);
  const { toastAlert, toastError } = useGlobalContext();
  const [formData, setFormData] = useState({
    vendor_id: vendorDetail?.vendor_id,
    outstanding: vendorPhpDetail[0]?.outstanding,
    request_amount: '',
    gst_amount: 0,
    base_amount: 0,
    priority: 'high',
    invc_no: '',
    invc_date: '',
    remark_audit: '',
    invc_img: '',
    request_by: userName,
    // accountNumber: vendorBankDetail[selectedBankIndex]?.account_number,
    // branchCode: vendorBankDetail[selectedBankIndex]?.ifsc,
    // vpa: vendorBankDetail[selectedBankIndex]?.vpa,
  });

  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    axios
      .post(phpBaseUrl + `?view=getvendorDataListvid`, {
        vendor_id: vendorDetail?.vendor_id,
      })
      .then((res) => {
        if (res.status == 200) {
          setVendorPhpDetail(res.data.body);
          console.log(res.data.body, 'vendorDetail', vendorDetail);
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
          console.log(res.data.data, 'res.data.data');
        }
      });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };


      if (name === "request_amount") {
        const requestAmount = parseFloat(value) || 0;
        if (updatedData.gst) {
          updatedData.gst_amount = ((requestAmount * 18) / 118).toFixed(2);
          updatedData.base_amount = (requestAmount - updatedData.gst_amount).toFixed(2);
          updatedData.request_amount = requestAmount;
          updatedData.outstandings = requestAmount;
        } else {
          updatedData.gst_amount = "0";
          updatedData.base_amount = requestAmount.toFixed(2);
          updatedData.request_amount = requestAmount;
          updatedData.outstandings = requestAmount;
        }
      }
      return updatedData;
    });
  };
  // const handleChange = (e) => {
  //     const { name, value } = e.target;

  //     setFormData((prev) => {
  //         const updatedData = { ...prev, [name]: value };

  //         if (name === "request_amount") {
  //             const requestAmount = parseFloat(value) || 0;
  //             const outstandingAmount = parseFloat(vendorPhpDetail[0]?.outstanding) || 0;

  //             if (requestAmount > outstandingAmount) {
  //                 toastError("Request Amount cannot exceed Outstanding Amount.");

  //                 updatedData.request_amount = vendorPhpDetail[0]?.outstanding; // Reset to previous valid amount
  //             } else {
  //                 if (updatedData.gst) {
  //                     updatedData.gst_amount = ((requestAmount * 18) / 118).toFixed(2);
  //                     updatedData.base_amount = (requestAmount - updatedData.gst_amount).toFixed(2);
  //                 } else {
  //                     updatedData.gst_amount = "0";
  //                     updatedData.base_amount = requestAmount.toFixed(2);
  //                 }
  //                 updatedData.request_amount = requestAmount;
  //             }
  //         }
  //         return updatedData;
  //     });
  // };

  const handleGSTChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prev) => {
      const requestAmount = parseFloat(prev.request_amount) || 0;
      const updatedData = { ...prev, gst: isChecked };

      if (isChecked) {
        updatedData.gst_amount = ((requestAmount * 18) / 118).toFixed(2);
        updatedData.base_amount = (requestAmount - updatedData.gst_amount).toFixed(2);
      } else {
        updatedData.gst_amount = '0.00';
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
  console.log(vendorBankDetail[selectedBankIndex], "selectedBank")
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure selected bank details are valid before submitting
    const selectedBank = vendorBankDetail[selectedBankIndex];
    if (!selectedBank) {
      toastError('Please select a valid bank.');
      return;
    }
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    // Append the selected bank details to the payload
    payload.append("accountNumber", selectedBank?.account_number);
    payload.append("branchCode", selectedBank?.ifsc);
    // payload.append("accountNumber", selectedBank?.account_number || "");
    // payload.append("branchCode", selectedBank?.ifsc || "");
    payload.append("vpa", selectedBank?.upi_id || "");
    payload.append("is_bank_verified", selectedBank?.is_verified);


    try {
      // console.log(vendorPhpDetail[0]?.outstanding, "vendorPhpDetail[0]?.outstanding")
      // return;
      // const tempOutstanding =parseInt(vendorPhpDetail[0]?.outstanding);
      await addPurchase(payload).unwrap();
      toastAlert("Purchase added successfully!");
      setFormData({
        gst: false,
        outstandings: 0,
        request_amount: "",
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
  const handleBankChange = (event) => {
    setSelectedBankIndex(event.target.value);
  };
  return (
    <Dialog
      open={reqestPaymentDialog}
      onClose={() => setReqestPaymentDialog(false)}
      fullWidth
      maxWidth="sm"
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
          </List>
          <List>
            <ListItem>
              <ListItemText primary="Page" secondary={vendorDetail?.primary_page_name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Outstanding" secondary={vendorPhpDetail[0]?.outstanding} />
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
                  {/* {`${bank?.bank_name} : ${bank?.account_number}`} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          <TextField label="Request Amount (With GST)" name="request_amount" value={formData.request_amount} onChange={handleChange} fullWidth />
          <FormControlLabel control={<Checkbox checked={formData.gst} onChange={handleGSTChange} />} label="Add GST (18%)" />
          <Stack direction="row" spacing={2}>
            <TextField label="GST Amount" value={formData.gst_amount} InputProps={{ readOnly: true }} />
            <TextField label="Base Amount (Excl. GST)" value={formData.base_amount} InputProps={{ readOnly: true }} />
            {/* <TextField
                            select
                            label="Priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            sx={{ width: "30%" }}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </TextField> */}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField label="Invoice No#" name="invc_no" value={formData.invc_no} onChange={handleChange} fullWidth />
            <TextField type="date" label="Invoice Date" name="invc_date" value={formData.invc_date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" component="label">
              Upload Invoice
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {selectedFileName && <div style={{ color: 'green', marginTop: '8px' }}>Selected File: {selectedFileName}</div>}
          </Stack>
          <TextField label="Remark" name="remark_audit" value={formData.remark_audit} onChange={handleChange} fullWidth />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Request Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentRequestFromPurchase;
