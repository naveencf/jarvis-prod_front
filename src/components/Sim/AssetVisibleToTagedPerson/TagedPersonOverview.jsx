import DataTable from "react-data-table-component";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";

const TagedPersonOverview = ({ filterData, hardRender, tabOne, tabTwo }) => {
  const columnsTab1 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => {
        const date = new Date(row.repair_request_date_time);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${date.getFullYear()}`;
        const time = `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;
        return `${formattedDate}`;
      },
      sortable: true,
    },

    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },

    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "14%",
    },
    {
      name: "Category",
      selector: (row) => row.asset_category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.asset_sub_category_name,
      sortable: true,
    },
  ];
  const columnsTab2 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.sub_category_name,
      // selector: (row) => row.asset_name,
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0].split("-").reverse().join("-"),
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => (
    //     <>
    //       {row?.asset_new_request_status === "Requested" ? (
    //         <span className="badge badge-danger">Requested</span>
    //       ) : row.asset_new_request_status === "Approved" ? (
    //         <span className="badge badge-success">Approved</span>
    //       ) : row.asset_new_request_status === "Rejected" ? (
    //         <span className="badge badge-warning">Rejected</span>
    //       ) : null}
    //     </>
    //   ),
    //   sortable: true,
    // },
  ];

  const activeColumns = tabOne ? columnsTab1 : columnsTab2;

  return (
    <>

      <>

        <DataTable

          columns={activeColumns}
          data={filterData}
          // fixedHeader
          pagination
          fixedHeaderScrollHeight="64vh"
          exportToCSV
          highlightOnHover
          subHeader
        />

      </>

    </>
  );
};

export default TagedPersonOverview;
