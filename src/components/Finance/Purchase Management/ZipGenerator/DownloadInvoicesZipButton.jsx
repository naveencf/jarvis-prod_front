import React from 'react'

import JSZip from "jszip";
import { saveAs } from "file-saver";

const DownloadInvoicesZipButton = ({ invoiceUrls }) => {
    const handleDownloadZip = async () => {
        const zip = new JSZip();
        const folder = zip.folder("invoices");

        // Download and add each invoice file to the zip
        await Promise.all(
            invoiceUrls.map(async (url, index) => {
                const filename = url.split("/").pop() || `invoice_${index + 1}.pdf`;
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    folder.file(filename, blob);
                } catch (error) {
                    console.error("Failed to fetch file:", url, error);
                }
            })
        );

        // Generate and download zip
        zip.generateAsync({ type: "blob" }).then((zipBlob) => {
            saveAs(zipBlob, "invoices.zip");
        });
    };

    return (
        <button onClick={handleDownloadZip} className="px-4 py-2 bg-blue-600 text-white rounded">
            Download Invoices ZIP
        </button>
    );
};

export default DownloadInvoicesZipButton;
