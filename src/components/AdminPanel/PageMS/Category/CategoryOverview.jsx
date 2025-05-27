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
  setRowData,
} from "../../../Store/PageMaster";
import { useDispatch } from "react-redux";
import PageAddMasterModal from "../PageAddMasterModal";
import MergeCategory from "./MergeCategory";
import { Link } from "react-router-dom";
import FormContainer from "../../FormContainer";
import Swal from "sweetalert2"; // Import SweetAlert2
import { FaEdit } from "react-icons/fa";
import { FormatName } from "../../../../utils/FormatName";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const CategoryOverview = () => {
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const { contextData } = useAPIGlobalContext();

  const showExport =
    contextData && contextData[72] && contextData[72].view_value === 1;

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
                error?.data?.message ||
                "Something went wrong. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };
  const handlRowClick = (row, Type) => {
    console.log("row", row);
    console.log("type", Type);
    dispatch(setModalType(Type));
    dispatch(setOpenShowAddModal());
    dispatch(setRowData(row));
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
      renderRowCell: (row) => <div> {FormatName(row?.page_category)} </div>,
    },
    {
      key: "createdAt",
      name: "Created At",
      renderRowCell: (row) => {
        let data = row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
      width: 150,
    },
    {
      key: "updatedAt",
      name: "Updated At",
      renderRowCell: (row) => {
        let data = row?.updatedAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
      width: 150,
    },

    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row">
          <button
            title="Edit"
            className="icon-1"
            onClick={() => handlRowClick(row, "Category Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
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
          <Link to="/admin/pms-page-sub-category">
            <button className="btn cmnbtn btn-primary btn_sm">
              Sub Category
            </button>
          </Link>
        </div>
      </div>
      <View
        title={""}
        data={categoryData}
        columns={categoryGrid}
        pagination
        tableName={""}
        showExport={showExport}
      />
    </div>
  );
};

export default CategoryOverview;
