import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const CommonDialogBox = (props) => {
  const { dialog, handleCloseDialog, activeAccordionIndex, data, columnsData } =
    props;

  console.log(data, "data----------->");
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
          {/* {activeAccordionIndex === 0 ||
            activeAccordionIndex === 1 ||
            (activeAccordionIndex === 2 && ( */}
          <DataGrid
            rows={
              activeAccordionIndex === 0
                ? data || []
                : activeAccordionIndex === 1
                ? data?.filter((d) => d.status === "3") || []
                : activeAccordionIndex === 2
                ? data?.filter((d) => d.status === "0") || []
                : []
            }
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
            getRowId={(row) => row?.request_id}
          />
          {/* ))} */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommonDialogBox;
