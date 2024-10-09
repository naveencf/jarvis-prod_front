import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import { Link } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setShowPageHealthColumn } from '../../Store/PageOverview';
import { setShowPageHealthColumn } from '../../Store/PageOverview';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetAllVendorTypeQuery,
} from '../../Store/reduxBaseURL';
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  // useGetMultiplePagePriceQuery,
} from '../../Store/PageBaseURL';
import Checkbox from '@mui/material/Checkbox';
import PlanStatics from './PlanStatics';

const PlanMaking = () => {
  const {
    data: pageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  // const { data: pageStates } = useGetPageStateQuery();
  const [activeTab, setActiveTab] = useState('Tab1');
  const [activeTabPlatfrom, setActiveTabPlatform] = useState(
    '666818824366007df1df1319'
  );
  const [filterData, setFilterData] = useState([]);
  //   const [user, setUser] = useState();
  const [toggleShowBtn, setToggleShowBtn] = useState();
  const [progress, setProgress] = useState(10);
  const [contextData, setContextData] = useState(false);
  //   const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [pageCategoryCount, setPageCategoryCount] = useState({});
  const [showOwnPage, setShowOwnPage] = useState(false);
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const dispatch = useDispatch();

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
  const [selectedCategory, setSelectedCategory] = useState('');

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);

  const [priceFilterType, setPriceFilterType] = useState('post'); // Dropdown value
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minFollowers, setMinFollowers] = useState(null);
  const [maxFollowers, setMaxFollowers] = useState(null);

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

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;
  const getData = () => {
    axios.get(baseUrl + 'get_all_users').then((res) => {
      setProgress(70);
    });
  };

  const handleCombinedFilter = () => {
    let newFilteredData = filterData?.filter((page) => {
      let price = 0;

      // Handle the price filter based on the selected type
      if (priceFilterType === 'post') {
        price = page.price_details?.Insta_Post || 0; // Access Insta_Post price
      } else if (priceFilterType === 'story') {
        price = page.price_details?.Insta_Story || 0; // Access Insta_Story price
      } else if (priceFilterType === 'both') {
        price = page.price_details?.Both || 0; // Access Both price
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
    setFilterData(pageList?.data);
  };
  useEffect(() => {
    if (pageList) {
      setFilterData(pageList.data);
      const initialPostValues = {};
      const initialStoryValues = {};
      const initialCostPerPostValues = {};
      const initialCostPerStoryValues = {};
      const initialCostPerBothValues = {};
      pageList?.data?.forEach((page) => {
        initialPostValues[page._id] = 0;
        initialStoryValues[page._id] = 0;
        initialCostPerPostValues[page._id] = page.m_post_price || 0;
        initialCostPerStoryValues[page._id] = page.m_story_price || 0;
        initialCostPerBothValues[page._id] = page.m_both_price || 0;
      });
      setPostPerPageValues(initialPostValues);
      setStoryPerPageValues(initialStoryValues);
      setCostPerPostValues(initialCostPerPostValues);
      setCostPerStoryValues(initialCostPerStoryValues);
      setCostPerBothValues(initialCostPerBothValues);
    }
  }, [pageList]);

  // const { data: priceData, isLoading: isPriceLoading } =
  //   useGetMultiplePagePriceQuery();

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
        maxFollowers = null; // No upper limit
        break;
      default:
        minFollowers = null;
        maxFollowers = null;
    }

    // Set the follower state
    setMinFollowers(minFollowers);
    setMaxFollowers(maxFollowers);

    // Apply the filter on the data based on the follower range
    let filteredData = pageList?.data?.filter((page) => {
      const followers = page?.followers_count;
      return (
        (minFollowers === null || followers >= minFollowers) &&
        (maxFollowers === null || followers <= maxFollowers)
      );
    });

    // Update the filtered data state
    setFilterData(filteredData);
  };

  const handleCheckboxChange = (row) => (event) => {
    const updatedSelectedRows = event.target.checked
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);

    setSelectedRows(updatedSelectedRows);
    setShowTotalCost({
      ...showTotalCost,
      [row._id]: event.target.checked,
    });

    // to add 1 in post checking on checkbox
    if (
      event.target.checked &&
      (!postPerPageValues[row._id] || postPerPageValues[row._id] === 0)
    ) {
      const updatedPostValues = {
        ...postPerPageValues,
        [row._id]: 1,
      };
      setPostPerPageValues(updatedPostValues);

      calculateTotalCost(
        row._id,
        1,
        storyPerPageValues[row._id],
        costPerPostValues[row._id],
        costPerStoryValues[row._id],
        costPerBothValues[row._id]
      );
    }

    // Logic to update category count
    const categoryId = row.page_category_id;
    setPageCategoryCount((prevCount) => {
      const newCount = { ...prevCount };
      if (event.target.checked) {
        // Increment count for the category
        newCount[categoryId] = (newCount[categoryId] || 0) + 1;
      } else {
        // Decrement count if unchecked
        newCount[categoryId] = (newCount[categoryId] || 0) - 1;
        if (newCount[categoryId] <= 0) {
          delete newCount[categoryId];
        }
      }
      return newCount;
    });
    updateStatistics(updatedSelectedRows);
  };
  const handleToggleBtn = () => {
    setToggleShowBtn(!toggleShowBtn);
  };

  const handleOwnPage = () => {
    setShowOwnPage(!showOwnPage);
  };
  const handlePostPerPageChange = (row) => (event) => {
    const updatedPostValues = {
      ...postPerPageValues,
      [row._id]: event.target.value,
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

  useEffect(() => {
    updateStatistics(selectedRows);
  }, [storyPerPageValues, postPerPageValues]);

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

  // Handler for dropdown change
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);

    // Filter data based on selected category ID
    const filtered = pageList?.data?.filter(
      (item) => item.page_category_id === selectedCategoryId
    );
    setFilterData(filtered);
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
    setTotalCostValues({
      ...totalCostValues,
      [id]: totalCost,
    });
  };

  const dataGridcolumns = [
    {
      field: 'S.NO',
      headerName: 'Count',
      renderCell: (params) => <div> {filterData.indexOf(params.row) + 1} </div>,

      width: 80,
    },
    {
      field: 'page_name',
      headerName: 'Page Name',
      width: 200,
      editable: true,
    },
    {
      field: 'Vendor',
      headerName: 'Vendor',
      width: 200,
      renderCell: (params) => {
        let name = vendorData?.find(
          (item) => item?._id == params.row?.vendor_id
        )?.vendor_name;
        return <div>{name}</div>;
      },
      // editable: true
    },
    {
      field: 'page_link',
      headerName: 'Page Link',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={params.row.page_link}
            className="link-primary"
          >
            {params.row.page_link}
          </a>
        );
      },
    },
    {
      field: 'followers_count',
      headerName: 'Followers',
      width: 100,
    },
    {
      field: 'ownership_type',
      headerName: 'Ownership',
      width: 100,
    },
    {
      field: 'est_update',
      headerName: 'Selection',
      width: 100,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={selectedRows.some((row) => row?._id === params?.row?._id)}
            onChange={handleCheckboxChange(params.row)}
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Post Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{ width: '70%' }}
            value={postPerPageValues[params.row._id] || ''}
            onChange={handlePostPerPageChange(params.row)}
          />
        );
      },
    },
    {
      field: 'updated_by',
      headerName: 'Story Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{ width: '70%' }}
            value={storyPerPageValues[params.row._id] || ''}
            onChange={handleStoryPerPageChange(params.row)}
          />
        );
      },
    },
    {
      field: 'last_updated_by',
      headerName: 'Total Cost',
      width: 100,
      renderCell: (params) => {
        return (
          <div style={{ border: '1px solid red', padding: '10px' }}>
            {'₹'}
            {showTotalCost[params.row._id]
              ? totalCostValues[params.row._id] || 0
              : '-'}
          </div>
        );
      },
    },
    {
      field: 'preference_level',
      headerName: 'Level',
      width: 200,
      editable: true,
    },
    {
      field: 'Vendor Type',
      headerName: 'Vendor Type',
      width: 200,
      // editable: true
      renderCell: (params) => {
        let name = vendorData?.find(
          (item) => item?._id == params.row?.vendor_id
        )?.vendor_type;
        let finalName = typeData?.find((item) => item?._id == name)?.type_name;
        return <div>{finalName}</div>;
      },
    },
    {
      field: 'page_catg_id',
      headerName: 'Category',
      width: 200,
      renderCell: (params) => {
        let name = cat?.find(
          (item) => item?._id == params.row?.page_category_id
        )?.page_category;
        return <div>{name}</div>;
      },
    },
    {
      field: 'platform_id',
      headerName: 'Platform',
      renderCell: (params) => {
        let name = platformData?.find(
          (item) => item?._id == params.row.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      width: 150,
    },
    { field: 'page_status', headerName: 'Status', width: 100 },
  ];
  const pageDetailColumn = [
    {
      field: 'm_post_price',
      headerName: 'Cost Per Post',
      width: 150,
      valueGetter: ({ row }) => {
        let mPostPrice = row.m_post_price;
        let postPrice = row.post;
        return postPrice ?? mPostPrice;
      },
    },
    {
      field: 'm_story_price',
      headerName: 'Cost Per Story',
      width: 150,
      valueGetter: ({ row }) => {
        let mStoryPrice = row.m_story_price;
        let storyPrice = row.story;
        return storyPrice ?? mStoryPrice;
      },
    },
    {
      field: 'm_both_price',
      headerName: 'Both Price',
      width: 150,
      valueGetter: ({ row }) => {
        let mBothPrice = row.m_both_price;
        let bothPrice = row.both_;
        return bothPrice ?? mBothPrice;
      },
    },
  ];

  if (!pageStatsAuth || decodedToken?.role_id === 1) {
    dataGridcolumns.push(...pageDetailColumn);
  }
  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));

  if (showPageHealthColumn) {
    // dataGridcolumns.push(...pageHealthColumn);
  }
  useEffect(() => {
    if (selectedRows?.length == 0) {
      setToggleShowBtn(false);
    }
  }, [selectedRows]);

  const handlePlatform = (id) => {
    setActiveTabPlatform(id);
    const platform = pageList?.data?.filter((item) => item.platform_id === id);
    setFilterData(platform);
  };
  useEffect(() => {
    // Fetch user-specific data and page data
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

    // Fetch all necessary data
    getData();
  }, []);

  useEffect(() => {
    // Once pageList data is available, filter based on the active platform and category
    if (pageList) {
      // Filter by platform ID
      let filteredData = pageList?.data?.filter(
        (item) => item.platform_id === activeTabPlatfrom
      );

      // If a category is selected, further filter by page_category_id
      if (selectedCategory) {
        filteredData = filteredData.filter(
          (item) => item.page_category_id === selectedCategory
        );
      }

      // Set the filtered data
      setFilterData(filteredData);
    }
  }, [pageList, activeTabPlatfrom, selectedCategory]);

  return (
    <>
      <div className="tabs">
        <h4>Plan Making</h4>
        <Link to="/admin/pms-plan-upload">Plan Upload</Link>
      </div>

      <div className="content">
        <div className="">
          <div className="card">
            <div className="card-body p0">
              <div className="data_tbl thm_table table-responsive">
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
                    <div className="parent_of_tab" style={{ display: 'flex' }}>
                      {platformData?.map((item) => (
                        <div key={item._id} className="tabs">
                          <button
                            className={
                              activeTabPlatfrom === item._id
                                ? 'active btn btn-info'
                                : 'btn btn-link'
                            }
                            onClick={() => handlePlatform(item._id)}
                          >
                            {item.platform_name}
                          </button>
                        </div>
                      ))}
                    </div>
                    {activeTabPlatfrom === '666818824366007df1df1319' && (
                      <div>
                        <div className="filter-section">
                          {/* Dropdown for price filter type */}
                          <label className="filter-label">Filter by:</label>
                          <select
                            className="filter-dropdown"
                            value={priceFilterType}
                            onChange={(e) => setPriceFilterType(e.target.value)}
                          >
                            <option value="post">Post Price</option>
                            <option value="story">Story Price</option>
                            <option value="both">Both Price</option>
                          </select>

                          {/* Range input for minimum and maximum price */}
                          <label className="filter-label">Min Price:</label>
                          <input
                            type="number"
                            className="filter-input"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <label className="filter-label">Max Price:</label>
                          <input
                            type="number"
                            className="filter-input"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                        {/* Follower Filter Section */}
                        <div className="follower-filter">
                          <label className="filter-label">Min Followers:</label>
                          <input
                            type="number"
                            className="filter-input"
                            value={minFollowers || ''}
                            onChange={(e) => setMinFollowers(e.target.value)}
                          />
                          <label className="filter-label">Max Followers:</label>
                          <input
                            type="number"
                            className="filter-input"
                            value={maxFollowers || ''}
                            onChange={(e) => setMaxFollowers(e.target.value)}
                          />
                          <div>
                            <label htmlFor="follower-filter">
                              Follower Filter
                            </label>
                            <select
                              id="follower-filter"
                              className="filter-dropdown"
                              value={followerFilterType}
                              onChange={handleFollowerRangeChange}
                            >
                              <option value="" disabled>
                                Select Follower Range
                              </option>
                              <option value="lessThan10K">Less than 10k</option>
                              <option value="10Kto20K">10k to 20k</option>
                              <option value="20Kto50K">20k to 50k</option>
                              <option value="50Kto100K">50k to 100k</option>
                              <option value="100Kto200K">100k to 200k</option>
                              <option value="moreThan200K">
                                More than 200k
                              </option>
                            </select>
                          </div>
                          <label htmlFor="categoryFilter">
                            Filter by Category:
                          </label>
                          <select
                            id="categoryFilter"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                          >
                            <option value="">All Categories</option>
                            {cat.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.page_category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <button
                            className="remove-all-button"
                            onClick={handleRemoveFilter}
                          >
                            Remove All Filter
                          </button>
                          {/* Filter button */}
                          <button
                            className="tab-button"
                            onClick={handleCombinedFilter}
                          >
                            Apply Filter
                          </button>
                        </div>
                      </div>
                    )}
                    <Box sx={{ height: 700, width: '100%' }}>
                      <DataGrid
                        title="Page Overview"
                        rows={
                          showOwnPage
                            ? ownPages
                            : toggleShowBtn
                            ? selectedRows
                            : filterData
                        }
                        columns={dataGridcolumns}
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
                        disableRowSelectionOnClick
                      />
                    </Box>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanMaking;
