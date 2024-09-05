import React, { useState } from "react";
import SaleBookingClose from "../SaleBooking/Components/SaleBookingClose";
import SaleBookingVerify from "../SaleBooking/Components/SaleBookingVerify";
import FormContainer from "../../../AdminPanel/FormContainer";
import Tab from "../../../Tab/Tab";

const SaleBooking = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const accordionButtons = ["Sale booking close", "Sale Booking Verify"];
  const [buttonaccess, setButtonaccess] = useState(false);
  const [uniquecustomerCount, setUniquecustomerCount] = useState(0);
  const [baseamountTotal, setBaseamountTotal] = useState(0);
  const [opencount, setOpencount] = useState(0);
  const [closecount, setclosecount] = useState(0);
  const [abouttoclosecount, setAbouttoclosecount] = useState(0);
  const [uniquesalesexecutiveCount, setUniquesalesexecutiveCount] = useState(0);
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
        buttonAccess={buttonaccess}
        uniqueCustomerCount={uniquecustomerCount}
        baseAmountTotal={baseamountTotal}
        openCount={opencount}
        closeCount={closecount}
        aboutToCloseCount={abouttoclosecount}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniquesalesexecutiveCount}
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
          setAbouttoclosecount={setAbouttoclosecount}
          setButtonaccess={setButtonaccess}
          setclosecount={setclosecount}
          setOpencount={setOpencount}
          setUniquecustomerCount={setUniquecustomerCount}
          setBaseamountTotal={setBaseamountTotal}
          setUniquesalesexecutiveCount={setUniquesalesexecutiveCount}
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
          setAbouttoclosecount={setAbouttoclosecount}
          setButtonaccess={setButtonaccess}
          setclosecount={setclosecount}
          setOpencount={setOpencount}
          setUniquecustomerCount={setUniquecustomerCount}
          setBaseamountTotal={setBaseamountTotal}
          setUniquesalesexecutiveCount={setUniquesalesexecutiveCount}
        />
      )}
    </div>
  );
};

export default SaleBooking;
