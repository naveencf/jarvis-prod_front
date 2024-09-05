import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const PlatformMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [platformName, setPlatformName] = useState("");
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
      .post(baseUrl+"platform", {
        name: platformName,
        remark: remark,
        created_by: userID,
      })
      .then(() => {
        setPlatformName("");
        setRemark("");
      })
      .catch((error) => {
        setError("An error occurred while submitting the form.");
        console.error(error);
      });
    setPlatformName("");
    setRemark("");

    toastAlert("Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/platform-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Platform"
        title="Platform"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Platform name"
          value={platformName}
          onChange={(e) => setPlatformName(e.target.value)}
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

export default PlatformMaster;
