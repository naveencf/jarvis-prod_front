import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useCreateCommunityInternalCatMutation,
  useDeleteCommunityInternalCatByIdMutation,
  useGetAllCommunityInternalCatsQuery,
  useUpdateCommunityInternalCatByIdMutation,
} from "../../Store/API/Community/CommunityInternalCatApi";

const CommunityInternalCategory = () => {
  const { data: fetchedCategories = [], isLoading } = useGetAllCommunityInternalCatsQuery();
  const [createCat] = useCreateCommunityInternalCatMutation();
  const [updateCat] = useUpdateCommunityInternalCatByIdMutation();
  const [deleteCat] = useDeleteCommunityInternalCatByIdMutation();

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
              ? { ...cat, internal_category_name: formState.name, description: formState.description }
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
          const pageNames = (response?.data || []).map(p => p.page_name).join(", ");
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

  return (
    <Box p={4}>
      <Typography variant="h6" mb={2}>Community Internal Categories</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} flexWrap="wrap">
          <TextField
            label="Category Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Description"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
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

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Stack spacing={2}>
          {categories.map((cat) => (
            <Paper key={cat._id} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">{cat.internal_category_name}</Typography>
                <Typography variant="body2" color="text.secondary">{cat.description}</Typography>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => handleEdit(cat)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(cat._id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommunityInternalCategory;
