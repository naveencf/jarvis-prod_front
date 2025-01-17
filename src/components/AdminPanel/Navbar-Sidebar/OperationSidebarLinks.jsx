import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";
import getDecodedToken from "../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const OperationSidebarLinks = () => {
  return (
    <NavLink className="collapse-item" to="/admin/op-calender">
      <i className="bi bi-dot"></i>
      Calender
    </NavLink>
  );
};

export default OperationSidebarLinks;
