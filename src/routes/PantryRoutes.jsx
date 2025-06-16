import React from "react";
import { Route, Routes } from "react-router-dom";
import PantryUserDashboard from "../components/Pantry/PantryUserDashboard";
import PantryAdminDashboard from "../components/Pantry/PantryAdminDashboard";

function PantryRoutes() {
  return (
    <>
      <Routes>
        <Route path="/pantry-dashboard" element={<PantryUserDashboard />} />
        <Route path="/pantry-admin" element={<PantryAdminDashboard />} />
      </Routes>
    </>
  );
}

export default PantryRoutes;
