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
  IconButton,
} from '@mui/material';
import { useState, useMemo } from 'react';
import '../../../components/AdminPanel/PageMS/Tagcss.css';
import * as XLSX from 'xlsx-js-style';
import './index.css';

import ExcelPreviewModal from './ExcelPreviewModal';
import { ArrowUpRight, X } from '@phosphor-icons/react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
          S_No: acc[categoryName]?.length + 1,
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
        // Check if all story counts in this category are 0
        const allStoryCountsZero = categoryData.every(
          (item) => item['Story Count'] === 0
        );

        // Construct the data to write to the sheet, excluding "Story Count" if all are zero
        const sheetData = categoryData.map((item) => {
          const rowData = {
            S_No: item.S_No,
            'User Name': item['User Name'],
            'Profile Link': item['Profile Link'],
            Followers: item.Followers,
            'Post Count': item['Post Count'],
          };

          if (!allStoryCountsZero) {
            rowData['Story Count'] = item['Story Count'];
          }

          return rowData;
        });

        const categorySheet = XLSX.utils.json_to_sheet(sheetData); // Convert category data to a sheet
        addHyperlinksAndAdjustWidths(categorySheet, sheetData); // Add hyperlinks and adjust column widths
        applyCellStyles(categorySheet, sheetData); // Apply cell styles
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
          S_No: overviewData?.length + 1,
          Description: `Post and Stories on ${categoryName} Pages`,
          Platform: 'Instagram',
          Count: `${categoryData.reduce(
            (acc, item) =>
              acc + item['Post Count'] + (item['Story Count'] || 0),
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

        // Construct row data based on whether all story counts are zero
        const rowData = {
          S_No: index + 1,
          'Page Name': page.page_name,
          Followers: page.followers_count,
          'Post Count': postCountValue,
        };

        // Add "Story Count" if story counts are not all zero
        // if (!allStoryCountsZero) {
        //   rowData['Story Count'] = storyCountValue;
        // }

        // Add to platform total posts and stories count
        platformTotalPostsAndStories += postCountValue + storyCountValue;

        return rowData;
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
        S_No: overviewData?.length + 1,
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
      S_No: '',
      Description: 'Total Cost',
      Platform: '',
      Count: '',
      Cost: `₹${totalCost.toFixed(2)}`,
    },
    {
      S_No: '',
      Description: 'GST (18%)',
      Platform: '',
      Count: '',
      Cost: `₹${gst.toFixed(2)}`,
    },
    {
      S_No: '',
      Description: 'Total Cost After GST',
      Platform: '',
      Count: '',
      Cost: `₹${totalWithGst.toFixed(2)}`,
    },
    {
      S_No: '',
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
// const applyCellStyles = (sheet, data) => {
const applyCellStyles = (sheet) => {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const headerRow = range.s.r;

  // Style the header row
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ c: C, r: headerRow });
    if (!sheet[address]) continue;
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
// const addHyperlinksAndAdjustWidths = (worksheet, ßdata) => {
const addHyperlinksAndAdjustWidths = (worksheet) => {
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
  handleToggleLeftNavbar,
  toggleLeftNavbar,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <Accordion className="card" expanded={expanded}>
        <AccordionSummary
          className="card-header"
          // expandIcon={
          //   <IconButton onClick={handleToggle}>
          //     <ExpandMoreIcon />
          //   </IconButton>
          // }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <h5 className="card-title">
            <div className="">
              <button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={handleToggleLeftNavbar}
              >
                {!toggleLeftNavbar ? 'show navbar' : 'hide navbar'}
              </button>
            </div>
          </h5>
          <div className="flexCenterBetween colGap10 mr10">
            <div className="w-50">
              <div className="input-group primaryInputGroup">
                <input
                  className="form-control"
                  type="text"
                  value={searchInputValue}
                  placeholder="Type values separated by spaces"
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
            </div>
            <div className="flexCenter colGap10">
              <ExcelPreviewModal
                open={openPreviewModal} // Pass the modal open state
                onClose={() => setOpenPreviewModal(false)} // Pass the close handler
                previewData={previewData} // Pass the preview data
                categories={category}
              />
              <Button
                variant="contained"
                className="btn btn_sm cmnbtn btn-outline-danger"
                onClick={clearRecentlySelected}
              >
                Clear Recenty Selected
              </Button>
              {/* <Button
                variant="contained"
                className="btn btn_sm cmnbtn btn-outline-primary"
                onClick={handlePreviewExcel}
              >
                Preview Excel
              </Button> */}
              {/* Button to download Excel report */}
              {/* <Button
                className="btn btn_sm cmnbtn btn-outline-primary"
                variant="contained"
                onClick={() =>
                  downloadExcel(selectedRow, category, postCount, storyPerPage)
                }
              >
                Download Excel
              </Button> */}
              {/* <Button
                className="btn btn_sm cmnbtn btn-success"
                variant="contained"
                onClick={() => HandleSavePlan()}
              >
                Save Plan
              </Button> */}
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="card-body p0">
          {/* Display summary information */}
          {/* <div className="row p16 pb-3 border-bottom">
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right">
                <h6 className="colorMedium ">Total Followers</h6>
                <h6 className="colorDark">{formatFollowers(totalFollowers)}</h6>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right">
                <h6 className="colorMedium ">Total Cost</h6>
                <h6 className="colorDark">{totalCost}</h6>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right">
                <h6 className="colorMedium ">Total Posts / Page</h6>
                <h6 className="colorDark">{totalPostsPerPage}</h6>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right">
                <h6 className="colorMedium ">Total Stories / Page</h6>
                <h6 className="colorDark">{totalStoriesPerPage}</h6>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right">
                <h6 className="colorMedium ">Total Deliverable</h6>
                <h6 className="colorDark">{totalDeliverables}</h6>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 col-12">
              <div className="flexCenter colGap12 border-right border-0">
                <h6 className="colorMedium ">Total Pages</h6>
                <h6 className="colorDark">{totalPagesSelected}</h6>
              </div>
            </div>
        
          </div> */}
          {/* Render each category with its count */}
          {/* <div className="row pl16 pr16 border-bottom">
            {Object.entries(pageCategoryCount)?.map(([categoryId, count]) => {
              const categoryName =
                category?.find((item) => item?._id === categoryId)
                  ?.page_category || 'Unknown'; // Get category name or default to 'Unknown'
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
            })}
          </div> */}
          {/* Display remaining pages */}
          {/* <div className="row p16 border-bottom">
            <div className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div onClick={handleOwnPage}>
                <div className="flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <h5>
                      {ownPages?.length - selectedRow?.length > 0
                        ? ownPages?.length - selectedRow?.length
                        : 0}
                    </h5>
                  </div>
                  <div>
                    <h6 className="colorMedium">Own Remaining Pages</h6>
                    <h6 className="mt4">
                      {ownPages?.length - selectedRow?.length > 0
                        ? ownPages?.length - selectedRow?.length
                        : 0}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* Render ownership types with counts and details button */}
          {/* <div className="row p16">
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
                      <span>
                        <ArrowUpRight />
                      </span>
                    </div>
                    <div>
                      <h6>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Pages :{' '}
                        {ownershipCounts[type].count}
                      </h6>
                      <h6 className="mt4">
                        Total Post & Story Cost : ₹{' '}
                        {ownershipCounts[type].totalCost}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </AccordionDetails>
      </Accordion>

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
    </>
  );
};

export default PlanStatics;
