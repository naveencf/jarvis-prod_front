import React from "react";
import successIcon from "../../../../assets/img/icon/success.png";
import errorIcon from "../../../../assets/img/icon/error.png";
import { useNavigate } from "react-router-dom";

const AccountSubmitDialog = ({
  response,
  closeModal,
  id,
  accountMasterData,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {response === "Success" && (
        <div className="alertModalContent">
          <img src={successIcon} alt="icon" />
          <h2>Success</h2>
          {id == 0 && <h6>Account has been created successfully.</h6>}
          {id != 0 && <h6>Account has been edited successfully.</h6>}
          <button
            className="btn cmnbtn btn-success"
            onClick={() => navigate("/admin/sales-dashboard")}
          >
            HOME
          </button>
          {id == 0 && (
            <button
              className="btn cmnbtn btn-success"
              onClick={() =>
                navigate("/admin/create-sales-booking", {
                  state: {
                    account_data: accountMasterData,
                  },
                })
              }
            >
              Continue to sale booking
            </button>
          )}
          {id != 0 && (
            <button
              className="btn cmnbtn btn-success"
              onClick={() => navigate("/admin/sales-account-overview")}
            >
              Continue to sale Overview
            </button>
          )}
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

export default AccountSubmitDialog;
