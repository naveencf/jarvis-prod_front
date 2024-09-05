import { useEffect, useState } from "react";
import PendingApprovalRefund from "./PendingApprovalRefund";
import RefundRequests from "./RefundRequests";
import FormContainer from "../AdminPanel/FormContainer";

const RefundPayment = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const accordionButtons = ["Pending Approval Refund", "All Refund Request"];

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <div>
      <FormContainer
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        mainTitleRequired={false}
      >
        {activeAccordionIndex === 0 && <PendingApprovalRefund />}
        {activeAccordionIndex === 1 && <RefundRequests />}
      </FormContainer>
    </div>
  );
};

export default RefundPayment;
