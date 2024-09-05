import React, { useState, useEffect } from "react";
import FieldContainer from "../AdminPanel/FieldContainer";

const ContactNumberReact = ({
  astric,
  label,
  parentComponentContact,
  setParentComponentContact,
  mandatoryFieldsEmpty,
  setMandatoryFieldsEmpty,
}) => {
  const [contact, setContact] = useState(parentComponentContact || "");
  const [isValidcontact, setIsValidContact] = useState(false);
  const [isContactTouched, setIsContactTouched] = useState(false);

  useEffect(() => {
    setContact(parentComponentContact || "");
  }, [parentComponentContact]);

  function validateContact(newContact) {
    return /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact);
  }

  function handleContactChange(event) {
    if (event.target.value.length <= 10) {
      const newContact = event.target.value;
      setContact(newContact);
      setIsValidContact(newContact ? validateContact(newContact) : false);
      setParentComponentContact(newContact);
    }
  }

  function handleContactBlur() {
    if (contact === "" || contact === null) {
      setMandatoryFieldsEmpty((prev) => ({ ...prev, personalContact: true }));
    } else {
      setMandatoryFieldsEmpty((prev) => ({ ...prev, personalContact: false }));
    }
    setIsContactTouched(true);
    setIsValidContact(contact ? validateContact(contact) : false);
  }

  return (
    <div className="col-3">
      <FieldContainer
        fieldGrid={12}
        id="outlined-basic"
        label={label}
        astric={astric}
        type="number"
        value={contact}
        onChange={handleContactChange}
        onBlur={handleContactBlur}
      />
      {(isContactTouched || contact?.length >= 10) &&
        !isValidcontact &&
        mandatoryFieldsEmpty?.personalContact && (
          <p style={{ color: "red" }}>
            *Please enter emergency contact valid number
          </p>
        )}
      {mandatoryFieldsEmpty?.personalContact && (
        <p style={{ color: "red" }}>*Please enter emergency contact number</p>
      )}
    </div>
  );
};

export default ContactNumberReact;
