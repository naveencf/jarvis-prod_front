import Select from "react-select";
import formatString from "../../utils/formatString";
import { useEffect, useState } from "react";

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
  setSearchQuery,
}) => {
  const [inputValue, setInputValue] = useState("");

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
      label:
        typeof findOptionLabelById(id) === "string"
          ? formatString(findOptionLabelById(id))
          : findOptionLabelById(id),
    }));
    valueProp = isAllSelected ? [selectAllOption, ...selection] : selection;
  } else {
    const selectedOption = dataArray?.find(
      (option) => option[optionId] === selectedId
    );
    if (selectedOption) {
      valueProp = {
        value: selectedId,
        // label: formatString(findOptionLabelById(selectedId)),
        label:
          typeof findOptionLabelById(selectedId) === "string"
            ? formatString(findOptionLabelById(selectedId))
            : findOptionLabelById(selectedId),
      };
    } else {
      valueProp = null;
    }
  }

  const handleChange = (selectedOptions, action_meta) => {
    if (multiple) {
      if (!selectedOptions) {
        setSelectedId([]);
        return;
      }

      if (
        selectedOptions?.some(
          (option) => option.value === selectAllOption.value
        )
      ) {
        if (action_meta.action === "remove-value") {
          setSelectedId(
            dataArray
              ?.filter(
                (option) => option[optionId] !== action_meta.removedValue.value
              )
              ?.map((option) => option[optionId])
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
      if (!selectedOptions) {
        setSelectedId(null);
        return;
      }
      setSelectedId(selectedOptions?.value);
    }
  };

  const options = dataArray?.map((option) => ({
    value: option[optionId],
    label:
      typeof option[optionLabel] === "string"
        ? formatString(option[optionLabel])
        : option[optionLabel],
  }));

  if (multiple) {
    options?.unshift(selectAllOption);
  }
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setSearchQuery(inputValue);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [inputValue]);

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
        isClearable={true}
        onInputChange={(value) => setInputValue(value)}
      />
    </div>
  );
};

export default CustomSelect;
