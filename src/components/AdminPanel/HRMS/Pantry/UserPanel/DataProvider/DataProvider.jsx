import { createContext, useState } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const [count, setCount] = useState({});

  return (
    <DataContext.Provider value={{ count, setCount }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
