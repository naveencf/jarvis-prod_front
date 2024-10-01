import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { baseUrl } from "../../../../../utils/config";
import moment from "moment";
import {
  incentivePaymentColumns,
  incentiveUniqueSalesExecutiveColumns,
} from "../../../CommonColumn/Columns";
import BalanceReleaseIncentive from "../IncentiveComponents/Components/BalanceReleaseIncentive";
import IncentiveFilters from "./Components/IncentiveFilters";
import CommonDialogBox from "../../../CommonDialog/CommonDialogBox";
import { ConstructionOutlined } from "@mui/icons-material";

const IncentivePayment = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [selectedTrue, setp_TotalTrue] = useState(0);
  const [selectedFalse, setp_TotalFalse] = useState(0);
  const [total, setp_Total] = useState(0);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [balanceReleaseAmount, setBalanceReleaseAmount] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [viewPendingStatus, setViewPendingStatus] = useState(true);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const calculateAging = (date1, date2) => {
    const diffHours =
      Math.abs(new Date(date1) - new Date(date2)) / (60 * 60 * 1000);
    return Math.round(diffHours);
  };

  const releaseIncentive = async () => {
    const saleBookingIds = [
      ...selectedTrue.map((c) => c.sale_booking_id),
      ...selectedFalse.map((c) => c.sale_booking_id),
    ];

    try {
      const response = await axios.post(
        `${baseUrl}sales/incentive_request`,
        {
          sales_executive_id: selectedData.sales_executive_id,
          sale_booking_ids: saleBookingIds,
          created_by: loginUserId,
          user_requested_amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error releasing campaigns:", error);
      return error;
    }
  };

  const filterDataBasedOnSelection = useCallback(
    (apiData) => {
      const now = moment();
      switch (dateFilter) {
        case "last7Days":
          return apiData.filter((item) =>
            moment(item.request_creation_date).isBetween(
              now.clone().subtract(7, "days"),
              now,
              "day",
              "[]"
            )
          );
        case "last30Days":
          return apiData.filter((item) =>
            moment(item.request_creation_date).isBetween(
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
            moment(item.request_creation_date).isBetween(
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
            moment(item.request_creation_date).isBetween(
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
            moment(item.request_creation_date).isBetween(
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
            moment(item.request_creation_date).isBetween(
              quarterStart,
              quarterEnd,
              "day",
              "[]"
            )
          );
        case "today":
          return apiData.filter((item) =>
            moment(item.request_creation_date).isSame(now, "day")
          );
        default:
          return apiData;
      }
    },
    [dateFilter]
  );

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/incentive_request_list_for_finance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedData = response?.data?.data;

      const filteredData = filterDataBasedOnSelection(fetchedData);
      setData(fetchedData);
      setFilterData(filteredData);
      calculateUniqueData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Async function inside useEffect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  const calculateUniqueData = useCallback((sortedData) => {
    const aggregateData = (data, keyName) => {
      return data?.reduce((acc, curr) => {
        const key = curr?.[keyName];
        if (!key) return acc;

        if (!acc[key]) {
          acc[key] = {
            sales_executive_name: curr.sales_executive_name || "",
            user_requested_amount: 0,
            admin_approved_amount: 0,
            finance_released_amount: 0,
          };
        }
        acc[key].user_requested_amount += curr?.user_requested_amount ?? 0;
        acc[key].admin_approved_amount += curr?.admin_approved_amount ?? 0;
        acc[key].finance_released_amount += curr?.finance_released_amount ?? 0;

        return acc;
      }, {});
    };

    const uniqueSalesExData = Object.values(
      aggregateData(sortedData, "sales_executive_name")
    );
    setUniqueSalesExecutiveData(uniqueSalesExData);
    setUniqueSalesExecutiveCount(uniqueSalesExData.length);
  }, []);

  useEffect(() => {
    if (!search) {
      setFilterData(datas);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const result = datas.filter((d) =>
      d?.sales_executive_name?.toLowerCase().includes(lowerSearch)
    );
    setFilterData(result);
  }, [search, datas]);

  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesExecutiveName) => {
    const filteredData = datas?.filter(
      (item) => item?.sales_executive_name === salesExecutiveName
    );
    setFilterData(filteredData);
    handleCloseUniquesalesExecutive();
  };

  const calculateTotal = (data = [], key) => {
    return data?.reduce((total, item) => total + parseFloat(item[key]), 0);
  };

  const requestedAmountTotal = calculateTotal(
    filterData,
    "user_requested_amount"
  );
  const incentiveReleasedAmtTotal = calculateTotal(
    filterData,
    "finance_released_amount"
  );

  // Optimized filterAndCalculateTotal function
  const filterAndCalculateTotal = useCallback((status, data) => {
    const totals = data?.reduce(
      (acc, row) => {
        if (row.finance_status === status) {
          acc.requested += parseFloat(row.user_requested_amount) || 0;
          acc.approved += parseFloat(row.admin_approved_amount) || 0;
        }
        acc.released += parseFloat(row.finance_released_amount) || 0;
        return acc;
      },
      { requested: 0, approved: 0, released: 0 }
    );

    const totalRow = {
      _id: "total",
      sales_executive_name: "Total",
      user_requested_amount: totals.requested,
      admin_approved_amount: totals.approved,
      finance_released_amount: totals.released,
    };

    const filtered = data?.filter((item) => item.finance_status === status);

    setViewPendingStatus(status !== "approved");
    setFilterData([...filtered, totalRow]);
  }, []);

  // Define handleFilterData function, depends on filterAndCalculateTotal
  const handleFilterData = useCallback(
    (status) => {
      filterAndCalculateTotal(status, datas);
    },
    [datas, filterAndCalculateTotal]
  );

  useEffect(() => {
    handleFilterData("pending");
  }, [datas, handleFilterData]);

  // Event handlers
  const handlePendingFilterData = (e) => {
    e.preventDefault();
    handleFilterData("pending");
  };

  const handleCompletedFilterData = (e) => {
    e.preventDefault();
    handleFilterData("approved");
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(datas);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Incentive Disbursement Request"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        requestedAmountTotal={requestedAmountTotal}
        incentiveReleasedAmtTotal={incentiveReleasedAmtTotal}
        incentivePaymentAdditionalTitles={true}
      />
      {/* Unique Sales Executive Dialog Box */}
      <CommonDialogBox
        data={uniqueSalesExecutiveData}
        // columns={uniqueSalesExecutiveColumns}
        columns={incentiveUniqueSalesExecutiveColumns({
          uniqueSalesExecutiveData,
          setSelectedData,
          setBalanceReleaseAmount,
          setAccountNo,
          setRemarks,
          setPaymentRef,
          setModalOpen,
          handleOpenSameSalesExecutive,
        })}
        setDialog={setUniqueSalesExecutiveDialog}
        dialog={uniqueSalesExecutiveDialog}
        title="Unique Sales Executive"
      />
      {/* Filters */}
      <IncentiveFilters setFilterData={setFilterData} datas={datas} />

      {/* Balance Release */}
      <BalanceReleaseIncentive
        setModalOpen={setModalOpen}
        isModalOpen={isModalOpen}
        getData={getData}
        selectedData={selectedData}
        setAccountNo={setAccountNo}
        setPaymentRef={setPaymentRef}
        accountNo={accountNo}
        paymentRef={paymentRef}
        remarks={remarks}
        setRemarks={setRemarks}
        setBalanceReleaseAmount={setBalanceReleaseAmount}
        balanceReleaseAmount={balanceReleaseAmount}
      />
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Incentive Release</h5>
          <div className="flexCenter colGap12">
            <button
              className="btn cmnbtn btn_sm btn-primary"
              onClick={(e) => handlePendingFilterData(e)}
            >
              Pending
            </button>
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={(e) => handleCompletedFilterData(e)}
            >
              Completed
            </button>
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
              rows={filterData}
              columns={incentivePaymentColumns({
                filterData,
                setSelectedData,
                setBalanceReleaseAmount,
                setAccountNo,
                setRemarks,
                setPaymentRef,
                setModalOpen,
                calculateAging,
                viewPendingStatus,
              })}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              // rowCount={filterData?.length - 1}
              getRowId={(row) => row?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncentivePayment;
