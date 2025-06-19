import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import FormContainer from "../FormContainer";
import { Button } from "@mui/material";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import Loader from "../../Finance/Loader/Loader";
import { RiLoginBoxLine } from "react-icons/ri";
import jwtDecode from "jwt-decode";
import { useGetAllUserDataQuery } from "../../Store/API/HRMS/UserApi";
import axios from "axios";
const PreOnboardOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { data: UserData, isLoading, refetch } = useGetAllUserDataQuery();
  const [search, setSearch] = useState("");
  const [filterdata, setFilterData] = useState([]);
  const navigate = useNavigate();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = storedToken ? jwtDecode(storedToken) : {};
  const userID = decodedToken?.id;
  const roleToken = decodedToken?.role_id;
  // console.log(UserData, "UserData")
  // Filter for onboarded active users on load
  // useEffect(() => {
  //   if (!UserData?.length) {
  //     setFilterData([]);
  //     return;
  //   }
  //   const onboarded = UserData.filter(
  //     (d) => d.onboard_status === 2 && d.user_status === "Active"
  //   );
  //   setFilterData(onboarded);
  // }, [UserData]);
  // Apply search
  useEffect(() => {
    if (!UserData?.length) return;
    const onboarded = UserData.filter(
      (d) => d.onboard_status === 2 && d.user_status === "Active"
    );
    const result = onboarded.filter((d) =>
      [d.user_name, d.department_name].some((val) =>
        val?.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilterData(result);
  }, [search, UserData]);
  // Onboard user status change
  const handleStatusChange = async (user_id) => {
    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("onboard_status", 1);
      await axios.put(baseUrl + "update_user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refetch();
      toastAlert("User Onboarded Successfully");
    } catch {
      toastError("Error updating status");
    }
  };
  // Login as user and open appropriate page
  const handleLogin = (user_id, user_login_id, user_login_password) => {
    axios
      .post(baseUrl + "login_user", {
        user_id,
        user_login_id,
        user_login_password,
        role_id: roleToken,
      })
      .then((res) => {
        const token1 = res.data.token;
        const oldToken = sessionStorage.getItem("token");
        sessionStorage.setItem("token", token1);
        if (token1) {
          const decoded = jwtDecode(token1);
          const deptId = decoded?.dept_id;
          const onboardStatus = decoded?.onboard_status;
          if (deptId == 36 && onboardStatus == 1) {
            window.open("/admin/sales/sales-dashboard", "_blank");
          } else if (deptId === 20) {
            navigate("/admin/pantry");
          } else {
            window.open("/", "_blank");
          }
        }
        // Restore old token after login for security
        sessionStorage.setItem("token", oldToken);
      })
      .catch(() => {
        toastError("Login failed");
      });
  };
  // Exit status update
  const handleExitStatusUpdate = async (userID) => {
    try {
      const formData = new FormData();
      formData.append("user_id", userID);
      formData.append("onboard_status", 1);
      formData.append("user_status", "Exit");
      await axios.put(baseUrl + "update_user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refetch();
      toastAlert("Status Updated Successfully.");
    } catch {
      toastError("Error updating exit status.");
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
        <Link to={`/admin/user/user-single/${row.user_id}`}>
          <span style={{ color: "blue" }}>{row.user_name}</span>
        </Link>
      ),
      width: "200px",
      sortable: true,
      reorder: true,
    },
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
      name: "Log",
      cell: (row) => (
        <Button
          className="cmnbtn btn_sm"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ marginRight: "10px" }}
          startIcon={<RiLoginBoxLine />}
          onClick={() =>
            handleLogin(row.user_id, row.user_login_id, row.user_login_password)
          }
        ></Button>
      ),
      width: 100,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Button
          sx={{ marginRight: "10px" }}
          className="cmnbtn btn_sm"
          size="small"
          onClick={() => handleStatusChange(row.user_id, row.onboard_status)}
          variant="outlined"
          color="secondary"
        >
          Onboard
        </Button>
      ),
      width: "8%",
      reorder: true,
    },
    {
      name: "Exit",
      cell: (row) => (
        <Button
          sx={{ marginRight: "10px" }}
          className="cmnbtn btn_sm"
          size="small"
          onClick={() => handleExitStatusUpdate(row.user_id)}
          variant="outlined"
          color="error"
        >
          Exit
        </Button>
      ),
      width: "8%",
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
              style={{ float: "right", width: 220 }}
            />
          </div>
          <div className="card-body thn_table">
            {isLoading ? (
              <Loader />
            ) : (
              <DataTable
                columns={columns}
                data={filterdata}
                pagination
                paginationPerPage={100}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default PreOnboardOverview;



