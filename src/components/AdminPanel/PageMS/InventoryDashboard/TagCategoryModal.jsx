import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import Select from "react-select";
import { useGetAllPageCategoryQuery } from "../../../Store/PageBaseURL";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FieldContainer from "../../FieldContainer";
import { useGetAllTagCategoryQuery, useUpdateTagCategoryMutation } from "../../../Store/API/Inventory/TagCategoryAPI";
import { useGlobalContext } from "../../../../Context/Context";

export default function TagCategoryModal({ open, onClose, rowData }) {
  const { data: category, refetch: refetchPageCate } =
    useGetAllPageCategoryQuery();
  const [updateTagCategory, { isLoading, isError }] =
  useUpdateTagCategoryMutation();
  const { data: TagCategory, refetch:refechTag } = useGetAllTagCategoryQuery();
  const categoryData = category?.data || [];
  const { userContextData, userID } = useAPIGlobalContext();
  const {toastAlert} = useGlobalContext()
  const [pageName, setPageName] = useState("");
  const [pageCategories, setPageCategories] = useState([]);
  const [pagID , setPageID]  = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        page_name: pageName,
        page_category_id: pageCategories.map((cat) => cat.value),
        created_by: userID,
        page_id:pagID
      };
      
      await updateTagCategory(payload).unwrap();
      onClose()
      toastAlert("Data updated successfully!")
      refechTag()
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  useEffect(() => {
    if (rowData) {
      setPageName(rowData.page_name);
      setPageID(rowData.page_id)
      const tagFilter = categoryData.filter((category) =>
        rowData.page_categories.includes(category.page_category) 
      );

      const formattedCategories = tagFilter.map((category) => ({
        value: category._id,
        label: category.page_category,
      }));

      setPageCategories(formattedCategories);
    }
  }, [rowData, categoryData]); 

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>{"Update Page Cat Assignment To User"}</DialogTitle>
      <DialogContent>
        <FieldContainer
          label="Page Name"
          astric={true}
          fieldGrid={12}
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
        />
        <div className="form-group col-12">
          <label className="form-label">
            Tag Category <sup className="form-error">*</sup>
          </label>

          <Select
            isMulti
            options={categoryData.map((option) => ({
              value: option._id,
              label: option.page_category,
            }))}
            required={false}
            value={pageCategories} // Pre-selected categories
            onChange={(selectedOptions) => setPageCategories(selectedOptions)} // Handle selection
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
