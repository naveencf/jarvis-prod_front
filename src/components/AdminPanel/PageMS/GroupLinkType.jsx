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

const GroupLinkType = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [groupLink, setGroupLink] = useState("");
  const [description, setDescription] = useState("");
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])
  const [rowData, setRowData] = useState({})
  const [groupLinkUpdate, setGroupLinkUpdate] = useState("")
  const [descriptionUpdate, setDescriptionUpdate] = useState("")

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl+"getAllGroupLink")
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
      return d.link_type.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "addGroupLink", {
      link_type: groupLink,
      description: description,
      created_by: userID
    })
    .then(() => {
      // setIsFormSubmitted(true);
      toastAlert("Submitted");
      setGroupLink("")
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
      name: "Pay Cycle",
      selector: (row) => row.link_type,
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
            endpoint="deleteGroupLink"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) =>{
    setRowData(row);
    setGroupLinkUpdate(row.link_type);
    setDescriptionUpdate(row.description);
  }

  const handleModalUpdate = () => {
    if(groupLinkUpdate === ""){
      toastError("Group Link Type is required");
      return;
    }
    axios.put(baseUrl+`updateGroupLink/${rowData._id}`, {
      link_type: groupLinkUpdate,
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setGroupLinkUpdate("")
      setDescriptionUpdate("")
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Group Link Type"
        title="Group Link Type"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Group Link Type*"
          value={groupLink}
          required={true}
          onChange={(e) => setGroupLink(e.target.value)}
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
            title="Group Link Type Overview"
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
                label="Group Link Type*"
                value={groupLinkUpdate}
                required={true}
                onChange={(e) => setGroupLinkUpdate(e.target.value)}
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
                data-dismiss={`${groupLinkUpdate === "" ?"": 'modal'}`}
              >Update</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GroupLinkType;