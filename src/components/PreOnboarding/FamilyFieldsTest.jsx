// GuardianComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddMoreFieldsComponent from "../AddMoreFields/AddMoreFieldsComponent";
import useAddMoreFields from "../../Hooks/useAddMoreFields";
import {baseUrl} from '../../utils/config'

const FamilyFields = () => {
  const initialFamilyDetailsGroup = {
    name: "",
    DOB: "",
    contact: "",
    occupation: "",
    annual_income: "",
    relation: "",
  };

  const familyDisplayFields = [
    "name",
    "DOB",
    "contact",
    "occupation",
    "relation",
    "annual_income",
  ];

  const familyFieldLabels = {
    name: "Full Name",
    // DOB: "Date of Birth",
    contact: "Contact Number",
    occupation: "Occupation",
    annual_income: "Annual Income",
    relation: "Relationship",
  };

  const {
    fieldDetails,
    handleAddFieldDetails,
    handleFieldDetailsChange,
    handleRemoveFieldDetails,
  } = useAddMoreFields(initialFamilyDetailsGroup, familyFieldLabels);

  useEffect(() => {
    async function fetchFamilyData() {
      try {
        const response = await axios.get(
          `${baseUrl}`+`get_single_family/1`
        );
        setFieldDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching family data", error);
      }
    }
    fetchFamilyData();
  }, []);

  return (
    <>
      <AddMoreFieldsComponent
        fieldDetails={fieldDetails}
        fieldLabels={familyFieldLabels}
        handleFieldDetailsChange={handleFieldDetailsChange}
        handleAddFieldDetails={handleAddFieldDetails}
        handleRemoveFieldDetails={handleRemoveFieldDetails}
        addButtonLabel="Add More Family Details"
        displayFields={familyDisplayFields}
      />
    </>
  );
};

export default FamilyFields;
