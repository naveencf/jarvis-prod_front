import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import UserNav from "../UserNav";
import imageTest1 from "../../../../assets/img/product/Avtrar1.png";
import { baseUrl } from "../../../../utils/config";
import { BlobProvider, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import AppointmentLetter from "../../../PreOnboarding/AppointmentLetter";
import OfferLetter from "../../../PreOnboarding/OfferLetter";
import FormContainer from "../../../AdminPanel/FormContainer";
import AboutSection from "./ProfileSection/AboutSection";
import ProfileSection from "./ProfileSection/ProfileSection";
import JobSection from "./ProfileSection/JobSection";
import { Link } from "react-router-dom";
import AssetSingleUser from "../../../Sim/AssetSingeUser/AssetSingleUser";
// import GoogleSheetDownloader from "./googlesheet";

const Profile = () => {
  const [image64, setImage64] = useState("");
  const [selectedResponsibilityId, setSelectedResponsibilityId] =
    useState(null);

  const [profileUpdate, setProfileUpdate] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responsbilityData, setResponsibility] = useState([]);
  const [educationData,setEducationData] = useState([])
  const [familyData , setFamilyData] = useState([])

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["About", "Profile", "Job", "Document", "Assets"];

  const tab1 = <AboutSection educationData={educationData} familyData={familyData}/>
  const tab2 = <ProfileSection userData={userData} educationData={educationData} familyData={familyData}/>
  const tab3 = <JobSection userData={userData}/>
  const tab4 = <h1>Four</h1>;
  const tab5 = <AssetSingleUser/>
  function handleGetData() {
    axios.get(`${baseUrl}` + `get_single_user/${loginUserId}`).then((res) => {
      setUserData(res.data);
    });
  }
  const EducationData=()=>{
    axios.get(baseUrl + `get_single_education/${loginUserId}`).then((res) => {
      setEducationData(res.data.data);
    });
  }
  const FamilyDatas=()=>{
    axios.get(baseUrl + `get_single_family/${loginUserId}`).then((res) => {
      setFamilyData(res.data.data);
    });
  }

  function responsibilityAPI() {
    axios
      .post(`${baseUrl}` + `get_user_job_responsibility`, {
        user_id: Number(loginUserId),
      })
      .then((res) => {
        setResponsibility(res.data.data);
      });
  }

  useEffect(() => {
    FamilyDatas()
    EducationData()
    handleGetData();
    responsibilityAPI();
  }, [loginUserId]);

  const handleProfileUpdate = () => {
    const formData = new FormData();
    formData.append("user_id", loginUserId);
    formData.append("image", profileUpdate);
    axios
      // .put(baseUrl+"update_user", formData, {
      .put(baseUrl + "update_user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleGetData();
      });
  };

  axios
    .post(baseUrl + "image_to_base64", {
      imageUrl: userData.digital_signature_image_url,
    })
    .then((response) => {
      setImage64(response.data.base64String);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return (
    <>
      {/* <div className="section product_section profile_section section_padding"> */}
      <div className="container">
        <div className="row">
          <div className="col profile_data_col">
            <div className="profile_data_box position-relative">
              <div className="main_wave_box">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>

              {/* photo start */}

              <div className="col profile_img_col">
                <div className="profile_img_box">
                  <div className="profile_img">
                    {/* {console.log(userData.downloadableUrl, "user data on jsx")} */}
                    {userData?.image_url == null ? (
                      <img
                        src={imageTest1}
                        style={{
                          height: "70px",
                          borderRadius: "50%",
                          width: "70px",
                        }}
                      />
                    ) : (
                      <img
                        className="img-profile ,w-25"
                        src={userData.image_url}
                        alt="user"
                        style={{
                          height: "70px",
                          borderRadius: "50%",
                          width: "70px",
                        }}
                      />
                    )}
                  </div>
                  <div className="profile_name">
                    <h2>
                      {userData.user_name} <span>{userData.role_name}</span>
                    </h2>
                    <div className="profile_img_action">
                      <input
                        type="file"
                        className="custom_file_input"
                        onChange={(e) => setProfileUpdate(e.target.files[0])}
                      />
                      <button
                        className="btn btn-primary"
                        title="save profile"
                        type="file"
                        onClick={() => handleProfileUpdate()}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo End */}

              <div className="d-flex">
                {/* profile info start  */}
                <div className="profile_info_main_box">
                  <div className="profile_data_box_head">
                    <h2>Profile info</h2>
                  </div>
                  <div className="profile_data_box_body">
                    <ul>
                      {/* <li>
                        <span>Role</span>
                        {userData.Role_name}
                      </li> */}
                      <li>
                        <span>Email</span>
                        {userData.user_email_id}
                      </li>
                      <li>
                        <span>Contact</span>
                        {userData.user_contact_no}
                      </li>
                      <li>
                        <span>Login ID</span>
                        {userData.user_login_id}
                      </li>
                      {/* <li>
                        <span>Password</span>
                        {userData.user_login_password?.slice(0, 30)}
                      </li> */}
                      {/* <li>
                        <span>Department</span>
                        {userData.department_name}
                      </li> */}
                      <li>
                        <span>Designation</span>
                        {userData.designation_name}
                      </li>
                      <li>
                        <span>Report L1</span>
                        {userData.Report_L1N}
                      </li>
                    </ul>
                  </div>
                </div>
                {/* profile info End  */}
                <div className="responsibility_main_box">
                  <div className=" gap-2" style={{ marginTop: "130px" }}>
                    <PDFDownloadLink
                      className="btn onboardBtn btn_primary d-flex align-items-center justify-content-center gap-2 mb-3"
                      document={
                        <OfferLetter allUserData={userData} image64={image64} />
                      }
                      fileName="OfferLetter.pdf"
                    >
                      <i class="bi bi-cloud-arrow-down"></i>
                      Download Offer Letter
                    </PDFDownloadLink>
                    <PDFDownloadLink
                      className="btn onboardBtn btn_primary d-flex align-items-center justify-content-center gap-2"
                      document={
                        <AppointmentLetter
                          allUserData={userData}
                          image64={image64}
                        />
                      }
                      fileName="AppointmentLetter.pdf"
                    >
                      <i class="bi bi-cloud-arrow-down"></i>
                      Download Appointment Letter
                    </PDFDownloadLink>
                  </div>
                </div>

                {/* <div className="responsibility_main_box">
                    <div className="">
                      <div className="responsibility_s_box">
                        <div className="profile_data_box_head">
                          <h2 className="">Roles & Responsibility</h2>
                        </div>
                      </div>
                    </div>
                    <div className="profile_data_box_body popup_box_design">
                      <ul>
                        {responsbilityData.map((data) => (
                          <>
                            <li>
                              <button
                                type="button"
                                className="btn btn-primary responsibility_btn_custom"
                                data-toggle="modal"
                                data-target="#exampleModal"
                                onClick={() =>
                                  setSelectedResponsibilityId(data.Job_res_id)
                                }
                              >
                                {data.sjob_responsibility}
                              </button>
                            </li>
                          </>
                        ))}
                      </ul>
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            {responsbilityData.map((data) => {
                              if (
                                data.Job_res_id === selectedResponsibilityId
                              ) {
                                return (
                                  <>
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLabel"
                                      >
                                        {data.sjob_responsibility}
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <h5>Description</h5>
                                      {data.description}
                                    </div>
                                  </>
                                );
                              }
                              return null;
                            })}
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
              </div>
            </div>

            <div className="action_heading">
              <div className="action_title">
                {/* <FormContainer
                  submitButton={false}
                  title=""
                  accordionButtons={accordionButtons}
                  activeAccordionIndex={activeAccordionIndex}
                  onAccordionButtonClick={handleAccordionButtonClick}
                >
                  {activeAccordionIndex === 0 && tab1}
                  {activeAccordionIndex === 1 && tab2}
                  {activeAccordionIndex === 2 && tab3}
                  {activeAccordionIndex === 3 && tab4}
                  {activeAccordionIndex === 4 && tab5}
                </FormContainer> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Profile;
