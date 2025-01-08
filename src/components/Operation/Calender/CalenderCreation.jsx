import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Button,
    TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, differenceInDays, addDays } from "date-fns";
import CalendarOverview from "./CalendarOverview";

const PostCalendar = () => {
    const initialSteps = [
        {
            step: 1,
            category: "Sarcasm",
            posCount: 160,
            pages: [
                { username: "SarcasmLol", postCount: 5 },
                { username: "Sarcastic_us", postCount: 5 },
                { username: "Sadcasm", postCount: 5 },
                { username: "Sadcasm.og", postCount: 5 },
            ],
        },
        {
            step: 2,
            category: "Meme",
            posCount: 140,
            pages: [
                { username: "Rvcjinsta", postCount: 5 },
                { username: "Comedyculture", postCount: 5 },
                { username: "Trolls_Official", postCount: 3 },
                { username: "Ghantaa", postCount: 10 },
            ],
        },
    ];

    const [steps, setSteps] = useState(initialSteps);
    const [selectedStep, setSelectedStep] = useState(0);
    const [dates, setDates] = useState([]);
    const [postCounts, setPostCounts] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [overviewData, setOverviewData] = useState({});

    const handleStepChange = (stepIndex) => {
        setSelectedStep(stepIndex);
    };

    const handleDatePostCountChange = (pageIndex, dateIndex, value) => {
        const updatedPostCounts = [...postCounts];
        const newCount = parseInt(value, 10) || 0;

        // Update the specific date count
        updatedPostCounts[selectedStep][pageIndex][dateIndex] = newCount;

        // Update the total count for the page and step
        const pageTotal = updatedPostCounts[selectedStep][pageIndex].reduce((sum, count) => sum + count, 0);
        const updatedSteps = [...steps];
        updatedSteps[selectedStep].pages[pageIndex].postCount = pageTotal;
        updatedSteps[selectedStep].posCount = updatedSteps[selectedStep].pages.reduce(
            (total, page) => total + page.postCount,
            0
        );

        setPostCounts(updatedPostCounts);
        setSteps(updatedSteps);
    };

    const generateDates = (start, end) => {
        const daysCount = differenceInDays(end, start) + 1;
        const generatedDates = Array.from({ length: daysCount }, (_, i) => {
            const date = addDays(start, i);
            return format(date, "d MMM EEE");
        });
        setDates(generatedDates);

        const updatedCounts = steps.map((step, stepIndex) => {
            if (stepIndex === selectedStep) {
                return step.pages.map((page) => {
                    const postsPerDay = Math.floor(page.postCount / daysCount);
                    const remainingPosts = page.postCount % daysCount;

                    const distribution = Array(daysCount).fill(postsPerDay);
                    for (let i = 0; i < remainingPosts; i++) {
                        distribution[i] += 1;
                    }
                    return distribution;
                });
            }
            return postCounts[stepIndex] || [];
        });
        const updatedOverview = {
            ...overviewData,
            [selectedStep]: updatedCounts[selectedStep],
        };

        setPostCounts(updatedCounts);
        setOverviewData(updatedOverview);

    };

    const resetCalendar = () => {
        setDates([]);
        setPostCounts([]);
        setStartDate(null);
        setEndDate(null);
    };

    const getDailyTotals = () => {
        return dates.map((_, dateIndex) =>
            (postCounts[selectedStep] || []).reduce((total, pageCounts) => total + pageCounts[dateIndex], 0)
        );
    };

    const dailyTotals = getDailyTotals();

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Post Summary Calendar
                    </Typography>

                    <div style={{ marginBottom: "16px" }}>
                        {steps.map((step, index) => (
                            <Button
                                key={step.step}
                                variant={selectedStep === index ? "contained" : "outlined"}
                                onClick={() => handleStepChange(index)}
                                sx={{ marginRight: "8px" }}
                            >
                                {step.category} - {step.posCount}
                            </Button>
                        ))}
                    </div>


                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (startDate && endDate) {
                                    generateDates(startDate, endDate);
                                } else {
                                    alert("Please select both start and end dates.");
                                }
                            }}
                        >
                            Generate Calendar
                        </Button>
                        <Button variant="outlined" onClick={resetCalendar}>
                            Reset
                        </Button>
                    </div>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Username</TableCell>
                                    {dates.map((date) => (
                                        <TableCell key={date} align="center">
                                            {date}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">Total Posts</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {steps[selectedStep]?.pages.map((page, pageIndex) => (
                                    <TableRow key={page.username}>
                                        <TableCell>{page.username}</TableCell>
                                        {(postCounts[selectedStep]?.[pageIndex] || []).map((count, dateIndex) => (
                                            <TableCell key={dateIndex} align="center">
                                                <TextField
                                                    value={count}
                                                    onChange={(e) =>
                                                        handleDatePostCountChange(
                                                            pageIndex,
                                                            dateIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    size="small"
                                                    inputProps={{
                                                        style: { textAlign: "center" },
                                                    }}
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">{page.postCount}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell align="center">
                                        <b>Daily Totals</b>
                                    </TableCell>
                                    {dailyTotals.map((total, index) => (
                                        <TableCell key={index} align="center">
                                            <b>{total}</b>
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <b>{dailyTotals.reduce((a, b) => a + b, 0)}</b>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <CalendarOverview overviewData={overviewData} dates={dates} steps={steps} />
            </LocalizationProvider>
        </>
    );
};

export default PostCalendar;
