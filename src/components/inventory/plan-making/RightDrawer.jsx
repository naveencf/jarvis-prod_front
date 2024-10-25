import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {
  Checks,
  Sliders,
  StackMinus,
  StackPlus,
  Trash,
} from '@phosphor-icons/react';
import CustomSelect from '../../ReusableComponents/CustomSelect';

const RightDrawer = ({
  priceFilterType,
  handleStoryCountChange,
  handlePostCountChange,
  postCountDefault,
  storyCountDefault,
  setPriceFilterType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers,
  selectedFollowers,
  setSelectedFollowers,
  selectedCategory,
  handleCategoryChange,
  cat,
  removeCategory,
  handleRemoveFilter,
  handleCombinedFilter,
  selectAllRows,
  deSelectAllRows,
  setSelectedCategory,
  platformData,
  activeTabPlatform,
  handlePlatform,
}) => {
  const [open, setOpen] = useState(false);
  const [customFollowerRange, setCustomFollowerRange] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };
  // Prepare categories for CustomSelect
  const categoryOptions = cat?.map((category) => ({
    value: category._id,
    label: category.page_category,
  }));

  const handleFollowerSelection = (e) => {
    const value = e.target.value;

    if (value === 'custom') {
      setCustomFollowerRange(true);
      setSelectedFollowers([]);
      return;
    }

    if (selectedFollowers?.includes(value)) {
      setCustomFollowerRange(false);
      setSelectedFollowers(selectedFollowers.filter((f) => f !== value));
    } else {
      setCustomFollowerRange(false);
      setSelectedFollowers([...selectedFollowers, value]);
    }
  };

  const followerOptions = [
    { id: 'lessThan10K', label: 'Less than 10k' },
    { id: '10Kto20K', label: '10k to 20k' },
    { id: '20Kto50K', label: '20k to 50k' },
    { id: '50Kto100K', label: '50k to 100k' },
    { id: '100Kto200K', label: '100k to 200k' },
    { id: '200Kto500K', label: '200k to 500k' },
    { id: '500Kto1000K', label: '500k to 1M' },
  ];

  const removeFollowerSelection = (follower) => {
    setSelectedFollowers(selectedFollowers.filter((f) => f !== follower));
  };

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
  };

  const drawerList = (
    <>
      <div className="filterWrapper" role="presentation">
        <div className="filterWrapperBody">
          <div className="row">
            <div className="form-group col-12 mb16">
              <div className="dropdown w-100">
                <select
                  value={activeTabPlatform}
                  onChange={(e) => handlePlatform(e.target.value)}
                  className="form-select form-control"
                >
                  {platformData?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.platform_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Price filter dropdown */}
            <div className="form-group col-12 mb16">
              <label>Filter by:</label>
              <select
                className="filter-dropdown form-control"
                value={priceFilterType}
                onChange={(e) => setPriceFilterType(e.target.value)}
              >
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
              <input
                type="number"
                className="filter-input form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="form-group col-12 mb16">
              <label className="filter-label flexCenterBetween">
                Max Price: <p>{formatNumber(maxPrice)}</p>
              </label>
              <input
                type="number"
                className="filter-input form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Follower Filter */}
            <div className="form-group col-12 mb8">
              <label>Follower Filter</label>
              <CustomSelect
                label="Select Follower Range"
                fieldGrid="12"
                dataArray={followerOptions}
                optionId="id"
                optionLabel="label"
                selectedId={selectedFollowers}
                setSelectedId={setSelectedFollowers}
                multiple={true}
              />
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
              <label htmlFor="categoryFilter">Filter by Category:</label>
              <CustomSelect
                fieldGrid="12"
                label="Filter by Category"
                dataArray={categoryOptions}
                optionId="value"
                optionLabel="label"
                selectedId={selectedCategory}
                setSelectedId={setSelectedCategory}
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
              <input
                type="number"
                className="filter-input form-control"
                placeholder="Post Count"
                value={postCountDefault || ''}
                onChange={handlePostCountChange}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                className="filter-input form-control"
                placeholder="Story Count"
                value={storyCountDefault || ''}
                onChange={handleStoryCountChange}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flexCenterBetween">
            <button
              className="btn icon btn-outline-danger"
              title="Remove All Filter"
              onClick={handleRemoveFilter}
            >
              <Trash />
            </button>
            <button
              className="btn icon btn-outline-success"
              title="Apply Filter"
              onClick={handleCombinedFilter}
            >
              <Checks />
            </button>
            <button
              className="btn icon btn-outline-primary"
              title="Select All Rows"
              onClick={selectAllRows}
            >
              <StackPlus />
            </button>
            <button
              className="btn icon btn-outline-danger"
              title="Deselect All Rows"
              onClick={deSelectAllRows}
            >
              <StackMinus />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <Button className="btn pointer icon" onClick={toggleDrawer(true)}>
        <Sliders />
      </Button>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen
      >
        {drawerList}
      </SwipeableDrawer>
    </div>
  );
};

export default RightDrawer;
