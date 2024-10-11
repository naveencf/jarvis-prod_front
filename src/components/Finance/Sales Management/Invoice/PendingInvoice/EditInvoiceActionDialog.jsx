import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useGlobalContext } from "../../../../../Context/Context";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../../utils/config";
import PendingInvoiceDiscard from "./PendingInvoiceDiscard";

const EditInvoiceActionDialog = (props) => {
  const {
    editActionDialog,
    setEditActionDialog,
    InvcCreatedRowData,
    setOpenImageDialog,
    setViewImgSrc,
    getData,
    handleGetProforma,
  } = props;

  const { toastAlert, toastError } = useGlobalContext();
  const [invcDate, setInvcDate] = useState(dayjs());
  const [invcNumber, setInvcNumber] = useState("");
  const [partyInvoiceName, setPartyInvoiceName] = useState("");
  const [imageInvoice, setImageInvoice] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPDF, setIsPDF] = useState(false);
  const [discardDialog, setDiscardDialog] = useState(false);

  const [isRequired, setIsRequired] = useState({
    imageInvoice: false,
    invcNumber: false,
  });

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleCloseEditFieldAction = () => {
    setEditActionDialog(false);

    setInvcNumber("");
    setInvcDate(dayjs());
    setPartyInvoiceName("");
    setImageInvoice(null);
    setPreview(null);
    setIsPDF(false);
    setIsRequired({
      imageInvoice: false,
      invcNumber: false,
    });
  };

  const handleOpenDiscardDialog = (e) => {
    e.preventDefault();
    setDiscardDialog(true);
  };

  useEffect(() => {
    if (InvcCreatedRowData) {
      setInvcNumber(InvcCreatedRowData?.invoice_number || "");
      setPartyInvoiceName(InvcCreatedRowData?.party_name || "");
      setInvcDate(
        InvcCreatedRowData?.invoice_uploaded_date
          ? dayjs(InvcCreatedRowData?.invoice_uploaded_date)
          : dayjs()
      );

      if (InvcCreatedRowData?.invoice_file_url) {
        setPreview(InvcCreatedRowData.invoice_file_url);
        setViewImgSrc(InvcCreatedRowData.invoice_file_url);

        // Check if the file is a PDF
        const isFilePDF =
          InvcCreatedRowData?.invoice_file_url?.endsWith(".pdf");
        setIsPDF(isFilePDF);
      }
    }
  }, [InvcCreatedRowData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageInvoice(file);
      setIsRequired((prev) => ({
        ...prev,
        imageInvoice: false,
      }));
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
      setViewImgSrc(filePreview);

      // Check if the uploaded file is a PDF
      const isFilePDF = file.type === "application/pdf";
      setIsPDF(isFilePDF);
    }
  };

  const handleInvoiceEditFields = async (e) => {
    e.preventDefault();
    if (!imageInvoice) {
      setIsRequired((prev) => ({ ...prev, imageInvoice: true }));
      toastError("Please Add Invoice Image");
      return;
    }

    const confirmation = confirm("Are you sure you want to submit this data?");
    if (confirmation) {
      const formData = new FormData();
      formData.append("update_by", loginUserId);
      formData.append("invoice_type_id", InvcCreatedRowData?.invoice_type_id);
      formData.append("sale_booking_id", InvcCreatedRowData?.sale_booking_id);
      formData.append("invoice_file", imageInvoice);
      formData.append("invoice_number", invcNumber);
      formData.append("party_name", partyInvoiceName);
      formData.append(
        "invoice_uploaded_date",
        invcDate
          ? dayjs(invcDate).format("YYYY/MM/DD")
          : dayjs().format("YYYY/MM/DD")
      );

      try {
        const res = await axios.put(
          baseUrl + `sales/invoice_request/${InvcCreatedRowData?._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          toastAlert("Data Submitted Successfully");
          handleCloseEditFieldAction();
          getData();
          handleGetProforma();
        }
      } catch (err) {
        console.log("Submit invoice error: ", err);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={editActionDialog}
        onClose={handleCloseEditFieldAction}
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
          onClick={handleCloseEditFieldAction}
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
          <div className="row">
            <TextField
              type="text"
              label="Invoice Number"
              value={invcNumber}
              onChange={(e) => setInvcNumber(e.target.value)}
              error={isRequired.invcNumber}
              helperText={
                isRequired.invcNumber && "Please enter a valid invoice number"
              }
            />
            <label className="form-label mt-2">Invoice Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                value={invcDate}
                onChange={(e) => setInvcDate(e)}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              label="Party Name"
              value={partyInvoiceName}
              className="mt-3"
              onChange={(e) => setPartyInvoiceName(e.target.value)}
            />
            <div className="col-3">
              <label className="form-label mt-2">
                Invoice Image <sup style={{ color: "red" }}>*</sup>
              </label>
              <input type="file" onChange={handleFileChange} />
              {isRequired?.imageInvoice && (
                <p className="form-error">Please Add Correct File</p>
              )}
              {preview && (
                <div className="mt-2">
                  {!isPDF ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "70px", cursor: "pointer" }}
                      onClick={() => setOpenImageDialog(true)}
                    />
                  ) : (
                    <img
                      src="/pdf-icon.png"
                      alt="PDF Preview"
                      style={{ maxWidth: "40px", cursor: "pointer" }}
                      onClick={() => setOpenImageDialog(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="">
              <Button
                type="button"
                className="mt-3"
                variant="contained"
                onClick={handleInvoiceEditFields}
              >
                Update Invoice
              </Button>
              <Button
                type="button"
                className="mt-3 ms-3"
                variant="contained"
                onClick={(e) => handleOpenDiscardDialog(e)}
              >
                Discard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <PendingInvoiceDiscard
        discardDialog={discardDialog}
        setDiscardDialog={setDiscardDialog}
        handleCloseEditFieldAction={handleCloseEditFieldAction}
        getData={getData}
        InvcCreatedRowData={InvcCreatedRowData}
      />
    </div>
  );
};

export default EditInvoiceActionDialog;
