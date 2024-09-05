import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import jwtDecode from "jwt-decode";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultiSelectSearch = (props) => {
  const { getUserData, handleSelectionChange } = props;

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={getUserData}
      disableCloseOnSelect
      getOptionLabel={(option) => option?.user_name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option?.user_name}
        </li>
      )}
      // onChange={handleSelectionChange}
      onChange={(event, selectedOptions) =>
        handleSelectionChange(selectedOptions)
      }
      style={{ width: 434, marginTop: "15px" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Checkboxes"
          placeholder="Favorites"
          style={{ minHeight: "80px" }}
        />
      )}
    />
  );
};
export default MultiSelectSearch;
