import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalContext } from "../../../../../Context/Context";
import { useDeletePendingInvoiceMutation } from "../../../../Store/API/Finance/InvoiceRequestApi";

const PendingInvoiceDiscard = (props) => {
  const {
    discardDialog,
    setDiscardDialog,
    getData,
    handleCloseEditFieldAction,
    InvcCreatedRowData,
  } = props;

  const [
    deletePendingInvoiceReq,
    {
      isLoading: deleteInvoiceRequestLoading,
      isError: deleteInvoiceRequestError,
      isSuccess: deleteInvoiceRequestSuccess,
    },
  ] = useDeletePendingInvoiceMutation();

  const { toastAlert } = useGlobalContext();
  const [reason, setReason] = useState("");

  const handleCloseDiscardDialog = () => {
    setDiscardDialog(false);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("invoice_action_reason", reason);
    formData.append("invoice_creation_status", "rejected");

    const confirmation = confirm("Are you sure you want to reject this data?");
    if (!confirmation) return;

    try {
      await deletePendingInvoiceReq({
        id: InvcCreatedRowData?._id,
        data: formData,
      }).unwrap();

      toastAlert("Data Rejected Successfully");
      handleCloseDiscardDialog();
      handleCloseEditFieldAction();
      getData();
      setInvoiceNum("");
      setPartyName("");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error rejecting data:", error);
      toastAlert("Failed to reject data, please try again.");
      handleCloseDiscardDialog();
      handleCloseEditFieldAction();
    }
  };

  return (
    <div>
      <Dialog
        open={discardDialog}
        onClose={handleCloseDiscardDialog}
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
          onClick={handleCloseDiscardDialog}
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
              <Button variant="contained" onClick={(e) => handleReject(e)}>
                Discard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingInvoiceDiscard;
