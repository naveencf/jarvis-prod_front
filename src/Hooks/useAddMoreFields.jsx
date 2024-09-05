import { useState } from "react";

const useAddMoreFields = (initialDetails, fieldLabels) => {
  const [fieldDetails, setFieldDetails] = useState([initialDetails]);

  const handleAddFieldDetails = () => {
    setFieldDetails([...fieldDetails, { ...initialDetails }]);
  };

  const handleFieldDetailsChange = (index, event) => {
    const updatedFieldDetails = fieldDetails.map((detail, idx) => {
      if (idx === index) {
        return { ...detail, [event.target.name]: event.target.value };
      }
      return detail;
    });
    setFieldDetails(updatedFieldDetails);
  };

  const handleRemoveFieldDetails = (index) => {
    const newFieldDetails = fieldDetails.filter((_, idx) => idx !== index);
    setFieldDetails(newFieldDetails);
  };

  return {
    fieldDetails,
    handleAddFieldDetails,
    handleFieldDetailsChange,
    handleRemoveFieldDetails,
    fieldLabels,
  };
};

export default useAddMoreFields;
