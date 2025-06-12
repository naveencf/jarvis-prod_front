import React, { useState } from "react";
import formatString from "../../../utils/formatString";
import { X } from "@phosphor-icons/react";

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

  const [currentPage, setCurrentPage] = useState(1); // 1: Invoice, 2: Proof of Work

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
        <div className="relative bg-white text-[#1a1f3d]">
          {currentPage === 1 && (
            <>
              {/* --- Invoice Page --- */}
              <div className="flexCenterBetween mb-4">
                <h2 className="fw_600 m-0">INVOICE</h2>
                {/* Close Button */}
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

              <div className="">
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
                {/* Close Button */}
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

          {/* Page Navigation */}
          <div className="flexCenterBetween border-top mt32 pt12 ">
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
    </>
  );
};

export default VendorInvoiceModal;
