import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PersonIcon from "@mui/icons-material/Person";
import { Stack, MenuItem, Select, FormControl, InputLabel, Typography, Alert } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect } from "react";
import { useGlobalContext } from "../../../../../Context/Context";
import pdfImg from "../../../pdf-file.png";
import ImageView from "../../../ImageView";
import RecentInvoices from "./RecentInvoices";

{/* <Alert severity="success">This is a success Alert.</Alert>
<Alert severity="info">This is an info Alert.</Alert>
<Alert severity="warning">This is a warning Alert.</Alert>
<Alert severity="error">This is an error Alert.</Alert> */}

export default function ReadableList({ handleTDSLogic, extractedData, rowData, vendorBankDetail, selectedBankIndex, setSelectedBankIndex, openImageDialog, setOpenImageDialog }) {
  const { toastAlert, toastError } = useGlobalContext();
  const [openDialog, setOpenDialog] = useState(false);
  // const [openImageDialog, setOpenImageDialog] = useState(true);
  const [viewImgSrc, setViewImgSrc] = useState(rowData.invoice_file_url);

  useEffect(() => {
    if (vendorBankDetail.length > 0) {
      let index = vendorBankDetail.findIndex(bank => bank.account_number == rowData.accountNumber);

      if (index === -1 && rowData.vpa) {
        index = vendorBankDetail.findIndex(bank => bank.upi_id == rowData.vpa);
      }

      if (index === -1) {
        index = 0; // Default to first option if no match
        toastError("Bank Details does not matched with requested detail")
      }
      // console.log(index, "index")
      setSelectedBankIndex(index);
      // handleTDSLogic();
    }
  }, [rowData, vendorBankDetail, setSelectedBankIndex]);
  // console.log(vendorBankDetail, "vendorBankDetail")

  const openImgDialog = () => {
    setOpenDialog(true);
  };
  const handleBankChange = (event) => {
    setSelectedBankIndex(event.target.value);
  };

  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const selectedBankDetail = vendorBankDetail[selectedBankIndex];
  // console.log(rowData, "rowData")
  return (
    <>
      {/* Bank selection dropdown */}
      <Stack direction="row" spacing={2}>

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
                {`${bank.bank_name || "UPI"} : ${bank.account_number || bank.upi_id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack >

        </Stack>
      </Stack>
      <Stack >

        {/* {openImageDialog && <ImageView viewImgSrc={viewImgSrc} fullWidth={true} maxWidth={'md'} setViewImgDialog={setOpenImageDialog} openImageDialog={openImageDialog} />} */}
      </Stack>
      <Stack direction="row" spacing={2}>


        {/* Vendor details */}
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={rowData.vendor_name} secondary="Vendor Name" />
          </ListItem>
          {extractedData && extractedData != {} && extractedData.vendorName &&
            (
              <Alert severity={extractedData.vendorName?.toLowerCase() == rowData.vendor_name?.toLowerCase() ? "success" : "warning"}>
                {extractedData.vendorName?.toLowerCase() == rowData.vendor_name?.toLowerCase() ? `Vendor Name Matched with Invoice` : `Vendor Name in Invoice: ${extractedData.vendorName}`}
              </Alert>
            )}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={vendorBankDetail[selectedBankIndex]?.account_number} secondary="Account No." />
          </ListItem>
          {extractedData && extractedData != {} && extractedData.accountNumber && (

            <Alert severity={extractedData.accountNumber == vendorBankDetail[selectedBankIndex]?.account_number ? "success" : 'error'}>{extractedData.accountNumber == vendorBankDetail[selectedBankIndex]?.account_number ? `Account Number Matched with Invoice` : `Account Number in Invoice : ${extractedData.accountNumber}`}</Alert>

          )}
        </List>

        {/* Bank details */}
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`PAN : ${vendorBankDetail[selectedBankIndex]?.pan_card}`} secondary={`GST : ${vendorBankDetail[selectedBankIndex]?.gst_no}`} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CalendarMonthIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`IFSC : ${vendorBankDetail[selectedBankIndex]?.ifsc || "NA"}`} secondary={`Bank : ${vendorBankDetail[selectedBankIndex]?.bank_name || "NA"}`} />
          </ListItem>
          {extractedData && extractedData != {} && extractedData.ifscCode && (

            <Alert severity={extractedData.ifscCode == vendorBankDetail[selectedBankIndex]?.ifsc ? "success" : "error"}>{extractedData.ifscCode == vendorBankDetail[selectedBankIndex]?.ifsc ? `IFSC matched with Invoice` : `IFSC differ from Invoice : ${extractedData.ifscCode}`}</Alert>
          )}
        </List>
      </Stack>
      <Stack spacing={2}>

        <RecentInvoices rowData={rowData} setOpenImageDialog={setOpenImageDialog} setViewImgSrc={setViewImgSrc} />
      </Stack>
    </>
  );
}
