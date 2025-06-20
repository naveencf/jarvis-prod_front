import { useState, useEffect, useCallback, useMemo } from 'react';
import { baseUrl } from '../../../utils/config';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setShowPageHealthColumn } from '../../Store/PageOverview';
import { useGetAllVendorQuery, useGetPmsPlatformQuery, useGetAllVendorTypeQuery } from '../../Store/reduxBaseURL';
import { useGetAllPageCategoryQuery, useGetAllPageListQuery } from '../../Store/PageBaseURL';
import DataGridColumns from '../plan-making/DataGridColumns';
// import Filters from './Filters';
import { useFetchPlanDescription, useFetchPlanDetails, useGetPlanPages, usePageDetail, usePlanPagesVersionDetails, useSendPlanDetails } from '../plan-making/apiServices';
import PageDialog from '../plan-making/PageDialog';
import LeftSideBar from '../plan-making/LeftSideBar';
// import PlanPricing from './PlanPricing';
import RightDrawer from '../plan-making/RightDrawer';
import ActiveDescriptionModal from '../plan-making/ActiveDescriptionModal';
// import CustomTableV2 from '../../CustomTable_v2/CustomTableV2';
import PlanVersions from '../plan-making/PlanVersions';
import { ButtonTitle, calculatePrice } from '../plan-making/helper';
import ScrollBlocker from '../plan-making/ScrollBlocker';
import ActionButtons from '../plan-making/ActionButtons';
import CountInputs from '../plan-making/CountInputs';
import SearchAndClear from '../plan-making/SearchAndClear';
import LayeringControls from '../plan-making/LayeringControls';
import ProgressDisplay from '../plan-making/ProgressDisplay';
import CustomTable from '../../CustomTable/CustomTable';
import { ImCross } from 'react-icons/im';
import PageAddMasterModal from '../../AdminPanel/PageMS/PageAddMasterModal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import UnfetchedPages from './UnFetchPages';
// import CustomTable from '../../CustomTable/CustomTable';

const PlanPricing = () => {
  // const { id } = useParams();
  const [activePlatform, setActivePlatform] = useState('');

  const [filterData, setFilterData] = useState([]);
  const [toggleShowBtn, setToggleShowBtn] = useState();
  // const [progress, setProgress] = useState(10);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [pageCategoryCount, setPageCategoryCount] = useState({});
  const [showOwnPage, setShowOwnPage] = useState(false);
  const [pagequery, setPageQuery] = useState('');
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const dispatch = useDispatch();

  const { data: pageList, isLoading: isPageListLoading, isFetching: isPageListFetching } = useGetAllPageListQuery({ decodedToken, userID, pagequery });

  const { data: vendorTypeData, isLoading: typeLoading } = useGetAllVendorTypeQuery();
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
  const [selectCategoryOption, setSelectCategoryOption] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [isAutomaticCheck, setIsAutomaticCheck] = useState(false);
  const [unfetchedData, setUnfetchedData] = useState(null);
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
  const [priceFilterType, setPriceFilterType] = useState('post');
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
  const [handiPickedPages, setHandiPickedPages] = useState([]);
  const [getTableData, setGetTableData] = useState([]);
  const [shortcutTriggered, setShortcutTriggered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [highPriceMemePages, setHighPriceMemePages] = useState([]);
  const [blackListedPages, setBlackListedPages] = useState([]);
  const [unCheckedPages, setUnCheckedPages] = useState([]);
  const [showUnChecked, setShowUnCheked] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const { id } = useParams();
  // const renderCount = useRef(0);
  // renderCount.current++;
  // console.log(`Component re-rendered: ${renderCount.current} times`);
  const { pageDetail } = usePageDetail(id);
  const { planDetails } = useFetchPlanDetails(id);
  const { sendPlanDetails, planSuccess } = useSendPlanDetails(id);

  const { versionDetails, loading, error } = usePlanPagesVersionDetails(id);
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
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
  const toggleUncheckdPages = () => {
    setShowUnCheked(!showUnChecked);
  };
  const showRightSlidder = useSelector((state) => state.pageMaster.showRightSlidder);

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor, isLoading: VendorLoading } = useGetAllVendorQuery();
  const vendorData = vendor;

  const getPriceDetail = (priceDetails, key) => {
    const keyType = key?.split('_')[1];

    const detail = priceDetails?.find((item) => {
      return Object?.keys(item)?.some((priceKey) => priceKey?.includes(keyType));
    });

    return detail ? detail[Object?.keys(detail).find((key) => key?.includes(keyType))] : 0;
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
  const handleSelection = (newSelectedData) => {
    setSelectedData(newSelectedData);
  };
  const handleUpdateValues = (type) => {
    const isPost = type === 'post';
    const updatedValues = isPost ? { ...postPerPageValues } : { ...storyPerPageValues };

    getTableData.forEach((row) => {
      const isChecked = showTotalCost[row._id];

      if (isChecked) {
        const newValue = isPost ? postCountDefault || 1 : storyCountDefault || 0;
        updatedValues[row._id] = newValue;
      }
    });

    if (isPost) {
      setPostPerPageValues(updatedValues);
    } else {
      setStoryPerPageValues(updatedValues);
    }

    // Trigger other updates or calculations dynamically based on type
    getTableData.forEach((row) => {
      const count = updatedValues[row._id] ?? (isPost ? 1 : 0);
      const cost = isPost ? costPerPostValues[row._id] ?? 0 : costPerStoryValues[row._id] ?? 0;

      // Calculate total cost based on type
      calculateTotalCost(row._id, isPost ? count : 0, isPost ? 0 : count, isPost ? cost : 0, isPost ? 0 : cost, 0);
    });

    // Update the plan data dynamically for post or story
    const updatedPlanData = selectedRows.map((row) => {
      const { _id, page_price_list, page_name, rate_type, followers_count } = row;

      const isFixedRate = rate_type === 'fixed';

      const getPrice = (priceType) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${priceType}`) : calculatePrice(rate_type, { page_price_list, followers_count }, priceType));

      return {
        _id,
        page_name,
        [`${type}_price`]: getPrice(type),
        [`${type}_count`]: Number(updatedValues[row._id]) || 0,
      };
    });

    setPlanData(updatedPlanData);

    // Debounced send of plan details
    if (!isAutomaticCheck) {
      debouncedSendPlanDetails(updatedPlanData);
    }
  };

  const handleOptionChange = (event, newValue) => {
    if (!newValue) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change the category to "${newValue.page_category}" for this plan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (!result.isConfirmed) {
        Swal.fire({
          title: 'Cancelled',
          text: 'The category change has been cancelled.',
          icon: 'info',
        });
        return;
      }

      setSelectCategoryOption(newValue);

      const updatedSelectedRows = [...selectedRows, ...selectedData];
      const updatedPostValues = { ...postPerPageValues };
      const updatedStoryValues = { ...storyPerPageValues };

      const selectedDataIds = new Set(selectedData.map((data) => data._id));
      const uniquePageNames = new Set();

      const finalPreviewData = updatedSelectedRows
        .map((row) => {
          const { _id, page_price_list, page_name, rate_type, followers_count } = row;

          // Skip duplicate `page_name`
          if (uniquePageNames.has(page_name)) return null;
          uniquePageNames.add(page_name);

          const isFromSelectedData = selectedDataIds.has(row._id);
          const isFixedRate = rate_type === 'Fixed';

          const postPrice = isFixedRate ? getPriceDetail(page_price_list, 'instagram_post') : calculatePrice(rate_type, { page_price_list, followers_count }, 'post');

          const storyPrice = isFixedRate ? getPriceDetail(page_price_list, 'instagram_story') : calculatePrice(rate_type, { page_price_list, followers_count }, 'story');

          return {
            _id,
            page_name,
            post_price: postPrice,
            story_price: storyPrice,
            post_count: Number(updatedPostValues[_id]) || 0,
            story_count: Number(updatedStoryValues[_id]) || 0,
            ...(isFromSelectedData && { category_name: newValue.page_category }),
          };
        })
        .filter(Boolean); // Remove `null` entries caused by duplicates

      sendPlanDetails(finalPreviewData);
      // console.log('result', result1);

      if (planSuccess.length) {
        window.location.reload();
        Swal.fire({
          title: 'Success!',
          text: `The category has been changed to "${newValue.page_category}".`,
          icon: 'success',
        });
        // handleAutomaticSelection(planSuccess);
      }

      // Clear selected data
      setSelectedData([]);
    });
  };
  const handleCheckboxChange = (row, shortcut, event, index) => {
    const isChecked = event.target.checked;
    // 1. Manage selected rows state
    const updatedSelectedRows = isChecked ? [...selectedRows, row] : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);
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
      calculateTotalCost(row._id, postCount, storyCount, postCost, storyCost, bothCost);

      // Update plan data with the latest selections
      const planxData = updatedSelectedRows.map((row) => {
        const { _id, page_price_list, page_name, rate_type, followers_count } = row;

        const isFixedRate = rate_type === 'fixed';

        const getPrice = (type) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${type}`) : calculatePrice(rate_type, { page_price_list, followers_count }, type));

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
    calculateTotalCost(row._id, postPerPageValues[row._id], updatedStoryValues[row._id], costPerPostValues[row._id], costPerStoryValues[row._id], costPerBothValues[row._id]);

    // updateStatistics(selectedRows);
  };
  const debouncedSendPlanDetails = useCallback(debounce(sendPlanDetails, 5000), []);

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
    calculateTotalCost(row._id, updatedPostValues[row._id], storyPerPageValues[row._id], costPerPostValues[row._id], costPerStoryValues[row._id], costPerBothValues[row._id]);

    updateStatistics(selectedRows);
  };

  const getTotalPostCount = () => {
    return Object.values(postPerPageValues).reduce((acc, count) => acc + count, 0);
  };

  const getTotalStoryCount = () => {
    return Object.values(storyPerPageValues).reduce((acc, count) => acc + count, 0);
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
    setLayering(8);
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

      followers += postStoryCountSum ? postStoryCountSum * rowFollowers : rowFollowers;
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

  const calculateTotalCost = (id, postPerPage, storyPerPage, costPerPost, costPerStory, costPerBoth) => {
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
    activePlatform,
  });

  !decodedToken?.role_id === 1 && dispatch(setShowPageHealthColumn(pageStatsAuth));

  const clearSearch = () => {
    setSearchInput('');
  };

  const handlePlatform = (platform) => {
    const platFormName = platform.description.toLowerCase();

    if (platFormName === 'all') {
      setActivePlatform('all');
      // setPageQuery('');
      const filterData = pageList.filter((page) => page.followers_count > 0);
      setFilterData(filterData);
    } else {
      setActivePlatform(platFormName);
      const filterData = pageList.filter((page) => page.followers_count > 0 && page.platform_name === platFormName);
      setFilterData(filterData);

      // setPageQuery(`platform_name=${platFormName}`);
    }
  };

  const handleAutomaticSelection = (incomingData) => {
    // Clone the state to avoid direct mutation
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };
    const updatedPageCategoryCount = { ...pageCategoryCount };
    const categoryUpdatedData = [];

    // Create a map for faster lookup of categories by name and id
    if (cat && pageList) {
      const categoryMap = cat?.reduce((acc, category) => {
        acc[category.page_category] = category._id;
        return acc;
      }, {});

      // Process incoming data and update state
      incomingData?.forEach((incomingPage) => {
        const matchingPageIndex = pageList?.findIndex((page) => page.page_name === incomingPage.page_name);

        if (matchingPageIndex !== -1) {
          const matchingPage = { ...pageList[matchingPageIndex] };

          // Override page_category_name with incoming category_name
          if (incomingPage.category_name !== '') {
            matchingPage.page_category_name = incomingPage.category_name;

            // Find the corresponding page_category_id using the categoryMap
            const matchingCategoryId = categoryMap[incomingPage.category_name];
            if (matchingCategoryId) {
              matchingPage.page_category_id = matchingCategoryId;
            }
          }

          // Update post and story counts
          updatedPostValues[matchingPage._id] = incomingPage.post_count;
          updatedStoryValues[matchingPage._id] = incomingPage.story_count;

          // Get price for post and story
          const postPrice = getPriceDetail(matchingPage.page_price_list, 'instagram_post');
          const storyPrice = getPriceDetail(matchingPage.page_price_list, 'instagram_story');

          const rateType = matchingPage.rate_type === 'Fixed';

          // Calculate costs based on rate type
          const costPerPost = rateType ? postPrice : calculatePrice(matchingPage.rate_type, matchingPage, 'post');
          const costPerStory = rateType ? storyPrice : calculatePrice(matchingPage.rate_type, matchingPage, 'story');
          const costPerBoth = costPerPost + costPerStory;

          // Update total cost calculations
          calculateTotalCost(matchingPage._id, incomingPage.post_count, incomingPage.story_count, costPerPost, costPerStory, costPerBoth);

          updatedShowTotalCost[matchingPage._id] = true;

          // Add to categoryUpdatedData
          categoryUpdatedData.push(matchingPage);

          if ((incomingPage.post_count > 0 || incomingPage.story_count > 0) && !updatedSelectedRows.some((row) => row._id === matchingPage._id)) {
            updatedSelectedRows.push(matchingPage);

            const categoryId = matchingPage.page_category_id;
            if (categoryId) {
              updatedPageCategoryCount[categoryId] = (updatedPageCategoryCount[categoryId] || 0) + 1;
            }
          }
        }
      });

      pageList.forEach((page) => {
        const isMatched = incomingData.some((incomingPage) => incomingPage.page_name === page.page_name);
        if (!isMatched) {
          categoryUpdatedData.push(page);
        }
      });

      // Prepare the final plan data
      const planxData = updatedSelectedRows.map((row) => {
        const { _id, page_price_list, page_name, rate_type, followers_count } = row;

        const isFixedRate = rate_type === 'Fixed';

        // Determine price based on rate type
        const getPrice = (type) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${type}`) : calculatePrice(rate_type, { page_price_list, followers_count }, type));

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

    return categoryUpdatedData;
  };

  const normalize = (str) => {
    // Replace leading/trailing underscores and non-printable characters
    return str
      .replace(/^\_+|\_+$/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .toLowerCase();
  };

  const filterAndSelectRows = (searchTerms) => {
    // If there are search terms
    if (searchTerms?.length > 0) {
      // Filter data based on search terms

      const filtered = pageList?.filter((item) => item.followers_count > 0 && searchTerms.some((term) => normalize(item?.page_name || '') === normalize(term)));

      // Store filtered data
      setFilterData(filtered);

      // Create a copy of the currently selected rows
      const updatedSelectedRows = [...selectedRows];
      const updatedPostValues = { ...postPerPageValues };

      // Loop through each filtered row
      filtered?.forEach((row) => {
        // Check if the row is already selected
        const isAlreadySelected = updatedSelectedRows.some((selectedRow) => selectedRow._id === row._id);

        // If not already selected, select the row and update checkbox
        if (!isAlreadySelected) {
          // Manually invoke the necessary logic to simulate checkbox selection
          handleCheckboxChange(row, '', { target: { checked: true } }, activeIndex);
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
      const filteredPageNames = new Set(filtered.map((item) => normalize(item.page_name || '')));

      const notFound = searchTerms.filter((term) => !filteredPageNames.has(normalize(term)));

      // Show not found pages if any
      if (notFound.length > 0) {
        setNotFoundPages(notFound);
        handleOpenDialog();
      } else {
        setNotFoundPages([]);
      }

      // Determine unselected rows (not checked)
      const selectedRowIds = new Set(updatedSelectedRows.map((row) => row._id));
      const notCheckedRows = pageList?.filter((item) => !selectedRowIds.has(item._id));

      // Update filterData with the unselected rows for display
      setFilterData(() => {
        return [...filtered, ...notCheckedRows.filter((item) => !filtered.some((filteredItem) => filteredItem._id === item._id))];
      });
    } else {
      // If no search terms, reset filterData and selectedRows
      setFilterData(pageList);
      setSelectedRows([]);
      setNotFoundPages([]);
    }
  };
  const processCSVData = (data) => {
    const normalizedData = data.map((row) => ({
      sno: row.Sno,
      page_name: normalize(row.Username),
      profile_link: row['Profile Link'] || '',
      followers_count: parseInt(row.Followers, 10) || 0,
      posts_per_profile: parseInt(row['Posts Per Profile'], 10) || 0,
      stories_per_profile: parseInt(row['Stories Per Profile'], 10) || 0,
    }));
    console.log("data", data);
    filterAndSelectRowsNew(normalizedData);
  };
  const handleCloseUnfetched = () => setUnfetchedData(null);

  const filterAndSelectRowsNew = (csvData) => {
    const getPlatformNameFromLink = (link) => {
      const platformMatch = link.match(/https:\/\/(www\.)?([^\.]+)/);
      return platformMatch ? platformMatch[2] : null;
    };

    const sanitizePageName = (name) => name.replace(/^_+|_+$/g, '').toLowerCase();

    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };

    let totalFetchedPagesCount = 0;
    const notFoundPages = [];

    const pageMap = pageList.reduce((map, page) => {
      const sanitizedPageName = sanitizePageName(page.page_name);
      if (!map[sanitizedPageName]) {
        map[sanitizedPageName] = [];
      }
      map[sanitizedPageName].push(page);
      return map;
    }, {});
    console.log("csvData", csvData);
    csvData.forEach((csvRow) => {
      const sanitizedCsvPageName = sanitizePageName(csvRow.page_name);
      const csvPlatform = csvRow.profile_link ? getPlatformNameFromLink(csvRow.profile_link.toLowerCase()) : null;
      const matchingPages = pageMap[sanitizedCsvPageName] || [];
      const filteredPages = csvPlatform ? matchingPages.filter((page) => getPlatformNameFromLink(page.page_link) === csvPlatform) : matchingPages;

      if (filteredPages.length === 0) {
        notFoundPages.push(csvRow.page_name);
        return;
      }
      filteredPages.forEach((page) => {
        totalFetchedPagesCount++;

        updatedPostValues[page._id] = csvRow.posts_per_profile || 0;
        updatedStoryValues[page._id] = csvRow.stories_per_profile || 0;

        const isAlreadySelected = updatedSelectedRows.some((selectedRow) => selectedRow._id === page._id);
        if (!isAlreadySelected) {
          handleCheckboxChange(page, '', { target: { checked: true } }, activeIndex);
          updatedSelectedRows.push(page);
        }
      });
    });
    console.log("totalFetchedPagesCount", totalFetchedPagesCount);
    console.log("notFoundPages", notFoundPages);
    // Set unfetched data
    setUnfetchedData({
      totalFetchedPagesCount,
      notFoundPages,
    });

    // Set post per page values for all rows at once
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setSelectedRows(updatedSelectedRows);

    // Update statistics based on selected rows
    updateStatistics(updatedSelectedRows);
  };

  const handleXLSXUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const requiredHeaders = ['Sno', 'Username', 'Profile Link', 'Followers', 'Posts Per Profile', 'Stories Per Profile'];
      const allData = [];

      // Extract and validate data from all subsheets
      workbook.SheetNames.forEach((sheetName) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
        if (sheetData.length === 0) return;

        const actualHeaders = Object.keys(sheetData[0]).filter(h => h);
        const isValidSheet = requiredHeaders.every(h => actualHeaders.includes(h));

        if (isValidSheet) {
          allData.push(...sheetData);
        }
      });


      processCSVData(allData);
    };

    reader.readAsBinaryString(file);
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

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
      setShortcutTriggered(true);
      const currentRow = getTableData[activeIndex];
      const isChecked = showTotalCost[currentRow._id] || false;

      // Toggle checkbox
      handleCheckboxChange(currentRow, 'shortcutkey', { target: { checked: !isChecked } }, activeIndex);
    } else if (event.code === 'ArrowDown' && activeIndex < filterData.length - 1) {
      setShortcutTriggered(true);
      setActiveIndex(activeIndex + 1);
    } else if (event.code === 'ArrowUp' && activeIndex > 0) {
      setShortcutTriggered(true);
      setActiveIndex(activeIndex - 1);
    }
  };

  const displayPercentage = Math.floor(percentage);

  const handleStoryCountChange = (e) => setStoryCountDefault(e.target.value);
  const handlePostCountChange = (e) => setPostCountDefault(e.target.value);

  const activeDescriptions = useMemo(() => {
    return descriptions?.filter((desc) => desc.status === 'Active');
  }, [descriptions]);

  // checked description in notes
  useEffect(() => {
    const activeDescriptions = descriptions?.map((res) => res.description);
    setCheckedDescriptions(activeDescriptions || []);
  }, [descriptions, setCheckedDescriptions]);

  useEffect(() => {
    const updatePageData = (data) => {
      if (data) {
        const pageData = data?.filter((item) => item.followers_count > 0);

        const sarcasamNetworkPages = [];
        const advancedPostPages = [];
        const mostUsedPages = [];
        const handiPicked = [];
        const highPriceMemes = [];
        const blackListed = [];
        // Adding pages for layer
        data?.filter((page) => {
          if (page.followers_count > 0) {
            if (page?.page_layer === 1) {
              sarcasamNetworkPages.push(page);
            } else if (page?.page_layer === 3) {
              advancedPostPages.push(page);
            } else if (page?.page_layer === 4) {
              mostUsedPages.push(page);
            } else if (page?.page_layer === 5) {
              handiPicked.push(page);
            } else if (page?.page_layer === 6) {
              highPriceMemes.push(page);
            } else if (page?.page_layer === 7) {
              blackListed.push(page);
            }
          }
        });
        setFilterData(pageData);
        setSarcasmNetwork(sarcasamNetworkPages);
        setHandiPickedPages(handiPicked);
        setAdvancePageList(advancedPostPages);
        setTopUsedPageList(mostUsedPages);
        setHighPriceMemePages(highPriceMemes);
        setBlackListedPages(blackListed);

        const initialPostValues = {};
        const initialStoryValues = {};
        const initialCostPerPostValues = {};
        const initialCostPerStoryValues = {};
        const initialCostPerBothValues = {};

        data?.forEach((page) => {
          const postPrice = getPriceDetail(page.page_price_list, 'instagram_post');
          const storyPrice = getPriceDetail(page.page_price_list, 'instagram_story');
          const bothPrice = getPriceDetail(page.page_price_list, 'instagram_both');
          const rateType = page.rate_type === 'Fixed';

          const costPerPost = rateType ? postPrice : calculatePrice(page.rate_type, page, 'post');
          const costPerStory = rateType ? storyPrice : calculatePrice(page.rate_type, page, 'story');
          const costOfBoth = rateType ? bothPrice : calculatePrice(page.rate_type, page, 'both');

          initialPostValues[page._id] = 0;
          initialStoryValues[page._id] = 0;
          initialCostPerPostValues[page._id] = costPerPost || 0;
          initialCostPerStoryValues[page._id] = costPerStory || 0;
          initialCostPerBothValues[page._id] = costOfBoth || 0;
        });

        // setPostPerPageValues(initialPostValues);
        // setStoryPerPageValues(initialStoryValues);
        setCostPerPostValues(initialCostPerPostValues);
        setCostPerStoryValues(initialCostPerStoryValues);
        // setCostPerBothValues(initialCostPerBothValues);
      }
    };

    // Call your function to handle automatic selection
    if (pageList?.length > 0 || pageDetail?.length > 0) {
      // const planData = planSuccess.length ? planSuccess : pageDetail;
      const automaticCheckedData = handleAutomaticSelection(pageDetail);
      if (automaticCheckedData) {
        updatePageData(automaticCheckedData);
      }
      setLayering(8);
    } else if (filterData?.length > 0 && pageDetail?.length == 0) {
      setLayering(1);
    }
  }, [pageList, pageDetail]);

  useEffect(() => {
    if (selectedRows?.length === 0) {
      setToggleShowBtn(false);
    } else {
      const allUnCheckedRecords = filterData.filter((page) => !selectedRows.some((item) => item.page_name === page.page_name));
      setUnCheckedPages(allUnCheckedRecords);
    }
  }, [selectedRows]);

  useEffect(() => {
    updateStatistics(selectedRows);
  }, [storyPerPageValues, postPerPageValues]);

  useEffect(() => {
    setStoryCountDefault(0);
    setPostCountDefault(0);
  }, [showRightSlidder]);

  //   useEffect(() => {
  //     const storedTab = localStorage.getItem('activeTab');
  //     if (storedTab) {
  //       setActivePlatform(storedTab);
  //       setPageQuery(`platform_name=${storedTab}`);
  //     }
  //   }, []);
  // // console.log("planDetail", planDetails);
  const unfetechedPages = planDetails && planDetails[0]?.not_available_pages;
  const allNotFoundUnfetched = unfetechedPages ? notFoundPages.every((page) => unfetechedPages.includes(page)) : false;

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

  //   useEffect(() => {
  //     const currentRouteBase = '/admin/inventory/pms-plan-making';
  //     const payload = {
  //       id: id,
  //       plan_status: 'open',
  //       plan_saved: true,
  //       post_count: totalPostCount,
  //       story_count: totalStoryCount,
  //       no_of_pages: selectedRows?.length,
  //       cost_price: totalCost,
  //       own_pages_cost_price: ownPagesCost,
  //     };

  //     const handleRouteChange = async () => {
  //       if (!location.pathname.startsWith(`${currentRouteBase}/${id}`)) {
  //         // console.log(`User navigated away from /admin/inventory/pms-plan-making/${id}`);
  //         sendPlanxLogs('v1/planxlogs', payload);
  //       }
  //     };

  //     return () => {
  //       handleRouteChange();
  //     };
  //   }, [location, id, totalPostCount, totalStoryCount, selectedRows, totalCost]);

  useEffect(() => {
    if (layering == 2) {
      const ownPages = filterData?.filter((item) => item?.ownership_type === 'Own');
      setOwnPages(ownPages);
    }
  }, [layering]);

  useEffect(() => {
    if (versionData) {
      handleAutomaticSelection(versionData);
    }
  }, [versionData]);

  // const versionPages = versionData ? versionData : tableData;
  const layeringMapping = {
    1: sarcasmNetwork,
    2: ownPages,
    3: advancePageList,
    4: topUsedPageList,
    5: handiPickedPages,
    6: highPriceMemePages,
    7: blackListedPages,
  };

  const tableData = showUnChecked ? unCheckedPages : layeringMapping[layering] ?? (showOwnPage ? ownPages : toggleShowBtn ? selectedRows : filterRowsBySelection(filterData, selectedRows));
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <label
          htmlFor="file-upload"
          style={{
            padding: '10px 20px',
            backgroundColor: '#413792',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}
        >
          Upload XLSX File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => {
            const file = e.target.files[0];
            handleXLSXUpload(file);
          }}
          style={{
            display: 'none',
          }}
        />
      </div>
      <UnfetchedPages data={unfetchedData} onClose={handleCloseUnfetched} />

      <PageDialog open={openDialog} onClose={handleCloseDialog} notFoundPages={notFoundPages.length ? notFoundPages : unfetechedPages} />
      <ActiveDescriptionModal isOpen={isModalOpen} onClose={handleCloseModal} descriptions={activeDescriptions} onCheckedDescriptionsChange={handleCheckedDescriptionsChange} checkedDescriptions={checkedDescriptions} setCheckedDescriptions={setCheckedDescriptions} />
      <ScrollBlocker disableBack={disableBack} />
      <div className="tabs">
        <button className={activePlatform === 'all' ? 'active btn btn-primary' : 'btn'} onClick={() => handlePlatform({ description: 'all' })}>
          All
        </button>
        {platformData?.map((platform) => (
          <button key={platform._id} className={activePlatform === platform?.description?.toLowerCase() ? 'active btn btn-primary' : 'btn'} onClick={() => handlePlatform(platform)}>
            {platform.platform_name.charAt(0).toUpperCase() + platform.platform_name.slice(1)}
          </button>
        ))}
      </div>

      {/* {toggleLeftNavbar && ( */}
      <LeftSideBar totalFollowers={totalFollowers} planDetails={planDetails} id={id} planData={planData} totalStoryCount={totalStoryCount} totalPostCount={totalPostCount} sendPlanDetails={sendPlanDetails} selectedRows={selectedRows} handleTotalOwnCostChange={handleTotalOwnCostChange} totalCost={totalCost} totalPostsPerPage={totalPostsPerPage} totalPagesSelected={totalPagesSelected} totalDeliverables={totalDeliverables} totalStoriesPerPage={totalStoriesPerPage} pageCategoryCount={pageCategoryCount} handleToggleBtn={handleToggleBtn} selectedRow={selectedRows} totalRecord={pageList?.pagination_data} postCount={postPerPageValues} storyPerPage={storyPerPageValues} handleOwnPage={handleOwnPage} category={cat} ownPages={ownPages} checkedDescriptions={checkedDescriptions} />
      {/* )} */}

      <div className="card">
        <div className="card-header flexCenterBetween">
          <ActionButtons handleUnselectPages={handleUnselectPages} handleOpenDialog={handleOpenDialog} handleOpenModal={handleOpenModal} toggleCheckedRows={toggleCheckedRows} showCheckedRows={showCheckedRows} />
          <ProgressDisplay pageList={pageList} displayPercentage={displayPercentage} />
          <CountInputs postCountDefault={postCountDefault} storyCountDefault={storyCountDefault} handlePostCountChange={handlePostCountChange} handleStoryCountChange={handleStoryCountChange} handleUpdateValues={handleUpdateValues} />
          <SearchAndClear searchInput={searchInput} handleSearchChange={handleSearchChange} clearSearch={clearSearch} clearRecentlySelected={clearRecentlySelected} />
          <PageAddMasterModal />
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
              selectedRows={selectedRows}
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
              // activeTabPlatform={activePlatform}
              // handlePlatform={handlePlatform}
              pageList={pageList}
            />
          </div>
        </div>
        <div className="card-header flexCenterBetween">
          <LayeringControls getTableData={getTableData} categoryData={categoryData} layering={layering} handleOptionChange={handleOptionChange} setLayering={setLayering} ButtonTitle={ButtonTitle} toggleUncheckdPages={toggleUncheckdPages} handleDisableBack={handleDisableBack} disableBack={disableBack} handleOpenPlanVersion={handleOpenPlanVersion} />
        </div>
        <PlanVersions handleVersionClose={handleVersionClose} openVersionModal={openVersionModal} versionDetails={versionDetails} onVersionSelect={handleVersionSelect} />
        <div className="card-body p0" onKeyDown={(e) => handleKeyPress(e)}>
          <div className="thmTable">
            <Box sx={{ height: 700, width: '100%' }}>
              {/* {filterData && filterData.length > 0 ? ( */}
              <CustomTable selectedData={handleSelection} rowSelectable={true} dataLoading={isPageListFetching} columns={dataGridColumns} data={tableData} Pagination={[100, 200]} tableName={'PlanMakingDetails'} getFilteredData={setGetTableData} showTotal={true} />
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

export default PlanPricing;
