import React, { useEffect, useState } from "react";
import View from "./View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { json, Link, useNavigate } from "react-router-dom";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../../Context/Context";
import formatString from "../../../../utils/formatString";
import getDecodedToken from "../../../../utils/DecodedToken";
import Modal from "react-modal";
import CustomSelect from "../../../ReusableComponents/CustomSelect";

import {
  format,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  subQuarters,
} from "date-fns";
import ShareIncentive from "./ShareIncentive";
import PieGraph from "./PieGraph";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FormContainer from "../../FormContainer.jsx";
import { UserSwitch } from "@phosphor-icons/react";
import TransferAccount from "./TransferAccount.jsx";
import { all } from "axios";
import NumberToNumericWords from "../../../../utils/NumberToNumericWords.js";

const SalesAccountOverview = () => {
  const { userContextData, contextData } = useAPIGlobalContext();
  let loginUserId;
  const navigate = useNavigate();
  const token = getDecodedToken();
  const loginUserRole = token.role_id;
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }

  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataBtn, setFilteredDataBtn] = useState(false);
  const [activeText, setActiveText] = useState("0");
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [quickFiltring, setQuickFiltring] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [combinedData, setCombinedFilter] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  let [modalHandler, setModalHandler] = useState("SalesAccountPOC");

  const dateFilterArray = [
    {
      value: "createdAt",
      label: "Created Date",
    },
    {
      value: "lastSaleBookingDate",
      label: "Last Purchase Date",
    },
  ];

  const dateFilterOptions = [
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "yesterday", label: "Yesterday" },
    { value: "previous_week", label: "Previous Week" },
    { value: "previous_month", label: "Previous Month" },
    { value: "previous_year", label: "Previous Year" },
    { value: "previous_quarter", label: "Previous Quarter" },
    { value: "custom", label: "Custom" },
  ];

  const handleDateFilterChange = () => {
    const today = new Date();
    let from, to;

    switch (quickFiltring) {
      case "today":
        from = to = today;
        break;
      case "this_week":
        from = startOfWeek(today);
        to = today;
        break;
      case "this_month":
        from = startOfMonth(today);
        to = today;
        break;
      case "this_quarter":
        from = startOfQuarter(today);
        to = today;
        break;
      case "this_year":
        from = startOfYear(today);
        to = today;
        break;
      case "yesterday":
        from = to = subDays(today, 1);
        break;
      case "previous_week":
        from = startOfWeek(subWeeks(today, 1));
        to = subDays(startOfWeek(today), 1);
        break;
      case "previous_month":
        from = startOfMonth(subMonths(today, 1));
        to = subDays(startOfMonth(today), 1);
        break;
      case "previous_quarter":
        from = startOfQuarter(subQuarters(today, 1));
        to = subDays(startOfQuarter(today), 1);
        break;
      case "previous_year":
        from = startOfYear(subYears(today, 1));
        to = subDays(startOfYear(today), 1);
        break;
      case "custom":
      default:
        from = "";
        to = "";
        break;
    }

    setFromDate(from ? format(from, "yyyy-MM-dd") : "");
    setToDate(to ? format(to, "yyyy-MM-dd") : "");
  };

  useEffect(() => {
    handleDateFilterChange();
  }, [quickFiltring]);

  function dataFiltter() {
    let filtered = filteredData?.filter((data) => {
      let matchesBookingDate = true;

      if (fromDate !== "" && toDate !== "") {
        let saleBookingDate = new Date(data[selectedFilter]);
        let from = new Date(fromDate);
        let to = new Date(toDate);
        matchesBookingDate = saleBookingDate >= from && saleBookingDate <= to;
      }

      return matchesBookingDate;
    });
    setCombinedFilter(filtered);
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const {
    refetch: refetchAccount,
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery(loginUserId);

  function handelRemoveFiltter() {
    setCombinedFilter([...filteredData]);
    setSelectedFilter("");
    setQuickFiltring("");
  }

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
  } = useGetAllBrandCategoryTypeQuery();

  const isLoading = allAccountLoading || allBrandCatTypeLoading;

  const { toastAlert, toastError } = useGlobalContext();

  if (allAccountError) {
    toastError(
      allAccountError.data?.message ||
      allAccountError.error ||
      "An error occurred"
    );
  }

  if (allBrandCatTypeError) {
    toastError(
      allBrandCatTypeError.data?.message ||
      allBrandCatTypeError.error ||
      "An error occurred"
    );
  }

  useEffect(() => {
    setFilteredData(allAccount);
    setCombinedFilter(allAccount);
    setActiveText("0");
  }, [allAccount]);

  function filterEngine(data, isremove, isActive) {
    setActiveText(isActive);
    if (isremove === "remove") {
      setFilteredDataBtn(false);
    } else setFilteredDataBtn(true);
    setFilteredData(data);
    setCombinedFilter(data);
  }

  const ViewSalesAccountColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      sortable: true,
    },
    {
      key: "brand_name",
      name: "Brand Name",

      width: 100,
    },
    {
      key: "account_image_url",
      name: "Logo",
      renderRowCell: (row) => (
        <img
          className="icon-1"
          src={row?.account_image_url}
          alt="Logo"
          style={{ width: "50px", height: "50px" }}
        />
      ),
      width: 50,
      showCol: true,
    },
    {
      key: "account_name",
      name: "Account Name",
      renderRowCell: (row) => (
        <Link style={{ color: "blue" }} to={`/sales-account-info/${row?._id}`}>
          {formatString(row?.account_name)}
        </Link>
      ),
      width: 100,
      sortable: true,
    },
    {
      key: "account_percentage",
      name: "Account Percentage",
      width: 100,
    },
    {
      key: "account_owner_name",
      name: "Sales Executive Name",
      width: 100,
      sortable: true,
    },
    {
      key: "created_by_name",
      name: "Account Owner Name",
      width: 100,
    },
    {
      key: "totalSaleBookingCounts",
      name: "Total No. Of Sale booking",
      width: 100,
      sortable: true,
    },
    {
      key: "campaignAmount",
      name: "Campaign Amount Total",
      renderRowCell: (row) => NumberToNumericWords(Number(row?.campaignAmount)),
      width: 100,
      sortable: true,
    },
    {
      key: "totalOutstanding",
      name: "Total Outstanding Amount",
      renderRowCell: (row) => NumberToNumericWords(row?.totalOutstanding),
      width: 100,
      sortable: true,
    },
    {
      key: "Average",
      name: "Average Sale Amount",
      renderRowCell: (row) => {
        if (row?.campaignAmount && row?.totalSaleBookingCounts) {
          const result = row.campaignAmount / row.totalSaleBookingCounts;
          return NumberToNumericWords(result);
          // return Number.isInteger(result)
          //   ? result?.toString()
          //   : result?.toFixed(2);
        }
        return "Zero";
      },
      width: 100,
      compare: true,
      sortable: true,
    },
    {
      key: "company_email",
      name: "Company Email",
      renderRowCell: (row) => row?.company_email || "N/A",
      width: 100,
      compare: true,
    },
    {
      key: "accountPocCounts",
      name: "Total POC",
      renderRowCell: (row) => (
        <div
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            setModalIsOpen(true);
            setModalData(row?.accountPocData);
          }}
        >
          {row?.accountPocCounts}
        </div>
      ),
      width: 100,
    },
    {
      key: "lastSaleBookingDate",
      name: "Last Purchase Date",
      renderRowCell: (row) =>
        row?.lastSaleBookingDate
          ? DateISOtoNormal(row?.lastSaleBookingDate)
          : "N/A",
      width: 100,
      sortable: true,
    },
    {
      key: "aging",
      name: "Aging",
      renderRowCell: (row) => {
        let lastBookingDate;
        if (row?.lastSaleBookingDate === null) {
          lastBookingDate = new Date();
        } else {
          lastBookingDate = new Date(row?.lastSaleBookingDate);
        }
        const currentDate = new Date();

        const timeDiff = Math.abs(
          lastBookingDate.getTime() - currentDate.getTime()
        );
        const idealDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        // if (row?.totalSaleBookingCounts === 0) return JSON.stringify(lastBookingDate);
        return idealDays;
      },
      compare: true,
      width: 100,
      sortable: true,
    },
    {
      key: "description",
      name: "Description",

      width: 200,
      sortable: true,
      showCol: true,
      editable: true,
      renderRowCell: (row) => (row?.description ? row?.description : "N/A"),
      customEditElement: (row, index, setEditFlag, handelchange) => (
        <input
          type="text"
          onChange={(e) => handelchange(e)}
          placeholder={row?.description}
        />
      ),
    },
    {
      key: "turn_over",
      name: "Turn Over",
      renderRowCell: (row) => row?.turn_over || "N/A",

      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "website",
      name: "Website",
      renderRowCell: (row) => {
        if (row.website) {
          return (
            <a
              style={{ hover: "pointer", color: "blue" }}
              href={
                row?.website?.startsWith("http")
                  ? row.website || "N/A"
                  : `http://${row.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.website}
            </a>
          );
        } else {
          return "N/A";
        }
      },
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "createdDate",
      name: "Created Date",
      renderRowCell: (row) => DateISOtoNormal(row?.createdAt),
      width: 100,
      sortable: true,
      showCol: true,
      compare: true,
    },
    {
      key: "updatedAt",
      name: "Updated Date",
      renderRowCell: (row) => DateISOtoNormal(row.updatedAt),
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "account_type_name",
      name: "Account Type",
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "company_type_name",
      name: "Company Type",
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "brand_category_name",
      name: "Brand Category Name",
      renderRowCell: (row) => {
        const brandType = allBrandCatType?.find(
          (brandCatType) => brandCatType._id === row?.category_id
        );
        return brandType ? brandType.brand_category_name : "NA";
      },
      width: 100,
      compare: true,
      showCol: true,
    },
    {
      key: "Action_edits",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="flex-row">
          <Link to={`/admin/sales/create-sales-account/${row?._id}`}>
            <button className="icon-1" title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
          <button
            className="icon-1"
            title="Create Sales Booking"
            onClick={() =>
              navigate("/admin/sales/create-sales-booking", {
                state: {
                  account_data: row,
                },
              })
            }
          >
            <i className="bi bi-arrow-up-right"></i>
          </button>
          {contextData?.find((data) => data?._id == 64)?.view_value == 1 && (
            <button
              className="icon-1"
              title="Transfer Account Owner"
              onClick={() => {
                console.log(row);
                setModalIsOpen(true);
                setModalHandler("AccountTransfer");
                setModalData(row);
              }}
            >
              <UserSwitch />
            </button>
          )}
        </div>
      ),
      width: 100,
      sortable: true,
      showCol: true,
    },
  ];

  const pocColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "contact_name",
      name: "Contact Name",
      width: 100,
    },
    {
      key: "contact_no",
      name: "Contact No",
      width: 100,
    },
    {
      key: "email",
      name: "Email",
      width: 100,
    },
    {
      key: "alternative_contact_no",
      name: "Alternative Contact No",
      renderRowCell: (row) => row?.alternative_contact_no || "N/A",
      width: 100,
      compare: true,
    },
  ];
  const modalMap = {
    SalesAccountPOC: (
      <View
        version={1}
        columns={pocColumns}
        data={modalData}
        isLoading={isLoading}
        title={"Account POC Details"}
        pagination={[100, 200]}
        tableName={"SalesAccountPOC"}
      />
    ),
    IncentiveShare: (
      <ShareIncentive
        closeModal={handleCloseModal}
        accountInfo={selectedData}
      />
    ),
    AccountTransfer: (
      <TransferAccount
        account_Owner={modalData?.account_owner_id}
        id={modalData?._id}
        accountData={modalData}
        setModalIsOpen={setModalIsOpen}
        refetchAccount={refetchAccount}
      />
    ),
  };
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("accFilter")) || {};
    if (Object.keys(localData).length == 0) {
      filterEngine(allAccount, "remove", "0");
      return;
    }
    if (allAccount?.length > 0) {
      const key = Object?.keys(localData)[0];
      const data = localData[key];
      filterEngine(
        key === "0"
          ? allAccount
          : allAccount?.filter((account) => account[data?.type] == 0),
        data?.isRemove ? "remove" : "",
        String(key)
      );
    }
  }, [allAccountLoading]);
  return (
    <div>
      <Modal
        isOpen={ModalIsOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "70%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            zIndex: "100000",
          },
        }}
      >
        {modalMap[modalHandler]}
      </Modal>

      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Account Overview"} link={true} />
        </div>
        <div className="action_btns">
          {loginUserRole === 1 && selectedData.length === 1 && (
            <button
              className="btn cmnbtn btn-primary btn_sm"
              onClick={() => {
                setModalIsOpen(true);
                setModalHandler("IncentiveShare");
              }}
            >
              Incentive Share
            </button>
          )}

          <Link to="/admin/sales/view-Outstanding-details">
            <button className="btn cmnbtn btn-primary btn_sm">
              Outstanding
            </button>
          </Link>

          <Link to={"/admin/sales/view-sales-booking"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Sale Booking
            </button>
          </Link>
          {loginUserRole === 1 && (
            <Link to={"/admin/sales/sales-document-type-overview"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Document Type
              </button>
            </Link>
          )}
          <Link to={"/admin/sales/create-sales-account/0"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add account
            </button>
          </Link>
        </div>
      </div>

      <div className="graph-card-holder">
        <div className="card-holder w-100 p-0">
          <div className="card ">
            <div className="card-body row">
              <CustomSelect
                label="Select Column"
                fieldGrid={4}
                dataArray={dateFilterArray}
                optionId="value"
                optionLabel="label"
                selectedId={selectedFilter}
                setSelectedId={setSelectedFilter}
              />
              <CustomSelect
                label="Date"
                fieldGrid={4}
                dataArray={dateFilterOptions}
                optionId="value"
                optionLabel="label"
                selectedId={quickFiltring}
                setSelectedId={setQuickFiltring}
              />
              {quickFiltring === "custom" && (
                <>
                  <FieldContainer
                    type="date"
                    label="From Date"
                    fieldGrid={4}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                  <FieldContainer
                    type="date"
                    label="To Date"
                    fieldGrid={4}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </>
              )}
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 flexCenter colGap12 pt8 mb-3">
                <button
                  className="cmnbtn btn-primary"
                  onClick={() => dataFiltter()}
                >
                  Search
                </button>
                {allAccount?.length !== combinedData?.length && (
                  <button
                    className="iconBtn btn btn-outline-danger"
                    onClick={() => handelRemoveFiltter()}
                    title="Remove Filter"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card ">
            <div className="card-body">
              <div className="row">
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                  <div
                    className="card p16 hov-pointer"
                    onClick={() => {
                      filterEngine(allAccount, "remove", "0");
                      addLocal("0", { isRemove: true, type: "all", key: "0" });
                    }}
                  >
                    <h6 className="colorMedium ">Total Accounts</h6>
                    <h6 className="mt8 fs_16">{allAccount?.length}</h6>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                  <div
                    className="card p16 hov-pointer"
                    onClick={() => {
                      filterEngine(
                        allAccount?.filter(
                          (account) => account?.totalSaleBookingCounts == 0
                        ),
                        "",
                        "1"
                      );
                      addLocal("1", {
                        isRemove: false,
                        type: "totalSaleBookingCounts",
                        key: "1",
                      });
                    }}
                  >
                    <h6 className="colorMedium">
                      Idle Accounts (Without Sale Booking)
                    </h6>
                    <h6 className="mt8 fs_16">
                      {
                        allAccount?.filter(
                          (account) => account?.totalSaleBookingCounts == 0
                        )?.length
                      }
                    </h6>
                  </div>
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                  <div
                    className="card p16 hov-pointer"
                    onClick={() => {
                      filterEngine(
                        allAccount?.filter(
                          (account) => account?.paidAmount == 0
                        ),
                        "",
                        "2"
                      );
                      addLocal("2", {
                        isRemove: false,
                        type: "paidAmount",
                        key: "2",
                      });
                    }}
                  >
                    <h6 className="colorMedium">
                      Idle Accounts (Without Payment){" "}
                    </h6>
                    <h6 className="mt8 fs_16">
                      {
                        allAccount?.filter(
                          (account) => account?.paidAmount == 0
                        ).length
                      }
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loginUserRole === 1 && allAccount && allAccount?.length > 0 && (
          <PieGraph
            allAccount={combinedData}
            setCombinedFilter={setCombinedFilter}
          />
        )}
      </div>

      <View
        version={1}
        columns={ViewSalesAccountColumns}
        data={combinedData}
        isLoading={isLoading}
        title={"Account Details"}
        rowSelectable={true}
        pagination={[100, 200]}
        tableName={"SalesAccountOverview"}
        selectedData={setSelectedData}
        addHtml={
          selectedData.length === 1 && (
            <div className="flex-row">
              <button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() =>
                  navigate("/admin/sales/create-sales-booking", {
                    state: {
                      account_data: selectedData[0],
                    },
                  })
                }
              >
                Create Sale Booking
              </button>
            </div>
          )
        }
      />
    </div>
  );
};

function addLocal(key, data) {
  localStorage.setItem("accFilter", JSON.stringify({ [key]: data }));
}

export default SalesAccountOverview;
