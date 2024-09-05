import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { City } from "country-state-city";

const IndianCitiesMui = ({ selectedState, selectedCity, onChange }) => {
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedState) {
      const fetchedCities = City.getCitiesOfState("IN", selectedState);
      setCities(fetchedCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Determine the value for the Autocomplete
  const determineValue = () => {
    if (selectedCity) {
      return cities.find((city) => city.name === selectedCity) || null;
    }
    return null; // Return null if selectedCity is undefined or empty
  };

  return (
    <Autocomplete
      options={cities}
      getOptionLabel={(option) => (option ? option.name : "")}
      value={determineValue()}
      onChange={(event, newValue) => onChange(newValue ? newValue.name : "")}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value) =>
        option.name === value.name &&
        option.countryCode === value.countryCode &&
        option.stateCode === value.stateCode &&
        option.latitude === value.latitude &&
        option.longitude === value.longitude
      }
      renderInput={(params) => (
        <TextField {...params} label="City" variant="outlined" required />
      )}
      clearOnEscape
      disabled={!selectedState}
    />
  );
};

export default IndianCitiesMui;
