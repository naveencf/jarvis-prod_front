import React from "react";
import { FcDownload } from "react-icons/fc";
import ApproveReject from "./ApproveReject";

const Tab4DocumentCard = ({
  documentTitle,
  documentUrl,
  validationState,
  onApprove,
  onReject,
  rejectReasonActive,
  rejectReason,
  onRejectReasonChange,
  onRejectSubmit,
}) => {
  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
      <div className="card documentCard_bx">
        <div className="card-body">
          <div className="img-thumbnail">
            <img
              src={documentUrl}
              className="img-fluid"
              alt={`${documentTitle?.toLowerCase()}_photo`}
            />
          </div>
          <div className="documentCard_text">
            <h3>{documentTitle}</h3>
            <div className="documentCard_download">
              <a href={documentUrl} download>
                {/* <FcDownload /> */}
                <i class="fa fa-eye" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="documentCard_action">
            {validationState !== "Approve" &&
              validationState !== "Reject" &&
              validationState == "Pending" && (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    type="button"
                    onClick={onApprove}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    type="button"
                    onClick={onReject}
                  >
                    Reject
                  </button>
                </>
              )}

            <ApproveReject data={validationState} />
          </div>

          {rejectReasonActive && (
            <div className="documentCard_input">
              <input
                className="form-control"
                type="text"
                value={rejectReason}
                onChange={onRejectReasonChange}
              />
              <button
                className="btn btn-sm btn-primary"
                type="submit"
                onClick={onRejectSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tab4DocumentCard;
