import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../../../Context/Context";
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
import View from "../../../../AdminPanel/Sales/Account/View/View";

const PendingInvoice = ({
  setUniqueCustomerCount,
  setUniqueSalesExecutiveCount,
  setBaseAmountTotal,
  setButtonaccess,
  setCampaignAmountTotal,
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
}) => {
  const { usersDataContext } = useGlobalContext();
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
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
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");

  const getData = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${baseUrl}sales/invoice_request?status=pending`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.data) {
        const mergedData = data?.data?.map((item) => {
          const userData = usersDataContext?.find(
            (user) => user?.user_id === item?.created_by
          );
          return {
            ...item,
            user_name: userData?.user_name || null,
            account_name: item?.saleData?.account_name || null,
          };
        });

        const sortedData = mergedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setIsLoading(false);
        setData(sortedData);
        setFilterData(sortedData);
        calculateUniqueData(sortedData);
        calculateTotals(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, usersDataContext]);

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyName, isAccountName) =>
      data.reduce((acc, curr) => {
        const key = isAccountName
          ? curr?.saleData?.account_name
          : curr?.[keyName];

        if (!key) return acc;

        const existingEntry = acc[key] || {
          account_name: curr?.saleData?.account_name || "",
          user_name: curr?.user_name || "",
          saleData: {
            campaign_amount: 0,
            base_amount: 0,
            gst_amount: 0,
          },
          invoice_amount: 0,
        };

        existingEntry.saleData.campaign_amount +=
          curr?.saleData?.campaign_amount ?? 0;
        existingEntry.saleData.base_amount += curr?.saleData?.base_amount ?? 0;
        existingEntry.saleData.gst_amount += curr?.saleData?.gst_amount ?? 0;
        existingEntry.invoice_amount += curr?.invoice_amount ?? 0;

        acc[key] = existingEntry;

        return acc;
      }, {});

    const uniqueAccData = Object.values(
      aggregateData(sortedData, "account_name", true)
    );
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData.length);

    const uniqueSalesExData = Object.values(
      aggregateData(sortedData, "user_name", false)
    );
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData.length);
  };

  const handleGetProforma = async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}sales/invoice_request/?status=uploaded&invoice_type_id=proforma`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.data) {
        // Merging user data with proforma data
        const mergedData = data?.data?.map((item) => {
          const userData = usersDataContext?.find(
            (user) => user.user_id === item.created_by
          );
          return {
            ...item,
            user_name: userData?.user_name || null,
          };
        });

        // Sorting data by creation date
        const sortedData = mergedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProformaData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching proforma data:", error);
    }
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  useEffect(() => {
    if (usersDataContext && usersDataContext?.length > 0) {
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

    const sameNameAccounts = datas?.filter(
      (item) => item?.account_name === custName
    );

    setFilterData(sameNameAccounts);
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
      (item) => item?.user_name === salesEName
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

      {/* Filters */}
      <PendingInvoiceFilters
        setProformaDialog={setProformaDialog}
        setUniqueCustomerCount={setUniqueCustomerCount}
        setUniqueCustomerData={setUniqueCustomerData}
        setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
        setUniqueSalesExecutiveData={setUniqueSalesExecutiveData}
        setFilterData={setFilterData}
        datas={datas}
      />
      <div>
        <View
          columns={pendingInvoiceColumn({
            filterData,
            setOpenImageDialog,
            setViewImgSrc,
            handleOpenEditFieldAction,
            handleDiscardOpenDialog,
          })}
          data={filterData}
          isLoading={isLoading}
          title={"Pending Invoice"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"invoice_request"}
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
      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}
    </div>
  );
};
export default PendingInvoice;
