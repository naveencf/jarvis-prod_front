import { useState } from "react";
import FormContainer from "../FormContainer";
import Pending from "./Pending";
import Assigned from "./Assigned";
import Accepted from "./Accepted";
import Review from "./Review";
import Complected from "./Complected";
import { useMemo } from "react";

export default function CampignAdmin() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const tab1 = useMemo(() => <Pending />, []);
  const tab2 = <Accepted />;
  const tab3 = <Review />;
  const tab4 = <Complected />;
  const tab5 = <Assigned />;

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = [
    "Pending",
    "Accepted",
    "Review",
    "Completed",
    "Assigned",
  ];
  return (
    <div>

      <FormContainer
        submitButton={false}
        mainTitle="Campaign Admin"
        title="Campaign Admin"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        link={true}
      >

      </FormContainer>
      <div className="tab">
        {
          accordionButtons.map((button, index) => (
            <div className={`named-tab ${activeAccordionIndex === index ? "active-tab" : ""}`} onClick={() => handleAccordionButtonClick(index)}>
              {button}
            </div>
          ))
        }
      </div>
      <div className="card">
        <div className="card-body fx-head nt-head">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
          {activeAccordionIndex === 2 && tab3}
          {activeAccordionIndex === 3 && tab4}
          {activeAccordionIndex === 4 && tab5}
        </div>
      </div>
    </div>
  );
}
