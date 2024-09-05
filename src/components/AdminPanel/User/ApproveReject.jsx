import React from "react";

const ApproveReject = ({ data }) => {
  return (
    <>
      {data === "Rejected" && (
        <div className="documentCard_message">
          <p className="color_danger">
            <i className="bi bi-x-circle-fill" />
            Rejected
          </p>
        </div>
      )}
      {data === "Approved" && (
        <div className="documentCard_message">
          <p className="color_success">
            <i className="bi bi-check-circle-fill" />
            Approved
          </p>
        </div>
      )}
      {data === "Verification Pending" && (
        <div className="documentCard_message">
          <p className="color_warning">
            <i className="bi bi-check-circle-fill" />
            Pending
          </p>
        </div>
      )}
    </>
  );
};

export default ApproveReject;
