import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const ContactNumber = ({
  label,
  parentComponentContact,
  setParentComponentContact,
}) => {
  const [contact, setContact] = useState(parentComponentContact || "");
  const [isValidcontact, setIsValidContact] = useState(false);
  const [isContactTouched, setIsContactTouched] = useState(false);

  useEffect(() => {
    setContact(parentComponentContact || "");
  }, [parentComponentContact]);

  function validateContact(newContact) {
    return /^[0-9]*$/.test(newContact) && newContact.length <= 10;
  }

  function handleContactChange(event) {
    const newContact = event.target.value;
    if (validateContact(newContact)) {
      setContact(newContact);
      setIsValidContact(true);
      setParentComponentContact(newContact);
    } else {
      setIsValidContact(false);
    }
  }

  function handleContactBlur() {
    setIsContactTouched(true);
    setIsValidContact(validateContact(contact));
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        type="text"
        inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
        InputProps={{
          disabled: label === "Emergency Contact 1" || 
                    label === "Emergency Contact 2" || 
                    label === "Alternate Contact" ? false : true,
        }}
        value={contact}
        onChange={handleContactChange}
        onBlur={handleContactBlur}
      />
      {/* {(isContactTouched || contact?.length >= 10) && !isValidcontact && (
        <p className="validation_message error">*Please enter valid number</p>
      )} */}
    </>
  );
};

export default ContactNumber;
