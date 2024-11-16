import { useEffect, useState } from "react";
import { useGlobalContext } from "../../../../../Context/Context";
import ImageView from "../../../ImageView";
import moment from "moment";
import {
  saleBookingCloseColumns,
  uniqueSaleBookingAccountColumn,
  uniqueSaleBookingSalesExecutiveColumn,
} from "../../../CommonColumn/Columns";
import View from "../../../../AdminPanel/Sales/Account/View/View";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";
import SaleBookingCloseVerifyDialog from "./SaleBookingCloseVerifyDialog";
// import { useGetAllSaleBookingCloseListQuery } from "../../../../Store/API/Finance/SaleBookingTDSApi";
import SaleBookingCloseFilters from "./SaleBookingCloseFilters";
import { useGetAllSaleBookingCloseListQuery } from "../../../../Store/API/Finance/SaleBookingTDSApi";

const SaleBookingClose = ({
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
  setButtonAccess,
  setUniqueCustomerCount,
  setUniqueSalesExecutiveCount,
}) => {
  const {
    refetch: refetchSaleBookingCloseList,
    data: allSaleBookingCloseList,
    error: allSaleBookingCloseListError,
    isLoading: allSaleBookingCloseListLoading,
  } = useGetAllSaleBookingCloseListQuery("close");

  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [row, setRow] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (allSaleBookingCloseList && !allSaleBookingCloseListLoading) {
      getData();
    }
  }, [allSaleBookingCloseList, allSaleBookingCloseListLoading]);

  const getData = async () => {
    if (!allSaleBookingCloseList) return;
    const transformedData = allSaleBookingCloseList?.reduce((acc, object) => {
      if (object?.salesInvoiceRequestData?.length > 0) {
        const invoices = object?.salesInvoiceRequestData?.map((invoice) => ({
          ...invoice,
          account_id: object.account_id,
          sale_booking_date: object.sale_booking_date,
          campaign_amount: object.campaign_amount,
          base_amount: object.base_amount,
          gst_amount: object.gst_amount,
          tds_status: object.tds_status,
          tds_percentage: object.tds_percentage,
          tds_amount: object.tds_amount,
          tds_verified_amount: object.tds_verified_amount,
          created_by: object.created_by,
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
          sale_booking_id: object.sale_booking_id,
          account_name: object.account_name,
          created_by_name: object.created_by_name,
          paid_amount: object.paid_amount,
          booking_created_date: object.booking_created_date,
          invoice_file_url: object.invoice_file_url,
        }));
        acc?.push(...invoices);
      } else {
        acc.push({ ...object });
      }
      return acc;
    }, []);
    const reversedData = transformedData?.reverse();
    setData(reversedData);
    setFilterData(reversedData);
    calculateUniqueData(reversedData);

    const dateFilterData = filterDataBasedOnSelection(reversedData);
    setFilterData(dateFilterData);
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

    // Aggregate data by account name:-
    const aggregatedAccountData = aggregateData(sortedData, "account_name");
    const uniqueAccData = Object.values(aggregatedAccountData);
    setUniqueCustomerData(uniqueAccData);
    setUniqueCustomerCount(uniqueAccData?.length);

    // Aggregate data by sales executive name :-
    const aggregatedSalesExData = aggregateData(sortedData, "created_by_name");
    const uniqueSalesExData = Object.values(aggregatedSalesExData);
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData?.length);
  };

  const close = (e) => {
    e.preventDefault();
    const filteredData = datas?.filter((item) => item);
    setFilterData(filteredData);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d.account_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

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
  const handleOpenSameAccount = (accountName) => {
    const sameNameAccount = datas?.filter(
      (item) => item.account_name === accountName
    );
    setFilterData(sameNameAccount);
    handleCloseUniqueCustomer();
  };

  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);

  const handleOpenVerifyDialog = (e, row) => {
    e.preventDefault();
    setVerifyDialog(true);
    setRow(row);
  };

  // const handleCloseVerifyDialog = () => {
  //   setVerifyDialog(false);
  //   setBalAmount("");
  //   setRemark("");
  // };

  // ========================================================

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "thisWeek":
        const startOfWeek = now.clone().startOf("week");
        const endOfWeek = now.clone().endOf("week");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          )
        );
      case "lastWeek":
        const startOfLastWeek = now
          .clone()
          .subtract(1, "weeks")
          .startOf("week");
        const endOfLastWeek = now.clone().subtract(1, "weeks").endOf("week");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfLastWeek,
            endOfLastWeek,
            "day",
            "[]"
          )
        );
      case "currentMonth":
        const startOfMonth = now.clone().startOf("month");
        const endOfMonth = now.clone().endOf("month");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      case "currentQuarter":
        const quarterStart = moment().startOf("quarter");
        const quarterEnd = moment().endOf("quarter");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      case "today":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isSame(now, "day")
        );
      default:
        return apiData;
    }
  };

  return (
    <>
      {/* verify dialog box */}
      <SaleBookingCloseVerifyDialog
        setVerifyDialog={setVerifyDialog}
        verifyDialog={verifyDialog}
        refetchSaleBookingCloseList={refetchSaleBookingCloseList}
        row={row}
      />
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveData}
        columns={uniqueSaleBookingSalesExecutiveColumn({
          uniqueSalesExecutiveData,
          handleOpenVerifyDialog,
          handleOpenSameSalesExecutive,
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />
      {/* Unique Accounts Dialog Box */}
      <CommonDialogBox
        data={uniqueCustomerData}
        columns={uniqueSaleBookingAccountColumn({
          uniqueCustomerData,
          handleOpenVerifyDialog,
          handleOpenSameAccount,
        })}
        setDialog={setUniqueCustomerDialog}
        dialog={uniqueCustomerDialog}
        title="Unique Accounts"
      />
      {/* Sale Booking Close Filters */}
      <SaleBookingCloseFilters
        datas={datas}
        setFilterData={setFilterData}
        setUniqueCustomerCount={setUniqueCustomerCount}
        setUniqueCustomerData={setUniqueCustomerData}
        setUniqueSalesExecutiveData={setUniqueSalesExecutiveData}
        setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
      />
      <div>
        <View
          columns={saleBookingCloseColumns({
            filterData,
            handleOpenVerifyDialog,
            setViewImgSrc,
            setViewImgDialog,
          })}
          data={filterData}
          isLoading={allSaleBookingCloseListLoading}
          title={"Sale Booking"}
          rowSelectable={true}
          showTotal={true}
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
        {viewImgDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            setViewImgDialog={setViewImgDialog}
          />
        )}
      </div>
    </>
  );
};

export default SaleBookingClose;
