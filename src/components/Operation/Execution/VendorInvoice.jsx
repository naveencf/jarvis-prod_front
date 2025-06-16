import React, { useRef, useState } from "react";
import formatString from "../../../utils/formatString";
import { X } from "@phosphor-icons/react";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

const VendorInvoiceModal = ({
  selectedData = [],
  vendorDetails = {},
  vendorBankDetails = {},
  onClose = () => {},
}) => {
  const invoiceDate = new Date().toLocaleDateString("en-GB");
  const bank = vendorBankDetails?.[0] || {};
  const totalQty = selectedData.length;
  const grandTotal = selectedData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const unitPrice = totalQty > 0 ? Math.round(grandTotal / totalQty) : 0;
  const modalRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1); // 1: Invoice, 2: Proof of Work
  const handleDownloadPdf = async () => {
    // const element = modalRef.current;
    // // Force render to finish if using state
    // await new Promise((resolve) => setTimeout(resolve, 300)); // wait for DOM updates
    // const opt = {
    //   margin: 0.5,
    //   filename: "invoice.pdf",
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2, useCORS: true },
    //   jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    // };
    // html2pdf()
    //   .set(opt)
    //   .from(element)
    //   .save()
    //   .outputPdf("blob")
      // .then((pdfBlob) => uploadPDF(pdfBlob));
  };

  const downloadInvoiceAsImage = ({ selectedData, vendorDetails, vendorBankDetails }) => {
    const bank = vendorBankDetails?.[0] || {};
    const totalQty = selectedData.length;
    const grandTotal = selectedData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const unitPrice = totalQty > 0 ? Math.round(grandTotal / totalQty) : 0;
  
    const slipElement = document.createElement("div");
    slipElement.style.width = "800px";
    slipElement.style.padding = "40px";
    slipElement.style.backgroundColor = "#ffffff";
    slipElement.style.color = "#000";
    slipElement.style.position = "absolute";
    slipElement.style.zIndex = "9999";
    slipElement.style.top = "0";
    slipElement.style.left = "0";
    slipElement.style.fontFamily = "Arial, sans-serif";
    slipElement.style.border = "1px solid #ccc";
  
  slipElement.innerHTML = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto; color: #000;">
    <h2 style="text-align: center;">INVOICE</h2>

    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
      <div>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
        <p><strong>PAN No.:</strong> GHCPM9207E</p>
        <p><strong>Bill No.:</strong> 01</p>
      </div>
      <div style="text-align: right;">
        <p><strong>${vendorDetails.vendor_name || "Creativefuel"}</strong></p>
        <p>${vendorDetails?.home_address || "Indore"}</p>
        <p>Email - ${vendorDetails?.email || "creativefuel@.io"}</p>
        <p>Contact - ${vendorDetails?.mobile || "8103222555"}</p>
      </div>
    </div>

    <hr style="margin: 16px 0;" />

    <div style="font-size: 14px; margin-bottom: 16px;">
      <p><strong>BUYER :</strong></p>
      <p>CREATIVEFUEL PRIVATE LIMITED</p>
      <p>105, Gravity Mall, Vijay Nagar</p>
      <p>Indore Madhya Pradesh 452010, India</p>
      <p>GSTIN - 23AAJCC1807B1ZC</p>
    </div>

    <p><strong>Nature of business :</strong> Payment of advertising agency to carry out the work of advertisement.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;" border="1">
      <thead style="background-color: #f0f0f0;">
        <tr>
          <th style="padding: 8px;">S. NO.</th>
          <th style="padding: 8px;">DESCRIPTION OF SERVICES</th>
          <th style="padding: 8px;">QTY</th>
          <th style="padding: 8px;">PRICE</th>
          <th style="padding: 8px;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 8px;">1</td>
          <td style="padding: 8px;">Meme Marketing</td>
          <td style="padding: 8px; text-align: center;">${totalQty}</td>
          <td style="padding: 8px; text-align: right;">${unitPrice}</td>
          <td style="padding: 8px; text-align: right;">${grandTotal}</td>
        </tr>
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
      <div>
        <p><strong>Amount in words :</strong></p>
        <p>₹ ${grandTotal} (in figures)</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 8px 16px;">
        <strong>GRAND TOTAL : ₹ ${grandTotal}</strong>
      </div>
    </div>

    <div style="font-size: 14px;">
      <p><strong>Account holder name:</strong> ${bank.account_holder_name || "N/A"}</p>
      <p><strong>Bank name:</strong> ${bank.bank_name || "N/A"}</p>
      <p><strong>Account number:</strong> ${bank.account_number || "N/A"}</p>
      <p><strong>IFSC CODE:</strong> ${bank.ifsc || "N/A"}</p>
      <p><strong>UPI ID:</strong> ${bank.upi_id || "N/A"}</p>
    </div>
  </div>
`;

    document.body.appendChild(slipElement);
  
    setTimeout(() => {
      html2canvas(slipElement, {
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
      }).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${vendorDetails.vendor_name || "Invoice"}.png`;
        link.click();
  
        document.body.removeChild(slipElement);
      }).catch((err) => {
        console.error("Error generating image:", err);
        document.body.removeChild(slipElement);
      });
    }, 200);
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
        <div
          className="relative bg-white text-[#1a1f3d] p-6 w-full max-w-4xl"
          ref={modalRef}
        >
          {currentPage === 1 && (
            <>
              {/* --- Invoice Page --- */}
              <div className="flexCenterBetween mb-4">
                <h2 className="fw_600 m-0">INVOICE</h2>
                <button
                  className="icon text-gray-600 hover:text-black text-xl"
                  onClick={onClose}
                >
                  <X />
                </button>
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  <p>
                    <strong>Date:</strong> {invoiceDate}
                  </p>
                  <p>
                    <strong>PAN No.:</strong> GHCPM9207E
                  </p>
                  <p>
                    <strong>Bill No.:</strong> 01
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatString(vendorDetails?.vendor_name) || "Vendor"}
                  </p>
                  <p>
                    {formatString(vendorDetails?.home_address) ||
                      "Address not provided"}
                  </p>
                  <p>Email - {vendorDetails?.email || "N/A"}</p>
                  <p>Contact - {vendorDetails?.mobile || "N/A"}</p>
                </div>
              </div>

              <hr />

              <div className="mb-6 text-sm">
                <p className="font-semibold">BUYER :</p>
                <p>CREATIVEFUEL PRIVATE LIMITED</p>
                <p>105, Gravity Mall, Vijay Nagar</p>
                <p>Indore Madhya Pradesh 452010, India</p>
                <p>GSTIN - 23AAJCC1807B1ZC</p>
              </div>

              <hr />

              <div>
                <p className="text-sm pb-3">
                  <strong>Nature of business :</strong> Payment of advertising
                  agency to carry out the work of advertisement.
                </p>
              </div>

              <table className="w-100 border border-gray-300 border-collapse mb-3 text-sm">
                <thead className="bg-light-primary">
                  <tr>
                    <th className="border px-4 py-2 text-left">S. NO.</th>
                    <th className="border px-4 py-2 text-left">
                      DESCRIPTION OF SERVICES
                    </th>
                    <th className="border px-4 py-2 text-center">QTY</th>
                    <th className="border px-4 py-2 text-right">PRICE</th>
                    <th className="border px-4 py-2 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">1</td>
                    <td className="border px-4 py-2">Meme Marketing</td>
                    <td className="border px-4 py-2 text-center">{totalQty}</td>
                    <td className="border px-4 py-2 text-right">
                      {unitPrice.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      {grandTotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="d-flex justify-content-between mb-5 text-sm">
                <div>
                  <p>
                    <strong>Amount in words :</strong>
                  </p>
                  <p>₹ {grandTotal.toLocaleString()} (in figures)</p>
                </div>
                <div className="bg-light-primary h-100 p-2">
                  GRAND TOTAL : ₹ {grandTotal.toLocaleString()}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Account holder name:</strong>{" "}
                  {bank.account_holder_name || "N/A"}
                </p>
                <p>
                  <strong>Bank name:</strong> {bank.bank_name || "N/A"}
                </p>
                <p>
                  <strong>Account number:</strong>{" "}
                  {bank.account_number || "N/A"}
                </p>
                <p>
                  <strong>IFSC CODE:</strong> {bank.ifsc || "N/A"}
                </p>
                <p>
                  <strong>UPI ID:</strong> {bank.upi_id || "N/A"}
                </p>
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              {/* --- Proof of Work Page --- */}
              <div className="flexCenterBetween mb-4">
                <h2 className="fw_600 m-0">Proof of Work</h2>
                <button
                  className="icon text-gray-600 hover:text-black text-xl"
                  onClick={onClose}
                >
                  <X />
                </button>
              </div>

              <table className="w-100 text-sm border-collapse mb-6">
                <thead className="bg-light-primary">
                  <tr>
                    <th className="py-2 px-3 text-left w-16">S. NO.</th>
                    <th className="py-2 px-3 text-left">PROOF OF WORK</th>
                    <th className="py-2 px-3 text-right w-32">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="py-2 px-3">{index + 1}</td>
                      <td className="py-2 px-3 text-blue-600 underline break-all">
                        <a
                          href={item.ref_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.ref_link}
                        </a>
                      </td>
                      <td className="py-2 px-3 text-right">
                        ₹ {item.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr />

              <div className="d-flex justify-content-between mb-5 text-sm">
                <div>
                  <p>
                    <strong>Amount in words :</strong>
                  </p>
                  <p>₹ {grandTotal.toLocaleString()} (in figures)</p>
                </div>
                <div className="bg-gray-200 px-6 py-2 font-semibold whitespace-nowrap">
                  GRAND TOTAL : ₹ {grandTotal.toLocaleString()}
                </div>
              </div>
            </>
          )}
<button onClick={() => downloadInvoiceAsImage({ selectedData, vendorDetails, vendorBankDetails })}>
  Download Invoice Image
</button>

          {/* Page Navigation */}
          <div className="flexCenterBetween border-top mt-6 pt-3">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-4 py-1 rounded bg-gray-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
            >
              ← Invoice
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              disabled={currentPage === 2}
              className={`px-4 py-1 rounded bg-gray-200 ${
                currentPage === 2
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300"
              }`}
            >
              Proof of Work →
            </button>
          </div>
        </div>
      </div>

      {/* Floating Download Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Download & Upload PDF
        </button>
      </div>
    </>
  );
};

export default VendorInvoiceModal;
