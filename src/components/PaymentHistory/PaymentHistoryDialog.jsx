import React from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function PaymentHistory({
  // open,
  handleClose,
  filterData,
  search,
  paymentDetailColumns,
}) {
  // Define your component logic here
  return (
    <Dialog
      open={true}
      onClose={()=>{handleClose(false)}}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Payment History</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={()=>handleClose(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DataGrid
        rows={filterData}
        columns={paymentDetailColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        autoHeight
        disableColumnMenu
        disableColumnSelector
        disableColumnFilter
        disableColumnReorder
        disableColumnResize
        disableMultipleColumnsSorting
        components={{
          Toolbar: GridToolbar,
        }}
        fv
        componentsProps={{
          toolbar: {
            value: search,
            // onChange: (event) => setSearch(event.target.value),
            placeholder: "Search",
            clearSearch: true,
            clearSearchAriaLabel: "clear",
          },
        }}
        getRowId={(row) => row.request_id}
      />
    </Dialog>
  );
}
