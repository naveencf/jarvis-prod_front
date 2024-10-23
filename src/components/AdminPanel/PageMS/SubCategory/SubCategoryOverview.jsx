import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import {
  useDeletePageSubCategoryMutation,
  useGetAllPageSubCategoryQuery,
} from "../../../Store/PageBaseURL";
import {
  setModalType,
  setOpenShowAddModal,
  setRowData,
} from "../../../Store/PageMaster";
import { useDispatch, useSelector } from "react-redux";
import PageAddMasterModal from "../PageAddMasterModal";
import { FaEdit } from "react-icons/fa";
import jwtDecode from "jwt-decode";
import FormContainer from "../../FormContainer";
import MergeSubCategory from "../InventoryDashboard/MergeSubCategory";
import Swal from "sweetalert2";
import moment from "moment/moment";
import { FormatName } from "../../../../utils/FormatName";
import {  useNavigate } from "react-router-dom";

const SubCategoryOverview = () => {
  const navigate = useNavigate()
  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const [deleteSubPageCategory, { data: deletedResponse, error: deleteError }] =
    useDeletePageSubCategoryMutation();

  const handleDelete = (subCategoryId) => {
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
        deleteSubPageCategory(subCategoryId)
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "The sub category has been deleted successfully.",
              icon: "success",
            });
          })
          .catch((error) => {
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

  const subCategoryGrid = [
    {
      key: "s.no",
      name: "S.No",
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 70,
    },
    {
      key: "page_sub_category",
      name: "Page Sub Category",
      width: 140,
      renderRowCell: (row) => (
        <div> {FormatName(row?.page_sub_category)} </div>
      )
    },
    {
      key: "description",
      name: "Description",
      width: 140,
    },
    {
      key: "state",
      name: "state",
      width: 140,
    },
    {
      key: "updatedAt",
      name: "Updated At",
      width: 140,
      renderRowCell: (row) => (
        <div>{moment(row?.updatedAt).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      key: "createdAt",
      name: "Created At",
      width: 140,
      renderRowCell: (row) => (
        <div>{moment(row?.createdAt).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      name: "Action",
      renderRowCell: (row) => (
        <div className="d-flex">
          {/* {decodedToken.role_id == 1 && ( */}
          <button
            title="Edit"
            className="icon-1"
            onClick={() => handlRowClick(row, "Sub Category Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <div className="icon-1 ms-2" onClick={() => handleDelete(row._id)}>
            <i className="bi bi-trash" />
          </div>
        </div>
      ),
    },
  ];

  const handleOpenPageModal = (type) => {
    dispatch(setOpenShowAddModal());
    dispatch(setModalType(type));
  };

  const handlRowClick = (row, Type) => {
    dispatch(setModalType(Type));
    dispatch(setOpenShowAddModal());
    dispatch(setRowData(row));
  };
  return (
    <div>
      <PageAddMasterModal />
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Sub Category"} link={true} />
        </div>
        <div className="action_btns">
          <MergeSubCategory />
          <button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() => handleOpenPageModal("Sub Category")}
          >
            Add Sub Category
          </button>
          {/* <button
            className="btn cmnbtn btn-primary btn_sm"
            onClick={() => navigate("/admin/pms-inventory-category-overview")}
          >
             Category
          </button> */}
        </div>
      </div>
      <View
        title={"Sub Category Grid"}
        data={subCategoryData}
        columns={subCategoryGrid}
        pagination
        tableName={""}
      />
    </div>
  );
};
export default SubCategoryOverview;
