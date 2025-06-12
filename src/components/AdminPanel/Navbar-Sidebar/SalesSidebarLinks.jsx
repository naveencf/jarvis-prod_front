import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChartLineUp } from "@phosphor-icons/react";
import getDecodedToken from "../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const SalesSidebarLinks = () => {
  const { userContextData, contextData } = useAPIGlobalContext();

  const token = getDecodedToken();
  const navigate = useNavigate();

  let isSalesAdmin =
    contextData?.find((data) => data?._id == 64)?.view_value === 1;

  let loginUserId;
  const loginUserRole = token.role_id;
  const deptId = token.dept_id;

  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
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
          <NavLink className="collapse-item" to="/admin/sales/sales-dashboard">
            <i className="bi bi-dot" />
            Dashboard
          </NavLink>

          <NavLink
            className="collapse-item"
            to="/admin/sales/sales-account-overview"
          >
            <i className="bi bi-dot" />
            Accounts
          </NavLink>
          <NavLink
            className="collapse-item"
            to="/admin/sales/view-sales-booking"
          >
            <i className="bi bi-dot" />
            Closed Deal
          </NavLink>

          {/* <NavLink className="collapse-item" to="/admin/sales/product">
            <i className="bi bi-dot" />
            Product
          </NavLink> */}

          <NavLink
            className="collapse-item"
            to={
              loginUserRole === 1
                ? "/admin/sales/sales-document-type-overview"
                : {
                    pathname: "/admin/sales/sales-user-incentive",
                    state: { id: loginUserId, name: "monthwise" },
                  }
            }
          >
            <i className="bi bi-dot" />
            Incentive
          </NavLink>
          <NavLink
            className="collapse-item"
            to="/admin/sales/sales-plan-request"
          >
            <i className="bi bi-dot" />
            Plan Request
          </NavLink>
          <NavLink
            className="collapse-item"
            to={
              isSalesAdmin
                ? "/admin/sales/sales-bonus-overview"
                : `/admin/sales/sales-bonus-summary/${loginUserId}`
            }
          >
            <i className="bi bi-dot" />
            {isSalesAdmin ? "User Wise Bonus" : "Bonus Summary"}
          </NavLink>
          {isSalesAdmin && (
            <NavLink
              className="collapse-item"
              to={"/admin/sales/sales-bonus-list"}
            >
              <i className="bi bi-dot" />
              Bonus List
            </NavLink>
          )}
        </div>
      </div>
    </li>
  );
};

export default SalesSidebarLinks;
