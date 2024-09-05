import DataTable from "react-data-table-component";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";

const UserSingleWFHDSalaryTab = ({ id }) => {
  console.log("hii bros")
  const [search, setSearch] = useState("");
  const [filterdata, setFilterData] = useState([]);
  const [data, setDatas] = useState([]);

  useEffect(() => {
    axios
      .post(baseUrl + "get_attendance_by_userid", {
        user_id: id,
      })
      .then((res) => {
        const response = res.data.data;
        setDatas(response);
        setFilterData(response);
      })
      .catch((e) => console.error("come to error"));
  }, []);

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
      cell: (row) => row.presentDays - Number(row.noOfabsent),
    },
    {
      name: "Total Payout",
      cell: (row) => row.total_salary + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
            // Assuming row.bonus is a numeric value
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
            // Assuming row.bonus is a numeric value
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },

    {
      name: "Net Payout",
      cell: (row) => row.net_salary + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
      width: "7%",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay + " ₹",
    },
    // {
    //   name: "Status",
    //   cell: (row) => row.attendence_status_flow,
    // },
  ];

  useEffect(() => {
    const result = data.filter((d) => {
      return d.billing_header_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);
  return (
    <div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="WFHD Salary"
            columns={columns}
            data={filterdata}
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
