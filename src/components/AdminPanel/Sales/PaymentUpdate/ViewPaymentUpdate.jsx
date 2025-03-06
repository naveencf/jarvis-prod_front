import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import { useGetAllPaymentUpdatesQuery } from "../../../Store/API/Sales/PaymentUpdateApi";
import { set } from "date-fns";
import View from "../Account/View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import getDecodedToken from "../../../../utils/DecodedToken";
import Tab from "../../../Tab/Tab";
import Modal from "react-modal";
import formatString from "../../../../utils/formatString";

const ViewPaymentUpdate = () => {
  const { userContextData, contextData } = useAPIGlobalContext();

  const [paymentUpdateData, setPaymentUpdateData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [activeData, setActiveData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [activeURL, setActiveURL] = useState("");

  const tabName = ["All", "Pending", "Approved", "Rejected"];

  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }
  const {
    data: allAccountData,
    isError: accountError,
    isLoading: accountLoading,
  } = useGetAllAccountQuery();

  const {
    data: AllpaymentUpdateData,
    error: paymentUpdateError,
    isLoading: paymentUpdateLoading,
  } = useGetAllPaymentUpdatesQuery(loginUserId);

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  const onTabClick = (index) => {
    setActiveTab(index);
  };
  useEffect(() => {
    if (activeTab === 0) {
      setActiveData(AllpaymentUpdateData);
    } else if (activeTab === 1) {
      const result = AllpaymentUpdateData?.filter((d) => {
        return d?.payment_approval_status == "pending";
      });
      setActiveData(result);
    } else if (activeTab === 2) {
      const result = AllpaymentUpdateData?.filter((d) => {
        return d?.payment_approval_status == "approval";
      });
      setActiveData(result);
    } else if (activeTab === 3) {
      const result = AllpaymentUpdateData?.filter((d) => {
        return d?.payment_approval_status == "reject";
      });
      setActiveData(result);
    }
  }, [activeTab, AllpaymentUpdateData]);

  // const getData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}sales/getlist_sales_booking_payment`
  //     );
  //     setPaymentUpdateData(response.data.data);
  //     setOriginalData(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching credit approval reasons:", error);
  //   }
  // };
  useEffect(() => {
    // getData();
    setPaymentUpdateData(AllpaymentUpdateData);
    setOriginalData(AllpaymentUpdateData);
  }, [AllpaymentUpdateData]);

  useEffect(() => {
    const result = originalData?.filter((d) => {
      return d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase());
    });
    setPaymentUpdateData(result);
  }, [search]);
  const columns = [
    {
      key: "serial.no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "account_name",
      name: "Customer Name",
      renderRowCell: (row) => (
        <Link
          to={`/sales-account-info/${allAccountData?.find((data) => data?.account_id === row?.account_id)
              ?._id
            }`}
        >
          {row.account_name}
        </Link>
      ),
      width: 100,
    },
    {
      key: "payment_date",
      name: "Payment Date",
      renderRowCell: (row) => row?.payment_date?.split("-").reverse().join("-"),
      width: 100,
      comapre: true,
    },
    {
      key: "created_by_name",
      name: "Sales Executive Name",
      width: 100,
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      renderRowCell: (row) => row.payment_amount,
      width: 100,
    },
    {
      key: "payment_mode_name",
      name: "Payment Mode",
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount",
      width: 100,
    },
    {
      key: "screenshot",
      name: "Payment View",
      renderRowCell: (row) =>
        row?.payment_screenshot_url ? (
          <button
            onClick={() => {
              setImageModalOpen(true);
              setActiveURL(row?.payment_screenshot_url);
            }}
            className="icon-1"
          >
            <i className="bi bi-fullscreen"></i>
          </button>
        ) : (
          "N/A"
        ),
      width: 100,
    },
    {
      key: "payment_detail_title",
      name: "Bank Name",
      renderRowCell: (row) => row.payment_detail?.title,
      width: 100,
      compare: true,
    },
    {
      key: "payment_detail_detail",
      name: "Bank Details",
      renderRowCell: (row) => row?.payment_detail?.detail,
      width: 100,
      compare: true,
    },
    {
      key: "payment_approval_status",
      name: "Status",
      renderRowCell: (row) => formatString(row.payment_approval_status),
      width: 100,
    },
    {
      key: "payment_ref_no",
      name: "Refrence Number",
      renderRowCell: (row) => row.payment_ref_no,
      width: 100,
    },
    {
      key: "createdAt",
      name: "Payment Request Date",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      compare: true,
      width: 100,
    },
    {
      key: "updatedAt",
      name: "Payment Update Date",
      renderRowCell: (row) =>
        row.payment_approval_status !== "pending"
          ? DateISOtoNormal(row.updatedAt)
          : "N/A",
      width: 100,
      compare: true,
    },
    {
      name: "Action",
      renderRowCell: (row) => (
        <>
          {row.payment_approval_status == "approval" ? (
            ""
          ) : row.payment_approval_status == "reject" ? (
            <button className="icon-1" title="Resend">
              <i className="bi bi-arrow-return-left"></i>
            </button>
          ) : (
            <Link to={`/admin/create-payment-update/${row._id}`}>
              <div className="icon-1">
                <i className="bi bi-pencil"></i>
              </div>
            </Link>
          )}
        </>
      ),
      width: 100,
    },
  ];

  return (
    <div>
      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "60%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <img src={activeURL} alt="" />
      </Modal>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Payment Update"
            link="/admin/create-payment-update/0"
            buttonAccess={false}
            submitButton={false}
          />
        </div>
      </div>
      <Tab
        tabName={tabName}
        activeTabindex={activeTab}
        onTabClick={onTabClick}
      />
      <View
        version={1}
        title={"Payment Update Overview"}
        columns={columns}
        data={activeData}
        pagination
        isLoading={paymentUpdateLoading}
        tableName={"PaymentUpdateOverview"}
      />
    </div>
  );
};

export default ViewPaymentUpdate;
