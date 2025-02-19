import React from 'react';
import { X } from '@phosphor-icons/react';
import Button from '@mui/material/Button';

const SearchAndClear = ({ searchInput, handleSearchChange, clearSearch, clearRecentlySelected, setShowSearchColorRow, showSearchColorRow,handleUnselectPagesWithColor }) => (
  <div>
    <div className="flexCenter colGap12">
      <div className="flexCenter colGap8">
        <div className="input-group primaryInputGroup">
          <input className="form-control" type="text" placeholder="Type values separated by spaces" value={searchInput} onChange={handleSearchChange} />
          <button className="btn btn_sm cmnbtn pl-2 pr-2 btn-outline-primary" type="button" onClick={clearSearch}>
            <X />
          </button>
        </div>
        <Button variant="contained" className="btn btn_sm cmnbtn btn-outline-danger" onClick={clearRecentlySelected}>
          Clear Recently Selected
        </Button>
      </div>
    </div>
    <div className='mt-2 row'>
    <button className="btn btn_sm cmnbtn btn-outline-success" onClick={() => setShowSearchColorRow(!showSearchColorRow)}>
      Select With Color
    </button>
    <button className="btn btn_sm cmnbtn btn-outline-success ml-2" onClick={() => handleUnselectPagesWithColor()}>
     Un-Select With Color
    </button>
    </div>
  </div>
);

export default SearchAndClear;
