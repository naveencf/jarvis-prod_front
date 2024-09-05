import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  FormControl,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import axios from "axios";
import {baseUrl} from '../../../utils/config'

export default function SingleAssignDialog(props) {
  const {
    open,
    handleClose,
    modalNotEditable,
    brandName,
    contentTypeList,
    assignToList,
    setAssignTo,
    setReload,
    reload,
    setOpen,
  } = props;

  const [remarkValue, setRemarkValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleRemarkChange = (event) => {
    setRemarkValue(event.target.value);
  };

  const handleAssign = () => {
    axios
      .put(baseUrl+"contentSectionReg", {
        content_section_id: modalNotEditable.content_section_id,
        assign_to: setAssignTo.current,
        creator_dt: selectedDate,
        admin_remark: remarkValue,
        stage: 2,
        status: "11",
      })
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setReload((prev) => !prev);
          setAssignTo.current = "";
          setSelectedDate(null);
          setRemarkValue("");
          setAssignTo.current = "";
        }
      });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
      fullWidth={true}
    >
      <DialogTitle id="alert-dialog-title">Assign Content Creator</DialogTitle>
      <DialogContent>
        <Stack flexDirection="row">
          <Stack id="modal-modal-description">
            <Paper sx={{ padding: "10px" }}>
              <TextField
                id="Brand Name"
                label="Brand Name"
                value={
                  brandName.filter((e) => {
                    return e.brand_id == modalNotEditable.brand_id;
                  })[0]?.brand_name
                }
                disabled={true}
                sx={{ width: "45%", color: "black" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                sx={{ width: "49%", mx: "10px" }}
                label="Date & Time"
                InputLabelProps={{
                  shrink: true,
                }}
                value={new Date(modalNotEditable.brnad_dt)
                  .toLocaleString("en-GB", { timeZone: "UTC" })
                  .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$3/$2/$1 $4")}
                disabled={true}
              />
              <FormControl>
                <div className="d-flex mt-3 ">
                  <FormControl sx={{ width: "100%", marginRight: "10px" }}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={
                        (
                          contentTypeList.find(
                            (e) =>
                              modalNotEditable.content_type_id ===
                              e?.content_type_id
                          ) || {}
                        ).content_type || ""
                      }
                      label="Content Type"
                      sx={{ width: "100%" }}
                    />
                  </FormControl>
                  <TextField
                    label="Est Static & video"
                    disabled={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={modalNotEditable.est_static_vedio}
                    sx={{ width: "100%", marginRight: "10px" }}
                  />
                </div>
                <TextField
                  multiline
                  required={true}
                  aria-label="minimum height"
                  minRows={1.5}
                  value={modalNotEditable.content_brief}
                  sx={{
                    borderColor: grey[500],
                    marginRight: "2%",
                    color: grey[500],
                    mt: "15px",
                    width: "100%",
                  }}
                  label="Brief"
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <div>
                <label htmlFor="campignBrief" className="mb-0 text-black-50">
                  Campaign Brief
                </label>
                <TextField
                  multiline
                  className="mt-0"
                  aria-label="minimum height"
                  value={modalNotEditable.campaign_brief}
                  id="campignBrief"
                  minRows={3}
                  sx={{
                    width: "100%",
                    color: grey[500],
                    borderColor: grey[500],
                  }}
                  disabled={true}
                />
              </div>
            </Paper>
          </Stack>

          <Paper sx={{ width: "100%", px: 10, ml: "3px" }}>
            <FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date Time"
                  value={selectedDate}
                  onChange={(newValue) => handleDateChange(newValue)}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl
              sx={{
                width: "100%",
                mt: 2,
              }}
            >
              <Autocomplete
                options={assignToList.map((e) => ({
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
                    sx={{ width: "100%", marginRight: "10px" }}
                    label="Assign To"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ width: "100%", marginRight: "10px" }}>
              <TextField
                multiline
                rows={4.8}
                style={{ marginTop: "15px", marginBottom: 10 }}
                value={remarkValue}
                placeholder="Remarks"
                sx={{ width: "100%" }}
                onChange={(event) => handleRemarkChange(event)}
              />
            </FormControl>
          </Paper>
        </Stack>
        {/* </Stack> */}
        <div className="d-flex justify-content-between">
          <Button variant="contained" onClick={handleClose} color="primary">
            Cancle
          </Button>
          <Button variant="contained" onClick={handleAssign} color="primary">
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
