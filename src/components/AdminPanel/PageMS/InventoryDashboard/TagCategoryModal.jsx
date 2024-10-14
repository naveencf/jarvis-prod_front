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
import { useUpdateTagCategoryMutation } from "../../../Store/API/Inventory/TagCategoryAPI";

export default function TagCategoryModal({ open, onClose, rowData }) {
  const { data: category, refetch: refetchPageCate } =
    useGetAllPageCategoryQuery();
  const [updateTagCategory, { isLoading, isError }] =
  useUpdateTagCategoryMutation();
  const categoryData = category?.data || [];
  const { userContextData, userID } = useAPIGlobalContext();
  const [pageName, setPageName] = useState("");
  const [pageCategories, setPageCategories] = useState([]);
  const [pagID , setPageID]  = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        page_name: pageName,
        page_category_id: pageCategories.map((cat) => cat.value), // Extract only the category IDs for submission
        created_by: userID,
        page_id:pagID
      };
      console.log(payload,"hello");
      
      await updateTagCategory(payload).unwrap();
      onClose()
      refetchPageCate()
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  console.log(rowData,'-----rowdata')
  useEffect(() => {
    if (rowData) {
      // Set the page name from rowData
      setPageName(rowData.page_name);
      setPageID(rowData.page_id)
      // Map rowData.page_categories (names) to categoryData (filter by name)
      const tagFilter = categoryData.filter((category) =>
        rowData.page_categories.includes(category.page_category) // Match by category name
      );

      // Map to { value, label } format for react-select
      const formattedCategories = tagFilter.map((category) => ({
        value: category._id,
        label: category.page_category,
      }));

      // Set the selected categories in pageCategories state
      setPageCategories(formattedCategories);
    }
  }, [rowData, categoryData]); // Re-run when rowData or categoryData changes

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
