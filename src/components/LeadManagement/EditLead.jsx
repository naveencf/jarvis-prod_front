import { useCallback, useContext, useState } from "react";
import {
  DataGrid,
  GridRowModes,
  GridRowEditStopReasons,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserContext } from "../LeadManagement/LeadApp";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearIcon from "@mui/icons-material/Clear";
import { Paper, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { memo } from "react";
import BulkUpload from "./Tools/BulkUpload";
import DwndTemplate from "./Tools/DwndTemplate";
// import { columns } from "./Tools/EditColoum";
import {baseUrl} from '../../utils/config'

function EditLead() {
  // console.log("Edit lead reload");
  const { datalead, setDatalead, setUpdate, reload, setReload } =
    useContext(UserContext);
  const [rows, setRows] = useState(datalead);
  const [addrows, setAddRows] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [upload, setUpload] = useState(false);
  let isInEditMode = false;
  let idCounter = 100;

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;
    const createRandomRow = () => {
      idCounter += 1;
      return {
        leadmast_id: randomId(),
        lead_name: "abc",
        mobile_no: "123",
        alternate_mobile_no: "123",
        email: "",
        assign_to: 1,
        leadsource: "",
      };
    };
    const handleClick = () => {
      setAddRows(true);
      setDatalead((oldRows) => [createRandomRow(), ...oldRows]);
      return;
    };
    return (
      <Stack justifyContent="space-between" direction="row" sx={{ p: 1 }}>
        <Button
          color="primary"
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          Add records
        </Button>

        <Stack direction="row" sx={{}} spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setUpload(!upload);
            }}
          >
            Upload..
          </Button>
          {upload && <BulkUpload setUpload={setUpload} />}
          <DwndTemplate />
        </Stack>
      </Stack>
    );
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // console.log(promiseArguments);
  };
  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.leadmast_id !== id));
  };
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };
  const processRowUpdate = (newRow, id) => {
    const updatedRow = { ...newRow, isNew: false };
    // console.log(updatedRow);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    if (addrows) {
      setAddRows(false);
      // console.log("post api hitted");
      try {
        axios.post(baseUrl+"leadmastpost", {
          lead_name: updatedRow.lead_name,
          mobile_no: updatedRow.mobile_no,
          alternate_mobile_no: updatedRow.alternate_mobile_no,
          //   leadsource: updatedRow.leadsource,
          assign_to: updatedRow.assign_to,
          loc: 0,
          email: updatedRow.email,
          Last_updated_by: 1,
        });
        // console.log("post api  completed ");
        // window.location.reload();
      } catch (error) {
        console.log(error);
      }
      // setDatalead([]);
      setReload(!reload);
      return updatedRow;
    }
    try {
      axios.put(baseUrl+"leadmastupdate", {
        id: updatedRow.leadmast_id,
        lead_name: updatedRow.lead_name,
        mobile_no: updatedRow.mobile_no,
        alternate_mobile_no: updatedRow.alternate_mobile_no,
        leadsource: updatedRow.leadsource,
        assign_to: updatedRow.assign_to,
        leadtype: updatedRow.leadtype,
        dept: updatedRow.dept,
        status: updatedRow.status,
        loc: updatedRow.loc,
        email: updatedRow.email,
        addr: updatedRow.addr,
        city: updatedRow.city,
        state: updatedRow.state,
        country: updatedRow.country,
        remark: updatedRow.remark,
        Last_updated_by: 1,
      });
      // console.log(updatedRow.assign_to);
      // console.log("put Api hitted");
    } catch (error) {
      console.log(error);
    }
    setReload(!reload);
    return updatedRow;
  };
  const handleProcessRowUpdateError = useCallback((error) => {
    // console.log("handleProcessRowUpdateError");
    setSnackbar({ children: error.message, severity: "error" });
  }, []);
  const handleRowModesModelChange = (newRowModesModel) => {
    console.log(newRowModesModel);
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        // console.log(isInEditMode);
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<ClearIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<SaveAsIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            // color="primary"
          />,
        ];
      },
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

    {
      field: "leadsource",
      headerName: "Category",
      type: "text",
      width: 110,
      editable: true,
    },
    {
      field: "dept",
      headerName: "Department",
      type: "text",
      width: 110,
      editable: true,
    },

    {
      field: "city",
      headerName: "City",
      width: 90,
      editable: true,
    },
    {
      field: "addr",
      headerName: "Address",
      width: 90,
      editable: true,
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      editable: true,
    },
    {
      field: "loc",
      headerName: "Location",
      width: 150,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      // type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "remark",
      headerName: "Remark",
      width: 90,
      editable: true,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      editable: true,
    },
    {
      field: "leadtype",
      headerName: "Leadtype",
      width: 150,
      editable: true,
    },
    {
      field: "Created_by",
      headerName: "Upload by",
      width: 90,
      editable: true,
    },
    {
      field: "Creation_date",
      headerName: "Upload Date",
      width: 150,
      editable: true,
    },
    {
      field: "Last_updated_by",
      headerName: "Last Update by",
      width: 150,
      editable: true,
    },
    {
      field: "Last_updated_date",
      headerName: "Last Update Date",
      width: 90,
      editable: true,
    },
  ];

  return (
    <Paper
      sx={{
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={datalead}
        getRowId={(row) => row.leadmast_id}
        columns={columns}
        editMode="row"
        // touchRippleRef={touchrippleref}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
          // toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 30, 50, 100]}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
    </Paper>
  );
}
export default memo(EditLead);
