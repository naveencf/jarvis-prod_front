import React, { useEffect, useState } from "react";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import FieldContainer from "../../FieldContainer";
import Modal from "react-modal";
import axios from "axios";
import { useGetInvoiceParticularListQuery } from "../../../Store/API/Sales/InvoiceParticularApi";
import InvoiceParticular from "./InvoiceParticular";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import jwtDecode from "jwt-decode";

const InvoiceNeededData = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];
const InvoiceTypeData = [
  { label: "Proforma", value: "proforma" },
  { label: "Tax Invoice", value: "tax-invoice" },
];

const InvoiceRequest = ({
  saleBookingData,
  closeModal,
  refetchSaleBooking,
}) => {
  const {
    data: invoiceParticularList,
    isLoading: invoiceParticularListLoading,
    isSuccess: invoiceParticularListSuccess,
    isError: invoiceParticularListError,
  } = useGetInvoiceParticularListQuery();
  const { toastAlert, toastError } = useGlobalContext();
  const [invoiceType, setInvoiceType] = useState("");
  const [invoiceParticular, setInvoiceParticular] = useState();
  const [InvoiceAmount, setInvoiceAmount] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [purchaseOrderFile, setPurchaseOrderFile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for managing submission
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [isValidate, setIsValidate] = useState({
    invoiceType: false,
    invoiceParticular: false,
  });
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidationState = {
      invoiceType: !invoiceType,
      invoiceParticular: !invoiceParticular,
    };

    const hasErrors = Object.values(newValidationState).some(
      (isInvalid) => isInvalid
    );

    setIsValidate(newValidationState);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true); // Set submitting to true

    const formData = new FormData();
    formData.append("sale_booking_id", saleBookingData?.sale_booking_id);
    formData.append("invoice_type_id", invoiceType);
    formData.append("invoice_particular_id", invoiceParticular);
    formData.append("purchase_order_number", purchaseOrder);
    formData.append("created_by", loginUserId);
    if (invoiceType === "tax-invoice") {
      formData.append("invoice_amount", InvoiceAmount);
    }
    if (purchaseOrderFile) {
      formData.append("purchase_order_upload", purchaseOrderFile);
    }

    try {
      await axios.post(`${baseUrl}/sales/invoice_request`, formData, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });
      refetchSaleBooking();
      closeModal();
      toastAlert("Invoice Request Submitted Successfully");
    } catch (error) {
      toastError("Error in submitting the form");
      toastAlert(error.message || "Error in submitting the form");
    } finally {
      setIsSubmitting(false); // Reset submitting to false after completion
    }
  };

  useEffect(() => {
    if (invoiceParticular) {
      setIsValidate((prev) => ({
        ...prev,
        invoiceParticular: false,
      }));
    }
  }, [invoiceParticular]);

  useEffect(() => {
    if (invoiceType) {
      setIsValidate((prev) => ({
        ...prev,
        invoiceType: false,
      }));
    }
  }, [invoiceType]);

  useEffect(() => {
    const testdata = saleBookingData.salesInvoiceRequestData.filter(
      (item) => item.invoice_type_id === "proforma"
    ).length;
    if (testdata > 0) {
      setIsDropdownDisabled(true);
      setInvoiceType("tax-invoice");
    }

    setInvoiceAmount(
      saleBookingData?.campaign_amount -
      saleBookingData?.invoice_requested_amount
    );
  }, [saleBookingData]);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: "30%",
            top: "30%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <InvoiceParticular setIsModalOpen={setIsModalOpen} />
      </Modal>

      <h2>Invoice Request</h2>
      <hr className="mt-3 mb-3" />

      <FieldContainer
        fieldGrid={12}
        label={"Purchase Order Number"}
        type="text"
        placeholder="Purchase Order"
        value={purchaseOrder}
        onChange={(e) => setPurchaseOrder(e.target.value)}
        required={false}
      />

      <FieldContainer
        type="file"
        fieldGrid={12}
        label="Purchase Order Document"
        onChange={(e) => setPurchaseOrderFile(e.target.files[0])}
        required={false}
      />

      <CustomSelect
        fieldGrid={12}
        label="Invoice Type"
        dataArray={InvoiceTypeData}
        optionId="value"
        optionLabel="label"
        selectedId={invoiceType}
        setSelectedId={setInvoiceType}
        required
        disabled={isDropdownDisabled}
      />
      {isValidate.invoiceType && (
        <div className="form-error">Please Select Invoice Type</div>
      )}

      <div className="flex-row gap-2">
        <CustomSelect
          fieldGrid={10}
          label="Invoice Particular"
          dataArray={invoiceParticularList}
          optionId="_id"
          optionLabel="invoice_particular_name"
          selectedId={invoiceParticular}
          setSelectedId={setInvoiceParticular}
          required
          astric
        />
        <div className="mt-2">
          <button
            className="cmnbtn btn-primary btn btn_sm mt-4"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>
      {isValidate.invoiceParticular && (
        <div className="form-error">Please Select Invoice Particular</div>
      )}

      {invoiceType === "tax-invoice" && (
        <>
          <FieldContainer
            fieldGrid={12}
            astric
            label="Invoice Amount"
            type="number"
            placeholder="Enter amount here"
            value={InvoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            required={true}
          />
          {Number(saleBookingData?.campaign_amount) ===
            Number(saleBookingData?.invoice_requested_amount) && (
              <div style={{ color: "red" }}>
                * Total Invoice Requested Amount Equals to Campaign Amount
              </div>
            )}
        </>
      )}

      <button
        className="btn cmnbtn btn-primary btn_sm"
        onClick={(e) => handleSubmit(e)}
        disabled={
          isSubmitting || // Disable if submitting
          saleBookingData?.campaign_amount ===
          saleBookingData?.invoice_requested_amount
        }
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default InvoiceRequest;
