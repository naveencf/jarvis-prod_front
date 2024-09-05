import React from "react";
import OccupationList from "../../assets/js/OccupationList";
import familyRelationList from "../../assets/js/familyRelationList";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IncomeList from "../../assets/js/incomeList";

const FamilyFields = ({
  familyDetails,
  familyDisplayFields,
  familyFieldLabels,
  familyValidationErrors,
  handleFamilyDetailsChange,
  handleAddFamilyDetails,
  handleRemoveFamilyDetails,
}) => {
  const canAddMoreFamily = familyDetails.length < 3;
  return (
    <>
      {familyDetails?.map((detail, index) => (
        <div className="board_form_flex" key={index}>
          {Object.keys(detail)?.map((key) => {
            switch (key) {
              // case "DOB":
              //   return (
              //     <div className="form-group">
              //       <TextField
              //         key={key}
              //         name={key}
              //         type="date"
              //         label="Date of Birth"
              //         variant="outlined"
              //         fullWidth
              //         value={
              //           detail[key] ? detail[key].split("T")[0] : detail[key]
              //         }
              //         onChange={(e) => handleFamilyDetailsChange(index, e)}
              //       />
              //     </div>
              //   );

              case "relation":
                return (
                  <div className="form-group form_select">
                    <Autocomplete
                      key={key}
                      name={key}
                      options={familyRelationList}
                      getOptionLabel={(option) => option.label}
                      value={familyRelationList.find(
                        (option) => option.value === detail[key]
                      )}
                      onChange={(event, newValue) => {
                        handleFamilyDetailsChange(index, {
                          target: {
                            name: key,
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Relation"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                );

              case "occupation":
                return (
                  <div className="form-group form_select">
                    <Autocomplete
                      key={key}
                      name={key}
                      options={OccupationList}
                      getOptionLabel={(option) => option.label}
                      value={OccupationList.find(
                        (option) => option.value === detail[key]
                      )}
                      onChange={(event, newValue) => {
                        handleFamilyDetailsChange(index, {
                          target: {
                            name: key,
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Occupation"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                );

              case "contact":
                return (
                  <>
                    <div className="form-group">
                      <TextField
                        key={key}
                        name={key}
                        type="number"
                        label={familyFieldLabels[key]}
                        variant="outlined"
                        fullWidth
                        value={detail[key]}
                        onChange={(e) => handleFamilyDetailsChange(index, e)}
                      />
                      {familyValidationErrors[`contact-${index}`] && (
                        <span style={{ color: "red" }}>
                          {familyValidationErrors[`contact-${index}`]}
                        </span>
                      )}
                    </div>
                  </>
                );

              case "annual_income":
                return (
                  // <div className="form-group">
                  //   <TextField
                  //     key={key}
                  //     name={key}
                  //     type="number"
                  //     label={familyFieldLabels[key]}
                  //     variant="outlined"
                  //     fullWidth
                  //     value={detail[key]}
                  //     onChange={(e) => handleFamilyDetailsChange(index, e)}
                  //   />
                  // </div>
                  <div className="form-group form_select">
                    <Autocomplete
                      key={key}
                      name={key}
                      options={IncomeList}
                      getOptionLabel={(option) => option.label}
                      value={IncomeList.find(
                        (option) => option.value === detail[key]
                      )}
                      onChange={(event, newValue) => {
                        handleFamilyDetailsChange(index, {
                          target: {
                            name: key,
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Family Income"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                );

              default:
                if (familyDisplayFields.includes(key)) {
                  return (
                    <div className="form-group">
                      <TextField
                        key={key}
                        name={key}
                        label={familyFieldLabels[key]}
                        variant="outlined"
                        fullWidth
                        value={detail[key]}
                        onChange={(e) => handleFamilyDetailsChange(index, e)}
                      />
                    </div>
                  );
                }
            }
          })}
          {familyDetails?.length > 1 && (
            <IconButton
              className="btn-icon"
              onClick={() => handleRemoveFamilyDetails(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}

      {canAddMoreFamily && (
        <div>
          <button
            type="button"
            onClick={handleAddFamilyDetails}
            variant="contained"
            className="btn onboardBtn btn-outline-primary"
          >
            Add {familyDetails?.length > 0 && "More"} Family Details
          </button>
        </div>
      )}
    </>
  );
};

export default FamilyFields;
