import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useNavigate } from "react-router-dom";

const CreditApprovalReasonCreate = () => {
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [dayCount, setDayCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}sales/add_reason_credit_approval`,
        {
          reason: reason,
          day_count: Number(dayCount),
          reason_type: "fixed",
        }
      );
      setReason("");
      setDayCount("");
      navigate("/admin/view-credit-reason-approval");
      toastAlert(response.data.message);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Credit Approval"
        title="Reason Creation"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Reason"
          astric={true}
          fieldGrid={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <FieldContainer
          label="Days"
          astric={true}
          fieldGrid={4}
          type="number"
          value={dayCount}
          onChange={(e) => setDayCount(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default CreditApprovalReasonCreate;
