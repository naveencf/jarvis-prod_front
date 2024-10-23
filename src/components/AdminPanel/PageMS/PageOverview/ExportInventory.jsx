import jwtDecode from "jwt-decode";
import React, { useContext } from "react";
import { useGetAllPageListQuery } from "../../../Store/PageBaseURL";
import * as XLSX from "xlsx";
import { AppContext } from "../../../../Context/Context";
function ExportInventory({ pageList}) {
  const {  usersDataContext } = useContext(AppContext);

  

  // console.log(pageList, 'pageList');
  const handleExport = () => {
    const formattedData = pageList?.map((row, index) => {
     

      const closeByName = usersDataContext?.find(
        (item) => item?.user_id === row.page_closed_by
      )?.user_name;

     

      return {
        "User Name": row.page_name,                      // Page Name
        Level: row.preference_level,                     // Preference Level
        Ownership: row.ownership_type,                   // Ownership Type     
        Vendor:     row?.vendor_name,
        "Closed By": closeByName,
        "Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
        "Rate Type": row.rate_type,
        "Variable Type": row.variable_type,
        "Content Creation": row.content_creation,        // Content Creation
        "Engagement Rate": row.engagment_rate,           // Engagement Rate       
        "Page Activeness": row.page_activeness,          // Page Activeness
        "Profile Type": row.page_profile_type_name,      // Page Profile Type
        "Subcategory": row.page_sub_category_name,       // Page Subcategory
        "Tags Category": row.tags_page_category_name.join(", "),  // Tags Category
        "Page Language": row.page_language_name.join(", "),       // Page Language
        "Price List": row.page_price_list.map((item) => {         // Price List
          return `${Object.keys(item)[0]}: ${(Object.values(item)[0])}`;
        }).join(", "),
   

        // Age_13_17_percent: row.Age_13_17_percent,
        // Age_18_24_percent: row.Age_18_24_percent,
        // Age_25_34_percent: row.Age_25_34_percent,
        // Age_35_44_percent: row.Age_35_44_percent,
        // Age_45_54_percent: row.Age_45_54_percent,
        // Age_55_64_percent: row.Age_55_64_percent,
        // Age_65_plus_percent: row.Age_65_plus_percent,
        // Age_upload_url: row.Age_upload_url,
        // both_: row.both_,
        // city1_name: row.city1_name,
        // city2_name: row.city2_name,
        // city3_name: row.city3_name,
        // city4_name: row.city4_name,
        // city5_name: row.city5_name,
        // city_image_url: row.city_image_url,
        // country1_name: row.country1_name,
        // country2_name: row.country2_name,
        // country3_name: row.country3_name,
        // country4_name: row.country4_name,
        // country5_name: row.country5_name,
        // country_image_url: row.country_image_url,
        // created_at: row.created_at,
        // engagement: row.engagement,
        // engagement_image_url: row.engagement_image_url,
        // female_percent: row.female_percent,
        // follower_count_before_update: row.follower_count_before_update,
        // followers_count: row.followers_count,
        // impression: row.impression,
        // impression_image_url: row.impression_image_url,
        // male_percent: row.male_percent,
        // page_link: row.page_link,
        // // 'page_status': row.page_status,
        // percentage_city1_name: row.percentage_city1_name,
        // percentage_city2_name: row.percentage_city2_name,
        // percentage_city3_name: row.percentage_city3_name,
        // percentage_city4_name: row.percentage_city4_name,
        // percentage_city5_name: row.percentage_city5_name,
        // percentage_country1_name: row.percentage_country1_name,
        // percentage_country2_name: row.percentage_country2_name,
        // percentage_country3_name: row.percentage_country3_name,
        // percentage_country4_name: row.percentage_country4_name,
        // percentage_country5_name: row.percentage_country5_name,
        // profile_visit: row.profile_visit,
        // reach: row.reach,
        // reach_image_url: row.reach_image_url,
        // story_view: row.story_view,
        // story_view_image_url: row.story_view_image_url,
      };
    });

    const fileName = "data.xlsx";
    console.log(formattedData);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };
  return <div className="col-md-3 mb16">
    <button
      // type="button"
      className="btn cmnbtn btn_sm btn-outline-primary"
      onClick={()=>handleExport()}
    >
      Export Excel
    </button>
  </div>;
}

export default ExportInventory;
