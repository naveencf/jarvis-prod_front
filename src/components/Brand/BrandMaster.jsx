import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import {baseUrl} from '../../utils/config'

const BrandMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [logo, setLogo] = useState([]);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_logo_categories")
      .then((res) => setCategoryData(res.data));

    const today = new Date();
    const formattedDate = formatDate(today);
    setCurrentDate(formattedDate);
  }, []);

  const handleCategoryChange = (event, index) => {
    const { value } = event.target;
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      return updatedCategories;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let i = 0; i < details.length; i++) {
        const formData = new FormData();
        formData.append("brand_name", brand);
        formData.append("upload_logo", details[i].file);
        formData.append("image_type", details[i].image_type);
        formData.append("size", details[i].size);
        formData.append("size_in_mb", details[i].sizeInMB);
        formData.append("remarks", remark);
        formData.append("created_by", userID);
        formData.append("logo_cat", selectedCategories[i]);

        await axios.post(
          baseUrl+"add_logo_brand",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setIsFormSubmitted(true);
      toastAlert("Logo images uploaded");
      setBrand("");
      setLogo("");
      setImage("");
      setSize("");
      setRemark("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);

    const details = files.map((file) => {
      const { name } = file;
      const img = new Image();
      img.src = URL.createObjectURL(file);
      return new Promise((resolve) => {
        img.onload = () => {
          const { naturalHeight, naturalWidth } = img;
          const sizeInBytes = file.size;
          const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
          resolve({
            name,
            file,
            image_type: name.split(".").pop(),
            size: `${naturalHeight}x${naturalWidth}`,
            sizeInMB: `${sizeInMB}`,
          });
        };
      });
    });
    Promise.all(details).then((detailsArray) => {
      setDetails(detailsArray);
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/brand-overview" />;
  }
  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />
      <FormContainer
        mainTitle="Brand"
        title="Brand"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Brand Name *"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          // onBlur={handleContentBlur}
        />

        <FieldContainer
          label="Upload Data *"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          fieldGrid={3}
        />

        <div className="summary_cards brand_img_list">
          {details.map((detail, index) => (
            <div className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  <img
                    className="brandimg_icon"
                    src={URL.createObjectURL(images[index])}
                    alt={`Image ${index + 1}`}
                  />
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.image_type}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Resolution:</span>
                    {detail.size}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Size:</span>
                    {detail.sizeInMB}
                    {"MB"}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Date:</span>
                    {currentDate}
                  </h4>
                </div>
                <div className="col summary_box brand_img_box">
                  <FieldContainer
                    label={`Data Category`}
                    fieldGrid={12}
                    Tag="select"
                    value={selectedCategories[index] || ""}
                    onChange={(e) => handleCategoryChange(e, index)}
                  >
                    <option value="">Please select</option>
                    {categoryData.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.cat_name}
                      </option>
                    ))}
                  </FieldContainer>
                </div>
              </div>
            </div>
          ))}
        </div>

        <FieldContainer
          label="Remark"
          Tag="textarea"
          rows="3"
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default BrandMaster;
