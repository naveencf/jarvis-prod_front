import React from "react";
import FieldContainer from "../../FieldContainer";
import Select from "react-select";

const PointOfContact = ({
  pocs,
  setPocs,
  isValidPoc,
  setIsValIDPoc,
  openModal,
  departments,
  socialOptions,
}) => {

  const handlePocChange = (index, key, value) => {
    const updatedPocs = pocs?.map((poc, pocIndex) =>
      pocIndex === index ? { ...poc, [key]: value } : poc
    );
    setPocs(updatedPocs);
  };

  const handleDeletePoc = (index) => {
    const updatedPocs = [...pocs];
    updatedPocs.splice(index, 1);
    setPocs(updatedPocs);
  };

  function isValidContactNumber(number) {
    if (!number) return true;
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  }

  function isValidEmail(email) {
    if (!email) return true;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleAddSocialLink = (index) => {
    const updatedPocs = pocs.map((poc, pocIndex) =>
      pocIndex === index
        ? {
          ...poc,
          social_platforms: [
            ...(poc.social_platforms || []),
            { platform: null, link: "" },
          ],
        }
        : poc
    );
    setPocs(updatedPocs);
  };

  const handleSocialLinkChange = (pocIndex, linkIndex, key, value) => {

    const updatedPocs = pocs.map((poc, index) =>
      index === pocIndex
        ? {
          ...poc,
          social_platforms: poc.social_platforms.map((link, i) =>
            i === linkIndex ? { ...link, [key]: value } : link
          ),
        }
        : poc
    );

    setPocs(updatedPocs);
  };

  const handleDeleteSocialLink = (pocIndex, linkIndex) => {
    const updatedPocs = pocs.map((poc, index) =>
      index === pocIndex
        ? {
          ...poc,
          social_platforms: poc.social_platforms.filter(
            (_, i) => i !== linkIndex
          ),
        }
        : poc
    );
    setPocs(updatedPocs);
  };

  const getAvailableOptions = (pocIndex, linkIndex) => {
    const selectedValues = pocs[pocIndex]?.social_platforms
      ?.map((link) => link.platform)
      .filter(Boolean);

    // Ensure the selected value is in the format { value: 'value', label: 'label' }
    return socialOptions.filter(
      (option) =>
        !selectedValues.includes(option.value) ||
        pocs[pocIndex]?.social_platforms[linkIndex]?.platform?.value ===
        option.value
    );
  };

  return (
    <>
      {pocs?.map((poc, index) => (
        <div className="card">
          <div className="card-header sb">
            <h4>Point of Contact ({index + 1})</h4>
            <button className="icon-1" onClick={() => handleDeletePoc(index)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
          <div className="card-body">
            <div key={index} className="row poc-container">
              <div className="col-4">
                <FieldContainer
                  astric
                  label="Contact Name"
                  fieldGrid={4}
                  value={poc.contact_name}
                  onChange={(e) => {
                    handlePocChange(index, "contact_name", e.target.value);
                    setIsValIDPoc({
                      ...isValidPoc,
                      [index]: {
                        ...isValidPoc[index],
                        contact_name: e.target.value,
                      },
                    });
                  }}
                  placeholder="Enter contact name"
                  required
                />
                {isValidPoc[index]?.contact_name === "" && (
                  <div className="form-error">Please Enter Contact Name</div>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  astric
                  label="Contact Number"
                  type="number"
                  fieldGrid={12}
                  value={poc.contact_no}
                  onChange={(e) => {
                    handlePocChange(index, "contact_no", e.target.value);
                    setIsValIDPoc({
                      ...isValidPoc,
                      [index]: {
                        ...isValidPoc[index],
                        contact_no: e.target.value,
                      },
                    });
                  }}
                  placeholder="Enter contact number"
                  required
                />
                {!isValidContactNumber(poc.contact_no) && (
                  <div className="form-error">
                    Please Enter Valid Contact Number
                  </div>
                )}
                {isValidPoc[index]?.contact_no === "" && (
                  <div className="form-error">Please Enter Contact Number</div>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  required={false}
                  label="Alternative Contact Number"
                  type="number"
                  fieldGrid={12}
                  value={poc.alternative_contact_no}
                  onChange={(e) => {
                    handlePocChange(
                      index,
                      "alternative_contact_no",
                      e.target.value
                    );
                  }}
                  placeholder="Enter alternative contact number"
                />
                {!isValidContactNumber(poc.alternative_contact_no) && (
                  <div className="form-error">
                    Please Enter Valid Alternate Contact Number
                  </div>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  required={false}
                  label="Email"
                  type="email"
                  fieldGrid={4}
                  value={poc.email}
                  onChange={(e) => {
                    handlePocChange(index, "email", e.target.value);
                  }}
                  placeholder="Enter email"
                />

                {!isValidEmail(poc.email) && (
                  <div className="form-error">Please Enter Valid Email</div>
                )}
              </div>

              <div className="col-xl-4 col-lg-4 col-md-3 col-sm-3 flex-row gap-1 ">
                <div className="col-9">
                  <label className="mb-1">
                    Department Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    className=""
                    placeholder="Select department"
                    options={departments?.map((option) => ({
                      value: option._id,
                      label: option.department_name,
                    }))}
                    value={{
                      value: poc.department,
                      label:
                        departments?.find((dept) => dept._id === poc.department)
                          ?.department_name || "",
                    }}
                    onChange={(selectedOption) => {
                      handlePocChange(
                        index,
                        "department",
                        selectedOption.value
                      );
                      setIsValidDepartment({
                        ...isValidDepartment,
                        [index]: {
                          ...isValidDepartment[index],
                          department: e.target.value,
                        },
                      });
                    }}
                  // required
                  />
                  {isValidPoc[index]?.department === "" && (
                    <div className="form-error">Please Enter Department</div>
                  )}
                </div>
                {
                  <div className="mt-1 flex-row gap-1">
                    <button
                      type="button"
                      className="btn cmnbtn btn_sm btn-primary mt-4"
                      onClick={() => openModal("addDepartment")}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn cmnbtn btn_sm btn-primary mt-4"
                      onClick={() => openModal("viewDepartment")}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </div>
                }
              </div>
              <div className="col-4">
                <FieldContainer
                  required={false}
                  label="Designation"
                  fieldGrid={12}
                  value={poc.designation}
                  onChange={(e) => {
                    handlePocChange(index, "designation", e.target.value);
                  }}
                  placeholder="Enter designation"
                />
              </div>

              <div className="col-12">
                {poc.social_platforms?.map((socialLink, linkIndex) => (
                  <div className="flex-row gap-1" key={linkIndex}>
                    <div className="col-4">
                      <label className="mb-2">Platform</label>
                      <Select
                        placeholder="Select platform"
                        options={getAvailableOptions(index, linkIndex)}
                        value={socialOptions.find(
                          (option) => option.value === socialLink.platform
                        )}
                        onChange={(selectedOption) =>
                          handleSocialLinkChange(
                            index,
                            linkIndex,
                            "platform",
                            selectedOption.value
                          )
                        }
                      />
                    </div>
                    <div className="col-4 mt-1">
                      <FieldContainer
                        fieldGrid={12}
                        label="Link"
                        value={socialLink.link}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            index,
                            linkIndex,
                            "link",
                            e.target.value
                          )
                        }
                        placeholder="Enter social link"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn cmnbtn btn_sm btn-danger mt-4"
                      onClick={() => handleDeleteSocialLink(index, linkIndex)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <div style={{ color: "red" }}>
                  Note: Please add POC social media profile details
                </div>
                {poc.social_platforms?.length < 4 && (
                  <button
                    type="button"
                    className="btn cmnbtn btn_sm btn-primary mt-2"
                    onClick={() => handleAddSocialLink(index)}
                  >
                    Add Social Link
                  </button>
                )}
              </div>
              <div className="col-4">
                <FieldContainer
                  required={false}
                  label="Description"
                  fieldGrid={12}
                  value={poc.description}
                  onChange={(e) => {
                    handlePocChange(index, "description", e.target.value);
                  }}
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>
          <div style={{ color: "red" }} className="ml-4 mb-4">
            Note:
            <br /> 1: Please ensure to fill proper details in POC-
            Email/Department/Designation/Contact/Socials. <br />
            2: Kindly ask POC to share finance team contact & details for smooth
            journey.
          </div>
        </div>
      ))}
    </>
  );
};

export default PointOfContact;
