import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useState } from "react";

function BalancePaymentListFilter(props) {
  const {
    customerList,
    salesExecutiveList, 
  } = props;

  const [dateFilter, setDateFilter] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [salesExecutiveName, setSalesExecutiveName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setCampaignAmountField] = useState("");
  const [balanceAmountFilter, setBalanceAmountFilter] = useState("");
  const [balanceAmountField, setBalanceAmountField] = useState("");
  const [gstNonGstData, setGstNonGstData] = useState("");

  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // sales Booking Date Range Filter:-
      const salesBookingdateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Account Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.account_name.toLowerCase().includes(customerName.toLowerCase());
      // sales Executive Name Filter:-
      const salesExecutiveNameFilterPassed =
        !salesExecutiveName ||
        item.created_by_name
          .toLowerCase()
          .includes(salesExecutiveName.toLowerCase());
      // GST FIlter:-
      const gstFilterPassed =
        !gstNonGstData ||
        (gstNonGstData === "GST" && item.gst_status === true) ||
        (gstNonGstData === "Non GST" && item.gst_status === false);

      //  Campaign Amount Filter
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
      //  Balance Amount Filter
      const balanceAmountFilterPassed = () => {
        const balanceAmount = parseFloat(balanceAmountField);
        const balance = +item.campaign_amount - item.paid_amount;
        switch (balanceAmountFilter) {
          case "greaterThan":
            return +balance > balanceAmount;
          case "lessThan":
            return +balance < balanceAmount;
          case "equalTo":
            return +balance === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameFilterPassed &&
        salesExecutiveNameFilterPassed &&
        salesBookingdateFilterPassed &&
        gstFilterPassed &&
        campaignAmountFilterPassed() &&
        balanceAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const invcData = res?.data?.data?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file !== "" &&
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id === "tax-invoice"
    );
    const NonInvoiceData = res?.data?.data?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file === "" ||
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id !== "tax-invoice"
    );
    // For Invoice
    const uniqueCustomers = new Set(invcData?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return invcData.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      invcData?.map((item) => item.created_by_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return invcData?.find((item) => item.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);

    // For Non-Invoice Created :-
    const uniqueNonInvoiceCustomers = new Set(
      NonInvoiceData?.map((item) => item.account_name)
    );
    setUniqueNonInvoiceCustomerCount(uniqueNonInvoiceCustomers.size);
    const uniqueNonInvoiceCustomerData = Array.from(
      uniqueNonInvoiceCustomers
    )?.map((customerName) =>
      NonInvoiceData.find((item) => item.created_by_name === customerName)
    );
    setUniqueNonInvoiceCustomerData(uniqueNonInvoiceCustomerData);

    const uniqueNonInvoiceSalesExecutives = new Set(
      NonInvoiceData?.map((item) => item.created_by_name)
    );
    setUniqueNonInvoiceSalesExecutiveCount(
      uniqueNonInvoiceSalesExecutives.size
    );
    const uniqueNonInvoiceSEData = Array.from(
      uniqueNonInvoiceSalesExecutives
    )?.map((salesEName) =>
      NonInvoiceData.find((item) => item.created_by_name === salesEName)
    );
    setUniqueNonInvoiceSalesExecutiveData(uniqueNonInvoiceSEData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setSalesExecutiveName("");
    setCampaignAmountFilter("");
    setCampaignAmountField("");
    setBalanceAmountFilter("");
    setBalanceAmountField("");
    setGstNonGstData("");

    const invcData = res?.data?.data?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file !== "" &&
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id === "tax-invoice"
    );
    const NonInvoiceData = res?.data?.data?.filter(
      (d) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file === "" ||
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id !== "tax-invoice"
    );
    // For Invoice
    const uniqueCustomers = new Set(invcData?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array?.from(uniqueCustomers)?.map(
      (customerName) => {
        return invcData?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      invcData?.map((item) => item.created_by_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array?.from(uniqueSalesEx)?.map((salesEName) => {
      return invcData?.find((item) => item?.created_by_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);

    // For Non-Invoice Created :-
    const uniqueNonInvoiceCustomers = new Set(
      NonInvoiceData?.map((item) => item?.account_name)
    );
    setUniqueNonInvoiceCustomerCount(uniqueNonInvoiceCustomers?.size);
    const uniqueNonInvoiceCustomerData = Array?.from(
      uniqueNonInvoiceCustomers
    )?.map((customerName) => {
      return NonInvoiceData?.find((item) => item.account_name === customerName);
    });
    setUniqueNonInvoiceCustomerData(uniqueNonInvoiceCustomerData);

    const uniqueNonInvoiceSalesExecutives = new Set(
      NonInvoiceData?.map((item) => item.created_by_name)
    );
    setUniqueNonInvoiceSalesExecutiveCount(
      uniqueNonInvoiceSalesExecutives?.size
    );
    const uniqueNonInvoiceSEData = Array?.from(
      uniqueNonInvoiceSalesExecutives
    )?.map((salesEName) => {
      return NonInvoiceData?.find(
        (item) => item.created_by_name === salesEName
      );
    });
    setUniqueNonInvoiceSalesExecutiveData(uniqueNonInvoiceSEData);
  };

  return (
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
                  <option value="thisWeek">This Week</option>
                  <option value="nextMonth">Next Month</option>
                  <option value="thisMonth">This Month</option>
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
                    options={
                      customerList &&
                      customerList?.map((e) => {
                        return e;
                      })
                    }
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
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="form-group">
                  <label>Sales Executive Name</label>
                  <Autocomplete
                    value={salesExecutiveName}
                    onChange={(event, newValue) =>
                      setSalesExecutiveName(newValue)
                    }
                    options={salesExecutiveList?.map((e) => {
                      return e;
                    })}
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
                      setCampaignAmountField(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="form-group">
                  <label>Balance Amount Filter</label>
                  <select
                    value={balanceAmountFilter}
                    className="form-control"
                    onChange={(e) => setBalanceAmountFilter(e.target.value)}
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
                  <label>Balance Amount</label>
                  <input
                    value={balanceAmountField}
                    type="number"
                    placeholder="Request Amount"
                    className="form-control"
                    onChange={(e) => {
                      setBalanceAmountField(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="form-group">
                  <label>GST</label>
                  <select
                    value={gstNonGstData}
                    className="form-control"
                    onChange={(e) => setGstNonGstData(e.target.value)}
                  >
                    <option value="">Select GST</option>
                    <option value="GST">GST</option>
                    <option value="Non GST">Non GST</option>
                  </select>
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
                disabled
              >
                <i className="fas fa-search"></i> Search
              </Button>
              <Button
                variant="contained"
                onClick={handleClearAllFilter}
                className="btn cmnbtn btn-secondary"
                disabled
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BalancePaymentListFilter;
