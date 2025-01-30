import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PersonIcon from "@mui/icons-material/Person";
import { Stack, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ReadableList({ rowData, vendorBankDetail, selectedBankIndex, setSelectedBankIndex }) {


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
  // console.log(vendorBankDetail, "vendorBankDetail", selectedBankIndex)
  return (
    <>
      {/* Bank selection dropdown */}
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
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={vendorBankDetail[selectedBankIndex]?.account_number} secondary="Account No." />
          </ListItem>
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
        </List>
      </Stack>

    </>
  );
}
