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
import { invoiceCreatedColumns, invoiceCreatedUniqueAccountsColumns, invoiceCreatedUniqueSalesExecutiveColumns } from "../../../CommonColumn/Columns";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";
import InvoiceCreatedFilters from "./Components/InvoiceCreatedFilters";
import EditInvoiceActionDialog from "../PendingInvoice/EditInvoiceActionDialog";

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
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueCustomerInvoiceData, setUniqueCustomerInvoiceData] = useState(
    []
  );
  const [uniqueSalesExecutiveInvoiceData, setUniqueSalesExecutiveInvoiceData] = useState(
    []
  );
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
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
            user_name: userData?.user_name || null, 
          };
        });

        const sortData = mergedData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataInvoice(sortData);
        setFilterDataInvoice(sortData);
        calculateUniqueData([...sortData])
      });
  };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyExtractor) => {
      return data?.reduce((acc, curr) => {
        const key = keyExtractor(curr);
  
        // Ensure we skip any undefined or null keys
        if (!key) return acc;
  
        if (!acc[key]) {
          acc[key] = {
            account_name: curr?.saleData?.account_name || "",
            user_name: curr?.user_name || "",
            saleData: {
              campaign_amount: 0,
            },
            invoice_amount: 0,
          };
        }
  
        acc[key].saleData.campaign_amount += curr?.saleData?.campaign_amount ?? 0;
        acc[key].invoice_amount += curr?.invoice_amount ?? 0;
  
        return acc;
      }, {});
    };
  // Aggregate data by account name
    const aggregatedAccountData = aggregateData(sortedData, (item) => item?.saleData?.account_name || "");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerInvoiceData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);
  
    // Aggregate data by sales executive name
    const aggregatedSalesExData = aggregateData(sortedData, (item) => item?.user_name || "");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveInvoiceData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
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
    const sameNameCustomersInvoice = dataInvoice?.filter(
      (item) => item?.saleData?.account_name === custName
    );
    setFilterDataInvoice(sameNameCustomersInvoice);
    handleCloseUniqueCustomer()
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    const sameNameSalesExecutiveInvoice = dataInvoice?.filter(
      (item) => item.user_name === salesEName
    );
    setFilterDataInvoice(sameNameSalesExecutiveInvoice);
    handleCloseUniqueSalesExecutive()
  };

  // Total amounts:-
const calculateTotalAmount = (field) => {
  return filterDataInvoice?.reduce(
    (total, item) => total + parseFloat(item?.saleData?.[field] || 0),
    0
  );
};

// Setting totals for base and campaign amounts
const totalBaseAmount = calculateTotalAmount('base_amount');
setBaseAmountTotal(totalBaseAmount);

const totalCampaignAmount = calculateTotalAmount('campaign_amount');
setCampaignAmountTotal(totalCampaignAmount);


  // Edit Action Field
  const handleOpenEditFieldAction = (rowData) => {
    setEditActionDialog(true);
    setInvcCreatedRowData(rowData);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterDataInvoice(dataInvoice);
  };

  return (
    <div>
     {/* Edit Action Field */}
     <EditInvoiceActionDialog
        editActionDialog={editActionDialog}
        setEditActionDialog={setEditActionDialog}
        setPreview={setPreview}
        setViewImgSrc={setViewImgSrc}
        getData={getDataInvoiceCreated}
        setInvcCreatedRowData={setInvcCreatedRowData}
        InvcCreatedRowData={InvcCreatedRowData}
        setOpenImageDialog={setOpenImageDialog}
      />
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveInvoiceData}
        columns={invoiceCreatedUniqueSalesExecutiveColumns({
          uniqueSalesExecutiveInvoiceData,
          handleOpenEditFieldAction,
          handleOpenSameSalesExecutive
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />  
      
       {/* Unique Accounts Dialog Box */}
       <CommonDialogBox
        data={uniqueCustomerInvoiceData}
        columns={invoiceCreatedUniqueAccountsColumns({
          uniqueCustomerInvoiceData,
          handleOpenEditFieldAction,
          handleOpenSameCustomer
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />

      {/* Filters */}
      <InvoiceCreatedFilters dataInvoice={dataInvoice}setFilterDataInvoice={setFilterDataInvoice}/>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Invoice Created</h5>
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
  );
};
export default InvoiceCreated;
