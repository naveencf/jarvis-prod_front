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
  };
  return platformMap[platformId] || 'Unknown';
};

export const getPriceDetail = (priceDetails, key) => {
  const detail = priceDetails?.find((item) => item[key] !== undefined);
  return detail ? detail[key] : 0;
};

export const downloadExcel = async (
  selectedRow,
  category,
  postCount,
  storyPerPage,
  planDetails,
  checkedDescriptions,
  agencyFees,
  deliverableText
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
      row: 2 + topMargin / 20, // Convert points to Excel rows (approximately)
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
      cell.font = { bold: true, name: 'Comic Sans MS' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9CABD' }, // Light brown fill
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = contentBorder; // Apply border to content
    }
  });

  const platforms = ['Instagram', 'Facebook', 'YouTube', 'Twitter', 'Snapchat'];

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
          Followers: formatIndianNumber(page.followers_count) || 0,
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
          )} Profiles`, // Description
          'Instagram', // Platform
          categoryData.reduce(
            (acc, item) =>
              acc +
              Number(item['Post Count']) +
              Number(item['Story Count'] || 0),
            0
          ), // Total post and story count for category
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

  const totalCostWithGst = planDetails[0]?.selling_price + agencyFee + gstPrice;
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
  overviewSheet.getColumn(2).width = 15; // Sno.
  overviewSheet.getColumn(3).width = 50; // Description
  overviewSheet.getColumn(4).width = 30; // Platform
  overviewSheet.getColumn(5).width = 20; // Count
  overviewSheet.getColumn(6).width = 50; // Deliverables
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
        fgColor: { argb: 'D3D3D3' }, // White background
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
