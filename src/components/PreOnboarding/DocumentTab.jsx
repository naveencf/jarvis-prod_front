import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { FaRegFilePdf } from "react-icons/fa";
import { constant } from "../../utils/constants";
import { IoTrashBin } from "react-icons/io5";

const DocumentTab = ({
  documentData,
  setDocumentData,
  getDocuments,
  showMandotaryPer,
  showNonMandotaryPer,
  id,
  submitButton = true,
  normalUserLayout = false,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const [diffDate, setDiffDate] = useState(null);
  const navigate = useNavigate();

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const RoleID = decodedToken.role_id;

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      setUser(res.data);
      var currentDate = new Date();
      var joiningDate = new Date(res.data?.joining_date);
      var difference = joiningDate - currentDate;
      var daysDifference = Math.floor(difference / (1000 * 3600 * 24));
      setDiffDate(daysDifference);
    });
  };

  const handleDocDelete = (item) => {
    axios
      .put(`${baseUrl}` + `update_doc_user`, {
        _id: item,
        doc_image: "",
        // status: "unapprove",
      })
      .then((res) => {
        getDocuments();
        toastAlert("Document Deleted Successfully");
      });
  };

  const handleApproveDocument = async (id) => {
    try {
      const payload = {
        _id: id,
        status: "Approved",
      };
      const response = await axios.put(baseUrl + "update_user_doc", payload);
      getDocuments();
    } catch (error) {
      console.error("Error white Submitting data", error);
    }
  };

  useEffect(() => {
    getData();
  }, [documentData]);

  const updateDocumentData = (documentId, key, value) => {
    setDocumentData((prevDocumentData) =>
      prevDocumentData.map((doc) =>
        doc._id === documentId ? { ...doc, [key]: value } : doc
      )
    );
  };

  // const handleFileUpload = (file, documentId) => {
  //   updateDocumentData(documentId, "file", file);
  //   updateDocumentData(documentId, "status", "Document Uploaded");
  // };

  const handleSubmit = async () => {
    try {
      for (const document of documentData) {
        if (document.file) {
          let formData = new FormData();
          formData.append("doc_image", document.file);
          formData.append("_id", document._id);
          formData.append(
            "status",
            document.status == "Document Uploaded"
              ? "Verification Pending"
              : document.status
          );
          await axios.put(baseUrl + "update_user_doc", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          console.log(`No file uploaded for document ${document._id}`);
        }
      }

      await axios.put(`${baseUrl}` + `update_user`, {
        user_id: id,
        document_percentage_mandatory: showMandotaryPer,
        document_percentage_non_mandatory: showNonMandotaryPer,
      });
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    }
  };

  const handleNotAvail = async (item) => {
    await axios.put(baseUrl + "update_user_doc", {
      _id: item._id,
      status: "Not Available",
    });
    toastAlert("Documents Updated");
    getDocuments();
  };

  const handleFileUpload = async (file, documentId) => {
    const document = documentData.find(
      (item) => item._id === documentId
    )?.document;
    if (document && document.doc_name == `Last 3 Months Salary Slip's`) {
      if (file && file.type !== "application/pdf") {
        toastError(
          'Please upload single pdf file which has "Last 3 month salary slip"'
        );
        return;
      }
    }

    updateDocumentData(documentId, "file", file);
    updateDocumentData(documentId, "status", "Document Uploaded");

    try {
      let formData = new FormData();
      formData.append("doc_image", file);
      formData.append("_id", documentId);
      formData.append("status", "Verification Pending");
      await axios.put(baseUrl + "update_user_doc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toastAlert("Details Uploaded Successfully");
      getDocuments();
    } catch (error) {
      console.error("Error uploading document", error);
      toastError("Failed to upload document");
    }
  };

  const handleDragStart = (e, documentId) => {
    e.dataTransfer.setData("text/plain", documentId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function findDocumentIdByParentId(parentId, responseArray) {
    for (const item of responseArray) {
      if (item._id === parentId) {
        return item.document._id;
      }
    }
  }

  function findOrderNumberByParentId(parentId, responseArray) {
    for (const item of responseArray) {
      if (item._id === parentId) {
        return item.document.order_number;
      }
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedDocumentId = e.dataTransfer.getData("text/plain");
    const draggedDocumentIndex = documentData.findIndex(
      (item) => item._id === droppedDocumentId
    );
    const targetDocumentId = e.target.parentElement.getAttribute("data-id");
    const targetDocumentIndex = documentData.findIndex(
      (item) => item._id === targetDocumentId
    );

    const reorderedDocuments = Array.from(documentData);
    const [draggedDocument] = reorderedDocuments.splice(
      draggedDocumentIndex,
      1
    );
    reorderedDocuments.splice(targetDocumentIndex, 0, draggedDocument);

    const data = {
      _id: draggedDocument.document._id,
      order_number: targetDocumentIndex + 1,
    };

    const replaceData = {
      _id: findDocumentIdByParentId(targetDocumentId, documentData),
      order_number: findOrderNumberByParentId(droppedDocumentId, documentData),
    };

    try {
      await axios.put(`${baseUrl}edit_document_order`, data);
      await axios.put(`${baseUrl}edit_document_order`, replaceData);
      setDocumentData(reorderedDocuments);
      getDocuments();
    } catch (error) {
      console.error("Error updating document order", error);
      toastError("Failed to update document order");
    }
  };

  const handleDeleteDocument = async (ids) => {
    try {
      await axios.delete(baseUrl + `delete_user_doc/${ids}`);
      toastAlert("Document Deleted Successfully");
      getData();
    } catch {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body pl4 pr4 pt4">
          <div className="thm_table table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Document Name</th>
                  <th scope="col">Document Type</th>
                  <th scope="col">Period (Days)</th>
                  {/* <th scope="col">Time Left</th> */}
                  <th scope="col">View</th>
                  <th scope="col">Upload</th>
                  <th scope="col" className="text-center">
                    Status
                  </th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {documentData
                  ?.slice()
                  .sort((a, b) => {
                    if (a.document?.isRequired && !b.document?.isRequired) {
                      return -1;
                    } else if (
                      !a.document?.isRequired &&
                      b.document?.isRequired
                    ) {
                      return 1;
                    } else {
                      return (
                        a.document?.order_number - b.document?.order_number
                      );
                    }
                  })
                  .map((item) => (
                    <tr
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, item._id)}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      data-id={item._id}
                      key={item._id}
                    >
                      <td style={{ width: "20%" }}>
                        {item.document.doc_name}
                        {item.document.isRequired && (
                          <span style={{ color: "red" }}> *</span>
                        )}
                      </td>
                      <td scope="row">{item.document.doc_type}</td>
                      <td>{item.document.period} days</td>
                      {/* <td>1 Day</td> */}
                      {/* <td>
                          {diffDate < 0 ? "Please Upload Docs" : diffDate}
                        </td> */}
                      <td>
                        {/* <a href={item?.doc_image_url} target="_blank">
                        <img style={{height:"70px"}} src={item?.doc_image_url} alt="Doc"/>
                        </a> */}
                        {item?.doc_image ? (
                          <div className="documentView">
                            <a
                              href={item.doc_image_url}
                              target="_blank"
                              download
                            >
                              {item.doc_image_url.endsWith(".pdf") ? (
                                <FaRegFilePdf style={{ fontSize: "50px" }} />
                              ) : (
                                <>
                                  <img
                                    className="documentViewImg"
                                    src={item.doc_image_url}
                                    alt="doc image"
                                  />
                                  <div className="documentViewAction">
                                    <i className="fa-solid fa-eye" />
                                  </div>
                                </>
                              )}
                            </a>
                          </div>
                        ) : (
                          <div className="text-center">N/A</div>
                        )}
                      </td>
                      <td>
                        <div className="documentUpload">
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileUpload(e.target.files[0], item._id)
                            }
                          />
                          <span>
                            <i className="bi bi-cloud-arrow-up" />
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="docStatus documentStatus">
                          <span
                            className={`badge 
                        ${item.status == "" && "not_uploaded"}
                        ${
                          item.status == "Document Uploaded" &&
                          "document_uploaded"
                        }
                        ${item.status == "Verification Pending" && "pending"}
                        ${item.status == "Approved" && "approve"}
                        ${item.status == "Rejected" && "reject"}
                        `}
                          >
                            {item.status == "" && "Not Uploaded"}
                            {item.status !== "" && item.status}
                            {item.status == "Rejected" && (
                              <i
                                className="bi bi-exclamation-circle-fill"
                                title={item.reject_reason}
                              />
                            )}
                            {/* {item.status == "Approved" && (
                                <button
                                  type="button"
                                  className="btn cmnbtn btn_sm btn-danger"
                                  onClick={() => handleDocDelete(item)}
                                >
                                  Unapprove
                                </button>
                              )} */}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="documentAction flex_center_center colGap8">
                          {item.status !== "Approved" && "approve" && (
                            <button
                              title="delete"
                              type="button"
                              className="icon btn btn_sm btn-outline-danger"
                              onClick={() => handleDocDelete(item._id)}
                            >
                              <IoTrashBin />
                              {/* <i style={{ color: "white" }} className="bi bi-trash"></i> */}
                            </button>
                          )}
                          {item.status == "Verification Pending" &&
                            (RoleID === constant.CONST_ADMIN_ROLE ||
                              RoleID === constant.CONST_HR_ROLE) && (
                              <button
                                type="button"
                                onClick={() => handleApproveDocument(item._id)}
                                className="btn cmnbtn btn_sm btn-success"
                              >
                                Approve
                              </button>
                            )}
                          {item?.status == "Not Available" ||
                          item?.status !== "" ? (
                            ""
                          ) : (
                            <button
                              type="button"
                              className="icon btn btn_sm btn-outline-dark"
                              onClick={() => handleNotAvail(item)}
                            >
                              <p>N/A</p>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTab;
