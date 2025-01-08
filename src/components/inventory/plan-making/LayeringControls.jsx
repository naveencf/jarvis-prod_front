import React from 'react';
import { TbVersions } from 'react-icons/tb';
import { FaRegStopCircle, FaStopCircle } from 'react-icons/fa';
import { ImPrevious, ImNext, ImCross } from 'react-icons/im';

const LayeringControls = ({ layering, toggleUncheckdPages, setLayering, ButtonTitle, handleDisableBack, disableBack, handleOpenPlanVersion }) => (
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
  </div>
);

export default LayeringControls;
