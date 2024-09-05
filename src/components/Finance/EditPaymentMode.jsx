import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";


export default function EditPaymentMode({handleCloseEditPaymentMode,
    openEditPaymentMode,
    callApi,
    editPaymetMode,
    handleEditPaymentMode,
    rowData,
    toastAlert,
    handleSaveEditPaymentMode,}) {
  return (
    <div>
    <Dialog
      onClose={handleCloseEditPaymentMode}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Modal title
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseEditPaymentMode}
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
            label="Payment  Mode Name"
          value={editPaymetMode}
          onChange={(e) => handleEditPaymentMode(e)}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleSaveEditPaymentMode}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  )
}
