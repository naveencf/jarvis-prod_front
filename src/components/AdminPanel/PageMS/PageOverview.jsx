import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addRow } from "../../Store/Executon-Slice";
import View from "../Sales/Account/View/View";

import DateFormattingComponent from "../../DateFormator/DateFormared";
import {
  openTagCategoriesModal,
  setTagCategories,
} from "../../Store/PageOverview";
import TagCategoryListModal from "./TagCategoryListModal";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetVendorWhatsappLinkTypeQuery,
} from "../../Store/reduxBaseURL";
import VendorNotAssignedModal from "./VendorNotAssignedModal";
import {
  useGetAllCitiesQuery,
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetMultiplePagePriceQuery,
  useGetPageStateQuery,
  useGetpagePriceTypeQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllProfileListQuery,
} from "../../Store/PageBaseURL";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setStatsUpdate } from "../../Store/PageMaster";
import PageDetail from "./PageOverview/PageDetail";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { AppContext, useGlobalContext } from "../../../Context/Context";
import PageClosedByDetails from "./Page/PageClosedByDetails";
import VendorDetails from "./Vendor/VendorDetails";
import CategoryWisePageOverview from "./PageOverview/CategoryWisePageOverview";
import StatisticsWisePageOverview from "./PageOverview/StatisticsWisePageOverview";
import { constant } from "../../../utils/constants";
import { formatNumber } from "../../../utils/formatNumber";
import FilterWisePageOverview from "./PageOverview/FilterWisePageOverview";
import PriceModal from "./PageOverview/PriceModal";
import FollowerLogsModal from "./FollowerLogsModal";
import PriceLogs from "./PriceLogs";
import WhatsapplinksModel from "./PageOverview/WhatsapplinksModel";
import PageOverviewWithoutHealth from "./PageOverview/PageOverviewWithoutHealth";
import StatsOfOverview from "./PageOverview/StatsOfOverview";
const PageOverview = () => {
  const { toastAlert, toastError, usersDataContext } = useGlobalContext();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const token = sessionStorage.getItem("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const {  } = useContext(AppContext);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("Tab0");
  const [tabFilterData, setTabFilterData] = useState([]);
  const [tableFollowers, setTableFollowers] = useState(0);
  const [tablePosts, setTablePosts] = useState(0);
  const [tableStories, setTableStories] = useState(0);
  const [tableBoths, setTableBoths] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [contextData, setContextData] = useState(false);
  const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [newFilterData, setNewFilterData] = useState([]);
  console.log(newFilterData, "new data");
  const [waData, setWaData] = useState(null);
  const [individualData, setIndividualData] = useState([]);
  const [individualDataDup, setIndividualDataDup] = useState([]);
  const [allVendorWhats, setAllVendorWhats] = useState([]);
  const [selectedPriceType, setSelectedPriceType] = useState(""); // Holds the selected price type
  const [inputPrice, setInputPrice] = useState(""); // Holds the input price
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [rowDataFollower, setRowDataFollower] = useState("");
  const [localPriceData, setLocalPriceData] = useState(null);
  const [pagequery, setpagequery] = useState("")

  const { data: linkType } = useGetVendorWhatsappLinkTypeQuery();
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const {
    data: pageCate,
    refetch: refetchPageCate,
    isLoading: isPageCateLoading,
  } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCat = subCategory?.data || [];
  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor;
  const { data: priceData, isLoading: isPriceLoading } =
    useGetMultiplePagePriceQuery(selectedRow, { skip: !selectedRow });
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });

  const { data: pageStates, isLoading: isPagestatLoading } =
    useGetPageStateQuery();
  const { data: allPriceTypeList } = useGetpagePriceTypeQuery();
  const { data: profileData } = useGetAllProfileListQuery();

  // Handle price type change
  const handlePriceTypeChange = (e) => {
    setSelectedPriceType(e.target.value);
  };

  // Handle price input change
  const handleInputChange = (e) => {
    setInputPrice(e.target.value);
  };

  // Filter data when the button is clicked
  const handleFilter = () => {
    console.log(filterData, "filterData");
    const filteredData = filterData?.filter((row) => {
      let price = 0;
      // Get the selected price based on the selectedPriceType
      switch (selectedPriceType) {
        case "Post Price":
          price = row?.price_details?.Insta_Post || 0;
          break;
        case "Story Price":
          price = row?.price_details?.Insta_Story || 0;
          break;
        case "Both Price":
          price = row?.price_details?.Both || 0;
          break;
        default:
          return false;
      }
      // Return rows where price exactly matches the input price
      return price === Number(inputPrice); // Ensures type matching
    });
    // Update the filtered data

    setNewFilterData(filteredData);
  };
  // console.log(allVendorWhats,platformData,"test")
  const handleVendorClick = async (_id) => {
    const res = await axios.get(baseUrl + `v1/vendor/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setVendorDetails(res?.data?.data);
  };

  function pageHealthToggleCheck() {
    if (showPageHealthColumn) {
      const data = filterData?.map((item) => {
        const matchingState = pageStates?.find(
          (state) => state?.page_master_id === item?._id
        );
        return {
          ...item,
          pageId: matchingState?._id,
          ...matchingState,
          _id: item?._id,
        };
      });

      setNewFilterData(data);
    }
    if (showPageHealthColumn == false) {
      setFilterData(pageList);
    }
  }

  const getData = () => {
    setUser(usersDataContext);
    axios
      .get(baseUrl + "v1/vendor_group_link", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setAllVendorWhats(res?.data?.data);
      });
  };

  const handleTagCategory = (params) => {
    return function () {
      dispatch(setTagCategories(params));
      dispatch(openTagCategoriesModal());
    };
  };

  const handleSetState = () => {
    dispatch(addRow(false));
    dispatch(setStatsUpdate(false));
  };
  const handleUpdateRowClick = async (row) => {
    dispatch(setStatsUpdate(true));
  };

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row._id}`, {
      state: row.pageMast_id,
    });
  };

  const calculateAndSetTotals = (result) => {
    let totalFollowers = 0;
    let totalPosts = 0;
    let totalStories = 0;
    let totalBoths = 0;
    if (!result) {
      return;
    }
    for (let i = 0; i < result?.length; i++) {
      if (result[i]?.followers_count) {
        totalFollowers += result[i]?.followers_count;
      }
      totalPosts += result[i].post;
      totalStories += result[i].story;
      totalBoths += result[i].both_;
    }
    setTableFollowers(totalFollowers);
    setTablePosts(totalPosts);
    setTableStories(totalStories);
    setTableBoths(totalBoths);
  };

  useEffect(() => {
    if (pageList) {
      setVendorTypes(pageList);
      setFilterData(pageList);
      calculateAndSetTotals(pageList);
      setTabFilterData(pageList);
      // setNewFilterData(pageList);
    }
  }, [pageList]);

  useEffect(() => {
    pageHealthToggleCheck();
  }, [isPageListLoading, isPagestatLoading, filterData]);

  useEffect(() => {
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[33].view_value === 1) {
            setContextData(true);
          }
          if (res.data[57].view_value === 1) {
            setPageUpdateAuth(true);
          }
          if (res.data[56].view_value === 1) {
            setPageStatsAuth(true);
          }
        });
    }

    getData();
    // fetchWhatsAppLinks();
  }, []);

  useEffect(() => {
    if (pageList) {
      const pageCategoryCount = {};
      const categoryVendorMap = {};
      const categoryFollowerMap = {};
      const postMap = {};
      const storyMap = {};

      for (let i = 0; i < pageList?.length; i++) {
        const categoryId = pageList[i]?.page_category_id;
        const vendorId = pageList[i]?.vendor_id;
        const followers = pageList[i]?.followers_count || 0;
        const storys = pageList[i]?.story || 0;
        const posts = pageList[i]?.post || 0;

        if (categoryId) {
          if (pageCategoryCount[categoryId]) {
            pageCategoryCount[categoryId] += 1;
          } else {
            pageCategoryCount[categoryId] = 1;
          }

          if (!categoryVendorMap[categoryId]) {
            categoryVendorMap[categoryId] = new Set();
          }
          if (vendorId) {
            categoryVendorMap[categoryId].add(vendorId);
          }

          if (categoryFollowerMap[categoryId]) {
            categoryFollowerMap[categoryId] += followers;
          } else {
            categoryFollowerMap[categoryId] = followers;
          }

          if (storyMap[categoryId]) {
            storyMap[categoryId] += storys;
          } else {
            storyMap[categoryId] = storys;
          }

          if (postMap[categoryId]) {
            postMap[categoryId] += posts;
          } else {
            postMap[categoryId] = posts;
          }
        }
      }

      const finalResult = [];
      for (let j = 0; j < cat?.length; j++) {
        const categoryId = cat[j]?._id;
        const categoryName = cat[j]?.page_category;

        if (pageCategoryCount[categoryId]) {
          finalResult.push({
            id: categoryId,
            category_name: categoryName,
            category_used: pageCategoryCount[categoryId],
            vendor_count: categoryVendorMap[categoryId]?.size || 0,
            total_followers: categoryFollowerMap[categoryId] || 0,
            total_stories: storyMap[categoryId] || 0,
            total_posts: postMap[categoryId] || 0,
          });
        }
      }

      setCategoryData(finalResult);
    }
  }, [vendorTypes, vendorData, cat, pageList]);
  // Update localPriceData when new data is fetched
  useEffect(() => {
    if (priceData) {
      setLocalPriceData(priceData);
    }
  }, [priceData]);

  const handlePriceClick = (row) => {
    return function () {
      setSelectedRow(row._id);
      setShowPriceModal(true);
    };
  };

  const handleFollowerLogs = (row) => {
    setOpenFollowerModal(true);
    setRowDataFollower(row);
  };
  const handleCloseFollowerModal = () => {
    setOpenFollowerModal(false);
  };
  const [openPriceLogModal, setOpenPriceLogModal] = useState(false);
  const [rowDataPriceLog, setRowDataPriceLog] = useState("");

  const handlePriceLogs = (row) => {
    setOpenPriceLogModal(true);
    setRowDataPriceLog(row);
  };
  const handleClosePriceModal = () => {
    setOpenPriceLogModal(false);
  };

  // const whatsAppData = async (data) => {
  //   setLoading(true);
  //   const result = await axios
  //     .get(`${baseUrl}v1/vendor_group_link_vendor_id/${data.vendor_id}`, {
  //       headers: {
  //         Authorization: `Bearer ${storedToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       setWaData(res.data.data);
  //       setLoading(false);
  //     });
  // };
  const handlewhatsAppData = (row) => {
    setWaData(row);
  };
  const deletePhpData = async (row) => {
    await axios.delete(baseUrl + `node_data_to_php_delete_page`, {
      p_id: row.p_id,
    });
  };

  const handleUpadteFollowers = async (row) => {
    const payload = {
      creators: [row.page_name],
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
      const result = await axios.post(
        `https://insights.ist:8080/api/v1/creators_details_v3`,
        payload,
        { headers }
      );
      const followerData = result?.data?.data?.[0]?.creatorDetails?.followers;

      if (followerData) {
        const updateRes = await axios.put(
          `${baseUrl}v1/pageMaster/${row._id}`,
          { followers_count: followerData },
          { headers }
        );
      } else {
        console.error("No follower data found for this creator.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.message);
        toastError(error.response.data.message);
      } else {
        console.error("Error fetching followers:", error.message);
        toastError("An error occurred while fetching the followers.");
      }
    }
  };

  const editInNewTab = (_id) => {
    window.open(`/admin/pms-page-edit/${_id}`, "_blank");
    sessionStorage.setItem("token", storedToken);
  };
  // console.log(vendorData,"vendorData")
  const dataSecondGridColumns = [
    {
      key: "Add",
      name: "Add",
      width: 130,
      renderRowCell: (row) => {
        const totalPercentage = row.totalPercentage;
        return (
          <>
            <Link to={{ pathname: `/admin/pageStats/${row._id}` }}>
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleSetState()}
              >
                Add Stats
              </button>
            </Link>
          </>
        );
      },
    },
    {
      key: "history",
      width: 150,
      name: "History",
      renderRowCell: (row) => {
        return (
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={() => handleHistoryRowClick(row)}
          >
            See History
          </button>
        );
      },
    },
    {
      key: "statsUpdate",
      width: 150,
      name: "Stats Update",
      renderRowCell: (row) => {
        return (
          row?.pageId && (
            <Link
              to={{
                pathname: `/admin/pageStats/${row.pageId}`,
                state: { update: true },
              }}
            >
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleUpdateRowClick}
              >
                Update
              </button>
            </Link>
          )
        );
      },
    },
    {
      key: "Age_13_17_percent",
      width: 150,
      name: "Age 13-17 %",
      renderRowCell: (row) => {
        let data = row?.Age_13_17_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_18_24_percent",
      width: 150,
      name: "Age 18-24 %",
      renderRowCell: (row) => {
        let data = row?.Age_18_24_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_25_34_percent",
      width: 150,
      name: "Age 25-34 %",
      renderRowCell: (row) => {
        let data = row?.Age_25_34_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_35_44_percent",
      width: 150,
      name: "Age 35-44 %",
      renderRowCell: (row) => {
        let data = row?.Age_35_44_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_45_54_percent",
      width: 150,
      name: "Age 45-54 %",
      renderRowCell: (row) => {
        let data = row?.Age_45_54_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_55_64_percent",
      width: 150,
      name: "Age 55-64 %",
      renderRowCell: (row) => {
        let data = row?.Age_55_64_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_65_plus_percent",
      width: 150,
      name: "Age 65+ %",
      renderRowCell: (row) => {
        let data = row?.Age_65_plus_percent;
        return +data ? data + "%" : "NA";
      },
    },

    {
      key: "city1_name",
      width: 150,
      name: "City 1 and %",
      renderRowCell: (row) => {
        let data = row?.city1_name;
        let percentage = row?.percentage_city1_name;
        return data ? data + ` (${percentage}%)` : "NA";
      },
    },
    {
      key: "city2_name",
      width: 150,
      name: "City 2 and %",
      renderRowCell: (row) => {
        let data = row?.city2_name;
        let percentage = row?.percentage_city2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city3_name",
      width: 150,
      name: "City 3 and %",
      renderRowCell: (row) => {
        let data = row?.city3_name;
        let percentage = row?.percentage_city3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city4_name",
      width: 150,
      name: "City 4 and %",
      renderRowCell: (row) => {
        let data = row?.city4_name;
        let percentage = row?.percentage_city4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city5_name",
      width: 150,
      name: "City 5 and %",
      renderRowCell: (row) => {
        let data = row?.city5_name;
        let percentage = row?.percentage_city5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city_image_url",
      width: 150,
      name: "City Image",
      renderRowCell: (row) => {
        let data = row?.city_image_url;
        return data ? (
          <a href={data} target="_blank" rel="noopener noreferrer">
            <img src={data} style={{ width: "50px", height: "50px" }} />
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "country1_name",
      width: 150,
      name: "Country 1  and %",
      renderRowCell: (row) => {
        let data = row?.country1_name;
        let percentage = row?.percentage_country1_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country2_name",
      width: 150,
      name: "Country 2 and %",
      renderRowCell: (row) => {
        let data = row?.country2_name;
        let percentage = row?.percentage_country2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country3_name",
      width: 150,
      name: "Country 3 and %",
      renderRowCell: (row) => {
        let data = row?.country3_name;
        let percentage = row?.percentage_country3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country4_name",
      width: 150,
      name: "Country 4 and %",
      renderRowCell: (row) => {
        let data = row?.country4_name;
        let percentage = row?.percentage_country4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country5_name",
      width: 150,
      name: "Country 5 and %",
      renderRowCell: (row) => {
        let data = row?.country5_name;
        let percentage = row?.percentage_country5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country_image_url",
      width: 150,
      name: "Country Image",
      renderRowCell: (row) => {
        let data = row?.country_image_url;
        return data ? (
          <a href={data} target="_blank" rel="noopener noreferrer">
            <img src={data} style={{ width: "50px", height: "50px" }} />
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "createdAt",
      width: 150,
      name: "Creation Date",
      renderRowCell: (row) => {
        let data = row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
    },

    {
      key: "engagement",
      width: 150,
      name: "Engagement",
      renderRowCell: (row) => {
        let data = row?.engagement;
        let dataimg = row?.engagement_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "impression",
      width: 150,
      name: "Impression",
      renderRowCell: (row) => {
        let data = row?.impression;
        let dataimg = row?.impression_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "female_percent",
      width: 150,
      name: "Female Percentage",
      renderRowCell: (row) => {
        let data = row?.female_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      key: "male_percent",
      width: 150,
      name: "Male Percentage",
      renderRowCell: (row) => {
        let data = row?.male_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      key: "profile_visit",
      width: 150,
      name: "Profile Visit",
      renderRowCell: (row) => {
        let data = row?.profile_visit;
        return data ? data : "NA";
      },
      // editable: true,
      // customEditElement: (row,
      //   index,
      //   setEditFlag,
      //   editflag,
      //   handelchange,
      //   column) => {
      //   return (
      //     <>
      //       <input type="number" value={row.profile_visit} autoFocus onChange={e=>{
      //         handelchange(e, index, column)
      //       }}/>
      //       <button className="btn btn-success" onClick={(e)=>handleProfileChange(e,setEditFlag,row)}><SaveAsIcon /></button>
      //     </>
      //   );
      // }
    },
    {
      key: "reach",
      width: 150,
      name: "Reach",
      renderRowCell: (row) => {
        let data = row?.reach;
        let dataimg = row?.reach_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "start_date",
      width: 150,
      name: "Start Date",
      renderRowCell: (row) => {
        let data = row?.start_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      key: "endDate",
      width: 150,
      name: "End Date",
      renderRowCell: (row) => {
        let data = row?.end_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      key: "story_view",
      width: 150,
      name: "Story View",
      renderRowCell: (row) => {
        let data = row?.story_view;
        return data ? data : "NA";
      },
    },
    {
      key: "story_view_image_url",
      width: 150,
      name: "Story View Image",
      renderRowCell: (row) => {
        let data = row?.story_view_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
  ]
  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "WA Links",
      name: "WA Links",
      width: 100,

      renderRowCell: (row) => {
        let name = allVendorWhats?.filter(
          (item) => item?.vendor_id == row?.vendor_id
        );
        let countName = name?.length;
        return (
          <div
            data-toggle="modal"
            data-target="#waModal"
            onClick={() => handlewhatsAppData(row)}
            // onClick={<WhatsapplinksModel data={row} />}
            style={{ cursor: "pointer" }}
          >
            {countName}
          </div>
        );
      },
    },
    {
      key: "Bio",
      name: "Bio",
      width: 80,
      renderRowCell: (row) => <div>{row.bio ? row.bio : "NA "}</div>,
    },
    {
      key: "page_activeness",
      name: "Activeness",
      width: 80,
      renderRowCell: (row) => { return formatString(row?.page_activeness) },
    },
    {
      key: "page_name",
      name: "User Name",
      width: 200,

      renderRowCell: (row) => {
        let name = row.page_name;
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={row.page_link}
            className="link-primary"
          >
            {formatString(name)}
          </a>
        );
      },
    },
    {
      key: "Logo",
      name: "Logo",
      width: 150,
      renderRowCell: (row) => {
        const name = `https://storage.googleapis.com/insights_backend_bucket/cr/${row.page_name}.jpeg`;
        return (
          <div className="profile-sec sb">
            <div className="profile-img">

              <img

                src={name}
                alt={row.page_name}
                width={40}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "preference_level",
      name: "Level",
      width: 200,
      renderRowCell: (row) => { return formatString(row.preference_level) }
      // // editable: true,
      // customEditElement: (
      //   row,
      //   index,
      //   setEditFlag,
      //   editflag,
      //   handelchange,
      //   column
      // ) => {
      //   return (
      //     <select
      //       className="form-select"
      //       value={row.preference_level}
      //       onChange={(e) => {
      //         handelchange(e, index, column);
      //         handleLevelChange(e, setEditFlag, row);
      //       }}
      //     >
      //       <option value="Level 1 (High)">Level 1 (High)</option>
      //       <option value="Level 2 (Medium)">Level 2 (Medium)</option>
      //       <option value="Level 3 (Low)">Level 3 (Low)</option>
      //     </select>
      //   );
      // },
    },

    {
      key: "content_creation",
      name: "Content Creation",
      renderRowCell: (row) => {
        return row.content_creation != 0 ? row.content_creation : "";
      },
      width: 200,
    },
    {
      key: "ownership_type",
      name: "Ownership",
      width: 200,
    },
    {
      key: "platform_name",
      name: "Platform",
      renderRowCell: (row) => { return formatString(row.platform_name) },

      width: 200,
    },
    {
      key: "page_category_name",
      name: "Category",
      width: 200,
      renderRowCell: (row) => { return formatString(row.page_category_name) }

      // compare: true,
      // renderRowCell: (row) => {
      //   // let name = cat?.find((item) => item?.page_category_id == row.row?.temp_page_cat_id)?.page_category;
      //   let name = cat?.find(
      //     (item) => item?._id == row?.page_category_id
      //   )?.page_category;
      //   return name;
      // },
      // editable: true,
      // customEditElement: (
      //   row,
      //   index,
      //   setEditFlag,
      //   editflag,
      //   handelchange,
      //   column
      // ) => {
      //   return (
      //     <select
      //       className="form-select"
      //       value={row.page_category_id}
      //       onChange={(e) => {
      //         handelchange(e, index, column);
      //         handleCategoryChange(e, setEditFlag, row);
      //       }}
      //       autoFocus
      //     >
      //       {cat.map((status, idx) => (
      //         <option key={idx} value={status._id}>
      //           {" "}
      //           {status.page_category}{" "}
      //         </option>
      //       ))}
      //     </select>
      //   );
      // },
    },
    {
      key: "page_sub_category_name",
      name: "Sub Category",
      width: 200,
      renderRowCell: (row) => { return formatString(row.page_sub_category_name) },

      // compare: true,
    },
    {
      key: "followers_count",
      name: "Followers",
      width: 200,
      renderRowCell: (row) => { return formatNumber(row.followers_count) }

    },
    {
      key: "vendor_id",
      name: "Vendor",
      renderRowCell: (row) => {
        let vendor = vendorData?.find((item) => item?._id == row?.vendor_id);
        let name = vendor ? vendor.vendor_name : "Unknown Vendor";
        return (
          <a
            className="link-primary pointer"
            onClick={() => handleVendorClick(vendor?._id)}
          >
            {formatString(name)}
          </a>
        );
      },
      width: 200,
      compare: true,
    },
    // {
    //   key: "platform_active_on",
    //   name: "Active Platform",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     let data = platformData?.filter((item) => {
    //       return row.platform_active_on?.includes(item._id);
    //     });
    //     return data?.map((item) => item.platform_name).join(", ");
    //   },
    // },

    {
      key: "page_closed_by",
      name: "Closed By",
      width: 200,
      renderRowCell: (row) => {
        let name = user?.find(
          (item) => item?.user_id == row?.page_closed_by
        )?.user_name;
        return <div>{name ?? "NA"}</div>;
      },
    },
    {
      key: "page_name_type",
      name: "Name Type",
      width: 200,
      renderRowCell: (row) => {
        return row.page_name_type != 0 ? row.page_name_type : "";
      },
    },
    { key: "rate_type", name: "Rate Type", width: 200 },
    {
      key: "Post Price",
      name: "Post Price",
      width: 200,
      renderRowCell: (row) => {
        let PostData = row?.page_price_list[0]?.instagram_post;
        return PostData ? PostData : 0;
      },
      compare: true,
    },
    {
      key: "Story price",
      name: "Story Price",
      width: 200,
      renderRowCell: (row) => {
        let StoryData = row?.page_price_list[1]?.instagram_story;
        return StoryData ? StoryData : 0;
      },
      compare: true,
    },
    {
      key: "Both Price",
      name: "Both Price",
      width: 200,
      renderRowCell: (row) => {
        let BothData = row?.page_price_list[2]?.instagram_both;
        return BothData ? BothData : 0;
      },
      compare: true,
    },
    {
      key: "page_price_multiple",
      name: "Price",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="Price"
                onClick={handlePriceClick(row)}
                className="btn btn-outline-primary btn-sm user-button"
              >
                <PriceCheckIcon />
              </button>
            }
          </div>
        );
      },
    },
    {
      key: "follower logs",
      name: "Follower Logs",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="Follower Logs"
                onClick={() => handleFollowerLogs(row)}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Follower Logs
              </button>
            }
          </div>
        );
      },
    },
    {
      key: "Price_logs",
      name: "Price Logs",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="Price Logs"
                onClick={() => handlePriceLogs(row)}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Price Logs
              </button>
            }
          </div>
        );
      },
    },
    {
      key: "Action",
      name: "Action",
      width: 500,
      renderRowCell: (row) => (
        <div className="flexCenter colGap8">
          {pageUpdateAuth && (
            <Link
              className="mt-2"
              to={`/admin/pms-page-edit/${row._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
                onClick={() => editInNewTab(row._id)}
              >
                <FaEdit />{" "}
              </button>
            </Link>
          )}
          {decodedToken.role_id == 1 && (
            <div onClick={() => deletePhpData(row)}>
              <DeleteButton
                endpoint="v1/pageMaster"
                id={row._id}
                getData={refetchPageList}
              />
            </div>
          )}
          <button
            title="Update Followers"
            className="btn btn-outline-primary  user-button"
            onClick={() => handleUpadteFollowers(row)}
          >
            Update Followers
          </button>
        </div>
      ),
    },


  ];

  const handleLevelChange = async (event, setEditFlag, row) => {
    const newValue = event.target.value;
    try {
      await axios.put(
        `${baseUrl}v1/pageMaster/${row._id}`,
        {
          preference_level: newValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toastAlert("Data Updated");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setEditFlag(false);
    }
  };

  const handleStatusChange = async (event, setEditFlag, row) => {
    const newValue = event.target.value;
    try {
      await axios.put(
        `${baseUrl}v1/pageMaster/${row._id}`,
        {
          page_mast_status: newValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toastAlert("Data Updated");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setEditFlag(false);
    }
  };

  const handleCategoryChange = async (event, setEditFlag, row) => {
    const newValue = event.target.value;

    try {
      await axios.put(
        `${baseUrl}v1/pageMaster/${row._id}`,
        {
          page_category_id: newValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toastAlert("Data Updated");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setEditFlag(false);
      refetchPageCate();
      refetchPageList();
    }
  };

  const handleProfileChange = async (event, setEditFlag, row) => {
    const newValue = Number(row.profile_visit);
    try {
      await axios.put(
        `${baseUrl}v1/page_states/${row.pageId}`,
        {
          // ...params.row,
          profile_visit: newValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toastAlert("Data Updated");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setEditFlag(false);
    }
  };
  // Fetch data from API
  const fetchWhatsAppLinks = async () => {
    try {
      const response = await axios.get("/api/whatsAppLinks");
      setAllVendorWhats(response?.data);
    } catch (error) {
      console.error("Error fetching WhatsApp links", error);
    }
  };

  return (
    <>
      {waData && <WhatsapplinksModel waData={waData} setWaData={setWaData} />}
      <FollowerLogsModal
        open={openFollowerModal}
        onClose={handleCloseFollowerModal}
        rowData={rowDataFollower}
        allPriceTypeList={allPriceTypeList}
      />
      <PriceLogs
        open={openPriceLogModal}
        onClose={handleClosePriceModal}
        rowData={rowDataPriceLog}
        allPriceTypeList={allPriceTypeList}
      />
      <div className="tabs">
        {vendorDetails && (
          <VendorDetails
            vendorDetails={vendorDetails}
            setVendorDetails={setVendorDetails}
          />
        )}
        <button
          className={activeTab === "Tab0" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab0")}
        >
          Overview
        </button>
        <button
          className={activeTab === "Tab5" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab5")}
        >
          Statistics
        </button>
        {/* <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          OLD-Statistics
        </button> */}
        <button
          className={activeTab === "Tab3" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab3")}
        >
          Category Wise
        </button>
        <button
          className={activeTab === "Tab4" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab4")}
        >
          Page Added Details
        </button>

        <button
          className={activeTab === "Tab5" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Page Health
        </button>
      </div>

      <div className="content">
        {activeTab === "Tab0" && (
          <>

            <PageOverviewWithoutHealth columns={dataGridcolumns} />

          </>
        )}
        {activeTab === "Tab1" && (
          <div className="">
            <div className="card">
              <div className="card-header flexCenterBetween">
                <h5 className="card-title flexCenterBetween">
                  <Typography>Profile Health</Typography>
                  <Typography>: {filterData?.length}</Typography>
                </h5>
                <div className="flexCenter colGap8">
                  <Link
                    to={`/admin/pms-page-master`}
                    className="btn cmnbtn btn_sm btn-outline-primary"
                  >
                    Add Profile <AddIcon />
                  </Link>
                  <Link
                    to={`/admin/pms-vendor-overview`}
                    className="btn cmnbtn btn_sm btn-outline-primary"
                  >
                    Vendor <KeyboardArrowRightIcon />
                  </Link>
                </div>
              </div>
              <div className="card-body pb4">
                <FilterWisePageOverview
                  platformData={platformData}
                  vendorTypes={vendorTypes}
                  setFilterData={setFilterData}
                  setTabFilterData={setTabFilterData}
                  calculateAndSetTotals={calculateAndSetTotals}
                  subCat={subCat}
                  cat={cat}
                  profileData={profileData}
                  newFilterData={newFilterData}
                  vendorData={vendorData}
                />
              </div>
              <div className="card-footer">
                <div className="flexCenterBetween">
                  <div>
                    <h5>
                      Followers -{" "}
                      <span className="colorMedium">
                        {formatNumber(tableFollowers)}
                      </span>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Posts -{" "}
                      <span className="colorMedium">
                        {formatNumber(tablePosts)}
                      </span>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Stories -{" "}
                      <span className="colorMedium">
                        {formatNumber(tableStories)}
                      </span>
                    </h5>
                  </div>
                  <div>
                    <h5>
                      Boths -{" "}
                      <span className="colorMedium">
                        {formatNumber(tableBoths)}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Dropdown for selecting price type */}
              <select
                value={selectedPriceType}
                onChange={handlePriceTypeChange}
              >
                <option value="" disabled>
                  Select Price Type
                </option>
                <option value="Post Price">Post Price</option>
                <option value="Story Price">Story Price</option>
                <option value="Both Price">Both Price</option>
              </select>

              {/* Input for entering price */}
              {selectedPriceType && (
                <input
                  type="number"
                  placeholder="Enter price"
                  value={inputPrice}
                  onChange={handleInputChange}
                />
              )}

              {/* Filter button */}
              <button onClick={handleFilter}>Filter</button>
            </div>
            <div className="card">
              <div className="card-body p0">
                <div className="data_tbl thm_table table-responsive">
                  {isPageListLoading ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        position: "relative",
                        margin: "auto",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={progress}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          color="text-primary"
                        >
                          {`${Math.round(progress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <View
                      columns={[...dataGridcolumns, ...dataSecondGridColumns]}
                      data={newFilterData}
                      isLoading={false}
                      title={"Page Overview"}
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName={"Page Overview"}
                    />
                  )}
                </div>
              </div>
            </div>

            <PriceModal
              setShowPriceModal={setShowPriceModal}
              setSelectedRow={setSelectedRow}
              setLocalPriceData={setLocalPriceData}
              showPriceModal={showPriceModal}
              localPriceData={localPriceData}
              priceData={priceData}
              allPriceTypeList={allPriceTypeList}
            />
            <TagCategoryListModal />
            <VendorNotAssignedModal />
            <PageDetail />
          </div>
        )}
        {/* {activeTab === "Tab2" && (
          <StatisticsWisePageOverview
            tabFilterData={tabFilterData}
            setTabFilterData={setTabFilterData}
            setActiveTab={setActiveTab}
            setFilterData={setFilterData}
            allVendorWhats={allVendorWhats}
            newFilterData={newFilterData}
          />
        )} */}
        {activeTab === "Tab3" && (
          <CategoryWisePageOverview
            categoryData={categoryData}
            setFilterData={setFilterData}
            pageList={pageList}
            setActiveTab={setActiveTab}
            vendorTypes={vendorTypes}
            vendorData={vendorData}
          />
        )}
        {activeTab === "Tab4" && <PageClosedByDetails />}
        {activeTab === "Tab5" && <StatsOfOverview />}
      </div>
    </>
  );
};

export default PageOverview;
