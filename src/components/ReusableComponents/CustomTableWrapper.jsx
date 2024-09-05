import React, { Children } from "react";

const CustomTableWrapper = ({ children, title }) => {
  return (
    <div className="card tableCard">
      <div className="card-header">
        <h4 className="card-title">{title}</h4>
      </div>
      <div className="card-body p0 border-0">{children}</div>
    </div>
  );
};

export default CustomTableWrapper;
