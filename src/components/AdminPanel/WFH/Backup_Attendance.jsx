import { useEffect, useState } from "react";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { baseUrl } from "../../../utils/config";

const Backup_Attendence = () => {
  const { toastAlert } = useGlobalContext();
  const [department, setDepartment] = useState("");
  const [userName, setUserName] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  const [bonus, setBonus] = useState("");
  const [remark, setRemark] = useState("");
  const [userData, getUsersData] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const years = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Function to get the previous month
  const getPreviousMonth = () => {
    const previousMonthIndex = currentDate.getMonth() - 1;
    return previousMonthIndex >= 0 ? months[previousMonthIndex] : months[11];
  };

  // Set the initial state for selectedMonth and selectedYear using the current date
  const [selectedMonth, setSelectedMonth] = useState(getPreviousMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeusers, setActiveUsers] = useState("");

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    axios.get(baseUrl + "allwfhusers").then((res) => {
      const data = res.data.data;
      const filteredUser = data.filter(
        (d) => d.dept_id === department && d.user_status
      );
      setActiveUsers(filteredUser);
    });
  }, [department]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  }, []);

  const getAttendanceData = () => {
    console.log("reach");
    const payload = {
      dept_id: department,
      month: selectedMonth,
      year: selectedYear,
    };
    axios
      .post(baseUrl + "salaryfromattendence", payload)
      .then((res) => {
        console.log(res.data, "res");
        setAttendenceData(res.data.data);
        setFilterData(res.data.data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toastAlert("Failed to submit data");
      });
  };

  useEffect(() => {
    if (department || selectedMonth || selectedYear !== "") {
      getAttendanceData();
    }
  }, [department, selectedMonth, selectedYear]);

  useEffect(() => {
    if (department) {
      axios
        .get(`${baseUrl}` + `getuserdeptwisewfhdata/${department}`)
        .then((res) => {
          getUsersData(res.data);
        });
    }
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "attendencemastpost", {
        dept: department,
        user_id: userName,
        noOfabsent: Number(noOfAbsent),
        month: selectedMonth,
        year: selectedYear,
        bonus: Number(bonus),
        remark: remark,
        created_by: userID,
      })
      .then(() => {
        setNoOfAbsent("");
        setRemark("");
        setBonus("");
        toastAlert("Submitted success");
        getAttendanceData();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toastAlert("Failed to submit data");
      });
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Employee Name",
      cell: (row) => row.user_name,
      width: "12%",
    },
    {
      name: "Work Days",
      width: "8%",
      cell: () => 30,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    {
      name: "Absent Days",
      cell: (row) => row.noOfabsent,
    },
    {
      name: "Present Days",
      cell: (row) => 30 - Number(row.noOfabsent),
    },
    {
      name: "Total Salary",
      cell: (row) => row.total_salary + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
            // Assuming row.bonus is a numeric value
            return total + Number(rows.total_salary);
          }, 0),
      },
    },
    {
      name: "Bonus",
      cell: (row) => row.bonus + " ₹",
      footer: {
        cell: (row) => {
          const totalBonus = row.reduce((total, rows) => {
            // Assuming row.bonus is a numeric value
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },

    {
      name: "Net Salary",
      cell: (row) => row.net_salary + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
      width: "7%",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay + " ₹",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Attendance"
        title="Attendance"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-4">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={departmentdata.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: department,
              label:
                departmentdata.find((user) => user.dept_id === department)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              setDepartment(e.value);
            }}
            required
          />
          <span style={{ color: "green" }}>Active : {activeusers.length}</span>
        </div>

        <div className="form-group col-4">
          <label className="form-label">Month</label>
          <Select
            options={months.map((month) => ({
              value: month,
              label: month,
            }))}
            value={{
              value: selectedMonth,
              label: selectedMonth,
            }}
            onChange={(e) => setSelectedMonth(e.value)}
            required
          />
        </div>

        <div className="form-group col-4">
          <label className="form-label">Year</label>
          <Select
            options={years.map((year) => ({
              value: year,
              label: `${year}`,
            }))}
            value={{
              value: selectedYear,
              label: selectedYear,
            }}
            onChange={(e) => setSelectedYear(e.value)}
            required
          />
        </div>

        <div className="col-12 ">
          <hr />
        </div>

        <div className="form-group col-3">
          <label className="form-label">Employee Name</label>
          <Select
            options={userData?.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: userName,
              label:
                userData?.find((user) => user.user_id == userName)?.user_name ||
                "",
            }}
            onChange={(e) => setUserName(e.value)}
            required
          />
        </div>

        <FieldContainer
          label="Number of Absent"
          fieldGrid={3}
          type="number"
          value={noOfAbsent}
          onChange={(e) => setNoOfAbsent(Number(e.target.value))}
        />
        <FieldContainer
          label="Bonus (₹)"
          fieldGrid={3}
          type="number"
          value={bonus}
          required={false}
          onChange={(e) => setBonus(e.target.value)}
        />
        <FieldContainer
          required={false}
          label="Remark"
          fieldGrid={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          {filterData.length > 0 && (
            <DataTable
              title="Salary Overview"
              columns={columns}
              data={filterData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              exportToCSV
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Backup_Attendence;
