import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useNavigate, useParams } from "react-router-dom";

const CreditApprovalReasonUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [dayCount, setDayCount] = useState("");

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}sales/get_reason_credit_approval/${id}`
        );
        setReason(response.data.data.reason);
        setDayCount(response.data.data.day_count.toString());
      } catch (error) {
        console.error("Error fetching edit data:", error);
      }
    };

    fetchEditData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}sales/update_reason_credit_approval/${id}`,
        {
          reason: reason,
          day_count: Number(dayCount),
          reason_type: "fixed",
        }
      );
      setReason("");
      setDayCount("");
      toastAlert(response.data.message);
      navigate("/admin/view-credit-reason-approval");
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

export default CreditApprovalReasonUpdate;
