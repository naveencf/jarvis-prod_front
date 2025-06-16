import { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../FieldContainer";

export default function WFHDSheetUpload({
  setUpload,
  department,
  selectedMonth,
  selectedYear,
}) {
  const [dialogopen, setDialogOpen] = useState(false);
  const [bulklead, setBulklead] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [alerttemp, setAlerttemp] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleClickOpen = (e) => {
    const file = e.target.files[0];
    setSheet(file);
    if (!file) {
      alert("Please select a file.");
      setUpload(false);
      return;
    }

    if (!file.name.endsWith(".xlsx")) {
      alert("Please upload a valid Excel file.");
      setUpload(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setBulklead(parsedData);
        checkfieldname(parsedData[0]);
      } catch (error) {
        setAlerttemp(true);
        setUpload(false);
        console.error("Error:", error);
      }
    };
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleAlertClose = () => {
    setAlerttemp(false);
  };

  const fieldname = [
    "S.No",
    "user_name",
    "user_id",
    "total_days",
    "absent_days",
    "salary",
    "bonus",
    "arrear_from_last_month",
    "salary_deduction",
  ];

  const checkfieldname = (data) => {
    for (let i = 1; i < fieldname.length; i++) {
      if (!data.hasOwnProperty(fieldname[i])) {
        // console.log("Missing Field:", fieldname[i]);
        setAlerttemp(true);
        return false;
      } else {
        setDialogOpen(true);
      }
    }
    return true;
  };

  const handlepageaddition = async (e) => {
    e.preventDefault();
    if (!sheet) {
      alert("No file selected!");
      return;
    }

    setLoading(true); // Start the loader
    const formData = new FormData();
    formData.append("excel", sheet);
    formData.append("dept", department);
    formData.append("month", selectedMonth);
    formData.append("year", selectedYear);

    try {
      const response = await axios.post(
        `${baseUrl}
        `,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // console.log("Response:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
      handleClose(); // Stop the loader
    }
  };

  const columns = [
    {
      field: "s_no",
      headerName: "S No",
      renderCell: (params) => bulklead.indexOf(params.row) + 1,
    },
    { field: "user_name", headerName: "User Name", width: 180, type: "text" },
    { field: "user_id", headerName: "Employee ID", type: "text" },
    { field: "salary", headerName: "Salary", type: "text" },
    { field: "total_days", headerName: "Total Days", type: "text" },
    { field: "absent_days", headerName: "Absent Days", type: "text" },
    { field: "bonus", headerName: "Bonus", type: "text" },
    {
      field: "arrear_from_last_month",
      headerName: "Arrear From Last Month",
      width: 200,
      type: "text",
    },
    { field: "salary_deduction", headerName: "Deduction", type: "text" },
  ];

  return (
    <>
      {/* <TextField
        className="ml12 form-control cmnInputFile"
        onChange={handleClickOpen}
        sx={{ width: 100 }}
        accept=".xlsx, .xls"
        variant="standard"
        type="file"
      /> */}
      <FieldContainer
        label="Upload Salary Sheet"
        type="file"
        onChange={handleClickOpen}
        accept=".xlsx, .xls"
      />

      <Dialog
        maxWidth="md"
        open={dialogopen}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
        <DataGrid
          rows={bulklead}
          columns={columns}
          getRowId={(row) => row.user_id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 25, 100]}
        />
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handlepageaddition}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} style={{ marginRight: 8 }} />{" "}
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="md"
        open={alerttemp}
        onClose={handleAlertClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Error</DialogTitle>
        <DialogContentText>
          Please check your uploaded sheet once before retry.
        </DialogContentText>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleAlertClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
