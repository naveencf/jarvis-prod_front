import React from "react";
import FormContainer from "../../FormContainer";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Users, Files } from "@phosphor-icons/react";

const InventoryDashboard = () => {
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={" Inventory Dashboard"} link={true} />
        </div>
        <div className="row">
          <div className="col">
            <NavLink to="/admin/inventory/pms-tag-Category">
              <div className="card shadow-none bgSuccessLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgSuccessLight">
                    <span>
                      <i className="bi bi-tag"></i>
                    </span>
                  </div>
                  <h6 className="fs_16">Tag Category</h6>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col">
            <NavLink to="/admin/inventory/pms-inventory-category-overview">
              <div className="card shadow-none bgPrimaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgPrimaryLight">
                    <span>
                      <i className="bi bi-tag"></i>
                    </span>
                  </div>
                  <h6 className="fs_16">Category</h6>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col">
            <NavLink to="/admin/inventory/pms-unfetch-pages">
              <div className="card shadow-none bgTertiaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgTertiaryLight">
                    <span>
                      <Files weight="duotone" />
                    </span>
                  </div>
                  <h6 className="fs_16">Unfetch Pages</h6>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col">
            <NavLink to="/admin/inventory/pms-page-cat-assignment-overview">
              <div className="card shadow-none bgSecondaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgSecondaryLight">
                    <span>
                      <Users size={32} />
                    </span>
                  </div>
                  <h6 className="fs_16">Assign User</h6>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
