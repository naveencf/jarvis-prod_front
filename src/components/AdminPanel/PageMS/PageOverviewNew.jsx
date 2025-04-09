import { useState, useEffect, useContext, useRef } from "react";
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
import TagCategoryListModal from "./TagCategoryListModal";
import VendorNotAssignedModal from "./VendorNotAssignedModal";
import {
  useGetAllPageListQuery,
  useGetPageStateQuery,
} from "../../Store/PageBaseURL";
import { setStatsUpdate } from "../../Store/PageMaster";
import PageDetail from "./PageOverview/PageDetail";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { AppContext, useGlobalContext } from "../../../Context/Context";
import PageClosedByDetails from "./Page/PageClosedByDetails";
import VendorDetails from "./Vendor/VendorDetails";

import { formatNumber } from "../../../utils/formatNumber";
import PriceModal from "./PageOverview/PriceModal";
import FollowerLogsModal from "./FollowerLogsModal";
import PriceLogs from "./PriceLogs";
import WhatsapplinksModel from "./PageOverview/WhatsapplinksModel";
import PageOverviewWithoutHealth from "./PageOverview/PageOverviewWithoutHealth";
import StatsOfOverview from "./PageOverview/StatsOfOverview";
import PageEdit from "./PageEdit";
import CategoryWisePageOverviewNew from "./PageOverview/CategoryWisePageOverviewNew";
import PageLogsModel from "./PageLogsModel";
const PageOverviewNew = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const token = sessionStorage.getItem("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [vendorDetails, setVendorDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Tab0");
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState([]);
  // const [categoryData, setCategoryData] = useState([]);
  const [newFilterData, setNewFilterData] = useState([]);
  const [waData, setWaData] = useState(null);

  const [allVendorWhats, setAllVendorWhats] = useState([]);
  const [platformName, setPlanFormName] = useState(
    localStorage.getItem("activeTab")
  );
  // const [selectedPriceType, setSelectedPriceType] = useState(''); // Holds the selected price type
  // const [inputPrice, setInputPrice] = useState(''); // Holds the input price
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [rowDataFollower, setRowDataFollower] = useState("");
  const [pagequery, setPagequery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editID, setEditID] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activenessFilter, setActivenessFilter] = useState(null);
  const [filterFollowers, setFilterFollowers] = useState(null);
  const [latestPageObject, setLatestPageObject] = useState({});
  const [pageColumns, setPageColumns] = useState([]);

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({
    decodedToken,
    userID,
    pagequery,
  });
  const { data: pageStates, isLoading: isPagestatLoading } =
    useGetPageStateQuery();

  useEffect(() => {
    if (activeTab == "Tab1") {
      pageHealthToggleCheck();
    }
  }, [activeTab]);

  function pageHealthToggleCheck() {
    // if (showPageHealthColumn) {
    const data = pageList?.map((item) => {
      const matchingState = pageStates?.find(
        (state) => state?.page_master_id === item?._id
      );
      if (matchingState) {
        // console.log(matchingState, 'matchingState', item);
      }
      return {
        ...item,
        pageId: matchingState?._id,
        ...matchingState,
        _id: item?._id,
      };
    });

    setNewFilterData(data);
  }

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

  const handlePriceClick = (row) => {
    return function () {
      // console.log(row?.page_price_list
      //   ,'nnnn');
      setSelectedRow(row?.page_price_list);
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

  const [openPageLogsModel, setOpenPageLogsModel] = useState(false);
  const [PageLogsId, setPageLogsId] = useState("");
  const handlePageLogs = (row) => {
    setOpenPageLogsModel(true);
    setPageLogsId(row);
  };
  const handleClosePageLogsModel = () => {
    setOpenPageLogsModel(false);
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
          { followers_count: followerData, vendor_id: row.vendor_id },
          { headers }
        );
        setLatestPageObject(updateRes.data.data);
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
    // window.open(`/admin/pms-page-edit/${_id}`, "_blank");
    // sessionStorage.setItem("token", storedToken);
    setEditMode(true);
    setEditID(_id);
   };
  const handleEditClose = () => {
    setEditMode(false);
    setEditID(null);
  };
  // console.log(vendorData,"vendorData")
  const dataSecondGridColumns = [
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
  ];

  const handleClickVendorName = (params) => {
    setVendorDetails(params);
  };
  const getPriceDetail = (priceDetails, key) => {
    const keyType = key.split("_")[1];

    const detail = priceDetails?.find((item) => {
      return Object.keys(item).some((priceKey) => priceKey.includes(keyType));
    });

    return detail
      ? detail[Object.keys(detail).find((key) => key.includes(keyType))]
      : 0;
  };
  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
      showCol: true,
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
            {capitalizeFirstLetter(name)}
          </a>
        );
      },
    },
    {
      key: "page_activeness",
      name: "Activeness",
      width: 80,
      renderRowCell: (row) => {
        return formatString(row?.page_activeness);
      },
    },
    {
      key: "createdAt",
      name: "Register Date",
      renderRowCell: (row) => {
        const date = new Date(row.createdAt).toLocaleDateString("en-CA");
        return <div style={{ cursor: "pointer" }}>{date}</div>;
      },
      width: 120,
      showCol: true,
    },
    {
      key: "createdAt1",
      name: "Register Time",
      renderRowCell: (row) => {
        const time = new Date(row.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return <div style={{ cursor: "pointer" }}>{time}</div>;
      },
      width: 120,
      showCol: true,
    },
    {
      key: "followers_count",
      name: "Followers",
      width: 200,
      renderRowCell: (row) => {
        return row.followers_count;
      },
    },
    // {
    //   key: "max_cost_price",
    //   name: "Max Cost Price",
    //   renderRowCell: (row) => {
    //     const rateType = row?.rate_type;
    //     const priceList = row?.page_price_list || [];
    //     const followerCount = Math.max(0, row?.followers_count || 0);

    //     // Extract all prices from priceList excluding 'instagram_both'
    //     const prices = priceList?.flatMap((item) =>
    //       Object.entries(item)
    //         .filter(([key]) => key !== "instagram_both") // Exclude 'instagram_both'
    //         .map(([, value]) => Number(value) || 0)
    //     );

    //     // Calculate the maximum price in the list
    //     const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    //     if (rateType === "Variable") {
    //       // Calculate the average story price based on follower count
    //       const maxVariablePrice = maxPrice; // Maximum price among variable prices
    //       const tempmaxVariablePrice = followerCount
    //         ? Math.floor(maxVariablePrice / (followerCount / 1000000))
    //         : 0;

    //       // Return the higher value between tempmaxVariablePrice and maxPrice
    //       return Math.max(tempmaxVariablePrice, maxPrice);
    //     }

    //     // Default behavior for non-Variable rate types
    //     return maxPrice;
    //   },
    //   width: 150,
    //   showCol: true,
    //   compare: true,
    // },
    {
      key: "link",
      name: "Link",
      width: 80,
      renderRowCell: (row) => {
        return row.page_link ? row.page_link : "NA";
      },
      compare: true,
    },
    {
      key: "Bio",
      name: "Bio",
      width: 80,
      renderRowCell: (row) => <div>{row.bio ? row.bio : "NA "}</div>,
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
              <img src={name} alt={row.page_name} width={40} />
            </div>
          </div>
        );
      },
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
      key: "average_post_price",
      name: "Average Post Price",
      renderRowCell: (row) => {
        const mPostPrice = row?.page_price_list;
        const postDetail = mPostPrice?.find(
          (item) => item.instagram_post !== undefined
        );
        const postPrice = postDetail?.instagram_post || 0; // Use 0 if postPrice is not available
        let followerCount = Math.max(0, row?.followers_count || 0);

        // Calculate the average price only if followerCount is greater than zero
        const averagePostPrice = followerCount
          ? Math.floor(postPrice / (followerCount / 1000000))
          : 0;

        return Number(averagePostPrice);
      },
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: "average_story_price",
      name: "Average Story Price",
      renderRowCell: (row) => {
        // console.log(row.page_name, "fghj", row.page_price_list)
        const mStoryPrice = row?.page_price_list;
        const postDetail = mStoryPrice?.find(
          (item) => item.instagram_story !== undefined
        );
        const storyPrice = postDetail?.instagram_story || 0;
        let followerCount = Math.max(0, row?.followers_count || 0);
        const averageStoryPrice = followerCount
          ? Math.floor(storyPrice / (followerCount / 1000000))
          : 0;

        return Number(averageStoryPrice);
      },
      width: 150,
      showCol: true,
      compare: true,
    },

    {
      key: "preference_level",
      name: "Level",
      width: 200,
      renderRowCell: (row) => {
        return formatString(row.preference_level);
      },
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
      key: "page_layer",
      name: "Page Layer",
      renderRowCell: (row) => {
        switch (row.page_layer) {
          case 0:
            return "Inventory Pages";
          case 1:
            return "Sarcasm Network";
          case 2:
            return "Own Pages";
          case 3:
            return "Advance Pages";
          case 4:
            return "Top Used Pages";
          default:
            return "Unknown";
        }
      },
      width: 200,
    },

    {
      key: "platform_name",
      name: "Platform",
      renderRowCell: (row) => {
        return formatString(row.platform_name);
      },

      width: 200,
    },
    {
      key: "page_category_name",
      name: "Category",
      width: 200,
      renderRowCell: (row) => {
        return formatString(row.page_category_name);
      },
    },
    {
      key: "page_sub_category_name",
      name: "Sub Category",
      width: 200,
      renderRowCell: (row) => {
        return formatString(row.page_sub_category_name);
      },
    },
    {
      key: "followers_count",
      name: "M Followers",
      width: 200,
      renderRowCell: (row) => {
        let followerCount = Math.max(0, row?.followers_count || 0);
        return formatNumber(followerCount);
      },
    },

    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      // editable: true,
      renderRowCell: (row) => {
        return (
          <div
            onClick={() => handleClickVendorName(row)}
            className="link-primary cursor-pointer text-truncate"
          >
            {formatString(row?.vendor_name || "Not Available")}
          </div>
        );
      },
    },

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
    // platformName !== "twitter" &&
    //   platformName !== "thread" &&
    //   platformName !== "youtube" ? {
    //   key: "Post Price",
    //   name: "Post Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const postPrice = getPriceDetail(
    //       row?.page_price_list,
    //       "platform_post"
    //     );
    //     // const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
    //     // const postPrice = postData ? postData.instagram_post : 0;
    //     return postPrice > 0 ? Number(postPrice) : 0;
    //   },
    //   compare: true,
    // } : "",
    // platformName === "youtube" ? {
    //   key: "Youtube Short Price",
    //   name: "Youtube Short Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const postPrice = getPriceDetail(row?.page_price_list, "platform_post");
    //     // const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
    //     // const postPrice = postData ? postData.instagram_post : 0;
    //     return postPrice > 0 ? Number(postPrice) : 0;
    //   },
    //   compare: true,
    // } : [],
    // platformName === "youtube" ? {
    //   key: "Youtube Video Price",
    //   name: "Youtube Video Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const storyPrice = getPriceDetail(
    //       row?.page_price_list,
    //       "platform_story"
    //     );
    //     // const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
    //     // const postPrice = postData ? postData.instagram_post : 0;
    //     return storyPrice > 0 ? Number(storyPrice) : 0;
    //   },
    //   compare: true,
    // } : "",
    // platformName === "twitter" ? {
    //   key: "xtweet Price",
    //   name: "X-tweet Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const storyPrice = getPriceDetail(
    //       row?.page_price_list,
    //       "platform_post"
    //     );
    //     // const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
    //     // const postPrice = postData ? postData.instagram_post : 0;
    //     return storyPrice > 0 ? Number(storyPrice) : 0;
    //   },
    //   compare: true,
    // } : "",
    // platformName === "thread" ? {
    //   key: "thred-tweet Price",
    //   name: "Thread-tweet Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const storyPrice = getPriceDetail(
    //       row?.page_price_list,
    //       "platform_post"
    //     );
    //     // const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
    //     // const postPrice = postData ? postData.instagram_post : 0;
    //     return storyPrice > 0 ? Number(storyPrice) : 0;
    //   },
    //   compare: true,
    // } : "",
    // platformName !== "youtube" &&
    //   platformName !== "twitter" &&
    //   platformName !== "thread"
    //   ? {
    //     key: "Reel Price",
    //     name: "Reel Price",
    //     width: 200,
    //     renderRowCell: (row) => {
    //       const reelData = row?.page_price_list?.find(
    //         (item) => item?.instagram_reel !== undefined
    //       );
    //       const reelPrice = reelData ? reelData.instagram_reel : 0;
    //       return reelPrice > 0 ? Number(reelPrice) : 0;
    //     },
    //     compare: true,
    //   }
    //   : "",
    // platformName !== "youtube" &&
    //   platformName !== "twitter" &&
    //   platformName !== "thread"
    //   ? {
    //     key: "Story Price",
    //     name: "Story Price",
    //     width: 200,
    //     renderRowCell: (row) => {
    //       const storyPrice = getPriceDetail(
    //         row?.page_price_list,
    //         "platform_story"
    //       );
    //       return storyPrice > 0 ? Number(storyPrice) : 0;
    //     },
    //     compare: true,
    //   }
    //   : "",
    // platformName !== "youtube" &&
    //   platformName !== "twitter" &&
    //   platformName !== "thread" ? {
    //   key: "Both Price",
    //   name: "Both Price",
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const bothData = row?.page_price_list?.find(
    //       (item) => item?.instagram_both !== undefined
    //     );
    //     const bothPrice = bothData ? bothData.instagram_both : 0;
    //     return bothPrice;
    //   },
    //   compare: true,
    // } : "",

    // {
    //   key: 'ownership_type',
    //   name: 'Ownership',
    //   width: 200,

    // },
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
      key: "history",
      name: "History",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="History"
                onClick={() => handlePageLogs(row)}
                className="btn cmnbtn btn_sm btn-outline-danger"
              >
                History
              </button>
            }
          </div>
        );
      },
    },
    {
      key: "vendor_group_link",
      width: 150,
      name: "Whatsapp Link",
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
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => editInNewTab(row._id)}
          >
            <FaEdit />{" "}
          </button>
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

  useEffect(() => {
    let updatedColumns = [];

    if (
      platformName !== "twitter" &&
      platformName !== "thread" &&
      platformName !== "youtube"
    ) {
      updatedColumns.push({
        key: "Post Price",
        name: "Post Price",
        width: 200,
        renderRowCell: (row) => {
          const postPrice = getPriceDetail(
            row?.page_price_list,
            "platform_post"
          );
          return postPrice > 0 ? Number(postPrice) : 0;
        },
        compare: true,
      });
    }

    if (platformName === "youtube") {
      updatedColumns.push({
        key: "Youtube Short Price",
        name: "Youtube Short Price",
        width: 200,
        renderRowCell: (row) => {
          const postPrice = getPriceDetail(
            row?.page_price_list,
            "platform_post"
          );
          return postPrice > 0 ? Number(postPrice) : 0;
        },
        compare: true,
      });

      updatedColumns.push({
        key: "Youtube Video Price",
        name: "Youtube Video Price",
        width: 200,
        renderRowCell: (row) => {
          const storyPrice = getPriceDetail(
            row?.page_price_list,
            "platform_story"
          );
          return storyPrice > 0 ? Number(storyPrice) : 0;
        },
        compare: true,
      });
    }

    if (platformName === "twitter") {
      updatedColumns.push({
        key: "xtweet Price",
        name: "X-tweet Price",
        width: 200,
        renderRowCell: (row) => {
          const storyPrice = getPriceDetail(
            row?.page_price_list,
            "platform_post"
          );
          return storyPrice > 0 ? Number(storyPrice) : 0;
        },
        compare: true,
      });
    }

    if (platformName === "thread") {
      updatedColumns.push({
        key: "thred-tweet Price",
        name: "Thread-tweet Price",
        width: 200,
        renderRowCell: (row) => {
          const storyPrice = getPriceDetail(
            row?.page_price_list,
            "platform_post"
          );
          return storyPrice > 0 ? Number(storyPrice) : 0;
        },
        compare: true,
      });
    }

    if (
      platformName !== "youtube" &&
      platformName !== "twitter" &&
      platformName !== "thread"
    ) {
      updatedColumns.push({
        key: "Reel Price",
        name: "Reel Price",
        width: 200,
        renderRowCell: (row) => {
          const reelData = row?.page_price_list?.find(
            (item) => item?.instagram_reel !== undefined
          );
          const reelPrice = reelData ? reelData.instagram_reel : 0;
          return reelPrice > 0 ? Number(reelPrice) : 0;
        },
        compare: true,
      });

      updatedColumns.push({
        key: "Story Price",
        name: "Story Price",
        width: 200,
        renderRowCell: (row) => {
          const storyPrice = getPriceDetail(
            row?.page_price_list,
            "platform_story"
          );
          return storyPrice > 0 ? Number(storyPrice) : 0;
        },
        compare: true,
      });

      updatedColumns.push({
        key: "Both Price",
        name: "Both Price",
        width: 200,
        renderRowCell: (row) => {
          const bothData = row?.page_price_list?.find(
            (item) => item?.instagram_both !== undefined
          );
          const bothPrice = bothData ? bothData.instagram_both : 0;
          return bothPrice;
        },
        compare: true,
      });
    }

    // setDataGridColumns(updatedColumns);
    // updatedColumns.map((item) => dataGridcolumns.push(item))
    setPageColumns(() => [...dataGridcolumns, ...updatedColumns]);
    // dataGridcolumns.push(updatedColumns)
  }, [platformName]);
  return (
    <>
      <PriceModal
        setShowPriceModal={setShowPriceModal}
        selectedRow={selectedRow}
        showPriceModal={showPriceModal}
      />
      {!editMode ? (
        <>
          {waData && (
            <WhatsapplinksModel waData={waData} setWaData={setWaData} />
          )}
          <FollowerLogsModal
            open={openFollowerModal}
            onClose={handleCloseFollowerModal}
            rowData={rowDataFollower}
          />

          <PageLogsModel
            open={openPageLogsModel}
            onClose={handleClosePageLogsModel}
            rowData={PageLogsId}
          />

          <PriceLogs
            open={openPriceLogModal}
            onClose={handleClosePriceModal}
            rowData={rowDataPriceLog}
          />

          <div className="tabs">
            {vendorDetails && (
              <VendorDetails
                vendorDetails={vendorDetails}
                setVendorDetails={setVendorDetails}
                tab1={"tab1"}
              />
            )}
            <button
              className={
                activeTab === "Tab0" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab0")}
            >
              Overview
            </button>
            <button
              className={
                activeTab === "Tab5" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab5")}
            >
              Statistics
            </button>
            <button
              className={
                activeTab === "Tab3" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab3")}
            >
              Category Wise
            </button>
            <button
              className={
                activeTab === "Tab4" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab4")}
            >
              Page Added Details
            </button>

            <button
              className={
                activeTab === "Tab1" ? "active btn btn-primary" : "btn"
              }
              onClick={() => setActiveTab("Tab1")}
            >
              Page Health
            </button>
          </div>

          <div className="content">
            {activeTab === "Tab0" && (
              <>
                <PageOverviewWithoutHealth
                  columns={pageColumns}
                  latestPageObject={latestPageObject}
                  pagequery={pagequery}
                  setPagequery={setPagequery}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  activenessFilter={activenessFilter}
                  setActivenessFilter={setActivenessFilter}
                  filterFollowers={filterFollowers}
                  setFilterFollowers={setFilterFollowers}
                  setPlanFormName={setPlanFormName}
                />
              </>
            )}
            {activeTab === "Tab1" && (
              <div className="">
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
                          version={1}
                          columns={[...dataSecondGridColumns]}
                          data={newFilterData}
                          isLoading={false}
                          title={"Page Health"}
                          rowSelectable={true}
                          pagination={[100, 200, 1000]}
                          tableName={"Page Health"}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <TagCategoryListModal />
                <VendorNotAssignedModal />
                <PageDetail />
              </div>
            )}
            {activeTab === "Tab3" && (
              <CategoryWisePageOverviewNew dataTable={pageColumns} />
            )}
            {activeTab === "Tab4" && <PageClosedByDetails />}
            {activeTab === "Tab5" && (
              <StatsOfOverview dataGridcolumns={pageColumns} />
            )}
          </div>
        </>
      ) : (
        <PageEdit pageMast_id={editID} handleEditClose={handleEditClose} />
      )}
    </>
  );
};

export default PageOverviewNew;
