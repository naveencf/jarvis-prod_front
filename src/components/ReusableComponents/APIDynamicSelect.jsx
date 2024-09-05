import React from "react";
import Select from "react-select";

const APIDynamicSelect = ({ data, value, onChange, cols, label, astric }) => {
  return (
    <div className="form-group col-6">
      <label className="form-label">
        {label} <sup style={{ color: "red" }}>*</sup>
      </label>
      <Select
        options={data?.map((opt) => ({
          value: opt.category_id,
          label: opt.category_name,
        }))}
        value={{
          value: value,
          label:
            data?.find((user) => user.category_id === value)?.category_name ||
            "",
        }}
        onChange={(e) => {
          setSelectedCat(e.value);
        }}
        required
      />
    </div>
  );
};

export default APIDynamicSelect;
