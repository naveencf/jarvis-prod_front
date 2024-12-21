import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import { useGetAllPageCategoryQuery, useGetAllPageSubCategoryQuery } from '../../Store/PageBaseURL';
import Select from 'react-select';
import { useAPIGlobalContext } from '../APIContext/APIContext';
import { useGlobalContext } from '../../../Context/Context';
import { useGetAllCatAssignmentQuery } from '../../Store/API/Inventory/CatAssignment';

export default function PageAssignmentUpdate({ open, onClose, row }) {
  const [categorys, setCategory] = useState('');
  const { data: authData, refetch: getData } = useGetAllCatAssignmentQuery();
  const [subCategorys, setSubCategory] = useState([]);
  const { data: category, refetch: refetchPageCate } = useGetAllPageCategoryQuery();
  const { data: subcategory, refetch: refetchSubCat } = useGetAllPageSubCategoryQuery();
  const categoryData = category?.data || [];
  const subCatData = subcategory?.data || [];
  const [userName, setUserName] = useState('');
  const { userContextData, userID } = useAPIGlobalContext();
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem('token');
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

 

  const handleSubmit = () => {
    const selectedSubCategoryIds = subCategorys.map((sub) => sub.value);

    axios
      .post(baseUrl + `v1/edit_page_cat_assignment`, {
        user_id: userName,
        page_sub_category_id: selectedSubCategoryIds,
        updated_by: userID,
      })
      .then(() => {
        setUserName('');
        setSubCategory([]);
        onClose();
        getData();
        toastAlert('Data updated successfully!');
      });
  };

  useEffect(() => {
    if (categorys) {
      axios
        .get(baseUrl + `v1/get_all_sub_cat_with_cat_id/${categorys}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          const subCatList = res.data.map((subCat) => ({
            value: subCat.page_sub_category_id,
            label: subCat.page_sub_category_name,
          }));
          setSelectedSubCategories(res.data);
        })
        .catch((error) => {
          console.error('Error fetching sub-categories:', error);
        });
    }
  }, [categorys, token]);

  useEffect(() => {
    if (row) {
      setUserName(row?.user_id);

      // Map the `page_categories` and `page_sub_category_ids` to the format required for react-select
      const formattedCategories = row.page_categories.map((category, index) => ({
        value: row.page_sub_category_ids[index], // Match IDs with categories
        label: category, // Use the category name as the label
      }));

      // Set the subcategories directly as the default value
      setSubCategory(formattedCategories);
    }
  }, [row]);

  console.log('subb', subCategorys);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="md"
      PaperProps={{
        style: {
          height: '550px',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>{'Update Page Cat Assignment To User'}</DialogTitle>
      <DialogContent>
        <div className="form-group col-12">
          <label className="form-label">User Name</label>
          <Select
            className=""
            options={userContextData.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: userName,
              label: userContextData.find((user) => user.user_id === userName)?.user_name || '',
            }}
            onChange={(e) => {
              setUserName(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">Category</label>
          <Select
            options={categoryData.map((option) => ({
              value: option._id,
              label: `${option.page_category}`,
            }))}
            value={{
              value: categorys,
              label: categoryData.find((user) => user._id === categorys)?.page_category || '',
            }}
            onChange={(e) => {
              setCategory(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">Sub Category</label>
          <Select
            options={selectedSubCategories.map((option) => ({
              value: option.page_sub_category_id,
              label: `${option.page_sub_category_name}`,
            }))}
            value={subCategorys}
            onChange={(selectedOptions) => {
              setSubCategory(selectedOptions);
            }}
            isMulti
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
