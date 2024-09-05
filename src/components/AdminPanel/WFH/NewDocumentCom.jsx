import React, { useEffect, useState } from "react";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { Navigate } from "react-router-dom";

const NewDocumentCom = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [documentData, setDocumentData] = useState([]);
  const [isUpdaing, setIsUpdating] = useState(false);
  const [user, setUser] = useState({});

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  async function getDocuments() {
    try {
      const response = await axios.post(baseUrl + "get_wfhd_user_doc", {
        user_id: id,
      });
      setDocumentData(response.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }
  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      setUser(res.data);
      getData();
    });
  };

  useEffect(() => {
    getDocuments();
  }, []);

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
        await axios.put(baseUrl + "update_training", {
          user_id: id,
          att_status: "document_upload",
        }); 
      }
      
      setIsFormSubmitted(true) 
      // navigate("/admin/wfhd-overview");
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/wfhd-overview" />;
  }
  return (
    <div className="table-wrap-user">
      <DocumentTab
        documentData={documentData}
        setDocumentData={setDocumentData}
        getDocuments={getDocuments}
        submitButton={false}
        normalUserLayout={true}
      />
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
  );
};

export default NewDocumentCom;
