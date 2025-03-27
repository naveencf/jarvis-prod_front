import React, { useState, useEffect, useRef, use } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGetAllAccountTypeQuery } from "../../../Store/API/Sales/SalesAccountTypeApi";
import { useGetAllCompanyTypeQuery } from "../../../Store/API/Sales/CompanyTypeApi";
import {
  useEditBrandCategoryTypeMutation,
  useGetAllBrandCategoryTypeQuery,
} from "../../../Store/API/Sales/BrandCategoryTypeApi";
import {
  useAddAccountMutation,
  useEditAccountMutation,
  useGetSingleAccountQuery,
} from "../../../Store/API/Sales/SalesAccountApi";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import Modal from "react-modal";
import CreateBrandCategory from "./CreateBrandCategory";
import CreateAccountType from "./CreateAccountType";
import CreateCompanyType from "./CreateCompanyType";
import View from "./View/View";
import { ViewCompanyTypeColumns } from "./Columns/ViewCompanyTypeColumns";
import { ViewAccountTypeColumns } from "./Columns/ViewAccountTypeColumns";
import PointOfContact from "./PointOfContact";
import DocumentUpload from "./DocumentUpload";
import {
  useEditDocumentMutation,
  useGetDocumentByIdQuery,
} from "../../../Store/API/Sales/AccountDocumentApi";
import {
  useEditPOCMutation,
  useGetSinglePOCQuery,
} from "../../../Store/API/Sales/PointOfContactApi";
import { useGetAllDocumentTypeQuery } from "../../../Store/API/Sales/DocumentTypeApi";
import Loader from "../../../Finance/Loader/Loader";
import IndianStatesMui from "../../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../../ReusableComponents/IndianCitiesMui";
import { useGetCountryCodeQuery } from "../../../Store/reduxBaseURL";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import SocialComponent from "./SocialComponent";
import CreateDepartment from "./CreateDepartment";
import {
  useGetDepartmentListQuery,
  useUpdateDepartmentMutation,
} from "../../../Store/API/Sales/DepartmentApi";
import ShareIncentive from "./ShareIncentive";
import CreateBrand from "./CreateBrand";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import AccountSubmitDialog from "./AccountSubmitDialog";
import { Pencil } from "@phosphor-icons/react";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const socialOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
];

const CreateSalesAccount = () => {
  const { id } = useParams();
  const { contextData } = useAPIGlobalContext();
  const { toastAlert, toastError } = useGlobalContext();
  const normalToken = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const token = getDecodedToken();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const loginUserRole = token.role_id;

  const loginUserId = token.id;
  const {
    data: allBrands,
    error: allBrandsError,
    isLoading: allBrandsLoading,
  } = useGetAllBrandQuery();
  const {
    data: allAccountTypes,
    error: allAccountTypesError,
    isLoading: allAccountTypesLoading,
  } = useGetAllAccountTypeQuery();

  const {
    data: allCompanyType,
    error: allCompanyTypeError,
    isLoading: allCompanyTypeLoading,
  } = useGetAllCompanyTypeQuery();

  const {
    data: allBrandCatType,
    error: allBrandCatTypeError,
    isLoading: allBrandCatTypeLoading,
  } = useGetAllBrandCategoryTypeQuery();

  const {
    data: allDocType,
    error: allDocTypeError,
    isLoading: allDocTypeLoading,
  } = useGetAllDocumentTypeQuery();

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentError,
  } = useGetDepartmentListQuery();

  const { data: countryCodeData } = useGetCountryCodeQuery();
  const countries = countryCodeData;

  const [
    createSalesAccount,
    {
      isLoading: isCreateSalesLoading,
      isSuccess: isAccountCreationSuccess,
      isError: isAccountCreationError,
    },
  ] = useAddAccountMutation();

  const { data: singleAccountData, isLoading: accountDataLoading } =
    useGetSingleAccountQuery(id, {
      skip: id == 0,
    });
  const [d_id, setD_id] = useState(id);
  const [accountName, setAccountName] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [website, setWebsite] = useState("");
  const [turnover, setTurnover] = useState("");
  const [officesCount, setOfficesCount] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [fields, setFields] = useState([{ platform: null, link: "" }]);

  const [gifts, setGifts] = useState(false);
  const [connectedOffice, setConnectedOffice] = useState("");
  const [connectedBillingStreet, setConnectedBillingStreet] = useState("");
  const [connectedBillingCity, setConnectedBillingCity] = useState("");
  const [connectedBillingState, setConnectedBillingState] = useState("");
  const [connectedBillingCountry, setConnectedBillingCountry] =
    useState("India");
  const [headOffice, setHeadOffice] = useState("");
  const [headBillingStreet, setHeadBillingStreet] = useState("");
  const [headBillingCity, setHeadBillingCity] = useState("");
  const [headBillingState, setHeadBillingState] = useState("");
  const [headBillingCountry, setHeadBillingCountry] = useState("");
  const [headPinCode, setHeadPincode] = useState(null);
  const [conPinCode, setConPinCode] = useState(null);
  const [companyEmail, setCompanyEmail] = useState(null);
  // const [description, setDescription] = useState("");
  const [accOwnerNameData, setAccOwnerNameData] = useState([]);
  const [modalContentType, setModalContentType] = useState(false);
  const [fillHeadFields, setFillHeadFields] = useState(false);
  const [accountMasterData, setAccountMasterData] = useState();
  const [isBrandModal, setIsBrandModal] = useState(false);
  const [gstDetails, setGstDetails] = useState();

  const isAdmin =
    contextData?.find((data) => data?._id == 64)?.view_value !== 1;
  const [pocs, setPocs] = useState([
    {
      contact_name: "",
      contact_no: "",
      alternative_contact_no: "",
      email: "",
      department: "",
      designation: "",
      description: "",
      social_platforms: [{ platform: socialOptions[0], link: "" }],
    },
  ]);
  const [documents, setDocuments] = useState([
    {
      file: null,
      document_master_id: "",
      document_no: "",
    },
  ]);
  const [accountId, setAccountId] = useState();
  const [isValid, setIsValid] = useState({
    account_name: false,
    account_type_id: false,
    company_type_id: false,
    category_id: false,
    account_owner_id: false,
    brand_id: false,
  });

  const accountNameRef = useRef(null);
  const accountTypeRef = useRef(null);
  const companyTypeRef = useRef(null);
  const categoryRef = useRef(null);
  const accountOwnerRef = useRef(null);

  // account_name: true,
  //   account_type_id: true,
  //   company_type_id: true,
  //   category_id: true,
  //   account_owner_id: true,

  const [isValidPoc, setIsValIDPoc] = useState({});
  const [isValidDoc, setIsValidDoc] = useState({});
  const [updateSalesAccount, { isLoading: editAccountLoading }] =
    useEditAccountMutation();
  const [editDep, { isLoading: depload }] = useUpdateDepartmentMutation();
  //get Documents with account_id
  const { data: singleAccountDocuments, isLoading: DocumentsLoading } =
    useGetDocumentByIdQuery(accountId, { skip: !accountId });

  //get POC with account_id
  const { data: singlePoc, isLoading: pocLoading } = useGetSinglePOCQuery(
    accountId,
    {
      skip: !accountId,
    }
  );

  //update POC
  const [updatePocs, { isLoading: editPocLoading }] = useEditPOCMutation();

  //update Document
  const [updateDocs, { isLoading: editDocumentLoading }] =
    useEditDocumentMutation(accountId, {
      skip: !accountId,
    });
  const [edit, { isLoading }] = useEditBrandCategoryTypeMutation();
  const handelDepEdit = async (row, setEditFlag) => {
    const payload = {
      id: row._id,
      department_name: row.department_name,
    };
    try {
      await editDep(payload).unwrap();
      setEditFlag(false);
    } catch (error) { }
  };
  const handleEdit = async (row, setEditFlag) => {
    const payload = {
      id: row._id,
      brand_category_name: row.brand_category_name,
    };
    try {
      await edit(payload).unwrap();
      setEditFlag(false);
    } catch (error) { }
  };
  const ViewBrandCategoryColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 100,
      sortable: true,
    },
    {
      key: "brand_category_name",
      name: "Brand Category Name",
      renderRowCell: (row) => row.brand_category_name,
      width: 100,
      sortable: true,
      showCol: true,
      editable: true,
    },
    {
      key: "created_date",
      name: "Created Date",
      renderRowCell: (row) => DateISOtoNormal(row.created_date),
      width: 100,
      sortable: true,
      showCol: true,
    },
    {
      key: "action",
      name: "Actions",
      renderRowCell: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        if (editflag === false)
          return (
            <button
              className="icon-1"
              onClick={() => {
                setEditFlag(index);
              }}
            >
              <i className="bi bi-pencil" />
            </button>
          );
        if (index === editflag)
          return (
            <div className="d-flex gap-">
              <button
                className="icon-1"
                onClick={() => {
                  setEditFlag(false);
                }}
              >
                <i className="bi bi-x" />
              </button>

              <button
                className="icon-1"
                onClick={() => {
                  handleEdit(row, setEditFlag);
                }}
              >
                <i className="bi bi-save" />
              </button>
            </div>
          );
      },
      width: 100,
      sortable: true,
      showCol: true,
    },
  ];
  // useEffect(() => {
  //   async function getData() {
  //     const response = await axios.get(`${baseUrl}get_all_sales_users_list`);
  //     const accOwnderData = response.data;
  //     setAccOwnerNameData(accOwnderData);
  //     setSelectedOwner(loginUserId);
  //   }
  //   getData();
  // }, []);
  // token
  useEffect(() => {
    async function getData() {
      try {
        const token = sessionStorage.getItem("token"); // Assuming token is stored in sessionStorage
        const response = await axios.get(`${baseUrl}get_all_sales_users_list`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });
        const accOwnderData = response.data;
        // console.log(accOwnderData, "accOwnderData");
        setAccOwnerNameData(accOwnderData);
        if (id == 0) setSelectedOwner(loginUserId);
      } catch (error) {
        console.error("Error fetching sales users list:", error);
      }
    }
    getData();
  }, []);
  // console.log(selectedOwner, "selectedOwner", selectedOwner, loginUserId, isAdmin)
  const transformPlatformData = (data) => {
    return data.map((item) => ({
      platform: {
        value: item.platform,
        label:
          socialOptions.find((option) => option?.value === item.platform)
            ?.label || item.platform,
      },
      link: item.link,
    }));
  };

  useEffect(() => {
    const br_Cat_id = allBrandCatType?.find(
      (data) =>
        data._id ===
        allBrands?.find((item) => item?._id === selectedBrand)
          ?.brand_category_id
    )?._id;

    setSelectedCategory(br_Cat_id);
  }, [selectedBrand]);

  useEffect(() => {
    if (id && singleAccountData) {
      const {
        account_id,
        account_name,
        account_type_id,
        company_type_id,
        category_id,
        account_owner_id,
        website,
        turn_over,
        // description,
        brand_id,
        company_email,
        account_image_url,
        is_rewards_sent,
      } = singleAccountData;

      setAccountId(account_id);
      setAccountName(account_name);
      setSelectedAccountType(account_type_id);
      setSelectedCompanyType(company_type_id);
      setSelectedCategory(category_id);
      setSelectedOwner(account_owner_id);
      setWebsite(website);
      setTurnover(turn_over);
      // setDescription(description);
      setSelectedBrand(brand_id);
      setCompanyEmail(company_email);
      setPreviewUrl(account_image_url);
      setGifts(is_rewards_sent);

      async function getBilling() {
        const response = await axios.get(
          `${baseUrl}/accounts/get_single_account_billing/${singleAccountData.account_id}?_id=false`,
          {
            headers: {
              Authorization: `Bearer ${normalToken}`,
            },
          }
        );
        if (response.data.data == null) return;
        const {
          how_many_offices,
          connected_office,
          connect_billing_street,
          connect_billing_city,
          connect_billing_state,
          connect_billing_country,
          connect_billing_pin_code,
          head_office,
          head_billing_street,
          head_billing_city,
          head_billing_state,
          head_billing_country,
          head_billing_pin_code,
          social_platforms,
        } = response.data.data;
        setOfficesCount(how_many_offices);
        setConnectedOffice(connected_office);
        setConnectedBillingStreet(connect_billing_street);
        setConnectedBillingCity(connect_billing_city);
        setConnectedBillingState(connect_billing_state);
        setConnectedBillingCountry(connect_billing_country);
        setConPinCode(connect_billing_pin_code);
        setHeadOffice(head_office);
        setHeadBillingStreet(head_billing_street);
        setHeadBillingCity(head_billing_city);
        setHeadBillingState(head_billing_state);
        setHeadBillingCountry(head_billing_country);
        setHeadPincode(head_billing_pin_code);
        const transformedData = transformPlatformData(social_platforms);
        setFields(
          transformedData.length > 0
            ? transformedData
            : [{ platform: null, link: "" }]
        );
        if (
          connect_billing_street === head_billing_street &&
          connect_billing_city === head_billing_city &&
          connect_billing_state === head_billing_state &&
          connect_billing_country === head_billing_country &&
          connect_billing_pin_code === head_billing_pin_code
        ) {
          setFillHeadFields(true);
        }
      }

      getBilling();
    }
  }, [id, singleAccountData]);

  useEffect(() => {
    if (accountId || singlePoc || singleAccountDocuments) {
      setPocs(singlePoc);
      setDocuments(singleAccountDocuments);
    }
  }, [accountId, singlePoc, singleAccountDocuments]);

  useEffect(() => {
    // setAccountName(gstDetails?.legal_name?.value);
    if (gstDetails?.constitution?.value === "Private Limited Company") {
      setSelectedCompanyType("6655bd2f0f9216140c64f94b");
    }

    if (gstDetails?.constitution?.value === "Public Limited Company") {
      setSelectedCompanyType("6655bd6b0f9216140c64f956");
    }
  }, [gstDetails]);

  const handleAddPoc = () => {
    setPocs([
      ...pocs,
      {
        contact_name: "",
        contact_no: "",
        alternative_contact_no: "",
        email: "",
        department: "",
        designation: "",
        description: "",
        social_platforms: [],
      },
    ]);
  };

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      {
        file: null,
        document_master_id: "",
        document_no: "",
      },
    ]);
  };

  const handleAddMore = () => {
    setFields([...fields, { platform: null, link: "" }]);
  };

  const handleLinkChange = (index, event) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, link: event.target.value };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleDelete = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handlePlatformChange = (index, selectedOption) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, platform: selectedOption };
      }
      return field;
    });
    setFields(newFields);
  };

  const getAvailableOptions = (index) => {
    const selectedValues = fields
      .map((field) => field.platform?.value)
      .filter(Boolean);
    return socialOptions.filter(
      (option) =>
        !selectedValues.includes(option.value) ||
        fields[index].platform?.value === option.value
    );
  };

  const handleCheckboxChange = () => {
    setFillHeadFields(!fillHeadFields);
    if (!fillHeadFields) {
      setHeadOffice(connectedOffice);
      setHeadBillingStreet(connectedBillingStreet);
      setHeadBillingCity(connectedBillingCity);
      setHeadBillingState(connectedBillingState);
      setHeadBillingCountry(connectedBillingCountry);
      setHeadPincode(conPinCode);
    } else {
      setHeadOffice("");
      setHeadBillingStreet("");
      setHeadBillingCity("");
      setHeadBillingState("");
      setHeadBillingCountry("");
      setHeadPincode("");
    }
  };

  function isValidEmail(email) {
    if (!email) return true;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  function isValidPinCode(pinCode) {
    if (!pinCode) return true;
    const regex = /^\d{6}$/;
    return regex.test(pinCode);
  }

  const validateForm = () => {
    const validation = {
      account_name: accountName,
      account_type_id: selectedAccountType,
      company_type_id: selectedCompanyType,
      category_id: selectedCategory,
      account_owner_id: selectedOwner,
    };
    // const pocValidation = pocs.map((poc, index) => ({
    //   contact_name: poc.contact_name,
    //   contact_no: poc.contact_no,
    // }));
    console.log(accountName,
      selectedAccountType,
      selectedCompanyType,
      selectedCategory,
      selectedOwner,)
    setIsValid(validation);
    // setIsValIDPoc(pocValidation);

    const invalidField = Object.keys(validation).find(
      (key) => !validation[key]
    );
    // if (invalidField) {
    //   scrollToField(invalidField);
    // }
    // isValidPoc.map((poc) => {
    //   let invalidField = Object.keys(poc).find((key) => !poc[key]);
    //   return object.values(pocValidation).every((value) => value);
    // })
    return Object.values(validation).every((value) => value);
  };

  const scrollToField = (field) => {
    switch (field) {
      case "account_name":
        accountNameRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "account_type_id":
        accountTypeRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "company_type_id":
        companyTypeRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "category_id":
        categoryRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "account_owner_id":
        accountOwnerRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  const handleSubmitWithValidation = (e) => {
    console.log("first", validateForm())
    if (validateForm()) {
      console.log("second")
      handleSubmit(e);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const payloads = {
      account_name: accountName,
      account_type_id: selectedAccountType,
      company_type_id: selectedCompanyType,
      category_id: selectedCategory,
      account_owner_id: selectedOwner,
      brand_id: selectedBrand,
      website: website,
      turn_over: Number(turnover),
      how_many_offices: Number(officesCount),
      is_rewards_sent: gifts,
      connected_office: connectedOffice,
      connect_billing_street: connectedBillingStreet,
      connect_billing_city: connectedBillingCity,
      connect_billing_state: connectedBillingState,
      connect_billing_country: connectedBillingCountry,
      connect_billing_pin_code: Number(conPinCode),
      head_office: headOffice,
      head_billing_street: headBillingStreet,
      head_billing_city: headBillingCity,
      head_billing_state: headBillingState,
      head_billing_country: headBillingCountry,
      head_billing_pin_code: Number(headPinCode),
      // description: description,
      created_by: loginUserId,
      company_email: companyEmail,
      account_image: selectedImage,
    };

    const fieldsPayload = fields.map((field) => ({
      platform: field.platform?.value,
      link: field.link,
    }));

    if (fields.length > 0) {
      payloads.social_platform = fieldsPayload;
    }

    const filteredDocuments = documents.filter(
      (element) => element.document_no && element.document_master_id
    );
    const filteredPocs = pocs.filter(
      (element) =>
        element.contact_name && element.contact_no && element.department
    );

    if (filteredPocs.length === 0) {
      toastError("Please add all the required fields in Point of Contact");
      setIsValIDPoc(pocs);
      return;
    }

    const formData = new FormData();
    Object.entries(payloads).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.entries(item).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${index}][${subKey}]`, subValue);
          });
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (id == 0) {
        if (pocs.length > 0) {
          pocs.forEach((poc, index) => {
            Object.entries(poc).forEach(([key, value]) => {
              formData.append(`account_poc[${index}][${key}]`, value);
            });
          });
        }

        const response = await createSalesAccount(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).unwrap();

        const newAccountId = await response.data.accountBilling.account_id;

        if (documents?.length > 0) {
          await Promise.all(
            filteredDocuments.map((element) => {
              const documentFormData = new FormData();
              documentFormData.append("account_id", newAccountId);
              documentFormData.append("document_no", element.document_no);
              documentFormData.append(
                "document_master_id",
                element.document_master_id
              );
              documentFormData.append("document_image_upload", element.file);
              documentFormData.append("created_by", loginUserId);

              return axios.post(
                `${baseUrl}accounts/add_document_overview`,
                documentFormData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${normalToken}`,
                  },
                }
              );
            })
          );
        }

        toastAlert("Account Created Successfully");
        setAccountMasterData(response?.data?.accountMaster);
        openModal("SubmitDialogSuccess");
        // navigate("/admin/create-sales-booking", {
        //   state: {
        //     account_data: response.data.accountMaster,
        //   },
        // });
      } else {
        setIsValIDPoc(pocs);
        setIsValidDoc(documents);

        // await updateSalesAccount({ ...payloads, id }).unwrap();

        await axios.put(`${baseUrl}accounts/edit_account/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${normalToken}`,
          },
        });

        await Promise.all(
          filteredDocuments.map((element) => {
            const documentFormData = new FormData();
            element?._id && documentFormData.append("id", element._id);
            documentFormData.append(
              "account_id",
              singleAccountData?.account_id
            );
            documentFormData.append("document_no", element?.document_no);
            documentFormData.append(
              "document_master_id",
              element?.document_master_id
            );
            documentFormData.append("document_image_upload", element?.file);

            return axios.put(
              `${baseUrl}accounts/update_document_overview`,
              documentFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${normalToken}`,
                },
              }
            );
          })
        );

        await updatePocs({
          account_poc: pocs,
          updated_by: loginUserId,
          id: accountId,
        }).unwrap();

        toastAlert("Updated Successfully");
        openModal("SubmitDialogSuccess");
        // navigate("/admin/sales-account-overview");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      openModal("SubmitDialogError");
      toastError(error?.data?.message || error.message);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (contentType, operation) => {
    if (contentType === "addBrand") {
      setIsBrandModal(true);
      if (operation === "edit") {
        setD_id(id);
      } else {
        setD_id(0);
      }
    }
    setModalContentType(contentType);
  };

  const closeModal = () => {
    setModalContentType(null);
    setIsBrandModal(false);
  };

  const renderModalContent = () => {
    switch (modalContentType) {
      case "brandCategory":
        return (
          <CreateBrandCategory
            loginUserId={loginUserId}
            closeModal={closeModal}
          />
        );
      case "accountType":
        return (
          <CreateAccountType
            loginUserId={loginUserId}
            closeModal={closeModal}
          />
        );
      case "addBrand":
        return (
          <CreateBrand
            allBrandCatType={allBrandCatType}
            loginUserId={loginUserId}
            closeModal={closeModal}
            accountName={accountName}
            setSelectedBrand={setSelectedBrand}
            setSelectedAccountType={setSelectedAccountType}
            openModal={openModal}
            setSelectedCategoryParent={setSelectedCategory}
            id={d_id}
            selectedBrand={selectedBrand}
          />
        );
      case "companyType":
        return (
          <CreateCompanyType
            loginUserId={loginUserId}
            closeModal={closeModal}
          />
        );
      case "viewBrandCategory":
        return (
          <View
            title={"Industry Category View"}
            data={allBrandCatType}
            columns={ViewBrandCategoryColumns}
            isLoading={allBrandCatTypeLoading}
            tableName={"createViewBrandCategory"}
          />
        );
      case "viewCompanyType":
        return (
          <View
            title={"Company Type"}
            data={allCompanyType}
            columns={ViewCompanyTypeColumns}
            isLoading={allCompanyTypeLoading}
            tableName={"createViewCompanyType"}
          />
        );
      case "viewAccountType":
        return (
          <View
            title={"Account Type"}
            data={allAccountTypes}
            columns={ViewAccountTypeColumns}
            isLoading={allAccountTypesLoading}
            tableName={"createViewAccountType"}
          />
        );
      case "addDepartment":
        return (
          <CreateDepartment loginUserId={loginUserId} closeModal={closeModal} />
        );

      case "viewDepartment":
        return (
          <View
            title={"Department"}
            data={departments}
            columns={ViewDepartmentColumns}
            isLoading={departmentsLoading}
            tableName={"salesViewDepartment"}
          />
        );

      case "shareIncentive":
        return <ShareIncentive />;

      case "SubmitDialogSuccess":
        return (
          <AccountSubmitDialog
            response="Success"
            id={id}
            accountMasterData={accountMasterData}
          />
        );

      case "SubmitDialogError":
        return (
          <AccountSubmitDialog response="Reject" closeModal={closeModal} />
        );

      default:
        return null;
    }
  };
  useEffect(() => {
    if (selectedAccountType !== null)
      setIsValid({ ...isValid, account_type_id: selectedAccountType });
  }, [selectedAccountType]);
  useEffect(() => {
    if (selectedCompanyType !== null)
      setIsValid({ ...isValid, company_type_id: selectedCompanyType });
  }, [selectedCompanyType]);
  useEffect(() => {
    if (selectedCategory !== null)
      setIsValid({ ...isValid, category_id: selectedCategory });
  }, [selectedCategory]);
  useEffect(() => {
    if (selectedOwner !== null)
      setIsValid({ ...isValid, account_owner_id: selectedOwner });
  }, [selectedOwner]);
  useEffect(() => {
    if (selectedBrand !== null)
      setIsValid({ ...isValid, brand_id: selectedBrand });
  }, [selectedBrand]);
  // useEffect(() => {
  //   if (
  //     allAccountTypes?.find((data) => data._id === selectedAccountType)
  //       ?.account_type_name === "Agency"
  //   )
  //     setSelectedBrand(null);
  // }, [selectedAccountType]);
  let loaderview;
  if (
    allAccountTypesLoading ||
    allCompanyTypeLoading ||
    allBrandCatTypeLoading ||
    allDocTypeLoading ||
    isCreateSalesLoading ||
    accountDataLoading ||
    editAccountLoading ||
    DocumentsLoading ||
    pocLoading ||
    editPocLoading ||
    editDocumentLoading ||
    allBrandCatTypeLoading ||
    allBrandsLoading ||
    allCompanyTypeLoading ||
    allDocTypeLoading ||
    allAccountTypesLoading ||
    allCompanyTypeLoading ||
    allBrandCatTypeLoading ||
    allDocTypeLoading ||
    allBrandsLoading
  )
    loaderview = true;
  else loaderview = false;

  console.log(
    allAccountTypesLoading,
    allCompanyTypeLoading,
    allBrandCatTypeLoading,
    allDocTypeLoading,
    isCreateSalesLoading,
    accountDataLoading,
    editAccountLoading,
    DocumentsLoading,
    pocLoading,
    editPocLoading,
    editDocumentLoading,
    allBrandsLoading,
    allCompanyTypeLoading
  );

  const handlePincode = (e, state) => {
    const { value } = e.target;

    if (value.length <= 6) {
      if (state === "head") {
        setHeadPincode(value);
      } else {
        setConPinCode(value);
      }
    }
  };
  const ViewDepartmentColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 50,
      showCol: true,
      sortable: true,
    },
    { key: "department_name", name: "Department", width: 100, editable: true },
    {
      key: "action",
      name: "Actions",
      width: 100,
      renderRowCell: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        if (editflag === false)
          return (
            <button
              className="icon-1"
              onClick={() => {
                setEditFlag(index);
              }}
            >
              <i className="bi bi-pencil" />
            </button>
          );

        if (index === editflag)
          return (
            <div className="d-flex gap-2">
              <button
                className="icon-1"
                onClick={() => {
                  setEditFlag(false);
                }}
              >
                <i className="bi bi-x" />
              </button>
              <button
                className="icon-1"
                onClick={() => {
                  handelDepEdit(row, setEditFlag);
                }}
              >
                <i className="bi bi-save" />
              </button>
            </div>
          );
      },
    },
  ];
  return (
    <div>
      {loaderview && <Loader />}
      <Modal
        className="salesModal"
        isOpen={modalContentType}
        onRequestClose={closeModal}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        shouldCloseOnOverlayClick={false}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            maxWidth: isBrandModal ? "none" : "900px", // Adjust maxWidth based on modalContentType
            minWidth: isBrandModal ? "1000px" : "none", // Adjust minWidth based on modalContentType
            minHeight: isBrandModal ? "550px" : "none", // Adjust minHeight based on modalContentType
            // top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <div className="d-flex">
          <div className="icon-1 flex-end" onClick={() => closeModal()}>
            <i className="bi bi-x" />
          </div>
        </div>
        {renderModalContent()}
      </Modal>

      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle={id == 0 ? "Add Your 10cr Brand 😉" : "Accounts Master"}
            link={true}
          />
        </div>
        <div className="action_btns">
          <button
            type="button"
            className="btn cmnbtn btn-warning"
            onClick={handleAddDocument}
          >
            Add Document
          </button>
        </div>
      </div>
      <div className=" mt24">
        <DocumentUpload
          documents={documents}
          toastError={toastError}
          toastAlert={toastAlert}
          setDocuments={setDocuments}
          documentTypes={allDocType}
          isValidDoc={isValidDoc}
          setIsValidDoc={setIsValidDoc}
          id={id}
          setGstDetails={setGstDetails}
        />

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Account Detail</h5>
          </div>

          <div className="card-body">
            <div className="row">
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 p0"
                ref={accountNameRef}
              >
                <FieldContainer
                  label="Account Name"
                  fieldGrid={12}
                  astric
                  value={accountName}
                  onChange={(e) => {
                    setAccountName(e.target.value);
                    setIsValid({ ...isValid, account_name: e.target.value });
                  }}
                  placeholder="Enter billing name"
                  required
                />
                {isValid.account_name === "" && (
                  <div className="form-error">Please Enter Account Name</div>
                )}
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pl-0 flex-row">
                <div
                  className={loginUserRole === 1 ? "w-100" : "w-100"}
                  ref={accountTypeRef}
                >
                  <CustomSelect
                    fieldGrid={12}
                    label="Account Type"
                    dataArray={allAccountTypes}
                    optionId="_id"
                    optionLabel="account_type_name"
                    selectedId={selectedAccountType}
                    setSelectedId={setSelectedAccountType}
                    required
                  />

                  {isValid.account_type_id === null && (
                    <div className="form-error">Please Select Account Type</div>
                  )}
                </div>
                {loginUserRole === 1 && (
                  <div className="flex-row gap-2 pt28">
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("accountType")}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("viewAccountType")}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </div>
                )}
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 p0 flex-row gap-1">
                <div className="w-100">
                  <CustomSelect
                    fieldGrid={12}
                    label="Brand"
                    dataArray={allBrands}
                    optionId="_id"
                    optionLabel="brand_name"
                    selectedId={selectedBrand}
                    setSelectedId={setSelectedBrand}
                    required
                    astric
                  // disabled={
                  //   allAccountTypes?.find(
                  //     (data) => data._id === selectedAccountType
                  //   )?.account_type_name !== "Agency"
                  //     ? false
                  //     : true
                  // }
                  />
                  <span className="form-error">
                    Brand name & Account name can be different eg: Brand Name:
                    Myfitness, AccountName: Mensa Brands
                  </span>
                  {isValid.selectedBrand && (
                    <div className="form-error">Please select a brand</div>
                  )}
                </div>
                {/* <div className="flex-row gap-1 pt28">
                  <BrandRegistration
                    userID={loginUserId}
                    disabled={
                      allAccountTypes?.find(
                        (data) => data._id === selectedAccountType
                      )?.account_type_name !== "Agency"
                        ? false
                        : true
                    }
                  />
                </div> */}
                <div className="flex-row gap-2 pt28">
                  <button
                    type="button"
                    className="btn iconBtn btn-outline-primary"
                    onClick={() => openModal("addBrand", "add")}
                  >
                    +
                  </button>
                  {id != 0 && (
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("addBrand", "edit")}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                  )}
                </div>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 pl-0 flex-row">
                <div
                  className={loginUserRole === 1 ? "w-100" : "w-100"}
                  ref={companyTypeRef}
                >
                  <CustomSelect
                    fieldGrid={12}
                    label="Company Type"
                    dataArray={allCompanyType}
                    optionId="_id"
                    optionLabel="company_type_name"
                    selectedId={selectedCompanyType}
                    setSelectedId={setSelectedCompanyType}
                    required
                  />
                  {isValid.company_type_id === null && (
                    <div className="form-error">Please Select Company Type</div>
                  )}
                </div>
                {loginUserRole === 1 && (
                  <div className="flex-row gap-2 pt28">
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("companyType")}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("viewCompanyType")}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </div>
                )}
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 p0 flex-row">
                <div className="w-100">
                  {/* Brand Category renamed to Industry */}
                  <CustomSelect
                    fieldGrid={12}
                    label="Industry Name (Auto Select)"
                    dataArray={allBrandCatType}
                    optionId="_id"
                    optionLabel="brand_category_name"
                    selectedId={selectedCategory}
                    setSelectedId={setSelectedCategory}
                    disabled
                    required
                  />
                  {isValid.category_id === null && (
                    <div className="form-error">
                      Please Select Industry Name
                    </div>
                  )}
                </div>
                {loginUserRole == 1 && (
                  <div className="flex-row gap-2 pt28">
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("brandCategory")}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn iconBtn btn-outline-primary"
                      onClick={() => openModal("viewBrandCategory")}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </div>
                )}
              </div>

              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 p0 flex-row">
                <FieldContainer
                  fieldGrid={8}
                  label="Upload Brand Image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {/* <h6>Upload Brand Image</h6>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                /> */}
                {previewUrl && (
                  <div>
                    <h3>Image Preview:</h3>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* <div className="col-md-6 flex-row">
                <button
                  type="button"
                  className="btn cmnbtn btn-primary"
                  onClick={() => openModal("shareIncentive")}
                >
                  Share Incentive
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Socials</h3>
          </div>
          <div className="card-body row">
            <SocialComponent
              fields={fields}
              handlePlatformChange={handlePlatformChange}
              handleLinkChange={handleLinkChange}
              getAvailableOptions={getAvailableOptions}
              handleDelete={handleDelete}
            />
            {fields?.length !== socialOptions?.length && (
              <div className="flex-row sb mb-3">
                <button
                  type="button"
                  className="btn cmnbtn btn-primary"
                  onClick={handleAddMore}
                >
                  Add Another Social
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Details</h3>
          </div>
          <div className="card-body row">
            <div className="col-4" ref={accountOwnerRef}>
              <CustomSelect
                fieldGrid={12}
                label="Account Owner Name"
                dataArray={accOwnerNameData}
                optionId="user_id"
                optionLabel="user_name"
                selectedId={selectedOwner}
                setSelectedId={setSelectedOwner}
                required
                disabled={true}
              />
              {isValid.account_owner_id === null && (
                <div className="form-error">
                  Please Select Account Owner Name
                </div>
              )}
            </div>
            <div className="col-4">
              <FieldContainer
                label="Website"
                fieldGrid={12}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter website"
                required
              />
            </div>
            <div className="col-4 flex-row">
              <FieldContainer
                label="Turnover (in cr)"
                type="number"
                fieldGrid={10}
                value={turnover}
                required={false}
                onChange={(e) => setTurnover(e.target.value)}
                placeholder="Enter last financial year turnover"
              />

              {/* <div className="mt-2">

                <button className="cmnbtn bgtn btn-primary btn_sm mt-4">
                  <i
                    className="bi bi-info-circle"
                    title="Please update as per last financial year"
                  />
                </button>
              </div> */}
            </div>

            <div className="col-4">
              <FieldContainer
                label="Company Email"
                type="email"
                fieldGrid={4}
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Enter company email"
                required
              />
              {!isValidEmail(companyEmail) && (
                <div className="form-error">Please Enter Valid Email</div>
              )}
            </div>
            <div className="col-4">
              <FieldContainer
                label="How Many Offices"
                type="number"
                fieldGrid={12}
                value={officesCount}
                onChange={(e) => setOfficesCount(e.target.value)}
                placeholder="Enter number of offices"
              />
            </div>

            {/* <div className="col-4">
              <CustomSelect
                fieldGrid={12}
                label="Social"
                dataArray={socialOptions}
                optionId="value"
                optionLabel="label"
                selectedId={selectedOfficeSocial}
                setSelectedId={setSelectedOfficeSocial}
              />
            </div>

            {selectedOfficeSocial && (
              <div className="col-4">
                <FieldContainer
                  label={`${selectedOfficeSocial} link`}
                  type="url"
                  fieldGrid={12}
                  value={(e) => accountSocialLink(e.target.value)}
                  onChange={setAccountSocialLink}
                  placeholder="Enter link"
                />
              </div>
            )} */}

            {/* <div className="col-4">
              <FieldContainer
                label="Description"
                fieldGrid={12}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div> */}
          </div>
        </div>

        <div className="card">
          <div className="card-header ">
            <div className="d-flex justify-content-between w-100">
              <h3 className="card-title">Connected Address</h3>
              <div>
                <input
                  type="checkbox"
                  value={gifts}
                  onChange={(e) => setGifts(e.target.checked)}
                />
                <label className="form-label">Diwali Gifts</label>
              </div>
            </div>
          </div>
          <div className="card-body row">
            {/* <div className="col-4">
              <FieldContainer
                label="Connected Office"
                fieldGrid={12}
                value={connectedOffice}
                onChange={(e) => setConnectedOffice(e.target.value)}
                placeholder="Enter connected offices"
              />
            </div> */}
            <div className="col-4">
              <FieldContainer
                label="Pin Code"
                type="number"
                fieldGrid={4}
                value={conPinCode}
                onChange={(e) => handlePincode(e, "connected")}
                placeholder="Enter pin code"
              />
            </div>
            <div className="col-md-4 flex-row">
              <div className="col-12">
                <CustomSelect
                  fieldGrid={12}
                  label="Connected Billing Country"
                  dataArray={countries}
                  optionId="country_name"
                  optionLabel="country_name"
                  selectedId={connectedBillingCountry}
                  setSelectedId={setConnectedBillingCountry}
                />
              </div>
            </div>
            <div className="form-group col-4">
              <label htmlFor="">Connected Billing State</label>
              <IndianStatesMui
                selectedState={connectedBillingState}
                onChange={(option) =>
                  setConnectedBillingState(option ? option : null)
                }
              />
            </div>

            <div className="form-group col-4">
              <label htmlFor="">Connected Billing City</label>
              <IndianCitiesMui
                selectedState={connectedBillingState}
                selectedCity={connectedBillingCity}
                onChange={(option) =>
                  setConnectedBillingCity(option ? option : null)
                }
              />
            </div>
            <div className="col-4">
              <FieldContainer
                label="Connected Billing Address"
                fieldGrid={12}
                value={connectedBillingStreet}
                onChange={(e) => setConnectedBillingStreet(e.target.value)}
                placeholder="Enter connected billing Addresss"
              />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <label className="card-title flex-row ml-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={fillHeadFields}
                onChange={handleCheckboxChange}
              />
              <p className="card-title mt-1">
                Head office address same as Connected Office{" "}
              </p>
            </label>
          </div>
          <div className="card-body row">
            {/* <div className="col-4">
              <FieldContainer
                label="Head Office"
                fieldGrid={12}
                value={headOffice}
                onChange={(e) => setHeadOffice(e.target.value)}
                placeholder="Enter head office"
              />
            </div> */}
            <div className="col-4">
              <FieldContainer
                label="Pin Code"
                type="number"
                fieldGrid={4}
                value={headPinCode}
                onChange={(e) => handlePincode(e, "head")}
                placeholder="Enter pin code"
              />
            </div>
            <div className="col-md-4 flex-row">
              <div className="col-12">
                <CustomSelect
                  fieldGrid={12}
                  label="Head Billing Country"
                  dataArray={countries}
                  optionId="country_name"
                  optionLabel="country_name"
                  selectedId={headBillingCountry}
                  setSelectedId={setHeadBillingCountry}
                />
              </div>
            </div>
            <div className="form-group col-4 ">
              <label htmlFor="">Head Billing State</label>
              <IndianStatesMui
                selectedState={headBillingState}
                onChange={(option) =>
                  setHeadBillingState(option ? option : null)
                }
              />
            </div>

            <div className="form-group col-4 ">
              <label htmlFor="">Head Billing City</label>
              <IndianCitiesMui
                selectedState={headBillingState}
                selectedCity={headBillingCity}
                onChange={(option) =>
                  setHeadBillingCity(option ? option : null)
                }
              />
            </div>

            <div className="col-4">
              <FieldContainer
                label="Head Billing Address"
                fieldGrid={12}
                value={headBillingStreet}
                onChange={(e) => setHeadBillingStreet(e.target.value)}
                placeholder="Enter head billing Address"
              />
            </div>
          </div>
        </div>
        <PointOfContact
          pocs={pocs}
          setPocs={setPocs}
          departments={departments}
          isValidPoc={isValidPoc}
          setIsValIDPoc={setIsValIDPoc}
          socialOptions={socialOptions}
          openModal={openModal}
        />

        <div className="flex-row sb mb-3">
          <button
            className="btn cmnbtn btn-primary"
            disabled={isCreateSalesLoading || editAccountLoading}
            onClick={handleSubmitWithValidation}
          >
            {!isCreateSalesLoading || !editAccountLoading
              ? id == 0
                ? "Submit"
                : "Save"
              : id == 0
                ? "Submitting..."
                : "Saving..."}
          </button>
          <button
            className="btn cmnbtn btn-warning"
            onClick={() => handleAddPoc()}
          >
            Add More POC
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSalesAccount;
