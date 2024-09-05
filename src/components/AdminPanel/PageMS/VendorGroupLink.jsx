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
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";


const VendorGroupLink = () => {
  const navigate = useNavigate();
  const {vendorMast_name}= useParams();
  const { toastAlert,toastError } = useGlobalContext();
  const [groupLink, setGroupLink] = useState("");
  const [description, setDescription] = useState("");
  const [vendorId, setVendorId] = useState("")
  const [linkTypeId, setLinkTypeId] = useState("")
  const [vendorTypes, setVendorTypes] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])
  const [rowData, setRowData] = useState({})
  const [groupLinkUpdate, setGroupLinkUpdate] = useState("")
  const [descriptionUpdate, setDescriptionUpdate] = useState("")
  const [vendorIdUpdate, setVendorIdUpdate] = useState("")
  const [linkTypeIdUpdate, setLinkTypeIdUpdate] = useState("")

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl+"getAllVendorGroupList")
      .then((res) => {
        setVendorTypes(res.data.data);
        setFilterData(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
        setVendorData(res.data.tmsVendorkMastList);
    });
    axios.get(baseUrl + "getAllGroupLink").then((res) => {
        setGroupData(res.data.data);
    });
  };

  useEffect(() => {
    if(vendorMast_name?.length>0) {
     let vendordata= vendorData?.find((role) => role.vendorMast_name === vendorMast_name?.replace(/-/g, " "));
      setVendorId(vendordata?.vendorMast_id)

      let result = vendorTypes?.filter((d) => {
        return d.vendorMast_id === vendordata?.vendorMast_id;
      });
      setFilterData(result);
    }
  },[vendorData])

  useEffect(() => {
    getData();
  },[])

  useEffect(() => {
    const result = vendorTypes.filter((d) => {
      return d.group_link.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(groupLink === "" ){  
      toastError("Please Fill  Group Link  ");
      return;
    }
    else if(vendorId === "" ){
      toastError("Please Fill  Vendor Id  ");
      return;
    }
    else if(linkTypeId === "" ){
      toastError("Please Fill  Group Link Type Id  ");
      return;
    }

    axios.post(baseUrl + "addVendorGroup", {
      vendorMast_id: vendorId,
      group_link_type_id: linkTypeId,
      group_link: groupLink,
      description: description,
      created_by: userID
    })
    .then(() => {
      // setIsFormSubmitted(true);
      toastAlert("Submitted");
      setGroupLink("")
      setDescription("")
      setVendorId('')
      setLinkTypeId('')
      getData()
      navigate("/admin/pms-vendor-overview")
    }).catch((error) => {
      toastError(error.response.data.message);
      console.log(error.response.data.message)
    }
    );
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.PMS_VendorMasts_data.vendorMast_name,
    },
    {
      name: "Group Link Type",
      selector: (row) => row.PMS_VendorMasts_data.PMSGroupLinks_data.link_type,
    },
    {
      name: "Vendor Group Link",
      selector: (row) => row.group_link,
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
            endpoint="deleteVendorGroup"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) =>{
    // console.log(row.PMS_VendorMasts_data.PMSGroupLinks_data.group_link_type_id," row.PMSGroupLinks_data.link_type")
    setRowData(row);
    setGroupLinkUpdate(row.group_link);
    setDescriptionUpdate(row.description);
    setVendorIdUpdate(row.vendorMast_id);
    setLinkTypeIdUpdate(row.PMS_VendorMasts_data.PMSGroupLinks_data.group_link_type_id);
  }

  const handleModalUpdate = () => {
    if(groupLinkUpdate === "" ){
      toastError("Please Fill  Group Link  ");
      return;
    }
    else if(vendorIdUpdate === "" ){  
      toastError("Please Fill  Vendor Id  ");
      return;
    }
    else if(linkTypeIdUpdate === "" ){  
      toastError("Please Fill  Group Link Type Id  ");
      return;
    }

    axios.put(baseUrl+`updateVendorGroup/${rowData._id}`, {
      vendorMast_id: vendorIdUpdate,
      group_link_type_id: linkTypeIdUpdate,
      group_link: groupLinkUpdate,
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setGroupLinkUpdate("")
      setDescriptionUpdate("")
      setVendorIdUpdate('');
      setLinkTypeIdUpdate('');
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Vendor Group Link"
        title="Vendor Group Link"
        handleSubmit={handleSubmit}
      >
   <div className="form-group col-6">
          <label className="form-label">
            Group Link Type  <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={groupData.map((option) => ({
              value: option._id,
              label: option.link_type,
            }))}
            required={true}
            value={{
              value: linkTypeId,
              label:
                groupData.find((role) => role._id === linkTypeId)?.link_type ||
                "",
            }}
            onChange={(e) => {
              setLinkTypeId(e.value);
            }}
          ></Select>
        </div>

        <FieldContainer
          label="Group Link *"
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

        <div className="form-group col-6">
          <label className="form-label">
            Vendor  <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
          isDisabled={vendorMast_name?.length > 0}
            options={vendorData.map((option) => ({
              value: option.vendorMast_id,
              label: option.vendorMast_name,
            }))}
            required={true}
            value={{
              value: vendorId,
              label:
                vendorData.find((role) => role.vendorMast_id === vendorId)?.vendorMast_name ||
                "",
            }}
            onChange={(e) => {
              // console.log(vendorData[0])
              setVendorId(e.value);
            }}
          ></Select>
        </div>

     

      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Vendor group link Overview"
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
                label="Group Link *"
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

            <div className="form-group col-6">
              <label className="form-label">
                Vendor id <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={vendorData.map((option) => ({
                  value: option.vendorMast_id,
                  label: option.vendorMast_name,
                }))}
                value={{
                  value: vendorId,
                  label:
                    vendorData.find((role) => role.vendorMast_id === vendorIdUpdate)?.vendorMast_name ||
                    "",
                }}
                onChange={(e) => {
                  // console.log(e.value," e.value")
                  setVendorIdUpdate(e.value);
                }}
              ></Select>
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Group link type id <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={groupData.map((option) => ({
                  value: option._id,
                  label: option.link_type,
                }))}
                value={{
                  value: linkTypeId,
                  label:
                    groupData.find((role) => role._id === linkTypeIdUpdate)?.link_type ||
                    "",
                }}
                onChange={(e) => {
                  setLinkTypeIdUpdate(e.value);
                }}
              ></Select>
            </div>
            
            </div>
            <div className="modal-footer">
              <button type="button" 
                className="btn btn-danger" 
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

export default VendorGroupLink;