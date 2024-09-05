import React, { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Button,
  Stack,
  Autocomplete,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SuperTrackerDialog from "./SuperTrackerDialog";
import { Link } from "react-router-dom";
import axios from "axios";
import { insightsBaseUrl } from "../../utils/config";

function SuperTrackerCreator({
  rowSelectionModel,
  setRowSelectionModel,
  rows,
  setRows,
  pages,
  setPages,
  operation,
  setOperation,
}) {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSuperTracker, setAllSuperTracker] = useState([]);
  const [selectedSuperTracker, setSelectedSuperTracker] = useState(null);

  useEffect(() => {
    axios
      .get(`${insightsBaseUrl}/api/v1/community/super_tracker`)
      .then((res) => {
        if (res.status === 200) {
          setAllSuperTracker(res.data.data);
        }
      });
  }, []);

  const handleSuperCreator = () => {
    if (rowSelectionModel.length === 0) {
      alert("Please select the Pages first");
      return;
    }

    let tempselectedRows = []; // Create an array to store the selected rows
    rowSelectionModel.forEach((selectedRowId) => {
      const foundRow = rows.find((row) => row._id === selectedRowId); // Find the row by ID
      if (foundRow) {
        tempselectedRows.push(foundRow); // Add the found row to the array
      }
    });
    setOpen(true);
    setSelectedRows(tempselectedRows);
  };

  const handleConfirm = () => {
    if (!selectedSuperTracker || !operation) {
      alert("Please select a super tracker and an operation");
      return;
    }
    setRowSelectionModel([]);
    axios
      .get(
        `${insightsBaseUrl}/api/v1/community/super_tracker_page_by_st/${selectedSuperTracker.st_id}`
      )
      .then((res) => {
        if (res.status === 200) {
          const superTrackerPages = res.data.data;

          // Create separate arrays for matched and unmatched pages
          const matchedPages = [];
          const unmatchedPages = [];

          const updatedRows = rows.map((row) => {
            const isSuperTrackerPage = superTrackerPages.find(
              (page) =>
                page.page_name?.toLowerCase() === row.page_name?.toLowerCase()
            );

            if (isSuperTrackerPage) {
              matchedPages.push(row);
            } else {
              unmatchedPages.push(row);
            }

            return { ...row, supertracker_page: isSuperTrackerPage ? 1 : 0 };
          });
          if (operation === "Add") {
            setRows(unmatchedPages);
          } else if (operation === "Remove") {
            setRows(matchedPages);
          }
        }
      });
  };

  const handlePageAddition = () => {
    if (rowSelectionModel.length == 0) {
      alert(
        `Please select page which you want to add in ${selectedSuperTracker?.st_name}`
      );
      return;
    }

    setConfirmationOpen(true);
  };

  const handlePageRemoval = () => {
    if (rowSelectionModel.length == 0) {
      alert(
        `Please select page which you want to remove from ${selectedSuperTracker?.st_name}`
      );
      return;
    }

    setConfirmationOpen(true);
  };
// console.log(rowSelectionModel,rowSelectionModel)
  const confirmAddition = () => {
    const promises = rowSelectionModel.map((pageName) => {
      return axios.post(
        `${insightsBaseUrl}/api/v1/community/super_tracker_page`,
        {
          st_id: selectedSuperTracker?.st_id,
          page_name: pageName,
        }
      );
    });

    Promise.all(promises)
      .then((responses) => {
        alert("Pages added successfully");
        setConfirmationOpen(false);
        // Optionally, refresh data or handle success in another way
      })
      .catch((error) => {
        console.error("Error adding pages:", error);
        alert("There was an error adding pages.");
        setConfirmationOpen(false);
      });
  };

  const confirmRemoval = () => {
    const promises = rowSelectionModel.map((pageName) => {
      return axios.post(
        `${insightsBaseUrl}/api/v1/community/remove_page_from_super_tracker`,
        {
          st_id: selectedSuperTracker?.st_id,
          page_name: pageName,
        }
      );
    });

    Promise.all(promises)
      .then((responses) => {
        alert("Pages removed successfully");
        setConfirmationOpen(false);
        // Optionally, refresh data or handle success in another way
      })
      .catch((error) => {
        console.error("Error removing pages:", error);
        alert("There was an error removing pages.");
        setConfirmationOpen(false);
      });
  };

  return (
    <Stack direction="row" spacing={2}>
      <Autocomplete
        sx={{ width: 200 }}
        options={allSuperTracker}
        getOptionLabel={(option) => option.st_name}
        onChange={(event, newValue) => {
          if (newValue == null) {
            setRows(pages);
            setOperation(null);
          }
          setSelectedSuperTracker(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Edit Super Tracker" />
        )}
      />

      {selectedSuperTracker ? (
        <>
          <Autocomplete
            options={["Add", "Remove"]}
            sx={{ width: 200 }}
            onChange={(event, newValue) => {
              setOperation(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Operation" />
            )}
          />
          <Button variant="outlined" onClick={handleConfirm}>
            Confirm
          </Button>
          {operation === "Remove" && (
            <Button variant="outlined" onClick={handlePageRemoval}>
              Remove-Page
            </Button>
          )}
          {operation === "Add" && (
            <Button variant="outlined" onClick={handlePageAddition}>
              Add-Page
            </Button>
          )}
        </>
      ) : (
        <>
          <Button variant="outlined" onClick={handleSuperCreator}>
            Create Super Tracker
          </Button>
          <SuperTrackerDialog
            open={open}
            setOpen={setOpen}
            selectedRows={selectedRows}
          />
          <Button variant="outlined">
            <Link to="/admin/instaapi/super_tracker/community">
              Community Management
            </Link>
          </Button>
        </>
      )}

      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          {operation === "Add" ? "Confirm Page Addition" : "Confirm Page Removal"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            {operation === "Add"
              ? `Are you sure you want to add the selected pages to ${selectedSuperTracker?.st_name}?`
              : `Are you sure you want to remove the selected pages from ${selectedSuperTracker?.st_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button
            onClick={operation === "Add" ? confirmAddition : confirmRemoval}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default SuperTrackerCreator;
