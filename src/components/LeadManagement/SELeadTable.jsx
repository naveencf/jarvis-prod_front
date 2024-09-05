import * as React from "react";
import Paper from "@mui/material/Paper";
import { useContext, useState, useRef, useCallback } from "react";
import { UserContext } from "../LeadManagement/LeadApp";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SEAssignLeadHeader from "./Tools/SEAssignLeadHeader";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Autocomplete, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useParams } from "react-router-dom";

function SELeadTable(props) {
  // preventDefault();
  const { id } = useParams();
  const { datalead, se } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const noButtonRef = useRef(null);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [transfer, setTransfer] = useState(true);
  let tranreqcount = 0;

  const executivename = [];
  let seassignLeads = [];
  se.map((ele) => {
    let temp = [ele.user_id, " - " + ele.user_name];
    executivename.push(temp);
  });
  // seassignLeads = datalead.filter((ele) => ele.assign_to == localseEmpID);
  for (let i = 0; i < datalead.length; i++) {
    if (datalead[i].assign_to == id) {
      seassignLeads.push(datalead[i]);
      if (datalead[i].state == "request") {
        tranreqcount++;
      }
    }
  }

  const handleCheckBox = () => {
    // console.log(rowSelectionModel);
  };

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

  function computeMutation(newInputValue, index, oldRow) {
    return newInputValue;
  }

  const mutateRow = useFakeMutation();
  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); 
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    setInputValue("");
    resolve(oldRow); 
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
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

  const renderConfirmDialog = () => {
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
            getOptionLabel={(option) => option[0] + option[1]}
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
        const rowIndex = seassignLeads.indexOf(params.row);
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
    <Paper sx={{ width: "100%" }}>
      <SEAssignLeadHeader
        executivename={executivename}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        transfer={transfer}
        setTransfer={setTransfer}
        tranreqcount={tranreqcount}
      />
      {renderConfirmDialog()}

      <DataGrid
        rows={seassignLeads}
        columns={columns}
        getRowId={(row) => row.leadmast_id}
        slots={{ toolbar: GridToolbar }}
        processRowUpdate={processRowUpdate}
        onRowClick={handleCheckBox}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        isRowSelectable={(params) => transfer || params.row.state === "request"}
      />
    </Paper>
  );
}
export default SELeadTable;
