import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { AiOutlineReload } from "react-icons/ai";
import { useGlobalContext } from "../../../Context/Context";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import imageTest2 from "../../../assets/img/product/Avtrar2.png";
import imageTest3 from "../../../assets/img/product/Avtrar3.png";
import imageTest14 from "../../../assets/img/product/Avtrar14.png";
import imageTest5 from "../../../assets/img/product/Avtrar5.png";
import imageTest6 from "../../../assets/img/product/Avtrar6.png";
import imageTest7 from "../../../assets/img/product/Avtrar7.png";
import imageTest8 from "../../../assets/img/product/Avtrar8.png";
import imageTest15 from "../../../assets/img/product/Avtar15.png";
import imageTest16 from "../../../assets/img/product/Avtar16.png";
import imageTest17 from "../../../assets/img/product/Avtar17.png";
import imageTest18 from "../../../assets/img/product/Avtar18.png";
import imageTest19 from "../../../assets/img/product/Avtar19.png";
import imageTest20 from "../../../assets/img/product/Avtar20.png";
import imageTest21 from "../../../assets/img/product/Avtar21.png";
import imageTest22 from "../../../assets/img/product/Avtar22.png";
import imageTest23 from "../../../assets/img/product/Avtar23.png";
import imageTest24 from "../../../assets/img/product/Avtar24.png";
import imageTest25 from "../../../assets/img/product/Avtar25.png";
import imageTest26 from "../../../assets/img/product/Avtar26.png";
import imageTest27 from "../../../assets/img/product/Avtar27.png";
import imageTest28 from "../../../assets/img/product/Avtar28.png";
import imageTest29 from "../../../assets/img/product/Avtar29.png";
import imageTest30 from "../../../assets/img/product/Avtar30.png";
import Select from "react-select";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import IndianStates from "../../ReusableComponents/IndianStates";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { baseUrl } from "../../../utils/config";
import familyRelationList from "../../../assets/js/familyRelationList";
import OccupationList from "../../../assets/js/OccupationList";
import IndianBankList from "../../../assets/js/IndianBankList";
import { ToastContainer } from "react-toastify";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import EducationList from "../../../assets/js/EducationList";
import { constant } from "../../../utils/constants";
import { User } from "@phosphor-icons/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { isAfter, subYears } from "date-fns";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import dayjs from "dayjs";
import { FormatName } from "../../../utils/FormatName";
import { Line, Circle } from "rc-progress";

const colourOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Arabic", label: "Arabic" },
  { value: "Bengali", label: "Bengali" },
  { value: "Russian", label: "Russian" },
  { value: "Urdu", label: "Urdu" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Marathi", label: "Marathi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Italian", label: "Italian" },
  { value: "Other", label: "Other" },
];

const initialFamilyDetailsGroup = {
  Relation: "",
  Name: "",
  // DOB: "",
  Contact: "",
  Occupation: "",
  // Income: "",
};

const initialEducationDetailsGroup = {
  Title: "",
  Institute: "",
  From: "",
  To: "",
  Percentage: "",
  Stream: "",
  Specialization: "",
};
const educationDispalyFields = [
  "title",
  "institute_name",
  "from_year",
  "to_year",
  "percentage",
  "stream",
  "specialization",
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

const UserMaster = () => {
  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();
  const [userResID, setUserResID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Genral Information Tab-------------------Start------------------------------------
  // ---------------------Prsonal Info State Start
  const [username, setUserName] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalContact, setPersonalContact] = useState("");
  const [isValidcontact, setValidContact] = useState(false);
  const [isAlternateTouched1, setisAlternateTouched1] = useState(false);
  const [alternateContact, setAlternateContact] = useState("");
  const [isValidcontact3, setValidContact3] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [ageCalculate, setAgeCalculate] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");

  const [monthlyGrossSalary, setMonthlyGrossSalary] = useState("");
  const [ctc, setCTC] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  //---------------------Personal Info State End

  //--------------------Official Info State Start
  const [jobType, setJobType] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [subDepartment, setSubDeparment] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [roles, setRoles] = useState("");
  const [roledata, getRoleData] = useState([]);
  const [email, setEmail] = useState(""); //offical email
  const [validEmail, setValidEmail] = useState(true);
  const [contact, setContact] = useState(""); //official contact
  const [loginId, setLoginId] = useState("");
  const [loginResponse, setLoginResponse] = useState("");

  const [lastIndexUsed, setLastIndexUsed] = useState(-1);

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Active");
  const [joiningDate, setJoiningDate] = useState("");
  const [creditLimit, setCreditLimit] = useState(0);

  const [sitting, setSitting] = useState("");
  const [roomId, setRoomId] = useState("");
  const [refrenceData, getRefrenceData] = useState([]); //This is a sitting api state

  //--------------------Official Info State End
  // Genral Information Tab-------------------End------------------------------------

  // Other Information Tab-------------------Start------------------------------------
  //--------------------Other Info State Start
  //Current Address
  const [cityData, setCityData] = useState([]);

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [tempLanguage, setTempLanguage] = useState([]);
  const [speakingLanguage, setSpeakingLanguage] = useState("");
  const [cast, setCast] = useState("");
  //--------------------Other Info State End

  //--------------------Bank Info State Start
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [banktype, setBankType] = useState("");

  //--------------------Bank Info State End

  // Other Information Tab-------------------End------------------------------------

  //--------------------Family Info State Start
  // handleAddFamilyDetails define below this funciton
  //--------------------Family Info State End

  //--------------------Education Info State Start
  // handleEducationDetailsChange define below this funciton
  //--------------------Education Info State End

  const [reportL1Email, setReportL1Email] = useState([]);
  const [isValidcontact1, setValidContact1] = useState(false);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);
  const [isIFSCTouched, setisIFSCTouched] = useState(false);
  const [isValidIFSC, setValidIFSC] = useState(false);
  const [usersData, getUsersData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [uid, setUID] = useState("");

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [isGeneralSubmitted, setIsGeneralSubmitted] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const ROLEID = decodedToken.role_id;

  const [familyValidationErrors, setFamilyValidationErrors] = useState({});

  const [mandatoryFieldsEmpty, setMandatoryFieldsEmpty] = useState({
    fullName: false,
    department: false,
    subDepartment: false,
    designation: false,
    reportL1: false,
    personalContact: false,
    personalEmail: false,
    contact: false,
    alternateContact: false,
    loginId: false,
    password: false,
    spokenLanguage: false,
    profilePic: false,
    gender: false,
    nationality: false,
    DOB: false,
    bloodGroup: false,
    maritialStatus: false,
    currentAddress: false,
    currentCity: false,
    currentState: false,
    currentPincode: false,
    joiningDate: false,
    status: false,
    bankDetails: false,
    email: false,
    banktype: false,
    jobType: false,
    dateOfBirth: false,
  });
  const [jobTypeData, setJobTypeData] = useState([]);

  const [loading, setLoading] = useState(false);

  const higestQualificationData = [
    "10th",
    "12th",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "Other",
  ];
  const bankTypeData = ["Saving A/C", "Current A/C", "Salary A/C"];
  const statusData = ["Active", "Exit", "PreOnboard" , ];
  const genderData = ["Male", "Female", "Other"];
  const nationalityData = ["Indian", "USA", "Uk"];
  const bloodGroupData = [
    "A+ (A Positive)",
    "A- (A Negetive)",
    "B+ (B Positive)",
    "B- (B Negetive)",
    "AB+ (AB Positive)",
    "AB- (AB Negetive)",
    "O+ (O Positive)",
    "O- (O Negetive)",
  ];

  const castOption = ["General", "OBC", "SC", "ST"];
  const maritialStatusData = ["Single", "Married"]; //,"Divorced","Widowed","Separated"
  const [dobError, setDobError] = useState("");
  const [dobValidate, setDobValidate] = useState(0);

  useEffect(() => {
    const test = tempLanguage?.map((option) => option.value).join();
    setSpeakingLanguage(test);
  }, [tempLanguage]);

  useEffect(() => {
    if (department) {
      axios
        .get(`${baseUrl}` + `get_subdept_from_dept/${department}`)
        .then((res) => {
          setSubDepartmentData(res.data);
        });
    }
  }, [department]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_roles").then((res) => {
      getRoleData(res.data.data);
      setRoles(constant.CONST_USER_ROLE);
    });

    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });

    axios.get(baseUrl + "get_all_users").then((res) => {
      getUsersData(res.data.data);
      // const userSitting = res.data.data.map((user) => user.sitting_id);
      // setAllUsersSittings(userSitting);
    });

    // axios.get(baseUrl + "get_all_designations").then((res) => {
    //   setDesignationData(res.data.data);
    // });

    axios.get(baseUrl + "get_all_job_types").then((res) => {
      setJobTypeData(res.data.data);
    });

    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(baseUrl + "get_all_hobbies").then((res) => {
      setHobbiesData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (subDepartment) {
      axios
        .get(baseUrl + `get_all_designation/${subDepartment}`)
        .then((res) => {
          setDesignationData(res.data.data);
        });
    }
  }, [subDepartment]);
  // new-----------------------------------------------------
  const handleChange = (selectedOptions) => {
    setHobbies(selectedOptions || []);
  };

  const availableOptions = hobbiesData
    .filter(
      (option) =>
        !hobbies.some((selected) => selected.value === option.hobby_id)
    )
    .map((option) => ({
      value: option.hobby_id,
      label: option.hobby_name,
    }));

  const allUserData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      const reportl1Email = res.data.data?.filter((d) => d.user_id == reportL1);
      setReportL1Email(reportl1Email[0]?.user_email_id);
    });
  };
  useEffect(() => {
    allUserData();
  }, [reportL1]);

  // login progress bar---------------------------------------------------------------------
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fields = [
      username,
      selectedImage,
      personalEmail,
      personalContact,
      alternateContact,
      gender,
      dateOfBirth,
      age,
      nationality,
      maritialStatus,
      jobType,
      department,
      designation,
      reportL1,
      reportL2,
      reportL3,
      roles,
      email,
      contact,
      loginId,
      password,
      status,
      joiningDate,
      currentAddress,
      currentCity,
      currentState,
      currentState,
      currentPincode,
      address,
      city,
      state,
      pincode,
      bloodGroup,
      hobbies,
      speakingLanguage,
      cast,
      bankName,
      bankAccountNumber,
      beneficiary,
      IFSC,
      banktype,
    ];
    const filledFields = fields.filter((field) => field).length;
    const progressPercentage = (filledFields / fields.length) * 100;
    setProgress(progressPercentage);

    // Display toast notifications at specific milestones
    const milestones = [25, 50, 75, 100];
    if (milestones.includes(progressPercentage)) {
      // toast.info(`Progress: ${progressPercentage}%`, { position: "top-right" });
    }
  }, [
    username,
    selectedImage,
    personalEmail,
    personalContact,
    alternateContact,
    gender,
    dateOfBirth,
    age,
    nationality,
    maritialStatus,
    jobType,
    department,
    designation,
    reportL1,
    reportL2,
    reportL3,
    roles,
    email,
    contact,
    loginId,
    password,
    status,
    joiningDate,
    currentAddress,
    currentCity,
    currentState,
    currentState,
    currentPincode,
    address,
    city,
    state,
    pincode,
    bloodGroup,
    hobbies,
    speakingLanguage,
    cast,
    bankName,
    bankAccountNumber,
    beneficiary,
    IFSC,
    banktype,
  ]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!username) {
      errors.fullName = true;
    }
    if (!personalEmail) {
      errors.personalEmail = true;
    }
    if (!personalContact) {
      errors.personalContact = true;
    }
    if (!alternateContact) {
      errors.alternateContact = true;
    }
    if (!gender) {
      errors.gender = true;
    }
    if (!dateOfBirth) {
      errors.DOB = true;
    }
    if (!maritialStatus) {
      errors.maritialStatus = true;
    }
    if (!jobType) {
      errors.jobType = true;
    }
    if (!department) {
      errors.department = true;
    }
    if (!subDepartment) {
      errors.subDepartment = true;
    }
    if (!designation) {
      errors.designation = true;
    }
    if (!reportL1) {
      errors.reportL1 = true;
    }
    if (!loginId) {
      errors.loginId = true;
    }
    if (!password) {
      errors.password = true;
    }
    if (!joiningDate) {
      errors.joiningDate = true;
    }
    if (!dateOfBirth) {
      errors.dateOfBirth = true;
    }

    // Check for additional mandatory fields
    const mandatoryFields = [
      jobType,
      department,
      subDepartment,
      designation,
      roles,
      reportL1,
      personalEmail,
      personalContact,
      alternateContact,
      loginId,
      password,
      gender,
      nationality,
      dateOfBirth,
      maritialStatus,
      joiningDate,
      status,
      username,
    ];

    const isMandatoryFieldEmpty = mandatoryFields.some((field) => !field);

    if (isMandatoryFieldEmpty) {
      toastError("Fill the Mandatory fields");
      setMandatoryFieldsEmpty(errors);
      return; // Prevent form submission
    }

    if (personalContact.length !== 10) {
      toastError("Fill the Mandatory fields");
      return; // Prevent form submission
    }

    if (alternateContact.length !== 10) {
      toastError("Fill the Mandatory fields");
      return; // Prevent form submission
    }

    setMandatoryFieldsEmpty(errors); // Update state with errors

    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission
    }

    const formData = new FormData();
    formData.append("created_by", loginUserId);
    // personal info payload Start
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("image", selectedImage);
    formData.append("Personal_email", personalEmail);
    formData.append("personal_number", personalContact);
    formData.append("alternate_contact", alternateContact);
    formData.append("Gender", gender);
    formData.append("DOB", dateOfBirth);
    formData.append("Age", Number(ageCalculate));
    formData.append("Nationality", nationality);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);
    // personal info payload End

    //offcial info payload Start
    formData.append("job_type", jobType);
    formData.append("dept_id", department);
    formData.append("sub_dept_id", subDepartment);
    formData.append("user_designation", designation);
    formData.append("report_L1", reportL1);
    formData.append("report_L2", reportL2);
    formData.append("report_L3", reportL3);
    formData.append("role_id", roles);
    formData.append("user_email_id", personalEmail);
    formData.append("user_contact_no", personalContact);
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_status", status);
    formData.append("sitting_id", sitting);
    formData.append("room_id", 1);
    formData.append("joining_date", joiningDate);
    formData.append("user_credit_limit", creditLimit);

    formData.append("salary", monthlyGrossSalary);
    formData.append("ctc", ctc);
    //offcial info payload End

    try {
      const isLoginIdExists = usersData.some(
        (user) =>
          user.user_login_id?.toLocaleLowerCase() ===
          loginId?.toLocaleLowerCase()
      );
      const contactNumberExists = usersData.some(
        (user) => user.user_contact_no == personalContact
      );
      const emailIdExists = usersData.some(
        (user) =>
          user.user_email_id?.toLocaleLowerCase() ==
          personalEmail?.toLocaleLowerCase()
      );

      if (isLoginIdExists) {
        alert("this login ID already exists");
      } else if (contactNumberExists) {
        alert("Personal Contact Already Exists");
      } else if (emailIdExists) {
        alert("Personal Email Already Exists");
      } else {
        setIsLoading(true);
        const res = await axios.post(
          baseUrl + "add_user_for_general_information",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 200) {
          const userResponseID = res.data.simv.user_id;
          setUserResID(userResponseID);
          setIsFormSubmitted(true);
          setIsLoading(false);
          setIsGeneralSubmitted(true);
          setActiveAccordionIndex((prev) => prev + 1);
        } else {
          toastError("Sorry User is Not Created, Please try again later");
          setIsLoading(false);
        }

        await axios.post(baseUrl + "add_send_user_mail", {
          email: personalEmail,
          subject: "User Registration",
          text: "A new user has been registered.",
          attachment: selectedImage,
          login_id: loginId,
          name: username,
          password: password,
          status: "onboarded",
        });

        if (reportL1) {
          await axios.post(baseUrl + "add_send_user_mail", {
            email: personalEmail,
            subject: "User Registration",
            text: "A new user has been registered.",
            attachment: selectedImage,
            login_id: loginId,
            name: username,
            password: password,
            status: "reportTo",
            name2: reportL1Email,
          });

          whatsappApi.callWhatsAPI(
            "Extend Date by User",
            JSON.stringify(personalContact),
            username,
            ["You have assigned Report L1", "ok"]
          );
        }

        whatsappApi.callWhatsAPI(
          "userMng",
          JSON.stringify(personalContact),
          username,
          [username, loginId, password]
        );
        setFamilyDetails([initialFamilyDetailsGroup]);
        setEducationDetails([initialEducationDetailsGroup]);
      }
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  const handleSubmitOtherDetails = async (e) => {
    e.preventDefault();
    // if (currentAddress == "") {
    //   setMandatoryFieldsEmpty((prev) => ({
    //     ...prev,
    //     currentAddress: true,
    //   }));
    // }
    // if (currentPincode == "") {
    //   setMandatoryFieldsEmpty((prev) => ({
    //     ...prev,
    //     currentPincode: true,
    //   }));
    // }

    // if (!currentAddress || currentAddress == "") {
    //   return toastError("Fill the Mandatory fields");
    // } else if (!currentCity || currentCity == "") {
    //   return toastError("Current city is required");
    // } else if (!currentState || currentState == "") {
    //   return toastError("Current state is required");
    // } else if (!currentPincode || currentPincode == "") {
    //   return toastError("Fill the Mandatory fields");
    // }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_other_details/${userResID}`,
        {
          permanent_city: city?.value ? city.value : "",
          permanent_address: address,
          permanent_state: state,
          permanent_pin_code: Number(pincode),
          current_address: currentAddress,
          current_city: currentCity?.value ? currentCity.value : "",
          current_pin_code: Number(currentPincode),
          current_state: currentState,
          BloodGroup: bloodGroup,
          Hobbies: hobbies.map((hobby) => hobby.value),
          SpokenLanguages: speakingLanguage,
          cast_type: cast,
        }
      );
      toastAlert("Other Details Submitted");
      // console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const [bankProveImage, setBankProveImage] = useState(null);
  const handleSubmitBank = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bank_name", bankName);
    formData.append("account_no", bankAccountNumber);
    formData.append("ifsc_code", IFSC);
    formData.append("beneficiary", beneficiary);
    formData.append("account_type", banktype);
    formData.append("bank_proof_image", bankProveImage);

    if (bankName == "") {
      setMandatoryFieldsEmpty((prev) => ({
        ...prev,
        bankName: true,
      }));
    }
    if (bankAccountNumber == "") {
      setMandatoryFieldsEmpty((prev) => ({
        ...prev,
        bankAccountNumber: true,
      }));
    }
    if (banktype == "") {
      setMandatoryFieldsEmpty((prev) => ({
        ...prev,
        banktype: true,
      }));
    }
    if (IFSC == "") {
      setMandatoryFieldsEmpty((prev) => ({
        ...prev,
        IFSC: true,
      }));
    }

    if (!bankName || bankName == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!IFSC || IFSC == "" || IFSC.length < 11) {
      return toastError("Fill the Mandatory fields");
    } else if (!banktype || banktype == "") {
      return toastError("Fill the Mandatory fields");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_bank_details/${userResID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        // {
        //   // Bank info payload Start
        //   bank_name: bankName,
        //   account_no: bankAccountNumber,
        //   ifsc_code: IFSC,
        //   beneficiary: beneficiary,
        //   account_type: banktype,
        //   // Bank info payload End
        // },
        // setActiveAccordionIndex((prev) => prev + 1)
      );
      toastAlert("Bank Details Submitted");
      // console.log("Update successful", response.data);
      setActiveAccordionIndex((prev) => prev + 1);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const handleSubmitFamily = () => {
    try {
      if (familyDetails[0].Name !== "") {
        for (const elements of familyDetails) {
          const response = axios.put(baseUrl + "update_family", {
            user_id: userResID,
            name: elements.Name,
            // DOB: elements.DOB,
            relation: elements.Relation,
            contact: elements.Contact,
            occupation: elements.Occupation,
            // annual_income: elements.Income,
          });
        }
      }
      toastAlert("Submitted Family Details");
    } catch (error) {
      toastError(error);
    }
  };
  const handleSubmitEducation = () => {
    try {
      if (educationDetails[0].Title !== "") {
        for (const elements of educationDetails) {
          const response = axios.put(baseUrl + "update_education", {
            user_id: userResID,
            title: elements.Title,
            institute_name: elements.Institute,
            from_year: elements.From,
            to_year: elements.To,
            percentage: elements.Percentage,
            stream: elements.Stream,
            specialization: elements.Specialization,
          });
        }
      }
      toastAlert("Submitted Euducation Details ");
    } catch (error) {
      toastError(error);
    }
  };

  if (isFormSubmitted) {
    // return <Navigate to="/admin/user-overview" />;
  }

  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), "day");
  };

  // Email Validation
  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail == "") {
      setValidEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidEmail(emailRegex.test(newEmail));
    }
  }
  const today = new Date().toISOString().split("T")[0];

  // Number validation
  function handleContactChange(event) {
    const newContact = event.target.value;

    if (newContact.length <= 10) {
      setContact(newContact);

      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setContact("");
        setValidContact(false);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          contact: true,
        });
      } else {
        setContact(newContact);
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          contact: false,
        });
      }
    }
    setisContactTouched(true);
    if (newContact.length < 10) {
      setValidContact(false);
    }
  }
  function handlePersonalContactChange(event) {
    const newContact = event.target.value;

    if (newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setPersonalContact("");
        setValidContact1(false);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          personalContact: true,
        });
      } else {
        setPersonalContact(newContact);
        setValidContact1(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          personalContact: false,
        });
      }
    }
    setisContactTouched1(true);
    if (newContact.length < 10) {
      setValidContact1(false);
    }
  }

  function handleAlternateContactChange(event) {
    const newContact = event.target.value;

    if (newContact.length <= 10) {
      setAlternateContact(newContact);

      if (newContact === "") {
        setValidContact3(false);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: true,
        });
      } else {
        setValidContact3(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: false,
        });
      }
    }
    setisAlternateTouched1(true);
    if (newContact.length < 10) {
      setValidContact3(false);
    }
  }

  // Update Yearly Salary when Monthly Salary changes
  useEffect(() => {
    if (lastUpdated === "monthly") {
      const yearly = monthlyGrossSalary * 12;
      setCTC(yearly.toString());
    }
  }, [monthlyGrossSalary, lastUpdated]);

  // Update Monthly Salary when Yearly Salary changes
  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = ctc / 12;
      setMonthlyGrossSalary(monthly.toString());
    }
  }, [ctc, lastUpdated]);

  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = Math.round(ctc / 12);
      setMonthlyGrossSalary(monthly.toString()); // Now sets the salary to a rounded figure
    }
  }, [ctc, lastUpdated]);

  const handleMonthlySalaryChange = (e) => {
    const monthlySalary = e.target.value;

    // if (monthlySalary === "") {
    //   setIsRequired((prev) => ({
    //     ...prev,
    //     salary: true,
    //   }));
    // } else {
    //   setIsRequired((prev) => ({
    //     ...prev,
    //     salary: false,
    //   }));
    // }

    setMonthlyGrossSalary(monthlySalary);
    setLastUpdated("monthly");
  };

  const handleYearlySalaryChange = (e) => {
    const yearlySalaryValue = e.target.value;
    setCTC(yearlySalaryValue);
    setLastUpdated("yearly");

    // if (yearlySalaryValue === "") {
    //   setIsRequired((prev) => ({
    //     ...prev,
    //     salary: true,
    //   }));
    // } else {
    //   setIsRequired((prev) => ({
    //     ...prev,
    //     salary: false,
    //   }));
    // }
  };

  function handleAlternateBlur(e, type) {
    if (type == "alternateContact") {
      if (alternateContact == "" || alternateContact == null) {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: true,
        });
      } else {
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          alternateContact: false,
        });
      }
    }
    setisAlternateTouched(true);
    setisAlternateTouched1(true);
    if (contact.length < 10) {
      setValidAlternateContact(false);
      setValidAlternateContact1(false);
    }
  }

  // Password Auto Genrate
  const generatePassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let generatePassword = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatePassword += charset[randomIndex];
    }
    setPassword(generatePassword);
    if (generatePassword.length > 0) {
      setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, password: false });
    }
  };

  function trimeUserName(userName) {
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
    // Join the corrected parts back into a single string without spaces
    const correctedUserName = correctedNameParts.join("");
    return correctedUserName;
  }

  // const generateLoginId = async () => {
  //   const userName = username.trim().toLowerCase().split(" ");

  //   // Extracting last 4 and 6 digits from personal contact
  //   const personalContactLast4 = personalContact.slice(-4);
  //   const personalContactLast6 = personalContact.slice(-6);

  //   // Define login ID options
  //   let loginIdOptions = [
  //     userName[0], // lalit
  //     trimeUserName(username),
  //     // userName.join("."), // lalit.gour
  //     userName[0] + personalContactLast4, // lalit5413
  //     userName[0] + personalContactLast6, // lalit815413
  //   ];

  //   if (userName.length > 1) {
  //     loginIdOptions.push(
  //       userName[0].charAt(0) + userName[1], // lgour
  //       userName.join("") // lalitgour
  //     );
  //   }

  //   const nextIndex = (lastIndexUsed + 1) % loginIdOptions.length;
  //   setLastIndexUsed(nextIndex);
  //   const generatedLoginId = loginIdOptions[nextIndex];
  //   setLoginId(generatedLoginId);

  //   await axios
  //     .post(baseUrl + `check_login_exist`, {
  //       user_login_id: loginId,
  //     })
  //     .then((res) => {
  //       setLoginResponse(res.data.message);
  //     });

  //   if (generatedLoginId?.length > 0) {
  //     setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, loginId: false });
  //   }
  // };
  const generateLoginId = async () => {
    const userName = username.trim().toLowerCase().split(" ");

    // Extracting last 4 and 6 digits from personal contact
    const personalContactLast4 = personalContact.slice(-4);
    const personalContactLast6 = personalContact.slice(-6);

    // Define login ID options
    let loginIdOptions = [
      userName[0], // lalit
      userName.join("."), // lalit.gour
      userName[0] + personalContactLast4, // lalit5413
      userName[0] + personalContactLast6, // lalit815413
    ];

    if (userName.length > 1) {
      loginIdOptions.push(
        userName[0].charAt(0) + userName[1], // lgour
        userName.join("") // lalitgour
      );
    }

    const nextIndex = (lastIndexUsed + 1) % loginIdOptions.length;
    setLastIndexUsed(nextIndex);
    let generatedLoginId = loginIdOptions[nextIndex];

    // Check if the generated login ID already exists
    const response = await axios.post(baseUrl + `check_login_exist`, {
      user_login_id: generatedLoginId,
    });

    if (response.data.message === "login id not available") {
      // If login ID already exists, find the next available one
      let index = 1;
      while (true) {
        const nextGeneratedLoginId = `${generatedLoginId}_${index}`;
        const checkExistenceResponse = await axios.post(
          baseUrl + `check_login_exist`,
          {
            user_login_id: nextGeneratedLoginId,
          }
        );
        if (checkExistenceResponse.data.message === "login id available") {
          generatedLoginId = nextGeneratedLoginId;
          break;
        }
        index++;
      }
    }

    setLoginId(generatedLoginId);
    setLoginResponse(response.data.message);

    if (generatedLoginId?.length > 0) {
      setMandatoryFieldsEmpty((prev) => ({ ...prev, loginId: false }));
    }
  };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    setLoginId(selectedLoginId);
  };

  const handleAccordionButtonClick = (index) => {
    // {
    if (userResID !== "") setActiveAccordionIndex(index);
    // console.log("hhhhhh");
    // console.log("ss");
  };

  const images = [
    imageTest1,
    imageTest2,
    imageTest3,
    imageTest14,
    imageTest5,
    imageTest6,
    imageTest7,
    imageTest8,
    imageTest15,
    imageTest16,
    imageTest17,
    imageTest18,
    imageTest19,
    imageTest20,
    imageTest21,
    imageTest22,
    imageTest23,
    imageTest24,
    imageTest25,
    imageTest26,
    imageTest27,
    imageTest28,
    imageTest29,
    imageTest30,
  ];

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsCurrent(checked);
    if (checked) {
      setAddress(currentAddress);
      setCity(currentCity);
      setState(currentState);
      setPincode(currentPincode);
    } else {
      setAddress("");
      setCity("");
      setState("");
      setPincode("");
    }
  };

  const handleImageClick = async (image) => {
    try {
      const response = await axios.get(image, {
        responseType: "arraybuffer", // Request the image as an array buffer
      });

      setImagePreview(image);

      const blob = new Blob([response.data], { type: "image/jpeg" });
      setSelectedImage(blob);
    } catch (error) {
      // console.error("Error loading image:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  // const calculateAge = (dob) => {
  //   const currentDate = new Date();
  //   const birthDate = new Date(dob);
  //   let age = currentDate.getFullYear() - birthDate.getFullYear();
  //   const m = currentDate.getMonth() - birthDate.getMonth();

  //   if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
  //     age--;
  //   }

  //   return age;
  // };

  useEffect(() => {
    // console.log(dateOfBirth, "dateOfBirth");
  }, [dateOfBirth]);

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const difference = currentDate - birthDate;
    // Convert milliseconds to days
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    // Calculate years and remaining days
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    return `${years} years ${remainingDays} days`;
  }
  function calculateAgeInDays(dob) {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const difference = currentDate - birthDate;
    // Convert milliseconds to days
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return days;
  }

  const handleDateChange = (e) => {
    const selectedDate = e;
    const validateAge = dayjs().diff(e, "year");
    setDobValidate(validateAge);

    const age = calculateAge(selectedDate);
    const ageDays = calculateAgeInDays(selectedDate);

    if (validateAge < 15 || validateAge > 100) {
      setDobError("Age can't less than 15 or greater than 100 years.");
      setDateOfBirth("");
    } else {
      setDobError("");
    }
    setDateOfBirth(selectedDate);
    setAge(age);
    setAgeCalculate(ageDays);
  };

  function addMore() {
    setDocuments([...documents, { name: "", file: null }]);
  }
  function reomveField() {
    setDocuments(documents.slice(0, -1));
  }
  function handleDocumentName(index, value) {
    const updatedDocuments = [...documents];
    updatedDocuments[index].name = value;
    setDocuments(updatedDocuments);
  }
  function handleDocumentChange(index, file) {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = file;
    setDocuments(updatedDocuments);
  }

  //familyDetails
  const handleAddFamilyDetails = () => {
    setFamilyDetails([...familyDetails, { ...initialFamilyDetailsGroup }]);
  };
  const handleFamilyDetailsChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = [...familyDetails];
    updatedDetails[index] = { ...updatedDetails[index], [name]: value };

    const errors = { ...familyValidationErrors };

    if (name === "Contact") {
      if (!/^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(value)) {
        errors[`${name}-${index}`] = "Please Enter a valid phone number.";
      } else {
        delete errors[`${name}-${index}`];
      }
    }

    setFamilyDetails(updatedDetails);
    setFamilyValidationErrors(errors);
  };

  const handleRemoveFamilyDetails = (index) => {
    const newFamilyDetails = familyDetails.filter((_, idx) => idx !== index);
    setFamilyDetails(newFamilyDetails);
  };

  function handleLanguageSelect(selectedOption) {
    setTempLanguage(selectedOption);
  }

  //EducationDetailsAdd
  const handleAddEducationDetails = (e) => {
    e.preventDefault;
    setEducationDetails([
      ...educationDetails,
      { ...initialEducationDetailsGroup },
    ]);
  };

  // const handleEducationDetailsChange = (index, e) => {
  //   const updatedEducationDetails = educationDetails.map((detail, i) => {
  //     if (i === index) {
  //       return { ...detail, [e.target.name]: e.target.value };
  //     }
  //     return detail;
  //   });
  //   setEducationDetails(updatedEducationDetails);
  // };
  const handleEducationDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...educationDetails];

    if (name === "Percentage") {
      // Ensure percentage is a number and between 0 and 100
      let percentageValue = Number(value);
      if (percentageValue > 100) {
        percentageValue = 100;
      } else if (percentageValue < 0) {
        percentageValue = 0;
      }
      updatedDetails[index][name] = percentageValue.toString(); // Update percentage
    } else {
      updatedDetails[index][name] = value; // Update other fields
    }

    setEducationDetails(updatedDetails);
  };

  const handleRemoveEducationDetails = (index) => {
    const newEducationDetails = educationDetails.filter((_, i) => i !== index);
    setEducationDetails(newEducationDetails);
  };

  const isPersonalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmail);

  // const accordionButtons = ["General", "Others", "Education & Family"];
  const accordionButtons = ["General", "Others", "Education & Family"];
  const accordionButtonstitle = [
    "Personal & Official Details",
    "Other & Bank Details",
    "Upload Document",
  ];
  const indicator = {
    completed: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="20" height="20" rx="10" fill="#782BE4" />
        <path
          d="M9 11.793L7.3535 10.1465L6.6465 10.8535L9 13.207L13.8535 8.35348L13.1465 7.64648L9 11.793Z"
          fill="var(--bg-white)"
        />
      </svg>
    ),
    active: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#782BE4" />
        <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="white" />
        <rect x="6" y="6" width="8" height="8" rx="4" fill="white" />
      </svg>
    ),
    disabled: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.25"
          y="0.25"
          width="19.5"
          height="19.5"
          rx="9.75"
          fill="#ABB7C2"
          fill-opacity="0.1"
        />
        <rect
          x="0.25"
          y="0.25"
          width="19.5"
          height="19.5"
          rx="9.75"
          stroke="#CFD6DC"
          stroke-width="0.5"
        />
      </svg>
    ),
  };
  // if (userResID) {
  // accordionButtons.push();
  // }

  // const handleFullNameChange = (event) => {
  //   let userName = event.target.value;
  //   if (userName !== "") {
  //     setMandatoryFieldsEmpty((prevState) => ({
  //       ...prevState,
  //       fullName: false,
  //     }));
  //   }

  //   const lettersOnly = /^[A-Za-z]+$/;

  //   const correctedNameParts = userName.split(" ").map((part) => {
  //     let filteredPart = part
  //       .split("")
  //       .filter((char) => char.match(lettersOnly))
  //       .join("");

  //     return (
  //       filteredPart.charAt(0).toUpperCase() +
  //       filteredPart.slice(1).toLowerCase()
  //     );
  //   });
  //   setUserName(correctedNameParts.join(" "));
  // };
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

    // Check if the input is empty on blur
    if (userName === "") {
      setMandatoryFieldsEmpty((prevState) => ({
        ...prevState,
        fullName: true,
      }));
    } else {
      setMandatoryFieldsEmpty((prevState) => ({
        ...prevState,
        fullName: false,
      }));
    }
  };

  // to disable admin and super admin in role dropdown start
  const modifiedRoleData = roledata.map((option) => ({
    value: option.role_id,
    label: option.Role_name,
    isDisabled: ROLEID === 1 && (option.role_id === 1 || option.role_id === 6),
  }));
  const selectedRole = roledata.find((role) => role.role_id === roles);
  // to disable admin and super admin in role dropdown end

  const genralFields = (
    <>
      {/* Personal Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Personal Details</div>
        <div className="card-body row">
          <div className=" col-3">
            <FieldContainer
              label="Full Name"
              astric={true}
              fieldGrid={12}
              value={username}
              onChange={handleFullNameChange}
            />
            <div className="h-100 w-100">
              {mandatoryFieldsEmpty?.fullName && (
                <p className="form-error">Please Enter Full Name</p>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <FieldContainer
              label="Personal Email"
              astric={true}
              type="email"
              fieldGrid={12}
              required={false}
              value={personalEmail}
              onChange={(e) => {
                const email = e.target.value;
                setPersonalEmail(email);

                if (email === "") {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    personalEmail: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    personalEmail: false,
                  }));
                }
              }}
            />
            {!isPersonalEmailValid && personalEmail && (
              <p className="form-error">Please Enter valid email</p>
            )}
            {mandatoryFieldsEmpty.personalEmail && (
              <p className="form-error">Please Enter Personal Email</p>
            )}
          </div>

          <div className="col-3">
            <FieldContainer
              label="Personal Contact"
              astric={true}
              type="number"
              fieldGrid={12}
              value={personalContact}
              required={false}
              onChange={handlePersonalContactChange}
              // onBlur={(e) => handleContentBlur(e, "personalContact")}
            />
            {(isContactTouched1 || personalContact.length >= 10) &&
              !isValidcontact1 && (
                <p className="form-error">
                  Please Enter a valid Contact Number
                </p>
              )}
            {mandatoryFieldsEmpty.personalContact && (
              <p className="form-error">Please Enter Personal Contact</p>
            )}
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <div className="form-group">
              <div className="flex-row w-100 justify-content-center">
                <div className="hover-label">
                  <button
                    id="uploadImage"
                    className="profile-holder-1 ml-1"
                    data-bs-toggle="modal"
                    data-bs-target="#transferModal"
                    title="Upload Image"
                    style={{
                      border:
                        selectedImage === null
                          ? "1px solid var(--medium)"
                          : "none",
                    }}
                  >
                    {!selectedImage && <User style={{ fontSize: "400px" }} />}
                    {selectedImage && (
                      <img
                        className="profile-holder-1"
                        src={imagePreview}
                        alt="Selected"
                      />
                    )}
                  </button>

                  <div className="hover-lab">Upload Image</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <FieldContainer
              label="Alternate Contact"
              astric={true}
              type="number"
              fieldGrid={12}
              value={alternateContact}
              required={false}
              onChange={handleAlternateContactChange}
              // onBlur={(e) => handleAlternateBlur(e, "alternateContact")}
            />
            {(isAlternateTouched1 || alternateContact.length >= 10) &&
              !isValidcontact3 && (
                <p className="form-error">Please Enter a valid Number</p>
              )}
            {mandatoryFieldsEmpty.alternateContact && (
              <p className="form-error">Please Enter Alternate Contact</p>
            )}
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Gender <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={genderData.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: gender,
                label: `${gender}`,
              }}
              onChange={(e) => {
                setGender(e.value);

                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    gender: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    gender: false,
                  });
                }
              }}
              required
            />
            {mandatoryFieldsEmpty.gender && (
              <p className="form-error">Please Enter Gender</p>
            )}
          </div>
          <div className="from-group col-3">
            <label className="form-label">
              DOB <sup className="form-error">*</sup>
            </label>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateOfBirth}
                onChange={handleDateChange}
                shouldDisableDate={disableFutureDates}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {mandatoryFieldsEmpty?.fullName && (
              <p className="form-error">Please Enter DOB</p>
            )}
            {<p className="form-error">{dobError}</p>}
          </div>
          {dateOfBirth !== "" && (
            <FieldContainer fieldGrid={3} label="Age" value={age} />
          )}

          <div className="form-group col-3">
            <label className="form-label">
              Nationality <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={nationalityData.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: nationality,
                label: `${nationality}`,
              }}
              onChange={(e) => {
                setNationality(e.value);
              }}
              required
            />
            {mandatoryFieldsEmpty.nationality && (
              <p className="form-error">Please Enter nationality</p>
            )}
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Marital Status <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={maritialStatusData.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: maritialStatus,
                label: `${maritialStatus}`,
              }}
              onChange={(e) => {
                setMaritialStatus(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    maritialStatus: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    maritialStatus: false,
                  });
                }
              }}
              required={false}
            />
            {mandatoryFieldsEmpty.maritialStatus && (
              <p className="form-error">Please Enter Maritial Status</p>
            )}
          </div>

          {maritialStatus === "Married" && (
            <FieldContainer
              label="Spouse Name"
              value={spouseName}
              fieldGrid={3}
              onChange={(e) => setSpouseName(FormatName(e.target.value))}
              required={false}
            />
          )}
          {maritialStatus == "Married" && (
            //
            <div className="col-3">
              <label className="form-label">Date Of Marraige</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dateOfMarraige}
                  onChange={(e) => setDateOfMarraige(e)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info Inputs------------------------End------------ */}

      {/* Official Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Official Details</div>
        <div className="card-body row">
          <div className="form-group col-3">
            <label className="form-label">
              Job Type <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={jobTypeData.map((option) => ({
                value: `${option.job_type}`,
                label: `${option.job_type}`,
              }))}
              value={{
                value: jobType,
                label: `${jobType}`,
              }}
              onChange={(e) => {
                setJobType(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    jobType: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    jobType: false,
                  });
                }
              }}
              required
            />
            <div className="">
              {mandatoryFieldsEmpty.jobType && (
                <p className="form-error">Please Enter Job Type</p>
              )}
            </div>
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Department Name <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={departmentdata.map((option) => ({
                value: option.dept_id,
                label: `${option.dept_name}`,
              }))}
              value={{
                value: department,
                label:
                  departmentdata.find((user) => user.dept_id === department)
                    ?.dept_name || "",
              }}
              onChange={(e) => {
                setDepartment(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    department: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    department: false,
                  });
                }
              }}
              required
            />
            <div className="">
              {mandatoryFieldsEmpty.department && (
                <p className="form-error">Please Enter Department</p>
              )}
            </div>
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Sub Department <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={subDepartmentData.map((option) => ({
                value: option.sub_dept_id,
                label: `${option.sub_dept_name}`,
              }))}
              value={{
                value: subDepartmentData,
                label:
                  subDepartmentData.find(
                    (user) => user.sub_dept_id === subDepartment
                  )?.sub_dept_name || "",
              }}
              onChange={(e) => {
                setSubDeparment(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    subDepartment: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    subDepartment: false,
                  });
                }
              }}
              required
            />
            <div className="">
              {mandatoryFieldsEmpty.subDepartment && (
                <p className="form-error">Please Enter Sub Department</p>
              )}
            </div>
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Designation <sup className="form-error">*</sup>
            </label>
            <Select
              options={designationData.map((option) => ({
                value: option.desi_id,
                label: `${option.desi_name}`,
              }))}
              value={{
                value: designation,
                label:
                  designationData.find((user) => user.desi_id === designation)
                    ?.desi_name || "",
              }}
              onChange={(e) => {
                setDesignation(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    designation: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    designation: false,
                  });
                }
              }}
              required
            />
            <div className="">
              {mandatoryFieldsEmpty.designation && (
                <p className="form-error">Please Enter Designation</p>
              )}
            </div>
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Report L1 <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={usersData.map((option) => ({
                value: option.user_id,
                label: `${option.user_name}`,
              }))}
              value={{
                value: reportL1,
                label:
                  usersData.find((user) => user.user_id === reportL1)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setReportL1(e.value);

                // onBlur functionality
                if (e.value === "" || e.value === null) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    reportL1: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    reportL1: false,
                  });
                }
              }}
              required
            />
            <div className="">
              {mandatoryFieldsEmpty.reportL1 && (
                <p className="form-error">Please Enter Report L1</p>
              )}
            </div>
          </div>

          <div className="form-group col-3">
            <label className="form-label">Report L2</label>
            <Select
              className=""
              options={usersData.map((option) => ({
                value: option.user_id,
                label: `${option.user_name}`,
              }))}
              value={{
                value: reportL2,
                label:
                  usersData.find((user) => user.user_id === reportL2)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setReportL2(e.value);
              }}
              required={false}
            />
          </div>

          <div className="form-group col-3">
            <label className="form-label">Report L3</label>
            <Select
              className=""
              options={usersData.map((option) => ({
                value: option.user_id,
                label: `${option.user_name}`,
              }))}
              value={{
                value: reportL3,
                label:
                  usersData.find((user) => user.user_id === reportL3)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setReportL3(e.value);
              }}
              required={false}
            />
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Role <sup className="form-error">*</sup>
            </label>
            <Select
              options={modifiedRoleData}
              value={
                selectedRole
                  ? {
                      value: selectedRole.role_id,
                      label: selectedRole.Role_name,
                    }
                  : null
              }
              onChange={(e) => {
                setRoles(e.value);
              }}
            />
          </div>
          <div className="col-md-3">
            <FieldContainer
              label="Official Email"
              type="email"
              placeholder="Not Allocated"
              fieldGrid={3}
              value={email}
              onChange={handleEmailChange}
              onBlur={() => {
                if (email === "") {
                  // setMandatoryFieldsEmpty({...mandatoryFieldsEmpty,personalEmail:true});
                  return setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    email: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    email: false,
                  });
                }
              }}
            />
            {!validEmail && (
              <p className="form-error">*Please Enter valid email</p>
            )}
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <FieldContainer
              label="Official Contact"
              type="number"
              placeholder="Not Allocated"
              fieldGrid={3}
              value={contact}
              required={true}
              onChange={handleContactChange}
              // onBlur={handleContentBlur}
            />
            {(isContactTouched || contact.length >= 10) && !isValidcontact && (
              <p className="form-error">Please Enter a valid Contact Number</p>
            )}
            {mandatoryFieldsEmpty.contact && (
              <p className="form-error">Please Enter Official Contact</p>
            )}
          </div>

          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <div className="form-group">
              {/* <p
            className={
              loginResponse == "login id available"
                ? "login-success1"
                : "login-error1"
            }
          >
            {loginResponse}
          </p> */}
              <label>
                Login ID <sup className="form-error">*</sup>
              </label>
              <div className="input-group">
                <input
                  className="form-control"
                  // className={`form-control ${
                  //   loginId
                  //     ? loginResponse === "login id available"
                  //       ? "login-success-border"
                  //       : "login-error-border"
                  //     : ""
                  // }`}
                  value={loginId}
                  disabled
                  onChange={handleLoginIdChange}
                  onBlur={() => {
                    if (loginId === "") {
                      return setMandatoryFieldsEmpty((prevState) => ({
                        ...prevState,
                        loginId: true,
                      }));
                    } else {
                      setMandatoryFieldsEmpty({
                        ...mandatoryFieldsEmpty,
                        loginId: false,
                      });
                    }
                  }}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-primary"
                    onClick={generateLoginId}
                    type="button"
                  >
                    <AiOutlineReload />
                  </button>
                </div>
              </div>
            </div>
            {mandatoryFieldsEmpty.loginId && (
              <p className="form-error">Please Enter Login ID</p>
            )}
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <div className="form-group">
              <label>
                Generate Password <sup className="form-error">*</sup>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    // onBlur functionality
                    if (e.target.value === "") {
                      setMandatoryFieldsEmpty((prevState) => ({
                        ...prevState,
                        password: true,
                      }));
                    } else {
                      setMandatoryFieldsEmpty({
                        ...mandatoryFieldsEmpty,
                        password: false,
                      });
                    }
                  }}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-primary"
                    onClick={generatePassword}
                    type="button"
                  >
                    <i className="fa-solid fa-repeat"></i>
                  </button>
                </div>
              </div>
            </div>
            {mandatoryFieldsEmpty.password && (
              <p className="form-error">Please Enter Password</p>
            )}
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Status <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={statusData.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: status,
                label: `${status}`,
              }}
              onChange={(e) => {
                setStatus(e.value);
              }}
              onBlur={() => {
                if (status === "" || status === null) {
                  return setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    status: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    status: false,
                  });
                }
              }}
              required
            />
            {mandatoryFieldsEmpty.status && (
              <p className="form-error">Please Enter Status</p>
            )}
          </div>
          <div className="from-group col-3">
            <label className="form-label">
              Joining Date <sup className="form-error">*</sup>
            </label>
            {/* <div className="pack" style={{ position: "relative" }}>
          <input
            type="date"
            className="form-control"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
          />
          <div className="custom-btn-2">
            <i
              class="bi bi-calendar-week"
              style={{
                pointereEvents: "none",
                position: "absolute",
                bottom: "7px",
                right: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                color: "var(--medium)",
                height: "34px",
                width: "42px",
                borderRadius: "0  12px 12px 0",
                borderLeft: "1px solid var(--border)",
                backgroundColor: "var(--white)",
              }}
            ></i>
          </div>
        </div> */}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={joiningDate}
                // onChange={(e) => setJoiningDate(e)}
                onChange={(e) => {
                  setJoiningDate(e);

                  // Check if joiningDate is empty
                  if (!e) {
                    setMandatoryFieldsEmpty((prevState) => ({
                      ...prevState,
                      joiningDate: true,
                    }));
                  } else {
                    setMandatoryFieldsEmpty({
                      ...mandatoryFieldsEmpty,
                      joiningDate: false,
                    });
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {mandatoryFieldsEmpty.joiningDate && (
              <p className="form-error">Please Enter Joining Date</p>
            )}
          </div>

          <div className="col-3">
            <FieldContainer
              label="Monthly Gross Salary"
              type="number"
              fieldGrid={3}
              required={false}
              value={monthlyGrossSalary}
              // onChange={(e) => {
              //   const value = e.target.value;
              //   if (/^\d{0,7}$/.test(value)) {
              //     setMonthlyGrossSalary(value);
              //   }
              // }}
              onChange={handleMonthlySalaryChange}
            />
            {/* {isRequired.salary && (
                  <p className="form-error">Please Enter Monthly Salary</p>
                )} */}
          </div>
          <div className="col-3">
            <FieldContainer
              label="CTC"
              type="number"
              fieldGrid={3}
              required={false}
              value={ctc}
              onChange={handleYearlySalaryChange}
              // onChange={(e) => {
              //   const value = e.target.value;
              //   // Limit input to 6 digits
              //   if (/^\d{0,7}$/.test(value)) {
              //     setCTC(value);
              //   }
              // }}
            />
            {/* {isRequired.salary && (
                  <p className="form-error">Please Enter CTC</p>
                )} */}
          </div>

          {department == constant.CONST_SALES_DEPT_ID && (
            <FieldContainer
              label="Credit Limit"
              type="number"
              fieldGrid={3}
              value={creditLimit}
              required={true}
              onChange={(e) => setCreditLimit(e.target.value)}
            />
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {/* <button
          type="button"
          className="btn btn-primary mr-2"
          onClick={handleSubmit}
        >
          Submit & Next
        </button> */}
            <button
              type="submit"
              className="btn cmnbtn btn-primary"
              onClick={handleSubmit}
              // disabled={isLoading}
              disabled={isLoading || userResID !== ""}
              style={{ width: "20%", marginLeft: "1%" }}
            >
              {isLoading ? "Please wait submiting..." : "Register"}
            </button>
          </div>

          {/* Official Info Inputs------------------------End------------ */}

          {/* Transfer Modal Start  Profile Modal*/}
          <div
            className="modal fade alert_modal transfer_modal "
            id="transferModal"
            tabIndex={-1}
            aria-labelledby="transferModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content m-0">
                <div className="modal-body">
                  <div>
                    {selectedImage && (
                      <div className=" flex-row  w-100 justify-content-center">
                        <div
                          className="profile-holder"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <img
                            src={imagePreview}
                            alt="Selected"
                            className="profile-holder"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <h5>Choose Image:</h5>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {images.map((image) => (
                          <img
                            key={image}
                            src={image}
                            // alt={imageName}
                            style={{
                              width: "80px",
                              height: "80px",
                              margin: "5px",
                              cursor: "pointer",
                              borderRadius: "50%",
                            }}
                            onClick={() => handleImageClick(image)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5>Upload Image:</h5>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required={false}
                      />
                    </div>
                  </div>
                  <div className="alert_text">
                    <button
                      className="btn cmnbtn btn_success"
                      data-bs-dismiss="modal"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {jobType == "WFO" && (
        <div className="form-group col-3">
          <label className="form-label">
            Seat Number <sup  className="form-error">*</sup>
          </label>
          <Select
            className=""
            options={refrenceData.map((option) => ({
              value: `${option?.sitting_id}`,
              label: `${option?.sitting_ref_no} | ${option?.sitting_area}`,
            }))}
            value={{
              value: `${sitting ? sitting : ""}`,
              label: `${roomId?.sitting_ref_no ? roomId?.sitting_ref_no : ""} ${
                roomId ? "|" : ""
              } ${roomId?.sitting_area ? roomId?.sitting_area : ""}`,
            }}
            onChange={(e) => {
              const selectedSittingId = e.value;
              setSitting(selectedSittingId);
              const selectedOption = refrenceData.find(
                (option) => option.sitting_id === Number(selectedSittingId)
              );
              setRoomId(selectedOption);
            }}
            required={true}
          />
        </div>
      )} */}
    </>
  );

  const othersFields = (
    <>
      <div className="card">
        {/* Other Info Inputs------------------------Start------------ */}
        <div className="card-header">Other Details</div>
        {/* Current Address input-- */}
        <div className="card-body">
          <div className="row">
            <FieldContainer
              label="Current Address"
              fieldGrid={12}
              // astric={true}
              value={currentAddress}
              onChange={(e) => {
                setCurrentAddress(e.target.value);

                // onBlur functionality
                if (e.target.value === "") {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    currentAddress: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    currentAddress: false,
                  });
                }
              }}
              required={false}
            />
            {/* {mandatoryFieldsEmpty.currentAddress && (
              <p className="form-error">Please Enter Address</p>
            )} */}
            {/* <div className="form-group col-4">
          <label className="form-label">
            Current City <sup className="form-error">*</sup>
          </label>
          <Select
            options={cityData.map((city) => ({
              value: city.city_name,
              label: city.city_name,
            }))}
            onChange={setcurrentCity}
            required={true}
            value={currentCity}
            placeholder="Select a city..."
            isClearable
          />
        </div>

        <div className="form-group col-4">
          <IndianStates
            onChange={(option) => setcurrentState(option ? option.value : null)}
          />
        </div> */}
            <div className="form-group col-4 mt-3">
              <label htmlFor=""> State</label>
              <IndianStatesMui
                selectedState={currentState}
                onChange={(option) => setcurrentState(option ? option : null)}
              />
            </div>

            <div className="form-group col-4 mt-3">
              <label htmlFor=""> City</label>

              <IndianCitiesMui
                selectedState={currentState}
                selectedCity={currentCity}
                onChange={(option) => setcurrentCity(option ? option : null)}
              />
            </div>
            <div className="col-3">
              <FieldContainer
                label="Pincode"
                type="number"
                // astric={true}
                fieldGrid={3}
                maxLength={6}
                // placeholder="123456"
                value={currentPincode}
                onChange={(e) => {
                  const value = e.target.value;

                  // Ensure that the input value consists of maximum 6 digits
                  if (/^\d{0,6}$/.test(value)) {
                    setcurrentPincode(value);

                    // onBlur functionality
                    if (value === "") {
                      setMandatoryFieldsEmpty((prevState) => ({
                        ...prevState,
                        currentPincode: true,
                      }));
                    } else {
                      setMandatoryFieldsEmpty({
                        ...mandatoryFieldsEmpty,
                        currentPincode: false,
                      });
                    }
                  }
                }}
                required={false}
              />
              {/* {mandatoryFieldsEmpty.currentPincode && (
                <p className="form-error">Please Enter Pincode</p>
              )} */}
            </div>
            {/*  Permanent Address here------------ */}
            <div className="">
              <label className="cstm_check form-error">
                Same as Current Address
                <input
                  className="form-control"
                  type="checkbox"
                  checked={sameAsCurrent}
                  onChange={handleCheckboxChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>

          <hr className="mb-2 mt-3" />
          <div className="row">
            <FieldContainer
              label="Permanent Address"
              fieldGrid={12}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required={false}
            />

            {/* {mandatoryFieldsEmpty.address && (
        <p  className="form-error">Please Enter Address</p>
      )} */}
            {/* <div className="form-group col-4">
        <label className="form-label">Permanent City</label>
        <Select
          options={cityData.map((city) => ({
            value: city.city_name,
            label: city.city_name,
          }))}
          onChange={setCity}
          required={true}
          value={city}
          placeholder="Select a city..."
          isClearable
        />
      </div>
      <div className="form-group col-4">
        <IndianStates
          onChange={(option) => setState(option ? option.value : null)}
          newValue={state}
        />
      </div> */}

            <div className="form-group col-3 mt-3">
              <label htmlFor="">Permanent State</label>
              <IndianStatesMui
                selectedState={state}
                onChange={(option) => setState(option ? option : null)}
              />
            </div>

            <div className="form-group col-3 mt-3">
              <label htmlFor="">Permanent City</label>
              <IndianCitiesMui
                selectedState={state}
                selectedCity={city}
                onChange={(option) => setCity(option ? option : null)}
              />
            </div>
            <div className="form-group col-3 mt-3">
              <FieldContainer
                label="Permanent Pincode"
                type="number"
                fieldGrid={4}
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setPincode(value);
                  }
                }}
                required={false}
              />
            </div>

            {/* {mandatoryFieldsEmpty.pincode && (
        <p  className="form-error">Please Enter Pincode</p>
      )} */}
            <div className="form-group col-3 mt-3">
              <label className="form-label">Blood Group</label>
              <Select
                className=""
                options={bloodGroupData.map((option) => ({
                  value: `${option}`,
                  label: `${option}`,
                }))}
                value={{
                  value: bloodGroup,
                  label: `${bloodGroup}`,
                }}
                onChange={(e) => {
                  setBloodGroup(e.value);
                }}
                // onBlur={() => {
                //   if (
                //     bloodGroup === "" ||
                //     bloodGroup === null ||
                //     bloodGroup.length === 0
                //   ) {
                //     setMandatoryFieldsEmpty((prevState) => ({
                //       ...prevState,
                //       bloodGroup: true,
                //     }));
                //   } else {
                //     setMandatoryFieldsEmpty({
                //       ...mandatoryFieldsEmpty,
                //       bloodGroup: false,
                //     });
                //   }
                // }}
                required={false}
              />

              {/* {mandatoryFieldsEmpty.bloodGroup && (
          <p className="form-error">Please Enter Blood Group</p>
        )} */}
            </div>
            <div className="form-group col-3">
              <label className="form-label">Hobbies</label>
              <Select
                isMulti
                options={availableOptions}
                value={hobbies}
                onChange={handleChange}
                isClearable={true}
                classNamePrefix="select"
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">Spoken Languages</label>
              <Select
                isMulti
                name="langauages"
                options={colourOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                value={tempLanguage}
                onChange={handleLanguageSelect}
                // onBlur={() => {
                //   if (
                //     tempLanguage === "" ||
                //     tempLanguage === null ||
                //     tempLanguage.length === 0
                //   ) {
                //     return setMandatoryFieldsEmpty((prevState) => ({
                //       ...prevState,
                //       language: true,
                //     }));
                //   } else {
                //     setMandatoryFieldsEmpty({
                //       ...mandatoryFieldsEmpty,
                //       language: false,
                //     });
                //   }
                // }}
              />
              {/* {mandatoryFieldsEmpty.language && (
          <p className="form-error">Please Enter Languages</p>
        )} */}
            </div>

            <div className="form-group col-3">
              <label className="form-label">Category</label>
              <Select
                className=""
                options={castOption.map((option) => ({
                  value: option,
                  label: `${option}`,
                }))}
                value={{
                  value: cast,
                  label: cast,
                }}
                onChange={(e) => {
                  setCast(e.value);
                }}
                onBlur={() => {
                  if (cast === "" || cast === null) {
                    setMandatoryFieldsEmpty((prevState) => ({
                      ...prevState,
                      cast: true,
                    }));
                  } else {
                    setMandatoryFieldsEmpty({
                      ...mandatoryFieldsEmpty,
                      cast: false,
                    });
                  }
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn cmnbtn btn-primary mr-2"
              onClick={handleSubmitOtherDetails}
            >
              Submit Other Details
            </button>
          </div>
        </div>
      </div>

      {/* Other Info Inputs------------------------End------------ */}

      {/* Bank Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Bank Details</div>
        <div className="card-body row">
          <div className="form-group col-6">
            <label className="form-label">
              Bank Name <sup className="form-error">*</sup>
            </label>
            <Select
              options={IndianBankList}
              isClearable
              isSearchable
              value={
                bankName
                  ? IndianBankList.find((bank) => bank.value === bankName)
                  : null
              }
              // onChange={(selectedOption) => {
              //   setBankName(selectedOption ? selectedOption.value : null);
              // }}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              onChange={(selectedOption) => {
                setBankName(selectedOption ? selectedOption.value : null);

                // onBlur functionality
                setMandatoryFieldsEmpty((prevState) => ({
                  ...prevState,
                  bankName: !selectedOption,
                }));
              }}
              // onBlur={() => {
              //   setMandatoryFieldsEmpty((prevState) => ({
              //     ...prevState,
              //     bankName: !bankName,
              //   }));
              // }}
              required
            />
            {mandatoryFieldsEmpty.bankName && (
              <p className="form-error">Please Enter Bank Name</p>
            )}
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Bank Type <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={bankTypeData.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: banktype,
                label: `${banktype}`,
              }}
              onChange={(e) => {
                setBankType(e.value);

                // onBlur functionality
                if (!e.value) {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    banktype: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    banktype: false,
                  });
                }
              }}
              required
            />
            {mandatoryFieldsEmpty.banktype && (
              <p className="form-error">Please Enter Bank Type</p>
            )}
          </div>
          <div className="col-3">
            <FieldContainer
              label="Bank Account Number"
              astric={true}
              fieldGrid={3}
              value={bankAccountNumber}
              maxLength={17} // Adding maxLength prop
              onChange={(e) => {
                const inputValue = e.target.value;
                const onlyNumbers = /^[0-9]+$/;

                if (onlyNumbers.test(inputValue) && inputValue.length <= 17) {
                  setBankAccountNumber(inputValue);
                } else if (inputValue === "") {
                  setBankAccountNumber("");
                }

                // onBlur functionality
                if (inputValue === "") {
                  setMandatoryFieldsEmpty((prevState) => ({
                    ...prevState,
                    bankAccountNumber: true,
                  }));
                } else {
                  setMandatoryFieldsEmpty({
                    ...mandatoryFieldsEmpty,
                    bankAccountNumber: false,
                  });
                }
              }}
            />
            {mandatoryFieldsEmpty.bankAccountNumber && (
              <p className="form-error">Please Enter Bank Account Number</p>
            )}
          </div>
          <FieldContainer
            astric={true}
            label="IFSC"
            value={IFSC}
            // onChange={(e) => setIFSC(e.target.value.toUpperCase())}
            onChange={(e) => {
              const inputValue = e.target.value.toUpperCase();
              setIFSC(inputValue.slice(0, 11)); // Limiting the input to 11 characters
              setisIFSCTouched(true);
              if (inputValue.length < 11) {
                setValidIFSC(false);
                setisIFSCTouched(false);
              }

              // onBlur functionality
              if (inputValue === "") {
                setValidIFSC(false);
                setMandatoryFieldsEmpty((prevState) => ({
                  ...prevState,
                  IFSC: true,
                }));
              } else {
                setValidIFSC(false);
                setMandatoryFieldsEmpty({
                  ...mandatoryFieldsEmpty,
                  IFSC: false,
                });
              }
            }}
          />
          {isIFSCTouched ||
            (IFSC.length < 11 && !isValidIFSC && (
              <p className="form-error">IFSC Code must be 11 digit</p>
            ))}
          {mandatoryFieldsEmpty.IFSC && (
            <p className="form-error">Please Enter IFSC</p>
          )}
          {/* <FieldContainer
            label="Beneficiary"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
          <FieldContainer
            label="Upload Proof"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              setBankProveImage(e.target.files[0]);
            }}
            fieldGrid={6}
            required={true}
          /> */}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn cmnbtn btn-primary mr-2"
              onClick={handleSubmitBank}
            >
              Submit Bank Details
            </button>
          </div>
        </div>
      </div>

      {/* Bank Info Inputs------------------------End------------ */}

      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div> */}
    </>
  );

  const educationFamilyFieald = (
    <>
      {/* Family Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Family Details</div>
        <div className="card-body">
          {familyDetails.map((detail, index) => (
            <div key={index} mb={2}>
              <div className="row">
                {Object.keys(detail).map((key) => {
                  switch (key) {
                    // case "DOB":
                    //   return (
                    //     <FieldContainer
                    //       key={key}
                    //       fieldGrid={2}
                    //       type="date"
                    //       name={key}
                    //       label="Date of Birth"
                    //       value={detail[key]}
                    //       onChange={(e) => handleFamilyDetailsChange(index, e)}
                    //     />
                    //   );
                    case "Relation":
                      return (
                        <div className="form-group col-3">
                          <label className="form-label">Relation</label>
                          <Select
                            label="Relation"
                            placeholder="Select Relation"
                            className=""
                            options={familyRelationList}
                            name={key}
                            value={
                              familyRelationList.find(
                                (option) => option.value === detail.Relation
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleFamilyDetailsChange(index, {
                                target: {
                                  name: key,
                                  value: selectedOption
                                    ? selectedOption.value
                                    : "",
                                },
                              })
                            }
                            isClearable={true}
                            isSearchable={true}
                            required={false}
                          />
                        </div>
                      );
                    case "Occupation":
                      return (
                        <div className="form-group col-3">
                          <label className="form-label">Occupation</label>
                          <Select
                            label="Occupation"
                            placeholder="Select Occupation"
                            className=""
                            options={OccupationList}
                            name={key}
                            value={
                              OccupationList.find(
                                (option) => option.value === detail.Occupation
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              handleFamilyDetailsChange(
                                index,
                                {
                                  target: {
                                    name: key,
                                    value: selectedOption
                                      ? selectedOption.value
                                      : "",
                                  },
                                },
                                true
                              )
                            }
                            isClearable={true}
                            isSearchable={true}
                          />
                        </div>
                      );

                    case "Contact":
                      return (
                        <div className="col-3">
                          <FieldContainer
                            key={key}
                            fieldGrid={3}
                            type="number"
                            name={key}
                            label={key}
                            placeholder={key}
                            value={detail[key]}
                            onChange={(e) =>
                              handleFamilyDetailsChange(index, e)
                            }
                          />
                          {familyValidationErrors[`Contact-${index}`] && (
                            <span className="form-error">
                              {familyValidationErrors[`Contact-${index}`]}
                            </span>
                          )}
                        </div>
                      );

                    // case "Income":
                    //   return (
                    //     <FieldContainer
                    //       key={key}
                    //       type="number"
                    //       fieldGrid={2}
                    //       name={key}
                    //       label={key}
                    //       placeholder={key}
                    //       value={detail[key]}
                    //       onChange={(e) => handleFamilyDetailsChange(index, e)}
                    //     />
                    //   );

                    default:
                      return (
                        <FieldContainer
                          key={key}
                          fieldGrid={3}
                          name={key}
                          label={key}
                          placeholder={key}
                          value={FormatName(detail[key])}
                          onChange={(e) => handleFamilyDetailsChange(index, e)}
                        />
                      );
                  }
                })}
                {familyDetails.length > 1 && (
                  <IconButton onClick={() => handleRemoveFamilyDetails(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
          <div className="row">
            <div className="col-12">
              {familyDetails.length < 3 && (
                <button
                  onClick={handleAddFamilyDetails}
                  variant="contained"
                  className="btn cmnbtn btn-outline-primary me-2"
                >
                  Add More Family Details
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn cmnbtn btn-primary mr-2"
              onClick={handleSubmitFamily}
            >
              Submit Family Details
            </button>
          </div>
        </div>
      </div>

      {/* Family Info Inputs------------------------End------------ */}

      {/* Education Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Education Details</div>
        <div className="card-body">
          {educationDetails.map((detail, index) => (
            <div key={index} mb={2}>
              <div className="row">
                {Object.keys(detail).map((key) =>
                  key === "From" || key === "To" ? (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      required={false}
                      label={key}
                      value={detail[key]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                      min={key === "To" ? detail.From : undefined}
                      disabled={key === "To" && !detail.From}
                    />
                  ) : (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      name={key}
                      required={false}
                      label={key}
                      value={detail[key]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  )
                )}
                {educationDetails.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveEducationDetails(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
          <div className="row">
            <div className="col-12">
              {educationDetails.length < 5 && (
                <button
                  type="button"
                  onClick={(e) => handleAddEducationDetails(e)}
                  variant="contained"
                  className="btn cmnbtn btn-outline-primary me-2"
                >
                  Add More Education Details
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn cmnbtn btn-primary mr-2"
              onClick={handleSubmitEducation}
            >
              Submit Education Details
            </button>
          </div>
        </div>
      </div>

      {/* Education Info Inputs------------------------End------------ */}

      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
      </div> */}
    </>
  );

  return (
    <div>
      <FormContainer mainTitle={"User"} link={true} />

      <div className="user-tab w-100 mb-4">
        {accordionButtons.map((button, index) => (
          <div className="flex-row align-items-center w-100 gap-4">
            <button
              className={`tab ${
                activeAccordionIndex === index
                  ? "active"
                  : userResID !== ""
                  ? "completed"
                  : "disabled"
              }`}
              onClick={() => handleAccordionButtonClick(index)}
            >
              <div className="gap-1 flex-row">
                {activeAccordionIndex === index
                  ? indicator.active
                  : userResID !== ""
                  ? indicator.completed
                  : indicator.disabled}
                <p>{button}</p>
              </div>
              {accordionButtonstitle[index]}
            </button>
            {index !== accordionButtons.length - 1 && (
              <svg
                className="arrow"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Component 2">
                  <path
                    id="Vector (Stroke)"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.51171 4.43057C6.8262 4.161 7.29968 4.19743 7.56924 4.51192L13.5692 11.5119C13.81 11.7928 13.81 12.2072 13.5692 12.4881L7.56924 19.4881C7.29968 19.8026 6.8262 19.839 6.51171 19.5695C6.19721 19.2999 6.16079 18.8264 6.43036 18.5119L12.012 12L6.43036 5.48811C6.16079 5.17361 6.19721 4.70014 6.51171 4.43057ZM10.5119 4.43068C10.8264 4.16111 11.2999 4.19753 11.5694 4.51202L17.5694 11.512C17.8102 11.7929 17.8102 12.2073 17.5694 12.4882L11.5694 19.4882C11.2999 19.8027 10.8264 19.8391 10.5119 19.5696C10.1974 19.3 10.161 18.8265 10.4306 18.512L16.0122 12.0001L10.4306 5.48821C10.161 5.17372 10.1974 4.70024 10.5119 4.43068Z"
                    fill={`${
                      activeAccordionIndex === index ? "var(--primary)" : ""
                    }`}
                  />
                </g>
              </svg>
            )}
          </div>
        ))}
      </div>
      {activeAccordionIndex === 0 && genralFields}
      {isGeneralSubmitted && activeAccordionIndex === 1 && othersFields}
      {isGeneralSubmitted &&
        activeAccordionIndex === 2 &&
        educationFamilyFieald}

      <div className="mb-2 " style={{}}>
        <ToastContainer />
        <div className="profloat">
          <div className="progress-bar">
            <Circle percent={progress} strokeWidth={10} strokeColor="#16B364" />
            <div className="progress-value">
              <p>{progress.toFixed(0)} %</p>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
          }}
        >
          {/* <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              backgroundColor: "blue",
              height: "20px",
              color: "white",
              borderRadius: "10px",
            }}
          >
            {progress.toFixed(0)}%
          </div> */}
        </div>
      </div>
      {/* <FormContainer
        mainTitle="User"
        title="User Registration"
        submitButton={false}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        loading={loading}
      >
        {activeAccordionIndex === 0 && genralFields}
        {isGeneralSubmitted && activeAccordionIndex === 1 && othersFields}
        {isGeneralSubmitted &&
          activeAccordionIndex === 2 &&
          educationFamilyFieald}
      </FormContainer> */}
    </div>
  );
};

export default UserMaster;
