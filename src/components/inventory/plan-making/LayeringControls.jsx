import React from 'react';
import { TbVersions } from 'react-icons/tb';
import { FaRegStopCircle, FaStopCircle } from 'react-icons/fa';
import { ImPrevious, ImNext, ImCross } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { setModalType, setOpenShowAddModal } from '../../Store/PageMaster';
import { Autocomplete, TextField } from '@mui/material';
import formatString from '../../../utils/formatString';

const LayeringControls = ({ categoryData, handleOptionChange, layering, toggleUncheckdPages, setLayering, ButtonTitle, handleDisableBack, disableBack, handleOpenPlanVersion }) => {
  const dispatch = useDispatch();

  const handleOpenPageModal = (type) => {
    dispatch(setOpenShowAddModal());
    dispatch(setModalType(type));
  };

  return (
    <div className="flexCenter colGap12">
      <button className="icon" onClick={handleOpenPlanVersion} title="History">
        <TbVersions />
      </button>
      <button className="icon" onClick={toggleUncheckdPages} title="History">
        <ImCross />
      </button>

      <button className="icon" onClick={handleDisableBack} title="Disable Back">
        {!disableBack ? <FaRegStopCircle /> : <FaStopCircle />}
      </button>
      <button className="icon" onClick={() => setLayering(layering - 1)} title={ButtonTitle[(layering - 1) % 5]} disabled={layering <= 1}>
        {layering > 1 && <ImPrevious />}
      </button>
      <button className="icon" onClick={() => setLayering(layering + 1)} title={ButtonTitle[(layering + 1) % 6]} disabled={layering >= 8}>
        {layering <= 7 && <ImNext />}
      </button>
      <label>{ButtonTitle[layering]}</label>
      <div style={{ width: '12rem' }}>
        <Autocomplete options={categoryData} getOptionLabel={(option) => formatString(option.page_category) || ''} isOptionEqualToValue={(option, value) => option._id === value._id} onChange={handleOptionChange} renderInput={(params) => <TextField {...params} label="Select a Category" variant="outlined" />} />
      </div>
      <button className="btn cmnbtn btn-primary btn_sm" onClick={() => handleOpenPageModal('Category')}>
        Add Category
      </button>
    </div>
  );
};

export default LayeringControls;
