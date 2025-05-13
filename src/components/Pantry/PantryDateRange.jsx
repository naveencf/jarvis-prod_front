// components/PantryDateRange.jsx
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";

const PantryDateRange = ({ onFilterChange }) => {
  const [filterOption, setFilterOption] = useState("Today");
  const [startDate, setStartDate] = useState(dayjs().startOf("day"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));

  const predefinedFilters = [
    {
      label: "Today",
      value: "today",
      startDate: dayjs().startOf("day"),
      endDate: dayjs().endOf("day"),
    },
    {
      label: "Yesterday",
      value: "yesterday",
      startDate: dayjs().subtract(1, "day").startOf("day"),
      endDate: dayjs().subtract(1, "day").endOf("day"),
    },
    {
      label: "This Week",
      value: "thisWeek",
      startDate: dayjs().startOf("week"),
      endDate: dayjs().endOf("week"),
    },
    {
      label: "Last Week",
      value: "lastWeek",
      startDate: dayjs().subtract(1, "week").startOf("week"),
      endDate: dayjs().subtract(1, "week").endOf("week"),
    },
    {
      label: "This Month",
      value: "thisMonth",
      startDate: dayjs().startOf("month"),
      endDate: dayjs().endOf("month"),
    },
    {
      label: "Last Month",
      value: "lastMonth",
      startDate: dayjs().subtract(1, "month").startOf("month"),
      endDate: dayjs().subtract(1, "month").endOf("month"),
    },
    { label: "Custom", value: "custom" },
  ];

  const handleFilterChange = (option) => {
    setFilterOption(option.label);

    if (option.value !== "custom") {
      setStartDate(option.startDate);
      setEndDate(option.endDate);
      onFilterChange({
        createdAt: {
          $gte: option.startDate,
          $lte: option.endDate,
        },
      });
    }
  };

  const handleCustomDateChange = (start, end) => {
    if (start && end) {
      onFilterChange({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <Autocomplete
          sx={{ width: 200 }}
          options={predefinedFilters}
          getOptionLabel={(option) => option.label}
          value={
            predefinedFilters.find((o) => o.label === filterOption) || null
          }
          onChange={(_, newValue) => {
            if (newValue) handleFilterChange(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Date Filter" />
          )}
        />

        {filterOption === "Custom" && (
          <div style={{ display: "flex", gap: "16px" }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleCustomDateChange(date, endDate);
              }}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
                handleCustomDateChange(startDate, date);
              }}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default PantryDateRange;
