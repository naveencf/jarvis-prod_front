import { Autocomplete, Checkbox, Paper, Stack, TextField } from "@mui/material";
import React from "react";

function ShowData() {
  return (
    <>
      <Paper
        justifyContent="space-between"
        sx={{ flexWrap: "wrap", flexDirection: "row", p: 3 }}
      >
        {/* <Typography>h1. Heading</Typography> */}
        <Stack direction="row" sx={{}} justifyContent="space-between">
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={option}
            disableCloseOnSelect
            size="small"
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  //   style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 150 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Checkboxes"
                placeholder="Favorites"
              />
            )}
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyOutlinedIcon />}
            >
              Copy Selected Pages
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CopyAllOutlinedIcon />}
            >
              Copy All Pages
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentPasteIcon />}
            >
              Copy Page Name & Links
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}

export default ShowData;
