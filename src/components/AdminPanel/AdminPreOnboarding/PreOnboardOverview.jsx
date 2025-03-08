import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import FormContainer from "../FormContainer";
import { Button } from "@mui/material";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import Loader from "../../Finance/Loader/Loader";

const PreOnboardOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [isloading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_all_users");
      const data = response.data.data;
      const onboarddata = data.filter(
        (d) => d.onboard_status === 2 && d.user_status === "Active"
      );
      setDatas(onboarddata);
      setFilterData(onboarddata);
    } catch (error) {
      // console.log("Error fething Data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleStatusChange = (row, onboard_status) => {
    const formData = new FormData();
    formData.append("user_id", row);
    formData.append("onboard_status", 1);
    axios
      .put(baseUrl + "update_user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => getData());
    toastAlert("User Onboarded Successfully");
  };

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.department_name?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const handleExitStatusUpdate = async (userID) => {
    try {
      const formData = new FormData();
      formData.append("user_id", userID);
      formData.append("onboard_status", 1);
      formData.append("user_status", "Exit");

      await axios.put(`${baseUrl}/update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toastAlert("Status Updated Successfully.");
      await getData();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
      reorder: true,
    },

    {
      name: "User Name",
      selector: (row) => (
        <>
          <Link to={`/admin/user-single/${row.user_id}`}>
            <span style={{ color: "blue" }}>{row.user_name}</span>
          </Link>
        </>
      ),
      width: "200px",
      sortable: true,
      reorder: true,
    },

    // {
    //   name: "Total Documents Filled Percentage",
    //   selector: (row) => Math.ceil(row.documentPercentage) + "%",
    //   width: "150px",
    //   sortable: true,
    //   reorder: true,
    // },
    // {
    //   name: "Mandatory Documents Filled Percentage",
    //   selector: (row) => row.document_percentage_mandatory,
    //   width: "5%",
    //   sortable: true,
    //   reorder: true,
    // },
    // {
    //   name: "Non Mandatory Documents Filled Percentage",
    //   selector: (row) => row.document_percentage_non_mandatory,
    //   width: "5%",
    //   sortable: true,
    //   reorder: true,
    // },
    {
      name: "Role",
      selector: (row) => row.Role_name,
      width: "100px",
      sortable: true,
      reorder: true,
    },
    {
      name: "Login ID",
      selector: (row) => row.user_login_id,
      sortable: true,
      reorder: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation_name,
      sortable: true,
      reorder: true,
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
      sortable: true,
      reorder: true,
    },
    {
      name: "Contact No",
      selector: (row) => row.PersonalNumber,
      reorder: true,
    },
    {
      name: "Email",
      selector: (row) => row.user_email_id,
      width: "16%",
      reorder: true,
    },
    {
      name: "Status",
      selector: (row) => row.user_status,
      width: "4%",
      cell: (row) => (
        <>
          <Button
            sx={{ marginRight: "10px" }}
            className=" cmnbtn btn_sm"
            size="small"
            onClick={() => handleStatusChange(row.user_id, row.onboard_status)}
            variant="outlined"
            color="secondary"
          >
            Onboard
          </Button>
        </>
      ),
      reorder: true,
    },
    {
      name: "Exit",
      selector: (row) => row.user_status,
      width: "4%",
      cell: (row) => (
        <>
          <Button
            sx={{ marginRight: "10px" }}
            className=" cmnbtn btn_sm"
            size="small"
            onClick={() => handleExitStatusUpdate(row.user_id)}
            variant="outlined"
            color="error"
          >
            Exit
          </Button>
        </>
      ),
      reorder: true,
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Pre Onboard"
            link="/admin/user"
            submitButton={false}
          />
        </div>
      </div>

      {isloading ? (
        <Loader />
      ) : (
        <div className="page_height">
          <div className="card mb-4">
            <div className="card-header sb">
              Pre Onboard User
              <input
                type="text"
                placeholder="Search here"
                className="w-25 form-control "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="card-body thn_table">
              <DataTable
                columns={columns}
                data={filterdata}
                pagination
                paginationPerPage={100}
              />
              <div />
              {/* <div className="data_tbl table-responsive">
              <DataTable
                title="Pre Onboard User"
                columns={columns}
                data={filterdata}
                fixedHeader
                // pagination
                fixedHeaderScrollHeight="64vh"
                highlightOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search here"
                    className="w-50 form-control "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                }
              />
            </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PreOnboardOverview;
