import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useState } from "react";
import jwtDecode from "jwt-decode";

const EditButtonActionDialog = ({
  editActionDialog,
  handleCloseEditAction,
  outstandingRowData,
}) => {
  console.log("hii");
  const [invcNumber, setInvcNumber] = useState("");
  const [partyName, setPartyName] = useState("");
  const [invcDate, setInvcDate] = useState("");
  const [imageInvoice, setImageInvoice] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;

  const handleEditAction = async (row) => {
    if (!imageInvoice) {
      toastError("Please Add Invoice Image");
      return;
    }
    const confirmation = confirm("Are you sure you want to submit this data?");

    if (confirmation) {
      const formData = new FormData();
      formData.append("update_by", loginUserId);
      formData.append("invoice_type_id", outstandingRowData?.invoice_type_id);
      formData.append("sale_booking_id", outstandingRowData?.sale_booking_id);
      formData.append("invoice_file", imageInvoice);
      formData.append("invoice_number", invcNumber);
      formData.append("party_name", partyName);
      formData.append(
        "invoice_uploaded_date",
        new Date(invcDate).toISOString()?.split("T")[0]
      );

      await axios
        .put(baseUrl + `sales/invoice_request/${row._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toastAlert("Data Submitted Successfully");
        })
        .catch((err) => {
          console.log(err, "submit invoice error-------");
        });
    }
  };

  return (
    <div>
      {/* Edit Action Field */}
      <Dialog
        open={true}
        onClose={handleCloseEditAction}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Edit Fields</DialogTitle>
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
              label="Invoice No."
              onChange={(e) => setInvcNumber(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                className="mt-3"
                defaultValue={dayjs()}
                onChange={(e) => {
                  setInvcDate(e);
                }}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              name="input"
              label="Party Name"
              className="mt-3"
              onChange={(e) => setPartyName(e.target.value)}
            />

            <input
              type="file"
              name="upload_image"
              className="mt-3"
              onChange={(e) => setImageInvoice(e.target.files[0])}
            />

            <Button
              type="button"
              className="mt-3"
              variant="contained"
              onClick={handleEditAction}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditButtonActionDialog;
