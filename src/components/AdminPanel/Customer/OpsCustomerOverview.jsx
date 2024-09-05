import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaEdit, FaUserPlus, FaFileAlt } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const OpsCustomerOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  function getData() {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setData(res.data.customerMastList);
      setFilterData(res.data.customerMastList);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return (
        d.customer_type_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.account_type_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.ownership_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.industry_id?.toLowerCase().includes(search.toLowerCase()) ||
        d.account_owner_id?.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "customerTypeName", headerName: "Account Type Name", width: 200 },
    { field: "accountName", headerName: "Brand Name", width: 200 },
    { field: "ownershipName", headerName: "Ownership Name", width: 200 },
    { field: "industryName", headerName: "Industry Name", width: 200 },
    {
      field: "accountOwnerName",
      headerName: "Account Owner Name",
      width: 200,
    },
    { field: "parentAccountName", headerName: "Parent Account Name", width: 200 },
    { field: "primaryContactNo", headerName: "Primary Contact No", width: 200 },
    { field: "alternativeNo", headerName: "Alternative No", width: 200 },
    { field: "companySize", headerName: "Company Size", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "website", headerName: "Website", width: 200 },
    { field: "turnover", headerName: "Turnover", width: 200 },
    { field: "establishmentYear", headerName: "Establishment Year", width: 200 },
    { field: "employeesCount", headerName: "Employees Count", width: 200 },
    { field: "howManyOffices", headerName: "How Many Offices", width: 200 },
    { field: "panNumber", headerName: "PAN Number", width: 150 },
    { field: "gstNumber", headerName: "GST Number", width: 150 },
    { field: "panImage", headerName: "PAN Image", width: 200,renderCell:(({row})=>{
      console.log(row.panImage,"image")
      return <img style={{
        height:"80px",
        width:"80px"
      }}src={row.panImage}/>
      
    }) },
    { field: "gstImage", headerName: "GST Image", width: 200, renderCell:(({row})=>{ 
      console.log(row.gstImage,"image")
      return <img style={{
        height:"80px",
        width:"80px"
      }}src={row.gstImage}/>
      
    }) },
    { field: "gstAddress", headerName: "GST Adress", width: 200 },
    { field: "pinCode", headerName: "Pin Code", width: 200 },
    { field: "connectedOffice", headerName: "Connected Office", width: 200 },
    { field: "connectedBillingStreet", headerName: "Connected Billing Street", width: 200 },
    { field: "connectedBillingCity", headerName: "Connected Billing City", width: 200 },
    { field: "connectedBillingState", headerName: "Connected Billing State", width: 200 },
    { field: "connectedBillingCountry", headerName: "Connected Billing Country", width: 200 },
    { field: "headOffice", headerName: "Head Office", width: 200 },
    { field: "headBillingStreet", headerName: "Head Billing Street", width: 200 },
    { field: "headBillingCity", headerName: "Head Billing City", width: 200 },
    { field: "headBillingState", headerName: "Head Billing State", width: 200 },
    { field: "headBillingCountry", headerName: "Head Billing Country", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
  field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="flexCenter colGap4">
          <Link to={`/admin/customer-contact-details/${params.row.customer_id}`}>
            <button className="btn btn_sm btn-outline-success tableIconBtn">
              <FaUserPlus />
            </button>
          </Link>
          <Link to={`/admin/customer-document-details/${params.row.customer_id}`}>
            <button className="btn btn_sm btn-outline-info tableIconBtn">
              <FaFileAlt />
            </button>
          </Link>
          <Link to={`/admin/ops-customer-update/${params.row._id}`}>
            <button className="btn btn_sm btn-outline-primary tableIconBtn user-button">
              <FaEdit />
            </button>
          </Link>
          <DeleteButton
            endpoint="delete_customer_mast"
            id={params.row._id}
            getData={getData}
          />
        </div>
      ),
    },
  ];

  const rows = filterData.map((data, index) => ({
    id: index + 1,
    customerName: data.customer_name,
    customerTypeName: data?.Customer_type_data?.customer_type_name,
    accountName: data.Account_type_data.account_type_name,
    ownershipName: data.Ownership_data.ownership_name,
    industryName: data.Industry_data.industry_name,
    accountOwnerName: data.account_owner_id_name,
    parentAccountName: data.parent_account_id,
    primaryContactNo: data.primary_contact_no,
    alternativeNo: data.alternative_no,
    companySize: data.company_size,
    email: data.company_email,
    website: data.website,
    turnover: data.turn_over,
    establishmentYear: data.establishment_year,
    employeesCount: data.employees_Count,
    howManyOffices: data.how_many_offices,
    panNumber: data.company_pan_no,
    gstNumber: data.company_gst_no,
    panImage: data.pan_upload,
    gstImage: data.gst_upload,
    gstAddress: data.gst_address,
    pinCode: data.pin_code,
    connectedOffice: data.connected_office,
    connectedBillingStreet: data.connect_billing_street,
    connectedBillingCity: data.connect_billing_city,
    connectedBillingState: data.connect_billing_state,
    connectedBillingCountry: data.connect_billing_country,
    headOffice: data.head_office,
    headBillingStreet: data.head_billing_street,
    headBillingCity: data.head_billing_city,
    headBillingState: data.head_billing_state,
    headBillingCountry: data.head_billing_country,
    description: data.description,

   ...data,
  }));

  return (
    <>
      <div className="d-flex ">
        <Link to={`/admin/ops-customer-mast`}>
          <button
            title="Add"
            className="btn btn-outline-primary mr-2"
            style={{ marginBottom: "10px" }}
          >
            Add Account
          </button>
        </Link>

        <Link to={`/admin/account-type`}>
          <button
            title="Add"
            className="btn btn-outline-primary"
            style={{ marginBottom: "10px" }}
          >
            Add Account Type
          </button>
        </Link>
      </div>

      <div className="card">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OpsCustomerOverview;
