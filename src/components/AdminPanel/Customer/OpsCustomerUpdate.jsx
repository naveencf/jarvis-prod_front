import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../../Context/Context';
import FieldContainer from '../FieldContainer';
import FormContainer from '../FormContainer';
import { baseUrl } from '../../../utils/config';
import jwtDecode from 'jwt-decode';
import { Navigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const OpsCustomerUpdate = () => {
  const { id } = useParams();
  console.log('id: ', id);
 const { usersDataContext, toastAlert, toastError } = useGlobalContext();
   const [customerName, setCustomerName] = useState('');
  const [customerTypeName, setCustomerTypeName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [ownershipName, setOwnershipName] = useState("");
  const [industryName, setIndustryName] = useState("");
  const [accountOwnerName, setAccountOwnerName] = useState("");
  const [parentAccountName, setParentAccountName] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [primaryContactNo, setPrimaryContactNo] = useState("");
  const [alternativeNo, setAlternativeNo] = useState("");
  const [email, setEmail] = useState("");
  const [companySize, setCompanySize] = useState("");
  //console.log(companySize,"new ");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [howManyOffices, setHowManyOffices] = useState("");
  const [companyPan, setCompanyPan] = useState("");
  const [panImage, setPanImage] = useState("");
  const [gstImage, setGstImage] = useState("");
  const [companyGst, setCompanyGst] = useState("");
  const [gstAddress, setGstAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [connectedOffice, setConnectedOffice] = useState("");
  const [connectedBillingStreet, setConnectedBillingStreet] = useState("");
  const [connectedBillingCity, setConnectedBillingCity] = useState("");
  const [connectedBillingState, setConnectedBillingState] = useState("");
  const [connectedBillingCountry, setConnectedBillingCountry] = useState("");
  const [headOffice, setHeadOffice] = useState("");
  const [headBillingStreet, setHeadBillingStreet] = useState("");
  const [headBillingCity, setHeadBillingCity] = useState("");
  const [headBillingState, setHeadBillingState] = useState("");
  const [headBillingCountry, setHeadBillingCountry] = useState("");
  const [description, setDescription] = useState("");
  const [typeData, setTypeData] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [industryData,setIndustryData]=useState([]);
  //const [singleUserData, setSingleUserData] = useState("");


  
  const companySizeOptions = [
    "0-5",
    "6-10",
    "11-25",
    "26-50",
    "51-100",
    "101-200",
    "201-500",
    "501-1000",
    ">1000"
  ];
  

  // const establishmentYearOptions = [];
//  for (let year = 1950; year <= 2050; year++) {
//   establishmentYearOptions.push({ value: year.toString(), label: year.toString() });

// }
// Define establishmentYearOptions
const establishmentYearOptions = [];
for (let year = 1950; year <= 2050; year++) {
  establishmentYearOptions.push({ value: year.toString(), label: year.toString() });
}

const [parentData, setParentData] = useState([]);
function parentDatas() {
  axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      //console.log(res.data.customerMastList, "rrrr")
      setParentData(res.data.customerMastList);
  });
}

useEffect(() => {
  parentDatas();
}, []);



  const [customersData, setCustomersData] = useState([]);
  const CustomerData = () => {
    axios.get(baseUrl + "get_all_customer_type") 
      .then((res) => {
        setCustomersData(res.data.data);
      });
  };

  useEffect(() => {
    CustomerData();
  }, []);

  const [accountsData, setAccountsData] = useState([]);
  const AccountData = () => {
    axios.get(baseUrl + "get_all_account_type") 
      .then((res) => {
        setAccountsData(res.data.data); 
      });
  };

  useEffect(() => {
    AccountData();
  }, []);

  const [ownershipsData, setOwnershipsData] = useState([]);
  const OwnershipData = () => {
    axios.get(baseUrl + "get_all_ownership")
      .then((res) => {
        setOwnershipsData(res.data.data);
       // setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    OwnershipData();
  }, []);

   const getIndustryInfo= ()=>{
    axios.get(baseUrl + "industry").then((res) => {
      setIndustryData(res.data.result
        )
  console.log(res.data.result
  ,"ddddddd")
  
       });
  }
  useEffect(()=>{
    getIndustryInfo()
},[])


const getData = () => {
    axios.get(baseUrl + "get_all_customer_mast").then((res) => {
      setTypeData(res.data.data);
    });

  };

  useEffect(() => {
    getData();
  }, []);


 const getSingleData = async  () => {      
  const res = await axios.get(`${baseUrl}get_customer_mast/${id}`);
  var data= res.data.data
  setHeadOffice(data[0]?.head_office);
  setCustomerName(data[0]?.customer_name);
  setCustomerTypeName(data[0]?.customer_type_id);
  setAccountName(data[0]?.account_type_id);
  setOwnershipName(data[0]?.ownership_id);
  setIndustryName(data[0]?.industry_id);
  setAccountOwnerName(data[0]?.account_owner_id);
  setParentAccountName(data[0]?.parent_account_id);
  setPrimaryContactNo(data[0]?.primary_contact_no);
  setAlternativeNo(data[0]?.alternative_no);
  setEmail(data[0]?.company_email);
  setCompanySize(data[0]?.company_size);
  setWebsite(data[0]?.website);
  setTurnover(data[0]?.turn_over);
  setEstablishmentYear(data[0]?.establishment_year);
  setEmployeesCount(data[0]?.employees_Count);
  setHowManyOffices(data[0]?.how_many_offices);
  setCompanyPan(data[0]?.company_pan_no);
  setPanImage(data[0]?.pan_upload);
  setGstImage(data[0]?.gst_upload);
  setCompanyGst(data[0]?.company_gst_no);
  setGstAddress(data[0]?.gst_address);
  setPinCode(data[0]?.pin_code);
  setConnectedOffice(data[0]?.connected_office);
  setConnectedBillingStreet(data[0]?.connect_billing_street);
  setConnectedBillingCity(data[0]?.connect_billing_city);
  setConnectedBillingState(data[0]?.connect_billing_state);
  setConnectedBillingCountry(data[0]?.connect_billing_country);
  setHeadOffice(data[0]?.head_office);
  setHeadBillingStreet(data[0]?.head_billing_street);
  setHeadBillingCity(data[0]?.head_billing_city);
  setHeadBillingState(data[0]?.head_billing_state);
  setHeadBillingCountry(data[0]?.head_billing_country);
  setDescription(data[0]?.description);

}

  useEffect(() => {
    getSingleData();
  }, []);


  const handlePrimaryContactNo = (e, setState) => {
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
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (companyPan !== "" && !panRegex.test(companyPan)) {
      toastError("Invalid PAN card number");
      return;
    }
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if(companyGst !== "" && !regex.test(companyGst)) {
      toastError("Invalid GST number");
      return;
    }

    const formData = new FormData();
    formData.append("customer_name", customerName);
    formData.append("customer_type_id", customerTypeName);
    formData.append("account_type_id", accountName);
    formData.append("ownership_id", ownershipName);
    formData.append("industry_id", industryName);
    formData.append("account_owner_id", accountOwnerName);
    formData.append("parent_account_id", parentAccountName);
    formData.append("primary_contact_no", primaryContactNo);
    formData.append("alternative_no", alternativeNo);
    formData.append("company_size", companySize);
    formData.append("company_email", email);
    formData.append("website", website);
    formData.append("turn_over", turnover);
    formData.append("establishment_year", establishmentYear);
    formData.append("employees_Count", employeesCount);
    formData.append("how_many_offices", howManyOffices);
    formData.append("company_pan_no", companyPan);
    formData.append("pan_upload", panImage);
    formData.append("company_gst_no", companyGst);
    formData.append("gst_upload", gstImage);
    formData.append("gst_address", gstAddress);
    formData.append("pin_code", pinCode);
    formData.append("connected_office", connectedOffice);
    formData.append("connected_billing_street", connectedBillingStreet);
    formData.append("connected_billing_city", connectedBillingCity);
    formData.append("connected_billing_state", connectedBillingState);
    formData.append("connected_billing_country", connectedBillingCountry);
    formData.append("head_office", headOffice);
    formData.append("head_billing_street", headBillingStreet);
    formData.append("head_billing_city", headBillingCity);
    formData.append("head_billing_state", headBillingState);
    formData.append("head_billing_country", headBillingCountry);
    formData.append("description", description);

    formData.append("created_by", userID);

    axios.put(`${baseUrl}update_customer_mast/${id}`, formData).then(() => {
      setIsFormSubmitted(true);
      toastAlert("Customer updated successfully");
    });
  };

 
  if (isFormSubmitted) {
    return <Navigate to="/admin/ops-customer-overview" />;
  }


  return (
    <>
     <FormContainer
        mainTitle="Customer Master"
        title="Customer Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Customer Name *"
          value={customerName}
          required={true}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Customer Type Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={customersData.map((option) => ({
              value: option._id,
              label: option.customer_type_name,
            }))}
            value={{
              value: customerTypeName,
              label:
              customersData?.find((cust) => cust._id === customerTypeName)?.customer_type_name || "",
            }}
            onChange={(e) => {
              setCustomerTypeName(e.value);
            }}
          ></Select>
        </div>

         
          <div className="form-group col-6">
          <label className="form-label">
            Account Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={accountsData.map((option) => ({
              value: option._id,
              label: option.account_type_name,
            }))}
            value={{
              value: accountName,
              label:
              accountsData?.find((acc) => acc._id === accountName)?.account_type_name || "",
            }}
            onChange={(e) => {
              setAccountName(e.value);
            }}
          ></Select>
        </div>


         <div className="form-group col-6">
          <label className="form-label">
            Ownership Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={ownershipsData.map((option) => ({
              value: option._id,
              label: option.ownership_name,
            }))}
            value={{
              value: ownershipName,
              label:
              ownershipsData?.find((own) => own._id === ownershipName)?.ownership_name || "",
            }}
            onChange={(e) => {
              setOwnershipName(e.value);
            }}
          ></Select>
        </div>


        
         <div className="form-group col-6">
          <label className="form-label">
            Industry Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={industryData?.map((option) => ({
              value: option._id,
              label: option.name,
            }))}
            value={{
              value: industryName,
              label:
              industryData?.find((ind) => ind._id === industryName)?.name || "",
            }}
            onChange={(e) => {
              setIndustryName(e.value);
            }}
          ></Select>
        </div>


        
         <div className="form-group col-6">
          <label className="form-label">
            Account Owner Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={usersDataContext.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            value={{
              value: accountOwnerName,
              label:
              usersDataContext?.find((acc) => acc.user_id === accountOwnerName)?.user_name || "",
            }}
            onChange={(e) => {
              setAccountOwnerName(e.value);
            }}
          ></Select>
        </div>


          {/* <FieldContainer
          label="Parent Account "
          value={parentAccountName}
          required={false}
          type="number"
          onChange={(e) => setParentAccountName(e.target.value)}
        /> */}

         <div className="form-group col-6">
          <label className="form-label">
            Parent Account Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={parentData.map((option) => ({
              value: option.customer_id,
              label: option.customer_name,
            }))}
            value={{
              value: parentAccountName,
              label:
              parentData?.find((acc) => acc.customer_id === parentAccountName)?.customer_name || "",
            }}
            onChange={(e) => {
              setParentAccountName(e.value);
            }}
          ></Select>
        </div>



        <div className="form-group col-6">
        <label className="form-label">
        Company Size <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
        options={companySizeOptions.map((option) => ({ value: option, label: option }))}
        value={{ value: companySize, label: companySize }}
       // onChange={(selectedOption) => setCompanySize(selectedOption.value.toString())}
       onChange={(selectedOption) => setCompanySize(selectedOption.value.toString())}
        />
       </div>

         <FieldContainer
          label="Primary Contact No. *"
          type="number"
          value={primaryContactNo}
          required={true}
          onChange={(e) => handlePrimaryContactNo(e, setPrimaryContactNo )}
        />

        <FieldContainer
          label="Alternate Mobile"
          type="number"
          inputValue="maxLength"
          value={alternativeNo}
          required={false}
          onChange={(e) => handleAlternativeNo(e, setAlternativeNo)}
        />

        <FieldContainer
          label="Email *"
          value={email}
          required={false}
          type="email"
          onChange={(e) => handleEmailSet(e, setEmail )}
        />
        {emailIsInvalid && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Please enter a valid email
          </span>
        )}

          <FieldContainer
          label="Website"
          value={website}
          required={false}
          onChange={(e) => setWebsite(e.target.value)}
        />
        
        <div className="form-group col-6">
        <label className="form-label">
        Establishment Year <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
        options={establishmentYearOptions}
        //  value={establishmentYear}
        value={{
          value: establishmentYear,
          label: `${establishmentYear}`,
        }}
        onChange={(e) => setEstablishmentYear(e.value)}
        />
        </div>

        <FieldContainer
          label="Employees Count"
          type="number"
          value={employeesCount}
          required={false}
          onChange={(e) => setEmployeesCount(e.target.value)}
        />
        
         <FieldContainer
          label="PAN"
          value={companyPan}
          required={false}
          onChange={(e) => setCompanyPan((e.target.value).toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="PAN Image"
          onChange={(e) => setPanImage(e.target.files[0])}
        />

        <FieldContainer
          label="GST"
          value={companyGst}
          onChange={(e) => setCompanyGst((e.target.value).toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="Gst Image"
          onChange={(e) => setGstImage(e.target.files[0])}
        />

        <FieldContainer 
        label="GST Address" 
        value={gstAddress} 
        onChange={(e) => setGstAddress(e.target.value)} />

         <FieldContainer
          label="Turnover (in cr)"
          type="number"
          value={turnover}
          required={false}
          onChange={(e) => setTurnover(e.target.value)}
        />
        
         <FieldContainer
          label="How many offices?"
          type="number"
          value={howManyOffices}
          required={false}
          onChange={(e) => setHowManyOffices(e.target.value)}
        />

        <FieldContainer
        label="Connected Office"
        value={connectedOffice}
        required={false}
        onChange={(e) => setConnectedOffice(e.target.value)}
      />

      <FieldContainer
        label="Connected Billing Street"
        value={connectedBillingStreet}
        required={false}
        onChange={(e) => setConnectedBillingStreet(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing City"
        value={connectedBillingCity}
        required={false}
        onChange={(e) => setConnectedBillingCity(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing State"
        value={connectedBillingState}
        required={false}
        onChange={(e) => setConnectedBillingState(e.target.value)}
      />
      <FieldContainer
        label="Connected Billing Country"
        value={connectedBillingCountry}
        required={false}
        onChange={(e) => setConnectedBillingCountry(e.target.value)}
      />
      <FieldContainer
        label="Head Office"
        value={headOffice}
        required={false}
        onChange={(e) => setHeadOffice(e.target.value)}
      />
      <FieldContainer
        label="Head Billing Street"
        value={headBillingStreet}
        required={false}
        onChange={(e) => setHeadBillingStreet(e.target.value)}
      />
      <FieldContainer
        label="Head Billing City"
        value={headBillingCity}
        required={false}
        onChange={(e) => setHeadBillingCity(e.target.value)}
      />
      <FieldContainer
        label="Head Billing State"
        value={headBillingState}
        required={false}
        onChange={(e) => setHeadBillingState(e.target.value)}
      />
      <FieldContainer
        label="Head Billing Country"
        value={headBillingCountry}
        required={false}
        onChange={(e) => setHeadBillingCountry(e.target.value)}
      />
      <FieldContainer 
      label="Pin Code" 
      type="number" 
      value={pinCode} 
      onChange={(e) => setPinCode(e.target.value)} />

      <FieldContainer
        label="Description"
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />
     </FormContainer>    </>
  );
};

export default OpsCustomerUpdate;
