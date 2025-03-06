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
import LeftSideBar from './LeftSideBarBeta';
// import PlanPricing from './PlanPricing';
import RightDrawer from './RightDrawerBeta';
import ActiveDescriptionModal from '../plan-making/ActiveDescriptionModal';
// import CustomTableV2 from '../../CustomTable_v2/CustomTableV2';
import PlanVersions from '../plan-making/PlanVersions';
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
import { calculatePrice, ButtonTitle } from '../plan-making/helper';
// import CustomTable from '../../CustomTable/CustomTable';

const PlanMakingBeta = () => {
  // const { id } = useParams();
  const [activePlatform, setActivePlatform] = useState('instagram');

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
  const [searchPages, setSearchPages] = useState([]);
  const [mergeCatList, setMergeCatList] = useState([]);
  const [showSearchColorRow, setShowSearchColorRow] = useState(false);
  const [leftSideDataUpdate, setLeftSideBarDataUpdate] = useState(false);

  const { id } = useParams();
  // const renderCount = useRef(0);
  // renderCount.current++;
  // console.log(`Component re-rendered: ${renderCount.current} times`);
  const { pageDetail } = usePageDetail(id);
  const { planDetails, fetchPlanDetails } = useFetchPlanDetails(id);
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

  const handleUnselectPagesWithColor = () => {
    setShowSearchColorRow(true);

    const { filteredPages, selectedPages } = selectedRows.reduce(
      (acc, page) => {
        searchPages.includes(page.page_name) ? acc.selectedPages.push(page) : acc.filteredPages.push(page);
        return acc;
      },
      { filteredPages: [], selectedPages: [] }
    );

    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };

    selectedPages.forEach(({ _id }) => {
      delete updatedPostValues[_id];
      delete updatedStoryValues[_id];
      updatedShowTotalCost[_id] = false;
    });

    setSelectedRows(filteredPages);
    setPostPerPageValues(updatedPostValues);
    setStoryPerPageValues(updatedStoryValues);
    setShowTotalCost(updatedShowTotalCost);
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
  
    getTableData.forEach((row) => {
      const postCount = postPerPageValues[row._id] || 0;
      const storyCount = storyPerPageValues[row._id] || 0;
      const newCount = isPost ? updatedValues[row._id] : postCount;
      const newStoryCount = isPost ? storyCount : updatedValues[row._id];
      
      calculateTotalCost(
        row._id,
        newCount,
        newStoryCount,
        costPerPostValues[row._id] || 0,
        costPerStoryValues[row._id] || 0,
        costPerBothValues?.[row._id] || 0
      );
    });
  
    const updatedPlanData = selectedRows.map((row) => {
      const { _id, page_price_list, page_name, rate_type, followers_count, platform_name, platform_id } = row;
      const isFixedRate = rate_type === 'fixed';
  
      const getPrice = (priceType) => (isFixedRate
        ? getPriceDetail(page_price_list, `instagram_${priceType}`)
        : calculatePrice(rate_type, { page_price_list, followers_count }, priceType));
  
      return {
        _id,
        page_name,
        post_price: getPrice('post'),
        story_price: getPrice('story'),
        post_count: isPost ? Number(updatedValues[row._id]) || 0 : Number(postPerPageValues[row._id]) || 0,
        story_count: isPost ? Number(storyPerPageValues[row._id]) || 0 : Number(updatedValues[row._id]) || 0,
        platform_name,
        platform_id,
      };
    });
  
    setPlanData(updatedPlanData);
  
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
    if (index) {
      setActiveIndex(index);
    }
    // 1. Manage selected rows state
    const updatedSelectedRows = isChecked ? [...selectedRows, row] : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);

    // 2. Update showTotalCost and related state values
    const updatedShowTotalCost = { ...showTotalCost, [row._id]: isChecked };

    const postPerPage = isChecked ? postCountDefault || 1 : 0;
    const storyPerPage = isChecked ? storyCountDefault || 0 : 0;

    const updatedStoryValues = { ...storyPerPageValues, [row._id]: storyPerPage };

    // 3. Update page category count
    const categoryId = row.page_category_id;
    const updatedCategoryCount = { ...pageCategoryCount };
    updatedCategoryCount[categoryId] = (updatedCategoryCount[categoryId] || 0) + (isChecked ? 1 : -1);
    if (updatedCategoryCount[categoryId] <= 0) {
      delete updatedCategoryCount[categoryId];
    }

    // 4. Handle postPerPage and calculate costs
    handlePostPerValue(row, postPerPage, (updatedPostValues) => {
      const postCount = updatedPostValues[row._id] ?? 1;
      const storyCount = updatedStoryValues[row._id] ?? 0;
      const postCost = costPerPostValues[row._id] ?? 0;
      const storyCost = costPerStoryValues[row._id] ?? 0;
      const bothCost = costPerBothValues[row._id] ?? 0;

      calculateTotalCost(row._id, postCount, storyCount, postCost, storyCost, bothCost);

      const planxData = updatedSelectedRows.map((row) => {
        const { _id, page_price_list, page_name, rate_type, followers_count, platform_name, platform_id } = row;

        const isFixedRate = rate_type === 'fixed';

        const getPrice = (type) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${type}`) : calculatePrice(rate_type, { page_price_list, followers_count }, type));

        return {
          // _id,
          page_name,
          post_price: getPrice('post'),
          story_price: getPrice('story'),
          post_count: Number(updatedPostValues[_id]) || 0,
          story_count: Number(updatedStoryValues[_id]) || 0,
          platform_name: platform_name,
          platform_id: platform_id,
          page_id: _id,
        };
      });

      if (!isAutomaticCheck) {
        const planStatus = planDetails && planDetails[0]?.plan_status;
        debouncedSendPlanDetails(planxData, planStatus);
      }

      setPlanData(planxData);
    });

    setSelectedRows(updatedSelectedRows);
    setShowTotalCost(updatedShowTotalCost);
    setStoryPerPageValues(updatedStoryValues);
    setPageCategoryCount(updatedCategoryCount);
    setLastSelectedRow(row);

    // Update statistics after state updates
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
    if (rows.length === 0) {
      setTotalDeliverables(0);
    }
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
    searchPages,
    showSearchColorRow,
  });

  !decodedToken?.role_id === 1 && dispatch(setShowPageHealthColumn(pageStatsAuth));

  const clearSearch = () => {
    setSearchInput('');
    setShowSearchColorRow(false);
  };

  const handlePlatform = (platformName) => {
    // console.log('id', platformName);
    setActivePlatform(platformName);
    // const platform = pageList?.filter((item) => item.platform_name === platformName);
    // console.log('platformData', platform);
    // setFilterData(platform);
  };
  // console.log('pageCategoryCount', pageCategoryCount);
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

      // incoming data and update state
      incomingData?.forEach((incomingPage) => {
        let matchingPageIndex = -1;

        if (incomingPage.platform_name) {
          matchingPageIndex = pageList?.findIndex((page) => page.page_name === incomingPage.page_name && page.platform_name === incomingPage.platform_name);
        } else {
          matchingPageIndex = pageList?.findIndex((page) => page.page_name === incomingPage.page_name);
        }

        if (matchingPageIndex !== -1) {
          const matchingPage = { ...pageList[matchingPageIndex] };

          // Override page_category_name with incoming category_name
          if (incomingPage.category_name !== '') {
            matchingPage.page_category_name = incomingPage.category_name;

            const matchingCategoryId = categoryMap[incomingPage.category_name];
            if (matchingCategoryId) {
              matchingPage.page_category_id = matchingCategoryId;
            }
          }

          updatedPostValues[matchingPage._id] = incomingPage.post_count;
          updatedStoryValues[matchingPage._id] = incomingPage.story_count;

          const postPrice = getPriceDetail(matchingPage.page_price_list, 'instagram_post');
          const storyPrice = getPriceDetail(matchingPage.page_price_list, 'instagram_story');

          const rateType = matchingPage.rate_type === 'Fixed';

          const costPerPost = rateType ? postPrice : calculatePrice(matchingPage.rate_type, matchingPage, 'post');
          const costPerStory = rateType ? storyPrice : calculatePrice(matchingPage.rate_type, matchingPage, 'story');
          const costPerBoth = costPerPost + costPerStory;

          calculateTotalCost(matchingPage._id, incomingPage.post_count, incomingPage.story_count, costPerPost, costPerStory, costPerBoth);

          updatedShowTotalCost[matchingPage._id] = true;

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
        const { _id, page_price_list, page_name, rate_type, followers_count, platform_name, platform_id } = row;

        const isFixedRate = rate_type === 'Fixed';

        // Determine price based on rate type
        const getPrice = (type) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${type}`) : calculatePrice(rate_type, { page_price_list, followers_count }, type));

        return {
          page_name,
          post_price: getPrice('post'),
          story_price: getPrice('story'),
          post_count: Number(updatedPostValues[_id]) || 0,
          story_count: Number(updatedStoryValues[_id]) || 0,
          platform_name: platform_name,
          platform_id: platform_id,
          page_id: _id,
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

      const filtered = getTableData?.filter((item) => item.followers_count > 0 && searchTerms.some((term) => normalize(item?.page_name || '') === normalize(term)));

      // Store filtered data
      setFilterData(filtered);

      // Create a copy of the currently selected rows
      const updatedSelectedRows = [...selectedRows];
      const updatedPostValues = { ...postPerPageValues };
      const updatedShowTotalCost = { ...showTotalCost };
      // Loop through each filtered row
      filtered?.forEach((row) => {
        // Check if the row is already selected
        const isAlreadySelected = updatedSelectedRows.some((selectedRow) => selectedRow._id === row._id);

        // If not already selected, select the row and update checkbox
        if (!isAlreadySelected) {
          handleCheckboxChange(row, '', { target: { checked: true } }, activeIndex);
          updatedShowTotalCost[row._id] = true;
          updatedSelectedRows.push(row);
        }

        // Set the post per page value to 1 for this row
        updatedPostValues[row._id] = 1;
      });

      // Set post per page values for all rows at once
      setPostPerPageValues(updatedPostValues);
      setSelectedRows(updatedSelectedRows);
      setShowTotalCost(updatedShowTotalCost);
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
      const notCheckedRows = getTableData?.filter((item) => !selectedRowIds.has(item._id));

      // Update filterData with the unselected rows for display
      setFilterData(() => {
        return [...filtered, ...notCheckedRows.filter((item) => !filtered.some((filteredItem) => filteredItem._id === item._id))];
      });
    } else {
      // If no search terms, reset filterData and selectedRows
      setFilterData(getTableData);
      setSelectedRows([]);
      setNotFoundPages([]);
    }
  };
  //   console.log("searchInput", searchIn);
  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // Split and process search terms
    const searchTerms = inputValue
      .split(' ')
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);

    setSearchPages(searchTerms);
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
    setTotalDeliverables(0);
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

      if (event.shiftKey) {
        const nextRow = getTableData[activeIndex + 1];
        handleCheckboxChange(nextRow, 'shiftArrow', { target: { checked: true } }, activeIndex + 1);
      }
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

  // const syncUpdatedData = (pageDetails) => {
  //   // if (pageList.length) {
  //   const automaticCheckedData = handleAutomaticSelection(pageDetails);
  //   if (automaticCheckedData) {
  //     updatePageData(automaticCheckedData);
  //   }

  //   // }
  // };

  const updatePageData = (data) => {
    if (data) {
      const pageData = data?.filter((item) => item.followers_count > 0 && item.platform_name === activePlatform?.toLowerCase());
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

  useEffect(() => {
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
    if (leftSideDataUpdate) {
      setTimeout(() => {
        fetchPlanDetails();
        setLeftSideBarDataUpdate(false);
      }, 2000);
    }
  }, [storyPerPageValues, postPerPageValues, leftSideDataUpdate]);

  useEffect(() => {
    setStoryCountDefault(0);
    setPostCountDefault(0);
  }, [showRightSlidder]);

  useEffect(() => {
    const platform = pageList?.filter((item) => item.followers_count > 0 && item.platform_name === activePlatform?.toLowerCase());
    setFilterData(platform);
  }, [activePlatform]);

  // console.log("planDetail", planDetails);
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

  // useEffect(() => {
  //   const currentRouteBase = '/admin/pms-plan-making';
  //   const planStatus = planDetails && planDetails[0].plan_status;
  //   const payload = {
  //     id: id,
  //     plan_status: planStatus,
  //     plan_saved: true,
  //     post_count: totalPostCount,
  //     story_count: totalStoryCount,
  //     no_of_pages: selectedRows?.length,
  //     cost_price: totalCost,
  //     own_pages_cost_price: ownPagesCost,
  //   };

  //   const handleRouteChange = async () => {
  //     if (!location.pathname.startsWith(`${currentRouteBase}/${id}`)) {
  //       // console.log(`User navigated away from /admin/pms-plan-making/${id}`);
  //       sendPlanxLogs('v1/planxlogs', payload);
  //     }
  //   };

  //   return () => {
  //     handleRouteChange();
  //   };
  // }, [location, id, totalPostCount, totalStoryCount, selectedRows, totalCost]);

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
      <PageDialog open={openDialog} onClose={handleCloseDialog} notFoundPages={notFoundPages.length ? notFoundPages : unfetechedPages} />
      <ActiveDescriptionModal isOpen={isModalOpen} onClose={handleCloseModal} descriptions={activeDescriptions} onCheckedDescriptionsChange={handleCheckedDescriptionsChange} checkedDescriptions={checkedDescriptions} setCheckedDescriptions={setCheckedDescriptions} />
      <ScrollBlocker disableBack={disableBack} />
      <div className="tabs-container tabslide">
        <div className="navigation">
          {/* Dynamic Tabs */}
          <div className="tabs">
            {platformData?.map((item) => {
              const pageCount = pageList?.filter((page) => page.followers_count > 0 && page.platform_name === item.platform_name.toLowerCase()).length;

              return (
                <button key={item._id} className={activePlatform === item.platform_name ? 'active btn btn-info' : 'btn btn-link'} style={{ border: 'none', borderRight: '1px solid lightGray' }} onClick={() => handlePlatform(item.platform_name)}>
                  {`${item.platform_name.charAt(0).toUpperCase() + item.platform_name.slice(1)} ${pageCount || 0}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* {toggleLeftNavbar && ( */}
      <LeftSideBar totalFollowers={totalFollowers} setLeftSideBarDataUpdate={setLeftSideBarDataUpdate} setMergeCatList={setMergeCatList} planDetails={planDetails} id={id} planData={planData} totalStoryCount={totalStoryCount} totalPostCount={totalPostCount} sendPlanDetails={sendPlanDetails} selectedRows={selectedRows} handleTotalOwnCostChange={handleTotalOwnCostChange} totalCost={totalCost} totalPostsPerPage={totalPostsPerPage} totalPagesSelected={totalPagesSelected} totalDeliverables={totalDeliverables} totalStoriesPerPage={totalStoriesPerPage} pageCategoryCount={pageCategoryCount} handleToggleBtn={handleToggleBtn} selectedRow={selectedRows} totalRecord={pageList?.pagination_data} postCount={postPerPageValues} storyPerPage={storyPerPageValues} handleOwnPage={handleOwnPage} category={cat} ownPages={ownPages} checkedDescriptions={checkedDescriptions} />
      {/* )} */}
      <div className="card">
        <div className="card-header flexCenterBetween">
          <ActionButtons handleUnselectPages={handleUnselectPages} handleOpenDialog={handleOpenDialog} handleOpenModal={handleOpenModal} toggleCheckedRows={toggleCheckedRows} showCheckedRows={showCheckedRows} />
          <ProgressDisplay pageList={pageList} displayPercentage={displayPercentage} />
          <CountInputs postCountDefault={postCountDefault} storyCountDefault={storyCountDefault} handlePostCountChange={handlePostCountChange} handleStoryCountChange={handleStoryCountChange} handleUpdateValues={handleUpdateValues} />
          <SearchAndClear searchInput={searchInput} setShowSearchColorRow={setShowSearchColorRow} handleUnselectPagesWithColor={handleUnselectPagesWithColor} showSearchColorRow={showSearchColorRow} handleSearchChange={handleSearchChange} clearSearch={clearSearch} clearRecentlySelected={clearRecentlySelected} />
          <PageAddMasterModal />
          <div>
            <RightDrawer
              priceFilterType={priceFilterType}
              setShowTotalCost={setShowTotalCost}
              setSelectedRows={setSelectedRows}
              setStoryPerPageValues={setStoryPerPageValues}
              setPostPerPageValues={setPostPerPageValues}
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
              setTotalDeliverables={setTotalDeliverables}
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
          <LayeringControls categoryData={categoryData} getTableData={getTableData} layering={layering} handleOptionChange={handleOptionChange} setLayering={setLayering} ButtonTitle={ButtonTitle} toggleUncheckdPages={toggleUncheckdPages} handleDisableBack={handleDisableBack} disableBack={disableBack} handleOpenPlanVersion={handleOpenPlanVersion} />
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

export default PlanMakingBeta;
