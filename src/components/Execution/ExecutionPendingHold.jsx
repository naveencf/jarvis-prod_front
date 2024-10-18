import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/config";

const ExecutionPendingHold = (props) => {
  const { setShowHoldDialog, holdDialog, rowData, setReload } = props;
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setShowHoldDialog(false);
  };

  const handleHoldSubmit = async () => {
    try {
      if (!rowData?.sale_booking_id || !rowData?._id) {
        console.error("Invalid rowData:", rowData);
        return;
      }

      const payload = {
        execution_status: "execution_paused",
        sale_booking_id: rowData?.sale_booking_id,
      };

      const response = await axios.put(
        `${baseUrl}sales/execution_status/${rowData?._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      setReload((prev) => !prev);
      handleClose();
    } catch (err) {
      console.error("Error submitting hold:", err);
    }
  };

  return (
    <div>
      <Dialog
        fullWidth={"sm"}
        maxWidth={"sm"}
        open={holdDialog}
        onClose={handleClose}
      >
        <DialogTitle>PLEASE ENTER THE REASON FOR HOLD</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <TextField
                multiline
                rows={2}
                variant="outlined"
                placeholder="Enter Reason"
                onChange={(e) => setReason(e?.target?.value)}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHoldSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExecutionPendingHold;
