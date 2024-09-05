import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";


const VendorEdit = () => {
  const [cycleName, setCycleName] = useState("");
  const [description, setDescription] = useState("");

  const { toastAlert, toastError } = useGlobalContext();
  const [vendorName, setVendorName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [email, setEmail] = useState("");
  const [perAddress, setPerAddress] = useState("");
  const [pan, setPan] = useState("");
  const [panImage, setPanImage] = useState("");
  const [gstImage, setGstImage] = useState("");
  const [gst, setGst] = useState("");
  const [compName, setCompName] = useState("");
  const [compAddress, setCompAddress] = useState("");
  const [compCity, setCompCity] = useState("");
  const [compPin, setCompPin] = useState(0);
  const [compState, setCompState] = useState("");
  const [limit, setLimit] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeState, setHomeState] = useState("");
  const [typeId, setTypeId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [payId, setPayId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [typeData, setTypeData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [payData, setPayData] = useState([]);
  const [cycleData, setCycleData] = useState([]);
  const [panImglink, setPanImglink] = useState("");
  const [gstImglink, setGstImglink] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Theme Page");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [whatsappLink, setWhatsappLink] = useState([]);
  const [bankRows, setBankRows] = useState([
    {
      bankName: "",
      accountType: "",
      accountNo: "",
      ifscCode: "",
      UPIid: "",
      registeredMobileNo: "",
    },
  ]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { _id } = useParams();
  const getData = () => {
    axios.get(baseUrl + "vendorAllData").then((res) => {
      // console.log(_id, "id");
      // console.log(res.data.tmsVendorkMastList.filter((e) => e._id === _id), "data");
      const data = res.data.tmsVendorkMastList.filter((e) => e._id === _id);
      // console.log(data, "data");
      setVendorName(data[0].vendorMast_name);
      setCountryCode(data[0].country_code);
      setMobile(data[0].mobile);
      setAltMobile(data[0].alternate_mobile);
      setEmail(data[0].email);
      setPerAddress(data[0].personal_address);
      setPan(data[0].pan_no);
      setPanImage(data[0].upload_pan_image);
      setGstImage(data[0].upload_gst_image);
      setGst(data[0].gst_no);
      setCompName(data[0].company_name);
      setCompAddress(data[0].company_address);
      setCompCity(data[0].company_city);
      setCompPin(data[0].company_pincode);
      setCompState(data[0].company_state);
      setLimit(data[0].threshold_limit);
      setHomeAddress(data[0].home_address);
      setHomeCity(data[0].home_city);
      setHomeState(data[0].home_state);
      setTypeId(data[0].type_id);
      setPlatformId(data[0].platform_id);
      setPayId(data[0].payMethod_id);
      setCycleId(data[0].cycle_id);
      setPanImglink(data[0].upload_pan_image);
      setGstImglink(data[0].upload_gst_image);
      setBankName(data[0].bank_name);
      setAccountType(data[0].account_type);
      setAccountNo(data[0].account_no);
      setIfscCode(data[0].ifsc_code);
      setUpiId(data[0].upi_id);
      setWhatsappLink(data[0].whatsapp_link);
      setVendorCategory(data[0].vendor_category);
    });

    axios.get(baseUrl + "getAllVendor").then((res) => {
      setTypeData(res.data.data);
    });

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
      // console.log(platformId, "platformId");
      // console.log( res.data.data.filter((e) => e._id), "platform" );
    });

    axios.get(baseUrl + "getAllPay").then((res) => {
      setPayData(res.data.data);
    });

    axios.get(baseUrl + "getAllPayCycle").then((res) => {
      setCycleData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  // useEffect(()=>{
  //   if(payData.find((role) => role._id === payId)?.payMethod_name ===
  //   "Bank Details"){
  //     setBankName('')
  //     setAccountType('')
  //     setAccountNo('')
  //     setIfscCode('')
  //   }
  // },[payId])

  const handleRemarkChange = (i, value) => {
    const remark = [...whatsappLink];
    remark[i].remark = value;
    setWhatsappLink(remark);
  };

  const handleLinkChange = (index, newValue) => {
    let link = [...whatsappLink];
    link[index].link = newValue;
    setWhatsappLink(link);
  };

  const removeLink = (index) => {
    return () => {
      const updatedLinks = whatsappLink.filter((link, i) => i !== index);
      setWhatsappLink(updatedLinks);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorName) {
      toastError("Please enter vendor name");
      return;
    } else if (!countryCode) {
      toastError("Please enter country code");
      return;
    } else if (!mobile) {
      toastError("Please enter mobile number");
      return;
    } else if (!email) {
      toastError("Please enter email");
      return;
    } else if (!typeId) {
      toastError("Please select vendor type");
      return;
    } else if (!platformId) {
      toastError("Please select platform");
      return;
    } else if (!payId) {
      toastError("Please select payment method");
      return;
    } else if (!cycleId) {
      toastError("Please select pay cycle");
      return;
    }
    const formData = new FormData();
    formData.append("vendorMast_name", vendorName);
    formData.append("country_code", countryCode);
    formData.append("mobile", mobile);
    formData.append("alternate_mobile", altMobile ? altMobile : "");
    formData.append("email", email);
    formData.append("personal_address", perAddress);
    formData.append("pan_no", pan);
    formData.append("upload_pan_image", panImage);
    formData.append("upload_gst_image", gstImage);
    formData.append("gst_no", gst);
    formData.append("company_name", compName);
    formData.append("company_address", compAddress);
    formData.append("company_city", compCity);
    formData.append("company_pincode", compPin ? Number(compPin) : 0);
    formData.append("company_state", compState);
    formData.append("threshold_limit", limit);
    formData.append("home_address", homeAddress);
    formData.append("home_city", homeCity);
    formData.append("home_state", homeState);
    formData.append("type_id", typeId);
    formData.append("platform_id", platformId);
    formData.append("payMethod_id", payId);
    formData.append("cycle_id", cycleId);
    formData.append("created_by", userID);
    formData.append("vendor_category", vendorCategory);
    formData.append("whatsapp_link", JSON.stringify(whatsappLink));

    if (bankName) {
      formData.append("bank_name", bankName);
      formData.append("account_type", accountType);
      formData.append("account_no", Number(accountNo));
      formData.append("ifsc_code", ifscCode);
    } else {
      formData.append("bank_name", "");
      formData.append("account_type", "");
      formData.append("account_no", "");
      formData.append("ifsc_code", "");
    }

    if (upiId) {
      formData.append("upi_id", upiId);
    } else {
      formData.append("upi_id", "");
    }
    axios
      .put(baseUrl + `updateVendorMast/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
        setCycleName("");
        setDescription("");
        getData();
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  const handlePanChange = (e) => {
    const inputValue = e.target.value.toUpperCase();

    setPan(inputValue);
    // Validate PAN format
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (!panRegex.test(inputValue)) {
      toastError("Please enter a valid PAN number");
    }
  };


  const handleBankNameChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].bankName = e.target.value;
    setBankRows(updatedRows);
  };

  const handleAccountTypeChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].accountType = e.value;
    setBankRows(updatedRows);
  };

  const handleAccountNoChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].accountNo = e.target.value;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].ifscCode = e.target.value;
    setBankRows(updatedRows);
  };

  const handleUPIidChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].UPIid = e.target.value;
    setBankRows(updatedRows);
  };

  const handleRegisteredMobileChange = (e, i) => {
    if (e.target.value.length > 10) {
      return;
    }
    const updatedRows = [...bankRows];
    updatedRows[i].registeredMobileNo = e.target.value;
    setBankRows(updatedRows);
  };

  const handleAddBankInfoRow = () => {
    setBankRows([
      ...bankRows,
      {
        bankName: "",
        accountType: "",
        accountNo: "",
        ifscCode: "",
        UPIid: "",
        registeredMobileNo: "",
      },
    ]);
  };

  const handleRemoveBankInfoRow = (index) => {
    return () => {
      const updatedRows = bankRows.filter((row, i) => i !== index);
      setBankRows(updatedRows);
    };
  };

  return (
    <>
      <FormContainer
        mainTitle="Vendor Edit"
        title="Vendor Edit"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Vendor Name *"
          value={vendorName}
          required={true}
          onChange={(e) => setVendorName(e.target.value)}
        />
        <div className="form-group col-6">
          <label className="form-label">
            Vendor Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Theme Page", "Influancer"].map((option) => ({
              label: option,
              value: option,
            }))}
            required={true}
            value={{
              value: vendorCategory,
              label: vendorCategory,
            }}
            onChange={(e) => {
              setVendorCategory(e.value);
            }}
          ></Select>
        </div>

        <FieldContainer
          label="Country Code *"
          value={countryCode}
          required={true}
          onChange={(e) => setCountryCode(e.target.value)}
        />

        <FieldContainer
          label="Mobile *"
          value={mobile}
          required={true}
          onChange={(e) => setMobile(e.target.value)}
        />

        <FieldContainer
          label="Alternate Mobile"
          value={altMobile}
          required={false}
          onChange={(e) => setAltMobile(e.target.value)}
        />

        <FieldContainer
          label="Email *"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FieldContainer
          label="Personal Address"
          value={perAddress}
          required={false}
          onChange={(e) => setPerAddress(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Vendor Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={typeData?.map((option) => ({
              value: option._id,
              label: option.type_name,
            }))}
            value={{
              value: typeId,
              label:
                typeData?.find((role) => role._id === typeId)?.type_name || "",
            }}
            onChange={(e) => {
              setTypeId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Platform <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            value={{
              value: platformId,
              label:
                platformData.find((role) => role._id === platformId)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlatformId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Payment Method <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={payData.map((option) => ({
              value: option._id,
              label: option.payMethod_name,
            }))}
            value={{
              value: payId,
              label:
                payData.find((role) => role._id === payId)?.payMethod_name ||
                "",
            }}
            onChange={(e) => {
              setPayId(e.value);
            }}
          ></Select>
        </div>

        {bankRows.map((row, i) => (
          <>
            <FieldContainer
              label="Bank Name "
              value={bankRows[i].bankName}
              onChange={(e) => handleBankNameChange(e, i)}
            />

            <div className="form-group col-6">
              <label className="form-label">Account Type</label>
              <Select
                options={["Savings", "Current"].map((option) => ({
                  label: option,
                  value: option,
                }))}
                required={true}
                value={{
                  value: bankRows[i].accountType,
                  label: bankRows[i].accountType,
                }}
                onChange={(e) => {
                  handleAccountTypeChange(e, i);
                }}
              />
            </div>

            <FieldContainer
              label="Account Number "
              value={bankRows[i].accountNo}
              onChange={(e) => handleAccountNoChange(e, i)}
            />

            <FieldContainer
              label="IFSC "
              value={bankRows[i].ifscCode}
              onChange={(e) => handleIFSCChange(e, i)}
            />

            <FieldContainer
              label="UPI ID "
              value={bankRows[i].UPIid}
              onChange={(e) => handleUPIidChange(e, i)}
            />

            <FieldContainer
              label={"Registered Mobile Number"}
              value={bankRows[i].registeredMobileNo}
              required={false}
              type="number"
              onChange={(e) => handleRegisteredMobileChange(e, i)}
            />

            {i > 0 && (
              <IconButton
                onClick={handleRemoveBankInfoRow(i)}
                variant="contained"
                color="error"
              >
                <RemoveCircleTwoToneIcon />
              </IconButton>
            )}
          </>
        ))}

        <div className="row">
          <IconButton
            onClick={handleAddBankInfoRow}
            variant="contained"
            color="primary"
          >
            <AddCircleTwoToneIcon />
          </IconButton>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Pay Cycle <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={cycleData.map((option) => ({
              value: option._id,
              label: option.cycle_name,
            }))}
            value={{
              value: cycleId,
              label:
                cycleData.find((role) => role._id === cycleId)?.cycle_name ||
                "",
            }}
            onChange={(e) => {
              setCycleId(e.value);
            }}
          ></Select>
        </div>

        <FieldContainer
          label="PAN"
          value={pan}
          required={false}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="PAN Image"
          // value={panImage.files}
          // value={panImage}
          required={false}
          onChange={handlePanChange}
        />

        <FieldContainer
          label="GST"
          value={gst}
          required={false}
          onChange={(e) => setGst(e.target.value.toUpperCase())}
        />
        <FieldContainer
          type="file"
          label="Gst Image"
          // value={gstImage}
          required={false}
          onChange={(e) => setGstImage(e.target.files[0])}
        />

        <FieldContainer
          label="Company Name"
          value={compName}
          required={false}
          onChange={(e) => setCompName(e.target.value)}
        />

        <FieldContainer
          label="Company Address"
          value={compAddress}
          required={false}
          onChange={(e) => setCompAddress(e.target.value)}
        />

        <FieldContainer
          label="Company City"
          value={compCity}
          required={false}
          onChange={(e) => setCompCity(e.target.value)}
        />

        <FieldContainer
          label="Company Pincode"
          value={compPin}
          required={false}
          onChange={(e) => setCompPin(e.target.value)}
        />

        <FieldContainer
          label="Company State"
          value={compState}
          required={false}
          onChange={(e) => setCompState(e.target.value)}
        />

        <FieldContainer
          label="Threshold Limit"
          value={limit}
          required={false}
          type="number"
          onChange={(e) => setLimit(e.target.value)}
        />

        <FieldContainer
          label="Home Address"
          value={homeAddress}
          required={false}
          onChange={(e) => setHomeAddress(e.target.value)}
        />

        <FieldContainer
          label="Home City"
          value={homeCity}
          required={false}
          onChange={(e) => setHomeCity(e.target.value)}
        />

        <FieldContainer
          label="Home State"
          value={homeState}
          required={false}
          onChange={(e) => setHomeState(e.target.value)}
        />
        {whatsappLink?.map((link, index) => (
          <>
            <FieldContainer
              key={index}
              label={`Whatsapp Link ${index + 1}`}
              value={link.link}
              required={false}
              onChange={(e) => handleLinkChange(index, e.target.value)}
            />
            <FieldContainer
              key={index.remark}
              label={`Remark`}
              value={link.remark}
              required={false}
              onChange={(e) => handleRemarkChange(index, e.target.value)}
            />

            <div className="form-group col-6">
              <label className="form-label">
                Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={["Execution", "Payment"].map((option) => ({
                  label: option,
                  value: option,
                }))}
                required={true}
                value={{
                  value: link.type,
                  label: link.type,
                }}
                onChange={(e) => {
                  let updatedLinks = [...whatsappLink];
                  updatedLinks[index].type = e.value;
                  setWhatsappLink(updatedLinks);
                }}
              ></Select>
            </div>

            {index > 0 && (
              // <Button onClick={removeLink(index)}  icon />

              <IconButton
                size="small"
                sx={{
                  display: "inline",
                }}
                onClick={removeLink(index)}
                color="secondary"
                aria-label="add an alarm"
              >
                <CloseIcon />
              </IconButton>
            )}
          </>
        ))}
        {panImglink?.length > 0 && (
          <img
            style={{ width: "100px", height: "100px" }}
            src={panImglink}
            alt="pan"
          />
        )}
        {gstImglink?.length > 0 && (
          <img
            style={{ width: "100px", height: "100px" }}
            src={gstImglink}
            alt="gst"
          />
        )}
      </FormContainer>
    </>
  );
};

export default VendorEdit;
