// import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHome from "./UserHome";
import DataProvider from "./DataProvider/DataProvider";
import Profile from "./Profile/Profile";

const User = () => {
  return (
    <>
      <DataProvider>
        <Routes>
          <Route path="/" element={<UserHome />}>
            <Route path="/orderRequest" element={<UserHome />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </DataProvider>
    </>
  );
};

export default User;
