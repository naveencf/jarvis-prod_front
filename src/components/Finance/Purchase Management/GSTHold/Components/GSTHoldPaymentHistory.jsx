import { Dialog, DialogTitle } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const GSTHoldPaymentHistory = (props) => {
  const {
    historyData,
    paymentDetailColumns,
    setPaymentHistory,
    paymentHistory,
  } = props;

  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };

  return (
    <div>
      <Dialog
        open={paymentHistory}
        onClose={handleClosePaymentHistory}
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
          onClick={handleClosePaymentHistory}
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
          rows={historyData}
          columns={paymentDetailColumns}
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
          getRowId={(row) => row.request_id}
        />
      </Dialog>
    </div>
  );
};

export default GSTHoldPaymentHistory;
