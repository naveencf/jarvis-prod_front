import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setCloseShowAddModal,
  setCloseShowPageInfoModal,
} from "../../Store/PageMaster";
import { Box, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import {
  useAddPageCategoryMutation,
  useAddPageSubCategoryMutation,
  useGetAllPageCategoryQuery,
  useUpdatePageCategoryMutation,
  useUpdatePageSubCategoryMutation,
} from "../../Store/PageBaseURL";
import { useGlobalContext } from "../../../Context/Context";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import Select from "react-select";

export default function PageAddMasterModal() {
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showAddModal);
  const modalType = useSelector((state) => state.pageMaster.modalType);
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.pageMaster.rowData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [currentState, setCurrentState] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleClose = () => {
    dispatch(setCloseShowAddModal());
    setValue("name", "");
    setValue("description", "");
    // dispatch(setRowData({}));
    setSelectedCategory("");
    setCurrentState(null);
  };

  const [addCategory] = useAddPageCategoryMutation();
  const [addSubCategory] = useAddPageSubCategoryMutation();
  const [updateCategory] = useUpdatePageCategoryMutation();
  const [updateSubCategory] = useUpdatePageSubCategoryMutation();

  useEffect(() => {
    if (modalType === "Category") {
      setTitle("Add Category");
    } else if (modalType === "Sub Category") {
      setTitle("Add Sub Category");
    } else if (modalType === "Category Update") {
      setTitle("Update Category");
      setValue("name", rowData.page_category);
      setValue("description", rowData.description);
    } else if (modalType === "Sub Category Update") {
      setTitle("Update Sub Category");
      setValue("name", rowData.page_sub_category);
      setValue("description", rowData.description);
      setCurrentState(rowData.state);
    }
  }, [modalType, rowData, setValue]);

  const formSubmit = (data) => {
    // Check if category is required (for Sub Category or Sub Category Update) and is not selected
    console.log(data, 'data one two')
    if (
      (modalType === "Sub Category" || modalType === "Sub Category Update") &&
      !selectedCategory
    ) {
      toastError("Please select a category before submitting.");
      return; // Stop the form submission if no category is selected
    }

    const stateToSend =
      selectedCategory === 96 && currentState
        ? currentState
        : "";

    const obj = {
      description: data.description,
      created_by: userID,
      _id: rowData._id,
      // state: stateToSend,
      ...(modalType.includes("Sub Category") && { state: stateToSend }),
    };

    if (modalType === "Sub Category" || modalType === "Sub Category Update") {
      obj.page_sub_category = data.name; // Use `page_sub_category` for subcategories
    } else {
      obj.page_category = data.name;
      console.log(obj, 'dataname')
    }

    // API calls based on modalType
    if (modalType === "Category") {
      delete obj._id;
      addCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Added Successfully");
          handleClose();
        })
        .catch((err) => toastError(err.message));
    } else if (modalType === "Sub Category") {
      delete obj._id;
      addSubCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Sub Category Added Successfully");
          handleClose();
        })
        .catch((err) => toastError(err.message));
    } else if (modalType === "Category Update") {
      updateCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => toastError(err.message));
    } else if (modalType === "Sub Category Update") {
      updateSubCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Sub Category Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => toastError(err.message));
    }
  };


  const { data: categoryData } = useGetAllPageCategoryQuery();
  const categoryOptions = categoryData?.data || [];

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(formSubmit)}>
            {/* Category Field: Only show for adding/updating subcategories */}
            {(modalType === "Sub Category" || modalType === "Sub Category Update") && (
              <div className="form-group col-12">
                <label className="form-label">Category <sup style={{ color: "red" }}>*</sup></label>
                <Select
                  className=""
                  options={categoryOptions.map((option) => ({
                    value: option.page_category_id,
                    label: option.page_category,
                  }))}
                  value={{
                    value: selectedCategory,
                    label:
                      categoryOptions.find(
                        (cat) => cat.page_category_id === selectedCategory
                      )?.page_category || "",
                  }}
                  onChange={(e) => {
                    setSelectedCategory(e.value);
                  }}
                  required
                />
              </div>
            )}

            {/* Conditional State Input: Only show for adding/updating subcategories */}
            {(modalType === "Sub Category" || modalType === "Sub Category Update") &&
              selectedCategory === 96 && (
                <div className="form-group col-12 mt-3">
                  <label htmlFor="">State</label>
                  <IndianStatesMui
                    selectedState={currentState}
                    onChange={(option) => setCurrentState(option ? option : null)}
                  />
                </div>
              )}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name *"
              type="text"
              fullWidth
              {...register("name", { required: "Please Enter the Name" })}
              helperText={errors.name?.message}
              error={Boolean(errors.name)}
            />

            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
            />

            <DialogActions>
              <Button autoFocus type="submit">
                Submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
