import React from "react";
import Select from "react-select";

const CustomSelect = ({
  fieldGrid = 4,
  label,
  dataArray,
  optionId,
  optionLabel,
  selectedId,
  setSelectedId,
  required,
  disabled,
  multiple = false,
  filterOption
}) => {
  const findOptionLabelById = (id) => dataArray?.find((option) => option[optionId] === id)?.[optionLabel];

  const selectAllOption = {
    value: "selectAll",
    label: "Select All",
  };

  const isAllSelected = dataArray?.length === selectedId?.length;

  const valueProp = multiple
    ? selectedId?.map((id) => ({
      value: id,
      label: findOptionLabelById(id),
    }))
    : dataArray?.find((option) => option[optionId] === selectedId)
      ? {
        value: selectedId,
        label: findOptionLabelById(selectedId),
      }
      : null;

  const handleChange = (selectedOptions) => {
    if (multiple) {
      if (selectedOptions?.some((option) => option.value === selectAllOption.value)) {
        if (isAllSelected) {
          setSelectedId([]);
        } else {
          setSelectedId(dataArray?.map((option) => option[optionId]));
        }
      } else {
        setSelectedId(selectedOptions?.map((option) => option?.value));
      }
    } else {
      setSelectedId(selectedOptions?.value);
    }
  };

  const options = dataArray?.map((option) => ({
    value: option[optionId],
    label: option[optionLabel],
  }));

  if (multiple) {
    options?.unshift(selectAllOption);
  }

  return (
    <div className={`form-group col-${fieldGrid}`}>
      <label className="form-label">
        {label} {required && <sup className="form-error">*</sup>}
      </label>
      <Select
        filterOption={filterOption}
        options={options}
        value={multiple && isAllSelected ? [selectAllOption, ...valueProp] : valueProp}
        onChange={handleChange}
        required={required}
        isDisabled={disabled}
        isMulti={multiple}
      />
    </div>
  );
};

export default CustomSelect;