import { useState, useEffect } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import DataTable from "react-data-table-component";
import axios from "axios";
import FormContainer from "../../FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import jwtDecode from "jwt-decode";
import * as XLSX from "xlsx";
import { generatePDF } from "../SalaryGeneration/pdfGenerator";
import {
  Document,
  Image,
  PDFDownloadLink,
  Page,
  View,
} from "@react-pdf/renderer";
import { Text, StyleSheet } from "@react-pdf/renderer";

import MyTemplate1 from "../SalaryGeneration/Template";
import MyTemplate2 from "../SalaryGeneration/Template2";
import MyTemplate3 from "../SalaryGeneration/Template3";
import MyTemplate4 from "../SalaryGeneration/Template4";
import MyTemplate5 from "../SalaryGeneration/Template5";
import Modal from "react-modal";
import DigitalSignature from "../../../DigitalSignature/DigitalSignature";
import useInvoiceTemplateImages from "../Templates/Hooks/useInvoiceTemplateImages";
import PreviewInvoice from "./PreviewInvoice";
import { baseUrl } from "../../../../utils/config";
import WFHTemplateOverview from "./WFHTemplateOverview";
import { Link } from "react-router-dom";

const images = useInvoiceTemplateImages();

const WFHSingleUser = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
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
  // const [getDigitalSignImage, SetgetDigitalSignImage] = useState("");

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const loginUserName = decodedToken.name;

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [rowData, setDataRow] = useState(null);
  const [PreviewInvoiceData, setPreviewInvoiceData] = useState(null);
  const [rowDataModal, setRowDataModal] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isTemaplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    openTemplateModal();
  };

  function openTemplateModal() {
    setIsTemplateModalOpen(true);
  }

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  // const digitalSignatureImageExists = decodedToken?.digital_signature_image;
  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      const getDigitalSignImage = res.data.digital_signature_image_url;

      if (!getDigitalSignImage) {
        setIsModalOpen(true);
      } else {
        const imageUrl = "";

        if (getDigitalSignImage.startsWith(imageUrl)) {
          const imageName = getDigitalSignImage.substring(imageUrl.length);
          if (imageName.trim() === "") {
            setIsModalOpen(true);
          } else {
            setIsModalOpen(false);
          }
        } else {
          setIsModalOpen(false);
        }
      }
    });
  }, [userID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + "get_all_wfh_users");
        const data = res.data.data;
        const filteredUser = data.filter((d) => d.dept_id === department);
        if (filteredUser.length > 0) {
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
    axios.get(baseUrl + "all_departments_of_wfh").then((res) => {
      getDepartmentData(res.data.data);
    });
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

  const handleSubmit = () => {
    axios
      .post(baseUrl + "get_attendance_by_userid", {
        user_id: userID,
      })
      .then((res) => {
        const response = res.data.data;
        setFilterData(response);
        setData(response);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toastError("Failed to submit data");
      });
  };

  function handleInvoiceNumber(data) {
    const formData = new FormData();

    formData.append("user_id", data.user_id);
    formData.append("invoice_template_no", selectedTemplate);

    axios.put(`${baseUrl}` + `update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  useEffect(() => {
    const result = data?.filter((d) => {
      return (
        d.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.month?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    if (department || month || year !== "") {
      handleSubmit();
    }
  }, [department, month, year]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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

  const pdfTemplate = () => (
    <Document>
      <Page size="A1" style={styles.page}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Text style={{ fontSize: 25 }}>
            Department: {filterData[0]?.dept_name}
          </Text>
          <Text style={{ fontSize: 25 }}>Month: {filterData[0]?.month}</Text>
          <Text style={{ fontSize: 25 }}>Year: {filterData[0]?.year}</Text>
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
      name: "Absents",
      cell: (row) => row.noOfabsent,
    },
    {
      name: "Presents",
      cell: (row) => 30 - Number(row.noOfabsent),
    },
    {
      name: "Total Payout",
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
      name: "Net Payout",
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
      name: "Status",
      cell: (row) => row.attendence_status_flow,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {/* {row?.invoice_template_no !== "0" && (
            <PDFDownloadLink
              document={templateMap[row?.invoice_template_no]}
              fileName={row?.user_name + " " + row?.month + " " + row?.year}
              style={{
                color: "#4a4a4a",
              }}
            >
              <button
                className="btn btn-outline-primary btn-sm"
                title="Download Invoice"
                type="button"
                onClick={() => setDataRow(row)}
              >
                <CloudDownloadIcon />
              </button>
            </PDFDownloadLink>
          )} */}
          {!row?.invoice_template_no && (
            <button
              type="button"
              title="Select Invoice"
              className="btn btn-primary btn-sm"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              onClick={() => setDataRow(row)}
            >
              {/* select invoice */}
              <FileOpenIcon />
            </button>
          )}
          {row.sendToFinance !== 1 && (
            <button
              className="btn btn-secondary"
              onClick={() => (
                setIsPreviewModalOpen(true), setPreviewInvoiceData(row)
              )}
            >
              Preview Invoice
            </button>
          )}

          {/* {!row?.sendToFinance && (
            <button
              title="Send to Finance"
              className="btn-outline-primary btn-sm ml-2"
              onClick={(e) => handleSendToFinance(e, row)}
            >
              <IosShareIcon />
            </button>
          )} */}
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
          {/* {row.sendToFinance == 1 && row.status_ == 0 && (
            <button className="btn btn-danger ml-2">Pending</button>
          )} */}

          {row?.invoice_template_no !== "0" && (
            <button
              className="btn btn-outline-primary btn-sm"
              title="Download Invoice"
              type="button"
              onClick={() => generatePDF(row)}
            >
              <CloudDownloadIcon />
            </button>
          )}
        </>
      ),
    },
  ];

  const handleExport = () => {
    const formattedData = filterData?.map((row, index) => ({
      "S.No": index + 1,
      "Employee Name": row.user_name,
      "Work Days": 30,
      Month: row.month,
      "Absent Days": row.noOfabsent,
      "Present Days": 30 - Number(row.noOfabsent),
      "Total Salary": `${row.total_salary} ₹`,
      Bonus: `${row.bonus} ₹`,
      TDS: `${row.tds_deduction} ₹`,
      "Net Salary": `${row.net_salary} ₹`,
      "To Pay": `${row.toPay} ₹`,
    }));

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <Modal
        isOpen={isPreviewModalOpen}
        onRequestClose={() => setIsPreviewModalOpen(false)}
        contentLabel="Preview Modal"
        appElement={document.getElementById("root")}
      >
        <PreviewInvoice
          data={PreviewInvoiceData}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
          handleSubmit={handleSubmit}
        />
      </Modal>

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

      <FormContainer mainTitle="Payout" link="/admin" />
      <div className="card">
        <div className="data_tbl table-responsive">
          {filterData?.length > 0 && (
            <DataTable
              title="Payout Overview"
              columns={columns}
              data={filterData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              exportToCSV
              subHeader
              subHeaderComponent={
                <>
                  {/* <button className="btn btn-primary mr-3" onClick={openModal}>
                    Digital Signature
                  </button> */}
                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    appElement={document.getElementById("root")}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                  >
                    <DigitalSignature userID={userID} closeModal={closeModal} />
                  </Modal>

                  <Modal
                    isOpen={isTemaplateModalOpen}
                    onRequestClose={closeTemplateModal}
                    contentLabel="Template Modal"
                    appElement={document.getElementById("root")}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                  >
                    <WFHTemplateOverview
                      closeTemplateModal={closeTemplateModal}
                      handleSubmit={handleSubmit}
                    />
                  </Modal>

                  {/* <Button
                    sx={{ marginRight: "10px" }}
                    size="medium"
                    onClick={handleExport}
                    variant="outlined"
                    color="secondary"
                  >
                    Export Excel
                  </Button> */}

                  <div className="d-flex">
                    <PDFDownloadLink
                      document={pdfTemplate()}
                      fileName={loginUserName + " invoice"}
                      style={{
                        // textDecoration: "none",
                        // padding: "10px",
                        color: "#4a4a4a",
                        // backgroundColor: "#f2f2f2",
                        // border: "1px solid #4a4a4a",
                      }}
                    >
                      {/* <button
                        className="btn btn-outline-primary me-3"
                        type="button"
                      >
                        PDF Download
                      </button> */}
                    </PDFDownloadLink>

                    <button
                      className="btn btn-outline-primary me-3"
                      type="button"
                    >
                      <Link to="/admin/dispute-overview" state={{ id: userID }}>
                        Dispute
                      </Link>
                    </button>

                    <input
                      type="text"
                      placeholder="Search here"
                      className="w-100 form-control"
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
                ScreenShot :
                {rowDataModal?.screenshot ? (
                  <img
                    src={`${baseUrl}` + `uploads/${rowDataModal?.screenshot}`}
                  />
                ) : (
                  "Null"
                )}
              </div>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="xiomodal"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WFHSingleUser;
