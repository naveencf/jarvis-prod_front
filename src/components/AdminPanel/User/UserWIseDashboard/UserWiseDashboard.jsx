import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import { useParams } from "react-router-dom";
import {baseUrl} from '../../../../utils/config'

const UserWiseDashboard = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const { id } = useParams();

  function getData() {
    axios
      .get(`${baseUrl}`+`get_user_by_deptid/${id}`)
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
      return d.user_name.toLowerCase().match(search.toLowerCase());
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
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
      // width: "17%",
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Designation",
      selector: (row) => row.designation_name,
      sortable: true,
      // width: "15%",
    },
    {},
  ];

  return (
    <>
      <FormContainer
        mainTitle="User Wise Responsibility"
        link="/admin/responsibility-master"
        // buttonAccess={
        //   contextData &&
        //   contextData[16] &&
        //   contextData[16].insert_value === 1 &&
        //   true
        // }
      />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="User Overview"
              columns={columns}
              data={filterdata}
              fixedHeader
              // pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default UserWiseDashboard;
