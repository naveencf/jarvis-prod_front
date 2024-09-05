import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import Select from "react-select";
  
const OpsCustomerMaster = () => {
  const {usersDataContext} = useGlobalContext()
  const { toastAlert, toastError  } = useGlobalContext();
  const [customerName, setCustomerName] = useState("");
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
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [industryData,setIndustryData]=useState([]);

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

  const indianStates = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Dadra and Nagar Haveli", label: "Dadra and Nagar Haveli" },
    { value: "Daman and Diu", label: "Daman and Diu" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Delhi", label: "Delhi" },
    { value: "Puducherry", label: "Puducherry" },
  ];

  
  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Canada", label: "Canada" },
    { value: "China", label: "China" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "India", label: "India" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    // Add more countries as needed
  ];


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
    formData.append("connect_billing_street", connectedBillingStreet);
    formData.append("connect_billing_city", connectedBillingCity);
    formData.append("connect_billing_state", connectedBillingState);
    formData.append("connect_billing_country", connectedBillingCountry);
    formData.append("head_office", headOffice);
    formData.append("head_billing_street", headBillingStreet);
    formData.append("head_billing_city", headBillingCity);
    formData.append("head_billing_state", headBillingState);
    formData.append("head_billing_country", headBillingCountry);
    formData.append("description", description);

    formData.append("created_by", userID);

    axios.post(baseUrl + "add_customer_mast", formData).then(() => {
      setIsFormSubmitted(true);
      toastAlert("Customer added successfully");
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
            Account Type Name <sup style={{ color: "red" }}>*</sup>
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
            Brand Name <sup style={{ color: "red" }}>*</sup>
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
         value={establishmentYearOptions.find(option => option.value === establishmentYear)}
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
          
          <div className="form-group col-6">
        <label className="form-label">
          Connected Billing State
        </label>
        <Select
          options={indianStates}
          value={indianStates.find((option) => option.value === connectedBillingState)}
          onChange={(e) => setConnectedBillingState(e.value)}
        />
         </div>

        <div className="form-group col-6">
      <label className="form-label">
        Connected Billing Country
      </label>
      <Select
        options={countries}
        value={countries.find((option) => option.value === connectedBillingCountry)}
        onChange={(e) => setConnectedBillingCountry(e.value)}
      />
    </div>
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
     </FormContainer>
    </>
  );
};

export default OpsCustomerMaster;
