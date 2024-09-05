import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import titleimg from '/bg-img.png'
const normalUserLayout = true;

const UpdateDocument = () => {
  const [documentData, setDocumentData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [mandatoryFilter, setMandatoryFillter] = useState("");
  const mandatoryOptions = [
    { value: "all", label: "ALL" },
    { value: true, label: "Mandatory" },
    { value: false, label: "Non-Mandatory" },
  ];

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();

  const [isUpdaing, setIsUpdating] = useState(false);

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: user_id,
    });
    setDocumentData(response.data.data);
    setFilterData(response.data.data);
  }

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getData();
    getDocuments();
  }, []);

  const updateDocumentData = (documentId, key, value) => {
    setDocumentData((prevDocumentData) =>
      prevDocumentData.map((doc) =>
        doc._id === documentId ? { ...doc, [key]: value } : doc
      )
    );
  };

  const handleFileUpload = (file, documentId) => {
    updateDocumentData(documentId, "file", file);
    updateDocumentData(documentId, "status", "Document Uploaded");
  };

  // const handleSubmit = async () => {
  //   try {
  //     setIsUpdating(true);

  //     for (const document of documentData) {
  //       if (document.file) {
  //         let formData = new FormData();
  //         formData.append("doc_image", document.file);
  //         formData.append("_id", document._id);
  //         formData.append(
  //           "status",
  //           document.status == "Document Uploaded"
  //             ? "Verification Pending"
  //             : document.status
  //         );
  //         const response = await axios.put(
  //           baseUrl + "update_user_doc",
  //           formData,
  //           {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  //       } else {
  //         console.log(`No file uploaded for document ${document._id}`);
  //       }
  //     }

  //     const requiredDocumentsMissing = documentData
  //       .filter(
  //         (doc) =>
  //           doc.document.isRequired &&
  //           doc.document.job_type.includes(user.job_type)
  //       )
  //       .filter((doc) => doc.status == "");

  //     if (requiredDocumentsMissing?.length == 0) {
  //       axios.put(baseUrl + "update_user", {
  //         user_id: user_id,
  //         att_status: "document_upload",
  //       });
  //     }
  //     navigate("/admin/wfhd-overview");
  //     toastAlert("Documents Updated");
  //     getDocuments();
  //   } catch (error) {
  //     console.error("Error submitting documents", error);
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);

      const uploadPromises = documentData.map(async (document) => {
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
      });

      await Promise.all(uploadPromises);

      const requiredDocumentsMissing = documentData
        .filter(
          (doc) =>
            doc.document.isRequired &&
            doc.document.job_type.includes(user.job_type)
        )
        .filter((doc) => doc.status === "");

      if (requiredDocumentsMissing.length === 0) {
        await axios.put(baseUrl + "update_user", {
          user_id: user_id,
          att_status: "document_upload",
        });
      }

      navigate("/admin/wfhd-overview");
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // const handleFilterChange = (option) => {
  //   if (option === "all") {
  //     setDocumentData(documentData);
  //   } else if (option === "required") {
  //     const requiredDocs = documentData.filter(
  //       (doc) =>
  //         doc.document.isRequired &&
  //         doc.document.job_type.includes(user.job_type)
  //     );
  //     setDocumentData(requiredDocs);
  //   } else if (option === "nonRequired") {
  //     const nonRequiredDocs = documentData.filter(
  //       (doc) => doc.document.isRequired == false
  //     );
  //     setDocumentData(nonRequiredDocs);
  //   }
  // };

  // useEffect(() => {
  //   const result = filterData.filter((d) => {
  //     const mandatory = !mandatoryFilter || d.document.isRequired;
  //     return mandatory;
  //   });
  //   setDocumentData(result);
  // }, [filterData, mandatoryFilter]);
  useEffect(() => {
    if (mandatoryFilter === "all") {
      getDocuments(); // This resets the document data to its original state
    } else {
      const result = filterData.filter((d) => {
        if (mandatoryFilter === true) {
          return (
            d.document.isRequired && d.document.job_type.includes(user.job_type)
          );
        } else if (mandatoryFilter === false) {
          return !d.document.isRequired;
        }
        return true; // In case there's no filter selected or an unexpected value
      });
      setDocumentData(result);
    }
  }, [mandatoryFilter, filterData, user.job_type]);
  const location = useLocation();
  const activeLink = location.pathname;
  return (
    <>
      <div
        className={`documentarea ${normalUserLayout && "documentareaLight"}`}
      >
        <div className="document_box master-card-css">
        <div className="form-heading">
        <img className="img-bg" src={titleimg} alt="" width={160} />
          <div className="form_heading_title">
          <h1>Documents</h1>
            <div className="pack">
            <i class="bi bi-house"></i> {activeLink.slice(1).charAt(0).toUpperCase()+ activeLink.slice(2)}
            </div>
          </div>
          {/* <Link to={`/admin/kra/${userId}`}>
            <button type="button" className="btn btn-outline-primary btn-sm">
              KRA
            </button>
          </Link> */}
        </div>
          {/* <select
            onChange={(e) => handleFilterChange(e.target.value)}
            className="form-select"
            style={{ marginBottom: "2%", width: "20%" }}
          >
            <option value="all">All Documents</option>
            <option value="required">Required Documents</option>
            <option value="nonRequired">Non-Required Documents</option>
          </select> */}
          <div className="card">
            <div className="card-header">

<div className="pack" >

          <Select
              style={{width:"300px"}}
            value={mandatoryOptions.find(
              (option) => option.value === mandatoryFilter
            )}
            onChange={(selectedOption) => {
              setMandatoryFillter(selectedOption.value);
            }}
            options={mandatoryOptions}
          />
</div>

            </div>
            <div className="card-body body-padding">

          <div
            className={`docTable ${
              normalUserLayout && "docTableLight"
            } table-responsive`}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Document Type</th>
                  <th scope="col">Period (Days)</th>
                  {/* <th scope="col">Time</th> */}
                  <th scope="col">Upload</th>
                  <th scope="col" className="text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {documentData.map((item) => (
                  <tr key={item._id}>
                    <td scope="row">
                      {item.document.doc_type}
                      {item.document.isRequired &&
                        item.document.job_type.includes(user.job_type) && (
                          <span style={{ color: "red" }}> (Mandatory)</span>
                        )}
                    </td>
                    <td>{item.document.period} days</td>
                    {/* <td>1 Day</td> */}
                    <td>
                      <div className="uploadDocBtn " >
                        <span style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row",gap:"10px"}}>
                        Upload  <i className="bi bi-cloud-arrow-up" />
                        </span>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], item._id)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="docStatus" >
                        <span
                          className={`warning_badges 
                        ${item.status == "" && "not_uploaded"}
                        ${
                          item.status == "Document Uploaded" &&
                          "document_uploaded"
                        }
                        ${item.status == "Verification Pending" && "pending"}
                        ${item.status == "Approved" && "approve"}
                        ${item.status == "Rejected" && "reject"}
                        `}
                        style={{zIndex:"0"}}>
                          <h4>
                            {item.status == "" && "Not Uploaded"}
                            {item.status !== "" && item.status}
                          </h4>
                          {item.status == "Rejected" && (
                            <i
                              class="bi bi-exclamation-circle-fill"
                              title={item.reject_reason}
                            />
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          </div>

          <div className="text-left">
            <button
              type="submit"
              className="btn btn_pill btn_cmn btn_success"
              onClick={handleSubmit}
              style={{ marginBottom: "5%" }}
              disabled={isUpdaing}
            >
              {isUpdaing ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateDocument;
