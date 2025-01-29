import React from "react";
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
import OpCalenderOverview from "./OpCalenderOverview";
import DownloadCSV from "./CalenderCsvDownload";

const Calender = ({
  steps,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  generateDates,
  handleStepChange,
  handleDatePostCountChange,
  resetCalendar,
  dates,
  selectedStep,
  dailyTotals,
  overviewData,
  postCounts,
  addDate,
}) => {
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

            {/* Use DownloadCSV component */}
            <DownloadCSV
              steps={steps}
              dates={dates}
              postCounts={postCounts}
              dailyTotals={dailyTotals}
              selectedStep={selectedStep}
            />
          </div>
          <DatePicker
            label="Manually Date Select"
            onChange={(newValue) => addDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

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
                  <TableRow key={`${page.username}-${pageIndex}`}>
                    <TableCell>{page.username}</TableCell>
                    {(postCounts[selectedStep]?.[pageIndex] || []).map(
                      (count, dateIndex) => (
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
                      )
                    )}

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

        <OpCalenderOverview
          overviewData={overviewData}
          dates={dates}
          steps={steps}
        />
      </LocalizationProvider>
    </>
  );
};

export default Calender;
