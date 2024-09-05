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

const ProfileType = () => {
  const { toastAlert, toastError } = useGlobalContext();
 // const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [data,setData]=useState([]);  
  const [profileTypes, setProfileTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [profileUpdate, setProfileUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "getProfileList") 
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d.profile_type?.toLowerCase().match(search.toLowerCase()); 
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(baseUrl + "addProfile", { 
      profile_type: profileTypes, 
      description: description,
      created_by: userID
    })
    .then(() => {
      toastAlert("Submitted");
      setProfileTypes("");
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
      name: "Profile Type", 
      selector: (row) => row.profile_type, 
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name // Adjust to match your data model, if necessary
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handleRowData(row)}
            data-toggle="modal" data-target="#myModal"
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="deleteProfile" 
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) => {
    setRowData(row);
    setProfileUpdate(row.profile_type); // Adjust to match your data model
    //console.log(row.profile_type , "-----------profile type ")
    setDescriptionUpdate(row.description);
  };

  const handleModalUpdate = () => {
    if (profileUpdate === "") {
      toastError("Profile Type is required");
      return;
    }
    axios.put(baseUrl + `updateProfile/${rowData._id}`, { 
      profile_type: profileUpdate, 
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Profile Type Updated Successfully");
      getData();
      setProfileUpdate("");
      setDescriptionUpdate("");
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Profile Type "
        title="Add Profile Type"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Profile Type *"
          value={profileTypes}
          required={true}
          onChange={(e) => setProfileTypes(e.target.value)}
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
            title="Profile Overview"
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
              <h4 className="modal-title">Update Profile Type</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Profile Type *"
                value={profileUpdate}
                required={true}
                onChange={(e) => setProfileUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={false}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-success" onClick={handleModalUpdate} data-dismiss={`${profileUpdate === "" ?"": 'modal'}`} >Update</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileType;
