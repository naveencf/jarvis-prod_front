import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import SalesDashboard from "./SalesDashboard";
import PurchaseDashboard from "./PurchaseDashboard";
import Tab from "../../Tab/Tab";
import { useContext } from "react";
import { AppContext } from "../../../Context/Context";
// import DummyCode from "../EmbeddedDummyCode/Dummycode";

export default function FinanceDashboard() {
  const { activeAccordionIndex, setActiveAccordionIndex } =
    useContext(AppContext);
  // const [] = useState(0);
  const accordionButtons = ["Sales Dashboard", "Purchase Dashboard"];

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  // -------------------------------
  return (
    <div>
      <FormContainer
        mainTitle="Finance Dashboard"
        link="/admin/finance-dashboard"
      />

      {/* <DummyCode /> */}

      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />

      {activeAccordionIndex === 0 && <SalesDashboard />}
      {activeAccordionIndex === 1 && <PurchaseDashboard />}
    </div>
  );
}
