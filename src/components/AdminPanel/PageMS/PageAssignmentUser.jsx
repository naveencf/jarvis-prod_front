import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import jwtDecode from "jwt-decode";
import View from "../Sales/Account/View/View";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useGlobalContext } from "../../../Context/Context";

const PageAssignmentUser = () => {
  const { toastAlert } = useGlobalContext();
  
  const [user, setUser] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const token = sessionStorage.getItem("token");
  
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
  },[])

  const dataGridcolumns = [
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
        <div className="d-flex align-center ">
          <Link className="mt-2" to={`/#/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          <DeleteButton
            endpoint="v1/pagecatassuser"
            id={row._id}
            // getData={refetchPageList}
          />
        </div>
      ),
    }
  ];

  return (
    <>
      <div className="content">
          <div className="">
            <div className="card">
              <div className="card-header flexCenterBetween">
                <h5 className="card-title flexCenterBetween">
                  {/* <Typography>Profile Health</Typography> */}
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
                      columns={dataGridcolumns}
                      data={authData}
                      isLoading={false}
                      title={"Page Cat Assignment To User"}
                      rowSelectable={true}
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