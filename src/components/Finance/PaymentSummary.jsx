import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import { useGlobalContext } from "../../Context/Context";
import DataTable from "react-data-table-component";

const PaymentSummary = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function getData() {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("cust_id", id);

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-customer_purchase_finance_approval",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setData(res.data.body);
        setFilterData(res.data.body);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "ID",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
      sortable: false,
    },
    {
      name: "Sales Booking Date",
      selector: (row) => row.sale_booking_date,
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Total Paid Amount",
      selector: (row) => row.payment_amount_show,
    },
    {
      name: "Reason",
      selector: (row) => row.action_reason,
    },
    {
      name: "Credit Approval Reason",
      selector: (row) => row.reason_credit_approval,
    },
    {
      name: "Balance Payment Ondate",
      selector: (row) => row.balance_payment_ondate,
    },
    {
      name: "Status",
      // selector: (row) => row.payment_approval_status,
      cell: (row) => (
        <div>
          {row.payment_approval_status === "1" ? (
            <span className="badge bg-success">Approved</span>
          ) : row.payment_approval_status === "2" ? (
            <span className="badge bg-danger">Rejected</span>
          ) : (
            <span className="badge bg-warning">Pending</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Payment Summary"
        link="/admin/finance/finance-paymentmode"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Customer Purchase History Finance Approval"
            columns={columns}
            data={filterData}
            fixedHeader
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default PaymentSummary;
