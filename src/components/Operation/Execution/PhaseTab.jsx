import React, { useEffect, useState } from "react";

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
}) => {
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
    if (virtualPhase.length >= visibleTabs.length) {
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
    if (virtualPhase.length >= visibleTabs.length) {
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

    // if (activeTabIndex > 0) {
    //   setActiveTabIndex((prev) => prev - 1);
    //   setActiveTab(virtualPhase[visibleTabs[activeTabIndex - 1]].value);
    // } else {
    //   setVisibleTabs((prev) => {
    //     const firstIndex = prev[0];
    //     if (firstIndex > 0) {
    //       return prev.map((index) => index - 1);
    //     }
    //     return prev;
    //   });
    //   setActiveTab(virtualPhase[visibleTabs[0] - 1].value);
    // }
  };

  function addAll() {
    if (phaseList.length <= 1) {
      return phaseList;
    }

    return [{ value: "all", label: "All" }].concat(phaseList);
  }

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
            .map((phase, index) => (
              <button
                key={phase.value}
                className={
                  activeTab === phase.value ? "active btn btn-primary" : "btn"
                }
                onClick={() => handleTabClick(phase, index)}
              >
                {phase.label}
              </button>
            ))}
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
    </div>
  );
};

function persistData(key, value) {
  const chachedData = JSON.parse(localStorage.getItem(key));
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
