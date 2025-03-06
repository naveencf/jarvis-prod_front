import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DeleteEmailEventDialgo({openDelateEmailEventDialog, setOpenDelateEmailEventDialog,rowData}) {
    const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpenDelateEmailEventDialog(false);
  };

  const handleConfirmDelete = () => {
    // axios
    //   .post(`${baseUrl}delete_email_event`, {
    //     event_id: id,
    //   })
    //   .then(() => {
    //     setOpenEmailEventDialog(false);
    //     getApi();
    //   });
  };
  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure you want to delete this event?
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
        <DialogContent dividers></DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleConfirmDelete}>
            Yes
          </Button>{" "}
          <Button autoFocus onClick={handleClose}>
            Cancle
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
