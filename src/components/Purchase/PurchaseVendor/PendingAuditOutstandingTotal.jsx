import React, { useEffect } from "react";
import View from "../../AdminPanel/Sales/Account/View/View";
import formatString from "../../../utils/formatString";
import { useGetAuditedAndPendingLinkStatsByVendorsMutation } from "../../Store/API/Purchase/DirectPurchaseApi";
import { useParams } from "react-router-dom";

const PendingAuditOutstandingTotal = () => {
    const params = useParams()
    const pageName = params["*"]?.replace(/^\/|\/$/g, "");
    const audit_status = pageName?.split("-")[0];
    const [fetchAuditedAndPendingStats, { data, isLoading, error }] = useGetAuditedAndPendingLinkStatsByVendorsMutation();
    console.log("audit_status", audit_status);
    const auditAndPendingRecord = data?.records

    useEffect(() => {
        fetchAuditedAndPendingStats({
            page: 1, limit: 10, audit_status: audit_status
        });
    }, [fetchAuditedAndPendingStats]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error occurred: {error.message}</div>;

    const dataGridColumns = [
        {
            key: "sno",
            name: "S.NO",
            width: 80,
            renderRowCell: (row, index) => index + 1,
        },
        {
            key: "vendorName",
            name: "Vendor Name",
            width: 200,
            renderRowCell: (row) => formatString(row.vendorName),
        },
        {
            key: "auditedCount",
            name: "Audited Count",
            width: 150,
            renderRowCell: (row) => row.auditedCount,
        },
        {
            key: "pendingCount",
            name: "Pending Count",
            width: 150,
            renderRowCell: (row) => row.pendingCount,
        },
        {
            key: "auditedAmount",
            name: "Audited Amount (₹)",
            width: 180,
            renderRowCell: (row) => Math.floor(row.auditedAmount),
        },
        {
            key: "pendingAmount",
            name: "Pending Amount (₹)",
            width: 180,
            renderRowCell: (row) => Math.floor(row.pendingAmount),
        }
    ];

    return (
        <div >
            <View
                version={1}
                columns={dataGridColumns}
                data={auditAndPendingRecord}
                isLoading={false}
                title="Pending Audit Outstanding Total"
                rowSelectable={true}
                pagination={[100, 200, 1000]}
                tableName="Pending Audit Outstanding Total"
            />

        </div>
    );
};

export default PendingAuditOutstandingTotal;
