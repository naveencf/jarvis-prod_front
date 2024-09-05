import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";
import axios from "axios";

const SalesContextData = createContext();
const SalesContext = ({ children }) => {
  const [salesServiceData, setSalesServiceData] = useState([]);

  const SalesServiceData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/getlist_sale_service_master"
      );
      const data = response.data.data;
      setSalesServiceData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    SalesServiceData();
  }, []);

  return (
    <SalesContextData.Provider
      value={{
        salesServiceData,
      }}
    >
      {children}
    </SalesContextData.Provider>
  );
};

const useSalesGlobalContext = () => {
  return useContext(SalesContextData);
};

export { SalesContext, SalesContextData, useSalesGlobalContext };
