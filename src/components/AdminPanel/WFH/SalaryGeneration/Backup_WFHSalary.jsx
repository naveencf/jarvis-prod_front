import { useState, useEffect } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DataTable from "react-data-table-component";
import axios from "axios";
import FormContainer from "../../FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import Select from "react-select";
import jwtDecode from "jwt-decode";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/i3.png";
import image4 from "./images/i4.png";
import image5 from "./images/image5.png";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";

import { Button } from "@mui/material";
import MyTemplate1 from "./Template";
import MyTemplate2 from "./Template2";
import MyTemplate3 from "./Template3";
import MyTemplate4 from "./Template4";
import MyTemplate5 from "./Template5";
// import DateFormattingComponent from "../../../DateFormater/DateFormared";
import {baseUrl} from '../../../../utils/config'

const images = [
  { temp_id: 1, image: image1 },
  { temp_id: 2, image: image2 },
  { temp_id: 3, image: image3 },
  { temp_id: 4, image: image4 },
  { temp_id: 5, image: image5 },
];

const Backup_WFHSalary = () => {
  const { toastAlert } = useGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [userName, setUserName] = useState(0);
  const [departmentdata, getDepartmentData] = useState([]);
  const [noOfAbsent, setNoOfAbsent] = useState(null);
  const [userData, getUsersData] = useState([]);
  const [userSalary, setUserSalary] = useState("");
  const [userTds, setUserTds] = useState("");
  const [departmentWise, setDepartmentWise] = useState([]);
  const [selectedTemplate, setSelectedTempate] = useState("");
  const [templateState, setTemplateState] = useState(null);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [rowData, setDataRow] = useState(null);
  const [rowDataModal, setRowDataModal] = useState(null);

  const monthValue = [
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
  const yearValue = [
    2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          baseUrl+"get_all_wfh_users"
        );
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

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        getDepartmentData(res.data);
      });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}`+`get_all_users`).then((res) => {
      getUsersData(res.data.data);
    });
    if (department) {
      axios
        .get(`${baseUrl}`+`getuserdeptwise/${department}`)
        .then((res) => {
          setDepartmentWise(res.data);
        });
    }
  }, [department]);

  const getUserSalary = (selectedUserId) => {
    const userSalaryConst = userData.filter(
      (item) => item.user_id == selectedUserId
    );
    setUserSalary(userSalaryConst[0].salary);
    setUserTds(userSalaryConst[0].tds_per);
  };

  const handleSubmit = () => {
    const payload = {
      dept_id: department,
      month: month,
      year: year,
    };
    axios
      .post(
        baseUrl+"get_salary_by_id_month_year",
        payload
      )
      .then((res) => {
        setFilterData(res.data.data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toastAlert("Failed to submit data");
      });
  };

  function handleInvoiceNumber(data) {
    const formData = new FormData();

    formData.append("id", data.user_id);
    formData.append("invoice_template_no", selectedTemplate);

    axios.put(`${baseUrl}`+`userupdate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  useEffect(() => {
    const result = filterData.filter((d) => {
      return d.user_name?.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    if (department || month || year !== "") {
      handleSubmit();
    }
  }, [department, month, year]);

  const handleAttendence = () => {
    axios
      .post(baseUrl+"attendencemastpost", {
        dept: department,
        user_id: userName.user_id,
        noOfabsent: 0,
        month: month,
        year: year,
      })
      .then(() => {
        setNoOfAbsent("");
        toastAlert("Submitted success");
        handleSubmit();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toastAlert("Failed to submit data");
      });
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
    // tableHeader: {
    //   backgroundColor: "#f2f2f2",
    // },

    // tableCell: {
    //   padding: 5,
    //   fontSize: 12,
    //   textAlign: "center",
    // },

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
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  //Send to finance
  function handleSendToFinance(e, row) {
    e.preventDefault();
    axios.post(`${baseUrl}`+`finance`, {
      attendence_id: row.attendence_id,
    });

    axios.put(`${baseUrl}`+`updatesalary`, {
      attendence_id: row.attendence_id,
      sendToFinance: 1,
    });
    handleSubmit();
    toastAlert("Sent To Finance");
  }

  //--------------------------------------------------------------------------------------------------------------------

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
            <Text style={styles.tableCell}>Work Days</Text>
            <Text style={styles.tableCell}>Month</Text>
            <Text style={styles.tableCell}>Absent</Text>
            <Text style={styles.tableCell}>Present</Text>
            <Text style={styles.tableCell}>Total Salary</Text>
            <Text style={styles.tableCell}>Bonus</Text>
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
            <Text style={styles.tableCell}>30</Text>
            <Text style={styles.tableCell}>{item.month}</Text>
            <Text style={styles.tableCell}>{item.noOfabsent}</Text>
            <Text style={styles.tableCell}>{30 - item.noOfabsent}</Text>
            <Text style={styles.tableCell}>{item.total_salary}</Text>
            <Text style={styles.tableCell}>{item.bonus}</Text>
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

  const templateMap = {
    1: <MyTemplate1 rowData={rowData} />,
    2: <MyTemplate2 rowData={rowData} />,
    3: <MyTemplate3 rowData={rowData} />,
    4: <MyTemplate4 rowData={rowData} />,
    5: <MyTemplate5 rowData={rowData} />,
  };

  const selectedTemplatevalue = templateMap[selectedTemplate];

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
    {
      name: "Action",
      cell: (row) => (
        <>
          {row?.invoice_template_no !== "0" && (
            <PDFDownloadLink
              document={templateMap[row?.invoice_template_no]}
              fileName={
                rowData?.user_name + " " + rowData?.month + " " + rowData?.year
              }
              style={{
                color: "#4a4a4a",
              }}
            >
              <button
                className="btn btn-outline-primary btn-sm"
                title="Download Invoice"
                type="button"
                onClick={() => handleInvoice(row)}
              >
                <CloudDownloadIcon />
              </button>
            </PDFDownloadLink>
          )}
          {!row?.invoice_template_no && (
            <button
              type="button"
              title="Select Invoice"
              className="btn btn-primary btn-sm"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              onClick={() => handleInvoice(row)}
            >
              {/* select invoice */}
              <FileOpenIcon />
            </button>
          )}
          {!row?.sendToFinance && (
            <button
              title="Send to Finance"
              className="btn-outline-primary btn-sm ml-2"
              onClick={(e) => handleSendToFinance(e, row)}
            >
              <IosShareIcon />
            </button>
          )}

          {row.sendToFinance == 1 && row.status_ == 1 && (
            <button
              className="btn btn-outline-primary ml-2"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => setRowDataModal(row)}
            >
              Paid
            </button>
          )}
          {row.sendToFinance == 1 && row.status_ == 0 && <div>Pending</div>}
        </>
      ),
    },
  ];

  const handleExport = () => {
    const formattedData = filterData?.map((row, index) => ({
      "S.No": index + 1,
      "Employee Name": row.user_name,
      "Work Days": 26,
      Month: row.month,
      "Absent Days": row.noOfabsent,
      "Present Days": 26 - Number(row.noOfabsent),
      "Total Salary": `${row.total_salary} ₹`,
      TDS: `${row.tds_deduction} ₹`,
      "Net Salary": `${row.net_salary} ₹`,
    }));

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
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

      {/* <FormContainer submitButton={false} handleSubmit={handleSubmit}> */}
      <div className="from-group d-flex">
        <div className="form-group col-3">
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
        </div>
        <div className="form-group col-3">
          <label className="form-label">Year</label>
          <Select
            options={yearValue?.map((option) => ({
              value: option,
              label: `${option}`,
            }))}
            onChange={(e) => {
              setYear(e.value);
            }}
            required
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Month <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={monthValue.map((option) => ({
              value: option,
              label: `${option}`,
            }))}
            onChange={(e) => {
              setMonth(e.value);
            }}
            required
          />
        </div>
        {/* </FormContainer> */}
        <div className="form-group col-3">
          {filterData?.length == 0 && department && month && year && (
            <button
              onClick={handleAttendence}
              className="btn btn-warning"
              style={{ "margin-top": "25px" }}
            >
              No Absents, Create Salary
            </button>
          )}
        </div>
      </div>

      <FormContainer mainTitle="Salary" link="/admin" />
      <div className="card">
        <div className="data_tbl table-responsive">
          {filterData?.length > 0 && (
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
                <>
                  <Button
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
                        departmentdata.find(
                          (user) => user.dept_id === department
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
                        // textDecoration: "none",
                        // padding: "10px",
                        color: "#4a4a4a",
                        // backgroundColor: "#f2f2f2",
                        // border: "1px solid #4a4a4a",
                      }}
                    >
                      <button className="btn btn-primary me-3" type="button">
                        Download
                      </button>
                    </PDFDownloadLink>

                    <input
                      type="text"
                      placeholder="Search here"
                      className="w-50 form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </>
              }
            />
          )}
        </div>
      </div>
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
                ScreenSort :
                <img
                  src={`${baseUrl+"user_images/"}${
                    rowDataModal?.screenshot
                  }`}
                  alt="Snap"
                />
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
    </>
  );
};
export default Backup_WFHSalary;
