import React, { use, useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteSaleBookingMutation,
  useGetAllSaleBookingQuery,
} from "../../../Store/API/Sales/SaleBookingApi";
import View from "../Account/View/View";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import { useGlobalContext } from "../../../../Context/Context";
import Modal from "react-modal";
import ExecutionModal from "./ExecutionModal";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FieldContainer from "../../FieldContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import formatString from "../../../../utils/formatString";
import InvoiceRequest from "./InvoiceRequest";
import getDecodedToken from "../../../../utils/DecodedToken";
import InvoiceDownload from "./InvoiceDownload";
import ExecutionData from "./ExecutionData";
import { useGetExeCampaignsNameWiseDataQuery } from "../../../Store/API/Sales/ExecutionCampaignApi";

const ViewSaleBooking = () => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const filterDate = useLocation().state;

  const { toastAlert, toastError } = useGlobalContext();
  const { userContextData } = useAPIGlobalContext();

  const navigate = useNavigate();
  const {
    data: allExeCampaignList,
    error: allExeCampaignListError,
    isLoading: allExeCampaignListLoading,
  } = useGetExeCampaignsNameWiseDataQuery(loginUserId);
  const {
    data: allSaleBooking,
    refetch: refetchSaleBooking,
    error: allSalebBookingError,
    isLoading: allSaleBookingLoading,
  } = useGetAllSaleBookingQuery(loginUserId);
  const {
    data: allAccount,
    error: allAccountError,
    isLoading: allAccountLoading,
  } = useGetAllAccountQuery(loginUserId);

  const [deleteSaleBooking, { isLoading }] = useDeleteSaleBookingMutation();
  const [executionModal, setExecutionModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [filteredData, setFilteredData] = useState(allSaleBooking);
  const [campaignList, setCampaignList] = useState([]);
  const [filterByCampaignName, setFilterByCampaignName] = useState("");
  const [filterByAccountName, setFilterByAccountName] = useState("");
  const [filterBySalesExecutiveName, setFilterBySalesExecutiveName] =
    useState("");

  const [modalName, setModalName] = useState();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterByIncentive, setFilterByIncentive] = useState("");

  const handleDelete = async (rowId) => {
    try {
      await deleteSaleBooking(rowId).unwrap();
      toastAlert("Booking Deleted Successfully");
    } catch (error) {
      toastError("Error deleting sale booking:", error);
    }
  };

  const openModal = (row, name) => {
    setSelectedRowData(row);
    setExecutionModal(true);
    if (name === "Execution") {
      setModalName(name);
    }
    if (name === "Invoice") {
      setModalName(name);
    }
    if (name === "InvoiceDownload") {
      setModalName(name);
    }
  };

  const closeModal = () => {
    setExecutionModal(false);
  };

  const renderModalComponent = (modalComp) => {
    switch (modalComp) {
      case "Execution":
        return (
          <ExecutionModal
            saleBookingData={selectedRowData}
            closeModal={closeModal}
            refetchSaleBooking={refetchSaleBooking}
          />
        );
      case "Invoice": {
        return (
          <InvoiceRequest
            saleBookingData={selectedRowData}
            closeModal={closeModal}
            refetchSaleBooking={refetchSaleBooking}
          />
        );
      }
      case "InvoiceDownload": {
        return (
          <InvoiceDownload
            taxInvoiceData={selectedRowData}
            closeModal={closeModal}
          />
        );
      }
      case "testModal": {
        return <ExecutionData selectedRowData={selectedRowData} />;
      }
    }
  };

  function handelRemoveFiltter() {
    setFilteredData(allSaleBooking);
    setFilterByCampaignName("");
    setFilterByAccountName("");
    setFilterBySalesExecutiveName("");
    setFilterByIncentive("");
  }

  useEffect(() => {
    if (filterDate != null) {
      setFromDate(filterDate.start.split("T")[0]);
      setToDate(filterDate?.end?.split("T")[0]);
      dataFiltter();
    } else {
      setFilteredData(allSaleBooking);
    }
  }, [filterDate, allSaleBooking, allAccountLoading]);

  function dataFiltter() {
    let filteredData = allSaleBooking?.filter((data) => {
      let matchesCampaignName = true,
        matchesAccountName = true,
        matchesSalesExecutiveName = true,
        matchesBookingDate = true,
        matchesIncentive = true;

      if (filterByCampaignName !== "") {
        matchesCampaignName = data.campaign_name === filterByCampaignName;
      }
      if (filterByAccountName !== "") {
        matchesAccountName = data.account_id === filterByAccountName;
      }
      if (filterBySalesExecutiveName !== "") {
        matchesSalesExecutiveName =
          data.created_by === filterBySalesExecutiveName;
      }
      if (filterByIncentive !== "") {
        matchesIncentive = data.incentive_earning_status == filterByIncentive;
      }
      if (fromDate !== "" && toDate !== "") {
        let saleBookingDate = new Date(data.sale_booking_date);
        let from = new Date(fromDate);
        let to = new Date(toDate);

        matchesBookingDate = saleBookingDate >= from && saleBookingDate <= to;
      }

      return (
        matchesCampaignName &&
        matchesAccountName &&
        matchesSalesExecutiveName &&
        matchesBookingDate &&
        matchesIncentive
      );
    });

    setFilteredData(filteredData);
  }

  useEffect(() => {
    setCampaignList(allExeCampaignList);
  }, [allExeCampaignListLoading]);

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 20,
      showCol: true,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => formatString(row?.campaign_name),
      showCol: true,
      width: 100,
    },
    {
      key: "account_name",
      name: "Account name",
      renderRowCell: (row) => {
        const info = allAccount?.find(
          (account) => account.account_id === row.account_id
        );
        return (
          <Link to={`/sales-account-info/${info?._id}`}>
            {formatString(row?.account_name)}
          </Link>
        );
      },

      showCol: true,
      width: 100,
    },

    {
      key: "sale_booking_id",
      name: "Sale Booking Id",
      width: 50,
    },
    {
      key: "sale_booking_date",
      name: "Booking Date",
      renderRowCell: (row) => DateISOtoNormal(row.sale_booking_date),

      showCol: true,
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount / Net Amount",
      renderRowCell: (row) => row.campaign_amount + "₹",

      showCol: true,
      width: 100,
    },
    {
      key: "record_service_counts",
      name: "Token & Service count",
      renderRowCell: (row) => {
        if (row.record_service_counts)
          return (
            <a
              onClick={() => {
                setModalName("testModal");
                setExecutionModal(row?.is_execution_token_show);
                setSelectedRowData(row);
              }}
            >
              {row?.record_service_counts}
            </a>
          );
        else return 0;
      },
      width: 100,
    },
    {
      key: "base_amount",
      name: "Base Amount",
      renderRowCell: (row) => row.base_amount + "₹",
      showCol: true,
      width: 100,
    },
    {
      key: "invoice_download",
      name: "Invoice Request",
      renderRowCell: (row) =>
        row.gst_amount > 0 ? (
          row?.campaign_amount == row?.invoice_requested_amount &&
          "uploaded" == row?.invoice_request_status ? (
            "Total Invoice Requested Amount Equals to Campaign Amount"
          ) : row.invoice_request_status !== "requested" ? (
            <>
              <div
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => openModal(row, "Invoice")}
              >
                Request for Invoice
              </div>
            </>
          ) : (
            "Invoice Requested"
          )
        ) : (
          "N/A"
        ),
      comapare: true,
      showCol: true,
      width: 100,
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      renderRowCell: (row) => (row.gst_amount ? row.gst_amount : 0) + "₹",
      showCol: true,
      width: 100,
    },
    {
      key: "approved_amount",
      name: "Approved Amount",
      renderRowCell: (row) =>
        row.approved_amount ? row.approved_amount + "₹" : "0₹",
      width: 100,
    },
    {
      key: "Payment Requested",
      name: "Payment Requested",
      renderRowCell: (row) => (
        <div
          style={{
            color: `${row.requested_amount > 0 ? "green" : "red"}`,
          }}
        >
          {row.requested_amount > 0 ? "Requested" : "Not Requested"}
        </div>
      ),
      width: 100,
    },
    {
      key: "requested_amount",
      name: "Requested Amount",
      renderRowCell: (row) =>
        row.requested_amount ? row.requested_amount + "₹" : "0 ₹",
      colorRow: (row) => {
        if (row.requested_amount > 0) {
          return "#c4fac4";
        } else {
          return "#ffff008c";
        }
      },
      width: 100,
    },
    {
      key: "service_taken",
      name: "Outstanding Amount",
      renderRowCell: (row) =>
        row.campaign_amount - row.requested_amount
          ? (row.campaign_amount - row.approved_amount).toFixed(2) + "₹"
          : "0",
      width: 100,
    },
    {
      key: "incentive_status",
      name: "Incentive",
      renderRowCell: (row) =>
        row.incentive_status === "incentive" ? "Yes" : "No",
      showCol: true,
      width: 100,
    },

    {
      key: "createdAt",
      name: "Booking Date Created",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      showCol: true,
      width: 100,
    },
    {
      key: "booking_status",
      name: "Booking Status",
      renderRowCell: (row) =>
        row.booking_status === "Request for Execution" ? (
          <div
            onClick={() => openModal(row, "Execution")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Request for Execution
          </div>
        ) : (
          row.booking_status
        ),
      width: 200,
      showCol: true,
    },
    {
      key: "salesInvoiceRequestData",
      name: "Proforma Invoice",
      width: 100,
      renderRowCell: (row) => {
        const save = row?.salesInvoiceRequestData?.find(
          (obj) => obj?.invoice_type_id == "proforma"
        )?.invoice_file;
        if (save)
          return (
            <div className="flex-row gap-1">
              <a
                className="icon-1"
                target="_blank"
                href={row?.url + "/" + save}
              >
                <i className="bi bi-eye" />
              </a>
              <Link
                target="_blank"
                to={row?.url + "/" + save}
                download={true}
                className="icon-1"
              >
                <i className="bi bi-download" />
              </Link>
            </div>
          );
        else return "N/A";
      },
    },
    {
      key: "TaxInvoice",
      name: "Tax Invoice",
      width: 100,
      renderRowCell: (row) => {
        const save = row?.salesInvoiceRequestData?.filter(
          (obj) =>
            obj?.invoice_type_id == "tax-invoice" &&
            obj?.invoice_creation_status == "uploaded"
        );
        console.log(save, "save");
        if (save?.length == 0) {
          return "N/A";
        } else if (save?.length == 1) {
          return (
            <a
              className="icon-1"
              target="__blank"
              href={row?.url + "/" + save[0]?.invoice_file}
            >
              <i className="bi bi-eye" />
            </a>
          );
        } else {
          return (
            <button
              className="icon-1"
              onClick={() => openModal(row, "InvoiceDownload")}
            >
              {
                save?.filter(
                  (item) => item.invoice_creation_status == "uploaded"
                ).length
              }
            </button>
          );
        }
      },
    },

    {
      key: "sale_booking_id",
      name: "Actions",
      width: 100,
      renderRowCell: (row) => (
        <div className="flex-row">
          <Link
            title="Edit sale booking"
            to={`/admin/create-sales-booking/${row.sale_booking_id}/${row._id}`}
          >
            <div className="icon-1">
              <i class="bi bi-pencil" />
            </div>
          </Link>

          {loginUserRole == 1 && (
            <button
              title="Delete sale booking"
              className="icon-1"
              onClick={() => row._id}
            >
              <i className="bi bi-trash" />
            </button>
          )}

          {row?.campaign_amount >= row?.approved_amount && (
            <button
              title="Payment Update"
              className="icon-1"
              onClick={() => {
                navigate(`/admin/create-payment-update/0`, {
                  state: {
                    sale_id: row.sale_booking_id,
                    userdata: row,
                  },
                });
              }}
            >
              <i className="bi bi-credit-card-2-back" />
            </button>
          )}
        </div>
      ),
      showCol: true,
    },
  ];

  if (loginUserRole == 1) {
    columns.push({
      key: "created_by",
      name: "Sales Executive name",
      renderRowCell: (row) =>
        userContextData?.find((user) => user?.user_id === row?.created_by)
          ?.user_name,
      showCol: true,
      width: 100,
    });
  }

  return (
    <div>
      <Modal
        className="executionModal"
        isOpen={executionModal}
        onRequestClose={closeModal}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",

            maxWidth: "900px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        {renderModalComponent(modalName)}
      </Modal>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Sale Bookings Overview"} link={true} />
        </div>
        <div className="action_btns">
          {loginUserRole == 1 && (
            <Link to={"/admin/view-payment-details"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Payment Details
              </button>
            </Link>
          )}
          {loginUserRole == 1 && (
            <Link to={"/admin/sales-services-overview"}>
              <button className="btn cmnbtn btn-primary btn_sm">
                Services
              </button>
            </Link>
          )}
          <Link to={"/admin/record-servcies"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Record Services
            </button>
          </Link>
          <Link to={"/admin/sales-account-overview"}>
            <button className="btn cmnbtn btn-primary btn_sm">Accounts</button>
          </Link>
          <Link to={"/admin/view-payment-update"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Payment update
            </button>
          </Link>
          <Link to={"/admin/create-sales-booking"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Create Sale Booking
            </button>
          </Link>
        </div>
      </div>

      <div className="card mt24">
        <div className="card-body row">
          <CustomSelect
            label="Campaign Name"
            fieldGrid={4}
            dataArray={campaignList}
            optionId="exe_campaign_name"
            optionLabel="exe_campaign_name"
            selectedId={filterByCampaignName}
            setSelectedId={setFilterByCampaignName}
          />
          <CustomSelect
            label="Account Name"
            fieldGrid={4}
            dataArray={allAccount}
            optionId="account_id"
            optionLabel="account_name"
            selectedId={filterByAccountName}
            setSelectedId={setFilterByAccountName}
          />
          {loginUserRole === 1 && (
            <CustomSelect
              label="Sales Executive Name"
              fieldGrid={4}
              dataArray={userContextData}
              optionId="user_id"
              optionLabel="user_name"
              selectedId={filterBySalesExecutiveName}
              setSelectedId={setFilterBySalesExecutiveName}
            />
          )}

          <CustomSelect
            label="Incentive Status"
            fieldGrid={4}
            dataArray={allSaleBooking?.filter(
              (value, index, self) =>
                index ===
                self?.findIndex(
                  (t) =>
                    t.incentive_earning_status ===
                    value.incentive_earning_status
                )
            )}
            optionId="incentive_earning_status"
            optionLabel="incentive_earning_status"
            selectedId={filterByIncentive}
            setSelectedId={setFilterByIncentive}
          />
          <FieldContainer
            type="date"
            label="From Date"
            fieldGrid={4}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <FieldContainer
            type="date"
            label="To Date"
            fieldGrid={4}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 flexCenter colGap12 pt8 mb-3">
            <button
              className="cmnbtn btn-primary"
              onClick={() => dataFiltter()}
            >
              Search
            </button>
            {allSaleBooking?.length !== filteredData?.length && (
              <button
                className="iconBtn btn btn-outline-danger"
                onClick={() => handelRemoveFiltter()}
              >
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <View
        columns={columns}
        data={filteredData}
        isLoading={allSaleBookingLoading || allAccountLoading}
        title={"Sale Booking"}
        // rowSelectable={true}
        pagination={[100, 200]}
        tableName={"SaleBookingView"}
        // rowSelectable={true}
      />
    </div>
  );
};

export default ViewSaleBooking;
