import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import TextEditor from "../../ReusableComponents/TextEditor";
import { axisClasses } from "@mui/x-charts";
import { baseUrl } from "../../../utils/config";

const CocMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();

  const [cocContent, setCocContent] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "newcoc", {
        coc_content: cocContent,
        created_by: loginUserId,
      });
      toastAlert("COC Created");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error Adding COC");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/preonboard/pre-onboard-coc-overview" />;
  }
  return (
    <div>
      <FormContainer link={true} mainTitle="COC" handleSubmit={handleSubmit}>
        {/* <div style={{ border: "solid" }}>
          <div dangerouslySetInnerHTML={{ __html: cocContent }}></div>
        </div> */}
      </FormContainer>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Coc Creation</div>
        </div>
        <div className="card-body">
          <TextEditor value={cocContent} onChange={setCocContent} />
        </div>
      </div>
      <button className="btn btn-primary cmnbtn " onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CocMaster;
