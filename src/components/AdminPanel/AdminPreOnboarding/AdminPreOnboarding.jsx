import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { AiOutlineReload } from "react-icons/ai";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
// import { City } from "country-state-city";
import { baseUrl } from "../../../utils/config";
import IndianCitiesReact from "../../ReusableComponents/IndianCitiesReact";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { constant } from "../../../utils/constants";
import dayjs from "dayjs";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import { useContext } from "react";
import { IsApplicableData } from "../../../utils/helper";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const onBoardStatus = 2;

const AdminPreOnboarding = () => {
  const { userContextData, DepartmentContext } = useAPIGlobalContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const jobTypeData = ["WFO", "WFH"];
  // const tdsApplicableData = ["Yes", "No"];
  const genderData = ["Male", "Female", "Other"];
  const offerLetter = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const ROLEID = decodedToken.role_id;

  const [username, setUserName] = useState("");
  const [jobType, setJobType] = useState("WFO");
  const [roles, setRoles] = useState(constant.CONST_USER_ROLE);
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  // const [city, setCity] = useState("");

  const [personalEmail, setPersonalEmail] = useState("");
  const [validPersonalEmail, setValidPersonalEmail] = useState(true);

  const [annexurePdf, setAnnexurePdf] = useState("");

  //TDS fields
  const [tdsApplicable, setTdsApplicable] = useState("No");
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [showTdsPercentage, setShowTdsPercentage] = useState(false);

  const [contact, setContact] = useState("");
  const [personalContact, setPersonalContact] = useState("");

  const [userCtc, setUserCtc] = useState("");

  const [isValidcontact, setValidContact] = useState(false);
  const [isValidcontact1, setValidContact1] = useState(false);
  const [isContactTouched, setisContactTouched] = useState(false);
  const [isContactTouched1, setisContactTouched1] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const [lastIndexUsed, setLastIndexUsed] = useState(-1);
  const [password, setPassword] = useState("");

  const [sitting, setSitting] = useState("");
  const [roomId, setRoomId] = useState("");

  const [department, setDepartment] = useState("");
  // const [departmentdata, getDepartmentData] = useState([]);

  // const [usersData, getUsersData] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [sendLetter, setSendLetter] = useState({});
  const [uid, setUID] = useState("");
  const [panUpload, setPanUpload] = useState("");
  const [highestUpload, setHighestUpload] = useState("");
  const [otherUpload, setOtherUpload] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [releavingDate, setReleavingDate] = useState("");
  const [salary, setSalary] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [designation, setDesignation] = useState("");
  const [designationData, setDesignationData] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [roledata, getRoleData] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [dobError, setDobError] = useState("");
  const [dobValidate, setDobValidate] = useState(0);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  console.log(city, "city");
  const [currentState, setcurrentState] = useState("");
  const [pincode, setPincode] = useState("");

  const [isApplicable, setIsApplicable] = useState("");

  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [subDepartment, setSubDeparment] = useState([]);
  const [isRequired, setIsRequired] = useState({
    username: false,
    reportL1: false,
    // sendLetter: false,
    role: false,
    gender: false,
    department: false,
    userCtc: false,
    loginId: false,
    personalEmail: false,
    personalContact: false,
    subDepartment: false,
    password: false,
    isApplicable: false,

    city: false,
    currentState: false,
    address: false,
    pincode: false,
  });

  useEffect(() => {
    axios.get(baseUrl + "get_all_roles").then((res) => {
      getRoleData(res.data.data);
    });
    // axios.get(baseUrl + "get_all_departments").then((res) => {
    //   getDepartmentData(res.data);
    // });
  }, []);

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
    if (subDepartment) {
      axios
        .get(baseUrl + `get_all_designation/${subDepartment}`)
        .then((res) => {
          setDesignationData(res.data.data);
        });
    }
  }, [subDepartment]);

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

  const handlepincode = async (event) => {
    const newValue = event.target.value;
    // setPincode(newValue);
    setPincode(newValue);
    if (newValue.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${newValue}`
        );
        const data = response.data;

        if (data[0].Status === "Success") {
          console.log("-------testing");
          console.log(data[0].PostOffice, "data");
          const postOffice = data[0].PostOffice[0];
          const abbreviatedState =
            stateAbbreviations[postOffice.State] || postOffice.State;
          console.log(abbreviatedState, "------abbreviatedState");
          setcurrentState(abbreviatedState);
          setCity(postOffice.District);
        } else {
          // console.log("Invalid Pincode");
        }
      } catch (error) {
        // console.log("Error fetching details.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username == "") {
      setIsRequired((perv) => ({ ...perv, username: true }));
    }
    if (department == "") {
      setIsRequired((perv) => ({ ...perv, department: true }));
    }
    if (designation == "") {
      setIsRequired((perv) => ({ ...perv, designation: true }));
    }
    if (reportL1 == "") {
      setIsRequired((perv) => ({ ...perv, reportL1: true }));
    }
    if (userCtc == "") {
      setIsRequired((perv) => ({ ...perv, userCtc: true }));
    }
    if (roles == "") {
      setIsRequired((perv) => ({ ...perv, roles: true }));
    }
    if (joiningDate == "") {
      setIsRequired((perv) => ({ ...perv, joiningDate: true }));
    }
    if (dateOfBirth == "") {
      setIsRequired((perv) => ({ ...perv, dateOfBirth: true }));
    }
    if (gender == "") {
      setIsRequired((perv) => ({ ...perv, gender: true }));
    }
    if (loginId == "") {
      setIsRequired((perv) => ({ ...perv, loginId: true }));
    }
    if (personalEmail == "") {
      setIsRequired((perv) => ({ ...perv, personalEmail: true }));
    }
    if (subDepartment == "") {
      setIsRequired((perv) => ({ ...perv, subDepartment: true }));
    }
    if (password == "") {
      setIsRequired((perv) => ({ ...perv, password: true }));
    }
    if (personalContact == "") {
      setIsRequired((perv) => ({ ...perv, personalContact: true }));
    }
    if (isApplicable == "") {
      setIsRequired((perv) => ({ ...perv, isApplicable: true }));
    }
    if (address == "") {
      setIsRequired((perv) => ({ ...perv, address: true }));
    }
    if (pincode == "") {
      setIsRequired((perv) => ({ ...perv, pincode: true }));
    }
    if (city == "") {
      setIsRequired((perv) => ({ ...perv, city: true }));
    }
    if (currentState == "") {
      setIsRequired((perv) => ({ ...perv, currentState: true }));
    }

    if (!username) {
      return toastError("Fill the Mandatory fields");
    } else if (!jobType || jobType == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!department || department == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!designation || designation == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!reportL1 || reportL1 == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!personalEmail || personalEmail == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!personalContact || personalContact == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!loginId || loginId == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!password || password == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!roles || roles == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!joiningDate || joiningDate == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!dateOfBirth || dateOfBirth == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!gender || gender == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!userCtc || userCtc == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!isApplicable || isApplicable == "") {
      return toastError("Fill the Mandatory fields");
    } else if (!address || address == "") {
      return toastError("Fill Required Field");
    } else if (!city || city == "") {
      return toastError("Fill Required Field");
    } else if (!currentState || currentState == "") {
      return toastError("Fill Required Field");
    } else if (!pincode || pincode == "") {
      return toastError("Please fill all Required field");
    }

    const payload = {
      created_by: loginUserId,
      user_name: validateAndCorrectUserName(username),
      role_id: roles,
      image: selectedImage,
      ctc: userCtc,
      salary: Number(salary),
      Age: Number(age),
      offer_letter_send: true,
      tds_applicable: tdsApplicable,
      tds_per: tdsPercentage,
      user_login_id: loginId,
      user_login_password: password,
      sitting_id: 183,
      room_id: roomId,
      dept_id: department,
      sub_dept_id: subDepartment,
      Gender: gender,
      job_type: jobType,
      DOB: dateOfBirth,
      user_contact_no: personalContact,
      personal_number: personalContact,
      user_email_id: personalEmail,
      Personal_email: personalEmail,
      report_L1: reportL1,
      report_L2: reportL2,
      report_L3: reportL3,
      user_designation: designation,
      UID: uid,
      pan: panUpload,
      highest_upload: highestUpload,
      other_upload: otherUpload,
      joining_date: joiningDate,
      releaving_date: releavingDate,

      onboard_status: onBoardStatus,
      Nationality: "Indian",
      emergency_contact_person_name2: isApplicable.value, //This Payload use for Is Applicable Conditon

      current_city: city,
      current_state: currentState,
      current_address: address,
      current_pin_code: Number(pincode),
    };

    try {
      const isLoginIdExists = userContextData.some(
        (user) =>
          user.user_login_id?.toLocaleLowerCase() ===
          loginId?.toLocaleLowerCase()
      );
      const contactNumberExists = userContextData.some(
        (user) => user.user_contact_no == personalContact
      );
      const emailIdExists = userContextData.some(
        (user) =>
          user.user_email_id?.toLocaleLowerCase() ==
          personalEmail?.toLocaleLowerCase()
      );

      if (isLoginIdExists) {
        alert("This login ID already exists");
      } else if (contactNumberExists) {
        alert("Contact Already Exists");
      } else if (emailIdExists) {
        alert("Email Already Exists");
      } else {
        setLoading(true);
        await axios.post(baseUrl + "add_user", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        whatsappApi.callWhatsAPI(
          "Preonboarding Register",
          JSON.stringify(personalContact),
          username,
          [username, loginId, password, "http://jarvis.work/"]
        );
        axios
          .post(baseUrl + "add_send_user_mail", {
            email: personalEmail,
            subject: "Welcome To Creativefuel",
            text: "",
            attachment: selectedImage,
            login_id: loginId,
            name: username,
            password: password,
            status: "onboarded",
          })
          .then((res) => {
            if (res.status == 200) {
              toastAlert("User Registered");
              setIsFormSubmitted(true);
              setLoading(false);
            } else {
              setLoading(false);
              toastError("Sorry User is Not Created, Please try again later");
            }
          })
          .catch((error) => {
            setLoading(false);
            // console.log("Failed to send email:", error);
          });

        setUserName("");
        setRoles("");
        setEmail("");
        setLoginId("");
        setContact("");
        setPersonalContact("");
        setUserCtc("");
        setPassword("");
        setDepartment("");
        setSitting("");
        setRoomId("");
        setSendLetter("");
        setAnnexurePdf("");
        setJobType("");
        setReportL1("");
        setReportL2("");
        setReportL3("");
        setDesignation("");
        toastAlert("User Registered");
        setIsFormSubmitted(true);
      }
    } catch (error) {
      // console.log("Failed to submit form", error);
    } finally {
      setLoading(false);
    }
    // } else {
    //   if (contact.length !== 10) {
    //     if (isValidcontact == false)
    //       alert("Enter   Phone Number in Proper Format");
    //   } else if (validEmail != true) {
    //     alert("Enter   Valid Email");
    //   }
    // }
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
  function handlePersonalEmailChange(e) {
    const newEmail = e.target.value;
    setPersonalEmail(newEmail);
    if (personalEmail === "") {
      setIsRequired((prev) => ({ ...prev, personalEmail: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, personalEmail: false }));
    }

    if (newEmail == "") {
      setValidPersonalEmail(false);
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setValidPersonalEmail(emailRegex.test(newEmail));
    }
  }

  //user Contact validation
  function handleContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact1 = event.target.value;
      setContact(newContact1);

      if (newContact1 === "") {
        setValidContact(false);
      } else {
        setValidContact(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }
  }

  function handleContactBlur() {
    setisContactTouched(true);
    if (contact.length < 10) {
      setValidContact(false);
    }
  }

  function handlePersonalContactChange(event) {
    const newContact1 = event.target.value;

    if (newContact1.length <= 10) {
      if (
        newContact1 === "" ||
        (newContact1.length === 1 && parseInt(newContact1) < 6)
      ) {
        setPersonalContact("");
        setValidContact1(false);
        setIsRequired({ ...isRequired, personalContact: true });
      } else {
        setPersonalContact(newContact1);
        setIsRequired({ ...isRequired, personalContact: false });

        setValidContact1(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact1)
        );
      }
    }

    setisContactTouched1(true);
    if (newContact1.length < 10) {
      setValidContact1(false);
    }
  }

  function handlePersonalContactBlur() {
    setisContactTouched1(true);
    if (personalContact.length < 10) {
      setValidContact1(false);
    }
  }

  if (isFormSubmitted) {
    // return <Navigate to="/admin/pre-onboarding-overview" />;
    return navigate("/admin/pre-onboarding-overview");
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
      setIsRequired({ ...isRequired, password: false });
    }
  };

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
      setIsRequired((prev) => ({ ...prev, loginId: false }));
    }
  };

  const handleLoginIdChange = (event) => {
    const selectedLoginId = event.target.value;
    if (selectedLoginId == "") {
      setIsRequired((prev) => ({ ...prev, loginId: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, loginId: false }));
    }
    setLoginId(selectedLoginId);
  };

  const calculateAge = (dob) => {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  const disableFutureDates = (date) => {
    return dayjs(date).isAfter(dayjs(), "day");
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const validateAge = dayjs().diff(dayjs(selectedDate), "year"); // Use selectedDate for age calculation
    const age = calculateAge(selectedDate); // Assuming calculateAge is correct
    setDobValidate(validateAge);

    if (selectedDate === "") {
      setIsRequired((prev) => ({ ...prev, dateOfBirth: true }));
      setDobError("Please select a DOB."); // Set error if date is empty
    } else {
      setIsRequired((prev) => ({ ...prev, dateOfBirth: false }));

      // Only set dobError if age is invalid; clear it otherwise
      if (validateAge < 15 || validateAge > 100) {
        setDobError("Age can't be less than 15 or greater than 100 years.");
        setDateOfBirth(""); // Clear DOB if invalid
      } else {
        setDobError(""); // Clear error if age is valid
        setDateOfBirth(selectedDate);
        setAge(age);
      }
    }
  };

  const handleFullNameChange = (event) => {
    let userName = event.target.value;

    if (userName === "") {
      setIsRequired((prev) => ({ ...prev, username: true }));
    } else {
      setIsRequired((prev) => ({ ...prev, username: false }));
    }

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

  // to disable admin and super admin in role dropdown start
  const modifiedRoleData = roledata.map((option) => ({
    value: option.role_id,
    label: option.Role_name,
    isDisabled: ROLEID === 1 && (option.role_id === 1 || option.role_id === 6),
  }));
  const selectedRole = roledata.find((role) => role.role_id === roles);
  // to disable admin and super admin in role dropdown end

  // Update Yearly Salary when Monthly Salary changes
  useEffect(() => {
    if (lastUpdated === "monthly") {
      const yearly = salary * 12;
      setUserCtc(yearly.toString());
    }
  }, [salary, lastUpdated]);

  // Update Monthly Salary when Yearly Salary changes
  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = userCtc / 12;
      setSalary(monthly.toString());
    }
  }, [userCtc, lastUpdated]);

  useEffect(() => {
    if (lastUpdated === "yearly") {
      const monthly = Math.round(userCtc / 12);
      setSalary(monthly.toString()); // Now sets the salary to a rounded figure
    }
  }, [userCtc, lastUpdated]);

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

    setSalary(monthlySalary);
    setLastUpdated("monthly");
  };

  const handleYearlySalaryChange = (e) => {
    const yearlySalaryValue = e.target.value;
    setUserCtc(yearlySalaryValue);
    setLastUpdated("yearly");

    userCtc !== "" &&
      setIsRequired((prev) => {
        return { ...prev, userCtc: true };
      });
    userCtc &&
      setIsRequired((prev) => {
        return { ...prev, userCtc: false };
      });
  };

  return (
    <div>
      <FormContainer
        mainTitle="User"
        title="User Registration"
        handleSubmit={handleSubmit}
        submitButton={false}
        // loading={loading}
      >
        <div className="col-md-3">
          <FieldContainer
            label="Full Name"
            astric
            fieldGrid={3}
            value={username}
            onChange={handleFullNameChange}
          />
          <div className="">
            {isRequired.username && (
              <p className="form-error">Please Enter Full Name</p>
            )}
          </div>
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Job Type <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
            options={jobTypeData.map((option) => ({
              value: `${option}`,
              label: `${option}`,
            }))}
            value={{
              value: jobType,
              label: `${jobType}`,
            }}
            onChange={(e) => {
              setJobType(e.value);
            }}
            isDisabled
          />
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Department Name <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
            options={DepartmentContext.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: department,
              label:
                DepartmentContext.find((user) => user.dept_id === department)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              const selectedDepartment = e.value;
              setDepartment(selectedDepartment);

              if (selectedDepartment === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  department: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  department: false,
                }));
              }
            }}
          />
          <div className="">
            {isRequired.department && (
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

              subDepartment !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, subDepartment: true };
                });
              subDepartment &&
                setIsRequired((prev) => {
                  return { ...prev, subDepartment: false };
                });
            }}
            required
          />
          <div className="">
            {isRequired.subDepartment && (
              <p className="form-error">Please Enter Sub-Department</p>
            )}
          </div>
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Designation <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
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
              const selectDesi = e.value;
              setDesignation(selectDesi);

              if (selectDesi === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  designation: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  designation: false,
                }));
              }
            }}
          />
          <div className="">
            {isRequired.designation && (
              <p className="form-error">Please Enter Designation</p>
            )}
          </div>
        </div>

        <div className="form-group col-3">
          <label className="form-label">
            Report L1 <sup className="form-error">*</sup>
          </label>
          <Select
            required={true}
            className=""
            options={userContextData.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: reportL1,
              label:
                userContextData.find((user) => user.user_id === reportL1)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setReportL1(e.value);
              e.value &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: false };
                });

              reportL1 !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: true };
                });
              reportL1 &&
                setIsRequired((prev) => {
                  return { ...prev, reportL1: false };
                });
            }}
            // onBlur={(e) => {
            //   !reportL1 &&
            //     setIsRequired((prev) => {
            //       return { ...prev, reportL1: true };
            //     });
            //   reportL1 &&
            //     setIsRequired((prev) => {
            //       return { ...prev, reportL1: false };
            //     });
            // }}
          />
          {isRequired.reportL1 && (
            <p className="form-error">Please select Report L1</p>
          )}
        </div>

        <div className="col-md-3">
          <FieldContainer
            label="Personal Email"
            type="email"
            astric
            fieldGrid={3}
            required={false}
            value={personalEmail}
            onChange={handlePersonalEmailChange}
          />
          {!validPersonalEmail && (
            <p className="form-error">Please Enter valid email</p>
          )}
          {isRequired.personalEmail && (
            <p className="form-error">Please select Personal Email</p>
          )}
        </div>
        <div className="col-md-3">
          <FieldContainer
            label="Personal Contact"
            astric
            type="number"
            fieldGrid={3}
            value={personalContact}
            required={false}
            onChange={handlePersonalContactChange}
            // onBlur={handlePersonalContactBlur}
          />
          {(isContactTouched1 || personalContact.length >= 10) &&
            !isValidcontact1 && (
              <p className="form-error">Please Enter a valid Number</p>
            )}
          {isRequired.personalContact && (
            <p className="form-error">Please select Personal Contact</p>
          )}
        </div>
        {/* <FieldContainer
          label=" City"
          type="text"
          fieldGrid={3}
          required={false}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        /> */}

        {/* {jobType === "WFH" && ( */}
        <>
          <FieldContainer
            label="Monthly CTC"
            type="number"
            fieldGrid={3}
            value={salary}
            // onChange={(e) => setSalary(e.target.value)}
            onChange={handleMonthlySalaryChange}
          />
          {/* <div className="form-group col-3">
              <label className="form-label">
                TDS Applicable<sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={tdsApplicableData.map((option) => ({
                  value: `${option}`,
                  label: `${option}`,
                }))}
                value={{
                  value: tdsApplicable,
                  label: `${tdsApplicable}`,
                }}
                onChange={(e) => {
                  const selectedValue = e.value;
                  setTdsApplicable(e.value);
                  setShowTdsPercentage(selectedValue === "Yes");
                }}
                required={false}
              />
            </div> */}
          {/* {showTdsPercentage && (
              <FieldContainer
                label="TDS Percentage"
                fieldGrid={3}
                type="number"
                value={tdsPercentage}
                onChange={(e) => setTdsPercentage(e.target.value)}
                required={false}
              />
            )} */}
        </>
        {/* )} */}

        {/* {jobType == "WFO" && ( */}
        <div className="col-md-3">
          <FieldContainer
            label="Yearly CTC"
            astric
            type="number"
            fieldGrid={3}
            required={false}
            value={userCtc}
            onChange={handleYearlySalaryChange}
            // onChange={(e) => {
            //   // setUserCtc(e.target.value);
            //   const value = e.target.value;
            //   // Limit input to 6 digits
            //   if (/^\d{0,7}$/.test(value)) {
            //     setUserCtc(value);
            //   }

            //   userCtc !== "" &&
            //     setIsRequired((prev) => {
            //       return { ...prev, userCtc: true };
            //     });
            //   userCtc &&
            //     setIsRequired((prev) => {
            //       return { ...prev, userCtc: false };
            //     });
            // }}
          />

          {isRequired.userCtc && <p className="form-error">Please Enter CTC</p>}
        </div>

        {/* )} */}

        <div className="form-group col-3">
          <label className="form-label">
            Custom Range <sup className="form-error">*</sup>
          </label>
          <Select
            options={IsApplicableData?.map((option) => ({
              value: `${option.value}`,
              label: `${option.label}`,
            }))}
            value={{
              value: isApplicable.value,
              label: isApplicable.label || "",
            }}
            onChange={(e) => {
              setIsApplicable(e);

              sendLetter !== "" &&
                setIsRequired((prev) => {
                  return { ...prev, isApplicable: true };
                });
              sendLetter &&
                setIsRequired((prev) => {
                  return { ...prev, isApplicable: false };
                });
            }}
          />
          {isRequired.isApplicable && (
            <p className="form-error">Please select a Is Applicable</p>
          )}
        </div>
        {/* )} */}

        {/* {sendLetter.label == "Yes" && (
          <div className="col-md-3">
            <FieldContainer
              label="Annexure pdf"
              fieldGrid={3}
              type="file"
              onChange={(e) => setAnnexurePdf(e.target.files[0])}
              required={false}
            />
          </div>
        )} */}

        {/* <FieldContainer
          label="Contact"
          type="number"
          fieldGrid={3}
          value={contact}
          required={true}
          onChange={handleContactChange}
          onBlur={handleContactBlur}
        />
        {(isContactTouched || contact.length >= 10) && !isValidcontact && (
          <p className="form-error">*Please Enter   a valid Number</p>
        )} */}
        {/* 
        <IndianCitiesReact
          selectedCity={city}
          onChange={setCity}
          fieldGrid={3}
        /> */}

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label>Login ID</label>
            <sup className="form-error">*</sup>
            <div className="input-group">
              <input
                className="form-control"
                // className={`form-control
                // ${
                //   loginId
                //     ? loginResponse === "login id available"
                //       ? "login-success-border"
                //       : "login-error-border"
                //     : ""
                // }
                // `}
                value={loginId}
                disabled
                onChange={handleLoginIdChange}
                onBlur={() => {
                  if (loginId === "") {
                    return setIsRequired((prev) => ({
                      ...prev,
                      loginId: true,
                    }));
                  } else {
                    setIsRequired((prev) => ({
                      ...prev,
                      loginId: false,
                    }));
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
            {isRequired.loginId && (
              <p className="form-error">Please select a LoginId</p>
            )}
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label>Generate Password</label>
            <sup className="form-error">*</sup>
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
          {isRequired.password && (
            <p className="form-error">Please select a Password</p>
          )}
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
          {/* <Select
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
              const selectRole = e.value;
              setRoles(selectRole);

              if (selectRole === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  roles: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  roles: false,
                }));
              }
            }}
          /> */}
          {isRequired.roles && (
            <p className="form-error">Please select a Role</p>
          )}
        </div>
        <div className="col-md-3">
          {/* <label className="form-label">
            Joining Date <sup className="form-error">*</sup>
          </label> */}
          {/*<LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={joiningDate}
              onChange={(e) => {
                setJoiningDate(e);
                if (e === "") {
                  setIsRequired((prev) => ({ ...prev, joiningDate: true }));
                } else {
                  setIsRequired((prev) => ({ ...prev, joiningDate: false }));
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          */}
          <FieldContainer
            type="date"
            astric
            label="Joining Date"
            required={false}
            fieldGrid={3}
            value={joiningDate}
            onChange={(e) => {
              setJoiningDate(e.target.value);
              if (e.target.value === "") {
                setIsRequired((prev) => ({ ...prev, joiningDate: true }));
              } else {
                setIsRequired((prev) => ({ ...prev, joiningDate: false }));
              }
            }}
          />
          {isRequired.joiningDate && (
            <p className="form-error">Please select a Joining Date</p>
          )}
        </div>
        {/* <FieldContainer
          type="date"
          astric
          label="Joining Date"
          required={false}
          fieldGrid={3}
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        /> */}
        <div className="col-md-3">
          {/* <label className="form-label">
            DOB <sup className="form-error">*</sup>
          </label> */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dateOfBirth}
              onChange={handleDateChange}
              shouldDisableDate={disableFutureDates}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> */}
          <FieldContainer
            type="date"
            astric
            label="DOB"
            required={false}
            fieldGrid={3}
            value={dateOfBirth}
            // disabled={disableFutureDates}
            onChange={handleDateChange}
          />
          {isRequired.dateOfBirth && (
            <p className="form-error">Please select a DOB</p>
          )}
          {<p className="form-error">{dobError}</p>}
        </div>
        <FieldContainer
          label="Age"
          required={false}
          fieldGrid={3}
          value={age}
        />

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
              if (e === "") {
                setIsRequired((prev) => ({ ...prev, gender: true }));
              } else {
                setIsRequired((prev) => ({ ...prev, gender: false }));
              }
            }}
            required
          />
          {isRequired.gender && (
            <p className="form-error">Please select a Gender</p>
          )}
        </div>

        <div className="col-md-3">
          <FieldContainer
            label="Address"
            astric
            fieldGrid={12}
            value={address}
            onChange={(e) => {
              const value = e.target.value;
              setAddress(value);

              if (value === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  address: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  address: false,
                }));
              }
            }}
          />
          {isRequired.address && (
            <p className="form-error">Please Enter Address</p>
          )}
        </div>

        <div className="col-md-3">
          <div className="form-group m0">
            <label htmlFor="">
              State <span style={{ color: "red" }}>*</span>
            </label>
            <IndianStatesMui
              selectedState={currentState}
              // onChange={(option) => setcurrentState(option ? option : null)}
              onChange={(option) => {
                const value = option;
                setcurrentState(option ? option : null);
                setIsRequired((prev) => ({
                  ...prev,
                  currentState: value === null || value === "",
                }));
              }}
            />
            {isRequired.currentState && (
              <p className="form-error">Please Enter State</p>
            )}
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group m0">
            <label htmlFor="">
              City <span style={{ color: "red" }}>*</span>
            </label>

            <IndianCitiesMui
              selectedState={currentState}
              selectedCity={city}
              // onChange={(option) => setCity(option ? option : null)}
              onChange={(option) => {
                const value = option;
                setCity(option ? option : null);
                setIsRequired((prev) => ({
                  ...prev,
                  city: value === null || value === "",
                }));
              }}
            />
            {isRequired.city && <p className="form-error">Please Enter City</p>}
          </div>
        </div>

        <div className="col-md-3">
          <FieldContainer
            label="Pincode"
            type="number"
            astric={true}
            fieldGrid={12}
            maxLength={6}
            value={pincode}
            onChange={handlepincode}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   if (/^\d{0,6}$/.test(value)) {
            //     setPincode(value);
            //   }
            //   if (e.target.value === "") {
            //     setIsRequired((prev) => ({
            //       ...prev,
            //       pincode: true,
            //     }));
            //   } else {
            //     setIsRequired((prev) => ({
            //       ...prev,
            //       pincode: false,
            //     }));
            //   }
            // }}
          />
          {isRequired.pincode && (
            <p className="form-error">Please Enter Pincode</p>
          )}
        </div>
      </FormContainer>
      <div className="form-group">
        <button
          type="submit"
          className="btn cmnbtn  btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit"}
          {loading ? (
            <i className="bi bi-arrow-clockwise"></i>
          ) : (
            <i className="bi bi-arrow-right"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminPreOnboarding;
