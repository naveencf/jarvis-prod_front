import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function EditCity({
  handleCloseEditCityName,
  openEditCity,
  editCityName,
  handleEditCity,
  handleSaveEditCityName,
}) {
  const [open, setOpen] = useState(true);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  return (
    <div>
      <Dialog
        onClose={handleCloseEditCityName}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Modal title
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditCityName}
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
            type="text"
            variant="outlined"
            label="City Name"
            value={editCityName}
            onChange={(e) => handleEditCity(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSaveEditCityName}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
