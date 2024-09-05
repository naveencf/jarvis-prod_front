import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { baseUrl } from "../../../../utils/config";
import DeleteButton from "../../DeleteButton";
import FormContainer from "../../FormContainer";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

export default function MajorDepartmentOverview() {
  const { contextData } = useAPIGlobalContext();
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  function getData() {
    axios.get(baseUrl + "get_all_major_departments").then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }
  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
    });
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return (
        d.m_dept_name.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Major-Department Name",
      width: "250px",
      selector: (row) => row.m_dept_name,
      sortable: true,
    },
    // {
    //   name: "Department Name",
    //   width: "12%",
    //   cell: (row) => row.dept_name,
    //   sortable: true,
    // },
    {
      name: "Remark",
      selector: (row) => row.Remarks,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[3] &&
            contextData[3].update_value === 1 && (
              <Link to={`/admin/major-department-update/${row.m_dept_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button icon-1"
                >
                  <i className="bi bi-pencil" />{" "}
                </button>
              </Link>
            )}
          {contextData &&
            contextData[3] &&
            contextData[3].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_major_department"
                id={row.m_dept_id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Major-Department"
        link="/admin/major-department-mast"
        buttonAccess={
          contextData &&
          contextData[3] &&
          contextData[3].insert_value === 1 &&
          "true"
        }
      />

      <div className="card">
        <div className="card-header sb">
          <h4 className="card-title">Major-Department Overview</h4>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body thm_table">
          <DataTable
            columns={columns}
            data={filterData}
            paginationPerPage={100}
            fixedHeader
            pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
}
