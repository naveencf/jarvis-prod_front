import React, { Children } from "react";

const CustomTableWrapper = ({ children, title, addHtml }) => {
  return (
    <div className="card tableCard">
      <div className="card-header sb ">
        <h4 className="card-title">{title}</h4>
        <div className="d-flex gap-2">{addHtml}</div>
      </div>
      <div className="card-body p0 border-0">{children}</div>
    </div>
  );
};

export default CustomTableWrapper;
