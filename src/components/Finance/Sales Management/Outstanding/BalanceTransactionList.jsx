import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import moment from "moment";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGetAllTransactionListQuery, useGetInvoiceTransactionListQuery } from "../../../Store/API/Sales/PaymentUpdateApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";
import { useUpdateOutstandingRevertMutation } from "../../../Store/API/Finance/OutstandingNew";

const BalanceTransactionList = () => {
  const { invoice_req_id } = useParams();
  console.log(invoice_req_id, "invoice_req_id")
  const {
    refetch: refetchTransactionList,
    data: allTransactionList,
    error: allTransactionListError,
    isLoading: allTransactionListLoading,
  } = useGetInvoiceTransactionListQuery({
    id: invoice_req_id,
    status: "approval",
  });

  const {
    refetch: refetchAllPaymentMode,
    data: allPaymentMode,
    error: allPaymentModeError,
    isLoading: allPaymentModeLoading,
  } = useGetAllPaymentModesQuery();
  const [updateOutstandingRevert] = useUpdateOutstandingRevertMutation();
  const [paymentMode, setPaymentMode] = useState([]);
  const token = sessionStorage.getItem("token");

  const columns = [
    {
      width: 70,
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{allTransactionList?.indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
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
          {moment(params.row.sale_booking_date).format("DD/MM/YYYY")}
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
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (

          <button
            variant="contained"
            autoFocus
            className="icon-1"
            title="Delete"
            onClick={() => handleRevert(params.row)}
          >
            <i className="bi bi-trash"></i>
          </button>
        );
      },
    },
  ];

  console.log(allTransactionList, "allTransactionList")

  const handleRevert = async (row) => {
    console.log(row, "row")
    // return;
    try {
      await updateOutstandingRevert({
        sale_booking_id: row.sale_booking_id, payment_update_id: row._id
        , invoice_req_id: invoice_req_id
      });
    } catch (error) {
      console.error("Revert failed:", error);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance/finance-transaction-list"
      />
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <DataGrid
            rows={allTransactionList || []}
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
            getRowId={(row) => row?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceTransactionList;
