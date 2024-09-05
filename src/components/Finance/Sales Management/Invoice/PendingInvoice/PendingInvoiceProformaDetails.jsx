import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { pendingInvoiceProformaColumns } from "../../../CommonColumn/Columns";

const PendingInvoiceProformaDetails = (props) => {
  const {
    dialog,
    handleCloseDialog,
    proformaData,
    setOpenImageDialog,
    setViewImgSrc,
  } = props;
  return (
    <div>
      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Proforma Details</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
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
            rows={proformaData}
            columns={pendingInvoiceProformaColumns({
              proformaData,
              setOpenImageDialog,
              setViewImgSrc,
            })}
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
            getRowId={(row) => proformaData?.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingInvoiceProformaDetails;
