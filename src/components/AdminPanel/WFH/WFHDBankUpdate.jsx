import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";

import { baseUrl } from "../../../utils/config";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import FieldContainer from "../FieldContainer";
import IndianBankList from "../../../assets/js/IndianBankList";
import IndianStates from "../../ReusableComponents/IndianStates";
import { useLocation } from "react-router-dom";
import titleimg from "/bg-img.png";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
const WFHDBankUpdate = () => {
  const { user_id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState([]);

  //--------------------Bank Info State Start
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [panNo, setPanNo] = useState("");
  const [isValidPAN, setIsValidPAN] = useState(true);
  //--------------------Bank Info State End

  //--------------------Address Info State Start
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [upi, setUpi] = useState("");
  //--------------------Address Info State End

  const [isRequired, setIsRequired] = useState({
    bankName: false,
    bankAccountNumber: false,
    IFSC: false,
    panNo: false,
    beneficiary: false,
    address: false,
    state: false,
    city: false,
    pincode: false,
    upi: false,
  });

  useEffect(() => {
    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityData(res.data.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      const fetchedData = res.data;
      const {
        bank_name,
        account_no,
        ifsc_code,
        // permanent_city,
        // permanent_address,
        // permanent_state,
        beneficiary,
        permanent_pin_code,
        pan_no,
        upi_Id,
      } = fetchedData;

      setBankName(bank_name);
      setBankAccountNumber(account_no);
      setIFSC(ifsc_code);
      // setCity(permanent_city);
      // setAddress(permanent_address);
      // setState(permanent_state);
      setBeneficiary(beneficiary);
      setPincode(permanent_pin_code);
      setPanNo(pan_no);
      setUpi(upi_Id);
    });
  }, []);

  const handleSubmit = async () => {
    if (bankName == "") {
      setIsRequired((perv) => ({ ...perv, bankName: true }));
    }
    if (bankAccountNumber == "") {
      setIsRequired((perv) => ({ ...perv, bankAccountNumber: true }));
    }
    if (IFSC == "") {
      setIsRequired((perv) => ({ ...perv, IFSC: true }));
    }
    
    if (beneficiary == "") {
      setIsRequired((perv) => ({ ...perv, beneficiary: true }));
    }
    // if (address == "") {
    //   setIsRequired((perv) => ({ ...perv, address: true }));
    // }
    // if (state == "") {
    //   setIsRequired((perv) => ({ ...perv, state: true }));
    // }
    // if (city == "") {
    //   setIsRequired((perv) => ({ ...perv, city: true }));
    // }
    if (pincode == "") {
      setIsRequired((perv) => ({ ...perv, pincode: true }));
    }
    if (upi == "") {
      setIsRequired((perv) => ({ ...perv, upi: true }));
    }

    if (!bankName || bankName == "") {
      return toastError("Please fill all Required field");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("Please fill all Required field");
    } else if (!IFSC || IFSC == "") {
      return toastError("Please fill all Required field");
    }
    // else if (!city || city == "") {
    //   return toastError("Please fill all Required field");
    // } else if (!address || address == "") {
    //   return toastError("Please fill all Required field");
    // } else if (!state || state == "") {
    //   return toastError("Please fill all Required field");
    // }
    //  else if (!pincode || pincode == "") {
    //   return toastError("Please fill all Required field");
    // }
    try {
      const response = axios.put(baseUrl + "update_user", {
        user_id: user_id,
        bank_name: bankName,
        account_no: bankAccountNumber,
        ifsc_code: IFSC,
        beneficiary: beneficiary,
        // permanent_city: city,
        // permanent_address: address,
        // permanent_state: state,
        permanent_pin_code: Number(pincode),
        pan_no: panNo,
        upi_Id: upi,
      });

      navigate("/admin/wfhd-overview");
      toastAlert("Details Updated");
    } catch (error) {
      console.error("Error submitting documents", error);
    } finally {
      console.log("");
    }
  };
  const handlePANChange = (e) => {
    const inputPAN = e.target.value.toUpperCase();
    setPanNo(inputPAN.slice(0, 10));

    if (inputPAN === "") {
      setIsRequired((prev) => ({
        ...prev,
        panNo: true,
      }));
    } else {
      setIsRequired((prev) => ({
        ...prev,
        panNo: false,
      }));
    }

    // Validate PAN when input changes
    const isValid = validatePAN(inputPAN);
    setIsValidPAN(isValid);
  };
  // Function to validate PAN
  const validatePAN = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan);
  };
  const location = useLocation();
  const activeLink = location.pathname;
  return (
    <>
      <div className={`documentarea`}>
        <div className="document_box master-card-css">
          <div className="form-heading">
            <img className="img-bg" src={titleimg} alt="" width={160} />
            <div className="form_heading_title">
              <h1>Bank Details & Address</h1>
              <div className="pack">
                <i class="bi bi-house"></i>{" "}
                {activeLink.slice(1).charAt(0).toUpperCase() +
                  activeLink.slice(2)}
              </div>
            </div>
            {/* <Link to={`/admin/kra/${userId}`}>
            <button type="button" className="btn btn-outline-primary btn-sm">
              KRA
            </button>
          </Link> */}
          </div>
          <div className="card body-padding">
            <div className="row mt-5">
              <div className="form-group col-3">
                <label className="form-label">
                  Bank Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={IndianBankList}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : null;
                    setBankName(value);
                    setIsRequired((prev) => ({
                      ...prev,
                      bankName: value === null || value === "",
                    }));
                  }}
                  isClearable
                  isSearchable
                  value={
                    bankName
                      ? IndianBankList.find((bank) => bank.value === bankName)
                      : null
                  }
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
                {isRequired.bankName && (
                  <p className="form-error">Please Enter Bank Name</p>
                )}
              </div>
              <div className="col-3">
                <FieldContainer
                  label="Bank Account Number"
                  astric={true}
                  fieldGrid={3}
                  maxLength={17}
                  value={bankAccountNumber}
                  // onChange={(e) => setBankAccountNumber(e.target.value)}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const onlyNumbers = /^[0-9]+$/;

                    if (
                      onlyNumbers.test(inputValue) &&
                      inputValue.length <= 17
                    ) {
                      setBankAccountNumber(inputValue);
                    } else if (inputValue === "") {
                      setBankAccountNumber("");
                    }
                    if (inputValue === "") {
                      setIsRequired((prev) => ({
                        ...prev,
                        bankAccountNumber: true,
                      }));
                    } else {
                      setIsRequired((prev) => ({
                        ...prev,
                        bankAccountNumber: false,
                      }));
                    }
                  }}
                />
                {isRequired.bankAccountNumber && (
                  <p className="form-error">Please Enter Bank Account Number</p>
                )}
              </div>
              <div className="col-3">
                <FieldContainer
                  astric={true}
                  label="IFSC"
                  fieldGrid={3}
                  value={IFSC}
                  onChange={(e) => {
                    const inputValue = e.target.value.toUpperCase();
                    setIFSC(inputValue.slice(0, 11));
                    if (inputValue === "") {
                      setIsRequired((prev) => ({
                        ...prev,
                        IFSC: true,
                      }));
                    } else {
                      setIsRequired((prev) => ({
                        ...prev,
                        IFSC: false,
                      }));
                    }
                  }}
                />
                {isRequired.IFSC && (
                  <p className="form-error">Please Enter IFSC</p>
                )}
              </div>
              <div className="col-3">
                <FieldContainer
                  label="PAN No"
                  fieldGrid={3}
                  value={panNo}
                  onChange={handlePANChange}
                />
                {!isValidPAN && (
                  <span style={{ color: "red" }}>PAN is not valid</span>
                )}
                {/* {isRequired.panNo && (
                  <p className="form-error">Please Enter PAN No.</p>
                )} */}
              </div>
              <FieldContainer
                label="Beneficiary"
                value={beneficiary}
                fieldGrid={3}
                onChange={(e) => setBeneficiary(e.target.value)}
              />
              {/* <div className="col-3">
                <FieldContainer
                  label="Address"
                  astric
                  fieldGrid={3}
                  value={address}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAddress(value);

                    if (value === "") {
                      setIsRequired((prev) => ({
                        ...prev,
                        address: true,
                      }));
                    } else {
                      setIsRequired((prev) => ({
                        ...prev,
                        address: false,
                      }));
                    }
                  }}
                />
                {isRequired.address && (
                  <p className="form-error">Please Enter Address</p>
                )}
              </div> */}
              {/* <div className="form-group col-3">
                <label className="form-label">State</label>
                <IndianStatesMui
                  selectedState={state}
                  onChange={(option) => {
                    const value = option;
                    setState(option ? option : null);
                    setIsRequired((prev) => ({
                      ...prev,
                      state: value === null || value === "",
                    }));
                  }}
                />
                {isRequired.state && (
                  <p className="form-error">Please Enter State</p>
                )}
              </div>
              <div className="form-group col-3">
                <label className="form-label">City</label>
                <IndianCitiesMui
                  selectedState={state}
                  selectedCity={city}
                  onChange={(option) => {
                    const value = option;
                    setCity(option ? option : null);
                    setIsRequired((prev) => ({
                      ...prev,
                      city: value === null || value === "",
                    }));
                  }}
                />
                {isRequired.city && (
                  <p className="form-error">Please Enter City</p>
                )}
              </div>
              <div className="col-3">
                <FieldContainer
                  label="Pincode"
                  type="number"
                  astric={true}
                  fieldGrid={3}
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,6}$/.test(value)) {
                      setPincode(value);
                    }
                    if (e.target.value === "") {
                      setIsRequired((prev) => ({
                        ...prev,
                        pincode: true,
                      }));
                    } else {
                      setIsRequired((prev) => ({
                        ...prev,
                        pincode: false,
                      }));
                    }
                  }}
                />
                {isRequired.pincode && (
                  <p className="form-error">Please Enter Pincode</p>
                )}
              </div> */}
              <FieldContainer
                label="Upi Id"
                type="text"
                astric={false}
                fieldGrid={3}
                maxLength={6}
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WFHDBankUpdate;
