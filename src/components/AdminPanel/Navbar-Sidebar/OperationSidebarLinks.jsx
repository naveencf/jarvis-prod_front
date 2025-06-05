import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";
import getDecodedToken from "../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const OperationSidebarLinks = () => {
  return (
    <>
      <NavLink className="collapse-item" to="/admin/record-campaign">
        <i className="bi bi-dot"></i>
        Record Campaigns
      </NavLink>
      <NavLink
        className="collapse-item"
        to="/admin/exeexecution/pending"
      >
        <i className="bi bi-dot"></i> Pending
      </NavLink>

      {/* <NavLink className="collapse-item" to="/admin/op-calender">
      <i className="bi bi-dot"></i>
      Calender
    </NavLink>
    <NavLink
    className="collapse-item"
    to="/admin/campaign_executions"
  >
    <i className="bi bi-dot"></i>
   New Camp Execution
  </NavLink> */}
    </>
  );
};

export default OperationSidebarLinks;
