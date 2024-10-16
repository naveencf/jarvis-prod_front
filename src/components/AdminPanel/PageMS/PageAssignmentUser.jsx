import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import View from "../Sales/Account/View/View";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "../../../Context/Context";
import PageAssignmentUpdate from "./PageAssignmentUpdate";
import { useGetAllCatAssignmentQuery } from "../../Store/API/Inventory/CatAssignment";


const PageAssignmentUser = () => {
  const { toastAlert } = useGlobalContext();
  const { data: authData, isLoading } = useGetAllCatAssignmentQuery();
  

  // const [user, setUser] = useState([]);
  // const [authData, setAuthData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // const storedToken = sessionStorage.getItem("token");
  // const decodedToken = jwtDecode(storedToken);
  // const token = sessionStorage.getItem("token");

  // const getData = () => {
  //   axios.get(baseUrl + "v1/get_all_page_cat_assignment").then((res) => {
  //     setAuthData(res.data.data);
  //     console.log(res.data.data,"res.data.data",authData)
  //   });
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  // Function to group data by user and their respective page categories
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
      name: "Page Categories",
      width: 300,
      renderRowCell: (row) => row.page_categories.join(", "), 
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
