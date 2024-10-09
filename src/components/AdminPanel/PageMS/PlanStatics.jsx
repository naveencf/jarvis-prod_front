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
import '../../../components/AdminPanel/PageMS/Tagcss.css';
import * as XLSX from 'xlsx';
import ExcelPreviewModal from './ExcelPreviewModal';

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
  let totalPostsAndStories = 0;
  let totalCost = 0;

  const platforms = ['Instagram', 'Facebook', 'YouTube', 'Twitter', 'Snapchat'];

  platforms.forEach((platform) => {
    const platformData = selectedRow?.filter(
      (page) => getPlatformName(page.platform_id) === platform // Filter data for the current platform
    );
    if (!platformData?.length) return; // Skip if there is no data for the platform

    // Variable to store total posts and stories count per platform
    let platformTotalPostsAndStories = 0;

    // Handling Instagram platform separately to categorize by page category
    if (platform === 'Instagram') {
      const categories = platformData.reduce((acc, page) => {
        const categoryId = page.page_category_id; // Get the category ID of the page
        const categoryName =
          category?.find((cat) => cat._id === categoryId)?.page_category ||
          'Unknown'; // Get the category name or default to 'Unknown'
        acc[categoryName] = acc[categoryName] || []; // Initialize array if not present

        // Ensure post and story counts are treated as numbers
        const postCountValue = Number(postCount[page._id]) || 0; // Convert to number
        const storyCountValue = Number(storyPerPage[page._id]) || 0; // Convert to number

        acc[categoryName].push({
          SNo: acc[categoryName].length + 1,
          'User Name': page.page_name,
          'Profile Link': page.page_link,
          Followers: page.followers_count,
          'Post Count': postCountValue,
          'Story Count': storyCountValue,
        });

        // Add to platform and overall totals for posts and stories
        platformTotalPostsAndStories += postCountValue + storyCountValue;
        totalPostsAndStories += postCountValue + storyCountValue;

        // Calculate total cost
        totalCost +=
          postCountValue * page.m_post_price +
          storyCountValue * page.m_story_price;
        return acc; // Return the accumulator for the next iteration
      }, {});

      // Append each category sheet to the workbook
      Object.entries(categories).forEach(([categoryName, categoryData]) => {
        const categorySheet = XLSX.utils.json_to_sheet(categoryData); // Convert category data to a sheet
        addHyperlinksAndAdjustWidths(categorySheet, categoryData); // Add hyperlinks and adjust column widths
        applyCellStyles(categorySheet, categoryData); // Apply cell styles
        XLSX.utils.book_append_sheet(workbook, categorySheet, categoryName); // Append to workbook
        // Calculate category total cost
        const categoryTotalCost = categoryData.reduce((acc, item) => {
          const page = platformData.find(
            (p) => p.page_name === item['User Name']
          );
          const postCountValue = Number(postCount[page._id]) || 0;
          const storyCountValue = Number(storyPerPage[page._id]) || 0;
          return (
            acc +
            postCountValue * page.m_post_price +
            storyCountValue * page.m_story_price
          );
        }, 0);
        overviewData.push({
          SNo: overviewData.length + 1,
          Description: `Post and Stories on ${categoryName} Pages`,
          Platform: 'Instagram',
          Count: `${categoryData.reduce(
            (acc, item) => acc + item['Post Count'] + item['Story Count'],
            0
          )}`, // Total post and story count for category
          Cost: `₹${categoryTotalCost.toFixed(2)}`, // Calculate cost for category
        });
      });
    } else {
      // Handle other platforms
      const platformSheetData = platformData.map((page, index) => {
        const postCountValue = Number(postCount[page._id]) || 0; // Ensure it's a number
        const storyCountValue = Number(storyPerPage[page._id]) || 0; // Ensure it's a number

        // Add to platform total posts and stories count
        platformTotalPostsAndStories += postCountValue + storyCountValue;

        return {
          SNo: index + 1,
          'Page Name': page.page_name,
          Followers: page.followers_count,
          'Post Count': postCountValue,
          'Story Count': storyCountValue,
        };
      });

      const platformSheet = XLSX.utils.json_to_sheet(platformSheetData); // Convert platform data to a sheet
      addHyperlinksAndAdjustWidths(platformSheet, platformSheetData); // Add hyperlinks and adjust column widths
      applyCellStyles(platformSheet, platformSheetData); // Apply cell styles
      XLSX.utils.book_append_sheet(workbook, platformSheet, platform); // Append to workbook

      // Calculate cost for the platform
      const platformCost = platformData.reduce((acc, page) => {
        const postCountValue = Number(postCount[page._id]) || 0;
        const storyCountValue = Number(storyPerPage[page._id]) || 0;
        return (
          acc +
          postCountValue * page.m_post_price +
          storyCountValue * page.m_story_price
        );
      }, 0);

      overviewData.push({
        SNo: overviewData.length + 1,
        Description: `Post and Stories on ${platform} Pages`,
        Platform: platform,
        Count: platformTotalPostsAndStories, // Total post and story count for platform
        Cost: `₹${platformCost.toFixed(2)}`, // Add cost for the platform
      });
    }
  });

  // Calculate GST
  const gst = totalCost * 0.18; // 18% GST
  const totalWithGst = totalCost + gst; // Total after GST

  // Add GST and total to the overview data
  overviewData.push(
    {
      SNo: '',
      Description: 'Total Cost',
      Platform: '',
      Count: '',
      Cost: `₹${totalCost.toFixed(2)}`,
    },
    {
      SNo: '',
      Description: 'GST (18%)',
      Platform: '',
      Count: '',
      Cost: `₹${gst.toFixed(2)}`,
    },
    {
      SNo: '',
      Description: 'Total Cost After GST',
      Platform: '',
      Count: '',
      Cost: `₹${totalWithGst.toFixed(2)}`,
    },
    {
      SNo: '',
      Description: 'Total Count of Posts and Stories',
      Platform: '',
      Count: totalPostsAndStories,
      Cost: '',
    } // Updated total count of posts and stories
  );

  const overviewSheet = XLSX.utils.json_to_sheet(overviewData); // Convert overview data to a sheet
  addHyperlinksAndAdjustWidths(overviewSheet, overviewData); // Add hyperlinks and adjust column widths
  applyCellStyles(overviewSheet, overviewData); // Apply cell styles
 
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview'); // Create overview sheet

  // Move the overview sheet to the first position
  workbook.SheetNames = [
    'Overview',
    ...workbook.SheetNames.filter((name) => name !== 'Overview'),
  ];

  // Write the workbook to a file
  XLSX.writeFile(workbook, 'Plan_Statistics.xlsx');
};

// Helper function to apply cell styles
const applyCellStyles = (sheet, data) => {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const headerRow = range.s.r;

  // Style the header row
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ c: C, r: headerRow });
    if (!sheet[address]) continue;
    // console.log("sheet", sheet[address]);
    sheet[address].s = {
      font: { bold: true, color: { rgb: 'FF0000' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'BFEE90' } },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
  }

  // Style all filled cells with borders
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: R, c: C });
      if (!sheet[address]) continue;
      if (!sheet[address].s) {
        sheet[address].s = {};
      }
      sheet[address].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
      sheet[address].s.font = {
        bold: true,
      };
      if (C === 0 || C === 3) {
        // Center align the SNo column and Followers column
        sheet[address].s.alignment = {
          horizontal: 'center',
          vertical: 'center',
        };
      }
    }
  }
};

// Function to add hyperlinks and adjust column widths
const addHyperlinksAndAdjustWidths = (worksheet, data) => {
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  // Apply column widths
  const columnWidths = [
    { wch: 5 }, // SNo column width
    { wch: 30 }, // User Name or Page Name
    { wch: 50 }, // Profile Link
    { wch: 15 }, // Followers
    { wch: 15 }, // Post Count
    { wch: 15 }, // Story Count
  ];
  worksheet['!cols'] = columnWidths;

  // Add hyperlinks to 'Profile Link' column (assuming it's at index 2)
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const address = XLSX.utils.encode_cell({ r: R, c: 2 }); // Column 'C' (index 2)
    const profileLink = worksheet[address]?.v;
    if (profileLink) {
      worksheet[address].l = {
        Target: profileLink,
        Tooltip: 'Click to open profile',
      };
    }
  }
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
  allrows,
  postCount,
  handleOwnPage,
  category,
  storyPerPage,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  // Memoized calculation of ownership counts for performance optimization
  const ownershipCounts = useMemo(
    () => calculateOwnershipCounts(selectedRow, postCount, storyPerPage),
    [selectedRow, postCount, storyPerPage]
  );

  const formatFollowers = (followers) => {
    return (followers / 1000000).toFixed(1) + 'M';
  };

  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    setPageDetails(selectedRow?.filter((page) => page.ownership_type === type)); // Filter pages by ownership type
    setOpenModal(true); // Open the modal
  };

  // Filter all rows to get only 'Own' type pages
  const ownPages = allrows?.filter((item) => item?.ownership_type === 'Own');
  const handlePreviewExcel = () => {
    const preview = selectedRow?.map((page) => {
      const platformName = getPlatformName(page.platform_id);
      const postCountForPage = postCount[page._id] || 0;
      const storyCountForPage = storyPerPage[page._id] || 0;

      return {
        'Page Name': page.page_name,
        Platform: platformName,
        Followers: page.followers_count,
        'Post Count': postCountForPage,
        'Story Count': storyCountForPage,
        'Post Price': page.m_post_price,
        'Story Price': page.m_story_price,
        'Total Post Cost': postCountForPage * page.m_post_price,
        'Total Story Cost': storyCountForPage * page.m_story_price,
        category: page.page_category_id, // Add category ID for filtering
      };
    });

    setPreviewData(preview);
    setOpenPreviewModal(true); // Open the preview modal
  };

  return (
    <div>
      <ExcelPreviewModal
        open={openPreviewModal} // Pass the modal open state
        onClose={() => setOpenPreviewModal(false)} // Pass the close handler
        previewData={previewData} // Pass the preview data
        categories={category}
      />
      <Button
        variant="contained"
        className="preview-btn-excel"
        onClick={handlePreviewExcel}
      >
        Preview Excel
      </Button>

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
          Total Followers: {formatFollowers(totalFollowers)} || Total Cost:{' '}
          {totalCost} || Total Posts Per Page: {totalPostsPerPage} || Total
          Stories Per Page: {totalStoriesPerPage} || Total Deliverable:{' '}
          {totalDeliverables} || Total Pages: {totalPagesSelected}
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
