import React from "react";
import { Route } from "react-router-dom";

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
  if (!contextData || !contextData[25] || contextData[25]?.view_value !== 1) {
    return null;
  }

  return (
    <>
      <Route path="/instaapi/community" element={<CommunityHome />} />
      <Route path="/instaapi/community/manager" element={<CommunityManager />} />
      <Route path="/instaapi/community/internal-category" element={<CommunityInternalCategory />} />
      <Route path="/instaapi/community/manager/:creatorName" element={<CommunityPageView />} />
      <Route path="/instaapi/community/user" element={<CommunityUser />} />
      <Route path="/instaapi/community/allAssignedcategory" element={<AllAssignedCategory />} />
      <Route path="/instaapi/community/managerView" element={<CommunityManagerView />} />
      <Route path="/instaapi/community/categoryWise/pagesHistoey" element={<CategoryWisePagesHistory />} />
      <Route path="/instaapi/community/meetingPage" element={<MeetingPagesOverView />} />
      <Route path="/instaapi/community/overviewMeetingVia" element={<OverviewMeetingVia />} />
      <Route path="/instaapi/community/add-internal-category" element={<CommunityInternalCategory />} />
      <Route path="/instaapi/community/community-pages" element={<CommunityPages />} />
    </>
  );
};

export default CommunityRoutes;
