import React from 'react'
import View from '../../../../AdminPanel/Sales/Account/View/View'
import { useGetVendorRecentInvoicesDetailQuery } from '../../../../Store/API/Purchase/PurchaseRequestPaymentApi';
import pdfImg from './../../../pdf-file.png';
import { AccordionSummary, Typography, Accordion, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
function RecentInvoices({ rowData, setOpenImageDialog, setViewImgSrc }) {
    const { data: InvoiceDetails, isLoading: invoicesRequestLoading, error, refetch: refetchInvoicesDetail, isFetching: vendorRequestFetching } = useGetVendorRecentInvoicesDetailQuery(rowData?.vendor_obj_id);
    // console.log(InvoiceDetails?.recent_invoices, "data")
    const columns = [
        {
            key: "s_no",
            name: "S.NO",
            // width: 70,
            renderRowCell: (row, index) => index + 1,
        },
        {
            key: "invc_img_url",
            name: "Invoice Image",
            renderRowCell: (row) => {
                if (!row?.invc_img_url) {
                    return "No Image";
                }
                // Extract file extension and check if it's a PDF
                const fileExtension = row?.invc_img_url.split(".").pop().toLowerCase();
                const isPdf = fileExtension === "pdf";

                const imgUrl = row?.invc_img_url;

                return isPdf ? (
                    <img
                        onClick={() => {
                            setOpenImageDialog(true);
                            setViewImgSrc(imgUrl);
                        }}
                        src={pdfImg}
                        style={{ width: "40px", height: "40px" }}
                        title="PDF Preview"
                    />
                ) : (
                    <img
                        onClick={() => {
                            setOpenImageDialog(true);
                            setViewImgSrc(imgUrl);
                        }}
                        src={imgUrl}
                        alt="Invoice"
                        style={{ width: "100px", height: "100px" }}
                    />
                );
            },
            // width: 130,
        },
        {
            key: "request_amount",
            name: "Request Amount",
            // width: 130,
            // renderRowCell: (row) => {
            //     return <div>{row?.zoho_status ? "Uploaded" : "pending"}</div>;
            // },
        },
        {
            key: "paid_amount",
            name: "Paid Amount",
            // width: 130,

        },

        {
            key: "outstandings",
            name: "Remaining Amount",
            // width: 130,

        },
        {
            key: "invc_no",
            name: "Invoice No",
            // width: 130,

        },
        {
            key: "invc_date",
            name: "Invoice Date",
            // width: 130,

        },
        {
            key: "tds_deduction",
            name: "TDS",
            // width: 130,

        },
        {
            key: "tds_percentage",
            name: "TDS %",
            // width: 130,

        },
    ]
    // console.log(InvoiceDetails?.recent_invoices, "InvoiceDetails?.recent_invoices ")
    return (
        <div>
            <Accordion  >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Recent Invoices</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <View
                        columns={columns}
                        data={InvoiceDetails?.recent_invoices || []}
                        isLoading={invoicesRequestLoading}
                        showTotal={true}
                        // title={'Recent Invoices'}
                        rowSelectable={true}
                        pagination={[10, 20, 50, 100]}
                        tableName={'vendor_recent_invoices'}
                    // selectedData={setSelectedRows} // Setter function
                    // tableSelectedRows={selectedRows} // Getter function
                    />

                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default RecentInvoices