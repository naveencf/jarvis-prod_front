import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import View from "../../AdminPanel/Sales/Account/View/View";
import PaymentRequestFromPurchase from "./PaymentRequestFromPurchase";
import { useGetAllVendorQuery } from "../../Store/reduxBaseURL";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useCallback } from "react";
import jwtDecode from "jwt-decode";
import formatString from "../../../utils/formatString";

const VendorOutstandingOverview = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  // State for the search input
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [vendorData, setVendorData] = useState([]);
  const [vendorDetail, setVendorDetail] = useState("");
  const [reqestPaymentDialog, setReqestPaymentDialog] = useState(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const filter = params.get("filter");

  console.log(filter);
  useEffect(() => {
    if (filter === "outstandingGreaterThanZero") {
      fetchVendors("abh", true);
    } else {
      fetchVendors("abh");
    }
  }, []);


  // // Debounced function to call the API
  const fetchVendors = useCallback(
    debounce(async (search, includeOutstandingFilter = false) => {
      try {
        const queryParams = new URLSearchParams();

        if (includeOutstandingFilter) {
          queryParams.append("vendor_outstandings", "true");
        } else {
          if (search.length >= 3) {
            queryParams.append("search", search);
            queryParams.append("page", page); // use current state
            queryParams.append("limit", limit);
          } else {
            setVendorData([]); // Optional: clear list if search too short
            return;
          }
        }

        const res = await axios.get(`${baseUrl}v1/vendor?${queryParams.toString()}`);
        if (res.status === 200) {
          setVendorData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    }, 500),
    [page, limit]
  );


  // const fetchVendors = useCallback(
  //   debounce(async (search, includeOutstandingFilter = false) => {
  //     try {
  //       if (search.length >= 3) {
  //         const queryParams = new URLSearchParams({
  //           search,
  //           page: 1,
  //           limit: 10,
  //         });
  //         if (includeOutstandingFilter) {
  //           queryParams.append("vendor_outstandings", true);
  //         }

  //         const res = await axios.get(`${baseUrl}v1/vendor?${queryParams.toString()}`);
  //         // const res = await axios.get(`${baseUrl}v1/vendor?vendor_outstandings=true`);
  //         if (res.status === 200) {
  //           setVendorData(res.data.data);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching vendor data:", error);
  //     }
  //   }, 500),
  //   []
  // );

  // Debounce function
  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchVendors(value, filter === "outstandingGreaterThanZero");
  };


  // Handle pagination changes
  const handlePaginationChange = (newPage, newLimit) => {
    setPage(newPage);
    setLimit(newLimit);
  };

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
      renderRowCell: (row) => {
        const value = row.vendor_outstandings ?? 0;
        return Math.round(value);
      },
    },
    {
      key: "vendor_total_remaining_advance_amount",
      name: "Advance",
      width: 200,
      renderRowCell: (row) => {
        const value = row.vendor_total_remaining_advance_amount ?? 0;
        return Math.round(value);
      },
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
      renderRowCell: (row) => {
        return (
          <>
            <Button onClick={() => handlePaymentRequest(row)}>
              Request Payment
            </Button>
            {/* <Link to={`/admin/ledger/${row.vendor_id}`}>
                            <Button onClick={() => handlePaymentRequest(row)}>Ledger</Button>
                        </Link> */}
          </>
        );
      },
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
      renderRowCell: (row) => {
        return (
          <Link to={`/admin/ledger/${row._id}`}>
            <Button>Ledger</Button>
          </Link>
        );
      },
    },

    // Add more columns as needed
  ];
  const handlePaymentRequest = (row) => {
    if (!row) {
      return;
    }
    setReqestPaymentDialog(true);
    setVendorDetail(row);
  };
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
          data={vendorData || []}
          // isLoading={isLoading}
          title="Vendor Overview"
          rowSelectable={true}
          pagination={[100, 200, 1000]}
          onPaginationChange={handlePaginationChange}
          tableName="Vendor Overview"
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
      </div>
    </>
  );
};

export default VendorOutstandingOverview;
