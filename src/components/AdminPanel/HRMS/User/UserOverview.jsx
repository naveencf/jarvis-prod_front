import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowData.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { RiH1, RiLoginBoxLine } from "react-icons/ri";
import FormContainer from "../../FormContainer";
import jwtDecode from "jwt-decode";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";
import { useGlobalContext } from "../../../../Context/Context";
import Modal from "react-modal";
import WhatsappAPI from "../../../WhatsappAPI/WhatsappAPI";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@mui/material";
import { baseUrl } from "../../../../utils/config";
import View from "../../Sales/Account/View/View";
import { constant } from "../../../../utils/constants";
import ReJoinReusable from "./ReJoinReusable";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useGetAllUsersDataQuery } from "../../../Store/API/HRMS/User";

const UserOverview = () => {
  // const { data: getAllUsersData } = useGetAllUsersDataQuery();
  // console.log(getAllUsersData, "getALlusersdata");
  const { id } = useParams();
  const { userContextData, DepartmentContext } = useAPIGlobalContext();
  const whatsappApi = WhatsappAPI();
  const { toastAlert } = useGlobalContext();
  const [activeButton, setActiveButton] = useState(2);
  const [isLoading, setLoadingUser] = useState(false);

  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [contextData, setData] = useState([]);
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
  console.log(userContextData, "userContextData");
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
    ``;
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
    formData.append("~", separationResignationDate);
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
          const onboardStatus = decodedToken.onboard_status;
          if (userRole !== 1 && deptId == 36 && onboardStatus == 1) {
            window.open("/admin/sales/sales-dashboard", "_blank");
          } else if (deptId === 20) {
            navigate("/admin/pantry");
          } else {
            window.open("/", "_blank");
          }
          sessionStorage.setItem("token", oldToken);
        } else {
          navigate("/admin/user/user-overview");
        }
      });
  };

  async function getData() {
    try {
      setLoadingUser(true);
      // const response = await axios.get(baseUrl + "get_all_users");
      // const data = response.data.data;
      const data = userContextData;

      setTransferToUser(data);

      if (id == "Active") {
        setFilterData(data.filter((d) => d.user_status == "Active"));
      }
      if (id == "WFO") {
        setFilterData(
          data.filter((d) => d.job_type == "WFO" && d.user_status == "Active")
        );
      }
      if (id == "WFH") {
        setFilterData(
          data.filter((d) => d.job_type == "WFH" && d.user_status == "Active")
        );
      }
      if (id == "WFHD") {
        setFilterData(
          data.filter((d) => d.job_type == "WFHD" && d.user_status == "Active")
        );
      }
      setDatas(data);
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
      setLoadingUser(false);
    }
  }

  // const handleDelete = (userId) => {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: "btn btn-success",
  //       cancelButton: "btn btn-danger",
  //     },
  //     buttonsStyling: false,
  //   });

  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         axios
  //           .delete(`${baseUrl}` + `delete_user/${userId}`)
  //           .then(() => {
  //             // Check if no error occurred and then show the success alert
  //             swalWithBootstrapButtons.fire(
  //               "Deleted!",
  //               "Your file has been deleted.",
  //               "success"
  //             );
  //             getData();
  //           })
  //           .catch(() => {
  //             showErrorAlert();
  //           });
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         swalWithBootstrapButtons.fire(
  //           "Cancelled",
  //           "Your imaginary file is safe :)"
  //         );
  //       }
  //     });
  // };

  useEffect(() => {
    if (userContextData && userContextData.length > 0) {
      getData();
    }
  }, [userContextData]);

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

  const Columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },

    {
      key: "image_url",
      name: "Profile",
      renderRowCell: (row) => {
        const getInitials = (name) => {
          const parts = name.trim().split(" ");
          const firstInitial = parts[0]?.[0] || "";
          const lastInitial =
            parts.length > 1 ? parts[parts.length - 1][0] : "";
          return (firstInitial + lastInitial).toUpperCase();
        };

        const getRandomColor = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          const hue = Math.abs(hash) % 360;
          return `hsl(${hue}, 70%, 50%)`;
        };

        const showImage = row.image && row.image.trim() !== "";

        if (showImage) {
          return (
            <img
              style={{
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                objectFit: "cover",
              }}
              src={row.image_url}
              alt="profile"
            />
          );
        } else {
          const initials = getInitials(row.user_name || "");
          const bgColor = getRandomColor(row.user_name || "");

          return (
            <div
              style={{
                borderRadius: "50%",
                height: "50px",
                width: "50px",
                backgroundColor: bgColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "",
                fontSize: "15px",
                textTransform: "uppercase",
              }}
            >
              {initials}
            </div>
          );
        }
      },
      width: 100,
    },
    {
      key: "user_name",
      name: "Employee Name",
      renderRowCell: (row) => (
        <Link
          to={`/admin/user/user-single/${row.user_id}`}
          style={{ color: "blue" }}
        >
          {row.user_name}
        </Link>
      ),
      width: 100,
    },
    {
      key: "user_id",
      name: "Employee ID",
      width: 100,
    },
    {
      key: "user_login_id",
      name: "Login ID",
      renderRowCell: (row) => (
        <span>{capitalizeFirstLetter(row.user_login_id)}</span>
      ),
      width: 100,
      sortable: true,
    },
    {
      key: "Role_name",
      name: "Role",
      width: 100,
    },
    {
      key: "Major Department",
      name: "Major Department",
      renderRowCell: (row) => {
        const department = DepartmentContext.find(
          (d) => d.dept_id === row.dept_id
        );
        return department ? department.major_dept_name : "N/A";
      },
      width: 100,
      sortable: true,
    },
    {
      key: "department_name",
      name: "Department",
      width: 100,
    },
    {
      key: "designation_name",
      name: "Designation",
      width: 100,
    },
    {
      key: "job_type",
      name: "Job Type",
      width: 100,
    },
    {
      key: "PersonalNumber",
      name: "Personal Contact",
      width: 100,
    },
    {
      key: "user_email_id",
      name: "Email",
      width: 100,
    },
    {
      key: "created_by_name",
      name: "Created by Name",
      width: 100,
    },
    {
      key: "created_At",
      name: "Creation Date",
      renderRowCell: (row) => (
        <div>{convertDateToDDMMYYYY(row.created_At)} </div>
      ),
      width: 100,
      sortable: true,
    },
    {
      key: "user_status",
      name: "Status",
      renderRowCell: (row) => (
        <>
          {row.user_status === "Active" ? (
            <span className="badge badge-success">Active</span>
          ) : row.user_status === "Exit" || row.user_status === "On Leave" ? (
            <span className="badge badge-warning">{row.user_status}</span>
          ) : row.user_status === "Resign" ? (
            <span className="badge badge-danger">Resigned</span>
          ) : row.user_status === "Bot" ? (
            <span className="badge badge-danger">Bot(Testing)</span>
          ) : null}
        </>
      ),
      width: 100,
      sortable: true,
    },
    {
      key: "auth",
      name: "Auth",
      renderRowCell: (row) => (
        <>
          {roleToken == constant.CONST_ADMIN_ROLE && (
            <Link to={`/admin/user/user-auth-detail/${row.user_id}`}>
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
      width: 100,
    },
    // {
    //     key: "kra",
    //     name: "KRA",
    //     renderRowCell: (row) => (
    //       <>
    //             {contextData &&
    //          contextData[0] &&
    //         contextData[3].update_value === 1 && (
    //           <button
    //             className="btn cmnbtn btn_sm btn-outline-primary"
    //             onClick={() => handleKRA(row.user_id)}
    //           >
    //             KRA
    //            </button>
    //          )}
    //       </>
    //     ),
    //     width: 100,
    //   },

    {
      key: "log",
      name: "Log",
      renderRowCell: (row) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={() =>
            handleLogin(row.user_id, row.user_login_id, row.user_login_password)
          }
        >
          <RiLoginBoxLine />
        </button>
      ),
      width: 100,
      sortable: true,
    },
    // {
    //     key: "transfer_res",
    //     name: "Transfer Res",
    //     renderRowCell: (row) =>
    //           <button
    //       className="btn cmnbtn btn_sm btn-outline-danger"
    //       onClick={() => handleTransfer(row.user_id)}
    //     >
    //       Transfer
    //     </button>,
    //     width: 100,
    //     sortable: true,
    //   },

    {
      key: "separation",
      name: "Separation",
      renderRowCell: (row) => (
        <>
          {row.user_id !== 889 && (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary"
              data-toggle="modal"
              data-target="#exampleModal"
              size="small"
              variant="contained"
              color="primary"
              onClick={() =>
                handleSeprationReason(
                  row.user_id,
                  row.user_name,
                  row.user_contact_no
                )
              }
            >
              Sep
            </button>
          )}
        </>
      ),
      width: 100,
      sortable: true,
    },

    // {
    //   key: "Summary",
    //   name: "Summary",
    //   renderRowCell: (row) =>
    //     <button
    //   className="btn cmnbtn btn_sm btn-outline-secondary"
    //   variant="contained"
    //   color="warning"
    //   onClick={() => handleUpdateSummary(row.user_id)}
    // >
    //   Summary
    // </button>
    //       ,
    //   width: 100,
    //   sortable: true,
    // },
    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row">
          {contextData &&
            contextData[0] &&
            contextData[0].update_value === 1 &&
            row.user_id !== 889 && (
              <Link to={`/admin/user/user-update/${row.user_id}`}>
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
                onClick={() => handleDelete(row.user_id)}
              >
                <i className="bi bi-trash" />
              </div>
            )} */}
        </div>
      ),
      width: 100,
    },
    {
      key: "Re-Join",
      name: "Re-Join",
      renderRowCell: (row) =>
        row.user_status === "Exit" && (
          <button
            className="btn cmnbtn btn_sm btn-outline-danger"
            onClick={() => handleReJoin(row.user_id)}
          >
            Re-Join
          </button>
        ),
      width: 100,
      sortable: true,
    },
    // {
    //   key: "User Map",
    //   name: "User Map",
    //   renderRowCell: (row) =>
    //     <Button
    //   className="btn btn-success"
    //   data-toggle="modal"
    //   data-target="#mapModal"
    //   size="small"
    //   variant="contained"
    //   color="success"
    //   onClick={() => setMap1(row)}
    // >
    //   Open Map
    // </Button>
    //         ,
    //   width: 100,
    //   sortable: true,
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
          <Link to="/admin/user/users-dashboard">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Dashboard
            </button>
          </Link>
          {/* {contextData && contextData[2] && contextData[2].view_value === 1 && ( */}
          <Link className="collapse-item" to="/admin/user/object-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Objects Auth
            </button>
          </Link>
          {/* )} */}
          <Link className="collapse-item" to="/admin/user/jobType">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Job Type
            </button>
          </Link>
          <Link to="/admin/user/hobbies-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Hobbies
            </button>
          </Link>
          {/* <Link to="/admin/reason">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Reason
            </button>
          </Link> */}
          <Link to="/admin/user/role-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              Roles
            </button>
          </Link>

          {contextData && contextData[3] && contextData[3].view_value === 1 && (
            <Link to="/admin/user/department-overview">
              <button type="button" className="btn btn-outline-primary btn-sm">
                Department
              </button>
            </Link>
          )}
          {contextData &&
            contextData[0] &&
            contextData[0].insert_value === 1 && (
              <Link to="/admin/user/user">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Add User
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

      {/* //  Active inActive toggle button here */}
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

        <div className="">
          <div>
            <View
              columns={Columns}
              data={filterdata}
              isLoading={isLoading}
              title={"User Overview"}
              // rowSelectable={true}
              pagination={[100, 200]}
              tableName={"User Overview"}
            />
          </div>
        </div>
      </>

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
                      options={transferToUser?.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: transferTo,
                        label:
                          transferToUser?.find(
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
