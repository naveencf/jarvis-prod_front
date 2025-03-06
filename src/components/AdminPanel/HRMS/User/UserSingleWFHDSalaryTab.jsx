import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";

const UserSingleWFHDSalaryTab = ({
  salaryData,
  salaryFilterData,
  setSalaryFilterData,
}) => {
  const [search, setSearch] = useState("");

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Employee Name",
      cell: (row) => row.user_name,
      width: "12%",
    },

    {
      name: "Work Days",
      width: "8%",
      cell: (row) => row.presentDays,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    {
      name: "Absents",
      cell: (row) => row.noOfabsent,
    },
    {
      name: "Presents",
      cell: (row) => Number(row.noOfabsent) - row.presentDays,
    },
    {
      name: "Total Payout",
      cell: (row) => row.total_salary + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
            return total + Number(rows.total_salary);
          }, 0),
      },
    },
    {
      name: "Bonus",
      cell: (row) => row.bonus + " ₹",
      footer: {
        cell: (row) => {
          const totalBonus = row.reduce((total, rows) => {
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },

    {
      name: "Net Payout",
      cell: (row) => row.net_salary?.toFixed() + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
      width: "7%",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay?.toFixed() + " ₹",
    },
    // {
    //   name: "Status",
    //   cell: (row) => row.attendence_status_flow,
    // },
  ];

  useEffect(() => {
    const result = salaryData?.filter((d) => {
      return d.billing_header_name.toLowerCase().match(search.toLowerCase());
    });
    setSalaryFilterData(result);
  }, [search]);
  return (
    <div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="WFHD Salary"
            columns={columns}
            data={salaryFilterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserSingleWFHDSalaryTab;
