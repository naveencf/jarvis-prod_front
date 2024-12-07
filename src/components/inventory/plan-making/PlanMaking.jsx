import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { baseUrl } from '../../../utils/config';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
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
import DataGridColumns from './DataGridColumns';
// import Filters from './Filters';
import {
  useFetchPlanDescription,
  useFetchPlanDetails,
  useGetPlanPages,
  usePageDetail,
  usePlanPagesVersionDetails,
  useSendPlanDetails,
} from './apiServices';
import PageDialog from './PageDialog';
import LeftSideBar from './LeftSideBar';
// import PlanPricing from './PlanPricing';
import RightDrawer from './RightDrawer';
import ActiveDescriptionModal from './ActiveDescriptionModal';
import CustomTableV2 from '../../CustomTable_v2/CustomTableV2';
import PlanVersions from './PlanVersions';
import { ButtonTitle, calculatePrice } from './helper';
import ScrollBlocker from './ScrollBlocker';
import ActionButtons from './ActionButtons';
import CountInputs from './CountInputs';
import SearchAndClear from './SearchAndClear';
import LayeringControls from './LayeringControls';
import ProgressDisplay from './ProgressDisplay';

const PlanMaking = () => {
  // const { id } = useParams();
  const [activeTabPlatform, setActiveTabPlatform] = useState([
    '666818824366007df1df1319',
  ]);

  const [filterData, setFilterData] = useState([]);
  const [toggleShowBtn, setToggleShowBtn] = useState();
  // const [progress, setProgress] = useState(10);
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
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isAutomaticCheck, setIsAutomaticCheck] = useState(false);
  const [lastSelectedRow, setLastSelectedRow] = useState(null);
  const [storyCountDefault, setStoryCountDefault] = useState(0);
  const [postCountDefault, setPostCountDefault] = useState(0);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  // const [planSuccess, setPlanSuccess] = useState();
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);
  const [priceFilterType, setPriceFilterType] = useState('post'); // Dropdown value
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minFollowers, setMinFollowers] = useState(null);
  const [maxFollowers, setMaxFollowers] = useState(null);
  const [notFoundPages, setNotFoundPages] = useState([]);
  // const [toggleLeftNavbar, setToggleLeftNavbar] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVersionModal, setOpenVersionModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedDescriptions, setCheckedDescriptions] = useState([]);
  const [showCheckedRows, setShowCheckedRows] = useState(false);
  const [ownPagesCost, setOwnPagesCost] = useState(0);
  const [ownPages, setOwnPages] = useState([]);
  const [tagCategory, setTagCategory] = useState([]);
  const [disableBack, setDisableBack] = useState(true);
  const [layering, setLayering] = useState(0);
  const [sarcasmNetwork, setSarcasmNetwork] = useState([]);
  const [advancePageList, setAdvancePageList] = useState([]);
  const [topUsedPageList, setTopUsedPageList] = useState([]);
  const [tempIndex, setTempIndex] = useState(0);
  const [getTableData, setGetTableData] = useState([]);
  const [shortcutTriggered, setShortcutTriggered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const { id } = useParams();
  // const renderCount = useRef(0);
  // renderCount.current++;
  // console.log(`Component re-rendered: ${renderCount.current} times`);
  const { pageDetail } = usePageDetail(id);
  const { planDetails } = useFetchPlanDetails(id);
  const { sendPlanDetails } = useSendPlanDetails(id);

  const { versionDetails, loading, error } = usePlanPagesVersionDetails(id);
  const { versionData } = useGetPlanPages(id, selectedVersion?.version);

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
  // const handleToggleLeftNavbar = () => {
  //   setToggleLeftNavbar(!toggleLeftNavbar);
  // };

  const showRightSlidder = useSelector(
    (state) => state.pageMaster.showRightSlidder
  );

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor, isLoading: VendorLoading } = useGetAllVendorQuery();
  const vendorData = vendor;

  const getPriceDetail = (priceDetails, key) => {
    const keyType = key.split('_')[1];

    const detail = priceDetails?.find((item) => {
      return Object.keys(item).some((priceKey) => priceKey.includes(keyType));
    });

    return detail
      ? detail[Object.keys(detail).find((key) => key.includes(keyType))]
      : 0;
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

  const handleUpdateValues = () => {
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedPostValues = { ...postPerPageValues };

    selectedRows.forEach((row) => {
      const isChecked = showTotalCost[row._id];

      if (isChecked) {
        const newPostPerPage = postCountDefault || 1;
        const newStoryPerPage = storyCountDefault || 0;

        updatedPostValues[row._id] = newPostPerPage;
        updatedStoryValues[row._id] = newStoryPerPage;
      }
    });

    setStoryPerPageValues(updatedStoryValues);
    setPostPerPageValues(updatedPostValues);

    // Trigger other updates or calculations
    selectedRows.forEach((row) => {
      const postCount = updatedPostValues[row._id] ?? 1;
      const storyCount = updatedStoryValues[row._id] ?? 0;
      const postCost = costPerPostValues[row._id] ?? 0;
      const storyCost = costPerStoryValues[row._id] ?? 0;
      const bothCost = costPerBothValues[row._id] ?? 0;

      // Calculate total cost for each row
      calculateTotalCost(
        row._id,
        postCount,
        storyCount,
        postCost,
        storyCost,
        bothCost
      );
    });

    // Update the plan data
    const updatedPlanData = selectedRows.map((row) => {
      const { _id, page_price_list, page_name, rate_type, followers_count } =
        row;

      const isFixedRate = rate_type === 'fixed';

      const getPrice = (type) =>
        isFixedRate
          ? getPriceDetail(page_price_list, `instagram_${type}`)
          : calculatePrice(
            rate_type,
            { page_price_list, followers_count },
            type
          );

      return {
        _id,
        page_name,
        post_price: getPrice('post'),
        story_price: getPrice('story'),
        post_count: Number(updatedPostValues[row._id]) || 0,
        story_count: Number(updatedStoryValues[row._id]) || 0,
      };
    });

    setPlanData(updatedPlanData);

    // Debounced send of plan details
    if (!isAutomaticCheck) {
      debouncedSendPlanDetails(updatedPlanData);
    }
  };

  const handleCheckboxChange = (row, shortcut, event, index) => {
    const isChecked = event.target.checked;
    // 1. Manage selected rows state
    const updatedSelectedRows = isChecked
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);
    setActiveIndex(index);
    setSelectedRows(updatedSelectedRows);
    setLastSelectedRow(row);
    // 2. Update showTotalCost to reflect the change
    setShowTotalCost((prevCost) => ({
      ...prevCost,
      [row._id]: isChecked,
    }));

    // 3. Handle postPerPage value change
    const postPerPage = isChecked ? postCountDefault || 1 : 0;
    const storyPerPage = isChecked ? storyCountDefault || 0 : 0;

    // 4. Update the storyPerPage values based on the checkbox selection
    const updatedStoryValues = {
      ...storyPerPageValues,
      [row._id]: storyPerPage,
    };
    setStoryPerPageValues(updatedStoryValues);

    // 5. Update postPerPage values and calculate costs
    handlePostPerValue(row, postPerPage, (updatedPostValues) => {
      const postCount = updatedPostValues[row._id] ?? 1;
      const storyCount = updatedStoryValues[row._id] ?? 0;
      const postCost = costPerPostValues[row._id] ?? 0;
      const storyCost = costPerStoryValues[row._id] ?? 0;
      const bothCost = costPerBothValues[row._id] ?? 0;
      // total cost calculation
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
        const { _id, page_price_list, page_name, rate_type, followers_count } =
          row;

        const isFixedRate = rate_type === 'fixed';

        const getPrice = (type) =>
          isFixedRate
            ? getPriceDetail(page_price_list, `instagram_${type}`)
            : calculatePrice(
              rate_type,
              { page_price_list, followers_count },
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
      const planStatus = planDetails[0].plan_status;
      // Debounce plan details to avoid rapid state updates
      if (!isAutomaticCheck) {
        debouncedSendPlanDetails(planxData, planStatus);
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

  const toggleCheckedRows = () => {
    setLayering(5);
    setShowCheckedRows(!showCheckedRows);
  };

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
      const postStoryCountSum = postPerPage + storyPerPage;

      followers += postStoryCountSum
        ? postStoryCountSum * rowFollowers
        : rowFollowers;
      cost += totalCostValues[row._id] || 0;
      posts += postPerPage;
      stories += storyPerPage;
      totalDeliverables += postStoryCountSum;

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
    shortcutTriggered,
    setShortcutTriggered,
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
    tempIndex,
    activeIndex,
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
    // Clone the state to avoid direct mutation
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };
    const updatedPageCategoryCount = { ...pageCategoryCount };

    // Create a map for faster lookup of categories by name and id
    if (cat) {
      const categoryMap = cat?.reduce((acc, category) => {
        acc[category.page_category] = category._id;
        return acc;
      }, {});

      // Process incoming data and update state
      incomingData?.forEach((incomingPage) => {
        const matchingPageIndex = pageList.findIndex(
          (page) => page.page_name === incomingPage.page_name
        );

        if (matchingPageIndex !== -1) {
          const matchingPage = { ...pageList[matchingPageIndex] }; // Clone the page data

          // Override page_category_name with incoming category_name
          matchingPage.page_category_name = incomingPage.category_name;

          // Find the corresponding page_category_id using the categoryMap
          const matchingCategoryId = categoryMap[incomingPage?.category_name];
          if (matchingCategoryId) {
            matchingPage.page_category_id = matchingCategoryId; // Set the correct page_category_id
          }

          // If the page is not already selected, add it to the selected rows and update category count
          const isAlreadySelected = updatedSelectedRows.some(
            (selectedRow) => selectedRow._id === matchingPage._id
          );
          if (!isAlreadySelected) {
            updatedSelectedRows.push(matchingPage);

            const categoryId = matchingPage.page_category_id;
            if (categoryId) {
              updatedPageCategoryCount[categoryId] =
                (updatedPageCategoryCount[categoryId] || 0) + 1;
            }
          }

          // Update post and story counts
          updatedPostValues[matchingPage._id] = incomingPage.post_count;
          updatedStoryValues[matchingPage._id] = incomingPage.story_count;

          // Get price for post and story
          const postPrice = getPriceDetail(
            matchingPage.page_price_list,
            'instagram_post'
          );
          const storyPrice = getPriceDetail(
            matchingPage.page_price_list,
            'instagram_story'
          );

          const rateType = matchingPage.rate_type === 'Fixed';

          // Calculate costs based on rate type
          const costPerPost = rateType
            ? postPrice
            : calculatePrice(matchingPage.rate_type, matchingPage, 'post');
          const costPerStory = rateType
            ? storyPrice
            : calculatePrice(matchingPage.rate_type, matchingPage, 'story');
          // const costPerStory = storyPrice;
          const costPerBoth = costPerPost + costPerStory;

          // Update total cost calculations
          calculateTotalCost(
            matchingPage._id,
            incomingPage.post_count,
            incomingPage.story_count,
            costPerPost,
            costPerStory,
            costPerBoth
          );

          updatedShowTotalCost[matchingPage._id] = true;
        }
      });

      // Prepare the final plan data
      const planxData = updatedSelectedRows.map((row) => {
        const { _id, page_price_list, page_name, rate_type, followers_count } =
          row;

        const isFixedRate = rate_type === 'Fixed';

        // Determine price based on rate type
        const getPrice = (type) =>
          isFixedRate
            ? getPriceDetail(page_price_list, `instagram_${type}`)
            : calculatePrice(
              rate_type,
              { page_price_list, followers_count },
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

      // Batch state updates to reduce re-renders
      setPlanData(planxData);
      setPostPerPageValues(updatedPostValues);
      setStoryPerPageValues(updatedStoryValues);
      setSelectedRows(updatedSelectedRows);
      setShowTotalCost(updatedShowTotalCost);
      setPageCategoryCount(updatedPageCategoryCount);
    }
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
          handleCheckboxChange(
            row,
            '',
            { target: { checked: true } },
            activeIndex
          );
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
        handleOpenDialog();
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

  const handleVersionSelect = (detail) => {
    setSelectedRows([]);
    setLayering(4);
    setSelectedVersion(detail);
    setOpenVersionModal(false);
  };

  const handleUnselectPages = () => {
    const pageData = pageList?.filter((item) => {
      const isSelected = selectedRows.some((row) => row._id === item._id);
      return item.followers_count > 0 && !isSelected;
    });
    setFilterData(pageData);
  };

  const clearRecentlySelected = () => {
    setSelectedRows([]);
    setTotalCostValues({});
    setPostPerPageValues({});
    setStoryPerPageValues({});
    setPageCategoryCount({});

    setSearchInput('');
  };
  // Function to filter rows based on the visibility of selected rows
  const filterRowsBySelection = (rows, selectedRows) => {
    if (showCheckedRows) {
      return selectedRows;
    }
    // Return the original rows if no filtering is required
    return rows;
  };

  const handleDisableBack = () => {
    setDisableBack(!disableBack);
  };
  // const handleOpenVersion = () => {
  //   setOpenVersionModal(true);
  // };
  const handleOpenPlanVersion = () => {
    setOpenVersionModal(true);
  };
  const sellingPrice = planDetails && planDetails[0]?.selling_price;
  function calculatePercentage(totalCost, budget) {
    if (budget === 0) return 0;
    return (totalCost / budget) * 100;
  }

  const percentage = calculatePercentage(totalCost, sellingPrice);

  const handleVersionClose = () => {
    setOpenVersionModal(false);
  };

  const handleKeyPress = (event) => {
    if (event.code === 'Space') {
      setShortcutTriggered(true); // Indicate shortcut use
      // Call handleCheckboxChange directly for the activeIndex
      handleCheckboxChange(
        getTableData[activeIndex],
        // filterData[activeIndex],
        'shortcutkey',
        { target: { checked: true } },
        activeIndex
      );

    } else if (event.code === 'ArrowDown') {
      if (activeIndex < filterData.length - 1) {
        setShortcutTriggered(true); // Indicate shortcut use
        setActiveIndex(activeIndex + 1);
        // setTimeout(() => setShortcutTriggered(false), 0); // Reset after execution
      }
    } else if (event.code === 'ArrowUp') {
      if (activeIndex > 0) {
        setShortcutTriggered(true); // Indicate shortcut use
        setActiveIndex(activeIndex - 1);
        // setTimeout(() => setShortcutTriggered(false), 0); // Reset after execution
      }
    }
  };

  const displayPercentage = Math.floor(percentage);

  const handleStoryCountChange = (e) => setStoryCountDefault(e.target.value);
  const handlePostCountChange = (e) => setPostCountDefault(e.target.value);

  const tableData =
    layering == 1
      ? sarcasmNetwork
      : layering == 2
        ? ownPages
        : layering == 3
          ? advancePageList
          : layering == 4
            ? topUsedPageList
            : showOwnPage
              ? ownPages
              : toggleShowBtn
                ? selectedRows
                : filterRowsBySelection(filterData, selectedRows);


  const activeDescriptions = useMemo(() => {
    return descriptions?.filter((desc) => desc.status === 'Active');
  }, [descriptions]);

  useEffect(() => {
    if (pageList && activeTabPlatform.length) {
      const pageData = pageList
        ?.filter(
          (item) =>
            item.followers_count > 0 &&
            activeTabPlatform.includes(item.platform_id)
        )
      const sarcasamNetworkPages = [];
      const advancedPostPages = [];
      const mostUsedPages = [];
      // Adding pages for layer
      pageList?.filter((page) => {
        if (page.followers_count > 0) {
          if (page?.page_layer == 1) {
            sarcasamNetworkPages.push(page);
          } else if (page?.page_layer == 3) {
            advancedPostPages.push(page);
          } else if (page?.page_layer == 4) {
            mostUsedPages.push(page);
          }
        }
      });
      setFilterData(pageData);
      setSarcasmNetwork(sarcasamNetworkPages);
      setAdvancePageList(advancedPostPages);
      setTopUsedPageList(mostUsedPages);
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
      // setCostPerBothValues(initialCostPerBothValues);
    }
  }, [pageList, activeTabPlatform]);

  useEffect(() => {
    // Call your function to handle automatic selection
    if (filterData?.length > 0 && pageDetail?.length > 0) {
      handleAutomaticSelection(pageDetail);
      setLayering(5);
    } else if (filterData?.length > 0 && pageDetail?.length == 0) {
      setLayering(1);
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
        // console.log(`User navigated away from /admin/pms-plan-making/${id}`);
        sendPlanxLogs('v1/planxlogs', payload);
      }
    };

    return () => {
      handleRouteChange();
    };
  }, [location, id, totalPostCount, totalStoryCount, selectedRows, totalCost]);

  useEffect(() => {
    if (layering == 2) {
      const ownPages = filterData?.filter(
        (item) => item?.ownership_type === 'Own'
      );
      setOwnPages(ownPages);
    }
  }, [layering]);

  useEffect(() => {
    if (versionData) {
      handleAutomaticSelection(versionData);
    }
  }, [versionData]);

  // const versionPages = versionData ? versionData : tableData;

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
      <ScrollBlocker disableBack={disableBack} />
      {/* {toggleLeftNavbar && ( */}
      <LeftSideBar
        totalFollowers={totalFollowers}
        planDetails={planDetails}
        id={id}
        planData={planData}
        totalStoryCount={totalStoryCount}
        totalPostCount={totalPostCount}
        sendPlanDetails={sendPlanDetails}
        selectedRows={selectedRows}
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
      {/* )} */}

      <div className="card">
        <div className="card-header flexCenterBetween">
          <ActionButtons
            handleUnselectPages={handleUnselectPages}
            handleOpenDialog={handleOpenDialog}
            handleOpenModal={handleOpenModal}
            toggleCheckedRows={toggleCheckedRows}
            showCheckedRows={showCheckedRows}
          />
          <ProgressDisplay
            pageList={pageList}
            displayPercentage={displayPercentage}
          />
          <CountInputs
            postCountDefault={postCountDefault}
            storyCountDefault={storyCountDefault}
            handlePostCountChange={handlePostCountChange}
            handleStoryCountChange={handleStoryCountChange}
            handleUpdateValues={handleUpdateValues}
          />
          <SearchAndClear
            searchInput={searchInput}
            handleSearchChange={handleSearchChange}
            clearSearch={clearSearch}
            clearRecentlySelected={clearRecentlySelected}
          />

          <div>
            <RightDrawer
              priceFilterType={priceFilterType}
              setShowTotalCost={setShowTotalCost}
              setSelectedRows={setSelectedRows}
              setStoryPerPageValues={setStoryPerPageValues}
              setPostPerPageValues={setPostPerPageValues}
              setPageCategoryCount={setPageCategoryCount}
              setTotalCostValues={setTotalCostValues}
              sendPlanDetails={sendPlanDetails}
              selectedFollowers={selectedFollowers}
              setSelectedFollowers={setSelectedFollowers}
              setPriceFilterType={setPriceFilterType}
              minPrice={minPrice}
              tagCategory={tagCategory}
              setTagCategory={setTagCategory}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              getTableData={getTableData}
              setSelectedCategory={setSelectedCategory}
              setMaxPrice={setMaxPrice}
              minFollowers={minFollowers}
              setMinFollowers={setMinFollowers}
              maxFollowers={maxFollowers}
              setMaxFollowers={setMaxFollowers}
              selectedCategory={selectedCategory}
              cat={cat}
              setFilterData={setFilterData}
              handleStoryCountChange={handleStoryCountChange}
              handlePostCountChange={handlePostCountChange}
              storyCountDefault={storyCountDefault}
              postCountDefault={postCountDefault}
              platformData={platformData}
              activeTabPlatform={activeTabPlatform}
              handlePlatform={handlePlatform}
              pageList={pageList}
            />
          </div>
        </div>
        <div className="card-header flexCenterBetween">
          <LayeringControls
            layering={layering}
            setLayering={setLayering}
            ButtonTitle={ButtonTitle}
            handleDisableBack={handleDisableBack}
            disableBack={disableBack}
            handleOpenPlanVersion={handleOpenPlanVersion}
          />
        </div>
        <PlanVersions
          handleVersionClose={handleVersionClose}
          openVersionModal={openVersionModal}
          versionDetails={versionDetails}
          onVersionSelect={handleVersionSelect}
        />
        <div className="card-body p0" onKeyDown={(e) => handleKeyPress(e)}>
          <div className="thmTable">
            <Box sx={{ height: 700, width: '100%' }}>
              {/* {filterData && filterData.length > 0 ? ( */}
              <CustomTableV2
                dataLoading={isPageListLoading}
                columns={dataGridColumns}
                data={tableData}
                Pagination={[100, 200]}
                tableName={'PlanMakingDetails'}
                getFilteredData={setGetTableData}
              />
              {/* ) : (
                <Loader />
              )} */}
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanMaking;
