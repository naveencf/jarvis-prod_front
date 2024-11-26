import { data } from "jquery";
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
  filterOption,
}) => {
  const findOptionLabelById = (id) =>
    dataArray?.find((option) => option[optionId] === id)?.[optionLabel];

  const selectAllOption = {
    value: "selectAll",
    label: "Select All",
  };

  const isAllSelected = dataArray?.length === selectedId?.length;

  let valueProp;
  if (multiple) {
    const selection = selectedId?.map((id) => ({
      value: id,
      label: findOptionLabelById(id),
    }));
    valueProp = isAllSelected ? [selectAllOption, ...selection] : selection;
  } else {
    const selectedOption = dataArray?.find(
      (option) => option[optionId] === selectedId
    );
    if (selectedOption) {
      valueProp = {
        value: selectedId,
        label: findOptionLabelById(selectedId),
      };
    } else {
      valueProp = null;
    }
  }

  const handleChange = (selectedOptions, action_meta) => {
    if (multiple) {
      if (
        selectedOptions?.some(
          (option) => option.value === selectAllOption.value
        )
      ) {
        if (action_meta.action === "remove-value") {
          setSelectedId(
            dataArray?.filter(
              (option) => option[optionId] != action_meta.removedValue.value
            )?.optionId
          );
        } else {
          setSelectedId(dataArray?.map((option) => option[optionId]));
        }
      } else if (
        action_meta.action === "remove-value" &&
        action_meta.removedValue.value === selectAllOption.value
      ) {
        setSelectedId([]);
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

  console.log(selectedId);

  return (
    <div className={`form-group col-${fieldGrid}`}>
      <label className="form-label">
        {label} {required && <sup className="form-error">*</sup>}
      </label>
      <Select
        filterOption={filterOption}
        options={options}
        value={valueProp}
        onChange={handleChange}
        required={required}
        isDisabled={disabled}
        isMulti={multiple}
      />
    </div>
  );
};

export default CustomSelect;
