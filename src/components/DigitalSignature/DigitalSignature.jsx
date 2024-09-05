import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";

const DigitalSignature = ({
  userID,
  closeModal,
  offetLetterAcceptanceDate,
  offerLetterStatus,
  gettingData,
}) => {
  const { toastAlert } = useGlobalContext();
  const [signature, setSignature] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClear = () => {
    signature.clear();
  };

  const handleGenerate = async () => {
    setIsSubmitting(true);
    const canvas = signature.getTrimmedCanvas();
    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("user_id", userID);

        // Get current date and time in ISO format
        const currentDateTime = new Date().toISOString();

        // Create a file name with the current date and time
        const fileName = `digital_signature_${currentDateTime}.png`;

        // Create a File object from the blob with the new file name
        const file = new File([blob], fileName, {
          type: "image/png",
        });

        formData.append("digital_signature_image", file);

        {
          offetLetterAcceptanceDate &&
            formData.append(
              "offer_later_acceptance_date",
              offetLetterAcceptanceDate
            );
        }
        {
          offerLetterStatus &&
            formData.append("offer_later_status", offerLetterStatus);
        }

        try {
          await axios.put(`${baseUrl}` + `update_user`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setIsSubmitting(false);
          closeModal();
          toastAlert("Submitted");
          signature.clear();

          //3 sec delay because API takes time to save image in GCP bucket || so we wait for 3 sec to call get api
          setTimeout(async () => {
            await gettingData();
          }, 3000);
        } catch (error) {
          console.error("Error in PUT API", error);
        }
      }
    }, "image/png");
  };

  return (
    <>
      <h1>Digital Signature</h1>
      <div className="signBox">
        <SignatureCanvas
          ref={(data) => setSignature(data)}
          canvasProps={{ className: "sigCanvas" }}
        />
      </div>
      <div className="signBtn">
        <button className="btn onboardBtn btn_primary" onClick={handleClear}>
          Clear
        </button>
        <button
          className="btn onboardBtn btn_secondary"
          onClick={handleGenerate}
        >
          {isSubmitting ? "Submitting...." : "Save"}
        </button>
      </div>
    </>
  );
};

export default DigitalSignature;
