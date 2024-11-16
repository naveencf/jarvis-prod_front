import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const SaleBookingCloseFilters = (props) => {
  const {
    datas,
    setFilterData,
    setUniqueCustomerCount,
    setUniqueCustomerData,
    setUniqueSalesExecutiveData,
    setUniqueSalesExecutiveCount,
  } = props;
  const [dateFilter, setDateFilter] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");

  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.account_name.toLowerCase().includes(customerName.toLowerCase());

      // Requested By Filter
      const salesExecutiveFilterPassed =
        !salesExecutive ||
        item.created_by_name
          ?.toLowerCase()
          ?.includes(salesExecutive?.toLowerCase());
      // Campaign Amount filter
      const campaignAmountFilterPassed = () => {
        const campaignAmount = parseFloat(campaignAmountField);
        switch (campaignAmountFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmount;
          case "lessThan":
            return +item.campaign_amount < campaignAmount;
          case "equalTo":
            return +item.campaign_amount === campaignAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        customerNameFilterPassed &&
        salesExecutiveFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueCustomers = new Set(
      filterData.map((item) => item.account_name)
    );
    setUniqueCustomerCount(uniqueCustomers?.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return filterData?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      filterData?.map((item) => item.created_by_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return filterData?.find((item) => item.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setSalesExecutive("");
    const uniqueCustomers = new Set(datas.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers?.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return datas?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(datas?.map((item) => item.created_by_name));
    setUniqueSalesExecutiveCount(uniqueSalesEx?.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return datas?.find((item) => item.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  return (
    <div>
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
                <option value="currentQuarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-4 col-sm-12">
              <div className="form-group">
                <label>Account Name</label>
                <Autocomplete
                  value={customerName}
                  onChange={(event, newValue) => setCustomerName(newValue)}
                  options={Array?.from(
                    new Set(datas?.map((option) => option.account_name || []))
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Account Name"
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
                <label>Sales Executive Name</label>
                <Autocomplete
                  value={salesExecutive}
                  onChange={(event, newValue) => setSalesExecutive(newValue)}
                  options={Array?.from(
                    new Set(
                      datas?.map((option) => option.created_by_name || [])
                    )
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Sales Executive Name"
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
                <label>Campaign Amount Filter</label>
                <select
                  value={campaignAmountFilter}
                  className="form-control"
                  onChange={(e) => setCampaignAmountFilter(e.target.value)}
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
                <label>Campaign Amount</label>
                <input
                  value={campaignAmountField}
                  type="number"
                  placeholder="Request Amount"
                  className="form-control"
                  onChange={(e) => {
                    setcampaignAmountField(e.target.value);
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
  );
};

export default SaleBookingCloseFilters;
