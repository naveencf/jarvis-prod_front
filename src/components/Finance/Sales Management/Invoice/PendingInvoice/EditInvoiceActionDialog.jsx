import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EditInvoiceActionDialog = (props) => {
  const {
    editActionDialog,
    setEditActionDialog,
    setInvcCreatedRowData,
    InvcCreatedRowData,
    setOpenImageDialog,
    setViewImgSrc,
  } = props;

  const [invcDate, setInvcDate] = useState(dayjs());
  const [invcNumber, setInvcNumber] = useState("");
  const [partyInvoiceName, setPartyInvoiceName] = useState("");
  const [imageInvoice, setImageInvoice] = useState([]);
  const [preview, setPreview] = useState("");
  const [isPDF, setIsPDF] = useState(false);

  const [isRequired, setIsRequired] = useState({
    imageInvoice: false,
    invcNumber: false,
  });

  const handleCloseEditFieldAction = () => {
    setEditActionDialog(false);

    setInvcNumber("");
    setInvcDate(dayjs());
    setPartyInvoiceName("");
    setImageInvoice(null);
    setPreview(null);
    setIsRequired({
      imageInvoice: false,
      invcNumber: false,
    });
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
    setImageInvoice(file);
    setIsRequired((prev) => ({
      ...prev,
      imageInvoice: !file,
    }));
    const filePreview = URL.createObjectURL(file);
    setPreview(filePreview);
    setViewImgSrc(filePreview);

    // Check if the uploaded file is a PDF
    const isFilePDF = file.type === "application/pdf";
    setIsPDF(isFilePDF);
  };

  const handleInvoiceEditFields = async (e) => {
    e.preventDefault();
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

      await axios
        .put(
          baseUrl + `sales/invoice_request/${InvcCreatedRowData?._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toastAlert("Data Submitted Successfully");
            getData();
            handleCloseEditFieldAction();
            handleGetProforma();
          }
        })
        .catch((err) => {
          console.log(err, "submit invoice error-------");
        });
    }
  };

  return (
    <div>
      <Dialog
        open={editActionDialog}
        onClose={handleCloseEditFieldAction}
        fullWidth={"md"}
        maxWidth={"md"}
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
              name="input"
              label="Invoice Number"
              value={invcNumber}
              onChange={(e) => {
                const value = e.target.value;
                setInvcNumber(value);
              }}
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
              value={partyInvoiceName}
              className="mt-3"
              onChange={(e) => setPartyInvoiceName(e.target.value)}
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
                      onClick={() => setOpenImageDialog(true)}
                    />
                  ) : (
                    <img
                      src={pdf}
                      alt="PDF Preview"
                      style={{ maxWidth: "40px", cursor: "pointer" }}
                      onClick={() => setOpenImageDialog(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              className="mt-3"
              variant="contained"
              onClick={(e) => handleInvoiceEditFields(e)}
            >
              Update Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditInvoiceActionDialog;
