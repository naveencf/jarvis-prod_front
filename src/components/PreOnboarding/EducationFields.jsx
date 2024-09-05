import { Autocomplete, IconButton, TextField } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EducationList from "../../assets/js/EducationList";

const EducationFields = ({
  educationDetails,
  educationDispalyFields,
  educationFieldLabels,
  handleEducationDetailsChange,
  handleAddEducationDetails,
  handleRemoveEducationDetails,
}) => {
  const canAddMoreEducation = educationDetails.length < 10;
  return (
    <>
      {educationDetails?.map((detail, index) => (
        <div className="board_form_flex" key={index}>
          {/* <div className="row"> */}
          {educationDispalyFields.map((key) => {
            switch (key) {
              case "institute_name":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "from_year":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "to_year":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "percentage":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="number"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );

              case "stream":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "specialization":
                return (
                  <div className="form-group">
                    <TextField
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  </div>
                );
              case "title":
                return (
                  <div className="form-group form_select">
                    <Autocomplete
                      key={key}
                      name={key}
                      options={EducationList}
                      getOptionLabel={(option) => option.label}
                      value={EducationList.find(
                        (option) => option.value === detail[key]
                      )}
                      onChange={(e, newValue) => {
                        handleEducationDetailsChange(index, {
                          target: {
                            name: key,
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Standard"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                );
            }
          })}
          {educationDetails?.length > 1 && (
            <IconButton
              className="btn-icon"
              onClick={() => handleRemoveEducationDetails(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        // </div>
      ))}

      {canAddMoreEducation && (
        <div className="mb-1">
          <button
            type="button"
            onClick={handleAddEducationDetails}
            className="btn onboardBtn btn-outline-warning"
          >
            Add {educationDetails?.length > 0 && "More"} Education Details
          </button>
        </div>
      )}
    </>
  );
};

export default EducationFields;
