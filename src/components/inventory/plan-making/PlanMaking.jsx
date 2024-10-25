import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Button, IconButton, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setShowPageHealthColumn } from "../../Store/PageOverview";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetAllVendorTypeQuery,
} from "../../Store/reduxBaseURL";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
} from "../../Store/PageBaseURL";
import PlanStatics from "./PlanStatics";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import DataGridColumns from "./DataGridColumns";
import Filters from "./Filters";
import {
  useFetchPlanDetails,
  usePageDetail,
  useSendPlanDetails,
} from "./apiServices";
import CustomTable from "../../CustomTable/CustomTable";
import PageDialog from "./PageDialog";
import CustomAlert from "../../../utils/CustomAlert";
import LeftSideBar from "./LeftSideBar";
import PlanPricing from "./PlanPricing";
import RightDrawer from "../RightDrawer";
import { Sliders, X } from "@phosphor-icons/react";

const PlanMaking = () => {
  // const { id } = useParams();
  const [activeTabPlatfrom, setActiveTabPlatform] = useState(
    "666818824366007df1df1319"
  );

  const [filterData, setFilterData] = useState([]);
  const [toggleShowBtn, setToggleShowBtn] = useState();
  const [progress, setProgress] = useState(10);
  const [contextData, setContextData] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [pageCategoryCount, setPageCategoryCount] = useState({});
  const [showOwnPage, setShowOwnPage] = useState(false);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const dispatch = useDispatch();

  const pagequery = "";
  const { data: pageList, isLoading: isPageListLoading } =
    useGetAllPageListQuery({ decodedToken, userID, pagequery });

  const { data: vendorTypeData } = useGetAllVendorTypeQuery();
  const typeData = vendorTypeData?.data;

  const [selectedRows, setSelectedRows] = useState([]);
  const [postPerPageValues, setPostPerPageValues] = useState({});
  const [storyPerPageValues, setStoryPerPageValues] = useState({});
  const [costPerPostValues, setCostPerPostValues] = useState({});
  const [costPerStoryValues, setCostPerStoryValues] = useState({});
  const [costPerBothValues, setCostPerBothValues] = useState({});
  const [totalCostValues, setTotalCostValues] = useState({});
  const [totalPagesSelected, setTotalPagesSelected] = useState(0);
  const [showTotalCost, setShowTotalCost] = useState({});
  const [totalDeliverables, setTotalDeliverables] = useState(0);
  const [followerFilterType, setFollowerFilterType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isAutomaticCheck, setIsAutomaticCheck] = useState(false);
  const [storyCountDefault, setStoryCountDefault] = useState(0);
  const [postCountDefault, setPostCountDefault] = useState(0);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState(0);
  // const [planSuccess, setPlanSuccess] = useState();
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);
  const [alertData, setAlertData] = useState(null);
  const [priceFilterType, setPriceFilterType] = useState("post"); // Dropdown value
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minFollowers, setMinFollowers] = useState(null);
  const [maxFollowers, setMaxFollowers] = useState(null);
  const [notFoundPages, setNotFoundPages] = useState([]);
  const [toggleLeftNavbar, setToggleLeftNavbar] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  // const [pageDetail, setPageDetails] = useState([]);

  const { id } = useParams();

  const { pageDetail } = usePageDetail(id);
  const { sendPlanDetails } = useSendPlanDetails(id);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  const handleToggleLeftNavbar = () => {
    setToggleLeftNavbar(!toggleLeftNavbar);
  };
  const navigate = useNavigate();
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor;

  const getData = () => {
    // axios.get(baseUrl + 'get_all_users').then((res) => {
    axios.get(baseUrl + "get_all_users").then(() => {
      setProgress(70);
    });
  };
  const getPriceDetail = (priceDetails, key) => {
    const detail = priceDetails?.find((item) => item[key] !== undefined);
    return detail ? detail[key] : 0;
  };

  const handlePriceFilter = (data) => {
    let newFilteredData = data?.filter((page) => {
      let price = 0;

      const postPrice = getPriceDetail(page.page_price_list, "instagram_post");
      const storyPrice = getPriceDetail(
        page.page_price_list,
        "instagram_story"
      );
      const bothPrice = getPriceDetail(page.page_price_list, "instagram_both");

      // Determine the price based on the selected filter type
      switch (priceFilterType) {
        case "post":
          price = postPrice || 0;
          break;
        case "story":
          price = storyPrice || 0;
          break;
        case "both":
          price = bothPrice || 0;
          break;
        default:
          price = 0; // Default to 0 if no valid type selected
      }
      // Apply price filter
      return !priceFilterType || (price >= minPrice && price <= maxPrice);
    });
    return newFilteredData;
  };

  const handleCombinedFilter = () => {
    let newFilteredData = filterData?.filter((page) => {
      let price = 0;

      const postPrice = getPriceDetail(page.page_price_list, "instagram_post");
      const storyPrice = getPriceDetail(
        page.page_price_list,
        "instagram_story"
      );
      const bothPrice = getPriceDetail(page.page_price_list, "instagram_both");
      // Handle the price filter based on the selected type
      if (priceFilterType === "post") {
        price = postPrice || 0;
      } else if (priceFilterType === "story") {
        price = storyPrice || 0;
      } else if (priceFilterType === "both") {
        price = bothPrice || 0;
      }
      const followers = page?.followers_count;

      // Apply follower range filter if min and max are defined
      const isFollowerInRange =
        (minFollowers === null || followers >= minFollowers) &&
        (maxFollowers === null || followers <= maxFollowers);

      // Apply both price and follower filters
      return (
        (!priceFilterType || (price >= minPrice && price <= maxPrice)) &&
        isFollowerInRange
      );
    });
    setAlertData({
      title: "Success!",
      text: "Filter applied successfully.",
      icon: "success",
    });
    setFilterData(newFilteredData);
  };

  const handleRemoveFilter = () => {
    const pageData = pageList?.filter((item) => item.followers_count > 0);
    setFilterData(pageData);
    setSelectedFollowers([]);
    setSelectedCategory([]);
    setMinPrice(0);
    setMaxPrice(0);
  };

  // const { data: priceData, isLoading: isPriceLoading } =
  //   useGetMultiplePagePriceQuery();

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handlePostPerValue = (row, postPerPage, callback) => {
    setPostPerPageValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [row._id]: postPerPage,
      };
      if (callback) callback(newValues);
      return newValues;
    });
  };

  const handleCheckboxChange = (row) => (event) => {
    const isChecked = event.target.checked;

    // 1. Manage selected rows state
    const updatedSelectedRows = isChecked
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);

    setSelectedRows(updatedSelectedRows);

    // 2. Update showTotalCost to reflect the change
    setShowTotalCost((prevCost) => ({
      ...prevCost,
      [row._id]: isChecked,
    }));

    // 3. Handle postPerPage value change and cost calculation
    const postPerPage = isChecked ? 1 : 0;

    // 4. Safely handle async post value updates and calculations
    handlePostPerValue(row, postPerPage, (updatedPostValues) => {
      // Get safe values with fallback to prevent NaN
      const postCount = updatedPostValues[row._id] ?? 0;
      const storyCount = storyPerPageValues[row._id] ?? 0;
      const postCost = costPerPostValues[row._id] ?? 0;
      const storyCost = costPerStoryValues[row._id] ?? 0;
      const bothCost = costPerBothValues[row._id] ?? 0;

      // Perform total cost calculation with valid data
      calculateTotalCost(
        row._id,
        postCount,
        storyCount,
        postCost,
        storyCost,
        bothCost
      );

      // Update plan data with the latest selections
      const planxData = updatedSelectedRows.map(
        ({ _id, page_price_list, page_name }) => ({
          _id,
          page_name,
          post_price: getPriceDetail(page_price_list, "instagram_post"),
          story_price: getPriceDetail(page_price_list, "instagram_story"),
          post_count: Number(updatedPostValues[_id]) || 0,
          story_count: Number(storyPerPageValues[_id]) || 0,
        })
      );
      setPlanData(planxData);
      // Debounce plan details to avoid rapid state updates
      if (!isAutomaticCheck) {
        debouncedSendPlanDetails(planxData);
      }
    });

    // 5. Update page category count safely
    const categoryId = row.page_category_id;
    setPageCategoryCount((prevCount) => {
      const newCount = { ...prevCount };
      newCount[categoryId] = (newCount[categoryId] || 0) + (isChecked ? 1 : -1);
      if (newCount[categoryId] <= 0) {
        delete newCount[categoryId];
      }
      return newCount;
    });

    // 6. Trigger any other required state updates or statistics
    updateStatistics(updatedSelectedRows);
  };
  const handleStoryPerPageChange = (row) => (event) => {
    const updatedStoryValues = {
      ...storyPerPageValues,
      [row._id]: event.target.value,
    };
    setStoryPerPageValues(updatedStoryValues);
    calculateTotalCost(
      row._id,
      postPerPageValues[row._id],
      updatedStoryValues[row._id],
      costPerPostValues[row._id],
      costPerStoryValues[row._id],
      costPerBothValues[row._id]
    );

    // updateStatistics(selectedRows);
  };
  const debouncedSendPlanDetails = useCallback(
    debounce(sendPlanDetails, 5000),
    []
  );

  const handleToggleBtn = () => {
    setToggleShowBtn(!toggleShowBtn);
  };

  const handleOwnPage = () => {
    setShowOwnPage(!showOwnPage);
  };

  const handlePostPerPageChange = (row) => (event) => {
    const value = String(event.target.value);
    const updatedPostValues = {
      ...postPerPageValues,
      [row._id]: value,
    };

    setPostPerPageValues(updatedPostValues);
    calculateTotalCost(
      row._id,
      updatedPostValues[row._id],
      storyPerPageValues[row._id],
      costPerPostValues[row._id],
      costPerStoryValues[row._id],
      costPerBothValues[row._id]
    );

    updateStatistics(selectedRows);
  };

  const getTotalPostCount = () => {
    return Object.values(postPerPageValues).reduce(
      (acc, count) => acc + count,
      0
    );
  };

  const getTotalStoryCount = () => {
    return Object.values(storyPerPageValues).reduce(
      (acc, count) => acc + count,
      0
    );
  };

  const totalPostCount = getTotalPostCount();
  const totalStoryCount = getTotalStoryCount();
  const HandleSavePlan = async () => {
    const payload = {
      id: id,
      plan_status: "close",
      plan_saved: true,
      post_count: totalPostCount,
      story_count: totalStoryCount,
      no_of_pages: selectedRows?.length,
      cost_price: totalCost,
    };

    try {
      // Perform both the API call and sendPlanDetails in parallel
      const [fetchResponse] = await Promise.all([
        fetch(`${baseUrl}v1/planxlogs`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        sendPlanDetails(planData),
      ]);

      // Check if the fetch request was successful
      if (fetchResponse.ok) {
        Swal.fire({
          title: "Success!",
          text: "Plan has been saved successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/admin/pms-plan-making");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to save the plan. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error processing plan:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handler for dropdown change
  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions)?.map(
      (option) => option.value
    );

    // Accumulate the selected categories
    const updatedCategories = [
      ...new Set([...selectedCategory, ...selectedOptions]),
    ];
    setSelectedCategory(updatedCategories);

    // Start filtering from the original `pageList`
    let filtered = pageList.filter((item) => {
      const isInCategory = updatedCategories.includes(item.page_category_id);
      const hasFollowers = item.followers_count > 0;
      return isInCategory && hasFollowers;
    });

    // Incorporate follower range filtering
    const parseRange = (range) => {
      if (range === "lessThan10K") {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range
        .split("to")
        .map((val) => parseInt(val.replace("K", "")) * 1000);
      return { min, max };
    };

    // Filter based on selected follower ranges
    if (selectedFollowers.length) {
      let followerFiltered = [];
      selectedFollowers.forEach((range) => {
        const { min, max } = parseRange(range);
        const rangeFilteredData = filtered.filter((page) => {
          const followers = page?.followers_count;
          return followers >= min && followers <= max;
        });

        // Merge the results from different ranges
        followerFiltered = [...followerFiltered, ...rangeFilteredData];
      });
      filtered = followerFiltered;
    }

    // Apply the price filter on the already category and follower filtered data
    filtered = handlePriceFilter(filtered);

    // Update the filtered data in state
    setFilterData(filtered);
  };

  const removeCategory = (categoryId) => {
    // Remove the category from the selected categories
    const updatedCategories = selectedCategory.filter(
      (id) => id !== categoryId
    );
    setSelectedCategory(updatedCategories);

    // Filter data based on the updated categories
    let filtered = pageList.filter((item) => {
      const isInCategory =
        !updatedCategories.length ||
        updatedCategories.includes(item.page_category_id);
      const hasFollowers = item.followers_count > 0;
      return isInCategory && hasFollowers;
    });

    // Incorporate follower range filtering
    const parseRange = (range) => {
      if (range === "lessThan10K") {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range
        .split("to")
        .map((val) => parseInt(val.replace("K", "")) * 1000);
      return { min, max };
    };

    // Apply follower filtering if follower ranges are selected
    if (selectedFollowers.length) {
      let followerFiltered = [];
      selectedFollowers.forEach((range) => {
        const { min, max } = parseRange(range);
        const rangeFilteredData = filtered.filter((page) => {
          const followers = page?.followers_count;
          return followers >= min && followers <= max;
        });

        // Merge the results from different ranges
        followerFiltered = [...followerFiltered, ...rangeFilteredData];
      });
      filtered = followerFiltered;
    }

    // Apply the price filter on the category and follower-filtered data
    filtered = handlePriceFilter(filtered);

    // Handle fallback: If no results, apply only price filter on the full dataset
    if (!filtered.length) {
      filtered = handlePriceFilter(pageList);
    }

    // Update the filtered data in state
    setFilterData(filtered);
  };

  const ownPages = filterData?.filter((item) => item?.ownership_type === "Own");

  const updateStatistics = (rows) => {
    let followers = 0;
    let cost = 0;
    let posts = 0;
    let stories = 0;
    let totalDeliverables = 0;

    rows?.forEach((row) => {
      const postPerPage = Number(postPerPageValues[row._id]) || 0;
      const storyPerPage = Number(storyPerPageValues[row._id]) || 0;
      const rowFollowers = row.followers_count || 0;

      followers += row.followers_count || 0;
      cost += totalCostValues[row._id] || 0;
      posts += Number(postPerPageValues[row._id]) || 0;
      stories += Number(storyPerPageValues[row._id]) || 0;
      totalDeliverables += (postPerPage + storyPerPage) * rowFollowers;
      setTotalDeliverables(totalDeliverables);
    });

    setTotalFollowers(followers);
    setTotalCost(cost);
    setTotalPostsPerPage(posts);
    setTotalStoriesPerPage(stories);
    setTotalPagesSelected(rows?.length);
  };

  const calculateTotalCost = (
    id,
    postPerPage,
    storyPerPage,
    costPerPost,
    costPerStory,
    costPerBoth
  ) => {
    let totalCost;
    if (postPerPage === storyPerPage) {
      totalCost = postPerPage * costPerBoth;
    } else {
      totalCost = postPerPage * costPerPost + storyPerPage * costPerStory;
    }

    setTotalCostValues((prevValues) => ({
      ...prevValues,
      [id]: totalCost,
    }));
  };
  const { dataGridColumns } = DataGridColumns({
    vendorData,
    filterData,
    selectedRows,
    handleCheckboxChange,
    postPerPageValues,
    handlePostPerPageChange,
    storyPerPageValues,
    handleStoryPerPageChange,
    showTotalCost,
    totalCostValues,
    typeData,
    cat,
    platformData,
    pageStatsAuth,
    decodedToken,
  });

  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));

  const clearSearch = () => {
    setSearchInput("");
  };

  const handlePlatform = (id) => {
    setActiveTabPlatform(id);
    const platform = pageList?.filter((item) => item.platform_id === id);
    setFilterData(platform);
  };

  const handleAutomaticSelection = (incomingData) => {
    // setIsAutomaticCheck(true);
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };

    // Loop through incoming data to calculate costs
    incomingData.forEach((incomingPage) => {
      const matchingPage = filterData.find(
        (page) => page.page_name === incomingPage.page_name
      );

      if (matchingPage) {
        const isAlreadySelected = updatedSelectedRows.some(
          (selectedRow) => selectedRow._id === matchingPage._id
        );

        if (!isAlreadySelected) {
          updatedSelectedRows.push(matchingPage);
        }

        // Update post and story counts
        updatedPostValues[matchingPage._id] = incomingPage.post_count;
        updatedStoryValues[matchingPage._id] = incomingPage.story_count;

        // Calculate the cost
        const postPrice = getPriceDetail(
          matchingPage.page_price_list,
          "instagram_post"
        );
        const storyPrice = getPriceDetail(
          matchingPage.page_price_list,
          "instagram_story"
        );

        const costPerPost = postPrice;
        const costPerStory = storyPrice;
        const costPerBoth = costPerPost + costPerStory;

        calculateTotalCost(
          matchingPage._id,
          incomingPage.post_count,
          incomingPage.story_count,
          costPerPost,
          costPerStory,
          costPerBoth
        );

        // Mark this page's cost as 'true' in updatedShowTotalCost
        updatedShowTotalCost[matchingPage._id] = true;
        const planxData = updatedSelectedRows.map(
          ({ _id, page_price_list, page_name }) => ({
            _id,
            page_name,
            post_price: getPriceDetail(page_price_list, "instagram_post"),
            story_price: getPriceDetail(page_price_list, "instagram_story"),
            post_count: Number(updatedPostValues[_id]) || 0,
            story_count: Number(updatedStoryValues[_id]) || 0,
          })
        );
        setPlanData(planxData);
      }
    });

    // Update all states after processing
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setSelectedRows(updatedSelectedRows);
    setShowTotalCost(updatedShowTotalCost);

    // setIsAutomaticCheck(false);
  };
  const normalize = (str) => {
    // Replace leading/trailing underscores and non-printable characters
    return str
      .replace(/^\_+|\_+$/g, "")
      .replace(/[^\x20-\x7E]/g, "") // Remove non-printable characters
      .toLowerCase();
  };

  const filterAndSelectRows = (searchTerms) => {
    // If there are search terms
    if (searchTerms?.length > 0) {
      // Filter data based on search terms
      const filtered = pageList?.filter((item) =>
        searchTerms.some((term) =>
          normalize(item?.page_name || "").includes(normalize(term))
        )
      );

      // Store filtered data
      setFilterData(filtered);

      // Create a copy of the currently selected rows
      const updatedSelectedRows = [...selectedRows];
      const updatedPostValues = { ...postPerPageValues };

      // Loop through each filtered row
      filtered?.forEach((row) => {
        // Check if the row is already selected
        const isAlreadySelected = updatedSelectedRows.some(
          (selectedRow) => selectedRow._id === row._id
        );

        // If not already selected, select the row and update checkbox
        if (!isAlreadySelected) {
          // Manually invoke the necessary logic to simulate checkbox selection
          handleCheckboxChange(row)({ target: { checked: true } });
          updatedSelectedRows.push(row);
        }

        // Set the post per page value to 1 for this row
        updatedPostValues[row._id] = 1;
      });

      // Set post per page values for all rows at once
      setPostPerPageValues(updatedPostValues);
      setSelectedRows(updatedSelectedRows);

      // Update statistics based on the selected rows
      updateStatistics(updatedSelectedRows);

      // Identify pages not found
      const filteredPageNames = new Set(
        filtered.map((item) => normalize(item.page_name || ""))
      );

      const notFound = searchTerms.filter(
        (term) => !filteredPageNames.has(normalize(term))
      );

      // Show not found pages if any
      if (notFound.length > 0) {
        setNotFoundPages(notFound);
        handleOpenDialog(); // Open dialog to show not found pages
      } else {
        setNotFoundPages([]);
      }

      // Determine unselected rows (not checked)
      const selectedRowIds = new Set(updatedSelectedRows.map((row) => row._id));
      const notCheckedRows = pageList?.filter(
        (item) => !selectedRowIds.has(item._id)
      );

      // Update filterData with the unselected rows for display
      setFilterData(() => {
        return [
          ...filtered,
          ...notCheckedRows.filter(
            (item) =>
              !filtered.some((filteredItem) => filteredItem._id === item._id)
          ),
        ];
      });
    } else {
      // If no search terms, reset filterData and selectedRows
      setFilterData(pageList);
      setSelectedRows([]);
      setNotFoundPages([]);
    }
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // Split and process search terms
    const searchTerms = inputValue
      .split(" ")
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);
    filterAndSelectRows(searchTerms);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFollowersFilter = () => {
    const parseRange = (range) => {
      if (range === "lessThan10K") {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range.split("to").map((val) => {
        const value = parseInt(val.replace("K", "")) * 1000; // Convert 'K' to thousand
        return value;
      });
      return { min, max };
    };
    let filteredData = [];

    selectedFollowers.forEach((range) => {
      const { min, max } = parseRange(range);
      // Filter the pageList for the current range
      const rangeFilteredData = pageList?.filter((page) => {
        const followers = page?.followers_count;
        return followers >= min && followers <= max;
      });

      // Merge current range's filtered data with the overall result
      filteredData = [...filteredData, ...rangeFilteredData];
    });
    // filteredData?.filter((item) => )
    if (minPrice || maxPrice) {
      const filtered = handlePriceFilter(filteredData);
      setFilterData(filtered);
    } else {
      setFilterData(filteredData);
    }
  };

  const clearRecentlySelected = () => {
    setSelectedRows([]);
    setTotalCostValues({});
    setPostPerPageValues({});
    setStoryPerPageValues({});
    setPageCategoryCount({});

    setSearchInput("");
  };
  // Function to sort rows: checked rows come first
  const sortedRows = (rows, selectedRows) => {
    // Create a shallow copy of the rows to avoid modifying the original array
    if (rows) {
      const rowsCopy = [...rows];
      return rowsCopy?.sort((a, b) => {
        const aChecked = selectedRows.some(
          (selectedRow) => selectedRow._id === a._id
        );
        const bChecked = selectedRows.some(
          (selectedRow) => selectedRow._id === b._id
        );
        return aChecked === bChecked ? 0 : aChecked ? -1 : 1;
      });
    }
  };

  const selectAllRows = () => {
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };

    // Iterate over the filtered data and update counts and selections
    filterData.forEach((row) => {
      const isAlreadySelected = updatedSelectedRows.some(
        (selectedRow) => selectedRow._id === row._id
      );

      // If not already selected, add this row to selected rows
      if (!isAlreadySelected) {
        updatedSelectedRows.push(row);
      }

      // Use row values or default values if not present
      updatedPostValues[row._id] = postCountDefault || 1;
      updatedStoryValues[row._id] = storyCountDefault || 0;
      // updatedStoryValues[row._id] = row.story_count || storyCountDefault || 0;

      // Calculate costs (if applicable)
      const postPrice = getPriceDetail(row.page_price_list, "instagram_post");
      const storyPrice = getPriceDetail(row.page_price_list, "instagram_story");

      const costPerPost = postPrice || 0;
      const costPerStory = storyPrice || 0;

      // function exists to calculate total cost
      calculateTotalCost(
        row._id,
        updatedPostValues[row._id],
        updatedStoryValues[row._id],
        costPerPost,
        costPerStory,
        costPerPost + costPerStory
      );

      // Mark this row's cost visibility as 'true'
      updatedShowTotalCost[row._id] = true;

      // Optional: Auto-check this row if needed (commented out in your logic)
      // handleCheckboxChange(row)({ target: { checked: true } });
    });

    // Prepare the plan data to send
    const planxData = updatedSelectedRows.map(
      ({ _id, page_price_list, page_name }) => ({
        _id,
        page_name,
        post_price: getPriceDetail(page_price_list, "instagram_post"),
        story_price: getPriceDetail(page_price_list, "instagram_story"),
        post_count: Number(updatedPostValues[_id]) || 0,
        story_count: Number(storyPerPageValues[_id]) || 0,
      })
    );

    // Send plan details and update the state
    sendPlanDetails(planxData);
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setSelectedRows(updatedSelectedRows);
    setShowTotalCost(updatedShowTotalCost);

    // Optional: Reset any automatic check flag if needed
    // setIsAutomaticCheck(false);
  };

  const deSelectAllRows = () => {
    setSelectedRows([]);
    setPostPerPageValues({});
    setStoryPerPageValues({});
    setPageCategoryCount({});
    setTotalCostValues({});
    const payload = [];
    sendPlanDetails(payload);
  };

  useEffect(() => {
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[33].view_value === 1) {
            setContextData(true);
          }
          if (res.data[57].view_value === 1) {
            // setPageUpdateAuth(true);
          }
          if (res.data[56].view_value === 1) {
            setPageStatsAuth(true);
          }
        });
    }

    getData();
  }, []);

  useEffect(() => {
    const parseRange = (range) => {
      if (range === "lessThan10K") {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range.split("to").map((val) => {
        const value = parseInt(val.replace("K", "")) * 1000;
        return value;
      });
      return { min, max };
    };

    if (pageList) {
      const pageData = pageList.filter((item) => item.followers_count > 0);
      let filtered = [...pageData];

      // 1. Apply the category filter (if any)
      if (selectedCategory?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedCategory.includes(item.page_category_id)
        );
      }

      // 2. Apply the follower range filter (if any)
      if (selectedFollowers?.length > 0) {
        let followerFilteredData = [];
        selectedFollowers.forEach((range) => {
          const { min, max } = parseRange(range);
          const rangeData = filtered.filter(
            (page) => page.followers_count >= min && page.followers_count <= max
          );
          followerFilteredData.push(...rangeData);
        });
        filtered = followerFilteredData;
      }

      // 3. Apply the price filter (if min or max price is set)
      if (minPrice || maxPrice) {
        filtered = handlePriceFilter(filtered);
      }

      // 4. If no filters are applied, fallback to the full page list
      if (
        selectedFollowers?.length === 0 &&
        selectedCategory?.length === 0 &&
        !minPrice &&
        !maxPrice
      ) {
        filtered = pageList;
      }

      // 5. Update the state with the final filtered data
      setFilterData(filtered);
    }
  }, [selectedFollowers, selectedCategory, minPrice, maxPrice, pageList]);

  useEffect(() => {
    if (pageList) {
      const pageData = pageList?.filter((item) => item.followers_count > 0);
      setFilterData(pageData);
      const initialPostValues = {};
      const initialStoryValues = {};
      const initialCostPerPostValues = {};
      const initialCostPerStoryValues = {};
      const initialCostPerBothValues = {};
      pageList?.forEach((page) => {
        const postPrice = getPriceDetail(
          page.page_price_list,
          "instagram_post"
        );
        const storyPrice = getPriceDetail(
          page.page_price_list,
          "instagram_story"
        );
        const bothPrice = getPriceDetail(
          page.page_price_list,
          "instagram_both"
        );
        initialPostValues[page._id] = 0;
        initialStoryValues[page._id] = 0;
        initialCostPerPostValues[page._id] = postPrice || 0;
        initialCostPerStoryValues[page._id] = storyPrice || 0;
        initialCostPerBothValues[page._id] = bothPrice || 0;
      });
      setPostPerPageValues(initialPostValues);
      setStoryPerPageValues(initialStoryValues);
      setCostPerPostValues(initialCostPerPostValues);
      setCostPerStoryValues(initialCostPerStoryValues);
      setCostPerBothValues(initialCostPerBothValues);
    }
  }, [pageList]);

  useEffect(() => {
    // Call your function to handle automatic selection
    if (filterData?.length > 0 && pageDetail?.length > 0) {
      handleAutomaticSelection(pageDetail);
    }
  }, [filterData, pageDetail]);

  useEffect(() => {
    if (selectedRows?.length == 0) {
      setToggleShowBtn(false);
    }
  }, [selectedRows]);

  useEffect(() => {
    updateStatistics(selectedRows);
  }, [storyPerPageValues, postPerPageValues]);

  const handleStoryCountChange = (e) => setStoryCountDefault(e.target.value);
  const handlePostCountChange = (e) => setPostCountDefault(e.target.value);
  return (
    <>
      {/* <div className="action_heading">
        <div className="action_title">
          <div className="form-heading">
            <div className="form_heading_title ">
              <h2>Plan Making</h2>
            </div>
          </div>
        </div>
      </div> */}

      <PageDialog
        open={openDialog}
        onClose={handleCloseDialog}
        notFoundPages={notFoundPages}
      />
      {alertData && (
        <CustomAlert
          title={alertData.title}
          text={alertData.text}
          icon={alertData.icon}
          onConfirm={() => setAlertData(null)}
          showAlert={true}
        />
      )}
      {toggleLeftNavbar && (
        <LeftSideBar
          totalFollowers={totalFollowers}
          HandleSavePlan={HandleSavePlan}
          clearSearch={clearSearch}
          searchInputValue={searchInput}
          clearRecentlySelected={clearRecentlySelected}
          handleSearchChange={handleSearchChange}
          totalCost={totalCost}
          totalPostsPerPage={totalPostsPerPage}
          totalPagesSelected={totalPagesSelected}
          totalDeliverables={totalDeliverables}
          totalStoriesPerPage={totalStoriesPerPage}
          pageCategoryCount={pageCategoryCount}
          handleToggleBtn={handleToggleBtn}
          selectedRow={selectedRows}
          allrows={filterData}
          totalRecord={pageList?.pagination_data}
          postCount={postPerPageValues}
          storyPerPage={storyPerPageValues}
          handleOwnPage={handleOwnPage}
          category={cat}
        />
      )}

      <div className="card">
        <div className="card-header flexCenterBetween">
          <div className="flexCenter colGap12">
            <h5 className="card-title">Plan making</h5>
            <div className="">
              <button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={handleToggleLeftNavbar}
              >
                {!toggleLeftNavbar ? "show navbar" : "hide navbar"}
              </button>
            </div>
          </div>
          <div className="flexCenter colGap12">
            <div className="flexCenter colGap8">
              <div className="input-group primaryInputGroup">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type values separated by spaces"
                />
                <button
                  className="btn btn_sm cmnbtn pl-2 pr-2 btn-outline-primary"
                  type="button"
                  id="button-addon2"
                >
                  <X />
                </button>
              </div>
              <Button
                variant="contained"
                className="btn btn_sm cmnbtn btn-outline-danger"
              >
                Clear Recenty Selected
              </Button>
            </div>
            <button className="btn icon">
              <Sliders />
            </button>
          </div>
        </div>
        <div className="card-body"></div>
      </div>

      <div className="scrollWrapper">
        <div className="table-responsive topStickty">
          <div className="data_tbl thm_table">
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
                <CircularProgress variant="determinate" value={progress} />
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
              <>
                <PlanStatics
                  totalFollowers={totalFollowers}
                  HandleSavePlan={HandleSavePlan}
                  clearSearch={clearSearch}
                  searchInputValue={searchInput}
                  clearRecentlySelected={clearRecentlySelected}
                  handleSearchChange={handleSearchChange}
                  totalCost={totalCost}
                  totalPostsPerPage={totalPostsPerPage}
                  totalPagesSelected={totalPagesSelected}
                  totalDeliverables={totalDeliverables}
                  totalStoriesPerPage={totalStoriesPerPage}
                  pageCategoryCount={pageCategoryCount}
                  handleToggleBtn={handleToggleBtn}
                  selectedRow={selectedRows}
                  allrows={filterData}
                  totalRecord={pageList?.pagination_data}
                  postCount={postPerPageValues}
                  storyPerPage={storyPerPageValues}
                  handleOwnPage={handleOwnPage}
                  category={cat}
                  handleToggleLeftNavbar={handleToggleLeftNavbar}
                  toggleLeftNavbar={toggleLeftNavbar}
                />
              </>
            )}
            <RightDrawer
              priceFilterType={priceFilterType}
              deSelectAllRows={deSelectAllRows}
              selectedFollowers={selectedFollowers}
              setSelectedFollowers={setSelectedFollowers}
              setPriceFilterType={setPriceFilterType}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minFollowers={minFollowers}
              setMinFollowers={setMinFollowers}
              maxFollowers={maxFollowers}
              setMaxFollowers={setMaxFollowers}
              followerFilterType={followerFilterType}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              cat={cat}
              removeCategory={removeCategory}
              handleRemoveFilter={handleRemoveFilter}
              handleCombinedFilter={handleCombinedFilter}
              handleFollowersFilter={handleFollowersFilter}
              selectAllRows={selectAllRows}
              handleStoryCountChange={handleStoryCountChange}
              handlePostCountChange={handlePostCountChange}
              storyCountDefault={storyCountDefault}
              postCountDefault={postCountDefault}
              platformData={platformData}
              activeTabPlatform={activeTabPlatfrom}
              handlePlatform={handlePlatform}
            />
          </div>
        </div>

        <Accordion className="card" expanded={expanded}>
          <AccordionSummary
            className="card-header"
            expandIcon={
              <IconButton onClick={handleToggle}>
                <ExpandMoreIcon />
              </IconButton>
            }
            aria-controls="panel1-content"
            id="panel2-header"
          >
            {/* <p>{`${displayPercentage}%`} achived</p> */}

            <h5 className="card-title">Category Filters</h5>
          </AccordionSummary>
          <AccordionDetails className="card-body">
            {activeTabPlatfrom === "666818824366007df1df1319" && (
              <Filters
                priceFilterType={priceFilterType}
                deSelectAllRows={deSelectAllRows}
                selectedFollowers={selectedFollowers}
                setSelectedFollowers={setSelectedFollowers}
                setPriceFilterType={setPriceFilterType}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minFollowers={minFollowers}
                setMinFollowers={setMinFollowers}
                maxFollowers={maxFollowers}
                setMaxFollowers={setMaxFollowers}
                followerFilterType={followerFilterType}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                cat={cat}
                removeCategory={removeCategory}
                handleRemoveFilter={handleRemoveFilter}
                handleCombinedFilter={handleCombinedFilter}
                handleFollowersFilter={handleFollowersFilter}
                selectAllRows={selectAllRows}
                handleStoryCountChange={handleStoryCountChange}
                handlePostCountChange={handlePostCountChange}
                storyCountDefault={storyCountDefault}
                postCountDefault={postCountDefault}
              />
            )}
          </AccordionDetails>
        </Accordion>

        <div className="card">
          <div className="card-body pb20">
            <div className="thmTable">
              <Box sx={{ height: 700, width: "100%" }}>
                <CustomTable
                  isLoading={isPageListLoading}
                  columns={dataGridColumns}
                  data={
                    showOwnPage
                      ? ownPages
                      : toggleShowBtn
                      ? selectedRows
                      : sortedRows(filterData, selectedRows)
                  }
                  Pagination={[100, 200]}
                  // selectedData={}
                  tableName={"PlanMakingDetails"}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanMaking;
