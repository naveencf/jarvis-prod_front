import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import {
  useDeletePageCategoryMutation,
  useGetAllPageCategoryQuery,
} from "../../../Store/PageBaseURL";
import { IconButton, Stack } from "@mui/material";
import {
  setModalType,
  setOpenShowAddModal,
} from "../../../Store/PageMaster";
import { useDispatch } from "react-redux";
import PageAddMasterModal from "../PageAddMasterModal";
import MergeCategory from "./MergeCategory";
import { Link } from "react-router-dom";
import FormContainer from "../../FormContainer";
import Swal from "sweetalert2"; // Import SweetAlert2

const CategoryOverview = () => {
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const dispatch = useDispatch();
  const [deletePageCategory, { data: deletedResponse, error: deleteError }] =
    useDeletePageCategoryMutation();

  // Handle the delete confirmation and process
  const handleDelete = (categoryId) => {
    // Show confirmation alert before deletion
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Trigger the delete mutation
        deletePageCategory(categoryId)
          .unwrap() // Unwraps the response to handle promise
          .then(() => {
            // Show success alert if the delete was successful
            Swal.fire({
              title: "Deleted!",
              text: "The category has been deleted successfully.",
              icon: "success",
            });
          })
          .catch((error) => {
            // Show error alert if the delete failed
            Swal.fire({
              title: "Error!",
              text:
                error?.data?.message || "Something went wrong. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };

  // Columns configuration for the data grid
  const categoryGrid = [
    {
      key: "s.no",
      name: "S.No",
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 70,
    },
    {
      key: "page_category",
      name: "Page Category",
      width: 150,
    },
    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row">
          <div className="icon-1" onClick={() => handleDelete(row._id)}>
            <i className="bi bi-trash" />
          </div>
        </div>
      ),
      width: 100,
    },
  ];

  // Modal opener for adding new categories
  const handleOpenPageModal = (type) => {
    console.log(type);
    dispatch(setOpenShowAddModal());
    dispatch(setModalType(type));
  };

  return (
    <div>
      <PageAddMasterModal />
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Category"} link={true} />
        </div>
        <div className="action_btns">
          <MergeCategory />
          <button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() => handleOpenPageModal("Category")}
          >
            Add Category
          </button>
        </div>
      </div>
      <View
        title={"Sales Booking Status Grid"}
        data={categoryData}
        columns={categoryGrid}
        pagination
        tableName={""}
      />
    </div>
  );
};

export default CategoryOverview;
