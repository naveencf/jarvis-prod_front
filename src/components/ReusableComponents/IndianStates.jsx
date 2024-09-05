import React, { useEffect, useState } from "react";
import Select from "react-select";
import statesAndUTs from "./IndianStatesAndUTs";

const IndianStates = ({ onBlur, onChange, newValue }) => {
  const [selectedState, setSelectedState] = useState(null);

  const options = statesAndUTs.map((state) => ({
    value: state,
    label: state,
  }));

  const handleChange = (selectedState) => {
    setSelectedState(selectedState);
    onChange(selectedState);
  };

  useEffect(() => {
    setSelectedState(newValue);
  }, [newValue]);

  return (
    <>
      <label className="form-label">
        States and UT <sup style={{ color: "red" }}>*</sup>
      </label>
      <Select
        className=""
        options={options}
        value={options.find((option) => option.value == selectedState)}
        label={newValue}
        onChange={handleChange}
        isClearable
        isSearchable
        required
        onBlur={onBlur}
      />
    </>
  );
};

export default IndianStates;
