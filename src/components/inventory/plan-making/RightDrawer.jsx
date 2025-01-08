import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';

import { Checks, Sliders, StackMinus, StackPlus, Trash } from '@phosphor-icons/react';
import CustomSelect from '../../ReusableComponents/CustomSelect';
import formatString from '../../../utils/formatString';
import { useDispatch, useSelector } from 'react-redux';
import { setShowRightSlidder } from '../../Store/PageMaster';
import { calculatePrice, parseRange } from './helper';
import { getPriceDetail } from './downloadExcel';
import Swal from 'sweetalert2';

const RightDrawer = ({
  priceFilterType,
  handleStoryCountChange,
  handlePostCountChange,
  storyPerPageValues,
  postCountDefault,
  storyCountDefault,
  setFilterData,
  setPriceFilterType,
  setPostPerPageValues,
  setStoryPerPageValues,
  setShowTotalCost,
  setSelectedRows,
  sendPlanDetails,
  minPrice,
  getTableData,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers,
  selectedFollowers,
  setPageCategoryCount,
  setSelectedFollowers,
  selectedCategory,
  setTotalCostValues,
  cat,
  postPerPageValues,
  tagCategory,
  selectedRows,
  setTagCategory,
  showTotalCost,
  // selectAllRows,
  // deSelectAllRows,
  setSelectedCategory,
  platformData,
  activeTabPlatform,
  handlePlatform,
  pageList,
}) => {
  const [open, setOpen] = useState(false);
  const [customFollowerRange, setCustomFollowerRange] = useState(false);
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
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
  const dispatch = useDispatch();
  // // Prepare categories for CustomSelect
  // const categoryOptions = cat?.map((category) => ({
  //   value: category._id,
  //   label: formatString(category.page_category),
  // }));

  const handleCombinedFilter = () => {
    let filteredData = getTableData;

    if (selectedFollowers?.length) {
      filteredData = applyFollowerRangeFilter(filteredData);
    }

    if (selectedCategory?.length) {
      filteredData = applyCategoryFilter(filteredData);
    }
    if (minPrice != 0 || maxPrice != 0) {
      filteredData = applyPriceFilter(filteredData);
    }
    if (tagCategory?.length) {
      filteredData = applyTagCategoryFilter(filteredData);
    }

    Swal.fire({
      title: 'Success!',
      text: 'Filter applied successfully.',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
    });

    // Uncomment to update filtered data in state

    setFilterData(filteredData);
  };

  const selectAllRows = () => {
    const updatedSelectedRows = [...selectedRows];
    const updatedPostValues = { ...postPerPageValues };
    const updatedStoryValues = { ...storyPerPageValues };
    const updatedShowTotalCost = { ...showTotalCost };
    // Iterate over the table data and update counts and selections
    getTableData.forEach((row) => {
      const isAlreadySelected = updatedSelectedRows.some((selectedRow) => selectedRow._id === row._id);

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

      const finalPostCost = rateType ? postPrice : calculatePrice(row.rate_type, row, 'post');
      const finalStoryCost = rateType ? storyPrice : calculatePrice(row.rate_type, row, 'story');
      const costOfBoth = rateType ? bothPrice : calculatePrice(row.rate_type, row, 'both');

      const costPerPost = finalPostCost || 0;
      const costPerStory = finalStoryCost || 0;

      // function exists to calculate total cost
      calculateTotalCost(row._id, updatedPostValues[row._id], updatedStoryValues[row._id], costPerPost, costPerStory, costOfBoth);

      // Mark this row's cost visibility as 'true'
      updatedShowTotalCost[row._id] = true;

      // Optional: Auto-check this row if needed (commented out in your logic)
      // handleCheckboxChange(row)({ target: { checked: true } });
    });

    // Prepare the plan data to send
    const planxData = updatedSelectedRows.map((row) => {
      const { _id, page_price_list, page_name, rate_type, m_story_price, m_post_price, followers_count } = row;

      const isFixedRate = rate_type === 'fixed';

      const getPrice = (type) => (isFixedRate ? getPriceDetail(page_price_list, `instagram_${type}`) : calculatePrice(rate_type, { m_story_price, m_post_price, followers_count }, type));

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
  const applyFollowerRangeFilter = (data) => {
    if (!selectedFollowers?.length) return data;

    return data.filter((page) =>
      selectedFollowers.some((range) => {
        const { min, max } = parseRange(range);
        return page.followers_count >= min && page.followers_count <= max;
      })
    );
  };

  const applyCategoryFilter = (data) => {
    if (!selectedCategory?.length) return data;

    return data.filter((item) => selectedCategory.includes(item.page_category_id));
  };

  const applyPriceFilter = (data) => {
    return data.filter((page) => {
      let price = 0;

      // Determine price based on filter type
      if (priceFilterType === 'post') {
        price = getPriceDetail(page.page_price_list, 'instagram_post') || 0;
      } else if (priceFilterType === 'story') {
        price = getPriceDetail(page.page_price_list, 'instagram_story') || 0;
      } else if (priceFilterType === 'both') {
        price = getPriceDetail(page.page_price_list, 'instagram_both') || 0;
      }

      // Check if price is within range
      return price >= minPrice && price <= maxPrice;
    });
  };

  const applyTagCategoryFilter = (data) => {
    let filtered;

    if (tagCategory.length > 2) {
      filtered = data.filter((item) => {
        const categoryArray = item.tags_page_category_name?.split(',').map((tag) => tag.trim());
        return tagCategory.every((category) => categoryArray?.includes(category));
      });
    } else {
      filtered = data.filter((item) => {
        return tagCategory.some((category) => item.tags_page_category_name?.includes(category));
      });
    }

    return filtered;
  };

  const handleRemoveFilter = () => {
    const pageData = pageList?.filter((item) => item.followers_count > 0).sort((a, b) => b.followers_count - a.followers_count);
    setFilterData(pageData);
    setSelectedFollowers([]);
    setSelectedCategory([]);
    setTagCategory([]);
    setMinPrice(0);
    setMaxPrice(0);
  };

  const handleTagCategoryChange = (selectedIds) => {
    const selectedNames = selectedIds.map((id) => {
      const category = cat.find((c) => c._id === id);
      return category ? category.page_category : id;
    });
    setTagCategory(selectedNames);
  };

  // Function to calculate count for each category
  const getCategoryCount = (categoryName) => {
    return getTableData?.filter((item) => item.followers_count > 0 && item.page_category_name === categoryName).length;
  };

  // Prepare categories with counts for CustomSelect
  const categoryOptions = cat?.map((category) => {
    const count = getCategoryCount(category.page_category);
    return {
      value: category._id,
      label: `${formatString(category.page_category)} (${count})`,
    };
  });
  const tagCategoryOptions = cat?.map((category) => {
    return {
      value: category._id,
      label: `${formatString(category.page_category)} `,
    };
  });

  const followerOptions = [
    { id: 'lessThan10K', label: 'Less than 10k' },
    { id: '10Kto20K', label: '10k to 20k' },
    { id: '20Kto50K', label: '20k to 50k' },
    { id: '50Kto100K', label: '50k to 100k' },
    { id: '100Kto200K', label: '100k to 200k' },
    { id: '200Kto500K', label: '200k to 500k' },
    { id: '500Kto1000K', label: '500k to 1M' },
    { id: '1000Kto2000K', label: '1M to 2M' },
    { id: '1000KPlus', label: '1M+' },
    { id: '2000KPlus', label: '2M+' },
    // { id: '2000KPlus', label: '2M+' },
    // { id: '2MPlus', label: '2M+' },
  ];
  // console.log('selected', selectedFollowers);
  const removeFollowerSelection = (follower) => {
    setSelectedFollowers(selectedFollowers.filter((f) => f !== follower));
  };
  const showRightSlidder = useSelector((state) => state.pageMaster.showRightSlidder);

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
    dispatch(setShowRightSlidder(!showRightSlidder));
  };

  const drawerList = (
    <>
      <div className="filterWrapper" role="presentation">
        <div className="filterWrapperBody">
          <div className="row">
            <div className="form-group col-12 mb16">
              <CustomSelect
                label="Select Platform"
                fieldGrid="12"
                dataArray={platformData?.map((item) => ({
                  value: item._id,
                  label: formatString(item.platform_name),
                }))}
                optionId="value"
                optionLabel="label"
                selectedId={activeTabPlatform}
                setSelectedId={handlePlatform}
                multiple={true} // Enable multiselect
              />
            </div>

            {/* Follower Filter */}
            <div className="form-group col-12 mb8">
              <label>Follower Filter</label>
              <CustomSelect label="Select Follower Range" fieldGrid="12" dataArray={followerOptions} optionId="id" optionLabel="label" selectedId={selectedFollowers} setSelectedId={setSelectedFollowers} multiple={true} />
            </div>
            {/* Price filter dropdown */}
            <div className="form-group col-12 mb16">
              <label>Filter by:</label>
              <select className="filter-dropdown form-control" value={priceFilterType} onChange={(e) => setPriceFilterType(e.target.value)}>
                <option value="post">Post Price</option>
                <option value="story">Story Price</option>
                <option value="both">Both Price</option>
              </select>
            </div>
            {/* Range input for minimum and maximum price */}
            <div className="form-group col-12 mb16">
              <label className="filter-label flexCenterBetween">
                Min Price: <p>{formatNumber(minPrice)}</p>
              </label>
              <input type="number" className="filter-input form-control" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="form-group col-12 mb16">
              <label className="filter-label flexCenterBetween">
                Max Price: <p>{formatNumber(maxPrice)}</p>
              </label>
              <input type="number" className="filter-input form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>

            {/* Display Selected Followers as Badges */}
            {/* <div className="form-group col-12 mb16">
              {/* <label>Selected Followers:</label> 
              <div className="selectBadge">
                {selectedFollowers.map((follower) => (
                  <div className="selectBadgeItem" key={follower}>
                    {follower.replace(/([A-Z])/g, ' $1').trim()}{' '}
                    {/* Formatting 
                    <button onClick={() => removeFollowerSelection(follower)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Custom Follower Range Inputs */}
            {customFollowerRange && (
              <>
                <div className="form-group col-12 mb16">
                  <label className="filter-label">Min Followers:</label>
                  <input
                    type="number"
                    className="filter-input form-control"
                    value={minFollowers || ''}
                    onChange={(e) => setMinFollowers(e.target.value)}
                    // onBlur={handleFollowersBlur}
                  />
                  <p>{formatNumber(minFollowers)}</p>
                </div>
                <div className="form-group col-12 mb16">
                  <label className="filter-label">Max Followers:</label>
                  <input
                    type="number"
                    className="filter-input form-control"
                    value={maxFollowers || ''}
                    onChange={(e) => setMaxFollowers(e.target.value)}
                    // onBlur={handleFollowersBlur}
                  />
                  <p>{formatNumber(maxFollowers)}</p>
                </div>
              </>
            )}

            {/* Filter by Category */}
            <div className="form-group col-12 mb8">
              {/* <label htmlFor="categoryFilter">Filter by Category:</labellabel> */}
              <CustomSelect fieldGrid="12" label="Filter by Category" dataArray={categoryOptions} optionId="value" optionLabel="label" selectedId={selectedCategory} setSelectedId={setSelectedCategory} multiple={true} />
              <CustomSelect
                fieldGrid="12"
                label="Filter by Tag Category"
                dataArray={tagCategoryOptions}
                optionId="value"
                optionLabel="label"
                selectedId={tagCategory?.map((name) => {
                  const category = cat?.find((c) => c.page_category === name);
                  return category ? category._id : name;
                })}
                setSelectedId={handleTagCategoryChange}
                multiple={true}
              />
            </div>

            {/* Selected categories as tags */}
            {/* <div className="form-group col-12 mb16">
              <div className="selectBadge">
                {selectedCategory?.length > 0 &&
                  selectedCategory?.map((categoryId) => {
                    const category = cat?.find((c) => c._id === categoryId);
                    return (
                      <div className="selectBadgeItem" key={categoryId}>
                        {category.page_category}
                        <button onClick={() => removeCategory(categoryId)}>
                          ×
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div> */}
          </div>
        </div>
        <div className="filterWrapperFooter">
          <div className="row">
            <div className="col-6">
              <input type="number" className="filter-input form-control" placeholder="Post Count" value={postCountDefault || ''} onChange={handlePostCountChange} />
            </div>
            <div className="col-6">
              <input type="number" className="filter-input form-control" placeholder="Story Count" value={storyCountDefault || ''} onChange={handleStoryCountChange} />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flexCenterBetween">
            <button className="btn icon btn-outline-danger" title="Remove All Filter" onClick={handleRemoveFilter}>
              <Trash />{' '}
            </button>
            <button className="btn icon btn-outline-success" title="Apply Filter" onClick={handleCombinedFilter}>
              <Checks />
            </button>
            <button className="btn icon btn-outline-primary" title="Select All Rows" onClick={selectAllRows}>
              <StackPlus />
            </button>
            <button className="btn icon btn-outline-danger" title="Deselect All Rows" onClick={deSelectAllRows}>
              <StackMinus />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <Button className="btn pointer icon" onClick={toggleDrawer(true)} title="Right Sidebar">
        <Sliders />
      </Button>
      <SwipeableDrawer anchor="right" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} disableSwipeToOpen>
        {drawerList}
      </SwipeableDrawer>
    </div>
  );
};

export default RightDrawer;
