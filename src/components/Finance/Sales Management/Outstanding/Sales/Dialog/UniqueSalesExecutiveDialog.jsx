import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { GridToolbar } from "@mui/x-data-grid";

function UniqueSalesExecutiveDialog(props) {
  const {
    uniqueSalesExecutiveDialog,
    activeAccordionIndex,
    uniqueSalesExecutiveData,
    uniqueNonInvoiceSalesExecutiveData,
    setUniqueSalesExecutiveDialog,
    columns,filterData
  } = props;
  
  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  return (
    <Dialog
      open={uniqueSalesExecutiveDialog}
      onClose={handleCloseUniquesalesExecutive}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Unique Sales Executive</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseUniquesalesExecutive}
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
        {(activeAccordionIndex === 0 || activeAccordionIndex === 1) && (
          <DataGrid
            rows={
              activeAccordionIndex === 0
                ? filterData
                : activeAccordionIndex === 1
                ? filterData
                : []
            }
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
            getRowId={(row) => filterData?.indexOf(row)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UniqueSalesExecutiveDialog;
