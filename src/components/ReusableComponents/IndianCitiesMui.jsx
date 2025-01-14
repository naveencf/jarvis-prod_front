import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { City, State } from 'country-state-city';

const IndianCitiesMui = ({ selectedState, selectedCity, onChange }) => {
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (selectedState) {
      const fetchedCities = City.getCitiesOfState('IN', selectedState);
      setCities(fetchedCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const determineValue = () => {
    if (selectedCity !== '' && selectedCity !== null) {
      return cities.find((city) => city.name?.toLowerCase() === selectedCity?.toLowerCase()) || selectedCity;
    }
    return null;
  };

  const options = [...cities.map((city) => city.name), ...(inputValue && !cities?.some((city) => city.name?.toLowerCase() === inputValue.toLowerCase()) ? [`Add "${inputValue}" manually`] : [])];
 
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      value={determineValue()}
      onChange={(event, newValue) => {
        // Handle manual addition
        if (newValue?.startsWith('Add')) {
          const manualCity = inputValue; // Use the current inputValue
          onChange(manualCity);
          setInputValue(manualCity); // Update the displayed value
        } else {
          onChange(newValue || '');
        }
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      freeSolo
      renderInput={(params) => <TextField {...params} label="City" variant="outlined" required />}
      clearOnEscape
      disabled={!selectedState}
    />
  );
};

export default IndianCitiesMui;
