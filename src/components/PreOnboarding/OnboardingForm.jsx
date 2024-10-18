import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./onboardcss/onboard_style.css";
import "./onboardcss/onboard_responsive.css";
import "./onboardcss/onboard_animate.min.css";
import { useGlobalContext } from "../../Context/Context";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import WhatsappAPI from "../WhatsappAPI/WhatsappAPI";
import Swal from "sweetalert2";

import Modal from "react-modal";
import ExtendJoining from "./ExtendJoining";
import IndianStatesMui from "../ReusableComponents/IndianStatesMui";
import ContactNumber from "../ReusableComponents/ContactNumber";
import IndianCitiesMui from "../ReusableComponents/IndianCitiesMui";
import FamilyFields from "./FamilyFields";
import EducationFields from "./EducationFields";
import { baseUrl } from "../../utils/config";
import { FormatName } from "../../utils/FormatName";

const LanguageList = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Arabic",
  "Bengali",
  "Russian",
  "Urdu",
  "German",
  "Japanese",
  "Telugu",
  "Marathi",
  "Tamil",
  "Italian",
  "Punjabi",
  "Gujarati",
  "Other",
];
const nationalityData = ["Indian", "USA", "Uk"];

const bloodGroupData = [
  "A+ (A Positive)",
  "A- (A Negative)",
  "B+ (B Positive)",
  "B- (B Negative)",
  "AB+ (AB Positive)",
  "AB- (AB Negative)",
  "O+ (O Positive)",
  "O- (O Negative)",
];

const genderData = ["Male", "Female", "Other"];

//Family
const initialFamilyDetailsGroup = {
  name: "",
  // DOB: "",
  contact: "",
  occupation: "",
  annual_income: "",
  relation: "",
};

const familyDisplayFields = [
  "name",
  // "DOB",
  "contact",
  "occupation",
  "relation",
  "annual_income",
];

const familyFieldLabels = {
  name: "Full Name",
  // DOB: "Date of Birth",
  contact: "Contact Number",
  occupation: "Occupation",
  annual_income: "Annual Income",
  relation: "Relationship",
};

//Education
const initialEducationDetailsGroup = {
  title: "",
  institute_name: "",
  from_year: "",
  to_year: "",
  percentage: "",
  stream: "",
  specialization: "",
};

const educationDispalyFields = [
  "title",
  "stream",
  "specialization",
  "institute_name",
  "from_year",
  "to_year",
  "percentage",
];

const educationFieldLabels = {
  title: "Title",
  institute_name: "Institute Name",
  from_year: "From Year",
  to_year: "To Year",
  percentage: "Percentage",
  stream: "Stream",
  specialization: "Specialization",
};

const OnboardingForm = () => {
  const whatsappApi = WhatsappAPI();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserName = decodedToken.name;
  const id = decodedToken.id;
  const { toastAlert, toastError } = useGlobalContext();

  const [allUserData, setAllUserData] = useState([]);
  const [username, setUserName] = useState("");

  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  const [contact, setContact] = useState("");
  const [personalContact, setPersonalContact] = useState("");

  const [backendSpeakingLanguage, setBackendSpeakingLanguage] = useState("");
  const [speakingLanguage, setSpeakingLanguage] = useState([]);

  const [joiningDate, setJoiningDate] = useState("");
  const [daysLeftToJoining, setDaysLeftToJoining] = useState("");

  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [FatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Documents states
  const [XMarksheet, setXMarksheet] = useState(null);
  const [XMarksheetValidation, setXMarksheetValidation] = useState("Pending");

  const [XIIMarksheet, setXIIMarksheet] = useState(null);
  const [XIIMarksheetValidation, setXIIMarksheetValidation] =
    useState("Pending");

  const [underGraduationDoc, setUnderGraduationDoc] = useState(null);
  const [underGraduationDocValidation, setUnderGraduationDocValidation] =
    useState("Pending");

  const [uid, setUID] = useState(null);
  const [uidValidation, setUIDValidation] = useState("Pending");

  const [panUpload, setPanUpload] = useState(null);
  const [panUploadValidation, setPanUploadValidation] = useState("Pending");

  const [Passport, setPassport] = useState(null);
  const [PassportValidation, setPassportValidation] = useState("Pending");

  const [experienceDoc, setExperienceDoc] = useState(null);
  const [experienceDocValidation, setExperienceDocValidation] =
    useState("Pending");

  const [passbookCheque, setPassbookCheque] = useState(null);
  const [passbookChequeValidation, setPassbookChequeValidation] =
    useState("Pending");

  const [previousOfferLetter, setPreviousOfferLetter] = useState(null);
  const [previousOfferLetterValidation, setPreviousOfferLetterValidation] =
    useState("Pending");

  const [previousRelievingLetter, setPreviousRelievingLetter] = useState(null);
  const [
    previousRelievingLetterValidation,
    setPreviousRelievingLetterValidation,
  ] = useState("Pending");

  //Doucment Status
  const [documentPercentage, setDocumentPercentage] = useState(0);

  //Permanent Address
  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");

  //Current Address
  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  //contact
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [emergencyContact2, setEmergencyContact2] = useState(null);

  //Family Fields
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [familyValidationErrors, setFamilyValidationErrors] = useState({});


  //Education Fields
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  const gettingData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      const fetchedData = res.data;

      const preselectedHobbies = fetchedData?.Hobbies?.map((hobbyId) => ({
        value: hobbyId,
        label: hobbiesData?.find((hobby) => hobby?.hobby_id == hobbyId)
          ?.hobby_name,
      }));

      setHobbies(preselectedHobbies);
      const {
        user_name,
        user_email_id,
        PersonalEmail,
        user_contact_no,
        PersonalNumber,
        fatherName,
        motherName,
        Hobbies,
        Gender,
        BloodGroup,
        Nationality,
        SpokenLanguages,
        user_login_id,
        user_login_password,
        joining_date,
        DOB,
        MartialStatus,
        DateOfMarriage,
        spouse_name,
        tenth_marksheet_validate,
        twelveth_marksheet_validate,
        UG_Marksheet_validate,
        uid_validate,
        pan_validate,
        passport_validate,
        pre_expe_letter_validate,
        pre_off_letter_validate,
        pre_relieving_letter_validate,
        bankPassBook_Cheque_validate,
        permanent_address,
        permanent_city,
        permanent_state,
        permanent_pin_code,
        current_address,
        current_city,
        current_state,
        current_pin_code,
        emergency_contact1,
        alternate_contact,
        image_url,
        nick_name,
        showOnboardingModal,
        image,
        coc_flag,
        designation_name,
      } = fetchedData;
      setDesignation(designation_name);
      setAllUserData(fetchedData);
      setUserName(user_name);
      setEmail(user_email_id);
      setPersonalEmail(PersonalEmail);
      setContact(user_contact_no);
      setPersonalContact(PersonalNumber);
      setPersonalEmail(PersonalEmail);
      setFatherName(fatherName);
      setMotherName(motherName);
      setGender(Gender);
      setBloodGroup(BloodGroup);
      {
        Nationality && setNationality(Nationality);
      }
      setBackendSpeakingLanguage(SpokenLanguages);
      setLoginId(user_login_id);
      setPassword(user_login_password);

      setJoiningDate(
        joining_date?.split("T")[0].split("-").reverse().join("-")
      );
      setDaysLeftToJoining(joining_date);
      setMaritialStatus(MartialStatus);
      setDateOfBirth(DOB?.split("T")?.[0]);
      setDateOfMarraige(DateOfMarriage);
      setSpouseName(spouse_name);
      {
        tenth_marksheet_validate !== "" &&
          setXMarksheetValidation(tenth_marksheet_validate);
      }
      {
        twelveth_marksheet_validate !== "" &&
          setXIIMarksheetValidation(twelveth_marksheet_validate);
      }
      {
        UG_Marksheet_validate !== "" &&
          setUnderGraduationDocValidation(UG_Marksheet_validate);
      }
      {
        uid_validate !== "" && setUIDValidation(uid_validate);
      }
      {
        pan_validate !== "" && setPanUploadValidation(pan_validate);
      }
      {
        passport_validate !== "" && setPassportValidation(passport_validate);
      }
      {
        pre_expe_letter_validate !== "" &&
          setExperienceDocValidation(pre_expe_letter_validate);
      }
      {
        pre_off_letter_validate !== "" &&
          setPreviousOfferLetterValidation(pre_off_letter_validate);
      }
      {
        pre_relieving_letter_validate !== "" &&
          setPreviousRelievingLetterValidation(pre_relieving_letter_validate);
      }
      {
        bankPassBook_Cheque_validate !== "" &&
          setPassbookChequeValidation(bankPassBook_Cheque_validate);
      }
      setPermanentAddress(permanent_address);
      setPermanentCity(permanent_city);
      setPermanentState(permanent_state);
      setPermanentPincode(permanent_pin_code);
      setCurrentAddress(current_address);
      setcurrentCity(current_city);
      setcurrentState(current_state);
      setcurrentPincode(current_pin_code);
      setEmergencyContact(alternate_contact);
      setEmergencyContact2(emergency_contact1);
      setGetProfile(image_url);
      setGetNickName(nick_name);
      setProfileImage(image);
      {
        showOnboardingModal && openReadyToOnboardModal();
      }
      setCocFlag(coc_flag);
    });
  };

  function validateAndCorrectUserName(userName) {
    userName = userName.replace(/\s{2,}/g, " ").trim();

    const lettersOnly = /^[A-Za-z]+$/;

    const correctedNameParts = userName.split(" ").map((part) => {
      let filteredPart = part
        .split("")
        .filter((char) => char.match(lettersOnly))
        .join("");

      return (
        filteredPart.charAt(0).toUpperCase() +
        filteredPart.slice(1).toLowerCase()
      );
    });

    const correctedUserName = correctedNameParts.join(" ");

    return correctedUserName.replace(/\s+/g, " ").trim();
  }
  useEffect(() => {
    async function getDetails() {
      const familyDataResponse = await axios.get(
        `${baseUrl}` + `get_single_family/${id}`
      );
      const educationDataResponse = await axios.get(
        `${baseUrl}` + `get_single_education/${id}`
      );
      setFamilyDetails(familyDataResponse.data.data);
      setEducationDetails(educationDataResponse.data.data);
    }
    getDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FatherName) {
      return toastError("Father Name is Required");
    } else if (!motherName || motherName == "") {
      return toastError("Mother Name is Required");
    } else if (!currentAddress || currentAddress == "") {
      return toastError("Current address is Required");
    } else if (!currentState || currentState == "") {
      return toastError("Current State is Required");
    } else if (!currentCity || currentCity == "") {
      return toastError("Current City is Required");
    } else if (!currentPincode || currentPincode == "") {
      return toastError("Current Pincode is Required");
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("user_email_id", email);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_contact_no", Number(contact));
    formData.append("personal_number", personalContact);
    formData.append("Personal_email", personalEmail);
    formData.append("alternate_contact", Number(emergencyContact));
    formData.append("emergency_contact1", Number(emergencyContact2));

    // document open ---------->
    formData.append("tenth_marksheet", XMarksheet);
    formData.append("twelveth_marksheet", XIIMarksheet);
    formData.append("UG_Marksheet", underGraduationDoc);
    formData.append("UID", uid);
    formData.append("pan", panUpload);
    formData.append("passport", Passport);
    formData.append("pre_expe_letter", experienceDoc);
    formData.append("pre_off_letter", previousOfferLetter);
    formData.append("pre_relieving_letter", previousRelievingLetter);
    formData.append("bankPassBook_Cheque", passbookCheque);
    // document close ---------->

    // document verification open----------->
    formData.append("tenth_marksheet_validate", XMarksheetValidation);
    formData.append("twelveth_marksheet_validate", XIIMarksheetValidation);
    formData.append("UG_Marksheet_validate", underGraduationDocValidation);
    formData.append("uid_validate", uidValidation);
    formData.append("pan_validate", panUploadValidation);
    formData.append("passport_validate", PassportValidation);
    formData.append("pre_expe_letter_validate", experienceDocValidation);
    formData.append("pre_off_letter_validate", previousOfferLetterValidation);
    formData.append(
      "pre_relieving_letter_validate",
      previousRelievingLetterValidation
    );
    formData.append("bankPassBook_Cheque_validate", passbookChequeValidation);
    // document verification close----------->

    formData.append(
      "joining_date",
      joiningDate?.split("-").reverse().join("-")
    );
    formData.append(
      "SpokenLanguages",
      speakingLanguage?.map((lang) => lang).join(", ")
    );
    formData.append("Gender", gender);
    formData.append("Nationality", nationality);
    formData.append("DOB", dateOfBirth);
    formData.append("fatherName", FatherName);
    formData.append("motherName", motherName);
    formData.append(
      "Hobbies",
      hobbies.map((hobby) => hobby.value)
    );
    formData.append("BloodGroup", bloodGroup);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);

    //Permanent address ------------>
    formData.append("permanent_address", permanentAddress);
    formData.append("permanent_city", permanentCity);
    formData.append("permanent_state", permanentState);
    formData.append("permanent_pin_code", Number(permanentPincode));

    //Cuurent Addresss -------------->
    formData.append("current_address", currentAddress);
    formData.append("current_city", currentCity);
    formData.append("current_state", currentState);
    formData.append("current_pin_code", Number(currentPincode));

    formData.append("latitude", coordinates.latitude);
    formData.append("longitude", coordinates.longitude);

    formData.append("document_percentage", documentPercentage);
    formData.append("document_percentage_mandatory", showMandotaryPer);
    formData.append("document_percentage_non_mandatory", showNonMandotaryPer);

    await axios.put(`${baseUrl}` + `update_user`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    //Posting/Update Guardian Details
    for (const elements of guardianDetails) {
      let payload = {
        user_id: id,
        guardian_name: elements.guardian_name,
        guardian_contact: elements.guardian_contact,
        guardian_address: elements.guardian_address,
        relation_with_guardian: elements.relation_with_guardian,
      };
      if (elements.guardian_id) {
        payload.guardian_id = elements.guardian_id;
      }

      try {
        const response = await axios.put(baseUrl + "update_guardian", payload);
      } catch (error) {
        console.error("Error Update/Creating Guardian", error);
      }
    }

    //family
    for (const elements of familyDetails) {
      let payload = {
        user_id: id,
        name: elements.name,
        DOB: elements.DOB,
        relation: elements.relation,
        contact: elements.contact,
        occupation: elements.occupation,
        annual_income: elements.annual_income,
      };

      if (elements.family_id) {
        payload.family_id = elements.family_id;
      }
      try {
        const response = await axios.put(baseUrl + "update_family", payload);
      } catch (error) {
        console.error("Error updating family details:", error);
      }
    }

    //Education
    for (const elements of educationDetails) {
      let payload = {
        user_id: id,
        title: elements.title,
        institute_name: elements.institute_name,
        from_year: elements.from_year,
        to_year: elements.to_year,
        percentage: Number(elements.percentage),
        stream: elements.stream,
        specialization: elements.specialization,
      };

      if (elements.education_id) {
        payload.education_id = elements.education_id;
      }
      try {
        await axios.put(baseUrl + "update_education", payload);
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }

    setXIIMarksheet(null);
    setXIIMarksheet(null);
    setUnderGraduationDoc(null);
    setUID(null);
    setPanUpload(null);
    setPassport(null);
    setExperienceDoc(null);
    setPreviousOfferLetter(null);
    setPreviousRelievingLetter(null);
    setPassbookCheque(null);

    gettingData();
    setIsSubmitting(false);

    // After update send mail
    axios
      .post(baseUrl + "add_send_user_mail", {
        email: "lalit@creativefuel.io",
        subject: "User Pre Onboarding",
        text: "Pre Onboarding Data Update Successfully",
        attachment: "",
        login_id: loginId,
        name: username,
        password: password,
      })
      .then((res) => {
        console.log("Email sent successfully:", res.data);
      })
      .catch((error) => {
        console.log("Failed to send email:", error);
      });
    whatsappApi.callWhatsAPI("CF_Document_upload", "9826116769", username, [
      username,
    ]);

    Swal.fire({
      title: "Good job!",
      text: "Details Submitted Successfully!",
      icon: "success",
    });
    // toastAlert("User Update");
    // gettingData();
  };

  const handleFullNameChange = (event) => {
    let userName = event.target.value;
    const lettersOnly = /^[A-Za-z]+$/;

    const correctedNameParts = userName.split(" ").map((part) => {
      let filteredPart = part
        .split("")
        .filter((char) => char.match(lettersOnly))
        .join("");

      return (
        filteredPart.charAt(0).toUpperCase() +
        filteredPart.slice(1).toLowerCase()
      );
    });
    
    setUserName(correctedNameParts.join(" "));
  };

  //familyDetails
  const handleAddFamilyDetails = () => {
    setFamilyDetails([...familyDetails, { ...initialFamilyDetailsGroup }]);
  };

  const handleFamilyDetailsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = [...familyDetails];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };

    const errors = { ...familyValidationErrors };
    if (name === "contact") {
      if (!/^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value)) {
        errors[`${name}-${index}`] =
          "Invalid contact number. Please enter a valid phone number.";
      } else {
        delete errors[`${name}-${index}`];
      }
    }

    setFamilyDetails(updatedDetails);
    setFamilyValidationErrors(errors);
  };

  const handleRemoveFamilyDetails = async (index) => {
    const itemToRemove = familyDetails[index];
    if (itemToRemove && itemToRemove.family_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_family/${itemToRemove.family_id}`
        );
        toastAlert("Details Deleted");
      } catch (error) {
        console.error("Error deleting family detail:", error);
        return;
      }
    }

    const newFamilyDetails = familyDetails.filter((_, idx) => idx !== index);
    setFamilyDetails(newFamilyDetails);
  };

  //EducationDetailsAdd
  const handleAddEducationDetails = () => {
    setEducationDetails([
      ...educationDetails,
      { ...initialEducationDetailsGroup },
    ]);
  };

  const handleEducationDetailsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedEducationDetails = [...educationDetails];
    const detailToUpdate = updatedEducationDetails[index];

    if (name === "percentage" && value > 100) {
      return toastError("Can't input value greater than 100");
    }

    detailToUpdate[name] = value;

    if (name === "from_year" || name === "to_year") {
      const fromYear = detailToUpdate["from_year"]
        ? new Date(detailToUpdate["from_year"])
        : null;
      const toYear = detailToUpdate["to_year"]
        ? new Date(detailToUpdate["to_year"])
        : null;

      if (fromYear && toYear && fromYear > toYear) {
        return toastError("'From year' should not be greater than 'To year'");
      }
    }

    setEducationDetails(updatedEducationDetails);
  };

  const handleRemoveEducationDetails = async (index) => {
    const itemToRemove = educationDetails[index];
    if (itemToRemove && itemToRemove.education_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_education/${itemToRemove.education_id}`
        );
        toastAlert("Details Deleted");
      } catch (error) {
        console.error("Error Deleting Education Detail:", error);
        return;
      }
    }
    const newEducationDetails = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(newEducationDetails);
  };

  useEffect(() => {
    axios.get(`${baseUrl}get_all_hobbies`).then((res) => {
      setHobbiesData(res.data.data);
    });
  }, []);
  const filteredHobbyOption = hobbiesData
    .filter(
      (category) =>
        !hobbies.find((selected) => selected.value === category.hobby_id)
    )
    .map((category) => ({
      label: category.hobby_name,
      value: category.hobby_id,
    }));
  const categoryChangeHandler = (e, op) => {
    setHobbies(op);
  };

  useEffect(() => {
    setSpeakingLanguage(
      backendSpeakingLanguage ? backendSpeakingLanguage.split(",") : []
    );
  }, [backendSpeakingLanguage]);


  const openReadyToOnboardModal = () => {
    setReadyToOnboard(true);
  };

  const closeReadyToOnboardModal = () => {
    setReadyToOnboard(false);
  };

  const handleIamReady = () => {
    setReadyToOnboard(false);
    handleGetOnboard();
    openRocket();
  };

  const openRocket = () => {
    setIsShowRocket(true);
  };

  const closeRocket = () => {
    setIsShowRocket(false);
    openTour();
  };

  const openTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
    OpenImageSelector();
  };

  const OpenImageSelector = () => {
    setIsImageSelectorOpen(true);
  };

  const CloseImageSelector = () => {
    setIsImageSelectorOpen(false);
  };

  const openReactModal = () => {
    setIsModalOpen(true);
  };

  const closeReactModal = () => {
    setIsModalOpen(false);
  };
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsCurrent(checked);
    if (checked) {
      setPermanentAddress(currentAddress);
      setPermanentCity(currentCity);
      setPermanentState(currentState);
      setPermanentPincode(currentPincode);
    } else {
      setPermanentAddress("");
      setPermanentCity("");
      setPermanentState("");
      setPermanentPincode("");
    }
  };

  const getDocuments = async () => {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: id,
    });
    setDocumentData(response.data.data);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="formarea">
          <div className="row spacing_lg">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="board_form board_form_flex">
                <h2>On-Boarding Form</h2>
                <h3>
                  Your Current Joning Date is : &nbsp;
                  <span>{joiningDate}</span>
                  <button
                    className="btn btn-primary extndBtn"
                    type="button"
                    onClick={openReactModal}
                  >
                    Extend
                  </button>
                  <Modal
                    className="onboardModal2"
                    isOpen={isModalOpen}
                    onRequestClose={closeReactModal}
                    contentLabel="Modal"
                    appElement={document.getElementById("root")}
                    shouldCloseOnOverlayClick={true}
                  >
                    <ExtendJoining
                      gettingData={gettingData}
                      id={id}
                      loginId={loginId}
                      username={username}
                      password={password}
                      email={personalEmail}
                      currentJoiningDate={joiningDate}
                      closeModal={closeReactModal}
                    />
                  </Modal>
                </h3>
                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    type="text"
                    // className="form-control"
                    name="name"
                    // disabled
                    InputProps={{
                      readOnly: true,
                    }}
                    value={username}
                    onChange={handleFullNameChange}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label="Personal Email"
                    variant="outlined"
                    type="email"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                <div className="form-group">
                  <ContactNumber
                    label="Personal Contact"
                    setParentComponentContact={setPersonalContact}
                    parentComponentContact={personalContact}
                  />
                </div>

                <div className="form-group form_select">
                  <Autocomplete
                    disablePortal
                    disabled
                    id="combo-box-demo"
                    options={genderData}
                    // defaultValue={genderData[0]}
                    value={gender}
                    onChange={(e, newValue) => setGender(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Gender" />
                    )}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label={
                      <span>
                        Father Name<span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    variant="outlined"
                    type="text"
                    name="father Name"
                    value={FatherName}
                    onChange={(e) => setFatherName(FormatName(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label={
                      <span>
                        Mother Name<span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    variant="outlined"
                    type="text"
                    value={motherName}
                    onChange={(e) => {
                      setMotherName(FormatName(e.target.value));
                    }}
                  />
                </div>

                {/* <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                name="father occupation "
                                placeholder="Father’s Occupation "
                              />
                            </div> */}

                <div className="form-group form_select">
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={filteredHobbyOption}
                    getOptionLabel={(option) => option.label}
                    InputLabelProps={{ shrink: true }}
                    renderInput={(params) => (
                      <TextField {...params} label="Hobbies" />
                    )}
                    onChange={categoryChangeHandler}
                    value={hobbies}
                  />
                </div>

                <div className="form-group form_select">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={bloodGroupData}
                    value={bloodGroup}
                    onChange={(event, newValue) => {
                      setBloodGroup(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Blood Group" />
                    )}
                  />
                </div>

                {maritialStatus === "Married  " && (
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Spouse Name"
                      variant="outlined"
                      type="text"
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                    />
                  </div>
                )}
                {maritialStatus == "Married" && (
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Date Of Marriage"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      type="date"
                      value={dateOfMarraige}
                      onChange={(e) => setDateOfMarraige(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <Autocomplete
                    multiple
                    id="multi-select-autocomplete"
                    options={LanguageList} // Use correct array for options
                    value={speakingLanguage}
                    onChange={(event, newValue) =>
                      setSpeakingLanguage(newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Spoken Languages" />
                    )}
                  />
                </div>

                <div className="form-group Muiform_date">
                  <TextField
                    id="outlined-basic"
                    label="Date Of Birth"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  {/* <TextField
                                  id="outlined-basic"
                                  label="Nationality"
                                  variant="outlined"
                                  type="text"
                                  value={nationality}
                                  onChange={(e) =>
                                    setNationality(e.target.value)
                                  }
                                /> */}

                  <Autocomplete
                    options={nationalityData}
                    value={nationality}
                    readOnly
                    onChange={(e, newValue) => {
                      setNationality(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nationality "
                        variant="outlined"
                      />
                    )}
                  />
                </div>

                <div className="form-group">
                  <ContactNumber
                    label="Emergency Contact 1"
                    parentComponentContact={emergencyContact}
                    setParentComponentContact={setEmergencyContact}
                  />
                </div>
                <div className="form-group">
                  <ContactNumber
                    label="Emergency Contact 2"
                    parentComponentContact={emergencyContact2}
                    setParentComponentContact={setEmergencyContact2}
                  />
                </div>
                <hr />

                <FamilyFields
                  familyDetails={familyDetails}
                  familyDisplayFields={familyDisplayFields}
                  familyFieldLabels={familyFieldLabels}
                  familyValidationErrors={familyValidationErrors}
                  handleFamilyDetailsChange={handleFamilyDetailsChange}
                  handleAddFamilyDetails={handleAddFamilyDetails}
                  handleRemoveFamilyDetails={handleRemoveFamilyDetails}
                />
                <hr />
                <EducationFields
                  educationDetails={educationDetails}
                  educationDispalyFields={educationDispalyFields}
                  educationFieldLabels={educationFieldLabels}
                  handleEducationDetailsChange={handleEducationDetailsChange}
                  handleAddEducationDetails={handleAddEducationDetails}
                  handleRemoveEducationDetails={handleRemoveEducationDetails}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="board_form board_form_flex">
                <h2>Current Address</h2>
                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label={
                      <span>
                        Current Address<span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    variant="outlined"
                    type="text"
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <IndianStatesMui
                    selectedState={currentState}
                    onChange={(option) =>
                      setcurrentState(option ? option : null)
                    }
                  />
                </div>

                <div className="form-group">
                  <IndianCitiesMui
                    selectedState={currentState}
                    selectedCity={currentCity}
                    onChange={(option) =>
                      setcurrentCity(option ? option : null)
                    }
                  />
                </div>

                <div className="form-group">
                  <TextField
                    required
                    id="outlined-basic"
                    label="Current Pincode"
                    variant="outlined"
                    type="text"
                    value={currentPincode}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleanedValue = value.replace(/\D/g, "");
                      if (cleanedValue.length <= 6) {
                        setcurrentPincode(cleanedValue);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="board_form form_checkbox">
                <label className="cstm_check">
                  Permanent Address Same as Current Address
                  <input
                    className="form-control"
                    type="checkbox"
                    checked={sameAsCurrent}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              <div className="board_form board_form_flex">
                <h2>Permanent Address</h2>

                <div className="form-group">
                  <TextField
                    required
                    id="outlined-basic"
                    label="Permanent Address"
                    variant="outlined"
                    type="text"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <IndianStatesMui
                    selectedState={permanentState}
                    onChange={(option) =>
                      setPermanentState(option ? option : null)
                    }
                  />
                </div>

                <div className="form-group">
                  <IndianCitiesMui
                    selectedState={permanentState}
                    selectedCity={permanentCity}
                    onChange={(option) =>
                      setPermanentCity(option ? option : null)
                    }
                  />
                </div>

                <div className="form-group">
                  <TextField
                    required
                    id="outlined-basic"
                    label="Permanent Pincode"
                    variant="outlined"
                    type="text"
                    value={permanentPincode}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleanedValue = value.replace(/\D/g, "");
                      if (cleanedValue.length <= 6) {
                        setPermanentPincode(cleanedValue);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="form-group ml-auto mr-auto text-center">
                <button
                  className="btn onboardBtn btn_primary"
                  onClick={handleSubmit}
                  type="button"
                  disabled={
                    !currentAddress &&
                    !currentState &&
                    !permanentCity &&
                    !currentPincode &&
                    !permanentAddress &&
                    !permanentState &&
                    !permanentCity &&
                    !permanentPincode &&
                    isSubmitting &&
                    true
                  }
                >
                  {isSubmitting ? "Submitting...." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default OnboardingForm;
