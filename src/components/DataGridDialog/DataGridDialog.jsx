import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

export default function DataGridDialog({
  open,
  handleClose,
  fullWidth,
  maxWidth,
//   handleFullWidthChange,
//   handleMaxWidthChange,
    rows,
    columns
}) {
  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            pageSizeOptions={[5, 25, 50, 100, 500]}
            checkboxSelection
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
