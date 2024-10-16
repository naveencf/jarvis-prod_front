/* eslint-disable react/prop-types */

import { Box, CircularProgress, Typography } from '@mui/material';

const Filters = ({
  priceFilterType,
  setPriceFilterType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers,
  followerFilterType,
  handleFollowerRangeChange,
  selectedCategory,
  handleCategoryChange,
  cat,
  removeCategory,
  handleRemoveFilter,
  handleCombinedFilter,
  handleFollowersBlur,
  selectAllRows,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="row">
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
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label className="filter-label">Min Followers:</label>
        <input
          type="number"
          className="filter-input form-control"
          value={minFollowers || ''}
          onChange={(e) => setMinFollowers(e.target.value)}
          onBlur={handleFollowersBlur}
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
          onBlur={handleFollowersBlur}
        />
        <p>{formatNumber(maxFollowers)}</p>
      </div>
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label htmlFor="follower-filter">Follower Filter</label>
        <select
          id="follower-filter"
          className="filter-dropdown form-control"
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
          <option value="moreThan200K">More than 200k</option>
        </select>
      </div>
      <div className="form-group col-lg-4 col-md-4 col-sm-12 col-12">
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          className="form-control"
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {cat?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.page_category}
            </option>
          ))}
        </select>
      </div>
      {/* Selected categories as tags */}
      <div className="form-group col-lg-6 col-md-6 col-sm-12 col-12">
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
      </div>
      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="flexCenter colGap12">
          <button
            className="btn cmnbtn btn-outline-danger"
            onClick={handleRemoveFilter}
          >
            Remove All Filter
          </button>
          {/* Filter button */}
          <button className="cmnbtn btn-success" onClick={handleCombinedFilter}>
            Apply Filter
          </button>
          <button className="cmnbtn btn-primary" onClick={selectAllRows}>
            Select All Rows
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
