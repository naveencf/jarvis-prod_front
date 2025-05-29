import { useEffect, useState } from "react";
import View from "../../AdminPanel/Sales/Account/View/View";
import formatString from "../../../utils/formatString";
import {
  useGetAuditedAndPendingLinkStatsByVendorsMutation,
  useGetLinksOnConditionQuery,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import StringLengthLimiter from "../../../utils/StringLengthLimiter";
import { Button } from "@mui/joy";
import { useGlobalContext } from "../../../Context/Context";
import { Spinner } from "react-bootstrap";

const PendingAuditOutstandingTotal = () => {
  const params = useParams();
  const pageName = params["*"]?.replace(/^\/|\/$/g, "");
  const audit_status = pageName?.split("-")[0];
  const [fetchAuditedAndPendingStats, { data, isLoading, error }] =
    useGetAuditedAndPendingLinkStatsByVendorsMutation();
  const auditAndPendingRecord = data?.records;
  const [auditStatus, setAuditStatus] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [showPendingLinks, setShowPendingLinks] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();

  const shouldFetch = auditStatus || vendorId;

  const {
    data: pendingLinksData,
    error: pendingLinksError,
    isLoading: pendingLinksLoading,
    isFetching: pendingLinksFetching,
  } = useGetLinksOnConditionQuery(
    shouldFetch ? { audit_status: auditStatus, vendorId } : skipToken
  );

  console.log("pendingLinksData", pendingLinksData);
  console.log("selectedData", selectedRows);
  useEffect(() => {
    fetchAuditedAndPendingStats({
      page: 1,
      limit: 10,
      audit_status: audit_status,
    });
  }, [fetchAuditedAndPendingStats]);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spinner />
      </div>
    );

  if (error) return <div>Error occurred: {error.message}</div>;
  const handleRowClick = (row) => {
    setVendorId(row.vendorId);
    setAuditStatus(audit_status);
    setShowPendingLinks(true);
  };
  console.log("pendingLinksData", pendingLinksData);
  const dataGridColumns = [
    {
      key: "sno",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "vendorName",
      name: "Vendor Name",
      renderRowCell: (row) => formatString(row.vendorName),
    },
    ...(audit_status === "audited"
      ? [
        {
          key: "auditedCount",
          name: "Audited Count",
          renderRowCell: (row) => (
            <button
              onClick={() => handleRowClick(row)}
              style={{
                color: "blue",
                textDecoration: "underline",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {row.auditedCount}
            </button>
          ),
        },
      ]
      : []),

    ...(audit_status === "pending"
      ? [
        {
          key: "pendingCount",
          name: "Pending Count",
          renderRowCell: (row) => (
            <button
              onClick={() => handleRowClick(row)}
              style={{
                color: "blue",
                textDecoration: "underline",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {row.pendingCount}
            </button>
          ),
        },
      ]
      : []),
    ...(audit_status === "audited"
      ? [
        {
          key: "auditedAmount",
          name: "Audited Amount (₹)",
          renderRowCell: (row) => Math.floor(row.auditedAmount),
        },
      ]
      : []),

    ...(audit_status === "pending"
      ? [
        {
          key: "pendingAmount",
          name: "Pending Amount (₹)",
          renderRowCell: (row) => Math.floor(row.pendingAmount),
        },
      ]
      : []),
  ];
  const columns = [
    {
      key: "sno",
      name: "S.NO",
      width: 60,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "vendor_name",
      name: "Vendor",
      width: 150,
      renderRowCell: (row) => formatString(row.vendor_name || "—"),
    },
    {
      key: "platform_name",
      name: "Platform",
      width: 100,
      renderRowCell: (row) => formatString(row.platform_name || "—"),
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      width: 200,
      renderRowCell: (row) => formatString(row.campaign_name || "—"),
    },
    {
      key: "postType",
      name: "Post Type",
      width: 100,
      renderRowCell: (row) => formatString(row.postType || "—"),
    },
    {
      key: "postedOn",
      name: "Posted On",
      width: 140,
      renderRowCell: (row) =>
        row.postedOn ? new Date(row.postedOn).toLocaleDateString() : "—",
    },
    {
      key: "like_count",
      name: "Likes",
      width: 80,
      renderRowCell: (row) => row.like_count ?? 0,
    },
    {
      key: "shortCode",
      name: "Short Code",
      width: 80,
    },
    {
      key: "comment_count",
      name: "Comments",
      width: 90,
      renderRowCell: (row) => row.comment_count ?? 0,
    },
    {
      key: "play_count",
      name: "Plays",
      width: 90,
      renderRowCell: (row) => row.play_count ?? 0,
    },
    {
      key: "amount",
      name: "Amount (₹)",
      width: 100,
      renderRowCell: (row) => (row.amount ? `₹${row.amount}` : "—"),
    },
    {
      key: "audit_status",
      name: "Audit Status",
      width: 110,
      renderRowCell: (row) => formatString(row.audit_status || "—"),
    },
    {
      key: "owner_info",
      name: "Page Name",
      width: 200,
      renderRowCell: (row) => {
        const owner = row.owner_info;
        return owner ? (
          <div>
            <span>{formatString(owner.username)}</span>
          </div>
        ) : (
          "—"
        );
      },
    },
    {
      key: "ref_link",
      name: "Link",
      width: 150,
      renderRowCell: (row) =>
        row.ref_link ? (
          <a
            href={row.ref_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {row.ref_link.split("?")[0]}
          </a>
        ) : (
          "—"
        ),
    },
  ];

  const handleLinkCopy = () => {
    if (!selectedRows || selectedRows.length === 0) {
      toastError("Please Select the Links");
      return;
    }
    const links = selectedRows
      .map((item) => item.ref_link)
      .filter((link) => !!link) // remove null/undefined/empty
      .join("\n"); // separate each link with a newline

    navigator.clipboard
      .writeText(links)
      .then(() => {
        toastAlert("Post links copied to clipboard!");
        setSelectedRows([]);
      })
      .catch((err) => {
        console.error("Failed to copy links: ", err);
      });
  };

  return (
    <div>
      <View
        version={1}
        columns={showPendingLinks ? columns : dataGridColumns}
        data={
          showPendingLinks
            ? pendingLinksData?.data?.records
            : auditAndPendingRecord
        }
        isLoading={pendingLinksLoading || pendingLinksFetching}
        title="Pending Audit Outstanding Total"
        rowSelectable={true}
        pagination={[100, 200, 1000]}
        tableName="Pending Audit Outstanding Total"
        selectedData={setSelectedRows}
        showExport={true}
        tableSelectedRows={selectedRows}
        addHtml={
          <>
            {showPendingLinks ? (
              <div>
                <Button onClick={handleLinkCopy}>Copy Links </Button>
                <Button
                  onClick={() => setShowPendingLinks(false)}
                  style={{ marginLeft: "1rem" }}
                >
                  Show Pending Audit
                </Button>
              </div>
            ) : (
              ""
            )}
          </>
        }
      />
    </div>
  );
};

export default PendingAuditOutstandingTotal;
