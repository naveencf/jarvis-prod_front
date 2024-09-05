import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { DataGrid, GridToolbar, useGridApiContext } from "@mui/x-data-grid";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import LeadHeader from "./LeadHeader";
import { UserContext } from "../LeadManagement/LeadApp";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function LeadHome() {
  const { datalead, newdata, se } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const noButtonRef = useRef(null);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  const executivename = [];
  se.map((ele) => {
    executivename.push(ele.user_name);
  });
  // const datawithIndex = datalead.map((lead, index) => ({
  //   ...lead,
  //   rowIndex: index,
  // }));
  // console.log(datalead);
  const useFakeMutation = () => {
    return useCallback(
      (user) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (user.name?.trim() === "") {
              reject();
            } else {
              resolve(user);
            }
          }, 200);
        }),
      []
    );
  };

  function computeMutation(newInputValue, newRow, oldRow) {
    return newInputValue;
  }

  const mutateRow = useFakeMutation();
  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        // console.log("Hitted processRowUpdate");
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // console.log("mutation there");
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          // console.log("undefined mutation there");
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    setInputValue("");
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow);
      setSnackbar({
        children: "Lead successfully assign",
        severity: "success",
      });
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({
        children: "Some Error,please try again",
        severity: "error",
      });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  // const handleEntered = () => {};

  const renderConfirmDialog = () => {
    // console.log("render confirmation called");
    if (!promiseArguments) {
      return null;
    }
    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        // TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will assign lead to ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };
  const columns = [
    {
      field: "assign_to",
      headerName: "Sales Executive",
      width: 200,
      renderCell: (params) => (
        <>
          <Autocomplete
            disablePortal
            clearIcon={false}
            id="combo-box-demo"
            options={executivename}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              setPromiseArguments({ inputValue, newInputValue });
              processRowUpdate(newInputValue);
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <>
                <TextField {...params} label="select" />
              </>
            )}
          />
          {!!snackbar && (
            <Snackbar
              open
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </>
      ),
    },
    {
      field: "S.NO",
      headernewname: "ID",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = datalead.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "lead_name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
      width: 150,
      editable: false,
    },
    {
      field: "mobile_no",
      headerName: "Contact Detail",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "alternate_mobile_no",
      headerName: "Alt Number",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "leadsource",
      headerName: "Category",
      // type: "text",
      width: 110,
      editable: false,
    },
    {
      field: "leadtype",
      headerName: "Leadtype",
      type: "text",
      width: 110,
      editable: false,
    },
    {
      field: "dept",
      headerName: "Department",
      type: "text",
      width: 110,
      editable: false,
    },

    {
      field: "city",
      headerName: "City",
      width: 90,
      editable: false,
    },
    {
      field: "addr",
      headerName: "Address",
      width: 90,
      editable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      editable: false,
    },
    {
      field: "loc",
      headerName: "Location",
      width: 150,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      // type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 90,
      editable: false,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      editable: false,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 150,
    //   editable: false,
    // },
    {
      field: "Created_by",
      headerName: "Upload by",
      width: 90,
      editable: false,
    },
    {
      field: "Creation_date",
      headerName: "Upload Date",
      width: 150,
      editable: false,
    },
    {
      field: "Last_updated_by",
      headerName: "Last Update by",
      width: 150,
      editable: false,
    },
    {
      field: "Last_updated_date",
      headerName: "Last Update Date",
      width: 90,
      editable: false,
    },
  ];
  return (
    <Paper sx={{  width: "100%" }}>
      {renderConfirmDialog()}
      <DataGrid
        rows={datalead}
        columns={columns}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.leadmast_id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[5, 10, 30]}
      />
    </Paper>
  );
}
