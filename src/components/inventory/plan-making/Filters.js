import React from 'react';

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
  handleFollowersBlur,
  selectedCategory,
  handleCategoryChange,
  removeCategory,
  cat,
  handleRemoveFilter,
  handleCombinedFilter,
}) => {
  return (
    <div className="card mt24">
      <div className="card-body row">
        {/* Price Filter */}
        <div className="form-group col-4">
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

        {/* Min Price */}
        <div className="form-group col-4">
          <label className="filter-label">Min Price:</label>
          <input
            type="number"
            className="filter-input form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div className="form-group col-4">
          <label className="filter-label">Max Price:</label>
          <input
            type="number"
            className="filter-input form-control"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Min Followers */}
        <div className="form-group col-4">
          <label className="filter-label">Min Followers:</label>
          <input
            type="number"
            className="filter-input form-control"
            value={minFollowers || ''}
            onChange={(e) => setMinFollowers(e.target.value)}
            onBlur={handleFollowersBlur}
          />
        </div>

        {/* Max Followers */}
        <div className="form-group col-4">
          <label className="filter-label">Max Followers:</label>
          <input
            type="number"
            className="filter-input form-control"
            value={maxFollowers || ''}
            onChange={(e) => setMaxFollowers(e.target.value)}
            onBlur={handleFollowersBlur}
          />
        </div>

        {/* Follower Range Filter */}
        <div className="form-group col-4">
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

        {/* Category Filter */}
        <div className="form-group col-4">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            className="form-control"
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

        {/* Selected Categories */}
        <div className="form-group col-12" style={{ marginTop: '10px' }}>
          {selectedCategory?.length > 0 &&
            selectedCategory?.map((categoryId) => {
              const category = cat?.find((c) => c._id === categoryId);
              return (
                <div
                  key={categoryId}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e0e0',
                    padding: '5px 10px',
                    margin: '5px',
                    borderRadius: '20px',
                    position: 'relative',
                  }}
                >
                  {category.page_category}
                  <button
                    onClick={() => removeCategory(categoryId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      marginLeft: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      position: 'absolute',
                      top: '0',
                      right: '0',
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
        </div>

        {/* Filter Buttons */}
        <div className="form-group col-12">
          <button
            className="btn btn-outline-danger mr-2"
            onClick={handleRemoveFilter}
          >
            Remove All Filters
          </button>
          <button className="btn btn-success" onClick={handleCombinedFilter}>
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
