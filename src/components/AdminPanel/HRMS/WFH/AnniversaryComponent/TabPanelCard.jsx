import React, { useState } from "react";
// import NewAnniversary from "./NewAnniversary";
import NewJoineeTab from "./NewJoineeTab";
import NewBirthdayTab from "./NewBirthdayTab";

const TabPanelCard = ({ birthdays, workAnniversary, thisMonthJoinee }) => {
  const [activeTab, setActiveTab] = useState("Birthdays");

  return (
    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
      <div className="salary_dtlCard">
        <div className="salary_dtlCard_head d-flex justify-content-between">
          <h2 onClick={() => setActiveTab("Birthdays")}>
            {birthdays?.length} Birthdays
          </h2>
          <h2 onClick={() => setActiveTab("Anniversary")}>
            {workAnniversary?.length} Anniversary
          </h2>
          <h2 onClick={() => setActiveTab("NewJoinee")}>
            {thisMonthJoinee?.length} New Joinees
          </h2>
        </div>
        <div className="salary_dtlCard_info">
          <ul>
            {activeTab == "Birthdays" && <NewBirthdayTab birthdays={birthdays} />}
            {activeTab == "Anniversary" && (
              <NewAnniversary workAnniversary={workAnniversary} />
            )}
            {activeTab == "NewJoinee" && (
              <NewJoineeTab newJoinee={thisMonthJoinee} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabPanelCard;
