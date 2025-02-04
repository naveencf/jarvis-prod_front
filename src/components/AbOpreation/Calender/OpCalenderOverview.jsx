import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const OpCalenderOverview = ({ steps, overviewData, dates }) => {
  const getStepTotalsByDate = (stepIndex, dateIndex) => {
    const stepData = overviewData[stepIndex] || [];
    return stepData.reduce(
      (total, pageCounts) => total + (pageCounts[dateIndex] || 0),
      0
    );
  };

  return (
    <Paper sx={{ p: 3, marginTop: "16px" }}>
      <Typography variant="h6" gutterBottom>
        Calendar Overview
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Step</TableCell>
              {dates.map((date) => (
                <TableCell key={date} align="center">
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          ;
          <TableBody>
            {steps.map((step, stepIndex) => (
              <TableRow key={step.step}>
                <TableCell align="center">
                  {step.category} - {step.posCount}
                </TableCell>
                {dates.map((_, dateIndex) => (
                  <TableCell key={dateIndex} align="center">
                    {getStepTotalsByDate(stepIndex, dateIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OpCalenderOverview;
