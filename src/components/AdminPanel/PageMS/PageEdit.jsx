import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { Navigate, useParams } from "react-router";
import Select from "react-select";
import "./Tagcss.css";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { Country } from "country-state-city";
import { BarChart } from "@mui/x-charts";
import ImageView from "../../Finance/ImageView";
import { DataGrid } from "@mui/x-data-grid";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import OndemandVideoTwoToneIcon from "@mui/icons-material/OndemandVideoTwoTone";
import { useNavigate } from "react-router-dom";
import {
  useGetAllPageCategoryQuery,
  useGetAllProfileListQuery,
  useGetMultiplePagePriceQuery,
} from "../../Store/PageBaseURL";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import AddIcon from "@mui/icons-material/Add";
import { setModalType, setOpenShowAddModal } from "../../Store/PageMaster";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetOwnershipTypeQuery } from "../../Store/PageBaseURL";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PageEdit = () => {
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toastAlert } = useGlobalContext();
  const [rowCount, setRowCount] = useState([
    { page_price_type_id: "", price: "" },
  ]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [priceTypeList, setPriceTypeList] = useState([]);

  const [pageName, setPageName] = useState("");
  const [link, setLink] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformId, setPlatformId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState("");
  const [pageStatus, setPageStatus] = useState("");
  const [userData, setUserData] = useState([]);
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("");
  // const [vendorData, setVendorData] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [followCount, setFollowCount] = useState("");
  // const [profileData, setProfileData] = useState([]);
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [latestEntry, setLatestEntry] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [quater, setQuater] = useState("");
  const [quaterIsValid, setQuaterIsValid] = useState(false);
  const [reachValidation, setReachValidation] = useState(true);
  const [impressionValidation, setImpressionValidation] = useState(true);
  const [engagementValidation, setEngagementValidation] = useState(true);
  const [storyViewValidation, setStoryViewValidation] = useState(true);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [impressionImg, setImpressionImg] = useState(null);
  const [engagementImg, setEngagementImg] = useState();
  const [storyViewImg, setStoryViewImg] = useState();
  const [storyViewVideo, setStoryViewVideo] = useState();
  const [city1, setCity1] = useState();
  const [city2, setCity2] = useState();
  const [city3, setCity3] = useState();
  const [city4, setCity4] = useState();
  const [city5, setCity5] = useState();
  const [city1Percentage, setCity1Percentage] = useState();
  const [city2Percentage, setCity2Percentage] = useState();
  const [city3Percentage, setCity3Percentage] = useState();
  const [city4Percentage, setCity4Percentage] = useState();
  const [city5Percentage, setCity5Percentage] = useState();
  const [cityImg, setCityImg] = useState();
  const [malePercentage, setMalePercentage] = useState();
  const [femalePercentage, setFemalePercentage] = useState();
  const [age1Percentage, setAge1Percentage] = useState();
  const [age2Percentage, setAge2Percentage] = useState();
  const [age3Percentage, setAge3Percentage] = useState();
  const [age4Percentage, setAge4Percentage] = useState();
  const [age5Percentage, setAge5Percentage] = useState();
  const [age6percentage, setAge6Percentage] = useState();
  const [age7Percentage, setAge7Percentage] = useState();
  const [ageImg, setAgeImg] = useState("");
  const [profileVisit, setProfileVisit] = useState();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [country1, setCountry1] = useState("");
  const [country2, setCountry2] = useState("");
  const [country3, setCountry3] = useState("");
  const [country4, setCountry4] = useState("");
  const [country5, setCountry5] = useState("");
  const [country1Percentage, setCountry1Percentage] = useState();
  const [country2Percentage, setCountry2Percentage] = useState();
  const [country3Percentage, setCountry3Percentage] = useState();
  const [country4Percentage, setCountry4Percentage] = useState();
  const [country5Percentage, setCountry5Percentage] = useState();
  const [countryImg, setCountryImg] = useState();
  const [priceDataNew, setPriceDataNew] = useState([]);
  const [rateType, setRateType] = useState('Fixed');

  const [profileVisitError, setProfileVisitError] = useState(false);
  // const [reachAndImpressionimgSrc, setReachAndImpressionimgSrc] =
  //   useState(null);
  const [impressionImgSrc, setImpressionImgSrc] = useState(null);
  const [engagementImgSrc, setEngagementImgSrc] = useState(null);
  const [storyViewImgSrc, setStoryViewImgSrc] = useState(null);
  const [storyViewVideoSrc, setStoryViewVideoSrc] = useState(null);
  const [countryImgSrc, setCountryImgSrc] = useState(null);
  const [cityImgSrc, setCityImgSrc] = useState(null);
  const [ageImgSrc, setAgeImgSrc] = useState(null);
  const [reachImgSrc, setReachImgSrc] = useState(null);
  const [reachImg, setReachImg] = useState(null);
  const [reachkey, setReachkey] = useState(1);
  const [statesFor, setStatesFor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [storyViewDate, setStoryViewDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reach, setReach] = useState();
  const [impression, setImpression] = useState();
  const [engagement, setEngagement] = useState();
  const [engagment, setEngagment] = useState(0);
  const [storyView, setStoryView] = useState();
  const [rowData, setRowData] = useState({});
  const [stateForIsNotQuater, setStateForIsNotQuater] = useState(false);
  const [stateForIsValid, setStateForIsValid] = useState(false);
  const [cityListTemp, setCityListTemp] = useState();
  const [countryListTemp, setCountryListTemp] = useState([]);
  const [demoFile, setDemoFile] = useState();
  const [execounthismodels, setExecounthismodels] = useState([]);
  const [intervalFlag, setIntervalFlag] = useState({
    label: "Current Month",
    value: "1",
  });
  const [p_id, setP_id] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [p_idHistoryData, setP_idHistoryData] = useState([]);
  const [graphView, setGraphView] = useState(false);
  const [openDeleteHistoryConFirmation, setOpenDeleteHistoryConFirmation] =
    useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [stateUpdate, setStateUpdate] = useState(false);
  const [data, setData] = useState([]);
  const token = sessionStorage.getItem("token");

  const handlePercentageChange = (value, setter) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setter(newValue);
    }
  };

  const handleEndDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setEndDate(newValue);
  };

  function convertDateToDDMMYYYY(dateString) {
    if (String(dateString).startsWith("0000-00-00")) {
      return " ";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    if (day == "NaN" || month == "NaN" || year == "NaN") {
      return " ";
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  useEffect(() => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setAllUsers(res.data.data);
    });
  }, []);

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue.$d);
  };

  const handleStoryViewDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setStoryViewDate(newValue);
  };

  const countryCopyValidation = (selectedCountry, country) => {
    setTimeout(() => {
      // Early exit if the selected country is null
      if (selectedCountry === null) {
        let temp = countryListTemp.filter(
          (e) =>
            ![country1, country2, country3, country4, country5].includes(e.name)
        );
        const addCountry = countryListTemp.filter((e) => e.name === country);
        setCountryList([...temp, ...addCountry]);
        return;
      }
      // ... rest of your code

      // Filter out the selected country from the country list
      const newCountryList = countryListTemp.filter(
        (country) =>
          country.name !== selectedCountry &&
          ![country1, country2, country3, country4, country5].includes(
            country.name
          )
      );

      setCountryList(newCountryList);
    }, 400);
  };

  const { pageMast_id } = useParams();

  const dropdownStaticData = [
    "Daily",
    "Weekly",
    "Fortnight",
    "Monthly",
    "Quarterly",
  ];

  const QuarterStaticData = [
    "Quarter 1 (Jan-Mar)",
    "Quarter 2 (Apr-Jun)",
    "Quarter 3 (Jul-Sep)",
    "Quarter 4 (Oct-Dec)",
  ];

  const cityCopyValidation = (selectedCity, city) => {
    setTimeout(() => {
      // Early exit if the selected city is null
      if (selectedCity === null) {
        let temp = cityListTemp.filter(
          (city) => ![city1, city2, city3, city4, city5].includes(city)
        );
        setCityList([...temp, city]);
        return;
      }

      // Filter out the selected city from the city list
      const newCityList = cityListTemp.filter(
        (city) =>
          city !== selectedCity &&
          ![city1, city2, city3, city4, city5].includes(city)
      );

      setCityList(newCityList);
    }, 400);
  };

  const saveStats = async (e) => {
    e.preventDefault();

    const preSDate = new Date(startDate);
    preSDate.setDate(preSDate.getDate() + 1);
    const sDate = preSDate.toISOString();

    const preEDate = new Date(endDate);
    preEDate.setDate(preEDate.getDate() + 1);
    const eDate = preEDate.toISOString();

    const preSVDate = new Date(storyViewDate);
    preSVDate.setDate(preSVDate.getDate() + 1);
    const svDate = preSVDate != "Invalid Date" ? preSVDate?.toISOString() : "";

    const formData = new FormData();
    formData.append("p_id", p_id);
    formData.append("reach", reach ? reach : 0);
    formData.append("impression", impression ? impression : 0);
    formData.append("engagement", engagement ? engagement : 0);
    formData.append("story_view", storyView ? storyView : 0);
    demoFile ? formData.append("media", demoFile) : "";
    quater ? formData.append("quater", quater) : "";
    formData.append("start_date", sDate);
    formData.append("story_view_date", svDate);
    formData.append("end_date", eDate);
    formData.append("stats_for", statesFor);
    formData.append("impression_upload_image", impressionImg);
    formData.append("reach_upload_image", reachImg);
    formData.append("engagement_upload_image", engagementImg);
    formData.append("story_view_upload_image", storyViewImg);
    formData.append("story_view_upload_video", storyViewVideo);
    formData.append("city_image_upload", cityImg);
    formData.append("Age_upload", ageImg);
    formData.append("city1_name", city1);
    formData.append("city2_name", city2);
    formData.append("city3_name", city3);
    formData.append("city4_name", city4);
    formData.append("city5_name", city5);
    formData.append(
      "percentage_city1_name",
      city1Percentage ? city1Percentage : 0
    );
    formData.append(
      "percentage_city2_name",
      city2Percentage ? city2Percentage : 0
    );
    formData.append(
      "percentage_city3_name",
      city3Percentage ? city3Percentage : 0
    );
    formData.append(
      "percentage_city4_name",
      city4Percentage ? city4Percentage : 0
    );
    formData.append(
      "percentage_city5_name",
      city5Percentage ? city5Percentage : 0
    );
    formData.append("male_percent", malePercentage ? malePercentage : 0);
    formData.append("female_percent", femalePercentage ? femalePercentage : 0);
    formData.append("Age_13_17_percent", age1Percentage ? age1Percentage : 0);
    formData.append("Age_18_24_percent", age2Percentage ? age2Percentage : 0);
    formData.append("Age_25_34_percent", age3Percentage ? age3Percentage : 0);
    formData.append("Age_35_44_percent", age4Percentage ? age4Percentage : 0);
    formData.append("Age_45_54_percent", age5Percentage ? age5Percentage : 0);
    formData.append("Age_55_64_percent", age6percentage ? age6percentage : 0);
    formData.append("Age_65_plus_percent", age7Percentage ? age7Percentage : 0);
    formData.append("profile_visit", profileVisit ? profileVisit : 0);
    formData.append("country1_name", country1);
    formData.append("country2_name", country2);
    formData.append("country3_name", country3);
    formData.append("country4_name", country4);
    formData.append("country5_name", country5);
    formData.append(
      "percentage_country1_name",
      country1Percentage ? country1Percentage : 0
    );
    formData.append(
      "percentage_country2_name",
      country2Percentage ? country2Percentage : 0
    );
    formData.append(
      "percentage_country3_name",
      country3Percentage ? country3Percentage : 0
    );
    formData.append(
      "percentage_country4_name",
      country4Percentage ? country4Percentage : 0
    );
    formData.append(
      "percentage_country5_name",
      country5Percentage ? country5Percentage : 0
    );
    formData.append("country_image_upload", countryImg);
    formData.append("user_id", userID);

    axios
      .post(`${baseUrl}` + `add_exe_pid_history`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setReachkey((perv) => perv + 1);
        setQuater("");
        setStatesFor(null);
        setStartDate(null);
        setEndDate(null);
        setReach();
        setImpression();
        setEngagement();
        setStoryView();
        setRowData({});
        setCity1("");
        setCity2("");
        setCity3("");
        setCity4("");
        setCity5("");
        setCity1Percentage();
        setCity2Percentage();
        setCity3Percentage();
        setCity4Percentage();
        setCity5Percentage();
        setMalePercentage();
        setFemalePercentage();
        setAge1Percentage();
        setAge2Percentage();
        setAge3Percentage();
        setAge4Percentage();
        setAge5Percentage();
        setAge6Percentage();
        setAge7Percentage();
        setAgeImg(null);
        setCityImg(null);
        setReachImg(null);
        setImpressionImg(null);
        setEngagementImg("");
        setStoryViewImg("");
        setStoryViewVideo("");
        setProfileVisit();
        setCountry1("");
        setCountry2("");
        setCountry3("");
        setCountry4("");
        setCountry5("");
        setCountry1Percentage();
        setCountry2Percentage();
        setCountry3Percentage();
        setCountry4Percentage();
        setCountry5Percentage();
        setCountryImg();
        setCityImgSrc(null);
        setCountryImgSrc(null);
        setAgeImgSrc(null);
        setImpressionImgSrc(null);
        setEngagementImgSrc(null);
        setStoryViewImgSrc(null);
        setStoryViewVideoSrc(null);
        setStoryViewDate(null);
        getData();
        toastAlert("Form Submitted success");
      });
  };

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

  const RateTypes = [
    { value: "Fixed", label: "Fixed" },
    { value: "Variable", label: "Variable" },
  ];

  const handleUpdateRowClick = async () => {
    await axios
      .get(`${baseUrl}` + `get_exe_ip_count_history/${p_id}`)
      .then((res) => {
        let data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        data = data[data.length - 1];
        navigate(`/admin/exe-update/${data._id}`, { state: p_id });
      });
  };
  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUserData(res.data.data);
    });

    axios
      .get(baseUrl + `v1/pagePriceMultipleByPageId/${pageMast_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPriceDataNew(res.data.data);
      });

    // axios.get(baseUrl + "vendorAllData").then((res) => {
    //   setVendorData(res.data.tmsVendorkMastList);
    // });

    // axios.get(baseUrl + "getProfileList").then((res) => {
    //   setProfileData(res.data.data);
    // });

    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityListTemp(res.data.data.map((city) => city.city_name));
      setCityList(res.data.data.map((city) => city.city_name));
    });
    setCountryList(Country.getAllCountries());
    setCountryListTemp(Country.getAllCountries());
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    callApi();
  }, [p_id]);

  useEffect(() => {
    callApi();
  }, [intervalFlag]);

  const {
    data: category,
    error: categoryError,
    isLoading: categoryIsLoading,
  } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

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
    rowCount[index].page_price_type_id = e.value;
    handleFilterPriceType();
  };

  // const handlePriceChange = (e, index) => {
  //   rowCount[index].price = e.target.value;
  // };

  const handlePriceChange = (e, index) => {
    const updatedRowCount = [...rowCount];
    updatedRowCount[index] = {
      ...updatedRowCount[index],
      price: e.target.value,
    };
    setRowCount(updatedRowCount);
  };

  const handleFilterPriceType = (_id) => {
    let filteredData = priceTypeList.filter((row) => {
      // Check if row's page_price_type_id exists in priceTypeList
      return !rowCount.some(
        (e) => e.page_price_type_id == row.page_price_type_id
      );
    });
    axios.delete(baseUrl + `v1/pagePriceMultiple/${_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setFilterPriceTypeList(filteredData);
  };

  const handleOpenPageModal = (type) => {
    return () => {
      dispatch(setOpenShowAddModal());
      dispatch(setModalType(type));
    };
  };

  useEffect(() => {
    if (platformId) {
      setPriceTypeList([]);
      let priceData = platformData?.find(
        (role) => role?._id == platformId
      )?._id;
      axios
        .get(baseUrl + `v1/pagePriceTypesForPlatformId/${platformId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPriceTypeList(res?.data?.data);
          // setFilterPriceTypeList(res?.data?.data);
        });
    }
  }, [platformId]);

  const addPriceRow = () => {
    if (rowCount.length > 0) {
      setRowCount((rowCount) => [
        ...rowCount,
        { page_price_type_id: "", price: "" },
      ]);
    } else {
      setRowCount([{ page_price_type_id: "", price: "" }]);
    }
  };

  const { data: priceData } = useGetMultiplePagePriceQuery(pageMast_id, {
    skip: !pageMast_id,
  });

  useEffect(() => {
    if (priceData) {
      setRowCount(priceData);
    }
  }, [priceData]);

  useEffect(() => {
    axios
      .get(baseUrl + `v1/pageMaster/${pageMast_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = [res.data.data];
        setData(data);
        setLatestEntry(res.data.latestEntry);
        setStateUpdate(data[0].stats_update_flag);
        setTotalPercentage(res.data.totalPercentage);
        setPlatformId(data[0].platform_id);
        setPageName(data[0].page_name);
        setLink(data[0].page_link);
        setCategoryId(data[0].page_category_id);
        // setTag(data[0].tag_category);
        const tagFilter = categoryData.filter((e) =>
          data[0].tags_page_category.includes(e._id)
        );
        setTag(
          tagFilter.map((e) => {
            return { value: e._id, label: e.page_category };
          })
        );
        // setPageLevel(data[0].page_level);
        // setPageStatus(data[0].status == 0 ? "Active" : "Inactive");
        setPageLevel(data[0].preference_level);
        setPageStatus(data[0].page_status);
        setCloseBy(data[0].page_closed_by);
        setPageType(data[0].page_name_type);
        setContent(data[0].content_creation);
        setOwnerType(data[0].ownership_type);
        setVendorId(data[0].vendor_id);
        setFollowCount(data[0].followers_count);
        setProfileId(data[0].page_profile_type_id);
        const platformActive = platformData.filter((e) =>
          data[0].platform_active_on.includes(e._id)
        );
        setPlatformActive(
          platformActive.map((e) => {
            return { value: e._id, label: e.platform_name };
          })
        );
        setRate(data[0].engagment_rate);
        setRateType(data[0].rate_type)
        setEngagment(data[0]?.engagment_rate);
        setDescription(data[0].description);
        setP_id(data[0].pageMast_id);
        const { execounthismodels } = data[0];
        setExecounthismodels(execounthismodels);
      });
  }, [platformData]);

  const handleHistoryRowClick = () => {
    navigate(`/admin/exe-history/${p_id}`, { state: p_id });
  };

  const callApi = () => {
    axios
      .post(baseUrl + "page_health_dashboard", {
        intervalFlag: intervalFlag.value,
        p_id: p_id,
      })
      .then((res) => {
        setHistoryData(res.data.data);
      });
  };

  useEffect(() => {
    if (p_id) {
      axios.get(baseUrl + `get_exe_ip_count_history/${p_id}`).then((res) => {
        const data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        setP_idHistoryData(data);
      });
    }
  }, [p_id]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    } else if (!pageLevel) {
      toastAlert("Page Level is required");
      return;
    } else if (!pageStatus) {
      toastAlert("Page Status is required");
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
    } else if (!platformActive) {
      toastAlert("Platform active on is required");
      return;
    }
    // else if (!rate) {
    //   toastAlert("Engagement Rate is required");
    //   return;
    // }

    const payload = {
      page_name: pageName,
      link: link,
      platform_id: platformId,
      page_category_id: categoryId,
      tags_page_category: tag.map((e) => e.value),
      preference_level: pageLevel,
      status: pageStatus == "Active" ? 1 : 0,
      page_status: pageStatus,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendor_id: vendorId,
      followers_count: followCount,
      page_profile_type_id: profileId,
      platform_active_on: platformActive.map((e) => e.value),
      rate_type: rateType || "",
      description: description,
      updated_by: userID,
      engagment_rate: engagment || 0,
    };

    axios
      .put(baseUrl + `v1/pageMaster/${pageMast_id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      });

    if(priceDataNew.length == undefined){
      for (let i = 0; i < rowCount.length; i++) {
        rowCount[i].created_by = 229;
        rowCount[i].page_master_id = pageMast_id;
        rowCount[i].price = Number(rowCount[i].price);
  
        axios.post(baseUrl + `v1/pagePriceMultiple`, rowCount[i], {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          }
        })
        .then(response => {
            console.log(`Response for object ${i}:`, response.data);
        })
        .catch(error => {
            console.error(`Error for object ${i}:`, error);
        });
      } 
    }else{
      for (let i = 0; i < rowCount.length; i++) {
        // checking if price updated
        let matchingObject = priceDataNew.find(obj => obj.page_price_type_id === rowCount[i].page_price_type_id);
        if (matchingObject) {
          if (matchingObject.price !== rowCount[i].price) {
              axios.put(baseUrl + `v1/pagePriceMultiple/${matchingObject._id}`, {
                  price: rowCount[i].price, 
              }, {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                  }
              })
              .then(response => {
                  console.log(`Updated object ${i} with _id ${matchingObject._id}:`, response.data);
              })
              .catch(error => {
                  console.error(`Error updating object ${i} with _id ${matchingObject._id}:`, error);
              });
          }
        }
      }
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pms-page-overview" />;
  }

  const handleRowClick = () => {
    // setRowData(row);
    // handleClickOpenExeDialog();
  };

  const accordionButtons = ["Edit Page", "Page Health", "Performance"];

  const intervalFlagOptions = [
    { label: "Current Month", value: 1 },
    { label: "Last Three months", value: 3 },
    { label: "Last six months", value: 6 },
    { label: "Last one year", value: 10 },
    { label: "All Data", value: 2 },
  ];

  const goBack = () => {
    navigate(-1);
  };

  const Page = () => {
    return (
      <>
        <FieldContainer
          label="Page Name *"
          value={pageName}
          required={true}
          onChange={(e) => {
            setPageName(e.target.value);
            e.preventDefault();
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
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Category <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={categoryData.map((option) => ({
              value: option._id,
              label: option.page_category,
            }))}
            value={{
              value: categoryId,
              label:
                categoryData.find((role) => role._id === categoryId)
                  ?.page_category || "",
            }}
            onChange={(e) => {
              setCategoryId(e.value);
            }}
          ></Select>
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
            Page Status <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            name="page status"
            options={PageStatus}
            className="basic-multi-select"
            classNamePrefix="select"
            value={PageStatus.find((option) => option.value == pageStatus)}
            onChange={(selectedOption) => setPageStatus(selectedOption.value)}
          />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Close by <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={userData.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            value={{
              value: closeBy,
              label:
                userData.find((role) => role.user_id === closeBy)?.user_name ||
                "",
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

        {/* <FieldContainer
          label="Ownership type *"
          value={ownerType}
          required={true}
          onChange={(e) => setOwnerType(e.target.value)}
        /> */}
        <div className="form-group col-6">
          <label className="form-label">
            Ownership Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className="w-100"
            options={ownerShipData?.map((option) => ({
              value: option.company_type_name,
              label: option.company_type_name,
            }))}
            required={true}
            value={{
              value: ownerType,
              label:
                ownerShipData?.find(
                  (role) => role.company_type_name === ownerType
                )?.company_type_name || "",
            }}
            onChange={(e) => {
              setOwnerType(e.value);
            }}
          />
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Vendor <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorData.map((option) => ({
              value: option._id,
              label: option.vendor_name,
            }))}
            value={{
              value: vendorId,
              label:
                vendorData.find((role) => role._id === vendorId)?.vendor_name ||
                "",
            }}
            onChange={(e) => {
              setVendorId(e.value);
            }}
          ></Select>
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

        <div className="form-group col-6">
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
            }}
          ></Select>
        </div>

        {/* <FieldContainer
          label="Engagement Rate"
          type="number"
          value={rate}
          required={false}
          onChange={(e) => setRate(e.target.value)}
        /> */}

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
              onChange={(selectedOption) => {setRateType(selectedOption.value)}}
            />
          </div>
        </div>

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="col-md-6 p0 mb16">
          <FieldContainer
            label="Engagement Rate"
            type="text"
            fieldGrid={12}
            value={engagment}
            required={false}
            onChange={(e) => {
              // if (
              //   e.target.value !== "" &&
              //   (e.target.value < 0 || isNaN(e.target.value))
              // ) {
              //   return;
              // }
              setEngagment(e.target.value);
            }}
          />
        </div>

        {/* {
          priceDataNew?.map((item)=>(
            <>
              <div style={{display:'flex'}}>
                <h4>{'item'}</h4>
                <input type="number" value={item.price} />
              </div>
            </>
          ))
        } */}

        <div className="col-12 row">
          {rowCount &&
            rowCount.length > 0 &&
            rowCount.map((row, index) => (
              <>
                <div className="form-group col-5 row">
                  <label className="form-label">
                    Price Type <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={priceTypeList?.map((option) => ({
                      value: option?._id,
                      label: option?.name,
                    }))}
                    required={true}
                    value={{
                      label: priceTypeList?.find(
                        (role) =>
                          role?._id === rowCount[index]?.page_price_type_id
                      )?.name,
                      value: rowCount[index]?.page_price_type_id,
                    }}
                    onChange={(e) => handlePriceTypeChange(e, index)}
                  />
                </div>
                <FieldContainer
                  label=" Price *"
                  required={true}
                  type="number"
                  onChange={(e) => handlePriceChange(e, index)}
                  value={rowCount[index].price}
                />
                {index !== 0 && (
                  <button
                    className="btn btn-sm btn-danger mt-4 ml-2 col-1 mb-3"
                    type="button"
                    onClick={() => {
                      setRowCount(
                        (prev) => prev.filter((e, i) => i !== index),
                        handleFilterPriceType(rowCount[index]._id)
                      );
                    }}
                  >
                    Remove
                  </button>
                )}
              </>
            ))}
          <div className="text-center">
            <button
              type="button"
              onClick={addPriceRow}
              className="btn btn-sm btn-primary"
            >
              Add Price
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2 btn-sm">
          Submit
        </button>
      </>
    );
  };

  const PageHealth = () => {
    return (
      <div className="d-felx">
        page health
        <div>
          <FieldContainer
            label="Page Name "
            disabled={true}
            value={data[0]?.page_user_name}
            required={true}
          />
          <FieldContainer
            disabled={true}
            label="Engagement Rate"
            type="number"
            value={rate}
            required={true}
            onChange={(e) => setRate(e.target.value)}
          />
          <FieldContainer
            disabled={true}
            label="Description"
            value={description}
            required={false}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FieldContainer
            disabled={true}
            label="Stats Update %"
            value={totalPercentage}
            required={false}
            onChange={(e) => setDescription(e.target.value)}
          />{" "}
          <FieldContainer
            disabled={true}
            label="Stats Update Flag"
            value={stateUpdate ? "Yes" : "No"}
            required={false}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="d-flex justify-content-lg-start">
            <button
              type="button"
              className="btn btn-primary me-2 btn-lg"
              data-toggle="modal"
              data-target="#myModal1"
              disabled={
                totalPercentage == 0 || totalPercentage == 100 ? false : true
              }
              onClick={() => handleRowClick()}
            >
              Set Stats
            </button>
            <button
              type="button"
              className="btn btn-primary me-2 btn-lg"
              onClick={() => handleHistoryRowClick()}
              disabled={
                latestEntry?.stats_update_flag
                  ? latestEntry.stats_update_flag
                  : true
              }
            >
              See History
            </button>

            <button
              type="button"
              className="btn btn-primary me-2 btn-lg"
              onClick={() => handleUpdateRowClick()}
              disabled={
                latestEntry?.stats_update_flag
                  ? !latestEntry.stats_update_flag
                  : true
              }
            >
              Update
            </button>
          </div>
        </div>
        <div className="d-inline">
          Page Detailed
          <PageDetailed />
        </div>
      </div>
    );
  };

  const handleCloseExeModal = () => {
    setQuater("");
    setStatesFor(null);
    setStartDate(null);
    setEndDate(null);
    setReach();
    setImpression();
    setEngagement();
    setStoryView();
    setRowData({});
    setCity1("");
    setCity2("");
    setCity3("");
    setCity4("");
    setCity5("");
    setCity1Percentage();
    setCity2Percentage();
    setCity3Percentage();
    setCity4Percentage();
    setCity5Percentage();
    setMalePercentage();
    setFemalePercentage();
    setAge1Percentage();
    setAge2Percentage();
    setAge3Percentage();
    setAge4Percentage();
    setAge5Percentage();
    setAge6Percentage();
    setAge7Percentage();
    setAgeImg();
    setCityImg();
    setImpressionImg();
    setEngagementImg();
    setStoryViewImg();
    setStoryViewVideo();
    setProfileVisit();
    setCountry1("");
    setCountry2("");
    setCountry3("");
    setCountry4("");
    setCountry5("");
    setCountry1Percentage();
    setCountry2Percentage();
    setCountry3Percentage();
    setCountry4Percentage();
    setCountry5Percentage();
    setCountryImg();
    setCityImgSrc(null);
    setCountryImgSrc(null);
    setAgeImgSrc(null);
    setImpressionImg(null);
    setEngagementImgSrc(null);
    setStoryViewImgSrc(null);
    setStoryViewVideoSrc(null);
    setStoryViewDate(null);
    setStartDate(null);
    setEndDate(null);
  };

  const PageDetailed = () => {
    const reachImgUrl = `${execounthismodels?.reach_upload_image}`;
    const impressionImgUrl = `${execounthismodels?.impression_upload_image}`;
    const engagementImgUrl = `${execounthismodels?.engagement_upload_image}`;
    const storyViewImgUrl = `${execounthismodels?.story_view_upload_image}`;
    const storyViewVideoUrl = `${execounthismodels?.story_view_upload_video}`;
    const countryImgUrl = `${execounthismodels?.country_image_upload}`;
    const ageImgUrl = `${execounthismodels?.Age_upload}`;

    const cityImgUrl = `${execounthismodels?.reach_upload_image}`;

    return (
      <>
        <FieldContainer
          disabled={true}
          label={"Stats For"}
          value={execounthismodels?.stats_for}
        />
        <FieldContainer
          disabled={true}
          label={"Start Date"}
          value={convertDateToDDMMYYYY(execounthismodels?.start_date)}
        />
        <FieldContainer
          disabled={true}
          label={"End Date"}
          value={convertDateToDDMMYYYY(execounthismodels?.end_date)}
        />
        <FieldContainer
          disabled={true}
          label={"Media"}
          value={execounthismodels?.media}
        />
        <FieldContainer
          disabled={true}
          label={"Profile Visit"}
          value={execounthismodels?.profile_visit}
        />
        <FieldContainer
          disabled={true}
          label={"Quater"}
          value={execounthismodels?.quater}
        />
        <FieldContainer
          disabled={true}
          label={"City1 Name"}
          value={execounthismodels?.city1_name}
        />
        <FieldContainer
          disabled={true}
          label={"City1 %"}
          value={execounthismodels?.percentage_city1_name}
        />
        <FieldContainer
          disabled={true}
          label={"City2 Name"}
          value={execounthismodels?.city2_name}
        />
        <FieldContainer
          disabled={true}
          label={"City2 %"}
          value={execounthismodels?.percentage_city2_name}
        />
        <FieldContainer
          disabled={true}
          label={"City3 Name"}
          value={execounthismodels?.city3_name}
        />
        <FieldContainer
          disabled={true}
          label={"City3%"}
          value={execounthismodels?.percentage_city3_name}
        />
        <FieldContainer
          disabled={true}
          label={"City4 Name"}
          value={execounthismodels?.city4_name}
        />
        <FieldContainer
          disabled={true}
          label={"City4%"}
          value={execounthismodels?.percentage_city4_name}
        />
        <FieldContainer
          disabled={true}
          label={"City5 Name"}
          value={execounthismodels?.city5_name}
        />
        <FieldContainer
          disabled={true}
          label={"City5%"}
          value={execounthismodels?.percentage_city5_name}
        />
        <FieldContainer
          disabled={true}
          label={"City Image Upload"}
          value={execounthismodels?.city_image_upload}
        />

        {execounthismodels?.city_image_upload?.length > 0 && (
          <>
            {" "}
            <h5>City Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(cityImgUrl);
              }}
              src={cityImgUrl}
              alt="City"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}

        {reachImgUrl.length > 0 && (
          <>
            <h5>Reach Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(reachImgUrl);
              }}
              src={reachImgUrl}
              alt="Reach"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {impressionImgUrl.length > 0 && (
          <>
            <h5>Impression Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(impressionImgUrl);
              }}
              src={impressionImgUrl}
              alt="Impression"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {engagementImgUrl.length > 0 && (
          <>
            <h5>Engagement Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(engagementImgUrl);
              }}
              src={engagementImgUrl}
              alt="Engagement"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {storyViewImgUrl.length > 0 && (
          <>
            <h5>Story View Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(storyViewImgUrl);
              }}
              src={storyViewImgUrl}
              alt="Story View"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {storyViewVideoUrl.length > 0 && (
          <>
            <h5>Story View Video</h5>
            <video
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(storyViewVideoUrl);
              }}
              src={storyViewVideoUrl}
              alt="Story View"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {countryImgUrl.length > 0 && (
          <>
            <h5>Country Image</h5>

            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(countryImgUrl);
              }}
              alt="Country"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}
        {ageImgUrl.length > 0 && (
          <>
            <h5>Age Image</h5>
            <img
              onClick={() => {
                setOpenImageDialog(true);
                setViewImgSrc(ageImgUrl);
              }}
              src={ageImgUrl}
              alt="Age"
              style={{ width: "100px", height: "100px" }}
            />
          </>
        )}

        {openImageDialog && (
          <ImageView
            viewImgSrc={viewImgSrc}
            fullWidth={true}
            maxWidth={"md"}
            setViewImgDialog={setOpenImageDialog}
          />
        )}
      </>
    );
  };
  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      renderCell: (params) => {
        const rowIndex = p_idHistoryData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "creation_date",
      headerName: "Creation Date",
      readerCell: (params) => {
        return (
          <div>
            {params.row?.creation_date ? (
              <>
                {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "executive_name",
      headerName: "Executive Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.user_id ? (
              <>
                {
                  allUsers.filter((e) => e.user_id == params.row.user_id)[0]
                    ?.user_name
                }
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "reach",
      headerName: "Reach",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.reach ? (
              <>
                {params.row.reach} {params.row.percentage_reach}&nbsp;
                {params.row.reach_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.reach_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "impression",
      headerName: "Impression",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.impression ? (
              <>
                {params.row.impression} {params.row.percentage_impression}
                &nbsp;
                {params.row.impression_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.impression_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.engagement ? (
              <>
                {params.row.engagement} {params.row.percentage_engagement}
                &nbsp;
                {params.row.engagement_upload_image_url && (
                  <a
                    key="engagement"
                    href={params.row.engagement_upload_image_url}
                    title="Engagement Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "story_view",
      headerName: "Story View",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view ? (
              <>
                {params.row.story_view} {params.row.percentage_story_view}
                &nbsp;
                {params.row.story_view_upload_image_url && (
                  <a
                    key="storyImg"
                    href={params.row.story_view_upload_image_url}
                    title="Story View Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
                {params.row.story_view_upload_video_url && (
                  <a
                    key="storyVdo"
                    href={params.row.story_view_upload_video_url}
                    title="Story view Video"
                    download
                  >
                    <OndemandVideoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "stats_for",
      headerName: "Stats For",
      width: 150,
    },
    {
      field: "quater",
      headerName: "Quater",
      width: 150,
    },
    {
      field: "city1_name",
      headerName: "City 1",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city1_name ? (
              <>
                {params.row.city1_name} &nbsp;{" "}
                {params.row.percentage_city1_name}
                {params.row.city_image_upload_url && (
                  <a
                    key="cityImg"
                    href={params.row.city_image_upload_url}
                    title="City Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city2_name",
      headerName: "City 2",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city2_name ? (
              <>
                {params.row.city2_name} &nbsp;{" "}
                {params.row.percentage_city2_name}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city3_name",
      headerName: "City 3",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city3_name ? (
              <>
                {params.row.city3_name} &nbsp;{" "}
                {params.row.percentage_city3_name}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city4_name",
      headerName: "City 4",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city4_name ? (
              <>
                {params.row.city4_name} &nbsp;{" "}
                {params.row.percentage_city4_name}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city5_name",
      headerName: "City 5",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city5_name ? (
              <>
                {params.row.city5_name} &nbsp;{" "}
                {params.row.percentage_city5_name}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "male_percent",
      headerName: "Male %",
      width: 150,
    },
    {
      field: "female_percent",
      headerName: "Female %",
      width: 150,
    },
    {
      field: "Age_13_17_percent",
      headerName: "Age 13-17 %",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.Age_13_17_percent ? (
              <>
                {params.row.Age_13_17_percent} &nbsp;{" "}
                {params.row.Age_upload_url && (
                  <a
                    key="cityVdo"
                    href={params.row.Age_upload_url}
                    title="Age Img"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "Age_18_24_percent",
      headerName: "Age 18-24 %",
      width: 150,
    },
    {
      field: "Age_25_34_percent",
      headerName: "Age 25-34 %",
    },
    {
      field: "Age_35_44_percent",
      headerName: "Age 35-44 %",
    },
    {
      field: "Age_45_54_percent",
      headerName: "Age 45-54 %",
    },
    {
      field: "Age_55_64_percent",
      headerName: "Age 55-64 %",
    },
    {
      field: "Age_65_plus_percent",
      headerName: "Age 65+ %",
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.start_date ? (
              <>
                {new Date(params.row.start_date).toISOString().substr(8, 2)}/
                {new Date(params.row.start_date).toISOString().substr(5, 2)}/
                {new Date(params.row.start_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "story_view_date",
      headerName: "Story View Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view_date ? (
              <>
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.end_date ? (
              <>
                {new Date(params.row.end_date).toISOString().substr(8, 2)}/
                {new Date(params.row.end_date).toISOString().substr(5, 2)}/
                {new Date(params.row.end_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "creation_date",
      headerName: "Creation Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(2, 2)}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => handleDeleteRowData(params.row)}
            variant="contained"
            color="primary"
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const handleDeleteRowData = (data) => {
    setRowData(data);
    handleClickOpenDeleteHistoryConFirmation();
  };
  const handleClickOpenDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(true);
  };
  const PerformanceDashboard = () => {
    return (
      <>
        <Button sx={{ mb: 3 }} onClick={() => setGraphView(!graphView)}>
          {graphView ? "View Table" : "View Graph"}
        </Button>
        {graphView && (
          <>
            {" "}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Box sx={{ display: "flex" }}>
                <Autocomplete
                  disablePortal
                  value={intervalFlag.label}
                  defaultValue={intervalFlagOptions[0].label}
                  id="combo-box-demo"
                  options={intervalFlagOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      return setIntervalFlag({
                        label: "Current Month",
                        value: 1,
                      });
                    }
                    setIntervalFlag(newValue);
                  }}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Filter Date" />
                  )}
                />
              </Box>
            </Box>
            <div className="d-flex justify-content-between">
              <h6 className="fs-5 mx-2 pt-3">Hightest</h6>

              <BarChart
                xAxis={[{ scaleType: "band", data: ["Higest"] }]}
                series={[
                  { data: [historyData[0]?.maxReach], label: "Reach" },
                  {
                    data: [historyData[0]?.maxImpression],
                    label: "Impression",
                  },
                  {
                    data: [historyData[0]?.maxEngagement],
                    label: "Engagement",
                  },
                ]}
                width={500}
                height={300}
              />
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="fs-5 mx-2 pt-3">Average</h6>
              <BarChart
                xAxis={[{ scaleType: "band", data: ["Average"] }]}
                series={[
                  { data: [historyData[0]?.avgReach], label: "Reach" },
                  {
                    data: [historyData[0]?.avgImpression],
                    label: "Impression",
                  },
                  {
                    data: [historyData[0]?.avgEngagement],
                    label: "Engagement",
                  },
                ]}
                width={500}
                height={300}
              />{" "}
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="fs-5 mx-2 pt-3">Lowest</h6>
              <BarChart
                xAxis={[{ scaleType: "band", data: ["Lowest"] }]}
                series={[
                  { data: [historyData[0]?.minReach], label: "Reach" },
                  {
                    data: [historyData[0]?.minImpression],
                    label: "Impression",
                  },
                  {
                    data: [historyData[0]?.minEngagement],
                    label: "Engagement",
                  },
                ]}
                width={500}
                height={300}
              />
            </div>{" "}
          </>
        )}

        {!graphView && (
          <DataGrid
            rows={p_idHistoryData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        )}
      </>
    );
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
        <ArrowBackIcon onClick={goBack} />
      </div>
      <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        handleSubmit={handleSubmit}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        submitButton={false}
      >
        {activeAccordionIndex === 0 && <Page />}
        {/* {activeAccordionIndex === 1 && <PageHealth />} */}
        {activeAccordionIndex === 1 &&
          navigate(`/admin/exe-history/${pageMast_id}`)}
        {activeAccordionIndex === 2 && <PerformanceDashboard />}
      </FormContainer>

      <div id="myModal1" className="modal fade" role="dialog">
        <div
          className="modal-dialog"
          style={{ marginLeft: "20%", height: "100vh", marginTop: "-10%" }}
        >
          <div
            className="modal-content"
            style={{ width: "70vw", height: "auto" }}
          >
            <div className="modal-header">
              <h4 className="modal-title">
                Page Name :- {data[0]?.page_user_name}
              </h4>
              <button
                type="button"
                className="close"
                onClick={handleCloseExeModal}
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="row" style={{ height: "auto" }}>
                <div className="mb-1 col-lg-3 me-3 p-1 ">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={dropdownStaticData}
                    onChange={(e, value) => {
                      setStatesFor(value),
                        value !== "Quarterly"
                          ? setStateForIsNotQuater(true)
                          : setStateForIsNotQuater(false);
                      value?.length > 0
                        ? setStateForIsValid(true)
                        : setStateForIsValid(false);
                      value == "Daily"
                        ? setStartDate(dayjs())
                        : setStartDate("");
                      value == "Daily" ? setEndDate(dayjs()) : setEndDate("");
                    }}
                    value={statesFor}
                    // sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Stats for *"
                        error={!stateForIsValid}
                        helperText={
                          !stateForIsValid ? "Please select an option" : ""
                        }
                      />
                    )}
                  />
                </div>
                {statesFor !== "Quarterly" &&
                  statesFor !== null &&
                  stateForIsNotQuater && (
                    <div className="mb-1 col-lg-3 me-3 p-1 ">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          className="my-1"
                          label="Start Date *"
                          format="DD/MM/YY"
                          value={startDate}
                          onChange={(newValue) => {
                            handleStartDateChange(newValue);
                            statesFor == "Daily" ? setEndDate(newValue) : "";
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}

                {statesFor !== null &&
                  statesFor !== "Quarterly" &&
                  stateForIsNotQuater && (
                    <div className="mb-1 col-lg-3 me-3 p-1 ">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          label="End Date *"
                          format="DD/MM/YY"
                          value={endDate}
                          onChange={(newValue) => {
                            handleEndDateChange(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                {statesFor == "Quarterly" && !stateForIsNotQuater && (
                  <div className="mb-1 col-lg-8  ">
                    <Autocomplete
                      className=" col-lg-4"
                      disablePortal
                      id="combo-box-demo"
                      options={QuarterStaticData}
                      onChange={(e, value) => {
                        setQuater(value);
                        value?.length > 0
                          ? setQuaterIsValid(true)
                          : setQuaterIsValid(false);
                      }}
                      value={quater}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Quarter *"
                          error={!quaterIsValid}
                          helperText={
                            !quaterIsValid ? "Please select an option" : ""
                          }
                        />
                      )}
                    />
                  </div>
                )}
              </div>
              <h4 className="h3 text-center">Followers Bifurcation</h4>
              <div className="row gap-4">
                <div className="card   col-sm-12 col-lg-3">
                  <div>
                    <div className="col-md-3 col-lg-12 d-block my-2">
                      <TextField
                        label="Reach"
                        type="number"
                        value={reach}
                        //key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setReachValidation(true);
                            setReach(enteredValue);
                          } else {
                            setReachValidation(false);
                          }
                        }}
                        error={!reachValidation}
                        helperText={
                          !reachValidation ? "Please enter a valid count" : ""
                        }
                      />
                      <div className="col-md-3 py-1 mb-2  ">
                        <Button
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          title="Reach"
                        >
                          Image
                          <VisuallyHiddenInput
                            onChange={(e) => {
                              const uploadedFile = e.target.files[0];
                              if (uploadedFile) {
                                const imageUrl =
                                  URL.createObjectURL(uploadedFile);
                                setReachImgSrc(imageUrl);
                                setReachImg(uploadedFile);
                              }
                            }}
                            type="file"
                            accept="image/png, image/jpeg"
                          />
                        </Button>

                        {reachImgSrc && (
                          <div className="d-flex">
                            <img
                              src={reachImgSrc}
                              className="mt-1"
                              alt="Uploaded"
                            />{" "}
                            <Button
                              size="small"
                              onClick={() => {
                                setReachImgSrc(null);
                                setReachImg(null);
                              }}
                            >
                              <CloseTwoToneIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Impressions *"
                        type="number"
                        value={impression}
                        //key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setImpressionValidation(true);
                            setImpression(enteredValue);
                          } else {
                            setImpressionValidation(false);
                          }
                        }}
                        error={!impressionValidation}
                        helperText={
                          !impressionValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 py-1 mb-2  ">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        title="Impression"
                      >
                        Image
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
                              setImpressionImgSrc(imageUrl);
                              setImpressionImg(uploadedFile);
                            }
                          }}
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>

                      {impressionImgSrc && (
                        <div className="d-flex">
                          <img
                            src={impressionImgSrc}
                            className="mt-1"
                            alt="Uploaded"
                          />{" "}
                          <Button
                            size="small"
                            onClick={() => {
                              setImpressionImgSrc(null);
                              setImpressionImg(null);
                            }}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Engagement *"
                        //key={reachkey}
                        type="number"
                        value={engagement}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setEngagementValidation(true);
                            setEngagement(enteredValue);
                          } else {
                            setEngagementValidation(false);
                          }
                        }}
                        error={!engagementValidation}
                        helperText={
                          !engagementValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 py-1 mb-2">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                      >
                        Image
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
                              setEngagementImgSrc(imageUrl);
                              setEngagementImg(uploadedFile);
                            }
                          }}
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>
                      {engagementImgSrc && (
                        <div className="d-flex">
                          <img
                            src={engagementImgSrc}
                            className="mt-1"
                            alt="Uploaded"
                          />{" "}
                          <Button
                            size="small"
                            onClick={() => setEngagementImgSrc(null)}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="col-md-3 col-lg-12  my-2">
                      <TextField
                        label="Story View *"
                        type="number"
                        value={storyView}
                        //key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setStoryViewValidation(true);
                            setStoryView(enteredValue);
                          } else {
                            setStoryViewValidation(false);
                          }
                        }}
                        error={!storyViewValidation}
                        helperText={
                          !storyViewValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 col-lg-12 py-1 mb-2">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          label="Story View Date"
                          format="DD/MM/YY"
                          value={storyViewDate}
                          onChange={(newValue) => {
                            handleStoryViewDateChange(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="col-md-3 col-lg-12 py-1 mb-2">
                      <Button
                        className="me-1"
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                      >
                        image
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
                              setStoryViewImgSrc(imageUrl);
                              setStoryViewImg(uploadedFile);
                            }
                          }}
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                      >
                        Video
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const videoUrl =
                                URL.createObjectURL(uploadedFile);
                              setStoryViewVideoSrc(videoUrl); // Set the video URL in state for preview
                              setStoryViewVideo(uploadedFile); // Set the uploaded video in state
                            }
                          }}
                          type="file"
                          accept="video/mp4,video/avi"
                        />
                      </Button>
                      <div>
                        {storyViewImgSrc && (
                          <div className="d-flex">
                            <img
                              style={{ height: "auto", width: "25%" }}
                              src={storyViewImgSrc}
                              className="mt-1"
                              alt="Uploaded"
                            />{" "}
                            <Button
                              size="small"
                              onClick={() => setStoryViewImgSrc(null)}
                            >
                              <CloseTwoToneIcon />
                            </Button>
                          </div>
                        )}
                        {storyViewVideoSrc && (
                          <div className="d-flex align-items-center">
                            <video
                              style={{ height: "auto", width: "25%" }}
                              src={storyViewVideoSrc}
                              // controls
                              className="mt-1"
                              alt="Uploaded Video"
                            />
                            <Button
                              size="small"
                              onClick={() => {
                                setStoryViewImgSrc(null);
                                setStoryViewVideo(null);
                              }}
                            >
                              <CloseTwoToneIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Profile Visit"
                        //key={reachkey}
                        type="number"
                        value={profileVisit}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0 || enteredValue === "") {
                            setProfileVisit(enteredValue);
                            setProfileVisitError(false); // Reset error state
                          } else {
                            setProfileVisitError(true); // Set error state for negative values
                          }
                        }}
                        error={profileVisitError}
                        helperText={
                          profileVisitError
                            ? "Please enter a non-negative number"
                            : ""
                        }
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                <div className="card  col-sm-12 col-lg-3">
                  <div>
                    <label className="mt-3 h6">City</label>
                    <Autocomplete
                      id="combo-box-demo"
                      value={city1}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        cityCopyValidation(value, city1);
                        setCity1(() => value);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 1" />
                      )}
                    />
                    <TextField
                      className="mb-1 "
                      type="number"
                      value={city1Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCity1Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      id="combo-box-demo"
                      value={city2}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity2(value);
                        cityCopyValidation(value, city2);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 2" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      value={city2Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCity2Percentage(e.target.value);
                      }}
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      id="combo-box-demo"
                      value={city3}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity3(value);
                        cityCopyValidation(value, city3);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 3" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      //key={reachkey}
                      value={city3Percentage}
                      onChange={(e) => {
                        setCity3Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      id="combo-box-demo"
                      value={city4}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity4(value);
                        cityCopyValidation(value, city4);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 4" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={city4Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCity4Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      id="combo-box-demo"
                      value={city5}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity5(value);
                        cityCopyValidation(value, city5);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 5" />
                      )}
                    />
                    <TextField
                      type="number"
                      value={city5Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCity5Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <div>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-4"
                        onChange={(e) => {
                          const uploadedFile = e.target.files[0];
                          if (uploadedFile) {
                            const imageUrl = URL.createObjectURL(uploadedFile);
                            setCityImgSrc(imageUrl);
                            setCityImg(uploadedFile);
                          }
                        }}
                      >
                        Image
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>

                      {cityImgSrc && (
                        <div className="d-flex align-items-center">
                          <img
                            style={{ height: "auto", width: "25%" }}
                            src={cityImgSrc}
                            className="mt-1"
                            alt="Image Uploaded"
                          />
                          <Button
                            size="small"
                            onClick={() => {
                              setCityImgSrc(null);
                              setCityImg(null);
                            }}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card  col-sm-12 col-lg-3">
                  <div>
                    <label className="mt-3 h6">Country</label>
                    <Autocomplete
                      id="combo-box-demo"
                      value={country1}
                      options={countryList.map((country) => country.name)}
                      onChange={(e, value) => {
                        countryCopyValidation(value, country1);
                        setCountry1(value);
                      }}
                      // sx={{ width: 250 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 1" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country1Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCountry1Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      disablePortal
                      value={country2}
                      onChange={(e, value) => {
                        countryCopyValidation(value, country2);
                        setCountry2(value);
                      }}
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 2" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      value={country2Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCountry2Percentage(e.target.value);
                      }}
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      disablePortal
                      value={country3}
                      onChange={(e, value) => {
                        setCountry3(value);
                        countryCopyValidation(value, country3);
                      }}
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 3" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country3Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCountry3Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      value={country4}
                      onChange={(e, value) => {
                        setCountry4(value);
                        countryCopyValidation(value, country4);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 4" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country4Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCountry4Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      value={country5}
                      onChange={(e, value) => {
                        setCountry5(value);
                        countryCopyValidation(value, country5);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 5" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country5Percentage}
                      //key={reachkey}
                      onChange={(e) => {
                        setCountry5Percentage(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: 100,
                        },
                      }}
                    />
                    <div>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-3"
                        onChange={(e) => {
                          const uploadedFile = e.target.files[0];
                          if (uploadedFile) {
                            const imageUrl = URL.createObjectURL(uploadedFile);
                            setCountryImgSrc(imageUrl);
                            setCountryImg(uploadedFile);
                          }
                        }}
                      >
                        Image
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>
                      {countryImgSrc && (
                        <div className="d-flex align-items-center">
                          <img
                            style={{ height: "auto", width: "25%" }}
                            src={countryImgSrc}
                            className="mt-1"
                            alt="Country Image Uploaded"
                          />
                          <Button
                            size="small"
                            onClick={() => {
                              setCountryImg(null);
                              setCountryImgSrc(null);
                            }}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card  col-sm-12 col-lg-2">
                  <div>
                    <label className="h6 d-block">Age Group</label>
                    <div className="d-flex flex-col">
                      <TextField
                        label="13-17"
                        type="number"
                        className="mb-2"
                        value={age1Percentage}
                        //key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge1Percentage(e.target.value)
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="18-24"
                        type="number"
                        className="mb-2"
                        value={age2Percentage}
                        //key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge2Percentage(e.target.value)
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="25-34"
                        type="number"
                        className="mb-2"
                        value={age3Percentage}
                        //key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge3Percentage(e.target.value)
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="35-44"
                        type="number"
                        className="mb-2"
                        value={age4Percentage}
                        //key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge4Percentage(e.target.value)
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="45-54"
                        type="number"
                        className="mb-2"
                        value={age5Percentage}
                        //key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge5Percentage(e.target.value)
                          )
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="55-64"
                        type="number"
                        className="mb-2"
                        value={age6percentage}
                        //key={reachkey}
                        onChange={(e) => {
                          setAge6Percentage(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <TextField
                        label="65+"
                        type="number"
                        className="mb-2"
                        value={age7Percentage}
                        //key={reachkey}
                        onChange={(e) => {
                          setAge7Percentage(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-4"
                        onChange={(e) => {
                          const uploadedFile = e.target.files[0];
                          if (uploadedFile) {
                            const imageUrl = URL.createObjectURL(uploadedFile);
                            setAgeImgSrc(imageUrl);
                            setAgeImg(uploadedFile);
                          }
                        }}
                      >
                        Image
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>

                      {ageImgSrc && (
                        <div className="d-flex align-items-center">
                          <img
                            style={{ height: "auto", width: "25%" }}
                            src={ageImgSrc}
                            className="mt-1"
                            alt="Age Image Uploaded"
                          />
                          <Button
                            size="small"
                            onClick={() => {
                              setAgeImgSrc(null);
                              setAgeImg(null);
                            }}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                      {totalPercentage < 98 && (
                        <span style={{ color: "red" }}>
                          Total percentage must be at least 98%
                        </span>
                      )}
                      {totalPercentage > 100 && (
                        <span style={{ color: "red" }}>
                          Total percentage cannot exceed 100%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-2">
                <div className="card-body">
                  <label className="h6 d-block">Gender</label>
                  <div className="row">
                    <div className="col-sm-12 col-lg-2 mt-2">
                      <TextField
                        label="Male"
                        type="number"
                        value={malePercentage}
                        onChange={(e) => {
                          setMalePercentage(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                    </div>
                    <div className="col-sm-12 col-lg-2 mt-2">
                      <TextField
                        label="Female"
                        type="number"
                        // className="mx-3"
                        value={femalePercentage}
                        onChange={(e) => {
                          setFemalePercentage(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: {
                            min: 0,
                            max: 100,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={handleCloseExeModal}
              >
                Cancel
              </button>
              <button
                onClick={saveStats}
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageEdit;
