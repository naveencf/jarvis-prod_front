import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from '../../../utils/config'
import FormContainer from "../FormContainer";

export const toolbarStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: "10px"
};
export default function CampaignCommitment() {
  const { toastAlert, toastError } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reload, setReload] = useState(false);
  const [postData, setPostData] = useState({
    exeCmpName: "",
    // exeHashTag: "",
    exeRemark: "",
  });
  const url = baseUrl + "exe_campaign";

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
    };
    return (
      <GridToolbarContainer style={toolbarStyles}>
        <button
          className="btn cmnbtb btn_sm btn-outline-primary"
          onClick={handleClick}
        >
          create campaign
        </button>
      </GridToolbarContainer>
    );
  }
  //post data =======>

  const handleChange = (event) => {
    const { name, value } = event.target;
    // console.log(name.exeCmpName, "exeCmpName");
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!postData.exeCmpName) {
      setErrorMessage("* Campaign Name required");
      return;
    } else {
      setErrorMessage(" ");
    }
    axios
      .post(url, postData)
      .then((response) => {
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Add successfully");
        }
        setReload(!reload);
        setPostData("");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError("Add Properly");
      });
    setIsModalOpen(false);
  };

  // get api ========>
  const getData = () => {
    axios.get(url).then((res) => {
      const newData = res.data.data;
      const sortedData = newData.sort((a, b) => b.exeCmpId - a.exeCmpId);
      setRows(sortedData);
    });
  };
  useEffect(() => {
    getData();
  }, [reload]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  // put api =============>
  const handlePutData = () => {
    if (!editData.exeCmpName) {
      toastError("Please fill required fields.");
      return;
    }
    axios
      .put(url, {
        exeCmpId: editData.exeCmpId,
        exeCmpName: editData.exeCmpName,
        // exeHashTag: editData.exeHashTag,
        exeRemark: editData.exeRemark,
      })
      .then((res) => {
        // console.log(res.data);
        setIsPutOpen(true);
        if (res.data.success === false) {
          toastError(res.data.message);
        } else {
          toastAlert("Update successfully");
        }
      })
      .then(() => {
        setIsPutOpen(false);
        setReload(!reload);
      });
    // console.log("put data");
  };
  const handleEditClick = (id, row) => () => {
    setEditData(row);
    // console.log(row);
    setIsPutOpen(true);
  };
  // delete ======>
  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(`${url}/${itemToDeleteId}`)
        .then(() => {
          // console.log("Data deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        })
        .finally(() => {
          setReload(!reload);
          setIsDeleteConfirmationOpen(false);
          setItemToDeleteId(null);
        });
    }
  };
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exeCmpName",
      headerName: "Campaign Name",
      width: 180,
      require: true,
      renderCell: (params) => {
        const name = params.value;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return <div>{capitalized}</div>;
      },
    },

    // {
    //   field: "exeHashTag",
    //   headerName: "Hash Tag",
    //   width: 180,
    // },
    {
      field: "exeRemark",
      headerName: "Remark",
      width: 180,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const { id, row } = params;
        return [
          // eslint-disable-next-line react/jsx-key
          <button
            icon={<EditIcon />}
            label="Edit"
            className="icon-1"
            onClick={handleEditClick(id, row)}
            color="primary"
          >
            <i className="bi bi-pencil"></i>
          </button>,
          // eslint-disable-next-line react/jsx-key
          <button
            icon={<DeleteIcon />}
            className="icon-1"
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          >
            <i className="bi bi-trash"></i>
          </button>,
        ];
      },
    },
  ];
  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.exeCmpName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  return (
    <div>
      <FormContainer
        mainTitle={"Campaign Commitment"}
        link={true}
        submitButton={false}
      />
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">  Campaign Overview</div>
          <TextField
            label="Search"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}

          />

        </div>
        <div className="card-body body-padding">




          <DataGrid
            rows={filteredRows}
            columns={columns}
            editMode="row"
            getRowId={(row) => row.exeCmpId}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />

        </div>
      </div>

      {/* AddRecordModal post data */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <div>
              <>
                <TextField
                  id="outlined-password-input"
                  label=" * Campaign Name"
                  name="exeCmpName"
                  type="text"
                  value={postData.exeCmpName}
                  onChange={handleChange}
                />
                {errorMessage && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                  </div>
                )}
              </>
              {/* 
              <TextField
                id="outlined-password-input"
                label="Hash Tag"
                name="exeHashTag"
                type="text"
                value={postData.exeHashTag}
                onChange={handleChange}
              /> */}
              <>
                <TextField
                  id="outlined-password-input"
                  label="Remark"
                  name="exeRemark"
                  type="text"
                  value={postData.exeRemark}
                  onChange={handleChange}
                />
              </>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* perform put data */}
      <Dialog open={isPutOpen} onClose={() => setIsPutOpen(false)}>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <div>
              <TextField
                id="outlined-password-input"
                label="* Campaign Name"
                name="exeCmpName"
                type="text"
                value={editData.exeCmpName}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    exeCmpName: e.target.value,
                  }))
                }
              />

              {/* <TextField
                id="outlined-password-input"
                label="Hash Tag"
                name="exeHashTag"
                type="text"
                value={editData.exeHashTag}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    exeHashTag: e.target.value,
                  }))
                }
              /> */}

              <TextField
                id="outlined-password-input"
                label="Reamrk"
                name="exeRemark"
                type="text"
                value={editData.exeRemark}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    exeRemark: e.target.value,
                  }))
                }
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPutOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePutData} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <>
        <Dialog
          open={isDeleteConfirmationOpen}
          onClose={() => setIsDeleteConfirmationOpen(false)}
        >
          <DialogTitle color="error">Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="d-flex sb w-100">

              <button
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="btn btn-outline-primary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-outline-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
}
