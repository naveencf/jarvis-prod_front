 import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { AiOutlineReload } from "react-icons/ai";
import Select from "react-select";
import jwtDecode from "jwt-decode";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import IndianStates from "../../ReusableComponents/IndianStates";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ContactNumber from "../../ReusableComponents/ContactNumber";
import ContactNumberReact from "../../ReusableComponents/ContactNumberReact";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { baseUrl } from "../../../utils/config";
import OccupationList from "../../../assets/js/OccupationList";
import familyRelationList from "../../../assets/js/familyRelationList";
import { ToastContainer } from "react-toastify";
import IndianBankList from "../../../assets/js/IndianBankList";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import { Line, Circle } from "rc-progress";
import { constant } from "../../../utils/constants";

const castOption = ["General", "OBC", "SC", "ST"];
const colourOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "French", label: "French" },
  { value: "Arabic", label: "Arabic" },
  { value: "Bengali", label: "Bengali" },
  { value: "Russian", label: "Russian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Urdu", label: "Urdu" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Swahili", label: "Swahili" },
  { value: "Marathi", label: "Marathi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Turkish", label: "Turkish" },
  { value: "Tamil", label: "Tamil" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Italian", label: "Italian" },
  { value: "Korean", label: "Korean" },
  { value: "Persian", label: "Persian" },
  { value: "Polish", label: "Polish" },
  { value: "Dutch", label: "Dutch" },
  { value: "Greek", label: "Greek" },
  { value: "Thai", label: "Thai" },
  { value: "Other", label: "Other" },
];

const initialFamilyDetailsGroup = {
  relation: "",
  name: "",
  // DOB: "",
  contact: "",
  occupation: "",
  // annual_income: "",
};

const familyDisplayFields = [
  "relation",
  "name",
  // "DOB",
  "contact",
  "occupation",
  // "annual_income",
];

const familyFieldLabels = {
  relation: "Relationship",
  name: "Full Name",
  // DOB: "Date of Birth",
  contact: "Contact Number",
  occupation: "Occupation",
  // annual_income: "Annual Income",
};

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

const UserUpdate = () => {
  const whatsappApi = WhatsappAPI();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();
  const [usersData, getUsersData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toastAlert, toastError } = useGlobalContext();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  // Genral Information Tab-------------------Start------------------------------------
  // ---------------------Prsonal Info State Start
  const [username, setUserName] = useState("");
  const [profile, setProfile] = useState([]);
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalContact, setPersonalContact] = useState();
  const [alternateContact, setAlternateContact] = useState(null);
  const [isValidcontact1, setValidContact1] = useState(true);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(0);
  const [ageCalculate, setAgeCalculate] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [dateOfMarraige, setDateOfMarraige] = useState("");
  const [spouseName, setSpouseName] = useState("");
  //---------------------Personal Info State End

  //--------------------Official Info State Start
  const [jobType, setJobType] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [subDepartment, setSubDeparment] = useState([]);
  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [roles, setRoles] = useState("");
  const [roledata, getRoleData] = useState([]);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [contact, setContact] = useState();
  const [isValidcontact, setValidContact] = useState(true);
  const [loginId, setLoginId] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const [lastIndexUsed, setLastIndexUsed] = useState(-1);
  const [password, setPassword] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [sitting, setSitting] = useState();
  const [sittingValue, setSittingValue] = useState({});
  const [roomId, setRoomId] = useState("");
  const [refrenceData, setRefrenceData] = useState([]);

  const [monthlyGrossSalary, setMonthlyGrossSalary] = useState("");
  const [ctc, setCTC] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const [isApplicable, setIsApplicable] = useState("");
  const [creditLimit, setCreditLimit] = useState(0);

  const IsApplicableData = [
    // { label: "PF", value: "pf" },
    { label: "PF & ESIC", value: "pf_and_esic" },
    { label: "IN Hand", value: "in_hand" },
  ];

  //--------------------Official Info State End
  // Genral Information Tab-------------------End------------------------------------

  // Other Information Tab-------------------Start------------------------------------
  //--------------------Other Info State Start
  const [city, setCity] = useState("");
  const [cityData, setCityData] = useState([]);

  const [currentAddress, setCurrentAddress] = useState("");
  const [currentCity, setcurrentCity] = useState("");
  const [currentState, setcurrentState] = useState("");
  const [currentPincode, setcurrentPincode] = useState("");

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
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
  const [IFSC, setIFSC] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [banktype, setAccountType] = useState("");

  //--------------------Bank Info State End
  // Other Information Tab-------------------End------------------------------------

  //--------------------Family Info State Start
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [familyValidationErrors, setFamilyValidationErrors] = useState({});
  // handleAddFamilyDetails define below this funciton
  //--------------------Family Info State End

  //--------------------Education Info State Start
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  // handleEducationDetailsChange define below this funciton
  //--------------------Education Info State End

  // Document Information Tab-------------------Start------------------------------------
  const [documentData, setDocumentData] = useState([]);

  // Document Information Tab-------------------End------------------------------------

  const [incomingPassword, setIncomingPassword] = useState("");
  const [uid, setUID] = useState({ name: "sumit.jpg" });
  const [releavingDate, setReleavingDate] = useState("");

  const [incomingUserStatus, setIncomingUserStatus] = useState("");

  const [otherDocuments, setOtherDocuments] = useState();
  const [higestQualification, setHigestQualification] = useState("");
  const [defaultSeatData, setDefaultSeatData] = useState([]);

  const higestQualificationData = [
    "10th",
    "12th",
    "Diploma",
    "Graduation",
    "Post Graduation",
    "Other",
  ];
  const bankTypeData = ["Saving A/C", "Current A/C", "Salary A/C"];
  const genderData = ["Male", "Female", "Other"];
  const nationalityData = ["India", "USA", "Uk"];

  const familyRelations = [
    "Brother",
    "Sister",
    "Mother",
    "Father",
    "Son",
    "Daughter",
    "Aunt",
    "Uncle",
    "Cousin",
    "Grandmother",
    "Grandfather",
    "Nephew",
    "Niece",
    "Stepmother",
    "Stepfather",
    "Stepson",
    "Stepdaughter",
    "Half-brother",
    "Half-sister",
    // Add more relations as needed
  ];

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
  const statusData = ["Active", "Exit", "PreOnboard"];
  const maritialStatusData = ["Married", "Unmarried"];

  // login progress bar---------------------------------------------------------------------
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fields = [
      username,
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
      userStatus,
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
    }
  }, [
    username,
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
    userStatus,
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

  useEffect(() => {
    if (department) {
      axios
        .get(`${baseUrl}` + `get_subdept_from_dept/${department}`)
        .then((res) => setSubDepartmentData(res.data));
    }
  }, [department]);

  useEffect(() => {
    if (subDepartment) {
      axios
        .get(baseUrl + `get_all_designation/${subDepartment}`)
        .then((res) => {
          setDesignationData(res.data.data);
        });
    }
  }, [subDepartment]);

  useEffect(() => {
    const GetAllData = async () => {
      const AllRolesResposne = await axios.get(baseUrl + "get_all_roles");

      const AllDepartmentResponse = await axios.get(
        baseUrl + "get_all_departments"
      );

      const RemainingSittingResponse = await axios.get(
        baseUrl + "not_alloc_sitting"
      );

      const AllSittingsResponse = await axios.get(baseUrl + "get_all_sittings");

      const AllUsersResponse = await axios.get(baseUrl + "get_all_users");

      const AllJobTypesResponse = await axios.get(
        baseUrl + "get_all_job_types"
      );

      getRoleData(AllRolesResposne.data.data);
      getDepartmentData(AllDepartmentResponse.data);
      setJobTypeData(AllJobTypesResponse.data.data);
      getUsersData(AllUsersResponse.data.data);
      setDefaultSeatData(AllSittingsResponse.data.data);
      setRefrenceData(RemainingSittingResponse.data.data);
    };
    GetAllData();
  }, []);

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

  function getOtherDocument() {
    axios.get(`${baseUrl}` + `get_user_other_fields/${id}`).then((res) => {
      setOtherDocuments(res.data.data);
    });
  }

  async function getCitiesData() {
    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: id,
    });
    setDocumentData(response.data.data);
  }

  useEffect(() => {
    getCitiesData();
    getDocuments();
  }, [id]);

  //  -------------------------------------------------------hobbie multiselect logic start--------------------------------------------------------
  useEffect(() => {
    axios.get(`${baseUrl}get_all_hobbies`).then((res) => {
      const formattedHobbies = res.data.data.map((hobby) => ({
        value: hobby.hobby_id,
        label: hobby.hobby_name,
      }));
      setHobbiesData(formattedHobbies);
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}get_single_user/${id}`);
        const fetchedData = response.data;

        const preselectedHobbies = fetchedData?.Hobbies?.map((hobbyId) => ({
          value: hobbyId,
          label:
            hobbiesData?.find((hobby) => hobby?.value === hobbyId)?.label ||
            hobbyId.toString(),
        }));
        setHobbies(preselectedHobbies);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [id, hobbiesData]);

  const handleChange = (selectedOptions) => {
    setHobbies(selectedOptions || []);
  };
  // -----------------------------------------------------------------------------hobby logic END------------------------------------------------------------

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

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      const fetchedData = res.data;
      const {
        user_name,
        role_id,
        user_email_id,
        user_contact_no,
        user_login_id,
        user_login_password,
        sitting_id,
        room_id,
        dept_id,
        job_type,
        Report_L1,
        Report_L2,
        Report_L3,
        PersonalEmail,
        PersonalNumber,
        user_designation,
        UID,
        joining_date,
        releaving_date,
        salary,
        SpokenLanguages,
        Gender,
        Nationality,
        DOB,
        user_status,
        Age,
        Hobbies,
        BloodGroup,
        MartialStatus,
        DateOfMarriage,
        spouse_name,
        sub_dept_id,
        bank_name,
        ifsc_code,
        beneficiary,
        account_no,
        account_type,
        permanent_city,
        permanent_address,
        permanent_state,
        permanent_pin_code,
        current_address,
        current_city,
        current_state,
        current_pin_code,
        cast_type,
        alternate_contact,
        user_credit_limit,
        ctc,
        emergency_contact_person_name2,
      } = fetchedData;
      setSpouseName(spouse_name);
      setUserName(user_name);
      setUserStatus(user_status);
      setIncomingUserStatus(user_status);
      setEmail(user_email_id);
      setLoginId(user_login_id);
      setContact(user_contact_no);
      setPassword(user_login_password);
      setIncomingPassword(user_login_password);
      setRoles(role_id);
      setDepartment(dept_id);
      setSitting(sitting_id);
      setRoomId(room_id);
      setPersonalContact(PersonalNumber);
      setPersonalEmail(PersonalEmail);
      setJobType(job_type);
      setReportL1(Report_L1);
      setReportL2(Report_L2);
      setReportL3(Report_L3);
      setDesignation(user_designation);
      setUID(UID);

      setMonthlyGrossSalary(salary);
      setIsApplicable(emergency_contact_person_name2);

      setJoiningDate(joining_date?.split("T")?.[0]);
      setReleavingDate(releaving_date?.split("T")?.[0]);
      setCTC(ctc);
      let lang = SpokenLanguages.split(",");
      let modifiedLang = lang
        ?.filter((item) => item.trim() !== "")
        ?.map((item) => ({ value: item, label: item }));
      setTempLanguage(modifiedLang);
      setGender(Gender);
      setNationality(Nationality);
      setDateOfBirth(DOB.split("T")?.[0]);

      function agesCalculate() {
        const years = Math.floor(Age / 365);
        const remainingDays = Age % 365;
        return years + " years " + remainingDays + " days";
      }
      setAge(agesCalculate);
      setCreditLimit(user_credit_limit);

      setHobbies(Hobbies);
      setBloodGroup(BloodGroup);
      setMaritialStatus(MartialStatus);
      setDateOfMarraige(DateOfMarriage?.split("T")?.[0]);
      setSubDeparment(sub_dept_id);
      setBankName(bank_name);
      setIFSC(ifsc_code);
      setAccountType(account_type);
      setBankAccountNumber(account_no);
      setBeneficiary(beneficiary);
      setCity(permanent_city);
      setAddress(permanent_address);
      setState(permanent_state);
      setPincode(permanent_pin_code);
      setCurrentAddress(current_address);
      setcurrentCity(current_city);
      setcurrentState(current_state);
      setcurrentPincode(current_pin_code);
      setCast(cast_type);
      setAlternateContact(alternate_contact);
    });

    getOtherDocument();
  }, [id]);

  useEffect(() => {
    const InitialSitting = defaultSeatData?.find(
      (object) => object.sitting_id == sitting
    );

    setRefrenceData((prev) => [InitialSitting, ...prev]);
  }, [defaultSeatData]);

  useEffect(() => {
    const SelectedSitting = refrenceData?.find(
      (object) => object?.sitting_id == sitting
    );
    const updatedSitting = {
      value: SelectedSitting?.sitting_id,
      label: `${SelectedSitting?.sitting_ref_no} | ${SelectedSitting?.sitting_area}`,
    };

    setSittingValue(updatedSitting);
  }, [sitting, refrenceData]);

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
    // setLoading(true);
    e.preventDefault();
    if (!jobType) {
      return toastError("Fill the job Type");
    } else if (!department || department == "") {
      return toastError("Fill the Department");
    } else if (
      !subDepartment ||
      subDepartment == "" ||
      subDepartment.length === 0
    ) {
      return toastError("Fill the Sub Department");
    } else if (!designation || designation == "") {
      return toastError("Fill the Designation");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Fill the Report L1");
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Fill the Personal Email");
    } else if (!personalContact || personalContact == "") {
      return toastError("Fill the Personal Contact");
    } else if (!alternateContact || alternateContact == "") {
      return toastError("Fill the Alternate Contact");
    } else if (!loginId || loginId == "") {
      return toastError("Fill the Login ID");
    } else if (!password || password == "") {
      return toastError("Fill the Password");
    } else if (!gender || gender == "") {
      return toastError("Fill the Gender");
    } else if (!nationality || nationality == "") {
      return toastError("Fill the Nationality");
    } else if (!dateOfBirth || dateOfBirth == "") {
      return toastError("Fill the DOB");
    } else if (
      !maritialStatus ||
      maritialStatus == "" ||
      maritialStatus.length == 0
    ) {
      return toastError("Fill the Maritial Status");
    } else if (!joiningDate || joiningDate == "") {
      return toastError("Fill the Joining Date");
    } else if (!userStatus || userStatus == "") {
      return toastError("Fill the Status");
    } else if (!username || username == "") {
      return toastError("Fill the User Name");
    }
    const formData = new FormData();
    //personal info payload Start
    // formData.append("user_id", id);
    formData.append("user_name", validateAndCorrectUserName(username));
    formData.append("image", profile);
    formData.append("Personal_email", personalEmail);
    formData.append("personal_number", personalContact);
    formData.append("alternate_contact", alternateContact);
    formData.append("Gender", gender);
    formData.append("DOB", dateOfBirth);
    formData.append("Age", ageCalculate);
    formData.append("Nationality", nationality);
    formData.append("MartialStatus", maritialStatus);
    formData.append("DateofMarriage", dateOfMarraige);
    formData.append("spouse_name", spouseName);
    //personal info payload End

    //offcial info payload Start
    formData.append("job_type", jobType);
    formData.append("dept_id", department);
    formData.append("sub_dept_id", subDepartment);
    formData.append("user_designation", designation);
    formData.append("report_L1", Number(reportL1));
    formData.append("report_L2", Number(reportL2));
    formData.append("report_L3", Number(reportL3));
    formData.append("role_id", roles);
    formData.append("user_email_id", email);
    formData.append("user_contact_no", contact ? contact : "");
    formData.append("user_login_id", loginId);
    formData.append("user_login_password", password);
    formData.append("user_status", userStatus);

    formData.append(
      "emergency_contact_person_name2",
      isApplicable?.value || isApplicable
    );
    formData.append("salary", monthlyGrossSalary);
    formData.append("ctc", ctc);
    formData.append("user_credit_limit", Number(creditLimit));

    formData.append("sitting_id", jobType === "WFH" ? 0 : Number(sitting));
    formData.append(
      "room_id",
      jobType === "WFH" || jobType === "WFHD" ? "1" : 1 //roomId
    );
    formData.append("joining_date", joiningDate);
    // formData.append("room_id", roomId);

    //offcial info payload End

    // formData.append("UID", uid);
    // formData.append("releaving_date", releavingDate);
    // formData.append("salary", Number(salary));

    // formData.append("SpokenLanguages", speakingLanguage);

    // formData.append(
    //   "Hobbies",
    //   hobbies?.map((option) => option?.value)
    // );
    // formData.append("BloodGroup", bloodGroup);
    // formData.append("permanent_address", address);
    // formData.append("permanent_city", city);
    // formData.append("permanent_state", state);
    // formData.append("permanent_pin_code", Number(pincode));

    // formData.append("bank_name", bankName);
    // formData.append("ifsc_code", IFSC);
    // formData.append("account_no", bankAccountNumber);

    // formData.append("highest_qualification_name", higestQualification);
    // formData.append("cast_type", cast);
    formData.append("att_status", "document_upload");

    const formDataa = new FormData();
    if (personalEmail && personalContact) {
      setLoading(true);

      await axios
        .put(
          `${baseUrl}` + `update_user_for_general_information/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setLoading(false);
        })
        .catch(function (err) {
          setLoading(false);
          console.error(err);
        });

      // new api ------------------------------------------------------
      await axios
        .post(baseUrl + "update_user_history", formData)
        .then((res) => {
          console.log("History sent successfully:", res);
        })
        .catch((error) => {
          console.log("Failed to send History:", error);
        });

      if (reportL1 !== "") {
        axios
          .post(baseUrl + "add_send_user_mail", {
            email: email,
            subject: "User Registration",
            text: "A new user has been registered.",
            login_id: loginId,
            name: username,
            password: password,
          })
          .then((res) => {
            // console.log("Email sent successfully:", res.data);
          })
          .catch((error) => {
            // console.log("Failed to send email:", error);
          });

        whatsappApi.callWhatsAPI(
          "Extend Date by User",
          JSON.stringify(personalContact),
          username,
          ["You have assinge Report L1", "ok"]
        );
      }

      const mandatoryDocTypes = ["10th", "12th", "Graduation"];

      const isMandatoryDocMissing = documentData.some(
        (doc) =>
          mandatoryDocTypes.includes(doc.document.doc_type) &&
          doc.doc_image &&
          doc.file
      );

      if (isMandatoryDocMissing) {
        toastAlert("Please fill all mandatory fields");
        return;
      } else {
        for (const document of documentData) {
          if (document.file) {
            let formData = new FormData();
            formData.append("doc_image", document.file);
            formData.append("_id", document._id);
            formData.append(
              "status",
              document.status == "Document Uploaded"
                ? "Verification Pending"
                : document.status
            );
            await axios.put(baseUrl + "update_user_doc", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          } else {
            console.log(`No file uploaded for document ${document._id}`);
          }
        }
        // toastAlert("Documents Updated");
        getDocuments();
      }

      if (incomingPassword !== password) {
        whatsappApi.callWhatsAPI(
          "User Password Update by Admin",
          contact,
          username,
          [loginId, password, "http://jarvis.work/"]
        );
      }

      if (incomingUserStatus !== userStatus) {
        whatsappApi.callWhatsAPI("User Status Change", contact, username, [
          username,
          userStatus,
        ]);
      }

      toastAlert("User Update");
      setIsFormSubmitted(true);

      for (const element of otherDocuments) {
        formDataa.append("id", element.id);
        formDataa.append("field_name", element.field_name);
        formDataa.append("lastupdated_by", loginUserId);
        formDataa.append("field_value", element.field_value);
        axios.put(`${baseUrl}` + `updateuserotherfielddata/${id}`, formDataa, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        formDataa.delete("id");
        formDataa.delete("field_name");
        formDataa.delete("lastupdated_by");
        formDataa.delete("field_value");
      }
    } else {
      if (contact.length !== 10) {
        if (isValidcontact == false)
          toastError("Enter Phone Number in Proper Format");
      } else if (validEmail != true) {
        alert("Enter Valid Email");
      }
    }
  };

  const handleSubmitOtherDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_other_details/${id}`,
        {
          permanent_city: city,
          permanent_address: address,
          permanent_state: state,
          permanent_pin_code: Number(pincode),
          current_address: currentAddress,
          current_city: currentCity,
          current_pin_code: Number(currentPincode),
          current_state: currentState,
          BloodGroup: bloodGroup,
          Hobbies: hobbies.map((hobby) => hobby.value),
          SpokenLanguages: speakingLanguage,
          cast_type: cast,
        }
      );
      toastAlert("Other Details Update");
      console.log("Update successful", response.data);
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

    if (!bankName || bankName == "") {
      return toastError("bank name is required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("bank account number is required");
    } else if (!IFSC || IFSC == "" || IFSC.length < 11) {
      return toastError("IFSC is required and length must be 11 digit");
    } else if (!banktype || banktype == "") {
      return toastError("Bank Type is required");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_bank_details/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Bank info payload Start
          // bank_name: bankName,
          // account_no: bankAccountNumber,
          // ifsc_code: IFSC,
          // beneficiary: beneficiary,
          // account_type: banktype,
          // Bank info payload End
        }
        // setActiveAccordionIndex((prev) => prev + 1)
      );
      toastAlert("Bank Details Update");
      console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };
  const handleSubmitFamily = () => {
    for (const elements of familyDetails) {
      let payload = {
        user_id: id,
        name: elements.name,
        // DOB: elements.DOB,
        relation: elements.relation,
        contact: elements.contact,
        occupation: elements.occupation,
        // annual_income: elements.annual_income,
      };

      if (elements.family_id) {
        payload.family_id = elements.family_id;
      }
      try {
        toastAlert("Family Details Update");
        const response = axios.put(baseUrl + "update_family", payload);
      } catch (error) {
        console.error("Error updating family details:", error);
      }
    }
  };
  const handleSubmitEducation = () => {
    for (const elements of educationDetails) {
      let payload = {
        user_id: id,
        title: elements.title,
        institute_name: elements.institute_name,
        from_year: elements.from_year,
        to_year: elements.to_year,
        percentage: elements.percentage,
        stream: elements.stream,
        specialization: elements.specialization,
      };

      if (elements.education_id) {
        payload.education_id = elements.education_id;
      }
      try {
        toastAlert("Family Details Update");
        const response = axios.put(baseUrl + "update_education", payload);
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }
  };

  function handleLanguageSelect(selectedOption) {
    setTempLanguage(selectedOption);
  }

  useEffect(() => {
    const test = tempLanguage?.map((option) => option.value).join();
    setSpeakingLanguage(test);
  }, [tempLanguage]);
  function otherDocumentNameChangeHandle(e, index) {
    setOtherDocuments((prev) => {
      const newOtherDocuments = [...prev];
      newOtherDocuments[index] = {
        ...newOtherDocuments[index],
        field_name: e.target.value,
      };
      return newOtherDocuments;
    });
  }
  const otherDocumentImageChangeHandler = (e, index) => {
    otherDocuments[index] = {
      ...otherDocuments[index],
      field_value: e.target.files[0],
    };
  };
  const handleAccordionButtonClick = (index) => {
    // {
    setActiveAccordionIndex(index);
    //     alert("fill all the fields");
    // }
  };

  // Number validation
  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail === "") {
      setValidEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidEmail(emailRegex.test(newEmail));
    }
  }

  function handleContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact = event.target.value;
      setContact(newContact);

      if (newContact === "") {
        setValidContact(false);
      } else {
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
      }
    }
  }

  function handlePersonalContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setPersonalContact(newContact1);

      if (newContact1 === "") {
        setValidContact1(false);
      } else {
        setValidContact1(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  function handleContentBlur() {
    setisContactTouched(true);
    setisContactTouched1(true);
    if (contact.length < 10) {
      setValidContact(false);
      setValidContact1(false);
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
  };

  const generateLoginId = async () => {
    const userName = username.trim().toLowerCase().split(" ");

    // Extracting last 4 and 6 digits from personal contact
    const personalContactStr = personalContact.toString();
    const personalContactLast4 = personalContactStr.slice(-4);
    const personalContactLast6 = personalContactStr.slice(-6);

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
    const generatedLoginId = loginIdOptions[nextIndex];
    setLoginId(generatedLoginId);

    await axios
      .post(baseUrl + `check_login_exist`, {
        user_login_id: loginId,
      })
      .then((res) => {
        setLoginResponse(res.data.message);
      });

    if (generatedLoginId?.length > 0) {
      setMandatoryFieldsEmpty({ ...mandatoryFieldsEmpty, loginId: false });
    }
  };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    setLoginId(selectedLoginId);
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
    const selectedDate = e.target.value;
    const age = calculateAge(selectedDate);
    const ageDays = calculateAgeInDays(selectedDate);

    if (age < 15) {
      window.alert("Your age must be greater than 15 years.");
    } else {
      setDateOfBirth(selectedDate);
      setAge(age);
      setAgeCalculate(ageDays);
    }
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

  const accordionButtons = [
    "General",
    "Other Details",
    "Education & Family",
    "Documents Update",
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

  const genralFields = (
    <>
      <div className="card">
        <div className="card-header">Personal Details</div>
        <div className="card-body row">
          <FieldContainer
            label="Full Name"
            astric={true}
            fieldGrid={3}
            value={username}
            onChange={handleFullNameChange}
          />
          <FieldContainer
            label="Personal Email"
            astric={true}
            type="email"
            fieldGrid={3}
            required={false}
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
          />
          <FieldContainer
            label="Personal Contact "
            astric={true}
            type="number"
            fieldGrid={3}
            value={personalContact}
            required={false}
            onChange={handlePersonalContactChange}
            onBlur={handleContentBlur}
          />
          {isContactTouched1 && !isValidcontact1 && (
            <p style={{ color: "red" }}>*Please enter a valid Number</p>
          )}
          <ContactNumberReact
            astric={true}
            label="Alternate Contact"
            parentComponentContact={alternateContact}
            setParentComponentContact={setAlternateContact}
          />
          <div className="form-group col-3">
            <label className="form-label">
              Gender <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={genderData?.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: gender,
                label: `${gender}`,
              }}
              onChange={(e) => {
                setGender(e.value);
              }}
              required
            />
          </div>
          <div className="from-group col-3">
            <label className="form-label">
              DOB <sup style={{ color: "red" }}>*</sup>
            </label>
            <input
              label="DOB"
              type="date"
              className="form-control"
              value={dateOfBirth}
              onChange={handleDateChange}
            />
          </div>
          {dateOfBirth !== "" && (
            <FieldContainer fieldGrid={3} label="Age" value={age} />
          )}
          {/* <FieldContainer
        label="Nationality"
        astric={true}
        fieldGrid={3}
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
      /> */}
          <div className="form-group col-3">
            <label className="form-label">
              Nationality <sup style={{ color: "red" }}>*</sup>
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
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Maritial Status <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={maritialStatusData?.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: maritialStatus,
                label: `${maritialStatus}`,
              }}
              onChange={(e) => {
                setMaritialStatus(e.value);
              }}
              required={false}
            />
          </div>
          {maritialStatus == "Married" && (
            <FieldContainer
              label="Spouse Name"
              type="text"
              fieldGrid={3}
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              required={false}
            />
          )}
          {maritialStatus == "Married" && (
            <FieldContainer
              label="Date Of Marriage"
              type="date"
              fieldGrid={3}
              value={dateOfMarraige}
              onChange={(e) => setDateOfMarraige(e.target.value)}
              required={false}
            />
          )}
        </div>
      </div>

      {/* Other Info Inputs------------------------End------------ */}

      {/* Official Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Official Details</div>
        <div className="card-body row">
          <div className="form-group col-3">
            <label className="form-label">
              Job Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={jobTypeData?.map((option) => ({
                value: `${option.job_type}`,
                label: `${option.job_type}`,
              }))}
              value={{
                value: jobType,
                label: `${jobType}`,
              }}
              onChange={(e) => {
                setJobType(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Department Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={departmentdata?.map((option) => ({
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
              }}
              required
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Sub Department <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={subDepartmentData?.map((option) => ({
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
              }}
              required
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Designation <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={designationData?.map((option) => ({
                value: option.desi_id,
                label: `${option.desi_name}`,
              }))}
              value={{
                value: designation,
                label:
                  designationData?.find((user) => user.desi_id == designation)
                    ?.desi_name || "",
              }}
              onChange={(e) => {
                setDesignation(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Report L1 <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={usersData?.map((option) => ({
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
              }}
              required
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">Report L2</label>
            <Select
              className=""
              options={usersData?.map((option) => ({
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
              options={usersData?.map((option) => ({
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
              Role <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={roledata.map((option) => ({
                value: option.role_id,
                label: option.Role_name,
              }))}
              value={{
                value: roles,
                label:
                  roledata.find((role) => role.role_id === roles)?.Role_name ||
                  "",
              }}
              onChange={(e) => {
                setRoles(e.value);
              }}
            ></Select>
          </div>
          <FieldContainer
            label="Official Email"
            type="email"
            placeholder="Not Allocated"
            fieldGrid={3}
            required={false}
            value={email}
            onChange={handleEmailChange}
          />
          {!validEmail && (
            <p style={{ color: "red" }}>*Please enter valid email</p>
          )}

          <FieldContainer
            label="Official Contact"
            type="number"
            placeholder="Not Allocated"
            fieldGrid={3}
            value={contact}
            required={true}
            onChange={handleContactChange}
            onBlur={handleContentBlur}
          />
          {(isContactTouched || contact?.length >= 10) && !isValidcontact && (
            <p style={{ color: "red" }}>*Please enter a valid Number</p>
          )}
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <div className="form-group">
              {/* <ps
            className={
              loginResponse == "login id available"
                ? "login-success1"
                : "login-error1"
            }
          >
            {loginResponse}
          </ps> */}
              <label>
                Login ID <sup style={{ color: "red" }}>*</sup>
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
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <div className="form-group">
              <label>
                Generate Password <sup style={{ color: "red" }}>*</sup>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="form-group col-3">
            <label className="form-label">
              Status <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={statusData?.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: userStatus,
                label: `${userStatus}`,
              }}
              onChange={(e) => {
                setUserStatus(e.value);
              }}
              required
            />
          </div>
          <div className="from-group col-3">
            <label className="form-label">
              Joining Date <sup style={{ color: "red" }}>*</sup>
            </label>
            <input
              type="date"
              className="form-control"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>

          <div className="col-3">
            <FieldContainer
              label="Monthly Gross Salary"
              type="number"
              fieldGrid={3}
              required={false}
              value={monthlyGrossSalary}
              onChange={handleMonthlySalaryChange}
            />
          </div>
          <div className="col-3">
            <FieldContainer
              label="CTC"
              type="number"
              fieldGrid={3}
              required={false}
              value={ctc}
              onChange={handleYearlySalaryChange}
            />
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

          <div className="form-group col-3">
            <label className="form-label">Custom Rang</label>
            <Select
              options={IsApplicableData.map((option) => ({
                value: `${option.value}`,
                label: `${option.label}`,
              }))}
              // value={{
              //   value: isApplicable?.value,
              //   label: isApplicable?.label || "",
              // }}
              value={IsApplicableData.find(
                (option) => option.value === isApplicable
              )}
              onChange={(e) => {
                setIsApplicable(e);
              }}
            />
          </div>

          {/* {userStatus == "Resign" && (
        <FieldContainer
          type="date"
          label="Date of Resign"
          fieldGrid={3}
          value={releavingDate}
          onChange={(e) => setReleavingDate(e.target.value)}
        />
      )} */}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn cmnbtn  btn-primary mr-2"
          onClick={handleSubmit}
        >
          Update
        </button>
        <button
          className="btn cmnbtn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </>
  );
  {
    /* Official Info Inputs------------------------End------------ */
  }

  const otherFields = (
    <>
      {/* Other Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Other Details</div>
        {/* Current Address input-- */}

        <div className=" card-body row">
          <FieldContainer
            label="Current Address"
            fieldGrid={12}
            // astric={true}
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            required={false}
          />

          <div className="form-group col-3 mt-3">
            <label className="form-label">State / UT</label>

            <IndianStatesMui
              selectedState={currentState}
              onChange={(option) => setcurrentState(option ? option : null)}
            />
          </div>

          <div className="form-group col-3 mt-3">
            <label className="form-label">City</label>
            <IndianCitiesMui
              selectedState={currentState}
              selectedCity={currentCity}
              onChange={(option) => setcurrentCity(option ? option : null)}
            />
          </div>
          <div className="col-3 mt-3">
            <FieldContainer
              label="Current Pincode"
              type="number"
              // astric={true}
              fieldGrid={3}
              maxLength={6}
              value={currentPincode}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  setcurrentPincode(value);
                }
              }}
              required={false}
            />
          </div>

          {/*  Permanent Address here------------ */}
          <div className="form_checkbox">
            <label className="cstm_check">
              Same as Current Addresss
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
        <hr className="mb-3" />
        <div className=" body-padding row">
          <FieldContainer
            label="Permanent Address"
            fieldGrid={12}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required={false}
          />

          <div className="form-group col-3 mt-3">
            <label className="form-label">State /UT</label>

            <IndianStatesMui
              selectedState={state}
              onChange={(option) => setState(option ? option : null)}
            />
          </div>

          <div className="form-group col-3 mt-3">
            <label className="form-label">City</label>

            <IndianCitiesMui
              selectedState={state}
              selectedCity={city}
              onChange={(option) => setCity(option ? option : null)}
            />
          </div>
          <div className="col-3 mt-3">
            <FieldContainer
              label="Permanent Pincode"
              type="number"
              value={pincode}
              fieldGrid={3}
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  setPincode(value);
                }
              }}
              required={false}
            />
          </div>
          <div className="form-group col-3 mt-3">
            <label className="form-label">Blood Group</label>
            <Select
              className=""
              options={bloodGroupData?.map((option) => ({
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
              required={false}
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">Hobbies</label>
            <Select
              isMulti
              options={hobbiesData}
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
              required={false}
            />
          </div>
          <div className="form-group col-3">
            <label className="form-label">Category</label>
            <Select
              className=""
              options={castOption?.map((option) => ({
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
              required
            />
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

      {/* </div> */}

      {/* Other Info Inputs------------------------End------------ */}

      {/* Bank Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Bank Details</div>
        {/* <FieldContainer
        label="Bank Name"
        astric={true}
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
      /> */}
        <div className="card-body row">
          <div className="form-group col-6">
            <label className="form-label">
              Bank Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={IndianBankList}
              onChange={(selectedOption) => {
                setBankName(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              isSearchable
              value={
                bankName
                  ? IndianBankList.find((bank) => bank.value === bankName)
                  : null
              }
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              required
            />
          </div>

          <div className="form-group col-3">
            <label className="form-label">
              Bank Type <sup style={{ color: "red" }}>*</sup>
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
                setAccountType(e.value);
              }}
              required
            />
          </div>
          <FieldContainer
            label="Bank Account Number"
            astric={true}
            fieldGrid={3}
            value={bankAccountNumber}
            onChange={(e) => {
              const inputValue = e.target.value;
              const onlyNumbers = /^[0-9]+$/;

              // Check if the input is numeric and within the max length
              if (onlyNumbers.test(inputValue) && inputValue.length <= 17) {
                setBankAccountNumber(inputValue);
              } else if (inputValue === "") {
                setBankAccountNumber(""); // Clear the input value
              }
            }}

            // setBankAccountNumber(e.target.value)}
          />
          <FieldContainer
            label="IFSC"
            astric={true}
            value={IFSC}
            // onChange={(e) => setIFSC(e.target.value.toUpperCase())}
            onChange={(e) => {
              const inputValue = e.target.value.toUpperCase();
              setIFSC(inputValue.slice(0, 11)); // Limiting the input to 11 characters
            }}
          />
          <FieldContainer
            label="Beneficiary"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />

          {/* <FieldContainer
        label="Upload Proof *"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          setBankProveImage(e.target.files[0]);
        }}
        fieldGrid={6}
        required={true}
      /> */}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          className="btn cmnbtn btn-primary mr-2"
          onClick={handleSubmitBank}
        >
          Submit Bank Details
        </button>
        <button
          className="btn cmnbtn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>

      {/* Bank Info Inputs------------------------End------------ */}
    </>
  );

  const educationFamilyFieald = (
    <>
      <div className="card">
        <div className="card-header">Family Details</div>
        {familyDetails?.map((detail, index) => (
          <div key={index} mb={2}>
            <div className=" card-body row">
              {Object.keys(detail)?.map((key) => {
                switch (key) {
                  // case "DOB":
                  //   return (
                  //     <FieldContainer
                  //       key={key}
                  //       fieldGrid={2}
                  //       type="date"
                  //       name={key}
                  //       label="Date of Birth"
                  //       value={
                  //         detail[key] ? detail[key].split("T")[0] : detail[key]
                  //       }
                  //       onChange={(e) => handleFamilyDetailsChange(index, e)}
                  //     />
                  //   );

                  case "relation":
                    return (
                      <div className="form-group col-3">
                        <label className="form-label">Relation</label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name={key}
                          value={familyRelationList.find(
                            (option) => option.value === detail[key]
                          )}
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
                          options={familyRelationList}
                          isClearable={true}
                          isSearchable={true}
                        />
                      </div>
                    );

                  case "occupation":
                    return (
                      <div className="form-group col-3">
                        <label className="form-label">Occupation</label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name={key}
                          value={OccupationList.find(
                            (option) => option.value === detail[key]
                          )}
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
                          options={OccupationList}
                          isClearable={true}
                          isSearchable={true}
                        />
                      </div>
                    );

                  case "contact":
                    return (
                      <>
                        <FieldContainer
                          key={key}
                          type="number"
                          fieldGrid={3}
                          name={key}
                          label={familyFieldLabels[key]}
                          value={detail[key]}
                          onChange={(e) => handleFamilyDetailsChange(index, e)}
                        />
                        {familyValidationErrors[`contact-${index}`] && (
                          <span style={{ color: "red" }}>
                            {familyValidationErrors[`contact-${index}`]}
                          </span>
                        )}
                      </>
                    );

                  // case "annual_income":
                  //   return (
                  //     <FieldContainer
                  //       key={key}
                  //       type="number"
                  //       fieldGrid={2}
                  //       name={key}
                  //       label={familyFieldLabels[key]}
                  //       placeholder={familyFieldLabels[key]}
                  //       value={detail[key]}
                  //       onChange={(e) => handleFamilyDetailsChange(index, e)}
                  //     />
                  //   );

                  default:
                    if (familyDisplayFields.includes(key)) {
                      return (
                        <FieldContainer
                          key={key}
                          fieldGrid={3}
                          name={key}
                          label={familyFieldLabels[key]}
                          value={detail[key]}
                          onChange={(e) => handleFamilyDetailsChange(index, e)}
                        />
                      );
                    }
                }
              })}
              {familyDetails?.length > 1 && (
                <IconButton onClick={() => handleRemoveFamilyDetails(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="card-body">
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

      {/* Education Info Inputs------------------------Start------------ */}
      <div className="card">
        <div className="card-header">Education Details</div>
        {educationDetails?.map((detail, index) => (
          <div key={index} mb={2}>
            <div className=" card-body row">
              {educationDispalyFields?.map((key) => {
                return key === "from_year" || key === "to_year" ? (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    type="date"
                    name={key}
                    label={educationFieldLabels[key]}
                    value={detail[key]?.split("T")[0]}
                    onChange={(e) => handleEducationDetailsChange(index, e)}
                  />
                ) : (
                  <FieldContainer
                    key={key}
                    fieldGrid={3}
                    name={key}
                    label={educationFieldLabels[key]}
                    value={detail[key] || ""}
                    onChange={(e) => handleEducationDetailsChange(index, e)}
                  />
                );
              })}
              {educationDetails?.length > 1 && (
                <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              {educationDetails.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddEducationDetails}
                  className="btn cmnbtn btn-outline-warning"
                >
                  Add More Education Details
                </button>
              )}
            </div>
          </div>
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev - 1)}
        >
          <ArrowBackIosIcon />
        </button>
      </div> */}
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
        <button
          className="btn cmnbtn btn-primary"
          onClick={() => setActiveAccordionIndex((prev) => prev + 1)}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
      {/* Education Info Inputs------------------------End------------ */}
    </>
  );
  const accordionButtonstitle = [
    "Personal & Official Details",
    "Other & Bank Details",
    "Family & Education Details",
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
  const documentFieldsNew = (
    <>
      <div className="table-wrap-user">
        <DocumentTab
          documentData={documentData}
          setDocumentData={setDocumentData}
          getDocuments={getDocuments}
          submitButton={false}
          normalUserLayout={true}
        />
      </div>
    </>
  );
  return (
    <div>
      <FormContainer mainTitle="User Update" link={true} />
      <div className="user-tab w-100 mb-4">
        {accordionButtons.map((button, index) => (
          <div className="flex-row align-items-center w-100 gap-4">
            <button
              className={`tab ${
                activeAccordionIndex === index ? "active" : "disabled"
              }`}
              onClick={() => handleAccordionButtonClick(index)}
            >
              <div className="gap-1 flex-row">
                {
                  indicator[
                    activeAccordionIndex === index ? "active" : "disabled"
                  ]
                }
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
      {activeAccordionIndex === 1 && otherFields}
      {activeAccordionIndex === 2 && educationFamilyFieald}
      {activeAccordionIndex === 3 && documentFieldsNew}

      <div className="mb-2 " style={{}}>
        <ToastContainer />
        <div
          style={{
            marginTop: 20,
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
          }}
        >
          <div className="profloat">
            <div className="progress-bar">
              <Circle
                percent={progress}
                strokeWidth={10}
                strokeColor="#16B364"
              />
              <div className="progress-value">
                <p>{progress.toFixed(0)} %</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <FormContainer
        mainTitle="User Update"
        title="User Registration"
        handleSubmit={handleSubmit}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        loading={loading}
      >
        {activeAccordionIndex === 0 && genralFields}
        {activeAccordionIndex === 1 && otherFields}
        {activeAccordionIndex === 2 && educationFamilyFieald}
        {activeAccordionIndex === 3 && documentFieldsNew}
      </FormContainer> */}
    </div>
  );
};

export default UserUpdate;
