import { useState } from "react";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../Context/Context";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const ResponsibilityMast = () => {
  const { toastAlert } = useGlobalContext();
  const [responsibility, setResponsibility] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "add_responsibility", {
        respo_name: responsibility,
        description: description,
        created_by: userId,
      });
      setResponsibility("");
      setDescription("");
      toastAlert("Form submitted");
      setIsFormSubmitted(true);
    } catch (error) {
      // toastAlert("Form submission failed");
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/responsibility-overview" />;
  }
  return (
    <div>
      <FormContainer
        mainTitle="Responsibility"
        link={true}
      >

      </FormContainer>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Responsibility
          </div>
        </div>
        <div className="card-body">
          <FieldContainer
            label="Responsibility"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
          />

          <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <button className="cmnbtn btn-primary" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ResponsibilityMast;
