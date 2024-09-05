import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Navigate } from "react-router-dom";

const CustomerContMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [customerName, setCustomerName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [emailId, setEmailId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);


  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  
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

  if (isFormSubmitted) {
    return <Navigate to="/admin/customer-cont-overview" />;
  }

  return (
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
  );
};

export default CustomerContMaster;
