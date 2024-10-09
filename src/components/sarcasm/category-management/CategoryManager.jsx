import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { constant } from '../../../utils/constants';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState({ name: '', _id: null });
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch(constant.CONST_SARCASM_BLOG_CATEGORY);
      const json = await response.json();
      console.log("json", json);
      if (json.success) {
        setCategories(json.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCategory = async () => {
    if (newCategory) {
      try {
        const response = await fetch(constant.CONST_SARCASM_BLOG_CATEGORY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory }),
        });
        const json = await response.json();
        if (json.success) {
          setCategories([
            ...categories,
            { name: newCategory, _id: Date.now() },
          ]);
          setNewCategory('');
          Swal.fire('Success', 'Category added successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to add category.', 'error');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        Swal.fire(
          'Error',
          'An error occurred while adding the category.',
          'error'
        );
      }
    }
  };

  const updateCategory = async () => {
    if (editCategory._id && editCategory.name) {
      try {
        const response = await fetch(
          `${constant.CONST_SARCASM_BLOG_CATEGORY}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editCategory.name,
              id: editCategory._id,
            }),
          }
        );
        const json = await response.json();
        if (json.success) {
          const updatedCategories = categories.map((category) =>
            category._id === editCategory._id
              ? { ...category, name: editCategory.name }
              : category
          );
          setCategories(updatedCategories);
          handleCloseModal();
          Swal.fire('Success', 'Category updated successfully!', 'success');
        } else {
          Swal.fire('Error', 'Failed to update category.', 'error');
        }
      } catch (error) {
        console.error('Error updating category:', error);
        Swal.fire(
          'Error',
          'An error occurred while updating the category.',
          'error'
        );
      }
    }
  };

  const handleOpenModal = (category) => {
    setEditCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditCategory({ name: '', _id: null });
  };
   useEffect(() => {
    fetchAllCategories();
  }, []);

  const columns = [
    { field: 'sno', headerName: 'S.No.', width: 80 },
    { field: 'name', headerName: 'Category Name', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = categories.map((category, index) => ({
    ...category,
    sno: index + 1,
  }));
  if (loading) {
    return (
      <div className='shimmer-wrapper-container'>
        <div className="shimmer-wrapper">
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-manager">
      <h2 className="category-title">Category Manager</h2>

      <div className="category-add">
        <TextField
          label="New Category"
          variant="outlined"
          value={newCategory}
          className="new-category-text-field"
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          className="add-category-btn"
          variant="contained"
          color="primary"
          onClick={addCategory}
        >
          Add Category
        </Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} />
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="modal-box"
          sx={{
            backgroundColor: 'white',
            padding: 2,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
            margin: 'auto',
            mt: '10%',
          }}
        >
          <h3>Edit Category</h3>
          <TextField
            label="Category Name"
            variant="outlined"
            value={editCategory.name}
            onChange={(e) =>
              setEditCategory({ ...editCategory, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={updateCategory}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryManager;
