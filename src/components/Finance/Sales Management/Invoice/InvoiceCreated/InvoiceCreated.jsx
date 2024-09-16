import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../../../utils/config";
import pdf from "../../../pdf-file.png";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageView from "../../../ImageView";
import FormatString from "../../../FormateString/FormatString";
import { invoiceCreatedColumns, invoiceCreatedUniqueAccountsColumns, invoiceCreatedUniqueSalesExecutiveColumns } from "../../../CommonColumn/Columns";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";

const InvoiceCreated = ({
  setUniqueCustomerCount,
  setUniqueSalesExecutiveCount,
  setBaseAmountTotal,
  setButtonaccess,
  setCampaignAmountTotal,
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
}) => {
  const navigate = useNavigate();
  const { toastAlert, toastError, usersDataContext } = useGlobalContext();
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterDataInvoice, setFilterDataInvoice] = useState([]);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [customerNameInvoice, setCustomerNameInvoice] = useState("");
  const [invoiceParticularName, setInvoiceParticularName] = useState("");
  const [salesPersonInvoiceName, setSalesPersonInvoiceName] = useState("");
  const [campaignAmountInvoiceFilter, setCampaignAmountInvoiceFilter] =
    useState("");
  const [campaignAmountInvoiceField, setCampaignAmountInvoiceField] =
    useState("");
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueCustomerInvoiceData, setUniqueCustomerInvoiceData] = useState(
    []
  );
  const [sameCustomerInvoiceData, setSameCustomerInvoiceData] = useState([]);
  const [uniqueSalesExecutiveInvoiceData, setUniqueSalesExecutiveInvoiceData] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveInvoiceData, setSameSalesExecutiveInvoiceData] =
    useState("");
  const [editActionDialog, setEditActionDialog] = useState("");
  const [invcDate, setInvcDate] = useState("");
  const [invcNumber, setInvcNumber] = useState("");
  const [partyInvoiceName, setPartyInvoiceName] = useState("");
  const [imageInvoice, setImageInvoice] = useState([]);
  const [InvcCreatedRowData, setInvcCreatedRowData] = useState("");
  const [preview, setPreview] = useState("");
  const [isPDF, setIsPDF] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    imageInvoice: false,
    invcNumber: false,
  });

  const getDataInvoiceCreated = () => {
    axios
      .get(
        baseUrl +
          `sales/invoice_request/?status=${"uploaded"}&invoice_type_id=${"tax-invoice"}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const mergedData = res?.data?.data.map((item) => {
          // Find the user data based on created_by field
          const userData = usersDataContext.find(
            (user) => user?.user_id === item?.created_by
          );
          // Merge user data into the current item
          return {
            ...item,
            user_name: userData?.user_name || null, // Add user data or null if not found
          };
        });

        const sortData = mergedData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataInvoice(sortData);
        setFilterDataInvoice(sortData);
        // For Unique Customers
        const uniCustomers = new Set(
          sortData?.map((item) => item?.saleData?.account_name)
        );
        setUniqueCustomerCount(uniCustomers.size);
        const uniqueCustData = Array.from(uniCustomers)?.map((customerName) => {
          return sortData.find(
            (item) => item?.saleData?.account_name === customerName
          );
        });
        setUniqueCustomerInvoiceData(uniqueCustData);

        // For Unique Sales Executive
        const uniqueSalesExInvoice = new Set(
          sortData?.map((item) => item.user_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesExInvoice?.size);
        const uniqueSEInData = Array.from(uniqueSalesExInvoice)?.map(
          (salesEName) => {
            return sortData?.find((item) => item.user_name === salesEName);
          }
        );
        setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
      });
  };
  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };
  useEffect(() => {
    getDataInvoiceCreated();
  }, [usersDataContext]);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d?.saleData?.account_name
        ?.toLowerCase()
        .match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);
  // All Filters For Invoice Created

  const handleAllInvoiceFilters = () => {
    const filterDataInvoice = dataInvoice?.filter((item) => {
      // Customer Name Filter:-
      const customerNameInvoiceFilterPassed =
        !customerNameInvoice ||
        item.saleData.account_name
          ?.toLowerCase()
          ?.includes(customerNameInvoice?.toLowerCase());

      const salesPersonNameInvoiceFilterPassed =
        !salesPersonInvoiceName ||
        item.user_name
          ?.toLowerCase()
          ?.includes(salesPersonInvoiceName?.toLowerCase());

      const invoiceParticularNameFilterPassed =
        !invoiceParticularName ||
        (item.saleData.invoice_particular_name &&
          item.saleData.invoice_particular_name
            ?.toLowerCase()
            ?.includes(invoiceParticularName?.toLowerCase()));
      // campaign amount filter:-
      const campaignAmountFilterPassed = () => {
        const campaignAmountData = parseFloat(campaignAmountInvoiceField);
        switch (campaignAmountInvoiceFilter) {
          case "greaterThan":
            return +item.saleData.campaign_amount > campaignAmountData;
          case "lessThan":
            return +item.saleData.campaign_amount < campaignAmountData;
          case "equalTo":
            return +item.saleData.campaign_amount === campaignAmountData;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameInvoiceFilterPassed &&
        salesPersonNameInvoiceFilterPassed &&
        invoiceParticularNameFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterDataInvoice(filterDataInvoice);
    // for customers:-
    const uniCustomers = new Set(
      filterDataInvoice.map((item) => item.account_name)
    );
    setUniqueCustomerCount(uniCustomers.size);
    const uniqueCustData = Array.from(uniCustomers)?.map((customerName) => {
      return filterDataInvoice?.find(
        (item) => item.account_name === customerName
      );
    });
    setUniqueCustomerInvoiceData(uniqueCustData);
    // for sales executive :-
    const uniqueSalesExInvoice = new Set(
      filterDataInvoice?.map((item) => item.user_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesExInvoice.size);
    const uniqueSEInData = Array.from(uniqueSalesExInvoice).map(
      (salesEName) => {
        return filterDataInvoice?.find((item) => item.user_name === salesEName);
      }
    );
    setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
  };
  const handleClearAllInvoiceFilters = () => {
    setFilterDataInvoice(dataInvoice);
    setCustomerNameInvoice("");
    setSalesPersonInvoiceName("");
    setCampaignAmountInvoiceFilter("");
    setCampaignAmountInvoiceField("");
    setInvoiceParticularName("");
    const uniCustomers = new Set(dataInvoice.map((item) => item.account_name));
    setUniqueCustomerCount(uniCustomers.size);
    const uniqueCustData = Array.from(uniCustomers).map((customerName) => {
      return dataInvoice.find((item) => item.account_name === customerName);
    });
    setUniqueCustomerInvoiceData(uniqueCustData);

    const uniqueSalesExInvoice = new Set(
      dataInvoice.map((item) => item.user_name)
    );
    setUniqueSalesExecutiveCount(uniqueSalesExInvoice.size);
    const uniqueSEInData = Array.from(uniqueSalesExInvoice).map(
      (salesEName) => {
        return dataInvoice.find((item) => item.user_name === salesEName);
      }
    );
    setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
  };

  useEffect(() => {
    getDataInvoiceCreated();
    setButtonaccess(
      contextData &&
        contextData[2] &&
        contextData[2].insert_value === 1 &&
        false
    );
  }, []);

  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };
  // ============================================
  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);
    const sameNameCustomersInvoice = dataInvoice.filter(
      (item) => item.saleData.account_name === custName
    );
    setSameCustomerInvoiceData(sameNameCustomersInvoice);
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

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);
    const sameNameSalesExecutiveInvoice = dataInvoice?.filter(
      (item) => item.user_name === salesEName
    );
    setSameSalesExecutiveInvoiceData(sameNameSalesExecutiveInvoice);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };
  // Total base amount:-
  const totalBaseAmount = filterDataInvoice?.reduce(
    (total, item) => total + parseFloat(item?.saleData?.base_amount || 0),
    0
  );
  setBaseAmountTotal(totalBaseAmount);

  // Total base amount:-
  const totalCampaignAmount = filterDataInvoice?.reduce(
    (total, item) => total + parseFloat(item?.saleData?.campaign_amount),
    0
  );
  setCampaignAmountTotal(totalCampaignAmount);

  // Edit Action Field
  const handleOpenEditFieldAction = (rowData) => {
    setEditActionDialog(true);
    setInvcCreatedRowData(rowData);
  };
  const handleCloseEditFieldAction = () => {
    setEditActionDialog(false);
  };
  // handle submit  function for updating fields
  const handleInvoiceEditFields = async (e) => {
    e.preventDefault();
    if (imageInvoice == "") {
      setIsRequired((perv) => ({ ...perv, imageInvoice: true }));
    }
    if (!imageInvoice || imageInvoice == "") {
      toastError("Please Add Invoice Image");
      return;
    }
    // if (!invcNumber || isNaN(invcNumber)) {
    //   setIsRequired((prev) => ({ ...prev, invcNumber: true }));
    //   toastError("Please Enter a Valid Invoice Number");
    //   return;
    // }
    const confirmation = confirm("Are you sure you want to submit this data?");

    if (confirmation) {
      const formData = new FormData();
      formData.append("update_by", loginUserId);
      formData.append("invoice_type_id", InvcCreatedRowData?.invoice_type_id);
      formData.append("sale_booking_id", InvcCreatedRowData?.sale_booking_id);
      formData.append("invoice_file", imageInvoice);
      formData.append("invoice_number", invcNumber);
      formData.append("party_name", partyInvoiceName);
      formData.append(
        "invoice_uploaded_date",
        invcDate
          ? dayjs(invcDate).format("YYYY/MM/DD")
          : dayjs().format("YYYY/MM/DD")
      );

      await axios
        .put(
          baseUrl + `sales/invoice_request/${InvcCreatedRowData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toastAlert("Data Submitted Successfully");
            handleCloseEditFieldAction();
            getDataInvoiceCreated();
          }
        })
        .catch((err) => {
          console.log(err, "submit invoice error-------");
        });
    }
  };

  

  useEffect(() => {
    if (InvcCreatedRowData) {
      setInvcNumber(InvcCreatedRowData?.invoice_number || "");
      setPartyInvoiceName(InvcCreatedRowData?.party_name || "");
      setInvcDate(
        InvcCreatedRowData?.invoice_uploaded_date
          ? dayjs(InvcCreatedRowData?.invoice_uploaded_date)
          : dayjs()
      );

      if (InvcCreatedRowData?.invoice_file_url) {
        setPreview(InvcCreatedRowData.invoice_file_url);
        setViewImgSrc(InvcCreatedRowData.invoice_file_url);

        // Check if the file is a PDF
        const isFilePDF = InvcCreatedRowData.invoice_file_url.endsWith(".pdf");
        setIsPDF(isFilePDF);
      }
    }
  }, [InvcCreatedRowData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageInvoice(file);
    setIsRequired((prev) => ({
      ...prev,
      imageInvoice: !file,
    }));
    const filePreview = URL.createObjectURL(file);
    setPreview(filePreview);
    setViewImgSrc(filePreview);

    // Check if the uploaded file is a PDF
    const isFilePDF = file.type === "application/pdf";
    setIsPDF(isFilePDF);
  };

  return (
    <div>
      {/* Edit Action Field */}
      <Dialog
        open={editActionDialog}
        onClose={handleCloseEditFieldAction}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Invoice Update</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditFieldAction}
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
          <div className="row">
            <TextField
              type="text"
              name="input"
              label="Invoice Number"
              value={invcNumber}
              onChange={(e) => {
                const value = e.target.value;
                // if (/^\d*$/.test(value)) {
                //   // Allow only numeric input
                  setInvcNumber(value);
                //   setIsRequired((prev) => ({ ...prev, invcNumber: false }));
                // } else {
                //   setIsRequired((prev) => ({ ...prev, invcNumber: true }));
                // }
              }}
              // error={isRequired.invcNumber}
              // helperText={isRequired.invcNumber ? "Please add a number" : ""}
            />
            <label className="form-label mt-2">Invoice Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                defaultValue={dayjs()}
                onChange={(e) => {
                  setInvcDate(e);
                }}
                value={dayjs(invcDate) || dayjs()}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              name="input"
              label="Party Name"
              value={partyInvoiceName}
              className="mt-3"
              onChange={(e) => setPartyInvoiceName(e.target.value)}
            />
            <div className=" col-3">
              <label className="form-label mt-2">
                Invoice Image <sup style={{ color: "red" }}>*</sup>
              </label>
              <input
                type="file"
                name="upload_image"
                onChange={handleFileChange}
              />
              {isRequired?.imageInvoice && (
                <p className="form-error">Please Add Correct File</p>
              )}
              {preview && (
                <div className="mt-2">
                  {!isPDF ? (
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "70px", cursor: "pointer" }}
                      onClick={() => setOpenImageDialog(true)}
                    />
                  ) : (
                    <img
                      src={pdf}
                      alt="PDF Preview"
                      style={{ maxWidth: "40px", cursor: "pointer" }}
                      onClick={() => setOpenImageDialog(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <Button
              type="button"
              className="mt-3"
              variant="contained"
              onClick={(e) => handleInvoiceEditFields(e)}
            >
              Update Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveInvoiceData}
        columns={invoiceCreatedUniqueSalesExecutiveColumns({
          uniqueSalesExecutiveInvoiceData ,
          setOpenImageDialog,
          setViewImgSrc,
          handleOpenEditFieldAction,
          handleOpenSameSalesExecutive
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />  
      
       {/* Unique Acocunts Dialog Box */}
       <CommonDialogBox
        data={uniqueCustomerInvoiceData}
        columns={invoiceCreatedUniqueAccountsColumns({
          uniqueSalesExecutiveInvoiceData ,
          setOpenImageDialog,
          setViewImgSrc,
          handleOpenEditFieldAction,
          handleOpenSameCustomer
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />

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
                    <label>Account Name</label>
                    <Autocomplete
                      value={customerNameInvoice}
                      onChange={(event, newValue) =>
                        setCustomerNameInvoice(newValue)
                      }
                      options={Array.from(
                        new Set(
                          dataInvoice?.map(
                            (option) => option?.saleData?.account_name || []
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Account Name"
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Person Name</label>
                    <Autocomplete
                      value={salesPersonInvoiceName}
                      onChange={(event, newValue) =>
                        setSalesPersonInvoiceName(newValue)
                      }
                      options={Array?.from(
                        new Set(
                          dataInvoice
                            ?.map((item) => item.user_name)
                            ?.filter(Boolean)
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
                    <label>Invoice Particular</label>
                    <Autocomplete
                      value={invoiceParticularName}
                      onChange={(event, newValue) =>
                        setInvoiceParticularName(newValue)
                      }
                      options={Array?.from(
                        new Set(
                          dataInvoice
                            ?.filter(
                              (option) =>
                                option &&
                                option.saleData.invoice_particular_name !==
                                  null &&
                                option.saleData.invoice_particular_name !==
                                  undefined
                            ) // Filter out null or undefined values
                            ?.map(
                              (option) =>
                                option.invoice_particular_name?.toLowerCase() ||
                                []
                            ) // Convert to lowercase here
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Invoice Particular"
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Campaign Amount Filter</label>
                    <select
                      value={campaignAmountInvoiceFilter}
                      className="form-control"
                      onChange={(e) =>
                        setCampaignAmountInvoiceFilter(e.target.value)
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
                    <label>Campaign Amount</label>
                    <input
                      value={campaignAmountInvoiceField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setCampaignAmountInvoiceField(e.target.value);
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
                  onClick={handleAllInvoiceFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllInvoiceFilters}
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
          <div className="card">
            <div className="card-body thm_table p0">
              <div className="tab-content">
                <div>
                  <DataGrid
                    rows={filterDataInvoice}
                     columns={invoiceCreatedColumns({
                      filterDataInvoice,
                      setOpenImageDialog,
                      setViewImgSrc,
                      handleOpenEditFieldAction
              })}
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
                    getRowId={(row) => filterDataInvoice.indexOf(row)}
                  />
                </div>
                {openImageDialog && (
                  <ImageView
                    viewImgSrc={viewImgSrc}
                    setViewImgDialog={setOpenImageDialog}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvoiceCreated;
