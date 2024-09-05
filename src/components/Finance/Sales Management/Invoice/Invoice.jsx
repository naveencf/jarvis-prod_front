import React, { useState } from "react";
import PendingInvoice from "./PendingInvoice/PendingInvoice";
import InvoiceCreated from "./InvoiceCreated/InvoiceCreated";
import Tab from "../../../Tab/Tab";
import { useContext } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { AppContext } from "../../../../Context/Context";

export default function Invoice() {
  const { activeAccordionIndex, setActiveAccordionIndex } =
    useContext(AppContext);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [buttonaccess, setButtonaccess] = useState(false);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] = useState(0);
  const [baseAmountTotal, setBaseAmountTotal] = useState(0);
  const [campaignAmountTotal, setCampaignAmountTotal] = useState(0);

  const [handleOpenUniqueCustomerClick, setHandleOpenUniqueCustomerClick] =
    useState(() => () => {});
  const [handleOpenUniqueSalesExecutive, setHandleOpenUniqueSalesExecutive] =
    React.useState(() => () => {});
  const accordionButtons = ["Pending Invoice", "Invoice Created"];

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  // -------------------------------
  return (
    <div>
      <FormContainer
        mainTitle="Invoice"
        link="admin/finance-invoice"
        buttonAccess={buttonaccess}
        uniqueCustomerCount={uniqueCustomerCount}
        baseAmountTotal={baseAmountTotal}
        campaignAmountTotal={campaignAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        accIndex={activeAccordionIndex}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        pendingInvoicePaymentAdditionalTitles={true}
      />

      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />

      {activeAccordionIndex === 0 && (
        <PendingInvoice
          setUniqueCustomerCount={setUniqueCustomerCount}
          setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
          setBaseAmountTotal={setBaseAmountTotal}
          setCampaignAmountTotal={setCampaignAmountTotal}
          setButtonaccess={setButtonaccess}
          onHandleOpenUniqueSalesExecutiveChange={
            setHandleOpenUniqueSalesExecutive
          }
          onHandleOpenUniqueCustomerClickChange={
            setHandleOpenUniqueCustomerClick
          }
        />
      )}
      {activeAccordionIndex === 1 && (
        <InvoiceCreated
          setUniqueCustomerCount={setUniqueCustomerCount}
          setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
          setBaseAmountTotal={setBaseAmountTotal}
          setCampaignAmountTotal={setCampaignAmountTotal}
          setButtonaccess={setButtonaccess}
          onHandleOpenUniqueSalesExecutiveChange={
            setHandleOpenUniqueSalesExecutive
          }
          onHandleOpenUniqueCustomerClickChange={
            setHandleOpenUniqueCustomerClick
          }
        />
      )}
    </div>
  );
}
