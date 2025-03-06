import React, { useState } from "react";
import DateFormattingComponent from "../../../../../../DateFormator/DateFormared";
import AboutSection from "./AboutSection";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import AddressSection from "./AddressSection";
import axios from "axios";
import { baseUrl } from "../../../../../../../utils/config";
import { useGlobalContext } from "../../../../../../../Context/Context";

const ProfileSection = ({ userData, educationData, familyData }) => {
  const { toastAlert, toastError } = useGlobalContext();
  // Personal Details Section states
  const [username, setUserName] = useState(userData.user_name || "");
  const [nickName, setNickName] = useState(userData.nick_name || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    userData.DOB?.split("T")?.[0] || ""
  );
  const [maritalStatus, setMaritalStatus] = useState(
    userData.MartialStatus || ""
  );
  const [dateOfMarriage, setDateOfMarriage] = useState(
    userData.DateOfMarriage || ""
  );
  const [spouseName, setSpouseName] = useState(userData.spouse_name || "");
  const [bloodGroup, setBloodGroup] = useState(userData.BloodGroup || "");
  const [gender, setGender] = useState(userData.Gender || "");

  //Contact Details section states
  const [email, setEmail] = useState(userData.user_email_id || "");
  const [personalEmail, setPersonalEmail] = useState(
    userData.PersonalEmail || ""
  );
  const [contact, setContact] = useState(userData.user_contact_no || "");
  const [personalContact, setPersonalContact] = useState(
    userData.PersonalNumber || ""
  );
  const [alternateContact, setAlternateContact] = useState(
    userData.alternate_contact || ""
  );

  const [contactErrors, setContactErrors] = useState({
    email: "",
    personalEmail: "",
    personalContact: "",
    contact: "",
    alternateContact: "",
  });

  const [errors, setErrors] = useState({});
  const maritalStatusData = ["Married", "Unmarried"];
  const genderData = ["Male", "Female", "Other"];
  const [isPrimaryModalOpen, setIsPrimaryModelOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const closePrimaryModel = () => {
    setIsPrimaryModelOpen(false);
  };
  const closeContactModel = () => {
    setIsContactModalOpen(false);
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactRegex = /^\d{10}$/;

  // Validation handler
  const handleEmailChange = (e, field) => {
    const { value } = e.target;
    // Update the corresponding state for the email field
    if (field === "email") {
      setEmail(value);
    } else if (field === "personalEmail") {
      setPersonalEmail(value);
    }

    // Check if the email is valid and clear the error if valid
    if (emailRegex.test(value)) {
      setContactErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };
  const handlePhoneChange = (e, field) => {
    const { value } = e.target;
    // Update the corresponding state for the contact field
    if (field === "personalContact") {
      setPersonalContact(value);
    } else if (field === "contact") {
      setContact(value);
    } else if (field === "alternateContact") {
      setAlternateContact(value);
    }

    // Validate and clear the error message if valid
    if (contactRegex.test(value) || value === "") {
      // If it's empty, don't set an error
      setContactErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };
  const contactValidateForm = () => {
    let isValid = true;
    let errorMessages = { ...contactErrors };

    // Validate work email
    if (!emailRegex.test(email)) {
      errorMessages.email = "Please enter a valid work email.";
      isValid = false;
    } else {
      errorMessages.email = "";
    }

    // Validate personal email
    if (!emailRegex.test(personalEmail)) {
      errorMessages.personalEmail = "Please enter a valid personal email.";
      isValid = false;
    } else {
      errorMessages.personalEmail = "";
    }

    // Validate personal contact number
    if (!contactRegex.test(personalContact)) {
      errorMessages.personalContact =
        "Please enter a valid 10-digit personal contact number.";
      isValid = false;
    } else {
      errorMessages.personalContact = "";
    }

    // Validate official contact number
    if (!contactRegex.test(contact)) {
      errorMessages.contact =
        "Please enter a valid 10-digit official contact number.";
      isValid = false;
    } else {
      errorMessages.contact = "";
    }

    // Validate alternate contact number
    if (alternateContact && !contactRegex.test(alternateContact)) {
      errorMessages.alternateContact =
        "Please enter a valid alternate contact number.";
      isValid = false;
    } else {
      errorMessages.alternateContact = "";
    }

    // Set the error messages
    setContactErrors(errorMessages);

    return isValid;
  };
  const handleContactSubmit = () => {
    if (contactValidateForm()) {
      try {
        const formData = new FormData();
        formData.append("user_id", userData.user_id);
        formData.append("Personal_email", personalEmail);
        formData.append("personal_number", personalContact);
        formData.append("alternate_contact", alternateContact);
        formData.append("user_contact_no", contact);
        const response = axios.put(baseUrl + `update_user`, formData);
        closeContactModel();
        toastAlert("Employee Personal Details are successfully updated.");
      } catch (error) {
        console.error(
          "Update failed",
          error.response ? error.response.data : error
        );
      }
    }
  };

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

  const validateFields = () => {
    const newErrors = {};
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }
    if (!gender) {
      newErrors.gender = "Gender is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      try {
        const formData = new FormData();
        formData.append("user_id", userData.user_id);
        // formData.append("Personal_email", personalEmail);
        // formData.append("personal_number", personalContact);
        // formData.append("alternate_contact", alternateContact);

        formData.append("Gender", gender);
        formData.append("DOB", dateOfBirth);
        formData.append("nick_name", nickName);
        // formData.append("Age", ageCalculate);
        // formData.append("Nationality", nationality);
        formData.append("MartialStatus", maritalStatus);
        formData.append("DateofMarriage", dateOfMarriage);
        formData.append("spouse_name", spouseName);
        const response = axios.put(
          baseUrl + `update_user`,

          formData
        );
        closePrimaryModel();
        toastAlert("Employee Personal Details are successfully updated.");
      } catch (error) {
        console.error(
          "Update failed",
          error.response ? error.response.data : error
        );
      }
    } else {
      console.log("Validation errors:", errors);
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Primary Details</h5>
              <button
                className="btn cmnbtn btn_sm"
                type="button"
                onClick={(e) => {
                  setIsPrimaryModelOpen(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="card-body p0 profileTabBody">
              <div className="profileTabInfo">
                <div className="row profileTabRow">
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Name</h3>
                      <h4>{userData.user_name ? userData.user_name : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Date of Birth</h3>
                      <h4>
                        <DateFormattingComponent
                          date={userData.DOB?.split("T")[0]}
                        />
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Marital Status</h3>
                      <h4>
                        {userData.MartialStatus ? userData.MartialStatus : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Nick Name</h3>
                      <h4>{userData.nick_name ? userData.nick_name : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Nationality</h3>
                      <h4>
                        {userData.Nationality ? userData.Nationality : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Blood Group</h3>
                      <h4>
                        {userData.BloodGroup ? userData.BloodGroup : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Gender</h3>
                      <h4>{userData.Gender ? userData.Gender : "NA"}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AddressSection userData={userData} />
        </div>
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Contact Details</h5>
              <button
                className="btn cmnbtn btn_sm"
                type="button"
                onClick={(e) => {
                  setIsContactModalOpen(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="card-body p0 profileTabBody">
              <div className="profileTabInfo">
                <div className="row profileTabRow">
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Work Email</h3>
                      <h4>
                        {userData.user_email_id ? userData.user_email_id : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Personal Email</h3>
                      <h4>
                        {userData.PersonalEmail ? userData.PersonalEmail : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Mobile Number</h3>
                      <h4>
                        {userData.PersonalNumber
                          ? userData.PersonalNumber
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Work Number</h3>
                      <h4>
                        {userData.user_contact_no
                          ? userData.user_contact_no
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Alternate Number</h3>
                      <h4>
                        {userData.alternate_contact
                          ? userData.alternate_contact
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Identity Information</h5>
            </div>
            <div className="card-body p0 profileTabBody">
              <div className="profileTabInfo">
                <div className="row profileTabRow">
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Aadhar Name</h3>
                      <h4>
                        {userData.aadharName ? userData.aadharName : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Aadhar Number</h3>
                      <h4>{userData.UID ? userData.UID : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Pan Name</h3>
                      <h4>{userData.panName ? userData.panName : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Pan Number</h3>
                      <h4>{userData.pan_no ? userData.pan_no : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Voter Name</h3>
                      <h4>{userData.voterName ? userData.voterName : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Voter Number</h3>
                      <h4>
                        {userData.BloodGroup ? userData.BloodGroup : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Passport Number</h3>
                      <h4>
                        {userData.passportNumber
                          ? userData.passportNumber
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Passport Valid Upto</h3>
                      <h4>
                        <DateFormattingComponent
                          date={userData.passportValidUpto?.split("T")[0]}
                        />
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Vehicle Name</h3>
                      <h4>
                        {userData.vehicleNumber ? userData.vehicleNumber : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Vehicle Number</h3>
                      <h4>
                        {userData.vehicleNumber ? userData.vehicleNumber : "NA"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutSection educationData={educationData} familyData={familyData} />

      {/* Primary details modal is here  */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isPrimaryModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isPrimaryModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Primary Details</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closePrimaryModel}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-sm-12 col-lg-12 p-2">
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Full Name"
                      variant="outlined"
                      type="text"
                      name="name"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={username}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Nick Name"
                      variant="outlined"
                      type="text"
                      value={nickName}
                      onChange={(e) => setNickName(e.target.value)}
                    />
                  </div>
                  <div className="form-group ">
                    <TextField
                      id="outlined-basic"
                      label="Date Of Birth"
                      variant="outlined"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      select
                      label="Select Marital Status"
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      fullWidth
                      variant="outlined"
                      required={false}
                    >
                      {maritalStatusData.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    {maritalStatus === "Married" && (
                      <>
                        <div
                          style={{ marginTop: "20px" }}
                          className="form-group"
                        >
                          <TextField
                            label="Spouse Name"
                            value={spouseName}
                            onChange={(e) => setSpouseName(e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            variant="outlined"
                            required={false}
                          />
                        </div>
                        <div
                          style={{ marginTop: "20px" }}
                          className="form-group"
                        >
                          <TextField
                            label="Date Of Marriage"
                            type="date"
                            value={dateOfMarriage}
                            onChange={(e) => setDateOfMarriage(e.target.value)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            variant="outlined"
                            required={false}
                          />
                        </div>
                      </>
                    )}
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
                  <div className="form-group form_select">
                    <Autocomplete
                      id="combo-box-demo"
                      options={genderData}
                      value={gender}
                      onChange={(e, newValue) => setGender(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Gender"
                          error={!!errors.gender}
                          helperText={errors.gender}
                        />
                      )}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={handleSubmit}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={closePrimaryModel}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact details modal is here  */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isContactModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isContactModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Primary Details</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeContactModel}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-sm-12 col-lg-12 p-2">
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Work Email"
                      variant="outlined"
                      type="email"
                      name="name"
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                      value={email}
                      onChange={(e) => handleEmailChange(e, "email")}
                      error={Boolean(contactErrors.email)}
                      helperText={contactErrors.email || ""}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Personal Email"
                      variant="outlined"
                      type="email"
                      value={personalEmail}
                      onChange={(e) => handleEmailChange(e, "personalEmail")}
                      error={Boolean(contactErrors.personalEmail)}
                      helperText={contactErrors.personalEmail || ""}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Personal Number"
                      variant="outlined"
                      type="number"
                      value={personalContact}
                      onChange={(e) => handlePhoneChange(e, "personalContact")}
                      error={Boolean(contactErrors.personalContact)}
                      helperText={contactErrors.personalContact || ""}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Official Number"
                      variant="outlined"
                      type="number"
                      value={contact}
                      onChange={(e) => handlePhoneChange(e, "contact")}
                      error={Boolean(contactErrors.contact)}
                      helperText={contactErrors.contact || ""}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      id="outlined-basic"
                      label="Alternate Number"
                      variant="outlined"
                      type="number"
                      value={alternateContact}
                      onChange={(e) => handlePhoneChange(e, "alternateContact")}
                      error={Boolean(contactErrors.alternateContact)}
                      helperText={contactErrors.alternateContact || ""}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={handleContactSubmit}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={closeContactModel}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
