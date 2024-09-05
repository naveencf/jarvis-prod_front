import React from "react";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const GuardianFields = ({
  guardianDetails,
  guardianDisplayFields,
  guardianFieldLabels,
  guardianContactErrors,
  handleGuardianDetailsChange,
  handleAddGuardianDetails,
  handleRemoveGuardianDetails,
}) => {
  const canAddMoreGuardians = guardianDetails.length < 3;

  return (
    <>
      {guardianDetails &&
        guardianDetails.map((detail, index) => (
          <div className="board_form_flex" key={index}>
            {guardianDisplayFields.map((field) => (
              <div className="form-group" key={field}>
                <TextField
                  id={`outlined-${field}-${index}`}
                  variant="outlined"
                  type={field === "guardian_contact" ? "number" : "text"}
                  label={guardianFieldLabels[field]}
                  name={field}
                  value={detail[field] || ""}
                  onChange={handleGuardianDetailsChange.bind(null, index)}
                  error={
                    field === "guardian_contact" && guardianContactErrors[index]
                  }
                  helperText={
                    field === "guardian_contact" && guardianContactErrors[index]
                      ? "Invalid phone number"
                      : ""
                  }
                />
              </div>
            ))}

            {guardianDetails.length > 1 && (
              <IconButton
                className="btn-icon"
                onClick={() => handleRemoveGuardianDetails(index)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        ))}

      {canAddMoreGuardians && (
        <div>
          <button
            type="button"
            onClick={handleAddGuardianDetails}
            variant="contained"
            className="btn onboardBtn btn-outline-danger"
          >
            Add {guardianDetails.length > 0 ? "More" : ""} Guardian Details
          </button>
        </div>
      )}
    </>
  );
};

export default GuardianFields;
