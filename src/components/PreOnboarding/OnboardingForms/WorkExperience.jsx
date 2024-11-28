import { TextField, IconButton, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { IoAddCircleOutline } from "react-icons/io5";

// Initial section for organization, reporting manager, and HR details
const initialSection = {
  name_of_organization: "",
  period_of_service_from: "",
  period_of_service_to: "",
  designation: "",
  gross_salary: "",
  manager_name: "",
  manager_phone: "",
  manager_email_id: "",
  hr_name: "",
  hr_phone: "",
  hr_email_id: "",
};

const WorkExperience = ({ userID }) => {
  const {toastAlert} = useGlobalContext()
  const [workExperienceData, setWorkExperienceData] = useState([initialSection]);

  const getWorkExperienceData = async () => {
    try {
      const response = await axios.get(`${baseUrl}get_single_user_experience/${userID}`);
      console.log(response.data.data, 'Fetched work experience data');
      setWorkExperienceData(response.data.data.length ? response.data.data : [initialSection]);
    } catch (error) {
      console.error("Error fetching work experience data:", error);
    }
  };

  useEffect(() => {
    getWorkExperienceData();
  }, [userID]);

  // Handle field change
  const handleFieldChange = (index, fieldName, value) => {
    const updatedSections = workExperienceData.map((section, i) => 
      i === index ? { ...section, [fieldName]: value } : section
    );
    setWorkExperienceData(updatedSections);
  };
  

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const elements of workExperienceData) {
        const payload = {
          user_id: userID,
          name_of_organization: elements.name_of_organization,
          period_of_service_from: elements.period_of_service_from,
          period_of_service_to: elements.period_of_service_to,
          designation: elements.designation,
          gross_salary: elements.gross_salary,
          manager_name: elements.manager_name,
          manager_email: elements.manager_email_id,
          manager_phone: elements.manager_phone,
          hr_name: elements.hr_name,
          hr_email: elements.hr_email_id,
          hr_phone: elements.hr_phone,
        };

        if (elements.user_experience_id) {
          payload.user_experience_id = elements.user_experience_id;
        }

        await axios.put(baseUrl + "update_user_experience", payload);
      }
      console.log("Work experience data successfully updated.");
    } catch (error) {
      console.error("Error updating work experience details:", error);
    }
  };

  // Add a new section
  // const handleAddSection = () => {
  //   setWorkExperienceData([...workExperienceData, { ...initialSection }]);
  // };
  const handleAddSection = () => {
    setWorkExperienceData((prevData) => [...prevData, { ...initialSection }]);
  };
  

  // Remove a section
  const handleRemoveSection = async (index) => {
    const itemToRemove = workExperienceData[index];
    if (itemToRemove && itemToRemove.user_experience_id) {
      try {
        await axios.delete(
          `${baseUrl}` + `delete_user_experience/${itemToRemove.user_experience_id}`
        );
        toastAlert("Details Deleted");
      } catch (error) {
        console.error("Error Deleting work Experience Detail:", error);
        return;
      }
    }
    const updatedSections = workExperienceData.filter((_, i) => i !== index);
    setWorkExperienceData(updatedSections);
  };

  return (
    <div className="board_form board_form_flex">
      <h2>
        Work Experience 
      </h2>
      {workExperienceData.map((section, index) => (
        <div key={index} className="board_form_flex">
          {/* Organization Section */}
          <h3>Organization Details</h3>
          <div className="form-group">
            <TextField
              label="Name of the Organization"
              value={section.name_of_organization}
              onChange={(e) => handleFieldChange(index, "name_of_organization", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="From Date"
              type="date"
              value={section.period_of_service_from}
              onChange={(e) => handleFieldChange(index, "period_of_service_from", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="To Date"
              type="date"
              value={section.period_of_service_to}
              onChange={(e) => handleFieldChange(index, "period_of_service_to", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Designation"
              value={section.designation}
              onChange={(e) => handleFieldChange(index, "designation", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Gross Salary"
              type="number"
              value={section.gross_salary}
              onChange={(e) => handleFieldChange(index, "gross_salary", e.target.value)}
              fullWidth
            />
          </div>

          {/* Reporting Manager Section */}
          <h3>Details of Reporting Manager</h3>
          <div className="form-group">
            <TextField
              label="Manager Name"
              value={section.manager_name}
              onChange={(e) => handleFieldChange(index, "manager_name", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Manager Contact No."
              value={section.manager_phone}
              onChange={(e) => handleFieldChange(index, "manager_phone", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Manager Email ID"
              value={section.manager_email_id}
              onChange={(e) => handleFieldChange(index, "manager_email_id", e.target.value)}
              fullWidth
            />
          </div>

          {/* HR Details Section */}
          <h3>Details of HR</h3>
          <div className="form-group">
            <TextField
              label="HR Name"
              value={section.hr_name}
              onChange={(e) => handleFieldChange(index, "hr_name", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="HR Contact No."
              value={section.hr_phone}
              onChange={(e) => handleFieldChange(index, "hr_phone", e.target.value)}
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="HR Email ID"
              value={section.hr_email_id}
              onChange={(e) => handleFieldChange(index, "hr_email_id", e.target.value)}
              fullWidth
            />
          </div>

          {/* Remove Button */}
          {workExperienceData.length > 1 && (
            <IconButton className="btn-icon" onClick={() => handleRemoveSection(index)}>
              <DeleteIcon />
            </IconButton>
          )}
          <hr />
        </div>
      ))}

      {/* Add Button */}
      <div className="mb-1 d-flex" style={{justifyContent:'space-between'}}>
        
        <button
          type="button"
          className="btn cmnbtn btn-primary mr-5 "
          onClick={handleSubmit}
        >
          Save Work Experience
        </button>
        <button type="button" className="btn btn-warning cmnbtn" onClick={handleAddSection}>
        <IoAddCircleOutline />
        </button>
      </div>
    </div>
  );
};

export default WorkExperience;
