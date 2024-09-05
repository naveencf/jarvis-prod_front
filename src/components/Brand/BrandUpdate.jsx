import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import { MdCancel } from "react-icons/md";
import {baseUrl} from '../../utils/config'

const BrandUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [logo, setLogo] = useState("");
  const [image, setImage] = useState("JPG");
  const [size, setSize] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [logos, setLogos] = useState([]);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_logo_data/${id}`)
      .then((res) => {
        const fetchedData = res.data;
        const { brand_name, upload_logo, remarks, cat_name } = fetchedData;
        setBrand(brand_name);
        setLogo(upload_logo);
        setRemark(remarks);
        setCategory(cat_name);
        setBrandData(fetchedData);
      });

    axios
      .get(baseUrl+"get_all_logo_categories")
      .then((res) => setCategoryData(res.data));

    const today = new Date();
    const formattedDate = formatDate(today);
    setCurrentDate(formattedDate);
  }, [id]);

  const handleCategoryChange = (event, index) => {
    const { value } = event.target;
    setSelectedCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      return updatedCategories;
    });
  };

  const getCombinedData = async () => {
    if (brand) {
      axios
        .get(`${baseUrl}`+`get_logo_data_for_brand/${brand}`)
        .then((res) => {
          setLogos(res.data);
        });
    }
  };

  useEffect(() => {
    getCombinedData();
  }, [brand]);

  const removeImage = async (logo_id) => {
    if (logo_id == id) {
      setError("You can't delete default image, try to delete brand instead");
    } else {
      var data = await axios.delete(
        `${baseUrl}`+`delete_logo/${logo_id}`,
        null
      );
      if (data) {
        getCombinedData();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`${baseUrl}`+`update_logo_brand_new`, {
      id: id,
      brand_name: brand,
      remarks: remark,
      // cat_name: category,
      Last_updated_by: loginUserId,
    });

    try {
      for (let i = 0; i < details.length; i++) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("brand_name", brand);
        formData.append("upload_logo", details[0].file);
        formData.append("image_type", details[0].image_type);
        formData.append("size_in_mb", details[0].sizeInMB);
        formData.append("size", details[0].size);
        formData.append("remarks", remark);
        formData.append("last_updated_by", loginUserId);
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
      toastAlert("Logo images updated");
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
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <FormContainer
              mainTitle="Brand"
              title="Brand"
              handleSubmit={handleSubmit}
            >
              <FieldContainer
                label="Brand Name"
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />

              <FieldContainer
                label="Upload Data"
                type="file"
                multiple
                required={false}
                fieldGrid={6}
                onChange={handleFileChange}
              />

              <div className="summary_cards brand_img_list">
                {logos.map((detail) => (
                  <div className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box">
                        <img
                          className="brandimg_icon"
                          src={detail.logo_image}
                        />
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Resolution:</span>
                          {detail.size}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Size:</span>
                          {detail.size_in_mb}
                          {"MB"}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Data Category:</span>
                          {detail.cat_name}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Date:</span>
                          {detail.created_at.split("T")[0]}
                        </h4>
                      </div>
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeImage(detail.logo_id)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {details.map((detail, index) => (
                  <div className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box">
                        <img
                          className="brandimg_icon"
                          src={URL.createObjectURL(images[index])}
                          alt={`Image ${index + 1}`}
                        />
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Resolution:</span>
                          {detail.size}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Size:</span>
                          {detail.sizeInMB}
                          {"MB"}
                        </h4>
                      </div>
                      <div className="col summary_box brand_img_box">
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

              <p>{error}</p>

              <FieldContainer
                label="Remark"
                Tag="textarea"
                rows="5"
                value={remark}
                required={false}
                onChange={(e) => setRemark(e.target.value)}
              />
            </FormContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandUpdate;
