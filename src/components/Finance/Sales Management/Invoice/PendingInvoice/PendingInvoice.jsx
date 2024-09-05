import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import {
  DataGrid,
  gridColumnsTotalWidthSelector,
  GridToolbar,
} from "@mui/x-data-grid";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../../../utils/config";
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
import moment from "moment";
import pdf from "../../../pdf-file.png";
import {
  pendingInvoiceColumn,
  uniquePendingInvoiceCustomerColumn,
  uniquePendingInvoiceSalesExecutiveColumn,
} from "../../../CommonColumn/Columns";
import FormatString from "../../../FormateString/FormatString";
import PendingInvoiceProformaDetails from "./PendingInvoiceProformaDetails";
const PendingInvoice = ({
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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterDataInvoice, setFilterDataInvoice] = useState([]);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [saleBookingId, setSaleBookingId] = useState([]);
  const [salesPersonName, setSalesPersonName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [baseAmountFilter, setBaseAmountFilter] = useState("");
  const [baseAmountField, setBaseAmountField] = useState("");
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");
  const [editActionDialog, setEditActionDialog] = useState("");
  const [invcDate, setInvcDate] = useState("");
  const [invcNumber, setInvcNumber] = useState("");
  const [partyInvoiceName, setPartyInvoiceName] = useState("");
  const [imageInvoice, setImageInvoice] = useState([]);
  const [reason, setReason] = useState("");
  const [discardSaleBookingId, setDiscardSaleBookingId] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);
  const [proformaDialog, setProformaDialog] = useState(false);
  const [proformaData, setProformaData] = useState([]);
  const [objId, setObjId] = useState("");
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

  const handleReject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("invoice_action_reason", reason);

    const confirmation = confirm("Are you sure you want to reject this data?");
    if (confirmation) {
      axios
        .put(baseUrl + `sales/invoice_request_rejected/${objId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          toastAlert("Data Rejected Successfully");
          handleDiscardCloseDialog();
          getData();
          setDate(dayjs());
          setInoiceNum("");
          setPartyName("");
        });
    } else {
      getData();
    }
    // toastAlert("Data updated");
    // setIsFormSubmitted(true);
  };

  // const handleGetFormData =
  const getData = () => {
    axios
      .get(baseUrl + `sales/invoice_request?status=pending`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data, "REsPPPPPPP------>>");
        const mergedData = res?.data?.data?.map((item) => {
          // Find the user data based on created_by field
          const userData =
            usersDataContext &&
            usersDataContext?.find(
              (user) => user?.user_id === item?.created_by
            );
          return {
            ...item,
            user_name: userData?.user_name || null,
          };
        });
        console.log(mergedData, "mergedData...>>");

        const sortData = mergedData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        console.log(sortData, "sortData...>>");
        setData(sortData);
        setFilterData(sortData);
        calculateUniqueData(sortData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // const calculateUniqueData = (sortedData) => {
  //   const aggregateData = (data, keyName) => {
  //     return data?.reduce((acc, curr) => {
  //       const key = curr[keyName];
  //       console.log(key, "key--->>>>");
  //       if (!acc[key]) {
  //         acc[key] = {
  //           ...curr,
  //           campaign_amount: 0,
  //           base_amount: 0,
  //           invoice_amount: 0,
  //           gst_amount: 0,
  //         };
  //       }
  //       acc[key].saleData.campaign_amount += curr.saleData.campaign_amount ?? 0;
  //       acc[key].saleData.base_amount += curr.saleData.base_amount ?? 0;
  //       acc[key].saleData.invoice_amount += curr.saleData.invoice_amount ?? 0;
  //       acc[key].saleData.gst_amount += curr.saleData.invoice_amount ?? 0;
  //       return acc;
  //     }, {});
  //   };
  //   // Aggregate data by account name:-
  //   const aggregatedAccountData = aggregateData(sortedData, "account_name");
  //   const uniqueAccData = Object.values(aggregatedAccountData);
  //   setUniqueCustomerData(uniqueAccData);
  //   setUniqueCustomerCount(uniqueAccData?.length);

  //   // Aggregate data by sales executive name :-
  //   const aggregatedSalesExData = aggregateData(sortedData, "user_name");
  //   const uniqueSalesExData = Object.values(aggregatedSalesExData);
  //   setUniqueSalesExecutiveData(uniqueSalesExData);
  //   setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  // };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr[keyName];

        if (!acc[key]) {
          acc[key] = {
            ...curr,
            saleData: {
              campaign_amount: 0,
              base_amount: 0,
              invoice_amount: 0,
              gst_amount: 0,
            },
          };
        }

        // Use nullish coalescing operator (??) to handle potential undefined or null values
        acc[key].saleData.campaign_amount += curr.saleData.campaign_amount ?? 0;
        acc[key].saleData.base_amount += curr.saleData.base_amount ?? 0;
        acc[key].saleData.invoice_amount += curr.saleData.invoice_amount ?? 0;
        acc[key].saleData.gst_amount += curr.saleData.gst_amount ?? 0;

        return acc;
      }, {});
    };

    // Aggregate data by account name
    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name
    const aggregatedSalesExData = aggregateData(sortedData, "user_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  const handleGetProforma = () => {
    axios
      .get(
        baseUrl +
          `sales/invoice_request/?status=uploaded&invoice_type_id=proforma`,
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
          const userData = usersDataContext?.find(
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
        setProformaData(sortData);
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
  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    // const initialFilteredData = datas?.filter(
    //   (item) => item.tds_status === "open"
    // );
    setFilterData(datas);
  };

  // useEffect(() => {
  //   getData();
  //   handleGetProforma();
  // }, [usersDataContext]);

  useEffect(() => {
    if (usersDataContext && usersDataContext.length > 0) {
      getData(); // Fetch data only after usersDataContext is loaded
    }
    handleGetProforma();
  }, [usersDataContext]);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d?.saleData?.account_name
        ?.toLowerCase()
        .match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

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
            return +item.base_amount > baseAmountData;
          case "lessThan":
            return +item.base_amount < baseAmountData;
          case "equalTo":
            return +item.base_amount === baseAmountData;
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

  useEffect(() => {
    getData();
    setButtonaccess(
      contextData &&
        contextData[2] &&
        contextData[2].insert_value === 1 &&
        false
    );
  }, []);

  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);

  // ============================================
  // For discard-----
  const handleDiscardOpenDialog = (e) => {
    e.preventDefault();
    setDiscardDialog(true);
  };
  const handleDiscardCloseDialog = (e) => {
    e.preventDefault();
    setDiscardDialog(false);
  };
  // ------------------------
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

    const sameNameCustomers = datas.filter(
      (item) => item.saleData.account_name === custName
    );

    setFilterData(sameNameCustomers);
    handleCloseUniqueCustomer();
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

    const sameNameSalesExecutive = datas?.filter(
      (item) => item.user_name === salesEName
    );

    setFilterData(sameNameSalesExecutive);
    handleCloseUniquesalesExecutive();
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };
  // Total base amount:-
  const totalBaseAmount = filterData?.reduce(
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
    // setSaleBookingId(id);
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
          baseUrl + `sales/invoice_request/${InvcCreatedRowData?._id}`,
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
            getData();
            handleGetProforma();
          }
        })
        .catch((err) => {
          console.log(err, "submit invoice error-------");
        });
    }
  };

  function calculateAging(date1, date2) {
    const oneHour = 60 * 60 * 1000; // minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));

    return diffHours;
  }

  // =========================================

  // For Proforma================================

  const handleOpenPerforma = () => {
    setProformaDialog(true);
  };
  const handleClosePerforma = () => {
    setProformaDialog(false);
  };

  // ==============================================
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
        const isFilePDF =
          InvcCreatedRowData?.invoice_file_url?.endsWith(".pdf");
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
                // Allow only numeric input
                setInvcNumber(value);
                //     setIsRequired((prev) => ({ ...prev, invcNumber: false }));
                //   } else {
                //     setIsRequired((prev) => ({ ...prev, invcNumber: true }));
                //   }
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
      {/* Dialog For Discard */}
      <Dialog
        open={discardDialog}
        onClose={handleDiscardCloseDialog}
        fullWidth={true}
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Invoice Rejected</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDiscardCloseDialog}
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
          <TextField
            multiline
            label="Reason for Discard"
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
          <div className="pack w-100 mt-3 sb">
            <div className="pack gap16">
              <Button
                variant="contained"
                // onClick={(e) => handleReject(e)}
              >
                Submit
              </Button>
            </div>
          </div>
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
            columns={uniquePendingInvoiceSalesExecutiveColumn({
              uniqueSalesExecutiveData,
              handleOpenSameSalesExecutive,
              setOpenImageDialog,
              setViewImgSrc,
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
            getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Unique Accounts Dialog Box */}
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
          <DataGrid
            rows={uniqueCustomerData}
            columns={uniquePendingInvoiceCustomerColumn({
              uniqueCustomerData,
              handleOpenSameCustomer,
              setOpenImageDialog,
              setViewImgSrc,
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
            getRowId={(row) => uniqueCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>
      {/* Proforma Details */}
      {proformaDialog && (
        <PendingInvoiceProformaDetails
          dialog={proformaDialog}
          handleCloseDialog={handleClosePerforma}
          proformaData={proformaData}
          setOpenImageDialog={setOpenImageDialog}
          setViewImgSrc={setViewImgSrc}
        />
      )}

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
                  onClick={handleOpenPerforma}
                  className="btn cmnbtn btn-secondary"
                >
                  Proforma Detail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Pending Invoice</h5>
          <div className="flexCenter colGap12">
            <button
              className="btn cmnbtn btn_sm btn-secondary"
              onClick={(e) => handleClearSameRecordFilter(e)}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="card-body card-body thm_table fx-head data_tbl table-responsive">
          {/* <div className="tab-content"> */}
          <div>
            <DataGrid
              rows={filterData}
              columns={pendingInvoiceColumn({
                filterData,
                setOpenImageDialog,
                setViewImgSrc,
                handleOpenEditFieldAction,
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
              state={{
                keyboard: {
                  cell: null,
                  columnHeader: null,
                  isMultipleKeyPressed: false,
                },
              }}
              getRowId={(row) => row._id}
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
  );
};
export default PendingInvoice;
