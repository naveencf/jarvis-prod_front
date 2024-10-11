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
import { useAddTagCategoryMutation } from "../../../Store/API/Inventory/TagCategoryAPI";

export default function TagCategoryModal({
  open,
  onClose,
  rowData,
}) {
  const { data: category, refetch: refetchPageCate } =
    useGetAllPageCategoryQuery();
  const [updateTagCategory, { isLoading, isError }] = useAddTagCategoryMutation();
  const categoryData = category?.data || [];
  const { userContextData, userID } = useAPIGlobalContext();
  const [pageName, setPageName] = useState("");
  const [pageCategories, setPageCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        page_name: pageName,
        page_category_id: pageCategories,
        created_by: userID,
      };
        await updateTagCategory(payload).unwrap();
    
    } catch (error) {}
  };

  console.log(rowData, "rowrow-----------------");
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
            className=""
            isMulti
            options={categoryData.map((option) => ({
              value: option.page_category_id,
              label: `${option.page_category}`,
            }))}
            value={pageCategories.map((category) => ({
              value: category,
              label:
                categoryData.find((item) => item.page_category_id === category)
                  ?.page_category || "",
            }))}
            onChange={(selectedOptions) => {
              // Extracting values from the selected options
              setPageCategories(selectedOptions.map((option) => option.value));
            }}
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
