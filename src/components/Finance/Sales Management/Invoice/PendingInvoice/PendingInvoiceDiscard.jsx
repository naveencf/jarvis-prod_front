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
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import { useGlobalContext } from "../../../../../Context/Context";

const PendingInvoiceDiscard = (props) => {
  const {
    discardDialog,
    setDiscardDialog,
    getData,
    handleCloseEditFieldAction,
    InvcCreatedRowData,
  } = props;

  const { toastAlert } = useGlobalContext();
  const [reason, setReason] = useState("");
  const token = sessionStorage.getItem("token");
  console.log(InvcCreatedRowData, "getData--->>>");

  const handleCloseDiscardDialog = () => {
    setDiscardDialog(false);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("invoice_action_reason", reason);

    const confirmation = confirm("Are you sure you want to reject this data?");
    if (confirmation) {
      axios
        .put(
          baseUrl + `sales/invoice_request_rejected/${InvcCreatedRowData?._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toastAlert("Data Rejected Successfully");
          handleCloseDiscardDialog();
          handleCloseEditFieldAction();
          getData();
          setInoiceNum("");
          setPartyName("");
        });
    } else {
      getData();
    }
    setIsFormSubmitted(true);
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
