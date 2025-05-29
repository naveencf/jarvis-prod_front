import React, { use, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import { useGlobalContext } from "../../../../../../Context/Context";
import { ErrorBar } from "recharts";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../../../utils/config";
import axios from "axios";
import { useUpdateCreditNoteMutation } from "../../../../../Store/API/Finance/CreditNoteApi";
import { useEffect } from "react";
import { Stack } from "react-bootstrap";
import { useGlobalContext } from "../../../../../../Context/Context";

const CreditNoteDialog = (props) => {

  const {
    setCreditNotesDialog,
    creditNotesDialog,
    rowDataForCreditNote,
    setViewImgDialog,
    setViewImgSrc,
    getData,
  } = props;

  const [
    updateCreditNoteForOutstanding,
    {
      isLoading: updateCreditNoteLoading,
      isError: updateCreditNoteError,
      isSuccess: updateCreditNoteSuccess,
    },
  ] = useUpdateCreditNoteMutation();
  // console.log(rowDataForCreditNote, "rowDataForCreditNote")
  const { toastAlert, toastError } = useGlobalContext();
  const [creditNoteReason, setCreditNoteReason] = useState("");
  const [creditNoteAmount, setCreditNoteAmount] = useState(0);
  const [creditNoteFile, setCreditNoteFile] = useState("");
  const [preview, setPreview] = useState(null);
  const [isPDF, setIsPDF] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    setCreditNoteAmount(rowDataForCreditNote?.invoice_amount)
  }, [rowDataForCreditNote]);
  const handleCloseCreditNote = () => {
    setCreditNotesDialog(false);

    setCreditNoteReason("");
    setCreditNoteFile("");
    setPreview(null);
    setIsPDF(false);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      setCreditNoteFile(file);
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
      setViewImgSrc(filePreview);

      // Check if the uploaded file is a PDF
      const isFilePDF = file?.type === "application/pdf";
      setIsPDF(isFilePDF);
    }
  };

  const handleCreditNoteUpdate = async (e, inputValue) => {
    e?.preventDefault();
    // console.log(e, "e")

    if (creditNoteAmount <= 0) {
      toastError("Credit Note Amount must be greater than 0");
      return;
    }
    const confirmation = confirm(
      `Are you sure you want to mark this sale booking of ${inputValue == 'creditNote' ? creditNoteAmount : rowDataForCreditNote?.campaign_amount} as a ${inputValue}?`
    );
    if (!confirmation) return;
    let partialCreditNote = true;
    if (creditNoteAmount === rowDataForCreditNote?.invoice_amount) {
      partialCreditNote = false;
    }
    const formData = new FormData();
    if (inputValue === 'cancelled') {
      formData.append("invoice_action_reason", creditNoteReason);
      formData.append("invoice_type_id", "cancelled");
    } else if (inputValue === 'creditNote') {
      formData.append("invoice_type_id", "credit_note");
      formData.append("invoice_action_reason", creditNoteReason);
      formData.append("updated_by", loginUserId);
      formData.append("credit_note_file", creditNoteFile);
      formData.append("is_partial_credit_note", partialCreditNote);
      formData.append("credit_note_amount", creditNoteAmount);
    } else {
      toastError("Invalid action type");
      return;
    }
    // Cancelled
    try {
      const InvoiceUpdateResponse = await updateCreditNoteForOutstanding({
        id: rowDataForCreditNote?._id,
        data: formData,
      }).unwrap();
      console.log(InvoiceUpdateResponse, "InvoiceUpdateResponse")
      toastAlert("Invoice Updated Successfully");
      handleCloseCreditNote();
      getData();
    } catch (err) {
      // console.log("Error While Updating Credit Note: ", ErrorBar);
      handleCloseCreditNote();
    }
  };

  return (
    <Dialog open={creditNotesDialog} onClose={handleCloseCreditNote} fullWidth maxWidth="sm">
      <DialogTitle>
        Invoice Update
        <IconButton
          aria-label="close"
          onClick={handleCloseCreditNote}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction="column" spacing={2} >
          <TextField
            label="Invoice Number"
            value={rowDataForCreditNote?.invoice_number || ""}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{ backgroundColor: "#F0F0F0", mb: 2 }}
          />

          <TextField
            type="number"
            // label="Credit Note Amount"
            label={
              <span>
                Credit Note Amount <sup style={{ color: "red" }}>*</sup>
              </span>
            }
            value={creditNoteAmount}
            onChange={(e) => setCreditNoteAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            type="text"
            label="Reason"
            value={creditNoteReason}
            onChange={(e) => setCreditNoteReason(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <label className="form-label">
              File <sup style={{ color: "red" }}>*</sup>
            </label>
            <input type="file" onChange={handleFileChange} />

            {preview && (
              <Box mt={1}>
                {!isPDF ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: "70px", cursor: "pointer" }}
                    onClick={() => setViewImgDialog(true)}
                  />
                ) : (
                  <img
                    src="/pdf-icon.png"
                    alt="PDF Preview"
                    style={{ maxWidth: "40px", cursor: "pointer" }}
                    onClick={() => setViewImgDialog(true)}
                  />
                )}
              </Box>
            )}
          </Box>
        </Stack>

        <Stack direction="row" spacing={4} mt={3}>
          <Button sx={{ mr: 2 }} variant="contained" onClick={(e) => handleCreditNoteUpdate(e, 'creditNote')}>
            Credit Note
          </Button>
          {rowDataForCreditNote.invoice_approved_amount === 0 && <Button variant="contained" onClick={(e) => handleCreditNoteUpdate(e, 'cancelled')}>
            Cancel Invoice
          </Button>}
        </Stack>
      </DialogContent>
    </Dialog>


  );
};

export default CreditNoteDialog;
