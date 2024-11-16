import React, { useState } from "react";
import SaleBookingClose from "../SaleBooking/Components/SaleBookingClose";
import SaleBookingVerify from "../SaleBooking/Components/SaleBookingVerify";
import FormContainer from "../../../AdminPanel/FormContainer";
import Tab from "../../../Tab/Tab";

const SaleBooking = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const accordionButtons = ["Sale booking close", "Sale Booking Verify"];
  const [buttonAccess, setButtonAccess] = useState(false);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [baseAmountTotal, setBaseAmountTotal] = useState(0);
  const [openCount, setOpenCount] = useState(0);
  const [closeCount, setCloseCount] = useState(0);
  const [aboutToCloseCount, setAboutToCloseCount] = useState(0);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] = useState(0);
  const [handleOpenUniqueCustomerClick, setHandleOpenUniqueCustomerClick] =
    useState(() => () => {});
  const [handleOpenUniqueSalesExecutive, setHandleOpenUniqueSalesExecutive] =
    React.useState(() => () => {});

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <div>
      <FormContainer
        submitButton={false}
        link={true}
        mainTitle={"Sale Booking"}
        buttonAccess={buttonAccess}
        uniqueCustomerCount={uniqueCustomerCount}
        baseAmountTotal={baseAmountTotal}
        openCount={openCount}
        closeCount={closeCount}
        aboutToCloseCount={aboutToCloseCount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        saleBookingClosePaymentAdditionalTitles={true}
      />

      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />

      {activeAccordionIndex === 0 && (
        <SaleBookingClose
          onHandleOpenUniqueSalesExecutiveChange={
            setHandleOpenUniqueSalesExecutive
          }
          onHandleOpenUniqueCustomerClickChange={
            setHandleOpenUniqueCustomerClick
          }
          setAboutToCloseCount={setAboutToCloseCount}
          setButtonAccess={setButtonAccess}
          setCloseCount={setCloseCount}
          setOpenCount={setOpenCount}
          setUniqueCustomerCount={setUniqueCustomerCount}
          setBaseAmountTotal={setBaseAmountTotal}
          setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
        />
      )}
      {activeAccordionIndex === 1 && (
        <SaleBookingVerify
          onHandleOpenUniqueSalesExecutiveChange={
            setHandleOpenUniqueSalesExecutive
          }
          onHandleOpenUniqueCustomerClickChange={
            setHandleOpenUniqueCustomerClick
          }
          setAboutToCloseCount={setAboutToCloseCount}
          setButtonAccess={setButtonAccess}
          setCloseCount={setCloseCount}
          setOpenCount={setOpenCount}
          setUniqueCustomerCount={setUniqueCustomerCount}
          setBaseAmountTotal={setBaseAmountTotal}
          setUniqueSalesExecutiveCount={setUniqueSalesExecutiveCount}
        />
      )}
    </div>
  );
};

export default SaleBooking;
