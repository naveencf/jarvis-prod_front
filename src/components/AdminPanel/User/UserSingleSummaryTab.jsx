import React from "react";
import View from "../Sales/Account/View/View";
import { convertDateToDDMMYYYY } from "../../../utils/lengthFuntion";

const UserSingleSummaryTab = ({ summaryData }) => {
  console.log(summaryData, "summary data");

  const ExitUserColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "user_id",
      name: "Employee ID",
      width: 100,
    },
    {
      key: "user_name",
      name: "User Name",
      width: 250,
    },
    {
      key: "user_status",
      name: "Status",
      renderRowCell: (row) => (
        <>
          {row.user_status === "Active" ? (
            <span className="badge badge-success">Active</span>
          ) : row.user_status === "Exit" || row.user_status === "On Leave" ? (
            <span className="badge badge-warning">{row.user_status}</span>
          ) : row.user_status === "Resign" ? (
            <span className="badge badge-danger">Resigned</span>
          ) : row.user_status === "Bot" ? (
            <span className="badge badge-danger">Bot(Testing)</span>
          ) : null}
        </>
      ),
      width: 100,
      sortable: true,
    },
    {
      key: "joining_date",
      name: "Joining Date",
      width: 150,
      renderRowCell: (row) => (
        <div>{convertDateToDDMMYYYY(row.joining_date)} </div>
      ),
    },
    {
      key: "releaving_date",
      name: "Releaving Date",
      width: 150,
      renderRowCell: (row) => (
        <div>{convertDateToDDMMYYYY(row.releaving_date)} </div>
      ),
    },
    {
      key: "updatedAt",
      name: "updatedAt",
      width: 150,
      renderRowCell: (row) => (
        <div>{convertDateToDDMMYYYY(row.updatedAt)} </div>
      ),
    },
  ];
  return (
    <>
      <View
        columns={ExitUserColumns}
        data={summaryData}
        isLoading={false}
        tableName={"Op_executions"}
        pagination={[100, 200, 1000]}
      />
    </>
  );
};

export default UserSingleSummaryTab;
