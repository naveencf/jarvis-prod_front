import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { baseUrl } from '../../utils/config'

export default function PerformanceGraphDialog({
  setOpenPerformanceGraphDialog,
  rowData,
  intervalFlag,
  setIntervalFlag,
  intervalFlagOptions,
}) {
  const [open, setOpen] = useState(true);
  const [graphData, setGraphData] = useState([]);
  // const [intervalFlag, setintervalFlag] = useState("Current Month");
  useEffect(() => {
    callApi();
  }, {});

  useEffect(() => {
    callApi();
  }, [intervalFlag]);

  const callApi = () => {
    axios
      .post(baseUrl + "page_health_dashboard", {
        p_id: rowData?.p_id,
        interval: intervalFlag?.value,
      })
      .then((res) => {
        setGraphData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setOpenPerformanceGraphDialog(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} maxWidth={"xl"}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <div className="master-card-css">

            <Autocomplete
              disablePortal
              value={intervalFlag.label}
              defaultValue={intervalFlagOptions[0].label}
              id="combo-box-demo"
              options={intervalFlagOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              onChange={(event, newValue) => {
                if (newValue === null) {
                  return setIntervalFlag({ label: "Current Month", value: 1 });
                }
                setIntervalFlag(newValue);
              }}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Filter Date" />
              )}
            />

            {intervalFlag.label === "Current Month" && (
              <>
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Highest</h6>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: ["Highest"] }]}
                    series={[
                      { data: [rowData?.maxEngagement], label: "Reach" },
                      { data: [rowData?.maxImpression], label: "Impression" },
                      { data: [rowData?.maxReach], label: "Engagement" },
                    ]}
                    width={500}
                    height={300}
                  />
                </Paper>
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Average</h6>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: ["Average"] }]}
                    series={[
                      { data: [rowData?.avgEngagement], label: "Reach" },
                      { data: [rowData?.avgImpression], label: "Impression" },
                      { data: [rowData?.avgReach], label: "Engagement" },
                    ]}
                    width={500}
                    height={300}
                  />
                </Paper>
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Lowest</h6>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: ["Lowest"] }]}
                    series={[
                      { data: [rowData?.minEngagement], label: "Reach" },
                      { data: [rowData?.minImpression], label: "Impression" },
                      { data: [rowData?.minReach], label: "Engagement" },
                    ]}
                    width={500}
                    height={300}
                  />
                </Paper>
              </>
            )}
            {intervalFlag?.label !== "Current Month" && (
              <>
                {" "}
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Highest</h6>
                  <LineChart
                    xAxis={[
                      {
                        data:
                          intervalFlag?.label === "Current Month"
                            ? [1]
                            : intervalFlag.label === "Last Three months"
                              ? [1, 2, 3]
                              : intervalFlag.label === "Last six months"
                                ? [1, 2, 3, 4, 5, 6]
                                : intervalFlag.label === "Last one year"
                                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                                  : null,
                      },
                    ]}
                    series={[
                      {
                        label: "Engagement",
                        data: graphData.map((e) => e?.maxEngagement),
                      },
                      {
                        label: "Impression",
                        data: graphData.map((e) => e?.maxImpression),
                      },
                      {
                        label: "Reach",
                        data: graphData.map((e) => e?.maxReach),
                      },
                    ]}
                    width={500}
                    height={250}
                  />
                </Paper>
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Average</h6>
                  <LineChart
                    xAxis={[{ data: [1] }]}
                    series={[
                      {
                        data: graphData.map((e) => e.avgEngagement),
                      },
                      {
                        data: graphData.map((e) => e.avgImpression), // Second line data
                      },
                      {
                        data: graphData.map((e) => e.avgReach), // Third line data
                      },
                    ]}
                    width={500}
                    height={250}
                  />
                </Paper>
                <Paper>
                  <h6 className="fs-5 mx-2 pt-3">Lowest</h6>

                  <LineChart
                    xAxis={[{ data: [1] }]}
                    series={[
                      {
                        data: graphData.map((e) => e.minEngagement),
                      },
                      {
                        data: graphData.map((e) => e.minImpression), // Second line data
                      },
                      {
                        data: graphData.map((e) => e.minReach), // Third line data
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Paper>
              </>
            )}
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
