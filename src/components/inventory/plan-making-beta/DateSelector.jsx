import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Calendar from "../../Purchase/Calender";
import { Autocomplete, TextField } from "@mui/material";

const DateSelector = ({ setStartDate, setEndDate }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const today = dayjs();

    const opts = [
      {
        label: `Current Month (${today.format("MMMM YYYY")})`,
        value: "current",
        start: today.startOf("month").format("YYYY-MM-DD"),
        end: today.endOf("month").format("YYYY-MM-DD"),
      },
      {
        label: `Last Month (${today.subtract(1, "month").format("MMMM YYYY")})`,
        value: "last",
        start: today.subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
        end: today.subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
      },
    ];

    // Last 6 months (excluding current & last)
    for (let i = 2; i <= 7; i++) {
      const month = today.subtract(i, "month");
      opts.push({
        label: month.format("MMMM YYYY"),
        value: month.format("YYYY-MM"),
        start: month.startOf("month").format("YYYY-MM-DD"),
        end: month.endOf("month").format("YYYY-MM-DD"),
      });
    }

    opts.push({
      label: "Custom",
      value: "custom",
    });

    setOptions(opts);
    setSelectedOption(opts[0]); // default to current
  }, []);

  useEffect(() => {
    if (!selectedOption) return;

    if (selectedOption.value === "custom") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      setStartDate(selectedOption.start);
      setEndDate(selectedOption.end);
    }
  }, [selectedOption]);

  return (
    <div className="space-y-4">
      <div style={{ width: "17rem", marginTop: "10px", marginLeft: "4px" }}>
        <Autocomplete
          fullWidth
          options={options}
          value={selectedOption}
          onChange={(e, newValue) => setSelectedOption(newValue)}
          getOptionLabel={(option) => option.label || ""}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Month Range"
              variant="outlined"
            />
          )}
        />
      </div>
      <div className="mt-4">
        {showCustom && (
          <Calendar
            startDate={dayjs().format("YYYY-MM-DD")}
            endDate={dayjs().format("YYYY-MM-DD")}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        )}
      </div>
    </div>
  );
};

export default DateSelector;
