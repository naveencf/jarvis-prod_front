import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import View from "../../../AdminPanel/Sales/Account/View/View";
import FormContainer from "../../../AdminPanel/FormContainer";
// import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { Select, MenuItem, TextField, Button } from "@mui/material";

import {
  format,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  subQuarters,
  set,
} from "date-fns";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";

const OutstandingPaymentReleaseReport = () => {
  const [filter, setFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const token = sessionStorage.getItem("token");
  // const decodedToken = jwtDecode(token);

  const dateFilterOptions = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "yesterday", label: "Yesterday" },
    { value: "previous_week", label: "Previous Week" },
    { value: "previous_month", label: "Previous Month" },
    { value: "previous_year", label: "Previous Year" },
    { value: "previous_quarter", label: "Previous Quarter" },

    { value: "custom", label: "Custom" },
  ];

  const handlePaymentReleaseReport = async () => {
    setLoading(true);
    await axios
      .get(
        baseUrl +
          `sales/payment_update?status=${"approval"}&&start_date=${fromDate}&&end_date=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res, "response--->>>");
        setTableData(res?.data?.data);
        setLoading(false);
      });
  };

  const handleDateFilterChange = (data) => {
    const today = new Date();
    let from, to;

    switch (data) {
      case "today":
        from = to = today;
        break;
      case "this_week":
        from = startOfWeek(today);
        to = today;
        break;
      case "this_month":
        from = startOfMonth(today);
        to = today;
        break;
      case "this_quarter":
        from = startOfQuarter(today);
        to = today;
        break;
      case "this_year":
        from = startOfYear(today);
        to = today;
        break;
      case "yesterday":
        from = to = subDays(today, 1);
        break;
      case "previous_week":
        from = startOfWeek(subWeeks(today, 1));
        to = subDays(startOfWeek(today), 1);
        break;
      case "previous_month":
        from = startOfMonth(subMonths(today, 1));
        to = subDays(startOfMonth(today), 1);
        break;
      case "previous_quarter":
        from = startOfQuarter(subQuarters(today, 1));
        to = subDays(startOfQuarter(today), 1);
        break;
      case "previous_year":
        from = startOfYear(subYears(today, 1));
        to = subDays(startOfYear(today), 1);
        break;
      case "custom":
      default:
        from = "";
        to = "";
        break;
    }

    setFromDate(from ? format(from, "yyyy-MM-dd") : "");
    setToDate(to ? format(to, "yyyy-MM-dd") : "");
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    handleDateFilterChange(selectedFilter);
  };

  const columns = [
    {
      width: 70,
      key: "s_no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "payment_date",
      name: "Date",
      renderRowCell: (row) => <div>{row?.payment_date}</div>,
    },
    {
      key: "payment_date",
      name: "Month",
      renderRowCell: (row) => (
        <div>
          {row?.payment_date ? format(new Date(row.payment_date), "MMMM") : ""}
        </div>
      ),
    },
    {
      key: "payment_date",
      name: "Particulars",
      renderRowCell: (row) => <div>{row?.payment_mode_name}</div>,
    },
    {
      key: "payment_amount",
      name: "Amount",
      renderRowCell: (row) => <div>{row?.payment_amount}</div>,
    },
    {
      key: "created_by_name",
      name: "Sales Executive Name",
      renderRowCell: (row) => <div>{row?.created_by_name}</div>,
    },
    {
      key: "title",
      name: "Bank Name",
      renderRowCell: (row) => <div>{row?.payment_detail?.title}</div>,
    },
  ];

  // const handleClear = () => {
  //   setFilter("");
  // };
  return (
    <div>
      <FormContainer link={true} mainTitle={"Payment Release Report"} />
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <Select
                value={filter}
                onChange={handleFilterChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select Date Filter
                </MenuItem>
                {dateFilterOptions?.map((option) => (
                  <MenuItem key={option?.value} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {filter === "custom" && (
              <>
                <div className="col">
                  <TextField
                    className="w-100"
                    type="date"
                    // label="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="col">
                  <TextField
                    className="w-100"
                    type="date"
                    // label="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 flexCenter colGap12 pt8 mb-3 ">
              <button
                className="btn cmnbtn btn-primary"
                onClick={() => handlePaymentReleaseReport()}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <View
        columns={columns}
        data={tableData}
        isLoading={loading}
        title={"Payment Receive Report"}
        rowSelectable={true}
        setTotal={true}
        pagination={[100, 200]}
        tableName={"Finance Payment Receive Report"}
        selectedData={setSelectedData}
      />
    </div>
  );
};

export default OutstandingPaymentReleaseReport;
