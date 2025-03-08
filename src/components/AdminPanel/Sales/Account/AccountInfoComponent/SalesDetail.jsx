import { useGetSingleAccountTypeQuery } from "../../../../Store/API/Sales/SalesAccountTypeApi";
import {
  useGetSingleAccountSalesBookingQuery,
  useUpdateImageMutation,
} from "../../../../Store/API/Sales/SalesAccountApi";
import { useGetSingleCompanyTypeQuery } from "../../../../Store/API/Sales/CompanyTypeApi";
import { useGetSingleBrandCategoryTypeQuery } from "../../../../Store/API/Sales/BrandCategoryTypeApi";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import coverImage from "../../../../../../src/assets/imgs/other/cover1.jpg";
import user from "../../../../../../src/assets/imgs/user/naruto.png";
import Loader from "../../../../Finance/Loader/Loader";
import Cropper from "react-easy-crop";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import getCroppedImg from "../../../../../utils/CropImage";
const SalesDetail = ({ SingleAccount, refetchSingleAccount }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [files, setFiles] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [fileNames, setFileNames] = useState("");

  const [
    updateimage,
    {
      data: updateImageData,
      error: updateImageError,
      isLoading: updateImageLoading,
    },
  ] = useUpdateImageMutation();

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files[0];
    setFileNames(selectedFiles.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFiles(e.target.result);
    };
    reader.readAsDataURL(selectedFiles);
  };
  async function updatepicture(croppedImage) {
    try {
      // // Convert base64 to a Blob
      // const base64Response = await fetch(croppedImage);
      // const blob = await base64Response.blob();

      // // Create a file from the Blob
      // const sanitizedFileName = fileNames.replace(/\s+/g, ""); // Remove spaces from filename
      // const file = new File([blob], sanitizedFileName, {
      //   type: blob.type, // Preserve original MIME type
      // });

      // Save the file in the file manager (optional)
      // const fileManager =
      //   window.navigator.msSaveOrOpenBlob || window.navigator.msSaveBlob;
      // if (fileManager) {
      //   fileManager(blob, file.name);
      // } else {
      //   const link = document.createElement("a");
      //   link.href = URL.createObjectURL(blob);
      //   link.download = file.name;
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      // }

      // Prepare the form data for the API
      const formData = new FormData();
      formData.append("account_image", croppedImage);
      formData.append("account_id", SingleAccount?.account_id);
      // Upload the image
      await updateimage(formData);

      // Refresh and clean up
      refetchSingleAccount();
      setModalIsOpen(false);
      setFiles(null);
      setFileNames("");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        files,
        croppedAreaPixels,
        rotation,
        fileNames
      );

      updatepicture(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFiles = event.dataTransfer.files;
    setFileNames(droppedFiles[0].name);

    // const url = event.dataTransfer;
    // if (url) {
    //   // console.log("url", url);

    //   fetch(url)
    //     .then((response) => response.blob())
    //     .then((blob) => {
    //       const file = new File([blob], "dropped-image.jpg", {
    //         type: blob.type,
    //       });
    //       setFiles(file);
    //     })
    //     .catch((error) => console.error("Error fetching image:", error));
    // } else
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles(e.target.result);
      };
      reader.readAsDataURL(newFiles[0]);
    } else setFiles(null);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const {
    data: SingleAccountType,
    error: SingleAccountTypeErr,
    isLoading: SingleAccountTypeLoading,
  } = useGetSingleAccountTypeQuery(SingleAccount?.account_type_id, {
    skip: !SingleAccount?.account_type_id,
  });

  const {
    data: SingleCompanyType,
    error: SingleCompanyTypeErr,
    isLoading: SingleCompanyTypeLoading,
  } = useGetSingleCompanyTypeQuery(SingleAccount?.company_type_id, {
    skip: !SingleAccount?.company_type_id,
  });
  const {
    data: SingleBrandCategoryType,
    error: SingleBrandCategoryTypeErr,
    isLoading: SingleBrandCategoryTypeLoading,
  } = useGetSingleBrandCategoryTypeQuery(SingleAccount?.category_id, {
    skip: !SingleAccount?.category_id,
  });

  const {
    data: SingleAccountSalesBooking,
    error: SingleAccountSalesBookingError,
    isLoading: SingleAccountSalesBookingLoading,
  } = useGetSingleAccountSalesBookingQuery(
    `${SingleAccount?.account_id}?_id=false`,
    { skip: !SingleAccount?.account_id }
  );

  let isLoading =
    SingleAccountTypeLoading ||
    SingleCompanyTypeLoading ||
    SingleBrandCategoryTypeLoading ||
    SingleAccountSalesBookingLoading;

  return (
    <>
      {isLoading && <Loader />}
      <Modal
        className="executionModal"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",

            maxWidth: "900px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <>
          {!files ? (
            <div className="dragndrop">
              <form class="form-container " enctype="multipart/form-data">
                <div class="upload-files-container">
                  <div
                    class="drag-file-area"
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <span class="material-icons-outlined upload-icon">
                      <i className="bi bi-upload"></i>
                    </span>
                    <h3 class="dynamic-message"> Drag & drop any file here </h3>
                  </div>
                  <span class="cannot-upload-message">
                    {" "}
                    <span class="material-icons-outlined">error</span> Please
                    select a file first{" "}
                    <span class="material-icons-outlined cancel-alert-button">
                      cancel
                    </span>{" "}
                  </span>
                  <div class="file-block">
                    <div class="file-info">
                      {" "}
                      <span class="material-icons-outlined file-icon">
                        description
                      </span>{" "}
                      <span class="file-name"> </span> |{" "}
                      <span class="file-size"> </span>{" "}
                    </div>
                    <span class="material-icons remove-file-icon">delete</span>
                    <div class="progress-bar"> </div>
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                  <label for="fileInput" className="upload-button">
                    Upload
                  </label>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <h5 className="modal-title">Crop Image</h5>
                <button
                  onClick={() => {
                    setModalIsOpen(false);
                    setFiles(null);
                  }}
                  className="btn-close"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>

              <div className="modal-body h-75 d-flex">
                <div className="crop-container">
                  <Cropper
                    image={files}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
              </div>
              <div className="modal-footer d-flex sb">
                <button
                  className="btn btn-primary cmnbtn btn_sm"
                  onClick={() => showCroppedImage()}
                >
                  Save Image
                </button>
              </div>
            </>
          )}
        </>
      </Modal>
      <div className="card">
        <div className="card-body p0">
          <div className="saleAccWrapper">
            <div className="saleAccCover">
              <div className="saleAccCoverImg">
                <img src={coverImage} alt="coverimage" />
              </div>
            </div>
            <div className="saleAccTitle">
              <div className="saleAccTitleHead row">
                <div className="saleAccTitleImgCol col">
                  <div className="saleAccTitleImg">
                    <div
                      className="icon-1 edit-btn "
                      onClick={() => setModalIsOpen(true)}
                    >
                      <i className="bi bi-pencil"> </i>
                    </div>
                    <img src={SingleAccount?.account_image_url} alt="logo" />
                  </div>
                </div>
                <div className="saleAccTitleTxtCol col">
                  <div className="saleAccTitleTxt">
                    <h2>{SingleAccount?.account_name}</h2>
                    <p>
                      <b>Description: </b>
                      {SingleAccount?.description || "N/A"}
                    </p>
                  </div>
                  <div className="saleAccTitleSocial">
                    <ul className="saleAccSocialInfo">
                      {SingleAccountSalesBooking?.social_platforms &&
                        SingleAccountSalesBooking?.social_platforms?.map(
                          (platform) => (
                            <li>
                              <a target="__blank" href={platform.link}>
                                <i
                                  className={`icon bi bi-${platform.platform}`}
                                ></i>
                              </a>
                            </li>
                          )
                        )}
                      {/* <li>
                        <a href="#">
                          <i className="icon bi bi-linkedin"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="icon bi bi-facebook"></i>
                        </a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="saleAccDetails">
              <ul>
                <li>
                  <span className="icon">
                    <i className="bi bi-globe2"></i>
                  </span>
                  <h4>
                    <b>Website</b>
                    <a href="#">
                      {SingleAccount?.website ? (
                        <a
                          href={
                            SingleAccount?.website?.startsWith("http")
                              ? SingleAccount?.website
                              : `http://${SingleAccount?.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {SingleAccount?.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </a>
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <h4>
                    <b>Phone</b>
                    <a href="#">+91 82905-41254</a>
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <h4>
                    <b>Company Email</b>
                    {SingleAccount?.company_email ? (
                      <a href={`mailto:${SingleAccount?.company_email}`}>
                        {SingleAccount?.company_email}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i className="bi bi-currency-rupee"></i>
                  </span>
                  <h4>
                    <b>Turnover</b>
                    {SingleAccount?.turn_over || "N/A"}{" "}
                    {SingleAccount?.turn_over && "Cr."}
                  </h4>
                </li>
                <li>
                  <span className="icon">
                    <i className="bi bi-buildings"></i>
                  </span>
                  <h4>
                    <b>No. of Offices</b>
                    {SingleAccountSalesBooking?.how_many_offices || "N/A"}
                  </h4>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* {SingleAccountSalesBooking?.social_platforms && (
        <div className="account-details">
          <h5>Platforms</h5>
          {SingleAccountSalesBooking?.social_platforms.map((item) => (
            <div className="detail-view flex-col">
              <div className="details">
                {item?.platform}:{" "}
                <span>
                  <a target="__blank" href={item?.link}>
                    {item?.link}
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      )} */}

      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Details
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Account Details</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      <li>
                        <span>Account Type:</span>
                        {SingleAccountType?.account_type_name || "N/A"}
                      </li>
                      {/* <li>
                        <span>Descriptions:</span>
                        {SingleAccount?.description || "N/A"}
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Company Details</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      <li>
                        <span>Company Type:</span>
                        {SingleCompanyType?.company_type_name || "N/A"}
                      </li>
                      {/* <li>
                        <span>Descriptions:</span>
                        {SingleCompanyType?.description || "N/A"}
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              {SingleAccountSalesBooking?.account_type_name !== "Agency" && (
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                  <div className="card saleAccDetailCard">
                    <div className="card-header">
                      <h4 className="card-title">Brand Category Details</h4>
                    </div>
                    <div className="card-body">
                      <ul className="saleAccDetailInfo">
                        <li>
                          <span>Brand Type:</span>
                          {SingleBrandCategoryType?.brand_category_name ||
                            "N/A"}
                        </li>

                        {/* <li>
                          <span>Descriptions:</span>
                          {SingleBrandCategoryType?.description || "N/A"}
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Connected Billing Address</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      {/* <li>
                        <span>Connected Office:</span>
                        {SingleAccountSalesBooking?.connected_office || "N/A"}
                      </li> */}
                      <li>
                        <span>Address:</span>
                        {SingleAccountSalesBooking?.connect_billing_street ||
                          "N/A"}
                      </li>
                      <li>
                        <span>City:</span>
                        {SingleAccountSalesBooking?.connect_billing_city ||
                          "N/A"}
                      </li>
                      <li>
                        <span>State:</span>
                        {SingleAccountSalesBooking?.connect_billing_state ||
                          "N/A"}
                      </li>
                      <li>
                        <span>Country:</span>
                        {SingleAccountSalesBooking?.connect_billing_country ||
                          "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="card saleAccDetailCard">
                  <div className="card-header">
                    <h4 className="card-title">Head Billing Address</h4>
                  </div>
                  <div className="card-body">
                    <ul className="saleAccDetailInfo">
                      {/* <li>
                        <span>Head Office:</span>
                        {SingleAccountSalesBooking?.head_office || "N/A"}
                      </li> */}
                      <li>
                        <span>Address:</span>
                        {SingleAccountSalesBooking?.head_billing_street ||
                          "N/A"}
                      </li>
                      <li>
                        <span>City:</span>
                        {SingleAccountSalesBooking?.head_billing_city || "N/A"}
                      </li>
                      <li>
                        <span>State:</span>
                        {SingleAccountSalesBooking?.head_billing_state || "N/A"}
                      </li>
                      <li>
                        <span>Country:</span>
                        {SingleAccountSalesBooking?.head_billing_country ||
                          "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default SalesDetail;
{
  /* <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card w-100">
                  <div className="card-header">
                      <h4 className="card-title">Account Type</h4>
                  </div>
                  <div className="card-body">
                      <div className="account-detail">
                          <div className="detail-view">
                              <div className="details">
                                  Account Type:{" "}
                                  <span>{SingleAccountType?.account_type_name}</span>
                              </div>
                          </div>
                          <div className="detail-view">
                              <div className="details">
                                  Description: <span>{SingleAccountType?.description}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card w-100">
                  <div className="card-header">
                      <h4 className="card-title">Company Type</h4>
                  </div>
                  <div className="card-body">
                      <div className="account-detail">
                          <div className="detail-view">
                              <div className="details">
                                  Company Type:{" "}
                                  <span>{SingleCompanyType?.company_type_name}</span>
                              </div>
                          </div>
                          <div className="detail-view">
                              <div className="details">
                                  Description: <span>{SingleCompanyType?.description}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card w-100">
                  <div className="card-header">
                      <h4 className="card-title">Brand Category Type</h4>
                  </div>
                  <div className="card-body">
                      <div className="account-detail">
                          <div className="detail-view">
                              <div className="details">
                                  Brand Type:{" "}
                                  <span>{SingleBrandCategoryType?.Brand_type_name}</span>
                              </div>
                          </div>
                          <div className="detail-view">
                              <div className="details">
                                  Description:{" "}
                                  <span>{SingleBrandCategoryType?.description}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>


      </div> */
}
