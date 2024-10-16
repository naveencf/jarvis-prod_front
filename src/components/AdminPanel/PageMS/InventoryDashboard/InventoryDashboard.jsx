import React from "react";
import { Link } from "react-router-dom";
import FormContainer from "../../FormContainer";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TagCategory from "./TagCategory";

const InventoryDashboard = () => {
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Dashboard"} link={true} />
        </div>
        <div className="action_btns">
          <Link to="/admin/pms-inventory-category-overview">
            <button className="btn cmnbtn btn-primary btn_sm">Category</button>
          </Link>
          <Link to="/admin/pms-page-sub-category">
            <button className="btn cmnbtn btn-primary btn_sm">
              Sub Category
            </button>
          </Link>
          <Link
            to={`/admin/pms-page-cat-assignment-overview`}
            className="btn cmnbtn btn_sm btn-primary"
          >
            Assign User <KeyboardArrowRightIcon />
          </Link>
        </div>
        <TagCategory />
      </div>
    </div>
  );
};

export default InventoryDashboard;
