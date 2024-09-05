import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";

const VendorType = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])
  const [rowData, setRowData] = useState({})
  const [typeNameUpdate, setTypeNameUpdate] = useState("")
  const [descriptionUpdate, setDescriptionUpdate] = useState("")

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl+"getAllVendor")
      .then((res) => {
        setVendorTypes(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  },[])

  useEffect(() => {
    const result = vendorTypes.filter((d) => {
      return d.type_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "addVendor", {
      type_name: typeName,
      description: description,
      created_by: userID
    })
    .then(() => {
      // setIsFormSubmitted(true);
      toastAlert("Submitted");
      setTypeName("")
      setDescription("")
      getData()
    });
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Type Name",
      selector: (row) => row.type_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name
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
            endpoint="deleteVendor"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) =>{
    setRowData(row);
    setTypeNameUpdate(row.type_name);
    setDescriptionUpdate(row.description);
  }

  const handleModalUpdate = () => {
    if(typeNameUpdate === "" ){
      toastError("Please Fill  Type Name  ");
      return;
    }
    axios.put(baseUrl+`updateVendor/${rowData._id}`, {
      type_name: typeNameUpdate,
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setTypeNameUpdate("")
      setDescriptionUpdate("")
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Vendor Type"
        title="Vendor Type"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Type Name *"
          value={typeName}
          required={true}
          onChange={(e) => setTypeName(e.target.value)}
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
            title="Vendor type Overview"
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
                label="Type Name *"
                value={typeNameUpdate}
                required={true}
                onChange={(e) => setTypeNameUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={false}
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
                 data-dismiss={`${typeNameUpdate === "" ?"": 'modal'}`}
              >Update</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default VendorType;