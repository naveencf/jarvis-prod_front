import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";
import { baseUrl } from "../../../utils/config";

const VenderOverView = () => {
  const { toastAlert } = useGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d.vendor_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_vendor");
      setFilterData(response.data);
      setData(response.data);
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Vendor Contact",
      selector: (row) => row.vendor_contact_no,
      sortable: true,
      width: "150px",
    },
    {
      name: "Secondary Contact",
      selector: (row) => row.secondary_contact_no,
      sortable: true,
      width: "160px",
    },
    {
      name: "Secondary Person",
      selector: (row) => row.secondary_person_name,
      sortable: true,
      width: "160px",
    },
    {
      name: "Type",
      selector: (row) => row.vendor_type,
      sortable: true,
    },
    {
      name: " Email ID",
      selector: (row) => row.vendor_email_id,
      sortable: true,
    },
    {
      name: "Company Name",
      selector: (row) => row.company_name,
      sortable: true,
      width: "250px",
      
    },
    {
      name: " Address",
      selector: (row) => row.vendor_address,
      sortable: true,
      width: "200px",
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    //   width: "15%",
    // },
    {
      name: "Action",
      width: "150px",

      cell: (row) => (
        <>
          <Link to={`/vendorUpdate/${row.vendor_id}`}>
            <button title="Edit" className="icon-1">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_vendor"
            id={row.vendor_id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container master-card-css">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer
                  mainTitle="Vendor Overview"
                  link="/vendorMaster"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/admin/asset-dashboard">Dashboard</Link>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/vendorMaster">Add</Link>
                </button>
              </div>
            </div>
            <div className="">
              <div className="card mb-4">
                <div className="card-header sb">
                  <h5>Vendor Overview</h5>
                  <input
                    type="text"
                    placeholder="Search here"
                    className="w-50 form-control "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="data_tbl table-responsive card-body body-padding">
                  <DataTable
                    columns={columns}
                    data={filterData}
                    // fixedHeader
                    pagination
                    fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                
                   
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VenderOverView;
