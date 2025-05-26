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
  "Payment Released",
  "Failed Transactions",
];

export default function FinanceWFHDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [rowForPayment, setRowForPayment] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [refrenceNumber, setRefrenceNumber] = useState(null);
  const [screenshot, setScreenshot] = useState([]);
  const [rowData, setDataRow] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [CSVFile, setCSVFile] = useState(null);
  const [rowUTR, setRowUTR] = useState({ value: "", row: null });
  const { toastAlert, toastError } = useGlobalContext();

  const monthOptions = [
    { value: "January", label: "January (16Jan - 15Feb)" },
    { value: "February", label: "February (16Feb - 15Mar)" },
    { value: "March", label: "March (16Mar - 15Apr)" },
    { value: "April", label: "April (16Apr - 15May)" },
    { value: "May", label: "May (16May - 15Jun)" },
    { value: "June", label: "June (16Jun - 15Jul)" },
    { value: "July", label: "July (16Jul - 15Aug)" },
    { value: "August", label: "August (16Aug - 15Sep)" },
    { value: "September", label: "September (16Sep - 15Oct)" },
    { value: "October", label: "October (16Oct - 15Nov)" },
    { value: "November", label: "November (16Nov - 15Dec)" },
    { value: "December", label: "December (16Dec - 15Jan)" },
  ];
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear().toString();

  const [years, setYears] = useState(currentYear);
  const [months, setMonths] = useState(currentMonthName);

  const yearOptions = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
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
    }
  };

  function convertDateToDDMMYYYY(dateString) {
    if (String(dateString).startsWith("0000-00-00")) {
      return " ";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}-${month}-${year}`;
    }
  }

  const handleDownloadExcel = () => {
    const formattedData = rowForPayment?.map((row, index) => ({
      "Beneficiary Name (Mandatory) Special characters not supported":
        row.beneficiary_name,
      "Beneficiary's Account Number (Mandatory) Typically 9-18 digits":
        row.account_no,
      "IFSC Code (Mandatory) 11 digit code of the beneficiary’s bank account. Eg. HDFC0004277":
        row.ifsc_code,
      "Payout Amount (Mandatory) Amount should be in rupees":
        row.toPay?.toFixed(0),
      "Payout Mode (Mandatory) Select IMPS/NEFT/RTGS": "MPS",
      "Payout Narration (Optional) Will appear on bank statement (max 30 char with no special characters)":
        "Test",
      "Notes (Optional) A note for internal reference": "Sample Note",
      "Phone Number (Optional)": row.user_contact_no,
      "Email ID (Optional)": row.user_email_id,
      "Contact Reference ID (Optional) Eg: Employee ID or Customer ID":
        row.user_id,
      "Payout Reference ID (Optional) Eg: Bill no or Invoice No or Pay ID":
        row.invoiceNo,
    }));
    const fileName = "AllSalary.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

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
    },
    {
      headerName: "Status",
      field: "attendence_status_flow",
      width: 250,
      renderCell: (params) => {
        return params.row.attendence_status_flow;
      },
    },
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
            <div className="card-header">
              <button
                variant="contained"
                color="primary"
                size="small"
                sx={{ width: "200px" }}
                className="btn cmnbtn btn_sm btn-outline-primary ml-3"
                // onClick={handleDownloadIPayoutReleased}
                onClick={handleDownloadIPayoutReleased}
              >
                Download Invoice
              </button>
              <button
                variant="contained"
                color="primary"
                size="small"
                sx={{ width: "200px" }}
                className=" btn cmnbtn btn_sm btn-outline-primary ml-3"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </div>
          </>
        )}
        <div className="card-body thm_table">
          <DataGrid
            rows={filterData?.filter(
              (item) => item.attendence_status_flow == "Proceeded to bank"
            )}
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
          {activeAccordionIndex === 1 && payoutReleased}
          {activeAccordionIndex === 2 && failedTransaction}
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
