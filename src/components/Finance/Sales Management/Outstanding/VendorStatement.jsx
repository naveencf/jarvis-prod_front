import React, { useEffect, useState } from "react";
import View from "../../../AdminPanel/Sales/Account/View/View";
import NumberToNumericWords from "../../../../utils/NumberToNumericWords";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import formatString from "../../../../utils/formatString";
import { TextField } from "@mui/material";
import { useGetAllAccountDataQuery } from "../../../Store/API/Sales/PaymentDetailsApi";

const VendorStatement = () => {
  const [searchTerm, setSearchTerm] = useState("ab");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    refetch: refetchAccount,
    data: allAccount,
    error: allAccountError,
    isLoading,
  } = useGetAllAccountDataQuery(debouncedSearchTerm);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // fetchVendors(value, filter === "outstandingGreaterThanZero");
  };
  const Columns = [
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
    // {
    //   key: "totalSaleBookingCounts",
    //   name: "Total No. Of Sale booking",
    //   width: 100,
    //   sortable: true,
    // },
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
    // {
    //   key: "Average",
    //   name: "Average Sale Amount",
    //   renderRowCell: (row) => {
    //     if (row?.campaignAmount && row?.totalSaleBookingCounts) {
    //       const result = row.campaignAmount / row.totalSaleBookingCounts;
    //       return NumberToNumericWords(result);
    //     }
    //     return "Zero";
    //   },
    //   width: 100,
    //   compare: true,
    //   sortable: true,
    // },
    {
      key: "company_email",
      name: "Company Email",
      renderRowCell: (row) => row?.company_email || "N/A",
      width: 100,
      compare: true,
    },
    // {
    //   key: "accountPocCounts",
    //   name: "Total POC",
    //   renderRowCell: (row) => (
    //     <div
    //       style={{ color: "blue", cursor: "pointer" }}
    //       onClick={() => {
    //         setModalIsOpen(true);
    //         setModalData(row?.accountPocData);
    //       }}
    //     >
    //       {row?.accountPocCounts}
    //     </div>
    //   ),
    //   width: 100,
    // },
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
    // {
    //   key: "description",
    //   name: "Description",

    //   width: 200,
    //   sortable: true,
    //   showCol: true,
    //   editable: true,
    //   renderRowCell: (row) => (row?.description ? row?.description : "N/A"),
    //   customEditElement: (row, index, setEditFlag, handelchange) => (
    //     <input
    //       type="text"
    //       onChange={(e) => handelchange(e)}
    //       placeholder={row?.description}
    //     />
    //   ),
    // },
    // {
    //   key: "turn_over",
    //   name: "Turn Over",
    //   renderRowCell: (row) => row?.turn_over || "N/A",

    //   width: 100,
    //   sortable: true,
    //   showCol: true,
    // },
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
    // {
    //   key: "brand_category_name",
    //   name: "Brand Category Name",
    //   renderRowCell: (row) => {
    //     const brandType = allBrandCatType?.find(
    //       (brandCatType) => brandCatType._id === row?.category_id
    //     );
    //     return brandType ? brandType.brand_category_name : "NA";
    //   },
    //   width: 100,
    //   compare: true,
    //   showCol: true,
    // },
    {
      key: "statement",
      name: "Statement",
      renderRowCell: (row) => (
        <Link to={`/admin/vendor-statement-view/${row?.account_id}`}>
          <button className="btn btn-outline-primary btn-sm">Statement</button>
        </Link>
      ),
      width: 100,
      sortable: true,
      showCol: true,
    },
  ];
  return (
    <>
      <View
        version={1}
        columns={Columns}
        data={allAccount}
        isLoading={isLoading}
        title={"Vendor Statement"}
        pagination={[100, 200]}
        tableName={"Statement "}
        addHtml={
          <>
            <TextField
              label="Search Vendor"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </>
        }
      />
    </>
  );
};

export default VendorStatement;
