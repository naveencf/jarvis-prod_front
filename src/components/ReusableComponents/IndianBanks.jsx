import React from "react";
import Select from "react-select";
import IndianBankList from "../../assets/js/IndianBankList";

const IndianBanks = ({ onChange, value }) => {
  const selectedValue = value
    ? IndianBankList.find((bank) => bank.value === value)
    : null;

  return (
    <div className="form-group">
      <label className="form-label">Banks</label>
      <Select
        id="bankSelect"
        options={IndianBankList}
        onChange={onChange}
        isClearable
        isSearchable
        value={selectedValue} // Set selected value
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        required
      />
    </div>
  );
};
export default IndianBanks;
