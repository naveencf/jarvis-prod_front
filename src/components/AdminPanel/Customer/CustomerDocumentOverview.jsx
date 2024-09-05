import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import { FaUserPlus, FaFileAlt } from "react-icons/fa";

const CustomerDocumentOverview = () => {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

console.log(documents);

  // const storedToken = sessionStorage.getItem("token");
  // const decodedToken = jwtDecode(storedToken);
  // const userID = decodedToken.id;

  function getDocuments() {
   axios.get(baseUrl + "get_all_customer_document").then((res) => {
      console.log(res.data.data);
      setDocuments(res.data.data);
      setFilteredDocuments(res.data.data);
    });
  }

  useEffect(() => {
    getDocuments();
  }, []);

  useEffect(() => {
    const result = documents?.filter((doc) => {
      return (
        doc.doc_id?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doc_upload?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doc_no?.toLowerCase().includes(search.toLowerCase()) ||
        doc.description?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredDocuments(result);
  }, [search, documents]);

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
      name: "Doc Name",
      selector: (row) => row?.OPS_Doc_Mast?.doc_name,
      sortable: true,
    },
    {
      name: "Doc File",
      selector: (row) =><img style={{height:"80px" , width:"80px"}} target='blank' src={row.doc_upload}  alt="" /> ,
      sortable: true,
    },
    {
      name: "Doc No",
      selector: (row) => row.doc_no,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          
          <Link to={`/admin/customer-document-update/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_customer_document"
            id={row._id}
            getData={getDocuments}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>

        <Link to={`/admin/customer-document-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{marginBottom:'10px'}}
        >
        Add Document
        </button>
      </Link>
      
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Customer Document Overview"
            columns={columns}
            data={filteredDocuments}
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

export default CustomerDocumentOverview;
