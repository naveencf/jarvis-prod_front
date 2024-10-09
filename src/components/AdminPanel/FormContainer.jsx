import { Link, useLocation } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import titleimg from "../../../public/bg-img.png";
import FormattedNumberWithTooltip from "../Finance/FormateNumWithTooltip/FormattedNumberWithTooltip";

const FormContainer = ({
  mainTitle,
  title,
  uniqueVendorCount,
  totalPendingAmount,
  pendingRequestCount,
  uniqueCustomerCount,
  discardCount,
  discardedRequestCount,
  paidRequestCount,
  totalRequestAmount,
  handleOpenUniqueVendorClick,
  uniqueCustomerInvoiceCount,
  uniqueSalesExecutiveInvoiceCount,
  nonInvcbalanceAmountTotal,
  handleOpenUniqueSalesExecutive,
  totalBalanceAmount,
  link,
  uniqueNonInvoiceCustomerCount,
  uniqueNonInvoiceSalesExecutiveCount,
  balanceAmountPartial,
  balanceAmountInstant,
  tdsDeductedCount,
  tdsDeductionCount,
  partialTDSDeduction,
  instantTDSDeduction,
  // openCount,
  // closeCount,
  // aboutToCloseCount,
  buttonAccess,
  newbutton,
  newbuttonRouting,
  newbuttonName,
  children,
  handleSubmit,
  withInvoiceCount,
  withoutInvoiceCount,
  handleOpenUniqueCustomerClick,
  submitButton = true,
  activeAccordionIndex,
  addNewButtonName,
  accordionButtons = [],
  accIndex,
  onAccordionButtonClick,
  refundAmountTotal,
  balanceAmountTotal,
  requestedAmountTotal,
  pendingCount,
  approvedCount,
  rejectedCount,
  baseAmountTotal,
  campaignAmountTotal,
  nonGstCount,
  invoiceCount,
  nonInvoiceCount,
  totalBaseAmount,
  uniqueVendorPartialCount,
  uniqueVendorsInstantCount,
  pendingAmountPartial,
  pendingAmountInstant,
  pendingInstantcount,
  pendingPartialcount,
  nonGstPartialCount,
  nonGstInstantCount,
  withInvcPartialImage,
  withInvcInstantImage,
  withoutInvcPartialImage,
  incentiveReleasedAmtTotal,
  withoutInvcInstantImage,
  uniqueSalesExecutiveCount,
  pendingApprovalAdditionalTitles = false,
  includeAdditionalTitles = false,
  paymentDoneAdditionalTitles = false,
  gstHoldAdditionalTitles = false,
  tdsDeductionAdditionalTitles = false,
  allTransactionAdditionalTitles = false,
  discardAdditionalTitles = false,
  dashboardAdditionalTitles = false,
  refundReqAdditionalTitles = false,
  saleBookingClosePaymentAdditionalTitles = false,
  invoiceCreatedPaymentAdditionalTitles = false,
  pendingApprovalRefundAdditionalTitles = false,
  balancePaymentAdditionalTitles = false,
  incentivePaymentAdditionalTitles = false,
  saleBookingVerifyPaymentAdditionalTitles = false,
  pendingInvoicePaymentAdditionalTitles = false,
  gstNongstIncentiveReport = false,
  loading = false,
  pendingpaymentRemainder = 0,
  mainTitleRequired = true,
  Titleheadercomponent,
  TitleHeaderComponentDisplay = "none",
}) => {
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <div>
      {mainTitleRequired && (
        <div className="form-heading">
          <img className="img-bg" src={titleimg} alt="" width={160} />
          <div
            className="form
          _heading_title "
          >
            <h2>{mainTitle}</h2>
            {/* <div className="pack">
              <i className="bi bi-house"></i>{" "}
              {activeLink.slice(1).charAt(0).toUpperCase() +
                activeLink.slice(2)}
            </div> */}
          </div>
          {includeAdditionalTitles && accIndex === 0 ? (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              {/* <h2>
                Pending Request Amount : <a href="#"> {totalPendingAmount}</a>
              </h2> */}
              <h2>
                Pending Request Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalPendingAmount} />
                </a>
              </h2>

              <h2>
                Balance Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalBalanceAmount} />
                </a>
              </h2>
              <h2>
                Pending Request : <a href="#"> {pendingRequestCount}</a>
              </h2>
              <h2>
                Non GST : <a href="#"> {nonGstCount}</a>
              </h2>
              <h2>
                With Invoice Count : <a href="#"> {invoiceCount}</a>
              </h2>
              <h2>
                Without Invoice Count : <a href="#"> {nonInvoiceCount}</a>
              </h2>
              <h2>
                TDS Deducted Count : <a href="#"> {tdsDeductedCount?.length}</a>
              </h2>
              {/* <h2>
                Reminder : <a href="#">{pendingpaymentRemainder}</a>
              </h2> */}
            </div>
          ) : includeAdditionalTitles && accIndex === 1 ? (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorPartialCount?.size}</a>
              </h2>
              <h2>
                Pending Request Amount :{" "}
                <a href="#">
                  {/* {pendingAmountPartial} */}
                  <FormattedNumberWithTooltip value={pendingAmountPartial} />
                </a>
              </h2>
              <h2>
                Balance Amount :{" "}
                <a href="#">
                  {/* {balanceAmountPartial} */}
                  <FormattedNumberWithTooltip value={balanceAmountPartial} />
                </a>
              </h2>
              <h2>
                Pending Request : <a href="#"> {pendingPartialcount}</a>
              </h2>
              <h2>
                Non GST : <a href="#"> {nonGstPartialCount?.length}</a>
              </h2>
              <h2>
                With Invoice Count :{" "}
                <a href="#"> {withInvcPartialImage?.length}</a>
              </h2>
              <h2>
                Without Invoice Count :{" "}
                <a href="#"> {withoutInvcPartialImage?.length}</a>
              </h2>
              <h2>
                TDS Deducted Count :{" "}
                <a href="#"> {partialTDSDeduction?.length}</a>
              </h2>
              {/* <h2>
                Reminder : <a href="#">{pendingpaymentRemainder}</a>
              </h2> */}
            </div>
          ) : includeAdditionalTitles && accIndex === 2 ? (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor :{" "}
                <a href="#">{uniqueVendorsInstantCount?.size}</a>
              </h2>
              <h2>
                Pending Request Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={pendingAmountInstant} />
                  {/* {pendingAmountInstant} */}
                </a>
              </h2>
              <h2>
                Balance Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={balanceAmountInstant} />
                  {/* {balanceAmountInstant} */}
                </a>
              </h2>
              <h2>
                Pending Request : <a href="#"> {pendingInstantcount}</a>
              </h2>
              <h2>
                Non GST : <a href="#"> {nonGstInstantCount?.length}</a>
              </h2>
              <h2>
                With Invoice Count :{" "}
                <a href="#"> {withInvcInstantImage?.length}</a>
              </h2>
              <h2>
                Without Invoice Count :{" "}
                <a href="#"> {withoutInvcInstantImage?.length}</a>
              </h2>
              <h2>
                TDS Deducted Count :{" "}
                <a href="#"> {instantTDSDeduction?.length}</a>
              </h2>
              {/* <h2>
                Reminder : <a href="#">{pendingpaymentRemainder}</a>
              </h2> */}
            </div>
          ) : (
            ""
          )}
          {paymentDoneAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Payment Done Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                  {/* {totalRequestAmount} */}
                </a>
              </h2>
              <h2>
                Payment Done : <a href="#"> {pendingRequestCount}</a>
              </h2>
              <h2>
                With Invoice Count : <a href="#"> {withInvoiceCount}</a>
              </h2>
              <h2>
                Without Invoice Count : <a href="#"> {withoutInvoiceCount}</a>
              </h2>
              <h2>
                TDS Deducted Count :{" "}
                <a href="#"> {tdsDeductionCount?.length}</a>
              </h2>
            </div>
          )}
          {gstHoldAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Payment Done Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                  {/* {totalRequestAmount} */}
                </a>
              </h2>
              <h2>
                Payment Done : <a href="#"> {pendingRequestCount}</a>
              </h2>
            </div>
          )}
          {tdsDeductionAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Payment Done Amount :{" "}
                <a href="#">
                  {/* {totalRequestAmount} */}
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                </a>
              </h2>
              <h2>
                Payment Done : <a href="#"> {pendingRequestCount}</a>
              </h2>
            </div>
          )}
          {allTransactionAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Requested Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                  {/* {totalRequestAmount} */}
                </a>
              </h2>
              <h2>
                Pending Request Count : <a href="#"> {pendingRequestCount}</a>
              </h2>
              <h2>
                Paid Count : <a href="#"> {paidRequestCount}</a>
              </h2>
              <h2>
                Discard Count : <a href="#"> {discardedRequestCount}</a>
              </h2>
            </div>
          )}
          {discardAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueVendorClick}>
                Unique Vendor : <a href="#">{uniqueVendorCount}</a>
              </h2>
              <h2>
                Requested Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                  {/* {totalRequestAmount} */}
                </a>
              </h2>
              <h2>
                Discard Count : <a href="#"> {discardCount}</a>
              </h2>
            </div>
          )}
          {pendingApprovalAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Accounts : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Payment Amount :{" "}
                <a href="#">
                  {/* {totalRequestAmount} */}
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                </a>
              </h2>
              <h2>
                Pending count : <a href="#"> {pendingCount}</a>
              </h2>
              <h2>
                Non GST : <a href="#"> {nonGstCount}</a>
              </h2>
              <h2>
                With Invoice Count : <a href="#"> {invoiceCount}</a>
              </h2>
              <h2>
                Without Invoice Count : <a href="#"> {nonInvoiceCount}</a>
              </h2>
              {/* <h2>
                Approved Count : <a href="#"> {approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2> */}
            </div>
          )}
          {dashboardAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Payment Amount :{" "}
                <a href="#">
                  {/* {totalRequestAmount} */}
                  <FormattedNumberWithTooltip value={totalRequestAmount} />
                </a>
              </h2>
              <h2>
                Pending Count : <a href="#">{pendingCount}</a>
              </h2>
              <h2>
                Approved Count : <a href="#">{approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2>
            </div>
          )}
          {pendingApprovalRefundAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Refund Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={refundAmountTotal} />
                  {/* {refundAmountTotal} */}
                </a>
              </h2>
            </div>
          )}
          {refundReqAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Refund Amount :{" "}
                <a href="#">
                  {/* {refundAmountTotal} */}
                  <FormattedNumberWithTooltip value={refundAmountTotal} />
                </a>
              </h2>
              <h2>
                Approved Count : <a href="#">{approvedCount}</a>
              </h2>
              <h2>
                Rejected Count : <a href="#">{rejectedCount}</a>
              </h2>
            </div>
          )}
          {balancePaymentAdditionalTitles && accIndex === 0 ? (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Accounts : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Balance Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={balanceAmountTotal} />
                </a>
              </h2>
            </div>
          ) : (
            balancePaymentAdditionalTitles && (
              <div className="additional-titles ">
                <h2 onClick={handleOpenUniqueCustomerClick}>
                  Unique Accounts :{" "}
                  <a href="#">{uniqueNonInvoiceCustomerCount}</a>
                </h2>
                <h2 onClick={handleOpenUniqueSalesExecutive}>
                  Unique Sales Executive :{" "}
                  <a href="#">{uniqueNonInvoiceSalesExecutiveCount}</a>
                </h2>
                <h2>
                  Balance Amount :{" "}
                  <a href="#">
                    <FormattedNumberWithTooltip
                      value={nonInvcbalanceAmountTotal}
                    />
                  </a>
                </h2>
              </div>
            )
          )}
          {incentivePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Requested Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={requestedAmountTotal} />
                  {/* {requestedAmountTotal} */}
                </a>
              </h2>
              <h2>
                Released Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip
                    value={incentiveReleasedAmtTotal}
                  />
                  {/* {requestedAmountTotal} */}
                </a>
              </h2>
            </div>
          )}
          {pendingInvoicePaymentAdditionalTitles && (
            // && accIndex === 0 ? (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Accounts : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount :{" "}
                <a href="#">
                  <FormattedNumberWithTooltip value={baseAmountTotal} />
                </a>
              </h2>
            </div>
          )}
          {/* {invoiceCreatedPaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Campaign Amount :{" "}
                <a href="#">
                
                  <FormattedNumberWithTooltip value={campaignAmountTotal} />
                </a>
              </h2>
            </div>
          )} */}
          {saleBookingClosePaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Accounts : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount :{" "}
                <a href="#">
                  {/* {baseAmountTotal} */}
                  <FormattedNumberWithTooltip value={baseAmountTotal} />
                </a>
              </h2>
              {/* <h2>
                Open Count : <a href="#">{openCount}</a>
              </h2>
              <h2>
                Close Count : <a href="#">{closeCount}</a>
              </h2> */}
              {/* <h2>
                About To Close Amount : <a href="#">{aboutToCloseCount}</a>
              </h2> */}
            </div>
          )}
          {saleBookingVerifyPaymentAdditionalTitles && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customers : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2>
                Base Amount : <a href="#">{/* {baseAmountTotal} */}m</a>
              </h2>
            </div>
          )}
          {gstNongstIncentiveReport && (
            <div className="additional-titles ">
              <h2 onClick={handleOpenUniqueCustomerClick}>
                Unique Customer : <a href="#">{uniqueCustomerCount}</a>
              </h2>
              <h2 onClick={handleOpenUniqueSalesExecutive}>
                Unique Sales Executive :{" "}
                <a href="#">{uniqueSalesExecutiveCount}</a>
              </h2>
              <h2>
                Base Amount : <a href="#">{totalBaseAmount}</a>
              </h2>
            </div>
          )}
          {link && buttonAccess && (
            <div className="form_heading_action d-flex ">
              <Link to={link}>
                <button
                  title={"Add New " + mainTitle}
                  className={`btn cmnbtn btn_sm btn-primary ${
                    addNewButtonName && "text_button"
                  }`}
                >
                  {/* {addNewButtonName ? addNewButtonName : <FaUserPlus />} */}
                  {addNewButtonName ? addNewButtonName : "Add"}
                </button>
              </Link>
              {link && newbutton && (
                <Link to={newbuttonRouting}>
                  <button
                    title={"Add " + mainTitle}
                    className={`btn cmnbtn btn_sm btn-success ${
                      newbuttonName && "text_button"
                    }`}
                  >
                    {/* {newbuttonName ? newbuttonName : <FaUserPlus />} */}
                    {newbuttonName ? newbuttonName : "Add"}
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {!link && (
        <div className="card shadow mb24">
          <div className="card-header d-flex flex-row align-items-center justify-content-between">
            {accordionButtons.length === 0 && (
              <div className="card_header_title tabbtn_header">
                <h2>{title}</h2>
              </div>
            )}
            <div
              className="input-component"
              style={{
                display: `${TitleHeaderComponentDisplay}`,
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: "10px",
              }}
            >
              {Titleheadercomponent}
            </div>
            <div
              className="btn-group w-100"
              style={{
                display: `${
                  TitleHeaderComponentDisplay === "none" ? "" : "none"
                }`,
              }}
            >
              {accordionButtons.map((buttonName, index) => (
                <button
                  key={index}
                  className={
                    activeAccordionIndex === index
                      ? `btn cmnbtn btn-primary`
                      : "btn cmnbtn btn-outline-primary"
                  }
                  onClick={() => onAccordionButtonClick(index)}
                >
                  {buttonName}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body">
            <div className="thm_form">
              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row">{children}</div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {accordionButtons.length == 0 && submitButton && (
                      <button
                        className="btn cmnbtn btn-primary"
                        style={{ marginRight: "5px" }}
                        type="submit"
                      >
                        Submit
                      </button>
                    )}

                    {activeAccordionIndex === accordionButtons.length - 1 &&
                      submitButton && (
                        <button
                          className={`btn cmnbtn ${
                            loading ? "btn-danger" : "btn-success"
                          }`}
                          style={{ marginRight: "5px" }}
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Submiting" : "Submit"}
                        </button>
                      )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormContainer;
