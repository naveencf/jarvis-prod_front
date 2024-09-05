import { Link, NavLink } from "react-router-dom";
import { UserFocus } from "@phosphor-icons/react";

const ExenseManagement = () => {
  return (
    <li className="nav-item">
      <Link
        className="nav-link nav-btn collapsed"
        data-toggle="collapse"
        data-target="#collapseTwom99s"
        aria-expanded="true"
        aria-controls="collapseTwom99s"
      >
        <i className="ph">
          <UserFocus weight="duotone" />
        </i>
        <span>Expense Management</span>
      </Link>
      <div
        id="collapseTwom99s"
        className="collapse"
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div className="internal collapse-inner">
          <NavLink className="collapse-item" to="/admin/expense-Overview">
            <i className="bi bi-dot"></i>Expense Management
          </NavLink>
         
        </div>
      </div>
    </li>
  );
};

export default ExenseManagement;
