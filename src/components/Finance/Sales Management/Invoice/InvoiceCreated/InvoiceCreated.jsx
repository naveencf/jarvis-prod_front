import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import ImageView from "../../../ImageView";
import {
  invoiceCreatedColumns,
  invoiceCreatedUniqueAccountsColumns,
  invoiceCreatedUniqueSalesExecutiveColumns,
} from "../../../CommonColumn/Columns";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";
import InvoiceCreatedFilters from "./Components/InvoiceCreatedFilters";
import EditInvoiceActionDialog from "../PendingInvoice/EditInvoiceActionDialog";
import View from "../../../../AdminPanel/Sales/Account/View/View";
import { useGetAllProformaListQuery } from "../../../../Store/API/Finance/InvoiceRequestApi";
import { useAPIGlobalContext } from "../../../../AdminPanel/APIContext/APIContext";

const InvoiceCreated = ({
  setUniqueCustomerCount,
  setUniqueSalesExecutiveCount,
  setBaseAmountTotal,
  setButtonaccess,
  setCampaignAmountTotal,
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
}) => {
  const {
    refetch: refetchPendingInvoiceCreated,
    data: allPendingInvoiceCreatedList,
    error: allPendingInvoiceCreatedError,
    isLoading: allPendingInvoiceCreatedLoading,
  } = useGetAllProformaListQuery({ status: "uploaded", type: "tax-invoice" });

  const {userContextData} = useAPIGlobalContext()

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
  const [uniqueSalesExecutiveInvoiceData, setUniqueSalesExecutiveInvoiceData] =
    useState([]);
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [editActionDialog, setEditActionDialog] = useState("");
  const [InvcCreatedRowData, setInvcCreatedRowData] = useState("");
  const [preview, setPreview] = useState("");
  const [isPDF, setIsPDF] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    if (!allPendingInvoiceCreatedLoading && allPendingInvoiceCreatedList) {
      getDataInvoiceCreated();
    }
  }, [allPendingInvoiceCreatedList, allPendingInvoiceCreatedLoading]);

  const getDataInvoiceCreated = () => {
    if (!allPendingInvoiceCreatedList) return;

    const mergedData = allPendingInvoiceCreatedList.map((item) => {
      const userData = userContextData?.find(
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

    setDataInvoice(sortedData);
    setFilterDataInvoice(sortedData);
    calculateUniqueData([...sortedData]);
  };

  const calculateUniqueData = (sortedData) => {
    const aggregateData = (data, keyExtractor) => {
      return data?.reduce((acc, curr) => {
        const key = keyExtractor(curr);

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

        acc[key].saleData.campaign_amount +=
          curr?.saleData?.campaign_amount ?? 0;
        acc[key].invoice_amount += curr?.invoice_amount ?? 0;

        return acc;
      }, {});
    };
    // Aggregate data by account name
    const aggregatedAccountData = aggregateData(
      sortedData,
      (item) => item?.saleData?.account_name || ""
    );
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerInvoiceData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name
    const aggregatedSalesExData = aggregateData(
      sortedData,
      (item) => item?.user_name || ""
    );
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveInvoiceData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

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
    handleCloseUniqueCustomer();
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
    handleCloseUniqueSalesExecutive();
  };

  // Total amounts:-
  const calculateTotalAmount = (field) => {
    return filterDataInvoice?.reduce(
      (total, item) => total + parseFloat(item?.saleData?.[field] || 0),
      0
    );
  };

  // Setting totals for base and campaign amounts
  const totalBaseAmount = calculateTotalAmount("base_amount");
  setBaseAmountTotal(totalBaseAmount);

  const totalCampaignAmount = calculateTotalAmount("campaign_amount");
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
        getData={refetchPendingInvoiceCreated}
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
          handleOpenSameSalesExecutive,
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
          handleOpenSameCustomer,
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />

      {/* Filters */}
      <InvoiceCreatedFilters
        dataInvoice={dataInvoice}
        setFilterDataInvoice={setFilterDataInvoice}
      />

      <div>
        <View
          columns={invoiceCreatedColumns({
            filterDataInvoice,
            setOpenImageDialog,
            setViewImgSrc,
            handleOpenEditFieldAction,
          })}
          data={filterDataInvoice}
          isLoading={allPendingInvoiceCreatedLoading}
          title={"Invoice Created"}
          rowSelectable={true}
          setTotal={true}
          pagination={[100, 200]}
          tableName={"finance-invoice-created"}
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
export default InvoiceCreated;
