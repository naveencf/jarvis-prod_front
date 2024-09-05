import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../../../utils/config";
import ImageView from "../../../../ImageView";
import pdf from "../../../../pdf-file.png";

function SalesInvoiceEditAction(props) {
  const {
    editActionDialog,
    setEditActionDialog,
    outstandingRowData,
    getData,
    setViewImgDialog,
    viewImgSrc,
    setViewImgSrc,
    viewImgDialog,
  } = props;
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;
  const [imageInvoice, setImageInvoice] = useState("");
  const [invcNumber, setInvcNumber] = useState("");
  const [invcPartyName, setInvcPartyName] = useState("");
  const [invcDate, setInvcDate] = useState("");
  const [preview, setPreview] = useState("");
  const [isPDF, setIsPDF] = useState(false);

  const [isRequired, setIsRequired] = useState({
    imageInvoice: false,
    invcNumber: false,
  });
  const handleCloseEditAction = () => {
    setEditActionDialog(false);
  };

  const handleEditAction = async (row) => {
    if (imageInvoice == "") {
      setIsRequired((perv) => ({ ...perv, imageInvoice: true }));
    }
    if (!imageInvoice || imageInvoice == "") {
      toastError("Please Add Invoice Image");
      return;
    }
    // if (!invcNumber || isNaN(invcNumber)) {
    //   setIsRequired((prev) => ({ ...prev, invcNumber: true }));
    //   toastError("Please Enter a Valid Invoice Number");
    //   return;
    // }
    // As payload get changed we need to update data in the same way

    const confirmation = confirm("Are you sure you want to submit this data?");

    if (confirmation) {
      const formData = new FormData();
      formData.append("update_by", loginUserId);
      formData.append("invoice_type_id", outstandingRowData?.invoice_type_id);
      formData.append("sale_booking_id", outstandingRowData?.sale_booking_id);
      formData.append("invoice_file", imageInvoice);
      formData.append("invoice_number", invcNumber);
      formData.append("party_name", invcPartyName);
      formData.append(
        "invoice_uploaded_date",
        invcDate
          ? dayjs(invcDate).format("YYYY/MM/DD")
          : dayjs().format("YYYY/MM/DD")
      );

      await axios
        .put(
          baseUrl + `sales/invoice_request/${outstandingRowData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toastAlert("Data Submitted Successfully");
        })
        .catch((err) => {
          console.log(err, "submit invoice error-------");
        });
    }
    getData();
    handleCloseEditAction();
  };

  useEffect(() => {
    if (outstandingRowData) {
      setInvcNumber(outstandingRowData?.invoice_number || "");
      setInvcPartyName(outstandingRowData?.party_name || "");
      setInvcDate(
        outstandingRowData?.invoice_uploaded_date
          ? dayjs(outstandingRowData?.invoice_uploaded_date)
          : dayjs()
      );

      // Set preview image and determine if it's a PDF
      if (outstandingRowData?.invoice_file && outstandingRowData?.url) {
        const fullUrl = `${outstandingRowData?.url}/${outstandingRowData?.invoice_file}`;
        setPreview(fullUrl);
        setViewImgSrc(fullUrl);
        const isFilePDF = outstandingRowData?.invoice_file?.endsWith(".pdf");
        setIsPDF(isFilePDF);
      }
    }
  }, [outstandingRowData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageInvoice(file);
    setIsRequired((prev) => ({
      ...prev,
      imageInvoice: !file,
    }));
    const filePreview = URL?.createObjectURL(file);

    setPreview(filePreview);
    setViewImgSrc(filePreview);

    // Check if the uploaded file is a PDF
    const isFilePDF = file.type === "application/pdf";
    setIsPDF(isFilePDF);
  };

  return (
    <Dialog
      open={editActionDialog}
      onClose={handleCloseEditAction}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Update Invoice</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseEditAction}
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
            name="input"
            label="Invoice Number"
            value={invcNumber}
            onChange={(e) => {
              const value = e.target.value;
              // if (/^\d*$/.test(value)) {
              // Allow only numeric input
              setInvcNumber(value);
              //   setIsRequired((prev) => ({ ...prev, invcNumber: false }));
              // } else {
              //   setIsRequired((prev) => ({ ...prev, invcNumber: true }));
              // }
            }}
            error={isRequired.invcNumber}
            helperText={isRequired.invcNumber ? "Please add a number" : ""}
          />
          <label className="form-label mt-2">Invoice Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD/MM/YYYY"
              defaultValue={dayjs()}
              onChange={(e) => {
                setInvcDate(e);
              }}
              value={dayjs(invcDate) || dayjs()}
            />
          </LocalizationProvider>
          <TextField
            type="text"
            name="input"
            label="Party Name"
            value={invcPartyName}
            className="mt-3"
            onChange={(e) => setInvcPartyName(e.target.value)}
          />
          <div className=" col-3">
            <label className="form-label mt-2">
              Invoice Image <sup style={{ color: "red" }}>*</sup>
            </label>
            <input
              type="file"
              name="upload_image"
              onChange={handleFileChange}
            />
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
                    onClick={() => setViewImgDialog(true)}
                  />
                ) : (
                  <img
                    src={pdf}
                    alt="PDF Preview"
                    style={{ maxWidth: "40px", cursor: "pointer" }}
                    onClick={() => setViewImgDialog(true)}
                  />
                )}
              </div>
            )}
          </div>
          <Button
            type="button"
            className="mt-3"
            variant="contained"
            onClick={handleEditAction}
          >
            Update Invoice
          </Button>
        </div>
        {viewImgDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setViewImgDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SalesInvoiceEditAction;
