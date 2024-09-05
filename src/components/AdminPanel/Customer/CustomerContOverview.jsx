import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const CustomerContOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

    const storedToken = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);

    function getData() {
      axios.get(baseUrl + "get_all_customer_contact").then((res) => {
        setData(res.data.data);
        console.log(res.data.data, '----ok')
        setFilterData(res.data.data);
      });
    }

    useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return (
       // d.customer_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.contact_no?.toLowerCase().includes(search.toLowerCase()) ||
        d.alternative_contact_no?.toLowerCase().includes(search.toLowerCase())
      );
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
      name: "Customer Name",
      selector: (row) => row?.OPS_CustomerMast_data?.customer_name,
      sortable: true,
    },
    {
      name: "Contact Name",
      selector: (row) => row.contact_name,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_no,
      sortable: true,
    },
    {
      name: "Alternative Number",
      selector: (row) => row.alternative_contact_no,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/customer-cont-update/${row?._id}`}>
            <button title="Edit" className="btn btn-outline-primary btn-sm">
              <FaEdit />
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_customer_contact"
            id={row?._id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "20%",
    },
  ];

  return (
    <>
      <Link to={`/admin/customer-cont-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: '10px' }}
        >
          Add Contact
        </button>
      </Link>
      
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Customer Contacts Overview"
            columns={columns}
            data={filterData}
            fixedHeader
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

export default CustomerContOverview;
