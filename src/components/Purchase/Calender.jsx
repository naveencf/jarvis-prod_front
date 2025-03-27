import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const Calendar = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="form-group">
        <label>Select Date Range</label>
        <div className="flexCenterBetween colGap20">
          <div className="w-100">
            {/* Start Date Picker */}
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={dayjs()}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="w-100">
            {/* End Date Picker */}
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate}
              maxDate={dayjs()}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="DD/MM/YYYY"
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Calendar;
