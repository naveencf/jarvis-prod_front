import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../../utils/config";
import ImageView from "../../../ImageView";
import {
  pendingInvoiceColumn,
  uniquePendingInvoiceAccountColumn,
  uniquePendingInvoiceSalesExecutiveColumn,
} from "../../../CommonColumn/Columns";
import PendingInvoiceProformaDetails from "./PendingInvoiceProformaDetails";
import EditInvoiceActionDialog from "../PendingInvoice/EditInvoiceActionDialog";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";
import PendingInvoiceFilters from "./PendingInvoiceFilters";
import PendingInvoiceDiscard from "./PendingInvoiceDiscard";

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
  const { usersDataContext } = useGlobalContext();
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterDataInvoice, setFilterDataInvoice] = useState([]);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [editActionDialog, setEditActionDialog] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);
  const [proformaDialog, setProformaDialog] = useState(false);
  const [proformaData, setProformaData] = useState([]);
  const [InvcCreatedRowData, setInvcCreatedRowData] = useState("");
  const [preview, setPreview] = useState("");

  const token = sessionStorage.getItem("token");

  // const handleGetFormData =
  const getData = async () => {
    await axios
      .get(baseUrl + `sales/invoice_request?status=pending`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
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
            account_name: item?.saleData?.account_name || null,
          };
        });

        const sortData = mergedData?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setData(sortData);
        setFilterData(sortData);
        calculateUniqueData([...sortData]);
        calculateTotals([...sortData]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr[keyName];
        console.log(curr,"CURRENT VALUE ----->>>>>>>")
        if (!acc[key]) {
          console.log(acc[key],"CURRENT VALUE ----->>>>>>>")
          acc[key] = {
            account_name: curr?.account_name ||"",
            user_name: curr?.user_name,
            saleData: {
              campaign_amount: 0,
              base_amount: 0,
              gst_amount: 0,
            },
            invoice_amount: 0,
          };
        }
  
        acc[key].saleData.campaign_amount += curr?.saleData?.campaign_amount ?? 0;
        acc[key].saleData.base_amount += curr?.saleData?.base_amount ?? 0;
        acc[key].invoice_amount += curr?.invoice_amount ?? 0;
        acc[key].saleData.gst_amount += curr?.saleData?.gst_amount ?? 0;
  
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
  console.log(uniqueCustomerData,"unique customer data-->>")

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

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  useEffect(() => {
    if (usersDataContext && usersDataContext.length > 0) {
      getData();
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

    const sameNameCustomers = datas?.filter(
      (item) => item.saleData.account_name === custName
    );

    setFilterData(sameNameCustomers);
    handleCloseUniqueCustomer();
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
      (item) => item.user_name === salesEName
    );

    setFilterData(sameNameSalesExecutive);
    handleCloseUniquesalesExecutive();
  };

  // Total Amounts:-
  const calculateTotals = (sortedData) => {
    // Total base amount
    const totalBaseAmount = sortedData?.reduce(
      (total, item) => total + parseFloat(item?.saleData?.base_amount || 0),
      0
    );
    setBaseAmountTotal(totalBaseAmount);

    // Total campaign amount
    const totalCampaignAmount = sortedData?.reduce(
      (total, item) => total + parseFloat(item?.saleData?.campaign_amount || 0),
      0
    );
    setCampaignAmountTotal(totalCampaignAmount);
  };

  // Edit Action Field
  const handleOpenEditFieldAction = (rowData) => {
    setEditActionDialog(true);
    setInvcCreatedRowData(rowData);
  };

  // For Proforma================================
  const handleClosePerforma = () => {
    setProformaDialog(false);
  };
  // ==============================================
  return (
    <div>
      {/* Edit Action Field */}
      <EditInvoiceActionDialog
        editActionDialog={editActionDialog}
        setEditActionDialog={setEditActionDialog}
        setPreview={setPreview}
        setViewImgSrc={setViewImgSrc}
        getData={getData}
        setInvcCreatedRowData={setInvcCreatedRowData}
        InvcCreatedRowData={InvcCreatedRowData}
        setOpenImageDialog={setOpenImageDialog}
      />
      {/* Dialog For Discard */}
      <PendingInvoiceDiscard discardDialog={discardDialog} />
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveData}
        columns={uniquePendingInvoiceSalesExecutiveColumn({
          uniqueSalesExecutiveData,
          handleOpenSameSalesExecutive,
          setOpenImageDialog,
          setViewImgSrc,
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />
      {/* Unique Account Dialog */}
      <CommonDialogBox
        data={uniqueCustomerData}
        columns={uniquePendingInvoiceAccountColumn({
          uniqueCustomerData,
          handleOpenSameCustomer,
          setOpenImageDialog,
          setViewImgSrc,
          handleDiscardOpenDialog,
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />
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
      <PendingInvoiceFilters
        setProformaDialog={setProformaDialog}
        setUniqueCustomerCount={setUniqueCustomerCount}
        setUniqueCustomerData={setUniqueCustomerData}
        setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
        setUniqueSalesExecutiveData={setUniqueSalesExecutiveData}
        setFilterData={setFilterData}
        datas={datas}
      />
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
                handleDiscardOpenDialog,
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
