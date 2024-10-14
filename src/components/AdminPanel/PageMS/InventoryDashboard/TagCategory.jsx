import React, { useState, useEffect } from "react";
import View from "../../Sales/Account/View/View"; // Adjust the import according to your path
import DeleteButton from "../../DeleteButton"; // Adjust the import according to your path
import { FaEdit } from "react-icons/fa";
import { useGetAllTagCategoryQuery } from "../../../Store/API/Inventory/TagCategoryAPI"; // Adjust the import according to your path
import TagCategoryModal from "./TagCategoryModal"; // Adjust the import according to your path

const TagCategory = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: TagCategory, isLoading } = useGetAllTagCategoryQuery();
  const [rowData, setRowData] = useState("");

  // Function to group data by page_name and aggregate page_category_name
  const groupByPageName = (data) => {
    const groupedData = {};
  
    data.forEach(item => {
      const key = Object.keys(item)[0]; // Get the page name (e.g., "kj" or "ddddd")
      const value = item[key]; // Get the array of items for this page name
  
      value.forEach((subItem) => {
        const pageName = subItem.page_name;
  
        // Initialize the page_name entry in the groupedData
        if (!groupedData[pageName]) {
          groupedData[pageName] = {
            page_name: pageName,
            created_by_name: subItem.created_by_name, // Assuming it's the same for all
            page_id: subItem.page_id, // Include the page_id here
            page_categories: []
          };
        }
  
        // Add the category to the array
        groupedData[pageName].page_categories.push(subItem.page_category_name);
      });
    });
  
    return Object.values(groupedData);
  };
  
  // Rest of your component code remains the same
  

  // Group the TagCategory data if available
  const groupedTagCategoryData = TagCategory ? groupByPageName(TagCategory) : [];
  console.log(TagCategory,'tag')

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
          data={groupedTagCategoryData} // Pass the grouped data
          isLoading={false}
          title={"Tag Category"}
          pagination={[100, 200, 1000]}
          tableName={"Tag Category"}
        />
      
    </div>
  );
};

export default TagCategory;
