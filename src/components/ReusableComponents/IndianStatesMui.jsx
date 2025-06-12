import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const IndianStatesMui = ({ selectedState, onChange }) => {
  const [states, setStates] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const { State } = await import("country-state-city"); // Lazy import
        const result = State.getStatesOfCountry("IN");
        setStates(result);
      } catch (err) {
        console.error("Failed to load states", err);
      }
    };
    fetchStates();
  }, []);

  const findStateByIsoCode = (isoCode) => {
    return states.find((state) => state.isoCode === isoCode) || null;
  };

  return (
    <Autocomplete
      options={states}
      getOptionLabel={(option) => option.name}
      value={findStateByIsoCode(selectedState)}
      onChange={(event, newValue) => onChange(newValue ? newValue.isoCode : "")}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode}
      renderInput={(params) => (
        <TextField {...params} label="State/UT" variant="outlined" required />
      )}
      clearOnEscape
    />
  );
};

export default IndianStatesMui;








// import React, { useState } from "react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { State } from "country-state-city";

// const IndianStatesMui = ({ selectedState, onChange }) => {
//   const states = State.getStatesOfCountry("IN"); // Array of state objects
//   const [inputValue, setInputValue] = useState("");

//   // Function to find the state object by isoCode
//   const findStateByIsoCode = (isoCode) => {
//     return states.find((state) => state.isoCode === isoCode) || null;
//   };

//   const handleInputChange = (event, newInputValue) => {
//     setInputValue(newInputValue);
//   };

//   return (
//     <Autocomplete
//       options={states}
//       getOptionLabel={(option) => option.name} // Display the name in the dropdown
//       value={findStateByIsoCode(selectedState)} // Find the state object based on the isoCode
//       onChange={(event, newValue) => onChange(newValue ? newValue.isoCode : "")}
//       // value={selectedState}
//       // onChange={(event, newValue) => onChange(newValue ? newValue : "")}
//       inputValue={inputValue}
//       onInputChange={handleInputChange}
//       isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode} // Compare based on isoCode
//       renderInput={(params) => (
//         <TextField {...params} label="State/UT" variant="outlined" required />
//       )}
//       clearOnEscape
//     />
//   );
// };

// export default IndianStatesMui;
