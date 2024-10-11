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

const PageAssignmentUser = () => {
  const { toastAlert } = useGlobalContext();
  
  const [user, setUser] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Modal open state
  const [selectedRowData, setSelectedRowData] = useState(null); // Row data state
  
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const token = sessionStorage.getItem("token");

  // Fetch data from APIs
  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
    });

    axios.get(baseUrl + "v1/get_all_page_cat_assignment").then((res) => {
      setAuthData(res.data.data);
    });

    axios.get(baseUrl + 'v1/page_sub_category', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      })
      .then((res) => {
        setSubCat(res.data.data);
      });
  };

  useEffect(()=>{
    getData()
  },[]);

  // Open modal with row data
  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setOpenModal(true); // Open the modal
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setSelectedRowData(null); // Reset the selected row data
  };

  const dataGridColumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "User",
      name: "User Name",
      width: 100,
      editable: false,
      renderRowCell: (row) => {
        let name = user?.find((item) => item.user_id == row?.user_id)?.user_name;
        return name ? name : 'N/A'
      },
    },
    {
      key: "Sub_categories",
      name: "Sub Categories",
      width: 200,
      renderRowCell: (row) => {
        let name = subCat?.find(
          (item) => item?._id == row?.page_sub_category_id
        )?.page_sub_category;
        return name;
      },
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
          <DeleteButton
            endpoint="v1/pagecatassuser"
            id={row._id}
          />
        </div>
      ),
    }
  ];

  return (
    <>
      {/* PageAssignmentUpdate Modal */}
      <PageAssignmentUpdate
        open={openModal}
        onClose={handleCloseModal}
        row={selectedRowData} // Pass selected row data
      />

      <div className="content">
        <div className="">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title flexCenterBetween">
              </h5>
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
                data={authData}
                isLoading={false}
                title={"Page Cat Assignment To User"}
                pagination={[100, 200, 1000]}
                tableName={"Page Cat Assignment To User"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAssignmentUser;
