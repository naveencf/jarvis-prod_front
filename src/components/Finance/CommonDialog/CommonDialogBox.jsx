import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { GridToolbar } from "@mui/x-data-grid";

const CommonDialogBox = (props) => {
  const { setDialog, dialog, columns, data, title } = props;

  const handleClose = () => {
    setDialog(false);
  };

  return (
    <Dialog
      open={dialog}
      onClose={handleClose}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>{title}</DialogTitle>
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
      <DialogContent
        dividers={true}
        sx={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => data?.indexOf(row)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialogBox;
