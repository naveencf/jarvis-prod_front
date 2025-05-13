import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

const Calendar = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="form-group">
        <div className="flexCenterBetween colGap20">
          <div className="w-100">
            <DatePicker
              label="Start Date"
              value={startDate ? dayjs(startDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setStartDate(dayjs(newValue).format("YYYY-MM-DD"));
                }
              }}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </div>
          <div className="w-100">
            <DatePicker
              label="End Date"
              value={endDate ? dayjs(endDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setEndDate(dayjs(newValue).format("YYYY-MM-DD"));
                }
              }}
              minDate={startDate ? dayjs(startDate) : null}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Calendar;
