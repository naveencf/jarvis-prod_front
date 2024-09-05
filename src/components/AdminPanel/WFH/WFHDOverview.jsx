import { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";
import { Link, useParams } from "react-router-dom";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import ReportL1Component from "./ReportL1Component";
import WFHDExcelConverter from "./WFHDExcelConverter";

const customStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "12px",
    },
  },
};
const WFHDOverview = () => {
  const whatsappApi = WhatsappAPI();
  const { toastAlert } = useGlobalContext();
  const { ContextDept, RoleIDContext } = useAPIGlobalContext();
  const [allWFHDData, setAllWFHDData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");
  const [remark, setRemark] = useState("");
  const [rowData, setRowData] = useState({});
  const [filterDataS, setFilteredDatas] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    registered: 0,
    document_upload: 0,
    // training: 0,
    onboarded: 0,
  });
  const [trainingDate, setTrainingDate] = useState("");
  const [showOnBoardModal, setShowOnBoardModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchFilter, setSearchFilter] = useState([]);

  const [username, setUserName] = useState("");
  const [usercontact, setUserContact] = useState("");
  const [separationReasonGet, setSeparationReasonGet] = useState([]);
  const [separationUserID, setSeparationUserID] = useState(null);
  const [separationStatus, setSeparationStatus] = useState("Resigned");
  const [separationReason, setSeparationReason] = useState("");
  const [separationRemark, setSeparationRemark] = useState("");
  const [separationReinstateDate, setSeparationReinstateDate] = useState("");
  const [separationResignationDate, setSeparationResignationDate] =
    useState("");
  const [separationLWD, setSeparationLWD] = useState("");
  const [loading, setLoading] = useState(false);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleID = decodedToken.role_id;

  const [ReportL1ModalOpen, setReportModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const [departmentData, setDepartmentData] = useState([]);
  const [deptData, setDeptData] = useState("");
  // const id = useParams()

  //Scrap Asset section Start
  const handleScrap = (row) => {
    setCurrentRow(row);
    setReportModalOpen(true);
  };
  const handleReportL1Close = () => {
    return setReportModalOpen(!ReportL1ModalOpen);
  };

  const getData = async () => {
    setLoading(true);

    const response = await axios.get(baseUrl + "get_all_wfh_users");
    // const deptres = await axios.get(baseUrl + `get_wfh_user/${id.id}`);
    // if (RoleIDContext == 1 || RoleIDContext == 5 || RoleIDContext == 2) {
    if (RoleIDContext == 1 || RoleIDContext == 5) {
      setAllWFHDData(
        response.data.data.filter((item) => item.user_status === "Active")
      );

      const FinalResonse = response.data.data.filter(
        (item) => item.user_status === "Active"
      );

      setLoading(false);

      let filterTabWise = [];
      switch (activeTab) {
        case 0:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "onboarded"
          );
          break;

        case 1:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "document_upload"
          );
          break;

        case 2:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "training"
          );
          break;

        case 3:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "registered"
          );
          break;

        default:
          filterTabWise = FinalResonse.filter(
            (item) => item.att_status == "onboarded"
          );
      }

      setFilteredDatas(filterTabWise);
      setSearchFilter(filterTabWise);
      // } else {
    } else if (RoleIDContext == 2) {
      const deptWiseData = response.data.data?.filter(
        (d) => d.dept_id == ContextDept && d.user_status == "Active"
      );
      setAllWFHDData(deptWiseData);
      setLoading(false);

      let filterTabWise = [];
      switch (activeTab) {
        case 0:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "onboarded"
          );
          break;

        case 1:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "document_upload"
          );
          break;

        case 2:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "training"
          );
          break;

        case 3:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "registered"
          );
          break;

        default:
          filterTabWise = deptWiseData.filter(
            (item) => item.att_status == "onboarded"
          );
      }

      setFilteredDatas(filterTabWise);
      setSearchFilter(filterTabWise);

      setSavedData(response.data.data?.filter((d) => d.dept_id == ContextDept));
    }
    const counts = response.data.data
      .filter((item) => item.user_status === "Active")
      .reduce((acc, curr) => {
        if (
          RoleIDContext == 1 ||
          RoleIDContext == 5 ||
          curr.dept_id == ContextDept
        ) {
          acc[curr.att_status] = (acc[curr.att_status] || 0) + 1;
        }
        return acc;
      }, {});
    setStatusCounts(counts);
  };

  useEffect(() => {
    getData();
  }, []);

  function getFilterData(status) {
    const newData = allWFHDData.filter((item) => item.att_status == status);
    setFilteredDatas(newData);
  }

  const setRowDataFunc = (row) => {
    setRowData(row);
  };

  const trainingFunc = async (e) => {
    e.preventDefault();
    const payload = {
      user: rowData.user_id,
      done_by: userID,
      remark: remark,
      training_date: trainingDate,
    };
    await axios.post(baseUrl + "add_user_training", payload);
    await axios.put(baseUrl + "update_training", {
      user_id: rowData.user_id,
      // att_status: "training",
      att_status: "onboarded",
    });
    setRemark("");
    setTrainingDate("");
    await getData();
  };

  const onboardingFunc = async (e) => {
    e.preventDefault();
    try {
      await axios.put(baseUrl + "update_user", {
        user_id: rowData.user_id,
        att_status: "onboarded",
      });
      setRemark("");
      setShowOnBoardModal(false);
      // setActiveTab(prev =>prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      getData();
    }
  };

  function handleSeprationReason(userId, username, user_contact_no) {
    setSeparationUserID(userId);
    setUserName(username);
    setUserContact(user_contact_no);
    axios
      .get(baseUrl + "get_all_reasons")
      .then((res) => setSeparationReasonGet(res.data));
  }

  function handleSeparationDataPost() {
    axios
      .post(baseUrl + "add_separation", {
        user_id: separationUserID,
        status: separationStatus,
        created_by: userID,
        releaving_date: separationResignationDate,
        last_working_day: separationLWD,
        remark: separationRemark,
        reason: "Exit User",
        // reason: separationReason,
      })
      .then(() => {
        const formData = new FormData();
        formData.append("user_id", separationUserID);
        formData.append("user_status", "Exit");
        axios.put(baseUrl + "update_user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        getData();
        setSeparationReason("");
        setSeparationStatus("");
        setSeparationResignationDate("");
        setSeparationLWD("");
        setSeparationRemark("");
        toastAlert("Separation Added Success");
        whatsappApi.callWhatsAPI(
          "CF_Separation",
          JSON.stringify(usercontact),
          username,
          [username, separationStatus]
        );
      })
      .catch((error) => {
        console.error("There was an error adding the separation!", error);
      });
  }

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();

    const result = searchFilter.filter((d) => {
      const matchesUserName = d.user_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDeptName = d.dept_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDesiName = d.desi_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesJobType = d.job_type
        ?.toLowerCase()
        .includes(lowerCaseSearch);

      return (
        matchesUserName || matchesDeptName || matchesDesiName || matchesJobType
      );
    });

    setFilteredDatas(result);
  }, [search, searchFilter]); // Dependencies

  const FilterTabData = (filterValue) => {
    let filteredData = [];

    switch (filterValue) {
      case "registered":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      case "document_upload":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      case "training":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      case "onboarded":
        filteredData = allWFHDData.filter(
          (option) => option.att_status == filterValue
        );
        break;
      default:
        filteredData = allWFHDData;
    }

    setFilteredDatas(filteredData);
    setSearchFilter(filteredData);
  };

  const capitalizeName = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
      const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
      return firstNameInitial + lastNameInitial;
    }
    return name.charAt(0).toUpperCase();
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Profile",
      cell: (row) => {
        const baseUrl = "https://storage.googleapis.com/jarvis-dev-bucket/";
        const imageUrl = row.image;

        return (
          <div className="eventListBox w-100 avatarBox">
            <div className="avatarImgBox">
              {imageUrl && imageUrl !== baseUrl ? (
                <a
                  href={imageUrl}
                  target="_blank"
                  style={{ height: "100%", width: "100%" }}
                >
                  <img
                    height={40}
                    width={40}
                    src={imageUrl}
                    alt={capitalizeName(row.user_name)}
                  />
                </a>
              ) : (
                <h2>{capitalizeName(row.user_name)}</h2>
              )}
            </div>
          </div>
        );
      },
    },
    {
      name: "User Name",
      cell: (row) => (
        <Link
          to={`/admin/user-single/${row.user_id}`}
          style={{ color: "blue" }}
        >
          {row.user_name}
        </Link>
      ),
      width: "160px",
    },
    {
      name: "Employee ID",
      cell: (row) => row.user_id,
      width: "120px",
    },
    // {
    //   name: "Profile Status",
    //   cell: (row) => row.profile_status + " %",
    //   width: "120px",
    // },
    {
      name: "Status",
      cell: (row) => (
        <>
          {row.user_status === "Active" ? (
            <span
              className="badge badge-success"
              style={{ borderRadius: "50px" }}
            >
              Active
            </span>
          ) : row.user_status === "Exit" || row.user_status === "On Leave" ? (
            <span
              className="badge badge-warning"
              style={{ borderRadius: "50px" }}
            >
              {row.user_status}
            </span>
          ) : row.user_status === "Resign" ? (
            <span
              className="badge badge-danger"
              style={{ borderRadius: "50px" }}
            >
              Resigned
            </span>
          ) : null}
        </>
      ),
      // width: "100px",
    },
    {
      name: "Login ID",
      cell: (row) => row.user_login_id,
    },
    {
      name: "Personal Contact ",
      cell: (row) => row.PersonalNumber,
      width: "200px",
    },
    // {
    //   name: "Alternate Contact Number",
    //   cell: (row) => row.alternate_contact,
    // },
    {
      name: "Department",
      cell: (row) => row.department_name,
      width: "120px",
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
      width: "120px",
    },
    {
      name: "Job Type",
      cell: (row) => row.job_type,
      // width: "100px",
    },
    {
      name: "Email",
      cell: (row) => row.user_email_id,
    },
    // {
    //   name: "Login ID",
    //   cell: (row) => row.user_login_id,
    // },
    roleID !== 2 && {
      name: "Action",
      // width: "260px",

      cell: (row) => (
        <>
          {row.att_status == "registered" ? (
            <>
              {/* <button
                title="Edit user"
                type="button"
                className="btn btn-primary mr-1"
              >
              </button> */}
              <Link to={`/admin/wfhd-update/${row.user_id}`}>
                {/* <EditIcon /> */}
                <div className="icon-1" title="Edit User">
                  <i className="bi bi-pencil"></i>
                </div>
              </Link>
              {/* <button
                title="Bank details"
                type="button"
                className="btn btn-primary mr-1"
              >
              </button> */}
              <Link to={`/admin/wfhd-bank-update/${row.user_id}`}>
                {/* <DetailsIcon /> */}
                <div className="icon-1" title="Bank details">
                  <i className="bi bi-info-square"></i>
                </div>
              </Link>
              {/* <button
                title="Document upload"
                type="button"
                className="btn btn-success"
              >
              </button> */}
              {/* <Link to={`/admin/wfh-update-document/${row.user_id}`}>
                <div className="icon-1" title="Document upload">
                  <i className="bi bi-upload"></i>
                </div>
              </Link> */}
              <Link to={`/admin/wfhd-new-documentcom/${row.user_id}`}>
                <div className="icon-1" title="Document upload">
                  <i className="bi bi-upload"></i>
                </div>
              </Link>
            </>
          ) : row.att_status == "document_upload" ? (
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-success"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => setRowDataFunc(row)}
            >
              Training Done
            </button>
          ) : row.att_status == "training" ? (
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-success"
              // data-toggle="modal"
              // data-target="#exampleModal2"

              onClick={() => {
                setRowDataFunc(row);
                setShowOnBoardModal(true);
              }}
            >
              Onboard
            </button>
          ) : row.att_status == "onboarded" ? (
            <>
              <button
                className="btn cmnbtn btn_sm btn-outline-primary"
                data-toggle="modal"
                data-target="#sepmodal"
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
              <Link to={`/admin/wfhd-bank-update/${row.user_id}`}>
                {/* <DetailsIcon /> */}
                <div className="icon-1" title="Bank details">
                  <i className="bi bi-info-square"></i>
                </div>
              </Link>
              <Link to={`/admin/wfhd-update/${row.user_id}`}>
                {/* <EditIcon /> */}
                <div className="icon-1" title="Edit User">
                  <i className="bi bi-pencil"></i>
                </div>
              </Link>
            </>
          ) : null}
        </>
      ),
      width: "300px",
    },
  ];

  
  useEffect(() => {
    const deptWiseDesi = allWFHDData.filter((d) => d.dept_id == deptData);
    setFilteredDatas(deptWiseDesi);
  }, [deptData]);

  const getWFHDWithCount = async () => {
    const res = await axios.get(baseUrl + "get_wfh_users_with_dept");
    setDepartmentData(res.data.data);
  };
  useEffect(() => {
    getWFHDWithCount();
  }, []);

  const handleExportClick = () => {
    WFHDExcelConverter(filterDataS, "WFHD Users");
  };

  return (
    <>
      <>
        <Modal
          className="Ready to Onboard"
          isOpen={showOnBoardModal}
          onRequestClose={() => setShowOnBoardModal(false)}
          contentLabel="Preview Modal"
          appElement={document.getElementById("root")}
          style={{
            overlay: {
              position: "fixed",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
            },
            content: {
              position: "absolute",

              width: "500px",
              height: "max-content",
              border: "1px solid #ccc",
              background: "#fff",

              borderRadius: "4px",
              outline: "none",
            },
          }}
        >
          <div className="" role="document">
            <div className="">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel2">
                  Onboard user
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span
                    aria-hidden="true"
                    onClick={() => setShowOnBoardModal(false)}
                  >
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <FieldContainer
                  label="Remark"
                  fieldGrid={12}
                  astric
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  required={true}
                ></FieldContainer>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn cmnbtn btn_sm btn-secondary"
                  // data-dismiss="modal"
                  onClick={() => setShowOnBoardModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn cmnbtn btn_sm btn-primary"
                  onClick={onboardingFunc}
                  // data-dismiss="modal"
                  disabled={!remark}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <div>
          <FormContainer mainTitle="My Team" link={"/admin/"} />
          <div className="tab">
            <div
              className={` named-tab  ${activeTab == 3 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("registered"), setActiveTab(3);
              }}
            >
              Pending Document (
              {statusCounts?.registered ? statusCounts?.registered : 0})
            </div>
            <div
              className={`named-tab  ${activeTab == 1 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("document_upload"), setActiveTab(1);
              }}
            >
              Pending Training (
              {statusCounts?.document_upload
                ? statusCounts?.document_upload
                : 0}
              )
            </div>
            {/* <div
                className={`named-tab  ${activeTab == 2 ? "active-tab" : ""}`}
                onClick={() => {
                  FilterTabData("training"), setActiveTab(2);
                }}
              >
                Training ({statusCounts?.training ? statusCounts?.training : 0})
              </div> */}
            <div
              className={`named-tab  ${activeTab == 0 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("onboarded"), setActiveTab(0);
              }}
            >
              Onboarded ({statusCounts?.onboarded ? statusCounts?.onboarded : 0}
              )
            </div>
          </div>
          <div className="tab">
            <div className="form-group col-3">
              <label className="form-label">Department</label>
              <Select
                className=""
                options={[
                  { value: "", label: "All" },
                  ...departmentData.map((option) => ({
                    value: option.dept_id,
                    label: `${option.dept_name} (${option.user_count})`,
                  })),
                ]}
                value={
                  deptData === ""
                    ? { value: "", label: "All" }
                    : {
                        value: deptData,
                        label: departmentData.find(
                          (user) => user.dept_id === deptData
                        )
                          ? `${
                              departmentData.find(
                                (user) => user.dept_id === deptData
                              ).dept_name
                            } (${
                              departmentData.find(
                                (user) => user.dept_id === deptData
                              ).user_count
                            })`
                          : "",
                      }
                }
                onChange={(e) => {
                  const val = e.value;
                  setDeptData(val);
                  if (val === "") {
                    getData();
                  }
                }}
                required
              />
            </div>
            <div className="Tab">
              <button
                onClick={handleScrap}
                className="ml-2 btn btn-warning btn-sm rounded-pill"
              >
                Change Report L1
              </button>
            </div>
          </div>

          <div className="card">
            <div
              className="card-header"
              style={{ justifyContent: "space-between" }}
            >
              Payout User
              <input
                type="text"
                placeholder="Search Here"
                className="form-control"
                value={search}
                style={{ width: "600px" }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleExportClick}
                className="btn cmnbtn btn_sm btn-success"
                variant="text"
                color="success"
                sx={{ fontSize: "30px" }}
                title="Download Excel"
              >
                Export Excel
              </button>
            </div>
            <div className="card-body body-padding">
              <DataTable
                columns={columns}
                data={filterDataS}
                pagination
                paginationPerPage={100}
                //  selectableRows={true}
                paginationDefaultPage={1}
                highlightOnHover
                paginationResetDefaultPage={true}
                striped="true"
                customStyles={customStyles}
              />
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
                    Training Done
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
                    type="date"
                    label="Training Date "
                    astric
                    fieldGrid={12}
                    min={
                      rowData?.joining_date &&
                      rowData?.joining_date.split("T")[0]
                    }
                    value={trainingDate}
                    onChange={(e) => setTrainingDate(e.target.value)}
                  />
                  <FieldContainer
                    label="Remark"
                    fieldGrid={12}
                    astric
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    required={true}
                  ></FieldContainer>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn cmnbtn btn_sm btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn cmnbtn sm_btn btn-primary"
                    onClick={trainingFunc}
                    data-dismiss="modal"
                    disabled={!remark || !trainingDate}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEP Modal */}
        <div
          className="modal fade"
          id="sepmodal"
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
                  astric
                  onChange={(e) => setSeparationStatus(e.target.value)}
                >
                  {/* <option value="">Choose...</option> */}
                  <option value="Resigned">Exit</option>
                  {/* <option value="Resign Accepted">Resign Accepted</option>
                    <option value="On Long Leave">On Long Leave</option>
                    <option value="Subatical">Subatical</option>
                    <option value="Suspended">Suspended</option> */}
                </FieldContainer>
                {/* <FieldContainer
                    label="Reason"
                    Tag="select"
                    value={separationReason}
                    astric
                    onChange={(e) => setSeparationReason(e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {separationReasonGet.map((option) => (
                      <option value={option.id} key={option.id}>
                        {" "}
                        {option.reason}
                      </option>
                    ))}
                  </FieldContainer> */}
                <FieldContainer
                  label="Remark"
                  value={separationRemark}
                  astric
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
                {separationStatus == "Resign Accepted" && (
                  <input
                    label="Last Working Day"
                    className="form-control"
                    style={{ width: "220px" }}
                    type="date"
                    value={separationLWD}
                    max={today}
                    onChange={(e) => setSeparationLWD(e.target.value)}
                  />
                )}
                {/* {separationStatus == "Resigned" && ( */}
                <FieldContainer
                  label="Resignation Date"
                  type="date"
                  value={separationResignationDate}
                  astric
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
                  data-dismiss="modal"
                  disabled={
                    !separationRemark ||
                    !separationStatus ||
                    !separationResignationDate
                  }
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <ReportL1Component
          getData={getData}
          isModalOpenSend={ReportL1ModalOpen}
          onClose={handleReportL1Close}
          rowData={currentRow}
        />
      </>
      {/* ) */}
      {/* } */}
    </>
  );
};

export default WFHDOverview;
