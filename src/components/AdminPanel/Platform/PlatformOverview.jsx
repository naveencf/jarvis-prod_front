import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";

const PlatformOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  function getData() {
    axios.get(baseUrl+"alldataofplatform").then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.name.toLowerCase().match(search.toLowerCase());
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
      name: "Platform name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/platform-update/${row.id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="platformdelete"
            id={row.id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Platform overview"
        link="/admin/platform-master"
        buttonAccess={""}
      />

      <button
        type="button"
        className="btn btn-primary"
        style={{
          float: "right",
          margin: "-65px 5px 0 0",
          position: "relative",
        }}
      >
        <Link to="/admin/platform-master">Add New</Link>
      </button>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Platform Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
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

export default PlatformOverview;
