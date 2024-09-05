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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  DialogContentText,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toolbarStyles } from "./CampaignCommitment";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";

export default function SubCategoryMaster() {
  const { toastAlert, toastError } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [category, setCategory] = useState([]);
  // add search
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [postData, setPostData] = useState({
    sub_category_name: "",
    category_id: "",
  });
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
    };
    return (
      <GridToolbarContainer style={toolbarStyles}>
        <button
          className="btn btn_sm cmnbtn btn-outline-primary"
          onClick={handleClick}
        >
          create SubCategory
        </button>
      </GridToolbarContainer>
    );
  }

  // post data =========>

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
      .post(baseUrl + "projectxSubCategory", postData)
      .then((response) => {
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Add successfully");
        }
        postData.sub_category_name = "";
        console.log("Data saved:", response.data);
        setIsModalOpen(false);
        getData();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError("Add Properly");
      });
    setIsModalOpen(false);
  };

  console.log(postData, "postData");

  // get api ------
  const getData = () => {
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      const sortedData = res.data.data.sort(
        (a, b) => b.sub_category_id - a.sub_category_id
      );
      setRows(sortedData);
    });
  };
  useEffect(() => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      console.log(res.data.data);
      setCategory(res.data.data);
    });
    getData();
  }, []);

  // put api ------
  const handlePutData = () => {
    axios
      .put(`${baseUrl}` + `projectxSubCategory`, {
        sub_category_id: editData.sub_category_id,
        sub_category_name: editData.sub_category_name,
        category_id: editData.category_id,
      })
      .then((res) => {
        console.log(res.data);
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
    console.log("put data");
  };

  const handleEditClick = (id, row) => () => {
    setEditData(row);
    console.log(row);
    setIsPutOpen(true);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id) => () => {
    setItemToDeleteId(id);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDeleteId) {
      axios
        .delete(`${baseUrl}` + `projectxSubCategory/${itemToDeleteId}`)
        .then(() => {
          getData();
          console.log("Data deleted successfully");
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
      field: "sub_category_name",
      headerName: "Sub Category ",
      width: 180,
      require: true,
      renderCell: (params) => {
        const name = params.value;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return <div>{capitalized}</div>;
      },
    },
    {
      field: "category_id",
      headerName: " Category ",
      width: 180,
      renderCell: (params) => {
        return category.filter((e) => {
          return e.category_id == params.row.category_id;
        })[0]?.category_name;
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
            color="secondary"
          >
            <i className=" bi bi-pencil"></i>
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

  // filter data
  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.sub_category_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  return (
    <div>
      <FormContainer
        mainTitle={"Sub Category Master"}
        submitButton={false}
        link={"/admin-panel"}
      />
      <div className="card">
        <div className="card-header">
          <div></div>
          <div className="pack">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body body-padding" style={{ height: "600px" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            getRowId={(row) => row.sub_category_id}
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
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={category?.map((option) => ({
                  label: option.category_name,
                  value: option.category_id,
                }))}
                onChange={(event, value) => {
                  setPostData((prev) => ({
                    ...prev,
                    category_id: value ? value.value : "",
                  }));
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Category *" />
                )}
              />

              <TextField
                id="outlined-password-input"
                label="Sub Category *"
                name="sub_category_name"
                type="text"
                value={postData.sub_category_name}
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

      {/* AddRecordModal put data */}
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
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={
                  category.filter((e) => {
                    return e.category_id == editData.category_id;
                  })[0]?.category_name
                }
                options={category.map((option) => ({
                  label: option.category_name,
                  value: option.category_id,
                }))}
                onChange={(event, value) => {
                  setEditData((prev) => ({
                    ...prev,
                    category_id: value ? value.value : "",
                  }));
                }}
                // sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Movie" />
                )}
              />

              <TextField
                id="outlined-password-input"
                label="sub Category"
                name="sub_category_name"
                type="text"
                value={editData?.sub_category_name}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    sub_category_name: e.target.value,
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
    </div>
  );
}
