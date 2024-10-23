import React, { useMemo, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import {
  Box,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
const LeftSideBar = ({
  totalFollowers,
  totalCost,
  searchInputValue,
  totalPostsPerPage,
  totalPagesSelected,
  totalDeliverables,
  totalStoriesPerPage,
  pageCategoryCount,
  handleToggleBtn,
  selectedRow,
  allrows,
  postCount,
  handleOwnPage,
  category,
  storyPerPage,
  handleSearchChange,
  clearRecentlySelected,
  clearSearch,
  HandleSavePlan,
  ownPages,
  filterData,
  pageList,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);

  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    console.log('type', type);
    setPageDetails(
      selectedRow?.filter((page) => page?.ownership_type === type) || []
    );
    setOpenModal(true); // Open the modal
  };
 
  const formatFollowers = (followers) => `${followers} Followers`;  
  // Function to calculate ownership counts and total costs based on selected rows
  const calculateOwnershipCounts = (
    selectedRow = [],
    postCount = {},
    storyPerPage = {}
  ) =>
    selectedRow
      ?.filter((page) => page && page._id)
      ?.reduce(
        (acc, page) => {
          const postCountForPage = Number(postCount[page._id] || 0);
          const storyCountForPage = Number(storyPerPage[page._id] || 0);
          const totalCost =
            postCountForPage * (page.m_post_price || 0) +
            storyCountForPage * (page.m_story_price || 0);

          if (page.ownership_type === 'Own') {
            acc.own.count += 1;
            acc.own.totalCost += totalCost;
          } else if (page.ownership_type === 'Vendor') {
            acc.vendor.count += 1;
            acc.vendor.totalCost += totalCost;
          } else if (page.ownership_type === 'Solo') {
            acc.solo.count += 1;
            acc.solo.totalCost += totalCost;
          }
          return acc;
        },
        {
          own: { count: 0, totalCost: 0 },
          vendor: { count: 0, totalCost: 0 },
          solo: { count: 0, totalCost: 0 },
        }
      );

  console.log('selectedRow', selectedRow);

  // Memoized calculation of ownership counts for performance optimization
  const ownershipCounts = useMemo(
    () => calculateOwnershipCounts(selectedRow, postCount, storyPerPage),
    [selectedRow, postCount, storyPerPage]
  );
  return (
    <div className="AccountInfo">
      <div className="sales-sidebar">
        <div className="topbarBrand-1">
          <div className="branding">
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </div>
        </div>

        <div className="navbar-nav sidebar">
          <div className="links">
            {/* Repeated sections for Total Metrics */}
            {[
              {
                label: 'Total Followers',
                value: formatFollowers(totalFollowers),
              },
              { label: 'Total Cost', value: totalCost },
              { label: 'Total Posts / Page', value: totalPostsPerPage },
              { label: 'Total Stories / Page', value: totalStoriesPerPage },
              { label: 'Total Deliverable', value: totalDeliverables },
              { label: 'Total Pages', value: totalPagesSelected },
            ].map(({ label, value }, idx) => (
              <div className="nav-item nav-item-single" key={idx}>
                <div className="nav-btn nav-link">
                  <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                    <div className="flexCenter colGap12 border-right">
                      <h6 className="colorMedium">{label}</h6>
                      <h6 className="colorDark">{value}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Category Count */}
            <div className="nav-item nav-item-single">
              <div className="row pl16 pr16 border-bottom">
                {Object.entries(pageCategoryCount).map(
                  ([categoryId, count]) => {
                    const categoryName =
                      category?.find((item) => item._id === categoryId)
                        ?.page_category || 'Unknown';

                    return (
                      <div
                        className="col-lg-3 col-md-4 col-sm-6 col-12"
                        key={categoryId}
                      >
                        <div>
                          <div className="flexCenter colGap14">
                            <div
                              className="iconBadge small bgPrimaryLight m-0"
                              onClick={handleToggleBtn}
                            >
                              <h5>{count}</h5>
                            </div>
                            <div>
                              <h6 className="colorMedium">Category</h6>
                              <h6 className="mt4 fs_16">{categoryName}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Own Remaining Pages */}
            <div className="nav-item nav-item-single">
              <div className="row p16 border-bottom">
                <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                  <div onClick={handleOwnPage}>
                    <div className="flexCenter colGap14">
                      <div className="iconBadge small bgPrimaryLight m-0">
                        <h5>
                          {Math.max(ownPages?.length - selectedRow?.length, 0)}
                        </h5>
                      </div>
                      <div>
                        <h6 className="colorMedium">Own Remaining Pages</h6>
                        <h6 className="mt4">
                          {Math.max(ownPages?.length - selectedRow?.length, 0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Types */}
            <div className="nav-item nav-item-single">
              <div className="row p16">
                {['own', 'vendor', 'solo'].map((type) => (
                  <div className="col-lg-4 col-md-4 col-sm-6 col-12" key={type}>
                    <div onClick={handleOwnPage}>
                      <div className="flexCenter colGap14">
                        <div
                          className="iconBadge small bgInfoLight m-0"
                          onClick={() =>
                            handleOpenModal(
                              type.charAt(0).toUpperCase() + type.slice(1) // Open modal for ownership type
                            )
                          }
                        >
                          <ArrowUpRight />
                        </div>
                        <div>
                          <h6>
                            {type.charAt(0).toUpperCase() + type.slice(1)} Pages
                            : {ownershipCounts[type]?.count || 0}
                          </h6>
                          <h6 className="mt4">
                            Total Post & Story Cost : ₹{' '}
                            {ownershipCounts[type]?.totalCost || 0}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for displaying page details */}
      <Modal
        open={openModal} // Control modal open state
        onClose={() => setOpenModal(false)} // Close modal handler
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Close button for modal */}
          <Button
            onClick={() => setOpenModal(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            Close
          </Button>

          <Typography id="modal-title" variant="h6" component="h2">
            Page Details
          </Typography>

          {/* Table to display page details */}
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 300, overflowY: 'auto' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Page Name</TableCell>
                  <TableCell>Ownership Type</TableCell>
                  <TableCell>Followers</TableCell>
                  <TableCell>Post Count</TableCell>
                  <TableCell>Story Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(pageDetails || [])?.map((page, index) => (
                  <TableRow key={page?._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{page?.page_name || 'N/A'}</TableCell>
                    <TableCell>{page?.ownership_type || 'Unknown'}</TableCell>
                    <TableCell>{page?.followers_count || 0}</TableCell>
                    <TableCell>{postCount?.[page?._id] || 0}</TableCell>
                    <TableCell>{storyPerPage?.[page?._id] || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
};

export default LeftSideBar;
