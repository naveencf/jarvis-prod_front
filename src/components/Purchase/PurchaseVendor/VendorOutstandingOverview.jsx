import React, { useState, useEffect, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import View from "../../AdminPanel/Sales/Account/View/View";
import PaymentRequestFromPurchase from "./PaymentRequestFromPurchase";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import formatString from "../../../utils/formatString";
import {
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";

const VendorOutstandingOverview = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  const location = useLocation();
  const isAdvanceOutstandingRoute =
    location.pathname === "/admin/purchase/vendor-advance-outstanding";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [vendorData, setVendorData] = useState(null);
  const [vendorDetail, setVendorDetail] = useState("");
  const [reqestPaymentDialog, setReqestPaymentDialog] = useState(false);
  const [rangeCounts, setRangeCounts] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filter = params.get("filter");

  useEffect(() => {
    if (filter === "outstandingGreaterThanZero") {
      fetchVendors("", true);
    } else {
      fetchVendors("abh");
    }
  }, []);

  const formatToIndianCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "₹0";

    const crore = 10000000;
    const lakh = 100000;

    if (amount >= crore) {
      return `₹${(amount / crore).toFixed(2)} Cr`;
    } else if (amount >= lakh) {
      return `₹${(amount / lakh).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const fetchVendors = useCallback(
    debounce(async (search, includeOutstandingFilter = false, vendorContactType = "all") => {
      try {
        const queryParams = new URLSearchParams();
        if (isAdvanceOutstandingRoute) {
          queryParams.append("vendor_contact_type", vendorContactType);
          if (search !== "") {
            queryParams.append("search", search);
          }
          queryParams.append("page", page);
          queryParams.append("limit", limit);
        }
        else if (includeOutstandingFilter) {
          queryParams.append("vendor_outstandings", "true");
          queryParams.append("search", search);
        } else {
          if (search.length >= 3) {
            queryParams.append("search", search);
            queryParams.append("page", page);
            queryParams.append("limit", limit);
          } else {
            setVendorData([]);
            return;
          }
        }

        const res = await axios.get(
          `${baseUrl}v1/vendor_v2?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          const data = res.data?.data.data;
          setVendorData(data);
          if (includeOutstandingFilter) {
            const ranges = [
              { label: "0–10k", min: 0, max: 10000 },
              { label: "10k–50k", min: 10000, max: 50000 },
              { label: "50k–1L", min: 50000, max: 100000 },
              { label: "1L–2L", min: 100000, max: 200000 },
              { label: "1L–5L", min: 100000, max: 500000 },
              { label: "5L+", min: 500000, max: Infinity },
              { label: "10L+", min: 1000000, max: Infinity },
            ];

            const counts = ranges.map((range) => {
              const filteredItems = data.filter(
                (item) =>
                  item.vendor_outstandings &&
                  item.vendor_outstandings > range.min &&
                  item.vendor_outstandings <= range.max
              );

              const count = filteredItems.length;
              const totalOutstanding = filteredItems.reduce(
                (sum, item) => sum + (item.vendor_outstandings || 0),
                0
              );

              return {
                ...range,
                count,
                totalOutstanding,
              };
            });

            setRangeCounts(counts);

            // const counts = ranges.map((range) => {
            //   const count = data.filter(
            //     (item) =>
            //       item.vendor_outstandings &&
            //       item.vendor_outstandings > range.min &&
            //       item.vendor_outstandings <= range.max
            //   ).length;
            //   return {
            //     ...range,
            //     count,
            //   };
            // });

            setRangeCounts(counts);
          } else {
            setRangeCounts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    }, 500),
    [page, limit]
  );

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchVendors(value, filter === "outstandingGreaterThanZero");
  };

  const handlePaginationChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const handlePaymentRequest = (row) => {
    if (!row) return;
    setReqestPaymentDialog(true);
    setVendorDetail(row);
  };

  const handleRangeFilter = (range) => {
    setSelectedRange(range);
  };

  const filteredData = selectedRange
    ? vendorData.filter(
      (item) =>
        item.vendor_outstandings &&
        item.vendor_outstandings > selectedRange.min &&
        item.vendor_outstandings <= selectedRange.max
    )
    : vendorData;

  const columns = [
    {
      key: "sno",
      name: "S.NO",
      width: 80,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row, index) => formatString(row.vendor_name),
    },
    {
      key: "vendor_category",
      name: "Category",
      width: 200,
    },
    {
      key: "vendor_outstandings",
      name: "Outstanding",
      width: 200,
      renderRowCell: (row) => Math.round(row.vendor_outstandings ?? 0),
      getTotal: true,
    },
    {
      key: "vendor_total_remaining_advance_amount",
      name: "Advance",
      width: 200,
      getTotal: true,
      renderRowCell: (row) =>
        Math.round(row.vendor_total_remaining_advance_amount ?? 0),
    },
    {
      key: "primary_page_name",
      name: "Primary Page",
      width: 200,
      renderRowCell: (row) => formatString(row.primary_page_name),
    },
    {
      key: "action",
      name: "Action",
      width: 200,
      renderRowCell: (row) => (
        <button
          style={{
            color: "#1876D1",
            backgroundColor: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onClick={() => handlePaymentRequest(row)}
        >
          Request Payment
        </button>
      ),
    },
    {
      key: "mobile",
      name: "Mobile",
      width: 200,
    },
    {
      key: "page_count",
      name: "Page Count",
      width: 200,
    },
    {
      key: "Pincode",
      name: "Pincode",
      width: 200,
    },
    {
      key: "action",
      name: "Ledger",
      width: 200,
      renderRowCell: (row) => (
        <Link to={`/admin/purchase/ledger/${row._id}`}>
          <button
            style={{
              color: "#1876D1",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Ledger
          </button>
        </Link>
      ),
    },
  ];

  return (
    <>
      {reqestPaymentDialog && (
        <PaymentRequestFromPurchase
          reqestPaymentDialog={reqestPaymentDialog}
          setReqestPaymentDialog={setReqestPaymentDialog}
          vendorDetail={vendorDetail}
          setVendorDetail={setVendorDetail}
          userName={userName}
          isAdvanced={isAdvanceOutstandingRoute}
        />
      )}
      {isAdvanceOutstandingRoute && (
        <div className="tabs mb-4 flex gap-4">
          <button
            className={
              activeTab === "all" ? "btn btn-primary" : "btn btn-outline"
            }
            onClick={() => {
              setActiveTab("all");
              fetchVendors(searchTerm, false, "all");
            }}
          >
            All
          </button>
          <button
            className={
              activeTab === "active" ? "btn btn-primary" : "btn btn-outline"
            }
            onClick={() => {
              setActiveTab("active");
              fetchVendors(searchTerm, false, "active");
            }}
          >
            Active
          </button>
          <button
            className={
              activeTab === "in-active" ? "btn btn-primary" : "btn btn-outline"
            }
            onClick={() => {
              setActiveTab("in-active");
              fetchVendors(searchTerm, false, "in-active");
            }}
          >
            Inactive
          </button>
        </div>
      )}

      <div className="card">
        <View
          version={1}
          columns={columns}
          data={filteredData || []}
          title="Vendor Overview"
          rowSelectable={true}
          pagination={[100, 200, 1000]}
          onPaginationChange={handlePaginationChange}
          isLoading={vendorData ? false : true}
          showTotal={true}
          showExport={true}
          tableName="Vendor Overview"
          addHtml={
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <TextField
                label="Search Vendor"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {/* {rangeCounts.map((range) => (
                <Button
                  key={range.label}
                  variant={
                    selectedRange?.label === range.label
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleRangeFilter(range)}
                >
                  {range.label} ({range.count}) -{" "}
                  {formatToLakh(range.totalOutstanding)}
                </Button>
              ))} */}
              {!isAdvanceOutstandingRoute && <FormControl size="small" sx={{ minWidth: 250 }}>
                <InputLabel>Filter by Outstanding Range</InputLabel>
                <Select
                  value={selectedRange?.label || ""}
                  onChange={(e) => {
                    const range = rangeCounts.find(
                      (r) => r.label === e.target.value
                    );
                    handleRangeFilter(range);
                  }}
                  label="Filter by Outstanding Range"
                >
                  {rangeCounts.map((range) => (
                    <MenuItem key={range.label} value={range.label}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Typography>{range.label}</Typography>
                        <Typography>
                          ({range.count}) -{" "}
                          {formatToIndianCurrency(range.totalOutstanding)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              }
              {selectedRange && (
                <Button
                  variant="text"
                  color="error"
                  onClick={() => {
                    setSelectedRange(null);
                    fetchVendors("", filter === "outstandingGreaterThanZero");
                  }}

                >
                  Clear Filter
                </Button>
              )}
            </div>
          }
        />
      </div>
    </>
  );
};

export default VendorOutstandingOverview;
