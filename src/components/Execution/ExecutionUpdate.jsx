import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Alert, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";

import Snackbar from "@mui/material/Snackbar";
import Confirmation from "./Confirmation";
import { set } from "date-fns";
// import { StaticDatePicker } from "@mui/x-date-pickers";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ExecutionUpdate({ id, rowData, setReload, status, executionStatus }) {
  console.log(rowData.execution_status);
  const [remark, setRemark] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  // const [date, time] = formatDate(new Date()).split(" ");
  const currentDate = new Date();
  var now = currentDate.toLocaleString();
  // console.log(currentDate.getDate()); // 👉️ 2021-12-31
  // console.log(now);
  // console.log(currentDate);
  const [snackbar, setSnackbar] = useState(null);
  const [value, setValue] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSave = () => {
    if (status == 1 && !value) {
      setValidationError(true);
      return;
    }
    handleClose();
  }
  const handleClose = () => {
    validation();
    // setValue(null);
    // setRemark("");
    setValidationError(false);
    // console.log("hitted");
    console.log(value);
  };
  const validation = () => {
    setOpen(false);
    setConfirmation(true);

    // return true;
  };
  const handleCloseSnackbar = () => setSnackbar(null);
  useEffect(() => {
    setData(rowData);
  }, []);
  return (
    <div>
      <Button
        variant="outlined"
        className="btn btn_sm cmnbtn"
        onClick={() => {
          setOpen(true);
          console.log(rowData?.execution_status, "execution_status");
        }}
        color={rowData?.execution_status == "sent_for_execution" ? "error" : "success"}
      >
        {rowData?.execution_status == "sent_for_execution" ? "Reject" : "Execute"}
      </Button>
      {confirmation && (
        <Confirmation
          rowData={rowData}
          value={value}
          remark={remark}
          status={status}
          setReload={setReload}
          confirmation={confirmation}
          setSnackbar={setSnackbar}
          setConfirmation={setConfirmation}
        />
      )}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Update Execution Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            You are about to update the execution status.
          </Typography>
          {rowData?.execution_status != "sent_for_execution" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={value}
                onChange={setValue}

                format="DD/MM/YYYY"
                sx={{
                  mb: 2,
                  mr: 2,
                  border: validationError
                    ? "2px solid red"
                    : "1px solid #d9d9d9",
                  borderRadius: 2,
                  // padding: '8px',
                }}
              />
              <TimePicker
                value={value}
                onChange={setValue}
                error={validationError}
                sx={{
                  mb: 2,
                  mr: 2,
                  border: validationError
                    ? "2px solid red"
                    : "1px solid #d9d9d9",
                  borderRadius: 2,
                }}
              />
              {validationError && (
                <Typography variant="body2" color="error">
                  Please fill in the date and time.
                </Typography>
              )}
            </LocalizationProvider>
          )}
          <TextField
            fullWidth
            id="fullWidth"
            label="Update Remark"
            variant="outlined"
            onChange={(e) => {
              setRemark(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert sx={{ ml: 80 }} {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </div>
  );
}
