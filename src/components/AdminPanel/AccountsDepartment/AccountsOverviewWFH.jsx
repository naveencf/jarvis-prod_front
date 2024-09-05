import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MyTemplate1 from "../WFH/SalaryGeneration/Template";
import MyTemplate2 from "../WFH/SalaryGeneration/Template2";
import MyTemplate3 from "../WFH/SalaryGeneration/Template3";
import MyTemplate4 from "../WFH/SalaryGeneration/Template4";
import MyTemplate5 from "../WFH/SalaryGeneration/Template5";

import { generatePDF } from "../WFH/SalaryGeneration/pdfGenerator";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const AccountsOverviewWFH = () => {
  const { toastAlert } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [id, setId] = useState(0);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [screenshot, setScreenshot] = useState([]);
  const [refrenceNumber, setRefrenceNumber] = useState(null);
  const [rowData, setDataRow] = useState(null);
  const [selectedTemplate, setSelectedTempate] = useState(null);
  const [salaryStatusToggle, setSalaryStatusToggle] = useState(0);

  const [isloading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      axios.get(`${baseUrl}` + `get_finances`).then((res) => {
        const response = res.data;
        setData(response);
        setFilterData(
          response.filter((item) => item.status_ == salaryStatusToggle)
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setFilterData(data.filter((item) => item.status_ == salaryStatusToggle));
  }, [salaryStatusToggle]);

  useEffect(() => {
    const result1 = data.filter((d) => {
      return d.user_name?.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result1);
  }, [search]);

  const handlePay = (row) => {
    setShowModal(true);
    setId(row.id);
    setDataRow(row);
    setAmount("");
    setDate("");
  };

  function handlePayOut(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("amount", amount);
    formData.append("status_", 1);
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

  const handleInvoice = (data) => {
    setDataRow(data);
    setSelectedTempate(data?.invoice_template_no);
  };

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
      width: "80px",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dept_name,
      sortable: true,
    },
    {
      name: "Month",
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: "Year",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "Salary",
      selector: (row) => row.total_salary + " ₹",
      sortable: true,
    },
    {
      name: "Net Salary",
      selector: (row) => row.net_salary + " ₹",
      sortable: true,
    },
    {
      name: "TDS Deduction",
      selector: (row) => row.tds_deduction + " ₹",
      sortable: true,
      width: "150px",
    },
    {
      name: "To Pay",
      selector: (row) => row.toPay + " ₹",
      sortable: true,
    },
    {
      name: "Action",
      width: "200px",
      cell: (row) => (
        <>
          {salaryStatusToggle == 0 && (
            <button
              className="btn cmnbtn btn_sm btn-outline-primary"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() => handlePay(row)}
            >
              Pay
            </button>
          )}

          {row?.invoice_template_no !== "0" && (
            <button
              className="btn cmnbtn btn_sm tableIconBtn btn-outline-primary ml8"
              title="Download Invoice"
              type="button"
              onClick={() => generatePDF(row)}
            >
              <CloudDownloadIcon className="fs-5" />
            </button>
          )}
        </>
      ),
    },
  ];

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <FormContainer
        mainTitle="Account Overview"
        link="/admin/user"
        submitButton={false}
      />

      {isloading ? (
        <div className="loader">
          <div>
            <ul>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
              <li>
                <svg fill="currentColor" viewBox="0 0 90 120">
                  <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                </svg>
              </li>
            </ul>
          </div>
          <span>Loading</span>
        </div>
      ) : (
        <div className="card">
          <div className="card-header flexCenterBetween">
            <h5 className="card-title">WFH Salary</h5>
            <div className="flexCenter">
              <div className="pack">
                <div className="btn-group mr-2" role="group">
                  <button
                    type="button"
                    className={`btn cmnbtn btn_sm btn-${
                      salaryStatusToggle == 0 ? "primary" : "outline-primary"
                    }`}
                    onClick={() => setSalaryStatusToggle(0)}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    className={`btn cmnbtn btn_sm btn-${
                      salaryStatusToggle == 1 ? "primary" : "outline-primary"
                    }`}
                    onClick={() => setSalaryStatusToggle(1)}
                  >
                    Paid
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-100 form-control form_sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="data_tbl table-responsive card-body body-padding">
            <DataTable
              columns={columns}
              data={filterData}
              // fixedHeader
              pagination
              // fixedHeaderScrollHeight="64vh"
            />
          </div>
        </div>
      )}

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
    </div>
  );
};

export default AccountsOverviewWFH;
