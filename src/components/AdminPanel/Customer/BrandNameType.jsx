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

const BrandNameType = () => {
  const { toastAlert } = useGlobalContext();
  const [accountType, setAccountType] = useState("");
  const [description, setDescription] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [accountTypeUpdate, setAccountTypeUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "get_all_account_type") 
      .then((res) => {
        setAccounts(res.data.data); 
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = accounts.filter((d) => {
      return d.account_type_name?.toLowerCase().match(search.toLowerCase()); 
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "add_account_type", { 
        account_type_name: accountType, 
        description: description,
        created_by: userID
      })
      .then(() => {
        toastAlert("Submitted");
        setAccountType(""); 
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
      name: "Brand Name Type",
      selector: (row) => row.account_type_name, 
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
            endpoint="delete_account_type" 
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];


  const handleRowData = (row) => {
    setRowData(row);
    setAccountTypeUpdate(row.account_type_name); 
    setDescriptionUpdate(row.description);
  };

  const handleModalUpdate = () => {
    axios.put(baseUrl + `update_account_type/${rowData._id}`, { 
      account_type_name: accountTypeUpdate, 
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setAccountTypeUpdate(""); 
      setDescriptionUpdate("");
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Brand" 
        title="Brand" 
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Brand Name Type *" 
          value={accountType}
          required={true}
          onChange={(e) => setAccountType(e.target.value)}
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
            title="Brand Overview" 
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
                label="Brand Name Type *"
                value={accountTypeUpdate}
                required={true}
                onChange={(e) => setAccountTypeUpdate(e.target.value)}
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

export default BrandNameType;
