import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const TDSDeductedFilters = (props) => {
  const { setFilterData, setUniqueVendorCount, setUniqueVendorData, data } =
    props;
  const [dateFilter, setDateFilter] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestedAmountField] = useState("");
  const [search, setSearch] = useState("");

  const handleDateFilter = () => {
    const filterData = data?.filter((item) => {
      const date = new Date(item.request_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1?.setDate(toDate1?.getDate() + 1);
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);

      // Vender Name Filter
      const vendorNameFilterPassed =
        !vendorName ||
        item.vendor_name?.toLowerCase()?.includes(vendorName?.toLowerCase());

      // Priority Filter
      const priorityFilterPassed =
        !priorityFilter || item.priority === priorityFilter;

      // Search Query Filter
      const searchFilterPassed =
        !search ||
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val?.toLowerCase()?.includes(search?.toLowerCase())
        );

      // Requested Amount Filter
      const requestedAmountFilterPassed = () => {
        const numericRequestedAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.request_amount > numericRequestedAmount;
          case "lessThan":
            return +item.request_amount < numericRequestedAmount;
          case "equalTo":
            return +item.request_amount === numericRequestedAmount;
          default:
            return true;
        }
      };

      const allFiltersPassed =
        dateFilterPassed &&
        vendorNameFilterPassed &&
        priorityFilterPassed &&
        searchFilterPassed &&
        requestedAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueVendors = new Set(filterData?.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors?.size);
    const uvData = [];
    uniqueVendors.forEach((vendorName) => {
      const vendorRows = filterData.filter(
        (item) => item.vendor_name === vendorName
      );
      uvData.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);
  };

  const handleClearDateFilter = () => {
    setFilterData(data);
    setFromDate("");
    setToDate("");
    setVendorName("");
    setPriorityFilter("");
    setRequestAmountFilter("");
    setRequestedAmountField("");
    const uniqueVendors = new Set(data.map((item) => item.vendor_name));
    setUniqueVendorCount(uniqueVendors.size);
    const uvData = [];
    uniqueVendors?.forEach((vendorName) => {
      const vendorRows = data?.filter(
        (item) => item.vendor_name === vendorName
      );
      uvData?.push(vendorRows[0]);
    });
    setUniqueVendorData(uvData);
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
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
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <Autocomplete
                      value={vendorName}
                      onChange={(event, newValue) => setVendorName(newValue)}
                      options={Array.from(
                        new Set(
                          data?.map((option) => option?.vendor_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={priorityFilter}
                      className="form-control"
                      onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Request Amount Filter</label>
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Requested Amount</label>
                    <input
                      value={requestedAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setRequestedAmountField(e.target.value);
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
                  onClick={handleDateFilter}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearDateFilter}
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

export default TDSDeductedFilters;
