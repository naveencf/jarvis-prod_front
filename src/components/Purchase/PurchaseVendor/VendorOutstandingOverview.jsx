import React, { useState, useEffect, useCallback } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import View from "../../AdminPanel/Sales/Account/View/View";
import PaymentRequestFromPurchase from "./PaymentRequestFromPurchase";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import formatString from "../../../utils/formatString";

const VendorOutstandingOverview = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState("");
  const [reqestPaymentDialog, setReqestPaymentDialog] = useState(false);
  const [rangeCounts, setRangeCounts] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filter = params.get("filter");

  useEffect(() => {
    if (filter === "outstandingGreaterThanZero") {
      fetchVendors("abh", true);
    } else {
      fetchVendors("abh");
    }
  }, []);

  const fetchVendors = useCallback(
    debounce(async (search, includeOutstandingFilter = false) => {
      try {
        const queryParams = new URLSearchParams();

        if (includeOutstandingFilter) {
          queryParams.append("vendor_outstandings", "true");
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
          `${baseUrl}v1/vendor?${queryParams.toString()}`
        );
        if (res.status === 200) {
          const data = res.data.data;
          setVendorData(data);
          if (includeOutstandingFilter) {
            const ranges = [
              { label: "0–10k", min: 0, max: 10000 },
              { label: "10k–50k", min: 10000, max: 50000 },
              { label: "50k–1L", min: 50000, max: 100000 },
              { label: "1L–2L", min: 100000, max: 200000 },
              { label: "1L–5L", min: 100000, max: 500000 },
              { label: "5L+", min: 500000, max: Infinity },
            ];

            const counts = ranges.map((range) => {
              const count = data.filter(
                (item) =>
                  item.vendor_outstandings &&
                  item.vendor_outstandings > range.min &&
                  item.vendor_outstandings <= range.max
              ).length;
              return {
                ...range,
                count,
              };
            });

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
    },
    {
      key: "vendor_total_remaining_advance_amount",
      name: "Advance",
      width: 200,
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
        <Link to={`/admin/ledger/${row._id}`}>
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
        />
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
              {rangeCounts.map((range) => (
                <Button
                  key={range.label}
                  variant={
                    selectedRange?.label === range.label
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleRangeFilter(range)}
                >
                  {range.label} ({range.count})
                </Button>
              ))}
              {selectedRange && (
                <Button
                  variant="text"
                  color="error"
                  onClick={() => setSelectedRange(null)}
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
