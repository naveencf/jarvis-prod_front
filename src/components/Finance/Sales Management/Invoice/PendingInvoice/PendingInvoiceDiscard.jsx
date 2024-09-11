import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "antd";

const PendingInvoiceDiscard = (props) => {
  const { discardDialog } = props;

  const [reason, setReason] = useState("");

  const handleDiscardCloseDialog = () => {
    discardDialog(false);
  };

  //   const handleReject = async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData();
  //     formData.append("invoice_action_reason", reason);

  //     const confirmation = confirm("Are you sure you want to reject this data?");
  //     if (confirmation) {
  //       axios
  //         .put(baseUrl + `sales/invoice_request_rejected/${objId}`, formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           toastAlert("Data Rejected Successfully");
  //           handleDiscardCloseDialog();
  //           getData();
  //           setInoiceNum("");
  //           setPartyName("");
  //         });
  //     } else {
  //       getData();
  //     }
  //     // toastAlert("Data updated");
  //     // setIsFormSubmitted(true);
  //   };

  return (
    <div>
      <Dialog
        open={discardDialog}
        onClose={handleDiscardCloseDialog}
        fullWidth={true}
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Invoice Rejected</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDiscardCloseDialog}
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
          <TextField
            multiline
            label="Reason for Discard"
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
          <div className="pack w-100 mt-3 sb">
            <div className="pack gap16">
              <Button
                variant="contained"
                //   onClick={(e) => handleReject(e)}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingInvoiceDiscard;
