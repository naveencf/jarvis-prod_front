import React, { useEffect, useState } from "react";
import WFHDUsersGrapf from "./WFHDUsersGraph";
import UserCountInCards from "./UserCountInCards";
import SalaryDetailsInLineChart from "./SalaryDetailsInLineChart";
import BirthdayAndWorkAniCard from "./BirthdayAndWorkAniCard";
import NewJoineeAndExitUsers from "./NewJoineeAndExitUsers";
import UserCountWithLPA from "./UserCountWithLPA";
import AgeGraf from "./AgeGraf";
import YearWiseGraph from "./YearWiseGraph";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";

const AnalyticDashboard = () => {
  const [OpenBonus, setHandleOpenExitEmp] = useState(false);
  const [allExitUserData, setExitUserData] = useState([]);
  const handleOpenExitUser = () => {
    setHandleOpenExitEmp(true);
  };
  const handleCloseExitUser = () => {
    setHandleOpenExitEmp(false);
  };
  const allExitUserDatas = () => {
    axios.get(baseUrl + `get_all_history_data`).then((res) => {
      setExitUserData(res.data.data);
    });
  };

  useEffect(() => {
    allExitUserDatas();
  }, []);

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
      width: 150,
    },
    {
      field: "department_name",
      headerName: "Department Name",
      width: 150,
    },
    {
      field: "designation_name",
      headerName: "Designation Name",
      width: 180,
    },
    {
      field: "user_email_id",
      headerName: "Email",
      width: 180,
    },
    {
      field: "job_type",
      headerName: "Job Type",
      width: 100,
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
      field: "salary",
      headerName: "Salary",
      width: 120,
    },
  ];
  return (
    <>
      <div className="action_heading mb12">
        <div className="action_title">
          <FormContainer mainTitle={"WFHD Dashboard"} link={true} />
        </div>
        <div className="action_btns">
          <Link to="/admin/wfhd-register">
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Add Buddy
            </button>
          </Link>
          <Link to="/admin/wfhd-overview">
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              My Team
            </button>
          </Link>
          <Link to="/admin/attendence-mast">
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Create Attendance
            </button>
          </Link>
          <Link to="/admin/salaryWFH">
            <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Payout Summary
            </button>
          </Link>
          <button
            onClick={handleOpenExitUser}
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
          >
            History
          </button>
        </div>
      </div>

      <UserCountInCards />

      <BirthdayAndWorkAniCard />

      <NewJoineeAndExitUsers />

      <div className="row">
        <div className="col">
          <WFHDUsersGrapf />
        </div>
        <div className="col">
          <UserCountWithLPA />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <SalaryDetailsInLineChart />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <AgeGraf />
        </div>
        <div className="col">
          <YearWiseGraph />
        </div>
      </div>

      {/* History MOdal  */}
      <Modal
        isOpen={OpenBonus}
        onRequestClose={handleCloseExitUser}
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
        <button className="btn modalCloseBtn" onClick={handleCloseExitUser}>
          x
        </button>
        {/* All Exit User List  */}
        <div className="thm_table">
          <DataGrid
            rows={allExitUserData}
            columns={ExitUserColumns}
            getRowId={(row) => row?.user_id}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default AnalyticDashboard;
