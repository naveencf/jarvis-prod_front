import { createContext, useEffect, useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const FinanceAppContext = createContext();
const FinanceContextComponent = ({ children }) => {
  


  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  

  return (
    <FinanceAppContext.Provider
      value={{
        activeAccordionIndex, setActiveAccordionIndex
      }}
    >
      {children}
     
    </FinanceAppContext.Provider>
  );
};
// Global Custom Hooks
const useGlobalContext = () => {
  return useContext(FinanceAppContext);
};
export { FinanceAppContext, FinanceContextComponent, useGlobalContext };
