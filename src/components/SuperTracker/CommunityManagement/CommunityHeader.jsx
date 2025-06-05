import { Autocomplete, Button, Chip, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { formatNumber } from "../../../utils/formatNumber";
import axios from "axios";
import AddProjectxpageCategory from "./AddProjectxpageCategory";
import formatString from "../../../utils/formatString";
import { useProjectxUpdateMutation } from "../../Store/API/Community/CommunityInternalCatApi";

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
  communityInternalCats,
}) {
  const [teamCreated, setTeamCreated] = useState({ totalCor: 0, teamCount: 0 });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedInternalCategory, setSelectedInternalCategory] =
    useState(null);
  const [projectxUpdate, { isLoading, isError, isSuccess, data, error }] =
    useProjectxUpdateMutation();

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
      if (record.teamInfo?.team?.cost_of_running) {
        totalCor += record.teamInfo.team.cost_of_running;
        if (record.teamInfo.team.team_count > 0) {
          teamCount++;
        }
      }

      if (record.paidPosts?.count > 0) {
        totalPaidPost += record.paidPosts.count;
      }

      const categoryId = record.projectxRecord?.pageCategoryId;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      }
    });

    return {
      totalCor,
      teamCount,
      totalPaidPost,
      categoryCounts,
    };
  };

  const getInternalCategoryCounts = () => {
    const counts = {};
    allRows?.forEach((record) => {
      const internalId = record.projectxRecord?.pageInternalCategoryId;
      if (internalId) {
        counts[internalId] = (counts[internalId] || 0) + 1;
      }
    });
    return counts;
  };

  const handleAllTeam = () => setRows(allRows);

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
  const handleUpdateInternalCategory = async () => {
    if (selectedInternalCategory == null) {
      alert("Please select an internal category first.");
      return;
    }
  
    const selectedInternalCatId =
      selectedInternalCategory._id || selectedInternalCategory;
    const selectedPageNames = rowSelectionModel;
    const pagesToUpdate = projectxpages.filter((page) =>
      selectedPageNames.includes(page.page_name)
    );
  
    let allSucceeded = true;
  
    for (const page of pagesToUpdate) {
      try {
        const response = await projectxUpdate({
          body: {
            id: page.id,
            page_internal_category_id: selectedInternalCatId,
          },
        }).unwrap();  
  
        if (!response?.success) {
          allSucceeded = false;
          console.error(`Server returned error for ${page.page_name}`, response);
        }
      } catch (error) {
        console.error(
          `Failed to update internal category for ${page.page_name}`,
          error
        );
        allSucceeded = false;
      }
    }
  
    if (allSucceeded) {
      setReload(!reload);
      alert("Internal Category Updated Successfully.");
    }
  };
  

  const handleCategoryChange = (event, value) => {
    if (value) {
      const selectedCategoryObject = pagecategory.find(
        (category) =>
          `${category.category_name} - (${
            filteredPageCategory[category.category_id] || 0
          })` === value ||
          category.category_name.toLowerCase() === value.toLowerCase()
      );

      if (selectedCategoryObject) {
        const filteredRows = allRows.filter(
          (record) =>
            record.projectxRecord?.pageCategoryId ===
            selectedCategoryObject.category_id
        );
        if (rowSelectionModel.length === 0) {
          setRows(filteredRows);
        }
        setSelectedCategory(selectedCategoryObject);
      }
    } else {
      setSelectedCategory(null);
      setRows(allRows);
    }
  };

  const handleInternalCategoryChange = (event, value) => {
    if (value) {
      const selected = communityInternalCats.find((cat) =>
        value.startsWith(formatString(cat.internal_category_name))
      );

      if (selected) {
        const filteredRows = allRows.filter(
          (record) =>
            record.projectxRecord?.pageInternalCategoryId === selected._id
        );

        if (rowSelectionModel.length === 0) {
          setRows(filteredRows);
        }

        setSelectedInternalCategory(selected);
      } else {
        setSelectedInternalCategory(null);
        setRows(allRows);
      }
    } else {
      setSelectedInternalCategory(null);
      setRows(allRows);
    }
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory == null) {
      alert("Please select category first");
      return;
    }

    const selectedPageNames = rowSelectionModel;
    const pagesToUpdate = projectxpages.filter((page) =>
      selectedPageNames.includes(page.page_name)
    );

    for (const page of pagesToUpdate) {
      try {
        await axios.put(`https://insights.ist:8080/api/projectxupdate`, {
          id: page.id,
          page_category_id: selectedCategory.category_id,
        });
      } catch (error) {
        console.error(`Failed to update page ${page.page_name}`, error);
        alert("There is some error while updating category");
      }
    }
    setReload(!reload);
    alert("Please check the update Category");
  };

  const categoryOptions =
    rowSelectionModel.length === 0
      ? Object.entries(filteredPageCategory || {})
          .map(([key, count]) => {
            const category = pagecategory.find(
              (pc) => pc.category_id === parseInt(key)
            );
            return category ? `${category.category_name} - (${count})` : null;
          })
          .filter(Boolean)
      : pagecategory.map((ele) => ele.category_name);

  const internalCategoryCounts = getInternalCategoryCounts();

  const internalCategoryOptions = communityInternalCats.map((cat) => {
    const name = formatString(cat.internal_category_name);
    const count = internalCategoryCounts[cat._id] || 0;
    return `${name} - (${count})`;
  });
  return (
    <div className="flexCenterBetween w-100">
      <div className="flexCenter colGap8">
        <Button
          className="btn cmnbtn btn-outline-primary"
          onClick={handleAllTeam}
          variant="outlined"
        >
          <span className="badgeNum">{allRows.length}</span> All
        </Button>
        <Button
          className="btn cmnbtn btn-outline-success"
          onClick={handleCreatedTeam}
          variant="outlined"
        >
          <span className="badgeNum">{teamCreated?.teamCount}</span> Created
        </Button>
        <Button
          className="btn cmnbtn btn-outline-warning"
          onClick={handlePendingTeam}
          variant="outlined"
        >
          <span className="badgeNum">
            {allRows.length - teamCreated?.teamCount}
          </span>
          Pending
        </Button>
      </div>

      <div className="thm_form flexCenter colGap8">
        <Autocomplete
          disablePortal
          id="category-dropdown"
          options={categoryOptions}
          sx={{ width: 220 }}
          onChange={handleCategoryChange}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        <Autocomplete
          disablePortal
          id="internal-category-dropdown"
          options={internalCategoryOptions}
          sx={{ width: 240 }}
          onChange={handleInternalCategoryChange}
          renderInput={(params) => (
            <TextField {...params} label="Internal Category" />
          )}
        />

        <AddProjectxpageCategory
          setReloadpagecategory={setReloadpagecategory}
          reloadpagecategory={reloadpagecategory}
        />
      </div>

      <div className="flexCenter colGap8">
        {teamCreated?.totalCor > 0 && (
          <Chip label={`COR : ${formatNumber(teamCreated?.totalCor)}`} />
        )}
        {teamCreated?.totalPaidPost > 0 && (
          <Chip
            label={`Paid-Post : ${formatNumber(teamCreated?.totalPaidPost)}`}
          />
        )}
        {rowSelectionModel?.length > 0 && (
          <>
            <Button
              className="btn btn_sm cmnbtn btn-primary"
              onClick={handleUpdateCategory}
            >
              Update-Category
            </Button>
            <Button
              className="btn btn_sm cmnbtn btn-secondary"
              onClick={handleUpdateInternalCategory}
            >
              Update-Internal-Category
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default CommunityHeader;
