import React, { useState, useEffect } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import DeleteButton from "../../../AdminPanel/DeleteButton";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const TaskStatusDeptWiseOverview = () => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl+"deptwisestatus"
      );
      console.log(response.data);
      setData(response.data);
      setFilterData(response.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //   useEffect(() => {
  //     const result = data.filter((d) => {
  //       return d.dept_id.toLowerCase().match(search.toLowerCase());
  //     });
  //     setFilterData(result);
  //   }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.dept_id,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <>
            <Link to={`/admin/task-status-update-dept-wise/${row._id}`}>
              <button className="btn btn-primary">Edit</button>
            </Link>
            <DeleteButton
              endpoint="deptwisestatus"
              id={row._id}
              getData={getData}
            />
          </>
        );
      },
    },
  ];
  return (
    <>
      <FormContainer
        mainTitle="Task Status"
        link="/admin/task-status-dept-wise-master"
        buttonAccess={true}
      />
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Task Status Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="62vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default TaskStatusDeptWiseOverview;
