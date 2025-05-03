import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import FieldContainer from "../AdminPanel/FieldContainer";

const DigitalSignature = ({
  userID,
  closeModal,
  offetLetterAcceptanceDate,
  offerLetterStatus,
  gettingData,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClear = () => {
    setFile(null);
  };

  const handleGenerate = async () => {
    if (!file) {
      toastError("Please upload a signature file first.");
      return;
    }

    // Validate file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      toastError("File size should be less than 1MB.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("digital_signature_image", file);

    if (offetLetterAcceptanceDate) {
      formData.append(
        "offer_letter_acceptance_date",
        offetLetterAcceptanceDate
      );
    }
    if (offerLetterStatus) {
      formData.append("offer_later_status", offerLetterStatus);
    }

    try {
      await axios.put(`${baseUrl}update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSubmitting(false);
      toastAlert("Submitted");
      closeModal();
      setFile(null);

      setTimeout(async () => {
        await gettingData();
      }, 3000);
    } catch (error) {
      console.error("Error in PUT API", error);
      setIsSubmitting(false);
      toastAlert("Failed to submit signature.");
    }
  };

  return (
    <>
      <h1>Upload Signature</h1>
      <div className="signBox">
        <FieldContainer
          label=""
          fieldGrid={12}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          required={false}
        />
      </div>

      <div className="signBtn">
        {/* <button
          className="btn onboardBtn btn_primary"
          onClick={handleClear}
          disabled={!file}
        >
          Clear
        </button> */}
        <button
          className="btn onboardBtn btn_secondary"
          onClick={handleGenerate}
        >
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </>
  );
};

export default DigitalSignature;
