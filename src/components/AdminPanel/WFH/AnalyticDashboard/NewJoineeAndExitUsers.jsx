import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import Modal from "react-modal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import ReJoinReusable from "../../User/ReJoinReusable";

const NewJoineeAndExitUsers = () => {
  const [newJoineeData, setNewJoineeData] = useState([]);
  const [exitUserData, setExistUserData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [allExitUserData, setAllExitUsers] = useState([]);
  const [allWFHDUsersData, setAllWFHDUsersData] = useState([]);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const allExitUserDatas = () => {
    axios.get(baseUrl + `get_exit_of_wfhd_users`).then((res) => {
      setExistUserData(res.data.data);
    });
  };
  const allWFHDExitUsers = () => {
    axios.get(baseUrl + `get_all_exit_users_of_wfhd`).then((res) => {
      setAllExitUsers(res.data.data);
      console.log(res.data.data, "new lalit exit");
    });
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

  useEffect(() => {
    allExitUserDatas();
    allWFHDExitUsers();
  }, []);

  const getNewJoinersData = async () => {
    const res = await axios.get(baseUrl + "get_newjoinee_of_wfhd_users");
    setNewJoineeData(res.data.data);
  };
  const getAllWFHDUsers = async () => {
    const res = await axios.get(baseUrl + "get_all_wfh_users");
    const FinalResonse = res.data.data.filter(
      (item) => item.user_status === "Active" && item.att_status === "onboarded"
    );
    setAllWFHDUsersData(FinalResonse);
  };
  useEffect(() => {
    getNewJoinersData();
    getAllWFHDUsers();
  }, []);

  const capitalizeName = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
      const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
      return firstNameInitial + lastNameInitial;
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // MODAL
  const ExitUserColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = allExitUserData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 250,
    },
    {
      field: "dept_name",
      headerName: "Department Name",
      width: 250,
    },
    {
      field: "Gender",
      headerName: "Gender",
      width: 120,
    },
    {
      field: "DOB",
      headerName: "DOB",
      width: 150,
      valueGetter: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "releaving_date",
      headerName: "Releaving Date",
      width: 150,
      valueGetter: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "Re-Join",
      headerName: "Re-Join",
      width: 100,
      renderCell: (params) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-danger"
          onClick={() => handleReJoin(params.row.user_id)}
        >
          Re-Join
        </button>
      ),
    },
  ];

  const AllUsers = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = allWFHDUsersData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 250,
    },
    {
      field: "dept_name",
      headerName: "Department Name",
      width: 250,
    },
    {
      field: "Gender",
      headerName: "Gender",
      width: 120,
    },
    {
      field: "DOB",
      headerName: "DOB",
      width: 150,
      valueGetter: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "joining_date",
      headerName: "Joining Date",
      width: 150,
      valueGetter: (params) => {
        return formatDate(params.value);
      },
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="card">
            <div
              className="card-header d-flex"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <h5 class="card-title">New Joiners</h5>
              </div>
              <div>
                <h6
                  className="anchorBadge"
                  onClick={() => handleOpenModal("newJoiners")}
                >
                  View All Employees
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="eventListArea">
                {newJoineeData.map((d) => (
                  <div className="eventListBox w-100 avatarBox">
                    <div className="avatarImgBox">
                      {/* <img src={imageTest1} alt="img" /> */}
                      <h2>{capitalizeName(d.user_name)}</h2>
                    </div>
                    <div className="avatarTextBox w-100">
                      <h4 className="w-100 flexCenterBetween">
                        {d.user_name} <span>{d.joining_date}</span>
                      </h4>
                      <h5>{d.dept_name} - Indore</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="card">
            <div
              className="card-header f-flex"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <h5 class="card-title">Exit Users</h5>
              </div>
              <div>
                <h6
                  className="anchorBadge"
                  onClick={() => handleOpenModal("exitUsers")}
                >
                  View All Employees
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="eventListArea">
                {exitUserData.map((d) => (
                  <div className="eventListBox w-100 avatarBox">
                    <div className="avatarImgBox">
                      {/* <img src={imageTest1} alt="img" /> */}
                      <h2>{capitalizeName(d.user_name)}</h2>
                    </div>
                    <div className="avatarTextBox w-100">
                      <h4 className="w-100 flexCenterBetween">
                        {d.user_name} <span>{d.releaving_date}</span>
                      </h4>
                      <h5>{d.dept_name} - Indore</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Example Modal"
        appElement={document.getElementById("root")}
        style={{
          content: {
            width: "60%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <button
          className="btn btn-danger mb-3 float-right"
          onClick={handleCloseModal}
        >
          x
        </button>
        {modalType === "exitUsers" ? (
          <DataGrid
            rows={allExitUserData}
            columns={ExitUserColumns}
            getRowId={(row) => row?.user_id}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        ) : (
          <DataGrid
            rows={allWFHDUsersData}
            columns={AllUsers}
            getRowId={(row) => row?.user_id}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        )}
      </Modal>

      {/* Re-Join Modal here  */}
      <ReJoinReusable
        getData={allExitUserDatas}
        reJoinModalOpen={reJoinModalOpen}
        reJoinClose={reJoinClose}
        id={rejoinID}
      />
    </>
  );
};

export default NewJoineeAndExitUsers;
