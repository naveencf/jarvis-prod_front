import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShowPageHealthColumn,
  setTagCategories,
} from '../../Store/PageOverview';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetAllVendorTypeQuery,
} from '../../Store/reduxBaseURL';
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
} from '../../Store/PageBaseURL';
import Swal from 'sweetalert2';
import DataGridColumns from './DataGridColumns';
// import Filters from './Filters';
import {
  useFetchPlanDescription,
  useFetchPlanDetails,
  usePageDetail,
  useSendPlanDetails,
} from './apiServices';
import PageDialog from './PageDialog';
import CustomAlert from '../../../utils/CustomAlert';
import LeftSideBar from './LeftSideBar';
// import PlanPricing from './PlanPricing';
import RightDrawer from './RightDrawer';
import { X } from '@phosphor-icons/react';
import { CiStickyNote, CiWarning } from 'react-icons/ci';
import { BiSelectMultiple, BiSolidSelectMultiple } from 'react-icons/bi';
import ActiveDescriptionModal from './ActiveDescriptionModal';
import CustomTableV2 from '../../CustomTable_v2/CustomTableV2';

const PlanMaking = () => {
  // const { id } = useParams();
  const [activeTabPlatfrom, setActiveTabPlatform] = useState(
    '666818824366007df1df1319'
  );

  const [filterData, setFilterData] = useState([]);
  const [toggleShowBtn, setToggleShowBtn] = useState();
  // const [progress, setProgress] = useState(10);
  const [contextData, setContextData] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [pageCategoryCount, setPageCategoryCount] = useState({});
  const [showOwnPage, setShowOwnPage] = useState(false);

  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const dispatch = useDispatch();

  const pagequery = '';
  const { data: pageList, isLoading: isPageListLoading } =
    useGetAllPageListQuery({ decodedToken, userID, pagequery });
  const { data: vendorTypeData, isLoading: typeLoading } =
    useGetAllVendorTypeQuery();
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
  const [storyCountDefault, setStoryCountDefault] = useState(0);
  const [postCountDefault, setPostCountDefault] = useState(0);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  // const [planSuccess, setPlanSuccess] = useState();
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);
  const [alertData, setAlertData] = useState(null);
  const [priceFilterType, setPriceFilterType] = useState('post'); // Dropdown value
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minFollowers, setMinFollowers] = useState(null);
  const [maxFollowers, setMaxFollowers] = useState(null);
  const [notFoundPages, setNotFoundPages] = useState([]);
  const [toggleLeftNavbar, setToggleLeftNavbar] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedDescriptions, setCheckedDescriptions] = useState([]);
  const [showCheckedRows, setShowCheckedRows] = useState(false);
  const [ownPagesCost, setOwnPagesCost] = useState(0);
  const [tagCategory, setTagCategory] = useState([]);
  const [lastSelectedRow, setLastSelectedRow] = useState(null);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);

  // const [pageDetail, setPageDetails] = useState([]);
  const { id } = useParams();

  const { pageDetail } = usePageDetail(id);
  const { sendPlanDetails } = useSendPlanDetails(id);
  const { planDetails } = useFetchPlanDetails(id);
  const { descriptions } = useFetchPlanDescription();

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
  const showRightSlidder = useSelector(
    (state) => state.pageMaster.showRightSlidder
  );

  const navigate = useNavigate();
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor, isLoading: VendorLoading } = useGetAllVendorQuery();
  const vendorData = vendor;

  // const getData = () => {
  //   // axios.get(baseUrl + 'get_all_users').then((res) => {
  //   axios.get(baseUrl + 'get_all_users').then(() => {
  //     setProgress(70);
  //   });
  // };
  const getPriceDetail = (priceDetails, key) => {
    const detail = priceDetails?.find((item) => item[key] !== undefined);
    return detail ? detail[key] : 0;
  };
  // Function to calculate price
  const calculatePrice = (rate_type, pageData, type) => {
    if (rate_type === 'Variable') {
      // Calculate for post price (followers_count / 10,000) * m_post_price
      if (type === 'post') {
        const postPrice =
          (pageData.followers_count / 1000000) * pageData.m_post_price;
        return postPrice;
      } else if (type === 'story') {
        const storyPrice =
          (pageData.followers_count / 1000000) * pageData.m_story_price;
        return storyPrice;
      } else {
        const bothPrice =
          (pageData.followers_count / 1000000) * pageData.m_both_price;
        return bothPrice;
      }
    }
  };

  const handlePriceFilter = (data) => {
    let newFilteredData = data?.filter((page) => {
      let price = 0;

      const postPrice = getPriceDetail(page.page_price_list, 'instagram_post');
      const storyPrice = getPriceDetail(
        page.page_price_list,
        'instagram_story'
      );
      const bothPrice = getPriceDetail(page.page_price_list, 'instagram_both');

      // Determine the price based on the selected filter type
      switch (priceFilterType) {
        case 'post':
          price = postPrice || 0;
          break;
        case 'story':
          price = storyPrice || 0;
          break;
        case 'both':
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

      const postPrice = getPriceDetail(page.page_price_list, 'instagram_post');
      const storyPrice = getPriceDetail(
        page.page_price_list,
        'instagram_story'
      );
      const bothPrice = getPriceDetail(page.page_price_list, 'instagram_both');
      // Handle the price filter based on the selected type
      if (priceFilterType === 'post') {
        price = postPrice || 0;
      } else if (priceFilterType === 'story') {
        price = storyPrice || 0;
      } else if (priceFilterType === 'both') {
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
      title: 'Success!',
      text: 'Filter applied successfully.',
      icon: 'success',
    });
    setFilterData(newFilteredData);
  };

  const handleRemoveFilter = () => {
    const pageData = pageList
      ?.filter((item) => item.followers_count > 0)
      .sort((a, b) => b.followers_count - a.followers_count);
    setFilterData(pageData);
    setSelectedFollowers([]);
    setSelectedCategory([]);
    setMinPrice(0);
    setMaxPrice(0);
  };

  // const { data: priceData, isLoading: isPriceLoading } =
  //   useGetMultiplePagePriceQuery();

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

  // useEffect(() => {
  //   if (selectedData) {
  //     console.log("ins");
  //     selectedData.forEach((item) => {
  //       handleCheckboxChange(item)({ target: { checked: true } });
  //     });
  //   }
  // }, [selectedData]);

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

    // 3. Handle postPerPage value change
    const postPerPage = isChecked ? postCountDefault || 1 : 0; // Set to postCountDefault if checked, or default to 1 if not provided
    const storyPerPage = isChecked ? storyCountDefault || 0 : 0; // Set to storyCountDefault if checked, or default to 0 if not provided

    // 4. Update the storyPerPage values based on the checkbox selection
    const updatedStoryValues = {
      ...storyPerPageValues,
      [row._id]: storyPerPage, // Set story count for this row
    };
    setStoryPerPageValues(updatedStoryValues);

    // 5. Update postPerPage values and calculate costs
    handlePostPerValue(row, postPerPage, (updatedPostValues) => {
      // Ensure we get valid values with fallback
      const postCount = updatedPostValues[row._id] ?? 1; // Default to 1 if not provided
      const storyCount = updatedStoryValues[row._id] ?? 0; // Default to 0 if not provided
      const postCost = costPerPostValues[row._id] ?? 0; // Default to 0 if not available
      const storyCost = costPerStoryValues[row._id] ?? 0; // Default to 0 if not available
      const bothCost = costPerBothValues[row._id] ?? 0; // Default to 0 if not available
      // Perform total cost calculation
      calculateTotalCost(
        row._id,
        postCount,
        storyCount,
        postCost,
        storyCost,
        bothCost
      );

      // Update plan data with the latest selections
      const planxData = updatedSelectedRows.map((row) => {
        const {
          _id,
          page_price_list,
          page_name,
          rate_type,
          m_story_price,
          m_post_price,
          followers_count,
        } = row;

        const isFixedRate = rate_type === 'fixed';

        const getPrice = (type) =>
          isFixedRate
            ? getPriceDetail(page_price_list, `instagram_${type}`)
            : calculatePrice(
                rate_type,
                { m_story_price, m_post_price, followers_count },
                type
              );

        return {
          _id,
          page_name,
          post_price: getPrice('post'),
          story_price: getPrice('story'),
          post_count: Number(updatedPostValues[_id]) || 0,
          story_count: Number(updatedStoryValues[_id]) || 0,
        };
      });
      // console.log('planX', planxData);
      setPlanData(planxData);

      // Debounce plan details to avoid rapid state updates
      if (!isAutomaticCheck) {
        debouncedSendPlanDetails(planxData);
      }
    });

    // 6. Update page category count safely
    const categoryId = row.page_category_id;
    setPageCategoryCount((prevCount) => {
      const newCount = { ...prevCount };
      newCount[categoryId] = (newCount[categoryId] || 0) + (isChecked ? 1 : -1);
      if (newCount[categoryId] <= 0) {
        delete newCount[categoryId];
      }
      return newCount;
    });

    // 7. Trigger any other required state updates or statistics
    updateStatistics(updatedSelectedRows);
  };

  const handleTotalOwnCostChange = (value) => {
    setOwnPagesCost(value);
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

  const sendPlanxLogs = async (endpoint, payload) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error making API request:', error);
      throw error;
    }
  };

  const HandleSavePlan = async () => {
    const payload = {
      id: id,
      plan_status: 'open',
      plan_saved: true,
      post_count: totalPostCount,
      story_count: totalStoryCount,
      no_of_pages: selectedRows?.length,
      cost_price: totalCost,
      own_pages_cost_price: ownPagesCost,
    };
    try {
      // Perform both the API call and sendPlanDetails in parallel
      const [fetchResponse] = await Promise.all([
        sendPlanxLogs('v1/planxlogs', payload),
        sendPlanDetails(planData),
      ]);

      // Check if the fetch request was successful
      if (fetchResponse.ok) {
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
      console.error('Error processing plan:', error);

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

    // Accumulate the selected categories
    const updatedCategories = [
      ...new Set([...selectedCategory, ...selectedOptions]),
    ];
    setSelectedCategory(updatedCategories);

    // Start filtering from the original `pageList`
    let filtered = pageList.filter((item) => {
      const isInCategory = updatedCategories?.includes(item.page_category_id);
      const hasFollowers = item.followers_count > 0;
      return isInCategory && hasFollowers;
    });

    // Incorporate follower range filtering
    const parseRange = (range) => {
      if (range === 'lessThan10K') {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range
        .split('to')
        .map((val) => parseInt(val.replace('K', '')) * 1000);
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
  const toggleCheckedRows = () => {
    setShowCheckedRows(!showCheckedRows);
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
        !updatedCategories.length || updatedCategories?.(item.page_category_id);
      const hasFollowers = item.followers_count > 0;
      return isInCategory && hasFollowers;
    });

    // Incorporate follower range filtering
    const parseRange = (range) => {
      if (range === 'lessThan10K') {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range
        .split('to')
        .map((val) => parseInt(val.replace('K', '')) * 1000);
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

  const ownPages = filterData?.filter((item) => item?.ownership_type === 'Own');
  const handleOpenModal = () => setIsModalOpen(true);

  // Close the modal
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCheckedDescriptionsChange = (newCheckedDescriptions) => {
    setCheckedDescriptions(newCheckedDescriptions);
  };

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
      totalDeliverables += postPerPage + storyPerPage;
      // totalDeliverables += (postPerPage + storyPerPage) * rowFollowers;
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

  const handleRowClick = (row, index) => {
    // setLastSelectedRow(row); // Store the last selected row
    // setFocusedRowIndex(index); // Store the index of the currently focused row
    // handleCheckboxChange(row)({ target: { checked: true } });
  };

  const { dataGridColumns } = DataGridColumns({
    vendorData,
    filterData,
    selectedRows,
    handleCheckboxChange,
    postPerPageValues,
    handleRowClick,
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
  };
  const handleAutomaticSelection = (incomingData) => {
    // setIsAutomaticCheck(true);
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };
    const updatedPageCategoryCount = { ...pageCategoryCount };

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
          const categoryId = matchingPage.page_category_id;
          if (categoryId) {
            // Ensure categoryId is valid
            updatedPageCategoryCount[categoryId] =
              (updatedPageCategoryCount[categoryId] || 0) + 1;
          }
        }

        // Update post and story counts
        updatedPostValues[matchingPage._id] = incomingPage.post_count;
        updatedStoryValues[matchingPage._id] = incomingPage.story_count;

        // Calculate the cost
        const postPrice = getPriceDetail(
          matchingPage.page_price_list,
          'instagram_post'
        );
        const storyPrice = getPriceDetail(
          matchingPage.page_price_list,
          'instagram_story'
        );
        const rateType = matchingPage.rate_type === 'Fixed';

        const costPerPost = rateType
          ? postPrice
          : calculatePrice(matchingPage.rate_type, matchingPage, 'post');
        const costPerStory = rateType
          ? storyPrice
          : calculatePrice(matchingPage.rate_type, matchingPage, 'story');
        // const costPerStory = storyPrice;
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
        const planxData = updatedSelectedRows.map((row) => {
          const {
            _id,
            page_price_list,
            page_name,
            rate_type,
            m_story_price,
            m_post_price,
            followers_count,
          } = row;

          const isFixedRate = rate_type === 'fixed';

          const getPrice = (type) =>
            isFixedRate
              ? getPriceDetail(page_price_list, `instagram_${type}`)
              : calculatePrice(
                  rate_type,
                  { m_story_price, m_post_price, followers_count },
                  type
                );

          return {
            _id,
            page_name,
            post_price: getPrice('post'),
            story_price: getPrice('story'),
            post_count: Number(updatedPostValues[_id]) || 0,
            story_count: Number(updatedStoryValues[_id]) || 0,
          };
        });

        setPlanData(planxData);
      }
    });

    // Update all states after processing
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setSelectedRows(updatedSelectedRows);
    setShowTotalCost(updatedShowTotalCost);
    setPageCategoryCount(updatedPageCategoryCount);
    // setIsAutomaticCheck(false);
  };
  const normalize = (str) => {
    // Replace leading/trailing underscores and non-printable characters
    return str
      .replace(/^\_+|\_+$/g, '')
      .replace(/[^\x20-\x7E]/g, '') // Remove non-printable characters
      .toLowerCase();
  };

  const filterAndSelectRows = (searchTerms) => {
    // If there are search terms
    if (searchTerms?.length > 0) {
      // Filter data based on search terms

      const filtered = pageList?.filter(
        (item) =>
          item.followers_count > 0 &&
          searchTerms.some(
            (term) => normalize(item?.page_name || '') === normalize(term)
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
        filtered.map((item) => normalize(item.page_name || ''))
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

  const handleFollowersFilter = () => {
    const parseRange = (range) => {
      if (range === 'lessThan10K') {
        return { min: 0, max: 10000 };
      }
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

    setSearchInput('');
  };
  // Function to sort rows: checked rows come first
  const sortedRows = (rows, selectedRows) => {
    if (showCheckedRows) {
      return selectedRows;
    }
    // Create a shallow copy of the rows to avoid modifying the original array
    if (rows) {
      // const rowsCopy = [...rows];
      // return rowsCopy?.sort((a, b) => {
      //   const aChecked = selectedRows.some(
      //     (selectedRow) => selectedRow._id === a._id
      //   );
      //   const bChecked = selectedRows.some(
      //     (selectedRow) => selectedRow._id === b._id
      //   );
      //   return aChecked === bChecked ? 0 : aChecked ? -1 : 1;
      // });
      return rows;
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
      const postPrice = getPriceDetail(row.page_price_list, 'instagram_post');
      const storyPrice = getPriceDetail(row.page_price_list, 'instagram_story');
      const bothPrice = getPriceDetail(row.page_price_list, 'instagram_both');
      const rateType = row.rate_type === 'Fixed';

      const finalPostCost = rateType
        ? postPrice
        : calculatePrice(row.rate_type, row, 'post');
      const finalStoryCost = rateType
        ? storyPrice
        : calculatePrice(row.rate_type, row, 'story');
      const costOfBoth = rateType
        ? bothPrice
        : calculatePrice(row.rate_type, row, 'both');

      const costPerPost = finalPostCost || 0;
      const costPerStory = finalStoryCost || 0;

      // function exists to calculate total cost
      calculateTotalCost(
        row._id,
        updatedPostValues[row._id],
        updatedStoryValues[row._id],
        costPerPost,
        costPerStory,
        costOfBoth
      );

      // Mark this row's cost visibility as 'true'
      updatedShowTotalCost[row._id] = true;

      // Optional: Auto-check this row if needed (commented out in your logic)
      // handleCheckboxChange(row)({ target: { checked: true } });
    });

    // Prepare the plan data to send
    const planxData = updatedSelectedRows.map((row) => {
      const {
        _id,
        page_price_list,
        page_name,
        rate_type,
        m_story_price,
        m_post_price,
        followers_count,
      } = row;

      const isFixedRate = rate_type === 'fixed';

      const getPrice = (type) =>
        isFixedRate
          ? getPriceDetail(page_price_list, `instagram_${type}`)
          : calculatePrice(
              rate_type,
              { m_story_price, m_post_price, followers_count },
              type
            );

      return {
        _id,
        page_name,
        post_price: getPrice('post'),
        story_price: getPrice('story'),
        post_count: Number(updatedPostValues[_id]) || 0,
        story_count: Number(updatedStoryValues[_id]) || 0,
      };
    });
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

    // getData();
  }, []);

  useEffect(() => {
    const parseRange = (range) => {
      if (range === 'lessThan10K') {
        return { min: 0, max: 10000 };
      } else if (range === '1000KPlus') {
        return { min: 1000000, max: Infinity };
      } else if (range === '2000KPlus') {
        return { min: 2000000, max: Infinity };
      }

      const [min, max] = range.split('to').map((val) => {
        const value = parseInt(val.replace('K', '')) * 1000;
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
          selectedCategory?.includes(item.page_category_id)
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
      const pageData = pageList
        ?.filter((item) => item.followers_count > 0)
        .sort((a, b) => b.followers_count - a.followers_count);
      setFilterData(pageData);
      const initialPostValues = {};
      const initialStoryValues = {};
      const initialCostPerPostValues = {};
      const initialCostPerStoryValues = {};
      const initialCostPerBothValues = {};
      pageList?.forEach((page) => {
        const postPrice = getPriceDetail(
          page.page_price_list,
          'instagram_post'
        );
        const storyPrice = getPriceDetail(
          page.page_price_list,
          'instagram_story'
        );
        const bothPrice = getPriceDetail(
          page.page_price_list,
          'instagram_both'
        );
        const rateType = page.rate_type === 'Fixed';

        const costPerPost = rateType
          ? postPrice
          : calculatePrice(page.rate_type, page, 'post');
        const costPerStory = rateType
          ? storyPrice
          : calculatePrice(page.rate_type, page, 'story');
        const costOfBoth = rateType
          ? bothPrice
          : calculatePrice(page.rate_type, page, 'both');

        initialPostValues[page._id] = 0;
        initialStoryValues[page._id] = 0;
        initialCostPerPostValues[page._id] = costPerPost || 0;
        initialCostPerStoryValues[page._id] = costPerStory || 0;
        initialCostPerBothValues[page._id] = costOfBoth || 0;
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

  useEffect(() => {
    setStoryCountDefault(0);
    setPostCountDefault(0);
  }, [showRightSlidder]);

  // console.log("planDetail", planDetails);
  const unfetechedPages = planDetails && planDetails[0]?.not_available_pages;
  const allNotFoundUnfetched = unfetechedPages
    ? notFoundPages.every((page) => unfetechedPages.includes(page))
    : false;

  if (unfetechedPages) {
    if (!allNotFoundUnfetched) {
      notFoundPages.forEach((page) => {
        if (!unfetechedPages.includes(page)) {
          unfetechedPages.push(page);
        }
      });
    }
  }

  useEffect(() => {
    if (notFoundPages.length && allNotFoundUnfetched && unfetechedPages) {
      const payload = {
        id: id,
        not_available_pages: unfetechedPages,
      };
      sendPlanxLogs('v1/planxlogs', payload);
    }
  }, [notFoundPages, allNotFoundUnfetched, unfetechedPages]);

  const sellingPrice = planDetails && planDetails[0]?.selling_price;
  function calculatePercentage(totalCost, budget) {
    if (budget === 0) return 0;
    return (totalCost / budget) * 100;
  }

  useEffect(() => {
    const platform = pageList?.filter(
      (item) => item.platform_id === activeTabPlatfrom
    );
    setFilterData(platform);
  }, [activeTabPlatfrom]);
  const percentage = calculatePercentage(totalCost, sellingPrice);

  useEffect(() => {
    const currentRouteBase = '/admin/pms-plan-making';
    const payload = {
      id: id,
      plan_status: 'open',
      plan_saved: true,
      post_count: totalPostCount,
      story_count: totalStoryCount,
      no_of_pages: selectedRows?.length,
      cost_price: totalCost,
      own_pages_cost_price: ownPagesCost,
    };

    const handleRouteChange = async () => {
      if (!location.pathname.startsWith(`${currentRouteBase}/${id}`)) {
        console.log(`User navigated away from /admin/pms-plan-making/${id}`);
        sendPlanxLogs('v1/planxlogs', payload);
      }
    };

    return () => {
      handleRouteChange();
    };
  }, [location, id, totalPostCount, totalStoryCount, selectedRows, totalCost]);

  useEffect(() => {
    const pageData = pageList?.filter((item) => item.followers_count > 0);

    // Start filtering from the original `pageList`
    let filtered = pageData;

    // Helper function to parse follower range
    const parseRange = (range) => {
      if (range === 'lessThan10K') {
        return { min: 0, max: 10000 };
      }
      const [min, max] = range
        .split('to')
        .map((val) => parseInt(val.replace('K', '')) * 1000);
      return { min, max };
    };

    // Filter by followers range
    if (selectedFollowers.length) {
      let followerFiltered = [];
      selectedFollowers.forEach((range) => {
        const { min, max } = parseRange(range);
        const rangeFilteredData = filtered.filter((page) => {
          const followers = page?.followers_count;
          return followers >= min && followers <= max;
        });
        followerFiltered = [...followerFiltered, ...rangeFilteredData];
      });
      filtered = followerFiltered;
    }

    // Apply the price filter
    if (minPrice || maxPrice) {
      filtered = handlePriceFilter(filtered);
    }

    // Filter by tag categories
    if (tagCategory.length) {
      if (tagCategory.length > 2) {
        filtered = filtered.filter((item) => {
          const categoryArray = item.tags_page_category_name
            ?.split(',')
            .map((tag) => tag.trim());
          return tagCategory.every((category) =>
            categoryArray?.includes(category)
          );
        });
      } else {
        filtered = filtered.filter((item) =>
          tagCategory.some((category) => {
            return item.tags_page_category_name?.includes(category);
          })
        );
      }
    }

    // Update the filtered data in state
    setFilterData(filtered);
  }, [tagCategory, selectedFollowers]);
  // console.log('selectedRows  outside handleKeypress', selectedRows);

  const handleKeyPress = (event) => {
    const n = selectedRows?.length;
    if (event.shiftKey && event.code === 'ArrowDown') {
      for (let i = 0; i < filterData.length - 1; i++) {
        if (selectedRows[n - 1]?.page_name === filterData[i]?.page_name) {
          if (filterData[i + 1]) {
            handleCheckboxChange(filterData[i + 1])({
              target: { checked: true },
            });
            break;
          }
        }
      }
    } else if (event.shiftKey && event.code === 'ArrowUp') {
      for (let i = 0; i < filterData.length - 1; i++) {
        if (selectedRows[n - 1]?.page_name === filterData[i]?.page_name) {
          if (filterData[i - 1]) {
            handleCheckboxChange(filterData[i - 1])({
              target: { checked: true },
            });
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleWheel = (event) => {
      const { deltaX, deltaY, target } = event;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const scrollableElement = target.closest('.scrollable-container');
      if (scrollableElement) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollableElement;
        if (
          (deltaX < 0 && scrollLeft > 0) ||
          (deltaX > 0 && scrollLeft + clientWidth < scrollWidth)
        ) {
          return;
        }
        if (deltaX < 0 && scrollLeft === 0) {
          event.preventDefault();
        }
      } else if (deltaX < 0) {
        event.preventDefault();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);
  const displayPercentage = Math.floor(percentage);

  const handleStoryCountChange = (e) => setStoryCountDefault(e.target.value);
  const handlePostCountChange = (e) => setPostCountDefault(e.target.value);

  const activeDescriptions = useMemo(() => {
    return descriptions?.filter((desc) => desc.status === 'Active');
  }, [descriptions]);
  return (
    <>
      <PageDialog
        open={openDialog}
        onClose={handleCloseDialog}
        notFoundPages={notFoundPages.length ? notFoundPages : unfetechedPages}
      />
      <ActiveDescriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        descriptions={activeDescriptions}
        onCheckedDescriptionsChange={handleCheckedDescriptionsChange}
        checkedDescriptions={checkedDescriptions}
        setCheckedDescriptions={setCheckedDescriptions}
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
          planDetails={planDetails}
          HandleSavePlan={HandleSavePlan}
          clearSearch={clearSearch}
          searchInputValue={searchInput}
          handleTotalOwnCostChange={handleTotalOwnCostChange}
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
          ownPages={ownPages}
          checkedDescriptions={checkedDescriptions}
        />
      )}

      <div className="card">
        <div className="card-header flexCenterBetween">
          <div className="flexCenter colGap12">
            <button
              className="btn cmnbtn btn-primary btn_sm"
              onClick={handleToggleLeftNavbar}
            >
              {!toggleLeftNavbar ? 'Show Left Sidebar' : 'Hide Left Sidebar'}
            </button>
            <button
              className="icon"
              onClick={handleOpenDialog}
              title="Unfetched Pages"
            >
              <CiWarning />
            </button>
            <button
              className="icon"
              onClick={handleOpenModal}
              title="Internal-Notes"
            >
              <CiStickyNote />
            </button>
            <button
              className="icon"
              title="Selected Rows"
              onClick={toggleCheckedRows}
            >
              {!showCheckedRows ? (
                <BiSelectMultiple />
              ) : (
                <BiSolidSelectMultiple />
              )}
            </button>

            {pageList ? (
              <div className="flexCenter icon">
                <CircularProgress
                  variant="determinate"
                  value={displayPercentage}
                  sx={{ position: 'absolute' }}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: 'primary.main',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  {`${displayPercentage}%`}
                </Typography>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="row" style={{ padding: '0.5rem' }}>
            <div className="col">
              <input
                type="number"
                className="filter-input form-control hundred"
                placeholder="Post Count"
                value={postCountDefault || ''}
                onChange={handlePostCountChange}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="filter-input form-control hundred"
                placeholder="Story Count"
                value={storyCountDefault || ''}
                onChange={handleStoryCountChange}
              />
            </div>
          </div>
          <div className="flexCenter colGap12">
            <div className="flexCenter colGap8">
              <div className="input-group primaryInputGroup">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type values separated by spaces"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <button
                  className="btn btn_sm cmnbtn pl-2 pr-2 btn-outline-primary"
                  type="button"
                  id="button-addon2"
                  onClick={clearSearch}
                >
                  <X />
                </button>
              </div>
              <Button
                variant="contained"
                className="btn btn_sm cmnbtn btn-outline-danger"
                onClick={clearRecentlySelected}
              >
                Clear Recenty Selected
              </Button>
            </div>
            <div>
              <RightDrawer
                priceFilterType={priceFilterType}
                deSelectAllRows={deSelectAllRows}
                selectedFollowers={selectedFollowers}
                setSelectedFollowers={setSelectedFollowers}
                setPriceFilterType={setPriceFilterType}
                minPrice={minPrice}
                tagCategory={tagCategory}
                setTagCategory={setTagCategory}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setSelectedCategory={setSelectedCategory}
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
                pageList={pageList}
              />
            </div>
          </div>
        </div>

        <div className="card-body p0">
          <div className="thmTable">
            <Box
              sx={{ height: 700, width: '100%' }}
              onKeyDown={(e) => handleKeyPress(e)}
            >
              {filterData && filterData.length > 0 && (
                <CustomTableV2
                  // selectedData={setSelectedData}
                  // rowSelectable={true}
                  // dataLoading={isPageListLoading || VendorLoading || typeLoading}
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
              )}
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanMaking;
