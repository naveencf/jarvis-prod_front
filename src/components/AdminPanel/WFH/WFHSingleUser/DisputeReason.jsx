import React, { useState } from "react";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { baseUrl } from "../../../../utils/config";

const DisputeReason = ({ data, setIsPreviewModalOpen, handleSubmit }) => {
  const { toastAlert } = useGlobalContext();
  const [disputeReason, setDisputeReason] = useState("");
  const { user_id, attendence_id, month, year } = data;

  const d = new Date();
  const currentDate = DateISOtoNormal(d.toISOString());
  console.log("dispute date", currentDate);
  const handleSubmitDispute = async (e) => {
    e.preventDefault();
    try {
      await axios.put(baseUrl + "update_attendance", {
        attendence_id: attendence_id,
        month: month,
        year: year,
        attendence_status_flow: "Disputed",
        disputed_reason: disputeReason,
        disputed_date: currentDate,
      });
      await axios.post(baseUrl + "add_attendance_dispute", {
        user_id: user_id,
        attendence_id: attendence_id,
        dispute_status: "Disputed",
        dispute_reason: disputeReason,
        dispute_date: currentDate,
      });
      setDisputeReason("");
      setIsPreviewModalOpen(false);
      handleSubmit();
      toastAlert("Dispute Raised Succesfully");
    } catch (error) {
      console.error("Error Raising Dispute", error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmitDispute}>
        <FieldContainer
          label="Dispute Reason"
          required={true}
          value={disputeReason}
          onChange={(e) => setDisputeReason(e.target.value)}
        />
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default DisputeReason;
