import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useGlobalContext } from '../../../Context/Context';

function VendorValidation({ InvoiceDetails, selectedBankIndex, setTdsDeductionMandatory, rowData }) {
    //   const { data: InvoiceDetails, isLoading: invoicesRequestLoading, error, refetch: refetchInvoicesDetail, isFetching: vendorRequestFetching } = useGetVendorRecentInvoicesDetailQuery(rowData?.vendor_obj_id);
    // // console.log(InvoiceDetails?.recent_invoices, "data")
    const [TDSPercentage, setTDSPercentage] = useState(1);
    const [isTDSError, setIsTDSError] = useState(false);
    const { toastAlert, toastError } = useGlobalContext();
    // console.log(rowData, "rowData")
    const fetchExtractedDataForTDS = async () => {
        if (!InvoiceDetails || InvoiceDetails.bank_details.length === 0) return 0; // Default

        // const hasGST = vendorDocuments.find(
        //   (doc) => doc.document_name === "GST" && doc.document_no?.trim() !== ""
        // );
        const hasGST = InvoiceDetails.bank_details[selectedBankIndex]?.gst_no?.trim()
        const panCard = InvoiceDetails.bank_details[selectedBankIndex]?.pan_card?.trim()
        // // console.log(panCard, "panCardyou")

        let tdsPercentage = 0; // Default if nothing matches

        if (hasGST && hasGST != "") {
            const seventhChar = hasGST.charAt(6).toUpperCase(); // 7th char
            tdsPercentage = seventhChar === "P" ? 1 : 2;
        } else if (panCard && panCard !== "") {
            const fifthChar = panCard.charAt(4).toUpperCase(); // 5th char
            tdsPercentage = (fifthChar === "F" || fifthChar === "C") ? 2 : 1;
        }

        // // console.log(`TDS Percentage: ${tdsPercentage}`);
        return tdsPercentage;
    };

    function shouldDeductTDS(invoices) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const fyStart = new Date(now.getMonth() >= 3 ? currentYear : currentYear - 1, 3, 1); // April 1
        const fyEnd = new Date(now.getMonth() >= 3 ? currentYear + 1 : currentYear, 2, 31); // March 31

        let totalOutstandingFY = 0;
        let tdsAlreadyDeducted = false;

        for (let invoice of invoices) {
            const invDate = new Date(invoice.invc_date);

            // If any invoice has tds_deduction > 0, set tdsAlreadyDeducted to true
            if (invoice.tds_deduction && invoice.tds_deduction > 0) {
                tdsAlreadyDeducted = true;
            }

            if (invDate >= fyStart && invDate <= fyEnd) {
                totalOutstandingFY += invoice.outstandings || 0;
            }
        }

        return {
            tds: tdsAlreadyDeducted || totalOutstandingFY >= 100000,
            total_outstanding: totalOutstandingFY
        };
    }

    const handleTDSLogic = async () => {

        if (

            // InvoiceDetails &&
            // InvoiceDetails?.recent_invoices &&
            // selectedBankIndex >= 0
            InvoiceDetails &&
            Array.isArray(InvoiceDetails.recent_invoices) &&
            InvoiceDetails.recent_invoices.length > 0 &&
            selectedBankIndex !== null &&
            selectedBankIndex !== undefined &&
            selectedBankIndex >= 0

        ) {
            // // console.log("✅ Passed all checks");
            // // console.log(tds, "tds")
            const invoices = InvoiceDetails.recent_invoices;
            const tempTdsPercent = await fetchExtractedDataForTDS(); // Await here
            const { tds, total_outstanding } = shouldDeductTDS(invoices);
            // // console.log(tds, "tds", tempTdsPercent)
            if (tds) {
                if (tempTdsPercent === 0) {
                    toastError("Vendor Pan Card or GST is not available, in account details, TDS will not be deducted");
                    setIsTDSError(true)
                    // return;
                    setTDSPercentage(1);
                    setTdsDeductionMandatory(true);
                    // console.log(InvoiceDetails.bank_details[selectedBankIndex]?.pan_card, "pan_card")
                } else {
                    setIsTDSError(false)
                    setTDSPercentage(tempTdsPercent);
                }
                // handleTDSDeduction(true);
                // Optionally: setTDSValue((tempTdsPßercent / 100) * total_outstanding);
            }
            // else if (rowData.request_amount == (rowData.outstandings - rowData.tds_deduction) && rowData.request_amount >= 30000) {
            //     if (tempTdsPercent === 0) {
            //         toastError("Vendor Pan Card or GST is not available, in account details, TDS will not be deducted");
            //         // console.log(InvoiceDetails.bank_details[selectedBankIndex]?.pan_card, "pan", selectedBankIndex, InvoiceDetails.bank_details)
            //         setIsTDSError(true)
            //         setTDSPercentage(1);
            //         // return;
            //     } else {
            //         setIsTDSError(false)
            //         setTDSPercentage(tempTdsPercent);
            //     }
            //     // handleTDSDeduction(true);

            // }
        }

    };
    useEffect(() => {
        handleTDSLogic(); // Call the async function

    }, [InvoiceDetails, selectedBankIndex]);
    return (
        <></>
    )
}

export default VendorValidation