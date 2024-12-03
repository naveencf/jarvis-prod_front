import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";
import getDecodedToken from "../../../utils/DecodedToken";

const SalesSidebarLinks = () => {
  const token = getDecodedToken();
  const navigate = useNavigate();

  let loginUserId;
  const loginUserRole = token.role_id;
  const deptId = token.dept_id;

  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }

  return (
    <li className="nav-item">
      <Link
        className={`nav-link nav-btn ${
          loginUserRole !== 1 && deptId == 36 ? "" : "collapsed"
        }`}
        // data-toggle={`${deptId !== 36 && "collapse"}`}
        data-toggle={"collapse"}
        data-target="#collapseTwom99"
        aria-expanded="true"
        aria-controls="collapseTwom99"
      >
        <i className="ph">
          <ChartLineUp weight="duotone" />
        </i>
        <span>Sales</span>
      </Link>

      <div
        id="collapseTwom99"
        className={`${
          loginUserRole !== 1 && deptId == 36
            ? "collapse show"
            : "collapse hide"
        }`}
        aria-labelledby="headingTwo"
        data-parent="#accordionSidebar"
      >
        <div className="internal collapse-inner">
          <NavLink className="collapse-item" to="/admin/sales-dashboard">
            <i className="bi bi-dot" />
            Dashboard
          </NavLink>

          <NavLink className="collapse-item" to="/admin/sales-account-overview">
            <i className="bi bi-dot" />
            Accounts
          </NavLink>
          <NavLink className="collapse-item" to="/admin/view-sales-booking">
            <i className="bi bi-dot" />
            Closed Deal
          </NavLink>

          {/* <NavLink className="collapse-item" to="/admin/product">
            <i className="bi bi-dot" />
            Product
          </NavLink> */}

          <NavLink
            className="collapse-item"
            to={
              loginUserRole === 1
                ? "/admin/sales-incentive-dashboard"
                : {
                    pathname: "/admin/sales-user-incentve",
                    state: { id: loginUserId, name: "monthwise" },
                  }
            }
          >
            <i className="bi bi-dot" />
            Incentive
          </NavLink>
        </div>
      </div>
    </li>
  );
};

export default SalesSidebarLinks;
