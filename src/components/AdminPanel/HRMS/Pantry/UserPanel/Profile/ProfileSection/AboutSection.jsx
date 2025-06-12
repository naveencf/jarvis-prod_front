import React, { Suspense, useEffect, useState } from "react";
import DateFormattingComponent from "../../../../../../DateFormator/DateFormared";
// import EducationFields from "../../../../../../PreOnboarding/EducationFields";
const EducationFields = lazy(() => import("../../../../../../PreOnboarding/EducationFields"));

import jwtDecode from "jwt-decode";
import axios from "axios";
import FamilyFields from "../../../../../../PreOnboarding/FamilyFields";
import { useGlobalContext } from "../../../../../../../Context/Context";
import { baseUrl } from "../../../../../../../utils/config";
import { lazy } from "react";

//Family
const initialFamilyDetailsGroup = {
  name: "",
  DOB: "",
  contact: "",
  occupation: "",
  annual_income: "",
  relation: "",
};

const familyDisplayFields = [
  "name",
  "DOB",
  "contact",
  "occupation",
  "relation",
  "annual_income",
];

const familyFieldLabels = {
  name: "Full Name",
  DOB: "Date of Birth",
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

const AboutSection = ({ educationData, familyData }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  //Family Fields
  const [familyDetails, setFamilyDetails] = useState([
    initialFamilyDetailsGroup,
  ]);
  const [familyValidationErrors, setFamilyValidationErrors] = useState({});

  //Education Fields
  const [educationDetails, setEducationDetails] = useState([
    initialEducationDetailsGroup,
  ]);

  const closeEducationModal = () => {
    setIsEducationModalOpen(false);
  };
  const closeFamilyModal = () => {
    setIsFamilyModalOpen(false);
  };

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
  useEffect(() => {
    getDetails();
  }, [id]);

  const handleContactSubmit = async () => {
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
        toastAlert("Details Updated Successfully");
        closeEducationModal();
      } catch (error) {
        console.error("Error Updating Education details:", error);
      }
    }
  };

  const handleFamilySubmit = async () => {
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
        toastAlert("Details Updated Successfully");
        closeFamilyModal();
      } catch (error) {
        console.error("Error updating family details:", error);
      }
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
      return // console.log("Can't input value greater than 100");
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
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Education Details</h5>
              <button
                className="btn cmnbtn btn_sm"
                type="button"
                onClick={(e) => {
                  setIsEducationModalOpen(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="card-body p0 profileTabBody">
              {educationData.map((user, index) => (
                <div className="profileTabInfo" key={index}>
                  <div className="row profileTabRow">
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Title</h3>
                        <h4>{user.title}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Institute Name</h3>
                        <h4>{user.institute_name}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>From Year</h3>
                        <h4>
                          <DateFormattingComponent date={user.from_year} />
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>To Year</h3>
                        <h4>
                          <DateFormattingComponent date={user.to_year} />
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Percentage</h3>
                        <h4>{user.percentage} %</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Specialization</h3>
                        <h4>{user.specialization}</h4>
                      </div>
                    </div>
                    {/* <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Stream</h3>
                        <h4>{user.stream}</h4>
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Relations</h5>
              <button
                className="btn cmnbtn btn_sm"
                type="button"
                onClick={(e) => {
                  setIsFamilyModalOpen(true);
                }}
              >
                Edit
              </button>
            </div>
            <div className="card-body p0 profileTabBody">
              {familyData?.map((user) => (
                <div className="profileTabInfo">
                  <div className="row profileTabRow">
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Name</h3>
                        <h4>{user.name}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Date of Birth</h3>
                        <h4>
                          <DateFormattingComponent date={user.DOB} />
                        </h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Contact Number</h3>
                        <h4>{user.contact}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Occupation</h3>
                        <h4>{user.occupation}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Annual Income</h3>
                        <h4>{user.annual_income}</h4>
                      </div>
                    </div>
                    <div className="col-md-6 col-12 profileTabCol">
                      <div className="profileTabBox">
                        <h3>Relation *</h3>
                        <h4>{user.relation}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education details modal is here  */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isEducationModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isEducationModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Education Details</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeEducationModal}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div
                  className="modal-body"
                  style={{
                    maxHeight: "700px",
                    overflowY: "auto",
                    padding: "10px",
                  }}
                >
                  <Suspense fallback={"Loading..."}>

                    <EducationFields
                      educationDetails={educationDetails}
                      educationDispalyFields={educationDispalyFields}
                      educationFieldLabels={educationFieldLabels}
                      handleEducationDetailsChange={handleEducationDetailsChange}
                      handleAddEducationDetails={handleAddEducationDetails}
                      handleRemoveEducationDetails={handleRemoveEducationDetails}
                    />
                  </Suspense>
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
                    onClick={closeEducationModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family details modal is here  */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isFamilyModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isFamilyModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Family Details</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeFamilyModal}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div
                  className="modal-body"
                  style={{
                    maxHeight: "700px",
                    overflowY: "auto",
                    padding: "10px",
                  }}
                >
                  <FamilyFields
                    familyDetails={familyDetails}
                    familyDisplayFields={familyDisplayFields}
                    familyFieldLabels={familyFieldLabels}
                    familyValidationErrors={familyValidationErrors}
                    handleFamilyDetailsChange={handleFamilyDetailsChange}
                    handleAddFamilyDetails={handleAddFamilyDetails}
                    handleRemoveFamilyDetails={handleRemoveFamilyDetails}
                  />
                  <button
                    type="button"
                    className="btn btn-primary ml-2"
                    onClick={handleFamilySubmit}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={closeFamilyModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
