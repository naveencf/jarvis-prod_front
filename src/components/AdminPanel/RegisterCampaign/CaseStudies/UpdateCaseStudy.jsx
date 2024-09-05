import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { MdCancel } from "react-icons/md";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import Select from "react-select";

import { baseUrl } from "../../../../utils/config";
import UserNav from "../../../Pantry/UserPanel/UserNav";
import { useGlobalContext } from "../../../../Context/Context";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const UpdateCaseStudy = () => {
  const [fileDetails, setFileDetails] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [permanentBrand, setPermanentBrand] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState([]);
  const [logos, setLogos] = useState([]);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [remark, setRemark] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [category, setCategory] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [platform, setPlateform] = useState("");
  const [platformData, setPlateformData] = useState([]);
  const [contentType, setContentType] = useState("");
  const [dataBrand, setDataBrand] = useState("");
  const [dataBrandData, setDataBrandData] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState("");

  const [error, setError] = useState("");
  const [dataId, setDataId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [brandCategory, setBrandCategory] = useState([]);
  const [brandSubCatData, setBrandSubCatData] = useState([]);
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [dateOfReport, setDateOfReport] = useState("");
  const [brandCat, setBrandCat] = useState("");
  const [brandSubCategory, setBrandSubCategory] = useState("");
  const [compignPurpose, setCompignPurpose] = useState("");
  const [NumOfPost, setNumOfPost] = useState("");
  const [NumOfReach, setNumOfReach] = useState("");
  const [NumOfImpression, setNumOfImpression] = useState("");
  const [NumOfEngagement, setNumOfEngagement] = useState("");
  const [NumOfViews, setNumOfViews] = useState("");
  const [NumOfStoryViews, setNumOfStoryViews] = useState("");
  const [OperationRemark, setOperationRemark] = useState("");
  const [nologoImages, setNologoImages] = useState([]);
  const [nologoDetails, setNologoDetails] = useState([]);
  const [mmcImages, setMMCImages] = useState([]);
  const [mmcDetails, setMMCDetails] = useState([]);
  const [sarcasmImages, setSarcasmImages] = useState([]);
  const [sarcasmDetails, setSarcasmDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenSubCat, setIsModalOpenSubCat] = useState(false);
  const [cat, setCat] = useState("");
  const [postData, setPostData] = useState({
    sub_category_name: "",
    category_id: "",
  });

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

  const callAbvApi = async () => {
    axios.get(baseUrl + "dataoperation").then((res) => {
      setAllData(res.data);
      res.data
        .filter((detail) => {
          return detail.data_id == logos[0]?.data_id;
        })
        .map((detail, index) => {
          setFileDetails(detail);
          return detail;
        });
    });
  };

  useEffect(() => {
    callAbvApi();
  }, [logos]);

  const HandleNAFileChangeOnChange = (e) => {
    const value = e.target.value;

    if (value === "" || value === "NA" || /^\d+$/.test(value)) {
      return value;
    } else if (
      value.length === 3 &&
      value.includes("NA") &&
      typeof +value.split("NA")[1] === "number"
    ) {
      // If the input is neither empty, 'NA', nor a valid number, set it to 'NA'

      return value.split("NA")[1];
    } else if (!value.includes("NA")) {
      return "NA";
    } else if (value.length === 0) {
      return "";
    }
  };

  const handleNaFileChangeOnBlur = (e) => {
    if (e.target.value === "") {
      return "NA";
    } else if (isNaN(Number(e.target.value))) {
      // If the value is not a valid number, set it to 'NA'
      return "NA";
    }
    return e.target.value;
  };

  useEffect(() => {
    axios.get(`${baseUrl}` + `dataoperation/${id}`).then((res) => {
      const fetchedData = res.data;
      const {
        data_name,
        data_id,
        date_of_completion,
        date_of_report,
        brand_category_id,
        brand_sub_category_id,
        campaign_purpose,
        number_of_post,
        number_of_reach,
        number_of_impression,
        number_of_engagement,
        number_of_views,
        operation_remark,
        number_of_story_views,
      } = fetchedData;
      setDateOfCompletion(date_of_completion);
      setDateOfReport(date_of_report);
      setBrandCat(brand_category_id);
      setBrandSubCategory(brand_sub_category_id);
      setCompignPurpose(campaign_purpose);
      setNumOfPost(number_of_post);
      setNumOfReach(number_of_reach);
      setNumOfImpression(number_of_impression);
      setNumOfEngagement(number_of_engagement);
      setNumOfViews(number_of_views);
      setOperationRemark(operation_remark);
      setNumOfStoryViews(number_of_story_views);
      setBrand(data_name);
      setPermanentBrand(data_name);
      setDataId(data_id);
      setBrandName(data_name);

      // setLogo(upload_logo);
      // setRemark(remark);
      // setCategory(cat_name);
      // setBrandData(fetchedData);
    });

    axios.get(baseUrl + "get_all_data_platforms").then((res) => {
      setPlateformData(res.data);
    });

    axios.get(baseUrl + "get_brands").then((res) => {
      setDataBrandData(res.data.data);
    });

    const today = new Date();
    const formattedDate = formatDate(today);
    setCurrentDate(formattedDate);
    axios
      .get(baseUrl + "projectxCategory")
      .then((res) => {
        setBrandCategory(res.data.data);
      })
      .catch(() => {});
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      setBrandSubCatData(res.data.data);
    });
  }, [id]);

  const getCombinedData = async () => {
    if (dataId) {
      axios
        .get(
          `${baseUrl}` + `get_data_operation_based_data_name_new/${brandName}`
        )
        .then((res) => {
          setLogos(() => res.data);
          setLogo(res.data);
          setCategory(res.data[0]?.cat_id);
          setDataSubCategory(res.data[0]?.sub_cat_id);
          setPlateform(res.data[0]?.platform_ids);
          setContentType(res.data[0]?.content_type_id);
          setDataBrand(res.data[0]?.brand_id);
          setRemark(res.data[0]?.remark);
        });
    }
  };

  useEffect(() => {
    getCombinedData();
  }, [brand]);

  const removeImage = async (_id, data_id) => {
    if (id == data_id) {
      toastError(
        "You can't delete default data type, try to delete data instead"
      );
      return;
    }
    if (_id == id) {
      setError(
        "You can't delete default data type, try to delete data instead"
      );
    } else {
      var data = await axios.delete(
        `${baseUrl}` + `dataoperation/${_id}`,
        null
      );
      if (data) {
        getCombinedData();
      }
    }
  };

  const removeAddedImage = async (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    console.log(dataSubCategory, "subcat");
    console.log(brandCat, "brandCat");
    console.log(brandSubCategory, "brandSubCategory");
    console.log(compignPurpose, "compignPurpose");
    console.log(NumOfPost, "NumOfPost");
    console.log(NumOfReach, "NumOfReach");
    console.log(NumOfImpression, "NumOfImpression");
    console.log(NumOfEngagement, "NumOfEngagement");
    console.log(NumOfViews, "NumOfViews");
    console.log(NumOfStoryViews, "NumOfStoryViews");
    console.log(OperationRemark, "OperationRemark");

    e.preventDefault();
    // return;
    if (contentType == "") {
      toastError("Content type is required");
    } else if (dataBrand == "") {
      toastError("Brand is required");
    }
    if (contentType == "65a663ccef8a81593f418836") {
      if (dateOfCompletion == "") {
        toastError("Date of completion is required");
        return;
      } else if (dateOfReport == "") {
        toastError("Date of report is required");
        return;
      } else if (brandCat == "") {
        toastError("Brand category is required");
        return;
      } else if (brandSubCategory == "") {
        toastError("Brand sub category is required");
        return;
      } else if (compignPurpose == "") {
        toastError("Campaign purpose is required");
        return;
      } else if (NumOfPost == "") {
        toastError("Number of post is required");
        return;
      } else if (NumOfReach == "") {
        toastError("Number of reach is required");
        return;
      } else if (NumOfImpression == "") {
        toastError("Number of impression is required");
        return;
      } else if (NumOfEngagement == "") {
        toastError("Number of engagement is required");
        return;
      } else if (NumOfViews == "") {
        toastError("Number of views is required");
        return;
      } else if (NumOfStoryViews == "") {
        toastError("Number of story views is required");
        return;
      } else if (OperationRemark == "") {
        toastError("Operation remark is required");
        return;
      }
    }

    try {
      if (
        category &&
        platform &&
        contentType &&
        dataBrand &&
        brand &&
        dataSubCategory
      ) {
        setIsLoading(true);
      }
      if (details.length == 0) {
        await axios
          .put(baseUrl + "editdataoperationname", {
            data_id: +id,
            data_name: brandName,
            remark: remark,
            cat_id: category,
            sub_cat_id: dataSubCategory,
            platform_ids: platform,
            brand_id: dataBrand,
            content_type_id: contentType,
            date_of_completion: dateOfCompletion,
            date_of_report: dateOfReport,
            brand_category_id: brandCat,
            brand_sub_category_id: brandSubCategory,
            campaign_purpose: compignPurpose,
            number_of_post: NumOfPost,
            number_of_reach: NumOfReach,
            number_of_impression: NumOfImpression,
            number_of_engagement: NumOfEngagement,
            number_of_views: NumOfViews,
            number_of_story_views: NumOfStoryViews,
            operation_remark: OperationRemark,
          })
          .then(() => {})
          .catch((err) => {
            console.log(err, "err");
          });
      } else {
        for (let i = 0; i < details.length; i++) {
          const formData = new FormData();
          formData.append("data_id", +id);
          formData.append("data_name", brandName);
          formData.append("remark", remark);
          formData.append("data_type", details[i].fileType);
          formData.append("size_in_mb", details[i].sizeInMB);
          formData.append("cat_id", category);
          formData.append("sub_cat_id", dataSubCategory);
          formData.append("platform_ids", platform);
          formData.append("brand_id", dataBrand);
          formData.append("content_type_id", contentType);
          formData.append("data_upload", images[i]);
          await axios
            .post(baseUrl + "dataoperation", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {})
            .catch((err) => {
              console.log(err, "err");
            });
        }
      }

      if (mmcDetails.length > 0) {
        for (let i = 0; i < mmcDetails.length; i++) {
          const formData = new FormData();
          formData.append("data_id", +id);
          formData.append("data_name", brandName);
          formData.append("remark", remark);
          formData.append("data_type", mmcDetails[i].fileType);
          formData.append("size_in_mb", mmcDetails[i].sizeInMB);
          formData.append("cat_id", category);
          formData.append("sub_cat_id", dataSubCategory);
          formData.append("platform_ids", platform);
          formData.append("brand_id", dataBrand);
          formData.append("content_type_id", contentType);
          formData.append("mmc", mmcImages[i]);
          await axios
            .post(baseUrl + "dataoperation", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {})
            .catch((err) => {
              console.log(err, "err");
            });
        }
      }

      if (sarcasmDetails.length > 0) {
        for (let i = 0; i < sarcasmDetails.length; i++) {
          const formData = new FormData();
          formData.append("data_id", +id);
          formData.append("data_name", brandName);
          formData.append("remark", remark);
          formData.append("data_type", sarcasmDetails[i].fileType);
          formData.append("size_in_mb", sarcasmDetails[i].sizeInMB);
          formData.append("cat_id", category);
          formData.append("sub_cat_id", dataSubCategory);
          formData.append("platform_ids", platform);
          formData.append("brand_id", dataBrand);
          formData.append("content_type_id", contentType);
          formData.append("sarcasm", sarcasmImages[i]);
          await axios

            .post(baseUrl + "dataoperation", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {})
            .catch((err) => {
              console.log(err, "err");
            });
        }
      }

      if (nologoDetails.length > 0) {
        for (let i = 0; i < nologoDetails.length; i++) {
          const formData = new FormData();
          formData.append("data_id", +id);
          formData.append("data_name", brandName);
          formData.append("remark", remark);

          formData.append("data_type", nologoDetails[i].fileType);
          formData.append("size_in_mb", nologoDetails[i].sizeInMB);
          formData.append("cat_id", category);
          formData.append("sub_cat_id", dataSubCategory);
          formData.append("platform_ids", platform);
          formData.append("brand_id", dataBrand);
          formData.append("content_type_id", contentType);
          formData.append("no_logo", nologoImages[i]);
          await axios
            .post(baseUrl + "dataoperation", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {})
            .catch((err) => {
              console.log(err, "err");
            });
        }
      }

      setIsFormSubmitted(true);
      toastAlert("Data uploaded");
      setBrand("");
      setLogo("");
      setImage("");
      setSize("");
      setRemark("");
      setDateOfCompletion("");
      setDateOfReport("");
      setBrandCat("");
      setBrandSubCategory("");
      setCompignPurpose("");
      setNumOfPost("");
      setNumOfReach("");
      setNumOfImpression("");
      setNumOfEngagement("");
      setNumOfViews("");
      setNumOfStoryViews("");
      setOperationRemark("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading state to false after API call completes
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);

    const details = files.map((file) => {
      const { name, size } = file;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      const fileType = name.split(".").pop().toLowerCase();

      if (
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "gif"
      ) {
        // It's an image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          img.onload = () => {
            const { naturalHeight, naturalWidth } = img;
            resolve({
              name,
              file,
              fileType,
              size: `${naturalHeight}x${naturalWidth}`,
              sizeInMB: `${sizeInMB}`,
            });
          };
        });
      } else {
        // For other file types like PDF, video, Excel
        return Promise.resolve({
          name,
          file,
          fileType,
          size: "N/A", // Size is not applicable in the same way as for images
          sizeInMB: `${sizeInMB}`,
        });
      }
    });

    Promise.all(details).then((detailsArray) => {
      setDetails(detailsArray);
    });
  };

  const handleMMCFileChange = (event) => {
    const files = Array.from(event.target.files);
    setMMCImages(files);

    const details = files.map((file) => {
      const { name, size } = file;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      const fileType = name.split(".").pop().toLowerCase();

      if (
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "gif"
      ) {
        // It's an image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          img.onload = () => {
            const { naturalHeight, naturalWidth } = img;
            resolve({
              name,
              file,
              fileType,
              size: `${naturalHeight}x${naturalWidth}`,
              sizeInMB: `${sizeInMB}`,
            });
          };
        });
      } else {
        // For other file types like PDF, video, Excel
        return Promise.resolve({
          name,
          file,
          fileType,
          size: "N/A", // Size is not applicable in the same way as for images
          sizeInMB: `${sizeInMB}`,
        });
      }
    });

    Promise.all(details).then((detailsArray) => {
      setMMCDetails(detailsArray);
    });
  };

  const handleSarcasmFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSarcasmImages(files);

    const details = files.map((file) => {
      const { name, size } = file;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      const fileType = name.split(".").pop().toLowerCase();

      if (
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "gif"
      ) {
        // It's an image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          img.onload = () => {
            const { naturalHeight, naturalWidth } = img;
            resolve({
              name,
              file,
              fileType,
              size: `${naturalHeight}x${naturalWidth}`,
              sizeInMB: `${sizeInMB}`,
            });
          };
        });
      } else {
        // For other file types like PDF, video, Excel
        return Promise.resolve({
          name,
          file,
          fileType,
          size: "N/A", // Size is not applicable in the same way as for images
          sizeInMB: `${sizeInMB}`,
        });
      }
    });

    Promise.all(details).then((detailsArray) => {
      setSarcasmDetails(detailsArray);
    });
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleClickSubCat = () => {
    setIsModalOpenSubCat(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "projectxCategory", {
        category_name: cat,
      })
      .then((response) => {
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Add successfully");
        }
        setIsModalOpen(false);
        getCat();
        setCat("");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError("Add Properly");
      });
    setIsModalOpen(false);
  };

  const getCat = () => {
    axios
      .get(baseUrl + "projectxCategory")
      .then((res) => {
        setBrandCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSubCat = () => {
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      setBrandSubCatData(res.data.data);
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleNologoFileChange = (event) => {
    // setFileDetails((prev) => [...prev, event.target.files]);
    const files = Array.from(event.target.files);
    setNologoImages(files);

    const details = files.map((file) => {
      const { name, size } = file;
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      const fileType = name.split(".").pop().toLowerCase();

      if (
        fileType === "jpg" ||
        fileType === "jpeg" ||
        fileType === "png" ||
        fileType === "gif"
      ) {
        // It's an image
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return new Promise((resolve) => {
          img.onload = () => {
            const { naturalHeight, naturalWidth } = img;
            resolve({
              name,
              file,
              fileType,

              size: `${naturalHeight}x${naturalWidth}`,
              sizeInMB: `${sizeInMB}`,
            });
          };
        });
      } else {
        // For other file types like PDF, video, Excel
        return Promise.resolve({
          name,
          file,
          fileType,
          size: "N/A", // Size is not applicable in the same way as for images
          sizeInMB: `${sizeInMB}`,
        });
      }
    });

    Promise.all(details).then((detailsArray) => {
      setNologoDetails(detailsArray);
    });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/operation/case-study" />;
  }

  const renderFileIcon = (fileType, src, detail) => {
    switch (fileType) {
      case "pdf":
        // return <img src={pdf} alt="PDF" style={{ width: "32%" }} />;
        return (
          <div style={{ position: "relative", width: "45%", height: "auto" }}>
            {" "}
            {/* Adjust the height as needed */}
            <iframe
              allowFullScreen={true}
              src={src}
              title="PDF Viewer"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                overflow: "hidden",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                cursor: "pointer",
                background: "rgba(0, 0, 0, 0)", // This makes the div transparent
                zIndex: 10, // This ensures the div is placed over the iframe
              }}
            ></div>
          </div>
        );
      case "mp4":
        return (
          <video className="mt-5" controls width="45%" height="auto">
            <source src={src} type={`video/${fileType}`} />
            Your browser does not support the video tag.
          </video>
        );
      case "xls":
      case "xlsx":
        return <img src={sheets} alt="Excel" style={{ width: "32%" }} />;
      default:
        return <i className="fa fa-file"></i>;
    }
  };

  const handleSaveSubCat = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "projectxSubCategory", postData)
      .then((response) => {
        if (response.data.success === false) {
          toastError(response.data.message);
        } else {
          toastAlert("Add successfully");
        }
        postData.sub_category_name = "";
        console.log("Data saved:", response.data);
        setIsModalOpenSubCat(false);
        getSubCat();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toastError("Add Properly");
      });
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <FormContainer
              mainTitle="Case Study"
              title="Case Study"
              // handleSubmit={handleSubmit}
              submitButton={false}
              isLoading={isLoading}
            >
              <FieldContainer
                label="CreativeFuel "
                type="file"
                multiple
                accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
                onChange={handleFileChange}
                fieldGrid={6}
                required={false}
              />
              <>
                <FieldContainer
                  label="MMC "
                  type="file"
                  multiple
                  accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
                  onChange={handleMMCFileChange}
                  fieldGrid={6}
                  required={false}
                />
                <FieldContainer
                  label="Sarcasm "
                  multiple
                  type="file"
                  accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
                  onChange={handleSarcasmFileChange}
                  fieldGrid={6}
                  required={false}
                />
                <FieldContainer
                  label="No Logo "
                  multiple
                  type="file"
                  accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
                  onChange={handleNologoFileChange}
                  fieldGrid={6}
                  required={false}
                />
              </>

              <div className="form-group col-3">
                <label className="form-label">
                  Platform Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  isMulti
                  options={platformData.map((opt) => ({
                    value: opt._id,
                    label: opt.platform_name,
                  }))}
                  value={platformData
                    .filter((opt) => platform?.includes(opt._id))
                    .map((opt) => ({
                      value: opt._id,
                      label: opt.platform_name,
                    }))}
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map(
                      (option) => option.value
                    );
                    setPlateform(selectedValues);
                  }}
                  required
                />
              </div>

              <div className="form-group col-3">
                <label className="form-label">
                  Brand <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={dataBrandData.map((opt) => ({
                    value: opt._id,
                    label: opt.brand_name,
                  }))}
                  value={{
                    value: dataBrand,
                    label:
                      dataBrandData.find((user) => user._id === dataBrand)
                        ?.brand_name || "",
                  }}
                  onChange={(e) => {
                    setDataBrand(e.value);
                  }}
                  required
                />
              </div>
              <>
                <div className="form-group col-3">
                  <label className="form-label">
                    Date of Completion <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfCompletion}
                    onChange={(e) => setDateOfCompletion(e.target.value)}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Date of Report <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfReport}
                    onChange={(e) => setDateOfReport(e.target.value)}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">
                    Brand Category <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={brandCategory.map((opt) => ({
                      value: opt.category_id,
                      label: opt.category_name,
                    }))}
                    value={{
                      value: brandCat,
                      label:
                        brandCategory.find(
                          (brand) => brand.category_id == brandCat
                        )?.category_name || "",
                    }}
                    onChange={(e) => {
                      setBrandCat(e.value);
                      setBrandSubCategory("");
                    }}
                  />
                </div>
                <div className="col-1 mt-4">
                  <Button
                    title="Add Category"
                    variant="contained"
                    onClick={handleClick}
                  >
                    <Add />
                  </Button>
                </div>
                <div className="form-group col-3">
                  <label className="form-label">
                    Brand Sub Category <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={brandSubCatData
                      .filter((opt) => opt.category_id == brandCat)
                      .map((opt) => ({
                        value: opt.sub_category_id,
                        label: opt.sub_category_name,
                      }))}
                    value={{
                      value: brandSubCategory,
                      label:
                        brandSubCatData.find(
                          (e) => e.sub_category_id == brandSubCategory
                        )?.sub_category_name || "",
                    }}
                    onChange={(e) => {
                      setBrandSubCategory(e.value);
                    }}
                  />
                </div>
                <div className="col-1 mt-4">
                  <Button
                    title="Add Sub Category"
                    variant="contained"
                    onClick={handleClickSubCat}
                  >
                    <Add />
                  </Button>
                </div>
                <div className="form-group col-3">
                  <label className="form-label">
                    Campaign Purpose <sup style={{ color: "red" }}>*</sup>
                  </label>

                  <input
                    className="form-control"
                    value={compignPurpose}
                    onChange={(e) => setCompignPurpose(e.target.value)}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Number of Post <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    className="form-control"
                    value={NumOfPost}
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value))) {
                        setNumOfPost(e.target.value);
                      }
                    }}
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">Number of Reach</label>
                  <input
                    className="form-control"
                    value={NumOfReach}
                    onChange={(e) => {
                      setNumOfReach(HandleNAFileChangeOnChange(e));
                    }}
                    onBlur={(e) => {
                      setNumOfReach(handleNaFileChangeOnBlur(e));
                    }}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Number of Impression</label>
                  <input
                    className="form-control"
                    value={NumOfImpression}
                    onChange={(e) =>
                      setNumOfImpression(HandleNAFileChangeOnChange(e))
                    }
                    onBlur={(e) => {
                      setNumOfImpression(handleNaFileChangeOnBlur(e));
                    }}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Number of Engagement</label>
                  <input
                    className="form-control"
                    value={NumOfEngagement}
                    onChange={(e) =>
                      setNumOfEngagement(HandleNAFileChangeOnChange(e))
                    }
                    onBlur={(e) => {
                      setNumOfEngagement(handleNaFileChangeOnBlur(e));
                    }}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Number of views</label>
                  <input
                    className="form-control"
                    value={NumOfViews}
                    onChange={(e) =>
                      setNumOfViews(HandleNAFileChangeOnChange(e))
                    }
                    onBlur={(e) => {
                      setNumOfViews(handleNaFileChangeOnBlur(e));
                    }}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Number of Story Views</label>
                  <input
                    className="form-control"
                    value={NumOfStoryViews}
                    onChange={(e) =>
                      setNumOfStoryViews(HandleNAFileChangeOnChange(e))
                    }
                    onBlur={(e) => {
                      setNumOfStoryViews(handleNaFileChangeOnBlur(e));
                    }}
                  />
                </div>
                <div className="form-group col-3">
                  <label className="form-label">Operation Remark</label>
                  <input
                    className="form-control"
                    value={OperationRemark}
                    // onChange={(e) =>
                    //   setOperationRemark(HandleNAFileChangeOnChange(e))
                    // }
                    // onBlur={(e) => {
                    //   setOperationRemark(handleNaFileChangeOnBlur(e));
                    // }}
                    onChange={(e) => setOperationRemark(e.target.value)}
                  />
                </div>
              </>

              <div className="summary_cards brand_img_list">
                <h4 className="lead text-black-50 fs-6">Data</h4>
                {console.log(logos, "logos")}
                {logos.length > 0 &&
                  logos
                    ?.filter((e) => e.data_image !== null)
                    .map((detail, index) => (
                      <div key={index} className="summary_card brand_img_item">
                        <div className="summary_cardrow brand_img_row">
                          <div className="col summary_box brand_img_box">
                            {detail.data_type === "jpg" ||
                            detail.data_type === "jpeg" ||
                            detail.data_type === "png" ||
                            detail.data_type === "gif" ? (
                              <img
                                className="brandimg_icon"
                                src={detail.data_image}
                              />
                            ) : detail.data_type === "pdf" ? (
                              <iframe
                                src={detail.data_image}
                                width="50%"
                                height="50%"
                              ></iframe>
                            ) : (
                              <video width="50%" height="50%" controls>
                                <source
                                  src={detail.data_image}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                            {/* <img
                              className="brandimg_icon"
                              // src={detail.data_image}
                              src={
                                detail.data_type === "jpg" ||
                                detail.data_type === "jpeg" ||
                                detail.data_type === "png" ||
                                detail.data_type === "gif"
                                  ? detail.data_image
                                  : detail.data_type === "pdf"
                                  ? pdf
                                  : video
                              }
                            /> */}
                          </div>
                          <div className="col summary_box brand_img_box">
                            <h4>
                              <span>Extension:</span>
                              {detail.data_type}
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
                              <span>Date:</span>
                              {detail.created_at.split("T")[0]}
                            </h4>
                          </div>
                          <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                            <p>
                              {" "}
                              <MdCancel
                                onClick={() =>
                                  removeImage(detail._id, detail.data_id)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                {details.slice(0, images.length).map((detail, index) => (
                  <div key={index} className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box col140">
                        {detail.fileType === "jpg" ||
                        detail.fileType === "jpeg" ||
                        detail.fileType === "png" ||
                        detail.fileType === "gif" ? (
                          <img
                            className="brandimg_icon"
                            src={
                              images[index]
                                ? URL.createObjectURL(images[index])
                                : ""
                            }
                            alt={`Image ${index + 1}`}
                          />
                        ) : (
                          <div className="file_icon">
                            {renderFileIcon(
                              detail.fileType,
                              URL.createObjectURL(images[index]),
                              detail
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
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
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeAddedImage(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary_cards brand_img_list">
                <h4 className="lead text-black-50 fs-6 mt-3">MMC</h4>
                {logos.length > 0 &&
                  logos
                    ?.filter((e) => e.mmc_image !== null)
                    .map((detail, index) => (
                      <div key={index} className="summary_card brand_img_item">
                        <div className="summary_cardrow brand_img_row">
                          <div className="col summary_box brand_img_box">
                            {detail.data_type === "jpg" ||
                            detail.data_type === "jpeg" ||
                            detail.data_type === "png" ||
                            detail.data_type === "gif" ? (
                              <img
                                className="brandimg_icon"
                                src={detail.mmc_image}
                              />
                            ) : detail.data_type === "pdf" ? (
                              <iframe
                                src={detail.mmc_image}
                                width="50%"
                                height="50%"
                              ></iframe>
                            ) : (
                              <video width="50%" height="50%" controls>
                                <source
                                  src={detail.mmc_image}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                          </div>
                          <div className="col summary_box brand_img_box">
                            <h4>
                              <span>Extension:</span>
                              {detail.data_type}
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
                              <span>Date:</span>
                              {detail.created_at.split("T")[0]}
                            </h4>
                          </div>
                          <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                            <p>
                              {" "}
                              <MdCancel
                                onClick={() =>
                                  removeImage(detail._id, detail.data_id)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                {mmcDetails.map((detail, index) => (
                  <div key={index} className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box col140">
                        {detail.fileType === "jpg" ||
                        detail.fileType === "jpeg" ||
                        detail.fileType === "png" ||
                        detail.fileType === "gif" ? (
                          <img
                            className="brandimg_icon"
                            src={
                              mmcImages[index]
                                ? URL.createObjectURL(mmcImages[index])
                                : ""
                            }
                            alt={`Image ${index + 1}`}
                          />
                        ) : (
                          <div className="file_icon">
                            {renderFileIcon(
                              detail.fileType,
                              URL.createObjectURL(mmcImages[index]),
                              detail
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
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
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeAddedImage(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary_cards brand_img_list">
                <h4 className="lead text-black-50 fs-6 mt-2">Sarcasm</h4>
                {logos.length > 0 &&
                  logos
                    ?.filter((e) => e.sarcasm_image !== null)
                    .map((detail, index) => (
                      <div key={index} className="summary_card brand_img_item">
                        <div className="summary_cardrow brand_img_row">
                          <div className="col summary_box brand_img_box">
                            {detail.data_type === "jpg" ||
                            detail.data_type === "jpeg" ||
                            detail.data_type === "png" ||
                            detail.data_type === "gif" ? (
                              <img
                                className="brandimg_icon"
                                src={detail.sarcasm_image}
                              />
                            ) : detail.data_type === "pdf" ? (
                              <iframe
                                src={detail.sarcasm_image}
                                width="50%"
                                height="50%"
                              ></iframe>
                            ) : (
                              <video width="50%" height="50%" controls>
                                <source
                                  src={detail.sarcasm_image}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                          </div>
                          <div className="col summary_box brand_img_box">
                            <h4>
                              <span>Extension:</span>
                              {detail.data_type}
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
                              <span>Date:</span>
                              {detail.created_at.split("T")[0]}
                            </h4>
                          </div>
                          <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                            <p>
                              {" "}
                              <MdCancel
                                onClick={() =>
                                  removeImage(detail._id, detail.data_id)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                {sarcasmDetails.map((detail, index) => (
                  <div key={index} className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box col140">
                        {detail.fileType === "jpg" ||
                        detail.fileType === "jpeg" ||
                        detail.fileType === "png" ||
                        detail.fileType === "gif" ? (
                          <img
                            className="brandimg_icon"
                            src={
                              sarcasmImages[index]
                                ? URL.createObjectURL(sarcasmImages[index])
                                : ""
                            }
                            alt={`Image ${index + 1}`}
                          />
                        ) : (
                          <div className="file_icon">
                            {renderFileIcon(
                              detail.fileType,
                              URL.createObjectURL(sarcasmImages[index]),
                              detail
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
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
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeAddedImage(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary_cards brand_img_list">
                <h4 className="lead text-black-50 fs-6">No Logo</h4>
                {logos.length > 0 &&
                  logos
                    ?.filter((e) => e.no_logo_image !== null)
                    .map((detail, index) => (
                      <div key={index} className="summary_card brand_img_item">
                        <div className="summary_cardrow brand_img_row">
                          <div className="col summary_box brand_img_box">
                            {detail.data_type === "jpg" ||
                            detail.data_type === "jpeg" ||
                            detail.data_type === "png" ||
                            detail.data_type === "gif" ? (
                              <img
                                className="brandimg_icon"
                                src={detail.no_logo_image}
                              />
                            ) : detail.data_type === "pdf" ? (
                              <iframe
                                src={detail.no_logo_image}
                                width="50%"
                                height="50%"
                              ></iframe>
                            ) : (
                              <video width="50%" height="50%" controls>
                                <source
                                  src={detail.no_logo_image}
                                  type="video/mp4"
                                />
                              </video>
                            )}
                          </div>
                          <div className="col summary_box brand_img_box">
                            <h4>
                              <span>Extension:</span>
                              {detail.data_type}
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
                              <span>Date:</span>
                              {detail.created_at.split("T")[0]}
                            </h4>
                          </div>
                          <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                            <p>
                              {" "}
                              <MdCancel
                                onClick={() =>
                                  removeImage(detail._id, detail.data_id)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                {nologoDetails.map((detail, index) => (
                  <div key={index} className="summary_card brand_img_item">
                    <div className="summary_cardrow brand_img_row">
                      <div className="col summary_box brand_img_box col140">
                        {detail.fileType === "jpg" ||
                        detail.fileType === "jpeg" ||
                        detail.fileType === "png" ||
                        detail.fileType === "gif" ? (
                          <img
                            className="brandimg_icon"
                            src={
                              nologoImages[index]
                                ? URL.createObjectURL(nologoImages[index])
                                : ""
                            }
                            alt={`Image ${index + 1}`}
                          />
                        ) : (
                          <div className="file_icon">
                            {renderFileIcon(
                              detail.fileType,
                              URL.createObjectURL(nologoImages[index]),
                              detail
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col summary_box brand_img_box">
                        <h4>
                          <span>Extension:</span>
                          {detail.image_type}
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
                      <div className="col brand_img_box ml-auto mr-0 summary_box brand_img_delete">
                        <p>
                          {" "}
                          <MdCancel
                            onClick={() => removeAddedImage(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </p>
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
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              onClick={handleSubmit}
            >
          {isLoading ? "Please wait data uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>

      {/* add Category */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-password-input"
                label="Category"
                name="category_name"
                type="text"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* add sub Category */}
      <Dialog
        open={isModalOpenSubCat}
        onClose={() => setIsModalOpenSubCat(false)}
      >
        <DialogTitle>Add Record</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={brandCategory.map((option) => ({
                  label: option.category_name,
                  value: option.category_id,
                }))}
                onChange={(event, value) => {
                  setPostData((prev) => ({
                    ...prev,
                    category_id: value.value,
                  }));
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Category *" />
                )}
              />

              <TextField
                id="outlined-password-input"
                label="Sub Category *"
                name="sub_category_name"
                type="text"
                value={postData.sub_category_name}
                onChange={handleChange}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveSubCat} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateCaseStudy;
