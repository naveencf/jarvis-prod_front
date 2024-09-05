import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate, useLocation } from "react-router";
import Select, {components} from "react-select";
import "./Tagcss.css";
import { IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalType,
  setOpenShowAddModal,
  setOpenShowPageInfoModal,
} from "../../Store/PageMaster";
import PageAddMasterModal from "./PageAddMasterModal";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllProfileListQuery,
  useGetOwnershipTypeQuery,
  useGetPageByIdQuery,
  useGetPlatformPriceQuery,
} from "../../Store/PageBaseURL";
import PageInfoModal from "./PageInfoModal";
import {
  handleChangeVendorInfoModal,
  setShowAddVendorModal,
  setModalType as setVendorModalType,
} from "../../Store/VendorMaster";
import VendorTypeInfoModal from "./VendorTypeInfoModal";
import AddVendorModal from "./AddVendorModal";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import { useParams, useNavigate } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PageMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const vendorDetails = {
    _id: queryParams.get('_id'),
  };

  const { pageMast_id } = useParams();
  const vendorInfoModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );
  const pageInfoModlaOpen = useSelector(
    (state) => state.pageMaster.showInfoModal
  );

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { toastAlert, toastError } = useGlobalContext();
  const [pageName, setPageName] = useState("");
  const [link, setLink] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformId, setPlatformId] = useState("666818824366007df1df1319");

  const [primary, setPrimary] = useState({ value: "Yes", label: "Yes" });

  const [categoryId, setCategoryId] = useState("");
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState("");
  const [pageStatus, setPageStatus] = useState("Active");
  const [userData, setUserData] = useState([]);
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("Non Adult");
  const [content, setContent] = useState("By CF");
  const [ownerType, setOwnerType] = useState("66ab43f41068e2b9eea495a9");
  const [vendorId, setVendorId] = useState("");
  const [followCount, setFollowCount] = useState("");
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [priceTypeList, setPriceTypeList] = useState([]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [activeTab, setActiveTab] = useState('666818824366007df1df1319');
  const [singleVendor, setSingleVendor] = useState({});
  const [verified, setVerified] = useState(null);

  const [rateType, setRateType] = useState({ value: "Fixed", label: "Fixed" });
  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });

  const [validateFields, setValidateFields] = useState({
    pageName: false,
    link: false,
    platformId: false,
    categoryId: false,
    pageLevel: false,
    pageStatus: false,
    closeBy: false,
    pageType: false,
    content: false,
    ownerType: false,
    vendorId: false,
    followCount: false,
    profileId: false,
    platformActive: false,
    // rate: false,
    description: false,
    rateType: false,
    variableType: false,
    // tag: false,
    primary: false,
  });

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };
  const [rowCount, setRowCount] = useState([
    { page_price_type_id: "", price: "" },
  ]);

  const dispatch = useDispatch();

  const { data: ownerShipData } = useGetOwnershipTypeQuery();

  const { data: profileData } = useGetAllProfileListQuery();

  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];

  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

  const { data: vendor } = useGetAllVendorQuery();

  const vendorData = vendor?.data || [];
  const { data: singlePageData, isLoading: singlePageLoading } =
    useGetPageByIdQuery(pageMast_id, { skip: !pageMast_id });
  const { refetch: refetchPageList } = useGetAllPageListQuery();

  const { data: platformPriceData, isLoading: isPriceLoading } =
    useGetPlatformPriceQuery();

  const [showAll, setShowAll] = useState(true)
  const optionsToShow = showAll ? userData : userData.slice(0, 5);

  useEffect(() => {
    if (!singlePageLoading && pageMast_id) {
      setPageName(singlePageData?.page_name);
      setLink(singlePageData?.page_link);
      setPlatformId(singlePageData?.platform_id);
      setCategoryId(singlePageData?.page_category_id);

      setPageLevel(singlePageData?.preference_level);
      if (singlePageData.status == 1) {
        setPageStatus("Active");
      } else {
        setPageStatus("Inactive");
      }
      setCloseBy(singlePageData?.page_closed_by);
      setPageType(singlePageData?.page_name_type);
      setContent(singlePageData?.content_creation);
      setOwnerType(singlePageData?.ownership_type);
      setVendorId(singlePageData.vendor_id);
      setFollowCount(singlePageData?.followers_count);
      setProfileId(singlePageData?.page_profile_type_id);
      const platformActiveData = platformData?.filter((e) =>
        singlePageData?.platform_active_on?.includes(e._id)
      );
      let platformActiveDataList = platformActiveData?.map((e) => ({
        value: e._id,
        label: e.platform_name,
      }));
      setPlatformActive(platformActiveDataList ? platformActiveDataList : []);
      setRate(singlePageData?.engagment_rate);
      setDescription(singlePageData?.description);
      setRateType({
        value: singlePageData?.rate_type,
        label: singlePageData?.rate_type,
      });
      setVariableType({
        value: singlePageData?.variable_type,
        label: singlePageData?.variable_type,
      });

      setPrimary({
        value: singlePageData?.primary_page,
        label: singlePageData?.primary_page,
      });

      const tags = categoryData?.filter((e) =>
        singlePageData?.tags_page_category?.includes(e._id)
      );
      let tagData = tags?.map((e) => ({
        value: e?._id,
        label: e?.page_category,
        // label: e?.category_name,
      }));
      setTag(tagData);

      let story = singlePageData?.story;
      let post = singlePageData?.post;
      let both_ = singlePageData?.both_;

      setRowCount([
        {
          page_price_type_id: "667e6c7412fbbf002179f6d6",
          price: post,
        },
        {
          page_price_type_id: "667e6c9112fbbf002179f72c",
          price: story,
        },
        {
          page_price_type_id: "667e6c9c12fbbf002179f72f",
          price: both_,
        },
      ]);
    }
  }, [singlePageLoading]);

  // useEffect(() => {
  //   if (rowCount.length > 0) {
  //     let data = priceTypeList?.filter(
  //       (e) => !rowCount.map((row) => row.page_price_type_id).includes(e._id)
  //     );
  //     setFilterPriceTypeList(data);
  //   }
  // }, [rowCount, priceTypeList]);

  useEffect(() => {
    if (rowCount.length > 0) {
      let data = priceTypeList?.filter(
        (e) => !rowCount.map((row) => row.page_price_type_id).includes(e._id)
      );
      const updatedPrices = data.filter((item)=> item.platfrom_id == platformId)
      setFilterPriceTypeList(updatedPrices);
    }
  }, [rowCount, priceTypeList, platformId]);

  useEffect(() => {
    if (platformPriceData?.length > 0) {
      setPriceTypeList(platformPriceData);
      setFilterPriceTypeList(platformPriceData);
    } else {
      console.log("Condition not met");
    }
  }, [platformPriceData, isPriceLoading]);

  // useEffect(() => {
  //   if (!isPriceLoading && pageMast_id && priceData.length > 0) {
  //     setRowCount(
  //       priceData?.map((e) => ({
  //         page_price_type_id: e.page_price_type_id,
  //         price: e.price,
  //       }))
  //     );
  //   }
  // }, [priceData]);

  const PageLevels = [
    { value: "Level 1 (High)", label: "Level 1 (High)" },
    { value: "Level 2 (Medium)", label: "Level 2 (Medium)" },
    { value: "Level 3 (Low)", label: "Level 3 (Low)" },
  ];

  const PageStatus = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Disabled", label: "Disabled" },
  ];

  const PageTypes = [
    { value: "Non Adult", label: "Non Adult" },
    { value: "Adult", label: "Adult" },
  ];

  const Contents = [
    { value: "By Vendor", label: "By Vendor" },
    { value: "By CF", label: "By CF" },
    { value: "Both", label: "Both" },
  ];

  const ProfileTypeData = [
    { value: "Theme", label: "Theme" },
    { value: "Influencer", label: "Influencer" },
  ];

  const handleAddProfileTypeClick = () => {
    dispatch(setOpenShowAddModal());
    dispatch(setModalType("Profile Type"));
  };

  const handleProfileTypeInfoClick = () => {
    dispatch(setOpenShowPageInfoModal());
    dispatch(setModalType("Profile Type Info"));
  };

  const handleAddPlatformClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setVendorModalType("Platform"));
  };

  const handlePlatformInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setVendorModalType("Platform"));
  };

  const handleOpenPageModal = (type) => {
    return () => {
      dispatch(setOpenShowAddModal());
      dispatch(setModalType(type));
    };
  };

  const handleOpenInfoModal = (type) => {
    return () => {
      dispatch(setOpenShowPageInfoModal());
      dispatch(setModalType(type));
    };
  };

  const getData = () => {
    axios
      .get(baseUrl + "get_all_users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Adjust content type as needed
        },
      })
      .then((res) => {
        setUserData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };

  const handlePrimaryChange = (selectedOption) => {
    setPrimary(selectedOption);
  };
  // useEffect(() => {
  // if (platformId) {
  //   setPriceTypeList([]);
  //   let priceData = platformData.find((role) => role._id == platformId)?._id;
  //   axios
  //     .get(baseUrl + `v1/pagePriceTypesForPlatformId/${priceData}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json", // Adjust content type as needed
  //       },
  //     })
  //     .then((res) => {
  //       setPriceTypeList(res.data.data);
  //       setFilterPriceTypeList(res.data.data);
  //     });
  // }

  //   axios
  //     .get(baseUrl + `v1/pagePriceType`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json", // Adjust content type as needed
  //       },
  //     })
  //     .then((res) => {
  //       setPriceTypeList(res.data.data);
  //       setFilterPriceTypeList(res?.data?.data);
  //     });
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pageName === "") {
      setValidateFields((prev) => ({ ...prev, pageName: true }));
    }
    if (link === "") {
      setValidateFields((prev) => ({ ...prev, link: true }));
    }
    if (platformId === "") {
      setValidateFields((prev) => ({ ...prev, platformId: true }));
    }
    if (categoryId === "") {
      setValidateFields((prev) => ({ ...prev, categoryId: true }));
    }
    if (pageLevel === "") {
      setValidateFields((prev) => ({ ...prev, pageLevel: true }));
    }
    if (pageStatus === "") {
      setValidateFields((prev) => ({ ...prev, pageStatus: true }));
    }
    if (closeBy === "") {
      setValidateFields((prev) => ({ ...prev, closeBy: true }));
    }
    if (pageType === "") {
      setValidateFields((prev) => ({ ...prev, pageType: true }));
    }
    if (content === "") {
      setValidateFields((prev) => ({ ...prev, content: true }));
    }
    if (ownerType === "") {
      setValidateFields((prev) => ({ ...prev, ownerType: true }));
    }
    if (vendorId === "") {
      setValidateFields((prev) => ({ ...prev, vendorId: true }));
    }
    if (followCount === "") {
      setValidateFields((prev) => ({ ...prev, followCount: true }));
    }
    if (profileId === "") {
      setValidateFields((prev) => ({ ...prev, profileId: true }));
    }
    if (platformActive?.length == 0 || platformActive == null) {
      setValidateFields((prev) => ({ ...prev, platformActive: true }));
    }
    // if (rate === "") {
    //   setValidateFields((prev) => ({ ...prev, rate: true }));
    // }
    if (description === "") {
      setValidateFields((prev) => ({ ...prev, description: true }));
    }
    if (rateType === "") {
      setValidateFields((prev) => ({ ...prev, rateType: true }));
    }
    // if (tag.length == 0) {
    //   setValidateFields((prev) => ({ ...prev, tag: true }));
    // }

    if (
      pageName === "" ||
      link === "" ||
      platformId === "" ||
      categoryId === "" ||
      pageLevel === "" ||
      pageStatus === "" ||
      closeBy === "" ||
      pageType === "" ||
      content === "" ||
      ownerType === "" ||
      vendorId === "" ||
      followCount === "" ||
      profileId === "" ||
      platformActive?.length == 0 ||
      // rate === "" ||
      rateType === "" ||
      // tag.length == 0 ||
      (rateType.value == "Variable" && variableType === "") ||
      rowCount.some((e) => e.page_price_type_id === "" || e.price === "")
    ) {
      return toastError("Please Fill All Required Fields");
    }
    // console.warn("NO ERROR");
    // return
    const payload = {
      page_name: pageName,
      page_link: link,
      platform_id: platformId,
      page_category_id: categoryId,
      tags_page_category: tag.map((e) => e.value),
      preference_level: pageLevel,
      page_status: pageStatus,
      status: pageStatus == "Active" ? 1 : 0,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendor_id: vendorId,
      followers_count: followCount,
      page_profile_type_id: profileId,
      platform_active_on: platformActive.map((e) => e.value),
      engagment_rate: rate,
      description: description,
      created_by: userID,
      rate_type: rateType.value,
      variable_type: rateType.value == "Variable" ? variableType.value : null,
      page_price_multiple: rowCount,

      primary_page: primary.value,
      post:
        rowCount.find((e) => e.page_price_type_id == "667e6c7412fbbf002179f6d6")
          ?.price ?? 0,
      story:
        rowCount.find((e) => e.page_price_type_id == "667e6c9112fbbf002179f72c")
          ?.price ?? 0,
      both_:
        rowCount.find((e) => e.page_price_type_id == "667e6c9c12fbbf002179f72f")
          ?.price ?? 0,
    };
    if (pageMast_id) {
      payload.last_updated_by = userID;
      delete payload.created_by;
      return axios
        .put(`${baseUrl}v1/pageMaster/${pageMast_id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          refetchPageList();
          toastAlert(" Data Updated Successfully");
          setIsFormSubmitted(true);
        })
        .catch((error) => {
          toastError(error.response.data.message);
        });
    } else {
      return axios
        .post(baseUrl + "v1/pageMaster", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          refetchPageList();
          setIsFormSubmitted(true);
          toastAlert(" Data Submitted Successfully");
        })
        .catch((error) => {
          toastError(error.response.data.message);
        });
    }
  };

  if (isFormSubmitted) {
    // return <Navigate to="/admin/pms-page-overview" />;
    return navigate('/admin/pms-page-overview')
  }

  const addPriceRow = () => {
    setRowCount((rowCount) => [
      ...rowCount,
      { page_price_type_id: "", price: "" },
    ]);
  };

  const handlePriceTypeChange = (e, index) => {
    const newRowCount = [...rowCount];
    newRowCount[index].page_price_type_id = e.value;
    setRowCount(newRowCount);
  };
  //Milion convert format function
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}k`;
    } else {
      return value?.toString();
    }
  };

  const handlePriceChange = (e, index) => {
    if (
      e.target.value !== "" &&
      (e.target.value < 0 || isNaN(e.target.value))
    ) {
      return;
    }
    const newRowCount = [...rowCount];
    newRowCount[index].price = e.target.value;
    setRowCount(newRowCount);
  };
  const calculateFollowerCount = (index) => {
    const val = variableType.value === "Per Thousand" ? 1000 : 1000000;
    return ((followCount / val) * (rowCount[index]?.price || 0)).toFixed(2);
  };

  // see more button inside close by
  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        {!showAll && userData.length > 5 && (
          <div
            style={{
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
              color: "#007bff",
            }}
            onClick={() => setShowAll(true)}
          >
            See More
          </div>
        )}
      </components.MenuList>
    );
  };
  
  const getInitialValue = () => {
    const initialId = vendorId || vendorDetails._id;
    const initialVendor = vendorData.find((vendor) => vendor._id === initialId);
    return initialVendor ? { value: initialVendor._id, label: initialVendor.vendor_name } : null;
  };

  useEffect(() => {
    const fetchData = async() => {
      try {
        const getData = await axios.get(`${baseUrl}v1/vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setSingleVendor(getData?.data?.data)
        setCloseBy(getData?.data?.data?.closed_by)

        const matchedProfile = profileData?.data.find(profile => profile?.profile_type == getData?.data?.data?.vendor_category);
        setProfileId(matchedProfile?._id)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [vendorId]);

  const goBack = () => {
    navigate(-1);
  }

  return (
    <>
      <FormContainer
        mainTitle={!pageMast_id ? "Profile Master" : ""}
        link={true}
        // handleSubmit={handleSubmit}
        submitButton={false}
      />
      <div style={{backgroundColor:'#52b2d6',width:'3%',padding:'7px',marginBottom:'10px',cursor:'pointer'}}>
        <ArrowBackIcon onClick={goBack} />
      </div>
      <div className="parent_of_tab" style={{display:'flex'}}>
        {
          platformData?.map((item)=>(
            <div key={item._id} className="tabs">
              <button
                className={activeTab === item._id ? 'active btn btn-info' : 'btn btn-link'}
                onClick={() => {
                  setActiveTab(item._id)
                  setPlatformId(item._id)
                  setRowCount([{ page_price_type_id: "", price: "" }])
                }}
              >
                {item.platform_name}
              </button>
            </div>
          ))
        }
      </div>

      <div className={!pageMast_id ? "card" : ""}>
        {!pageMast_id && (
          <div className="card-header">
            <h5 className="card-title">Profile Master</h5>
          </div>
        )}
        <div className="card-body pb4">
          <div className="row thm_form">
          <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Vendor <sup style={{ color: "red" }}>*</sup>
                </label>
                 <Select
                  options={vendorData.map((option) => ({
                    value: option._id,
                    label: option.vendor_name,
                  }))}
                  required={true}
                  value={getInitialValue()}
                  onChange={(selectedOption) => {
                    setVendorId(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        vendorId: false,
                      }));
                    }
                  }}
                />
                {validateFields.vendorId && (
                  <small style={{ color: "red" }}>Please select Vendor</small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Platform <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={platformData?.map((option) => ({
                      value: option._id,
                      label: option.platform_name,
                    }))}
                    required={true}
                    value={{
                      value: platformId,
                      label:
                        platformData.find((role) => role._id === platformId)
                          ?.platform_name || "",
                    }}
                    onChange={(e) => {
                      setPlatformId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          platformId: false,
                        }));
                      }
                    }}
                  />
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
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.platformId && (
                  <small style={{ color: "red" }}>Please select Platform</small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Is Profile Verified ? <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="verified" value="" />Yes
                    </label>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="verified" value="" />No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={profileData?.data.map((option) => ({
                      value: option._id,
                      label: option.profile_type,
                    }))}
                    required={true}
                    value={{
                      value: profileId,
                      label:
                        profileData?.data.find((role) => role._id === profileId)
                          ?.profile_type || singleVendor.vendor_category,
                    }}
                    onChange={(e) => {
                      setProfileId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          profileId: false,
                        }));
                      }
                    }}
                  />
                  {/* <Select
                    className="w-100"
                    options={['Theme','Influencer'].map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    required={true}
                    value={{
                      value: singleVendor.vendor_category,
                      label: singleVendor.vendor_category,
                    }}
                    onChange={(e) => {
                      setProfileId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          profileId: false,
                        }));
                      }
                    }}
                  /> */}
                  <IconButton
                    onClick={handleAddProfileTypeClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Profile Type.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleProfileTypeInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Profile Type Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.profileId && (
                  <small style={{ color: "red" }}>
                    Please select Profile Type
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Status <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="Profile status"
                  options={PageStatus}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageStatus.find(
                    (option) => option.value == pageStatus
                  )}
                  onChange={(selectedOption) => {
                    setPageStatus(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageStatus: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageStatus && (
                  <small style={{ color: "red" }}>
                    Please select Profile Status
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Category <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={categoryData.map((option) => ({
                      value: option._id,
                      label: option.page_category,
                      // label: option.category_name,
                    }))}
                    required={true}
                    value={{
                      value: categoryId,
                      label:
                        categoryData.find((role) => role._id === categoryId)
                          ?.page_category || "",
                    }}
                    onChange={(e) => {
                      setCategoryId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          categoryId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleOpenPageModal("Category")}
                    variant="contained"
                    color="primary"
                    aria-label="Add Platform.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenInfoModal("Category Info")}
                    variant="contained"
                    color="primary"
                    aria-label="Platform Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.categoryId && (
                  <small style={{ color: "red" }}>Please select Category</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Tags 
                  {/* <sup style={{ color: "red" }}>*</sup> */}
                </label>
                <Select
                  isMulti
                  options={categoryData.map((option) => ({
                    value: option._id,
                    label: option.page_category,
                    // label: option.category_name,
                  }))}
                  required={true}
                  value={tag}
                  onChange={(e) => {
                    setTag(e);
                    if (e) {
                      setValidateFields((prev) => ({ ...prev, tag: false }));
                    }
                  }}
                ></Select>
                {/* {validateFields.tag && (
                  <small style={{ color: "red" }}>Please select Tags</small>
                )} */}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Profile Name"
                fieldGrid={12}
                astric={true}
                value={pageName}
                required={true}
                onChange={(e) => {
                  setPageName(e.target.value);

                  if (e.target.value) {
                    if (
                      platformData.some(
                        (e) =>
                          e.platform_name.toLowerCase() === "instagram" &&
                          e._id === platformId
                      )
                    ) {
                      setLink(()=>`https://www.instagram.com/${e.target.value}/`);
                      if(link){
                        setValidateFields((prev) => ({ ...prev, link: false }));
                      }
                    }
                    setValidateFields((prev) => ({ ...prev, pageName: false }));
                  }
                }}
              />
              {validateFields.pageName && (
                <small style={{ color: "red" }}>Please Fill Profile Name</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                fieldGrid={12}
                label="Link"
                // disabled
                astric={true}
                value={link}
                required={true}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({ ...prev, link: false }));
                  }
                }}
              />
              {validateFields.link && (
                <small style={{ color: "red" }}>Please Fill Link</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Followers Count (10L = 1M)"
                fieldGrid={12}
                astric={true}
                type="text"
                value={followCount}
                required={true}
                onChange={(e) => {
                  if (
                    e.target.value !== "" &&
                    (e.target.value < 0 || isNaN(e.target.value))
                  ) {
                    return;
                  }
                  setFollowCount(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      followCount: false,
                    }));
                  }
                }}
              />
              <small className="ml-3">{formatNumber(followCount)}</small>
              {validateFields.followCount && (
                <small style={{ color: "red" }}>
                  Please Fill Followers Count
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Preference Level <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="Profile level"
                  options={PageLevels}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageLevels.find(
                    (option) => option.value === pageLevel
                  )}
                  onChange={(selectedOption) => {
                    setPageLevel(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageLevel: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageLevel && (
                  <small style={{ color: "red" }}>
                    Please select Preference Level
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Ownership Type<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  className="w-100"
                  options={ownerShipData?.map((option) => ({
                    value: option._id,
                    label: option.company_type_name,
                  }))}
                  required={true}
                  value={{
                    value: ownerType,
                    label:
                      ownerShipData?.find((role) => role._id === ownerType)
                        ?.company_type_name || "",
                  }}
                  onChange={(e) => {
                    setOwnerType(e.label);
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        ownerType: false,
                      }));
                    }
                  }}
                />
              </div>
              {validateFields.ownerType && (
                <small style={{ color: "red" }}>
                  Please Select Ownership Type
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Primary <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={["No", "Yes"].map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={true}
                  value={{
                    value: primary.value,
                    label: primary.label,
                  }}
                  onChange={handlePrimaryChange}
                />
                {validateFields.primary && (
                  <small style={{ color: "red" }}>
                    Please Fill Primary Type
                  </small>
                )}
              </div>
            </div>
            {/* <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Primary"
                astric={true}
                fieldGrid={12}
                value={primary}
                required={true}
                onChange={(e) => {
                  setPrimary(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      primary: false,
                    }));
                  }
                }}
              />
              {validateFields.primary && (
                <small style={{ color: "red" }}>Please Fill Primary Type</small>
              )}
            </div> */}
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Close By <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  // components={{ MenuList }}
                  options={userData.map((option) => ({
                    value: option.user_id,
                    label: option.user_name,
                  }))}
                  required={true}
                  value={{
                    value: singleVendor.closed_by || closeBy,
                    label:
                      userData.find((role) => role.user_id == singleVendor.closed_by || role.user_id == closeBy)?.user_name || "",
                  }}
                  onChange={(e) => {
                    setCloseBy(e.value);
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        closeBy: false,
                      }));
                    }
                  }}
                />
                {validateFields.closeBy && (
                  <small style={{ color: "red" }}>Please select Close By</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Content Creation <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="Content creation"
                  options={Contents}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={Contents.find((option) => option.value == content)}
                  onChange={(selectedOption) => {
                    setContent(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        content: false,
                      }));
                    }
                  }}
                />
                {validateFields.content && (
                  <small style={{ color: "red" }}>
                    Please select Content Creation
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Platform Active On <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  required={true}
                  options={platformData.map((option) => ({
                    value: option._id,
                    label: option.platform_name,
                  }))}
                  isMulti
                  value={platformActive}
                  onChange={(e) => {
                    setPlatformActive(e);
                    if (e) {
                      setValidateFields((prev) => ({
                        ...prev,
                        platformActive: false,
                      }));
                    }
                  }}
                ></Select>
                {validateFields.platformActive && (
                  <small style={{ color: "red" }}>
                    Please select Platform Active On
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Name Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  name="profile name type"
                  options={PageTypes}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageTypes.find((option) => option.value == pageType)}
                  onChange={(selectedOption) => {
                    setPageType(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageType: false,
                      }));
                    }
                  }}
                />
                {
                  validateFields.pageType && (
                    <small style={{ color: "red" }}>
                      Please select Profile Name Type
                    </small>
                  ) // Page Name Type
                }
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Engagement Rate"
                // astric={true}
                type="text"
                fieldGrid={12}
                value={rate}
                required={true}
                onChange={(e) => {
                  if (
                    e.target.value !== "" &&
                    (e.target.value < 0 || isNaN(e.target.value))
                  ) {
                    return;
                  }
                  setRate(e.target.value);
                  // if (e.target.value) {
                  //   setValidateFields((prev) => ({ ...prev, rate: false }));
                  // }
                }}
              />
              {/* {validateFields.rate && (
                <small style={{ color: "red" }}>
                  Please Fill Engagement Rate
                </small>
              )} */}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Description"
                fieldGrid={12}
                value={description}
                required={false}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Platform ID <sup style={{ color: "red" }}>*</sup>
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
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        platformId: false,
                      }));
                    }
                  }}
                ></Select>
                {
                  validateFields.platformId && (
                    <small style={{ color: "red" }}>
                      Please select Platform
                    </small>
                  ) // Platform ID
                }
              </div>
            </div> */}
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Rate Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={["Fixed", "Variable"].map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={true}
                  value={{
                    value: rateType.value,
                    label: rateType.label,
                  }}
                  onChange={handleRateTypeChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb16">
              {rateType.label == "Variable" && (
                <div className="form-group m0">
                  <label className="form-label">
                    Variable Type <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={["Per Thousand", "Per Million"].map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    required={true}
                    value={{
                      value: variableType.value,
                      label: variableType.label,
                    }}
                    onChange={handleVariableTypeChange}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="row thm_form pagePriceRow">
            {rowCount?.map((row, index) => (
              <>
                <div key={index} className="col-md-6">
                  <div className="form-group m0">
                    <label className="form-label">
                      Price Type <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={filterPriceTypeList?.map((option) => ({
                          value: option?._id,
                          label: option?.name,
                        }))}
                        required={true}
                        value={{
                          label: priceTypeList?.find(
                            (role) =>
                              role._id === rowCount[index]?.page_price_type_id
                          )?.name,
                          value: rowCount[index]?.page_price_type_id,
                        }}
                        onChange={(e) => handlePriceTypeChange(e, index)}
                      />
                      {/* <IconButton
                        onClick={handleOpenPageModal("Price Type")}
                        variant="contained"
                        color="primary"
                        aria-label="Add Price Type.."
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleOpenInfoModal("Price Type Info")}
                        variant="contained"
                        color="primary"
                        aria-label="Price Type Info.."
                      >
                        <InfoIcon />
                      </IconButton> */}
                    </div>
                  </div>
                </div>
                <div className="col p0">
                  <FieldContainer
                    label="Price"
                    fieldGrid={12}
                    astric={true}
                    required={true}
                    type="text"
                    onChange={(e) => handlePriceChange(e, index)}
                    value={rowCount[index].price}
                  />
                  {rateType.label == "Variable" && (
                    <p className="ml-3" style={{ color: "blue" }}>
                      This Profile Cost = {"  Rs "}{" "}
                      {calculateFollowerCount(index.toFixed(0))}
                    </p>
                  )}
                </div>
                <div className="col-md-1 text-center">
                  {index != 0 && (
                    <button
                      title="Remove"
                      className="btn tableIconBtn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        setRowCount(
                          (prev) => prev.filter((e, i) => i !== index)
                          // handleFilterPriceType()
                        );
                      }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </>
            ))}
            <button
              title="Add Price"
              type="button"
              onClick={addPriceRow}
              className="btn tableIconBtn btn-outline-primary w-auto"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
          <div className="row thm_form">
            <div className="col-md-6 mb16"></div>
            <div className="col-md-6 mb16"></div>
          </div>
        </div>
        <div className="card-footer">
          <Stack direction="row" spacing={2}>
            <button
              className="btn cmnbtn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              {pageMast_id ? "Update" : "Submit"}
            </button>
          </Stack>
        </div>
      </div>
      <PageAddMasterModal />
      {pageInfoModlaOpen && <PageInfoModal />}
      {vendorInfoModalOpen && <VendorTypeInfoModal />}
      <AddVendorModal />
    </>
  );
};

export default PageMaster;
