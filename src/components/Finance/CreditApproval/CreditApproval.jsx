import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";
import DataTable from "react-data-table-component";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import Modal from "react-modal";
import getDecodedToken from "../../../utils/DecodedToken";
import FormContainer from "../../AdminPanel/FormContainer";

const CreditApproval = () => {
  const token = getDecodedToken();
  const loginUserId = token.id;
  const { toastAlert, toastError } = useGlobalContext();
  const [saleBookingData, setSaleBookingData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("Pending");
  const [extendLimit, setExtendLimit] = useState(false);
  const [modalData, setModalData] = useState("");

  const getData = async () => {
    setSaleBookingData([]);
    setOriginalData([]);
    try {
      let endpointParams = "";
      switch (currentTab) {
        case "Pending":
          endpointParams = "pending";
          break;
        case "Approved":
          endpointParams = "approved";
          break;
        case "Rejected":
          endpointParams = "rejected";
          break;
        default:
          endpointParams = "pending";
          break;
      }

      if (endpointParams !== "") {
        const response = await axios.get(
          `${baseUrl}sales/credit_approval_status_for_sales_booking_list?status=${endpointParams}`
        );
        setSaleBookingData(response.data.data);
        setOriginalData(response.data.data);
      }
    } catch (error) {
      toastError("Error fetching credit approval reasons:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [currentTab]);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return (
        d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        d?.created_by_name?.toLowerCase()?.includes(search?.toLowerCase())
      );
    });
    setSaleBookingData(result);
  }, [search]);

  const handlePermission = async (SalesId, action) => {
    try {
      const requestBody = {
        status: action,
      };

      if (action === "approved") {
        requestBody.approved_by = loginUserId;
      }

      const response = await axios.put(
        `${baseUrl}sales/credit_approval_status_status_change/${SalesId}`,
        requestBody
      );
      toastAlert("Approved");
      getData();
    } catch (error) {
      toastError(error.message);
    }
  };

  const openExtendLimitModal = () => {
    setExtendLimit(true);
  };

  const closeExtenLmit = () => {
    setExtendLimit(false);
  };

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Requested By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Customer name",
      selector: (row) => row.customer_name,
    },
    {
      name: "Booking Date",
      selector: (row) => DateISOtoNormal(row.createdAt),
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.paid_amount,
    },
    {
      name: "Credit Approval Amount",
      selector: (row) => row.campaign_amount - row.paid_amount,
    },
    {
      name: "Credit Approval Reason",
      selector: (row) => row.reason_credit_approval_name,
    },
    currentTab == "Pending" && {
      name: "Increase Credit Limit",
      cell: (row) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={() => {
            openExtendLimitModal(), setModalData(row);
          }}
        >
          Increase Limit
        </button>
      ),
    },
    currentTab == "Pending" && {
      name: "Actions",
      cell: (row) => (
        <div className="gap16">
          <button
            className="btn cmnbtn btn_sm btn-outline-success"
            onClick={() => handlePermission(row.sale_booking_id, "approved")}
          >
            Approve
          </button>

          <button
            className="btn cmnbtn btn_sm btn-outline-danger"
            onClick={() => handlePermission(row.sale_booking_id, "rejected")}
          >
            Reject
          </button>
        </div>
      ),
      width: "200px",
    },
  ];
  return (
    <>
      <Modal
        className="extendLimit"
        isOpen={extendLimit}
        onRequestClose={closeExtenLmit}
        contentLabel="Extend Limit Modal"
        appElement={document.getElementById("root")}
        shouldCloseOnOverlayClick={true}
      ></Modal>

      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            link={true}
            mainTitle="Credit Approval"
            buttonAccess={false}
            submitButton={false}
          />
        </div>
      </div>

      <div className="tab">
        <div
          className={`named-tab ${currentTab === "Pending" && "active-tab"}`}
          onClick={() => setCurrentTab("Pending")}
        >
          Pending
        </div>
        <div
          className={`named-tab ${currentTab === "Approved" && "active-tab"}`}
          onClick={() => setCurrentTab("Approved")}
        >
          Approved
        </div>
        <div
          className={`named-tab ${currentTab === "Rejected" && "active-tab"}`}
          onClick={() => setCurrentTab("Rejected")}
        >
          Rejected
        </div>
      </div>
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">{currentTab} Payment Request</div>
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
            data={saleBookingData}
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </>
  );
};

export default CreditApproval;
