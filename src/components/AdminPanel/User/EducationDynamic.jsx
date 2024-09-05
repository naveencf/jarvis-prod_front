import { Autocomplete, IconButton, TextField } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EducationList from "../../../assets/js/EducationList";
import FieldContainer from "../FieldContainer";

const EducationDynamic = ({
  educationDetails,
  educationDispalyFields,
  educationFieldLabels,
  handleEducationDetailsChange,
  handleAddEducationDetails,
  handleRemoveEducationDetails,
}) => {
  return (
    <>
      {educationDetails?.map((detail, index) => (
        <div key={index} mb={2}>
          <div className="row">
            {educationDispalyFields.map((key) => {
              switch (key) {
                case "institute_name":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "from_year":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "to_year":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="date"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key]?.split("T")[0]}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "percentage":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="number"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );

                case "stream":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "specialization":
                  return (
                    <FieldContainer
                      key={key}
                      fieldGrid={3}
                      type="text"
                      name={key}
                      label={educationFieldLabels[key]}
                      value={detail[key] || ""}
                      onChange={(e) => handleEducationDetailsChange(index, e)}
                    />
                  );
                case "title":
                  return (
                    <div>
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
              <IconButton onClick={() => handleRemoveEducationDetails(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={handleAddEducationDetails}
          className="btn onboardBtn btn-outline-warning"
        >
          Add More Education Details
        </button>
      </div>
    </>
  );
};

export default EducationDynamic;
