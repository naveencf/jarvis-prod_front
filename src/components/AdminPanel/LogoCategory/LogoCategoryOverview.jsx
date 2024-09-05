import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";

const LogoCategoryOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [contextData, setDatas] = useState([]);

  async function getData() {
    await axios
      .get(baseUrl+"get_all_logo_categories")
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cat_name.toLowerCase().match(search.toLowerCase());
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
      name: "Category Name",
      selector: (row) => row.cat_name,
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
          <Link to={`/admin/logo-category-update/${row.id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_logo_category"
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
        mainTitle="Data Category"
        link="/admin/logo-category-master"
        buttonAccess={true}
      />

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Data Category Overview"
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

export default LogoCategoryOverview;
