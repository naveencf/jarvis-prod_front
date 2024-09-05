import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";

const RejectedPaymentRequest = () => {
  const [rejectedPaymentData, setRejectedPaymentData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getAll_rejected_sales_booking_payment_list`
      );
      setRejectedPaymentData(response.data.data);
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
    setRejectedPaymentData(result);
  }, [search]);


  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Sale Booking Id",
      selector: (row) => row.sale_booking_id,
    },
    {
      name: "Request By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Customer Details",
      cell: (row) =>
        `${row.customer_name} | ${row.payment_date
          .split("-")
          .reverse()
          .join("-")} |`,
    },
    {
      name: "Payment on date",
      selector: (row) => row?.payment_date.split("-").reverse().join("-"),
    },
    {
      name: "Payment Amount",
      selector: (row) => row?.payment_amount,
    },

    {
      name: "Payment Mode",
      selector: (row) => row?.payment_mode_name,
    },

    {
      name: "Paid View (ss)",
    },
    {
      name: "Bank Name",
      selector: (row) => row?.Payment_Deatils?.title,
    },
    {
      name: "Refrence number",
      selector: (row) => row?.payment_ref_no,
    },
    {
      name: "Remarks",
      selector: (row) => row?.remarks,
    },
    {
      name: "Status",
      selector: (row) => row?.remarks,
    },
    {
      name: "Rejected Date and Time",
      selector: (row) => row?.updatedAt,
    },
  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Rejected Payment Request"
            link="/admin/create-sales-booking"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Rejected Payment Request Overview</div>
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
            data={rejectedPaymentData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default RejectedPaymentRequest;
