import React, { useState } from "react";
import { useParams } from "react-router-dom";
import View from "../../../AdminPanel/Sales/Account/View/View";
import {
  useGetAccountStatementQuery,
  useGetVendorStatementQuery,
} from "../../../Store/API/Sales/PaymentDetailsApi";
import formatString from "../../../../utils/formatString";
import FormContainer from "../../../AdminPanel/FormContainer";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import PaymentTransectionModal from "./PaymentTransectionModal";

const VendorStatementView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Tab1");
  const [modalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const openModal = (row) => {
    setModalOpen(true);
    setRowData(row);
  };
  const closeModal = () => {
    setModalOpen(false);
    setRowData(null);
  };

  const {
    data: vendorInvoiceData = [],
    isLoading,
    isFetching,
  } = useGetVendorStatementQuery(id);
  const {
    data: statementData,
    isLoading: statementLoading,
    isFetching: statemtnFetching,
  } = useGetAccountStatementQuery(id);

  //  Calculate Totals
  const totalInvoiceAmount = vendorInvoiceData.reduce(
    (acc, curr) => acc + (Number(curr.invoice_amount) || 0),
    0
  );
  const transactoinCount = vendorInvoiceData.filter(
    (item) => item.invoice_type_id === "tax-invoice"
  ).length;
  const totalInvoiceApprovedAmount = vendorInvoiceData.reduce(
    (acc, curr) => acc + (Number(curr.invoice_approved_amount) || 0),
    0
  );

  const invoiceCount = vendorInvoiceData?.length;
  const remainingBalance = totalInvoiceAmount - totalInvoiceApprovedAmount;

  let runningBalance =
    vendorInvoiceData?.invoice_approved_amount -
    vendorInvoiceData?.invoice_amount;

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },

    {
      key: "invoice_uploaded_date",
      name: "Invoice Uploaded Date",
      renderRowCell: (row) =>
        new Date(row?.invoice_uploaded_date).toLocaleString().split(",")[0],
      width: 120,
    },
    {
      key: "invoice_type_id",
      name: "Invoice Type",
      width: 120,
      renderRowCell: (row) => row.invoice_type_id,
    },
    {
      key: "invoice_creation_status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => formatString(row.invoice_creation_status),
    },
    {
      key: "invoice_amount",
      name: "Invoice Amount",
      renderRowCell: (row) => (
        <>
          <span
            onClick={(row) => openModal(row)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            {(Number(row.invoice_amount) || 0).toFixed(2)}
          </span>
        </>
      ),
      width: 80,
      getTotal: true,
    },
    {
      key: "invoice_approved_amount",
      name: "Invoice Approved Amount",
      renderRowCell: (row) =>
        (Number(row.invoice_approved_amount) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "balance",
      name: "Balance",
      renderRowCell: (row, index) => {
        if (index === 0)
          runningBalance =
            Number(row.invoice_amount) -
            (Number(row.invoice_approved_amount) || 0);
        else
          runningBalance +=
            (Number(row.invoice_amount) || 0) -
            (Number(row.invoice_approved_amount) || 0);
        return runningBalance.toFixed(2);
      },
      width: 100,
    },
  ];
  const statementColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "invoice_date",
      name: "Invoice Date",
      renderRowCell: (row) =>
        new Date(row?.invoice_date).toLocaleString().split(",")[0],
      width: 120,
    },
    {
      key: "invoice_type_id",
      name: "Invoice Type",
      width: 120,
      renderRowCell: (row) => row.invoice_type_id,
    },
    {
      key: "payment_approval_status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => formatString(row.payment_approval_status),
    },
    {
      key: "invoice_amount",
      name: "Invoice Amount",
      renderRowCell: (row) => (Number(row.invoice_amount) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "payment_amount",
      name: "Payment Amount",
      renderRowCell: (row) => (Number(row.payment_amount) || 0).toFixed(2),
      width: 80,
      getTotal: true,
    },
    {
      key: "balance",
      name: "Balance",
      renderRowCell: (row, index) => {
        if (index === 0)
          runningBalance =
            Number(row.invoice_amount) - (Number(row.payment_amount) || 0);
        else
          runningBalance +=
            (Number(row.invoice_amount) || 0) -
            (Number(row.payment_amount) || 0);
        return runningBalance.toFixed(2);
      },
      width: 100,
    },
  ];

  return (
    <>
      <FormContainer mainTitle={`Vendor Statement`} link={true} />

      <div className="table-responsive noCardHeader">
        <div className="statementDocBody card-body p-3">
          <div className="row">
            <div className="col">
              <div className="card p16 shadow-none border-0 m0 bgPrimaryLight">
                <h6 className="colorMedium">Invoice Amount</h6>
                <h6 className="mt8 fs_16">
                  ₹ {totalInvoiceAmount.toLocaleString()}
                </h6>
              </div>
            </div>
            <div className="col">
              <div className="card p16 shadow-none border-0 m0 bgSecondaryLight">
                <h6 className="colorMedium">Invoice Count:</h6>
                <h6 className="mt8 fs_16">{invoiceCount}</h6>
              </div>
            </div>
            <div className="col">
              <div
                className="card p16 shadow-none border-0 m0"
                style={{ backgroundColor: "lightsteelblue" }}
              >
                <h6 className="colorMedium">Payment Received:</h6>
                <h6 className="mt8 fs_16">
                  ₹ {totalInvoiceApprovedAmount.toLocaleString()}
                </h6>
              </div>
            </div>
            <div className="col">
              <div className="card p16 shadow-none border-0 m0 bgInfoLight">
                <h6 className="colorMedium">Transaction Count</h6>
                <h6 className="mt8 fs_16">{transactoinCount}</h6>
              </div>
            </div>

            <div className="col">
              <div className="card p16 shadow-none border-0 m0 bgDangerLight">
                <h6 className="colorMedium">Balance</h6>
                <h6 className="mt8 fs_16">
                  ₹ {remainingBalance.toLocaleString()}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="ledgerStatementDoc">
          <div className="tabs">
            <button
              className={
                activeTab === "Tab1" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab1")}
            >
              Invoice
            </button>
            <button
              className={
                activeTab === "Tab2" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab2")}
            >
              Statement
            </button>
          </div>
        </div>

        {activeTab === "Tab1" && (
          <View
            title={"Invoice"}
            columns={columns}
            showTotal={true}
            data={vendorInvoiceData}
            isLoading={isLoading || isFetching}
            tableName={"Invoice"}
            pagination={[100, 200, 1000]}
          />
        )}
        {activeTab === "Tab2" && (
          <View
            title={"Statement"}
            columns={statementColumns}
            showTotal={true}
            data={statementData}
            isLoading={statementLoading || statemtnFetching}
            tableName={"StatementUserwise"}
            pagination={[100, 200, 1000]}
          />
        )}

        <Modal
          open={modalOpen}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <PaymentTransectionModal
            id={rowData?.account_id}
            closeModal={closeModal}
          />
        </Modal>
      </div>
    </>
  );
};

export default VendorStatementView;
