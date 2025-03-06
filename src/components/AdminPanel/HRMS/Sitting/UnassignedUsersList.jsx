import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";

const UnassignedUsersList = ({ unassignedUsersList = [], onUserSelect }) => {
  const [checkUser, setCheckUser] = useState([]);

  // Remove duplicate users based on user_id
  const uniqueUsers = Array.from(
    new Map(unassignedUsersList.map((user) => [user.user_id, user])).values()
  );

  // Function to handle checkbox selection
  const handleCheckboxChange = (user) => {
    setCheckUser((prevCheckUser) => {
      const isSelected = prevCheckUser.some((u) => u.user_id === user.user_id);
      const updatedUsers = isSelected
        ? prevCheckUser.filter((u) => u.user_id !== user.user_id) // Remove if already selected
        : [...prevCheckUser, user]; // Add if not selected

      onUserSelect(updatedUsers); // Update parent component
      return updatedUsers;
    });
  };

  // Sort users: Selected users appear at the top
  const sortedUsers = uniqueUsers
    .filter((d) => d.user_id && d.employee) // Ensure valid data
    .sort((a, b) => {
      const isASelected = checkUser.some((u) => u.user_id === a.user_id);
      const isBSelected = checkUser.some((u) => u.user_id === b.user_id);
      return isBSelected - isASelected; // Move selected to top
    });

  const columns = [
    {
      field: "select",
      headerName: "Select",
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={checkUser.some((u) => u.user_id === params.row.user_id)}
          onChange={() => handleCheckboxChange(params.row)}
        />
      ),
    },
    { field: "employee", headerName: "Employee", width: 160 },
    { field: "roomName", headerName: "Room Name", width: 170 },
    {
      field: "shift_id",
      headerName: "Shift",
      width: 120,
      renderCell: (params) =>
        params.value === 1 ? "Day Shift" : "Night Shift",
    },
  ];

  return (
    <div>
      <h3 className="mt-3 mb-2">Recent Unassigned Users</h3>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={sortedUsers}
          columns={columns}
          getRowId={(row) => row.user_id} // Ensure unique IDs
          pageSize={5}
          checkboxSelection={false} // Using custom checkboxes
        />
      </div>
    </div>
  );
};

export default UnassignedUsersList;
