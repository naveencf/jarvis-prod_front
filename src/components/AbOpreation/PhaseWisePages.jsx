import React from "react";
import { Tabs, Tab } from "@mui/material";

const PhaseWisePages = ({ phaseWisePages, selectedDate, onDateSelect, onShowAllPages }) => {
    const handleDateClick = (event, newValue) => {
        if (newValue === "all-pages") {
            onShowAllPages();
        } else {
            onDateSelect(phaseWisePages[newValue] || [], newValue);
        }
    };

    const sortedDates = Object.keys(phaseWisePages).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    return (
        <div>
            <Tabs
                value={selectedDate || "all-pages"}
                onChange={handleDateClick}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Phase-wise and all pages tabs"
                className="tabs"
            >
                <Tab key="all-pages" label="All Pages" value="all-pages" />
                {sortedDates.map((date) => {
                    const formattedDate = new Date(date).toLocaleDateString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });

                    return (
                        <Tab
                            key={date}
                            label={formattedDate}
                            value={date}
                            wrapped
                        />
                    );
                })}
            </Tabs>
        </div>
    );
};

export default PhaseWisePages;
