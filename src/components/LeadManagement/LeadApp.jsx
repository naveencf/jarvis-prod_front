import { createContext, useEffect, useState } from "react";
import axios from "axios";
import LeadHeader from "./LeadHeader";
import {baseUrl} from '../../utils/config'

export const UserContext = createContext();

function LeadApp({ children }) {
  const [datalead, setDatalead] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [se, setSE] = useState([]);
  const [seEmpID, setSeEmpID] = useState(null);
  const [reload, setReload] = useState(false);
  let ftrse = [];

  useEffect(() => {
    (async () => {
      try {
        const leadres = await axios.get(
          baseUrl+"get_all_leads"
        );
        const userres = await axios.get(
          baseUrl+"get_all_users"
        );
        ftrse = [];
        leadres.data.map((ele) => {
          if (ele.assign_to == 0) {
            ftrse.push(ele);
          }
        });
        const tempse = [];
        userres.data.data.map((ele) => {
          if (ele.dept_id == 11) {
            tempse.push(ele);
          }
        });

        setSE(tempse);
        setNewData(ftrse);
        setDatalead(leadres.data);
      } catch (error) {
        console.log(error);
      }
    })();
    if (reload) {
      console.log("datalead updated");
    }
  }, [reload]);

  return (
    <>
      <UserContext.Provider
        value={{
          datalead,
          setDatalead,
          newdata,
          se,
          seEmpID,
          setSeEmpID,
          reload,
          setReload,
        }}
      >
        <LeadHeader />
        {children}
      </UserContext.Provider>
    </>
  );
}
export default LeadApp;
