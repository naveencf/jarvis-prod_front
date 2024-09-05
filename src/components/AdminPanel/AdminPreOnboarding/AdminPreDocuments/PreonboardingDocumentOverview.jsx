import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../DeleteButton";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FieldContainer from "../../FieldContainer";

const PreonboardingDocumentOverview = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Document Name",
      selector: (row) => row.doc_name,
      sortable: true
    },
    {
      name: "Document Type",
      selector: (row) => row.doc_type,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => <>{row.isRequired ? "Mandatory" : "Non mandatory"}</>,
      sortable: true,
    },
    // {
    //   name: "Priority",
    //   selector: (row) => row.priority,
    //   sortable: true,
    // },
    {
      name: "Period",
      selector: (row) => row.period + " days",
      sortable: true,
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/preonboarding-documents-update/${row?._id}`}>
            <div className="icon-1" title="Edit User">
              <i className="bi bi-pencil"></i>
            </div>
          </Link>

          <DeleteButton
            endpoint={"delete_doc"}
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_docs");
      const data = response.data.data;
      setData(data);
      setFilterData(data);
    } catch (error) {
      console.log("", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return (
        d.doc_type?.toLowerCase().includes(search.toLowerCase()) ||
        d.priority?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <FormContainer
        mainTitle="Pre Onboarding Document"
        link="/admin/preonboarding-documents"
        buttonAccess={true}
      />
      <div className="page_height">
        <div className="card">
          <div className="card-header sb">
            Overview
            <input
              type="text"
              placeholder="Search here"
              className="w-50 form-control "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="card-body body-padding">
            <DataTable
              columns={columns}
              data={filterData}
              pagination
              paginationPerPage={100}
              // selectableRows
            />
          </div>
          <div className="data_tbl table-responsive"></div>
        </div>
      </div>
    </>
  );
};

export default PreonboardingDocumentOverview;
