import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  Autocomplete,
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { baseUrl } from "../../../utils/config";

export default function MultipleAssignDialog({
  brandName,
  openMultipleAssignModal,
  showMultipleAssignModalData,
  assignToList,
  setAssignTo,
  handleCloseMultipleAssignModal,
  reload,
  setReload,
}) {
  const [remarkValue, setRemarkValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAssignMultiple = () => {
    for (let i in showMultipleAssignModalData) {
      axios
        .put(baseUrl + "contentSectionReg", {
          content_section_id: showMultipleAssignModalData[i].content_section_id,
          assign_to: setAssignTo.current,
          creator_dt: selectedDate,
          admin_remark: remarkValue,
          stage: 2,
          status: "11",
        })
        .then((response) => {
          if (response.data.success) {
            handleCloseMultipleAssignModal();
            setReload((prev) => !prev);
            setAssignTo.current = " ";
            setSelectedDate(null);
            setRemarkValue("");
          }
        });
    }
  };

  return (
    <div>
      <Dialog
        open={openMultipleAssignModal}
        onClose={handleCloseMultipleAssignModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Assign Multiple</DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Stack flexDirection="row">
              <Stack width={{ width: "50%" }}>
                <Paper sx={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    label="Brand Name"
                    value={
                      brandName.filter((e) => {
                        return (
                          e.brand_id == showMultipleAssignModalData[0]?.brand_id
                        );
                      })[0]?.brand_name
                    }
                    disabled={true}
                    sx={{ width: "100%", color: "black" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Paper>
              </Stack>
              <Stack sx={{ width: "50%" }}>
                <Paper sx={{ p: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date Time"
                      // sx={{ width: "100%" }}
                      value={selectedDate}
                      onChange={(newValue) => handleDateChange(newValue)}
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    sx={{ width: "65%" }}
                    options={assignToList?.map((e) => ({
                      value: e.user_id,
                      label: e.user_name,
                    }))}
                    value={
                      assignToList.filter((e) => {
                        return e.user_id == setAssignTo.current;
                      })[0]?.user_name
                    }
                    onChange={(e, newValue) =>
                      (setAssignTo.current = newValue.value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ my: 2 }}
                        label="Assign To"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />

                  <TextField
                    multiline
                    sx={{ width: "100%", mt: 2 }}
                    id="outlined-basic"
                    label={"Remarks"}
                    variant="outlined"
                    value={remarkValue}
                    onChange={(e) => setRemarkValue(e.target.value)}
                  />
                </Paper>
              </Stack>
            </Stack>
            <div className="d-flex justify-content-between">
              <Button
                variant="contained"
                onClick={handleCloseMultipleAssignModal}
                color="primary"
              >
                Cancle
              </Button>
              <Button
                disabled={brandName.length === 0}
                variant="contained"
                onClick={handleAssignMultiple}
                color="primary"
              >
                Assign
              </Button>
            </div>
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
