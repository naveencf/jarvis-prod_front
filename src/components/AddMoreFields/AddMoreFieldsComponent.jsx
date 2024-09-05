import React from "react";
import { IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddMoreFieldsComponent = ({
  fieldDetails,
  fieldLabels,
  handleFieldDetailsChange,
  handleAddFieldDetails,
  handleRemoveFieldDetails,
  addButtonLabel,
  displayFields,
}) => {
  return (
    <>
      {fieldDetails.map((detail, index) => (
        <div key={index}>
          {displayFields.map((field) => (
            <div className="form-group" key={field}>
              <TextField
                id={`outlined-${field}-${index}`}
                variant="outlined"
                type={field === "guardian_contact" ? "number" : "text"}
                label={fieldLabels[field]}
                name={field}
                key={index}
                value={detail[field] || ""}
                onChange={(e) => handleFieldDetailsChange(index, e)}
              />
            </div>
          ))}
          {fieldDetails.length > 1 && (
            <IconButton onClick={() => handleRemoveFieldDetails(index)}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddFieldDetails}
        variant="contained"
        className="btn btn-outline-danger"
      >
        {addButtonLabel}
      </button>
    </>
  );
};

export default AddMoreFieldsComponent;
