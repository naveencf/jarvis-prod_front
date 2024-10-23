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
  isWithinInterval,
} from "date-fns";
import { Box, Grid, Stack, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
// import { useGetAllPageClosebyListQuery } from "../../../Store/PageBaseURL";
import { AppContext } from "../../../../Context/Context";
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
import { baseUrl } from "../../../../utils/config";
import axios from "axios";

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
  const userID = decodedToken.id;

  // Set default start_date and end_date to the start and end of the current month
  const defaultStartDate = startOfMonth(new Date());
  const defaultEndDate = endOfDay(new Date());

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [bodyData, setBodyData] = useState({
    start_date: formatDate(defaultStartDate),
    end_date: formatDate(defaultEndDate),
  });

  // const {
  //   data: pageClosedbyList,
  //   refetch: refetchPageClosedbyList,
  //   isLoading: isPageListLoading,
  // } = useGetAllPageClosebyListQuery({ bodyData });

  // const pageData = pageClosedbyList?.data;
  const { usersDataContext } = useContext(AppContext);
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

  const handleIndex = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(index);
  };

  const filterData = () => {
    const { start, end } = getDateRange();
    return (
      pageData?.filter((item) => {
        const createdAt = new Date(item.createdAt); // Convert to Date object directly
        return isWithinInterval(createdAt, { start, end });
      }) || []
    );
  };

  // Group the filtered data by created_by
  const groupByCreatedBy = (filteredData) => {
    return filteredData.reduce((acc, item) => {
      const key = item.created_by;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  };

  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilterOption(newValue.value);
  };

  // useEffect(() => {
  //   // const filteredData = filterData();
  //   const groupedData = groupByCreatedBy(filteredData);
  //   setIndividualData(groupedData);
  // }, [filterOption, pageData, customStartDate, customEndDate]);

  useEffect(() => {
    const { start, end } = getDateRange();
    // setBodyData({
    //   start_date: start.toISOString().split('T')[0],
    //   end_date: end.toISOString().split('T')[0],
    // });
    axios
      .post(`${baseUrl}v1/get_page_count`, {
        start_date: start.toISOString().split("T")[0],
        end_date: end.toISOString().split("T")[0],
      })
      .then((res) => {
        setRows(res.data.data);
        setIndividualData(res.data.data);
        console.log(res.data.data);
      });
    setBodyData({
      start_date: "2024-09-30",
      end_date: "2024-10-22",
    });
  }, [filterOption, customStartDate, customEndDate]);

  const getUserName = (userId) => {
    const userName = usersDataContext?.find(
      (ele) => ele.user_id === userId
    )?.user_name;
    return userName;
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
          <h3 style={{ marginBottom: "10px" }}>
            Page Details Added By Individuals
          </h3>
          {individualData.length === 0 ? (
            <p>No data available</p>
          ) : (
            individualData.map((dataItem, index) => (
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
                  Created by User: {dataItem.user_name}
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
                        <Link to={`https://www.instagram.com/${pageItem.name}`  } target='_blank'>
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
                                primary={pageItem.name}
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
