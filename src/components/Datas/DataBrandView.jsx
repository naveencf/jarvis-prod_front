import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import {baseUrl} from '../../utils/config'

const DataBrandView = () => {
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
  const [category, setCategory] = useState("");
  
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_data_based_data_name/${id}`)
      .then((res) => {
        const fetchedData = res.data[0];
        const { data_name, upload_logo, remark, cat_name } = fetchedData;
        // console.log(fetchedData);
        console.log(data_name);
        setBrand(data_name);
        setLogo(upload_logo);
        setRemark(remark);
        setCategory(cat_name);
        setBrandData(fetchedData);
      });
  }, [id]);

  useEffect(() => {
    if (brand) {
      axios
        .get(`${baseUrl}`+`get_data_based_data_name_new/${brand}`)
        .then((res) => {
          console.log(res.data);
          setLogos(res.data);
        });
    }
    console.log(brand);
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  function getFileIcon(data_type, data_image) {
    switch (data_type) {
      case "pdf":
        return <img src={pdf} alt="PDF" style={{ width: "32%" }} />;
      case "mp4":
        return (
          <>
            <iframe
              title="Video"
              width="100%"
              height="100%"
              src={data_image}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </>
        );
      case "xls":
      case "xlsx":
        return <img src={sheets} alt="Excel" style={{ width: "32%" }} />;
      default:
        return <img src={data_image} alt="Excel" style={{ width: "100%" }} />;
    }
  }

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg ">
          <div className="container">
            <FormContainer
              mainTitle="Data"
              title="Data"
              // handleSubmit={handleSubmit}
              submitButton={false}
            >
              <FieldContainer
                label="Brand Name"
                type="text"
                value={brand}
                disabled
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />

              <div className="row">
                {logos.map((detail, index) => (
                  <div
                    key={index}
                    className="col-md-3 card"
                    style={{ margin: "0 0 10px 0" }}
                  >
                    <div>
                      {getFileIcon(detail.data_type, detail.data_image?detail.data_image:detail.mmc_image?detail.mmc_image:detail.sarcasm_image?detail.sarcasm_image:detail.no_logo_image)}
                    </div>
                    <div className="card-body"></div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        Extension - {detail.data_type}
                      </li>
                      {/* <li className="list-group-item">
                        Resolution - {detail.size}
                      </li> */}
                      <li className="list-group-item">
                        Size - {detail.size_in_mb}
                      </li>
                      <li className="list-group-item">
                        Category - {detail.category_name}
                      </li>
                      <li className="list-group-item">
                        Sub category - {detail.sub_category_name}
                      </li>
                      <li className="list-group-item">
                        Content type - {detail.content_type_name}
                      </li>
                      <li className="list-group-item">
                        Brand Name - {detail.brand_name}
                      </li>
                      <li className="list-group-item">
                        Platform - {detail.platform_name}
                      </li>
                      <li className="list-group-item">
                        Designed By - {detail?.designed_by_name}
                      </li>
                    </ul>
                    <div className="card-body">
                      <button type="button" className="btn btn-success">
                        <a
                          href={detail.data_image_download}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={detail.data_image_download}
                        >
                          {" "}
                          Download{" "}
                        </a>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </FormContainer>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 0 0 10%", width: "80%" }}></div>
    </>
  );
};

export default DataBrandView;
