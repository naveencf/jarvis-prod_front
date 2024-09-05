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
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
let tj = 0;
function AssignLeadHeader({
  rowSelectionModel,
  setRowSelectionModel,
  hm,
  newleadcount,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [ind, setInd] = useState(0);
  const [input, setInput] = useState(0);
  const [alert, setAlert] = useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : 1;
  let N = rowSelectionModel.length;
  let n = input;

  const checkinputvalidtaion = () => {
    if (input == 0) {
      console.log("working");
      tj = 0;
      setAlert(true);
      return false;
    } else if (N == 0) {
      tj = 1;
      console.log("emp catch and tj = 1");
      setAlert(true);
      return false;
    }
    return true;
  };
  // todo // Assign Button - distributed equally to selected rep
  const assignleads = () => {
    // checkinputvalidtaion();
    if (checkinputvalidtaion()) {
      N = rowSelectionModel.length;
      for (let i = 0; i < n; i++) {
        console.log("put api will hit here" + i);
      }
      setInput(0);
      setRowSelectionModel([]);
    }
  };

  //todo // Equal after distribution
  const assignequalafter = () => {
    let ta = 0;
    N = rowSelectionModel.length;
    if (checkinputvalidtaion()) {
      console.log(rowSelectionModel);
      console.log(hm);
      for (let i = 0; i < N; i++) {
        ta += hm.get(rowSelectionModel[i]);
        console.log(hm.get(rowSelectionModel[i]));
      }
      ta = ta + Number(n);
      console.log(" ta:" + ta + " n:" + typeof n);

      let avgass = Math.floor(ta / N),
        q = 0,
        p = 0;
      console.log(" ta:" + ta + " avgass:" + avgass);
      while (q < n && p < N) {
        if (hm.get(rowSelectionModel[p]) >= avgass) {
          p++;
        } else {
          hm.set(rowSelectionModel[p], hm.get(rowSelectionModel[p]) + 1);
          console.log("put api will  hit here");
          console.log("Assign to " + rowSelectionModel[p]);
          q++;
        }
      }
      if (q < n) {
        while (q < n) {
          console.log("api put hit for remainder leads");
          console.log("Assign to " + rowSelectionModel[q % N]);
          q++;
        }
      }
      setInput(0);
      setRowSelectionModel([]);
    }
  };

  return (
    <Stack direction="row" sx={{ p: 1 }}>
      <AlertDialog open={alert} setOpen={setAlert} tj={tj} />
      <Badge badgeContent={newleadcount} color="success">
        <FiberNewOutlinedIcon />
      </Badge>
      <TextField
        id="standard-basic"
        // label="Standard"
        placeholder="number of leads"
        sx={{ ml: 5, width: 125 }}
        variant="standard"
        size="small"
        type="number"
        title="Select the number of leads you want to assign"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      />

      <Button
        sx={{ ml: 1, mr: 1 }}
        variant="contained"
        color="success"
        size="small"
        button="1"
        aria-describedby={id}
        aria-haspopup="true"
        title="Will distribute leads equally between selected representative"
        onClick={assignleads}
      >
        = Assign
      </Button>

      <Button
        sx={{ mr: 1 }}
        variant="contained"
        color="success"
        size="small"
        button="2"
        title="After distribution to selected representative, they will have eqaul leads"
        // aria-owns={open ? "mouse-over-popover" : undefined}
        aria-describedby={id}
        aria-haspopup="true"
        onClick={assignequalafter}
      >
        Assign eq
      </Button>
    </Stack>
  );
}
export default AssignLeadHeader;
