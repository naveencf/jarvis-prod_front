import { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import axios from "axios";
import DataTable from "react-data-table-component";
import jwtDecode from "jwt-decode";
import UserNav from "../Pantry/UserPanel/UserNav";
import { Navigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../Context/Context";
import {baseUrl} from '../../utils/config'

const IpHistory = () => {
  // const { data } = useGlobalContext();
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  function getData() {
    axios
      .get(`${baseUrl}`+`dataofiphistory/${id}`)
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.ip_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "IP Name",
      selector: (row) => row.ip_name,
      sortable: true,
    },
    {
      name: "Followers",
      selector: (row) => row.followers,
      sortable: true,
    },
    {
      name: "Post Count",
      selector: (row) => row.post_count,
    },
    {
      name: "Days Reach",
      selector: (row) => row.days_reach,
    },
    {
      name: "Last Updated at",
      selector: (row) => new Date(row.last_updated_at).toLocaleDateString(),
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     </>
    //   ),
    //   allowOverflow: true,
    //   width: "22%",
    // },
  ];

  const [buttonAccess, setButtonAccess] = useState(false);

  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />

      <FormContainer
        mainTitle="IP Count History"
        link="/ip-master"
        buttonAccess={buttonAccess}
      />

      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="IP count Overview"
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
    </div>
  );
};

export default IpHistory;
