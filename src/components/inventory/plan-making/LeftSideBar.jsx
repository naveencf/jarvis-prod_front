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
  TextField,
} from '@mui/material';
import * as XLSX from 'xlsx-js-style';
import ExcelJS from 'exceljs';
import ExcelPreviewModal from './ExcelPreviewModal';
import formatString from '../../../utils/formatString';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';

// Function to download an image as base64 using ArrayBuffer and Uint8Array
// async function downloadImageToBase64(url) {
//   const response = await axios.get(url, { responseType: 'arraybuffer' });
//   const binary = new Uint8Array(response.data);
//   const binaryString = binary.reduce(
//     (acc, byte) => acc + String.fromCharCode(byte),
//     ''
//   );
//   return `data:image/jpeg;base64,${btoa(binaryString)}`; // Adjust for correct image type if necessary
// }

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
  checkedDescriptions,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [agencyFees, setAgencyFees] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(
    planDetails?.[0]?.selling_price
  );
  const [planName, setPlanName] = useState(
    formatString(planDetails?.[0]?.plan_name)
  );
  // const [expanded, setExpanded] = useState(false);
  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    setPageDetails(
      selectedRow?.filter((page) => page?.ownership_type === type) || []
    );
    setOpenModal(true); // Open the modal
  };
  // console.log(planDetails, "planDetails")
  const formatFollowers = (followers) => {
    return (followers / 1000000).toFixed(1) + 'M';
  };
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

  const downloadExcel = async (
    selectedRow,
    category,
    postCount,
    storyPerPage,
    planDetails,
    checkedDescriptions
  ) => {
    const workbook = new ExcelJS.Workbook();
    // selling_price
    // Overview Data
    let totalPostsAndStories = 0;
    let totalCost = 0;
    // Calculate GST
    const gst = totalCost * 0.18; // 18% GST
    const totalWithGst = totalCost + gst; // Total after GST

    const overviewSheet = workbook.addWorksheet('Overview');

    const logoUrl = 'https://i.ibb.co/jZ3pgnS/logo.webp';
    // const logoUrl = 'https://i.ibb.co/bg5J6Gq/Cf-logo.jpg';
    // <a href="https://ibb.co/1fG604h"><img src="https://i.ibb.co/bg5J6Gq/Cf-logo.jpg" alt="Cf-logo" border="0"></a>
    // const logoUrl = 'https://i.ibb.co/QYz6H78/Untitled-design.png';
    const response = await fetch(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const imageId = workbook.addImage({
      buffer: uint8Array,
      extension: 'png',
    });
    // Define margin values (measured in Excel points)
    const leftMargin = 30; // Margin in points for left
    const topMargin = 15; // Margin in points for top
    const bottomMargin = 10; // Margin in points for top

    // Adjusted image placement with margins
    overviewSheet.addImage(imageId, {
      tl: {
        col: 1 + leftMargin / 72, // Convert points to Excel columns (approximately)
        row: 2 + topMargin / 20,  // Convert points to Excel rows (approximately)
      },
      ext: {
        width: 110, // Image width in points
        height: 100, // Image height in points
        // height: 70 - bottomMargin,
      },
    });
    // Merge cells and center-align "Proposal" text
    const topRow = overviewSheet.mergeCells('B3:G6'); // Shifted merge by 1 column for "Proposal" text
    const proposalCell = overviewSheet.getCell('E3');
    proposalCell.value = 'Proposal';
    proposalCell.alignment = { horizontal: 'center', vertical: 'middle' };
    proposalCell.font = { bold: true, size: 36 };

    // Add header row with styling, starting from the second column onward
    overviewSheet.getRow(7).values = [
      '',
      'Sno.',
      'Description',
      'Platform',
      'Count',
      'Deliverables',
      'Cost',
    ];

    // Apply border style
    const contentBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    overviewSheet.getCell('C3').border = contentBorder; // C3
    // Adding content with borders in the data rows
    overviewSheet.getRow(7).eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        // Apply to cells from 2nd column onward
        cell.font = { bold: true, name: 'Comic Sans MS', };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D9CABD' }, // Light brown fill
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = contentBorder; // Apply border to content
      }
    });

    const platforms = [
      'Instagram',
      'Facebook',
      'YouTube',
      'Twitter',
      'Snapchat',
    ];

    for (const platform of platforms) {
      const platformData = selectedRow?.filter(
        (page) => getPlatformName(page.platform_id) === platform
      );

      if (!platformData?.length) continue;

      if (platform === 'Instagram') {
        const categories = {};
        // console.log(platformData, "platformData")
        platformData.forEach((page) => {
          const categoryId = page.page_category_id;
          const categoryName =
            category?.find((cat) => cat._id === categoryId)?.page_category ||
            'Unknown';

          categories[categoryName] = categories[categoryName] || [];
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

          totalCost +=
            postCountValue *
              getPriceDetail(page.page_price_list, 'instagram_post') +
            storyCountValue *
              getPriceDetail(page.page_price_list, 'instagram_story');
        });
        let serialNumber = 1;
        for (const [categoryName, categoryData] of Object.entries(categories)) {
          const sheet = workbook.addWorksheet(formatString(categoryName));

          // Determine if the category has any Story Count > 0
          const hasStoryCount = categoryData.some(
            (item) => item['Story Count'] > 0
          );

          sheet.columns = [
            // { header: '', width: 5 },
            { header: 'S_No', width: 5 },
            { header: 'Username', width: 30 },
            { header: 'Profile Link', width: 50 },
            { header: 'Followers', width: 15 },
            { header: 'Post Count', width: 15 },
            hasStoryCount && { header: 'Story Count', width: 15 },
          ];

          categoryData.forEach((row) => sheet.addRow(row));
          // Apply border to all rows in category sheet
          sheet.eachRow((row, rowIndex) => {
            row.eachCell((cell, colNumber) => {
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              };
            });
          });

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

          const newRow = overviewSheet.addRow([
            '',
            serialNumber, // Serial number based on the length of the sheet
            `Post ${hasStoryCount ? 'and Stories' : ''} on ${formatString(
              categoryName
            )} Pages`, // Description
            'Instagram', // Platform
            categoryData.reduce(
              (acc, item) =>
                (acc + Number(item['Post Count']) + Number(item['Story Count'] || 0)),
              0
            ), // Total post and story count for category
            '',
            ``, // Total cost for category. ₹${categoryTotalCost.toFixed(2)}
          ]);

          // Apply styles to each cell
          newRow.eachCell((cell, colNumber) => {
            if (colNumber > 1) {
              // Apply common styles
              cell.border = contentBorder;
              cell.font = { name: 'Comic Sans MS', bold: true };

              // Conditional alignment for the description column (3rd column)
              if (colNumber === 3) {
                cell.alignment = { horizontal: 'left', vertical: 'middle' }; // Left-align the description
              } else {
                cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center-align the rest
              }
            }
          });
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

          // Add hyperlinks and assign values to each cell in categorySheet
          categoryData.forEach((item, index) => {
            // Assign other values to respective columns and apply borders
            const sNoCell = sheet.getCell(`A${index + 2}`);
            sNoCell.value = item['S_No']; // S_No in column A
            sNoCell.border = contentBorder; // Apply border to the S_No cell
            sNoCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
            sNoCell.font = { bold: true };

            const usernameCell = sheet.getCell(`B${index + 2}`);
            usernameCell.value = formatString(item['Username']); // Username in column B
            usernameCell.border = contentBorder; // Apply border to the Username cell
            usernameCell.font = { bold: true };

            const profileLinkCell = sheet.getCell(`C${index + 2}`);
            // profileLinkCell.font = { bold: true };
            // profileLinkCell.value = item['Profile Link']; // Profile Link in column C
            profileLinkCell.value = {
              text: item['Profile Link'], // Display text in the cell
              hyperlink: item['Profile Link'], // Hyperlink
            };
            profileLinkCell.border = contentBorder; // Apply border to the Profile Link cell
            profileLinkCell.font = {
              color: { argb: 'FF0563C1' },
              underline: true,
              bold: true,
            };

            // // Set the hyperlink
            // profileLinkCell.hyperlink = item['Profile Link'];

            const followersCell = sheet.getCell(`D${index + 2}`);
            followersCell.value = item['Followers']; // Followers in column D
            followersCell.border = contentBorder; // Apply border to the Followers cell
            followersCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }; // Alignment
            followersCell.font = { bold: true };

            const postCountCell = sheet.getCell(`E${index + 2}`);
            postCountCell.value = item['Post Count']; // Post Count in column E
            postCountCell.border = contentBorder; // Apply border to the Post Count cell
            postCountCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }; // Alignment
            postCountCell.font = { bold: true };

            // Only add Story Count if there's at least one story count > 0 in the category
            if (hasStoryCount) {
              const storyCountCell = sheet.getCell(`F${index + 2}`);
              storyCountCell.value = item['Story Count']; // Story Count in column F
              storyCountCell.border = contentBorder; // Apply border to the Story Count cell
              storyCountCell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
              }; // Alignment
              storyCountCell.font = { bold: true };
            }
          });
        }
      }
      // else {
      //   const categories = {};
      //   // console.log(platformData, "platformData")
      //   platformData.forEach((page) => {
      //     const categoryId = page.page_category_id;
      //     const categoryName =
      //       category?.find((cat) => cat._id === categoryId)?.page_category ||
      //       'Unknown';

      //     categories[categoryName] = categories[categoryName] || [];
      //     // Check if the post and story counts are coming through
      //     const postCountValue = postCount[page._id] || 0;
      //     const storyCountValue = storyPerPage[page._id] || 0;

      //     categories[categoryName].push({
      //       S_No: categories[categoryName].length + 1,
      //       Username: page.page_name || 'N/A',
      //       'Profile Link': page.page_link || 'N/A',
      //       Followers: page.followers_count || 0,
      //       'Post Count': postCountValue,
      //       'Story Count': storyCountValue,
      //     });

      //     totalPostsAndStories += postCountValue + storyCountValue;

      //     totalCost +=
      //       postCountValue *
      //       getPriceDetail(page.page_price_list, 'instagram_post') +
      //       storyCountValue *
      //       getPriceDetail(page.page_price_list, 'instagram_story');
      //   });
      //   let serialNumber = 1;
      //   for (const [categoryName, categoryData] of Object.entries(categories)) {
      //     const sheet = workbook.addWorksheet(formatString(categoryName));

      //     // Determine if the category has any Story Count > 0
      //     const hasStoryCount = categoryData.some(
      //       (item) => item['Story Count'] > 0
      //     );

      //     sheet.columns = [
      //       // { header: '', width: 5 },
      //       { header: 'S_No', width: 5 },
      //       { header: 'Username', width: 30 },
      //       { header: 'Profile Link', width: 50 },
      //       { header: 'Followers', width: 15 },
      //       { header: 'Post Count', width: 15 },
      //       hasStoryCount && { header: 'Story Count', width: 15 },
      //     ];

      //     categoryData.forEach((row) => sheet.addRow(row));
      //     // Apply border to all rows in category sheet
      //     sheet.eachRow((row, rowIndex) => {
      //       row.eachCell((cell, colNumber) => {

      //         cell.border = {
      //           top: { style: 'thin' },
      //           left: { style: 'thin' },
      //           bottom: { style: 'thin' },
      //           right: { style: 'thin' },
      //         };
      //       });
      //     });

      //     // Calculate category total cost
      //     const categoryTotalCost = categoryData.reduce((acc, item) => {
      //       const page = platformData.find(
      //         (p) => p.page_name === item['Username']
      //       );
      //       const postPrice = getPriceDetail(
      //         page.page_price_list,
      //         'instagram_post'
      //       );
      //       const storyPrice = getPriceDetail(
      //         page.page_price_list,
      //         'instagram_story'
      //       );
      //       const postCountValue = Number(postCount[page._id]) || 0;
      //       const storyCountValue = Number(storyPerPage[page._id]) || 0;
      //       return (
      //         acc + postCountValue * postPrice + storyCountValue * storyPrice
      //       );
      //     }, 0);

      //     const newRow = overviewSheet.addRow([
      //       '',
      //       serialNumber, // Serial number based on the length of the sheet
      //       `Post ${hasStoryCount ? "and Stories" : ""} on ${formatString(categoryName)} Pages`, // Description
      //       'Instagram', // Platform
      //       categoryData.reduce(
      //         (acc, item) =>
      //           (acc + Number(item['Post Count']) + Number(item['Story Count'] || 0)),
      //         0
      //       ), // Total post and story count for category
      //       '',
      //       ``, // Total cost for category. ₹${categoryTotalCost.toFixed(2)}
      //     ]);

      //     // Apply styles to each cell
      //     newRow.eachCell((cell, colNumber) => {
      //       if (colNumber > 1) {
      //         // Apply common styles
      //         cell.border = contentBorder;
      //         cell.font = { name: 'Comic Sans MS', bold: true };

      //         // Conditional alignment for the description column (3rd column)
      //         if (colNumber === 3) {
      //           cell.alignment = { horizontal: 'left', vertical: 'middle' }; // Left-align the description
      //         } else {
      //           cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center-align the rest
      //         }
      //       }
      //     });
      //     serialNumber++;

      //     // Style header row
      //     sheet.getRow(1).eachCell((cell) => {
      //       cell.font = { bold: true, color: { argb: 'FF000000' } };
      //       cell.alignment = { horizontal: 'center' };
      //       cell.fill = {
      //         type: 'pattern',
      //         pattern: 'solid',
      //         fgColor: { argb: 'BFEE90' },
      //       };
      //       cell.border = {
      //         top: { style: 'thin' },
      //         bottom: { style: 'thin' },
      //         left: { style: 'thin' },
      //         right: { style: 'thin' },
      //       };
      //     });

      //     // Add hyperlinks and assign values to each cell in categorySheet
      //     categoryData.forEach((item, index) => {

      //       // Assign other values to respective columns and apply borders
      //       const sNoCell = sheet.getCell(`A${index + 2}`);
      //       sNoCell.value = item['S_No']; // S_No in column A
      //       sNoCell.border = contentBorder; // Apply border to the S_No cell
      //       sNoCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
      //       sNoCell.font = { bold: true };

      //       const usernameCell = sheet.getCell(`B${index + 2}`);
      //       usernameCell.value = formatString(item['Username']); // Username in column B
      //       usernameCell.border = contentBorder; // Apply border to the Username cell
      //       usernameCell.font = { bold: true };


      //       const profileLinkCell = sheet.getCell(`C${index + 2}`);
      //       // profileLinkCell.font = { bold: true };
      //       // profileLinkCell.value = item['Profile Link']; // Profile Link in column C
      //       profileLinkCell.value = {
      //         text: item['Profile Link'], // Display text in the cell
      //         hyperlink: item['Profile Link'], // Hyperlink
      //       };
      //       profileLinkCell.border = contentBorder; // Apply border to the Profile Link cell
      //       profileLinkCell.font = { color: { argb: 'FF0563C1' }, underline: true, bold: true, };

      //       // // Set the hyperlink
      //       // profileLinkCell.hyperlink = item['Profile Link'];

      //       const followersCell = sheet.getCell(`D${index + 2}`);
      //       followersCell.value = item['Followers']; // Followers in column D
      //       followersCell.border = contentBorder; // Apply border to the Followers cell
      //       followersCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
      //       followersCell.font = { bold: true };

      //       const postCountCell = sheet.getCell(`E${index + 2}`);
      //       postCountCell.value = item['Post Count']; // Post Count in column E
      //       postCountCell.border = contentBorder; // Apply border to the Post Count cell
      //       postCountCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
      //       postCountCell.font = { bold: true };

      //       // Only add Story Count if there's at least one story count > 0 in the category
      //       if (hasStoryCount) {
      //         const storyCountCell = sheet.getCell(`F${index + 2}`);
      //         storyCountCell.value = item['Story Count']; // Story Count in column F
      //         storyCountCell.border = contentBorder; // Apply border to the Story Count cell
      //         storyCountCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
      //         storyCountCell.font = { bold: true };
      //       }
      //     });
      //   }
      //   // Generic handling for other platforms
      //   const sheet = workbook.addWorksheet(formatString(platform));

      //   const rows = platformData.map((page, index) => ({
      //     S_No: index + 1,
      //     Username: page.page_name || 'N/A',
      //     'Profile Link': page.page_link || 'N/A',
      //     Followers: page.followers_count || 0,
      //   }));

      //   // Define columns for non-Instagram platforms
      //   sheet.columns = [
      //     { header: 'S_No', width: 5 },
      //     { header: 'Username', width: 30 },
      //     { header: 'Profile Link', width: 50 },
      //     { header: 'Followers', width: 15 },
      //   ];

      //   // Add rows to the sheet
      //   rows.forEach((row) => sheet.addRow(row));

      //   // Apply styling to the header row
      //   sheet.getRow(1).eachCell((cell) => {
      //     cell.font = { bold: true, color: { argb: 'FF000000' } };
      //     cell.alignment = { horizontal: 'center' };
      //     cell.fill = {
      //       type: 'pattern',
      //       pattern: 'solid',
      //       fgColor: { argb: 'BFEE90' },
      //     };
      //     cell.border = {
      //       top: { style: 'thin' },
      //       bottom: { style: 'thin' },
      //       left: { style: 'thin' },
      //       right: { style: 'thin' },
      //     };
      //   });

      //   // Add border and formatting for rows
      //   sheet.eachRow((row, rowIndex) => {
      //     row.eachCell((cell, colNumber) => {
      //       cell.border = {
      //         top: { style: 'thin' },
      //         left: { style: 'thin' },
      //         bottom: { style: 'thin' },
      //         right: { style: 'thin' },
      //       };
      //       if (rowIndex > 1) {
      //         cell.alignment = { horizontal: 'center', vertical: 'middle' };
      //       }
      //     });
      //   });
      // }
    }
    // }

    const agencyFee = Number(
      ((planDetails[0]?.selling_price * agencyFees) / 100).toFixed(2)
    );
    let agencyRow = overviewSheet.addRow([
      '',
      `Agency Fees (${agencyFees}%)`,
      '',
      '',
      '',
      '',
      `₹${agencyFee}`,
    ]);
    agencyRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        // Start from the second column to avoid the first empty cell
        cell.border = contentBorder;
        cell.font = { name: 'Comic Sans MS', bold: true };
      }
    });

    const gstPrice = Number(
      ((agencyFee + planDetails[0]?.selling_price) * 0.18).toFixed(2)
    );

    // console.log(typeof (gstPrice), 'gstPrice', typeof (agencyFees), typeof (planDetails[0]?.selling_price), agencyFees + planDetails[0]?.selling_price)

    let gstRow = overviewSheet.addRow([
      '',
      'GST (18%)',
      '',
      '',
      '',
      '',
      `₹${gstPrice}`,
    ]);
    gstRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        // Start from the second column to avoid the first empty cell
        cell.border = contentBorder;
        cell.font = { name: 'Comic Sans MS', bold: true };
      }
    });

    const totalCostWithGst =
      planDetails[0]?.selling_price + agencyFee + gstPrice;
    let totalWithGstRow = overviewSheet.addRow([
      '',
      'Total with GST',
      '',
      '',
      '',
      '',
      `₹${totalCostWithGst}`,
    ]);

    totalWithGstRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        // Start from the second column to avoid the first empty cell
        cell.border = contentBorder;
        cell.font = { name: 'Comic Sans MS', bold: true };
      }
    });
    // Merge cells B to E for each of the total rows
    overviewSheet.mergeCells(`B${agencyRow.number}:F${agencyRow.number}`);
    overviewSheet.mergeCells(`B${gstRow.number}:F${gstRow.number}`);
    overviewSheet.mergeCells(
      `B${totalWithGstRow.number}:F${totalWithGstRow.number}`
    );

    // Center-align and add styling to the merged cells
    [gstRow, agencyRow].forEach((row) => {
      row.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(2).font = { bold: true, name: 'Comic Sans MS', };
      // row.getCell(6).border = contentBorder; // Apply border only to 'Cost' column in these rows
    });
    // right-align and add styling to the merged cells
    [totalWithGstRow].forEach((row) => {
      row.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell(2).font = { name: 'Comic Sans MS', bold: true };
      row.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e6e6e6' }, // Light grey background color
      };
      row.getCell(7).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' }, // Light grey background color
      };
      // row.getCell(6).border = contentBorder; // Apply border only to 'Cost' column in these rows
    });

    // Apply borders only to content rows (dynamically based on data rows)
    const startRow = 8; // Starting row after the header
    const endRow = overviewSheet.rowCount; // Total number of rows in sheet
    for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
      overviewSheet.getRow(rowNum).eachCell((cell, colNumber) => {
        if (colNumber > 1 && cell.value !== undefined) {
          // Exclude the first column and check if cell has content
          cell.border = contentBorder; // Apply border only to content cells
        }
      });
    }

    // Define the notes you want to add
    const notes = checkedDescriptions;
    // [
    //   "This is the first note below the content rows.",
    //   "This is the second note below the content rows.",
    //   "Additional note here.",
    //   "Final note for reference."
    // ];

    const firstNoteRow = endRow + 2; // The row where notes start
    const lastNoteRow = firstNoteRow + notes.length - 1; // The last row of the notes

    overviewSheet.mergeCells(`F${8}:F${endRow - 3}`);
    overviewSheet.mergeCells(`G${8}:G${endRow - 3}`);
    const sellingPriceforsheet = overviewSheet.getCell('G8');
    sellingPriceforsheet.value = `₹${planDetails[0]?.selling_price}`;

    // Merge the B column cells for all note rows and set "Note" as the text
    if (checkedDescriptions.length > 0) {
      overviewSheet.mergeCells(`B${firstNoteRow}:B${lastNoteRow}`);
      const noteLabelCell = overviewSheet.getCell(`B${firstNoteRow}`);
      noteLabelCell.value = 'Note';
      noteLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };
      noteLabelCell.font = { bold: true };
      noteLabelCell.border = contentBorder; // Apply border to the merged "Note" cell
    }

    // Now, set each note in merged cells from C to G in its respective row and apply borders
    notes.forEach((note, index) => {
      const rowNum = firstNoteRow + index;
      const row = overviewSheet.getRow(rowNum);

      // Merge cells from column C to G in the current row for the note content
      overviewSheet.mergeCells(`C${rowNum}:G${rowNum}`);

      // Set the merged cell value to the note
      const contentCell = row.getCell(3); // Column C (3rd column)
      contentCell.value = `* ${note}`;
      contentCell.alignment = { horizontal: 'left', vertical: 'middle' };
      contentCell.font = { italic: true, bold: true };
      contentCell.border = contentBorder; // Apply border to the merged note cell

      // Apply border to all cells in the row (B to G)
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber >= 2 && colNumber <= 7) {
          // Apply borders from columns B to G
          cell.border = contentBorder;
        }
      });

      row.commit(); // Finalize changes to the row
    });

    // // console.log(endRow, "endRow"); // This logs the original endRow value

    // Adjust column widths considering empty column
    overviewSheet.getRow(1).height = 15; // Sets the height of the first row to 50
    overviewSheet.getRow(3).height = 20;
    overviewSheet.getRow(4).height = 20;
    overviewSheet.getRow(5).height = 20;
    overviewSheet.getColumn(1).width = 15; // Empty column for spacing
    overviewSheet.getColumn(2).width = 8; // Sno.
    overviewSheet.getColumn(3).width = 50; // Description
    overviewSheet.getColumn(4).width = 15; // Platform
    overviewSheet.getColumn(5).width = 20; // Count
    overviewSheet.getColumn(6).width = 20; // Deliverables
    overviewSheet.getColumn(7).width = 15; // Cost

    // Define the range for the content area
    const contentStartRow = 3; // Row where content starts
    const contentStartCol = 2; // Column where content starts
    const contentEndRow = overviewSheet.rowCount; // Set as the number of rows with content
    const contentEndCol = 7; // Set as the number of columns with content

    const totalRows = 500; // Adjust this to cover more rows if needed
    const totalCols = 100; // Adjust this to cover more columns if needed

    // Set a white background for the entire sheet, excluding the content area
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        // Skip the cells in the content area
        if (
          row >= contentStartRow &&
          row <= contentEndRow &&
          col >= contentStartCol &&
          col <= contentEndCol
        ) {
          continue;
        }

        const cell = overviewSheet.getCell(row, col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFFF' }, // White background
        };
      }
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${
        planDetails && formatString(planDetails[0]?.plan_name)
      }.xlsx`;
      a.click();
      URL.revokeObjectURL(url); // Clean up the URL
    });
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
  const calculatePrice = (rate_type, pageData, type) => {
    if (rate_type === 'Variable') {
      // Calculate for post price (followers_count / 10,000) * m_post_price
      if (type === 'post') {
        const postPrice =
          (pageData.followers_count / 1000000) * pageData.m_post_price;
        return postPrice;
      } else if (type === 'story') {
        const storyPrice =
          (pageData.followers_count / 1000000) * pageData.m_story_price;
        return storyPrice;
      } else {
        const bothPrice =
          (pageData.followers_count / 1000000) * pageData.m_both_price;
        return bothPrice;
      }
    }
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
          const rateType = page.rate_type === 'Fixed';

          const finalPostCost = rateType
            ? postPrice
            : calculatePrice(page.rate_type, page, 'post');
          const finalStoryCost = rateType
            ? storyPrice
            : calculatePrice(page.rate_type, page, 'story');
          const totalCost =
            postCountForPage * (finalPostCost || 0) +
            storyCountForPage * (finalStoryCost || 0);

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

  const sendPlanxLogs = async (endpoint, payload) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error making API request:', error);
      throw error;
    }
  };

  const handleSave = () => {
    const payload = {
      id: planDetails && planDetails[0]._id,
      plan_status: 'open',
      plan_name: planName,
      selling_price: sellingPrice,
      // plan_saved: true,
      // post_count: totalPostCount,
      // story_count: totalStoryCount,
      // no_of_pages: selectedRows?.length,
      // cost_price: totalCost,
    };
    sendPlanxLogs('v1/planxlogs', payload);
    setIsEditing(false); // Close the input fields after save
  };

  return (
    <div className="planLeftSideWrapper">
      <div className="planLeftSideBody">
        <div className="planSmall">
          {' '}
          <div>
            <Button variant="text" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>{' '}
            {isEditing && (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            )}
            <h6>
              Selling Price:
              {isEditing ? (
                <TextField
                  value={sellingPrice || planDetails?.[0]?.selling_price || ''}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                  }}
                  type="number"
                />
              ) : (
                <span>{sellingPrice || planDetails?.[0]?.selling_price}</span>
              )}
            </h6>
            <h6>
              Plan Name:
              {isEditing ? (
                <TextField
                  value={planName || planDetails?.[0]?.plan_name || ''}
                  onChange={(e) => setPlanName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                  }}
                />
              ) : (
                <span>{planName || planDetails?.[0]?.plan_name}</span> // Display the default if no planName
              )}
            </h6>
          </div>
          <h6>
            Account Name
            <span>
              {planDetails && formatString(planDetails[0]?.account_name)}
            </span>
          </h6>
        </div>
        <div className="planSmall">
          <h6>
            Total Followers
            <span>{formatFollowers(totalFollowers)}</span>
          </h6>
          <h6>
            Total Cost
            <span>{Math.floor(totalCost)}</span>
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
          agencyFees={agencyFees}
          setAgencyFees={setAgencyFees}
          selectedRow={selectedRow}
          category={category}
          postCount={postCount}
          storyPerPage={storyPerPage}
          planDetails={planDetails}
          checkedDescriptions={checkedDescriptions}
          downloadExcel={downloadExcel}
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
                Total Post & Story Cost : ₹{' '}
                {Math.round(ownershipCounts[type].totalCost)}
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
        {/* <button
          className="btn icon"
          onClick={() =>
            downloadExcel(
              selectedRow,
              category,
              postCount,
              storyPerPage,
              planDetails,
              checkedDescriptions
            )
          }
        >
          {' '}
          <Tooltip title="Download Excel">
            <IconButton>
              <DownloadSimple />{' '}
            </IconButton>
          </Tooltip>
        </button> */}
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
