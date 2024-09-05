import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const WFHDDahboard = () => {
  const { userID } = useAPIGlobalContext();
  const [data, setData] = useState([]);

  const getDatas = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}` + `report_l1_users_data/${userID}`
      );
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,

      sortable: true,
    },

    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Emp ID",
      selector: (row) => row.user_id,

      sortable: true,
    },
    {
      name: "Contact",
      selector: (row) => row.user_contact_no,

      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department_name,

      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation_name,

      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span className="badge badge-success">{row.user_status}</span>
      ),

      sortable: true,
    },
  ];

  return (
    <>
      <div className="data_tbl table-responsive">
        <DataTable
          title="Team "
          columns={columns}
          data={data}
          fixedHeader
          highlightOnHover
          subHeader
        />
      </div>
    </>
  );
};

export default WFHDDahboard;
