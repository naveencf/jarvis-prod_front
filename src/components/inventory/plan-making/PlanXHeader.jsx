import { Button } from "@mui/material";
import React from "react";

function PlanXHeader({ planRows, onFilterChange }) {
  return (
    <>
      <Button
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={() => onFilterChange("RequestPlan")}
        variant="outlined"
      >
        <span className="badgeNum">
          {planRows.filter((plan) => plan?.sales_executive_created).length}
        </span>{" "}
        Request Plans
      </Button>
      <Button
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={() => onFilterChange("all")}
        variant="outlined"
      >
        <span className="badgeNum">{planRows.length}</span> All
      </Button>
      <Button
        className="btn cmnbtn btn_sm btn-outline-warning"
        onClick={() => onFilterChange("today")}
        variant="outlined"
      >
        <span className="badgeNum">
          {
            planRows.filter(
              (plan) =>
                new Date(plan.createdAt) >=
                new Date(new Date().setHours(0, 0, 0, 0))
            ).length
          }
        </span>{" "}
        Today
      </Button>
      <Button
        className="btn cmnbtn btn_sm btn-outline-success"
        onClick={() => onFilterChange("thisMonth")}
        variant="outlined"
      >
        <span className="badgeNum">
          {
            planRows.filter(
              (plan) =>
                new Date(plan.createdAt) >= new Date(new Date().setDate(1))
            ).length
          }
        </span>{" "}
        This Month
      </Button>
      <Button
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={() => onFilterChange("lastMonth")}
        variant="outlined"
      >
        <span className="badgeNum">
          {
            planRows.filter((plan) => {
              const createdAt = new Date(plan.createdAt);
              const today = new Date();
              return (
                createdAt.getMonth() === today.getMonth() - 1 &&
                createdAt.getFullYear() === today.getFullYear()
              );
            }).length
          }
        </span>
        Last Month
      </Button>
    </>
  );
}

export default PlanXHeader;
