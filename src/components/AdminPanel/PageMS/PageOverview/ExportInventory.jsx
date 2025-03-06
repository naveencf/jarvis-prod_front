import jwtDecode from "jwt-decode";
import React, { useContext } from "react";
import { useGetAllPageListQuery } from "../../../Store/PageBaseURL";
import * as XLSX from 'xlsx-js-style';
import { FormatName } from "../../../../utils/FormatName";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

function ExportInventory({ pageList }) {

  const {userContextData} = useAPIGlobalContext()

  // console.log(pageList, 'pageList');
  const handleExport = () => {
    const formattedData = pageList?.map((row, index) => {
      const closeByName = userContextData?.find(
        (item) => item?.user_id === row.page_closed_by
      )?.user_name;

      let postPrice = 0;
      let storyPrice = 0;
      let bothPrice = 0;
      let millionPostPrice = 0;

      row.page_price_list.forEach((item) => {
        const key = Object.keys(item)[0];
        const value = Object.values(item)[0];

        if (key === "instagram_post") {
          postPrice = value;
        } else if (key === "instagram_story") {
          storyPrice = value;
        } else if (key === "instagram_both") {
          bothPrice = value;
        }else if (key === "instagram_m_post"){
          millionPostPrice = value;
        }
      });

      return {
        "User Name": FormatName(row.page_name),
        "Level": FormatName(row.preference_level),
        "Ownership": FormatName(row.ownership_type),
        "Vendor": FormatName(row?.vendor_name),
        "Closed By": closeByName,
        "Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
        "Rate Type": row.rate_type,
        // "Variable Type": row.variable_type ,
        "Engagement Rate": row.engagment_rate || 0,
        "Page Activeness": FormatName(row.page_activeness),
        "Profile Type": row.page_profile_type_name,
        "Subcategory": row.page_sub_category_name,
        "Tags Category": row.tags_page_category_name.join(", "),
        "Page Language": row.page_language_name.join(", "),
        "Followers": row.followers_count,
        'link':row.platform_name == "instagram" ? `https://www.instagram.com/${row.page_name}`:"",
        "Price List": row.page_price_list
          .map((item) => `${Object.keys(item)[0]}: ${Object.values(item)[0]}`)
          .join(", "),
        "Post": postPrice,
        "Story": storyPrice,
        "Both": bothPrice,
        "Million_Post": row.m_post_price,
        "Million_Story": row?.m_story_price,
        "Million_Both": row?.m_both_price,
      };
    });

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Apply cell styles
    applyCellStyles(worksheet);
    addHyperlinksAndAdjustWidths(worksheet);

    // Write file
    XLSX.writeFile(workbook, fileName);
};

// Helper function to apply cell styles
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
      sheet[address].s.font = { bold: true };
      if (C === 0 || C === 3) {
        // Center align specific columns
        sheet[address].s.alignment = { horizontal: 'center', vertical: 'center' };
      }
    }
  }
};
// Update the `addHyperlinksAndAdjustWidths` function to hyperlink the `link` field
const addHyperlinksAndAdjustWidths = (worksheet) => {
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  // Apply column widths
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 50 },
    { wch: 15 }, // Column width for the `link` column
    // Add widths for other columns as needed
  ];

  // Assuming the `link` field is in the 17th column (index 16), update this based on the actual column
  const linkColumnIndex = 16; // Adjust this index based on actual placement of the `link` field
  
  // Add hyperlinks to the `link` column
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const address = XLSX.utils.encode_cell({ r: R, c: linkColumnIndex });
    const profileLink = worksheet[address]?.v;
    if (profileLink) {
      worksheet[address].l = {
        Target: profileLink,
        Tooltip: 'Click to open profile',
      };
    }
  }
};

//   // Add hyperlinks to 'Profile Link' column (assuming it's at index 2)
//   for (let R = range.s.r + 1; R <= range.e.r; ++R) {
//     const address = XLSX.utils.encode_cell({ r: R, c: 2 }); // Column 'C' (index 2)
//     const profileLink = worksheet[address]?.v;
//     if (profileLink) {
//       worksheet[address].l = {
//         Target: profileLink,
//         Tooltip: 'Click to open profile',
//       };
//     }
//   }
// };

  return (
    <div className="col-md-3 mb16">
      <button
        // type="button"
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={() => handleExport()}
      >
        Export Excel
      </button>
    </div>
  );
}

export default ExportInventory;
