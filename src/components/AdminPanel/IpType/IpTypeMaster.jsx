import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const AccessTypeMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [accessTypeName, setAccessTypeName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post(baseUrl+"Iptype", {
        name: accessTypeName,
        remark: remark,
        created_by: userID,
      })
      .then(() => {
        setAccessTypeName("");
        setRemark("");
      })
      .catch((error) => {
        setError("An error occurred while submitting the form.");
        console.error(error);
      });
    setAccessTypeName("");
    setRemark("");

    toastAlert("Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/iptype-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Ip Type"
        title="Ip Type"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Ip type"
          value={accessTypeName}
          onChange={(e) => setAccessTypeName(e.target.value)}
        />
        <FieldContainer
          label="Remark"
          Tag="textarea"
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </>
  );
};

export default AccessTypeMaster;
