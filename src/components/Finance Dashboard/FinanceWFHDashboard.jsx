import { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import axios from "axios";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Button } from "@mui/material";
import { downloadSelectedInvoices } from "../AdminPanel/WFH/SalaryGeneration/ZipGenerator";
import { generatePDF } from "../AdminPanel/WFH/SalaryGeneration/pdfGenerator";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import Select from "react-select";
import * as XLSX from "xlsx";
import DataGridDialog from "../DataGridDialog/DataGridDialog";
import FieldContainer from "../AdminPanel/FieldContainer";
import BankExcelConverter from "../../utils/BankExcelConverter";
import { FaEye } from "react-icons/fa6";

const accordionButtons = [
  "Pending Verify",
  // "Proceed to Bank",
  "Payment Released",
  "Failed Transactions",
  // "TDS",
  // "Non-TDS",
];

export default function FinanceWFHDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [months, setMonths] = useState("");
  const [years, setYears] = useState("");

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  // const [dataRow, setDataRow] = useState({});
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [rowForPayment, setRowForPayment] = useState([]);
  console.log(rowForPayment , 'row for payment')
  console.log(filterData , 'fillter data')
  const [invoice, setInvoice] = useState("");
  const [refrenceNumber, setRefrenceNumber] = useState(null);
  const [screenshot, setScreenshot] = useState([]);
  const [rowData, setDataRow] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [CSVFile, setCSVFile] = useState(null);
  const [rowUTR, setRowUTR] = useState({ value: "", row: null });
  const { toastAlert, toastError } = useGlobalContext();

  const monthOptions = [
    { value: "January", label: "January (15Jan - 15Feb)" },
    { value: "February", label: "February (15Feb - 15Mar)" },
    { value: "March", label: "March (15Mar - 15Apr)" },
    { value: "April", label: "April (15Apr - 15May)" },
    { value: "May", label: "May (15May - 15Jun)" },
    { value: "June", label: "June (15Jun - 15Jul)" },
    { value: "July", label: "July (15Jul - 15Aug)" },
    { value: "August", label: "August (15Aug - 15Sep)" },
    { value: "September", label: "September (15Sep - 15Oct)" },
    { value: "October", label: "October (15Oct - 15Nov)" },
    { value: "November", label: "November (15Nov - 15Dec)" },
    { value: "December", label: "December (15Dec - 15Jan)" },
  ];

  const yearOptions = [
    // { value: "2010", label: "2010" },
    // { value: "2011", label: "2011" },
    // { value: "2012", label: "2012" },
    // { value: "2013", label: "2013" },
    // { value: "2014", label: "2014" },
    // { value: "2015", label: "2015" },
    // { value: "2016", label: "2016" },
    // { value: "2017", label: "2017" },
    // { value: "2018", label: "2018" },
    // { value: "2019", label: "2019" },
    // { value: "2020", label: "2020" },
    // { value: "2021", label: "2021" },
    // { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    // { value: "2027", label: "2027" },
    // { value: "2028", label: "2028" },
    // { value: "2029", label: "2029" },
    // { value: "2030", label: "2030" },
  ];

  const handSearchleClick = () => {
    setShowFilterModal(true);
  };

  const getData = async () => {
    try {
      axios.get(`${baseUrl}` + `get_finances`).then((res) => {
        const response = res.data;
        setData(response);
        setFilterData(response);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const departmentAPI = () => {
    axios.get(baseUrl + "get_wfh_users_with_dept").then((res) => {
      setDepartmentData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
    departmentAPI();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      const departmentMatch = !departmentFilter || d.dept === departmentFilter;
      const monthsMatch = !months || d.month === months;

      const yearsMatch = !years || d.year == years;
      return departmentMatch && monthsMatch && yearsMatch;
    });
    setFilterData(result);
  }, [data, departmentFilter, months, years]);

  useEffect(() => {
    axios
      .post(`${baseUrl}` + `get_wfhd_tds_users`, {
        month: months,
        year: 1 * years,
        dept_id: departmentFilter,
      })
      .then((res) => {
        setFilterData(res.data);
      });
  }, [showFilterModal]);

  const handleDownloadInvoices = async () => {
    const handleError = (error) => {
      var err = error.toString();
      if (err === "RangeError: Array buffer allocation failed")
        toastError("Please select only 40 invoices at a time");
    };
    try {
      await downloadSelectedInvoices(rowForPayment, handleError);
    } catch (error) {
      console.error("Error downloading invoices:", error);
    }
  };

  const handleDownloadIPayoutReleased = async () => {
    try {
      await downloadSelectedInvoices(rowForPayment);
    } catch (error) {}
  };

  const handleUTRupload = async (e, row) => {
    e.preventDefault();
    axios

      .put(
        `${baseUrl}` + `edit_finance_utr`,
        {
          id: row.id,
          attendence_id: Number(rowUTR.row.attendence_id),
          utr: String(rowUTR.value),
        },
        {}
      )
      .then(() => {
        setRowUTR({ value: "", row: null });
        toastAlert("UTR uploaded");
        getData();
      });
  };

  const handleCSVFlieupload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("excel", CSVFile);
    await axios
      .post(`${baseUrl}` + `set_utr_data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toastAlert("CSV uploaded");
        getData();
      });
  };

  const handleSendToBank = async () => {
    try {
      for (let i = 0; i < rowForPayment.length; i++) {
        const formData = new FormData();

        formData.append("id", rowForPayment[i].id);
        formData.append("amount", rowForPayment[i].toPay);
        formData.append("status_", 1);
        formData.append("screenshot", screenshot);
        formData.append("reference_no", rowForPayment[i].reference_no);
        formData.append("pay_date", new Date());
        formData.append("attendence_id", rowForPayment[i].attendence_id);

        axios
          .put(`${baseUrl}` + `edit_finance`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            setRefrenceNumber("");
            setAmount("");
            toastAlert("Sent to bank");
            setShowModal(false);
          });
        toastAlert("Sent to bank");
      }

      toastAlert("Sent to bank");
      getData();
      setTimeout(() => {
        getData();
      }, 1000);
    } catch (error) {
      console.error("Error sending to bank:", error);
      // Handle any errors related to sending to bank here
    }
  };

  // const handleDownloadExcel = () => {
  //   const formattedData = rowForPayment?.map((row, index) => ({
  //     "S.No": index + 1,
  //     Name: row.user_name,
  //     Department: row.dept_name,
  //     Month: row.month,
  //     Year: row.year,
  //     Salary: row.total_salary,
  //     "Net Salary": row.net_salary,
  //     "TDS Deduction": row.tds_deduction,
  //     "To Pay": row.toPay,
  //     Status: row.attendence_status_flow,
  //     "Attendence ID": row.attendence_id,
  //     utr: "",
  //   }));
  //   const fileName = "AllSalary.xlsx";
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  //   XLSX.writeFile(workbook, fileName);
  // };

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
      return `${day}-${month}-${year}`;
    }
  }

  const handleDownloadExcel = () => {
    // return console.log(rowForPayment,"rowForPayment");
    const formattedData = rowForPayment?.map((row, index) => ({
      "PYMT_PROD_TYPE_CODE \n Fixed Value: PAB_VENDOR (All in block letters)":
        "PAB_VENDOR",
      "PYMT_MODE Allowed values: FT, NEFT, RTGS, IMPS  (All in block letters; FT: for Fund Transfer to ICICI Acc. ; No special Characters)":
        row.bank_name == "ICICI Bank" ? "FT" : "NEFT",
      "DEBIT_ACC_NO Allowed values: 12 digit ICICI Bank Account number; No special Characters":
        "004105018735",
      "BNF_NAME Name of Beneficiary    (No Special Characters; Max 500 Alphabetical Characters allowed)":
        row.beneficiary_name,
      "BENE_ACC_NO Account number of Beneficiary (Max 32 Numeric Characters allowed only)":
        row.account_no,
      "BENE_IFSC IFSC code of Beneficiary (Enter ICIC0000011 for FT; Alphanumeric only; No special characters)":
        row.ifsc_code,
      "AMOUNT Numeric value with decimal up to 2 places": row.toPay?.toFixed(0),
      "DEBIT_NARR 30 Alphanumeric Characters; No special characters allowed":
        row.user_name,
      "CREDIT_NARR 30 Alphanumeric Characters; No special characters allowed":
        "",
      "MOBILE_NUM Mobile no of Bene.10 Digit Numeric values allowed":
        row.user_contact_no,
      "EMAIL_ID Email Id of Bene.500 Characters allowed": row.user_email_id,
      "REMARK Non-Mandatory field (For Internal Use Only)": "",
      "PYMT_DATE Date format  DD-MM-YYYY": convertDateToDDMMYYYY(new Date()),
      "REF_NO Non-Mandatory field (30 Characters Alphanumeric Allowed)": "",
      "ADDL_INFO1 Non-Mandatory field (500 Characters Alphanumeric Allowed)":
        "",
      "ADDL_INFO2 Non-Mandatory field (500 Characters Alphanumeric Allowed)":
        "",
      "ADDL_INFO3 Non-Mandatory field (500 Characters Alphanumeric Allowed)":
        "",
      "ADDL_INFO4 Non-Mandatory field (500 Characters Alphanumeric Allowed)":
        "",
      "ADDL_INFO5 Non-Mandatory field (500 Characters Alphanumeric Allowed)":
        "",
    }));
    const fileName = "AllSalary.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  // const handleDownloadExcel = () => {
  //   const formattedData = rowForPayment?.map((row, index) => ({
  //     "PYMT_PROD_TYPE_CODE \n Fixed Value: PAB_VENDOR (All in block letters)": "PAB_VENDOR",
  //     "PYMT_MODE Allowed values: FT, NEFT, RTGS, IMPS  (All in block letters; FT: for Fund Transfer to ICICI Acc. ; No special Characters)": row.bank_name === "ICICI" ? "FT" : "NEFT",
  //     "DEBIT_ACC_NO Allowed values: 12 digit ICICI Bank Account number; No special Characters": "004105018735",
  //     "BNF_NAME Name of Beneficiary    (No Special Characters; Max 500 Alphabetical Characters allowed)": row.beneficiary_name,
  //     "BENE_ACC_NO Account number of Beneficiary (Max 32 Numeric Characters allowed only)": row.account_no,
  //     "BENE_IFSC IFSC code of Beneficiary (Enter ICIC0000011 for FT; Alphanumeric only; No special characters)": row.ifsc_code,
  //     "AMOUNT Numeric value with decimal up to 2 places": row.toPay,
  //     "DEBIT_NARR 30 Alphanumeric Characters; No special characters allowed": row.user_name,
  //     "CREDIT_NARR 30 Alphanumeric Characters; No special characters allowed": "",
  //     "MOBILE_NUM Mobile no of Bene.10 Digit Numeric values allowed": row.user_contact_no,
  //     "EMAIL_ID Email Id of Bene.500 Characters allowed": row.user_email_id,
  //     "REMARK Non-Mandatory field (For Internal Use Only)": "",
  //     "PYMT_DATE Date format  DD-MM-YYYY": convertDateToDDMMYYYY(row.date),
  //     "REF_NO Non-Mandatory field (30 Characters Alphanumeric Allowed)": "",
  //     "ADDL_INFO1 Non-Mandatory field (500 Characters Alphanumeric Allowed)": "",
  //     "ADDL_INFO2 Non-Mandatory field (500 Characters Alphanumeric Allowed)": "",
  //     "ADDL_INFO3 Non-Mandatory field (500 Characters Alphanumeric Allowed)": "",
  //     "ADDL_INFO4 Non-Mandatory field (500 Characters Alphanumeric Allowed)": "",
  //     "ADDL_INFO5 Non-Mandatory field (500 Characters Alphanumeric Allowed)": ""
  //   }));

  //   const fileName = "AllSalary.xlsx";

  //   // Create a new sheet with an empty header row
  //   const worksheet = XLSX.utils.json_to_sheet([]);

  //   const formattedHeaders = [
  //     "PYMT_PROD_TYPE_CODE \n Fixed Value: PAB_VENDOR (All in block letters)",
  //     "PYMT_MODE Allowed values: FT, NEFT, RTGS, IMPS  (All in block letters; FT: for Fund Transfer to ICICI Acc. ; No special Characters)",
  //     // ... other headers ...
  //   ];

  //   // Ensure at least an empty header row exists
  //   worksheet['!ref'] = { v: formattedHeaders[0], t: 's' }; // Set first header value and type (string)

  //   // ... (Rest of the code

  //   // Update reference to include all headers
  //   worksheet['!ref'] = XLSX.utils.encode_cell({ c: formattedHeaders.length - 1, r: 0 });

  //   // Create a merge range for headers
  //   const mergeRange = XLSX.utils.decode_cell(worksheet['!ref']) + ':' + XLSX.utils.encode_cell({ c: formattedHeaders.length - 1, r: 0 });
  //   worksheet['!merges'] = [{ s: { c: 0, r: 0 }, e: { c: formattedHeaders.length - 1, r: 0 } }];

  //   // Set header cell style (replace with your desired red color)
  //   const headerStyle = { fgColor: { rgb: 'FF0000' }, alignment: { wrapText: true } }; // Red background, wrap text
  //   for (let i = 0; i < formattedHeaders.length; i++) {
  //     worksheet[XLSX.utils.encode_cell({ c: i, r: 0 })].i = headerStyle;
  //   }

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  //   XLSX.writeFile(workbook, fileName);
  // };

  const handleRowSelectionModelChange = async (rowIds) => {
    setRowSelectionModel(rowIds);
    let x = filterData?.filter((item) => {
      return rowIds.includes(item._id);
    });
    setRowForPayment(x);
  };

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  function CustomColumnMenu(props) {
    return (
      <>
        <GridColumnMenu
          {...props}
          slots={{
            columnMenuColumnsItem: null,
          }}
        />
      </>
    );
  }

  const handleVerifyAll = (e) => {
    e.preventDefault();

    try {
      for (let i = 0; i < rowForPayment.length; i++) {
        const formData = new FormData();

        formData.append("id", rowForPayment[i].id);
        formData.append("amount", rowForPayment[i].toPay);
        formData.append("status_", 2);
        formData.append("screenshot", screenshot);
        formData.append("reference_no", rowForPayment[i].reference_no);
        formData.append("pay_date", new Date());
        formData.append("attendence_id", rowForPayment[i].attendence_id);

        axios
          .put(`${baseUrl}` + `edit_finance`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            setRefrenceNumber("");
            setAmount("");
            toastAlert("Sent to bank");
            setShowModal(false);
          });
        toastAlert("Sent to bank");
      }

      toastAlert("Sent to bank");
      getData();
      setTimeout(() => {
        getData();
      }, 1000);
    } catch (error) {
      console.error("Error sending to bank:", error);
      // Handle any errors related to sending to bank here
    }
  };

  const handlePay = (row, e) => {
    e.preventDefault(e);
    setShowModal(true);
    setId(row.id);
    setDataRow(row);
    setAmount("");
    setDate("");
    setAmount(row.toPay);
  };

  const handlePayVerify = (row, e) => {
    setDataRow(() => row);
    e.preventDefault(e);
    setAmount(() => row.net_salary);
    setId(() => row.id);
    setRefrenceNumber(() => row.reference_no);
    setDate(() => row.pay_date);
    handlePayOut(e);
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleUndo = async (e, row) => {
    e.preventDefault();
    axios
      .put(`${baseUrl}` + `update_finance_data`, {
        attendence_id: row.attendence_id,
      })
      .then(() => {
        toastAlert("Sent To Pending");
        getData();
      });
  };

  function handlePayOut(e) {
    e.preventDefault();
    if (!refrenceNumber) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("amount", amount);
    formData.append("status_", rowData.status_ === 0 ? 1 : 2);
    formData.append("screenshot", screenshot);
    formData.append("reference_no", refrenceNumber);
    formData.append("pay_date", date);
    formData.append("attendence_id", rowData.attendence_id);

    axios
      .put(`${baseUrl}` + `edit_finance`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setRefrenceNumber("");
        setAmount("");
        toastAlert("Paid");
        setShowModal(false);
        getData();
      });
  }

  const TDSUserCol = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex == 0
            ? filterData
                .filter((item) => item.status_ === 0)
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? filterData
                .filter((item) => item.status_ === 1)
                .indexOf(params.row)
            : filterData
                .filter((item) => item.status_ === 2)
                .indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      headerName: "Name",
      field: "name",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.user_name}</div>;
      },
    },
    {
      headerName: "Department",
      field: "department",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.dept_name}</div>;
      },
    },
    {
      headerName: "Month",
      field: "month",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.month}</div>;
      },
    },
    {
      headerName: "Year",
      field: "year",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.year}</div>;
      },
    },
    {
      field: "toPay",
      headerName: "To Pay",
      renderCell: (params) => {
        return <div>{`${params.row.toPay}  ₹`}</div>;
      },
    },
  ];

  const pendingColumns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex == 0
            ? filterData
                .filter((item) => item.status_ === 0)
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? filterData
                .filter((item) => item.status_ === 1)
                .indexOf(params.row)
            : filterData
                ?.filter(
                  (item) => item.attendence_status_flow == "Payment Failed"
                )
                .indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      headerName: "Name",
      field: "user_name",
      width: 150,
      // renderCell: (params) => {
      //   return <div>{params.row.user_name}</div>;
      // },
    },
    {
      headerName: "Invoice No",
      field: "invoiceNo",
      width: 150,
    },
    {
      headerName: "Department",
      field: "department",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.dept_name}</div>;
      },
    },
    {
      headerName: "Month",
      field: "month",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.month}</div>;
      },
    },
    {
      headerName: "Year",
      field: "year",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.year}</div>;
      },
    },
    {
      headerName: "Salary",
      field: "salary",
      width: 150,
      renderCell: (params) => {
        // return <div>{`${params.row.total_salary?.toFixed(0)}  ₹`} </div>;
        return <div>{`${params.row.salary?.toFixed(0)}  ₹`} </div>;
      },
    },
    {
      headerName: "Net Salary",
      field: "net_salary",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.net_salary?.toFixed(0)}</div>;
      },
      valueFormatter: (params) => {
        const value = params.value; 
        return Math.round(value); 
      },
    },
    {
      headerName: "TDS Deduction",
      field: "tds_deduction",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.tds_deduction}</div>;
      },
    },
    {
      headerName: "To Pay",
      field: "toPay",
      width: 150,
      renderCell: (params) => {
        const value = params.value; 
        const roundedValue = Math.round(value);
        return <div>{roundedValue}</div>;
      },
      valueFormatter: (params) => {
        const value = params.value; 
        return Math.round(value); 
      },
    }
,    
    {
      headerName: "Status",
      field: "attendence_status_flow",
      width: 250,
      renderCell: (params) => {
        return params.row.attendence_status_flow;
      },
    },
    // {
    //   headerName: "Action",
    //   field: "action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {activeAccordionIndex != 2 && (
    //           <button
    //             className="btn btn-primary"
    //             data-toggle="modal"
    //             data-target="#exampleModal"
    //             onClick={(e) =>
    //               activeAccordionIndex == 0
    //                 ? handlePay(params.row, e)
    //                 : handlePayVerify(params.row, e)
    //             }
    //           >
    //             Verify
    //           </button>
    //         )}

    //         {params.row?.invoice_template_no !== "0" && (
    //           <button
    //             className="btn btn-outline-primary btn-sm"
    //             title="Download Invoice"
    //             type="button"
    //             onClick={() => {
    //               generatePDF(params.row);
    //             }}
    //           >
    //             <CloudDownloadIcon />
    //           </button>
    //         )}
    //       </>
    //     );
    //   },
    // },

    // {
    //   headerName: "UTR",
    //   width: 250,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //        <form method="post"
    //         // onSubmit={(e)=>handleUTRupload(e,params.row)}
    //          className="d-flex ">
    //         <input className="form-control" type="text" id="utr" name="utr"  />
    //         <button className="btn btn-primary " type="submit">
    //           Submit
    //         </button>
    //       </form>

    //       </div>
    //     );
    //   },
    // },
  ];

  if (activeAccordionIndex === 1 || activeAccordionIndex === 2) {
    pendingColumns.push({
      headerName: "UTR",
      width: 350,
      renderCell: (params) => {
        return (
          <div style={{ width: "500px" }}>
            <form
              method="post"
              // onSubmit={(e)=>handleUTRupload(e,params.row)}
              className="d-flex "
            >
              <input
                style={{ backgroundColor: "white" }}
                className="form-control mr-2"
                value={
                  params.row.utr
                    ? params.row.utr
                    : params.row.utr || rowUTR.row?.id === params.row.id
                    ? rowUTR.value
                    : ""
                }
                disabled={params.row.utr}
                type="text"
                id="utr"
                name="utr"
                onChange={(e) => {
                  setRowUTR({ value: e.target.value, row: params.row });
                }}
              />
              <button
                style={{ width: "100px" }}
                className="btn btn-primary"
                //  type="submit"
                onClick={(e) => handleUTRupload(e, params.row)}
                disabled={params.row.utr}
              >
                Submit
              </button>
              <button
                style={{ width: "100px" }}
                className="btn btn-success"
                // type="submit"
                onClick={(e) => handleUndo(e, params.row)}
              >
                Retrieve
              </button>
              <button
                className="btn cmnbtn btn_sm btn-outline-primary tableIconBtn ml8"
                title="View Invoice"
                type="button"
                onClick={() => {
                  generatePDF(params.row);
                }}
              >
                <FaEye />
              </button>
            </form>
          </div>
        );
      },
    });
  }

  if (activeAccordionIndex === 0) {
    pendingColumns.push({
      headerName: "Action",
      field: "action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {/* {activeAccordionIndex != 2 && (
              <button
                className="btn cmnbtn btn_sm btn-outline-primary"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={(e) => console.log(params.row.image_url)}
              >
                view
              </button>
            )} */}

            {/* {params.row?.invoice_template_no !== "0" && (
              <button
                className="btn cmnbtn btn_sm btn-outline-primary tableIconBtn ml8"
                title="Download Invoice"
                type="button"
                onClick={() => {
                  generatePDF(params.row);
                }}
              >
                <CloudDownloadIcon />
              </button>
            )} */}
            {params.row?.invoice_template_no !== "0" && (
              <button
                className="btn cmnbtn btn_sm btn-outline-primary tableIconBtn ml8"
                title="View Invoice"
                type="button"
                onClick={() => {
                  generatePDF(params.row);
                }}
              >
                <FaEye />
              </button>
            )}
          </>
        );
      },
    });
  }

  const NonTDS = (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
      <div style={{ height: "50px" }}>
        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadInvoices}
          >
            Download Invoice 
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleSendToBank}
          >
            Send to Bank
          </Button>
        )}
      </div>
      <div className="thm_table">
        <DataGrid
          rows={filterData?.filter((item) => item.status_ === 0)}
          columns={pendingColumns} 
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowSelectionModelChange={(rowIds) => {
            handleRowSelectionModelChange(rowIds);
            // console.log(rowIds);
          }}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </div>
  );
  const TDS = (
    <div>
      <div style={{ height: "50px" }}>
        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadInvoices}
          >
            Download Invoice 
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleSendToBank}
          >
            Send to Bank
          </Button>
        )}
      </div>
      <div className="thm_table">
        <DataGrid
          rows={filterData?.filter((item) => item.status_ === 0)}
          columns={pendingColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowSelectionModelChange={(rowIds) => {
            handleRowSelectionModelChange(rowIds);
            // console.log(rowIds);
          }}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </div>
  );

  const pending = (
    <>
      {rowForPayment.length > 0 && (
        <div className="card-header">
          <>
            <button
              className="btn cmnbtn btn_sm btn-outline-primary ml-3 "
              variant="contained"
              color="primary"
              size="small"
              onClick={handleDownloadInvoices}
            >
              Download Invoice 
            </button>
            <button
              className="btn cmnbtn btn_sm btn-outline-primary ml-3 "
              variant="contained"
              color="primary"
              size="lg"
              onClick={() => BankExcelConverter(rowForPayment)}
            >
              Download Excel
            </button>
            <button
              variant="contained"
              color="primary"
              size="small"
              className="btn cmnbtn btn_sm btn-outline-primary ml-3 \"
              onClick={handleDownloadExcel}
            >
              Export Bank Excel
            </button>
            <button
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: "200px", height: "50px" }}
              className=" btn cmnbtn btn_sm btn-outline-primary ml-3 "
              onClick={handleSendToBank}
            >
              Send to Bank
            </button>
          </>
        </div>
      )}

      <div className="thm_table card-body">
        <DataGrid
          rows={filterData?.filter((item) => item.status_ === 0)}
          columns={pendingColumns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowSelectionModelChange={(rowIds) => {
            handleRowSelectionModelChange(rowIds);
          }}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </>
  );

  const verified = (
    <div>
      <div style={{ height: "50px" }}>
        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={(e) => handleVerifyAll(e)}
          >
            Verify All
          </Button>
        )}
      </div>
      <div className="thm_table">
        <DataGrid
          rows={filterData?.filter((item) => item.status_ === 1)}
          columns={pendingColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowSelectionModelChange={(rowIds) => {
            handleRowSelectionModelChange(rowIds);
            // console.log(rowIds);
          }}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </div>
  );

  const payoutReleased = (
    <>
      <div>
        {rowForPayment.length > 0 && (
          <>
            <button
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: "200px" }}
              className=" btn cmn-btn  btn-outline-primary ml-3 mb-2"
              onClick={handleDownloadIPayoutReleased}
            >
              Download Invoice 
            </button>
            <button
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: "200px" }}
              className=" btn cmnbtn btn-outline-primary ml-3 mb-2"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </button>
          </>
        )}
        {/* <div style={{ height: "50px" }} className="d-flex">
          {rowForPayment.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ width: "100px" }}
              className="ml-3 mb-2"
              onClick={handleDownloadInvoices}
            >
              Download Invoice 
            </Button>
          )}
        </div> */}
        {/* <h1>Payout Released</h1> */}
        <div className="card-body thm_table">
          <DataGrid
            // rows={filterData?.filter((item) => item.status_ === 1 || item.attendence_status_flow == "Payment Released")}
            rows={filterData?.filter(
              (item) => item.attendence_status_flow == "Proceeded to bank"
            )}
            columns={pendingColumns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
            pageSizeOptions={[5, 25, 50, 100, 500]}
            checkboxSelection
            // disableRowSelectionOnClick
            onRowSelectionModelChange={(rowIds) => {
              handleRowSelectionModelChange(rowIds);
              // console.log(rowIds);
            }}
            rowSelectionModel={rowSelectionModel}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </div>
      </div>
    </>
  );

  const failedTransaction = (
    <div>
      {/* <div style={{ height: "50px" }}>
        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadInvoices}
          >
            Download Invoice 
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </Button>
        )}

        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleSendToBank}
          >
            Send to Bank
          </Button>
        )}
      </div> */}
      <div className="card-body thm_table">
        <DataGrid
          rows={filterData?.filter(
            (item) => item.attendence_status_flow == "Payment Failed"
          )}
          columns={pendingColumns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
          pageSizeOptions={[5, 25, 50, 100, 500]}
          checkboxSelection
          // disableRowSelectionOnClick
          onRowSelectionModelChange={(rowIds) => {
            handleRowSelectionModelChange(rowIds);
            // console.log(rowIds);
          }}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </div>
    </div>
  );

  // const verified = (
  //   <div>
  //     <div style={{ height: "50px" }}>
  //       {rowForPayment.length > 0 && (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           size="small"
  //           sx={{ width: "100px" }}
  //           className="ml-3 mb-2"
  //           onClick={(e) => handleVerifyAll(e)}
  //         >
  //           Verify All
  //         </Button>
  //       )}
  //     </div>
  //     <DataGrid
  //       rows={filterData.filter((item) => item.status_ === 1)}
  //       columns={pendingColumns}
  //       getRowId={(row) => row.id}
  //       initialState={{
  //         pagination: {
  //           paginationModel: {
  //             pageSize: 50,
  //           },
  //         },
  //       }}
  //       slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
  //       pageSizeOptions={[5, 25, 50, 100, 500]}
  //       checkboxSelection
  //       // disableRowSelectionOnClick
  //       onRowSelectionModelChange={(rowIds) => {
  //         handleRowSelectionModelChange(rowIds);
  //         // console.log(rowIds);
  //       }}
  //       rowSelectionModel={rowSelectionModel}

  //     />
  //   </div>
  // );

  // const payoutReleased = (
  //   <>
  //     <div>
  //       <div style={{ height: "50px" }} className="d-flex">
  //         {rowForPayment.length > 0 && (
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             size="small"
  //             sx={{ width: "100px" }}
  //             className="ml-3 mb-2"
  //             onClick={handleDownloadInvoices}
  //           >
  //             Download Invoice 
  //           </Button>
  //         )}
  //       </div>
  //       {/* <h1>Payout Released</h1> */}

  //       <DataGrid
  //         rows={filterData.filter((item) => item.status_ === 2)}
  //         columns={pendingColumns}
  //         getRowId={(row) => row.id}
  //         initialState={{
  //           pagination: {
  //             paginationModel: {
  //               pageSize: 50,
  //             },
  //           },
  //         }}
  //         slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
  //         pageSizeOptions={[5, 25, 50, 100, 500]}
  //         checkboxSelection
  //         // disableRowSelectionOnClick
  //         onRowSelectionModelChange={(rowIds) => {
  //           handleRowSelectionModelChange(rowIds);
  //           // console.log(rowIds);
  //         }}
  //         rowSelectionModel={rowSelectionModel}
  //       />
  //     </div>
  //   </>
  // );

  return (
    <div>
      <FormContainer
        mainTitle="Payout Summary"
        submitButton={false}
        link="true"
      />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="form-group col-3 ">
                  <label className="form-label">
                    Department Name<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...departmentData.map((option) => ({
                        value: option.dept_id,
                        label: option.dept_name,
                      })),
                    ]}
                    value={
                      departmentFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: departmentFilter,
                            label: departmentData.find(
                              (dept) => dept.dept_id === departmentFilter
                            )?.dept_name,
                          }
                    }
                    onChange={(selectedOption) => {
                      const selectedValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDepartmentFilter(selectedValue);
                      if (selectedValue === "") {
                        departmentAPI();
                      }
                    }}
                    required
                  />
                </div>
                {/* <div className="form-group col-3">
                  <label className="form-label">
                    Designation<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...designationData.map((option) => ({
                        value: option.desi_id,
                        label: option.desi_name,
                      })),
                    ]}
                    value={
                      designationFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: designationFilter,
                            label:
                              designationData.find(
                                (option) => option.desi_id === designationFilter
                              )?.desi_name || "Select...",
                          }
                    }
                    onChange={(selectedOption) => {
                      const newValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDesignationFilter(newValue);
                      if (newValue === "") {
                        designationAPI();
                      }
                    }}
                    required
                  />
                </div> */}
                <div className="form-group col-3">
                  <label className="form-label">
                    Months<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    value={monthOptions.find(
                      (option) => option.value === months
                    )}
                    onChange={(selectedOption) => {
                      setMonths(selectedOption.value);
                    }}
                    options={monthOptions}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Years<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    value={yearOptions.find((option) => option.value === years)}
                    onChange={(selectedOption) => {
                      setYears(selectedOption.value);
                    }}
                    options={yearOptions}
                  />
                </div>

                {/* <div className="form-group col-3">
                  <button
                    onClick={handSearchleClick}
                    disabled={!years || !months || !departmentFilter}
                    className="btn cmnbtn btn-primary mt-4"
                  >
                    Show TDS Users
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab">
        {accordionButtons.map((button, index) => (
          <div
            className={`named-tab ${
              activeAccordionIndex === index ? "active-tab" : ""
            }`}
            onClick={() => {
              handleAccordionButtonClick(index);
            }}
          >
            {button}
          </div>
        ))}
      </div>

      <div className="card">
        <div
          className={`${
            activeAccordionIndex === 1 || activeAccordionIndex === 0 ? "" : ""
          }`}
        >
          {activeAccordionIndex === 1 && (
            <div className="card-header">
              <div className="pack">
                <FieldContainer
                  type="file"
                  accept=".xls,.xlsx"
                  fieldGrid={6}
                  onChange={(e) => setCSVFile(e.target.files[0])}
                />
                <input
                  onClick={handleCSVFlieupload}
                  type="submit"
                  value={"Upload UTR"}
                  className="btn cmnbtn btn-primary btn_sm "
                  disabled={!CSVFile}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          {invoice}

          {activeAccordionIndex === 0 && pending}
          {/* {activeAccordionIndex === 1 && verified} */}
          {activeAccordionIndex === 1 && payoutReleased}
          {activeAccordionIndex === 2 && failedTransaction}
          {/* {activeAccordionIndex === 3 && TDS}
              {activeAccordionIndex === 4 && NonTDS} */}
        </div>
        {showModal && (
          <div
            className={`modal fade ${showModal ? "show" : ""}`}
            tabIndex={-1}
            role="dialog"
            style={{ display: showModal ? "block" : "none" }}
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
                    onClick={closeModal}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form onSubmit={handlePayOut}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="col-form-label">Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipient-name"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <label className="col-form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="recipient-name"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={`${new Date().getFullYear()}-${String(
                          new Date().getMonth() + 1
                        ).padStart(2, "0")}-01`}
                      />
                      <label className="col-form-label">Snapshot</label>
                      <input
                        type="file"
                        className="form-control"
                        id="recipient-name"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                      />
                    </div>
                    <div className="form-group">
                      <label className="col-form-label">RefrenceNumber</label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipient-name"
                        value={refrenceNumber}
                        onChange={(e) => setRefrenceNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // onClick={handlePayOut}
                    >
                      Pay
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showFilterModal && (
          <DataGridDialog
            open={showFilterModal}
            handleClose={() => {
              setShowFilterModal(false),
                setDepartmentFilter(""),
                setMonths(""),
                setYears("");
            }}
            fullWidth={true}
            maxWidth="lg"
            // handleFullWidthChange={handleFullWidthChange}
            // handleMaxWidthChange={handleMaxWidthChange}
            rows={filterData}
            columns={TDSUserCol}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
