import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ open, setOpen, tj }) {
  // const [open, setOpen] = React.useState(false);
  // console.log(tj);
  const handleClickOpen = () => {
    setOpen(true);
  };
  let text = [
    "Provide number of leads,you want to assign",
    "Select the employee through checkbox, to whom you want to assign leads",
    "Upload fields don't match the format fields,It will not uploaded in database but still you can preview it",
    "Please select the leads through checkbox which you want to transfer",
    "Please select the employee to whom you want to transfer",
    "Please select the page which you want to track",
  ];
  const titlearr = [
    "Input value is Empty?",
    "Employees not selected?",
    "Error:Upload Properly",
    "leads not selected?",
    "Employees not selected?",
    "Pages not selected",
  ];

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{titlearr[tj]}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text[tj]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
          {/* <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
