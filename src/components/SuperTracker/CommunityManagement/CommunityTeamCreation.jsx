import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, useContext } from "react";
import { ApiContextData } from "../../AdminPanel/APIContext/APIContext";
import {
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
// import LogoLoader from "../../InstaApi.jsx/LogoLoader";
import EditIcon from "@mui/icons-material/Edit";
import  formatString  from "../../../utils/formatString";
import SaveIcon from '@mui/icons-material/Save';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function CommunityTeamCreation({
  openTeam,
  setOpenTeam,
  rowSelectionModel,
  setRowSelectionModel,
  left,
  right,
  setRight,
  setLeft,
  selectedManager,
  setSelectedManager,
  userNumbers,
  setUserNumbers,
  reload,
  setReload,
  editShowMode,
  setRows,teamDetail
}) {
  const { userContextData } = useContext(ApiContextData);
  const [checked, setChecked] = useState([]);
  const [teamCreated, setTeamCreated] = useState(false);
  const [managerSalary, setManagerSalary] = useState("");
  const [editView, setEditView] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editingValues, setEditingValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    // const filteredUsers = userContextData?.filter((user) => user.dept_id === 62);
    setLeft(userContextData);
  }, [userContextData]);

  const handleClickOpen = () => {
    setOpenTeam(true);
  };

  const handleClose = () => {
    setOpenTeam(false);
    setRight([]);
    setSelectedManager(null);
    setUserNumbers({});
    setRowSelectionModel([]);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleManagerToggle = (value) => () => {
    setSelectedManager(value);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAddManager = async () => {
    if (right.length === 0) {
      alert("Please select at least one user");
      return;
    }
    setLoading(true);
    let userDetailsCopy = { ...userDetails };

    for (const user of right) {
      try {
        const response = await axios.get(
          `https://insights.ist:8080/api/v1/community/community_user_records_by_id/${user.user_id}`
        );
        userDetailsCopy[user.user_id] = response.data.data;
        // Calculate total cost_of_running from existing records
        const totalCostOfRunning = response.data.data.reduce((sum, detail) => sum + detail.cost_of_running, 0);
        // Initialize userNumbers with default value of 100 minus totalCostOfRunning if not already set
        if (!userNumbers[user.user_id]) {
          setUserNumbers((prev) => ({ ...prev, [user.user_id]: 100 - totalCostOfRunning }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Error fetching user details. Please try again.");
      }
    }

    setUserDetails(userDetailsCopy);
    setTeamCreated(true);
    setLoading(false);
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 100) {
      setManagerSalary(value);
    }
  };

  const handleNumberChange = (userId) => (event) => {
    let value = event.target.value;
    if (value === "" || (value >= 0 && value <= 100)) {
      setUserNumbers({
        ...userNumbers,
        [userId]: value,
      });
    }
  };

  const handleEditToggle = (userId, length) => {
    setEditMode((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));

    setEditingValues((prevState) => {
      const newValues = { ...prevState };
      for (let i = 0; i < length; i++) {
        newValues[`${userId}-${i}`] = userDetails[userId][i].cost_of_running;
      }
      return newValues;
    });
  };
  // console.log(editMode,"editMode[value.user_id]")
  const handleEditingChange = (userId, index) => (event) => {
    setEditingValues({
      ...editingValues,
      [`${userId}-${index}`]: event.target.value,
    });
  };

  const handleSave = async (userId, index, detailId) => {
    const newValue = parseFloat(editingValues[`${userId}-${index}`]);

    // Calculate the total sum of cost_of_running including the new value
    const totalCostOfRunning = userDetails[userId].reduce((sum, detail, i) => {
      return sum + (i === index ? newValue : detail.cost_of_running);
    }, 0);

    if (totalCostOfRunning > 100) {
      alert(
        "The total cost of running for this user exceeds 100%. Please adjust the values."
      );
      return;
    }
    setLoading(true);

    try {
      await axios.put(
        "https://insights.ist:8080/api/v1/community/community_user",
        {
          user_id: userId,
          page_name: userDetails[userId][index].page_name,
          cost_of_running: newValue,
          _id: detailId,
        }
      );

      // Update local state with new value
      const updatedUserDetails = { ...userDetails };
      updatedUserDetails[userId][index].cost_of_running = newValue;
      setUserDetails(updatedUserDetails);

      // Exit edit mode
      setEditMode((prevState) => ({
        ...prevState,
        [userId]: false,
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error updating cost of running:", error);
    }
  };

  const filteredLeft = left.filter((user) =>
    user.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const [expanded, setExpanded] = useState({});

  const handleAccordionToggle = (userId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [userId]: !prevExpanded[userId],
    }));
  };

  // console.log(teamDetail,"teamDetail")
  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0 || teamCreated}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={
          !teamCreated && editView == null
            ? title
            : teamCreated && editView == false
            ? "COR"
            : teamCreated && editView
            ? "Add User COR %"
            : "COR"
        }
        subheader={
          teamCreated ? (
            <></>
          ) : (
            `${numberOfChecked(items)}/${items.length} selected`
          )
        }
      />
      <Divider />
      <List
        sx={{
          width: teamCreated ? 600 : 200,
          height: teamCreated ? 400 : 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.user_id}-label`;

          // Calculate the sum of cost_of_running values
          const totalCostOfRunning = userDetails[value.user_id]
            ? userDetails[value.user_id].reduce(
                (sum, detail) => sum + detail.cost_of_running,
                0
              )
            : 0;

          return (
            <div key={value.user_id}>
              <Stack direction="row">
                <ListItemButton
                  role="listitem"
                  onClick={
                    teamCreated
                      ? handleManagerToggle(value)
                      : handleToggle(value)
                  }
                  selected={teamCreated && selectedManager === value}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={
                        teamCreated
                          ? selectedManager === value
                          : checked.indexOf(value) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      disabled={teamCreated}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.user_name} />
                 
                </ListItemButton>
                {teamCreated && (
                  <TextField
                    required
                    id="standard-required"
                    value={userNumbers[value.user_id] || 100 - totalCostOfRunning} // Set default value to 100 - totalCostOfRunning if not already set
                    onChange={handleNumberChange(value.user_id)}
                    sx={{ width: 100, m: 1 }}
                    inputProps={{
                      min: 0,
                      max: 100 - totalCostOfRunning,
                    }}
                  />
                )}
              </Stack>
              {teamCreated && userDetails[value.user_id] && (
                <>
               
                <Accordion 
                  expanded={true}
                  onChange={() => handleAccordionToggle(value.user_id)}
                >
                {/* <Accordion > */}
               
                 
                  <AccordionSummary >
                  {/* <AccordionSummary expandIcon={<ExpandMoreIcon />}> */}
                    <Typography>
                      {value.user_name}'s Other Page Details
                    </Typography>
                   
                    {!editMode[value.user_id] ? <EditIcon
                      sx={{ ml: 2 }}
                      onClick={() =>
                        handleEditToggle(
                          value.user_id,
                          userDetails[value.user_id].length
                        )
                      }
                    />:
                    <SaveIcon
                      sx={{ ml: 2 }}
                      onClick={() =>
                        handleEditToggle(
                          value.user_id,
                          userDetails[value.user_id].length
                        )
                      }
                    />}
                   
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Page Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Cost of Running</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userDetails[value.user_id].map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.page_name}</TableCell>
                              <TableCell>Editor</TableCell>
                              <TableCell>
                                {editMode[value.user_id] ? (
                                  <TextField
                                    required
                                    id="standard-required"
                                    value={
                                      editingValues[`${value.user_id}-${index}`]
                                    }
                                    onChange={handleEditingChange(
                                      value.user_id,
                                      index
                                    )}
                                    sx={{ width: 100 }}
                                    inputProps={{
                                      min: 0,
                                      max: 100,
                                    }}
                                  />
                                ) : (
                                  <Typography>
                                    {detail.cost_of_running}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {editMode[value.user_id] && (
                                  <Button
                                    onClick={() =>
                                      handleSave(
                                        value.user_id,
                                        index,
                                        detail._id
                                      )
                                    }
                                  >
                                    Save
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
                </>
              )}
            </div>
          );
        })}
      </List>
    </Card>
  );

  const handleSubmit = () => {
    if (selectedManager === null) {
      alert("Please select the Manager.");
      return;
    }

    const pageName = rowSelectionModel[0].toLowerCase();

    for (let user of right) {
      if (!userNumbers[user.user_id]) {
        alert(`Please provide the COR for ${user.user_name}`);
        return;
      }
    }
    // Validate if each user has a salary defined
    for (let user of right) {
      if (!user.salary) {
        alert(
          `Salary information is missing for ${user.user_name}. Please provide the salary.`
        );
        return;
      }
    }
    // Validate the total cost of running for each user
    for (let user of right) {
      const userId = user.user_id;
      const newCostOfRunning = parseFloat(userNumbers[userId]);
      const totalCostOfRunning =
        userDetails[userId].reduce(
          (sum, detail) => sum + detail.cost_of_running,
          0
        ) + newCostOfRunning;

      if (totalCostOfRunning > 100) {
        alert(
          `The total cost of running for ${user.user_name} exceeds 100%. Please adjust the values.`
        );
        return;
      }
    }

    setLoading(true);

    const tempusers = right.map((user) => {
      const role = user === selectedManager ? 1 : 3;
      let cost_of_running = parseFloat(userNumbers[user.user_id]);

      return {
        user_id: user.user_id,
        page_name: pageName,
        report_to: selectedManager.user_id,
        role,
        cost_of_running,
        salary: user?.salary,
      };
    });
    const payload = {
      page_name: pageName,
      team_count: right.length,
      cost_of_running: tempusers
        .reduce(
          (total, user) => total + (user.cost_of_running * user.salary) / 100,
          0
        )
        .toFixed(2),
      no_of_hierarchy: 2,
      users: tempusers,
    };

    axios
      .post("https://insights.ist:8080/api/v1/community/team", payload)
      .then((response) => {
        alert("Team created successfully");
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        alert(
          "Team creation unsuccessful. Please check if the team is already created or there are other issues."
        );
      });
    handleClose();
    setRowSelectionModel([]);
    setLoading(false);
    setReload(!reload);
  };

  const handleUpdateTeam = () => {
    if (selectedManager === null) {
      alert("Please select the Manager.");
      return;
    }
    const pageName = rowSelectionModel[0].toLowerCase();

    for (let user of right) {
      if (!userNumbers[user.user_id]) {
        alert(`Please provide the COR for ${user.user_name}`);
        return;
      }
    }
    for (let user of right) {
      if (!user.salary) {
        alert(
          `Salary information is missing for ${user.user_name}. Please provide the salary.`
        );
        return;
      }
    }
    for (let user of right) {
      const userId = user.user_id;
      const newCostOfRunning = parseFloat(userNumbers[userId]);
      if (user.user_name.toLowerCase() !== pageName.toLowerCase()) {
        continue;
      }

      const totalCostOfRunning =
        userDetails[userId].reduce(
          (sum, detail) => sum + detail.cost_of_running,
          0
        ) + newCostOfRunning;

      if (totalCostOfRunning > 100) {
        alert(
          `The total cost of running for ${user.user_name} exceeds 100%. Please adjust the values.`
        );
        return;
      }
    }

    setLoading(true);

    const tempusers = right.map((user) => {
      const role = user === selectedManager ? 1 : 3;
      let cost_of_running = parseFloat(userNumbers[user.user_id]);

      return {
        user_id: user.user_id,
        page_name: pageName,
        report_to: selectedManager.user_id,
        role,
        cost_of_running,
        salary: user?.salary,
      };
    });
// console.log(right,"right")
    const payload = {
      page_name: pageName,
      team_count: right.length,
      cost_of_running: tempusers
        .reduce(
          (total, user) => total + (user.cost_of_running * user.salary) / 100,
          0
        )
        .toFixed(2),
      no_of_hierarchy: 2,
      users: tempusers,
      _id: teamDetail?._id,
    };

    axios
      .put("https://insights.ist:8080/api/v1/community/team", payload)
      .then((response) => {
        if (response.data.success) {
          alert("Team Updated successfully");
          setReload(!reload);
        } else {
          alert("Team Updated unsuccessfull please check again.");
        }
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        alert(
          "Team creation unsuccessful. Please check if the team is already created or there are other issues."
        );
      });
    setRowSelectionModel([]);
    setLoading(false);
    setRows([]);
    handleClose();
  };

  const handleEdit = () => {
    setTeamCreated(false);
    setEditView(true);
  };

  return (
    <>
      <Dialog
        open={openTeam}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack direction="row">
            {`Create Team for ${formatString(rowSelectionModel[0])}`}
            {!teamCreated && (
              <TextField
                label="Search Users"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              {!teamCreated && (
                <Grid item>{customList("Users", filteredLeft)}</Grid>
              )}
              {!teamCreated && (
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                  </Grid>
                </Grid>
              )}
              <Grid item>{customList("Chosen Team", right)}</Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {teamCreated && editView == null && (
            <Button onClick={() => setTeamCreated(false)} autoFocus>
              Back
            </Button>
          )}
          {teamCreated && editView === false && (
            <Button onClick={handleEdit} autoFocus>
              Edit
            </Button>
          )}
          {!editShowMode && teamCreated && (
            <Button onClick={handleSubmit} autoFocus>
              Save Team
            </Button>
          )}
          {editShowMode && teamCreated && (
            <Button onClick={handleUpdateTeam} autoFocus>
              Update Team
            </Button>
          )}
          {teamCreated && !editView ? (
            <></>
          ) : (
            <Button onClick={handleAddManager} autoFocus>
              Add Manager
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {loading && <Skeleton />}
    </>
  );
}
