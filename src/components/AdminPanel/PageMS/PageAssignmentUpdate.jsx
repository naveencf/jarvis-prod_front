import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageSubCategoryQuery,
} from "../../Store/PageBaseURL";
import Select from "react-select";
import { useAPIGlobalContext } from "../APIContext/APIContext";

export default function PageAssignmentUpdate({ open, onClose, row }) {
  const [categorys, setCategory] = useState("");
  const [subCategorys, setSubCategory] = useState("");
  const { data: category, refetch: refetchPageCate } =
    useGetAllPageCategoryQuery();
  const { data: subcategory, refetch: refetchSubCat } =
    useGetAllPageSubCategoryQuery();
  const categoryData = category?.data || [];
  const subCatData = subcategory?.data || [];
  const [userName, setUserName] = useState("");
  const { userContextData,userID } = useAPIGlobalContext();

  
  const handleSubmit = () => {
    axios
      .put(baseUrl + `v1/edit_page_cat_assignment/${row._id}`, {
        user_id:userName,
        page_sub_category_id: subCategorys,
        updated_by:userID
      })
      .then(() => {
          setUserName(" ")
        onClose(); // Close the modal after successful submit
      });
  };

  useEffect(() => {
    if (row) {
      setSubCategory(row.page_sub_category_id || "");
      setUserName(row?.user_id || "")
    }
  }, [row]);
console.log(row ,'rowrow')
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>{"Update Page Cat Assignment To User"}</DialogTitle>
      <DialogContent>
        <div className="form-group col-12">
          <label className="form-label">
            User Name 
          </label>
          <Select
            className=""
            options={userContextData.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: categorys,
              label:
                userContextData.find((user) => user.user_id === userName)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setUserName(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">
            Category 
          </label>
          <Select
            className=""
            options={categoryData.map((option) => ({
              value: option.page_category_id,
              label: `${option.page_category}`,
            }))}
            value={{
              value: categorys,
              label:
                categoryData.find((user) => user.page_category_id === categorys)
                  ?.page_category || "",
            }}
            onChange={(e) => {
              setCategory(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">
            Sub Category 
          </label>
          <Select
            className=""
            options={subCatData.map((option) => ({
              value: option.page_sub_category_id,
              label: `${option.page_sub_category}`,
            }))}
            value={{
              value: subCategorys,
              label:
                subCatData.find(
                  (user) => user.page_sub_category_id === subCategorys
                )?.page_sub_category || "",
            }}
            onChange={(e) => {
              setSubCategory(e.value);
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
