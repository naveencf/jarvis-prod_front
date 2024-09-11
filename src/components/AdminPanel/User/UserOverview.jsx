import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowData.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { RiLoginBoxLine } from "react-icons/ri";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import FieldContainer from "../FieldContainer";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";
import Modal from "react-modal";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { baseUrl } from "../../../utils/config";
import Loader from "../../Finance/Loader/Loader";
import ReJoinReusable from "./ReJoinReusable";

const UserOverview = () => {
  const { id } = useParams();
  const whatsappApi = WhatsappAPI();
  const { toastAlert } = useGlobalContext();
  const [activeButton, setActiveButton] = useState(2);

  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [contextData, setData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [desiOrgData, setDesiOrgData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [jobType, setJobType] = useState("ALL");
  const [transferResponsibilityData, setTransferResponsibilityData] = useState(
    []
  );
  const [remark, setRemark] = useState("");
  const [transferTo, setTransferTo] = useState(0);
  const [transferToUser, setTransferToUser] = useState([]);
  const [username, setUserName] = useState("");
  const [usercontact, setUserContact] = useState("");
  const navigate = useNavigate();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleToken = decodedToken.role_id;
  const oldToken = sessionStorage.getItem("token");
  const [checkedData, setCheckedData] = useState([]);
  const [separationReasonGet, setSeparationReasonGet] = useState([]);
  const [separationUserID, setSeparationUserID] = useState(null);
  const [separationStatus, setSeparationStatus] = useState("Resigned");
  const [separationReason, setSeparationReason] = useState("");
  const [separationRemark, setSeparationRemark] = useState("");
  const [separationReinstateDate, setSeparationReinstateDate] = useState("");
  const [separationResignationDate, setSeparationResignationDate] =
    useState("");
  const [separationLWD, setSeparationLWD] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [KRIData, setKRIData] = useState([]);
  const [map1, setMap1] = useState({});

  const [isSummaryModal, setIsSummaryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // toggle button
  const handleRadioChange = (value) => {
    setActiveButton(value);
    if (value === 1) {
      let filterdata = datas;
      setFilterData(filterdata);
    } else if (value === 2) {
      let filterdata = datas.filter((d) => d.user_status == "Active");
      setFilterData(filterdata);
    } else if (value === 3) {
      let filterdata = datas.filter((d) => d.user_status == "Exit");
      setFilterData(filterdata);
    }
  };
  useEffect(() => {
    handleRadioChange(2);
  }, []);

  const handleKRA = (userId) => {
    setIsModalOpen(true);
    KRAAPI(userId);
  };

  const KRAAPI = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setKRIData(res.data);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setKRIData([]);
  };

  // handleUpdateSummary manage here-----------------------------------

  const handleUpdateSummary = (userId) => {
    setIsSummaryModal(true);
    SummaryData(userId);
  };
  const [reJoinModalOpen, setRejoinModalOpen] = useState(false);
  const [rejoinID, setRejoinID] = useState("");
  const reJoinClose = () => {
    setRejoinModalOpen(false);
  };
  const handleReJoin = (id) => {
    setRejoinModalOpen(true);
    setRejoinID(id);
  };

  const SummaryData = (userId) => {
    axios
      .get(`${baseUrl}` + `get_single_user_update_history/${userId}`)
      .then((res) => {
        setHistoryData(res.data.data);
      });
  };
  const handleCloseSummaryModal = () => {
    setIsSummaryModal(false);
    setHistoryData([]);
  };

  function handleSeprationReason(userId, username, user_contact_no) {
    setSeparationUserID(userId);
    setUserName(username);
    setUserContact(user_contact_no);
    axios
      .get(baseUrl + "get_all_reasons")
      .then((res) => setSeparationReasonGet(res.data));
  }
  const today = new Date().toISOString().split("T")[0];

  function handleSeparationDataPost() {
    axios.post(baseUrl + "add_separation", {
      user_id: separationUserID,
      status: separationStatus,
      created_by: userID,
      releaving_date: separationResignationDate,
      last_working_day: separationLWD,
      remark: separationRemark,
      // reason: separationReason,
      reason: "Exit User",
    });
    const formData = new FormData();
    formData.append("user_id", separationUserID);
    formData.append("user_status", "Exit");
    formData.append("releaving_date", separationResignationDate);
    axios.put(baseUrl + "update_user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    whatsappApi.callWhatsAPI(
      "CF_Separation",
      JSON.stringify(usercontact),
      username,
      [username, separationStatus]
    );
    getData();
  }

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setData(res.data);
        });
    }
  }, [userID]);

  // Admin Login from User
  const handleLogin = (user_id, user_login_id, user_login_password) => {
    axios
      .post(baseUrl + "login_user", {
        user_id: user_id,
        user_login_id: user_login_id,
        user_login_password: user_login_password,
        role_id: roleToken,
      })
      .then((res) => {
        const token1 = res.data.token;
        sessionStorage.getItem("token", token1);
        if (oldToken && token1) {
          sessionStorage.setItem("token", token1);
          const decodedToken = jwtDecode(token1);
          const deptId = decodedToken.dept_id;
          const userRole = decodedToken.role_id;
          const onboardStatus = decodedToken.onboard_status
          if (userRole !== 1 && deptId == 36 && onboardStatus == 1) {
            window.open("/admin/sales-dashboard", "_blank");
          } else {
            window.open("/", "_blank");
          }
          sessionStorage.setItem("token", oldToken);
        } else {
          navigate("/admin/user-overview");
        }
      });
  };

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_all_users");
      const data = response.data.data;

      setDatas(data);
      setTransferToUser(data);

      if (id == "Active") {
        setFilterData(data.filter((d) => d.user_status == "Active"));
      }
      if (id == "WFO") {
        setFilterData(data.filter((d) => d.job_type == "WFO"));
      }
      if (id == "WFH") {
        setFilterData(data.filter((d) => d.job_type == "WFH"));
      }
      if (id == "WFHD") {
        setFilterData(data.filter((d) => d.job_type == "WFHD"));
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  const departmentAPI = () => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
      getData();
    });
  };

  const designationAPI = () => {
    axios.get(baseUrl + "get_all_designations").then((res) => {
      setDesiOrgData(res.data.data);
    });
  };

  const handleDelete = (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}` + `delete_user/${userId}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
              getData();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  useEffect(() => {
    getData();
    departmentAPI();
    designationAPI();
  }, []);

  useEffect(() => {
    const deptWiseDesi = desiOrgData.filter(
      (d) => d.dept_id == departmentFilter
    );
    setDesignationData(deptWiseDesi);
  }, [departmentFilter]);

  useEffect(() => {
    const result1 = datas.filter((d) => {
      return (
        d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.department_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.user_status?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result1);
  }, [search]);

  useEffect(() => {
    const result = datas.filter((d) => {
      const departmentMatch =
        !departmentFilter || d.dept_id === departmentFilter;
      const designationMatch =
        !designationFilter || d.user_designation === designationFilter;
      const jobtypeMatch = jobType === "ALL" || d.job_type === jobType;
      return departmentMatch && designationMatch && jobtypeMatch;
    });
    setFilterData(result);
  }, [departmentFilter, designationFilter, jobType]);

  const jobTypeOptions = [
    { value: "ALL", label: "All" },
    { value: "WFO", label: "WFO" },
    { value: "WFH", label: "WFH" },
    { value: "WFHD", label: "WFHD" },
  ];

  function convertDateToDDMMYYYY(dateString) {
    if (String(dateString).startsWith("0000-00-00")) {
      return " ";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 70,
      valueGetter :(params) =>{params.row.id + 1},
      renderCell: (params) => <div>{params.row.id + 1}</div>,
    },
    {
      field: "user_name",
      headerName: "Employee Name",
      width: 120,
      renderCell: (params) => (
        <Link
          to={`/admin/user-single/${params.row.user_id}`}
          style={{ color: "blue" }}
        >
          {params.row.user_name}
        </Link>
      ),
      sortable: true,
    },
    {
      field: "user_id",
      headerName: "Employee ID",
      width: 130,
      sortable: true,
    },
    {
      field: "user_login_id",
      headerName: "Login ID",
      width: 180,
      sortable: true,
      renderCell: (params) => (
        <span>{capitalizeFirstLetter(params.value)}</span>
      ),
    },
    {
      field: "Role_name",
      headerName: "Role",
      width: 100,
      sortable: true,
    },
    // {
    //   field: "percentage_filled",
    //   headerName: "Profile Status",
    //   width: 110,
    //   sortable: true,
    // },
    {
      field: "dept_id",
      headerName: "Major Department",
      width: 220,
      sortable: true,
      valueGetter :(params) => {
        const department = departmentData.find(
          (d) => d.dept_id === params.row.dept_id
        );
        return department ? department.major_dept_name : "N/A";
      },
      renderCell: (params) => {
        const department = departmentData.find(
          (d) => d.dept_id === params.row.dept_id
        );
        return department ? department.major_dept_name : "N/A";
      },
    },
    {
      field: "department_name",
      headerName: "Department",
      width: 190,
      sortable: true,
    },
    
    
    {
      field: "designation_name",
      headerName: "Designation",
      width: 180,
      sortable: true,
    },

    {
      field: "job_type",
      headerName: "Job Type",
      width: 120,
      sortable: true,
    },
    { field: "PersonalNumber", headerName: "Personal Contact", width: 150 },
    { field: "user_email_id", headerName: "Email", width: 230 },
    { field: "created_by_name", headerName: "Created by Name", width: 200 },
    {
      field: "created_At",
      renderCell: (params, index) => (
        <div>{convertDateToDDMMYYYY(params.row.created_At)} </div>
      ),
      headerName: "Creation Date",
      width: 150,
    },
    {
      field: "user_status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row.user_status === "Active" ? (
            <span className="badge badge-success">Active</span>
          ) : params.row.user_status === "Exit" ||
            params.row.user_status === "On Leave" ? (
            <span className="badge badge-warning">
              {params.row.user_status}
            </span>
          ) : params.row.user_status === "Resign" ? (
            <span className="badge badge-danger">Resigned</span>
          ) : null}
        </>
      ),
    },
    {
      field: "auth",
      headerName: "Auth",

      width: 90,
      renderCell: (params) => (
        <>
          {contextData &&
            contextData[0] &&
            contextData[3].update_value === 1 && (
              <Link to={`/admin/user-auth-detail/${params.row.user_id}`}>
                <button
                  className="btn cmnbtn btn_sm btn-outline-primary"
                  variant="outline"
                  size="small"
                >
                  Auth
                </button>
              </Link>
            )}
        </>
      ),
    },
    // {
    //   field: "kra",
    //   headerName: "KRA",
    //   width: 90,
    //   renderCell: (params) => (
    //     <>
    //       {contextData &&
    //         contextData[0] &&
    //         contextData[3].update_value === 1 && (
    //           <button
    //             className="btn cmnbtn btn_sm btn-outline-primary"
    //             onClick={() => handleKRA(params.row.user_id)}
    //           >
    //             KRA
    //           </button>
    //         )}
    //     </>
    //   ),
    // },
    {
      field: "log",
      headerName: "Log",
      width: 80,
      renderCell: (params) => (
        <Button
          variant="outlined"
          className="btn cmnbtn btn_sm btn-outline-primary"
          startIcon={<RiLoginBoxLine />}
          onClick={() =>
            handleLogin(
              params.row.user_id,
              params.row.user_login_id,
              params.row.user_login_password
            )
          }
        ></Button>
      ),
    },
    // {
    //   field: "transfer_res",
    //   headerName: "Transfer Res",
    //   width: 110,
    //   renderCell: (params) => (
    //     <button
    //       className="btn cmnbtn btn_sm btn-outline-danger"
    //       onClick={() => handleTransfer(params.row.user_id)}
    //     >
    //       Transfer
    //     </button>
    //   ),
    // },
    {
      field: "separation",
      headerName: "Separation",
      width: 100,
      renderCell: (params) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          data-toggle="modal"
          data-target="#exampleModal"
          size="small"
          variant="contained"
          color="primary"
          onClick={() =>
            handleSeprationReason(
              params.row.user_id,
              params.row.user_name,
              params.row.user_contact_no
            )
          }
        >
          Sep
        </button>
      ),
    },

    // {
    //   field: "Summary",
    //   headerName: "Summary",
    //   width: 100,
    //   renderCell: (params) => (
    //     <button
    //       className="btn cmnbtn btn_sm btn-outline-secondary"
    //       variant="contained"
    //       color="warning"
    //       onClick={() => handleUpdateSummary(params.row.user_id)}
    //     >
    //       Summary
    //     </button>
    //   ),
    // },

    {
      field: "actions",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <>
          {contextData &&
            contextData[0] &&
            contextData[0].update_value === 1 && (
              <Link to={`/admin/user-update/${params.row.user_id}`}>
                <div className="icon-1">
                  <i className="bi bi-pencil" />
                </div>
              </Link>
            )}
          {/* {contextData &&
            contextData[0] &&
            contextData[0].delete_flag_value === 1 && (
              <div
                className="icon-1"
                onClick={() => handleDelete(params.row.user_id)}
              >
                <i className="bi bi-trash" />
              </div>
            )} */}
        </>
      ),
    },

    {
      field: "Re-Join",
      headerName: "Re-Join",
      // width: 100,
      renderCell: (params) =>
        params.row.user_status === "Exit" && (
          <button
            className="btn cmnbtn btn_sm btn-outline-danger"
            onClick={() => handleReJoin(params.row.user_id)}
          >
            Re-Join
          </button>
        ),
    },

    // {
    //   field: "User Map",
    //   headerName: "User Map",
    //   width: 100,
    //   renderCell: (params) => (
    //     <Button
    //       className="btn btn-success"
    //       data-toggle="modal"
    //       data-target="#mapModal"
    //       size="small"
    //       variant="contained"
    //       color="success"
    //       onClick={() => setMap1(params.row)}
    //     >
    //       Open Map
    //     </Button>
    //   ),
    // },
  ];

  const handleTransfer = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setTransferResponsibilityData(res.data);
    });
  };

  function handleAllCheckedData(event) {
    if (event.target.checked) {
      setCheckedData([...transferResponsibilityData]);
    } else {
      setCheckedData([]);
      const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }

  function handleCheckedData(row) {
    if (checkedData.includes(row)) {
      setCheckedData(checkedData.filter((r) => r !== row));
    } else {
      setCheckedData([...checkedData, row]);
    }
  }

  const handleTransferSubmit = async () => {
    for (const element of checkedData) {
      const requestData = {
        user_to_id: transferTo,
        remarks: remark,
        created_by: userID,
        user_from_id: element.user_id,
        job_responsibility_id: element.Job_res_id,
        Job_res_id: element.Job_res_id,
      };
      await axios.post(baseUrl + "add_kra", requestData).then(() => {
        setRemark("");
        setTransferTo("");
        toastAlert("KRA Transfer Successfully");
        const MailUser = transferToUser.find((d) => d.user_id == transferTo);
        axios.post(baseUrl + "add_send_user_mail", {
          email: MailUser.user_email_id,
          subject: "User Registration",
          text: "You Have Assign New KRA",
        });
      });
    }
  };

  // const options = [
  //   { value: "All", label: "All" },
  //   ...designationData.map((option) => ({
  //     value: option.desi_id,
  //     label: option.desi_name,
  //   })),
  // ];

  // const selectedOption =
  //   options.find((option) => option.value === designationFilter) || null;

  // const selectedOption = designationFilter ? designationFilter ==="All"
  // ?     { value: "All", label: "All" }:
  // {
  //  value: designationFilter,
  //  label: designationData.find((desi)=>desi.desi_id ===designationFilter)?.desi_name || "",
  // }
  // const options = [
  //   { value: "All", label: "All" },
  //   ...designationData.map((option) => ({
  //     value: option.desi_id,
  //     label: option.desi_name,
  //   })),
  // ];

  // Finding the selected option
  // const selectedOption = designationFilter
  //   ? options.find((option) => option.value === designationFilter)
  //   : null;

  const apiKey = "AIzaSyCRv0hz37kV5Oa-2Pz-D3JEReg1snhU4S0";
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${map1?.latitude?.$numberDecimal},${map1?.longitude?.$numberDecimal}`;

  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="User"
            link="/admin/user"
            submitButton={false}
          />
        </div>
        <div className="action_btns">
          <Link to="/admin/users-dashboard">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Dashboard
            </button>
          </Link>
          {contextData && contextData[2] && contextData[2].view_value === 1 && (
            <Link className="collapse-item" to="/admin/object-overview">
              <button type="button" className="btn btn-outline-primary btn-sm">
                Objects Auth
              </button>
            </Link>
          )}
          <Link className="collapse-item" to="/admin/jobType">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Job Type
            </button>
          </Link>
          {/* <Link to="/admin/billing-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Billing{" "}
            </button>
          </Link> */}
          <Link to="/admin/hobbies-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Hobbies
            </button>
          </Link>
          <Link to="/admin/reason">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Reason
            </button>
          </Link>
          <Link to="/admin/role-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              User Roles
            </button>
          </Link>

          {contextData && contextData[3] && contextData[3].view_value === 1 && (
            <Link to="/admin/department-overview">
              <button type="button" className="btn btn-outline-primary btn-sm">
                Department
              </button>
            </Link>
          )}
          {contextData &&
            contextData[10] &&
            contextData[10].view_value === 1 && (
              <Link to="/admin/designation-overview">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Designation
                </button>
              </Link>
            )}

          {contextData &&
            contextData[18] &&
            contextData[18].insert_value === 1 && (
              <Link to="/admin/pre-onboarding">
                <button type="button" className="btn btn-warning btn-sm">
                  Add Pre Onboarding
                </button>
              </Link>
            )}
          {contextData &&
            contextData[0] &&
            contextData[0].insert_value === 1 && (
              <Link to="/admin/user">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Add New User
                </button>
              </Link>
            )}
        </div>
      </div>

      <div className="modal fade" id="mapModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <iframe
                width="600"
                height="450"
                frameBorder="0"
                style={{ border: "0" }}
                src={mapUrl}
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {isloading ? (
        <Loader />
      ) : (
        //  Active inActive toggle button here
        <>
          <div className="tab mt16">
            <button
              className={`named-tab ${activeButton === 1 ? "active-tab" : ""}`}
              onClick={() => handleRadioChange(1)}
            >
              All
            </button>
            <button
              className={`named-tab ${activeButton === 2 ? "active-tab" : ""}`}
              onClick={() => handleRadioChange(2)}
            >
              Active
            </button>
            <button
              className={`named-tab ${activeButton === 3 ? "active-tab" : ""}`}
              onClick={() => handleRadioChange(3)}
            >
              Exit
            </button>
          </div>
          {/* <div className="pack w-100 justify-content-end d-flex p-2 ">
            <div
              className="btn-group ml-3 mb-1"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio1"
                checked={activeButton === 1}
                onChange={() => handleRadioChange(1)}
              />
              <label
                className="btn btn-outline-info"
                style={{
                  borderTopRightRadius: "20pxpx",
                  borderBottomRightRadius: "20px",
                }}
                htmlFor="btnradio1"
              >
                All
              </label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio2"
                checked={activeButton === 2}
                onChange={() => handleRadioChange(2)}
              />
              <label className="btn btn-outline-info" htmlFor="btnradio2">
                Active
              </label>

              <input
                type="radio"
                className="btn-check"
                name="btnradio"
                id="btnradio3"
                checked={activeButton === 3}
                onChange={() => handleRadioChange(3)}
              />
              <label className="btn btn-outline-info" htmlFor="btnradio3">
                Exit
              </label>
            </div>
          </div> */}
          <div className="card">
            <div className="card-body">
              <div className="row thm_form">
                <div className="form-group col-3">
                  <label className="form-label">Department Name</label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...departmentData.map((option) => ({
                        value: option.dept_id,
                        label: option.dept_name,
                      })),
                    ]}
                    value={
                      departmentFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: departmentFilter,
                            label:
                              departmentData.find(
                                (dept) => dept.dept_id === departmentFilter
                              )?.dept_name || "Select...",
                          }
                    }
                    onChange={(selectedOption) => {
                      const selectedValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDepartmentFilter(selectedValue);
                      if (selectedValue === "") {
                        getData();
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Designation</label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...designationData.map((option) => ({
                        value: option.desi_id,
                        label: option.desi_name,
                      })),
                    ]}
                    value={
                      designationFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: designationFilter,
                            label:
                              designationData.find(
                                (option) => option.desi_id === designationFilter
                              )?.desi_name || "Select...",
                          }
                    }
                    onChange={(selectedOption) => {
                      const newValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDesignationFilter(newValue);
                      if (newValue === "") {
                        designationAPI();
                      }
                    }}
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Job Type</label>
                  <Select
                    value={jobTypeOptions.find(
                      (option) => option.value === jobType
                    )}
                    onChange={(selectedOption) => {
                      setJobType(selectedOption.value);
                    }}
                    options={jobTypeOptions}
                  />
                </div>
                <div className="form-group col-3">
                  <FieldContainer
                    fieldGrid={12}
                    label="Search"
                    placeholder="Search Here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div
              className="data_tbl card-body thm_table"
              style={{ height: "64vh", width: "100%" }}
            >
              <DataGrid
                rows={filterdata.map((data, index) => ({ ...data, id: index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnMenu
                disableSelectionOnClick
                getRowId={(row) => row.id}
                slots={{
                  toolbar: GridToolbar,
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Modal here  */}
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ height: "90vh", overflow: "scroll", width: "140%" }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Transfer KRA
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div>
                <div className="row">
                  <div className="form-group col-3">
                    <label className="form-label">
                      Transfer Kra <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={transferToUser.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: transferTo,
                        label:
                          transferToUser.find(
                            (user) => user.user_id === transferTo
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setTransferTo(e.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-9">
                    <label className="form-label">Reason</label>
                    <input
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <DataTable
                  columns={[
                    {
                      name: (
                        <input
                          type="checkbox"
                          checked={
                            checkedData.length ===
                            transferResponsibilityData.length
                          }
                          onChange={handleAllCheckedData}
                        />
                      ),
                      cell: (row) => (
                        <input
                          type="checkbox"
                          checked={checkedData.includes(row)}
                          onChange={() => handleCheckedData(row)}
                        />
                      ),
                    },
                    {
                      name: "s.no",
                      cell: (row, index) => <div>{index + 1}</div>,
                    },
                    { name: "Name", selector: (row) => row.user_name },
                    {
                      name: "Department",
                      selector: (row) => row.department_name,
                    },
                    {
                      name: "Job Responsibility",
                      selector: (row) => row.sjob_responsibility,
                    },
                  ]}
                  data={transferResponsibilityData}
                  highlightOnHover
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleTransferSubmit()}
                className="btn btn-primary"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Separation
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Status"
                Tag="select"
                value={separationStatus}
                onChange={(e) => setSeparationStatus(e.target.value)}
              >
                {/* <option value="" disabled>
                  Choose...
                </option> */}
                <option value="Resigned">Exit</option>
              </FieldContainer>
              <FieldContainer
                label="Remark"
                value={separationRemark}
                onChange={(e) => setSeparationRemark(e.target.value)}
              />
              {(separationStatus === "On Long Leave" ||
                separationStatus === "Subatical" ||
                separationStatus === "Suspended") && (
                <FieldContainer
                  label="Reinstated Date"
                  type="date"
                  value={separationReinstateDate}
                  onChange={(e) => setSeparationReinstateDate(e.target.value)}
                />
              )}
             
              
              {/* {separationStatus == "Resigned" && ( */}
                <FieldContainer
                  label="Resignation Date"
                  type="date"
                  value={separationResignationDate}
                  onChange={(e) => setSeparationResignationDate(e.target.value)}
                />
              {/* )} */}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSeparationDataPost()}
                disabled={
                  !separationRemark ||
                  !separationStatus ||
                  !separationResignationDate
                }
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for user KRA */}
      <Modal
        appElement={document.getElementById("root")}
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "80%",
            height: "85%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              KRA
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseModal}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <DataTable
            columns={[
              {
                name: "s.no",
                cell: (row, index) => <div>{index + 1}</div>,
              },
              { name: "Name", selector: (row) => row.user_id },
              { name: "Department", selector: (row) => row.department_name },
              {
                name: "Job Responsibility",
                selector: (row) => row.sjob_responsibility,
              },
            ]}
            data={KRIData}
            highlightOnHover
          />
        </>
      </Modal>

      {/* Modal for user Summary */}
      <Modal
        // appElement={document.getElementById("root")}
        isOpen={isSummaryModal}
        onRequestClose={handleCloseSummaryModal}
        style={{
          content: {
            width: "80%",
            height: "85%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              User Update History
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseSummaryModal}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <DataTable
            columns={[
              {
                name: "s.no",
                cell: (row, index) => <div>{index + 1}</div>,
              },
              { name: "Name", selector: (row) => row.user_id },
              {
                name: "Previous Value",
                selector: (row) => row.previous_value[0],
              },
            ]}
            data={historyData}
            highlightOnHover
          />
        </>
      </Modal>

      {/* Re-Join Modal here  */}
      <ReJoinReusable
        getData={getData}
        reJoinModalOpen={reJoinModalOpen}
        reJoinClose={reJoinClose}
        id={rejoinID}
      />
    </div>
  );
};
export default UserOverview;
