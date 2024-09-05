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
import { toolbarStyles } from "./CampaignCommitment";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";

export default function CategoryMaster() {
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
  const [postData, setPostData] = useState({
    category_name: "",
    // brand_id: "",
  });

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
    };
    return (
      <GridToolbarContainer style={toolbarStyles}>
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={handleClick}
        >
          create category{" "}
        </button>
      </GridToolbarContainer>
    );
  }
  //post data =======>

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "projectxCategory", postData)
      .then((response) => {
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Add successfully");
        }
        setIsModalOpen(false);
        getData();
        // console.log("Data saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError("Add Properly");
      });
    setIsModalOpen(false);
    setPostData("");
  };

  // get api ========>
  const getData = () => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      // console.log(res.data.data);
      const sortedData = res.data.data.sort(
        (a, b) => b.category_id - a.category_id
      );
      setRows(sortedData);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  // put api =============>
  const handlePutData = () => {
    axios
      .put(`${baseUrl}` + `projectxCategory`, {
        id: editData.category_id,
        category_name: editData.category_name,
        // brand_id: editData.brand_id,
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
        getData();
        setReload(!reload);
      });
    // console.log("put data");
  };
  const handleEditClick = (id, row) => () => {
    // console.log(row);
    setEditData(row);
    setIsPutOpen(true);
  };

  // delete ======>
  // const handleDeleteClick = (id) => () => {
  //   axios.delete(`${baseUrl}`+`projectxCategory/${id}`).then((res) => {
  //     getData();
  //     console.log("re data ", res.data);
  //   });
  // };

  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(`${baseUrl}` + `projectxCategory/${itemToDeleteId}`)
        .then(() => {
          getData();
          // console.log("Data deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        })
        .finally(() => {
          setIsDeleteConfirmationOpen(false);
          setItemToDeleteId(null);
        });
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
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
      field: "category_name",
      headerName: "Category Name",
      width: 180,
      require: true,
      renderCell: (params) => {
        const name = params.value;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return <div>{capitalized}</div>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const { id, row } = params;
        return [
          // eslint-disable-next-line react/jsx-key
          <button
            label="Edit"
            className="icon-1"
            onClick={handleEditClick(id, row)}
            color="primary"
          >
            <i className="bi bi-pencil"></i>
          </button>,
          // eslint-disable-next-line react/jsx-key
          <button
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
      row.category_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  return (
    <>
      <FormContainer mainTitle="Category Master" link="true" />
      <div className="card">
        <div className="card-header sb">
          <div></div>
          <div className="pack w-25">
            <FieldContainer
              fieldGrid={12}
              label=""
              placeholder="Search Here"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body body-padding ">
          <Box sx={{ height: "600px" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              editMode="row"
              getRowId={(row) => row.category_id}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: EditToolbar,
              }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
            />
          </Box>
        </div>
      </div>

      {/* AddRecordModal post data */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-password-input"
                label="Category"
                name="category_name"
                type="text"
                value={postData.category_name}
                onChange={handleChange}
              />
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
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-password-input"
                label="Category Name"
                name="category_name"
                type="text"
                value={editData.category_name}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    category_name: e.target.value,
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

      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure ...?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteConfirmationOpen(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="outlined"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
