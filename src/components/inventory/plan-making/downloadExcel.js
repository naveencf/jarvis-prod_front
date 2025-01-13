import formatString from '../../../utils/formatString';
import * as XLSX from 'xlsx-js-style';
import ExcelJS from 'exceljs';
import { formatIndianNumber } from '../../../utils/formatIndianNumber';

export const getPlatformName = (platformId) => {
  const platformMap = {
    '666818824366007df1df1319': 'Instagram',
    '666818a44366007df1df1322': 'Facebook',
    '666856d34366007df1dfacf6': 'YouTube',
    '666818c34366007df1df1328': 'Twitter',
    '666856e04366007df1dfacfc': 'Snapchat',
    '67472a28fc48d70fbf1c2ddb': 'Thread',
  };
  return platformMap[platformId] || 'Unknown';
};

export const getPriceDetail = (priceDetails, key) => {
  const keyType = key.split('_')[1];

  const detail = priceDetails?.find((item) => {
    return Object.keys(item).some((priceKey) => priceKey.includes(keyType));
  });

  return detail ? detail[Object.keys(detail).find((key) => key.includes(keyType))] : 0;
};

// Helper function to convert Indian numbering string to a number
// function parseIndianNumber(indianNumber) {
//   // Remove commas and parse as an integer
//   return parseInt(indianNumber.replace(/,/g, ''), 10);
// }

export const downloadExcel = async (selectedRow, category, postCount, storyPerPage, planDetails, checkedDescriptions, agencyFees, deliverableText, isGetSheet) => {
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
      row: 2 + topMargin / 20, // Convert points to Excel rows (approximately)
    },
    ext: {
      width: 90, // Image width in points
      height: 70, // Image height in points
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
  overviewSheet.getRow(7).values = ['', 'Sno.', 'Description', 'Platform', 'Count', 'Deliverables', 'Cost'];
  const headerColor = ['F9CB9C', '92C47C', 'FCE5CD', 'D9CABD', 'E06666', 'FFE599'];
  const randomNumber = Math.floor(Math.random() * 9) + 1;
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
      cell.font = { bold: true, name: 'Comic Sans MS' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColor[randomNumber % 4] }, // Light brown fill
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = contentBorder; // Apply border to content
    }
  });

  const platforms = ['Instagram', 'Facebook', 'YouTube', 'Twitter', 'Snapchat', 'Thread'];
  var serialNumber = 1;
  for (const platform of platforms) {
    const platformData = selectedRow?.filter((page) => !!page.platform_id);

    if (!platformData?.length) continue;
    const categories = {};
    if (platform === 'Instagram') {
      platformData.forEach((page) => {
        if (page.platform_name === 'instagram') {
          const categoryId = page.page_category_id;
          const pageLink = `https://www.${platform.toLowerCase()}.com/${page.page_name}`;
          const categoryName = category?.find((cat) => cat._id === categoryId)?.page_category || 'Unknown';

          categories[categoryName] = categories[categoryName] || [];
          // Check if the post and story counts are coming through
          const postCountValue = postCount[page._id] || 0;
          const storyCountValue = storyPerPage[page._id] || 0;

          categories[categoryName].push({
            S_No: categories[categoryName].length + 1,
            Username: page.page_name || 'N/A',
            'Profile Link': pageLink || 'N/A',
            Followers: page.followers_count || 0,
            'Post Count': postCountValue,
            'Story Count': storyCountValue,
          });

          totalPostsAndStories += postCountValue + storyCountValue;

          totalCost += postCountValue * getPriceDetail(page.page_price_list, 'instagram_post') + storyCountValue * getPriceDetail(page.page_price_list, 'instagram_story');
        }
      });

      const categoriesEntries = Object.entries(categories);

      for (let i = 0; i < categoriesEntries.length; i++) {
        const [categoryName, categoryData] = categoriesEntries[i];
        const sheet = workbook.addWorksheet(formatString(categoryName));

        // Determine if the category has any Story Count > 0
        const hasStoryCount = categoryData.some((item) => item['Story Count'] > 0);

        sheet.columns = [
          // { header: '', width: 5 },
          { header: 'S_No', width: 15 },
          { header: 'Username', width: 30 },
          { header: 'Profile Link', width: 50 },
          { header: 'Followers', width: 15 },
          { header: 'Post Count', width: 15 },
          hasStoryCount && { header: 'Story Count', width: 15 },
        ];
        // Sort categoryData by Followers in descending order
        categoryData.sort((a, b) => {
          const followersA = a.Followers;
          const followersB = b.Followers;
          return followersB - followersA; // Sort descending
        });
        // Update serial numbers after sorting
        categoryData.forEach((row, index) => {
          row.S_No = index + 1; // Set the serial number based on the sorted index
        });

        categoryData.forEach((row) => sheet.addRow(row));
        // Apply border to all rows in category sheet
        sheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colNumber) => {
            cell.font = {
              name: 'Comic Sans MS',
              bold: true,
              color: { argb: 'FF000000' },
            };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });

        const newRow = overviewSheet.addRow([
          '',
          serialNumber, // Serial number based on the length of the sheet
          `Post ${hasStoryCount ? 'and Stories' : ''} on ${formatString(categoryName)} Profiles`, // Description
          platform, // Platform
          categoryData.reduce((acc, item) => acc + Number(item['Post Count']) + Number(item['Story Count'] || 0), 0), // Total post and story count for category
          deliverableText,
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
          // cell.font = { bold: true, color: { argb: 'FF000000' } };
          cell.font = {
            name: 'Comic Sans MS',
            bold: true,
            color: { argb: 'FF000000' },
          };
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
          sNoCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          const usernameCell = sheet.getCell(`B${index + 2}`);
          usernameCell.value = formatString(item['Username']); // Username in column B
          usernameCell.border = contentBorder; // Apply border to the Username cell
          usernameCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

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
            name: 'Comic Sans MS',
            size: 10,
          };

          const followersCell = sheet.getCell(`D${index + 2}`);
          followersCell.value = item['Followers']; // Followers in column D
          // console.log(followersCell.value, "followersCell.value")
          followersCell.border = contentBorder; // Apply border to the Followers cell
          followersCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          }; // Alignment
          followersCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          const postCountCell = sheet.getCell(`E${index + 2}`);
          postCountCell.value = item['Post Count']; // Post Count in column E
          postCountCell.border = contentBorder; // Apply border to the Post Count cell
          postCountCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          }; // Alignment
          postCountCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          // Only add Story Count if there's at least one story count > 0 in the category
          if (hasStoryCount) {
            const storyCountCell = sheet.getCell(`F${index + 2}`);
            storyCountCell.value = item['Story Count']; // Story Count in column F
            storyCountCell.border = contentBorder; // Apply border to the Story Count cell
            storyCountCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }; // Alignment
            storyCountCell.font = {
              name: 'Comic Sans MS',
              size: 10,
              bold: true,
            };
          }
        });
      }
    } else {
      const platformPages = platformData.filter((page) => page.platform_name === platform.toLowerCase());
      if (!platformPages?.length) continue; // Skip if no pages for the platform

      // Group pages into categories based on platform
      const groupedPages = platformPages.reduce((acc, page) => {
        const pageLink = `https://www.${platform.toLowerCase()}.com/${page.page_name}`;
        acc[platform] = acc[platform] || [];

        acc[platform].push({
          S_No: acc[platform].length + 1,
          Username: page.page_name || 'N/A',
          'Profile Link': pageLink || 'N/A',
          Followers: page.followers_count || 0,
          'Post Count': postCount[page._id] || 0,
          'Story Count': storyPerPage[page._id] || 0,
        });
        return acc;
      }, {});

      // Loop through grouped platforms and create subsheets
      Object.entries(groupedPages).forEach(([platformName, pages]) => {
        // Ensure unique sheet name
        let sheetName = platformName;
        let counter = 1;
        while (workbook.getWorksheet(sheetName)) {
          sheetName = `${platformName} (${counter++})`;
        }

        // Create worksheet for the platform
        const sheet = workbook.addWorksheet(sheetName);
        const hasStoryCount = pages.some((item) => item['Story Count'] > 0);
        // Define sheet columns
        sheet.columns = [{ header: 'S_No', width: 10 }, { header: 'Username', width: 30 }, { header: 'Profile Link', width: 50 }, { header: 'Followers', width: 15 }, { header: 'Post Count', width: 15 }, hasStoryCount && { header: 'Story Count', width: 15 }];

        // Sort pages by followers in descending order
        pages.sort((a, b) => b.Followers - a.Followers);

        // Update serial numbers after sorting
        pages.forEach((row, index) => {
          row.S_No = index + 1;
        });

        // Add rows to the sheet
        if (pages.length > 0) {
          pages.forEach((row) => sheet.addRow(row));
        }

        pages.forEach((item, index) => {
          // Assign other values to respective columns and apply borders
          const sNoCell = sheet.getCell(`A${index + 2}`);
          sNoCell.value = item['S_No']; // S_No in column A
          sNoCell.border = contentBorder; // Apply border to the S_No cell
          sNoCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Alignment
          sNoCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          const usernameCell = sheet.getCell(`B${index + 2}`);
          usernameCell.value = formatString(item['Username']); // Username in column B
          usernameCell.border = contentBorder; // Apply border to the Username cell
          usernameCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

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
            name: 'Comic Sans MS',
            size: 10,
          };

          // // Set the hyperlink
          // profileLinkCell.hyperlink = item['Profile Link'];

          const followersCell = sheet.getCell(`D${index + 2}`);
          followersCell.value = item['Followers']; // Followers in column D
          // console.log(followersCell.value, "followersCell.value")
          followersCell.border = contentBorder; // Apply border to the Followers cell
          followersCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          }; // Alignment
          followersCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          const postCountCell = sheet.getCell(`E${index + 2}`);
          postCountCell.value = item['Post Count']; // Post Count in column E
          postCountCell.border = contentBorder; // Apply border to the Post Count cell
          postCountCell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          }; // Alignment
          postCountCell.font = { name: 'Comic Sans MS', size: 10, bold: true };

          // Only add Story Count if there's at least one story count > 0 in the category
          if (hasStoryCount) {
            const storyCountCell = sheet.getCell(`F${index + 2}`);
            storyCountCell.value = item['Story Count']; // Story Count in column F
            storyCountCell.border = contentBorder; // Apply border to the Story Count cell
            storyCountCell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            }; // Alignment
            storyCountCell.font = {
              name: 'Comic Sans MS',
              size: 10,
              bold: true,
            };
          }
        });
        // Style header row
        sheet.getRow(1).eachCell((cell) => {
          cell.font = {
            name: 'Comic Sans MS',
            bold: true,
            color: { argb: 'FF000000' },
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
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

        // Style all rows
        sheet.eachRow((row, rowIndex) => {
          if (rowIndex === 1) return; // Skip header row
          row.eachCell((cell) => {
            cell.font = {
              name: 'Comic Sans MS',
              bold: true,
              color: { argb: 'FF000000' },
            };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });

        // Add overview entry for the platform
        const totalPosts = pages.reduce((sum, page) => sum + page['Post Count'], 0);
        const totalStories = pages.reduce((sum, page) => sum + Number(page['Story Count']), 0);

        const platformTotalCost = pages.reduce((sum, page) => {
          const postPrice = getPriceDetail(platformPages.find((p) => p.page_name === page.Username)?.page_price_list, `${platform.toLowerCase()}_post`);
          const storyPrice = getPriceDetail(platformPages.find((p) => p.page_name === page.Username)?.page_price_list, `${platform.toLowerCase()}_story`);
          return sum + page['Post Count'] * postPrice + page['Story Count'] * storyPrice;
        }, 0);

        totalPostsAndStories = 0;
        totalPostsAndStories += Number(totalPosts) + Number(totalStories);

        const overviewRow = overviewSheet.addRow([
          '',
          serialNumber++, // Serial number
          `Posts and Stories on (${platformName})`,
          platformName, // Platform
          totalPostsAndStories, // Total posts and stories
          deliverableText, // Deliverables
          `₹${platformTotalCost.toFixed(2)}`, // Total cost
        ]);

        // Apply styles to overview row
        overviewRow.eachCell((cell, colNumber) => {
          cell.font = { name: 'Comic Sans MS', bold: true };
          cell.border = contentBorder;
          cell.alignment = colNumber === 3 ? { horizontal: 'left', vertical: 'middle' } : { horizontal: 'center', vertical: 'middle' };
        });
      });
    }
  }
  // }

  const agencyFee = Number(((planDetails[0]?.selling_price * agencyFees) / 100).toFixed(2));
  let agencyRow = overviewSheet.addRow(['', `Agency Fees (${agencyFees}%)`, '', '', '', '', `₹${formatIndianNumber(agencyFee)}`]);
  agencyRow.eachCell((cell, colNumber) => {
    if (colNumber > 1) {
      // Start from the second column to avoid the first empty cell
      cell.border = contentBorder;
      cell.font = { name: 'Comic Sans MS', bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  const gstPrice = Number(((agencyFee + planDetails[0]?.selling_price) * 0.18).toFixed(2));

  // console.log(typeof (gstPrice), 'gstPrice', typeof (agencyFees), typeof (planDetails[0]?.selling_price), agencyFees + planDetails[0]?.selling_price)

  let gstRow = overviewSheet.addRow(['', 'GST (18%)', '', '', '', '', `₹${formatIndianNumber(gstPrice)}`]);
  gstRow.eachCell((cell, colNumber) => {
    if (colNumber > 1) {
      // Start from the second column to avoid the first empty cell
      cell.border = contentBorder;
      cell.font = { name: 'Comic Sans MS', bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  const totalCostWithGst = planDetails[0]?.selling_price + agencyFee + gstPrice;
  let totalWithGstRow = overviewSheet.addRow(['', 'Total with GST', '', '', '', '', `₹${formatIndianNumber(totalCostWithGst)}`]);

  totalWithGstRow.eachCell((cell, colNumber) => {
    if (colNumber > 1) {
      // Start from the second column to avoid the first empty cell
      cell.border = contentBorder;
      cell.font = { name: 'Comic Sans MS', bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });
  // Merge cells B to E for each of the total rows
  overviewSheet.mergeCells(`B${agencyRow.number}:F${agencyRow.number}`);
  overviewSheet.mergeCells(`B${gstRow.number}:F${gstRow.number}`);
  overviewSheet.mergeCells(`B${totalWithGstRow.number}:F${totalWithGstRow.number}`);

  // Center-align and add styling to the merged cells
  [gstRow, agencyRow].forEach((row) => {
    row.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(2).font = { bold: true, name: 'Comic Sans MS' };
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

  const firstNoteRow = endRow + 2; // The row where notes start
  const lastNoteRow = firstNoteRow + notes.length - 1; // The last row of the notes

  overviewSheet.mergeCells(`F${8}:F${endRow - 3}`);
  overviewSheet.mergeCells(`G${8}:G${endRow - 3}`);
  const sellingPriceforsheet = overviewSheet.getCell('G8');
  sellingPriceforsheet.value = `₹${formatIndianNumber(planDetails[0]?.selling_price)}`;

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
  overviewSheet.getColumn(2).width = 15; // Sno.
  overviewSheet.getColumn(3).width = 40; // Description
  overviewSheet.getColumn(4).width = 30; // Platform
  overviewSheet.getColumn(5).width = 20; // Count
  overviewSheet.getColumn(6).width = 30; // Deliverables
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
      if (row >= contentStartRow && row <= contentEndRow && col >= contentStartCol && col <= contentEndCol) {
        continue;
      }

      const cell = overviewSheet.getCell(row, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F3F3F3' }, // White background
      };
    }
  }

  // if (!isGetSheet) {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlfor/ats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${planDetails && formatString(planDetails[0]?.plan_name)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  });
  // } else {
  // const buffer = await workbook.xlsx.writeBuffer();
  // console.log('buffer', buffer);
  // return buffer;
  // }
};
