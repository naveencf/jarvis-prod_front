import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { saveAs } from "file-saver";
import { baseUrl } from "../../../../../utils/config";

const BulkPayThroughVendorDialog = (props) => {
  const {
    bulkPayThroughVendor,
    setBulkPayThroughVendor,
    rowSelectionModel,
    filterData,
  } = props;

  const handleCloseBulkPayThroughVendor = () => {
    setBulkPayThroughVendor(false);
  };

  const handleDownloadAndUploadCSV = async () => {
    const selectedRows = filterData?.filter((row) =>
      rowSelectionModel?.includes(row.request_id)
    );

    const csvContent = generateCSV(selectedRows);
    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Download the CSV
    saveAs(csvBlob, "invoices.csv");

    // Upload the CSV to API
    await uploadCSVToAPI(csvBlob);
  };

  const generateCSV = (rows) => {
    const headers = [
      "clientReferenceId",
      "payeeName",
      "accountNumber",
      "branchCode",
      "vpa",
      "email",
      "phone",
      "amountCurrency",
      "amountValue",
      "mode",
      "dateTime",
      "remarks",
      "saveBeneficiary",
    ];

    const csvRows = rows?.map((row) => [
      row?.request_id || "",
      row?.vendor_name || "",
      row?.account_no || "",
      row?.ifsc || "",
      row?.vpa || "",
      row?.email || "",
      row?.mob1 || "",
      row?.amountCurrency || "",
      row?.payment_amount || "",
      row?.payment_mode || "",
      row?.request_date || "",
      row?.remark_audit || "",
      row?.saveBeneficiary || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows?.map((row) => row?.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const uploadCSVToAPI = async (csvBlob) => {
    try {
      const getTokenResponse = await axios.get(
        baseUrl + `generate_plural_payment_jwt_token`
      );
      const token = getTokenResponse?.data?.data;

      const formData = new FormData();
      formData.append("file", csvBlob);

      const response = await axios.post(
        "https://api-staging.pluralonline.com/payouts/v2/payments/banks/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Upload successful:", response?.data);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    }
  };

  return (
    <div>
      <Dialog
        open={bulkPayThroughVendor}
        onClose={handleCloseBulkPayThroughVendor}
        fullWidth
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <DialogTitle>Bulk Pay Through Vendor</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseBulkPayThroughVendor}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleDownloadAndUploadCSV}
          >
            Bulk Pay Through Vendor
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkPayThroughVendorDialog;
