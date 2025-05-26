import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";

const ApiContextData = createContext();

const APIContext = ({ children }) => {
  const [userContextData, setUserContextData] = useState([]);
  const [DepartmentContext, setDepartmentContext] = useState([]);
  const [contextData, setContextData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginUserData, setLoginUserData] = useState("");
  const [getAllWfhUserContext, setGetallWfhUser] = useState("");

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);

  const userID = decodedToken.id;
  const ContextDept = decodedToken.dept_id;
  const RoleIDContext = decodedToken.role_id;
  const JobType = decodedToken.job_type;

  // ✅ Function to fetch and update user context data
  const getUserContextData = async () => {
    try {
      const res = await axios.get(baseUrl + "get_all_users_new", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setUserContextData(res?.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userID && contextData?.length === 0) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => setContextData(res?.data));
    }

    getUserContextData(); // Call new function instead of inline axios

    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentContext(res?.data);
    });
    axios.get(baseUrl + "get_all_wfh_users").then((res) => {
      setGetallWfhUser(res?.data);
    });

    axios.get(`${baseUrl}get_single_user/${userID}`).then((res) => {
      setLoginUserData(res.data);
    });
  }, [userID]);

  return (
    <ApiContextData.Provider
      value={{
        userContextData,
        loading,
        DepartmentContext,
        contextData,
        loginUserData,
        userID,
        ContextDept,
        RoleIDContext,
        JobType,
        getUserContextData, // ✅ Expose function in context
        getAllWfhUserContext,
      }}
    >
      {children}
    </ApiContextData.Provider>
  );
};

const useAPIGlobalContext = () => {
  return useContext(ApiContextData);
};

export { APIContext, ApiContextData, useAPIGlobalContext };
