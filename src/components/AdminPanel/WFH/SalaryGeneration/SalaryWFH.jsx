import { useState, useEffect } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DataTable from "react-data-table-component";
import axios from "axios";
import FormContainer from "../../FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

import jwtDecode from "jwt-decode";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/i3.png";
import image4 from "./images/i4.png";
import image5 from "./images/image5.png";
import Slider from "react-slick";
import * as XLSX from "xlsx";
import { Document, PDFDownloadLink, Page, View } from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";
import { Button } from "@mui/material";
import { generatePDF } from "./pdfGenerator";
import { useLocation, Link } from "react-router-dom";
import FieldContainer from "../../FieldContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { baseUrl } from "../../../../utils/config";
import { downloadSelectedInvoices } from "./ZipGenerator";
import { FaEye } from "react-icons/fa6";

const images = [
  { temp_id: 1, image: image1 },
  { temp_id: 2, image: image2 },
  { temp_id: 3, image: image3 },
  { temp_id: 4, image: image4 },
  { temp_id: 5, image: image5 },
];

const SalaryWFH = () => {
  const location = useLocation();
  const { toastAlert, toastError } = useGlobalContext();
  const { contextData, ContextDept, RoleIDContext } = useAPIGlobalContext();

  const [allWFHUsers, setAllWFHUsers] = useState(0);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [salaryMonthYearData, setSalaryMonthYearData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [userName, setUserName] = useState(0);
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  const [userData, getUsersData] = useState([]);
  const [departmentWise, setDepartmentWise] = useState([]);
  const [selectedTemplate, setSelectedTempate] = useState("");
  const [templateState, setTemplateState] = useState(null);

  const [thisMonthTotalSalary, setThisMonthTotalSalary] = useState(0);
  const [thisMonthSalary, setThisMonthSalary] = useState(0);
  const [thisMonthTotalBonus, setThisMonthTotalBonus] = useState(0);
  const [thisMonthTotalDeductions, setThisMonthTotalDeductions] = useState(0);
  const [thisMonthTDS, setThisMonthTDS] = useState(0);
  const [employeeLeft, SetEmployeeLeft] = useState([]);

  const [card2Data, setCard2Data] = useState(null);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const roleID = decodedToken.role_id;
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [rowData, setDataRow] = useState(null);
  const [rowDataModal, setRowDataModal] = useState(null);

  //harshal
  const [completedYearsMonths, setCompletedYearsMonths] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [navigateCardIndex, setNavigateCardIndex] = useState(null);

  //cards
  const [newJoineeCount, setNewJoineeCount] = useState([]);

  //salary exits dept wise
  const [deptSalary, setDeptSalary] = useState([]);

  const [separationReasonGet, setSeparationReasonGet] = useState([]);
  const [separationStatus, setSeparationStatus] = useState("");
  const [separationReason, setSeparationReason] = useState("");
  const [separationRemark, setSeparationRemark] = useState("");
  const [separationUserID, setSeparationUserID] = useState(null);
  const [usercontact, setUserContact] = useState("");
  const [separationResignationDate, setSeparationResignationDate] =
    useState("");
  const [separationLWD, setSeparationLWD] = useState("");
  const [separationReinstateDate, setSeparationReinstateDate] = useState("");

  const [activeTab, setActiveTab] = useState(0);

  const [selectedRows, setSelectedRows] = useState([]);
  const [workDaysLastDate, setWorkDaysLastDate] = useState(0);

  const [pendingFinanceCount, setPendingFinanceCount] = useState("");

  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    // slidesToShow: 8,
    slidesToScroll: 1,
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

  useEffect(() => {
    if (location.state) {
      const { DashDepartment, DashMonth, DashYear } = location.state;
      setDepartment(Number(DashDepartment));
      setMonth(DashMonth);
      setYear(Number(DashYear));
      setNavigateCardIndex(Number(DashDepartment));
    }
  }, []);

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

  const [showAlldeptMonthWiseData, setShowAlldeptMonthWiseData] = useState([]);
  useEffect(() => {
    axios.get(baseUrl + "current_month_all_dept_total_salary").then((res) => {
      setShowAlldeptMonthWiseData(res.data.data);
    });
  }, []);
  const [singleDeptWholeYearSalaryData, setSingleDeptWholeYearSalaryData] =
    useState([]);
  useEffect(() => {
    axios
      .get(baseUrl + `single_dept_whole_year_total_salary/${department}`)
      .then((res) => {
        setSingleDeptWholeYearSalaryData(res.data.data);
      });
  }, [department]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + "get_all_wfh_users");

        const data = res.data.data;

        setAllWFHUsers(
          data.filter(
            (d) => d.att_status == "onboarded" && d.user_status == "Active"
          )
        );
        const filteredUser = data.filter((d) => d.dept_id === department);
        if (filteredUser?.length > 0) {
          const firstUser = filteredUser[0];
          setUserName(firstUser);
        } else {
          // console.log("No users found for the selected department.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [department]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ActiveUsers = await axios.post(
          baseUrl + "get_all_users_counts_with_joining_date",
          {
            month: month,
            year: year,
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
  }, [department, month, year]);

  function gettingSliderData() {
    axios.get(baseUrl + "get_month_year_merged_data").then((res) => {
      setCompletedYearsMonths(res.data.data);
    });
  }

  useEffect(() => {
    axios.get(baseUrl + "all_departments_of_wfh").then((res) => {
      if (RoleIDContext === 1 || RoleIDContext === 5) {
        getDepartmentData(res.data.data);
      } else {
        getDepartmentData(
          res.data.data?.filter((d) => d.dept_id == ContextDept)
        );
      }
    });

    //harshal
    gettingSliderData();
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_all_users`).then((res) => {
      getUsersData(res.data.data);
    });
    if (department) {
      axios
        .get(`${baseUrl}` + `get_user_by_deptid/${department}`)
        .then((res) => {
          setDepartmentWise(res.data);
        });
    }
  }, [department]);

  //harshal.. calculating monthly salary
  useEffect(() => {
    const sumMonth = data?.reduce((acc, obj) => acc + parseFloat(obj.toPay), 0);
    const sumSalary = data?.reduce(
      (acc, obj) => acc + parseFloat(obj.salary),
      0
    );
    const sumBonus = data?.reduce((acc, obj) => acc + parseFloat(obj.bonus), 0);
    const sumDeductions = data?.reduce(
      (acc, obj) => acc + parseFloat(obj.salary_deduction),
      0
    );
    const sumTDSDeductions = data?.reduce(
      (acc, obj) => acc + parseFloat(obj.tds_deduction),
      0
    );
    setThisMonthTotalSalary(sumMonth);
    setThisMonthSalary(sumSalary);
    setThisMonthTotalBonus(sumBonus);
    setThisMonthTotalDeductions(sumDeductions);
    setThisMonthTDS(sumTDSDeductions);
  }, [data]);

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = new Date().getMonth() + 1;
  // Function to get the previous month
  const getPreviousMonth = () => {
    const previousMonthIndex = currentDate.getMonth() - 1;
    return previousMonthIndex >= 0 ? months[previousMonthIndex] : months[11];
  };

  const [selectedMonth, setSelectedMonth] = useState(getPreviousMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [activeusers, setActiveUsers] = useState("");

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  const monthNameToNumber = (monthName) => {
    const months = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    // Convert the input month name to title case for consistent matching
    const titleCaseMonth =
      monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

    return months[titleCaseMonth] || "Invalid Month";
  };

  const conditionalRowStyles = [
    {
      when: (row) => Number(row.toPay) > 1.2 * Number(row.salary),
      style: {
        backgroundColor: "rgba(242, 38, 19, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  function monthNameToNumberAndEndDate(monthName) {
    const months = {
      January: { number: "01", days: 31 },
      February: { number: "02", days: 28 },
      March: { number: "03", days: 31 },
      April: { number: "04", days: 30 },
      May: { number: "05", days: 31 },
      June: { number: "06", days: 30 },
      July: { number: "07", days: 31 },
      August: { number: "08", days: 31 },
      September: { number: "09", days: 30 },
      October: { number: "10", days: 31 },
      November: { number: "11", days: 30 },
      December: { number: "12", days: 31 },
    };

    const titleCaseMonth =
      monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    const monthInfo = months[titleCaseMonth];

    if (monthInfo) {
      return {
        monthNumber: monthInfo.number,
        endDate: monthInfo.days,
      };
    } else {
      return "Invalid Month";
    }
  }

  // const handleCardSelect = (index, data) => {
  //   const monthMap = {
  //     January: 'February',
  //     February: 'March',
  //     March: 'April',
  //     April: 'May',
  //     May: 'June',
  //     June: 'July',
  //     July: 'August',
  //     August: 'September',
  //     September: 'October',
  //     October: 'November',
  //     November: 'December',
  //     December: 'January'
  //   };
  // setSelectedCardIndex(index);
  // setYear(data.year);
  // setMonth(data.month);
  // setMonth(monthMap[data.month]);
  // setSelectedYear(data.year);
  // setSelectedMonth(data.month);
  // };
  const handleCardSelect = (index, data) => {
    setSelectedCardIndex(index);
    setYear(data.year);
    setMonth(data.month);
    setSelectedYear(data.year);
    setSelectedMonth(data.month);
  };

  const handleMonthYearData = async () => {
    try {
      const response = await axios.post(baseUrl + "get_salary_by_month_year", {
        month: month,
        year: Number(year),
      });
      const data = response.data.data;
      setSalaryMonthYearData(data);
    } catch (error) {
      // console.log("Api No respnose", error);
    }
  };

  //Create all Department Salary
  function handleAllDepartmentSalary() {
    axios
      .post(baseUrl + "save_all_depts_attendance", {
        month: month,
        year: year,
      })
      .then(() => {
        toastAlert("Submitted");
        gettingSliderData();
        handleSubmit();
        gettingDepartmentSalaryExists();
      });
  }

  function handleInvoiceNumber(data) {
    const formData = new FormData();

    formData.append("user_id", data.user_id);
    formData.append("invoice_template_no", selectedTemplate);

    axios
      .put(`${baseUrl}` + `update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => handleSubmit());
  }

  useEffect(() => {
    const result = data.filter((d) => {
      return d.user_name?.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    if (month || year !== "") {
      handleMonthYearData();
      gettingDepartmentSalaryExists();
    }

    // if (department !== "" && month !== "" && year !== "") {
    axios
      .get(baseUrl + "get_total_salary")
      .then((res) => setCard2Data(res.data.data[0]));

    axios
      .post(baseUrl + "left_employees", {
        dept_id: department,
        month: month,
        year: year,
      })
      .then((res) => SetEmployeeLeft(res.data));
    // }

    axios
      .post(baseUrl + "new_joiners", {
        dept_id: department,
        month: month,
        year: year,
      })
      .then((res) => setNewJoineeCount(res.data));

    axios
      .post(baseUrl + "check_salary_status", {
        month: month,
        year: year,
        dept: department,
      })
      .then(
        (res) =>
          res.data.salary_status == 1 ? handleSubmit() : setFilterData([]),
        setData([])
      );
  }, [department, month, year]);

  function gettingDepartmentSalaryExists() {
    axios
      .post(baseUrl + "get_distinct_depts", {
        month: month,
        year: year,
      })
      .then((res) => setDeptSalary(res.data));
  }

  // const handleAttendance = async () => {
  //   try {
  //     await axios.post(baseUrl + "add_attendance", {
  //       dept: department,
  //       user_id: userName.user_id,
  //       noOfabsent: 0,
  //       month: month,
  //       year: year,
  //     });
  //     await axios.put(baseUrl + "update_attendence_status", {
  //       month: month,
  //       year: Number(year),
  //       dept: department,
  //     });

  //     setNoOfAbsent("");
  //     handleSubmit();
  //     toastAlert("Submitted success");
  //   } catch (error) {
  //     toastError("Billing header not set for this department");
  //   }
  // };

  const handleAttendance = async () => {
    try {
      const monthNames = [
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

      let selectedMonth = monthNames.indexOf(month);
      let selectedYear = Number(year);
      let date = new Date(selectedYear, selectedMonth);
      date.setMonth(date.getMonth() + 1);

      let newMonth = monthNames[date.getMonth()];
      let newYear = date.getFullYear();

      await axios.post(baseUrl + "add_attendance", {
        dept: department,
        user_id: userName.user_id,
        noOfabsent: 0,
        month: newMonth,
        year: newYear,
      });
      await axios.put(baseUrl + "update_attendence_status", {
        month: newMonth,
        year: newYear,
        dept: department,
      });

      setNoOfAbsent("");
      handleSubmit();
      toastAlert("Submitted success");
    } catch (error) {
      toastError("Billing header not set for this department");
    }
  };

  const FilterTabData = (filterValue) => {
    let filteredData = [];

    switch (filterValue) {
      case "Send To Finance":
        filteredData = data.filter((option) => option.sendToFinance == 0);
        break;
      case "Verification Pending":
        filteredData = data.filter(
          (option) => option.sendToFinance == 1 && option.status_ == 0
        );
        break;
      case "Verified":
        filteredData = data.filter(
          (option) => option.sendToFinance == 1 && option.status_ == 1
        );
        break;
      default:
        filteredData = data;
    }

    setFilterData(filteredData);
  };

  const handleSubmit = async () => {
    try {
      setFilterData([]);
      setData([]);
      const res = await axios.post(baseUrl + "get_salary_by_id_month_year", {
        dept_id: department,
        month: month,
        year: Number(year),
      });
      const response = res.data.data;
      setFilterData(response.filter((option) => option.sendToFinance == 0));
      setData(response);
      setPendingFinanceCount(
        response.filter(
          (d) => d.attendence_status_flow === "Pending From Finance"
        ).length
      );
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleInvoice = (data) => {
    setDataRow(data);
  };

  const styles = StyleSheet.create({
    logo: {
      alignItems: "center",
      flexDirection: "row",
      color: "#4b5563",
      marginBottom: 10,
    },
    logoName: {
      marginLeft: 10,
      fontWeight: 600,
      fontSize: "25px",
    },
    page: {
      fontFamily: "Helvetica",
      fontSize: 12,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      backgroundColor: "pink",
      padding: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    invoiceInfo: {
      flexDirection: "column",
    },
    invoiceDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    clientInfo: {
      marginTop: 10,
      lineHeight: 2,
    },
    table: {
      flexDirection: "column",
      marginTop: 20,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableRow2: {
      flexDirection: "row",

      borderBottomWidth: 1,
      borderColor: "#000",
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableHeader: {
      backgroundColor: "pink",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      textAlign: "center",
    },

    totals: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: "center",
      fontSize: 10,
      color: "gray",
    },
    // Styles for the TDS and Net Invoice sections
    tdsSection: {
      marginTop: 10,
      borderTop: "1px solid #ccc",
      padding: "5px 0",
    },

    netInvoiceSection: {
      marginTop: 10,
      borderTop: "1px solid #ccc",
      padding: "5px 0",
      fontWeight: "bold",
    },
  });

  //Send to finance
  async function handleSendToFinance(e, row) {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}add_finance`, {
        attendence_id: row.attendence_id,
      });

      await axios.put(`${baseUrl}update_salary`, {
        attendence_id: row.attendence_id,
        sendToFinance: 1,
        month: row.month,
      });

      handleSubmit();
      toastAlert("Sent To Finance");
    } catch (error) {
      console.error("Error sending to finance", error);
      toastAlert("Failed to send to finance");
    }
  }
  const handleDeleteSalary = async () => {
    try {
      const res = await axios.delete(`${baseUrl}delete_all_attendance`, {
        data: {
          dept: department,
          month: month,
          year: year,
        },
      });
      handleSubmit();
      toastAlert("Attendence deleted success");
    } catch (error) {
      console.log(error);
    }
  };

  async function handleInvoiceDownload() {
    try {
      await downloadSelectedInvoices(selectedRows);
    } catch (error) {
      console.error("Error Downloading Invoices", error);
    }
  }
  // async function handleBulkSendToFinance() {
  //   try {
  //     for (const row of selectedRows) {
  //       console.log(row , 'row is here ok')
  //       await axios.post(`${baseUrl}add_finance`, {
  //         attendence_id: row.attendence_id,
  //       });

  //       await axios.put(`${baseUrl}update_salary`, {
  //         attendence_id: row.attendence_id,
  //         sendToFinance: 1,
  //         month: row.month,
  //       });
  //     }

  //     handleSubmit();
  //     setSelectedRows([]);
  //     toastAlert("All selected rows have been sent to Finance successfully.");
  //   } catch (error) {
  //     console.error("Error sending data to finance:", error);
  //     toastAlert("An error occurred while sending data to Finance."); // Show error message
  //   }

  //   Promise.all(sendToFinancePromises)
  //     .then(() => {
  //       handleSubmit();
  //       toastAlert("Sent To Finance");
  //     })
  //     .catch((error) => {
  //       console.error("Error sending data to finance:", error);
  //       toastAlert("Failed to send to finance");
  //     });
  // }
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // async function handleBulkSendToFinance() {
  //     setIsButtonDisabled(true);

  //     try {
  //         const sendToFinancePromises = selectedRows.map(async (row) => {
  //           console.log(selectedRows , 'row select')

  //             // Post request to add to finance
  //             // await axios.post(`${baseUrl}add_finance`, {
  //             //     attendence_id: row.attendence_id,
  //             // });

  //             // Put request to update salary
  //             // await axios.put(`${baseUrl}update_salary`, {
  //             //     attendence_id: row.attendence_id,
  //             //     sendToFinance: 1,
  //             //     month: row.month,
  //             // });
  //             await axios.put(`${baseUrl}update_all_salary_with_finance`, {
  //                 attendence_id: row.attendence_id,
  //                 sendToFinance: 1,
  //             });
  //         });

  //         // Wait for all promises to be resolved
  //         await Promise.all(sendToFinancePromises);

  //         handleSubmit();
  //         setSelectedRows([]);
  //         toastAlert("All selected rows have been sent to Finance successfully.");
  //     } catch (error) {
  //         console.error("Error sending data to finance:", error);
  //         toastAlert("An error occurred while sending data to Finance.");
  //     } finally {
  //         setIsButtonDisabled(false);
  //     }
  // }
  async function handleBulkSendToFinance() {
    setIsButtonDisabled(true);

    try {
      // Collect all selected attendance_ids
      const attendanceIds = selectedRows.map((row) => row.attendence_id);

      console.log(attendanceIds, "Selected attendance IDs");

      // Put request to update all salaries at once with finance
      await axios.put(`${baseUrl}update_all_salary_with_finance`, {
        attendence_ids: attendanceIds, // Send all IDs in an array
        sendToFinance: 1,
      });

      handleSubmit();
      setSelectedRows([]); // Clear selected rows after successful submission
      toastAlert("All selected rows have been sent to Finance successfully.");
    } catch (error) {
      console.error("Error sending data to finance:", error);
      toastAlert("An error occurred while sending data to Finance."); // Show error message
    } finally {
      setIsButtonDisabled(false); // Re-enable the button after all operations are complete
    }
  }

  const pdfTemplate = () => (
    <Document>
      <Page size="A1" style={styles.page}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Text style={{ fontSize: 25 }}>
            Department:{" "}
            {departmentdata.find((user) => user.dept_id === department)
              ?.dept_name || ""}
          </Text>
          <Text style={{ fontSize: 25 }}>Month: {month}</Text>
          <Text style={{ fontSize: 25 }}>Year: {year}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>S.NO</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              Employee Name
            </Text>
            <Text style={styles.tableCell}>Deparmtent</Text>
            <Text style={styles.tableCell}>Designation</Text>
            <Text style={styles.tableCell}>DOJ</Text>
            <Text style={styles.tableCell}>Work Days</Text>
            <Text style={styles.tableCell}>Month</Text>
            <Text style={styles.tableCell}>Salary</Text>
            <Text style={styles.tableCell}>Absent</Text>
            <Text style={styles.tableCell}>Present</Text>
            <Text style={styles.tableCell}>Total Salary</Text>
            <Text style={styles.tableCell}>Bonus</Text>
            <Text style={styles.tableCell}>Deductions</Text>
            <Text style={styles.tableCell}>Net Salary</Text>
            <Text style={styles.tableCell}>TDS</Text>
            <Text style={styles.tableCell}>To Pay</Text>
          </View>
        </View>

        {filterData?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {item.user_name}
            </Text>
            <Text style={styles.tableCell}>{item.dept_name}</Text>
            <Text style={styles.tableCell}>{item.designation_name}</Text>
            <Text style={styles.tableCell}>
              {item.joining_date
                ?.split("T")[0]
                ?.split("-")
                ?.reverse()
                ?.join("-")}
            </Text>
            <Text style={styles.tableCell}>30</Text>
            <Text style={styles.tableCell}>{item.month}</Text>
            <Text style={styles.tableCell}>{item.salary}</Text>
            <Text style={styles.tableCell}>{item.noOfabsent}</Text>
            <Text style={styles.tableCell}>{30 - item.noOfabsent}</Text>
            <Text style={styles.tableCell}>{item.total_salary}</Text>
            <Text style={styles.tableCell}>{item.bonus}</Text>
            <Text style={styles.tableCell}>{item.salary_deduction}</Text>
            <Text style={styles.tableCell}>{item.net_salary}</Text>
            <Text style={styles.tableCell}>{item.tds_deduction}</Text>
            <Text style={styles.tableCell}>{item.toPay}</Text>
          </View>
        ))}

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.total_salary))
                .reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.bonus))
                .reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.net_salary))
                .reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.tds_deduction))
                .reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={styles.tableCell}>
              {filterData
                ?.map((item) => Number(item.toPay))
                .reduce((a, b) => a + b, 0)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const selectedTemplatevalue = 1;

  //--------------------------------------------------------------------------------------------------------------------

  function handleSeprationReason(userId, username, user_contact_no) {
    setSeparationUserID(userId);
    setUserName(username);
    setUserContact(user_contact_no);
    axios
      .get(baseUrl + "get_all_reasons")
      .then((res) => setSeparationReasonGet(res.data));
  }

  const today = new Date()?.toISOString()?.split("T")[0];
  function handleSeparationDataPost() {
    axios.post(baseUrl + "add_separation", {
      user_id: separationUserID,
      status: separationStatus,
      created_by: userID,
      resignation_date: separationResignationDate,
      last_working_day: separationLWD,
      remark: separationRemark,
      reason: separationReason,
    });
    whatsappApi.callWhatsAPI(
      "CF_Separation",
      JSON.stringify(usercontact),
      userName,
      [userName, separationStatus]
    );
  }

  function getLastDateOfMonth(month, year) {
    const monthNames = [
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
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) {
      throw new Error("Invalid month name");
    }
    let nextMonth = new Date(year, monthIndex + 1, 1);
    let lastDateOfMonth = new Date(nextMonth - 1);
    return setWorkDaysLastDate(lastDateOfMonth.getDate());
  }

  useEffect(() => {
    getLastDateOfMonth(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Employee Name",
      cell: (row) => row.user_name,
      width: "150px",
    },
    {
      name: "Department",
      cell: (row) => row.dept_name,
      width: "120px",
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
      width: "120px",
    },
    {
      name: "DOJ",
      cell: (row) => DateISOtoNormal(row.joining_date),
      width: "130px",
    },
    {
      name: "Work Days",
      cell: () => workDaysLastDate,
      // cell: (row) => row.present_days,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    {
      name: "Salary",
      cell: (row) => row.salary,
    },
    {
      name: "Absent Days",
      cell: (row) => row.noOfabsent,
      width: "120px",
    },
    {
      name: "Present Days",
      cell: (row) => Number(row.present_days),
      width: "120px",
    },
    {
      name: "Total Salary",
      width: "120px",

      cell: (row) => row.total_salary.toFixed(0) + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
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
      name: "Deductions",
      cell: (row) => row.salary_deduction + " ₹",
    },
    {
      name: "Arrear Last Month",
      cell: (row) => row.arrear_from_last_month + " ₹",
    },
    {
      name: "Net Salary",
      cell: (row) => row.net_salary?.toFixed(0) + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction?.toFixed(0) + " ₹",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay?.toFixed(0) + " ₹",
    },
    {
      name: "Status",
      cell: (row) => row.attendence_status_flow,
    },
    {
      name: "Action",
      width: "200px",
      cell: (row) => (
        <>
          {row?.invoice_template_no !== "0" && (
            <button
              className="icon-1"
              title="Download Invoice"
              type="button"
              onClick={() => generatePDF(row)}
            >
              <FaEye />
            </button>
          )}
        </>
      ),
    },
    // {
    //   name: "Action",
    //   width: "200px",
    //   cell: (row) => (
    //     <>
    //       {!row?.invoice_template_no ? (
    //         <button
    //           type="button"
    //           title="Select Invoice"
    //           className=" icon-1"
    //           data-toggle="modal"
    //           data-target="#exampleModalCenter"
    //           onClick={() => handleInvoice(row)}
    //         >
    //           <FileOpenIcon />
    //         </button>
    //       ) : (
    //         !row?.sendToFinance && (
    //           <button
    //             title="Send to Finance"
    //             className="icon-1"
    //             onClick={(e) => handleSendToFinance(e, row)}
    //           >
    //             <i className="bi bi-cloud-arrow-up" />
    //           </button>
    //         )
    //       )}

    //       {row.sendToFinance == 1 && row.status_ == 1 && (
    //         <button
    //           className="btn cmnbtn btn_sm btn-outline-primary ml-2 "
    //           data-toggle="modal"
    //           data-target="#exampleModal"
    //           onClick={() => setRowDataModal(row)}
    //         >
    //           Paid
    //         </button>
    //       )}
    //       {row.sendToFinance == 1 && row.status_ == 0 && (
    //         <button className="btn cmnbtn btn_sm btn-danger ml-2 ">
    //           Pending
    //         </button>
    //       )}

    //       {row?.invoice_template_no !== "0" && row?.digital_signature_image && (
    //         <button
    //           className="icon-1"
    //           title="Download Invoice"
    //           type="button"
    //           onClick={() => generatePDF(row)}
    //         >
    //           <i className="bi bi-cloud-arrow-down" />
    //         </button>
    //       )}
    //     </>
    //   ),
    // },
    // roleID == 2 && {
    //   name: "separation",
    //   cell: (row) => (
    //     <Button
    //       className="btn  cmnbtn btn_sm btn-primary"
    //       data-toggle="modal"
    //       data-target="#exampleModalSepration"
    //       size="small"
    //       variant="contained"
    //       color="primary"
    //       onClick={() =>
    //         handleSeprationReason(
    //           row.user_id,
    //           row.user_name,
    //           row.user_contact_no
    //         )
    //       }
    //     >
    //       Sep
    //     </Button>
    //   ),
    // },
  ];

  const handleExport = () => {
    const formattedData = filterData?.map((row, index) => ({
      "S.No": index + 1,
      "Employee Name": row.user_name,
      Department: row.dept_name,
      Designation: row.designation_name,
      DOJ: DateISOtoNormal(row.joining_date),
      "Work Days": 26,
      Month: row.month,
      salary: row.salary + " ₹",
      "Absent Days": row.noOfabsent,
      "Present Days": 26 - Number(row.noOfabsent),
      "Total Salary": `${row.total_salary} ₹`,
      Bonus: row.bonus + " ₹",
      Deductions: row.salary_deduction,
      ArrearLastMonth: row.arrear_from_last_month,
      "Net Salary": `${row.net_salary} ₹`,
      TDS: `${row.tds_deduction} ₹`,
      "To Pay": row.toPay + " ₹",
    }));

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const handleAllDepartmentSalaryExcel = () => {
    const formattedData = salaryMonthYearData?.map((row, index) => ({
      "S.No": index + 1,
      "Beneficiary Name (Mandatory) Special characters not supported":
        row.user_name,
      "Beneficiary's Account Number (Mandatory) Typically 9-18 digits":
        row.account_no,
      "IFSC Code (Mandatory) 11 digit code of the beneficiary’s bank account. Eg. HDFC0004277":
        row.ifsc_code,
      "Payout Amount (Mandatory) Amount should be in rupees": row.toPay,
      "Phone Number (Optional)": row.user_contact_no,
      "Email ID (Optional)": row.user_email_id,
      "Contact Reference ID (Optional) Eg: Employee ID or Customer ID":
        row?.emp_id,
    }));

    const fileName = "AllSalary.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const monthToNumber = (month) => {
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
    return months.indexOf(month);
    return months.indexOf(month) + 1;
  };

  const currentYearForDis = new Date().getFullYear();
  const currentMonthForDis = new Date().getMonth() + 1;

  return (
    // <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
    <div className="action_heading mb12">
      <div className="action_title">
        <FormContainer mainTitle="Payout Summary" link="/admin" />
      </div>
      <div className="action_btns">
        <Link to="/admin/attendence-mast">
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
          >
            Create Attendance
          </button>
        </Link>
      </div>
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Select Template</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body"></div>

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

      {/* Cards */}
      <div className="timeline_wrapper mb24">
        <Slider {...settings} className="timeline_slider">
          {completedYearsMonths?.map((data, index) => {
            const cardMonth = monthToNumber(data.month);
            const isFutureCard =
              data.year > currentYearForDis ||
              (data.year === currentYearForDis &&
                cardMonth >= currentMonthForDis);

            const getClassName = (data, index, selectedCardIndex) => {
              if (data.card_status === 1) {
                return "pending";
              } else if (data.card_status === 0) {
                return selectedCardIndex === index ? "selected" : "";
              }
            };
            return (
              <div
                className={`timeline_slideItem 
                  ${data.deptCount == departmentdata?.length && "completed"} 
                  ${selectedCardIndex === index ? "selected" : ""}
                ${getClassName(data, index, selectedCardIndex)}
               ${currentMonthForDis === cardMonth + 1 && "current" // this code for current month card select blue card
                  } 
                ${isFutureCard && "disabled"}`}
                onClick={() => {
                  if (!isFutureCard) handleCardSelect(index, data);
                }}
                key={index}
              >
                <h2>
                  {data.month}
                  <span>{data.year} </span>
                </h2>
                <h4>
                  {data.deptCount}/{departmentdata?.length}
                </h4>
                <h3>Total Amount:- {data.totalAmount}</h3>
                <h3>Total Bonus:- {data.totalBonus}</h3>
                <h3>Total TDS Deduction:- {data.totalDeduction}</h3>
                <h3>Total Pay:- {data.totalSalary?.toFixed(2)}</h3>
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
                  {data.deptCount == departmentdata?.length
                    ? "Completed"
                    : currentMonthNumber - 5 - index < 0
                      ? "Upcoming"
                      : "Pending"}
                  {/* {data.atdGenerated == 1
                  ? "Completed"
                  : currentMonthNumber - 4 - index < 0
                  ? "Upcoming"
                  : "Pending"} */}
                </h3>
              </div>
            );
          })}
        </Slider>
      </div>
      <h5>Verification Pending From Finance :{pendingFinanceCount}</h5>

      <div className="card mb24">
        <div className="card-header d-flex justify-content-between">
          <h4>Department</h4>
          <span className="d-flex gap4">
            {/* {data?.length == 0 &&
              department &&
              selectedMonth &&
              selectedYear && (
                <button
                  onClick={handleAttendance}
                  className="btn cmnbtn btn_sm btn-danger"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  // style={{ marginTop: "25px" }}
                >
                  No Absents, Create Attendance{" "}
                  <i className="bi bi-arrow-right"></i>
                </button>
              )} */}
            {contextData &&
              contextData[38] &&
              contextData[38].view_value === 1 && (
                <Link to="/admin/salary-summary">
                  <button
                    className="btn cmnbtn btn_sm btn-outline-primary "
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Payout Summary <i className="bi bi-file-earmark-text"></i>
                  </button>
                </Link>
              )}
            {/* <button
              className="btn cmnbtn btn_sm btn-outline-primary "
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => BankExcelConverter(salaryMonthYearData)}
            >
              Export Excel Button <i className="bi bi-file-spreadsheet"></i>
            </button>

            {deptSalary?.length !== departmentdata?.length &&
              (RoleIDContext == 1 || RoleIDContext == 5) && (
                <button
                  className="btn cmnbtn btn_sm btn-primary "
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onClick={handleAllDepartmentSalary}
                >
                  Create All Department Salary{" "}
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

              return (
                <div
                  className={`card hover body-padding ${department === option.dept_id
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
                      <i className="bi bi-bounding-box"></i>
                    </div>
                    {option.dept_name}
                    <h3>{option.user_count}</h3>
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

      <div
        className="card p-0"
        style={{ background: "transparent", border: "none" }}
      >
        <div className="card-body p-0">
          <div className="row gap_24_0">
            {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <h2>Current Month All Dept</h2>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>Total Payout Incurred :</span>
                      {showAlldeptMonthWiseData[0]?.totalSalary}
                    </li>
                    <li>
                      <span>Net Salary</span>
                      {showAlldeptMonthWiseData[0]?.netSalary?.toFixed(0)}
                    </li>
                    <li>
                      <span>Total Bonus</span>
                      {showAlldeptMonthWiseData[0]?.totalBonus}
                    </li>
                    <li>
                      <span>Total Deductions</span>
                      {showAlldeptMonthWiseData[0]?.totalTdsDeduction}
                    </li>
                    <li>
                      <span>Total TDS Deducted</span>
                      {showAlldeptMonthWiseData[0]?.totalSalaryDeduction}
                    </li>
                    
                  </ul>
                </div>
              </div>
            </div> */}
            {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <h2>This Year Selected Dept</h2>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>Total Payout Incurred :</span>
                      {singleDeptWholeYearSalaryData[0]?.totalsalary}
                    </li>
                    <li>
                      <span>Total Bonus</span>
                      {singleDeptWholeYearSalaryData[0]?.totalBonus}
                    </li>
                    <li>
                      <span>Total Deductions</span>
                      {singleDeptWholeYearSalaryData[0]?.totaltdsdeduction}
                    </li>
                    <li>
                      <span>Total TDS Deducted</span>
                      {singleDeptWholeYearSalaryData[0]?.totalsalarydeduction}
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <h2 className="bold">Current Month ({selectedMonth})</h2>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>Total Salary</span>
                      {thisMonthSalary}
                    </li>
                    <li className="bold">
                      <span>Total Payout :</span>
                      {thisMonthTotalSalary.toFixed(0)}
                    </li>
                    {/* <li>
                      <span>Total Bonus</span>
                      {thisMonthTotalBonus}
                    </li> */}

                    {/* <li>
                      <span>Total Deductions</span>

                      {thisMonthTotalDeductions}
                    </li> */}
                    <li>
                      <span>Total TDS Deducted</span>
                      {thisMonthTDS}
                    </li>
                    {/* <hr /> */}
                    {/* <li className="bold">
                      <span >Total </span>
                      {(thisMonthTotalSalary + thisMonthTDS)}
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <h2 className="bold">This Year All Dept ({selectedYear})</h2>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>Total Amount :</span>
                      {card2Data?.totalsalary}
                    </li>
                    <li>
                      <span>Total Bonus</span>
                      {card2Data?.totalBonus}
                    </li>
                    {/* <li className="bold">
                      <span >Total Payout :</span>
                      {card2Data?.totalToPay}
                    </li> */}

                    {/* <li>
                      <span>Total Deductions</span>
                      {card2Data?.totalsalarydeduction}
                    </li>
                    <li>
                      <span>Total TDS Deducted</span>
                      {card2Data?.totaltdsdeduction}
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="salary_dtlCard">
                <div className="salary_dtlCard_head">
                  <h2>This Month</h2>
                </div>
                <div className="salary_dtlCard_info">
                  <ul>
                    <li>
                      <span>Total Employees:</span>
                      {allWFHUsers.length}
                    </li>
                    {/* <li>
                      <span className="bold">Active Mark :</span>
                      {activeusers?.length}
                    </li> */}
                    {/* <li>
                      <span>Calander Days</span>
                      30
                    </li> */}
                    <li
                      className="color_primary"
                      data-toggle="modal"
                      data-target="#joinee"
                    >
                      <span>New Joinee</span>
                      {newJoineeCount?.NewJoiners
                        ? newJoineeCount?.NewJoiners
                        : "0"}
                    </li>
                    <li
                      className="color_primary"
                      data-toggle="modal"
                      data-target="#employeeleft"
                    >
                      <span>Employee left</span>
                      {employeeLeft?.leftEmployees}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {data?.length > 0 && (
        <>
          <div className="tab">
            <button
              className={`named-tab ${activeTab == 0 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("Send To Finance"), setActiveTab(0);
              }}
            >
              Approved and Send To Finance
            </button>
            <button
              className={`named-tab ${activeTab == 1 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("Verification Pending"), setActiveTab(1);
              }}
            >
              Disbursement Pending
              {/* Verification Pending */}
            </button>
            <button
              className={`named-tab ${activeTab == 2 ? "active-tab" : ""}`}
              onClick={() => {
                FilterTabData("Verified"), setActiveTab(2);
              }}
            >
              Paid
              {/* Verified */}
            </button>
          </div>
          <div className="card">
            <div className="card-header">
              <h5>Salary Overview</h5>
              <div className="pack w-75">
                <button
                  className="btn  cmnbtn btn_sm btn-danger mr-2"
                  onClick={handleDeleteSalary}
                >
                  Delete Salary
                </button>
                {selectedRows?.length > 0 && activeTab === 0 && (
                  <>
                    <button
                      className="btn  cmnbtn btn_sm btn-primary mr-2"
                      onClick={handleBulkSendToFinance}
                      disabled={isButtonDisabled}
                    >
                      Send to Finance
                    </button>
                    {/* <button
                      className="btn  cmnbtn btn_sm btn-primary mr-2"
                      onClick={handleInvoiceDownload}
                    >
                      Download Invoices
                    </button> */}
                  </>
                )}
                {/* <button
                      className="btn btn-primary mr-2"
                      onClick={handleBankDepartmentExcel}
                    >
                      Export Bank Excel
                    </button> */}
                <Button
                  className="btn  cmnbtn btn_sm btn-primary"
                  sx={{ marginRight: "10px" }}
                  size="medium"
                  onClick={handleExport}
                  variant="outlined"
                  color="secondary"
                >
                  Export Excel
                </Button>
                <div className="d-flex">
                  <PDFDownloadLink
                    document={pdfTemplate()}
                    fileName={
                      departmentdata?.find(
                        (user) => user?.dept_id === department
                      )?.dept_name +
                      " " +
                      month +
                      " " +
                      year +
                      " " +
                      " invoice" +
                      "pdf"
                    }
                    style={{
                      color: "#4a4a4a",
                    }}
                  >
                    <button
                      className="btn  cmnbtn btn_sm btn-primary mr-2"
                      type="button"
                    >
                      Download
                    </button>
                  </PDFDownloadLink>

                  <input
                    style={{ width: "300px" }}
                    type="text"
                    placeholder="Search here"
                    className=" form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="data_tbl table-responsive card-body body-padding">
              <DataTable
                // title="Salary Overview"
                columns={columns}
                data={filterData}
                // fixedHeader
                // fixedHeaderScrollHeight="64vh"
                highlightOnHover
                pagination
                exportToCSV
                paginationPerPage={100}
                // subHeader
                // conditionalRowStyles={conditionalRowStyles}
                selectableRows={activeTab == 0 ? true : false}
                onSelectedRowsChange={handleRowSelected}
              />
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Select Invoice Template
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

            <div className="transfer_body">
              <div
                className="transfer_boxes"
                onChange={(e) => setTemplateState(e.target.value)}
                value={selectedTemplate}
              >
                {images.map((d) => (
                  <label className="transfer_bx" key={d.temp_id}>
                    <input
                      type="radio"
                      value={selectedTemplate}
                      name="transfer-radio"
                      // defaultChecked=""'
                      checked={selectedTemplate === d.temp_id}
                      onChange={() => setSelectedTempate(d.temp_id)}
                    />
                    <span className="cstm-radio-btn">
                      <i className="bi bi-check2" />
                      <div className="boy_img">
                        <img src={d.image} alt="img" />
                        <h3>{d.temp_id}</h3>
                      </div>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <PDFDownloadLink
                document={selectedTemplatevalue}
                fileName={
                  rowData?.user_name +
                  " " +
                  rowData?.month +
                  " " +
                  rowData?.year
                }
                style={{
                  // textDecoration: "none",
                  // padding: "10px",
                  color: "#4a4a4a",
                  // backgroundColor: "#f2f2f2",
                  // border: "1px solid #4a4a4a",
                }}
              >
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => handleInvoiceNumber(rowData)}
                >
                  Download
                </button>
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* After Payment show details  */}
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
                Pay
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
              <div>Amount : {rowDataModal?.amount}</div>
              <div>Pay Date :{rowDataModal?.pay_date}</div>
              <div>Refrence No :{rowDataModal?.reference_no}</div>
              <div>
                ScreenShot :
                <img src={rowDataModal?.screenshot} alt="Snap" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Joinee Modal  */}
      <div
        className="modal fade"
        id="joinee"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                New Joinees
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
            <div className="modal-body userSalary_modal">
              {newJoineeCount?.NewUsers?.map((data) => (
                <h3> {data.user_name}</h3>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EmployeeLeft Modal  */}

      <div
        className="modal fade"
        id="employeeleft"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Employee Left
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
            <div className="modal-body userSalary_modal">
              {employeeLeft?.UserLefts?.map((data) => (
                <h3>{data?.user_name}</h3>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* separation modal */}

      <div
        className="modal fade"
        id="exampleModalSepration"
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
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Resigned">Resigned</option>
                <option value="Resign Accepted">Resign Accepted</option>
                <option value="On Long Leave">On Long Leave</option>
                <option value="Subatical">Subatical</option>
                <option value="Suspended">Suspended</option>
              </FieldContainer>
              <FieldContainer
                label="Reason"
                Tag="select"
                value={separationReason ? separationReason : ""}
                onChange={(e) => setSeparationReason(e.target.value)}
              >
                <option value="" disabled>
                  {" "}
                  choose
                </option>
                {separationReasonGet.map((option) => (
                  <option value={option.id} key={option.id}>
                    {" "}
                    {option.reason}
                  </option>
                ))}
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
              {separationStatus == "Resigned" && (
                <FieldContainer
                  label="Resignation Date"
                  type="date"
                  min={`${year}-${monthNameToNumber(month)}-01`}
                  max={`${year}-${monthNameToNumber(month)}-31`}
                  value={separationResignationDate}
                  onChange={(e) => setSeparationResignationDate(e.target.value)}
                />
              )}
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
                disabled={!separationReason}
                type="button"
                className="btn btn-primary"
                onClick={() => handleSeparationDataPost()}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalaryWFH;
