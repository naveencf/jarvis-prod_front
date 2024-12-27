import React from 'react';

const CountInputs = ({ postCountDefault, storyCountDefault, handlePostCountChange, handleStoryCountChange, handleUpdateValues }) => (
  <div className="row" style={{ padding: '0.5rem' }}>
    <div className="col">
      <input type="number" className="filter-input form-control hundred" placeholder="Post Count" value={postCountDefault || ''} onChange={handlePostCountChange} />
    </div>
    <div className="col">
      <input type="number" className="filter-input form-control hundred" placeholder="Story Count" value={storyCountDefault || ''} onChange={handleStoryCountChange} />
    </div>
    <div className="row">
      {/* <button  onClick={handleUpdateValues}>
        Update Values
      </button> */}
      <div className="col-6 mt-2">
        <button className="btn btn_sm cmnbtn btn-outline-success" onClick={() => handleUpdateValues('post')}>
          Update Post
        </button>
      </div>
      <div className="col-6 mt-2">
        <button className="btn btn_sm cmnbtn btn-outline-success" onClick={() => handleUpdateValues('story')}>
          Update Story
        </button>
      </div>
    </div>
  </div>
);

export default CountInputs;
