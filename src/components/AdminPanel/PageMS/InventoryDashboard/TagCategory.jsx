import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import DeleteButton from "../../DeleteButton";
import { FaEdit } from "react-icons/fa";
import { useGetAllTagCategoryQuery } from "../../../Store/API/Inventory/TagCategoryAPI";
import TagCategoryModal from "./TagCategoryModal";

const TagCategory = () => {
    const [openModal, setOpenModal] = useState(false);
  const [createFlag, setCreateFlag] = useState(null);
  const { data: TagCategory, isLoading } = useGetAllTagCategoryQuery();
  const [rowData , setRowData] = useState("")
  const dataGridColumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    
    {
      key: "page_name",
      name: "Page Name",
      width: 200,
    },
    {
      key: "page_category_name",
      name: "Page Category Name",
      width: 200,
    },
    {
      key: "created_by_name",
      name: "Created By Name",
      width: 200,
    },
    {
      key: "Action",
      name: "Action",
      width: 300,
      renderRowCell: (row) => (
        <div className="d-flex">
          <button
            onClick={() => handleOpenModal(row)}
            title="Edit"
            className="icon-1"
          >
            <FaEdit />{" "}
          </button>
        </div>
      ),
    },
  ];

  const handleOpenModal = (rowData) => {
    setOpenModal(true); 
    setRowData(rowData)
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false); 
  };
  return (
    <div>
      <TagCategoryModal
        open={openModal}
        onClose={handleCloseModal}
        rowData={rowData}

      />
      <View
        columns={dataGridColumns}
        data={TagCategory}
        isLoading={false}
        title={"Tag Category"}
        pagination={[100, 200, 1000]}
        tableName={"Tag Category"}
      />
    </div>
  );
};

export default TagCategory;
