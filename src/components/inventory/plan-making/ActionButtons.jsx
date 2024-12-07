import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { CiWarning, CiStickyNote } from 'react-icons/ci';
import { BiSelectMultiple, BiSolidSelectMultiple } from 'react-icons/bi';

const ActionButtons = ({ handleUnselectPages, handleOpenDialog, handleOpenModal, toggleCheckedRows, showCheckedRows }) => (
  <div className="flexCenter colGap12">
    <button className="icon" onClick={handleUnselectPages} title="Unselected Pages">
      <MdCheckBoxOutlineBlank />
    </button>
    <button className="icon" onClick={handleOpenDialog} title="Unfetched Pages">
      <CiWarning />
    </button>
    <button className="icon" onClick={handleOpenModal} title="Internal-Notes">
      <CiStickyNote />
    </button>
    <button className="icon" title="Selected Rows" onClick={toggleCheckedRows}>
      {!showCheckedRows ? <BiSelectMultiple /> : <BiSolidSelectMultiple />}
    </button>
  </div>
);

export default ActionButtons;
