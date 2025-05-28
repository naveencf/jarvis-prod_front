import React, { use, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalContext } from "../../../../../../Context/Context";
import { ErrorBar } from "recharts";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../../../utils/config";
import axios from "axios";
import { useUpdateCreditNoteMutation } from "../../../../../Store/API/Finance/CreditNoteApi";
import { useEffect } from "react";
import { Stack } from "react-bootstrap";

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
  console.log(rowDataForCreditNote, "rowDataForCreditNote")
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

  const handleCreditNoteUpdate = async (e) => {
    e?.preventDefault();

    const confirmation = confirm(
      `Are you sure you want to mark this sale booking of ${rowDataForCreditNote?.campaign_amount} as a credit note?`
    );
    if (!confirmation) return;
    let partialCreditNote = true;
    if (creditNoteAmount === rowDataForCreditNote?.invoice_amount) {
      partialCreditNote = false;
    }
    const formData = new FormData();
    formData.append("invoice_action_reason", creditNoteReason);
    formData.append("updated_by", loginUserId);
    formData.append("credit_note_file", creditNoteFile);
    formData.append("is_partial_credit_note", partialCreditNote);
    formData.append("credit_note_amount", creditNoteAmount);
    // Cancelled
    try {
      await updateCreditNoteForOutstanding({
        id: rowDataForCreditNote?._id,
        data: formData,
      }).unwrap();

      toastAlert("Credit Note Data Updated Successfully");
      handleCloseCreditNote();
      getData();
    } catch (err) {
      // console.log("Error While Updating Credit Note: ", ErrorBar);
      handleCloseCreditNote();
    }
  };

  return (
    <div>
      <Dialog
        open={creditNotesDialog}
        onClose={handleCloseCreditNote}
        fullWidth
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Invoice Update</DialogTitle>
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
        <DialogContent
          dividers={true}
        // sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* <div className="row"> */}
          <Stack direction="column" spacing={2}>


            <TextField
              value={rowDataForCreditNote?.invoice_number}
              style={{ background: "#F0F0F0" }}
              label="Invoice Number"
              disable={true}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              type="text"
              label="Reason"
              value={creditNoteReason}
              className="mt-3"
              onChange={(e) => setCreditNoteReason(e.target.value)}
            />
            <TextField
              type="text"
              label="Credit Note Amount"
              value={creditNoteAmount}
              className="mt-3"
              onChange={(e) => setCreditNoteAmount(e.target.value)}
            />
            <div className="col-3">
              <label className="form-label mt-2">
                File <sup style={{ color: "red" }}>*</sup>
              </label>
              <input type="file" onChange={(e) => handleFileChange(e)} />
              {preview && (
                <div className="mt-2">
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
                </div>
              )}
            </div>
          </Stack>
          {/* </div> */}
          <div className="d-flex">
            <Button
              type="button"
              className="mt-3"
              variant="contained"
              onClick={(e) => handleCreditNoteUpdate(e)}
            >
              YES
            </Button>
            <Button
              type="button"
              className="mt-3 ms-3"
              variant="contained"
              onClick={(e) => handleCloseCreditNote(e)}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default CreditNoteDialog;
