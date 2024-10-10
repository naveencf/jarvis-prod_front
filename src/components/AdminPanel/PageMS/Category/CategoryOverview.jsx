import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import { useGetAllPageCategoryQuery } from "../../../Store/PageBaseURL";
import { IconButton, Stack } from "@mui/material";
import {
  setModalType,
  setOpenShowAddModal,
} from "../../../Store/PageMaster";
import { useDispatch, useSelector } from "react-redux";
import PageAddMasterModal from "../PageAddMasterModal";

const CategoryOverview = () => {
  const { data: category } = useGetAllPageCategoryQuery();
  const open = useSelector((state) => state.pageMaster.showAddModal)
  const modalType = useSelector((state) => state.pageMaster.modalType);
  console.log("open", open)
  console.log("modal-type", modalType)
  const categoryData = category?.data || [];
  const dispatch = useDispatch();


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
  ];

//   const handleOpenPageModal = (type) => {
//     // console.log(type , 'type is herer')
//     return () => {
//         dispatch(setOpenShowAddModal());
//         dispatch(setModalType(type));
//       };
//   };
const handleOpenPageModal = (type) => {
    console.log(type)
    dispatch(setOpenShowAddModal()); // Since setOpenShowAddModal does not take any arguments, we remove 'true'
    dispatch(setModalType(type)); // type is passed as payload correctly
  };
  


  return (
    <div>
        <PageAddMasterModal/>
      <IconButton
        onClick={() => handleOpenPageModal("Category")}
        variant="contained"
        color="primary"
        aria-label="Add Platform.."
      >
        Add Category
        {/* <AddIcon /> */}
      </IconButton>
      <View
        title={"Sales Booking Status Grid"}
        data={categoryData}
        columns={categoryGrid}
        // isLoading={isLoading}
        pagination
        tableName={"Sales Booking Status Grid on dashboard"}
      />
    </div>
  );
};

export default CategoryOverview;
