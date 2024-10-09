import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import Select from "react-select";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Avatar,
  ButtonBase,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addRow } from "../../Store/Executon-Slice";
import View from "../Sales/Account/View/View";
import * as XLSX from "xlsx";

import DateFormattingComponent from "../../DateFormator/DateFormared";
import {
  openTagCategoriesModal,
  setPlatform,
  setShowPageHealthColumn,
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
  useGetOwnershipTypeQuery,
  useGetPageStateQuery,
  useGetpagePriceTypeQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllProfileListQuery,
} from "../../Store/PageBaseURL";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setStatsUpdate } from "../../Store/PageMaster";
import PageDetail from "./PageOverview/PageDetail";
import { setPageRow, setShowPageInfoModal } from "../../Store/Page-slice";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { useGlobalContext } from "../../../Context/Context";
import PageClosedByDetails from "./Page/PageClosedByDetails";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VendorDetails from "./Vendor/VendorDetails";

let count = 0;
const PageOverview = () => {
  const { toastAlert } = useGlobalContext();
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  const {
    data: pageStates,

    isLoading: isPagestatLoading,
  } = useGetPageStateQuery();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [pageLevels, setPageLevels] = useState([]);
  const [pageStatus, setPageStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabFilterData, setTabFilterData] = useState([]);
  const [topVendorData, setTopVendorData] = useState([]);
  const [data, setData] = useState({
    lessThan1Lac: [],
    between1And10Lac: [],
    between10And20Lac: [],
    between20And30Lac: [],
    moreThan30Lac: [],
  });
  const [tableFollowers, setTableFollowers] = useState(0);
  const [tablePosts, setTablePosts] = useState(0);
  const [tableStories, setTableStories] = useState(0);
  const [tableBoths, setTableBoths] = useState(0);
  const [filterData, setFilterData] = useState([]);
  // const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [contextData, setContextData] = useState(false);
  const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [newFilterData, setNewFilterData] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [waData, setWaData] = useState([]);
  const { data: linkType } = useGetVendorWhatsappLinkTypeQuery();
  const token = sessionStorage.getItem("token");
  const [activeIndex, setActiveIndex] = useState(null);
  const [individualData, setIndividualData] = useState([]);
  const [individualDataDup, setIndividualDataDup] = useState([]);
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [allVendorWhats, setAllVendorWhats] = useState([]);

  const [selectedPriceType, setSelectedPriceType] = useState(""); // Holds the selected price type
  const [inputPrice, setInputPrice] = useState(""); // Holds the input price
  const [zeroLinksCount, setZeroLinksCount] = useState(0);
  const [oneLinkCount, setOneLinkCount] = useState(0);
  const [twoLinksCount, setTwoLinksCount] = useState(0);
  const [threeLinksCount, setThreeLinksCount] = useState(0);
  const [WhastappDataForLink, setWhastappDataForLink] = useState("");

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
    const filteredData = filterData.filter((row) => {
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

  const handleExport = () => {
    const formattedData = newFilterData?.map((row, index) => {
      const platformName = platformData?.find(
        (item) => item?._id === row.platform_id
      )?.platform_name;

      const categoryName = cat?.find(
        (item) => item?._id === row.page_category_id
      )?.page_category;

      const vendorName = vendorData?.find(
        (item) => item?.vendor_id === row.temp_vendor_id
      )?.vendor_name;

      const closeByName = user?.find(
        (item) => item?.user_id === row.page_closed_by
      )?.user_name;

      const pageStatusDescription =
        row.page_mast_status == 0
          ? "Active"
          : row.page_mast_status == 1
          ? "Inactive"
          : row.page_mast_status == 2
          ? "Delete"
          : row.page_mast_status == 3
          ? "Semiactive"
          : "Unknown";

      return {
        "S.No": index + 1,
        "User Name": row.page_name,
        Level: row.preference_level,
        Status: pageStatusDescription,
        Ownership: row.ownership_type,
        Platform: platformName || "N/A",
        Category: categoryName || "N/A",
        Followers: formatNumber(row.followers_count),
        Vendor: vendorName || "N/A",
        "Active Platform": row.platform_active_on,

        "Closed By": closeByName,
        "Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
        "Rate Type": row.rate_type,
        "Variable Type": row.variable_type,
        "Story Price": row.m_story_price,
        "Post Price": row.m_post_price,
        "Both Price": row.m_both_price,

        Age_13_17_percent: row.Age_13_17_percent,
        Age_18_24_percent: row.Age_18_24_percent,
        Age_25_34_percent: row.Age_25_34_percent,
        Age_35_44_percent: row.Age_35_44_percent,
        Age_45_54_percent: row.Age_45_54_percent,
        Age_55_64_percent: row.Age_55_64_percent,
        Age_65_plus_percent: row.Age_65_plus_percent,
        Age_upload_url: row.Age_upload_url,
        both_: row.both_,
        city1_name: row.city1_name,
        city2_name: row.city2_name,
        city3_name: row.city3_name,
        city4_name: row.city4_name,
        city5_name: row.city5_name,
        city_image_url: row.city_image_url,
        country1_name: row.country1_name,
        country2_name: row.country2_name,
        country3_name: row.country3_name,
        country4_name: row.country4_name,
        country5_name: row.country5_name,
        country_image_url: row.country_image_url,
        created_at: row.created_at,
        engagement: row.engagement,
        engagement_image_url: row.engagement_image_url,
        female_percent: row.female_percent,
        follower_count_before_update: row.follower_count_before_update,
        followers_count: row.followers_count,
        impression: row.impression,
        impression_image_url: row.impression_image_url,
        male_percent: row.male_percent,
        page_link: row.page_link,
        // 'page_status': row.page_status,
        percentage_city1_name: row.percentage_city1_name,
        percentage_city2_name: row.percentage_city2_name,
        percentage_city3_name: row.percentage_city3_name,
        percentage_city4_name: row.percentage_city4_name,
        percentage_city5_name: row.percentage_city5_name,
        percentage_country1_name: row.percentage_country1_name,
        percentage_country2_name: row.percentage_country2_name,
        percentage_country3_name: row.percentage_country3_name,
        percentage_country4_name: row.percentage_country4_name,
        percentage_country5_name: row.percentage_country5_name,
        profile_visit: row.profile_visit,
        reach: row.reach,
        reach_image_url: row.reach_image_url,
        story_view: row.story_view,
        story_view_image_url: row.story_view_image_url,
      };
    });

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const { data: allPriceTypeList } = useGetpagePriceTypeQuery();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const { data: profileData } = useGetAllProfileListQuery();
  const [vendorDetails, setVendorDetails] = useState(null);

  const handleVendorClick = async (_id) => {
    const res = await axios.get(baseUrl + `v1/vendor/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setVendorDetails(res?.data?.data);
  };
  // const handleEditCellChange = (params) => {
  //   (async () => {
  //     const updatedRow = {
  //       ...params.row,
  //       [params.field]: params.value,
  //     };

  //     return axios
  //       .put(baseUrl + `updatePage/${params.row._id}`, updatedRow)
  //       .then((res) => {});
  //   })();

  //   // Make API call to update the row data
  //   // Example: fetch('/api/updateRow', { method: 'POST', body: JSON.stringify(updatedRow) })

  //   // Update the local state with the updated row
  //   // setUpdatedRows((prevRows) => {
  //   //   const updatedRows = [...prevRows];
  //   //   const rowIndex = updatedRows.findIndex((row) => row.id === params.row.id);
  //   //   updatedRows[rowIndex] = updatedRow;
  //   //   return updatedRows;
  //   // });
  // };

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const { data: cities } = useGetAllCitiesQuery();
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

      // setFilterData(data)
      setNewFilterData(data);

      const result = [];
      for (let i = 0; i < data?.length; i++) {
        const createdBy = data[i]?.created_by;
        const pageName = data[i]?.page_name;
        const created_at = data[i]?.created_at;

        const existingUser = result.find(
          (item) => item?.created_by === createdBy
        );

        if (existingUser) {
          existingUser.page_names.push(pageName);
        } else {
          result.push({
            created_by: createdBy,
            page_names: [pageName],
            created_at: created_at,
          });
        }
      }
      setIndividualData(result);
      setIndividualDataDup(result);
      // console.log('aaaaaaa',result)
    }
    if (showPageHealthColumn == false) {
      setFilterData(pageList.data);
    }
  }

  function getStartOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1))
    );
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  function getStartOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  function getStartOfQuarter() {
    const now = new Date();
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    return new Date(now.getFullYear(), quarterStartMonth, 1);
  }

  function getStartOfYear() {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1);
  }

  function isWithinRange(date, startDate) {
    const createdDate = new Date(date);
    return createdDate >= startDate;
  }

  function applyFilter(filterType) {
    let startDate;

    switch (filterType) {
      case "week":
        startDate = getStartOfWeek();
        break;
      case "month":
        startDate = getStartOfMonth();
        break;
      case "quarter":
        startDate = getStartOfQuarter();
        break;
      case "year":
        startDate = getStartOfYear();
        break;
      default:
        return;
    }

    const filteredData = individualDataDup.filter((item) => {
      if (!item.created_at) {
        return false;
      }

      const dateParts = item.created_at.split(" ")[0].split("-");
      if (dateParts.length !== 3) {
        return false;
      }

      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const createdDate = new Date(formattedDate);

      return isWithinRange(createdDate, startDate);
    });
    setIndividualData(filteredData);
  }

  // to match created_by id from user_id to display user name in accordion
  const getUserName = (createdBy) => {
    const result = user.find((item) => item.user_id == createdBy);
    return result ? result.user_name : "Unknown User";
  };
  count++;
  console.log("count",count)
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
  }, []);

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

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const handleClick = (platform) => {
    const res = vendorTypes.filter((d) => d.platform_id == platform);
    setFilterData(res);
    setTabFilterData(res);
    calculateAndSetTotals(res);
  };
  const {
    data: pageCate,
    refetch: refetchPageCate,
    isLoading: isPageCateLoading,
  } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCat = subCategory?.data || [];
  // console.log(subCat, ' oct-9 saimyual');

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;
  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
      setProgress(70);
    });

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

  const calculateAndSetTotals = (result) => {
    let totalFollowers = 0;
    let totalPosts = 0;
    let totalStories = 0;
    let totalBoths = 0;
    if (!result) {
      return;
    }
    for (let i = 0; i < result?.length; i++) {
      totalFollowers += Number(result[i].followers_count);
      totalPosts += Number(result[i].post);
      totalStories += Number(result[i].story);
      totalBoths += Number(result[i].both_);
    }

    setTableFollowers(totalFollowers);
    setTablePosts(totalPosts);
    setTableStories(totalStories);
    setTableBoths(totalBoths);
  };

  useEffect(() => {
    // if (pageList) {
    // setVendorTypes(pageList.data);
    // setFilterData(pageList.data);
    // calculateAndSetTotals(pageList.data)
    // setTabFilterData(pageList.data)
    if (pageList) {
      if (decodedToken.role_id !== 1) {
        setVendorTypes(
          pageList.data.filter((item) => item.created_by == decodedToken.id)
        );
        setFilterData(
          pageList.data.filter((item) => item.created_by == decodedToken.id)
        );
        calculateAndSetTotals(
          pageList.data.filter((item) => item.created_by == decodedToken.id)
        );
        setTabFilterData(
          pageList.data.filter((item) => item.created_by == decodedToken.id)
        );
      } else {
        setVendorTypes(pageList.data);
        setFilterData(pageList.data);
        calculateAndSetTotals(pageList.data);
        setTabFilterData(pageList.data);
      }
    }
  }, [pageList]);

  useEffect(() => {}, [tableFollowers, tablePosts, tableStories, tableBoths]);

  const { data: priceData, isLoading: isPriceLoading } =
    useGetMultiplePagePriceQuery(selectedRow, { skip: !selectedRow });

  const [localPriceData, setLocalPriceData] = useState(null); // Local state to manage price data
  // Effect to clear the local data and handle loading when selectedRow changes
  // useEffect(() => {
  //   if (selectedRow) {
  //     setLocalPriceData(null);  // Clear old data
  //   }
  // }, [selectedRow]);

  // Update localPriceData when new data is fetched
  useEffect(() => {
    if (priceData) {
      setLocalPriceData(priceData);
    }
  }, [priceData]);

  const handlePriceClick = (row) => {
    return function () {
      setSelectedRow(row._id);
      // setPriceData(row.purchase_price);
      setShowPriceModal(true);
    };
  };

  const handleClose = () => {
    setShowPriceModal(false);
    setSelectedRow(null);
    setLocalPriceData(null);
  };

  const whatsAppData = async (data) => {
    setLoading(true);
    const result = await axios
      .get(`${baseUrl}v1/vendor_group_link_vendor_id/${data.vendor_id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setWaData(res.data.data);
        setLoading(false);
      });
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
      editable: false,
      renderRowCell: (row) => {
        // return (
        //   <img
        //     src="https://cdn-icons-png.flaticon.com/512/3536/3536445.png"
        //     style={{ width: '30%', height: '50%', cursor: 'pointer' }}
        //     data-toggle="modal"
        //     data-target="#waModal"
        //     onClick={() => whatsAppData(row)}
        //   />
        // );
        let name = allVendorWhats?.filter(
          (item) => item.vendor_id == row?.vendor_id
        );
        let countName = name?.length;
        return (
          <div
            data-toggle="modal"
            data-target="#waModal"
            onClick={() => whatsAppData(row)}
            style={{ cursor: "pointer" }}
          >
            {countName}
          </div>
        );
      },
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
          <Avatar
            src={name}
            alt={row.page_name}
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    {
      key: "preference_level",
      name: "Level",
      width: 200,
      editable: true,
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <select
            className="form-select"
            value={row.preference_level}
            onChange={(e) => {
              handelchange(e, index, column);
              handleLevelChange(e, setEditFlag, row);
            }}
          >
            <option value="Level 1 (High)">Level 1 (High)</option>
            <option value="Level 2 (Medium)">Level 2 (Medium)</option>
            <option value="Level 3 (Low)">Level 3 (Low)</option>
          </select>
        );
      },
    },
    {
      key: "page_mast_status",
      name: "Status",
      width: 200,
      editable: true,
      renderRowCell: (row) => {
        let status;
        if (row.page_mast_status == 0) {
          status = "Active";
        } else if (row.page_mast_status == 1) {
          status = "Inactive";
        } else if (row.page_mast_status == 2) {
          status = "Delete";
        } else if (row.page_mast_status == 3) {
          status = "Semiactive";
        }
        return <div>{status}</div>;
      },
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <select
            className="form-select"
            value={row.page_mast_status}
            onChange={(e) => {
              handelchange(e, index, column);
              handleStatusChange(e, setEditFlag, row);
            }}
            autoFocus
          >
            <option value="0">Active</option>
            <option value="1">Inactive</option>
            <option value="2">Disabled</option>
            <option value="3">Semiactive</option>
          </select>
        );
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
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 200,
    //   valueGetter: (params) => (params.row.status == 1 ? "Active" : "Inactive"),
    // },
    {
      key: "ownership_type",
      name: "Ownership",
      width: 200,
      // valueGetter: (params) => {
      //   if (!ownerShipData) {
      //     return <div>Unknown</div>;
      //   }

      //   const ownership = ownerShipData?.find(
      //     (item) => item._id === params.row.ownership_type
      //   )?.company_type_name;
      //   const finalName = ownership ? ownership : "NA";

      //   return finalName;
      // },
    },
    {
      key: "platform_id",
      name: "Platform",
      renderRowCell: (row) => {
        let name = platformData?.find(
          (item) => item?._id == row.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      width: 200,
    },
    {
      key: "page_catg_id",
      name: "Category",
      width: 200,
      renderRowCell: (row) => {
        // let name = cat?.find((item) => item?.page_category_id == row.row?.temp_page_cat_id)?.page_category;
        let name = cat?.find(
          (item) => item?._id == row?.page_category_id
        )?.page_category;
        return name;
      },
      editable: true,
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <select
            className="form-select"
            value={row.page_category_id}
            onChange={(e) => {
              handelchange(e, index, column);
              handleCategoryChange(e, setEditFlag, row);
            }}
            autoFocus
          >
            {cat.map((status, idx) => (
              <option key={idx} value={status._id}>
                {" "}
                {status.page_category}{" "}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      key: "page_sub_category_id",
      name: "Sub Category",
      width: 200,
      renderRowCell: (row) => {
        let name = subCat?.find(
          (item) => item?._id == row?.page_sub_category_id
        )?.page_sub_category;
        return name;
      },
      editable: true,
    },
    {
      key: "followers_count",
      name: "Followers",
      width: 200,
      renderRowCell: (row) => {
        return <div>{formatNumber(row.followers_count)}</div>;
      },
    },
    // {
    //   key: 'vendor_id',
    //   name: 'Vendor',
    //   renderRowCell: (row) => {
    //     let name = vendorData?.find(
    //       (item) => item?._id == row?.vendor_id
    //     )?.vendor_name;

    //     return <div>{formatString(name)}</div>;
    //   },
    //   width: 200,
    // },
    // {
    //   key: "vendor_id",
    //   name: "Vendor",
    //   renderRowCell: (row) => {
    //     let name = vendorData?.find(
    //       (item) => item?._id == row?.vendor_id
    //     )?.vendor_name;
    //     return formatString(name);
    //   },
    //   width: 200,
    //   compare: true,
    // },

    {
      key: "vendor_id",
      name: "Vendor",
      renderRowCell: (row) => {
        let vendor = vendorData?.find((item) => item?._id == row?.vendor_id);
        let name = vendor ? vendor.vendor_name : "Unknown Vendor";
        return (
          <button
            onClick={() => handleVendorClick(vendor?._id)}
            style={{ width: "100%", cursor: "pointer" }}
            className="btn cmnbtn btn_sm btn-outline-primary"
          >
            {formatString(name)}
          </button>
        );
      },
      width: 200,
      compare: true,
    },
    {
      key: "platform_active_on",
      name: "Active Platform",
      width: 200,
      renderRowCell: (row) => {
        let data = platformData?.filter((item) => {
          return row.platform_active_on?.includes(item._id);
        });
        return data?.map((item) => item.platform_name).join(", ");
      },
    },
    {
      key: "tags_page_category",
      name: "Tag Category",
      width: 200,
      renderRowCell: (row) => {
        let data = cat
          ?.filter((item) => {
            return row?.tags_page_category?.includes(item._id);
          })
          .map((item) => item.page_category);
        return (
          <div
            style={{
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.map((item, i) => {
              return (
                <p
                  key={i}
                  onClick={handleTagCategory(data)}
                  style={{ display: "inline", cursor: "pointer" }}
                >
                  {item}
                  {i !== data?.length - 1 && ","}
                </p>
              );
            })}
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
    // { key: 'variable_type', name: 'Variable Type', width: 200 },
    // {
    //   key: 'm_story_price',
    //   name: 'Story Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     let mStoryPrice = row.m_story_price;
    //     let storyPrice = row.story;
    //     return storyPrice ?? mStoryPrice;
    //   },
    // },
    // {
    //   key: 'm_post_price',
    //   name: 'Post Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     let mPostPrice = row.m_post_price;
    //     let postPrice = row.post;
    //     return postPrice ?? mPostPrice;
    //   },
    // },
    // {
    //   key: 'm_both_price',
    //   name: 'Both Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     let mBothPrice = row.m_both_price;
    //     let bothPrice = row.both_;
    //     return bothPrice ?? mBothPrice;
    //   },
    // },
    {
      key: "Post Price",
      name: "Post Price",
      width: 200,
      renderRowCell: (row) => {
        let PostData = row?.price_details?.Insta_Post;
        return PostData ? PostData : 0;
      },
    },
    {
      key: "Story price",
      name: "Story Price",
      width: 200,
      renderRowCell: (row) => {
        let StoryData = row?.price_details?.Insta_Story;
        return StoryData ? StoryData : 0;
      },
    },
    {
      key: "Both Price",
      name: "Both Price",
      width: 200,
      renderRowCell: (row) => {
        let BothData = row?.price_details?.Both;
        return BothData ? BothData : 0;
      },
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
      key: "Action",
      name: "Action",
      width: 500,
      renderRowCell: (row) => (
        <div className="d-flex align-center ">
          {pageUpdateAuth && (
            <Link className="mt-2" to={`/admin/pms-page-edit/${row._id}`}>
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
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
    // {
    //   key: "update",
    //   name: "Update",
    //   width: 130,
    //   renderRowCell: (row) => {
    //     const totalPercentage = row.totalPercentage;
    //     return (
    //       <>
    //         <Link to={{ pathname: `/admin/pageStats/${row._id}` }}
    //         >
    //           <button
    //             type="button"
    //             className="btn cmnbtn btn_sm btn-outline-primary"
    //             onClick={handleSetState()}
    //           >
    //             Profile Stats
    //           </button>
    //         </Link>
    //       </>
    //     );
    //   },
    // },
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
    // {
    //   field: "totalPercentage",
    //   width: 150,
    //   headerName: "Stats Update %",
    //   renderCell: (params) => {
    //     return params.row.totalPercentage > 0
    //       ? Math.round(+params.row?.totalPercentage) + "%"
    //       : params.row.totalPercentageForExeHistory + "%";
    //   },
    // },
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
    // {
    //   field: "Age_upload",
    //   width: 150,
    //   headerName: "Age Upload",
    //   renderCell: (params) => {
    //     let url = params.row?.Age_upload;
    //     return url ? (
    //       <img src={url} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
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
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
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
      editable: true,
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
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
          </a>
        ) : (
          "NA"
        );
      },
    },
    // {
    //   field: "reach_image_url",
    //   width: 150,
    //   headerName: "Reach Image",
    //   renderCell: (params) => {
    //     let data = params.row?.reach_image_url;
    //     return data ? (
    //       <img src={data} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
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

  // convert follower count in millions
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else if (num >= 10000000000) {
      return (num / 1000).toFixed(1) + "B";
    } else {
      return num?.toString();
    }
  }

  const handleLevelChange = async (event, setEditFlag, row) => {
    const newValue = event.target.value;
    try {
      await axios.put(
        `${baseUrl}v1/pageMaster/${row._id}`,
        {
          // ...params.row,
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
          // ...params.row,
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
          // ...params.row,
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

  const pageDetailColumn = [];

  const priceColumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{priceData.indexOf(params.row) + 1}</div>,
      width: 130,
    },
    {
      field: "price_type",
      headerName: "Price Type",
      width: 200,
      renderCell: (params) => {
        let name = allPriceTypeList?.find(
          (item) => item._id == params.row.page_price_type_id
        )?.name;
        return <div>{name}</div>;
      },
    },

    {
      field: "price",
      headerName: "Price",
      width: 200,
    },
  ];

  const pageHealthColumn = [];

  // if (!pageStatsAuth || decodedToken?.role_id === 1) {
  //   dataGridcolumns.push(...pageDetailColumn);
  // }
  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));
  // !decodedToken?.role_id === 1&&  dispatch(setShowPageHealthColumn(pageStatsAuth));

  // if (showPageHealthColumn) {
  //   dataGridcolumns.push(...pageHealthColumn);
  // }

  useEffect(() => {
    const countPageLevels = (tabFilterData) => {
      const counts = {};
      tabFilterData?.forEach((item) => {
        const category = item.preference_level;
        counts[category] = (counts[category] || 0) + 1;
      });
      return counts;
    };

    const counts = countPageLevels(tabFilterData);
    setPageLevels(counts);
  }, [tabFilterData]);

  useEffect(() => {
    const countPageStatus = (tabFilterData) => {
      const counts = {};
      tabFilterData.forEach((item) => {
        const status = item.page_mast_status;
        counts[status] = (counts[status] || 0) + 1;
      });
      return counts;
    };

    const counts = countPageStatus(tabFilterData);
    setPageStatus(counts);
  }, [tabFilterData]);

  // Fetch data from API
  const fetchWhatsAppLinks = async () => {
    try {
      const response = await axios.get("/api/whatsAppLinks");
      setAllVendorWhats(response.data);
    } catch (error) {
      console.error("Error fetching WhatsApp links", error);
    }
  };

  useEffect(() => {
    fetchWhatsAppLinks();
  }, []);

  const renderWhatsAppLinkCards = () => {
    const recordCount = { 0: 0, 1: 0, 2: 0, 3: 0 };

    newFilterData?.forEach((row) => {
      const matchedVendors = allVendorWhats?.filter(
        (item) => item.vendor_id === row?.vendor_id
      );
      const count = matchedVendors?.length || 0;

      if (count > 3) {
        recordCount[3]++;
      } else {
        recordCount[count]++;
      }
    });
    setZeroLinksCount(recordCount[0]);
    setOneLinkCount(recordCount[1]);
    setTwoLinksCount(recordCount[2]);
    setThreeLinksCount(recordCount[3]);
    // setFilterData(filtered);
  };

  // const renderWhatsAppLinkCards = () => {
  //   const recordCount = { 0: 0, 1: 0, 2: 0, 3: 0 };
  //   const recordsByCount = { 0: [], 1: [], 2: [], 3: [] };

  //   newFilterData?.forEach((row) => {
  //     const matchedVendors = allVendorWhats?.filter(
  //       (item) => item.vendor_id === row?.vendor_id
  //     );
  //     const count = matchedVendors?.length || 0;

  //     if (count > 3) {
  //       recordCount[3]++;
  //       recordsByCount[3].push(row);
  //     } else {
  //       recordCount[count]++;
  //       recordsByCount[count].push(row);
  //     }
  //   });

  //   setZeroLinksCount(recordCount[0]);
  //   setOneLinkCount(recordCount[1]);
  //   setTwoLinksCount(recordCount[2]);
  //   setThreeLinksCount(recordCount[3]);
  //   setWhastappDataForLink(recordsByCount);
  // };

  useEffect(() => {
    if (allVendorWhats?.length > 0 && newFilterData?.length > 0) {
      renderWhatsAppLinkCards();
    }
  }, [allVendorWhats, newFilterData]);

  const handleFilterByWhatsAppCount = (count) => {
    // const filtered = filterData[count] || [];
    // setNewFilterData(filtered);
    setActiveTab("Tab1");
  };

  console.log(newFilterData, "newFilterDatanewFilterDatanewFilterData------");

  // const whatsAppApiData = () => {
  //   setActiveTab("Tab1");
  // };
  const pageWithLevels = (level) => {
    const pagewithlevels = tabFilterData.filter(
      (item) => item.preference_level == level
    );
    setFilterData(pagewithlevels);
    setActiveTab("Tab1");
  };
  const pageWithStatus = (status) => {
    const pagewithstatus = tabFilterData.filter(
      (item) => item.page_mast_status == status
    );
    setFilterData(pagewithstatus);
    setActiveTab("Tab1");
  };
  const pageClosedBy = (close_by) => {
    const pageclosedby = tabFilterData.filter(
      (item) => item.page_closed_by == close_by
    );
    setFilterData(pageclosedby);
    setActiveTab("Tab1");
  };

  useEffect(() => {
    let newData = {
      lessThan1Lac: [],
      between1And10Lac: [],
      between10And20Lac: [],
      between20And30Lac: [],
      moreThan30Lac: [],
    };

    for (let i = 0; i < tabFilterData.length; i++) {
      const item = tabFilterData[i];
      const followersCount = item.followers_count;

      if (followersCount < 100000) {
        newData.lessThan1Lac.push(item);
      } else if (followersCount >= 100000 && followersCount < 1000000) {
        newData.between1And10Lac.push(item);
      } else if (followersCount >= 1000000 && followersCount < 2000000) {
        newData.between10And20Lac.push(item);
      } else if (followersCount >= 2000000 && followersCount < 3000000) {
        newData.between20And30Lac.push(item);
      } else if (followersCount >= 3000000) {
        newData.moreThan30Lac.push(item);
      }
    }
    setData(newData);
  }, [tabFilterData]);

  const showData = (dataArray) => {
    setActiveTab("Tab1");
    setFilterData(dataArray);
  };

  const closedByCounts = tabFilterData?.reduce((acc, item) => {
    acc[item.page_closed_by] = (acc[item.page_closed_by] || 0) + 1;
    return acc;
  }, {});

  const userCounts = Object.keys(closedByCounts)?.map((key) => {
    const userId = parseInt(key);
    const userName =
      user?.find((u) => u?.user_id === parseInt(key))?.user_name || "NA";
    return { userId, userName, count: closedByCounts[key] };
  });

  useEffect(() => {
    const result = axios
      .get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=toppurchasevendor`
      )
      .then((res) => {
        setTopVendorData(res.data.body);
      });
  }, []);

  const categoryGridcolumns = [
    {
      field: "S.NO",
      headerName: "S.no",
      renderCell: (params) => <div>{categoryData.indexOf(params.row) + 1}</div>,
      width: 80,
    },
    {
      headerName: "Category",
      width: 200,
      editable: false,
      renderCell: (params) => {
        let data = params.row?.category_name;
        return data ? data : "NA";
      },
    },
    {
      field: "Vendor Count",
      headerName: "Vendor Count",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.vendor_count;
        return data ? data : "NA";
      },
    },
    {
      field: "Count",
      headerName: "Count",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.category_used;
        return data ? (
          <div>
            <button className="btn w_80">{data}</button>
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                setFilterData(
                  pageList.data.filter(
                    (item) => item.page_category_id === params.row.id
                  )
                );
                setActiveTab("Tab1");
              }}
              style={{ marginLeft: "0px" }}
            >
              Show
            </button>
          </div>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "Total Followers",
      headerName: "Total Followers",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_followers;
        return data ? formatNumber(data) : "0";
      },
    },
    {
      field: "Story",
      headerName: "Story",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_stories;
        return data ? `₹. ${data}` : "0";
      },
    },
    {
      field: "Ave. Story",
      headerName: " Ave. Story",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_stories / params.row.category_used;
        return data ? `₹ ${data.toFixed(2)}` : "₹ 0.00";
      },
    },
    {
      field: "Post",
      headerName: "Post",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_posts;
        return data ? `₹. ${data}` : "0";
      },
    },
    {
      field: "Ave. Post",
      headerName: " Ave. Post",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_posts / params.row.category_used;
        return data ? `₹ ${data.toFixed(2)}` : "₹ 0.00";
      },
    },
  ];

  useEffect(() => {
    if (pageList) {
      const pageCategoryCount = {};
      const categoryVendorMap = {};
      const categoryFollowerMap = {};
      const postMap = {};
      const storyMap = {};

      for (let i = 0; i < pageList.data?.length; i++) {
        const categoryId = pageList.data[i]?.page_category_id;
        const vendorId = pageList.data[i]?.vendor_id;
        const followers = pageList.data[i]?.followers_count || 0;
        const storys = pageList.data[i]?.story || 0;
        const posts = pageList.data[i]?.post || 0;

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

  return (
    <>
      <div className="tabs">
        {vendorDetails && (
          <VendorDetails
            vendorDetails={vendorDetails}
            setVendorDetails={setVendorDetails}
          />
        )}
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Overview
        </button>
        <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          Statistics
        </button>
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
      </div>

      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    {/* <th>Page Name</th> */}
                    <th>Profile Count</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topVendorData &&
                    topVendorData.map((item) => (
                      <tr key={item.vendor_id}>
                        <td>
                          <a href={item.vendor_id} target="blank">
                            {item.vendor_name}
                          </a>
                        </td>
                        {/* <td>{item.page_name}</td> */}
                        <td>{item.page_id_count}</td>
                        <td>{item.total_credit}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="waModal" className="modal fade" role="dialog">
        <div className="modal-dialog" style={{ maxWidth: "40%" }}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Type</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80vh",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : waData.length > 0 ? (
                    waData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {
                            linkType?.data.find(
                              (type) => type?._id == item.type
                            )?.link_type
                          }
                        </td>
                        <td>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.link}
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {activeTab === "Tab1" && (
          <div className="">
            <div className="card">
              <div className="card-header flexCenterBetween">
                <h5 className="card-title flexCenterBetween">
                  {
                    pageStatsAuth && ""
                    // <Switch
                    //   checked={showPageHealthColumn}
                    //   value={showPageHealthColumn}
                    //   onChange={() =>
                    //     dispatch(setShowPageHealthColumn(!showPageHealthColumn))
                    //   }
                    //   name="Profile Health"
                    //   color="primary"
                    // />
                  }
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
                  {decodedToken.role_id == 1 && (
                    <Link
                      to={`/admin/pms-page-cat-assignment-overview`}
                      className="btn cmnbtn btn_sm btn-outline-primary"
                    >
                      Assign User <KeyboardArrowRightIcon />
                    </Link>
                  )}
                </div>
              </div>
              <div className="card-body pb4">
                <div className="d-flex">
                  {platformData?.map((platform) => {
                    const count = vendorTypes.filter(
                      (d) => d.platform_id === platform._id
                    )?.length;
                    return (
                      <button
                        key={platform._id}
                        onClick={() => handleClick(platform._id)}
                        style={{ margin: "0 5px 15px 0" }}
                        className="btn cmnbtn btn_sm btn-outline-primary"
                      >
                        {`${platform.platform_name} (${count})`}
                      </button>
                    );
                  })}
                </div>

                <div className="row thm_form">
                  <div className="col-md-4 mb16">
                    <Autocomplete
                      id="subcat-autocomplete"
                      options={subCat}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d.page_sub_category_id == option._id
                        )?.length;
                        return `${option.page_sub_category} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Sub Category"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          // Reset the data when the clear button is clicked
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_sub_category_id == newValue._id
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  {/* <div className="col-md-4 mb16">
                    <label className="form-label">
                      Sub Category <sup style={{ color: 'red' }}>*</sup>
                    </label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={subCat.map((option) => ({
                          value: option._id,
                          label: option.page_sub_category,
                          // label: option.category_name,
                        }))}
                        required={true}
                        value={{
                          value: subCategoryId,
                          label:
                            subCategoryData.find((role) => role._id === subCategoryId)
                              ?.page_sub_category || '',
                        }}
                        onChange={(e) => {
                          setSubCategoryId(e.value);
                          if (e.value) {
                            setValidateFields((prev) => ({
                              ...prev,
                              subCategoryId: false,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div> */}

                  <div className="col-md-4 mb16">
                    <Autocomplete
                      id="ownership-type-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => item?.ownership_type)
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d?.ownership_type === option
                        )?.length;
                        return `${option} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ownership"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d?.ownership_type === newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-4 mb16">
                    <Autocomplete
                      id="page-status-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => item?.page_mast_status)
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const count = vendorTypes?.filter(
                          (d) => d.page_mast_status === option
                        )?.length;
                        const name =
                          option === 0
                            ? "Active"
                            : option === 1
                            ? "Inactive"
                            : option === 2
                            ? "Delete"
                            : option === 3
                            ? "Semiactive"
                            : "Unknown";
                        return `${name} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Profile Status"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_mast_status === newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-4 mb16">
                    <Autocomplete
                      id="pagename-type-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => {
                            return item?.page_name_type;
                          })
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d.page_name_type == option
                        )?.length;
                        return `${option} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Profile Name Type"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_name_type == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="closedby-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => {
                            return item?.page_closed_by;
                          })
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const users = user?.find((e) => e.user_id == option);
                        const count = vendorTypes.filter(
                          (d) => d.page_closed_by == option
                        )?.length;
                        return `${users?.user_name} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Closed By"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_closed_by == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="category-autocomplete"
                      multiple
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => item?.page_category_id)
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const category = cat?.find((e) => e?._id === option);
                        const count = vendorTypes?.filter(
                          (d) => d?.page_category_id === option
                        ).length;
                        return `${
                          category?.page_category || "Unknown Category"
                        } (${count})`;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Category"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue.length === 0) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter((d) =>
                            newValue.includes(d.page_category_id)
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="profile-type"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => item?.page_profile_type_id)
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const category = profileData?.data?.find(
                          (e) => e?._id === option
                        );
                        const count = vendorTypes?.filter(
                          (d) => d?.page_profile_type_id === option
                        ).length;
                        return `${
                          category?.profile_type || "Unknown Profile"
                        } (${count})`;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Profile Type"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes);
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_profile_type_id == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <Autocomplete
                      id="Health of Pages"
                      options={[
                        { value: "Done", label: "Done" },
                        { value: "Not Done", label: "Not Done" },
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Completion"
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                        } else {
                          let result = [];
                          if (newValue.value === "Done") {
                            result = newFilterData.filter(
                              (d) =>
                                d.hasOwnProperty("reach") &&
                                d.hasOwnProperty("impression")
                            );
                          } else if (newValue.value === "Not Done") {
                            result = newFilterData.filter(
                              (d) =>
                                !d.hasOwnProperty("reach") &&
                                !d.hasOwnProperty("impression")
                            );
                          }
                          setFilterData(result);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16 export-excel">
                    <Button
                      className="btn  cmnbtn btn-primary"
                      size="medium"
                      onClick={handleExport}
                      variant="outlined"
                      color="secondary"
                    >
                      Export Excel
                    </Button>
                  </div>
                  {/* <div className="col-md-3 mb16"> </div> */}
                </div>
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
                    // <Box sx={{ height: 700, width: "100%" }}>
                    //   <DataGrid
                    //     title="Profile Overview"
                    //     rows={filterData}
                    //     columns={dataGridcolumns}
                    //     // onPaginationModelChange={handlePageChange}
                    //     pageSize={5}
                    //     rowsPerPageOptions={[5]}
                    //     // rowHeight={38}
                    //     disableSelectionOnClick
                    //     getRowId={(row) => row._id}
                    //     slots={{ toolbar: GridToolbar }}
                    //     slotProps={{
                    //       toolbar: {
                    //         showQuickFilter: true,
                    //       },
                    //     }}
                    //     checkboxSelection
                    //     disableRowSelectionOnClick
                    //   />
                    // </Box>
                    <View
                      columns={dataGridcolumns}
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
            <Dialog
              open={showPriceModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Price Details"}
              </DialogTitle>
              <DialogContent>
                {localPriceData == null ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <DialogContentText id="alert-dialog-description">
                    <DataGrid
                      rows={localPriceData}
                      columns={priceColumn}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      getRowId={(row) => row._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />
                  </DialogContentText>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <TagCategoryListModal />
            <VendorNotAssignedModal />
            <PageDetail />
          </div>
        )}
        {activeTab === "Tab2" && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile with Levels</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(pageLevels).map(([level, count]) => (
                    <div
                      key={level}
                      className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                    >
                      <div
                        className="card pointer"
                        key={level}
                        onClick={() => pageWithLevels(level)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <Brightness6Icon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{level}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile with Status</h5>
              </div>
              <div className="card-body ">
                <div className="row">
                  {Object.entries(pageStatus).map(([status, count]) => (
                    <div
                      className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                      key={Math.random()}
                    >
                      <div
                        className="card pointer"
                        key={status}
                        onClick={() => pageWithStatus(status)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <ToggleOffIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">
                              {status == 0
                                ? "Active"
                                : status == 1
                                ? "Inactive"
                                : status == 2
                                ? "Delete"
                                : status == 3
                                ? "Semiactive"
                                : "Unknown"}
                            </h6>
                            <h6 className="mt4 fs_16">{count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* WhatsAppp Links */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">WhatsApp Links</h5>
              </div>
              <div className="card-body">
                <div
                  className="row"
                  onClick={() => handleFilterByWhatsAppCount(0)}
                >
                  <div
                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                    key={Math?.random()}
                  >
                    <div className="card ">
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">
                            Records with 0 WhatsApp Link
                          </h6>
                          <h6 className="mt4 fs_16">{zeroLinksCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                    // key={Math?.random()}
                  >
                    <div className="card">
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">
                            Records with 1 WhatsApp Link
                          </h6>
                          <h6 className="mt4 fs_16">{oneLinkCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                    // key={Math?.random()}
                  >
                    <div className="card">
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">
                            Records with 2 WhatsApp Link
                          </h6>
                          <h6 className="mt4 fs_16">{twoLinksCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                    // key={Math?.random()}
                  >
                    <div className="card">
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">
                            Records with 3 WhatsApp Link
                          </h6>
                          <h6 className="mt4 fs_16">{threeLinksCount}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ))} */}
                </div>
              </div>
            </div>
            {/* =------------------= */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile with Followers Count</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card pointer"
                      onClick={() => showData(data.lessThan1Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">Less than 1 Lac</h6>
                          <h6 className="mt4 fs_16">
                            {data.lessThan1Lac.length}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card pointer"
                      onClick={() => showData(data.between1And10Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">1-10 Lacs</h6>
                          <h6 className="mt4 fs_16">
                            {data.between1And10Lac.length}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card pointer"
                      onClick={() => showData(data.between10And20Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">10-20 Lacs</h6>
                          <h6 className="mt4 fs_16">
                            {data.between10And20Lac.length}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card pointer"
                      onClick={() => showData(data.between20And30Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">20-30 Lacs</h6>
                          <h6 className="mt4 fs_16">
                            {data.between20And30Lac.length}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card pointer"
                      onClick={() => showData(data.moreThan30Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0">
                          <span>
                            <FormatListNumberedIcon />
                          </span>
                        </div>
                        <div>
                          <h6 className="colorMedium">More than 30 Lacs</h6>
                          <h6 className="mt4 fs_16">
                            {data.moreThan30Lac.length}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile closed by</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {userCounts.map((item) => (
                    <div
                      className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                      key={Math.random()}
                    >
                      <div
                        className="card pointer"
                        key={item.userName}
                        onClick={() => pageClosedBy(item.userId)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <AccountCircleIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{item.userName}</h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div
                  className="card"
                  data-toggle="modal"
                  data-target="#myModal"
                >
                  <div className="card-body pb20 flexCenter colGap14 pointer">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span></span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Top Vendors</h6>
                      <h6 className="mt4 fs_16">10</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Tab3" && (
          <div className="">
            <Box sx={{ height: 700, width: "100%" }}>
              <DataGrid
                title="Category Wise"
                rows={categoryData}
                columns={categoryGridcolumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        )}
        {activeTab === "Tab4" && <PageClosedByDetails />}
      </div>
    </>
  );
};

export default PageOverview;
