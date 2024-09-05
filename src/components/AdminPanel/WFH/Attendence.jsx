import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import Slider from "react-slick";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  GridRowModes,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearIcon from "@mui/icons-material/Clear";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";
import { constant } from "../../../utils/constants";
import { Link, Navigate } from "react-router-dom";

const Attendence = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { ContextDept, RoleIDContext } = useAPIGlobalContext();
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  const [remark, setRemark] = useState("");
  const [userData, getUsersData] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);

  const [userName, setUserName] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [completedYearsMonths, setCompletedYearsMonths] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [deptSalary, setDeptSalary] = useState([]);
  
  const [rowUpdateError, setRowUpdateError] = useState(null);

  let isInEditMode = false;
  
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  
  const [workDaysLastDate , setWorkDaysLastDate] = useState()

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  
  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    sliderToScroll: 1,
    // slidesToShow: 1,
    initialSlide: 9,
    swipeToSlide: true,
    variableWidth: true,
  };

  useEffect(() => {
  if (new Date().getMonth() > 3) {
    settings.initialSlide = new Date().getMonth - 4;
  } else {
    settings.initialSlide = new Date().getMonth() + 8;
  }
}, []);

  function gettingSliderData() {
    axios.get(baseUrl + "get_month_year_merged_data").then((res) => {
      setCompletedYearsMonths(res.data.data);
    });
  }

  useEffect(() => {
    axios.get(baseUrl + "all_departments_of_wfh").then((res) => {
      if (RoleIDContext == 1 || RoleIDContext == 5) {
        getDepartmentData(res.data.data);
      } else {
        getDepartmentData(
          res.data.data?.filter((d) => d.dept_id == ContextDept)
        );
      }
    });

    gettingSliderData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + "get_all_wfh_users");
        const data = res.data.data;
        const filteredUser = data.filter((d) => d.dept_id === department);
        if (filteredUser?.length > 0) {
          const firstUser = filteredUser[0];
          setUserName(firstUser);
        } else {
          console.log("No users found for the selected department.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [department]);

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

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    const row = rowModesModel[id];
    if (row.noOfabsent > 30) {
      setRowUpdateError({
        id,
        error: "Absent days cannot be greater than present days.",
      });
      return;
    }

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setRowUpdateError(null);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleAttendence = async () => {
    try {
      setIsButtonDisabled(true)
      await axios.post(baseUrl + "add_attendance", {
        dept: department,
        user_id: userName.user_id,
        noOfabsent: 0,
        month: selectedMonth,
        year: selectedYear,
      });

      setNoOfAbsent("");

      getAttendanceData();
      toastAlert("Submitted success");
    } catch (error) {
      // toastError("Billing header not set for this department");
      // console.error("Error submitting attendance:", error);
      // Handle error as needed
    }
    finally{
      setIsButtonDisabled(false)
    }
  };

  function handleAllDepartmentAttendance() {
    axios
      .post(baseUrl + "save_all_depts_attendance", {
        month: selectedMonth,
        year: selectedYear,
      })
      .then(() => {
        toastAlert("Submitted");
        gettingSliderData();
        getAttendanceData();
        gettingDepartmentSalaryExists();
      });
  }

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  // Function to get the previous month
  const getCurrentMonth = () => {
    const previousMonthIndex = currentDate.getMonth();
    return previousMonthIndex >= 0 ? months[previousMonthIndex] : months[11];
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeusers, setActiveUsers] = useState("");

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  function gettingDepartmentSalaryExists() {
    axios
      .post(baseUrl + "get_distinct_depts", {
        month: selectedMonth,
        year: selectedYear,
      })
      .then((res) => setDeptSalary(res.data));
  }

  const handleCardSelect = (index, data) => {
    setSelectedCardIndex(index);
    setSelectedYear(data.year);
    setSelectedMonth(data.month);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ActiveUsers = await axios.post(
          baseUrl + "get_all_users_counts_with_joining_date",
          {
            month: selectedMonth,
            year: selectedYear,
            dept_id: department,
          }
        );

        const ActiveUsersCount = ActiveUsers?.data?.message?.count;

        setActiveUsers(ActiveUsersCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [department, selectedMonth, selectedYear]);

  

  const getAttendanceData = () => {
    const payload = {
      dept_id: department,
      month: selectedMonth,
      year: selectedYear,
    };
    axios
      .post(baseUrl + "get_salary_by_id_month_year", payload)
      .then((res) => {
        setAttendenceData(res.data.data);
        setFilterData(res.data.data);
      })
      .catch(() => {
        setFilterData([]);
        department &&
          selectedMonth &&
          selectedYear 
          // &&
          // toastError("Attendance not created");
      });
  };


  useEffect(() => {
    if (department || selectedMonth || selectedYear !== "") {
      getAttendanceData();
      gettingDepartmentSalaryExists();
    }
  }, [department, selectedMonth, selectedYear]);

  useEffect(() => {
    if (department) {
      axios.get(`${baseUrl}` + `get_wfh_user/${department}`).then((res) => {
        getUsersData(res.data);
      });
    }
  }, [department]);

  const handleCreateSalary = async (e) => {
    e.preventDefault();
    try {
      await axios.put(baseUrl + "update_attendence_status", {
        month: selectedMonth,
        year: Number(selectedYear),
        dept: department,
      });
      getAttendanceData();
      toastAlert("Attendance Completed");
      setIsFormSubmitted(true)

    } catch (error) {
      console.error("Error updating attendance status", error);
      toastError("Failed to complete attendance");
    }
  };
  

  const processRowUpdate = (newRow) => {
    if (newRow.noOfabsent < 0 || newRow.noOfabsent > newRow.present_days) {
      toastError("Absent days cannot be greater present days.");
      return null;
    } else {
      const updatedRow = { ...newRow, isNew: false };
      // console.log(updatedRow, "update row");
      axios
        .post(baseUrl + "add_attendance", {
          attendence_id: updatedRow.attendence_id,
          dept: updatedRow.dept,
          user_id: updatedRow.user_id,
          // attendence_id: updatedRow.attendence_id,
          noOfabsent: updatedRow.noOfabsent,
          salary_deduction: Number(updatedRow.salary_deduction),
          month: selectedMonth,
          year: selectedYear,
          bonus: Number(updatedRow.bonus),
          remark: remark,
          created_by: userID,
        })
        .then(() => getAttendanceData());
      return updatedRow;
    }
  };

  function getLastDateOfMonth(month, year) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) {
      throw new Error('Invalid month name');
    }
    let nextMonth = new Date(year, monthIndex + 1, 1);
    let lastDateOfMonth = new Date(nextMonth - 1);
    return setWorkDaysLastDate(lastDateOfMonth.getDate())
  }
  useEffect(()=>{
    getLastDateOfMonth(selectedMonth,selectedYear)
  },[selectedMonth,selectedYear])

  const columns = [
    {
      field: "S.NO",
      headernewname: "ID",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "user_name",
      headerName: "Employee Name",
      width: 200,
      type: "text",
    },
    {
      field: "dept_name",
      headerName: "Department",
      type: "text",
      width: 200,
    },
    {
      field: "designation_name",
      headerName: "Designation",
      type: "text",
      width: 200,
    },
    // {
    //   field: "Report_L1Name",
    //   headerName: "Report to L1",
    //   type: "text",
    // },
    // {
    //   field: "Report_L2Name",
    //   headerName: "Report to L2",
    //   type: "text",
    // },
    {
      field: "joining_date",
      headerName: "Joining Date",
      width: 150,
      type: "text",
      renderCell: (params) => {
        const oldDate = params.row.joining_date.split("T");
        const arr = oldDate[0].toString().split("-");
        const newDate = arr[2] + "-" + arr[1] + "-" + arr[0];
        return <div>{newDate}</div>;
      },
    },
    {
      field: "month",
      headerName: "Month",
      type: "text",
    },
    {
      field: "workdays",
      headerName: "Work Days",
      type: "number",
      valueGetter: () => workDaysLastDate,
    },
    {
      field: "noOfabsent",
      headerName: "Absent Days",
      type: "number",
      editable: true,
    },
    // {
    //   field: "present_days",
    //   headerName: "Present Days ",
    //   type: "number",
    //   valueGetter: (params) =>
    //     Number(params.row.present_days) - Number(params.row.noOfabsent),
    // },
    // {
    //   field: "month_salary",
    //   headerName: "Total Salary",
    //   width: 150,
    //   type: "text",
    // },
    {
      field: "salary",
      headerName: "Salary",
      width: 150,
      type: "text",
    },
    {
      field: "bonus",
      headerName: "Bonus",
      type: "Number",
      editable: true,
    },
    {
      field: "salary_deduction",
      headerName: "Deduction",
      type: "Number",
      editable: true,
    },
    // filterData?.length !== 0 &&
    //   filterData[0]?.attendence_generated == 0 && 
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<ClearIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<SaveAsIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(id)}
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
  ];

  const monthToNumber = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months.indexOf(month) + 1;
  };
  
  const currentYearForDis = new Date().getFullYear();
  const currentMonthForDis = new Date().getMonth() + 1;

  if (isFormSubmitted) {
    return <Navigate to="/admin/salaryWFH"/>;
  }
  return (
    <>
      {/* Cards */}
      <FormContainer mainTitle="Create Attendance" link="true"></FormContainer>
      <div className="timeline_wrapper mb24">
        <Slider {...settings} className="timeline_slider">
          {completedYearsMonths.map((data, index) => {
            const cardMonth = monthToNumber(data.month);
            const isFutureCard = data.year > currentYearForDis || (data.year === currentYearForDis && cardMonth >= currentMonthForDis);
            return(
            <div
              className={`timeline_slideItem
                  ${
                    // data.deptCount == departmentdata?.length && "completed"
                  // data.atdGenerated && "completed"
                // }
                RoleIDContext === constant.CONST_MANAGER_ROLE  
                ? data.atdGenerated && "completed" 
                : data.deptCount == departmentdata?.length && "completed"
            } 

                ${selectedCardIndex === index ? "selected" : ""} ${
                  currentMonthForDis === cardMonth+1 && "current"
                  // currentMonthForDis === cardMonth && "current"
                } 
                ${isFutureCard && "disabled"}`
              //    ${
              //   data.atdGenerated && "completed"
              // } ${selectedCardIndex === index ? "selected" : ""} ${
              //   currentMonth == data.month && "current"
              // }`
            }
              onClick={() => handleCardSelect(index, data)}
              key={index}
            >
              <h2>
                {data.month} <span>{data.year}</span>
              </h2>
              <h3>
                {data?.atdGenerated == 1 ? (
                  <span>
                    <i className="bi bi-check2-circle" />
                  </span>
                ) : currentMonthNumber - 5 - index < 0 ? (
                  <span>
                    <i className="bi bi-clock-history" />
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-hourglass-top" />
                  </span>
                )}
                { RoleIDContext === constant.CONST_MANAGER_ROLE ?
                 data.atdGenerated == 1
                  ? "Completed"
                  : currentMonthNumber - 5 - index < 0
                  ? "Upcoming"
                  : "Pending"
                  : data.deptCount == departmentdata?.length
                  ? "Completed"
                  : currentMonthNumber - 5 - index < 0
                  ? "Upcoming"
                  : "Pending"}
              </h3>
            </div>)
})}
        </Slider>
      </div>
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4>Department</h4>
          <span className="d-flex gap4">
            {filterData?.length !== 0 &&
              filterData[0]?.attendence_generated == 0 && (
                <button
                  onClick={(e) => handleCreateSalary(e)}
                  className="btn btn-success"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  Complete Attendance
                </button>
              )}
            {filterData?.length == 0 &&
              department &&
              selectedMonth &&
              selectedYear && (
                <button
                  onClick={handleAttendence}
                  disabled={isButtonDisabled}
                  className="btn  cmnbtn btn_sm btn-danger"
                >
                  No Absents, Create Attendance{" "}
                  <i className="bi bi-arrow-right"></i>
                </button>
              )}
            {/* {deptSalary?.length !== departmentdata?.length &&
              (RoleIDContext == 1 || RoleIDContext == 5) && (
                <button
                  className="btn  cmnbtn btn_sm btn-primary"
                  onClick={handleAllDepartmentAttendance}
                >
                  Create All Department Attendance{" "}
                  <i className="bi bi-check-all"></i>
                </button>
              )} */}
          </span>
        </div>
        <div className="card-body">
          <div
            className="d-flex gap4"
            style={{ flexWrap: "wrap", gap: "10px" }}
          >
            {departmentdata.map((option) => {
              const isDeptInSalary =
                Array.isArray(deptSalary) &&
                deptSalary.some((d) => d.dept === option.dept_id);

              // const 
              // className = `btn ${
              //   department === option.dept_id
              //     ? "btn-primary"
              //     : isDeptInSalary
              //     ? "btn-outline-primary"  
              //     : "btn-outline-primary"
              // }`;

              return (
                <div
                  // className="card hover body-padding"
                  className={`card hover body-padding ${
                    department === option.dept_id
                      ? "btn-primary"
                      : isDeptInSalary
                      ? "btn-success"
                      : "btn-outline-primary"
                  }`}
                  style={{
                    height: "100px",
                    minWidth: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                    border: "1px solid var(--primary)",
                    padding: "10px",
                  }}
                  onClick={() => setDepartment(option.dept_id)}
                >
                  <div
                    className="pack  "
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div className="rounded-circle circle-card">
                      <i class="bi bi-bounding-box"></i>
                    </div>
                    {option.dept_name}
                  </div>
                </div>
              );
            })}
          </div>

          <h6 style={{ color: "green", paddingTop: "10px" }}>
            {/* <span>Active : {activeusers}</span> */}
            <span>Active : {filterData?.length}</span>
          </h6>
        </div>
      </div>

      <div className="card body-padding">
        <div className="data_tbl table-responsive footer_none thm_table">
          {filterData?.length > 0 && (
            <DataGrid
              rows={filterData}
              getRowId={(row) => row._id}
              columns={columns}
              slots={{
                toolbar: GridToolbar,
              }}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
            />
          )}
          {/* <Pagination count={10} /> */}
        </div>
      </div>
    </>
  );
};

export default Attendence;
