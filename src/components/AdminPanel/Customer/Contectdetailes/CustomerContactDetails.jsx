import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../DeleteButton";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../../utils/config";
import { useParams} from "react-router-dom"
// import FieldContainer from "../FieldContainer";
// import FormContainer from "../FormContainer";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import Select from "react-select";

const CustomerContactDetails = () => {
  let { customer_id } = useParams();
  console.log(customer_id,"id");
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [emailId, setEmailId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [count, setCount] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
 console.log(count,"new dataa ");
  const [customersData, setCustomersData] = useState([]);
  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setCustomersData(res.data.customerMastList);
      
    });
  };

  useEffect(() => {
    CustomerData();
  }, []);

  const handleContactNo = (e, setState) => {
    const re = /^[0-9\b]+$/;
    if (
      e.target.value === "" ||
      (re.test(e.target.value) && e.target.value.length <= 10)
    ) {
      setState(e.target.value);
    }
  };

  const handleAlternativeNo = (e, setState) => {
    const re = /^[0-9\b]+$/;
    if (
      e.target.value === "" ||
      (re.test(e.target.value) && e.target.value.length <= 10)
    ) {
      setState(e.target.value);
    }
  };

  

  const handleEmailSet = (e, setState) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setState(e.target.value);
    if (re.test(e.target.value) || e.target.value === "") {
      return setEmailIsInvalid(false);
    }
    return setEmailIsInvalid(true);
  };


  
    function getData() {
      axios.get(`${baseUrl}get_list_customer_contact/${customer_id}`).then((res) => {
        const cts = res?.data?.data || []; 
        const count = cts.length;

        setData(res.data.data);
        setFilterData(res.data.data);
        setCount(count);
      });
    }

    useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return (
        d.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.contact_no?.toLowerCase().includes(search.toLowerCase()) ||
        d.alternative_contact_no?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(baseUrl + "add_customer_contact", {
        customer_id: customerName,
        contact_name: contactName,
        contact_no: contactNo,
        alternative_contact_no: alternateContact,
        email_Id: emailId,
        department,
        designation,
        description,
        created_by: userID,
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Contact added successfully");
      })
      .catch((error) => {
        toastError("An error occurred: " + error.message);
      });
  };


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
      name: "Contact Name",
      selector: (row) => row.contact_name,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_no,
      sortable: true,
    },
    {
      name: "Alternative Number",
      selector: (row) => row.alternative_contact_no,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/customer-cont-update/${row?._id}`}>
            <button title="Edit" className="btn btn-outline-primary btn-sm">
              <FaEdit />
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_customer_contact"
            id={row?._id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "20%",
    },
  ];

  return (
    <>
    <div>{count}</div>
    <FormContainer
      mainTitle="Customer Contact"
      title="Add Customer Contact"
      handleSubmit={handleSubmit}
    >
      <div className="form-group col-6">
        <label className="form-label">
          Customer Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersData?.map((option) => ({
            value: option.customer_id,
            label: option.customer_name ,
          }))}
          value={{
            value: customerName,
            label:
            customersData?.find((cust) => cust.customer_id === customerName)
            ?.customer_name || "",
          }}
          onChange={(e) => {
            setCustomerName(e.value);
          }}
          ></Select>
      </div>

      {/* <FieldContainer label="Customer ID" value={customerId} required={true} onChange={(e) => setCustomerId(e.target.value)} /> */}
      <FieldContainer
        label="Contact Name"
        value={contactName}
        required={true}
        onChange={(e) => setContactName(e.target.value)}
      />
      <FieldContainer
        label="Contact No"
        type="number"
        value={contactNo}
        required={true}
        onChange={(e) => handleContactNo(e, setContactNo)}
      />
      <FieldContainer
        label="Alternate Contact"
        type="number"
        value={alternateContact}
        required={false}
        onChange={(e) => handleAlternativeNo(e, setAlternateContact)}
      />
      <FieldContainer
        label="Email ID"
        value={emailId}
        required={false}
        onChange={(e) => handleEmailSet(e,setEmailId )}
      />
      {emailIsInvalid && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Please enter a valid email
          </span>
        )}

      <FieldContainer
        label="Department"
        value={department}
        required={false}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <FieldContainer
        label="Designation"
        value={designation}
        required={false}
        onChange={(e) => setDesignation(e.target.value)}
      />
      <FieldContainer
        label="Description"
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />
    </FormContainer>
      {/* <Link to={`/admin/customer-cont-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: '10px' }}
        >
          Add Contact
        </button>
      </Link> */}
      
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Customer Contacts Overview"
            columns={columns}
            data={filterData}
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

export default CustomerContactDetails;
