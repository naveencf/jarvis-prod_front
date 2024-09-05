import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import jwtDecode from "jwt-decode";
import moment from "moment";
import FormContainer from "../../../AdminPanel/FormContainer";

const BalanceTransactionList = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [paymentMode, setPaymentMode] = useState([]);
  const { sale_booking_id } = useParams();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;

  function handleSubmitTransactionData() {
    axios
      .get(
        baseUrl +
          `sales/payment_update?status=approval&sale_booking_id=${sale_booking_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTransactionData(res?.data?.data);
      });
  }

  const paymentModeData = () => {
    axios
      .get(baseUrl + "sales/payment_mode", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setPaymentMode(res?.data?.data);
      })
      .catch((error) =>
        console.log(error, "Error While getting payment mode data")
      );
  };

  useEffect(() => {
    handleSubmitTransactionData();
    paymentModeData();
  }, []);

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      width: 70,
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...transactionData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    // {
    //   field: "aging",
    //   headerName: "Aging",
    //   renderCell: (params) => {
    //    <div>{params.row}</div>
    //   },
    // },
    {
      field: "cust_name",
      headerName: "Customer Name",
      width: 320,
      renderCell: (params) => params.row.account_name,
      sortable: true,
    },
    {
      field: "user_name",
      headerName: "Sales Executive Name",
      width: 190,
      renderCell: (params) => params.row.created_by_name,
    },
    {
      field: "sale_booking_date",
      headerName: "Sale Booking Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.sale_booking_date)}
        </div>
      ),
    },
    {
      field: "payment_date",
      headerName: "Payment Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {moment(params.row.payment_date).format("DD/MM/YYYY HH:MM")}
        </div>
      ),
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      width: 190,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "payment_amount",
      headerName: "Paid Amount",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {params.row.payment_amount ? params.row.payment_amount : 0}
        </div>
      ),
    },
    {
      field: "gst_status",
      headerName: "GST",
      renderCell: (params) =>
        params.row.gst_status === true ? "GST" : "Non GST",
    },
    {
      headerName: "Payment Mode",
      field: "payment_mode",
      width: 180,
      renderCell: (params) => {
        // const pmData =
        //   paymentMode?.find(
        //     (mode) => mode?._id === params?.row?.payment_detail?.payment_mode_id
        //   )?.payment_mode_name || "";
        return (
          <div>
            {params.row.payment_mode_name
              ? params.row.payment_mode_name
              : "Others"}{" "}
          </div>
        );
      },
    },
    {
      field: "payment_ref_no",
      headerName: "Reference Number",
      renderCell: (params) => params.row.payment_ref_no,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 190,
    //   renderCell: (params) => (
    //     <button
    //       className="btn cmnbtn btn_sm btn-outline-primary"
    //       onClick={() => handleImageClick(params.row)}
    //     >
    //       Balance Update
    //     </button>
    //   ),
    // },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance-transaction-list"
      />
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <DataGrid
            rows={transactionData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => transactionData.indexOf(row)}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceTransactionList;
