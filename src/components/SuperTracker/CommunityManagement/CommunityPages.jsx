import React from "react";
import { useGetSuperTrackerPagesBySTQuery } from "../../Store/API/Community/CommunityInternalCatApi";
import View from "../../AdminPanel/Sales/Account/View/View";

const CommunityPages = () => {
  const { data, isLoading, isError } = useGetSuperTrackerPagesBySTQuery();

  const columns = [
    {
      key: "sno",
      name: "S.no",
    //   width: 70,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 320,
    },
 
    {
      key: "status",
      name: "Status",
      width: 200,
      renderRowCell: (row) => {
        const status = row.status;
        if (status === 1) return <span style={{ color: "green" }}>Active</span>;
        if (status === 2) return <span style={{ color: "red" }}>Disabled</span>;
        return "Unknown";
      },
    },
    {
      key: "createdAt",
      name: "Created At",
      width: 180,
      renderRowCell: (row) =>
        new Date(row.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "updatedAt",
      name: "Updated At",
      width: 180,
      renderRowCell: (row) =>
        new Date(row.updatedAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <div>
      {" "}
      <View
        version={1}
        columns={columns}
        data={data}
        isLoading={isLoading}
        title="Community Pages."
        rowSelectable={true}
        pagination={[50, 100, 200]}
        tableName="Community Pages."
      />
    </div>
  );
};

export default CommunityPages;
