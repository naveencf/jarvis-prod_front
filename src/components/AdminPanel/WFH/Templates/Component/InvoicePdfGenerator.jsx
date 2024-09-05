import React, { useRef, useState } from "react";
import { generatePDF } from "../Utils/genratePDF";
import { useGlobalContext } from "../../../../../Context/Context";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import InvoiceTemplate1 from "./InvoiceTemplate1";
import InvoiceTemplate2 from "./InvoiceTemplate2";
import InvoiceTemplate3 from "./InvoiceTemplate3";
import InvoiceTemplate4 from "./InvoiceTemplate4";
import InvoiceTemplate5 from "./InvoiceTemplate5";
import InvoiceTemplate6 from "./InvoiceTemplate6";
import InvoiceTemplate7 from "./InvoiceTemplate7";
import InvoiceTemplate8 from "./InvoiceTemplate8";
import InvoiceTemplate9 from "./InvoiceTemplate9";

const templates = {
  1: InvoiceTemplate1,
  2: InvoiceTemplate2,
  3: InvoiceTemplate3,
  4: InvoiceTemplate4,
  5: InvoiceTemplate5,
  6: InvoiceTemplate6,
  7: InvoiceTemplate7,
  8: InvoiceTemplate8,
  9: InvoiceTemplate9,
};

const InvoicePdfGenerator = ({ data, setIsPreviewModalOpen, handleSubmit }) => {
  const { toastAlert } = useGlobalContext();
  const invoiceRef = useRef();
  const [isUpdatingSalary, setIsUpdatingSalary] = useState(false);

  const TemplateComponent = templates[data?.invoice_template_no] || null;

  const handleGeneratePDF = async (e, data) => {
    await generatePDF(data, invoiceRef);
    e.preventDefault();

    setIsUpdatingSalary(true);

    try {
      await axios.put(`${baseUrl}` + `update_attendance`, {
        attendence_id: data.attendence_id,
        month: data.month,
        year: data.year,
        attendence_status_flow: "Invoice Submit Pending For Verifcation",
      });

      await axios.post(`${baseUrl}` + `add_finance`, {
        attendence_id: data?.attendence_id,
      });

      await axios.put(`${baseUrl}` + `update_salary`, {
        attendence_id: data?.attendence_id,
        sendToFinance: 1,
      });

      setIsPreviewModalOpen && setIsPreviewModalOpen(false);
      handleSubmit && handleSubmit();
      toastAlert("Sent To Finance");
    } catch (error) {
      console.error("Error updating salary:", error);
    } finally {
      setIsUpdatingSalary(false);
    }
  };

  return (
    <div>
      {TemplateComponent ? (
        <div ref={invoiceRef}>
          <TemplateComponent data={data} />
        </div>
      ) : (
        <p>No template available</p>
      )}
      {data?.digital_signature_image_url && (
        <button
          className="btn btn-secondary"
          onClick={(e) => handleGeneratePDF(e, data)}
          disabled={isUpdatingSalary}
        >
          {isUpdatingSalary ? "Signing..." : "Sign"}
        </button>
      )}
    </div>
  );
};

export default InvoicePdfGenerator;
