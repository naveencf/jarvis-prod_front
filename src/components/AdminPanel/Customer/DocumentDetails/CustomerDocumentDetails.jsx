import React from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from '../../../../Context/Context';
import FieldContainer from '../../FieldContainer';
import { baseUrl } from '../../../../utils/config';
import { useState, useEffect } from "react";
import FormContainer from '../../FormContainer';
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from '../../DeleteButton';


const CustomerDocumentDetails = () => {
   const { customer_id } = useParams();
   console.log(customer_id);
    const { toastAlert, toastError } = useGlobalContext();
   const [customerName, setCustomerName] = useState("");
   const [docName, setDocName] = useState(""); 
    const [docFile, setDocFile] = useState("");
    const [docNo, setDocNo] = useState("");
    const [description, setDescription] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [search, setSearch] = useState("");
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
  
  console.log(documents);
  
  function getDocuments() {
    axios.get(baseUrl + "get_all_customer_document").then((res) => {
       console.log(res.data.data);
       setDocuments(res.data.data);
       setFilteredDocuments(res.data.data);
     });
   }
 
   useEffect(() => {
     getDocuments();
   }, []);

   

   useEffect(() => {
    const result = documents?.filter((doc) => {
      return (
        doc.doc_id?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doc_upload?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doc_no?.toLowerCase().includes(search.toLowerCase()) ||
        doc.description?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredDocuments(result);
  }, [search, documents]);

 
   
    const [customersDoc, setCustomersDoc] = useState([]);
    const getData = () => {
      axios.get(baseUrl + "get_all_doc_mast") 
        .then((res) => {
          setCustomersDoc(res?.data?.data); 
          console.log(res.data.data);
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

  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(customerName, "customerName");
      const formData = new FormData();
      formData.append("customer_name", customerName);
      formData.append("doc_name", docName);
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
          name: "Doc Name",
          selector: (row) => row?.OPS_Doc_Mast?.doc_name,
          sortable: true,
        },
        {
          name: "Doc File",
          selector: (row) =><img style={{height:"80px" , width:"80px"}} target='blank' src={row.doc_upload}  alt="" /> ,
          sortable: true,
        },
        {
          name: "Doc No",
          selector: (row) => row.doc_no,
          sortable: true,
        },
        {
          name: "Description",
          selector: (row) => row.description,
          sortable: true,
        },
        {
          name: "Action",
          cell: (row) => (
            <>
              
              <Link to={`/admin/customer-document-update/${row.customer_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />
                </button>
              </Link>
              <DeleteButton
                endpoint="delete_customer_document"
                id={row._id}
                getData={getDocuments}
              />
            </>
          ),
          allowOverflow: true,
          width: "22%",
        },
      ];
    
  
  return (
    <>
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

<div className="card">
<div className="data_tbl table-responsive">
  <DataTable
    title="Customer Document Overview"
    columns={columns}
    data={filteredDocuments}
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

    // <div>
    //   Customer Document Details
    //   {customer_id}
    // </div>
  )
}

export default CustomerDocumentDetails;
