import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
  Autocomplete,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useAssignInternalCategoryManagersMutation,
  useCreateCommunityInternalCatMutation,
  useDeleteCommunityInternalCatByIdMutation,
  useGetAllCommunityInternalCatsQuery,
  useUnassignInternalCategoryManagersMutation,
  useUpdateCommunityInternalCatByIdMutation,
} from "../../Store/API/Community/CommunityInternalCatApi";
import formatString from "../../../utils/formatString";
import { useGetPaginatedUsersQuery } from "../../Store/API/Community/CommunityNewApi";
import { debounce } from "../../../utils/helper";
import View from "../../AdminPanel/Sales/Account/View/View";
import ManagerModal from "./ManagerModal";
import { useGlobalContext } from "../../../Context/Context";

const CommunityInternalCategory = () => {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState([]);

  const { data: fetchedCategories = [], isLoading , refetch: reFetchedCategory} =
    useGetAllCommunityInternalCatsQuery();
  const [createCat] = useCreateCommunityInternalCatMutation();
  const [updateCat] = useUpdateCommunityInternalCatByIdMutation();
  const [deleteCat] = useDeleteCommunityInternalCatByIdMutation();
  const [assignManagers] = useAssignInternalCategoryManagersMutation();
  const [unassignManagers] = useUnassignInternalCategoryManagersMutation();
  const { toastAlert, toastError } = useGlobalContext();
  const { data: users, isLoadingUsers } = useGetPaginatedUsersQuery({
    page: page,
    limit: limit,
    search: search,
    deptId: "62",
  });
  const { data: allUser, isLoading: isLoadingAllUsers } =
    useGetPaginatedUsersQuery();
  // const allUsers = allUser && allUser?.paginatedUsers;
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    editMode: false,
    id: null,
  });

  useEffect(() => {
    setCategories(fetchedCategories);
  }, [fetchedCategories]);

  const debouncedSearch = useMemo(
    () => debounce((value) => setSearch(value), 400),
    []
  );

  const handleShowManagers = (category) => {
    const allUsersList = allUser?.paginatedUsers || [];
    const managerIds = category.managers.map((m) => m.userId);
    const matchedManagers = allUsersList.filter((user) =>
      managerIds.includes(user.user_id)
    );
    setSelectedManagers(matchedManagers);
    setShowManagerModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (formState.editMode) {
        const res = await updateCat({
          body: {
            _id: formState.id,
            internal_category_name: formState.name,
            description: formState.description,
          },
        });
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === formState.id
              ? {
                  ...cat,
                  internal_category_name: formState.name,
                  description: formState.description,
                }
              : cat
          )
        );
      } else {
        const res = await createCat({
          internal_category_name: formState.name,
          description: formState.description,
        });
        setCategories((prev) => [...prev, res.data.data]);
      }

      setFormState({ name: "", description: "", editMode: false, id: null });
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
  };

  const handleEdit = (cat) => {
    setFormState({
      name: cat.internal_category_name,
      description: cat.description,
      editMode: true,
      id: cat._id,
    });
  };
  const handleAssignManagers = async () => {
    if (!selectedRow[0]?._id || selectedUsers.length === 0) return;
    if(selectedRow.length> 1){
      toastError("Please select one category at a time")
      return
    }
    
    const payload = {
      _id: selectedRow[0]._id,
      managersToAdd: selectedUsers.map((user) => ({ userId: user.user_id })),
    };

    try {
      await assignManagers(payload);
      reFetchedCategory()
      Swal.fire("Success", "Managers Assigned", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to assign managers", "error");
    }
  };

  const handleUnassignManagers = async () => {
    if (!selectedRow[0]?._id || selectedUsers.length === 0) return;
    if(selectedRow.length> 1){
      toastError("Please select one category at a time")
      return
    }
    const payload = {
      _id: selectedRow[0]._id,
      userIdsToRemove: selectedUsers.map((user) => user.user_id),
    };

    try {
      await unassignManagers(payload);
      reFetchedCategory()
      Swal.fire("Success", "Managers Unassigned", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to unassign managers", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCat(id).unwrap();

        if (response.success) {
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
          Swal.fire("Deleted!", "The category has been deleted.", "success");
        } else {
          const pageNames = (response?.data || [])
            .map((p) => p.page_name)
            .join(", ");
          Swal.fire({
            icon: "error",
            title: "Cannot Delete Category",
            html: `${response.message}<br><br><strong>Used by:</strong><br>${pageNames}`,
          });
        }
      } catch (err) {
        console.error("Deletion failed:", err.data.message);
        Swal.fire("Error", err.data.message, "error");
      }
    }
  };
  const columns = [
    {
      name: "Category",
      key: "internal_category_name",
      renderRowCell: (row) => formatString(row.internal_category_name),
    },
    {
      name: "Description",
      key: "description",
    },

    {
      name: "Actions",
      key: "actions",
      renderRowCell: (row) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row._id)}>
            <Delete />
          </IconButton>
          <Button size="small" onClick={() => handleShowManagers(row)}>
            Show Managers
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h6" mb={2}>
        Community Internal Categories
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          flexWrap="wrap"
        >
          <TextField
            label="Category Name"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Description"
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            sx={{ minWidth: 300 }}
          />
          <Button
            variant="contained"
            color={formState.editMode ? "warning" : "primary"}
            onClick={handleSubmit}
          >
            {formState.editMode ? "Update" : "Create"}
          </Button>
        </Stack>
      </Paper>
      <div>
        <ManagerModal
          open={showManagerModal}
          onClose={() => setShowManagerModal(false)}
          managers={selectedManagers}
        />
      </div>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <View
          data={categories}
          rowSelectable={true}
          columns={columns}
          tableName="Internal Categories"
          isLoading={isLoading}
          pagination={[10, 20, 50]}
          selectedData={setSelectedRow}
          addHtml={
            <Box mb={2} display="flex" gap={2}>
              <Autocomplete
                multiple
                fullWidth
                loading={isLoadingUsers}
                options={users?.paginatedUsers || []}
                getOptionLabel={(option) => option.user_name || ""}
                value={selectedUsers}
                onChange={(event, newValue) => {
                  setSelectedUsers(newValue);
                }}
                sx={{ width: "25rem" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Users"
                    variant="outlined"
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                )}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleAssignManagers}
              >
                Assign Managers
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleUnassignManagers}
              >
                Unassign Managers
              </Button>
            </Box>
          }
        />

        // <Stack spacing={2}>
        //   {categories.map((cat) => (
        //     <Paper
        //       key={cat._id}
        //       sx={{
        //         p: 2,
        //         display: "flex",
        //         justifyContent: "space-between",
        //         alignItems: "center",
        //       }}
        //     >
        //       <Box>
        //         <Typography variant="subtitle1" fontWeight="bold">
        //           {formatString(cat.internal_category_name)}
        //         </Typography>
        //         <Typography variant="body2" color="text.secondary">
        //           {cat.description}
        //         </Typography>
        //       </Box>
        //       <Autocomplete
        //         fullWidth
        //         loading={isLoadingUsers}
        //         options={users?.paginatedUsers || []}
        //         getOptionLabel={(option) => option.user_name || ""}
        //         value={selectedUser}
        //         onChange={(event, newValue) => {
        //           setSelectedUser(newValue);
        //         }}
        //         renderInput={(params) => (
        //           <TextField
        //             {...params}
        //             label="Select User"
        //             variant="outlined"
        //             onChange={(e) => debouncedSearch(e.target.value)}
        //           />
        //         )}
        //       />

        //       <Box>
        //         <IconButton color="primary" onClick={() => handleEdit(cat)}>
        //           <Edit />
        //         </IconButton>
        //         <IconButton color="error" onClick={() => handleDelete(cat._id)}>
        //           <Delete />
        //         </IconButton>
        //       </Box>
        //     </Paper>
        //   ))}
        // </Stack>
      )}
    </Box>
  );
};

export default CommunityInternalCategory;
