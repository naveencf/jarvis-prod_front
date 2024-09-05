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

const OwnershipMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [ownershipName, setOwnershipName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerships, setOwnerships] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [ownershipNameUpdate, setOwnershipNameUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "get_all_ownership")
      .then((res) => {
        setOwnerships(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = ownerships.filter((d) => {
      return d.ownership_name?.toLowerCase().match(search.toLowerCase()); 
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "add_ownership", {
        ownership_name: ownershipName,
        description: description,
        created_by: userID
      })
      .then(() => {
        toastAlert("Submitted");
        setOwnershipName("");
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
      name: "Ownership",
      selector: (row) => row.ownership_name, 
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
            endpoint="delete_ownership" 
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) => {
    setRowData(row);
    setOwnershipNameUpdate(row.ownership_name); 
    setDescriptionUpdate(row.description);
  };

  const handleModalUpdate = () => {
    axios.put(baseUrl + `update_ownership/${rowData._id}`, { 
      ownership_name: ownershipNameUpdate, 
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Updated");
      getData();
      setOwnershipNameUpdate("");
      setDescriptionUpdate("");
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Ownership" 
        title="Ownership" 
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Ownership *" 
          value={ownershipName}
          required={true}
          onChange={(e) => setOwnershipName(e.target.value)}
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
            title="Ownership Overview" 
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
                label="Ownership Type *"
                value={ownershipNameUpdate}
                required={true}
                onChange={(e) => setOwnershipNameUpdate(e.target.value)}
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

export default OwnershipMaster;
