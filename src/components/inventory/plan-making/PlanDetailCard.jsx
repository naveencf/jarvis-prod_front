import {
  MdCheckBoxOutlineBlank,
  CiWarning,
  CiStickyNote,
  BiSelectMultiple,
  BiSolidSelectMultiple,
  X,
  FaRegStopCircle,
  FaStopCircle,
  TbVersions,
  ImPrevious,
  ImNext,
} from 'react-icons/all';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CustomTableV2 from './CustomTableV2';
import RightDrawer from './RightDrawer';
import PlanVersions from './PlanVersions';

const PlanDetailsCard = ({
  toggleCheckedRows,
  handleUnselectPages,
  handleOpenDialog,
  handleOpenModal,
  showCheckedRows,
  displayPercentage,
  pageList,
  handlePostCountChange,
  postCountDefault,
  handleStoryCountChange,
  storyCountDefault,
  handleUpdateValues,
  handleSearchChange,
  searchInput,
  clearSearch,
  clearRecentlySelected,
  handleOpenPlanVersion,
  handleDisableBack,
  disableBack,
  layering,
  setLayering,
  ButtonTitle,
  openVersionModal,
  versionDetails,
  handleVersionClose,
  handleVersionSelect,
  isPageListLoading,
  dataGridColumns,
  tableData,
  setGetTableData,
  handleKeyPress,
  ...rightDrawerProps
}) => {
  return (
    <div className="card">
      {/* Header Section */}
      <div className="card-header flexCenterBetween">
        <div className="flexCenter colGap12">
          {/* Action Buttons */}
          <button
            className="icon"
            onClick={handleUnselectPages}
            title="Unselected Pages"
          >
            <MdCheckBoxOutlineBlank />
          </button>
          <button
            className="icon"
            onClick={handleOpenDialog}
            title="Unfetched Pages"
          >
            <CiWarning />
          </button>
          <button
            className="icon"
            onClick={handleOpenModal}
            title="Internal-Notes"
          >
            <CiStickyNote />
          </button>
          <button
            className="icon"
            title="Selected Rows"
            onClick={toggleCheckedRows}
          >
            {!showCheckedRows ? (
              <BiSelectMultiple />
            ) : (
              <BiSolidSelectMultiple />
            )}
          </button>

          {/* Display Progress */}
          {pageList && (
            <div className="flexCenter icon">
              <CircularProgress
                variant="determinate"
                value={displayPercentage}
                sx={{ position: 'absolute' }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: 'primary.main',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                {`${displayPercentage}%`}
              </Typography>
            </div>
          )}
        </div>

        {/* Filter Inputs */}
        <div className="row" style={{ padding: '0.5rem' }}>
          <div className="col">
            <input
              type="number"
              className="filter-input form-control hundred"
              placeholder="Post Count"
              value={postCountDefault || ''}
              onChange={handlePostCountChange}
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="filter-input form-control hundred"
              placeholder="Story Count"
              value={storyCountDefault || ''}
              onChange={handleStoryCountChange}
            />
          </div>
          <div className="col">
            <button
              className="btn btn_sm cmnbtn btn-outline-success"
              onClick={handleUpdateValues}
            >
              Update Values
            </button>
          </div>
        </div>

        {/* Search & Right Drawer */}
        <div className="flexCenter colGap12">
          <div className="flexCenter colGap8">
            <div className="input-group primaryInputGroup">
              <input
                className="form-control"
                type="text"
                placeholder="Type values separated by spaces"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <button
                className="btn btn_sm cmnbtn pl-2 pr-2 btn-outline-primary"
                type="button"
                id="button-addon2"
                onClick={clearSearch}
              >
                <X />
              </button>
            </div>
            <Button
              variant="contained"
              className="btn btn_sm cmnbtn btn-outline-danger"
              onClick={clearRecentlySelected}
            >
              Clear Recently Selected
            </Button>
          </div>
          <div>
            <RightDrawer {...rightDrawerProps} />
          </div>
        </div>
      </div>

      {/* Secondary Header Section */}
      <div className="card-header flexCenterBetween">
        <div className="flexCenter colGap12">
          <button
            className="icon"
            onClick={handleOpenPlanVersion}
            title="History"
          >
            <TbVersions />
          </button>
          <button
            className="icon"
            onClick={handleDisableBack}
            title="Disable Back"
          >
            {!disableBack ? <FaRegStopCircle /> : <FaStopCircle />}
          </button>
          <button
            className="icon"
            onClick={() => setLayering(layering - 1)}
            title={ButtonTitle[(layering - 1) % 5]}
            disabled={layering <= 1}
          >
            {layering > 1 && <ImPrevious />}
          </button>
          <button
            className="icon"
            onClick={() => setLayering(layering + 1)}
            title={ButtonTitle[(layering + 1) % 6]}
            disabled={layering >= 5}
          >
            {layering < 5 && <ImNext />}
          </button>
          <label>{ButtonTitle[layering]}</label>
        </div>
      </div>

      {/* Plan Versions */}
      <PlanVersions
        handleVersionClose={handleVersionClose}
        openVersionModal={openVersionModal}
        versionDetails={versionDetails}
        onVersionSelect={handleVersionSelect}
      />

      {/* Table Section */}
      <div className="card-body p0" onKeyDown={(e) => handleKeyPress(e)}>
        <div className="thmTable">
          <Box sx={{ height: 700, width: '100%' }}>
            <CustomTableV2
              dataLoading={isPageListLoading}
              columns={dataGridColumns}
              data={tableData}
              Pagination={[100, 200]}
              tableName={'PlanMakingDetails'}
              getFilteredData={setGetTableData}
            />
          </Box>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsCard;
