/* eslint-disable react/prop-types */

import { useState } from 'react';
import CustomSelect from '../../ReusableComponents/CustomSelect';

const Filters = ({
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
  setSelectedCategory,
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
}) => {
  const [customFollowerRange, setCustomFollowerRange] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const handleFollowerSelection = (e) => {
    const value = e.target.value;

    if (value === 'custom') {
      setCustomFollowerRange(true);
      setSelectedFollowers([]);
      return;
    }

    if (selectedFollowers.includes(value)) {
      setCustomFollowerRange(false);
      setSelectedFollowers(selectedFollowers.filter((f) => f !== value));
    } else {
      setCustomFollowerRange(false);
      setSelectedFollowers([...selectedFollowers, value]);
    }
  };

  const removeFollowerSelection = (follower) => {
    setSelectedFollowers(selectedFollowers.filter((f) => f !== follower));
  };
  // Prepare categories for CustomSelect
  const categoryOptions = cat?.map((category) => ({
    value: category._id,
    label: category.page_category,
  }));

  const followerOptions = [
    { id: 'lessThan10K', label: 'Less than 10k' },
    { id: '10Kto20K', label: '10k to 20k' },
    { id: '20Kto50K', label: '20k to 50k' },
    { id: '50Kto100K', label: '50k to 100k' },
    { id: '100Kto200K', label: '100k to 200k' },
    { id: '200Kto500K', label: '200k to 500k' },
    { id: '500Kto1000K', label: '500k to 1M' },
  ];
  return (
    <div className="row">
      {/* Price filter dropdown */}
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
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
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label className="filter-label">Min Price:</label>
        <input
          type="number"
          className="filter-input form-control"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <p>{formatNumber(minPrice)}</p>
      </div>
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label className="filter-label">Max Price:</label>
        <input
          type="number"
          className="filter-input form-control"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <p>{formatNumber(maxPrice)}</p>
      </div>

      {/* Follower Filter */}
      <div className="form-group col-lg-12col-md-12 col-sm-12 col-12">
        <label>Follower Filter</label>
        <CustomSelect
          label="Select Follower Range"
          dataArray={followerOptions}
          optionId="id"
          optionLabel="label"
          selectedId={selectedFollowers}
          setSelectedId={setSelectedFollowers}
          multiple={true}
        />
      </div>

      {/* Custom Follower Range Inputs */}
      {customFollowerRange && (
        <>
          <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
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
          <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
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

      {/* Display Selected Followers as Badges */}
      {/* <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label>Selected Followers:</label>
        <div className="selectBadge">
          {selectedFollowers.map((follower) => (
            <div className="selectBadgeItem" key={follower}>
              {follower.replace(/([A-Z])/g, ' $1').trim()}  {/* Formatting */}
      {/* <button onClick={() => removeFollowerSelection(follower)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Filter by Category */}
      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-12">
        <label htmlFor="categoryFilter">Category Filter</label>
        <CustomSelect
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
      {/* <div className="form-group col-lg-6 col-md-6 col-sm-12 col-12">
        <label>&nbsp;</label>
        <div className="selectBadge">
          {selectedCategory?.length > 0 &&
            selectedCategory?.map((categoryId) => {
              const category = cat?.find((c) => c._id === categoryId);
              return (
                <div className="selectBadgeItem" key={categoryId}>
                  {category.page_category}
                  <button onClick={() => removeCategory(categoryId)}>×</button>
                </div>
              );
            })}
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="flexCenter colGap12">
          <button
            className="btn cmnbtn btn-outline-danger"
            onClick={handleRemoveFilter}
          >
            Remove All Filter
          </button>
          <button className="cmnbtn btn-success" onClick={handleCombinedFilter}>
            Apply Filter
          </button>
          <button className="cmnbtn btn-primary" onClick={selectAllRows}>
            Select All Rows
          </button>
          <button className="cmnbtn btn-danger" onClick={deSelectAllRows}>
            Deselect All Rows
          </button>
          <input
            type="number"
            className="filter-input form-contro"
            placeholder="Post Count"
            value={postCountDefault || ''}
            onChange={handlePostCountChange}
          />
          <input
            type="number"
            className="filter-input form-contro"
            placeholder="Story Count"
            value={storyCountDefault || ''}
            onChange={handleStoryCountChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
