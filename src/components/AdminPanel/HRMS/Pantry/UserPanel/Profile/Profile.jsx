import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { BlobProvider, PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import AppointmentLetter from "../../../../../PreOnboarding/AppointmentLetter";
import OfferLetter from "../../../../../PreOnboarding/OfferLetter";
import FormContainer from "../../../../FormContainer";
import ProfileSection from "./ProfileSection/ProfileSection";
import JobSection from "./ProfileSection/JobSection";
import DocumentTab from "../../../../../PreOnboarding/DocumentTab";
import {
  Briefcase,
  Check,
  Download,
  Envelope,
  Pencil,
  Phone,
} from "@phosphor-icons/react";
import AboutSection from "./ProfileSection/AboutSection";
import AssetSingleUser from "../../../Sim/AssetSingeUser/AssetSingleUser";
import { CircularProgress } from "@mui/material";
import { useGlobalContext } from "../../../../../../Context/Context";
import { baseUrl } from "../../../../../../utils/config";

// import GoogleSheetDownloader from "./googlesheet";

const Profile = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [image64, setImage64] = useState("");
  const [selectedResponsibilityId, setSelectedResponsibilityId] =
    useState(null);

  const [profileUpdate, setProfileUpdate] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState([]);
  const [responsbilityData, setResponsibility] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [familyData, setFamilyData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["About", "Profile", "Job", "Document", "Assets"];

  // Document Information Tab-------------------Start------------------------------------
  const [documentData, setDocumentData] = useState([]);
  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: loginUserId,
    });
    setDocumentData(response.data.data);
  }

  useEffect(() => {
    getDocuments();
  }, [loginUserId]);

  const tab1 = (
    <AboutSection educationData={educationData} familyData={familyData} />
  );
  const tab2 = (
    <ProfileSection
      userData={userData}
      educationData={educationData}
      familyData={familyData}
    />
  );
  const tab3 = <JobSection userData={userData} />;
  const tab4 = (
    <div className="table-wrap-user">
      <DocumentTab
        documentData={documentData}
        setDocumentData={setDocumentData}
        getDocuments={getDocuments}
        submitButton={false}
        normalUserLayout={true}
      />
    </div>
  );
  const tab5 = <AssetSingleUser />;
  function handleGetData() {
    axios.get(`${baseUrl}` + `get_single_user/${loginUserId}`).then((res) => {
      setUserData(res.data);
    });
  }
  const EducationData = () => {
    axios.get(baseUrl + `get_single_education/${loginUserId}`).then((res) => {
      setEducationData(res.data.data);
    });
  };
  const FamilyDatas = () => {
    axios.get(baseUrl + `get_single_family/${loginUserId}`).then((res) => {
      setFamilyData(res.data.data);
    });
  };

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
    FamilyDatas();
    EducationData();
    handleGetData();
    responsibilityAPI();
  }, [loginUserId]);

  const handleProfileUpdate = () => {
    const formData = new FormData();
    formData.append("user_id", loginUserId);
    formData.append("image", profileUpdate);

    setLoading(true);
    axios
      .put(`${baseUrl}update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toastAlert("Profile uploaded successfully."); // Fixed spelling: "toastAleart" → "toastAlert"
        handleGetData();
      })
      .catch((error) => {
        toastError("Failed to upload profile. Please try again."); // Added error handling
        console.error("Profile upload error:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading indicator
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
      <div className="card profileCard">
        <div className="card-body">
          <div className="profileCardRow">
            <div className="profileCardImgCol">
              <div className="profileCardImg">
                {userData?.image_url == null ? (
                  <img src="imageTest1" alt="user" />
                ) : (
                  <img src={userData.image_url} alt="user" />
                )}

                <div className="profileCardImgAction">
                  <div className="profileCardImgEdit">
                    <input
                      type="file"
                      className="custom_file_input"
                      onChange={(e) => setProfileUpdate(e.target.files[0])}
                    />
                    <span>
                      <Pencil />
                    </span>
                  </div>
                  <div className="profileCardImgSave">
                    {/* <button
                      className="btn"
                      title="save profile"
                      type="file"
                      onClick={() => handleProfileUpdate()}
                    >
                      <Check />
                    </button> */}
                    <button
                      className="btn"
                      title="Save profile"
                      onClick={handleProfileUpdate}
                      disabled={!profileUpdate || loading}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Check />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="profileCardDtlCol">
              <div className="profileCardDtlBox">
                <h2>
                  {userData.user_name} <span>{userData.role_name}</span>
                </h2>
              </div>
              <div className="profileCardDtlRow">
                <ul>
                  <li>
                    <h6>
                      <span>
                        <Briefcase />
                      </span>
                      {userData.designation_name}
                    </h6>
                  </li>
                  <li>
                    <h6>
                      <span>
                        <Phone />
                      </span>
                      {userData.user_contact_no}
                    </h6>
                  </li>
                  <li>
                    <h6>
                      <span>
                        <Envelope />
                      </span>
                      {userData.user_email_id}
                    </h6>
                  </li>
                </ul>
              </div>
              <hr className="w-100 m0" />
              <div className="profileCardDtlRow">
                <ul>
                  <li>
                    <small>Login ID</small>
                    <h6>{userData.user_login_id}</h6>
                  </li>
                  <li>
                    <small>Report L1</small>
                    <h6>{userData.Report_L1N}</h6>
                  </li>
                  <li>
                    <small>Employee ID</small>
                    <h6>{userData.user_id}</h6>
                  </li>
                </ul>
              </div>
            </div>
            <div className="profileCardDropdown">
              <div className="dropdown">
                <button
                  className="icon btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <Download />
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li className="dropdown-item">
                    <PDFDownloadLink
                      className="btn"
                      document={
                        <OfferLetter allUserData={userData} image64={image64} />
                      }
                      fileName="OfferLetter.pdf"
                    >
                      <Download />
                      Download Offer Letter
                    </PDFDownloadLink>
                  </li>
                  <li className="dropdown-item">
                    <PDFDownloadLink
                      className="btn"
                      document={
                        <AppointmentLetter
                          allUserData={userData}
                          image64={image64}
                        />
                      }
                      fileName="AppointmentLetter.pdf"
                    >
                      <Download />
                      Download Appointment Letter
                    </PDFDownloadLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="m0" />
        <div className="card-body profileTab">
          <FormContainer
            submitButton={false}
            title=""
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          ></FormContainer>
        </div>
      </div>
      <div className="profileTabContentArea">
        {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
        {activeAccordionIndex === 2 && tab3}
        {activeAccordionIndex === 3 && tab4}
        {activeAccordionIndex === 4 && tab5}
      </div>
    </>
  );
};

export default Profile;
