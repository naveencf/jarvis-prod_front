import React, { useState, useEffect } from "react";
import View from "../../Sales/Account/View/View"; 
import DeleteButton from "../../DeleteButton"; 
import { FaEdit } from "react-icons/fa";
import { useGetAllTagCategoryQuery } from "../../../Store/API/Inventory/TagCategoryAPI"; 
import TagCategoryModal from "./TagCategoryModal";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const TagCategory = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: TagCategory, isLoading } = useGetAllTagCategoryQuery();
  const [rowData, setRowData] = useState("");
  const { contextData } = useAPIGlobalContext();

  const showExport =
    contextData && contextData[72] && contextData[72].view_value === 1;
  const groupByPageName = (data) => {
    const groupedData = {};
  
    data.forEach(item => {
      const key = Object.keys(item)[0]; 
      const value = item[key];
  
      value.forEach((subItem) => {
        const pageName = subItem.page_name;
  
        if (!groupedData[pageName]) {
          groupedData[pageName] = {
            page_name: pageName,
            created_by_name: subItem.created_by_name, 
            page_id: subItem.page_id,
            page_categories: []
          };
        }
        groupedData[pageName].page_categories.push(subItem.page_category_name);
      });
    });
  
    return Object.values(groupedData);
  };
  
  const groupedTagCategoryData = TagCategory ? groupByPageName(TagCategory) : [];

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
      name: "Page Category Names",
      width: 300,
      renderRowCell: (row) => row.page_categories.join(", "),
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
    setRowData(rowData);
  };

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
          data={groupedTagCategoryData}
          isLoading={false}
          title={"Tag Category"}
          pagination={[100, 200, 1000]}
          tableName={"Tag Category"}
          showExport={showExport}
        />
      
    </div>
  );
};

export default TagCategory;
