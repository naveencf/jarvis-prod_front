import { useState } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";

const PendingApprovalFilters = (props) => {
  const {
    datas,
    setFilterData,
    setUniqueCustomerCount,
    setUniqueCustomerData,
    paymentModeArray,
    setDateFilter,
    dateFilter,
  } = props;

  const [AccountName, setAccountName] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [paymentMode, setPaymetMode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentAmountFilter, setPaymentAmountFilter] = useState("");
  const [paymentAmountField, setPaymentAmountField] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.payment_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const AccountNameFilterPassed =
        !AccountName ||
        item?.account_name?.toLowerCase().includes(AccountName?.toLowerCase());

      // Requested By Filter
      const requestedByFilterPassed =
        !requestedBy ||
        item?.created_by_name
          ?.toLowerCase()
          .includes(requestedBy?.toLowerCase());
      //  Payment Mode
      const pmData =
        paymentModeArray.find((mode) => mode._id === item.payment_mode)
          ?.payment_mode_name || "";

      const paymentModeFilterPassed =
        !paymentMode ||
        pmData?.toLowerCase()?.includes(paymentMode?.toLowerCase());

      //  Payment Amount Filter
      const paymentAmountFilterPassed = () => {
        const paymentAmount = parseFloat(paymentAmountField);
        switch (paymentAmountFilter) {
          case "greaterThan":
            return +item.payment_amount > paymentAmount;
          case "lessThan":
            return +item.payment_amount < paymentAmount;
          case "equalTo":
            return +item.payment_amount === paymentAmount;
          default:
            return true;
        }
      };
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
        AccountNameFilterPassed &&
        requestedByFilterPassed &&
        paymentModeFilterPassed &&
        paymentAmountFilterPassed() &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueAccounts = new Set(filterData.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueAccounts.size);
    const uniqueAccountData = Array.from(uniqueAccounts).map((AccName) => {
      return filterData.find((item) => item?.account_name === AccName);
    });
    setUniqueCustomerData(uniqueAccountData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setAccountName("");
    setRequestedBy("");
    setPaymentAmountFilter("");
    setPaymentAmountField("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setPaymetMode("");

    const uniqueAccounts = new Set(datas?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueAccounts.size);
    const uniqueAccountData = Array.from(uniqueAccounts).map((accName) => {
      return datas?.find((item) => item?.account_name === accName);
    });
    setUniqueCustomerData(uniqueAccountData);
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
                    <option value="nextMonth">Next Month</option>
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
                      value={AccountName}
                      onChange={(event, newValue) => setAccountName(newValue)}
                      options={Array.from(
                        new Set(
                          datas?.map((option) => option?.account_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Account Name"
                          type="text"
                          style={{ color: "var(--gray-600)" }}
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Requested By</label>
                    <Autocomplete
                      value={requestedBy}
                      onChange={(event, newValue) => setRequestedBy(newValue)}
                      options={Array.from(
                        new Set(
                          datas?.map((option) => option?.created_by_name || [])
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Requested By"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <Autocomplete
                      value={paymentMode}
                      onChange={(event, newValue) => setPaymetMode(newValue)}
                      options={Array.from(
                        new Set(
                          datas
                            ?.map((option) => {
                              const paymentModeData = paymentModeArray.find(
                                (mode) => mode._id === option?.payment_mode
                              );
                              return paymentModeData?.payment_mode_name || "";
                            })
                            .filter((mode) => mode !== "")
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Mode"
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
                    <label>Pay Amount Filter</label>
                    <select
                      value={paymentAmountFilter}
                      className="form-control"
                      onChange={(e) => setPaymentAmountFilter(e.target.value)}
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
                    <label>Payment Amount</label>
                    <input
                      value={paymentAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setPaymentAmountField(e.target.value);
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
                      placeholder="Campaign Amount"
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
      </div>
    </div>
  );
};

export default PendingApprovalFilters;
