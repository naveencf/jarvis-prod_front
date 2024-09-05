import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const RoleMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [roleName, setRoleName] = useState("");
  const [remark, setRemark] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    roleName: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roleName == "") {
      setIsRequired((perv) => ({ ...perv, roleName: true }));
    }
    if (!roleName || roleName == "") {
      return toastError("Fill Required Fields");
    }
    try {
      await axios.post(baseUrl + "add_role", {
        created_by: loginUserId,
        role_name: roleName,
        remark: remark,
      });
      setRoleName("");
      setRemark("");
      setCreatedBy("");
      toastAlert("Added Successfully ");
      setIsFormSubmitted(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/role-overview" />;
  }
  return (
    <>
      <FormContainer mainTitle="Role" title="Role" handleSubmit={handleSubmit}>
        <div className="mb-4 row">
          <div className="col-12">
            <FieldContainer
              label="Role Name"
              fieldGrid={6}
              value={roleName}
              astric
              required={false}
              onChange={(e) => {
                const roleval = e.target.value;
                setRoleName(roleval);
                if (roleval === "") {
                  setIsRequired((prev) => ({
                    ...prev,
                    roleName: true,
                  }));
                } else {
                  setIsRequired((prev) => ({
                    ...prev,
                    roleName: false,
                  }));
                }
              }}
            />
            {isRequired.roleName && (
              <p className="form-error">Please Enter Role</p>
            )}
          </div>

          {/* <FieldContainer
          label="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          disabled
        /> */}
          <FieldContainer
            label="Remark"
            Tag="textarea"
            rows="3"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            required={false}
          />
        </div>
      </FormContainer>
    </>
  );
};

export default RoleMaster;
