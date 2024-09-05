import React from "react";
import successIcon from "../../../../assets/img/icon/success.png";
import errorIcon from "../../../../assets/img/icon/error.png";
import { useNavigate } from "react-router-dom";

const SalesSubmitDialog = ({
  response,
  closeModal,
  id,
  setSubmitDialog,
  selectedPaymentStatus,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {response === "Success" && (
        <div className="alertModalContent">
          <img src={successIcon} alt="icon" />
          <h2>Success</h2>
          <h6>`Sale booking ${id ? "updated" : "created"} successfully.`</h6>
          {selectedPaymentStatus?.value === "sent_for_payment_approval" && (
            <button
              className="btn cmnbtn btn-success"
              onClick={() =>
                navigate(`/admin/create-payment-update/0`, {
                  state: { sales_user: newSaleBookingData }, // your additional data here
                })
              }
            >
              Create Payment Update
            </button>
          )}

          <button
            className="btn cmnbtn btn-success"
            onClick={() => navigate("/admin/view-sales-booking")}
          >
            Sale Booking
          </button>
        </div>
      )}
      {response === "Reject" && (
        <div className="alertModalContent">
          <img src={errorIcon} alt="icon" />
          <h2>Error</h2>
          <h6>Task failed. please wait we'll get back to you soon.</h6>
          <button className="btn cmnbtn btn-danger" onClick={closeModal}>
            Try again !
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesSubmitDialog;
