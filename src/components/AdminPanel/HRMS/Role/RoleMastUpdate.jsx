import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";

function RoleMastUpdate() {
  const { toastAlert, toastError } = useGlobalContext();
  const [id, setId] = useState(0);
  const [role_name, setRoleName] = useState("");
  const [remark, setRemark] = useState("");
  const [creationdate, setCreationDate] = useState("");
  const [createdby, setCreatedBy] = useState("");
  const [lastupdatedby, setLastUpdatedBy] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role_name) {
      return toastError("Fill Required Fields");
    }

    try {
      await axios.put(`${baseUrl}update_role`, {
        role_id: id,
        role_name: role_name,
        remark: remark,
        created_by: createdby,
      });

      setRoleName("");
      setRemark("");
      toastAlert("Update Successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    setId(localStorage.getItem("role_id"));
    setRoleName(localStorage.getItem("Role_name"));
    setRemark(localStorage.getItem("Remarks"));
    setCreationDate(localStorage.getItem("Creation_date").substring(0, 10));
    setCreatedBy(localStorage.getItem("created_by"));
    setLastUpdatedBy(localStorage.getItem("Last_updated_by"));
    setUpdatedDate(localStorage.getItem("Last_updated_date").substring(0, 10));
  }, []);
  if (isFormSubmitted) {
    return <Navigate to="/admin/role-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Role"
        title="Role Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Role Name"
          astric
          required={false}
          value={role_name}
          onChange={(e) => setRoleName(e.target.value)}
        />
        {/* <FieldContainer disabled label="Role ID" value={id} /> */}
        <FieldContainer
          label="Remark"
          Tag="textarea"
          cols="45"
          rows="5"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <FieldContainer
          disabled
          label="Creation Date"
          value={creationdate}
          onChange={(e) => setCreationDate(e.target.value)}
        />
        {/* <FieldContainer
          label="Created By"
          disabled
          value={createdby}
          onChange={(e) => setCreatedBy(e.target.value)}
        /> */}
        {/* <FieldContainer
          label="Last Updated By"
          disabled
          value={lastupdatedby}
          onChange={(e) => setLastUpdatedBy(e.target.value)}
        />
        <FieldContainer
          disabled
          value={updatedDate}
          onChange={(e) => setLastUpdatedBy(e.target.value)}
        /> */}
      </FormContainer>
    </>
  );
}

export default RoleMastUpdate;
