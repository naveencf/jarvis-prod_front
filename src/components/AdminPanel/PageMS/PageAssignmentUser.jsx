import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import View from "../Sales/Account/View/View";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "../../../Context/Context";
import PageAssignmentUpdate from "./PageAssignmentUpdate";
import { useGetAllCatAssignmentQuery } from "../../Store/API/Inventory/CatAssignment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import formatString from "../../../utils/formatString";

const PageAssignmentUser = () => {
  const { toastAlert } = useGlobalContext();
  const { data: authData, isLoading } = useGetAllCatAssignmentQuery();
  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false); // State for category modal
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [categories, setCategories] = useState([]); // State to store categories

  const groupByPageName = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const userName = Object.keys(item)[0]; // Get the user's name
      const subCategoryArray = item[userName]; // Subcategories for that user

      if (!groupedData[userName]) {
        groupedData[userName] = {
          _id: subCategoryArray[0]._id,
          user_name: userName,
          user_id: subCategoryArray[0].user_id, // Extract user_id from the first subcategory
          page_categories: [],
          page_sub_category_ids: [], // New array for storing page_sub_category_ids
        };
      }

      subCategoryArray.forEach((subItem) => {
        groupedData[userName].page_categories.push(subItem.page_sub_category_name);
        groupedData[userName].page_sub_category_ids.push(subItem.page_sub_category_id); // Add page_sub_category_id
      });
    });

    return Object.values(groupedData);
  };

  // Grouping the API response data
  const groupedTagCategoryData = authData ? groupByPageName(authData) : [];

  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const handleOpenCategoryModal = (categories) => {
    setCategories(categories); // Set the selected categories
    setOpenCategoryModal(true); // Open the modal
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false); // Close the modal
    setCategories([]); // Clear the selected categories
  };

  // Defining columns for the table
  const dataGridColumns = [
    {
      key: "S.NO",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "user_name",
      name: "User Name",
      width: 200,
      renderRowCell: (row) => row.user_name,
    },
    {
      key: "page_categories",
      name: "Sub Categories",
      width: 300,
      renderRowCell: (row) => {
        return (
          <button
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={() => handleOpenCategoryModal(row.page_categories)}
          >
            {row.page_categories.length}
          </button>
        );
      },
    },
    {
      key: "Action",
      name: "Action",
      width: 150,
      renderRowCell: (row) => (
        <div className="d-flex">
          <button
            onClick={() => handleOpenModal(row)}
            title="Edit"
            className="icon-1"
          >
            <FaEdit />
          </button>
          <DeleteButton endpoint="v1/pagecatassuser" id={row.user_id} /> {/* Updated to use user_id */}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* PageAssignmentUpdate Modal */}
      <PageAssignmentUpdate
        open={openModal}
        onClose={handleCloseModal}
        row={selectedRowData}
      />

      {/* Category Modal */}
      <Modal open={openCategoryModal} onClose={handleCloseCategoryModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h5>Page Categories</h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">S.No.</th>
                <th scope="col">Category</th>
              </tr>
            </thead>
            {categories.map((category, index) => (
              <tbody key={index}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{formatString(category)}</td>

                </tr>
              </tbody>
            ))}
          </table>

          <button onClick={handleCloseCategoryModal} className="btn cmnbtn btn-outline-primary">
            Close
          </button>
        </Box>
      </Modal>

      <div className="content">
        <div className="">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title flexCenterBetween">Page Assignment</h5>
              <div className="flexCenter colGap8">
                <Link
                  to={`/admin/pms-page-cat-assignment-add`}
                  className="btn cmnbtn btn_sm btn-outline-primary"
                >
                  Add Category Auth <AddIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p0">
            <div className="data_tbl thm_table table-responsive">
              <View
                columns={dataGridColumns}
                data={groupedTagCategoryData}
                isLoading={false}
                title={"Page Category Assignment To User"}
                pagination={[100, 200, 1000]}
                tableName={"Page Category Assignment To User"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAssignmentUser;
