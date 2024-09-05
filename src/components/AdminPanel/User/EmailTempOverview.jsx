import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import { Button } from "@mui/material";

const EmailTempOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  async function getData() {
    await axios.get(baseUrl + "get_all_email_contents",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then((res) => { 
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.email_for.toLowerCase().match(search.toLowerCase());
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
      name: "Email Title",
      selector: (row) => row.email_for,
      sortable: true,
    },
    {
      name: "Email Content",
      selector: (row) => row.email_content,
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/email-template-update/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_email_content"
            id={row._id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Email Template Overview"
        // title=""
        link="admin/email-template"
        submitButton={false}
      />
      <div className="gap16 flex-row mb-3">
        <Link className="btn btn-primary cmnbtn btn-sm " to="/admin/email-events">
          Email Events
        </Link>
        <Link to="/admin/email-template " className="btn-success cmnbtn btn-sm btn">Add Email Template</Link>
      </div>
      {/* <button
          type="button"
          className="btn btn-success"
          style={{
            float: "right",
            margin: "-4% 0% 2% 89%",
            position: "relative",
            width: "10%",
            height: "10%",
          }}
        > */}
      {/* </button> */}

      {/* <div className="page_height"> */}
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">
            Email Temp Overview
          </div>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body thm_table">
          <DataTable

            columns={columns}
            data={filterdata}
            fixedHeader
            pagination
            // fixedHeaderScrollHeight="64vh"
            highlightOnHover

          />
        </div>
      </div>
      {/* </div> */}
      {/* </FormContainer> */}
    </div>
  );
};

export default EmailTempOverview;
