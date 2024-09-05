import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function EmailEventDialog({
  openEmailEventDialog,
  setOpenEmailEventDialog,
}) {
  const [open, setOpen] = useState(true);
  const [eventName, setEventName] = useState("");
  const [remark, setRemark] = useState("");

  const handleClose = () => {
    setOpenEmailEventDialog(false);
  };
  const handleSaveClick = () => {
    axios
      .post(`${baseUrl}add_email_event`, {
        event_name: eventName,
        remarks: remark,
      })
      .then(() => {
        setOpenEmailEventDialog(false);
        setEventName("");
        setRemark("");
      });
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Email Event
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          <TextField
            className="d-block w-100 mb-3"
            id="outlined-basic"
            label="Event Name"
            variant="outlined"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Remark"
            variant="outlined"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSaveClick}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
