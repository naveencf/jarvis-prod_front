import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import { baseUrl } from "../../utils/config";

const ContentOverview = () => {
  // const { data } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  async function getData() {
    await axios
      .get(baseUrl+"content_upload")
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
      return d.page_name.toLowerCase().match(search.toLowerCase());
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
      name: "Page Name",
      selector: (row) => row.page_name,
      sortable: true,
    },
    {
      name: "Content Name",
      selector: (row) => (
        <>
          <Link to={`#`}>{row.content_name}</Link>
        </>
      ),
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Content",
      selector: (row) => {
        return (
          <img
            className="tbl_prdct_img"
            src={row.content}
            style={{ height: "90px", width: "90px" }}
          />
        );
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/ip-update/${row.ip_regist_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="ipregsidelete"
            id={row.ip_regist_id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  const [buttonAccess, setButtonAccess] = useState(false);

  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />

      <Link to="/content-upload" style={{}}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: "right", margin: "10px 0 10px 0" }}
        >
          Create New Content
        </button>
      </Link>

      <FormContainer
        mainTitle="IP Overview"
        link="/ip-master"
        buttonAccess={buttonAccess}
      />

      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Contents Overview"
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
export default ContentOverview;
