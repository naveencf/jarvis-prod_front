import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import pdf from "./pdf-file.png";
import sheets from "./sheets.png";
import video from "./montage.png";
import Select from "react-select";
import ImgDialogBox from "./ImgDialogBox";
import { Add, CloseTwoTone } from "@mui/icons-material";
import { baseUrl } from "../../utils/config";
import { set } from "date-fns";

const DataBrandMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [subCatData, setSubCategoryData] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
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
  const [platform, setPlateform] = useState("");
  const [platformData, setPlateformData] = useState([]);
  const [contentType, setContentType] = useState("");
  const [contentTypeData, setContentTypeData] = useState([]);
  const [dataBrand, setDataBrand] = useState("");
  const [dataBrandData, setDataBrandData] = useState([]);
  // const [dataSubCategory, setDataSubCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [dataSubCategoryData, setDataSubCategoryData] = useState([]);
  const [designedBy, setDesignedBy] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openReviewDisalog, setOpenReviewDisalog] = useState({
    open: false,
    image: "",
    detail: {},
  });
  const [files, setFiles] = useState([]);
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [dateOfReport, setDateOfReport] = useState("");
  const [compignPurpose, setCompignPurpose] = useState("");
  const [NumOfPost, setNumOfPost] = useState("");
  const [NumOfReach, setNumOfReach] = useState("NA");
  const [NumOfImpression, setNumOfImpression] = useState("NA");
  const [NumOfEngagement, setNumOfEngagement] = useState("NA");
  const [NumOfViews, setNumOfViews] = useState("NA");
  const [NumOfStoryViews, setNumOfStoryViews] = useState("NA");
  const [OperationRemark, setOperationRemark] = useState("NA");
  const [brandCategory, setBrandCategory] = useState([]);
  const [brandSubCategory, setBrandSubCategory] = useState("");
  const [brandCat, setBrandCat] = useState("");
  const [brandSubCatData, setBrandSubCatData] = useState([]);
  const [nologoImages, setNologoImages] = useState([]);
  const [nologoDetails, setNologoDetails] = useState([]);
  const [mmcImages, setMMCImages] = useState([]);
  const [mmcDetails, setMMCDetails] = useState([]);
  const [sarcasmImages, setSarcasmImages] = useState([]);
  const [sarcasmDetails, setSarcasmDetails] = useState([]);

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
    axios.get(baseUrl + "get_all_users").then((res) => {
      const allUsers = res.data.data;
      const filteredUsers = allUsers.filter((user) => user.dept_id == 49);
      setEmployeeData(filteredUsers);
    });

    axios.get(baseUrl + "get_all_data_platforms").then((res) => {
      setPlateformData(res.data);
    });
    axios.get(baseUrl + "get_all_data_content_types").then((res) => {
      setContentTypeData(res.data);
    });
    axios.get(baseUrl + "get_all_data_brands").then((res) => {
      setDataBrandData(res.data);
    });
    axios
      .get(baseUrl + "projectxCategory")
      .then((res) => {
        setBrandCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      setBrandSubCatData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (category) {
      axios
        .get(`${baseUrl}` + `get_single_data_from_sub_category/${category}`)
        .then((res) => {
          setDataSubCategoryData(res.data);
        });
    }
  }, [category]);

  useEffect(() => {
    axios
      .get(baseUrl + "get_all_data_categorys")
      .then((res) => setCategoryData(res.data.simcWithSubCategoryCount));

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

  const HandleNAFileChangeOnChange = (e) => {
    const value = e.target.value;

    // Allow only empty string, 'NA', or a valid number
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

  const handleFileChange = (event) => {
    setFileDetails((prev) => [...prev, event.target.files]);
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
    setFileDetails((prev) => [...prev, event.target.files]);
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
    setFileDetails((prev) => [...prev, event.target.files]);
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

  const handleNologoFileChange = (event) => {
    setFileDetails((prev) => [...prev, event.target.files]);
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

  const handleSubmit = async (e) => {
    if (category == "") {
      toastError("Category is required");
    } else if (dataSubCategory == "") {
      toastError("Sub category is required");
    } else if (platform == "") {
      toastError("Platform is required");
    } else if (contentType == "") {
      toastError("Content type is required");
    } else if (dataBrand == "") {
      toastError("Brand is required");
    } else if (designedBy == "") {
      toastError("Designer is required");
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
    e.preventDefault();
    try {
      if (
        category &&
        platform &&
        contentType &&
        dataBrand &&
        brand &&
        dataSubCategory &&
        designedBy
      ) {
        setIsLoading(true);
      }
      for (let i = 0; i < details.length; i++) {
        const formData = new FormData();
        formData.append("data_name", brand);
        formData.append("cat_id", category);
        // formData.append("sub_cat_id", dataSubCategory.map(e=>e));
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("data_upload", details[i].file);
        formData.append("data_type", details[i].fileType);
        // formData.append("size", details[i].size);
        formData.append("size_in_mb", details[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", userID);
        formData.append("designed_by", designedBy);
        formData.append("date_of_completion", dateOfCompletion);
        formData.append("date_of_report", dateOfReport);
        formData.append("brand_category_id", brandCat);
        formData.append("brand_sub_category_id", brandSubCategory);
        formData.append("campaign_purpose", compignPurpose);
        formData.append("number_of_post", NumOfPost);
        formData.append("number_of_reach", NumOfReach);
        formData.append("number_of_impression", NumOfImpression);
        formData.append("number_of_engagement", NumOfEngagement);
        formData.append("number_of_views", NumOfViews);
        formData.append("number_of_story_views", NumOfStoryViews);
        formData.append("operation_remark", OperationRemark);

        // date_of_completion: "$date_of_completion",
        //             date_of_report: "$date_of_report",
        //             brand_category_id: "$brand_category_id",
        //             brand_sub_category_id: "$brand_sub_category_id",
        //             campaign_purpose: "$campaign_purpose",
        //             number_of_post: "$number_of_post",
        //             number_of_reach: "$number_of_reach",
        //             number_of_impression: "$number_of_impression",
        //             number_of_engagement: "$number_of_engagement",
        //             number_of_views: "$number_of_views",
        //             number_of_story_views: "$number_of_story_views",
        //             operation_remark: "$operation_remark",

        await axios.post(baseUrl + "add_data", formData, {
          // await axios.post( "http://192.168.1.9:3000/api/add_data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      for (let i = 0; i < mmcDetails.length; i++) {
        const formData = new FormData();
        formData.append("data_name", brand);
        formData.append("cat_id", category);
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("mmc", mmcDetails[i].file);
        formData.append("data_type", mmcDetails[i].fileType);
        formData.append("size_in_mb", mmcDetails[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", userID);
        formData.append("designed_by", designedBy);
        formData.append("date_of_completion", dateOfCompletion);
        formData.append("date_of_report", dateOfReport);
        formData.append("brand_category_id", brandCat);
        formData.append("brand_sub_category_id", brandSubCategory);
        formData.append("campaign_purpose", compignPurpose);
        formData.append("number_of_post", NumOfPost);
        formData.append("number_of_reach", NumOfReach);
        formData.append("number_of_impression", NumOfImpression);
        formData.append("number_of_engagement", NumOfEngagement);
        formData.append("number_of_views", NumOfViews);
        formData.append("number_of_story_views", NumOfStoryViews);
        formData.append("operation_remark", OperationRemark);

        await axios.post(baseUrl + "add_data", formData, {
          // await axios.post("http://192.168.1.9:3000/api/add_data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      for (let i = 0; i < sarcasmDetails.length; i++) {
        const formData = new FormData();
        formData.append("data_name", brand);
        formData.append("cat_id", category);
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("sarcasm", sarcasmDetails[i].file);
        formData.append("data_type", sarcasmDetails[i].fileType);
        formData.append("size_in_mb", sarcasmDetails[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", userID);
        formData.append("designed_by", designedBy);
        formData.append("date_of_completion", dateOfCompletion);
        formData.append("date_of_report", dateOfReport);
        formData.append("brand_category_id", brandCat);
        formData.append("brand_sub_category_id", brandSubCategory);
        formData.append("campaign_purpose", compignPurpose);
        formData.append("number_of_post", NumOfPost);
        formData.append("number_of_reach", NumOfReach);
        formData.append("number_of_impression", NumOfImpression);
        formData.append("number_of_engagement", NumOfEngagement);
        formData.append("number_of_views", NumOfViews);
        formData.append("number_of_story_views", NumOfStoryViews);
        formData.append("operation_remark", OperationRemark);

        await axios.post(baseUrl + "add_data", formData, {
          // await axios.post("http://192.168.1.9:3000/api/add_data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      for (let i = 0; i < nologoDetails.length; i++) {
        const formData = new FormData();
        formData.append("data_name", brand);
        formData.append("cat_id", category);
        formData.append("sub_cat_id", dataSubCategory);
        formData.append("platform_id", platform);
        formData.append("brand_id", dataBrand);
        formData.append("content_type_id", contentType);
        formData.append("no_logo", nologoDetails[i].file);
        formData.append("data_type", nologoDetails[i].fileType);
        formData.append("size_in_mb", nologoDetails[i].sizeInMB);
        formData.append("remark", remark);
        formData.append("created_by", userID);
        formData.append("designed_by", designedBy);
        formData.append("date_of_completion", dateOfCompletion);
        formData.append("date_of_report", dateOfReport);
        formData.append("brand_category_id", brandCat);
        formData.append("brand_sub_category_id", brandSubCategory);
        formData.append("campaign_purpose", compignPurpose);
        formData.append("number_of_post", NumOfPost);
        formData.append("number_of_reach", NumOfReach);
        formData.append("number_of_impression", NumOfImpression);
        formData.append("number_of_engagement", NumOfEngagement);
        formData.append("number_of_views", NumOfViews);
        formData.append("number_of_story_views", NumOfStoryViews);
        formData.append("operation_remark", OperationRemark);

        await axios.post(baseUrl + "add_data", formData, {
          // await axios.post( "http://192.168.1.9:3000/api/add_data", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsFormSubmitted(true);
      toastAlert("Data uploaded");
      setBrand("");
      setLogo("");
      setImage("");
      setSize("");
      setRemark("");
      setDetails([]);
      setCategory("");
      setPlateform("");
      setContentType("");
      setDataBrand("");
      setDataSubCategory([]);
      setDesignedBy("");
      setDateOfCompletion("");
      setDateOfReport("");
      setBrandCat("");
      setBrandSubCategory("");
      setCompignPurpose("");
      setNumOfPost("");
      setNumOfReach("NA");
      setNumOfImpression("NA");
      setNumOfEngagement("NA");
      setNumOfViews("NA");
      setNumOfStoryViews("NA");
      setOperationRemark("NA");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  const delteRowData = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const delteMMCRowData = (index) => {
    const newDetails = [...mmcDetails];
    newDetails.splice(index, 1);
    setMMCDetails(newDetails);
  };

  const delteSarcasmRowData = (index) => {
    const newDetails = [...sarcasmDetails];
    newDetails.splice(index, 1);
    setSarcasmDetails(newDetails);
  };

  const delteNologoRowData = (index) => {
    const newDetails = [...nologoDetails];
    newDetails.splice(index, 1);
    setNologoDetails(newDetails);
  };

  if (isFormSubmitted) {
    return <Navigate to="/data-brand-overview" />;
  }

  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <img src={pdf} alt="PDF" style={{ width: "32%" }} />;
      case "mp4":
        return <img src={video} alt="PDF" style={{ width: "32%" }} />;
      case "xls":
      case "xlsx":
        return <img src={sheets} alt="Excel" style={{ width: "32%" }} />;
      default:
        return <i className="fa fa-file"></i>;
    }
  };

  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />
      <FormContainer
        mainTitle="Data"
        title="Data"
        handleSubmit={handleSubmit}
        submitButton={false}
      >
        <div className="form-group col-6  ">
          <label className="form-label">
            Content Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={contentTypeData.map((opt) => ({
              value: opt._id,
              label: opt.content_name,
            }))}
            value={{
              value: contentType,
              label:
                contentTypeData.find((user) => user._id === contentType)
                  ?.content_name || "",
            }}
            onChange={(e) => {
              setContentType(e.value);
            }}
            required
          />
        </div>
        <FieldContainer
          label="Name *"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required={true}
        />

        <FieldContainer
          label="Upload Data *"
          type="file"
          multiple
          accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
          onChange={handleFileChange}
          fieldGrid={6}
          required={true}
        />
        {contentType == "65a663ccef8a81593f418836" && (
          <>
            <FieldContainer
              label="MMC *"
              type="file"
              multiple
              accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
              onChange={handleMMCFileChange}
              fieldGrid={6}
              required={true}
            />
            <FieldContainer
              label="sarcasm *"
              multiple
              type="file"
              accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
              onChange={handleSarcasmFileChange}
              fieldGrid={6}
              required={true}
            />
            <FieldContainer
              label="No Logo *"
              multiple
              type="file"
              accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*"
              onChange={handleNologoFileChange}
              fieldGrid={6}
              required={true}
            />
          </>
        )}

        <div className="form-group col-3">
          <label className="form-label">
            Category Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={categoryData.map((opt) => ({
              value: opt._id,
              label: opt.category_name,
            }))}
            value={{
              value: category,
              label:
                categoryData.find((user) => user._id === category)
                  ?.category_name || "",
            }}
            onChange={(e) => {
              setCategory(e.value);
            }}
            required
          />
        </div>
        <div className="col-1 mt-4">
          <Link
            title="Add Category"
            className="btn btn-sm btn-primary"
            to="/data-brand-category"
          >
            <Add />
          </Link>
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Sub Category Name <sup style={{ color: "red" }}>*</sup>
          </label>
          {/* <Select
    options={dataSubCategoryData.map((opt) => ({
        value: opt._id,
        label: opt.data_sub_cat_name,
    }))}
    isMulti={true}
    value={
        dataSubCategoryData
            .filter(opt => dataSubCategory.includes(opt._id))
            .map(opt => ({ value: opt._id, label: opt.data_sub_cat_name }))
    }
    onChange={(selectedOptions) => {
        setDataSubCategory(selectedOptions.map(opt => opt.value));
    }}
    required
/> */}

          <Select
            options={dataSubCategoryData.map((opt) => ({
              value: opt._id,
              label: opt.data_sub_cat_name,
            }))}
            value={{
              value: dataSubCategory,
              label:
                dataSubCategoryData.find((user) => user._id === dataSubCategory)
                  ?.data_sub_cat_name || "",
            }}
            onChange={(e) => {
              setDataSubCategory(e.value);
            }}
            required
          />
        </div>
        <div className="col-1 mt-4">
          <Link
            title="Add Sub Category"
            className="btn btn-sm btn-primary"
            to="/data-brand-sub-category"
          >
            <Add />
          </Link>
        </div>
        <div className="form-group col-3">
          <label className="form-label">
            Platform Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((opt) => ({
              value: opt._id,
              label: opt.platform_name,
            }))}
            value={{
              value: platform,
              label:
                platformData.find((user) => user._id === platform)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlateform(e.value);
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

        <div className="form-group col-3">
          <label className="form-label">
            Designed by <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={employeeData.map((opt) => ({
              value: opt.user_id,
              label: opt.user_name,
            }))}
            value={{
              value: designedBy,
              label:
                employeeData.find((user) => user.user_id === designedBy)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setDesignedBy(e.value);
            }}
            required
          />
        </div>
        {contentType == "65a663ccef8a81593f418836" && (
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
                    brandCategory.find((brand) => brand.category_id == brandCat)
                      ?.category_name || "",
                }}
                onChange={(e) => {
                  setBrandCat(e.value);
                  setBrandSubCategory("");
                }}
                required
              />
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
                required
              />
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
                Number Of Post <sup style={{ color: "red" }}>*</sup>
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
              <label className="form-label">Number Of Reach</label>
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
              <label className="form-label">Number Of Impression</label>
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
              <label className="form-label">Number Of Engagement</label>
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
              <label className="form-label">Number Of views</label>
              <input
                className="form-control"
                value={NumOfViews}
                onChange={(e) => setNumOfViews(HandleNAFileChangeOnChange(e))}
                onBlur={(e) => {
                  setNumOfViews(handleNaFileChangeOnBlur(e));
                }}
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">Number Of Story Views</label>
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
                onChange={(e) =>
                  setOperationRemark(HandleNAFileChangeOnChange(e))
                }
                onBlur={(e) => {
                  setOperationRemark(handleNaFileChangeOnBlur(e));
                }}
              />
            </div>
          </>
        )}

        <div className="summary_cards brand_img_list">
          {details.length > 0 && <h3 className="lead fs-4">Upload Data</h3>}
          {details.map((detail, index) => (
            <div key={index} className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    images[index] && (
                      <img
                        onClick={() =>
                          setOpenReviewDisalog({
                            open: true,
                            image: URL.createObjectURL(images[index]),
                            detail: detail,
                          })
                        }
                        className="brandimg_icon"
                        src={URL.createObjectURL(images[index])}
                        alt={`Image ${index + 1}`}
                      />
                    )
                  ) : (
                    <div
                      className="file_icon"
                      onClick={() =>
                        setOpenReviewDisalog({
                          open: true,
                          image: URL.createObjectURL(images[index]),
                          detail: detail,
                        })
                      }
                    >
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.fileType}
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
                <button
                  onClick={() => {
                    delteRowData(index);
                  }}
                  className="btn btn-sm btn-dengor me-2"
                >
                  <CloseTwoTone />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary_cards brand_img_list">
          {mmcDetails.length > 0 && <h3 className="lead fs-4">MMC </h3>}
          {mmcDetails.map((detail, index) => (
            <div key={index} className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    mmcImages[index] && (
                      <img
                        onClick={() =>
                          setOpenReviewDisalog({
                            open: true,
                            image: URL.createObjectURL(mmcImages[index]),
                            detail: detail,
                          })
                        }
                        className="brandimg_icon"
                        src={URL.createObjectURL(mmcImages[index])}
                        alt={`Image ${index + 1}`}
                      />
                    )
                  ) : (
                    <div
                      className="file_icon"
                      onClick={() =>
                        setOpenReviewDisalog({
                          open: true,
                          image: URL.createObjectURL(mmcImages[index]),
                          detail: detail,
                        })
                      }
                    >
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.fileType}
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
                <button
                  onClick={() => {
                    delteMMCRowData(index);
                  }}
                  className="btn btn-sm btn-dengor me-2"
                >
                  <CloseTwoTone />
                </button>
                {/* <div className="col summary_box brand_img_box">
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
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="summary_cards brand_img_list">
          {sarcasmDetails.length > 0 && <h3 className="lead fs-4">Sarcasm</h3>}
          {sarcasmDetails.map((detail, index) => (
            <div key={index} className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    sarcasmImages[index] && (
                      <img
                        onClick={() =>
                          setOpenReviewDisalog({
                            open: true,
                            image: URL.createObjectURL(sarcasmImages[index]),
                            detail: detail,
                          })
                        }
                        className="brandimg_icon"
                        src={URL.createObjectURL(sarcasmImages[index])}
                        alt={`Image ${index + 1}`}
                      />
                    )
                  ) : (
                    <div
                      className="file_icon"
                      onClick={() =>
                        setOpenReviewDisalog({
                          open: true,
                          image: URL.createObjectURL(sarcasmImages[index]),
                          detail: detail,
                        })
                      }
                    >
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.fileType}
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
                <button
                  onClick={() => {
                    delteSarcasmRowData(index);
                  }}
                  className="btn btn-sm btn-dengor me-2"
                >
                  <CloseTwoTone />
                </button>
                {/* <div className="col summary_box brand_img_box">
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
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="summary_cards brand_img_list">
          {nologoDetails.length > 0 && <h3 className="lead fs-4">No Logo</h3>}
          {nologoDetails.map((detail, index) => (
            <div key={index} className="summary_card brand_img_item">
              <div className="summary_cardrow brand_img_row">
                <div className="col summary_box brand_img_box col140">
                  {detail.fileType === "jpg" ||
                  detail.fileType === "jpeg" ||
                  detail.fileType === "png" ||
                  detail.fileType === "gif" ? (
                    nologoImages[index] && (
                      <img
                        onClick={() =>
                          setOpenReviewDisalog({
                            open: true,
                            image: URL.createObjectURL(nologoImages[index]),
                            detail: detail,
                          })
                        }
                        className="brandimg_icon"
                        src={URL.createObjectURL(nologoImages[index])}
                        alt={`Image ${index + 1}`}
                      />
                    )
                  ) : (
                    <div
                      className="file_icon"
                      onClick={() =>
                        setOpenReviewDisalog({
                          open: true,
                          image: URL.createObjectURL(nologoImages[index]),
                          detail: detail,
                        })
                      }
                    >
                      {renderFileIcon(detail.fileType)}
                    </div>
                  )}
                </div>
                <div className="col summary_box brand_img_box col140">
                  <h4>
                    <span>Extension:</span>
                    {detail.fileType}
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
                <button
                  onClick={() => {
                    delteNologoRowData(index);
                  }}
                  className="btn btn-sm btn-dengor me-2"
                >
                  <CloseTwoTone />
                </button>
                {/* <div className="col summary_box brand_img_box">
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
                </div> */}
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{ width: "20%", marginLeft: "1%" }}
        >
          {isLoading ? "Please wait data uploading..." : "Submit"}
        </button>
      </FormContainer>
      {openReviewDisalog.open && (
        <ImgDialogBox
          openReviewDisalog={openReviewDisalog}
          setOpenReviewDisalog={setOpenReviewDisalog}
        />
      )}{" "}
    </div>
  );
};

export default DataBrandMaster;
