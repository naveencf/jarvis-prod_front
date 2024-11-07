/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  DownloadSimple,
  Eye,
  FloppyDiskBack,
  StackMinus,
} from '@phosphor-icons/react';
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
  Tooltip,
  IconButton,
} from '@mui/material';
import * as XLSX from 'xlsx-js-style';
import ExcelJS from 'exceljs';
import ExcelPreviewModal from './ExcelPreviewModal';
import formatString from '../../../utils/formatString';
import axios from 'axios';

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

const getPriceDetail = (priceDetails, key) => {
  const detail = priceDetails?.find((item) => item[key] !== undefined);
  return detail ? detail[key] : 0;
};

// Function to download an image as base64 using ArrayBuffer and Uint8Array
async function downloadImageToBase64(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const binary = new Uint8Array(response.data);
  const binaryString = binary.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ''
  );
  return `data:image/jpeg;base64,${btoa(binaryString)}`; // Adjust for correct image type if necessary
}

const downloadExcelTemp = async (
  selectedRow,
  category,
  postCount,
  storyPerPage
) => {
  const workbook = new ExcelJS.Workbook();

  // Overview Data
  let totalPostsAndStories = 0;
  let totalCost = 0;
  // Calculate GST
  const gst = totalCost * 0.18; // 18% GST
  const totalWithGst = totalCost + gst; // Total after GST

  const overviewSheet = workbook.addWorksheet('Overview');
  // const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg';
  const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlCfYO-rbOr_Xm2cpuVvNvMWIHh70VDt-qyTxytq4sJoyvQXtuhUQnpGmC6oJRtE7EIHA&usqp=CAU';
  const response = await fetch(logoUrl);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const imageId = workbook.addImage({
    buffer: uint8Array,
    extension: 'jpeg',
  });

  overviewSheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 150, height: 75 },
  });

  // Merge cells for "Proposal" text and center it
  overviewSheet.mergeCells('A1:F4');
  const proposalCell = overviewSheet.getCell('E1');
  proposalCell.value = 'Proposal';
  proposalCell.alignment = { horizontal: 'center', vertical: 'middle' };
  proposalCell.font = { bold: true, size: 24 };

  // Add header row with styling
  overviewSheet.getRow(5).values = ['Sno.', 'Description', 'Platform', 'Count', 'Deliverables', 'Cost'];
  overviewSheet.getRow(5).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9CABD' } // Light brown fill
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  // Set specific widths for each column
  overviewSheet.getColumn(1).width = 8;  // Sno.
  overviewSheet.getColumn(2).width = 30; // Description
  overviewSheet.getColumn(3).width = 15; // Platform
  overviewSheet.getColumn(4).width = 10; // Count
  overviewSheet.getColumn(5).width = 20; // Deliverables
  overviewSheet.getColumn(6).width = 15; // Cost

  // Add the header to row 2 (after the empty row)
  // overviewSheet.getRow(5).values = ['S_No', 'Description', 'Platform', 'Count', 'Cost'];


  const platforms = ['Instagram', 'Facebook', 'YouTube', 'Twitter', 'Snapchat'];

  for (const platform of platforms) {
    const platformData = selectedRow?.filter(
      (page) => getPlatformName(page.platform_id) === platform
    );

    if (!platformData?.length) continue;

    if (platform === 'Instagram') {
      const categories = {};
      platformData.forEach((page) => {
        const categoryId = page.page_category_id;
        const categoryName =
          category?.find((cat) => cat._id === categoryId)?.page_category ||
          'Unknown';

        categories[categoryName] = categories[categoryName] || [];
        const categoryData = categories[categoryName] || [];
        // Check if the post and story counts are coming through
        const postCountValue = postCount[page._id] || 0;
        const storyCountValue = storyPerPage[page._id] || 0;

        categories[categoryName].push({
          S_No: categories[categoryName].length + 1,
          Username: page.page_name || 'N/A',
          'Profile Link': page.page_link || 'N/A',
          Followers: page.followers_count || 0,
          'Post Count': postCountValue,
          'Story Count': storyCountValue,
        });

        totalPostsAndStories += postCountValue + storyCountValue;

        totalCost += postCountValue * getPriceDetail(page.page_price_list, 'instagram_post') +
          storyCountValue * getPriceDetail(page.page_price_list, 'instagram_story');

      });
      let serialNumber = 1;
      for (const [categoryName, categoryData] of Object.entries(categories)) {
        const sheet = workbook.addWorksheet(formatString(categoryName));
        // console.log(categoryName, "categoryName")
        sheet.columns = [
          { header: 'S_No', width: 5 },
          { header: 'Username', width: 30 },
          { header: 'Profile Link', width: 50 },
          { header: 'Followers', width: 15 },
          { header: 'Post Count', width: 15 },
          { header: 'Story Count', width: 15 },
        ];

        categoryData.forEach((row) => sheet.addRow(row));

        // Calculate category total cost
        const categoryTotalCost = categoryData.reduce((acc, item) => {
          const page = platformData.find(
            (p) => p.page_name === item['Username']
          );
          const postPrice = getPriceDetail(
            page.page_price_list,
            'instagram_post'
          );
          const storyPrice = getPriceDetail(
            page.page_price_list,
            'instagram_story'
          );
          const postCountValue = Number(postCount[page._id]) || 0;
          const storyCountValue = Number(storyPerPage[page._id]) || 0;
          return (
            acc + postCountValue * postPrice + storyCountValue * storyPrice
          );
        }, 0);
        overviewSheet.addRow([
          serialNumber, // Serial number based on the length of the sheet
          `Post and Stories on ${categoryName} Pages`, // Description
          'Instagram', // Platform
          `${categoryData.reduce(
            (acc, item) =>
              acc + item['Post Count'] + (item['Story Count'] || 0),
            0
          )}`, // Total post and story count for category
          "",
          `₹${categoryTotalCost.toFixed(2)}`, // Total cost for category
        ]);

        serialNumber++;

        // Style header row
        sheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FF000000' } };
          cell.alignment = { horizontal: 'center' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'BFEE90' },
          };
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        // Add hyperlinks
        categoryData.forEach((item, index) => {
          // Assign 'Profile Link' with hyperlink
          const profileCell = sheet.getCell(`C${index + 2}`);
          profileCell.value = {
            text: item['Profile Link'],
            hyperlink: item['Profile Link'],
          };

          // Assign other values to respective columns
          sheet.getCell(`A${index + 2}`).value = item['S_No']; // S_No in column A
          sheet.getCell(`B${index + 2}`).value = item['Username']; // Username in column B
          sheet.getCell(`D${index + 2}`).value = item['Followers']; // Followers in column D
          sheet.getCell(`E${index + 2}`).value = item['Post Count']; // Post Count in column E
          sheet.getCell(`F${index + 2}`).value = item['Story Count']; // Story Count in column F
        });
      }
    }
  }

  // Add the data row for 'Total Cost', 'GST', and 'Total with GST'
  let totalCostRow = overviewSheet.addRow([
    '', // S_No remains empty
    'Total Cost',
    '',
    '',
    '',
    `₹${totalCost.toFixed(2)}`
  ]);

  let gstRow = overviewSheet.addRow([
    '',
    'GST (18%)',
    '',
    '',
    '',
    `₹${(totalCost * 0.18).toFixed(2)}`
  ]);

  let totalWithGstRow = overviewSheet.addRow([
    '',
    'Total with GST',
    '',
    '',
    '',
    `₹${(totalCost * 1.18).toFixed(2)}`
  ]);

  // Merge cells B to E for each of the total rows
  overviewSheet.mergeCells(`B${totalCostRow.number}:E${totalCostRow.number}`);
  overviewSheet.mergeCells(`B${gstRow.number}:E${gstRow.number}`);
  overviewSheet.mergeCells(`B${totalWithGstRow.number}:E${totalWithGstRow.number}`);

  // Center-align and add styling to the merged cells
  [totalCostRow, gstRow, totalWithGstRow].forEach((row) => {
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).font = { bold: true };
  });





  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Plan_Statistics.xlsx';
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL
  });
};

const downloadExcel = async (
  selectedRow,
  category,
  postCount,
  storyPerPage
) => {
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
          Username: page.page_name,
          'Profile Link': page.page_link,
          Followers: page.followers_count,
          'Post Count': postCountValue,
          'Story Count': storyCountValue,
        });
        const postPrice = getPriceDetail(
          page.page_price_list,
          'instagram_post'
        );
        const storyPrice = getPriceDetail(
          page.page_price_list,
          'instagram_story'
        );

        // Add to platform and overall totals for posts and stories
        platformTotalPostsAndStories += postCountValue + storyCountValue;
        totalPostsAndStories += postCountValue + storyCountValue;

        // Calculate total cost
        totalCost += postCountValue * postPrice + storyCountValue * storyPrice;

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
            Username: item['Username'],
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
            (p) => p.page_name === item['Username']
          );
          const postPrice = getPriceDetail(
            page.page_price_list,
            'instagram_post'
          );
          const storyPrice = getPriceDetail(
            page.page_price_list,
            'instagram_story'
          );
          const postCountValue = Number(postCount[page._id]) || 0;
          const storyCountValue = Number(storyPerPage[page._id]) || 0;
          return (
            acc + postCountValue * postPrice + storyCountValue * storyPrice
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
    { wch: 30 }, // Username or Page Name
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
const LeftSideBar = ({
  totalFollowers,
  totalCost,
  totalPostsPerPage,
  totalPagesSelected,
  totalDeliverables,
  totalStoriesPerPage,
  pageCategoryCount,
  handleToggleBtn,
  selectedRow,
  postCount,
  handleOwnPage,
  category,
  storyPerPage,
  // searchInputValue,
  // allrows,
  // handleSearchChange,
  // clearRecentlySelected,
  // clearSearch,
  // filterData,
  // pageList,
  HandleSavePlan,
  ownPages,
  planDetails,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  // const [expanded, setExpanded] = useState(false);
  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    setPageDetails(
      selectedRow?.filter((page) => page?.ownership_type === type) || []
    );
    setOpenModal(true); // Open the modal
  };

  const formatFollowers = (followers) => {
    return (followers / 1000000).toFixed(1) + 'M';
  };

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

  // const formatFollowers = (followers) => `${followers} Followers`;
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
          const postPrice = getPriceDetail(
            page.page_price_list,
            'instagram_post'
          );
          const storyPrice = getPriceDetail(
            page.page_price_list,
            'instagram_story'
          );
          const totalCost =
            postCountForPage * (postPrice || 0) +
            storyCountForPage * (storyPrice || 0);

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

  // Memoized calculation of ownership counts for performance optimization
  const ownershipCounts = useMemo(
    () => calculateOwnershipCounts(selectedRow, postCount, storyPerPage),
    [selectedRow, postCount, storyPerPage]
  );

  const ownpages = selectedRow.filter((item) => item.ownership_type === 'Own');

  return (
    <div className="planLeftSideWrapper">
      <div className="planLeftSideBody">
        <div className="planSmall">
          {' '}
          <h6>
            Plan Name
            <span>
              {planDetails && formatString(planDetails[0]?.plan_name)}
            </span>
          </h6>
          <h6>
            Account Name
            <span>
              {planDetails && formatString(planDetails[0]?.account_name)}
            </span>
          </h6>
          <h6>
            Selling Price
            <span>{planDetails && planDetails[0]?.selling_price}</span>
          </h6>
        </div>
        <div className="planSmall">
          <h6>
            Total Followers
            <span>{formatFollowers(totalFollowers)}</span>
          </h6>
          <h6>
            Total Cost
            <span>{totalCost}</span>
          </h6>
          <h6>
            Total Posts
            {/* / Page */}
            <span>{totalPostsPerPage}</span>
          </h6>
          <h6>
            Total Stories
            {/* / Page */}
            <span>{totalStoriesPerPage}</span>
          </h6>
          <h6>
            Total Deliverable
            <span>{totalDeliverables}</span>
          </h6>
          <h6>
            Total Pages
            <span>{totalPagesSelected}</span>
          </h6>
          <h6>
            Own Pages
            <span> {ownpages?.length}</span>
          </h6>
          <h6>
            Own Remaining Pages
            <span>
              {' '}
              {ownPages?.length - selectedRow?.length > 0
                ? ownPages?.length - selectedRow?.length
                : 0}
            </span>
          </h6>
        </div>
        <div className="planSmall">
          {/* <h6>
            Bollywood
            <span>1</span>
          </h6>
          <h6>
            Meme
            <span>1</span>
          </h6> */}
          {Object.entries(pageCategoryCount)?.map(([categoryId, count]) => {
            const categoryName =
              category?.find((item) => item?._id === categoryId)
                ?.page_category || 'Unknown'; // Get category name or default to 'Unknown'
            return (
              <h6 onClick={handleToggleBtn} key={categoryId}>
                {formatString(categoryName)}
                <span>{count}</span>
              </h6>
            );
          })}
        </div>
        <ExcelPreviewModal
          open={openPreviewModal} // Pass the modal open state
          onClose={() => setOpenPreviewModal(false)} // Pass the close handler
          previewData={previewData} // Pass the preview data
          categories={category}
        />
        <div className="planSmall planLarge">
          {['own', 'vendor', 'solo'].map((type) => (
            <div className="pointer" onClick={handleOwnPage} key={type}>
              <h6
                onClick={() =>
                  handleOpenModal(
                    type.charAt(0).toUpperCase() + type.slice(1) // Open modal for ownership type
                  )
                }
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Pages :{' '}
                {ownershipCounts[type].count} <br />
                Total Post & Story Cost : ₹ {ownershipCounts[type].totalCost}
                {/* <h6 className=""></h6> */}
              </h6>
            </div>
          ))}
        </div>
      </div>
      <div className="planLeftSideFooter">
        <button className="btn icon">
          <Tooltip title="Clear Recently Selected">
            <IconButton>
              <StackMinus />
            </IconButton>
          </Tooltip>
        </button>
        <button className="btn icon" onClick={handlePreviewExcel}>
          {' '}
          <Tooltip title="Preview Excel">
            <IconButton>
              <Eye />{' '}
            </IconButton>
          </Tooltip>
        </button>
        <button
          className="btn icon"
          onClick={() =>
            // downloadExcel(selectedRow, category, postCount, storyPerPage)
            downloadExcelTemp(selectedRow, category, postCount, storyPerPage)
          }
        >
          {' '}
          <Tooltip title="Download Excel">
            <IconButton>
              <DownloadSimple />{' '}
            </IconButton>
          </Tooltip>
        </button>
        <button className="btn icon" onClick={() => HandleSavePlan()}>
          <Tooltip title="Save Plan">
            <IconButton>
              <FloppyDiskBack />{' '}
            </IconButton>
          </Tooltip>
        </button>
      </div>

      <div className="d-none">
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
              {Object.entries(pageCategoryCount).map(([categoryId, count]) => {
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
              })}
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
                          {type.charAt(0).toUpperCase() + type.slice(1)} Pages :{' '}
                          {ownershipCounts[type]?.count || 0}
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
