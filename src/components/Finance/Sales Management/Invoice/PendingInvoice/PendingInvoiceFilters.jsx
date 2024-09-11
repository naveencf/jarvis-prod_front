import { useState } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";

const PendingInvoiceFilters = (props) => {
  const {
    setProformaDialog,
    setUniqueCustomerCount,
    setUniqueCustomerData,
    setUniqueSalesExecutiveCount,
    setUniqueSalesExecutiveData,
    setFilterData,
    datas,
  } = props;

  const [salesPersonName, setSalesPersonName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [baseAmountFilter, setBaseAmountFilter] = useState("");
  const [baseAmountField, setBaseAmountField] = useState("");

  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      const date = new Date(item?.saleData.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Sales Person Filter:-
      const salesPersonNameFilterPassed =
        !salesPersonName ||
        item?.user_name
          ?.toLowerCase()
          ?.includes(salesPersonName?.toLowerCase());
      // customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.saleData.account_name
          ?.toLowerCase()
          ?.includes(customerName?.toLowerCase());
      // request amount filter:-
      const requestAmountFilterPassed = () => {
        const baseAmountData = parseFloat(baseAmountField);
        switch (baseAmountFilter) {
          case "greaterThan":
            return +item.saleData.base_amount > baseAmountData;
          case "lessThan":
            return +item.saleData.base_amount < baseAmountData;
          case "equalTo":
            return +item.saleData.base_amount === baseAmountData;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        salesPersonNameFilterPassed &&
        customerNameFilterPassed &&
        requestAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueCustomers = new Set(
      filterData?.map((item) => item?.account_name)
    );
    setUniqueCustomerCount(uniqueCustomers?.size);
    const uniqueCustomerData = Array?.from(uniqueCustomers)?.map(
      (customerName) => {
        return filterData?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(filterData?.map((item) => item.user_name));
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx)?.map((salesEName) => {
      return filterData?.find((item) => item.user_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setSalesPersonName("");
    setToDate("");
    setFromDate("");
    setCustomerName("");
    setBaseAmountFilter("");
    setBaseAmountField("");

    const uniqueCustomers = new Set(datas?.map((item) => item.account_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers)?.map(
      (customerName) => {
        return datas?.find((item) => item.account_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(datas?.map((item) => item.user_name));
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array?.from(uniqueSalesEx)?.map((salesEName) => {
      return datas?.find((item) => item?.user_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleOpenProforma = () => {
    setProformaDialog(true);
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Person Name</label>
                    <Autocomplete
                      value={salesPersonName}
                      onChange={(event, newValue) =>
                        setSalesPersonName(newValue)
                      }
                      options={Array.from(
                        new Set(
                          datas?.map((item) => item.user_name)?.filter(Boolean)
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
                    <label>Account Name</label>
                    <Autocomplete
                      value={customerName}
                      onChange={(event, newValue) => setCustomerName(newValue)}
                      options={
                        Array.from(
                          new Set(
                            datas
                              ?.map((option) => option?.saleData?.account_name)
                              ?.filter((name) => name) // Remove falsy values
                          )
                        ) || []
                      }
                      // options={userNames}
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
                    <label>Base Amount Filter</label>
                    <select
                      value={baseAmountFilter}
                      className="form-control"
                      onChange={(e) => setBaseAmountFilter(e.target.value)}
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
                    <label>Base Amount</label>
                    <input
                      value={baseAmountField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setBaseAmountField(e.target.value);
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
                <Button
                  variant="contained"
                  onClick={handleOpenProforma}
                  className="btn cmnbtn btn-secondary"
                >
                  Proforma Detail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingInvoiceFilters;
