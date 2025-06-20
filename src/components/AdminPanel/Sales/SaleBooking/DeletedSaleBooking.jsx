import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import View from "../Account/View/View";
import {
  useGetAllNewDeletedSaleQuery,
  useGetSaleBookingRetainMutation,
} from "../../../Store/API/Sales/SaleBookingApi";
import getDecodedToken from "../../../../utils/DecodedToken";
import formatString from "../../../../utils/formatString";
import { useGetAllCreditApprovalsQuery } from "../../../Store/API/Sales/CreditApprovalApi";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useGlobalContext } from "../../../../Context/Context";

const DeletedSaleBooking = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  const { userContextData, contextData } = useAPIGlobalContext();
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }
  const {
    data: deletedSaleBookingData,
    error: deletedSaleBookingError,
    isLoading: deletedSaleBookingLoading,
    refetch: deletedSaleBookingRefetch,
  } = useGetAllNewDeletedSaleQuery(loginUserId, { skip: !loginUserRole });

  const [retainSaleBooking] = useGetSaleBookingRetainMutation();

  const handleRetainSalesBooking = async (id) => {
    try {
      await retainSaleBooking({ id }).unwrap();
      deletedSaleBookingRefetch();
      toastAlert("Sales Booking retained successfully");
    } catch (error) {
      console.error("Failed to retain sales booking:", error);
      toastAlert("Failed to retain Sales Booking");
    }
  };

  const {
    data: creditApprovalData,
    error: creditApprovalError,
    isLoading: creditApprovalLoading,
  } = useGetAllCreditApprovalsQuery();

  const columns = [
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
      name: "Account name",
      width: 100,
      renderRowCell: (row) => row.account_name,
    },
    {
      key: "campaign_amount",
      name: "Campaign amount/Net Amount",
      width: 100,
      renderRowCell: (row) => row?.campaign_amount,
    },
    {
      key: "base_amount",
      name: "Base amount",
      width: 100,
      renderRowCell: (row) => row?.base_amount,
    },
    {
      key: "gst_amount",
      name: "GST amount",
      width: 100,
      renderRowCell: (row) => row?.gst_amount,
    },
    {
      key: "created_user_name",
      name: "Sales Exicutive Name",
      width: 100,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      width: 100,
    },
    {
      key: "approved_amount",
      name: "Approved amount",
      width: 100,
      renderRowCell: (row) => row?.approved_amount,
    },
    // {
    //   key: "requested_amount",
    //   name: "Requested amount",
    //   width: 100,
    //   renderRowCell: (row) => row?.requested_amount,
    // },
    // {
    //   key: "record_service_amount",
    //   name: "Record service amount",
    //   width: 100,
    //   renderRowCell: (row) => row?.record_service_amount,
    // },
    // {
    //   key: "record_service_counts",
    //   name: "Record service counts",
    //   width: 100,
    //   renderRowCell: (row) => row?.record_service_counts,
    // },
    // {
    //   key: "credit_approval_status",
    //   name: "Credit approval status",
    //   width: 100,
    //   renderRowCell: (row) => formatString(row?.credit_approval_status),
    // },
    // {
    //   key: "reason_credit_approval_1",
    //   name: "Reason credit approval",
    //   width: 100,
    //   renderRowCell: (row) => {
    //     const creditApproval = creditApprovalData?.find(
    //       (creditApproval) => creditApproval.id === row?.reason_credit_approval
    //     );
    //     return creditApproval?.reason_credit_approval;
    //   },
    //   compare: true,
    // },
    // {
    //   key: "reason_credit_approval_own_reason",
    //   name: "Own reason for credit approval",
    //   width: 100,
    //   renderRowCell: (row) =>
    //     formatString(row?.reason_credit_approval_own_reason),
    // },
    // {
    //   key: "balance_payment_ondate",
    //   name: "Balance payment date",
    //   width: 100,
    //   renderRowCell: (row) =>
    //     new Date(row?.balance_payment_ondate).toLocaleDateString(),
    //   compare: true,
    // },
    // {
    //   key: "gst_status_1",
    //   name: "GST status",
    //   width: 100,
    //   compare: true,
    //   renderRowCell: (row) => (row?.gst_status ? "Yes" : "No"),
    //   compare: true,
    // },
    // {
    //   key: "tds_status",
    //   name: "TDS status",
    //   width: 100,
    //   renderRowCell: (row) => row?.tds_status,
    // },
    {
      key: "sale_booking_id",
      name: "Booking ID",
      width: 100,
      // renderRowCell: (row) =>
      //   new Date(row?.Booking_close_date).toLocaleDateString(),
      // compare: true,
    },
    {
      key: "tds_verified_amount",
      name: "TDS verified amount",
      width: 100,
      renderRowCell: (row) => row?.tds_verified_amount,
    },
    {
      key: "record_service_file",
      name: "Record service file",
      width: 100,
      renderRowCell: (row) => row?.record_service_file,
      compare: true,
    },
    {
      key: "booking_remarks",
      name: "Booking remarks",
      width: 100,
      renderRowCell: (row) => row?.booking_remarks,
      compare: true,
    },
    {
      key: "incentive_status_1",
      name: "Incentive",
      width: 100,
      renderRowCell: (row) => {
        return row?.incentive_status == "incentive" ? "Yes" : "No";
      },
      compare: true,
    },
    {
      key: "incentive_earning_status",
      name: "Incentive earning status",
      width: 100,
      renderRowCell: (row) => row?.incentive_earning_status,
    },
    {
      key: "invoice_request_status",
      name: "Invoice status",
      width: 100,
      // renderRowCell: (row) => row?.payment_credit_status,
    },
    {
      key: "incentive_sharing_percent",
      name: "Incentive sharing percent",
      width: 100,
      renderRowCell: (row) => row?.incentive_sharing_percent,
    },
    {
      key: "bad_debt_1",
      name: "Bad debt",
      width: 100,
      renderRowCell: (row) => (row?.bad_debt ? "Yes" : "No"),
      compare: true,
    },
    {
      key: "sale_booking_type",
      name: "Sale booking type",
      width: 100,
      renderRowCell: (row) => row?.sale_booking_type,
    },
    {
      key: "service_taken_amount",
      name: "Service taken amount",
      width: 100,
      renderRowCell: (row) => row?.service_taken_amount,
    },
    {
      key: "incentive_amount",
      name: "Incentive amount",
      width: 100,
      renderRowCell: (row) => row?.incentive_amount,
    },
    {
      key: "earned_incentive_amount",
      name: "Earned incentive amount",
      width: 100,
      renderRowCell: (row) => row?.earned_incentive_amount,
    },
    {
      key: "unearned_incentive_amount",
      name: "Unearned incentive amount",
      width: 100,
      renderRowCell: (row) => row?.unearned_incentive_amount,
    },
    {
      key: "payment_type",
      name: "Payment type",
      width: 100,
      renderRowCell: (row) => row?.payment_type,
    },
    {
      key: "invoice_requested_amount",
      name: "Invoice Amount",
      width: 100,
      // renderRowCell: (row) => row?.final_invoice,
    },
    {
      key: "Sales",
      name: "Sales",
      width: 100,
      renderRowCell: (row) => (
        <button
          className="btn btn-outline-success btn-sm"
          onClick={() => handleRetainSalesBooking(row._id)}
        >
          Retain sale booking
        </button>
      ),
    },
    {
      key: "created_At",
      name: "Booking Date Created",
      width: 100,
      renderRowCell: (row) =>
        ` ${new Date(row.createdAt).toLocaleDateString()} ${new Date(
          row.createdAt
        ).toLocaleTimeString("en-US", { hour12: false })}`,
      compare: true,
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Deleted Sale Booking"
        link="/admin/sales/create-sales-booking"
      />

      <View
        version={1}
        columns={columns}
        data={deletedSaleBookingData}
        isLoading={deletedSaleBookingLoading || creditApprovalLoading}
        pagination
        title={"Deleted Sale Booking Overview"}
        tableName={"Sales Deleted Sale Booking"}
      />
    </div>
  );
};

export default DeletedSaleBooking;
