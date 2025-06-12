import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RecordCampaign from '../components/AdminPanel/Operation/RecordCampaign/RecordCampaign.jsx'
import OpCalender from '../components/AbOpreation/Calender/OpCalender.jsx'
import CalenderCreation from "../components/Operation/Calender/CalenderCreation.jsx";
import Stats from '../components/AdminPanel/PageMS/Stats.jsx';
import PageStats from '../components/AdminPanel/PageMS/PageStats.jsx';
import CampignAdmin from '../components/AdminPanel/CampaginAdmin/CampignAdmin.jsx';
import PostStats from '../components/Stats/PostStats.jsx';
function OperationRoutes() {
    return (
        <Routes>
            <Route path="/calender" element={<CalenderCreation />} />
            <Route
                path="/record-campaign"
                element={<RecordCampaign />}
            />
            <Route path="/op-calender" element={<OpCalender />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/pageStats/:id" element={<PageStats />} />
            <Route path="/campaign-admin" element={<CampignAdmin />} />
            <Route path="/statics" element={<PostStats />} />
        </Routes>
    )
}

export default OperationRoutes