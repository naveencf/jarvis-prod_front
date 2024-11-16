import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "react-modal";
import { set } from "date-fns";
import { baseUrl } from "../../../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  saleBookingVerifyColumn,
  uniqueAccountVerifyColumn,
  uniqueSalesExeVerifyColumn,
} from "../../../CommonColumn/Columns";
import View from "../../../../AdminPanel/Sales/Account/View/View";

const SaleBookingVerify = ({
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
  setButtonAccess,
  setUniqueCustomerCount,
  setBaseAmountTotal,
  setUniqueSalesExecutiveCount,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [row, setRow] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("verified_amount", balAmount);
    formData.append("verified_remark", remark);
    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=verifybooking",
        formData,
        {
          headers: {
            "application-type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        handleCloseImageModal();
        getData();
      });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  const handleImageClick = (row) => {
    setImageModalOpen(true);
    setRow(row);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setRemark("");
  };

  const getData = async () => {
    setIsLoading(true);

    await axios
      .get(
        baseUrl + "sales/sale_booking_tds_status_wise_data?status=tds_verified",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const sortData = res?.data?.data?.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        );
        setIsLoading(false);
        setFilterData(sortData);
        setData(sortData);
        calculateUniqueData(sortData);
      })
      .catch((error) =>
        console.log(error, "Error while getting sale booking verified data")
      );
  };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr[keyName];
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            campaign_amount: 0,
            base_amount: 0,
            gst_amount: 0,
            paid_amount: 0,
            tds_amount: 0,
            tds_verified_amount: 0,
            tds_percentage: 0,
          };
        }
        acc[key].campaign_amount += curr.campaign_amount;
        acc[key].base_amount += curr.base_amount;
        acc[key].gst_amount += curr.gst_amount;
        acc[key].paid_amount += curr.paid_amount;
        acc[key].tds_amount += curr.tds_amount;
        acc[key].tds_verified_amount += curr.tds_verified_amount;
        acc[key].tds_percentage =
          (acc[key].tds_verified_amount / acc[key].campaign_amount) * 100;

        return acc;
      }, {});
    };

    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    const aggregatedSalesExData = aggregateData(sortedData, "created_by_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  useEffect(() => {
    getData();
    setButtonAccess(
      contextData &&
        contextData[2] &&
        contextData[2].insert_value === 1 &&
        false
    );
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.account_name?.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search, datas]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
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
        item.account_name?.toLowerCase()?.includes(customerName?.toLowerCase());

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
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setSalesExecutive("");
  };

  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutive = datas?.filter(
      (item) => item.created_by_name === salesEName
    );

    setFilterData(sameNameSalesExecutive);
    handleCloseUniquesalesExecutive();
  };

  const handleOpenSameCustomer = (custName) => {
    const sameNameCustomers = datas.filter(
      (item) => item.account_name === custName
    );
    setFilterData(sameNameCustomers);
    handleCloseUniqueCustomer();
  };

  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);

  // Total base amount:-
  const baseAmountTotal = datas?.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );
  setBaseAmountTotal(baseAmountTotal);

  return (
    <>
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
          <div className="thm_table fx-head">
            <DataGrid
              rows={uniqueSalesExecutiveData}
              columns={uniqueSalesExeVerifyColumn({
                uniqueSalesExecutiveData,
                handleOpenSameSalesExecutive,
              })}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              disableColumnMenu
              disableColumnSelector
              disableColumnFilter
              disableColumnReorder
              disableColumnResize
              disableMultipleColumnsSorting
              components={{
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  value: search,
                  onChange: (event) => setSearch(event.target.value),
                  placeholder: "Search",
                  clearSearch: true,
                  clearSearchAriaLabel: "clear",
                },
              }}
              getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
            />
          </div>
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
        <DialogTitle>Unique Accounts</DialogTitle>
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
          <div className="thm_table fx-head">
            <DataGrid
              rows={uniqueCustomerData}
              columns={uniqueAccountVerifyColumn({
                uniqueCustomerData,
                handleOpenSameCustomer,
              })}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              disableColumnMenu
              disableColumnSelector
              disableColumnFilter
              disableColumnReorder
              disableColumnResize
              disableMultipleColumnsSorting
              components={{
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  value: search,
                  onChange: (event) => setSearch(event.target.value),
                  placeholder: "Search",
                  clearSearch: true,
                  clearSearchAriaLabel: "clear",
                },
              }}
              getRowId={(row) => uniqueCustomerData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Search by filter</h5>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-4">
              <div className="form-group">
                <label>Account Name</label>
                <Autocomplete
                  value={customerName}
                  onChange={(event, newValue) => setCustomerName(newValue)}
                  options={Array.from(
                    new Set(datas?.map((option) => option.account_name) || [])
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer Name"
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
                <label>Sales Executive Name</label>
                <Autocomplete
                  value={salesExecutive}
                  onChange={(event, newValue) => setSalesExecutive(newValue)}
                  options={datas.map((option) => option.created_by_name || [])}
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
            <div className="col-md-4">
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

      <div className="card-header flexCenterBetween">
        <div className="flexCenter colGap12">
          <button
            className="btn cmnbtn btn_sm btn-secondary"
            onClick={(e) => handleClearSameRecordFilter(e)}
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        <View
          columns={saleBookingVerifyColumn({
            filterData,
          })}
          data={filterData}
          isLoading={isLoading}
          title={"Invoice Created"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"sale_booking_tds_status_wise_data"}
          selectedData={setSelectedData}
          addHtml={
            <>
              <button
                className="btn cmnbtn btn_sm btn-secondary"
                onClick={(e) => handleClearSameRecordFilter(e)}
              >
                Clear
              </button>
            </>
          }
        />
      </div>
      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "30%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Sale Booking Verify</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 ">
            <form onSubmit={handleSubmit}>
              <div className="form-group col-12"></div>

              <div className="form-group">
                <label htmlFor="images">Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={balAmount}
                  onChange={(e) => {
                    if (e.target.value > row.net_balance_amount_to_pay) {
                      toastError(
                        "Amount is greater than balance amount to pay"
                      );
                      return;
                    }
                    setBalAmount(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Remark:</label>
                <input
                  type="text"
                  className="form-control"
                  id="images"
                  name="images"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SaleBookingVerify;
