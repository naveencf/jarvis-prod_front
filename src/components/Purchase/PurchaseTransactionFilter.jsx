


import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";

const PurchaseTransactionFilter = ({ onFilterChange, startDate, endDate, setStartDate, setEndDate }) => {
    const [filterOption, setFilterOption] = useState("This Week");
    // const [startDate, setStartDate] = useState(dayjs().subtract(7, "day")); // Default to last week
    // const [endDate, setEndDate] = useState(dayjs());

    const predefinedFilters = [
        { label: "Today", value: "today", startDate: dayjs().startOf("day"), endDate: dayjs().endOf("day") },
        { label: "Yesterday", value: "yesterday", startDate: dayjs().subtract(1, "day").startOf("day"), endDate: dayjs().subtract(1, "day").endOf("day") },
        { label: "This Week", value: "thisWeek", startDate: dayjs().startOf("week"), endDate: dayjs().endOf("week") },
        { label: "Last Week", value: "lastWeek", startDate: dayjs().subtract(1, "week").startOf("week"), endDate: dayjs().subtract(1, "week").endOf("week") },
        { label: "This Month", value: "thisMonth", startDate: dayjs().startOf("month"), endDate: dayjs().endOf("month") },
        { label: "Last Month", value: "lastMonth", startDate: dayjs().subtract(1, "month").startOf("month"), endDate: dayjs().subtract(1, "month").endOf("month") },
        // { label: "Custom", value: "custom" },
    ];

    const handleFilterOptionChange = (option) => {
        setFilterOption(option.label);

        if (option.value !== "custom") {
            setStartDate(option.startDate);
            setEndDate(option.endDate);
            // onFilterChange({
            //     startDate: option.startDate.format("YYYY-MM-DD"),
            //     endDate: option.endDate.format("YYYY-MM-DD"),
            // });
        }
    };

    const handleCustomDateChange = () => {
        // onFilterChange({
        //     startDate: startDate?.format("YYYY-MM-DD"),
        //     endDate: endDate?.format("YYYY-MM-DD"),
        // });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div >
                <div >
                    <Autocomplete
                        sx={{ width: 200, mb: 2 }}
                        options={predefinedFilters}
                        getOptionLabel={(option) => option.label}
                        value={predefinedFilters.find((option) => option.label === filterOption)}
                        onChange={(_, newValue) => {
                            if (newValue) handleFilterOptionChange(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Quick Filter" variant="outlined" />
                        )}
                    />
                </div>
                {filterOption === "Custom" && (
                    <div style={{ display: "flex", gap: "16px" }}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                // handleCustomDateChange();
                            }}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => {
                                setEndDate(date);
                                // handleCustomDateChange();
                            }}
                        />
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default PurchaseTransactionFilter;
