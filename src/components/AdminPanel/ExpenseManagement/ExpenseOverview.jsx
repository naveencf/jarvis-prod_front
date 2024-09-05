import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";
import DeleteButton from "../DeleteButton";
import { baseUrl } from "../../../utils/config";
import formatString from "../Operation/CampaignMaster/WordCapital";
import * as XLSX from "xlsx";
import ExpenseExcelData from "./ExpenseExcelData";

const ExpenseOverview = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);

  const getExpense = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_expense`);
      const data = res?.data?.data;
      // .sort((a, b) => b.amount - a.amount);
      setExpenseData(data);
      setFilterData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getExpense();
  }, []);

  useEffect(() => {
    const result = expenseData.filter((d) =>
      d.account_name?.toLowerCase().includes(search.toLowerCase())
    );

    setFilterData(result);
  }, [search, expenseData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(
        workbook.Sheets[firstSheetName]
      );

      const formattedData = worksheet.map((row) => ({
        account_name: row["Account Name"],
        description: row["Description"],
        amount: row["Amount"],
        transaction_date: new Date(row["Date"]).toISOString(),
        category_name: row["Category"],
        reference_number: row["Reference No."],
        major_status: row["Major Status"],
        minor_status: row["Minor Status"],
        // upload_bill_url: row["Bill URL"],
      }));

      setUploadedData(formattedData);
      setShowModal(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Account Name",
      selector: (row) => row.account_name,
      width: "140px",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => formatString(row.description),
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      width: "100px",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.transaction_date).toLocaleDateString(),
      width: "120px",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      width: "150px",
    },
    {
      name: "Reference No.",
      selector: (row) => row.reference_number,
      width: "140px",
      sortable: true,
    },
    {
      name: "Major Status",
      selector: (row) => formatString(row.major_status),
      width: "110px",
      sortable: true,
    },
    {
      name: "Minor Status",
      selector: (row) => row.minor_status,
      width: "150px",
      sortable: true,
    },
    {
      name: "Bill",
      cell: (row) => (
        <img src={row.upload_bill_url} style={{ width: "100px" }} alt="Bill" />
      ),
      width: "120px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="btn-group">
            <button
              type="button"
              className="icon-1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded={false}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/admin/update-expense/${row._id}`}>
                <button className="dropdown-item">Edit</button>
              </Link>
              <DeleteButton
                endpoint="delete_expense"
                id={row._id}
                getData={getExpense}
              />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Expense Management"
            link="/admin/create-expenseMangementMaster"
            buttonAccess={true}
            submitButton={true}
          />
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ marginLeft: "10px" }}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Expense Overview"
              columns={columns}
              data={filterData}
              fixedHeader
              pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
      <ExpenseExcelData
        show={showModal}
        handleClose={handleCloseModal}
        data={uploadedData}
      />
    </>
  );
};

export default ExpenseOverview;
