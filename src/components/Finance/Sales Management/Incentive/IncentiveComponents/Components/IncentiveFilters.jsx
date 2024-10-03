import { Autocomplete, TextField, Button } from "@mui/material";
import React, { useState } from "react";

const IncentiveFilters = (props) => {
  const { setFilterData, datas } = props;
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestAmountField] = useState("");
  const [releasedAmountFilter, setReleasedAmountFilter] = useState("");
  const [releasedAmountField, setReleasedAmountField] = useState("");
  const [adminApprovedAmountFilter, setAdminApprovedAmountFilter] =
    useState("");
  const [adminApprovedAmountField, setAdminApprovedAmountField] = useState("");

  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.createdAt);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Sales Executive Filter:-
      const salesExecutiveFilterPassed =
        !salesExecutive?.label ||
        item?.sales_executive_name
          ?.toLowerCase()
          ?.includes(salesExecutive?.label.toLowerCase());
      // request amount filter:-
      const requestAmountFilterPassed = () => {
        const requestAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.user_requested_amount > requestAmount;
          case "lessThan":
            return +item.user_requested_amount < requestAmount;
          case "equalTo":
            return +item.user_requested_amount === requestAmount;
          default:
            return true;
        }
      };
      const releasedAmountFilterPassed = () => {
        const releasedAmount = parseFloat(releasedAmountField);
        switch (releasedAmountFilter) {
          case "greaterThan":
            return +item.finance_released_amount > releasedAmount;
          case "lessThan":
            return +item.finance_released_amount < releasedAmount;
          case "equalTo":
            return +item.finance_released_amount === releasedAmount;
          default:
            return true;
        }
      };
      const balancetAmountFilterPassed = () => {
        const balanceAmount = parseFloat(adminApprovedAmountField);
        switch (adminApprovedAmountFilter) {
          case "greaterThan":
            return +item.admin_approved_amount > balanceAmount;
          case "lessThan":
            return +item.admin_approved_amount < balanceAmount;
          case "equalTo":
            return +item.admin_approved_amount === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        salesExecutiveFilterPassed &&
        requestAmountFilterPassed() &&
        releasedAmountFilterPassed() &&
        balancetAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setSalesExecutive("");
    setRequestAmountFilter("");
    setRequestAmountField("");
    setReleasedAmountField("");
    setReleasedAmountFilter("");
    setAdminApprovedAmountField("");
    setAdminApprovedAmountFilter("");
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            {/* <div className="card-header flexCenterBetween">
              <h5 className="card-title">Search by filter</h5>
              <div className="flexCenter colGap12">
                <div className="form-group flexCenter colGap8">
                  <label className="w-100 m0">Select Date Range:</label>
                  <select
                    className="form-control form_sm"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="today">Today</option>
                    <option value="last7Days">Last 7 Days</option>
                    <option value="last30Days">Last 30 Days</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="currentMonth">Current Month</option>
                    <option value="currentQuarter">This Quarter</option>
                  </select>
                </div>
              </div>
            </div> */}
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Executive</label>
                    <Autocomplete
                      value={salesExecutive}
                      onChange={(event, newValue) =>
                        setSalesExecutive(newValue)
                      }
                      options={
                        Array.from(
                          new Set(
                            datas
                              ?.filter(
                                (option) =>
                                  option.sales_executive_name !== "Total"
                              )
                              ?.map((option) => option?.sales_executive_name)
                          )
                        ).map((name) => ({ label: name })) || []
                      }
                      getOptionLabel={(option) => option?.label || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sales Executive Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>From Date</label>
                    <input
                      value={fromDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>To Date</label>
                    <input
                      value={toDate}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        setToDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label> User Requested Amount Filter</label>
                    <select
                      value={requestAmountFilter}
                      className="form-control"
                      onChange={(e) => setRequestAmountFilter(e.target.value)}
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label> User Requested Amount</label>
                    <input
                      value={requestedAmountField}
                      type="number"
                      placeholder="Requested Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRequestAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Released Amount Filter</label>
                    <select
                      value={releasedAmountFilter}
                      className="form-control"
                      onChange={(e) => setReleasedAmountFilter(e.target.value)}
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Released Amount</label>
                    <input
                      value={releasedAmountField}
                      type="number"
                      placeholder="Released Amount"
                      className="form-control"
                      onChange={(e) => {
                        setReleasedAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label> Admin Approved Amount Filter</label>
                    <select
                      value={adminApprovedAmountFilter}
                      className="form-control"
                      onChange={(e) =>
                        setAdminApprovedAmountFilter(e.target.value)
                      }
                    >
                      <option value="">Select Amount</option>
                      <option value="greaterThan">Greater Than</option>
                      <option value="lessThan">Less Than</option>
                      <option value="equalTo">Equal To</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Admin Approved Amount</label>
                    <input
                      value={adminApprovedAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setAdminApprovedAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  onClick={handleAllFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentiveFilters;
