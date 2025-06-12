import React, { useCallback, useState } from "react";
import View from "../Sales/Account/View/View";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { useGetVendorsWithPaginationQuery } from "../../Store/reduxBaseURL";
import { TextField } from "@mui/material";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { debounce } from "../../../utils/helper";

const VendorInventory = () => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [openUpdateVendorMPrice, setOpenUpdateVendorMPrice] = useState(false);
  const [rowVendor, setRowVendor] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [getRowData, setGetRowData] = useState([]);
  const { contextData } = useAPIGlobalContext();
  const naviagte = useNavigate();
  const {
    data: vendor,
    refetch: refetchVendor,
    isLoading: isVendorLoading,
    isFetching: isVendorFetching,
  } = useGetVendorsWithPaginationQuery({ page, limit, search });

  const typeData = vendor?.data?.data;
  const vendorData = vendor?.data;
  const pagination = vendor?.pagination;

  const showExport =
    contextData && contextData[72] && contextData[72].view_value === 1;

  const handleClickVendorName = (params) => {
    naviagte(`/admin/vendor-sale/vendor-inventory/${params._id}`);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleUpdateVendorMPrice = (row) => {
    setOpenUpdateVendorMPrice(true);
    setRowVendor(row);
  };

  const dataGridcolumns = [
    {
      key: "sno",
      name: "S.no",
      width: 200,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => (
        <div
          onClick={() => handleClickVendorName(row)}
          className="link-primary cursor-pointer text-truncate"
          style={{ color: "#0B58CA", cursor: "pointer" }}
        >
          {formatString(row.vendor_name)}
        </div>
      ),
    },
    {
      key: "vendor_type_name",
      name: "Vendor Type",
      width: 150,
      renderRowCell: (row) => formatString(row?.vendor_type_name),
    },
    {
      key: "vendor_category",
      name: "Category",
      width: 150,
      renderRowCell: (row) => formatString(row?.vendor_category),
    },
    {
      key: "primary_page_name",
      name: "Primary Page",
      width: 200,
      renderRowCell: (row) => formatString(row?.primary_page_name),
    },
    {
      key: "page_count",
      name: "Page Count",
      width: 120,
      renderRowCell: (row) => row?.page_count ?? "-",
    },
    {
      key: "vendor_customer_outstanding",
      name: "Customer Outstanding",
      width: 180,
      renderRowCell: (row) => row?.vendor_customer_outstanding,
    },
    {
      key: "vendor_outstandings",
      name: "Total Outstanding",
      width: 180,
      renderRowCell: (row) => row?.vendor_outstandings,
    },
    {
      key: "vendor_total_remaining_advance_amount",
      name: "Remaining Advance",
      width: 180,
      renderRowCell: (row) => row?.vendor_total_remaining_advance_amount,
    },
    {
      key: "mobile",
      name: "Mobile",
      width: 140,
      renderRowCell: (row) => row?.mobile || "-",
    },
  ];

  console.log("pagination", pagination);
  return (
    <div>
      <div>
        <View
          version={1}
          columns={dataGridcolumns}
          data={vendorData}
          //   isLoading={false}
          isLoading={isVendorLoading || isVendorFetching}
          cloudPagination={true}
          title="Vendors"
          rowSelectable={true}
          pagination={[10, 50, 100]}
          tableName="Vendors"
          selectedData={setGetRowData}
          pageNavigator={{
            prev: {
              disabled: page === 1,
              onClick: () => setPage((prev) => Math.max(prev - 1, 1)),
            },
            next: {
              disabled: vendorData?.data?.length < limit,
              onClick: () => setPage((prev) => prev + 1),
            },
            totalRows: pagination?.total_records || 0,
            currentPage: pagination?.current_page,
          }}
          addHtml={
            <>
              <TextField
                label="Search Vendor"
                variant="outlined"
                size="small"
                value={inputValue}
                onChange={handleSearchChange}
              />
            </>
          }
          showExport={showExport}
        />
      </div>
    </div>
  );
};

export default VendorInventory;
