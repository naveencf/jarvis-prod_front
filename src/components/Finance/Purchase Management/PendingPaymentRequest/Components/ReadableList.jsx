import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PersonIcon from "@mui/icons-material/Person";
import { Stack, MenuItem, Select, FormControl, InputLabel, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect } from "react";
import { useGlobalContext } from "../../../../../Context/Context";
import pdfImg from "../../../pdf-file.png";
import ImageView from "../../../ImageView";

export default function ReadableList({ extractedData, rowData, vendorBankDetail, selectedBankIndex, setSelectedBankIndex, openImageDialog, setOpenImageDialog }) {
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

      setSelectedBankIndex(index);
    }
  }, [rowData, vendorBankDetail, setSelectedBankIndex]);

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
          {extractedData && extractedData != {} && extractedData.vendorName && extractedData.vendorName?.toLowerCase() != rowData.vendor_name?.toLowerCase() && (
            <Typography variant="caption" color="error" sx={{ pt: 0 }}>
              Vendor Name on Invoice : {extractedData.vendorName}
            </Typography>
          )}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={vendorBankDetail[selectedBankIndex]?.account_number} secondary="Account No." />
          </ListItem>
          {extractedData && extractedData != {} && extractedData.accountNumber && extractedData.accountNumber != vendorBankDetail[selectedBankIndex]?.account_number && (
            <Typography variant="caption" color="error" sx={{ pt: 0 }}>
              Account Number in Invoice : {extractedData.accountNumber}
            </Typography>
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
            <ListItemText primary={`PAN : ${rowData?.pan}`} secondary={`GST : ${rowData?.gst}`} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CalendarMonthIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`IFSC : ${vendorBankDetail[selectedBankIndex]?.ifsc || "NA"}`} secondary={`Bank : ${vendorBankDetail[selectedBankIndex]?.bank_name || "NA"}`} />
          </ListItem>
          {extractedData && extractedData != {} && extractedData.ifscCode && extractedData.ifscCode != vendorBankDetail[selectedBankIndex]?.ifsc && (
            <Typography variant="caption" color="error" sx={{ pt: 0 }}>
              IFSC differ from Invoice : {extractedData.ifscCode}
            </Typography>
          )}
        </List>
      </Stack>

    </>
  );
}
