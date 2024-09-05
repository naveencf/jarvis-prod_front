import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate, useNavigate } from "react-router";
import Select from "react-select";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeVendorInfoModal,
  setModalType,
  setShowAddVendorModal,
} from "./../../Store/VendorMaster";
import AddVendorModal from "./AddVendorModal";
import {
  useAddCompanyDataMutation,
  useAddVendorDocumentMutation,
  useAddVendorMutation,
  useGetAllVendorTypeQuery,
  useGetBankNameDetailQuery,
  useGetCountryCodeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
  useGetVendorDocumentByVendorDetailQuery,
  useGetVendorWhatsappLinkTypeQuery,
  useUpdateVenodrMutation,
} from "../../Store/reduxBaseURL";

import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { useParams } from "react-router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import { useGstDetailsMutation } from "../../Store/API/Sales/GetGstDetailApi";
import formatString from "../Operation/CampaignMaster/WordCapital";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const VendorMaster = () => {
  const navigate = useNavigate();
  const { data: countries, isLoading: isCountriesLoading } =
    useGetCountryCodeQuery();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { _id } = useParams();
  const dispatch = useDispatch();
  const isVendorModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );

  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSubmitting2, setIsFormSubmitting2] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [compName, setCompName] = useState("");
  const [compAddress, setCompAddress] = useState("");
  const [compCity, setCompCity] = useState("");
  const [compPin, setCompPin] = useState("");
  const [compState, setCompState] = useState("");
  const [limit, setLimit] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homePincode, setHomePincode] = useState("");
  const [otherCountry, setOtherCountry] = useState("");
  const [homeState, setHomeState] = useState("");
  const [typeId, setTypeId] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [vendorCategory, setVendorCategory] = useState("Theme Page");
  const [whatsappLink, setWhatsappLink] = useState([]);
  const [docDetails, setDocDetails] = useState([]);
  const [sameAsPrevious, setSameAsPrevious] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(230);
  const [company_id, setCompany_id] = useState("");

  const [getGstDetails] = useGstDetailsMutation();

  const [bankRows, setBankRows] = useState([
    {
      payment_method: "666856874366007df1dfacde", // setting bank default to dropdown
      // payment_method: "",
      bank_name: "",
      account_type: "",
      account_number: "",
      ifcs: "",
      upi_id: "",
      registered_number: "",
    },
  ]);
  const [validator, setValidator] = useState({
    vendorName: false,
    countryCode: false,
    mobile: false,
    email: false,
    typeId: false,
    platformId: false,
    payId: false,
    cycleId: false,
    // type: false,
  });

  const [mandatoryFieldsEmpty, setMandatoryFieldsEmpty] = useState({
    mobile: false,
    altMobile: false,
  });

  const [isContactTouched1, setisContactTouched1] = useState(false);

  const { isLoading: typeLoading, data: typeData } = useGetAllVendorTypeQuery();

  const { data: platformData } = useGetPmsPlatformQuery();

  const { data: payData } = useGetPmsPaymentMethodQuery();

  const { data: cycleQueryData } = useGetPmsPayCycleQuery();

  const { data: whatsappLinkType } = useGetVendorWhatsappLinkTypeQuery();
  const cycleData = cycleQueryData?.data;

  const { data: bankNameData } = useGetBankNameDetailQuery();
  const bankName = bankNameData?.data;

  const [addVendor]=useAddVendorMutation();
  const [addCompanyData]=useAddCompanyDataMutation();
  const[addVendorDocument]=useAddVendorDocumentMutation();
  const [updateVendor]=useUpdateVenodrMutation();

  useEffect(() => {
    if (gst?.length === 15) {
      getGstDetails({ gstNo: gst, flag: 1 })
        .then((response) => {
          if (response?.data && response?.data?.success) {
            const { data } = response?.data;
            setCompName(data?.legal_business_name);
            setCompAddress(data?.principal_place_of_business?.split(",")?.[0]);
            const addressParts = data?.principal_place_of_business?.split(",");
            setCompCity(addressParts[2]);
            setCompPin(addressParts[7]);
            setCompState(addressParts[2]);
            setLimit("");
          } else {
            setCompName("");
            setCompAddress("");
            setCompCity("");
            setCompPin("");
            setCompState("");
            setLimit("");
          }
        })
        .catch((error) => {
          console.error("Error fetching GST details:", error);
        });
    }
  }, [gst, getGstDetails]);

  const handleRemarkChange = (i, value) => {
    const remark = [...whatsappLink];
    remark[i].remark = value;
    setWhatsappLink(remark);
  };

  const handleAddVendorTypeClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("Vendor"));
  };

  const handleInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("Vendor"));
  };

  const handleAddPlatformClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("Platform"));
  };

  const handlePlatformInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("Platform"));
  };

  const handleAddPaymentMethodClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("PaymentMethod"));
  };

  const handlePaymentMethodInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("PaymentMethod"));
  };

  const handleAddPayCycleClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("PayCycle"));
  };

  const handlePayCycleInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("PayCycle"));
  };
  // Bank Name:-=> {
  const handleAddBankNameClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("BankName"));
  };
  const handleBankNameInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("BankName"));
  };

  const handleAccountTypeChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].account_type = e.value;
    setBankRows(updatedRows);
  };

  const handleAccountNoChange = (e, i) => {
    if (e.target.value.length > 20) return;
    const updatedRows = [...bankRows];
    updatedRows[i].account_number = e.target.value;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    if (e.target.value.length > 11) return;
    const updatedRows = [...bankRows];
    updatedRows[i].ifcs = e.target.value;
    setBankRows(updatedRows);
  };

  const handleUPIidChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].upi_id = e.target.value;
    setBankRows(updatedRows);
  };

  const handleRegisteredMobileChange = (e, i) => {
    if (e.target.value.length > 10) {
      return;
    }
    const updatedRows = [...bankRows];
    updatedRows[i].registered_number = e.target.value;
    setBankRows(updatedRows);
  };

  const handleLinkChange = (index, newValue) => {
    let link = [...whatsappLink];
    link[index].link = newValue;
    setWhatsappLink(link);
  };

  const handleAddWhatsappGroupLinkTypeClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("WhatsappLinkType"));
  };

  const handleWhatsappGroupLinkTypeInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setModalType("WhatsappLinkType"));
  };

  const { data: venodrDocuments, isLoading: isVendorDocumentsLoading } =
    useGetVendorDocumentByVendorDetailQuery(_id);

  useEffect(() => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUserData(res.data.data);
    });

    if (_id) {
      axios
        .get(baseUrl + `v1/vendor/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const data = res.data.data;
          setUserId(data?.closed_by);
          setVendorName(data?.vendor_name);
          setCountryCode(data?.country_code);
          setMobile(data?.mobile);
          setAltMobile(data?.alternate_mobile);
          setEmail(data?.email);
          setGst(data?.gst_no);
          setCompName(data?.company_name);
          setCompAddress(data?.company_address);
          setCompCity(data?.company_city);
          setCompPin(data?.company_pincode);
          setCompState(data?.company_state);
          setLimit(data?.threshold_limit);
          setHomeAddress(data?.home_address);
          setHomeCity(data?.home_city);
          setHomeState(data?.home_state);
          setTypeId(data?.vendor_type);
          setPlatformId(data?.vendor_platform);
          setCycleId(data?.pay_cycle);
          setHomePincode(data?.home_pincode);
          setVendorCategory(data?.vendor_category??"Theme Page");
        });

      axios
        .get(baseUrl + `v1/bank_details_by_vendor_id/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          const data = res.data.data;
          setBankRows(data);
        });

      axios
        .get(baseUrl + `v1/vendor_group_link_vendor_id/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          const data = res.data?.data;
          setWhatsappLink(data);
        });

      axios
        .get(baseUrl + `v1/company_name_wise_vendor/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
        })
        .then((res) => {
          const data = res.data.data;
          setCompany_id(data?._id);
          // console.log(data, "data");
          setCompName(data?.company_name);
          setCompAddress(data?.address);
          setCompCity(data?.city);
          setCompPin(data?.pincode);
          setCompState(data?.state);
          setLimit(data?.threshold_limit);
        });
    }
  }, [_id]);

  useEffect(() => {
    if (venodrDocuments?.length > 0 && !isVendorDocumentsLoading) {
      let doc = venodrDocuments?.map((doc) => {
        return {
          docName: doc.document_name,
          docNumber: doc.document_no,
          docImage: doc.document_image_upload,
        };
      });
      // console.log(doc, "doc");
      setDocDetails(doc);
    }
  }, [venodrDocuments]);
  const addLink = () => {
    setWhatsappLink([
      ...whatsappLink,
      {
        link: "",
        remark: "",
        type: "",
      },
    ]);
  };
  const addDocDetails = () => {
    setDocDetails([
      ...docDetails,
      {
        docName: "",
        docNumber: "",
        document_image_upload: "",
      },
    ]);
  };

  const handleDocNameChange = (index, newValue) => {
    let doc = [...docDetails];
    doc[index].docName = newValue;
    setDocDetails(doc);
  };

  const handleDocNumberChange = (i, value) => {
    let doc = [...docDetails];
    let docName = doc[i].docName;
    let maxLength = 12;
  
    if (docName === 'Pan card') {
      maxLength = 11;
    } else if (docName === 'GST') {
      maxLength = 15;
    } else if (docName === 'Aadhar Card'){
      maxLength = 16;
    }
    if (value.length > maxLength) {
      alert(`Document Number for ${docName} cannot exceed ${maxLength} digits`);
      return;
    }  
    doc[i].docNumber = value;
    setDocDetails(doc);
  };

  const handleDocImageChange = (i, e) => {
    const file = e.target.files[0];

    let doc = [...docDetails];
    doc[i].docImage = file;
    setDocDetails(doc);
  };

  const removedocLink = (index) => {
    return () => {
      const updatedLinks = docDetails?.filter((link, i) => i !== index);
      setDocDetails(updatedLinks);
    };
  };

  const handleAddBankInfoRow = () => {
    setBankRows([
      ...bankRows,
      {
        payment_method: "",
        bank_name: "",
        account_type: "",
        account_number: "",
        ifcs: "",
        upi_id: "",
        registered_number: "",
      },
    ]);
  };
  const handleRemoveBankInfoRow = (index) => {
    return () => {
      const updatedRows = bankRows.filter((row, i) => i !== index);
      setBankRows(updatedRows);
    };
  };
  const removeLink = (index) => {
    return () => {
      const updatedLinks = whatsappLink?.filter((link, i) => i !== index);
      setWhatsappLink(updatedLinks);
    };
  };

  const handleMobileNumSet = (e) => {
    const newContact = e.target.value;

    if (newContact) {
      setValidator((prev) => ({ ...prev, mobile: false }));
    }

    if (newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setMobile("");
        setMobileValid(false);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          mobile: true,
        });
      } else {
        setMobile(newContact);
        setMobileValid(
          /^(\+91[ \-\s]?)?[0]?(91)?[6789]\d{9}$/.test(newContact)
        );
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          mobile: false,
        });
      }
    }
    setisContactTouched1(true);
    if (newContact.length < 10) {
      setMobileValid(false);
    }
  };
  const handleAlternateMobileNumSet = (e, setState) => {
    const newContact = e.target.value;
    if (newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact) < 6)
      ) {
        setState("");
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          altMobile: true,
        });
      } else {
        setState(newContact);
        setMandatoryFieldsEmpty({
          ...mandatoryFieldsEmpty,
          altMobile: false,
        });
      }
    }
  };

  const handleEmailSet = (e, setState) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (e.target.value) {
      setValidator((prev) => ({ ...prev, email: false }));
    }
    setState(e.target.value);
    if (re.test(e.target.value) || e.target.value === "") {
      return setEmailIsInvalid(false);
    }
    return setEmailIsInvalid(true);
  };

  const redirectAfterVendor = (resID) =>{
    const sendingId = {
      _id: resID
    };
    const queryParams = new URLSearchParams(sendingId).toString();
    navigate(`/admin/pms-page-master?${queryParams}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorName || vendorName == "" || vendorName == null) {
      setValidator((prev) => ({ ...prev, vendorName: true }));
    }
    // if (!countryCode) {
    //   setValidator((prev) => ({ ...prev, countryCode: true }));
    // }
    if (!mobile) {
      setValidator((prev) => ({ ...prev, mobile: true }));
    }
    // if (!email) {
    //   setValidator((prev) => ({ ...prev, email: true }));
    // }

    if (!typeId) {
      setValidator((prev) => ({ ...prev, typeId: true }));
    }
    if (!platformId) {
      setValidator((prev) => ({ ...prev, platformId: true }));
    }
    if (!cycleId) {
      setValidator((prev) => ({ ...prev, cycleId: true }));
    }

    // if (emailIsInvalid) {
    //   toastError("Please enter a valid email");
    //   return;
    // }
    if (
      !vendorName ||
      // !countryCode ||
      !mobile ||
      // !email ||
      !typeId ||
      !platformId ||
      !cycleId
    ) {
      toastError("Please fill all the mandatory fields");
      return;
    }
    const formData = {
      vendor_name: vendorName.toLowerCase().trim(),
      country_code: countryCode,
      mobile: mobile,
      alternate_mobile: altMobile,
      email: email,
      vendor_type: typeId,
      vendor_platform: platformId,
      pay_cycle: cycleId,
      company_name: compName,
      company_address: compAddress,
      company_city: compCity,
      company_pincode: compPin,
      company_state: compState,
      threshold_limit: limit,
      home_address: homeAddress,
      home_city: homeCity,
      home_state: homeState,
      home_pincode: homePincode,
      created_by: userID,
      vendor_category: vendorCategory,
      bank_details: bankRows,
      vendorLinks: whatsappLink,
      closed_by: userId,
    };

    if (!_id) {
      setIsFormSubmitting(true);
      // await axios
      //   .post(baseUrl + "v1/vendor", formData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json", 
      //     },
      //   })
      addVendor(formData)
        .then((res) => {
          setIsFormSubmitted(true);
          toastAlert("Data Submitted Successfully");
          setIsFormSubmitting(false);
          const resID = res.data.data._id;
          // redirectAfterVendor(resID)
          // axios.post(
          //   baseUrl + "v1/company_name",
          //   {
          //     vendor_id: resID,
          //     company_name: compName,
          //     address: compAddress,
          //     city: compCity,
          //     pincode: compPin,
          //     state: compState,
          //     threshold_limit: limit,
          //     created_by: userID,
          //   },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //     },
          //   }
          // );
          addCompanyData(  {   vendor_id: resID,
            company_name: compName,
            address: compAddress,
            city: compCity,
            pincode: compPin,
            state: compState,
            threshold_limit: limit,
            created_by: userID,
          }).then((res) => {  
            // console.log(res.data, "res");
            // toastAlert("company name added successfully")
          }).catch((err) => {
            toastError(err.message);
          });

          for (let i = 0; i < docDetails.length; i++) {
            const formData = new FormData();
            formData.append("vendor_id", resID);
            formData.append("document_name", docDetails[i].docName);
            formData.append("document_no", docDetails[i].docNumber);
            formData.append("document_image_upload", docDetails[i].docImage);
            // axios
            //   .post(baseUrl + "v1/document_detail", formData, {
            //     headers: {
            //       "Content-Type": "multipart/form-data",
            //       Authorization: `Bearer ${token}`,
            //     },
            //   })
            //   .catch((err) => {
            //     console.log(err.message, "err")
            //     toastError(err.message);
            //   });
            addVendorDocument(formData).then((res) => {
              // toastAlert("Document added successfully")
            }
            ).catch((err) => {
              toastError(err.message);
            }
            );
          }
        })
        .catch((err) => {
          toastError(err.message);
          setIsFormSubmitting(false);
        });
    } else {
      setIsFormSubmitting(true);
      // axios
      //   .put(baseUrl + `v1/vendor/${_id}`, formData, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json", 
      //     },
      //   })
      formData._id=_id
      updateVendor(formData).unwrap()
        .then(() => {

          toastAlert("Data Updated Successfully");
          // console.log("Vendor updated")
          for (let i = 0; i < docDetails?.length; i++) {
            const formData = new FormData();

            formData.append("document_name", docDetails[i].docName);
            formData.append("document_no", docDetails[i].docNumber);
            formData.append("document_image_upload", docDetails[i].docImage);
            axios
              .put(
                baseUrl + `v1/document_detail/${venodrDocuments[i]?._id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .catch((err) => {
                toastError(err.message);
              });
          }
          if (company_id) {
          axios
            .put(
              baseUrl + `v1/company_name/${company_id}`,
              {
                company_name: compName,
                address: compAddress,
                city: compCity,
                pincode: compPin,
                state: compState,
                threshold_limit: limit,
                created_by: userID,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
            })
            .catch((err) => {
              toastError(err.message);
            });
          }
          setIsFormSubmitted(true);
          setIsFormSubmitting(false);
        })
        .catch((err) => {
          toastError(err.message);
          setIsFormSubmitting(false);
          console.log(err, "err");
        });
    }
  };

  const handleSubmitNew = async (e) => {
    e.preventDefault();

    if (!vendorName || vendorName == "" || vendorName == null) {
      setValidator((prev) => ({ ...prev, vendorName: true }));
    }
    if (!mobile) {
      setValidator((prev) => ({ ...prev, mobile: true }));
    }
    if (!typeId) {
      setValidator((prev) => ({ ...prev, typeId: true }));
    }
    if (!platformId) {
      setValidator((prev) => ({ ...prev, platformId: true }));
    }
    if (!cycleId) {
      setValidator((prev) => ({ ...prev, cycleId: true }));
    }
    if (
      !vendorName ||
      // !countryCode ||
      !mobile ||
      // !email ||
      !typeId ||
      !platformId ||
      !cycleId
    ) {
      toastError("Please fill all the mandatory fields");
      return;
    }
    const formData = {
      vendor_name: vendorName.toLowerCase().trim(),
      country_code: countryCode,
      mobile: mobile,
      alternate_mobile: altMobile,
      email: email,
      vendor_type: typeId,
      vendor_platform: platformId,
      pay_cycle: cycleId,
      company_name: compName,
      company_address: compAddress,
      company_city: compCity,
      company_pincode: compPin,
      company_state: compState,
      threshold_limit: limit,
      home_address: homeAddress,
      home_city: homeCity,
      home_state: homeState,
      home_pincode: homePincode,
      created_by: userID,
      vendor_category: vendorCategory,
      bank_details: bankRows,
      vendorLinks: whatsappLink,
      closed_by: userId,
    };

    if (!_id) {
      setIsFormSubmitting2(true);

      addVendor(formData)
        .then((res) => {
          toastAlert("Data Submitted Successfully");
          const resID = res.data.data._id;
          redirectAfterVendor(resID)
          
          addCompanyData(  {   vendor_id: resID,
            company_name: compName,
            address: compAddress,
            city: compCity,
            pincode: compPin,
            state: compState,
            threshold_limit: limit,
            created_by: userID,
          }).then((res) => {  
            // console.log(res.data, "res");
          }).catch((err) => {
            toastError(err.message);
          });

          for (let i = 0; i < docDetails.length; i++) {
            const formData = new FormData();
            formData.append("vendor_id", resID);
            formData.append("document_name", docDetails[i].docName);
            formData.append("document_no", docDetails[i].docNumber);
            formData.append("document_image_upload", docDetails[i].docImage);
            
            addVendorDocument(formData).then((res) => {
              // toastAlert("Document added successfully")
            }
            ).catch((err) => {
              toastError(err.message);
            }
            );
          }
        })
        .catch((err) => {
          toastError(err.message);
          setIsFormSubmitting2(false);
        });
    } else {
      setIsFormSubmitting2(true);

      formData._id=_id
      updateVendor(formData).unwrap()
        .then(() => {

          toastAlert("Data Updated Successfully");
          for (let i = 0; i < docDetails?.length; i++) {
            const formData = new FormData();

            formData.append("document_name", docDetails[i].docName);
            formData.append("document_no", docDetails[i].docNumber);
            formData.append("document_image_upload", docDetails[i].docImage);
            axios
              .put(
                baseUrl + `v1/document_detail/${venodrDocuments[i]?._id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .catch((err) => {
                toastError(err.message);
              });
          }
          if (company_id) {
          axios
            .put(
              baseUrl + `v1/company_name/${company_id}`,
              {
                company_name: compName,
                address: compAddress,
                city: compCity,
                pincode: compPin,
                state: compState,
                threshold_limit: limit,
                created_by: userID,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
            })
            .catch((err) => {
              toastError(err.message);
            });
          }
          setIsFormSubmitted(true);
          setIsFormSubmitting2(false);
        })
        .catch((err) => {
          toastError(err.message);
          setIsFormSubmitting2(false);
          console.log(err, "err");
        });
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsPrevious(checked);
    if (checked) {
      setCompAddress(homeAddress);
      // if (countryCode === "91") {
      setCompCity(homeCity);
      setCompState(homeState);
      setCompPin(homePincode);
    } else {
      setCompAddress("");
      setCompCity("");
      setCompPin("");
      setCompState("");
    }
  };

  const docOptions = ["Pan card", "GST", "Aadhar Card", "Driving License"];
  // const copyOptions= docOptions;
  const [copyOptions, setCopyOptions] = useState(docOptions);

  useEffect(() => {
    let data = docOptions.filter((e) => {
      return !docDetails.map((e) => e.docName).includes(e);
    });
    setCopyOptions(data);
  }, [docDetails.map((e) => e.docName)]);

  const handlepincode = async(event) => {
    const newValue = event.target.value;
    setHomePincode(newValue);

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${newValue}`);
      const data = response.data;

      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setHomeState(postOffice.State);
        setHomeCity(postOffice.District);
      } else {
        console.log('Invalid Pincode')
      }
    } catch (error) {
      console.log('Error fetching details.');
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  const goBack = () => {
    navigate(-1);
  }

  return (
    <>
      <FormContainer
        mainTitle={_id ? "Edit Vendor Master" : "Add Vendor Master"}
        link={true}
        title={_id ? "Edit Vendor Master" : "Vendor Details"}
        // handleSubmit={handleSubmit}
        submitButton={false}
      ></FormContainer>
      <div style={{backgroundColor:'#52b2d6',width:'3%',padding:'7px',marginBottom:'10px',cursor:'pointer'}}>
        <ArrowBackIcon onClick={goBack} />
      </div>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Add Vendor Master</h5>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Vendor Name "
                fieldGrid={12}
                value={formatString(vendorName)}
                astric={true}
                required={true}
                onChange={(e) => {
                  setVendorName(e.target.value);
                  if (e.target.value) {
                    setValidator((prev) => ({ ...prev, vendorName: false }));
                  }
                }}
              />
              {validator.vendorName && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter vendor name
                </span>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  {/* Vendor Category <sup style={{ color: "red" }}>*</sup> */}
                  Profile Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={["Theme Page", "Influencer"].map((option) => ({
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
                {validator.vendorCategory && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select vendor category
                  </span>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Mobile"
                fieldGrid={12}
                value={mobile}
                astric
                type="number"
                required={true}
                onChange={(e) => {
                  handleMobileNumSet(e);
                  // handleMobileValidate();
                }}
              />
              {validator.mobile && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter mobile number
                </span>
              )}
              {/* {mobileValid && (
        <div className="form-group col-6">
          <label className="form-label">
            Vendor Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Theme Page", "influencer"].map((option) => ({
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
          {validator.vendorCategory && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please select vendor category
            </span>
          )}
        </div>

        <div className="col-6">
          <FieldContainer
            label="Mobile"
            fieldGrid={12}
            value={mobile}
            astric
            type="number"
            required={true}
            onChange={(e) => {
              handleMobileNumSet(e);
              // handleMobileValidate();
            }}
          />
          {validator.mobile && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please enter mobile number
            </span>
          )}
          {/* {mobileValid && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Please enter valid mobile number
            </span>
          )} */}
              {/* {
            <span style={{ color: "red", fontSize: "12px" }}>
              {mandatoryFieldsEmpty.mobile && "Please enter mobile number"}
            </span>
          } */}

              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {!validator.mobile &&
                    isContactTouched1 &&
                    !mobileValid &&
                    "Please enter valid mobile number"}
                </span>
              }
            </div>
            <div className="col-6">
              <FieldContainer
                label="Alternate Mobile"
                fieldGrid={12}
                value={altMobile}
                required={false}
                type="number"
                onChange={(e) => handleAlternateMobileNumSet(e, setAltMobile)}
              />
              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {mandatoryFieldsEmpty.altMobile &&
                    "Please enter alternate mobile"}
                </span>
              }
            </div>
            <div className="col-6">
              <FieldContainer
                label="Email"
                fieldGrid={12}
                // astric
                value={email}
                required={true}
                type="email"
                onChange={(e) => handleEmailSet(e, setEmail)}
              />
              {/* {emailIsInvalid && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter a valid email
                </span>
              )}
              {validator.email && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter email
                </span>
              )} */}
            </div>
            {/* <FieldContainer
          label="Personal Address"
          value={perAddress}
          required={false}
          onChange={(e) => setPerAddress(e.target.value)}
        /> */}

            <div className="form-group col-6">
              <label className="form-label">
                Vendor Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={
                  !typeLoading &&
                  typeData.data?.map((option) => ({
                    value: option._id,
                    label: option.type_name,
                  }))
                }
                required={true}
                value={{
                  value: typeId,
                  label:
                    (!typeLoading &&
                      typeData.data?.find((role) => role._id == typeId)
                        ?.type_name) ||
                    "",
                }}
                onChange={(e) => {
                  setTypeId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, typeId: false }));
                  }
                }}
              />
              <IconButton
                onClick={handleAddVendorTypeClick}
                variant="contained"
                color="primary"
                aria-label="Add Vendor Type.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handleInfoClick}
                variant="contained"
                color="primary"
                aria-label="Vendor Type Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.typeId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select vendor type
                </span>
              )}
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Platform <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={platformData?.data?.map((option) => ({
                  value: option._id,
                  label: option.platform_name,
                }))}
                required={true}
                value={{
                  value: platformId,
                  label:
                    platformData?.data?.find((role) => role._id == platformId)
                      ?.platform_name || "",
                }}
                onChange={(e) => {
                  setPlatformId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, platformId: false }));
                  }
                }}
              ></Select>

              <IconButton
                onClick={handleAddPlatformClick}
                variant="contained"
                color="primary"
                aria-label="Add Platform.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePlatformInfoClick}
                variant="contained"
                color="primary"
                aria-label="Platform Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.platformId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select platform
                </span>
              )}
            </div>

            {/* <div className="form-group col-6">
              <label className="form-label">
                Payment Method <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={payData?.map((option) => ({
                  value: option._id,
                  label: option.payMethod_name,
                }))}
                required={true}
                value={{
                  value: payId,
                  label:
                    payData?.find((role) => role._id == payId)
                      ?.payMethod_name || "",
                }}
                onChange={(e) => {
                  setPayId(e.value);
                  // setShowBankName(e.value === "specific_payment_method_id"); // Set condition for showing bank name

                  if (e.value) {
                    setValidator((prev) => ({ ...prev, payId: false }));
                  }
                }}
              ></Select>

              <IconButton
                onClick={handleAddPaymentMethodClick}
                variant="contained"
                color="primary"
                aria-label="Add Payment Method.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePaymentMethodInfoClick}
                variant="contained"
                color="primary"
                aria-label="Payment Method Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.payment_method && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select payment method
                </span>
              )}
            </div> */}

            {bankRows?.map((row, i) => (
              <>
                <div className="form-group col-6">
                  <label className="form-label">
                    Payment Method <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={payData?.map((option) => ({
                      value: option._id,
                      label: option.payMethod_name,
                    }))}
                    required={true}
                    value={{
                      // value: payId,
                      // label:
                      //   payData?.find((role) => role._id == payId)
                      //     ?.payMethod_name || "",
                      value: bankRows[i].payment_method,
                      label:
                        payData?.find(
                          (role) => role._id == bankRows[i].payment_method
                        )?.payMethod_name || "",
                    }}
                    onChange={(e) => {
                      // setPayId(e.value);
                      // setShowBankName(e.value === "specific_payment_method_id"); // Set condition for showing bank name
                      let updatedRows = [...bankRows];
                      updatedRows[i].payment_method = e.value;
                      setBankRows(updatedRows);

                      if (e.value) {
                        setValidator((prev) => ({ ...prev, payId: false }));
                      }
                    }}
                  ></Select>
                  <IconButton
                    onClick={handleAddPaymentMethodClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Payment Method.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePaymentMethodInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Payment Method Info.."
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                  {validator.payment_method && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Please select payment method
                    </span>
                  )}
                </div>

                {bankRows[i].payment_method == "666856874366007df1dfacde" && (
                  <>
                    <div className="form-group col-6">
                      <label className="form-label">
                        Bank Name
                        {/* <sup style={{ color: "red" }}>*</sup> */}
                      </label>
                      <Select
                        options={bankName?.map((option) => ({
                          value: option._id,
                          label: option.bank_name,
                        }))}
                        required={true}
                        value={{
                          // value: bankNameId,
                          value: bankRows[i].bank_name,
                          label:
                            // bankName?.find((role) => role._id == bankNameId)
                            bankName?.find(
                              (role) => role._id == bankRows[i].bank_name
                            )?.bank_name || "",
                        }}
                        onChange={(e) => {
                          // setBankNameId(e.value);
                          bankRows[i].bank_name = e.value;
                          if (e.value) {
                            setValidator((prev) => ({
                              ...prev,
                              bankNameId: false,
                            }));
                          }
                        }}
                      ></Select>

                      <IconButton
                        onClick={handleAddBankNameClick}
                        variant="contained"
                        color="primary"
                        aria-label="Add Bank Detail.."
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleBankNameInfoClick}
                        variant="contained"
                        color="primary"
                        aria-label="Bank Detail Info.."
                      >
                        <RemoveRedEyeIcon />
                      </IconButton>
                    </div>
                    <div className="form-group col-6">
                      <label className="form-label">Account Type</label>
                      <Select
                        options={["Savings", "Current"].map((option) => ({
                          label: option,
                          value: option,
                        }))}
                        required={true}
                        value={{
                          value: bankRows[i].account_type,
                          label: bankRows[i].account_type,
                        }}
                        onChange={(e) => {
                          handleAccountTypeChange(e, i);
                        }}
                      />
                    </div>
                    <FieldContainer
                      label="Account Number "
                      type="number"
                      maxLength={20}
                      max={20}
                      required={false}
                      value={bankRows[i].account_number}
                      onChange={(e) => handleAccountNoChange(e, i)}
                    />
                    <FieldContainer
                      required={false}
                      maxLength={11}
                      label="IFSC "
                      value={bankRows[i].ifcs}
                      onChange={(e) => handleIFSCChange(e, i)}
                    />
                  </>
                )}
                {bankRows[i].payment_method == "666856754366007df1dfacd2" && (
                  <FieldContainer
                    required={false}
                    label="UPI ID "
                    value={bankRows[i].upi_id}
                    onChange={(e) => handleUPIidChange(e, i)}
                  />
                )}

                {(bankRows[i].payment_method == "66681c3c4366007df1df1481" ||
                  bankRows[i].payment_method == "666856624366007df1dfacc8") && (
                  <FieldContainer
                    label={"Registered Mobile Number"}
                    value={bankRows[i].registered_number}
                    required={false}
                    type="number"
                    onChange={(e) => handleRegisteredMobileChange(e, i)}
                  />
                )}
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
                {/* <AddCircleTwoToneIcon /> */}
                <h5>Add Another Bank Details</h5>
              </IconButton>
              {/* {bankRows.length > 1 && (
            <IconButton
              onClick={handleRemoveBankInfoRow}
              variant="contained"
              color="primary"
            >
              <RemoveCircleTwoToneIcon />
            </IconButton>
          )} */}
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                PayCycle <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={cycleData?.map((option) => ({
                  value: option._id,
                  label: option.cycle_name,
                  createdAt: option.createdAt,
                }))
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))}
                required={true}
                value={{
                  value: cycleId,
                  label:
                    cycleData?.find((role) => role._id === cycleId)
                      ?.cycle_name || "",
                }}
                onChange={(e) => {
                  setCycleId(e.value);
                  if (e.value) {
                    setValidator((prev) => ({ ...prev, cycleId: false }));
                  }
                }}
              ></Select>
              <IconButton
                onClick={handleAddPayCycleClick}
                variant="contained"
                color="primary"
                aria-label="Add Pay Cycle.."
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={handlePayCycleInfoClick}
                variant="contained"
                color="primary"
                aria-label="Pay Cycle Info.."
              >
                <RemoveRedEyeIcon />
              </IconButton>
              {validator.cycleId && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please select pay cycle
                </span>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Closed By</label>
              <Select
                className=""
                options={userData?.map((option) => ({
                  value: option.user_id,
                  label: `${option.user_name}`,
                }))}
                value={{
                  value: userId,
                  label:
                    userData.find((user) => user.user_id === userId)
                      ?.user_name || "",
                }}
                onChange={(e) => {
                  setUserId(e.value);
                  // console.log(e.value, "e.value");
                }}
                required={false}
              />
            </div>

            <FieldContainer
                label="Threshold Limit"
                value={limit}
                type="number"
                required={false}
                onChange={(e) => setLimit(e.target.value)}
            />
            <div style={{display: "flex"}}>
                <p className="vendor_threshold" onClick={() => setLimit(100)}>100</p>
                <p className="vendor_threshold" onClick={() => setLimit(500)}>500</p>
                <p className="vendor_threshold" onClick={() => setLimit(1000)}>1000</p>
            </div>

            {/* <FieldContainer
              label="PAN"
              value={pan}
              cols={12}
              required={false}
              onChange={handlePanChange}
            />
            <div className="col-6 flex-row gap-2">
              <FieldContainer
                type="file"
                label="PAN Image"
                fieldGrid={panImage ? 10 : ""}
                required={false}
                onChange={(e) => setPanImage(e.target.files[0])}
              />

              {panImage && !_id && (
                <img
                  className="mt-4"
                  src={URL.createObjectURL(panImage)}
                  alt="pan"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
              {panImage && _id && (
                <img
                  className="mt-4"
                  src={panImage}
                  alt="pan"
                  style={{ width: "50px", height: "50px" }}
                />
              )}
            </div> */}

            {/* <div className="form-group col-6">
              <label className="form-label">GST Applicable</label>
              <Select
                options={gstOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                required={true}
                value={{
                  value: gstApplicable,
                  label:
                    gstOptions.find((role) => role.value === gstApplicable)
                      ?.label || "",
                }}
                onChange={(e) => {
                  setGstApplicable(e.value);
                }}
              ></Select>
            </div>

            {gstApplicable == "Yes" && (
              <>
                {" "}
                <FieldContainer
                  label="GST"
                  value={gst}
                  required={gstApplicable == "Yes" ? true : false}
                  onChange={(e) => setGst(e.target.value.toUpperCase())}
                />
                <div className="col-6 flex-row gap-2">
                  <FieldContainer
                    type="file"
                    label="GST Image"
                    fieldGrid={gstImage ? 10 : ""}
                    required={false}
                    onChange={(e) => setGstImage(e.target.files[0])}
                  />
                  {gstImage && !_id && (
                    <img
                      className="mt-4"
                      src={URL.createObjectURL(gstImage)}
                      alt="gst"
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}{" "}
                  {gstImage && _id && (
                    <img
                      className="mt-4"
                      src={gstImage}
                      alt="gst"
                      style={{ width: "100px", height: "100px" }}
                    />
                  )}
                </div>
              </>
            )} */}

            <div className="card-header">Personal Details</div>
            <div className="card-body row">
              <div className="form-group col-6">
                <label className="form-label">
                  Country Code
                  {/* <sup style={{ color: "red" }}>*</sup> */}
                </label>
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: 300 }}
                  options={countries}
                  required={true}
                  value={
                    (!isCountriesLoading &&
                      countries?.find(
                        (option) => option?.phone == countryCode
                      )) ||
                    null
                  }
                  onChange={(e, val) => {
                    setCountryCode(val ? val.phone : null);
                    if (val ? val.phone : null) {
                      setValidator((prev) => ({ ...prev, countryCode: false }));
                    }
                  }}
                  autoHighlight
                  getOptionLabel={(option) =>
                    `+${option.phone} ${option.country_name}`
                  }
                  // getOptionLabel={(option) => option.phone}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...props}
                    >
                      <img
                        loading="lazy"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          objectFit: "cover",
                          marginRight: 1,
                        }}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option?.country_name} ({option?.code}) +{option?.phone}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      // value={countries?.find((option) => option.phone == countryCode)}
                      {...params}
                      // label="Choose a country"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                {/* {validator.countryCode && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select country code
                  </span>
                )} */}
              </div>
              <FieldContainer
                label="PinCode"
                value={homePincode}
                maxLength={6}
                required={false}
                // onChange={(e) => {
                //   const value = e.target.value;
                //   if (/^\d{0,6}$/.test(value)) {
                //     setHomePincode(value);
                //   }
                // }}
                // setHomePincode(e.target.value)}
                onChange={handlepincode}
              />
              {countryCode == "91" ? (
                <div className=" row">
                  <div className="form-group col-6">
                    <label className="form-label">Home State</label>
                    <IndianStatesMui
                      selectedState={homeState}
                      onChange={(option) =>
                        setHomeState(option ? option : null)
                      }
                    />
                  </div>
                  <div className="form-group col-6">
                    <label className="form-label">Home City</label>
                    <IndianCitiesMui
                      selectedState={homeState}
                      selectedCity={homeCity}
                      value={homeCity}
                      onChange={(option) => {
                        setHomeCity(option ? option : null);
                        // console.log(option);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <FieldContainer
                  label="Country"
                  value={otherCountry}
                  required={false}
                  onChange={(e) => setOtherCountry(e.target.value)}
                />
              )}
              <FieldContainer
                label="Home Address"
                value={homeAddress}
                required={false}
                onChange={(e) => setHomeAddress(e.target.value)}
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sameAsPrevious}
                    onChange={(e) => handleCheckboxChange(e)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Same as Home Address"
              />
            </div>

            <div className="card-header">Company Details</div>
            <div className="card-body row">
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
                maxLength={6}
                onChange={(e) => {
                  if (isNaN(e.target.value)) return;
                  setCompPin(e.target.value);
                }}
              />
              {/* <FieldContainer
                label="Company State"
                value={compState}
                required={false}
                onChange={(e) => setCompState(e.target.value)}
              /> */}
              <div className="form-group col-6 mt-3">
                <label htmlFor="">Company State</label>
                <IndianStatesMui
                  selectedState={compState}
                  onChange={(option) => setCompState(option ? option : null)}
                />
              </div>

            </div>

          {docDetails?.map((link, index) => (
            <div className="row" key={index}>
              {/* <FieldContainer
                key={index}
                fieldGrid={4}
                label={`Document Name`}
                value={link.docName}
                // required={true}
                onChange={(e) => handleDocNameChange(index, e.target.value)}
              /> */}
              <div className="col-md-3">
                <label className="form-label">Document Name</label>
                <Select
                  className=""
                  options={copyOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  value={{
                    value: link.docName,
                    label: link.docName,
                  }}
                  onChange={(selectedOption) => {
                    handleDocNameChange(index, selectedOption.value);
                  }}
                  required
                />
              </div>
              <FieldContainer
                key={index.docNumber}
                label={`Document Number`}
                fieldGrid={4}
                value={link.docNumber}
                // required={false}
                onChange={(e) => handleDocNumberChange(index, e.target.value)}
              />
              <FieldContainer
                key={index.docImage}
                label={`Document Image`}
                type="file"
                accept={"image/*"}
                fieldGrid={4}
                // value={link.docImage}
                onChange={(e) => handleDocImageChange(index, e)}
              />
              {/* {docDetails[index]?.docImage && (
                <img
                  className="profile-holder-1 mt-4"
                  src={URL?.createObjectURL(docDetails[index]?.docImage)}
                  alt="Selected"
                  style={{ maxWidth: "50px", maxHeight: "50px" }}
                />
              )} */}
              <div className="row">
                <div className="col-12">
                  <div className="addBankRow">
                    <Button onClick={removedocLink(index)}>
                      <IconButton variant="contained" color="error">
                        <RemoveCircleTwoToneIcon />
                      </IconButton>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row thm_form"></div>
            </div>
          ))}
          <div className="row">
            <div className="col-12">
              <div className="addBankRow">
                <Button onClick={addDocDetails}>
                  <IconButton variant="contained" color="primary">
                    <AddCircleTwoToneIcon />
                  </IconButton>
                  Add Document
                </Button>
              </div>
            </div>
          </div>

          {whatsappLink?.map((link, index) => (
              <>
                <div className="col-6">
                  <FieldContainer
                    key={index}
                    fieldGrid={12}
                    label={`Whatsapp Link ${index + 1}`}
                    value={link.link}
                    required={true}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                </div>
                {/* <div className="col-md-4 p0 mb16">
                  <FieldContainer
                    key={index.remark}
                    label={`Group Purpose`}
                    fieldGrid={12}
                    value={link.remark}
                    required={false}
                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                  />
                </div> */}
                <div className="col-md-4 mb16">
                  <div className="form-group m0">
                    <label className="form-label">Type</label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={whatsappLinkType?.data?.map((option) => ({
                          label: option.link_type,
                          value: option._id,
                        }))}
                        required={true}
                        value={{
                          value: link.type,
                          label:
                            whatsappLinkType?.data?.find(
                              (role) => role._id === link.type
                            )?.link_type || "",
                        }}
                        onChange={(e) => {
                          let updatedLinks = [...whatsappLink];
                          updatedLinks[index].type = e.value;
                          setWhatsappLink(updatedLinks);
                        }}
                      />
                      {index == 0 && (
                        <>
                          {" "}
                          <IconButton
                            onClick={handleAddWhatsappGroupLinkTypeClick}
                            variant="contained"
                            color="primary"
                            aria-label="Add Pay Cycle.."
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleWhatsappGroupLinkTypeInfoClick}
                            variant="contained"
                            color="primary"
                            aria-label="Pay Cycle Info.."
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                </div>{" "}
                <div className="row">
                  <div className="col-12">
                    <div className="addBankRow">
                      <Button onClick={removeLink(index)}>
                        <IconButton variant="contained" color="error">
                          <RemoveCircleTwoToneIcon />
                        </IconButton>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="row thm_form"></div>
              </>
            ))}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="addBankRow">
                <Button onClick={addLink}>
                  <IconButton variant="contained" color="primary">
                    <AddCircleTwoToneIcon />
                  </IconButton>
                  Add Whatsapp Link
                </Button>
              </div>
            </div>
          </div>

          <div className="row thm_form"></div>
        </div>
        <div className="card-footer">
          <div style={{display:'flex'}}>
          <Stack direction="row" spacing={2}>
            <Button
              className="btn cmnbtn btn-primary"
              onClick={handleSubmit}
              variant="contained"
              disabled={isFormSubmitting}
            >
              {isFormSubmitting ? "Submitting..." : _id ? "Update" : "Submit"}
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} style={{marginLeft:'5px'}}>
            <Button
              className="btn cmnbtn btn-info"
              onClick={handleSubmitNew}
              variant="contained"
              disabled={isFormSubmitting2}
            >
              {isFormSubmitting2 ? "Submitting..." : _id ? "Update" : "Add New Profile"}
            </Button>
          </Stack>
          </div>
        </div>
      </div>
      <AddVendorModal />
      {isVendorModalOpen && <VendorTypeInfoModal />}
    </>
  );
};

export default VendorMaster;
