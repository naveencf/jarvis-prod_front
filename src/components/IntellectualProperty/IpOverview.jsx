import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import { CgPassword } from "react-icons/cg";
import { baseUrl } from "../../utils/config";

const IpOverview = () => {
  // const { data } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (row) => {
    const newSelectedRows = [...selectedRows];
    if (newSelectedRows.includes(row)) {
      newSelectedRows.splice(newSelectedRows.indexOf(row), 1);
    } else {
      newSelectedRows.push(row);
    }
    setSelectedRows(newSelectedRows);
  };

  const copySelectedRows = () => {
    const formattedData = selectedRows
      .map((row) => {
        return `Page Name: ${row.ip_name},\nFollowers: ${row.followers},\nLink: https://instagram.com/${row.ip_name}`;
      })
      .join("\n\n");

    const textarea = document.createElement("textarea");
    textarea.value = formattedData;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    // console.log("Selected Rows:", selectedData);
  };

  async function getData() {
    await axios
      .get(baseUrl+"get_all_instapages")
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  function getFilterData(id) {
    const filteredData = data.filter((data1) => data1.ip_type == id);
    setFilterData(filteredData);
  }

  useEffect(() => {
    const result = data.filter((d) => {
      return d.ip_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            checked={selectedRows.includes(row)}
            onChange={() => handleRowSelected(row)}
          />
        </div>
      ),
      width: "5%",
      sortable: true,
    },
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "IP Type",
      selector: (row) => row.ip_type_name,
      sortable: true,
    },
    {
      name: "IP Name",
      selector: (row) => (
        <>
          <Link to={`/ip-graph/${row.ip_regist_id}`}>{row.ip_name}</Link>
        </>
      ),
      sortable: true,
    },
    {
      name: "Last month",
      selector: (row) =>
        row.followers2 +
        "@" +
        new Date(row.last_updated_at1).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Followers",
      selector: (row) => row.followers,
      sortable: true,
    },
    {
      name: "Difference",
      selector: (row) => row.followers1 - row.followers2,
      sortable: true,
    },
    {
      name: "Post Count",
      selector: (row) => row.post_count,
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

          <Link to={`/ip-history/${row.ip_regist_id}`}>
            <button
              title="IP History"
              className="btn btn-outline-success btn-sml"
            >
              {"H"}
            </button>
          </Link>

          <Link to={`/ip-countupdate/${row.ip_regist_id}`}>
            <button
              title="Count Update"
              className="btn btn-outline-primary btn-sml"
            >
              {"U"}
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

      <button
        type="button"
        className="btn btn-secondary"
        style={{ margin: "10px 0 10px 0" }}
        onClick={copySelectedRows}
        disabled={selectedRows.length === 0}
      >
        Copy Rows Data
      </button>

      <Link to="/ip-master" style={{}}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: "right", margin: "10px 0 10px 0" }}
        >
          Create New IP
        </button>
      </Link>
      <Link to="/admin/iptype-overview" style={{}}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: "right", margin: "10px 5px 10px 0" }}
        >
          IP type
        </button>
      </Link>
      <Link to="/admin/platform-overview" style={{}}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: "right", margin: "10px 5px 10px 0" }}
        >
          Platform
        </button>
      </Link>

      <FormContainer
        mainTitle="IP Overview"
        link="/ip-master"
        buttonAccess={buttonAccess}
      />

      <ul
        className="nav nav-pills nav-fill navtop"
        style={{ marginBottom: "20px" }}
      >
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#menu1"
            data-toggle="tab"
            onClick={() => getFilterData("7")}
          >
            Instagram
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#menu2"
            data-toggle="tab"
            onClick={() => getFilterData("12")}
          >
            Facebook
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#menu3"
            data-toggle="tab"
            onClick={() => getFilterData("10")}
          >
            Threads
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#menu4"
            data-toggle="tab"
            onClick={() => getFilterData("9")}
          >
            X
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#menu5"
            data-toggle="tab"
            onClick={() => getFilterData("8")}
          >
            Youtube
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#menu6"
            data-toggle="tab"
            onClick={() => getFilterData("11")}
          >
            Telegram
          </a>
        </li>
      </ul>

      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="IP Overview"
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
export default IpOverview;
