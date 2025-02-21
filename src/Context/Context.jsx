import { createContext, useEffect, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseUrl } from "../utils/config";
import getDecodedToken from "../utils/DecodedToken";

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");

  // Get All Categroy Data API State here
  const [categoryDataContext, setCategoryData] = useState([]);
  const [getBrandDataContext, setBrandDataContext] = useState([]);
  const [getAssetDataContext, setAssetDataContext] = useState([]);
  const [usersDataContext, setUsersContextData] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const toastAlert = (text) => {
    toast.success(text);
    setShowAlert(true);
    setAlertText(text);
  };
  const toastError = (text) => {
    toast.error(text);
    setShowAlert(true);
    setAlertText(text);
  };

  const getAllCategoryContextFunction = () => {
    axios.get(baseUrl + "get_all_asset_category").then((res) => {
      setCategoryData(res?.data.data.asset_categories);
    });
  };
  async function getBrandData() {
    const res = await axios.get(baseUrl + "get_all_asset_brands");
    setBrandDataContext(res?.data.data);
  }
  async function getAssetData() {
    const res = await axios.get(baseUrl + "get_all_sims");
    setAssetDataContext(res?.data.data);
  }
  async function getUserAPIData() {
    // axios.get(baseUrl + "get_all_users_with_required_data").then((res) => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUsersContextData(res?.data.data);
    });
  }

  async function getauth() {
    axios
      .get(`${baseUrl}` + `get_single_user_auth_detail/${getDecodedToken().id}`)
      .then((res) => {
        setData(res.data);
      });
  }

  useEffect(() => {
    // getAllCategoryContextFunction();
    // getBrandData();
    // getAssetData();
    getUserAPIData();
    // getauth();
  }, []);
  return (
    <AppContext.Provider
      value={{
        toastAlert,
        data,
        token,
        toastError,
        categoryDataContext,
        getBrandDataContext,
        getAssetDataContext,
        usersDataContext,
        activeAccordionIndex,
        setActiveAccordionIndex,
      }}
    >
      {children}
      {showAlert && (
        <>
          <ToastContainer autoClose={1500} />

          {/* {alertText} */}
        </>
      )}
    </AppContext.Provider>
  );
};
// Global Custom Hooks
const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider, useGlobalContext };
