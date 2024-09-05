import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  Paper,
  Autocomplete,
  Stack,
  Modal,
  TextField,
  Badge,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import AlertTitle from "@mui/material/AlertTitle";
import { memo } from "react";
import Alert from "./AlertDialog";
import AlertDialog from "./AlertDialog";
let tj = 0;
function SEAssignLeadHeader({
  executivename,
  rowSelectionModel,
  setRowSelectionModel,
  transfer,
  setTransfer,
  tranreqcount,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [input, setInput] = useState(0);
  const [alert, setAlert] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // console.log(rowSelectionModel);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  let N = rowSelectionModel.length;
  // let n = input;
  const checkinputvalidtaion = () => {
    if (inputValue == "") {
      console.log("working");
      tj = 4;
      setAlert(true);
      return false;
    } else if (N == 0) {
      tj = 3;
      console.log("emp catch and tj = 1");
      setAlert(true);
      return false;
    }
    return true;
  };
  const transferupdate = () => {
    if (transfer) {
      setTransfer(!transfer);
    } else {
      if (checkinputvalidtaion()) {
        N = rowSelectionModel.length;
        for (let i = 0; i < N; i++) {
          console.log("put api will hit here" + i);
        }
        setTransfer(!transfer);
        setRowSelectionModel([]);
      }
    }
  };
  const transferlead = () => {
    if (checkinputvalidtaion()) {
      N = rowSelectionModel.length;
      for (let i = 0; i < N; i++) {
        console.log("put api will hit here" + i);
      }
      // setInput(0);
      setRowSelectionModel([]);
    }
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : 1;

  return (
    <Stack justifyContent="space-between" direction="row" sx={{ p: 1 }}>
      <Stack direction="row" sx={{ ml: 0 }}>
        <AlertDialog open={alert} setOpen={setAlert} tj={tj} />
        <Autocomplete
          disablePortal
          clearIcon={false}
          size="small"
          id="size-small-filled"
          options={executivename}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          title="Will transfer the selected leads to choosen employee"
          sx={{
            height: 30,
            width: 200,
            mr: 1,
          }}
          renderInput={(params) => (
            <>
              <TextField
                {...params}
                label="select"
                // variant="standard"
                size="small"
              />
            </>
          )}
        />
        <Button
          sx={{ ml: 1, mr: 1, mb: 0 }}
          variant="contained"
          color="success"
          size="small"
          button="1"
          aria-describedby={id}
          aria-haspopup="true"
          title="Select the employee to whom you want to transfer"
          onClick={transferlead}
        >
          tRANSFER
        </Button>
        <AlertDialog open={alert} setOpen={setAlert} tj={tj} />
      </Stack>
      <Stack direction="row" sx={{}} spacing={2}>
        <Badge
          badgeContent={tranreqcount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="success"
            size="small"
            button="1"
            title="Will show the transfer request by representative"
            aria-describedby={id}
            aria-haspopup="true"
            onClick={transferupdate}
          >
            {transfer ? "tRANSFER rEQ" : "Approve"}
          </Button>
        </Badge>
      </Stack>
    </Stack>
  );
}
export default SEAssignLeadHeader;
