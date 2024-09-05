import React, { useEffect, useState } from "react";
import FormContainer from "../../../../AdminPanel/FormContainer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Alert, Autocomplete, Button, TextField } from "@mui/material";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const GstNongstIncentiveReport = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [salesExecutiveName, setSalesExecutiveName] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setCampaignAmountField] = useState("");
  const [baseAmountFilter, setBaseAmountFilter] = useState("");
  const [baseAmountField, setBaseAmountField] = useState("");
  const [status, setStatus] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [sameCustomerCount, setSameCustomerCount] = useState(0);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");

  const callApi = () => {
    const formData = new FormData();

    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales_users_settled_final_incentive",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        const resData = res.data.body;
        setData(resData);
        setFilterData(resData);
        const uniqueCustomers = new Set(resData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return resData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);

        // For Unique Sales Executive
        const uniqueSalesEx = new Set(
          resData.map((item) => item.sales_executive_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return resData.find(
            (item) => item.sales_executive_name === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);
      });
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleAllFilters = () => {
    const filterData = data.filter((item) => {
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // sales Executive Name Filter:-
      const salesExecutiveNameFilterPassed =
        !salesExecutiveName ||
        item.sales_executive_name
          .toLowerCase()
          .includes(salesExecutiveName.toLowerCase());

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
      const baseAmountFilterPassed = () => {
        const balanceAmount = parseFloat(baseAmountField);
        const balance = parseFloat(item.base_amount); // Convert to number
        switch (baseAmountFilter) {
          case "greaterThan":
            return balance > balanceAmount;
          case "lessThan":
            return balance < balanceAmount;
          case "equalTo":
            return balance === balanceAmount;
          default:
            return true;
        }
      };

      // GST Status Filter
      const statusFilterPassed =
        !status ||
        (status.toLowerCase() === "gst" && item.gst_status === "1") ||
        (status.toLowerCase() === "non gst" && item.gst_status !== "1");

      const allFiltersPassed =
        customerNameFilterPassed &&
        salesExecutiveNameFilterPassed &&
        campaignAmountFilterPassed() &&
        baseAmountFilterPassed() &&
        statusFilterPassed;

      return allFiltersPassed;
    });
    setFilterData(filterData);

    const uniqueCustomers = new Set(filterData.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return filterData.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      filterData.map((item) => item.sales_executive_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return filterData.find(
        (item) => item.sales_executive_name === salesEName
      );
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleClearAllFilter = () => {
    setFilterData(data);
    setCustomerName("");
    setSalesExecutiveName("");
    setCampaignAmountFilter("");
    setCampaignAmountField("");
    setBaseAmountFilter("");
    setBaseAmountField("");
    setStatus("");

    const uniqueCustomers = new Set(data.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return data.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);

    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      data.map((item) => item.sales_executive_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return data.find((item) => item.sales_executive_name === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (e, custName) => {
    e.preventDefault();
    setSameCustomerDialog(true);

    const sameNameCustomers = data.filter(
      (item) => item.cust_name === custName
    );
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName, e) => {
    e.preventDefault();
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = data.filter(
      (item) => item.sales_executive_name === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  const totalBaseAmount = filterData.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );

  const sameCustomercolumn = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameCustomerData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "cust_name",
      headerName: " Customer Name",
      width: 150,
      renderCell: (params) => {
        return params.row.cust_name;
      },
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name ",
      width: 150,
      renderCell: (params) => {
        return params.row.sales_executive_name;
      },
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.campaign_amount;
      },
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount;
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount;
      },
    },
    {
      field: "gst_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_status === "1" ? "GST" : " Non GST";
      },
    },
    {
      field: "final_incentive_amount",
      headerName: "Incentive Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.final_incentive_amount;
      },
    },
  ];

  const uniqueCustomercolumn = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueCustomerData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "cust_name",
      headerName: " Customer Name",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) => handleOpenSameCustomer(e, params.row.cust_name)}
          >
            {params.row.cust_name}
          </div>
        );
      },
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name ",
      width: 150,
      renderCell: (params) => {
        return params.row.sales_executive_name;
      },
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.campaign_amount;
      },
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount;
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount;
      },
    },
    {
      field: "gst_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_status === "1" ? "GST" : " Non GST";
      },
    },
    {
      field: "final_incentive_amount",
      headerName: "Incentive Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.final_incentive_amount;
      },
    },
  ];
  const sameSalesExecutivecolumn = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = sameSalesExecutiveData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "cust_name",
      headerName: " Customer Name",
      width: 150,
      renderCell: (params) => {
        return params.row.cust_name;
      },
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name ",
      width: 150,
      renderCell: (params) => {
        return params.row.sales_executive_name;
      },
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.campaign_amount;
      },
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount;
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount;
      },
    },
    {
      field: "gst_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_status;
      },
    },
    {
      field: "final_incentive_amount",
      headerName: "Incentive Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.final_incentive_amount;
      },
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = uniqueSalesExecutiveData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "cust_name",
      headerName: " Customer Name",
      width: 150,
      renderCell: (params) => {
        return params.row.cust_name;
      },
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name ",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={(e) =>
              handleOpenSameSalesExecutive(params.row.sales_executive_name, e)
            }
          >
            {params.row.sales_executive_name}
          </div>
        );
      },
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.campaign_amount;
      },
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount;
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount;
      },
    },
    {
      field: "gst_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_status === "1" ? "GST" : " Non GST";
      },
    },
    {
      field: "final_incentive_amount",
      headerName: "Incentive Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.final_incentive_amount;
      },
    },
  ];
  const columns = [
    {
      field: "s_no",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "cust_name",
      headerName: " Customer Name",
      width: 150,
      renderCell: (params) => {
        return params.row.cust_name;
      },
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name ",
      width: 150,
      renderCell: (params) => {
        return params.row.sales_executive_name;
      },
    },

    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.campaign_amount;
      },
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount;
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount;
      },
    },
    {
      field: "gst_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_status === "1" ? "GST" : " Non GST";
      },
    },
    {
      field: "final_incentive_amount",
      headerName: "Incentive Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.final_incentive_amount;
      },
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Incentive Reports"
        link="/admin/finance-pruchasemanagement-paymentdone"
        uniqueCustomerCount={uniqueCustomerCount}
        totalBaseAmount={totalBaseAmount}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        gstNongstIncentiveReport={true}
      />
      {/* Same Sales Executive Dialog Box */}
      <Dialog
        open={sameSalesExecutiveDialog}
        onClose={handleCloseSameSalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameSalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={sameSalesExecutiveData}
            columns={sameSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={uniqueSalesExecutiveData}
            columns={uniqueSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Same Customer Dialog */}
      <Dialog
        open={sameCustomerDialog}
        onClose={handleCloseSameCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Vendors</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={sameCustomerData}
            columns={sameCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Customer Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={uniqueCustomerData}
            columns={uniqueCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <Autocomplete
                      value={customerName}
                      onChange={(event, newValue) => setCustomerName(newValue)}
                      options={Array.from(
                        new Set(data.map((option) => option.cust_name))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="customer Name"
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
                      options={Array.from(
                        new Set(
                          data.map((option) => option.sales_executive_name)
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
                        />
                      )}
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
                        setCampaignAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Base Amount</label>
                    <input
                      value={baseAmountField}
                      type="number"
                      placeholder="Base Amount"
                      className="form-control"
                      onChange={(e) => {
                        setBaseAmountField(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>GST Status</label>
                    <select
                      value={status}
                      className="form-control"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Select GST</option>
                      <option value="GST">GST </option>
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

      <div className="row">
        <div className="col-12">
          <div className="card" style={{ height: "600px" }}>
            <div className="card-body table-responsive thm_table">
              <DataGrid
                rows={filterData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                autoHeight
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => filterData.indexOf(row)}
              />
              {/* {openImageDialog && (
              <ImageView
                viewImgSrc={viewImgSrc}
                setViewImgDialog={setOpenImageDialog}
              />
            )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GstNongstIncentiveReport;
