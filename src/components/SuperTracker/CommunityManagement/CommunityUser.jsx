import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormContainer from "../../AdminPanel/FormContainer";
import Modal from "react-modal";
import FieldContainer from "../../AdminPanel/FieldContainer";
import Select from "react-select";
import { ApiContextData } from "../../AdminPanel/APIContext/APIContext";

const CommunityUser = () => {
  const { userContextData } = useContext(ApiContextData);
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAssignCategory, setOpenAssignCategory] = useState(false);
  const [openAssignedCategory, setOpenAssignedCategory] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [assignedCategoryData, setAssignedCategoryData] = useState([]);
  const [catUpdate, setCatUpdate] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);

  const toggleUpdateCategory = () => {
    setShowUpdateCategory((prevState) => !prevState);
  };
  useEffect(() => {
    const initialCategories = category
      .filter((option) =>
        assignedCategoryData?.pageCategoryIds?.includes(option.category_id)
      )
      .map((option) => ({
        value: option.category_id,
        label: option.category_name,
      }));

    setSelectedCategories(initialCategories);
  }, [category, assignedCategoryData]);

  const handleChange = (selectedOptions) => {
    const updatedCategories =
      selectedOptions?.map((option) => option.value) || [];
    setSelectedCategories(selectedOptions);
    setCatUpdate(updatedCategories);
  };
  const getCategory = async () => {
    try {
      const res = await axios.get(
        "https://insights.ist:8080/api/projectxpagecategory"
      );
      setCategory(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  const Updatecategory = async () => {
    try {
      const res = await axios.get(
        "https://insights.ist:8080/api/v1/community/category_manager"
      );
      setAssignedCategoryData(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  const getManagerData = async () => {
    try {
      const res = await axios.get(
        "https://insights.ist:8080/api/v1/community/community_user"
      );
      const data = res.data.data;
      const counts = countPagesPerUser(data);
      const userMap = new Map();
      data.forEach((item) => {
        if (item.user_id) {
          if (!userMap.has(item.user_id)) {
            userMap.set(item.user_id, {
              ...item,
              page_count: counts[item.user_id].count,
              pages: counts[item.user_id].pages,
            });
          }
        }
      });
      const uniqueUserData = Array.from(userMap.values());
      setManagerData(uniqueUserData);
    } catch (error) {
      console.error("Error fetching manager data", error);
    }
  };

  const countPagesPerUser = (data) => {
    return data.reduce((acc, item) => {
      if (item.user_id) {
        if (!acc[item.user_id]) {
          acc[item.user_id] = { count: 0, pages: [] };
        }
        acc[item.user_id].count += 1;
        acc[item.user_id].pages.push(item);
      }
      return acc;
    }, {});
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleOpenAssignCategory = (row) => {
    setRowData(row);
    setOpenAssignCategory(true);
  };

  const handleCloseAssignCategory = () => setOpenAssignCategory(false);

  const handleOpenAssignedCategory = async (row) => {
    const res = await axios.get(
      `https://insights.ist:8080/api/v1/community/category_manager_by_user/${row.user_id}`
    );
    setAssignedCategoryData(res.data.data);
    setOpenAssignedCategory(true);
  };

  const handleCloseAssignedCategory = () => setOpenAssignedCategory(false);

  const handleAssignCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || selectedCategory.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    try {
      const response = await axios.post(
        "https://insights.ist:8080/api/v1/community/category_manager",
        {
          userId: rowData.user_id,
          pageCategoryIds: selectedCategory.map((item) => item.value),
        }
      );
      if (response.data.status === false) {
        alert("Failed to assign category. Please try again.");
      } else {
        handleCloseAssignCategory();
      }
    } catch (error) {
      console.error("Error assigning category", error);
      alert(
        "Category assignment failed. It may already be assigned, or an error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    getManagerData();
    getCategory();
    Updatecategory();
  }, []);

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      valueGetter: (params) => managerData.indexOf(params.row),
      renderCell: (params) => {
        const rowIndex = managerData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "User name",
      headerName: "User Name",
      width: 280,
      valueGetter: (params) =>
        userContextData?.find((user) => user.user_id === params.row.user_id)
          ?.user_name || "N/A",
      renderCell: (params) =>
        userContextData?.find((user) => user.user_id === params.row.user_id)
          ?.user_name || "N/A",
    },
    {
      field: "page_count",
      headerName: "Page Count",
      width: 200,
      renderCell: (params) => (
        <Button
          className="statusBadge"
          color="success"
          variant="outlined"
          onClick={() => handleOpenModal(params.row)}
        >
          {params.row.page_count}
        </Button>
      ),
    },
    {
      field: "Assign Category",
      headerName: "Assign Category",
      width: 300,
      renderCell: (params) => (
        <Button
          className="statusBadge"
          color="error"
          variant="outlined"
          onClick={() => handleOpenAssignCategory(params.row)}
        >
          Assign Category
        </Button>
      ),
    },
    {
      field: "Assigned Category",
      headerName: "Assigned Category",
      width: 300,
      renderCell: (params) => (
        <Button
          className="statusBadge"
          color="primary"
          variant="outlined"
          onClick={() => handleOpenAssignedCategory(params.row)}
        >
          Assigned Category
        </Button>
      ),
    },
  ];

  const handleUpdate = async (catId) => {
    try {
      const updatedCategoryIds = assignedCategoryData?.pageCategoryIds.filter(
        (item) => item !== catId
      );
      const updatedResponse = await axios.put(
        "https://insights.ist:8080/api/v1/community/category_manager",
        {
          pageCategoryIds: updatedCategoryIds,
          _id: assignedCategoryData._id,
        }
      );
      if (updatedResponse.status == 200) {
        setAssignedCategoryData(updatedResponse.data.data);
        alert("SuccessFully UnAssigned category");
      } else {
        alert(
          "There is some error while Updating your request.Please try again after some time"
        );
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleUpdateRowWiseCategory = async () => {
    try {
      const updatedResponse = await axios.put(
        "https://insights.ist:8080/api/v1/community/category_manager",
        {
          pageCategoryIds: catUpdate.map((item) => item),
          _id: assignedCategoryData._id,
        }
      );
      handleCloseAssignCategory();
      setCatUpdate([]);
      alert("SuccessFully Updated category");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <>
      <div className="action_heading">
        <div className="form-heading">
          <h2 className="mb0 mt-1">Community Users</h2>
        </div>
        <div className="action_btns">
          <Button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() => navigate("/admin/community/community-home")}
          >
            Pages
          </Button>
          <Button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() => navigate("/admin/community/user")}
          >
            Users
          </Button>
          <Button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() =>
              navigate("/admin/community/allAssignedcategory")
            }
          >
            View All Assigned Categories
          </Button>
        </div>
      </div>

      <div className="card mt16">
        <div className="card-body p0 border-0 table table-responsive">
          <div className="thmTable bg-transparent">
            <DataGrid
              rows={managerData}
              columns={columns}
              getRowId={(row) => row.user_id}
              slots={{
                toolbar: GridToolbar,
              }}
              sx={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Page Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <div className="d-flex m-2 gap-2">
                <h6>
                  User:{" "}
                  {userContextData?.find(
                    (user) => user.user_id === selectedUser.user_id
                  )?.user_name || "N/A"}
                </h6>
                <h6>Page Count: {selectedUser.page_count}</h6>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Page Name</th>
                    <th scope="col">Manager</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.pages.map((page, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{page.page_name}</td>
                      <td>
                        {
                          userContextData?.find(
                            (user) => user.user_id === page.report_to
                          )?.user_name
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="error" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Category Modal */}
      <Modal
        className="salesModal"
        isOpen={openAssignCategory}
        onRequestClose={handleCloseAssignCategory}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            maxWidth: "900px",
            minWidth: "500px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <Button
          variant="outlined"
          sx={{ float: "right" }}
          onClick={handleCloseAssignCategory}
          color="error"
        >
          {" "}
          X{" "}
        </Button>
        <FormContainer link={true} title={"Add Whatsapp Links"} />
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Category Assign</h1>
          </div>
          <div className="card-body">
            <div className="row">
              <FieldContainer
                label="UserName"
                type="text"
                fieldGrid={12}
                disabled
                value={
                  userContextData?.find(
                    (user) => user.user_id === rowData?.user_id
                  )?.user_name || "N/A"
                }
              />
              <div className="form-group col-12">
                <label className="form-label">Category</label>
                <Select
                  className=""
                  isMulti
                  options={category.map((option) => ({
                    value: option.category_id,
                    label: option.category_name,
                  }))}
                  onChange={setSelectedCategory}
                  required={false}
                />
              </div>
            </div>
          </div>
          <div className="w-100 sb">
            <div></div>
            <button
              className="btn btn-primary cmnbtn mb-2 mr-3"
              onClick={handleAssignCategory}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

      {/* Assigned Category Modal */}
      <Modal
        className="salesModal"
        isOpen={openAssignedCategory}
        onRequestClose={handleCloseAssignedCategory}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            maxWidth: "900px",
            minWidth: "500px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <Button
          variant="outlined"
          sx={{ float: "right" }}
          onClick={handleCloseAssignedCategory}
          color="error"
        >
          {" "}
          X{" "}
        </Button>
        <Button
          variant="outlined"
          sx={{ float: "right" }}
          onClick={toggleUpdateCategory}
          color="error"
        >
          {" "}
          Update Category{" "}
        </Button>

        <FormContainer link={true} title={"Add Whatsapp Links"} />
        {showUpdateCategory ? (
          <div className="update-category-section">
            <h6>Update Category</h6>
            <form>
              <div className="form-group col-12">
                <label className="form-label">Category</label>
                <Select
                  isMulti
                  value={selectedCategories}
                  options={category.map((option) => ({
                    value: option.category_id,
                    label: option.category_name,
                  }))}
                  onChange={handleChange}
                  required={false}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateRowWiseCategory}
              >
                Save
              </Button>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Assigned Category</h1>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">UnAssign</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedCategoryData?.pageCategoryIds?.length > 0
                    ? assignedCategoryData?.pageCategoryIds?.map(
                        (itemsData, index) => {
                          const categoryObj = category?.find(
                            (cat) => cat?.category_id === itemsData
                          );
                          return (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                {categoryObj
                                  ? categoryObj?.category_name
                                  : "Unknown Category"}
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary cmnbtn"
                                  onClick={() =>
                                    handleUpdate(categoryObj?.category_id)
                                  }
                                >
                                  UnAssigned
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )
                    : " Not Assigned Category"}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CommunityUser;
