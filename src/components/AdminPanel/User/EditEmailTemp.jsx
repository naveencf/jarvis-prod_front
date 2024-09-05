import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TextEditor from "../../ReusableComponents/TextEditor";
import {baseUrl} from '../../../utils/config'

const EditEmailTemp = () => {
  const { id } = useParams();
  const [emailFor, setEmailFor] = useState("");
  const [emailForId, setEmailForId] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [remarks, setRemarks] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_email_content/${id}`)
      .then((res) => {
        const fetchedData = res.data.data;
        setEmailFor(fetchedData.email_for);
        setEmailForId(fetchedData.email_for_id);
        setEmailContent(fetchedData.email_content);
        setEmailSub(fetchedData.email_sub);
        setRemarks(fetchedData.remarks);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl+"update_email_content", {
      _id: id,
      email_for: emailFor,
      email_for_id: emailForId,
      email_content: emailContent,
      email_sub: emailSub,
      remarks: remarks,
      updated_by: loginUserId,
    });

    toastAlert("Email templated updated");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/email-template-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Email Template"
        title="Edit Template"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Email Template for"
          type="text"
          fieldGrid={6}
          value={emailFor}
          onChange={(e) => setEmailFor(e.target.value)}
        />
        <FieldContainer
          label="Email Template Id"
          type="number"
          fieldGrid={6}
          value={emailForId}
          required={true}
          onChange={(e) => setEmailForId(e.target.value)}
        />
        <FieldContainer
          label="Remarks"
          fieldGrid={6}
          value={remarks}
          required={false}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <FieldContainer
          label="Email Subject"
          fieldGrid={6}
          required={true}
          value={emailSub}
          onChange={(e) => setEmailSub(e.target.value)}
        />
        {/* <ReactQuill
          theme="snow"
          value={emailContent}
          onChange={setEmailContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ color: [] }, { background: [] }],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
          ]}
          style={{ marginBottom: "5%" }}
        /> */}

        <TextEditor value={emailContent} onChange={setEmailContent} />
      </FormContainer>
    </>
  );
};

export default EditEmailTemp;
