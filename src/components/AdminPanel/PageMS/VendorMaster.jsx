import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
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
  useGetAllVendorQuery,
  useUpdateVendorDocumentMutation,
} from "../../Store/reduxBaseURL";
import Swal from "sweetalert2";
import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { useParams } from "react-router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IndianStatesMui from "../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../ReusableComponents/IndianCitiesMui";
import { useGstDetailsMutation } from "../../Store/API/Sales/GetGstDetailApi";
import formatString from "../Operation/CampaignMaster/WordCapital";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PreviewModal from "./Vendor/PreviewModal";
import { useContext } from "react";
import { FormatName } from "../../../utils/FormatName";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { stateAbbreviations } from "../../../utils/helper";
import { ArrowLeft } from "@phosphor-icons/react";
import PennyDropVendor from "./PennyDropVendor";
// import { useGlobalContext } from "../../../Context/Context";

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
  const [forPhp, setForPhp] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  // const [isFormSubmitting2, setIsFormSubmitting2] = useState(false);
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
  const [platformId, setPlatformId] = useState("666818824366007df1df1319");
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
  const [busiType, setBusiType] = useState("");
  const [getGstDetails] = useGstDetailsMutation();
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState({});

  const [validationMessage, setValidationMessage] = useState(null);
  const [isNumberValid, setIsNumberValid] = useState(null);

  const [vendorLegalName, setVendorLegalName] = useState("");

  const [bankRows, setBankRows] = useState([
    {
      payment_method: "666856874366007df1dfacde", // setting bank default to dropdown
      // payment_method: "",
      bank_name: "",
      account_type: "Savings",
      account_number: "",
      ifsc: "",
      upi_id: "",
      registered_number: "",
      pan_card: "",
      account_holder_name: "",
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
  const vendorTypeData = [
    { value: "Individual Vendor", label: "Individual Vendor" },
    { value: "Bulk Vendor", label: "Bulk Vendor" },
    { value: "Multiple Pages Vendor", label: "Multiple Pages Vendor" },
  ];

  const {
    data: allVendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery();

  const { data: platformData } = useGetPmsPlatformQuery();

  const { data: payData } = useGetPmsPaymentMethodQuery();

  const { data: cycleQueryData } = useGetPmsPayCycleQuery();

  const { data: whatsappLinkType } = useGetVendorWhatsappLinkTypeQuery();
  const cycleData = cycleQueryData?.data;

  const { data: bankNameData } = useGetBankNameDetailQuery();
  const bankName = bankNameData?.data;

  const [addVendor] = useAddVendorMutation();
  const [addCompanyData] = useAddCompanyDataMutation();
  const [addVendorDocument] = useAddVendorDocumentMutation();
  const [updateVendor] = useUpdateVenodrMutation();
  const [updateVendorDocument] = useUpdateVendorDocumentMutation();
  const [dob, setDob] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [existError, setExistError] = useState("");
  const [busiTypeData, setBusiTypeData] = useState([]);
  const { userContextData, contextData } = useAPIGlobalContext();

  const [openPanyDropModel, setOpenPanyDropModel] = useState(false);

  const handleOpenPannyDrop = () => {
    setOpenPanyDropModel(true);
  };
  const handleClosePanyDropModel = () => {
    setOpenPanyDropModel(false);
  };

  // const isAssets = [53].some((index) => ApiContextData[index]?.view_value === 1);

  useEffect(() => {
    if (gst?.length === 15) {
      getGstDetails({ gstNo: gst, flag: 2 })
        .then((response) => {
          if (response?.data) {
            // const { data } = response?.data;
            setCompName(response?.data.legal_name.value);
            // setCompAddress(data?.principal_place_of_business?.split(',')?.[0]);
            // const addressParts = data?.principal_place_of_business?.split(',');
            // setCompCity(addressParts[2]);
            // setCompPin(addressParts[7]);
            // setCompState(addressParts[2]);
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
    const inputValue = e.target.value;
    if (!/^\d*$/.test(inputValue)) return;

    if (inputValue.length > 20) return;

    const updatedRows = [...bankRows];
    updatedRows[i].account_number = inputValue;
    setBankRows(updatedRows);
  };

  const handleIFSCChange = (e, i) => {
    const ifscValue = e.target.value.toUpperCase().replace(/\s/g, ""); // Remove spaces
    const updatedRows = [...bankRows];
    updatedRows[i].ifsc = ifscValue;
    setBankRows(updatedRows);
  };

  const handlePANChange = (e, i) => {
    const panValue = e.target.value.toUpperCase().replace(/\s/g, "");
    if (panValue.length <= 10) {
      const updatedRows = [...bankRows];
      updatedRows[i].pan_card = panValue;
      setBankRows(updatedRows);
    }
  };

  const handleAccountHolderChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].account_holder_name = e.target.value;
    setBankRows(updatedRows);
  };
  const handleUPIidChange = (e, i) => {
    const updatedRows = [...bankRows];
    updatedRows[i].upi_id = e.target.value;
    setBankRows(updatedRows);
  };

  const handleRegisteredMobileChange = (e, i) => {
    if (e.target.value?.length > 10) {
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
  // console.log(venodrDocuments, "venodrDocuments")

  useEffect(() => {
    if (mobile && mobile.length === 10) {
      axios
        .get(`${baseUrl}v1/check_vendor_number_unique/${mobile}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const isNumberUnique = res.data?.data?.isNumberUnique;
          const message = res.data?.message || "Unexpected response.";
          setValidationMessage(message);
          setIsNumberValid(isNumberUnique);

          if (isNumberUnique) {
            toastAlert(message);
          } else {
            toastError(message);
          }
        })
        .catch((error) => {
          console.error("Error during API call:", error);
          setIsNumberValid(false);
          setValidationMessage(
            "An error occurred while validating the mobile number."
          );
        });
    } else {
      setValidationMessage(null);
      setIsNumberValid(null);
    }
  }, [mobile, token]);

  useEffect(() => {
    // axios.get(baseUrl + 'get_all_users').then((res) => {
    //   setUserData(res.data.data);
    // });

    axios
      .get(baseUrl + `v1/vendor_business_type`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setBusiTypeData(res.data.data);
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
          setVendorData(data);
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
          setTypeId(data?.vendor_type_name);
          setPlatformId(data?.vendor_platform);
          setCycleId(data?.pay_cycle);
          setHomePincode(data?.home_pincode);
          setVendorCategory(data?.vendor_category ?? "Theme Page");
          setDob(data?.dob);
          setBusiType(data?.busi_type);
          setVendorLegalName(data?.vendor_legal_name);
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
          const extractForPhp = bankRows?.find(
            (item) => item.payment_method === "666856874366007df1dfacde"
          );
          setForPhp(extractForPhp);
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
          _id: doc._id,
          docName: doc.document_name,
          docNumber: doc.document_no,
          docImage: doc.document_image_upload,
          vendor_id: doc.vendor_id,
        };
      });
      // setDocDetails(doc);

      const staticDocs = [
        {
          docName: "GST",
          docNumber: "",
          document_image_upload: "",
        },
        {
          docName: "Pan Card",
          docNumber: "",
          document_image_upload: "",
        },
        {
          docName: "Aadhar Card",
          docNumber: "",
          document_image_upload: "",
        },
        {
          docName: "Driving License",
          docNumber: "",
          document_image_upload: "",
        },
      ];

      const existingDocNames = doc.map((d) => d.docName);
      const filteredStaticDocs = staticDocs.filter(
        (staticDoc) => !existingDocNames.includes(staticDoc.docName)
      );
      const combinedDocs = doc.concat(filteredStaticDocs);
      setDocDetails(combinedDocs);

      if (busiType !== "") {
        let filteredDocs;
        if (
          busiType === "670112aa579d1873b7ede523" ||
          busiType === "670112bd579d1873b7ede524"
        ) {
          filteredDocs = combinedDocs;
        } else if (busiType === "670112d0579d1873b7ede526") {
          filteredDocs = combinedDocs.filter((doc) =>
            ["Pan Card", "Driving License", "Aadhar Card"].includes(doc.docName)
          );
        } else if (busiType === "670112e2579d1873b7ede528") {
          filteredDocs = combinedDocs.filter((doc) =>
            ["Driving License", "Aadhar Card", "Pan Card"].includes(doc.docName)
          );
        }
        setDocDetails(filteredDocs);
      }
    }
  }, [venodrDocuments, busiType]);

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

  const addMoreDocDetails = () => {
    setDocDetails([
      ...docDetails,
      {
        _id: "",
        docName: "",
        docNumber: "",
        document_image_upload: "",
      },
    ]);
  };

  const addDocDetails = () => {
    let newDocs = [];
    if (
      busiType === "670112aa579d1873b7ede523" ||
      busiType === "670112bd579d1873b7ede524"
    ) {
      newDocs = [
        { docName: "GST", docNumber: "", document_image_upload: "" },
        { docName: "Pan Card", docNumber: "", document_image_upload: "" },
        { docName: "Aadhar Card", docNumber: "", document_image_upload: "" },
        {
          docName: "Driving License",
          docNumber: "",
          document_image_upload: "",
        },
      ];
    } else if (busiType === "670112d0579d1873b7ede526") {
      newDocs = [
        { docName: "Pan Card", docNumber: "", document_image_upload: "" },
        {
          docName: "Driving License",
          docNumber: "",
          document_image_upload: "",
        },
        { docName: "Aadhar Card", docNumber: "", document_image_upload: "" },
      ];
    } else if (busiType === "670112e2579d1873b7ede528") {
      newDocs = [
        {
          docName: "Driving License",
          docNumber: "",
          document_image_upload: "",
        },
        { docName: "Aadhar Card", docNumber: "", document_image_upload: "" },
        { docName: "Pan Card", docNumber: "", document_image_upload: "" },
      ];
    }

    setDocDetails((prevDetails) => [
      // ...prevDetails,
      ...newDocs,
    ]);
  };

  useEffect(() => {
    if (!_id) {
      addDocDetails();
    }
  }, [busiType]);

  const handleDocNameChange = (index, newValue) => {
    let doc = [...docDetails];
    doc[index].docName = newValue;
    setDocDetails(doc);
  };

  const handleDocNumberChange = (i, value) => {
    let doc = [...docDetails];
    let docName = doc[i].docName;
    let maxLength = 12;

    let capitalizedValue = value.toUpperCase();

    if (docName === "Pan Card") {
      maxLength = 11;
    } else if (docName === "GST") {
      maxLength = 15;
    } else if (docName === "Aadhar Card") {
      maxLength = 16;
    }
    if (capitalizedValue.length > maxLength) {
      alert(`Document Number for ${docName} cannot exceed ${maxLength} digits`);
      return;
    }
    doc[i].docNumber = capitalizedValue;
    if (docDetails[0].docName === "GST") {
      setGst(doc[0].docNumber);
    }
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
        ifsc: "",
        upi_id: "",
        registered_number: "",
        pan_card: "",
      },
    ]);
  };
  // console.log(bankRows, "bankRows")
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

    if (newContact?.length <= 10) {
      if (
        newContact === "" ||
        (newContact?.length === 1 && parseInt(newContact) < 6)
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
    if (newContact?.length < 10) {
      setMobileValid(false);
    }
  };
  const handleAlternateMobileNumSet = (e, setState) => {
    const newContact = e.target.value;

    if (/^\d*$/.test(newContact) && newContact.length <= 10) {
      if (
        newContact === "" ||
        (newContact.length === 1 && parseInt(newContact, 10) < 6)
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

  const redirectAfterVendor = (resID) => {
    const sendingId = {
      _id: resID,
    };
    const queryParams = new URLSearchParams(sendingId).toString();
    navigate(`/admin/pms-page-master?${queryParams}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (
    //   bankRows.length > 0 &&
    //   bankRows[0].payment_method === "666856874366007df1dfacde"
    // ) {
    //   const hasEmptyIFSC = bankRows.some((bank) => bank.ifsc === "");

    //   if (hasEmptyIFSC) {
    //     toastError("IFSC code is mandatory");
    //     return;
    //   }
    // }
    if (!busiType) {
      toastError("Business Type is mandatory");
      return;
    }
    if (bankRows.length > 0) {
      const hasInvalidBankDetails = bankRows.some(
        (bank) =>
          bank.payment_method === "666856874366007df1dfacde" &&
          (!bank.ifsc || !bank.account_number)
      );

      if (hasInvalidBankDetails) {
        toastError("IFSC code and Account Number are mandatory");
        return;
      }
    }

    if (
      !vendorName ||
      vendorName == "" ||
      vendorName == null ||
      String(homePincode).length !== 6
    ) {
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

    const cleanedMobile = mobile ? String(mobile).trim() : "";

    if (
      !vendorName?.trim() ||
      !cleanedMobile ||
      !typeId?.trim() ||
      !platformId?.trim() ||
      !cycleId?.trim()
    ) {
      toastError("Please fill all the mandatory fields");
      return;
    }
    if (cleanedMobile.length !== 10) {
      toastError("Please Enter valid 10 digit Mobile Number");
      return;
    }
    const formData = {
      vendor_name: vendorName?.toLowerCase().trim(),
      country_code: countryCode,
      mobile: mobile,
      alternate_mobile: altMobile,
      email: email,
      vendor_type_name: typeId,
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
      dob: dob,
      busi_type: busiType,
      vendor_legal_name: vendorLegalName,
    };
    setPreviewData(formData);
    setOpenPreviewModal(true);
  };

  const handleFinalSubmit = async () => {
    const cleanedMobile = mobile ? String(mobile).trim() : "";
    if (
      !vendorName?.trim() ||
      !cleanedMobile ||
      !typeId?.trim() ||
      !platformId?.trim() ||
      !cycleId?.trim()
    ) {
      toastError("Please fill all the mandatory fields");
      return;
    }
    if (cleanedMobile.length !== 10) {
      toastError("Please Enter valid 10 digit Mobile Number");
      return;
    }
    // if (bankRows.some((bank) => bank.ifsc === "")) {
    //   toastError("IFSC code is mandatory");
    //   return;
    // }

    if (String(homePincode).length !== 6) {
      toastError("Please Enter valid pincode");
      return;
    }
    const handleError = (error) => {
      toastError(error?.message || "Something went wrong!");
      setIsFormSubmitting(false);
    };

    const handleSuccess = (message) => {
      toastAlert(message);
      setIsFormSubmitting(false);
    };

    if (!_id) {
      setIsFormSubmitting(true);
      try {
        const res = await addVendor(previewData);
        setIsFormSubmitting(false);
        const resID = res.data.data._id;

        if (res?.status === 200) {
          setIsFormSubmitted(true);
          setOpenPreviewModal(false);
          toastAlert("Data Submitted Successfully");

          // Add company data
          try {
            await addCompanyData({
              vendor_id: resID,
              company_name: compName,
              address: compAddress,
              city: compCity,
              pincode: compPin,
              state: compState,
              threshold_limit: limit,
              created_by: userID,
            });
          } catch (err) {
            toastError(err.message);
          }

          // Add vendor documents in parallel
          const docPromises = docDetails?.map((doc) => {
            const formData = new FormData();
            formData.append("vendor_id", resID);
            formData.append("document_name", doc.docName);
            formData.append("document_no", doc.docNumber);
            formData.append("document_image_upload", doc.docImage);

            return addVendorDocument(formData).catch((err) => {
              toastError(err.message);
            });
          });

          // Wait for all document upload promises to complete
          await Promise.all(docPromises);

          handleSuccess("Vendor and documents added successfully!");
        } else if (res?.status === 409) {
          // console.log("resss", res.error);
          toastError(res?.error?.data?.message);
        } else {
          handleSuccess("Vendor data added successfully!");
          // navigate('/admin/pms-vendor-overview');
          setIsFormSubmitted(true);
        }
      } catch (err) {
        handleError(err);
      }
    } else {
      setIsFormSubmitting(true);
      previewData._id = _id;

      try {
        await updateVendor(previewData);

        const payload = {
          vendor_id: vendorData.vendor_id,
          mobile: mobile,
          alternate_mobile: altMobile,
          account_type: forPhp?.account_type || bankRows[0].account_type,
          account_no: forPhp?.account_number || bankRows[0].account_number,
          ifsc: forPhp?.ifsc || bankRows[0].ifsc,
          // ifsc: forPhp?.ifsc || bankRows[0].ifsc,
          bank_name: forPhp?.bank_name || bankRows[0].bank_name,
          vendor_name: vendorName,
        };

        try {
          await axios.post(baseUrl + `node_data_to_php_update_vendor`, payload);
        } catch (err) {
          // console.log("Error updating vendor data in PHP:", err);
        }

        for (let i = 0; i < docDetails?.length; i++) {
          const formData = new FormData();
          formData.append("vendor_id", _id);
          formData.append("_id", docDetails[i]._id || ""); // Add default values if undefined
          formData.append("document_name", docDetails[i].docName || "");
          formData.append("document_no", docDetails[i].docNumber || "");

          if (docDetails[i].docImage) {
            formData.append("document_image_upload", docDetails[i].docImage); // Append only if defined
          } else {
            console.warn(
              `Skipping docImage for document ${docDetails[i].docName}`
            );
          }

          if (docDetails[i]._id) {
            updateVendorDocument(formData)
              .then((res) => {
                // toastAlert("Document added successfully")
              })
              .catch((err) => {
                toastError(err.message);
              });
          } else {
            addVendorDocument(formData)
              .then((res) => {
                // toastAlert("Document added successfully")
              })
              .catch((err) => {
                toastError(err.message);
              });
          }
        }

        handleSuccess("Data Updated Successfully");
        navigate("/admin/pms-vendor-overview");
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsPrevious(checked);
    if (checked) {
      // setCompAddress(homeAddress);
      setHomeAddress(compAddress);

      // if (countryCode === "91") {
      // setCompCity(homeCity);
      // setCompState(homeState);
      // setCompPin(homePincode);
      setHomeCity(compCity);
      setHomeState(compState);
      setHomePincode(compPin);
    } else {
      // setCompAddress('');
      // setCompCity('');
      // setCompPin('');
      // setCompState('');
      setHomeAddress("");
      setHomeCity("");
      setHomeState("");
      setHomePincode("");
    }
  };

  const docOptions = ["Pan Card", "GST", "Aadhar Card", "Driving License"];
  // const copyOptions= docOptions;
  const [copyOptions, setCopyOptions] = useState(docOptions);

  useEffect(() => {
    const docNames = docDetails?.map((e) => e?.docName);
    const filteredData = docOptions?.filter(
      (option) => !docNames?.includes(option)
    );
    setCopyOptions(filteredData);
  }, [docDetails]);

  const handlepincode = async (event) => {
    const newValue = event.target.value;
    setHomePincode(newValue);
    if (newValue.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${newValue}`
        );
        const data = response.data;

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          const abbreviatedState =
            stateAbbreviations[postOffice.State] || postOffice.State;
          setHomeState(abbreviatedState);
          // console.log('postOffice', postOffice.District);
          setHomeCity(postOffice.District);
        } else {
          // console.log("Invalid Pincode");
        }
      } catch (error) {
        // console.log("Error fetching details.");
      }
    }
  };

  const stateAbbreviations = {
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    Assam: "AS",
    Bihar: "BR",
    Chhattisgarh: "CG",
    Goa: "GA",
    Gujarat: "GJ",
    Haryana: "HR",
    "Himachal Pradesh": "HP",
    Jharkhand: "JH",
    Karnataka: "KA",
    Kerala: "KL",
    "Madhya Pradesh": "MP",
    Maharashtra: "MH",
    Manipur: "MN",
    Meghalaya: "ML",
    Mizoram: "MZ",
    Nagaland: "NL",
    Odisha: "OD",
    Punjab: "PB",
    Rajasthan: "RJ",
    Sikkim: "SK",
    "Tamil Nadu": "TN",
    Telangana: "TG",
    Tripura: "TR",
    "Uttar Pradesh": "UP",
    Uttarakhand: "UK",
    "West Bengal": "WB",
    Delhi: "DL",
    "Jammu and Kashmir": "JK",
    Ladakh: "LA",
  };

  const handleCompPincode = async (event) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      setCompPin(newValue);

      if (newValue.length === 6) {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${newValue}`
          );
          const data = response.data;

          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            const abbreviatedState =
              stateAbbreviations[postOffice.State] || postOffice.State;
            setCompState(abbreviatedState);
            setCompCity(postOffice.District);
          } else {
            // console.log("Invalid Pincode");
          }
        } catch (error) {
          // console.log("Error fetching details.");
        }
      }
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-vendor-overview" />;
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flexCenter colGap8 mb16 formHeadingM0">
        <button className="icon" onClick={goBack}>
          <ArrowLeft size={22} />
        </button>
        <FormContainer
          mainTitle={_id ? "Edit Vendor Master" : "Add Vendor Master"}
          link={true}
          title={_id ? "Edit Vendor Master" : "Vendor Details"}
          // handleSubmit={handleSubmit}
          submitButton={false}
        ></FormContainer>
      </div>

      <PreviewModal
        open={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        previewData={previewData}
        bankRows={bankRows}
        payData={payData}
        bankName={bankName}
        docDetails={docDetails}
        handleFinalSubmit={handleFinalSubmit}
        isFormSubmitting={isFormSubmitting}
      />
      <PennyDropVendor
        bankRows={bankRows}
        onClose={handleClosePanyDropModel}
        open={openPanyDropModel}
      />
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Add Vendor Details</h5>
          <button
            className="btn cmnbtn btn_sm btn-primary"
            onClick={addMoreDocDetails}
          >
            Add Document
          </button>
        </div>
        <div className="card-body thm_form">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label className="form-label">
                  Business Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={busiTypeData?.map((option) => ({
                    value: option?._id,
                    label: option?.busi_type_name,
                  }))}
                  astric={true}
                  required={true}
                  // required={true}
                  value={{
                    value: busiType,
                    label:
                      busiTypeData?.find((role) => role._id == busiType)
                        ?.busi_type_name || "",
                  }}
                  onChange={(e) => {
                    setBusiType(e.value);
                  }}
                ></Select>
                {/* <Select
                  options={[
                    'Registered Business',
                    'Registered Business (Composition)',
                    'Unregistered Business',
                    'Individual',
                  ].map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  required={true}
                  value={{
                    value: busiType,
                    label: busiType,
                  }}
                  onChange={(e) => {
                    setBusiType(e.value);
                  }}
                ></Select> */}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group m0">
                <label className="form-label">NOTE:</label>
                {busiType === "670112aa579d1873b7ede523" ? (
                  <p>If Private Limited 2% TDS And If Not 1%.</p>
                ) : busiType === "670112bd579d1873b7ede524" ? (
                  <p>If Private Limited 2% TDS And If Not 1%.</p>
                ) : busiType === "670112d0579d1873b7ede526" ? (
                  <p>1% TDS.</p>
                ) : busiType === "670112e2579d1873b7ede528" ? (
                  <p>
                    Max Limit is 25k Per Bill. Total Year Limit is 100k. Please
                    Choose Unregistered Business & Upload Pan If You Believe
                    Transaction will cross above 100k.
                  </p>
                ) : (
                  <p>No TDS applicable for this business type.</p>
                )}
              </div>
            </div>
          </div>
          {docDetails?.map((link, index) => (
            <div className="row" key={index}>
              <div className="col-lg-3 col-md-3">
                <div className="form-group">
                  <label className="form-label">Document Name</label>
                  {docDetails.length >= 5 ? (
                    <input
                      type="text"
                      value={link.docName}
                      onChange={(e) =>
                        handleDocNameChange(index, e.target.value)
                      }
                      className="form-control"
                      required
                    />
                  ) : (
                    <Select
                      className=""
                      options={copyOptions?.map((option) => ({
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
                  )}
                </div>
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
              <div className="col-lg-1 col-md-1">
                <button
                  className="icon btn-outline-danger mt28"
                  onClick={removedocLink(index)}
                >
                  <RemoveCircleTwoToneIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Company Details</h5>
        </div>
        <div className="card-body thm_form">
          {busiType === "670112e2579d1873b7ede528" ? (
            ""
          ) : (
            <>
              <div className="row">
                <FieldContainer
                  label="Company Name"
                  fieldGrid={4}
                  value={compName}
                  required={false}
                  onChange={(e) => setCompName(e.target.value)}
                />

                <FieldContainer
                  label="Company Address"
                  fieldGrid={4}
                  value={compAddress}
                  required={false}
                  onChange={(e) => setCompAddress(e.target.value)}
                />

                {/* <FieldContainer
                    label="Company City"
                    fieldGrid={4}
                    value={compCity}
                    required={false}
                    onChange={(e) => setCompCity(e.target.value)}
                  /> */}
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="form-group">
                    <label htmlFor="">Company State</label>
                    <IndianStatesMui
                      selectedState={compState}
                      onChange={(option) =>
                        setCompState(option ? option : null)
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="form-group">
                    <label className="form-label">Company City</label>
                    <IndianCitiesMui
                      selectedState={compState}
                      selectedCity={compCity}
                      value={compCity}
                      onChange={(option) => {
                        setCompCity(option ? option : null);
                        // console.log(option);
                      }}
                    />
                  </div>
                </div>
                <FieldContainer
                  label="Company Pincode"
                  value={compPin}
                  required={false}
                  maxLength={6}
                  fieldGrid={4}
                  onChange={handleCompPincode}
                // onChange={(e) => {
                //   if (isNaN(e.target.value)) return;
                //   setCompPin(e.target.value);
                // }}
                />
              </div>
            </>
          )}
          <hr className="cardBodyHr" />
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12 p0">
              <FieldContainer
                label="Vendor Name "
                fieldGrid={12}
                value={formatString(vendorName)}
                astric={true}
                required={true}
                onChange={(e) => {
                  setVendorName(e.target.value);
                  // setVendorNameFun(e.target.value);
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
              {existError && (
                <>
                  <small style={{ color: messageColor }}>{existError}</small>
                  {messageColor == "red" ? (
                    <Link to="/admin/pms-page-master" style={{ color: "blue" }}>
                      Add Page
                    </Link>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
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
            <div className="col-lg-4 col-md-4 col-12 p0">
              <FieldContainer
                label="Mobile"
                fieldGrid={12}
                value={mobile}
                astric
                type="text"
                required={true}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Allow only numbers using regex
                  if (/^\d*$/.test(inputValue)) {
                    handleMobileNumSet(e);
                  }
                }}
              />
              {validationMessage && (
                <div
                  style={{
                    marginTop: "8px",
                    color: isNumberValid ? "green" : "red",
                    fontSize: "14px",
                  }}
                >
                  {validationMessage}
                </div>
              )}
              {validator.mobile && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter mobile number
                </span>
              )}

              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {!validator.mobile &&
                    isContactTouched1 &&
                    !mobileValid &&
                    "Please enter valid mobile number"}
                </span>
              }
            </div>
            <div className="col-lg-4 col-md-4 col-12 p0">
              <FieldContainer
                label="Alternate Mobile"
                fieldGrid={12}
                value={altMobile}
                required={false}
                type="text"
                onChange={(e) => handleAlternateMobileNumSet(e, setAltMobile)}
              />
              {
                <span style={{ color: "red", fontSize: "12px" }}>
                  {mandatoryFieldsEmpty.altMobile &&
                    "Please enter alternate mobile"}
                </span>
              }
            </div>
            <div className="col-lg-4 col-md-4 col-12 p0">
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
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">
                  Vendor Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="flexCenter input-group thmInputGroup">
                  <div className="w-100">
                    <Select
                      options={vendorTypeData}
                      required={true}
                      value={
                        vendorTypeData.find((opt) => opt.value === typeId) ||
                        null
                      }
                      onChange={(e) => {
                        setTypeId(e.value);
                        if (e.value) {
                          setValidator((prev) => ({ ...prev, typeId: false }));
                        }
                      }}
                    />
                  </div>
                  <div class="input-group-append">
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handleAddVendorTypeClick}
                      title="Add Vendor Type.."
                    >
                      <AddIcon />
                    </button>
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handleInfoClick}
                      title="Vendor Type Info.."
                    >
                      <RemoveRedEyeIcon />
                    </button>
                  </div>
                </div>
                {validator.typeId && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select vendor type
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">
                  Platform <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="flexCenter input-group thmInputGroup">
                  <div className="w-100">
                    <Select
                      options={platformData?.data?.map((option) => ({
                        value: option._id,
                        label: FormatName(option.platform_name),
                      }))}
                      required={true}
                      value={{
                        value: platformId,
                        label:
                          platformData?.data?.find(
                            (role) => role._id == platformId
                          )?.platform_name || "",
                      }}
                      onChange={(e) => {
                        setPlatformId(e.value);
                        if (e.value) {
                          setValidator((prev) => ({
                            ...prev,
                            platformId: false,
                          }));
                        }
                      }}
                    ></Select>
                  </div>
                  <div class="input-group-append">
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handleAddPlatformClick}
                      title="Add Platform.."
                    >
                      <AddIcon />
                    </button>
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handlePlatformInfoClick}
                      title="Platform Info.."
                    >
                      <RemoveRedEyeIcon />
                    </button>
                  </div>
                </div>
                {validator.platformId && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select platform
                  </span>
                )}
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-4 col-12 p0">
              <FieldContainer
                label="Vendor Legal Name "
                fieldGrid={12}
                value={formatString(vendorLegalName)}
                onChange={(e) => {
                  setVendorLegalName(e.target.value);
                }}
              />
            </div> */}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Bank Details</h5>

          {/* {(!_id || (contextData && contextData[65]?.view_value === 1)) && ( */}
          <div className="d-flex">
            <button
              className="btn cmnbtn btn_sm btn-primary mr-2"
              onClick={handleAddBankInfoRow}
            >
              Add Another Bank Details
            </button>
            <button
              className="btn smbtn btn_sm btn-success"
              onClick={handleOpenPannyDrop}
            >
              Add Panny Drop
            </button>
          </div>
          {/* )} */}
        </div>
        <div className="card-body thm_form">
          <div className="row">
            {bankRows?.map((row, i) => (
              <>
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="form-group">
                    <label className="form-label">
                      Payment Method <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <div className="flexCenter input-group thmInputGroup">
                      <div className="w-100">
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
                              setValidator((prev) => ({
                                ...prev,
                                payId: false,
                              }));
                            }
                          }}
                          isDisabled={row.is_verified} // Disable if _id exists
                        ></Select>
                      </div>
                      <div class="input-group-append">
                        <button
                          class="btn icon"
                          type="button"
                          onClick={handleAddPaymentMethodClick}
                          title="Add Payment Method.."
                        >
                          <AddIcon />
                        </button>
                        <button
                          class="btn icon"
                          type="button"
                          onClick={handlePaymentMethodInfoClick}
                          title="Payment Method Info.."
                        >
                          <RemoveRedEyeIcon />
                        </button>
                      </div>
                    </div>
                    {validator.payment_method && (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Please select payment method
                      </span>
                    )}
                  </div>
                </div>
                {bankRows[i].payment_method == "666856874366007df1dfacde" && (
                  <>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group">
                        <label className="form-label">Bank Name</label>
                        <div className="flexCenter input-group thmInputGroup">
                          <div className="w-100">
                            <Select
                              options={bankName?.map((option) => ({
                                value: option._id,
                                label: option.bank_name,
                              }))}
                              required={true}
                              value={{
                                value: bankRows[i]._id,
                                label:
                                  bankName?.find(
                                    (role) =>
                                      role.bank_name === bankRows[i].bank_name
                                  )?.bank_name || "",
                              }}
                              onChange={(e) => {
                                bankRows[i].bank_name = e.label;
                                if (e.value) {
                                  setValidator((prev) => ({
                                    ...prev,
                                    bankNameId: false,
                                  }));
                                }
                              }}
                              isDisabled={row.is_verified} // Disable if _id exists
                            />
                          </div>
                          <div class="input-group-append">
                            <button
                              class="btn icon"
                              type="button"
                              onClick={handleAddBankNameClick}
                              title="Add Bank Detail.."
                            >
                              <AddIcon />
                            </button>
                            <button
                              class="btn icon"
                              type="button"
                              onClick={handleBankNameInfoClick}
                              title="Bank Detail Info.."
                            >
                              <RemoveRedEyeIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group">
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
                            // if (!!_id) return;
                            handleAccountTypeChange(e, i);
                          }}
                          isDisabled={row.is_verified} // Disable if _id exists
                        />
                      </div>
                    </div>
                    <FieldContainer
                      label="Account Number "
                      type="text"
                      fieldGrid={4}
                      maxLength={20}
                      max={20}
                      required={false}
                      value={bankRows[i].account_number}
                      onChange={(e) => handleAccountNoChange(e, i)}
                      disabled={row.is_verified} // Disable if _id exists
                    />
                    <FieldContainer
                      required={false}
                      maxLength={11}
                      label="IFSC "
                      fieldGrid={4}
                      value={bankRows[i].ifsc}
                      onChange={(e) => handleIFSCChange(e, i)}
                      disabled={row.is_verified} // Disable if _id exists
                    />
                    <FieldContainer
                      label="PAN No"
                      fieldGrid={4}
                      value={bankRows[i].pan_card}
                      onChange={(e) => handlePANChange(e, i)}
                      disabled={row.is_verified && bankRows[i].pan_card != ""} // Disable if _id exists
                    />
                    <FieldContainer
                      label="Account Holder Name"
                      fieldGrid={4}
                      value={bankRows[i].account_holder_name}
                      onChange={(e) => handleAccountHolderChange(e, i)}
                      disabled={
                        row.is_verified && bankRows[i].account_holder_name != ""
                      } // Disable if _id exists
                    />
                    <div className="col-lg-8 col-md-8 col-12"></div>
                  </>
                )}
                {bankRows[i].payment_method == "666856754366007df1dfacd2" && (
                  <FieldContainer
                    required={false}
                    fieldGrid={4}
                    label="UPI ID "
                    value={bankRows[i].upi_id}
                    onChange={(e) => handleUPIidChange(e, i)}
                    disabled={row.is_verified} // Disable if _id exists
                  />
                )}

                {(bankRows[i].payment_method == "66681c3c4366007df1df1481" ||
                  bankRows[i].payment_method == "666856624366007df1dfacc8") && (
                    <FieldContainer
                      label={"Registered Mobile Number"}
                      value={bankRows[i].registered_number}
                      required={false}
                      fieldGrid={4}
                      type="number"
                      onChange={(e) => handleRegisteredMobileChange(e, i)}
                      disabled={row.is_verified} // Disable if _id exists
                    />
                  )}
                <Divider sx={{ mb: 2 }} />
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
          </div>
          <hr className="cardBodyHr" />
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">
                  PayCycle <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="flexCenter input-group thmInputGroup">
                  <div className="w-100">
                    <Select
                      options={cycleData
                        ?.map((option) => ({
                          value: option._id,
                          label: option.cycle_name,
                          createdAt: option.createdAt,
                        }))
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt) - new Date(b.createdAt)
                        )}
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
                  </div>
                  <div class="input-group-append">
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handleAddPayCycleClick}
                      title="Add Pay Cycle.."
                    >
                      <AddIcon />
                    </button>
                    <button
                      class="btn icon"
                      type="button"
                      onClick={handlePayCycleInfoClick}
                      title="Pay Cycle Info.."
                    >
                      <RemoveRedEyeIcon />
                    </button>
                  </div>
                </div>
                {validator.cycleId && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please select pay cycle
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">Closed By</label>
                <Select
                  className=""
                  options={userContextData?.map((option) => ({
                    value: option.user_id,
                    label: `${option.user_name}`,
                  }))}
                  value={{
                    value: userId,
                    label:
                      userContextData.find((user) => user.user_id === userId)
                        ?.user_name || "",
                  }}
                  onChange={(e) => {
                    setUserId(e.value);
                    // console.log(e.value, "e.value");
                  }}
                  required={false}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">
                  Is GST Available ? <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup pt12">
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="verified"
                        value=""
                      />
                      Yes
                    </label>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="verified"
                        value=""
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 p0">
              <div
                className="threshold_style flexCenter"
                style={{ display: "flex", width: "min-content" }}
              >
                <FieldContainer
                  label="Threshold Limit"
                  fieldGrid={7}
                  value={limit}
                  type="text"
                  required={false}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {
                      setLimit(inputValue);
                    }
                  }}
                />
                <div
                  class="btn-group mt12"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    class="btn cmnbtn btn-outline-dark"
                    onClick={() => setLimit(50000)}
                  >
                    50K
                  </button>
                  <button
                    type="button"
                    class="btn cmnbtn btn-outline-dark"
                    onClick={() => setLimit(100000)}
                  >
                    100K
                  </button>
                  <button
                    type="button"
                    class="btn cmnbtn btn-outline-dark"
                    onClick={() => setLimit(200000)}
                  >
                    200K
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form-group">
                <label className="form-label"> DOB </label>
                <input
                  type="date"
                  className="form-control"
                  max={new Date().toISOString().split("T")[0]}
                  required="false"
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Personal Details</h5>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsPrevious}
                onChange={(e) => handleCheckboxChange(e)}
                name="checked"
                color="primary"
              />
            }
            label="Same as Company Address"
          />
        </div>
        <div className="card-body thm_form">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-12">
              <div className="form-group">
                <label className="form-label">
                  Country Code
                  {/* <sup style={{ color: "red" }}>*</sup> */}
                </label>
                <Autocomplete
                  id="country-select-demo"
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
                        srcSet={`https://flagcdn.com/w40/${option.code?.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code?.toLowerCase()}.png`}
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
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12 p0">
              <FieldContainer
                label={
                  <span>
                    PinCode <span style={{ color: "red" }}>*</span>
                  </span>
                }
                fieldGrid={12}
                value={homePincode}
                maxLength={6}
                required={true}
                onChange={handlepincode}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              {countryCode == "91" ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label">Home State</label>
                      <IndianStatesMui
                        selectedState={homeState}
                        onChange={(option) =>
                          setHomeState(option ? option : null)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="form-group">
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
                </div>
              ) : (
                <FieldContainer
                  fieldGrid={12}
                  label="Country"
                  value={otherCountry}
                  required={false}
                  onChange={(e) => setOtherCountry(e.target.value)}
                />
              )}
            </div>
            <div className="col-lg-12 col-md-12 col-12 p0">
              <FieldContainer
                label="Home Address"
                fieldGrid={12}
                value={homeAddress}
                required={false}
                onChange={(e) => setHomeAddress(e.target.value)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-12"></div>
            <div className="col-lg-4 col-md-4 col-12"></div>
          </div>
          <div className="row">
            {whatsappLink?.map((link, index) => (
              <>
                <div className="col-lg-6 col-md-6 col-12 p0">
                  <FieldContainer
                    key={index}
                    fieldGrid={12}
                    label={`Whatsapp Link ${index + 1}`}
                    value={link.link}
                    required={true}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                </div>
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <div className="flexCenter input-group thmInputGroup">
                      <div className="w-100">
                        <Select
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
                      </div>
                      {index == 0 && (
                        <>
                          <div class="input-group-append">
                            <button
                              class="btn icon"
                              type="button"
                              onClick={handleAddWhatsappGroupLinkTypeClick}
                              title="Add Pay Cycle.."
                            >
                              <AddIcon />
                            </button>
                            <button
                              class="btn icon"
                              type="button"
                              onClick={handleWhatsappGroupLinkTypeInfoClick}
                              title="Pay Cycle Info.."
                            >
                              <RemoveRedEyeIcon />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-1 col-md-1 col-12">
                  <button
                    className="icon btn-outline-danger mt28"
                    onClick={removeLink(index)}
                  >
                    <RemoveCircleTwoToneIcon />
                  </button>
                </div>
              </>
            ))}
          </div>
          <div className="row">
            <div className="col-12">
              <div className="addBankRow mb12">
                <Button onClick={addLink}>
                  <IconButton variant="contained" color="primary">
                    <AddCircleTwoToneIcon />
                  </IconButton>
                  Add Whatsapp Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flexCenter">
        <Stack direction="row" spacing={2} className="mb24">
          <Button
            className="btn cmnbtn btn-primary"
            onClick={handleSubmit}
            variant="contained"
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? "Submitting..." : _id ? "Update" : "Submit"}
          </Button>
        </Stack>
        {/* {_id ? (
              ''
            ) : (
              <Stack direction="row" spacing={2} style={{ marginLeft: '5px' }}>
                {/* <Button
                  className="btn cmnbtn btn-info"
                  onClick={handleSubmitNew}
                  variant="contained"
                  disabled={isFormSubmitting2}
                >
                  {isFormSubmitting2
                    ? 'Submitting...'
                    : _id
                      ? 'Save'
                      : 'Add New Profile'}
                </Button>
              </Stack>
            )} */}
      </div>
      <AddVendorModal />
      {isVendorModalOpen && <VendorTypeInfoModal />}
    </>
  );
};

export default VendorMaster;
