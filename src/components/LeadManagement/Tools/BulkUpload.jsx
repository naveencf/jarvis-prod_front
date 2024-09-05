import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogTitle from "@mui/material/DialogTitle";
import { useRef } from "react";
import { Paper, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import AlertDialog from "./AlertDialog";
import axios from "axios";
import {baseUrl} from '../../../utils/config'

export default function BulkUpload({ setUpload }) {
  const { datalead } = useContext(UserContext);
  console.log(datalead);
  const [open, setOpen] = useState(false);
  const [bulklead, setBulklead] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [alert, setAlert] = useState(false);
  const [alerttemp, setAlerttemp] = useState(false);
  let tj = 2;

  const handleClickOpen = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setBulklead(parsedData);
      //   console.log(parsedData);
      checkfieldname(parsedData[0]);
      console.log(parsedData[0]);
      // console.log(parsedData[0]);
    };
  };
  const fieldname = [
    "lead_name",
    "mobile_no",
    "alternate_mobile_no",
    // "city",
    // "country",
    // "dept",
    "email",
    // "assign_to",
    // "addr",
    // "leadsource",
    // "leadtype",
    // "loc",
    // "remark",
    // "state",
    // "status",
    // "Created_by",
    // "Creation_date",
    // "Last_updated_by",
    // "Last_updated_date",
  ];
  const checkfieldname = (data) => {
    for (let i = 0; i < fieldname.length; i++) {
      if (!data.hasOwnProperty(fieldname[i])) {
        console.log(fieldname[i]);
        setAlerttemp(true);
        setAlert(true);
        console.log("worng");
        return false;
      }
      setOpen(true);
    }
    return true;
  };
  const handleClose = () => {
    setOpen(false);
    setUpload(false);
  };

  const CheckDuplicacy = () => {
    console.log(bulklead);
    const set = new Set();
    for (let i = 0; i < datalead.length; i++) {
      if (!set.has(datalead[i])) {
        set.add(bulklead[i]);
      }
    }
    const duplicateEntry = [];
    const uniqueData = [];
    for (let i = 0; i < bulklead.length; i++) {
      try {
        axios.post(baseUrl+"leadmastpost", {
          lead_name: bulklead[i].lead_name,
          mobile_no: bulklead[i].mobile_no,
          alternate_mobile_no: bulklead[i].alternate_mobile_no,
          //   leadsource: bulklead[i].leadsource,
          // assign_to: bulklead[i].assign_to,
          // loc: 0,
          email: bulklead[i].email,
          Last_updated_by: 1,
        });
        // console.log("post api  completed ");
        // window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
    handleClose();
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const columns = [
    {
      field: "s_no",
      headerName: "S No",
      width: 90,
    },
    {
      field: "lead_name",
      headerName: "First name",
      width: 150,
      type: "text",
      editable: true,
    },
    {
      field: "mobile_no",
      headerName: "Contact Detail",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "alternate_mobile_no",
      headerName: "Alternate Number",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
      width: 150,
      editable: true,
    },

    {
      field: "assign_to",
      headerName: "Assign to",
      type: "text",
      width: 110,
      editable: true,
    },
  ];

  return (
    <>
      <TextField
        // id="standard-basic"
        onChange={handleClickOpen}
        sx={{ width: 105 }}
        accept=".xlsx, .xls"
        variant="standard"
        size="small"
        type="file"
      />

      <Dialog
        // fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
        <DataGrid
          rows={bulklead}
          columns={columns}
          getRowId={(row) => row.s_no}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 25, 100]}
        />

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={CheckDuplicacy}>{!alerttemp && "Upload"}</Button>
        </DialogActions>
      </Dialog>
      <AlertDialog open={alert} setOpen={setAlert} tj={tj} />
    </>
  );
}
