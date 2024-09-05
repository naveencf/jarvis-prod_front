import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useGlobalContext } from "../../../Context/Context";
import TextEditor from "../../ReusableComponents/TextEditor";
import {baseUrl} from '../../../utils/config'

const AddEmailTemp = () => {
  const { toastAlert } = useGlobalContext();
  const [emailFor, setEmailFor] = useState("");
  const [emailForId, setEmailForId] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [remarks, setRemarks] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl+"add_email_content", {
      email_for: emailFor,
      email_for_id: emailForId,
      email_content: emailContent,
      remarks: remarks,
      email_sub: emailSub,
      created_by: loginUserId,
    });

    toastAlert("Email templated created");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/email-template-overview" />;
  }

  return (
    <>
      <div class="alert alert-danger">
        <strong>
          Use {`{{user_name}}`} for user name, use {`{{user_email}}`} for user
          email, use {`{{user_password}}`} for user password, use{" "}
          {`{{designation}}`} for user designation, use {`{{user_address}}`} for
          user address, use {`{{user_login_id}}`} for user login id, use{" "}
          {`{{sitting_area}}`} for user sitting area, use {`{{sitting_ref}}`}{" "}
          for user sitting reference number, use {`{{user_contact}}`} for user
          contact, use {`{{user_reportTo}}`} for user report to whom, use{" "}
          {`{{asset_name}}`} for asset name, use {`{{user_joining_date}}`} for
          user joining date.
        </strong>
      </div>

      <div class="alert alert-danger">
        <strong>
          email template id for :- user joining before 0 days = 0, user joining
          before 1 days = 1, user joining before 2 days = 2, user joining before
          3 days = 3, assset auto mail = 4, pantry order = 5, onboarding user =
          6, report to manager = 7, other emails = 8, forget password = 9
        </strong>
      </div>

      <FormContainer
        mainTitle="Email Template"
        title="Add Template"
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

export default AddEmailTemp;
