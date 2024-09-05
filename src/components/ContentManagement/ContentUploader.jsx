import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import {baseUrl} from '../../utils/config'

const ContentUploader = () => {
  const { toastAlert } = useGlobalContext();
  const [pageName, setPageName] = useState("");
  const [contentName, setContentName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [content, setContent] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformData, setPlatFormData] = useState([]);
  const [ipTypeData, setIpTypeData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  useEffect(() => {
    axios
      .get(baseUrl+"alldataofIptype")
      .then((res) => setIpTypeData(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("page_name", pageName);
    formData.append("content_name", contentName);
    formData.append("category", category);
    formData.append("sub_category", subCategory);
    formData.append("content", content);
    formData.append("user_id", userID);

    await axios.post(baseUrl+"content_upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toastAlert("Form Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/content-overview" />;
  }
  return (
    <>
      <UserNav />
      <div className="section section_padding sec_bg h100vh">
        <div className="container">
          <div className="card mb-4">
            <div className="card-header">
              <div className="tabbtn_header_two"></div>
            </div>
            <div className="card-body pb0 pb4 thm_form">
              <form method="POST" className="row" onSubmit={handleSubmit}>
                <>
                  <FieldContainer
                    label="Page Name *"
                    value={pageName}
                    required={true}
                    onChange={(e) => setPageName(e.target.value)}
                  />
                  <FieldContainer
                    label="Content Name *"
                    required={true}
                    value={contentName}
                    onChange={(e) => setContentName(e.target.value)}
                  />

                  <FieldContainer
                    label="Category"
                    Tag="select"
                    value={category}
                    required={false}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {ipTypeData.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </FieldContainer>

                  <FieldContainer
                    label="Sub Category"
                    Tag="select"
                    value={subCategory}
                    required={false}
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {platformData.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </FieldContainer>

                  <FieldContainer
                    label="Content *"
                    type="file"
                    value={content}
                    onChange={(e) => setContent(e.target.files[0])}
                  />
                </>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentUploader;
