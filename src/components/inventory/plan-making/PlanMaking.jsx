import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setShowPageHealthColumn } from '../../Store/PageOverview';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetAllVendorTypeQuery,
} from '../../Store/reduxBaseURL';
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
} from '../../Store/PageBaseURL';
import PlanStatics from './PlanStatics';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import DataGridColumns from './DataGridColumns';
import Filters from './Filters';
import {
  useFetchPlanDetails,
  usePageDetail,
  useSendPlanDetails,
} from './apiServices';
import CustomTable from '../../CustomTable/CustomTable';

const PlanMaking = () => {
  // const { id } = useParams();
  const [activeTabPlatfrom, setActiveTabPlatform] = useState(
    '666818824366007df1df1319'
  );

  const [filterData, setFilterData] = useState([]);
  const [toggleShowBtn, setToggleShowBtn] = useState();
  const [progress, setProgress] = useState(10);
  const [contextData, setContextData] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [pageCategoryCount, setPageCategoryCount] = useState({});
  const [showOwnPage, setShowOwnPage] = useState(false);
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const dispatch = useDispatch();

  const { data: pageList, isLoading: isPageListLoading } =
    useGetAllPageListQuery({ decodedToken, userID });

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
  const [followerFilterType, setFollowerFilterType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isAutomaticCheck, setIsAutomaticCheck] = useState(false);
  const [storyCountDefault, setStoryCountDefault] = useState(0); // Default story count
  const [postCountDefault, setPostCountDefault] = useState(0);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState(0);
  // const [planSuccess, setPlanSuccess] = useState();
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);

  const [priceFilterType, setPriceFilterType] = useState('post'); // Dropdown value
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minFollowers, setMinFollowers] = useState(null);
  const [maxFollowers, setMaxFollowers] = useState(null);
  const [notFoundPages, setNotFoundPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // const [pageDetail, setPageDetails] = useState([]);

  const { id } = useParams();

  const { pageDetail } = usePageDetail(id);
  const { sendPlanDetails } = useSendPlanDetails(id);
  const { planDetails } = useFetchPlanDetails(id);

  const sellingPrice = planDetails && planDetails[0]?.selling_price;

  const percentageRemaining = (totalCost / sellingPrice) * 100;

  // setPercentageRemaining(percentage);

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
  const navigate = useNavigate();
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;
  const getData = () => {
    // axios.get(baseUrl + 'get_all_users').then((res) => {
    axios.get(baseUrl + 'get_all_users').then(() => {
      setProgress(70);
    });
  };

  const handleCombinedFilter = () => {
    let newFilteredData = filterData?.filter((page) => {
      let price = 0;

      // Handle the price filter based on the selected type
      if (priceFilterType === 'post') {
        price = page.price_details?.Insta_Post || 0;
      } else if (priceFilterType === 'story') {
        price = page.price_details?.Insta_Story || 0;
      } else if (priceFilterType === 'both') {
        price = page.price_details?.Both || 0;
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

    setFilterData(newFilteredData);
  };

  const handleRemoveFilter = () => {
    const pageData = pageList?.filter((item) => item.followers_count > 0);
    setFilterData(pageData);
  };

  // const { data: priceData, isLoading: isPriceLoading } =
  //   useGetMultiplePagePriceQuery();

  let followerFilteredData = pageList?.filter((page) => {
    const followers = page?.followers_count;
    return (
      (minFollowers === null || followers >= minFollowers) &&
      (maxFollowers === null || followers <= maxFollowers)
    );
  });
  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleFollowerRangeChange = (e) => {
    const selectedRange = e.target.value;
    setFollowerFilterType(selectedRange);

    let minFollowers = null;
    let maxFollowers = null;

    // Update min and max followers based on the selected range
    switch (selectedRange) {
      case 'lessThan10K':
        minFollowers = 0;
        maxFollowers = 10000;
        break;
      case '10Kto20K':
        minFollowers = 10000;
        maxFollowers = 20000;
        break;
      case '20Kto50K':
        minFollowers = 20000;
        maxFollowers = 50000;
        break;
      case '50Kto100K':
        minFollowers = 50000;
        maxFollowers = 100000;
        break;
      case '100Kto200K':
        minFollowers = 100000;
        maxFollowers = 200000;
        break;
      case 'moreThan200K':
        minFollowers = 200000;
        maxFollowers = null;
        break;
      default:
        minFollowers = null;
        maxFollowers = null;
    }

    // Set the follower state
    setMinFollowers(minFollowers);
    setMaxFollowers(maxFollowers);

    // Update the filtered data state
    setFilterData(followerFilteredData);
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

    // Update selected rows
    const updatedSelectedRows = isChecked
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);

    setSelectedRows(updatedSelectedRows);

    // Update total cost state
    setShowTotalCost((prevCost) => ({
      ...prevCost,
      [row._id]: isChecked,
    }));

    // Set postPerPage values and calculate cost with latest values
    const postPerPage = isChecked ? 1 : 0;
    // Update postPerPage and after updating, calculate total cost with the latest values
    handlePostPerValue(row, postPerPage, (updatedPostValues) => {
      calculateTotalCost(
        row._id,
        updatedPostValues[row._id],
        storyPerPageValues[row._id],
        costPerPostValues[row._id],
        costPerStoryValues[row._id],
        costPerBothValues[row._id]
      );
      // Now, map updated planxData with the latest postPerPage values
      const planxData = updatedSelectedRows.map(
        ({ _id, price_details, page_name }) => ({
          _id,
          page_name,
          post_price: price_details.price_details,
          story_price: price_details.Insta_Story,
          post_count: Number(updatedPostValues[_id]) || 0,
          story_count: Number(storyPerPageValues[_id]) || 0,
        })
      );

      if (!isAutomaticCheck) {
        debouncedSendPlanDetails(planxData);
      }

      // sendPlanDetails(planxData);
    });

    // Update the page category count
    const categoryId = row.page_category_id;
    setPageCategoryCount((prevCount) => {
      const newCount = { ...prevCount };
      if (isChecked) {
        newCount[categoryId] = (newCount[categoryId] || 0) + 1;
      } else {
        newCount[categoryId] = (newCount[categoryId] || 0) - 1;
        if (newCount[categoryId] <= 0) {
          delete newCount[categoryId];
        }
      }
      return newCount;
    });

    // Update statistics
    updateStatistics(updatedSelectedRows);
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

  const HandleSavePlan = async () => {
    const payload = {
      id: id,
      plan_status: 'close',
      plan_saved: true,
    };

    try {
      const response = await fetch(`${baseUrl}v1/planxlogs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Plan has been saved successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/admin/pms-plan-making');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save the plan. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error updating plan:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  // Handler for dropdown change
  const handleCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions)?.map(
      (option) => option.value
    );

    // Update selected categories state, ensuring categories accumulate
    const updatedCategories = [
      ...new Set([...selectedCategory, ...selectedOptions]),
    ];
    setSelectedCategory(updatedCategories);

    // Filter data based on the updated selected categories
    const filtered = pageList?.filter(
      (item) =>
        item.followers_count > 0 &&
        updatedCategories?.includes(item.page_category_id)
    );
    setFilterData(filtered);
  };

  const removeCategory = (categoryId) => {
    const updatedCategories =
      selectedCategory?.filter((id) => id !== categoryId) || [];
    setSelectedCategory(updatedCategories);

    const filtered =
      pageList?.filter((item) =>
        updatedCategories.includes(item.page_category_id)
      ) || [];

    if (filtered?.length) {
      setFilterData(filtered);
    } else {
      setFilterData(pageList);
    }
  };

  const ownPages = filterData?.filter((item) => item?.ownership_type === 'Own');

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
    setSearchInput('');
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
        const costPerPost = matchingPage?.price_details?.Insta_Post;
        const costPerStory = matchingPage?.price_details?.Insta_Story;
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
      }
    });

    // Update all states after processing
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setSelectedRows(updatedSelectedRows);
    setShowTotalCost(updatedShowTotalCost);

    // setIsAutomaticCheck(false);
  };

  const filterAndSelectRows = (searchTerms) => {
    // If there are search terms
    if (searchTerms?.length > 0) {
      // Filter data based on search terms
      const filtered = pageList?.filter((item) =>
        searchTerms?.some((term) =>
          item?.page_name?.toLowerCase().includes(term.toLowerCase())
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
        filtered?.map((item) => item.page_name.toLowerCase())
      );

      // Check for terms that do not match any filtered items
      const notFound = searchTerms.filter(
        (term) => !filteredPageNames.has(term.toLowerCase()) // Case-insensitive check
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
      // setFilterData((prevData) => {
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
      .split(' ')
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

  const handleFollowersBlur = () => {
    const parseRange = (range) => {
      const [min, max] = range.split('to').map((val) => {
        const value = parseInt(val.replace('K', '')) * 1000; // Convert 'K' to thousand
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
    setFilterData(filteredData);
  };

  const clearRecentlySelected = () => {
    const pageData = pageList?.filter((item) => item.followers_count > 0);
    // Reset all the states
    setSelectedRows([]);
    setPostPerPageValues({});
    setStoryPerPageValues({});
    setPageCategoryCount({});
    setFilterData(pageData);

    // Optionally clear the search input
    setSearchInput('');
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
      updatedPostValues[row._id] = row.post_count || postCountDefault || 1;
      updatedStoryValues[row._id] = row.story_count || storyCountDefault || 0;

      // Calculate costs (if applicable)
      const costPerPost = row.m_post_price || 0;
      const costPerStory = row.m_story_price || 0;

      // Assuming a function exists to calculate total cost
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
      ({ _id, m_story_price, page_name, m_post_price }) => ({
        _id,
        page_name,
        post_price: m_post_price,
        story_price: m_story_price,
        post_count: Number(updatedPostValues[_id]) || 0,
        story_count: Number(updatedStoryValues[_id]) || 0,
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

  const displayPercentage = Math.floor(percentageRemaining);

  // useEffect(() => {
  //   if (percentageRemaining >= 50 && percentageRemaining <= 45) {
  //     alert('You have reached 50%!');
  //   } else if (percentageRemaining >= 75 && percentageRemaining <= 80) {
  //     alert('You have reached 80%');
  //   } else if (percentageRemaining >= 100) {
  //     alert('You have reached 100%');
  //   }
  // }, [percentageRemaining]);

  useEffect(() => {
    if (selectedFollowers?.length === 0) {
      const pageData = pageList?.filter((item) => item.followers_count > 0);
      setFilterData(pageData);
      return;
    }
  }, [selectedFollowers]);

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
    if (pageList) {
      const pageData = pageList?.filter((item) => item.followers_count > 0);
      setFilterData(pageData);
      const initialPostValues = {};
      const initialStoryValues = {};
      const initialCostPerPostValues = {};
      const initialCostPerStoryValues = {};
      const initialCostPerBothValues = {};
      pageList?.forEach((page) => {
        initialPostValues[page._id] = 0;
        initialStoryValues[page._id] = 0;
        initialCostPerPostValues[page._id] = page.price_details.Insta_Post || 0;
        initialCostPerStoryValues[page._id] =
          page.price_details.Insta_Story || 0;
        initialCostPerBothValues[page._id] = page.price_details.Both || 0;
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Unfetched Pages</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            The following pages were not found:
          </Typography>
          <ul>
            {notFoundPages.map((page, index) => (
              <li key={index}>{page}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className="scrollWrapper">
        <div className="table-responsive topStickty">
          <div className="data_tbl thm_table">
            {isPageListLoading ? (
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  margin: 'auto',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress variant="determinate" value={progress} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                />
              </>
            )}
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
            {/* <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>{`${displayPercentage}%`} achived</p>
            </Box> */}
            <h5 className="card-title">Category Filters</h5>
          </AccordionSummary>
          <AccordionDetails className="card-body">
            <div className="tabs">
              {platformData?.map((item) => (
                <button
                  key={item._id}
                  className={
                    activeTabPlatfrom === item._id
                      ? 'active btn btn-info'
                      : 'btn'
                  }
                  onClick={() => handlePlatform(item._id)}
                >
                  {item.platform_name}
                </button>
              ))}
            </div>
            {activeTabPlatfrom === '666818824366007df1df1319' && (
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
                handleFollowerRangeChange={handleFollowerRangeChange}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                cat={cat}
                removeCategory={removeCategory}
                handleRemoveFilter={handleRemoveFilter}
                handleCombinedFilter={handleCombinedFilter}
                handleFollowersBlur={handleFollowersBlur}
                selectAllRows={selectAllRows}
                handleStoryCountChange={handleStoryCountChange}
                handlePostCountChange={handlePostCountChange}
                storyCountDefault= {storyCountDefault}
                 postCountDefault={postCountDefault}
                
              />
            )}
          </AccordionDetails>
        </Accordion>

        <div className="card">
          <div className="card-body pb20">
            <div className="thmTable">
              <Box sx={{ height: 700, width: '100%' }}>
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
                  tableName={'PlanMakingDetails'}
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
