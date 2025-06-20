import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import "./Tagcss.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllPageListQuery,
  useGetAllProfileListQuery,
  useGetMultiplePagePriceQuery,
} from "../../Store/PageBaseURL";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetOwnershipTypeQuery } from "../../Store/PageBaseURL";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import {
  setOpenShowAddModal,
  setModalType,
  setOpenShowPageInfoModal,
} from "../../Store/PageMaster";
import PageAddMasterModal from "./PageAddMasterModal";
import PageInfoModal from "./PageInfoModal";
import { FormatName } from "../../../utils/FormatName";
import { Spinner } from "react-bootstrap";
import { error } from "jquery";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import View from "../Sales/Account/View/View";
import { Eye } from "@phosphor-icons/react";

setOpenShowAddModal;
const Page = ({ pageMast_id, handleEditClose }) => {
  const params = useParams();
  const pageMasterId = params.pageMast_id ? params.pageMast_id : pageMast_id;
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const pagequery = "";
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });
  // console.log('refetchPageList', refetchPageList());

  const navigate = useNavigate();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const dispatch = useDispatch();
  const { toastAlert, toastError } = useGlobalContext();
  const [rowCount, setRowCount] = useState([
    { page_price_type_id: "", price: "" },
  ]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [priceTypeList, setPriceTypeList] = useState([]);

  const [pageName, setPageName] = useState("");
  const [link, setLink] = useState("");
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [platformId, setPlatformId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState("");
  const [pageStatus, setPageStatus] = useState("");
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [vendorId, setVendorId] = useState("");

  const [followCount, setFollowCount] = useState("");
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [bio, setBio] = useState("");
  const [pageBehaviour, setPageBehaviour] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [singlePage, setSinglePage] = useState({});

  const [priceDataNew, setPriceDataNew] = useState([]);
  const [rateType, setRateType] = useState("Fixed");
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState([]);
  const [tempID, setTempID] = useState();
  const [showPriceFields, setShowPriceFields] = useState(false);
  const [newPriceRow, setNewPriceRow] = useState({});
  const [addNewPrice, setAddNewPrice] = useState(false)
  const [engagment, setEngagment] = useState(0);
  const [singleVendor, setSingleVendor] = useState({});
  const [p_id, setP_id] = useState();
  const [tempVendorId, setTempVendorId] = useState();
  const [pagePriceList, setPagePriceList] = useState([]);
  const token = sessionStorage.getItem("token");
  const { userContextData } = useAPIGlobalContext();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [multiplePage, setMultipalPage] = useState([]);

  const PageLevels = [
    { value: "high", label: "Level 1 (High)" },
    { value: "medium", label: "Level 2 (Medium)" },
    { value: "low", label: "Level 3 (Low)" },
  ];

  const PageStatus = [
    { value: "active", label: "Active" },
    { value: "semi_active", label: "Semi Active" },
    { value: "maintained_dead", label: "Maintained Dead" },
    { value: "dead", label: "Dead" },
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

  const RateTypes = [
    { value: "Fixed", label: "Fixed" },
    { value: "Variable", label: "Variable" },
  ];

  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });

  // const getData = () => {
  //   axios
  //     .get(baseUrl + `v1/pagePriceMultipleByPageId/${pageMasterId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setPriceDataNew(res.data.data);
  //     });
  // };


  const {
    data: category,
    error: categoryError,
    isLoading: categoryIsLoading,
  } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

  const {
    data: subCategory,
    error: subCategoryError,
    isLoading: subCategoryIsLoading,
  } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];

  const {
    data: platform,
    error: platformError,
    isLoading: platformIsLoading,
  } = useGetPmsPlatformQuery();

  const platformData = platform?.data || [];

  const {
    data: vendor,
    error: vendorError,
    isLoading: vendorIsLoading,
  } = useGetAllVendorQuery();

  const vendorData = vendor?.data || [];

  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetAllProfileListQuery();

  const profileData = profile?.data || [];
  const handlePriceTypeChange = (e, index) => {
    const updatedRowCount = [...rowCount];
    updatedRowCount[index] = {
      ...updatedRowCount[index],
      page_price_type_id: e.value,
    };
    setRowCount(updatedRowCount);
    handleFilterPriceType();
  };

  const handlePriceChange = (e, index) => {
    const updatedValue = e.target.value;
    const updatedPagePriceList = [...pagePriceList];

    const priceTypeName = Object.keys(updatedPagePriceList[index])[0];

    updatedPagePriceList[index] = {
      [priceTypeName]: updatedValue,
    };
    setPagePriceList(updatedPagePriceList);
  };

  const handleFilterPriceType = (_id) => {
    let filteredData = priceTypeList.filter((row) => {
      return !rowCount.some(
        (e) => e.page_price_type_id == row.page_price_type_id
      );
    });
    // axios.delete(baseUrl + `v1/pagePriceMultiple/${_id}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    setFilterPriceTypeList(filteredData);
  };
  useEffect(() => {
    if (platformId) {
      setPriceTypeList([]);

      const priceData = platformData?.find(
        (role) => role?._id === platformId
      )?._id;

      axios
        .get(`${baseUrl}v1/pagePriceTypesForPlatformId/${platformId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPriceTypeList(res?.data?.data);
        })
        .catch((err) => {
          // console.log("Error:", err);
        });
    }
  }, [platformId]);

  const addPriceRow = () => {
    setShowPriceFields(true);
    setNewPriceRow({
      priceType: "",
      value: 0,
    });
  };

  // const { data: priceData } = useGetMultiplePagePriceQuery(pageMasterId, {
  //   skip: !pageMasterId,
  // });

  const priceTypeMappings = {
    "667e6c7412fbbf002179f6d6": "instagram_post",
    "667e6c9112fbbf002179f72c": "instagram_story",
    "667e6c9c12fbbf002179f72f": "instagram_both",
    "66b9ba3b994d2209bfd4cf50": "instagram_reel",
    "66b9ba86994d2209bfd4cf53": "instagram_comments",
    "66b9ba76994d2209bfd4cf52": "instagram_broadcast",
    "66b9ba61994d2209bfd4cf51": "instagram_bio",
    "66b9ba09994d2209bfd4cf4f": "instagram_carousel",
    "66b9bb9e994d2209bfd4cf57": "xtweet_post",
    "66b9bbad994d2209bfd4cf58": "x_retweet",
    "66b9bbb9994d2209bfd4cf59": "x_comment",
    "66b9bab0994d2209bfd4cf54": "facebook_story",
    "66b9bac0994d2209bfd4cf55": "facebook_post",
    "66b9bad4994d2209bfd4cf56": "facebook_comment",
    "66b9bbf2994d2209bfd4cf5a": "youtubevideo_story",
    "66b9bc01994d2209bfd4cf5b": "youtubeshorts_post",
    "66bb092ad492fa2a17287109": "snapchat_post",
    "66bb0d45d492fa2a17287112": "whatsapp_post",
    "66bb0d7cd492fa2a17287114": "telegramchannel_post",
    "66bb0db2d492fa2a17287115": "linkedin_post",
    "6746c5c3fc48d70fbf1c2d9e": "sharechat_post",
    "6746c5defc48d70fbf1c2d9f": "sharechat_story",
    "6746c5f2fc48d70fbf1c2da0": "sharechat_both",
    "6746c604fc48d70fbf1c2da1": "sharechat_reel",
    "6746c631fc48d70fbf1c2da2": "moj_post",
    "6746c644fc48d70fbf1c2da3": "moj_story",
    "6746c654fc48d70fbf1c2da4": "moj_both",
    "6746c666fc48d70fbf1c2da5": "moj_reel",
    "67472a66fc48d70fbf1c2dde": "thread_post",
    "67480eb67bd2057dd708d244": "thread_repost",
    "67480ede7bd2057dd708d245": "thread_quote",
    "67480efc7bd2057dd708d246": "thread_comment",
    "67480fe67bd2057dd708d249": "x_quote",
  };
 
  useEffect(() => {
    axios
      .get(baseUrl + `v1/pageMaster/${pageMasterId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = [res.data.data];
        setPagePriceList(res.data.data.page_price_list);
        setTempID(data[0]?.temp_vendor_id);
        setPlatformId(data[0].platform_id);
        setPageName(data[0].page_name);
        setLink(data[0].page_link);
        setCategoryId(data[0].page_category_id);
        setSubCategoryId(data[0].page_sub_category_id);
        const tagFilter = categoryData.filter((e) =>
          data[0]?.tags_page_category?.includes(e._id)
        );
        setTag(
          tagFilter.map((e) => {
            return { value: e._id, label: e.page_category };
          })
        );
        setPageLevel(data[0]?.preference_level);
        if (data[0].page_activeness == "dead") {
          setPageStatus("dead");
        } else if (data[0].page_activeness == "semi_active") {
          setPageStatus("semi_active");
        } else if (data[0].page_activeness == "super_active") {
          setPageStatus("super_active");
        } else {
          setPageStatus("active");
        }
        setPageStatus(data[0].page_activeness);
        setCloseBy(data[0].page_closed_by);
        setPageType(data[0].page_name_type);
        setContent(data[0].content_creation);
        setOwnerType(data[0].ownership_type);
        setVendorId(data[0].vendor_id);
        setFollowCount(data[0].followers_count);
        setBio(data[0].bio);
        setDisplayName(data[0].display_name);
        setPageBehaviour(data[0].page_behaviour);
        setTempVendorId(data[0].temp_vendor_id);
        setProfileId(data[0].page_profile_type_id);
        setRate(data[0].engagment_rate);
        setRateType(data[0].rate_type);
        setEngagment(data[0]?.engagment_rate);
        setDescription(data[0].description);
        setP_id(data[0].pageMasterId);
        setSinglePage(data[0]);
        setLanguageId(data[0].page_language_name);
      });
  }, []);

  useEffect(() => {
    if (singlePage && singlePage.length > 0) {
      axios
        .get(baseUrl + `v1/vendor/${singlePage.vendor_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setSingleVendor(res?.data?.data);
        });
    }
    getLanguage();
  }, []);
  const getLanguage = async () => {
    try {
      const res = await axios.get(`${baseUrl}v1/get_all_page_languages`);
      setLanguages(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e, flag) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (!pageName) {
      toastAlert("Page Name is required");
      return;
    } else if (!link) {
      toastAlert("Link is required");
      return;
    } else if (!platformId) {
      toastAlert("Platform ID is required");
      return;
    } else if (!categoryId) {
      toastAlert("Category is required");
      return;
    } else if (!subCategoryId) {
      toastAlert("Sub Category is required");
      return;
    } else if (!pageLevel) {
      toastAlert("Page Level is required");
      return;
    } else if (!closeBy) {
      toastAlert("Close by is required");
      return;
    } else if (!pageType) {
      toastAlert("Page Name Type is required");
      return;
    } else if (!content) {
      toastAlert("Content Creation is required");
      return;
    } else if (!ownerType) {
      toastAlert("Ownership type is required");
      return;
    } else if (!vendorId) {
      toastAlert("Vendor is required");
      return;
    } else if (!followCount) {
      toastAlert("Followers Count is required");
      return;
    } else if (!profileId) {
      toastAlert("Profile Type is required");
      return;
    }
    const payload = {
      page_name: pageName,
      page_link: link,
      platform_id: platformId,
      page_category_id: categoryId,
      page_sub_category_id: subCategoryId,
      tags_page_category: tag.map((e) => e.value),
      preference_level: pageLevel,
      page_activeness: pageStatus,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendor_id: vendorId,
      followers_count: followCount,
      bio: bio,
      page_behaviour: pageBehaviour,
      display_name: displayName,
      page_profile_type_id: profileId,
      rate_type: rateType || "",
      updated_by: userID,
      engagment_rate: engagment || 0,
      multi_page_names: multiplePage.filter((i) => i !== ""),
      variable_type: rateType == "Variable" ? variableType.value : null,

      platform_name: platformData
        ?.find((res) => res._id == platformId)
        ?.platform_name?.toLowerCase(),

      page_category_name: categoryData
        ?.find((role) => role._id === categoryId)
        ?.page_category?.toLowerCase(),
      page_sub_category_name: subCategoryData.find(
        (role) => role._id === subCategoryId
      )?.page_sub_category,

      vendor_name: vendorData
        ?.find((vendor) => vendor._id === vendorId)
        ?.vendor_name?.toLowerCase(),

      page_profile_type_name: profileData
        ?.find((role) => role?._id === profileId)
        ?.profile_type?.toLowerCase(),

      page_language_name: languageId.map((item) => item?.label),
      tags_page_category_name: tag.map((e) => e.label),
      page_price_list: pagePriceList,
      temp_vendor_id: tempVendorId,
      // page_price_list: rowCount.map((item) => {
      //   return {
      //     [priceTypeList?.find((priceobject) => priceobject?._id == item.page_price_type_id)?.name]: item.price,
      //   };
      // }),
    };

    try {
      await axios
        .put(baseUrl + `v1/pageMaster/${pageMasterId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setSubmitLoading(false);
          const cat_name = categoryData?.find(
            (item) => item?._id === singlePage?.page_category_id
          )?.page_category;

          const prices = Object.keys(priceTypeMappings).reduce((acc, typeId) => {
            const priceType = priceTypeMappings[typeId];
            acc[priceType] =
              rowCount.find((item) => item?.page_price_type_id === typeId)
                ?.price || null;
            return acc;
          }, {});

          const payload = {
            p_id: singlePage.p_id,
            page_name: pageName,
            page_link: link,
            temp_vendor_id: tempID,
            ...prices,
            followers_count: followCount,
            preference_level: pageLevel,
            temp_page_cat_id: cat_name,
          };

          axios
            .post(baseUrl + `node_data_to_php_update_page`, payload)
            .then(() => { })
            .catch((err) => {
              console.error("POST error:", err);
            });

          if (flag) {
            toastAlert("Submitted");
            refetchPageList();
            handleEditClose();
          }
          if (!flag) {
            toastAlert("Submitted");
          }
        });
    } catch (err) {
      setSubmitLoading(false);
      toastError(err.response.data.message);
    }

  };

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
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
  const pageInfoModlaOpen = useSelector(
    (state) => state.pageMaster.showInfoModal
  );

  const calculateFollowerCount = (price) => {
    // const val = variableType.value === "Per Thousand" ? 1000 : 1000000;
    return (Math.floor((followCount / 1000000) * (price)));
  };

  const handleUpadteFollowers = async () => {
    const payload = {
      creators: [pageName],
      department: "65c38781c52b3515f77b0815",
      userId: 111111,
    };

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const { data } = await axios.post(
        `https://insights.ist:8080/api/v1/creators_details_v3`,
        payload,
        { headers }
      );
      const followerData = data?.data?.[0]?.creatorDetails?.followers;

      if (followerData > 0) {
        setFollowCount(followerData);
        toastAlert(" Followers updated successfully!");
      } else {
        toastError("Page disabled or private.");
      }
    } catch (error) {
      console.error("Error fetching followers:", errorMessage);
    }
  };

  const handleOwnerTypeChange = (selectedOption) => {
    setOwnerType(selectedOption.value);
  };

  const handleMultiplePage = (e) => {
    let value = e.target.value.replace(/, ?/g, "\n");
    setMultipalPage(value.split("\n"));
  };
  return (
    <>
      <PageAddMasterModal />
      {pageInfoModlaOpen && <PageInfoModal />}

      <div>
        <button
          type="submit"
          className="btn btn-primary mt-2 btn-sm"
          style={{ width: "15%", float: "right" }}
          onClick={(e) => {
            handleSubmit(e, 0);
          }}
        >
          Save
        </button>
        <button
          type="button"
          title="Update Followers"
          className="btn btn-primary mt-2 btn-sm"
          onClick={() => handleUpadteFollowers()}
        >
          Update Followers
        </button>
      </div>

      <FieldContainer
        label="Profile Name *"
        value={pageName}
        required={true}
        onChange={(e) => {
          setPageName(e.target.value);
          e.preventDefault();
          setLink(() => `https://www.instagram.com/${e.target.value}`);
        }}
      />

      <FieldContainer
        label="Link *"
        value={link}
        required={true}
        onChange={(e) => setLink(e.target.value)}
      />

      <div className="form-group col-6">
        <label className="form-label">
          Platform <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={platformData.map((option) => ({
            value: option._id,
            label: FormatName(option.platform_name),
          }))}
          value={{
            value: platformId,
            label: FormatName(
              platformData.find((role) => role._id === platformId)
                ?.platform_name || ""
            ),
          }}
          onChange={(e) => {
            setPlatformId(e.value);
          }}
        ></Select>
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
                label: FormatName(option.page_category),
              }))}
              value={{
                value: categoryId,
                label: FormatName(
                  categoryData.find((role) => role._id === categoryId)
                    ?.page_category || ""
                ),
              }}
              onChange={(e) => {
                setCategoryId(e.value);
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
        </div>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Sub Category <sup style={{ color: "red" }}>*</sup>
        </label>
        <div className="input-group inputAddGroup">
          <Select
            className="w-100"
            options={subCategoryData?.map((option) => ({
              value: option._id,
              label: FormatName(option.page_sub_category),
            }))}
            value={{
              value: subCategoryId,
              label: FormatName(
                subCategoryData.find((role) => role._id === subCategoryId)
                  ?.page_sub_category || ""
              ),
            }}
            onChange={(e) => {
              setSubCategoryId(e.value);
            }}
          />
          <IconButton
            onClick={handleOpenPageModal("Sub Category")}
            variant="contained"
            color="primary"
            aria-label="Add Sub Category.."
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={handleOpenInfoModal("Sub Category Info")}
            variant="contained"
            color="primary"
            aria-label="Sub Category Info.."
          >
            <InfoIcon />
          </IconButton>
        </div>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Tags
          {/* <sup style={{ color: "red" }}>*</sup> */}
        </label>
        <Select
          isMulti
          options={categoryData.map((option) => ({
            value: option._id,
            label: option.page_category,
          }))}
          required={false}
          value={tag}
          onChange={(e) => setTag(e)}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Page Level <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          name="page level"
          options={PageLevels}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageLevels.find((option) => option.value === pageLevel)}
          onChange={(selectedOption) => setPageLevel(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Activeness <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          name="page status"
          options={PageStatus}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageStatus.find((option) => option.value === pageStatus)}
          onChange={(selectedOption) => setPageStatus(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Close by <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={userContextData?.map((option) => ({
            value: option.user_id,
            label: option.user_name,
          }))}
          value={{
            value: closeBy,
            label:
              userContextData?.find((role) => role.user_id === closeBy)
                ?.user_name || "",
          }}
          onChange={(e) => {
            setCloseBy(e.value);
          }}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Page Name Type <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          name="page name type"
          options={PageTypes}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageTypes.find((option) => option.value == pageType)}
          onChange={(selectedOption) => setPageType(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Content Creation <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          name="Content creation"
          options={Contents}
          className="basic-multi-select"
          classNamePrefix="select"
          value={Contents.find((option) => option.value == content)}
          onChange={(selectedOption) => setContent(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Ownership Type <sup style={{ color: "red" }}>*</sup>
        </label>

        <Select
          className="w-100"
          options={[
            { value: "Own", label: "Own" },
            { value: "Vendor", label: "Vendor" },
            { value: "Partnership", label: "Partnership" },
          ]}
          required
          value={{
            value: ownerType,
            label: ownerType ? ownerType : "",
          }}
          onChange={handleOwnerTypeChange}
          placeholder="Select Ownership Type"
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Vendor <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={vendorData.map((option) => ({
            value: option.vendor_id,
            label: formatString(option.vendor_name),
            id: option._id,
          }))}
          value={{
            value: vendorId,
            label:
              vendorData.find((ob) => ob._id === vendorId)?.vendor_name || "",
          }}
          onChange={(e) => {
            setTempID(e.value);
            setVendorId(e.id);
          }}
        />
      </div>
      <div className="col-md-6 mb16">
        <div className="form-group m0">
          <label className="form-label">
            Language <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={languages.map((option) => ({
              value: option._id,
              label: formatString(option.language_name),
            }))}
            value={languages
              ?.filter((lang) => languageId?.includes(lang.language_name))
              ?.map((option) => ({
                value: option._id,
                label: formatString(option.language_name),
              }))}
            isMulti
            required={true}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map((option) => option);
              setLanguageId(selectedValues);
            }}
          />
        </div>
      </div>
      <FieldContainer
        label="Followers Count *"
        type="number"
        value={followCount}
        required={true}
        onChange={(e) => setFollowCount(e.target.value)}
      />

      <div className="form-group col-6">
        <label className="form-label">
          Profile Type <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={profileData.map((option) => ({
            value: option._id,
            label: option.profile_type,
          }))}
          value={{
            value: profileId,
            label:
              profileData.find((role) => role._id === profileId)
                ?.profile_type || "",
          }}
          onChange={(e) => {
            setProfileId(e.value);
          }}
        ></Select>
      </div>

      <div className="col-md-6 mb16">
        <div className="form-group m0">
          <label className="form-label">
            Rate Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={RateTypes.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            required={true}
            value={RateTypes.find((option) => option.value == rateType)}
            onChange={(selectedOption) => {
              setRateType(selectedOption.value);
            }}
          />
        </div>
      </div>

      <div className="col-md-6 mb16">
        {rateType == "Variable" && (
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

      <div className="col-md-6 p0 mb16">
        <FieldContainer
          label="Page Behaviour"
          fieldGrid={12}
          value={pageBehaviour}
          required={false}
          onChange={(e) => setPageBehaviour(e.target.value)}
        />
      </div>
      <div className="col-md-6 p0 mb16">
        <FieldContainer
          label="Display Name"
          fieldGrid={12}
          value={displayName}
          required={false}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <FieldContainer
        label="Description"
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />
      <FieldContainer
        label="Bio"
        value={bio}
        required={false}
        onChange={(e) => setBio(e.target.value)}
      />
      <div className="col-md-6 p0 mb16">
        <FieldContainer
          label="Engagement Rate"
          type="text"
          fieldGrid={12}
          value={engagment}
          required={false}
          onChange={(e) => {
            setEngagment(e.target.value);
          }}
        />
      </div>
      <div className="col-md-6 p0 mb16 d-flex">
        <FieldContainer
          label="Multiple Page *"
          required
          Tag="textarea"
          type="text"
          onChange={handleMultiplePage}
          value={multiplePage.join("\n")}
        />
        {multiplePage.length > 0 &&
          multiplePage.some((item) => item.trim() !== "") && (
            <Button
              sx={{
                marginTop: "35px",
                width: "50px", // Adjust width
                height: "50px", // Adjust height
                minWidth: "unset", // Prevents MUI from enforcing a minimum width
              }}
              variant="contained"
              onClick={handleOpen}
            >
              <Eye />
            </Button>
          )}
      </div>

      <div className="col-12 row">
        {pagePriceList?.map((row, index) => {
          const [key, value] = Object.entries(row)[0] || [null, null];
          const isLastRow = index === pagePriceList.length - 1;
          const isValueNotNull = value !== null;

          const filteredPriceTypeList = priceTypeList
            ?.filter((option) =>
              pagePriceList.every(
                (r, i) => i === index || Object.keys(r)[0] !== option.name
              )
            )
            ?.map((option) => ({
              value: option._id,
              label: option.name,
            }));

          const selectedPriceType = priceTypeList?.find(
            (pt) => pt.name === key
          );

          return (
            <React.Fragment key={index}>
              <div className="form-group col-5 row">
                <label className="form-label">
                  Price Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={filteredPriceTypeList}
                  required
                  value={{ label: selectedPriceType?.name || "", value: key }}
                  onChange={(e) => handlePriceTypeChange(e, index)}
                  isDisabled={isValueNotNull}
                />
              </div>
              <FieldContainer
                label="Price *"
                required
                type="number"
                onChange={(e) => handlePriceChange(e, index)}
                value={value || 0}
              />
              {rateType === "Variable" && (
                <p className="ml-3" style={{ color: "blue" }}>
                  This Profile Cost = {" Rs "} {calculateFollowerCount(value)}
                </p>
              )}
              {isLastRow && Number(newPriceRow.value) > 0 && !showPriceFields && (
                <button
                  className="btn btn-sm btn-danger mt-4 ml-2 col-1 mb-3"
                  type="button"
                  onClick={() => {
                    pagePriceList.splice(index, 1);
                    handleFilterPriceType(key);
                  }}
                >
                  Remove
                </button>
              )}
            </React.Fragment>
          );
        })}

        {showPriceFields && (
          <React.Fragment>
            <div className="form-group col-5 row">
              <label className="form-label">
                Price Type <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={priceTypeList
                  ?.filter(
                    (option) =>
                      !pagePriceList.some(
                        (r) => Object.keys(r)[0] === option.name
                      )
                  )
                  ?.map((option) => ({
                    value: option._id,
                    label: option.name,
                  }))}
                value={{
                  label:
                    priceTypeList.find((pt) => pt._id === newPriceRow.priceType)
                      ?.name || "",
                  value: newPriceRow.priceType,
                }}
                onChange={(e) =>
                  setNewPriceRow({ ...newPriceRow, priceType: e.value })
                }
                required
              />
            </div>
            <FieldContainer
              label="Price *"
              required
              type="number"
              onChange={(e) =>
                setNewPriceRow({ ...newPriceRow, value: e.target.value })
              }
              value={newPriceRow.value || 0}
            />
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  const selectedPriceType = priceTypeList.find(
                    (pt) => pt._id === newPriceRow.priceType
                  );
                  if (selectedPriceType && Number(newPriceRow.value) > 0) {
                    setPagePriceList([
                      ...pagePriceList,
                      { [selectedPriceType.name]: Number(newPriceRow.value) },
                    ]);
                    setShowPriceFields(false);
                  } else {
                    alert(
                      "Please select a price type and enter a valid price."
                    );
                  }
                }}
                className="btn btn-sm btn-primary"
              >
                {"Save"}
              </button>
            </div>
          </React.Fragment>
        )}

        <div className="text-center">
          {!showPriceFields && (
            <button
              type="button"
              onClick={addPriceRow}
              className="btn btn-sm btn-primary"
            >
              Add Price
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        {submitLoading ? (
          <div className="btn btn-primary mt-2 btn-sm ml-5">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="btn btn-primary mt-2 btn-sm"
            style={{ width: "45%" }}
            onClick={(e) => {
              handleSubmit(e, 1);
            }}
          >
            Submit
          </button>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 550, // Fixed height
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflow: "auto", // Enables scrolling if content overflows
            }}
          >
            <Typography variant="h6" component="h2">
              View Multiple Page
            </Typography>
            <Box sx={{ mt: 2, maxHeight: "400px", overflowY: "auto" }}>
              {multiplePage.map((d, index) => (
                <ul key={index}>
                  <li>
                    {index + 1}. {d}
                  </li>
                </ul>
              ))}
            </Box>
            <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
              Close
            </Button>
          </Box>
        </Modal>

        {/* <button
          type="submit"
          className="btn btn-primary mt-2 btn-sm"
          style={{ width: '45%' }}
          onClick={(e) => {
            handleSubmit(e, 0);
          }}
        >
          Save
        </button> */}
      </div>
    </>
  );
};

const PageEdit = ({ pageMast_id, handleEditClose }) => {
  const params = useParams();
  const pageMasterId = params.pageMast_id ? params.pageMast_id : pageMast_id;
  const navigate = useNavigate();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Edit Page", "Page Health", "Performance"];

  const goBack = () => {
    navigate(-1);
  };

  const PerformanceDashboard = () => {
    return <></>;
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#52b2d6",
          width: "3%",
          padding: "7px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        <ArrowBackIcon onClick={() => handleEditClose()} />
      </div>

      <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        submitButton={true}
      >
        {activeAccordionIndex === 0 && (
          <Page pageMast_id={pageMasterId} handleEditClose={handleEditClose} />
        )}
        {activeAccordionIndex === 1 &&
          navigate(`/admin/exe-history/${pageMasterId}`)}
        {activeAccordionIndex === 2 && <PerformanceDashboard />}
      </FormContainer>
    </>
  );
};

export default PageEdit;
