import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const CommonPDFDownload = ({ selectedRows }) => {
  const [loading, setLoading] = useState(false);

  const downloadAndMerge = async () => {
    if (!selectedRows.length) {
      alert("Please select invoices first");
      return;
    }

    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const row of selectedRows) {
        const fileUrl = row.invoice_file_url;
        if (!fileUrl) continue;

        try {
          const response = await axios.post(
            `${baseUrl}v1/download_image`,
            { imageUrl: fileUrl },
            { responseType: "blob" }
          );

          const blob = response.data;
          const fileType = blob.type;
          const arrayBuffer = await blob.arrayBuffer();

          if (fileType === "application/pdf") {
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(
              pdf,
              pdf.getPageIndices()
            );
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } else if (fileType.startsWith("image/")) {
            const image =
              fileType === "image/jpeg"
                ? await mergedPdf.embedJpg(arrayBuffer)
                : await mergedPdf.embedPng(arrayBuffer);

            const page = mergedPdf.addPage([595, 842]); // A4 size
            const { width, height } = image.scaleToFit(500, 700);

            page.drawImage(image, {
              x: (595 - width) / 2,
              y: (842 - height) / 2,
              width,
              height,
            });
          } else {
            console.warn(`Unsupported file type: ${fileType}`);
          }
        } catch (err) {
          console.error(`Error processing file: ${fileUrl}`, err);
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Merged_Invoices.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Merging failed:", error);
      alert("Something went wrong while merging the invoices.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Button
        onClick={downloadAndMerge}
        variant="contained"
        color="primary"
        size="small"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {loading ? "Merging..." : "Download Merged PDF"}
      </Button>
    </div>
  );
};

export default CommonPDFDownload;
