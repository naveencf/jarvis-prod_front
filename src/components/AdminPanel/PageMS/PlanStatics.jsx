/* eslint-disable react/prop-types */
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
  ListItem,
  List,
} from '@mui/material';
import { useState, useMemo } from 'react';
import './Tagcss.css';
import * as XLSX from 'xlsx';

// Function to get the platform name based on the platform ID
const getPlatformName = (platformId) => {
  const platformMap = {
    '666818824366007df1df1319': 'Instagram',
    '666818a44366007df1df1322': 'Facebook',
    '666856d34366007df1dfacf6': 'YouTube',
    '666818c34366007df1df1328': 'Twitter',
    '666856e04366007df1dfacfc': 'Snapchat',
  };
  return platformMap[platformId] || 'Unknown';
};

// Function to calculate ownership counts and total costs based on selected rows
const calculateOwnershipCounts = (selectedRow, postCount, storyPerPage) =>
  selectedRow?.reduce(
    (acc, page) => {
      const postCountForPage = postCount[page._id] || 0;
      const storyCountForPage = storyPerPage[page._id] || 0;
      const totalCost =
        postCountForPage * page.m_post_price +
        storyCountForPage * page.m_story_price;

      // Update the ownership counts and total costs based on the ownership type
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
      return acc; // Return the accumulator for the next iteration
    },
    {
      own: { count: 0, totalCost: 0 }, // Initial counts for 'Own' type
      vendor: { count: 0, totalCost: 0 }, // Initial counts for 'Vendor' type
      solo: { count: 0, totalCost: 0 }, // Initial counts for 'Solo' type
    }
  );

// Function to download selected data as an Excel file
const downloadExcel = (selectedRow, category, postCount, storyPerPage) => {
  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const overviewData = []; // Array to hold overview data for the Excel sheet
  let totalInstagramPages = 0; // Counter for total Instagram pages

  const platforms = ['Instagram', 'Facebook', 'YouTube', 'Twitter', 'Snapchat'];
  platforms.forEach((platform) => {
    const platformData = selectedRow?.filter(
      (page) => getPlatformName(page.platform_id) === platform // Filter data for the current platform
    );
    if (!platformData?.length) return; // Skip if there is no data for the platform

    // Handling Instagram platform separately to categorize by page category
    if (platform === 'Instagram') {
      const categories = platformData.reduce((acc, page) => {
        const categoryId = page.page_category_id; // Get the category ID of the page
        const categoryName =
          category?.find((cat) => cat._id === categoryId)?.page_category ||
          'Unknown'; // Get the category name or default to 'Unknown'
        acc[categoryName] = acc[categoryName] || []; // Initialize array if not present
        acc[categoryName].push({
          SNo: acc[categoryName].length + 1,
          'User Name': page.page_name,
          'Profile Link': page.page_link,
          Followers: page.followers_count,
          'Post Count': postCount[page._id] || 0,
          'Story Count': storyPerPage[page._id] || 0,
        });
        return acc; // Return the accumulator for the next iteration
      }, {});

      // Append each category sheet to the workbook
      Object.entries(categories).forEach(([categoryName, categoryData]) => {
        const categorySheet = XLSX.utils.json_to_sheet(categoryData); // Convert category data to a sheet
        XLSX.utils.book_append_sheet(workbook, categorySheet, categoryName); // Append to workbook
        overviewData.push({
          SNo: overviewData.length + 1,
          Description: `Post on ${categoryName} Pages`,
          Platform: 'Instagram',
          Count: categoryData.length,
        });
        totalInstagramPages += categoryData.length; // Count total Instagram pages
      });
    } else {
      // Handle other platforms
      const platformSheetData = platformData.map((page, index) => ({
        SNo: index + 1,
        'Page Name': page.page_name,
        Followers: page.followers_count,
        'Post Count': postCount[page._id] || 0,
        'Story Count': storyPerPage[page._id] || 0,
      }));
      const platformSheet = XLSX.utils.json_to_sheet(platformSheetData); // Convert platform data to a sheet
      XLSX.utils.book_append_sheet(workbook, platformSheet, platform); // Append to workbook
      overviewData.push({
        SNo: overviewData.length + 1,
        Description: `Post on ${platform} Pages`,
        Platform: platform,
        Count: platformData.length,
      });
    }
  });

  // Add GST and total to the overview data
  overviewData.push(
    { SNo: '', Description: 'GST (18%)', Platform: '', Count: '' },
    { SNo: '', Description: 'Total', Platform: '', Count: totalInstagramPages }
  );
  const overviewSheet = XLSX.utils.json_to_sheet(overviewData); // Convert overview data to a sheet
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview'); // Append to workbook

  // Write the workbook to a file
  XLSX.writeFile(workbook, 'Plan_Statistics.xlsx');
};

const PlanStatics = ({
  totalFollowers,
  totalCost,
  totalPostsPerPage,
  totalPagesSelected,
  totalDeliverables,
  totalStoriesPerPage,
  pageCategoryCount,
  handleToggleBtn,
  selectedRow,
  totalRecord,
  allrows,
  postCount,
  handleShowAll,
  handleOwnPage,
  category,
  storyPerPage,
}) => {
  const [openModal, setOpenModal] = useState(false); // State for controlling the modal visibility
  const [pageDetails, setPageDetails] = useState([]); // State for holding details of selected pages

  // Memoized calculation of ownership counts for performance optimization
  const ownershipCounts = useMemo(
    () => calculateOwnershipCounts(selectedRow, postCount, storyPerPage),
    [selectedRow, postCount, storyPerPage]
  );

  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    setPageDetails(selectedRow?.filter((page) => page.ownership_type === type)); // Filter pages by ownership type
    setOpenModal(true); // Open the modal
  };

  // Filter all rows to get only 'Own' type pages
  const ownPages = allrows?.filter((item) => item?.ownership_type === 'Own');

  return (
    <div>
      {/* Button to download Excel report */}
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          downloadExcel(selectedRow, category, postCount, storyPerPage)
        }
        sx={{ mt: 2 }} // Margin top for spacing
      >
        Download Excel
      </Button>
      <Box sx={{ padding: 2 }}>
        {/* Display summary information */}
        <Typography>
          Total Followers: {totalFollowers} || Total Cost: {totalCost} || Total
          Posts Per Page: {totalPostsPerPage} || Total Stories Per Page:{' '}
          {totalStoriesPerPage} || Total Deliverable: {totalDeliverables} ||
          Total Pages: {totalPagesSelected}
        </Typography>
        <div className="list-container-plan-making">
          <List>
            {/* Render each category with its count */}
            {Object.entries(pageCategoryCount)?.map(([categoryId, count]) => {
              const categoryName =
                category?.find((item) => item?._id === categoryId)
                  ?.page_category || 'Unknown'; // Get category name or default to 'Unknown'
              return (
                <ListItem key={categoryId} sx={{ width: '91.8%' }}>
                  <Typography sx={{ width: '91.8%' }}>
                    Category: {categoryName} {' || '}
                    Count:{' '}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleToggleBtn}
                      sx={{ ml: 2 }}
                    >
                      {count}
                    </Button>
                  </Typography>
                </ListItem>
              );
            })}
          </List>
          <List>
            {/* Display remaining pages */}
            <ListItem>
              <Typography sx={{ width: '84%' }}>
                Total Remaining Pages:
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleShowAll} // Show all pages handler
                >
                  {totalRecord?.total_records - selectedRow?.length}
                </Button>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography sx={{ width: '84%' }}>
                Own Remaining Pages:
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleOwnPage} // Own pages handler
                >
                  {ownPages?.length - selectedRow?.length}
                </Button>
              </Typography>
            </ListItem>
            {/* Render ownership types with counts and details button */}
            {['own', 'vendor', 'solo'].map((type) => (
              <ListItem key={type}>
                <Typography sx={{ width: '84%' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Pages:{' '}
                  {ownershipCounts[type].count} {' || '} Total Post and Story
                  Cost: ₹{ownershipCounts[type].totalCost}
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ ml: 2 }} // Margin left for spacing
                    onClick={() =>
                      handleOpenModal(
                        type.charAt(0).toUpperCase() + type.slice(1) // Open modal for ownership type
                      )
                    }
                  >
                    View Details
                  </Button>
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </Box>

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
                {pageDetails?.map((page, index) => (
                  <TableRow key={page._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{page.page_name}</TableCell>
                    <TableCell>{page.ownership_type}</TableCell>
                    <TableCell>{page.followers_count}</TableCell>
                    <TableCell>{postCount[page._id] || 0}</TableCell>
                    <TableCell>{storyPerPage[page._id] || 0}</TableCell>
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

export default PlanStatics;
