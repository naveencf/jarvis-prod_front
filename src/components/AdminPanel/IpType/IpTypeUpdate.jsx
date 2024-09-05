import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const AccessTypeUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const { id } = useParams();
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
      .put(`${baseUrl}`+`Iptypeupdate/`, {
        id: Number(id),
        name: accessTypeName,
        remark: remark,
        last_updated_by: userID,
      })
      .then(() => {
        setAccessTypeName("");
        setRemark("");
      })
      .catch((error) => {
        setError("An error occurred while submitting the form.");
        console.error(error);
      });

    toastAlert("Submit Success");
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    axios.get(`${baseUrl}`+`Iptypedata/${id}`).then((res) => {
      const fetchedData = res.data;
      const { name, remark } = fetchedData;
      setAccessTypeName(name);
      setRemark(remark);
      // setSimData(fetchedData);
    });
  }, [id]);

  if (isFormSubmitted) {
    return <Navigate to="/admin/iptype-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="AccessType"
        title="AccessType Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="AccessType Name"
          value={accessTypeName}
          onChange={(e) => setAccessTypeName(e.target.value)}
        />

        <FieldContainer
          label="Remark"
          rows={"4"}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </>
  );
};

export default AccessTypeUpdate;
