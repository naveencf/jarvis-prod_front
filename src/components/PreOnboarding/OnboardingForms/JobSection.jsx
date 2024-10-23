import { TextField } from "@mui/material";
import React from "react";


const calculateProbationEndDate = (joiningDate) => {
    if (!joiningDate) return "";
  
    const [day, month, year] = joiningDate.split("-").map(Number);
  
    const date = new Date(year, month - 1, day); 
    date.setMonth(date.getMonth() + 6);
  
    const formattedDay = String(date.getDate()).padStart(2, '0');
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedYear = date.getFullYear();
  
    return `${formattedDay}-${formattedMonth}-${formattedYear}`;
  };
const JobSection = ({employeeID , joiningDate , designationName , departmentName,reportL1}) => { 
      const probationEndDate = calculateProbationEndDate(joiningDate);
    return (
    <>
        <h2>Job Section</h2>
      <div className="form-group">
        <TextField
          disabled
          label="Employee ID"
          variant="outlined"
          fullWidth
          value={employeeID}
          style={{ marginTop: "20px" }}
        />
      </div>
      <div className="form-group">
        <TextField
          disabled
          label="Joining Date"
          variant="outlined"
          fullWidth
          value={joiningDate}
          style={{ marginTop: "20px" }}
        />
      </div>
      <div className="form-group">
        <TextField
          disabled
          label="Designation"
          variant="outlined"
          fullWidth
          value={designationName}
          style={{ marginTop: "20px" }}
        />
      </div>
      <div className="form-group">
        <TextField
          disabled
          label="Department"
          variant="outlined"
          fullWidth
          value={departmentName}
          style={{ marginTop: "20px" }}
        />
      </div>
      <div className="form-group">
        <TextField
          disabled
          label="Reporting Manager"
          variant="outlined"
          fullWidth
          value={reportL1}
          style={{ marginTop: "20px" }}
        />
      </div>
      <div className="form-group">
        <TextField
          disabled
          label="Probation End Date (6 Month)"
          variant="outlined"
          fullWidth
          value={probationEndDate}
          style={{ marginTop: "20px" }}
        />
      </div>
    </>
  );
};

export default JobSection;
