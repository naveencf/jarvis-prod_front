import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginHistoryChart from "./LoginHistoryChart";
import View from "../../../../Sales/Account/View/View";
import { baseUrl } from "../../../../../../utils/config";
const UserLoginHistory = () => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]); // Store full API data
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false); // Control modal visibility
  const [startDate, setStartDate] = useState(""); // Start Date State
  const [endDate, setEndDate] = useState(""); // End Date State
  const [loginChartData, setLoginChartData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}get_login_user_data`);
      processUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching login data:", error);
    }
  };
  const fetchDataWithDate = async () => {
    try {
      // Get today's date
      const endDates = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      // Get the date 7 days before today
      const startDates = new Date();
      startDates.setDate(startDates.getDate() - 7); // Subtract 7 days
      const formattedStartDate = startDates.toISOString().split("T")[0]; // YYYY-MM-DD
      // API request
      const response = await axios.post(
        `${baseUrl}get_login_user_data_with_date`,
        {
          start_date: startDate || formattedStartDate,
          end_date: endDate || endDates,
        }
      );
      setLoginChartData(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };
  // Call the function on component mount
  useEffect(() => {
    fetchDataWithDate();
  }, []);
  const processUserData = (fetchedData) => {
    setRawData(fetchedData); // Store original data
    // Group data by user_id and count occurrences
    const groupedData = fetchedData.reduce((acc, curr) => {
      if (acc[curr.user_id]) {
        acc[curr.user_id].count += 1;
      } else {
        acc[curr.user_id] = { ...curr, count: 1 };
      }
      return acc;
    }, {});
    setData(Object.values(groupedData));
  };
  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };
  const Columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "name",
      name: "EMPLOYEE NAME",
      width: 100,
    },
    {
      key: "department_name",
      name: "DEPARTMENT",
      width: 100,
    },
    {
      key: "designation_name",
      name: "JOB TITLE",
      width: 100,
    },
    {
      key: "count",
      name: "LOGIN COUNT",
      width: 100,
      renderRowCell: (row) => (
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => handleUserClick(row.user_id)}
        >
          {row.count}
        </span>
      ),
    },
    {
      key: "login_source",
      name: "Login SOURCE",
      width: 100,
    },
    {
      key: "browser_info",
      name: "BROWSER INFO",
      width: 100,
    },
    {
      key: "device_vendor",
      name: "DEVICE VENDOR",
      width: 100,
    },
    {
      key: "ip_address",
      name: "IP ADDRESS",
      width: 100,
    },
    {
      key: "os_info",
      name: "OS INFO",
      width: 100,
    },
    {
      key: "login_date",
      name: "LOGIN DATE",
      renderRowCell: (row) => row.login_time.split(" ")[0],
      width: 100,
    },
    {
      key: "login_time",
      name: "LOGIN TIME",
      renderRowCell: (row) => row.login_time.split(" ")[1],
      width: 100,
    },
    {
      key: "current_location",
      name: "CURRENT LOCATION",
      width: 100,
    },
  ];
  // Filter login history for selected user
  const selectedUserData = rawData.filter(
    (item) => item.user_id === selectedUser
  );
  const handleFilter = () => {
    if (!startDate) {
      alert("Please select a date.");
      return;
    }
    // Filter rawData based on selected date
    const filteredData = rawData.filter((item) => {
      const loginDate = item.login_time.split(" ")[0]; // Extract login date (YYYY-MM-DD)
      return loginDate === startDate; // Match with selected date
    });
    // Group data by user_id and count occurrences
    const groupedData = filteredData.reduce((acc, curr) => {
      if (acc[curr.user_id]) {
        acc[curr.user_id].count += 1; // Increment login count
      } else {
        acc[curr.user_id] = { ...curr, count: 1 }; // Store user data with count
      }
      return acc;
    }, {});
    setData(Object.values(groupedData)); // Update table data with grouped values
  };
  return (
    <>
      {/* Date Inputs and Filter Button */}
      <div className="card p-3">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchDataWithDate}
          >
            Filter
          </Button>
        </Box>
        <LoginHistoryChart loginChartData={loginChartData} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            label="Date Wise Filter"
            type="date"
            sx={{ width: "300px" }}
            InputLabelProps={{ shrink: true }}
            value={startDate} // Use startDate as the single date filter
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Filter
          </Button>
        </Box>
        {/* Data Table */}
        <View
          columns={Columns}
          data={data}
          title={""}
          pagination={[100, 200]}
          tableName={""}
        />
      </div>
      {/* MUI Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 600, // Fixed height
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Login Details
          </Typography>
          {/* Scrollable Content Wrapper */}
          <Box sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
            {selectedUserData.length > 0 ? (
              selectedUserData.map((login, index) => (
                <Card key={index} sx={{ p: 2, mb: 1, bgcolor: "#F5F5F5" }}>
                  <Typography variant="subtitle1">
                    <strong>{login.name}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Login Time: {login.login_time}
                  </Typography>
                </Card>
              ))
            ) : (
              <Typography>No login records found.</Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default UserLoginHistory;