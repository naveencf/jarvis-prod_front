import React from "react";
import { Route, Routes } from "react-router-dom";

import CommunityHome from "../components/SuperTracker/CommunityManagement/CommunityHome";
import CommunityManager from "../components/SuperTracker/CommunityManagement/CommunityManager";
import CommunityPageView from "../components/SuperTracker/CommunityManagement/CommunityPageView";
import CommunityUser from "../components/SuperTracker/CommunityManagement/CommunityUser";
import AllAssignedCategory from "../components/SuperTracker/CommunityManagement/AllAssignedCategory";
import CommunityManagerView from "../components/SuperTracker/CommunityManagement/CommunityManagerView";
import MeetingPagesOverView from "../components/SuperTracker/MeetingPages/MeetingPagesOverView";
import OverviewMeetingVia from "../components/SuperTracker/MeetingPages/OverviewMeetingVia";
import CommunityInternalCategory from "../components/SuperTracker/CommunityManagement/CommunityInternalCategory";
import CategoryWisePagesHistory from "../components/SuperTracker/CommunityManagement/CategoryWisePagesHistoey";
import CommunityPages from "../components/SuperTracker/CommunityManagement/CommunityPages";

const CommunityRoutes = ({ contextData }) => {
  // if (!contextData || !contextData[25] || contextData[25]?.view_value !== 1) {
  //   return null;
  // }

  return (
    <Routes>
      <Route path="/community-home" element={<CommunityHome />} />
      <Route path="/manager" element={<CommunityManager />} />
      <Route path="/internal-category" element={<CommunityInternalCategory />} />
      <Route path="/manager/:creatorName" element={<CommunityPageView />} />
      <Route path="/user" element={<CommunityUser />} />
      <Route path="/allAssignedcategory" element={<AllAssignedCategory />} />
      <Route path="/managerView" element={<CommunityManagerView />} />
      <Route path="/categoryWise/pagesHistoey" element={<CategoryWisePagesHistory />} />
      <Route path="/meetingPage" element={<MeetingPagesOverView />} />
      <Route path="/overviewMeetingVia" element={<OverviewMeetingVia />} />
      <Route path="/add-internal-category" element={<CommunityInternalCategory />} />
      <Route path="/community-pages" element={<CommunityPages />} />
    </Routes>
  );
};

export default CommunityRoutes;
