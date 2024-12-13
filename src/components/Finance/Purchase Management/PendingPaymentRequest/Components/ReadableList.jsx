import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PersonIcon from "@mui/icons-material/Person";
import { Stack } from "@mui/material";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import PendingIcon from "@mui/icons-material/Pending";

export default function ReadableList({ rowData }) {
  const convertDateToDDMMYYYY = (date) => {
    const date1 = new Date(date);
    const day = String(date1.getDate()).padStart(2, "0");
    const month = String(date1.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date1.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "Paid";
      case "2":
        return "Discard";
      case "3":
        return "Partial";
      default:
        return "";
    }
  };

  return (
    <Stack direction="row">
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={rowData.name} secondary="Requested By" />
        </ListItem>
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
              <PendingIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`₹${rowData.outstandings}`}
            secondary="Balance"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PendingIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`₹${rowData.request_amount}`}
            secondary="Amount Requested"
          />
        </ListItem>
      </List>
      {/* // 2nd list */}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CalendarMonthIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={convertDateToDDMMYYYY(rowData.request_date)}
            secondary="Request Date"
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BusinessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={rowData.address} secondary="Address" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={rowData.gst} secondary="GST" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              rowData.remark_audit == "" ? "No Remark" : rowData.remark_audit
            }
            secondary="Purchase Remark"
          />
        </ListItem>
      </List>
    </Stack>
  );
}

// <div>
{
  /* <TextField                  
value={rowData.t3}
autoFocus
margin="dense"
id="name"
disabled
label="Purchase Remark"
type="text"
variant="outlined"
/> */
}
// <TextField
//               className="col"
//               value={rowData.name}
//               autoFocus
//               margin="dense"
//               id="name"
//               readOnly
//               label="Requested By"
//               type="text"
//               variant="outlined"
//             />
//             <TextField
//               className="col"
//               value={convertDateToDDMMYYYY(rowData.request_date)}
//               autoFocus
//               margin="dense"
//               id="name"
//               readOnly
//               label="Request Date"
//               type="text"
//               variant="outlined"
//             />
//           </div>
//           <div className="row">
//             <TextField
//               // className="col-md-6 me-3"
//               value={rowData.t3}
//               autoFocus
//               margin="dense"
//               id="name"
//               disabled
//               label=" Purchase Remark"
//               type="text"
//               variant="outlined"
//             />
//           </div>
//           <div className="row gap-3">
//             <TextField
//               value={rowData.vendor_name}
//               className="col"
//               autoFocus
//               margin="dense"
//               id="name"
//               readOnly={true}
//               label="Vendor Name"
//               type="text"
//               InputProps={{
//                 readOnly: true,
//               }}
//               variant="outlined"
//             />
//             <TextField
//               className="col"
//               value={rowData.address}
//               autoFocus
//               margin="dense"
//               id="name"
//               readOnly
//               label="Address"
//               type="text"
//               variant="outlined"
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//           </div>
//           <div className="row gap-3">
//             <TextField
//               className="col"
//               value={rowData.gst}
//               autoFocus
//               margin="dense"
//               // disabled
//               readOnly
//               label="GST"
//               type="text"
//               variant="outlined"
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//             <TextField
//               className="col"
//               value={`₹${rowData.outstandings}`}
//               autoFocus
//               margin="dense"
//               // disabled
//               readOnly
//               label="Outstanding"
//               type="text"
//               variant="outlined"
//               InputProps={{
//                 readOnly: true,
//               }}
//             />
//           </div>
