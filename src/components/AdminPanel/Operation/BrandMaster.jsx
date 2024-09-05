import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { useGlobalContext } from "../../../Context/Context";
import { toolbarStyles } from "./CampaignCommitment";
import { baseUrl } from "../../../utils/config";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { useNavigate } from "react-router-dom";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";

export default function BrandMaster() {
  const navigate = useNavigate();
  const [whatsappOptions, setWhatsappOptions] = useState([]);
  const [igusernameOptions, setIgusernameOptions] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [reload, setReload] = useState(false);
  const [SubCategoryString, setSubCategoryString] = useState();
  const [subcategoryOptions, setSubCategoryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [dataPlatforms, setDataPlatforms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPlatFrom, setIsModalPlatFrom] = useState(false);
  const [isPutOpen, setIsPutOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errBrandName, setErrBrandName] = useState();
  const [fields, setFields] = useState([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [userName, setUserName] = useState([]);

  const [postData, setPostData] = useState({
    brand_name: "",
    category_id: "",
    sub_category_id: "",
  });

  const platform = [
    { plt_id: 1, plat_name: "Instagram" },
    { plt_id: 2, plat_name: "Facebook" },
    { plt_id: 3, plat_name: "Whatsapp" },
    { plt_id: 4, plat_name: "Youtube" },
    { plt_id: 5, plat_name: "x" },
  ];

  const brandURL = baseUrl + "";
  const handleClose = () => {
    setIsModalOpen(false);
  };

  function EditToolbar() {
    const handleClick = () => {
      setIsModalOpen(true);
      getDataPlatform();
    };
    return (
      <GridToolbarContainer style={toolbarStyles}>
        <button
          className="btn cmnbtn btn-outline-primary btn_sm"
          onClick={handleClick}
        >
          Create Brand
        </button>

        <button
          className="btn cmnbtn btn-outline-primary btn_sm"
          onClick={() => navigate("/admin/categorymaster")}
        >
          Create Category
        </button>
        <button
          className="btn cmnbtn btn-outline-primary btn_sm"
          onClick={() => navigate("/admin/subcategory")}
        >
          Create Subcategory
        </button>
        <button
          className="btn cmnbtn btn-outline-primary btn_sm"
          onClick={() => navigate("/case-platform")}
        >
          Platfrom
        </button>
      </GridToolbarContainer>
    );
  }
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "brand_name") {
      if (!value === "") {
        setErrBrandName("Brand should not be blank.");
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        setErrBrandName("Brand should be characters.");
      } else {
        setErrBrandName(" ");
      }
    }
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const platformsData = selectedPages.reduce((acc, platform, index) => {
      const key = platform.plat_name;
      const value = userName[index] || "";
      acc[key] = value;
      return acc;
    }, {});
    const updatedPostData = {
      ...postData,
      platform: platformsData,
    };
    if (
      !postData.brand_name ||
      !postData.category_id ||
      !postData.sub_category_id
      // !postData.major_category
    ) {
      toastError(" * Please fill in all required fields ");
    } else {
      axios
        .post(`${brandURL}/add_brand`, updatedPostData)
        .then((response) => {
          response.data.message
            ? toastError(response.data.message)
            : toastAlert("Add Successfully");
          setPostData("");
          setReload(!reload);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          toastError("Error adding data. Please try again later.");
        });
      setIsModalOpen(false);
    }
  };

  // get api ------
  const getData = () => {
    axios.get(`${brandURL}/get_brands`).then((res) => {
      const newData = res.data.data;
      const sortedData = newData.sort((a, b) => b.brand_id - a.brand_id);
      setRows(sortedData);
    });
  };

  const categoryData = () => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      setCategoryOptions(res.data.data);
    });
  };
  useEffect(() => {
    getData();
    categoryData();
  }, [reload]);

  const subCategoryDataOnEdit = () => {
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      // console.log(res.data.data, "-------> subcat data");
      const filteredData = res.data.data.filter((item) => {
        return item.category_id == postData.category_id;
      });
      // console.log(filteredData, "filteredData meeee");

      setSubCategoryOptions(filteredData);
      setLoading(false);
    });
  };

  useEffect(() => {
    subCategoryDataOnEdit();
  }, [postData.category_id, postData]);
  // put api ------
  const handlePutData = () => {
    if (
      !editData.brand_name ||
      !editData.category_id ||
      !editData.sub_category_id
    ) {
      toastError("Please fill required fields.");
      return;
    }

    axios
      .put(`${brandURL}/edit_brand`, {
        brand_id: editData.brand_id,
        brand_name: editData.brand_name,
        category_id: editData.category_id,
        sub_category_id: editData.sub_category_id,
      })
      .then((res) => {
        if (res.data.success === false) {
          toastError(res.data.message);
        } else {
          toastAlert("Update successfully");
        }
        setIsPutOpen(true);
      })
      .then(() => {
        setIsPutOpen(false);
        setReload(!reload);
      });
  };

  useEffect(() => {
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      // console.log(res.data.data, "-------> subcat data");
      const filteredData = res.data.data.filter((item) => {
        return item.category_id == editData.category_id;
      });
      // console.log(filteredData, "filteredData meeee");
      setSubCategoryOptions(filteredData);
      setLoading(false);
    });
  }, [editData.category_id]);

  const handlePlatformData = (params) => {
    console.log("");
  };

  useEffect(() => {
    axios.get(`${baseUrl}/get_all_platforms`).then((response) => {
      const options = response.data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      setWhatsappOptions(options);
    });

    axios.get(`${baseUrl}/get_all_platforms`).then((response) => {
      const options = response.data.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      setIgusernameOptions(options);
    });
  }, []);

  const handleEditClick = (id, row) => () => {
    setLoading(true);
    setEditData(row);
    setIsPutOpen(true);
    setPostData(row);
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
        .delete(`${brandURL}/delete_brand/${itemToDeleteId}`)
        .then(() => {
          getData();
        })
        .finally(() => {
          setIsDeleteConfirmationOpen(false);
          setItemToDeleteId(null);
        });
    }
  };
  const handleCancle = () => {
    setIsPutOpen(false);
    setReload(!reload);
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
      field: "brand_name",
      headerName: "Brand",
      width: 180,
      renderCell: (params) => {
        const brand_name = params.row.brand_name;
        const BrandName =
          brand_name.charAt(0).toUpperCase() + brand_name.slice(1);
        return BrandName;
      },
    },
    {
      field: "category_name",
      headerName: "Category",
      width: 180,
    },
    {
      field: "sub_category_name",
      headerName: "SubCategory",
      width: 180,
    },
    {
      field: "platform",
      headerName: "Platfrom",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="icon-1"
              onClick={() => handlePlatformData(params)}
              variant="text"
            >
              <i className="bi bi-chat-left-text"></i>
            </button>
          </div>
        );
      },
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
          <button
            className="icon-1"
            label="Edit"
            onClick={handleEditClick(id, row)}
            color="primary"
          >
            <i className=" bi bi-pencil"></i>
          </button>,
          <button
            className="icon-1"
            label="Delete"
            onClick={handleDeleteClick(id)}
          >
            <i className="bi bi-trash"></i>
          </button>,
        ];
      },
    },
  ];

  // add filter
  const filterRows = () => {
    const filtered = rows.filter((row) =>
      row.brand_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, rows]);

  const getDataPlatform = async () => {
    try {
      const response = await axios.get(`${baseUrl}get_all_data_platforms`);
      setDataPlatforms(response?.data);
    } catch (error) { }
  };

  return (
    <>
      <FormContainer mainTitle="Brand Master" link="true" />

      <div className="card">
        <div className="card-header sb">
          <div className="card-tittle">Overview</div>
          <div className="w-25">
            <FieldContainer
              fieldGrid={12}
              label=""
              placeholder="Search Here"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body body-padding fx-head thm_table">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            editMode="row"
            onRowEditStop={handleRowEditStop}
            getRowId={(row) => row.brand_id}
            slots={{
              toolbar: EditToolbar,
            }}
          />
        </div>
      </div>
      {/* AddRecordModal post data */}
      <Dialog open={isModalOpen} onClose={handleClose}>
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
                  label="  * Brand"
                  name="brand_name"
                  type="text"
                  value={postData.brand_name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
                <span style={{ color: "red" }}>{errBrandName}</span>
              </>

              <>
                <Autocomplete
                  disablePortal
                  options={categoryOptions.map((option) => ({
                    label: option.category_name,
                    value: option.category_id,
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="  * Category" />
                  )}
                  onChange={(event, newValue) => {
                    setPostData({
                      ...postData,
                      category_id: newValue.value,
                    });
                  }}
                />
              </>
              <>
                <Autocomplete
                  disablePortal
                  options={subcategoryOptions.map((item) => ({
                    label: item.sub_category_name,
                    value: item.sub_category_id,
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="  * Subcategory" />
                  )}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setPostData({
                        ...postData,
                        sub_category_id: newValue.value,
                      });
                      setSubCategoryString(newValue.label);
                    }
                  }}
                />
              </>

              <Autocomplete
                id="combo-box-demo"
                multiple
                options={platform}
                getOptionLabel={(option) => option.plat_name}
                value={selectedPages}
                onChange={(event, newValue) => {
                  setSelectedPages(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="  * Platform" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.plt_id === value.plt_id
                }
              />

              {/* {selectedPages?.map((page, index) => (
                <Box key={index} sx={{ display: "flex", mb: 1 }}>
                  <TextField
                    label="Page Name"
                    value={page.plat_name}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="User name"
                    value={userName[index]}
                    fullWidth
                    onChange={(e) =>
                      handlePlatfromChange(index, e.target.value)
                    }
                    sx={{ m: 2 }}
                  />
                </Box>
              ))} */}

              <div></div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            {!loading && (
              <div>
                <TextField
                  label="Brand *"
                  name="brand_name"
                  type="text"
                  sx={{ width: "100%" }}
                  value={editData.brand_name}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      brand_name: e.target.value,
                    }))
                  }
                />

                <Autocomplete
                  disablePortal
                  options={categoryOptions.map((item) => ({
                    label: item.category_name,
                    value: item.category_id,
                  }))}
                  value={
                    categoryOptions.find(
                      (option) => option.category_id == editData.category_id
                    )?.category_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label=" Category *" />
                  )}
                  onChange={(event, newValue) => {
                    setEditData((prev) => ({
                      ...prev,
                      category_id: newValue ? newValue.value : "",
                    }));
                  }}
                />
                <Autocomplete
                  disablePortal
                  options={subcategoryOptions?.map((item) => ({
                    label: item.sub_category_name,
                    value: item.sub_category_id,
                  }))}
                  value={
                    subcategoryOptions?.find((option) => {
                      return (
                        option?.sub_category_id == editData?.sub_category_id
                      );
                    })?.sub_category_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category *" />
                  )}
                  onChange={(event, newValue) => {
                    setEditData((prev) => ({
                      ...prev,
                      sub_category_id: newValue ? newValue.value : "",
                    }));
                  }}
                />
              </div>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancle} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePutData} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure ...?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="sb w-100">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => setIsDeleteConfirmationOpen(false)}
              color="primary"
              variant="outlined"
            >
              Cancel
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleConfirmDelete}
              color="error"
              variant="outlined"
              Cancel
            >
              Delete
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
