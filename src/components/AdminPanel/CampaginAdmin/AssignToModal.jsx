import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { grey } from "@mui/material/colors";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "10px",
  transform: "translate(-40%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  //   boxShadow,
};
export default function AssignToModal(props) {
  const {
    open,
    handleClose,
    modalNotEditable,
    brandName,
    contentTypeList,
    assignToList,
    remark,
    setRemark,
    handleAssign,
    selectedDate,
    handleDateChange,
    setAssignTo,
  } = props;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Assign Content Creator
          </Typography>
          <Stack flexDirection="row">
            <Stack
              id="modal-modal-description"
              // sx={{ mt: 2, mb: 3, width:50 }}
            >
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
                                e?.content_value
                            ) || {}
                          ).content_type || ""
                        }
                        label="Content Type"
                        sx={{ width: "100%" }}
                      />

                      {/* )}
                          /> */}
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

                    <TextField
                      id="outlined-multiline-static"
                      label="Brief"
                      multiline
                      required={true}
                      aria-label="minimum height"
                      minRows={1.5}
                      value={modalNotEditable.content_brief}
                      sx={{
                        borderColor: grey[500],
                        marginRight: "2%",
                        color: grey[500],
                        mt: "-2px",
                        pb: "10px",
                        pt: "20px",
                        ml: "10px",
                        width: "100%",
                      }}
                      disabled={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  {/* ))} */}
                </FormControl>
                <div>
                  <label htmlFor="campignBrief" className="mb-0 text-black-50">
                    Campaign Brief
                  </label>
                  <TextField
                    id="campignBrief"
                    label="Multiline"
                    multiline
                    className="mt-0"
                    aria-label="minimum height"
                    value={modalNotEditable.campaign_brief}
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
            <Stack
              id="modal-modal-description"
              sx={{ mt: 1, mb: 3, width: "100%" }}
            >
              <Paper sx={{ width: "100%", px: 10, ml: "3px" }}>
                <div className="d-flex">
                  <FormControl>
                    {/* {fields.map((field, index) => ( */}
                    <div className="d-flex mt-3 ">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Date Time"
                          value={selectedDate}
                          onChange={(newValue) => handleDateChange(newValue)}
                        />
                      </LocalizationProvider>
                    </div>
                    {/* ))} */}
                  </FormControl>

                  <FormControl
                    sx={{
                      width: "100%",
                      marginRight: "10px",
                      mt: 2,
                      ml: 2,
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
                </div>

                <div>
                  <FormControl sx={{ width: "100%", marginRight: "10px" }}>
                    <TextField
                      multiline
                      rows={4.8}
                      style={{ marginTop: "15px", marginBottom: 10 }}
                      value={remark}
                      placeholder="Remarks"
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        e.preventDefault();
                        setRemark(e.target.value);
                      }}
                    />
                  </FormControl>
                </div>
              </Paper>
            </Stack>
          </Stack>
          <div className="d-flex justify-content-between">
            <Button variant="contained" onClick={handleClose} color="primary">
              Cancle
            </Button>
            <Button variant="contained" onClick={handleAssign} color="primary">
              Assign
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
