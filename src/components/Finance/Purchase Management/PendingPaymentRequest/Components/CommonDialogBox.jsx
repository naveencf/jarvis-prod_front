import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const CommonDialogBox = (props) => {
  const { dialog, handleCloseDialog, activeAccordionIndex, data, columnsData } =
    props;
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
        <DialogTitle>Unique Vendors</DialogTitle>
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
          {activeAccordionIndex === 0 && (
            <DataGrid
              rows={data}
              columns={columnsData}
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
              getRowId={(row) => data.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 1 && (
            <DataGrid
              rows={data.filter((d) => d.status === "3")}
              columns={columnsData}
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
              getRowId={(row) => data.indexOf(row)}
            />
          )}
          {activeAccordionIndex === 2 && (
            <DataGrid
              rows={data.filter((d) => d.status === "0")}
              columns={columnsData}
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
              getRowId={(row) => data.indexOf(row)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommonDialogBox;
