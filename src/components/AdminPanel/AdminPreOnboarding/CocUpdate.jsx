import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";

import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from '../../../utils/config'
import TextEditor from "../../ReusableComponents/TextEditor";

const CocUpdate = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [cocContent, setCocContent] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    axios
      .get(`${baseUrl}` + `newcoc/${id}`)
      .then((res) => {
        const fetchedData = res.data.data;
        setCocContent(fetchedData.coc_content)
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('console here')
    await axios.put(`${baseUrl}` + `newcoc/`, {
      _id: id,
      updated_by: loginUserId,
      coc_content: cocContent
    });

    toastAlert("Coc created");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pre-onboard-coc-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="COC"
        title="Coc Updation"
        handleSubmit={handleSubmit}
      >
        <TextEditor value={cocContent} onChange={setCocContent} />
      </FormContainer>
    </>
  );
};

export default CocUpdate;
