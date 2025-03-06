import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Tabs, Tab } from "@mui/material";
import PhaseOverviewModal from "./PhaseOverviewModal";
import { all } from "axios";

const PhaseTab = ({
  phaseList,
  activeTab,
  setActiveTab,
  activeTabIndex,
  setActiveTabIndex,
  visibleTabs,
  setVisibleTabs,
  maxTabs,
  selectedPlan,
  PlanData,
}) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [activeTabData, setActiveTabData] = useState(0);
  const [shortCodeCount, setShortCodeCount] = useState({});
  const [usernameCount, setUsernameCount] = useState({});

  const handleOpen = (filteredData) => {
    setModalData(filteredData);
    setUsernameCount(getShortCodeCountByUsername(filteredData));
    setShortCodeCount(getUniqueShortCodesByPlatform(filteredData));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setActiveTabData(newValue);
  };

  const handleTabClick = (phase, index) => {
    setActiveTab(phase.value);
    setActiveTabIndex(index);
    persistData("tab", {
      [selectedPlan]: {
        activeTab: phase.value,
        activeTabIndex: index,
      },
    });
  };

  const handleNext = () => {
    const virtualPhase = addAll();
    if (virtualPhase.length > visibleTabs.length) {
      setVisibleTabs((prev) => {
        const lastIndex = prev[prev.length - 1];
        if (lastIndex < virtualPhase.length - 1) {
          return prev.map((index) => index + maxTabs.current);
        }
        return prev;
      });
      setActiveTabIndex(0);
      setActiveTab(virtualPhase[visibleTabs[visibleTabs.length - 1] + 1].value);
      persistData("tab", {
        [selectedPlan]: {
          activeTab:
            virtualPhase[visibleTabs[visibleTabs.length - 1] + 1].value,
          activeTabIndex: 0,
        },
      });
    } else {
      setActiveTabIndex((prev) => {
        return prev + 1;
      });
      setActiveTab(virtualPhase[activeTabIndex + 1].value);
      persistData("tab", {
        [selectedPlan]: {
          activeTab: virtualPhase[activeTabIndex + 1].value,
          activeTabIndex: activeTabIndex + 1,
        },
      });
    }
  };

  const handlePrevious = () => {
    const virtualPhase = addAll();
    if (virtualPhase.length > visibleTabs.length) {
      setVisibleTabs((prev) => {
        const firstIndex = prev[0];
        if (firstIndex > 0) {
          return prev.map((index) => index - maxTabs.current);
        }
        return prev;
      });
      setActiveTabIndex(0);
      setActiveTab(virtualPhase[visibleTabs[0] - 1].value);
      persistData("tab", {
        [selectedPlan]: {
          activeTab: virtualPhase[visibleTabs[0] - 1].value,
          activeTabIndex: 0,
        },
      });
    } else {
      setActiveTabIndex((prev) => {
        return prev - 1;
      });
      setActiveTab(virtualPhase[visibleTabs[activeTabIndex - 1]].value);
      persistData("tab", {
        [selectedPlan]: {
          activeTab: virtualPhase[visibleTabs[activeTabIndex - 1]].value,
          activeTabIndex: activeTabIndex - 1,
        },
      });
    }
  };

  function addAll() {
    if (phaseList.length <= 1) {
      return phaseList;
    }
    return [{ value: "all", label: "All" }].concat(phaseList);
  }

  // const getShortCodeCountByPlatform = (data) => {
  //   const shortCode = data?.shortCode || "N/A";

  //   return data.reduce((acc, item) => {
  //     const platform = item.platform_name;
  //     if (!acc[platform]) {
  //       acc[platform] = 0;
  //     }
  //     acc[platform] += 1;
  //     return acc;
  //   }, {});
  // };
  const getUniqueShortCodesByPlatform = (data) => {
    return data.reduce((acc, item) => {
      const platform = item.platform_name || "Unknown";
      const shortCode = item.shortCode || "N/A";

      if (!acc[platform]) {
        acc[platform] = [];
      }

      // Add only unique shortcodes to the array
      if (!acc[platform].includes(shortCode)) {
        acc[platform].push(shortCode);
      }

      return acc;
    }, {});
  };

  const getShortCodeCountByUsername = (data) => {
    return data.reduce((acc, item) => {
      const user = item?.owner_info?.username || "Unknown";
      const shortCode = item?.shortCode || "N/A";

      if (!acc[user]) {
        acc[user] = { count: 0, shortCodes: [] };
      }

      acc[user].count += 1;
      acc[user].shortCodes.push(shortCode);

      return acc;
    }, {});
  };

  return (
    <div className="tabs-container tabslide">
      <div className="navigation">
        {phaseList.length > 1 && (
          <button
            className="prev-arrow arrow-btn btn"
            onClick={handlePrevious}
            disabled={
              activeTab === "all" ||
              (activeTabIndex === 0 && visibleTabs[0] === 0)
            }
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        )}
        <div className="tabs">
          {addAll()
            .filter((_, index) => visibleTabs.includes(index))
            .map((phase, index) => {
              const filteredData = PlanData?.filter((data) =>
                phase.value === "all" ? true : data.phaseDate === phase.value
              );

              return (
                <button
                  key={phase.value}
                  className={
                    activeTab === phase.value ? "active btn btn-primary" : "btn"
                  }
                  onClick={() => handleTabClick(phase, index)}
                >
                  {phase.label ? phase.label : "service"}
                  <button
                    className="ml-2 px-2 py-1 border border-secondary rounded-pill "
                    onClick={() => handleOpen(filteredData)}
                  >
                    {filteredData?.length}
                  </button>
                </button>
              );
            })}
        </div>

        {phaseList.length > 1 && (
          <button
            className="next-arrow arrow-btn btn"
            onClick={handleNext}
            disabled={
              activeTab === phaseList[phaseList.length - 1].value ||
              (phaseList.length >= maxTabs.current &&
                visibleTabs[visibleTabs.length - 1] >= phaseList.length)
            }
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>

      <PhaseOverviewModal
        open={open}
        handleClose={handleClose}
        activeTabData={activeTabData}
        handleTabChange={handleTabChange}
        shortCodeCount={shortCodeCount}
        usernameCount={usernameCount}
        PlanData={PlanData}
      />
    </div>
  );
};

function persistData(key, value) {
  let chachedData = JSON.parse(localStorage.getItem(key));
  if (chachedData?.[key]) {
    chachedData = {
      ...chachedData,
      ...value,
    };
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export default PhaseTab;
