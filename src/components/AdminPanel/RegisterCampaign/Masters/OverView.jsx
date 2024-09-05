import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";

let fieldInRows = [];
const OverView = ({ name, data, hardReload }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteParams, setDeleteParams] = useState({});
  const [updatePayload, setUpdatePayload] = useState({});
  const [currentRow, setCurrentRow] = useState({});

  const updateHandler = (params) => {
    setCurrentRow(params.row);
    setIsPutOpen(true);
    // window.location.reload(); // Full page reload
  };
  const deleteHandler = (params) => {
    setDeleteParams(params);
    setIsDeleteDialogOpen(true);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const confirmDelete = async () => {
    try {
      if (name == "Agency") {
        await axios.delete(`${baseUrl}` + `agency/${deleteParams.row._id}`);
      }
      if (name == "Goal") {
        await axios.delete(`${baseUrl}` + `goal/${deleteParams.row._id}`);
      }
      if (name == "Industry") {
        await axios.delete(`${baseUrl}` + `industry/${deleteParams.row._id}`);
      }
      if (name == "Service") {
        await axios.delete(`${baseUrl}` + `services/${deleteParams.row._id}`);
      }

      hardReload();
      toastAlert(`${name} Delete Successfully`);
      setIsDeleteDialogOpen(false);
    } catch (error) { }
  };
  const floodColumn = () => {
    fieldInRows = [];
    const x = data[0];
    let val = [];
    for (const key in x) {
      if (key == "_id" || key == "__v") continue;
      const y = {
        field: key,
        headerName: capitalizeFirstLetter(key),
        width: 180,
      };
      fieldInRows.push(key);
      val.push(y);
    }

    const update = {
      field: " action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => updateHandler(params)}
              variant="text"
              className="icon-1"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              onClick={() => deleteHandler(params)}
              className="icon-1"
            >
              <i className="bi bi-trash"></i>
            </button>
          </>
        );
      },
    };
    val.push(update);
    setColumns(val);
    const serialNumberColumn = {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    };

    val.unshift(serialNumberColumn);
    setColumns(val);
  };
  useEffect(() => {
    floodColumn();
  }, [data]);

  const handleUpdateChange = (e) => {
    setUpdatePayload({ ...updatePayload, [e.target.name]: e.target.value });
  };

  const handleUpdatePayload = async () => {
    try {
      if (name == "Agency") {
        const data = await axios.put(
          `${baseUrl}` + `agency/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "Goal") {
        const data = await axios.put(
          `${baseUrl}` + `goal/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "Industry") {
        const data = await axios.put(
          `${baseUrl}` + `industry/${currentRow._id}`,
          updatePayload
        );
      }
      if (name == "Service") {
        const data = await axios.put(
          `${baseUrl}` + `services/${currentRow._id}`,
          updatePayload
        );
      }
      fieldInRows = [];
      setUpdatePayload({});
      setIsPutOpen(false);
      // hardReload();
      toastAlert("Update Successfully");
    } catch (error) { }
  };
  return (
    <div>
      <FormContainer mainTitle={name} link="true" />

      <div className="card">
        <div className="card-header sb">
          <div className="card-tittle">
            <h5>{name} Overview</h5>
          </div>
          <div className="pack w-75">
            <button
              className="btn cmnbtn btn_sm btn-outline-primary btn-sm"
              onClick={() => navigate(`/admin/${name}`)}
            >
              Create {name}
            </button>
          </div>
        </div>
        <div className="card-body body-padding">
          <DataGrid rows={data} columns={columns} getRowId={(row) => row._id} />
        </div>
      </div>

      <Dialog open={isPutOpen} onClose={() => setIsPutOpen(false)}>
        <DialogTitle>Edit Record</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
          >
            <div>
              {fieldInRows.map((item, index) => {
                return (
                  <TextField
                    key={index}
                    label={item}
                    type="text"
                    name={item}
                    value={
                      updatePayload[item]?.length >= 0
                        ? updatePayload[item]
                        : currentRow[item]
                    }
                    onChange={handleUpdateChange}
                  />
                );
              })}
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <div className="d-flex sb w-100">

            <button
              onClick={() => {
                setUpdatePayload({});
                setIsPutOpen(false);
              }}
              className="btn btn-outline-primary btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePayload}
              className="btn btn-outline-success btn-sm"
            >
              Save
            </button>
          </div>
        </DialogActions>
      </Dialog>
      <>
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle color="secondary">Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this record
          </DialogContent>
          <DialogActions>
            <div className="d-flex sb w-100">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="btn btn-outline-primary btn-sm"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-outline-danger btn-sm">
                Delete
              </button>
            </div>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default OverView;
