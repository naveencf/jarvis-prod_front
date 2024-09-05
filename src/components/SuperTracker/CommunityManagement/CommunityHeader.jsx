import {
  Autocomplete,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { formatNumber } from "../../../utils/formatNumber";
import axios from "axios";
import AddProjectxpageCategory from "./AddProjectxpageCategory";

function CommunityHeader({
  rows,
  setRows,
  allRows,
  pagecategory,
  rowSelectionModel,
  projectxpages,
  reload,
  setReload,
  reloadpagecategory,
  setReloadpagecategory,
}) {
  const [teamCreated, setTeamCreated] = useState({ totalCor: 0, teamCount: 0 });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPageCategory, setFilteredPageCategory] = useState(null);

  useEffect(() => {
    if (allRows.length > 0) {
      const result = processRecords(allRows);
      setTeamCreated(result);
      setFilteredPageCategory(result?.categoryCounts);
    }
  }, [allRows]);

  const processRecords = (rows) => {
    let totalCor = 0;
    let teamCount = 0;
    let totalPaidPost = 0;
    let categoryCounts = {};

    rows.forEach((record) => {
      // Calculate total cost of running (totalCor)
      if (record.teamInfo?.team?.cost_of_running) {
        totalCor += record.teamInfo.team.cost_of_running;

        // Increment team count if there is a team count greater than 0
        if (record.teamInfo.team.team_count > 0) {
          teamCount++;
        }
      }

      // Calculate total paid posts (totalPaidPost)
      if (record.paidPosts?.count > 0) {
        totalPaidPost += record.paidPosts.count;
      }

      // Group by category ID and count the records
      const categoryId = record.projectxRecord?.pageCategoryId;
      if (categoryId) {
        if (!categoryCounts[categoryId]) {
          categoryCounts[categoryId] = 0;
        }
        categoryCounts[categoryId]++;
      }
    });

    return {
      totalCor: totalCor,
      teamCount: teamCount,
      totalPaidPost: totalPaidPost,
      categoryCounts: categoryCounts,
    };
  };

  const handleAllTeam = () => {
    setRows(allRows);
  };
  const handlePendingTeam = () => {
    const pendingTeam = allRows.filter(
      (record) => !record.teamInfo.team.cost_of_running
    );
    setRows(pendingTeam);
  };
  const handleCreatedTeam = () => {
    const createdTeam = allRows.filter(
      (record) => record.teamInfo.team.team_count > 0
    );
    setRows(createdTeam);
  };

  const handleCategoryChange = (event, value) => {
    if (value) {
      const selectedCategoryObject = pagecategory.find(
        (category) =>
          `${category.category_name} - (${filteredPageCategory[category.category_id] || 0})` === value ||
          category.category_name.toLowerCase() === value.toLowerCase()
      );

      if (selectedCategoryObject) {
        const filteredRows = allRows.filter(
          (record) =>
            record.projectxRecord?.pageCategoryId === selectedCategoryObject.category_id
        );

        // Only set filtered rows if rowSelectionModel is empty
        if (rowSelectionModel.length === 0) {
          setRows(filteredRows);
        }
        setSelectedCategory(selectedCategoryObject);
      }
    } else {
      handleCategoryClear();
    }
  };

  const handleCategoryClear = () => {
    setSelectedCategory(null);
    setRows(allRows);
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory == null) {
      alert("Please select category first");
    }

    // Assuming rowSelectionModel contains the selected page names
    const selectedPageNames = rowSelectionModel; // Replace with your actual rowSelectionModel array

    // Filter the projectxpages array to get the pages that need to be updated
    const pagesToUpdate = projectxpages.filter((page) =>
      selectedPageNames.includes(page.page_name)
    );

    // Loop through the filtered pages and make API calls to update them
    for (const page of pagesToUpdate) {
      try {
        const response = await axios.put(
          `https://insights.ist:8080/api/projectxupdate`,
          {
            id: page.id,
            page_category_id: selectedCategory.category_id,
          }
        );
      } catch (error) {
        console.error(`Failed to update page ${page.page_name}`, error);
        alert("There is some error while updating category");
      }
    }
    setReload(!reload);
    alert("Please check the update Category");
  };

  const options =
    rowSelectionModel.length === 0
      ? Object.entries(filteredPageCategory || {})
          .map(([key, count]) => {
            const category = pagecategory.find(
              (pc) => pc.category_id === parseInt(key)
            );
            return category ? `${category.category_name} - (${count})` : null;
          })
          .filter((name) => name !== null)
      : pagecategory.map((ele) => ele.category_name);

  return (
    <Stack direction="row" justifyContent="space-evenly" sx={{ mt: 2 }}>
      <Badge badgeContent={allRows.length} color="secondary">
        <Button onClick={handleAllTeam} variant="outlined">
          All 
        </Button>
      </Badge>
      <Badge badgeContent={teamCreated?.teamCount} color="success">
        <Button onClick={handleCreatedTeam} variant="outlined">
           Created
        </Button>
      </Badge>
      <Badge
        badgeContent={allRows.length - teamCreated?.teamCount}
        color="error"
      >
        <Button onClick={handlePendingTeam} variant="outlined">
           Pending
        </Button>
      </Badge>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        // options={pagecategory.map((ele) => ele.category_name)}
        sx={{ width: 200 }}
        // onClear={handleCategoryClear}
        onInputChange={handleCategoryChange}
        renderInput={(params) => (
          <TextField size="small" {...params} label="Category" />
        )}
      />

      <AddProjectxpageCategory
        setReloadpagecategory={setReloadpagecategory}
        reloadpagecategory={reloadpagecategory}
      />
      {teamCreated?.totalCor > 0 && (
        <Chip
          sx={{ mt: 1 }}
          label={`COR : ${formatNumber(teamCreated?.totalCor)}`}
        />
      )}
      {teamCreated?.totalPaidPost > 0 && (
        <Chip
          sx={{ mt: 1 }}
          label={`Paid-Post : ${formatNumber(teamCreated?.totalPaidPost)}`}
        />
      )}
      {rowSelectionModel.length > 0 && (
        <Button onClick={handleUpdateCategory} variant="outlined">
          Update-Category
        </Button>
      )}
    </Stack>
  );
}

export default CommunityHeader;
