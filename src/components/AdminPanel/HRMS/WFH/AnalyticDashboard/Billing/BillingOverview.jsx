import DataTable from "react-data-table-component";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../../../utils/config";
import DeleteButton from "../../../../DeleteButton";
import FormContainer from "../../../../FormContainer";

const BillingOverview = () => {
  const [search, setSearch] = useState("");
  const [billData, setBillData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  //get_wfh_users/${dept_id}

  const getData = () => {
    axios.get(baseUrl + "get_all_billingheaders").then((res) => {
      setBillData(res.data.result);
      setFilterData(res.data.result);
    });
  };
  useEffect(() => {
    getData();
    if (userID && contextData?.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Billing Name",
      selector: (row) => row.billing_header_name,
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
    },
    {
      name: "WFHD Employees Count",
      selector: (row) => (
        <Link
          className="text-primary"
          to={`/admin/wfh-users-overview/${row.dept_id}`}
        >
          {row.wfhUserCount}
        </Link>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[3] &&
            contextData[3].update_value === 1 && (
              <Link to={`/admin/wfhd/billing-update/${row?.billingheader_id}`}>
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
                endpoint="delete_billingheader"
                id={row.billingheader_id}
                getData={getData}
              />
            )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const result = billData.filter((d) => {
      return d.billing_header_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);
  return (
    <div>
      <FormContainer
        mainTitle="Billing"
        link="/admin/wfhd/billing-master"
        buttonAccess={
          // contextData &&
          // contextData[3] &&
          // contextData[3].insert_value === 1 &&
          "true"
        }
      />
      <div className="card">
        <div className="card-header sb">
          <h5 className="card-title">Billing Overview</h5>
          <input
            type="text"
            placeholder="Search Here"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="card-body p8">
          <DataTable
            // title="Billing Overview"
            columns={columns}
            data={filterdata}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            pagination
          />
        </div>
      </div>
    </div>
  );
};

export default BillingOverview;
