import axios from "axios";
import React, { useEffect, useState } from "react";
import { FcDownload } from "react-icons/fc";
import ApproveReject from "./ApproveReject";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import { FaRegFilePdf } from "react-icons/fa";

const DocumentTabUserSingle = (id) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [documentData, setDocumentData] = useState([]);
  const [rejectReasonActive, setRejectReasonActive] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [documentPercentage, setDocumentPercentage] = useState(0);

  console.log(documentData.filter((d)=>d.doc_image !== "") , 'filter')
const joType = "WFHD"
  const getDocuments = async () => {
    try {
      const response = await axios.post(baseUrl + "get_user_doc", {
        user_id: id.id,
      });
      setDocumentData(response.data.data);
      console.log(response.data.data ,'data')
    } catch (error) {
      console.log(error, "Error Fetching data");
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    const approveCount = documentData.filter(
      (doc) => doc.doc_image !== ""
    ).length;

    const documentPercentageTemp = Math.ceil(
      (approveCount / documentData.length) * 100
    );

    setDocumentPercentage(documentPercentageTemp);
  }, [getDocuments]);

  const handleDocumentUpdate = async (e, id, status, reason) => {
    e.preventDefault();
    try {
      const payload = {
        _id: id,
        status: status,
      };

      if (reason) {
        payload.reject_reason = reason;
      }

      const response = await axios.put(baseUrl + "update_user_doc", payload);
      setRejectReason("");
      setRejectReasonActive("");
      status == "Approved" && toastAlert(status);
      status == "Rejected" && toastError(status);
      getDocuments();
    } catch (error) {
      console.error("Error white Submitting data", error);
    }
  };
  const filteredData = documentData.filter((item) => item.doc_image !== "");
  return (
    <div className="table-wrap-user">
      <div className={`documentarea  "documentareaLight"`}>
        <div className="document_box">
          <div
            className={`docTable 
               docTableLight
             table-responsive`}
          >
            {/* <h2 className="bold">
              Document Uploaded Percentage: {documentPercentage}%
            </h2> */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Document Name</th>
                  <th scope="col">Document Type</th>
                  <th scope="col">View</th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
              {joType === "WFHD" ? (
  filteredData.map((item) => (
    <tr key={item._id}>
      <td>
        <div className="uploadDocBtn">
          <span>
            {item?.document.doc_name ? item.document.doc_name : "N/A"}
            {item.document.isRequired && (
              <span style={{ color: "red" }}>*</span>
            )}
          </span>
        </div>
      </td>
      <td scope="row">
        {item.document.doc_type}
      </td>
      <td>
        <div className="uploadDocBtn">
          <span>
            {item?.doc_image ? (
              <a href={item.doc_image_url} target="_blank" download>
                {item.doc_image_url.endsWith(".pdf") ? (
                  <FaRegFilePdf style={{ fontSize: "50px" }} />
                ) : (
                  <>
                    <img src={item.doc_image_url} alt="doc image" />
                    <i className="fa-solid fa-eye" />
                  </>
                )}
              </a>
            ) : (
              "N/A"
            )}
          </span>
        </div>
      </td>
      <td>
        <ApproveReject data={item.status} />
        {item.status === "Verification Pending" && (
          <div className="docStatus warning_badges warning_badgesTwo">
            <button
              type="button"
              onClick={(e) => handleDocumentUpdate(e, item._id, "Approved")}
              className="btn btn-success btn-sm mr-2"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setRejectReasonActive(item._id)}
              className="btn btn-danger btn-sm"
            >
              Reject
            </button>
          </div>
        )}
        {rejectReasonActive === item._id && (
          <div className="documentCard_input">
            <input
              required
              type="text"
              className="form-control"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              type="submit"
              onClick={(e) =>
                handleDocumentUpdate(e, item._id, "Rejected", rejectReason)
              }
            >
              Submit
            </button>
          </div>
        )}
        {item.status === "" && "N/A"}
      </td>
    </tr>
  ))
) : (
  documentData.map((item) => (
    <tr key={item._id}>
      <td>
        <div className="uploadDocBtn">
          <span>
            {item?.document.doc_name ? item.document.doc_name : "N/A"}
            {item.document.isRequired && (
              <span style={{ color: "red" }}>*</span>
            )}
          </span>
        </div>
      </td>
      <td scope="row">
        {item.document.doc_type}
      </td>
      <td>
        <div className="uploadDocBtn">
          <span>
            {item?.doc_image ? (
              <a href={item.doc_image_url} target="_blank" download>
                {item.doc_image_url.endsWith(".pdf") ? (
                  <FaRegFilePdf style={{ fontSize: "50px" }} />
                ) : (
                  <>
                    <img src={item.doc_image_url} alt="doc image" />
                    <i className="fa-solid fa-eye" />
                  </>
                )}
              </a>
            ) : (
              "N/A"
            )}
          </span>
        </div>
      </td>
      <td>
        <ApproveReject data={item.status} />
        {item.status === "Verification Pending" && (
          <div className="docStatus warning_badges warning_badgesTwo">
            <button
              type="button"
              onClick={(e) => handleDocumentUpdate(e, item._id, "Approved")}
              className="btn btn-success btn-sm mr-2"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setRejectReasonActive(item._id)}
              className="btn btn-danger btn-sm"
            >
              Reject
            </button>
          </div>
        )}
        {rejectReasonActive === item._id && (
          <div className="documentCard_input">
            <input
              required
              type="text"
              className="form-control"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              type="submit"
              onClick={(e) =>
                handleDocumentUpdate(e, item._id, "Rejected", rejectReason)
              }
            >
              Submit
            </button>
          </div>
        )}
        {item.status === "" && "N/A"}
      </td>
    </tr>
  ))
)}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTabUserSingle;
