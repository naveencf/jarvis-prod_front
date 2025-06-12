import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";

const PendingPaymentRequestSales = () => {
  const [pendingPayReqData, setPendingPayReqData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response =
        await axios.get(`${baseUrl}sales/getAll_pending_sales_booking_payment_list

      `);
      setPendingPayReqData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase());
    });
    setPendingPayReqData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Customer name",
      cell: (row) => row.customer_name,
    },
    {
      name: "Sales Executive name",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Booking Date",
      selector: (row) =>
        DateISOtoNormal(row?.sale_booking_data?.sale_booking_date),
    },
    {
      name: "Campaign Amount / Net Amount",
      selector: (row) => row?.sale_booking_data?.campaign_amount + "₹",
    },
    {
      name: "Paid Amount",
      selector: (row) => row?.payment_amount,
    },
    {
      name: "Pending Amount",
      selector: (row) =>
        row?.sale_booking_data?.campaign_amount - row?.payment_amount,
    },
    {
      name: "Finance Approved Amount",
      // selector: (row) => row.gst_amount + "₹",
    },
    {
      name: "Reason Credit Approval",
      // selector: (row) => row.gst_amount + "₹",
    },
    {
      name: "Booking Date Created",
      selector: (row) => DateISOtoNormal(row?.createdAt),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/sales/create-payment-update`}>
            <div className="icon-1" title="Document upload">
              <i className="bi bi-file-earmark-plus"></i>
            </div>
          </Link>
        </>
      ),
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Pending Payment Request"
            link="/admin/sales/create-sales-booking"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Pending Payment Request Overview</div>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={pendingPayReqData}
            pagin
            ation
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default PendingPaymentRequestSales;
