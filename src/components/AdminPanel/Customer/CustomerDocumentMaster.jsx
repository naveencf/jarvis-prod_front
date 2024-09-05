import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Navigate } from "react-router-dom";

const CustomerDocumentMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
 const [customerName, setCustomerName] = useState("");
 const [docName, setDocName] = useState(""); 
  const [docFile, setDocFile] = useState("");
  const [docNo, setDocNo] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [customersDoc, setCustomersDoc] = useState([]);
  const getData = () => {
    axios.get(baseUrl + "get_all_doc_mast") 
      .then((res) => {
        console.log(res.data.data);
      
        setCustomersDoc(res?.data?.data); 
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const [customersData, setCustomersData] = useState([]);
  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setCustomersData(res.data.customerMastList);
    });
  };

  useEffect(() => {
    CustomerData();
  }, []);


 

  useEffect(() => {
    CustomerData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(customerName, "customerName");
    const formData = new FormData();
    formData.append("customer_id", customerName);
    formData.append("doc_id", docName);
    formData.append("doc_upload", docFile);
    formData.append("doc_no", docNo);
    formData.append("description", description);
    formData.append("created_by", userID);

    axios
      .post(baseUrl + "add_customer_document", formData)
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Contact added successfully");
      })
      .catch((error) => {
        toastError("An error occurred: " + error.message);
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/customer-document-overview" />;
  }

  return (
    <FormContainer
      mainTitle="Customer Document"
      title="Add Customer Document"
      handleSubmit={handleSubmit}
    >
      <div className="form-group col-6">
        <label className="form-label">
          Customer Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersData?.map((option) => ({
            value: option.customer_id,
            label: option.customer_name,
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
     
      <div className="form-group col-6">
        <label className="form-label">
          Doc Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={customersDoc?.map((option) => ({
            value: option?._id,
            label: option?.doc_name ,
          }))}
          value={{
            value: docName,
            label:
            customersDoc?.find((doc) => doc._id === docName)
                ?.doc_name || "",
          }}
          onChange={(e) => {
            setDocName(e.value);
          }}
        ></Select>
      </div>

      <FieldContainer
        type="file"
        label="Doc File"
        required={true}
        onChange={(e) => setDocFile(e.target.files[0])}
      />
      <FieldContainer
        label="Doc No"
        type="number"
        value={docNo}
        required={false}
        onChange={(e) => setDocNo(e.target.value)}
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

export default CustomerDocumentMaster;
