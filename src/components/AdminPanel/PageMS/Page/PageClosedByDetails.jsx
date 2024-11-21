import React, { useState, useEffect, useContext } from "react";
import {
  startOfToday,
  startOfYesterday,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subMonths,
  subWeeks,
  endOfDay,
} from "date-fns";
import { Box, Grid, Stack, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGetPageCountQuery } from "../../../Store/PageBaseURL";
import formatString from "../../Operation/CampaignMaster/WordCapital";

const filterOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
  { label: "Custom", value: "custom" },
];

const PageClosedByDetails = ({ pagequery }) => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  
  // Set default start_date and end_date to the start and end of the current month
  const defaultStartDate = startOfMonth(new Date());
  const defaultEndDate = endOfDay(new Date());

  // const pageData = pageClosedbyList?.data;
  const [filterOption, setFilterOption] = useState("thisMonth");
  const [individualData, setIndividualData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [row, setRows] = useState([]);
  // Define the date ranges for each filter option
  const getDateRange = () => {
    const now = new Date();

    if (filterOption === "custom") {
      return {
        start: customStartDate || startOfToday(),
        end: customEndDate || endOfDay(now),
      };
    }

    switch (filterOption) {
      case "today":
        return { start: startOfToday(), end: endOfDay(now) };
      case "yesterday":
        return { start: startOfYesterday(), end: startOfToday() };
      case "thisWeek":
        return { start: startOfWeek(now), end: endOfDay(now) };
      case "lastWeek":
        return { start: subWeeks(startOfWeek(now), 1), end: startOfWeek(now) };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfDay(now) };
      case "lastMonth":
        return {
          start: startOfMonth(subMonths(now, 1)),
          end: startOfMonth(now),
        };
      case "thisYear":
        return { start: startOfYear(now), end: endOfDay(now) };
      case "lastYear":
        return {
          start: startOfYear(subMonths(now, 12)),
          end: startOfYear(now),
        };
      default:
        return { start: startOfToday(), end: endOfDay(now) };
    }
  };
  const { start, end } = getDateRange();

  const { data: getcount } = useGetPageCountQuery({
    start_date: start.toISOString().split("T")[0],
    end_date: end.toISOString().split("T")[0],
  });
 
  useEffect(() => {
    if (getcount) {
      setRows(getcount.data);
      setIndividualData(getcount.data);
    }
  }, [getcount]);

  const handleIndex = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(index);
  };


  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilterOption(newValue.value);
  };
  return (
    <div>


      <Autocomplete
        options={filterOptions}
        getOptionLabel={(option) => option.label}
        value={filterOptions.find((option) => option.value === filterOption)}
        onChange={handleFilterChange}
        renderInput={(params) => (
          <TextField {...params} label="Quick Filter" variant="outlined" />
        )}
      />

      {filterOption === "custom" && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
            <DatePicker
              label="Start Date"
              value={customStartDate}
              onChange={(newValue) => setCustomStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={customEndDate}
              onChange={(newValue) => setCustomEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
      )}

      <Box sx={{ height: 700, width: "100%" }}>
        <div>
          <div className="d-flex justify-content-between align-items-center p-3">
            <h3 className="mb-0">
              Page Details Added By Individuals
            </h3>
            <div className="border border-secondary rounded">
              <b>Count  : </b> {individualData.length}
            
            </div>
          </div>
          {individualData?.length === 0 ? (
            <p>No data available</p>
          ) : (
            individualData?.map((dataItem, index) => (
              <div key={dataItem._id} style={{ marginBottom: "10px" }}>

                <button
                  style={{
                    padding: "10px",
                    backgroundColor: "#303f72",
                    color: "#fff",
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleIndex(index)}
                >
                  Created by User: {dataItem.user_name} -  {dataItem.count}

                  <span style={{ float: "right" }}>
                    {activeIndex === index ? "-" : "+"}
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                    display: activeIndex === index ? "block" : "none",
                  }}
                >
                  <Grid container spacing={2} sx={{ padding: "10px" }}>
                    {dataItem.allpages_name.map((pageItem) => (
                      <Grid key={pageItem._id} item xs={12} md={6} lg={4}>
                        <Link to={`https://www.instagram.com/${pageItem.name}`} target='_blank'>
                          <List
                            sx={{ width: "100%", bgcolor: "background.paper" }}
                          >
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <ImageIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={`${formatString(pageItem?.name) } - ${formatString(pageItem?.page_category_name)}`} 
                                secondary={DateISOtoNormal(pageItem.createdAt)}
                              />
                            </ListItem>
                          </List>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </div>
            ))
          )}
        </div>
      </Box>
    </div>
  );
};

export default PageClosedByDetails;
