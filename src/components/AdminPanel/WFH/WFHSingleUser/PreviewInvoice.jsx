import React, { useEffect, useState } from "react";
import InvoicePdfGenerator from "../Templates/Component/InvoicePdfGenerator";
import DisputeReason from "./DisputeReason";

const PreviewInvoice = ({ data, setIsPreviewModalOpen, handleSubmit }) => {
  const [action, setAction] = useState("noAction");
  const { digital_signature_image_url, ...rest } = data;
  const dataWithoutImage = rest;

  const [InvoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (action === "signDigitally") {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        setInvoiceData(data);
        setIsLoading(false);
      }, 2000);
    } else {
      setInvoiceData(dataWithoutImage);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [action, data, digital_signature_image_url]);

  return (
    <>
      <div>
        <div>
          <input
            type="radio"
            id="signDigitally"
            name="action"
            value="signDigitally"
            checked={action === "signDigitally"}
            onChange={() => setAction("signDigitally")}
          />
          <label htmlFor="signDigitally">Sign Digitally</label>
        </div>

        <div>
          <input
            type="radio"
            id="dispute"
            name="action"
            value="dispute"
            disabled={isLoading ? true : false}
            checked={action === "dispute"}
            onChange={() => setAction("dispute")}
          />
          <label htmlFor="dispute">Dispute</label>
        </div>

        <div>
          <input
            type="radio"
            id="noAction"
            name="action"
            value="noAction"
            disabled={isLoading ? true : false}
            checked={action === "noAction"}
            onChange={() => setAction("noAction")}
          />
          <label htmlFor="noAction">No Action</label>
        </div>

        {isLoading ? (
          <>
            <div>Loading...</div>
            <InvoicePdfGenerator
              data={InvoiceData}
              setIsPreviewModalOpen={setIsPreviewModalOpen}
              handleSubmit={handleSubmit}
            />
          </>
        ) : action !== "dispute" ? (
          <InvoicePdfGenerator
            data={InvoiceData}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
            handleSubmit={handleSubmit}
          >
            {data?.digital_signature_image_url && (
              <button
                className="btn btn-secondary"
                onClick={() => handleGeneratePDF(e, data)}
              >
                Submit
              </button>
            )}
          </InvoicePdfGenerator>
        ) : (
          <DisputeReason
            data={InvoiceData}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
};

export default PreviewInvoice;
