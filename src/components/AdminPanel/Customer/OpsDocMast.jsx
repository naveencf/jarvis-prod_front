import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";

const OpsDocMast = () => {
  const { toastAlert } = useGlobalContext();
  const [docName, setDocName] = useState("");
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [docNameUpdate, setDocNameUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "get_all_doc_mast")
      .then((res) => {
        setDocuments(res.data.data);
        console.log(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRowData = (row) => {
    setRowData(row);
    setDocNameUpdate(row.doc_name);
    setDescriptionUpdate(row.description);
  };

  useEffect(() => {
    const result = documents.filter((d) => {
      return d.doc_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "add_doc_mast", {
      doc_name: docName,
      description: description,
      created_by: userID
    })
      .then(() => {
        toastAlert("Submitted");
        setDocName("");
        setDescription("");
        getData();
      });
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Doc Name",
      selector: (row) => row.doc_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowData(row)}
            data-toggle="modal" data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="delete_doc_mast"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];



  const handleModalUpdate = () => {
    axios.put(baseUrl + `update_doc_mast/${rowData._id}`, {
      doc_name: docNameUpdate,
      decription: descriptionUpdate,
      updated_by: userID
    })
      .then(() => {
        toastAlert("Successfully Update");
        getData();
        setDocNameUpdate("");
        setDescriptionUpdate("");
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Ops Document Master"
        title="Document"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Doc Name *"
          value={docName}
          required={true}
          onChange={(e) => setDocName(e.target.value)}
        />

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Customer Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Update</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Doc Name *"
                value={docNameUpdate}
                required={true}
                onChange={(e) => setDocNameUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={true}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >Close</button>
              <button type="button"
                className="btn btn-success"
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >Update</button>
            </div>
          </div>

        </div>
      </div>

    </>
  );
};

export default OpsDocMast;
