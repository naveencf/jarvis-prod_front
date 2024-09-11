import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "./View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllBrandCategoryTypeQuery } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../../Context/Context";
import formatString from "../../../../utils/formatString";
import getDecodedToken from "../../../../utils/DecodedToken";

const SalesAccountOverview = () => {
  let loginUserId;
  const navigate = useNavigate();
  const token = getDecodedToken();
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataBtn, setFilteredDataBtn] = useState(false);
  const [activeText, setActiveText] = useState("0");

  const {
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery(loginUserId);

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
    setActiveText("0");
  }, [allAccount]);

  function filterEngine(data, isremove, isActive) {
    setActiveText(isActive);
    if (isremove === "remove") {
      setFilteredDataBtn(false);
    } else setFilteredDataBtn(true);
    setFilteredData(data);
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
      key: "created_by_name",
      name: "Sales Executive Name",
      width: 100,
      sortable: true,
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
      renderRowCell: (row) => row?.campaignAmount.toFixed(2),
      width: 100,
      sortable: true,
    },
    {
      key: "totalOutstanding",
      name: "Total Outstanding Amount",
      renderRowCell: (row) => row?.totalOutstanding.toFixed(2),
      width: 100,
      sortable: true,
    },
    {
      key: "Average",
      name: "Average Sale Amount",
      renderRowCell: (row) => {
        if (row?.campaignAmount && row?.totalSaleBookingCounts) {
          const result = row.campaignAmount / row.totalSaleBookingCounts;
          return Number.isInteger(result)
            ? result.toString()
            : result.toFixed(2);
        }
        return 0;
      },
      width: 100,
      compare: true,
      sortable: true,
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
                  ? row.website
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
      key: "createdAt",
      name: "Created Date",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
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
          (brandCatType) => brandCatType._id === row.category_id
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
          <Link to={`/admin/create-sales-account/${row?._id}`}>
            <button className="icon-1" title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
          <button
            className="icon-1"
            title="Create Sales Booking"
            onClick={() =>
              navigate("/admin/create-sales-booking", {
                state: {
                  account_data: row,
                },
              })
            }
          >
            <i className="bi bi-arrow-up-right"></i>
          </button>
        </div>
      ),
      width: 100,
      sortable: true,
      showCol: true,
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Account Overview"} link={true} />
        </div>
        <div className="action_btns">
          <Link to="/admin/view-Outstanding-details">
            <button className="btn cmnbtn btn-primary btn_sm">
              Outstanding
            </button>
          </Link>

          <Link to={"/admin/view-sales-booking"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Sale Booking
            </button>
          </Link>
          {loginUserRole === 1 && (
            <Link to={"/admin/sales-document-type-overview"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Document Type
              </button>
            </Link>
          )}
          <Link to={"/admin/create-sales-account/0"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add account
            </button>
          </Link>
        </div>
      </div>

      <div className="card mt24">
        <div className="card-body">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div
                class="card p16 hov-pointer"
                onClick={() => {
                  filterEngine(allAccount, "remove", "0");
                }}
              >
                <h6 class="colorMedium ">Total Accounts</h6>
                <h6 class="mt8 fs_16">{allAccount?.length}</h6>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div
                class="card p16 hov-pointer"
                onClick={() => {
                  filterEngine(
                    allAccount?.filter(
                      (account) => account?.totalSaleBookingCounts == 0
                    ),
                    "",
                    "1"
                  );
                }}
              >
                <h6 class="colorMedium">
                  Idle Accounts (Without Sale Booking)
                </h6>
                <h6 class="mt8 fs_16">
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
                class="card p16 hov-pointer"
                onClick={() => {
                  filterEngine(
                    allAccount?.filter((account) => account?.paidAmount == 0),
                    "",
                    "2"
                  );
                }}
              >
                <h6 class="colorMedium">Idle Accounts (Without Payment) </h6>
                <h6 class="mt8 fs_16">
                  {
                    allAccount?.filter((account) => account?.paidAmount == 0)
                      .length
                  }
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <View
        columns={ViewSalesAccountColumns}
        data={filteredData}
        isLoading={isLoading}
        title={"Account Details"}
        rowSelectable={true}
        pagination={[100, 200]}
        tableName={"SalesAccountOverview"}
      />
    </div>
  );
};

export default SalesAccountOverview;
