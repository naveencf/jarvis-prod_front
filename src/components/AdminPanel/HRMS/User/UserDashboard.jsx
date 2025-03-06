import axios from "axios";
import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { BuildingOffice, HouseLine, UsersThree } from "@phosphor-icons/react";
import ApexCharts from "react-apexcharts"; // Import ApexCharts
import { motion } from "framer-motion";
import FormContainer from "../../FormContainer";
import { baseUrl } from "../../../../utils/config";
import BirthdayAndWorkAniverseryWFO from "./UserDashboard/BirthdayAndWorkAniverseryWFO";
import NewJoineeAndExitUsersWFO from "./UserDashboard/NewJoineeAndExitUsersWFO";
import DepartmentWiseMaleFemaleCountWFO from './UserDashboard/DepartmentWiseMaleFemaleCountWFO'
import UserCountWithLPAWFO from "./UserCountWithLPAWFO";
import AgeGrafWFO from './UserDashboard/AgeWiseGrafWFO'
import MonthWiseJoinee from "./UserDashboard/MonthWiseJoinee";





 const UserDashPieChart = lazy(() => import("./UserDashPieChart"));

const UserDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [wFOCount, setWFOCount] = useState([]);
  const [wfhdCount, setWfhdCount] = useState([]);
  const [wFhCount, setWFhCount] = useState([]);
  const [activeUserCount, setActiveUserCount] = useState([]);
  const [exitUserCount, setExiteUserCount] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCard = (jobtype) => {
    setIsModalOpen(true);
    const filteredData = userData.filter((user) => user.job_type === jobtype);
    setSelectedRow(filteredData);
  };

  // API calls using Promise.all for efficiency
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [usersRes, departmentsRes] = await Promise.all([
          axios.get(`${baseUrl}get_all_users`),
          axios.get(`${baseUrl}get_all_departments`),
        ]);

        const data = usersRes.data.data;
        setUserData(data.filter((d) => d.user_status === "Active"));
        setWFOCount(
          data.filter((d) => d.job_type === "WFO" && d.user_status === "Active")
        );
        setWfhdCount(
          data.filter(
            (d) =>
              d.job_type === "WFHD" &&
              d.user_status === "Active" &&
              d.att_status === "onboarded"
          )
        );
        setWFhCount(
          data.filter((d) => d.job_type === "WFH" && d.user_status === "Active")
        );
        setActiveUserCount(data.filter((d) => d.user_status === "Active"));
        setExiteUserCount(data.filter((d) => d.user_status === "Exit"));
        setDepartmentData(departmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [designationData, setDesignationData] = useState([]);
  const [subDepartmentData, setSubDeparmentData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  // Consolidate data fetching in one effect using async/await
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designationRes, subDepartmentRes, roleRes] = await Promise.all([
          axios.get(`${baseUrl}get_all_designations`),
          axios.get(`${baseUrl}get_all_sub_departments`),
          axios.get(`${baseUrl}get_all_roles`),
        ]);
        setDesignationData(designationRes.data.data);
        setSubDeparmentData(subDepartmentRes.data);
        setRoleData(roleRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ApexChart options for Bar Chart
  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Department", "Sub Department", "Designation", "Role"],
    },
  };

  const barChartData = [
    {
      name: "Count",
      data: [
        departmentData.length,
        subDepartmentData.length,
        designationData.length,
        roleData.length,
      ],
    },
  ];

  // ApexChart options for Pie Chart
  const pieChartOptions = {
    labels: ["WFO", "WFH", "WFHD"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const pieChartData = [wFOCount.length, wFhCount.length, wfhdCount.length];

  // Helper function to render cards
  const renderCard = (title, count, link, icon) => (
    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12">
      <motion.div
        className="box"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="card text-center">
          <Link to={`/admin/user-overview/${link}`}>
            <div className="card-body pb20">
              <div className={`iconBadge bg${title}Light`}>
                <span>{icon}</span>
              </div>
              <h6 className="colorMedium">{title}</h6>
              <h3 className="mt8">{count}</h3>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="action_heading mb12">
        <div className="action_title">
          <FormContainer mainTitle="User Dashboard" link="/" />
        </div>
        <Link to="/admin/user-login-history">
          <button className="btn btn-primary btn-sm">Login History</button>
        </Link>
      </div>

      {/* User Cards */}
      <div className="row">
        {renderCard(
          "All Users",
          userData.length,
          "Active",
          <UsersThree weight="duotone" />
        )}
        {renderCard(
          "WFO",
          wFOCount.length,
          "WFO",
          <BuildingOffice color="var(--secondary)" />
        )}
        {renderCard(
          "WFH",
          wFhCount.length,
          "WFH",
          <HouseLine className="bgTertiaryLight" />
        )}
        {renderCard(
          "WFHD",
          wfhdCount.length,
          "WFHD",
          <BuildingOffice className="bgSuccessLight" color="var(--success)" />
        )}
      </div>

      {/* Birthday & Work-Anniversary, New Joinees and Exits */}
      <BirthdayAndWorkAniverseryWFO />
      <NewJoineeAndExitUsersWFO />
      <DepartmentWiseMaleFemaleCountWFO />

      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Active Users with Count</h5>
            </div>
            <ApexCharts
              options={pieChartOptions}
              series={pieChartData}
              type="pie"
              width={600}
              height={261} // Set height to match bar chart
            />
          </div>
        </div>

        <div className="col">
          <AgeGrafWFO />
        </div>
      </div>

      {/* Bar and Pie Charts */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Departments with Count</h5>
            </div>
            <ApexCharts
              options={barChartOptions}
              series={barChartData}
              type="bar"
              width={600}
              height={260} // Set height to 300px
            />
          </div>
        </div>

        <div className="col">
          <MonthWiseJoinee />
        </div>
      </div>

      {/* User Count with LPA */}
      <div className="row">
        <div className="col">
          <UserCountWithLPAWFO />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
