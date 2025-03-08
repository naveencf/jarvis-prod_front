import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useContext } from "react";
// import { AppContext } from "../../../../Context/Context";
import { Button } from "@mui/material";
import { formatNumber } from "../../../../utils/formatNumber";
import * as XLSX from "xlsx";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const FilterWisePageOverview = ({
  platformData,
  vendorTypes,
  setFilterData,
  setTabFilterData,
  calculateAndSetTotals,
  subCat,
  cat,
  profileData,
  newFilterData,
  vendorData,
}) => {
  // const { userContextData } = useContext(AppContext);
  const { userContextData } = useAPIGlobalContext()

  const handleExport = () => {
    const formattedData = newFilterData?.map((row, index) => {
      const platformName = platformData?.find(
        (item) => item?._id === row.platform_id
      )?.platform_name;

      const categoryName = cat?.find(
        (item) => item?._id === row.page_category_id
      )?.page_category;

      const vendorName = vendorData?.find(
        (item) => item?.vendor_id === row.temp_vendor_id
      )?.vendor_name;

      const closeByName = userContextData?.find(
        (item) => item?.user_id === row.page_closed_by
      )?.user_name;

      const pageStatusDescription =
        row.page_mast_status == 0
          ? "Active"
          : row.page_mast_status == 1
            ? "Inactive"
            : row.page_mast_status == 2
              ? "Delete"
              : row.page_mast_status == 3
                ? "Semiactive"
                : "Unknown";

      return {
        "S.No": index + 1,
        "User Name": row.page_name,
        Level: row.preference_level,
        Status: pageStatusDescription,
        Ownership: row.ownership_type,
        Platform: platformName || "N/A",
        Category: categoryName || "N/A",
        Followers: formatNumber(row.followers_count),
        Vendor: vendorName || "N/A",
        "Active Platform": row.platform_active_on,

        "Closed By": closeByName,
        "Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
        "Rate Type": row.rate_type,
        "Variable Type": row.variable_type,
        "Story Price": row.m_story_price,
        "Post Price": row.m_post_price,
        "Both Price": row.m_both_price,

        Age_13_17_percent: row.Age_13_17_percent,
        Age_18_24_percent: row.Age_18_24_percent,
        Age_25_34_percent: row.Age_25_34_percent,
        Age_35_44_percent: row.Age_35_44_percent,
        Age_45_54_percent: row.Age_45_54_percent,
        Age_55_64_percent: row.Age_55_64_percent,
        Age_65_plus_percent: row.Age_65_plus_percent,
        Age_upload_url: row.Age_upload_url,
        both_: row.both_,
        city1_name: row.city1_name,
        city2_name: row.city2_name,
        city3_name: row.city3_name,
        city4_name: row.city4_name,
        city5_name: row.city5_name,
        city_image_url: row.city_image_url,
        country1_name: row.country1_name,
        country2_name: row.country2_name,
        country3_name: row.country3_name,
        country4_name: row.country4_name,
        country5_name: row.country5_name,
        country_image_url: row.country_image_url,
        created_at: row.created_at,
        engagement: row.engagement,
        engagement_image_url: row.engagement_image_url,
        female_percent: row.female_percent,
        follower_count_before_update: row.follower_count_before_update,
        followers_count: row.followers_count,
        impression: row.impression,
        impression_image_url: row.impression_image_url,
        male_percent: row.male_percent,
        page_link: row.page_link,
        // 'page_status': row.page_status,
        percentage_city1_name: row.percentage_city1_name,
        percentage_city2_name: row.percentage_city2_name,
        percentage_city3_name: row.percentage_city3_name,
        percentage_city4_name: row.percentage_city4_name,
        percentage_city5_name: row.percentage_city5_name,
        percentage_country1_name: row.percentage_country1_name,
        percentage_country2_name: row.percentage_country2_name,
        percentage_country3_name: row.percentage_country3_name,
        percentage_country4_name: row.percentage_country4_name,
        percentage_country5_name: row.percentage_country5_name,
        profile_visit: row.profile_visit,
        reach: row.reach,
        reach_image_url: row.reach_image_url,
        story_view: row.story_view,
        story_view_image_url: row.story_view_image_url,
      };
    });

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };
  const handleClick = (platform) => {
    const res = vendorTypes?.filter((d) => d.platform_id == platform);
    setFilterData(res);
    setTabFilterData(res);
    calculateAndSetTotals(res);
  };
  return (
    <div>
      <div className="d-flex">
        {platformData?.map((platform) => {
          const count = vendorTypes?.filter(
            (d) => d.platform_id === platform._id
          )?.length;
          return (
            <button
              key={platform._id}
              onClick={() => handleClick(platform._id)}
              style={{ margin: "0 5px 15px 0" }}
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              {`${platform.platform_name} (${count})`}
            </button>
          );
        })}
      </div>
      <div className="row thm_form">
        <div className="col-md-4 mb16">
          <Autocomplete
            id="subcat-autocomplete"
            options={subCat}
            getOptionLabel={(option) => {
              const count = vendorTypes?.filter(
                (d) => d?.page_sub_category_id == option?._id
              )?.length;
              return `${option?.page_sub_category} (${count})`;
            }}
            style={{ width: 270 }}
            renderInput={(params) => (
              <TextField {...params} label="Sub Category" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes?.filter(
                  (d) => d?.page_sub_category_id == newValue?._id
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>

        <div className="col-md-4 mb16">
          <Autocomplete
            id="ownership-type-autocomplete"
            options={[
              ...new Set(vendorTypes?.map((item) => item?.ownership_type)),
            ]}
            getOptionLabel={(option) => {
              const count = vendorTypes?.filter(
                (d) => d?.ownership_type === option
              )?.length;
              return `${option} (${count})`;
            }}
            style={{ width: 270 }}
            renderInput={(params) => (
              <TextField {...params} label="Ownership" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes?.filter(
                  (d) => d?.ownership_type === newValue
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-4 mb16">
          <Autocomplete
            id="page-status-autocomplete"
            options={[
              ...new Set(vendorTypes?.map((item) => item?.page_mast_status)),
            ]}
            getOptionLabel={(option) => {
              const count = vendorTypes?.filter(
                (d) => d.page_mast_status === option
              )?.length;
              const name =
                option === 0
                  ? "Active"
                  : option === 1
                    ? "Inactive"
                    : option === 2
                      ? "Delete"
                      : option === 3
                        ? "Semiactive"
                        : "Unknown";
              return `${name} (${count})`;
            }}
            style={{ width: 270 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Profile Status"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes?.filter(
                  (d) => d.page_mast_status === newValue
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-4 mb16">
          <Autocomplete
            id="pagename-type-autocomplete"
            options={[
              ...new Set(
                vendorTypes?.map((item) => {
                  return item?.page_name_type;
                })
              ),
            ]}
            getOptionLabel={(option) => {
              const count = vendorTypes?.filter(
                (d) => d.page_name_type == option
              )?.length;
              return `${option} (${count})`;
            }}
            style={{ width: 270 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Profile Name Type"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes?.filter(
                  (d) => d.page_name_type == newValue
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-3 mb16">
          <Autocomplete
            id="closedby-autocomplete"
            options={[
              ...new Set(
                vendorTypes?.map((item) => {
                  return item?.page_closed_by;
                })
              ),
            ]}
            getOptionLabel={(option) => {
              const users = userContextData?.find((e) => e.user_id == option);
              const count = vendorTypes?.filter(
                (d) => d.page_closed_by == option
              )?.length;
              return `${users?.user_name} (${count})`;
            }}
            style={{ width: 270 }}
            renderInput={(params) => (
              <TextField {...params} label="Closed By" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes?.filter(
                  (d) => d.page_closed_by == newValue
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-3 mb16">
          <Autocomplete
            id="category-autocomplete"
            multiple
            options={[
              ...new Set(vendorTypes?.map((item) => item?.page_category_id)),
            ]}
            getOptionLabel={(option) => {
              const category = cat?.find((e) => e?._id === option);
              const count = vendorTypes?.filter(
                (d) => d?.page_category_id === option
              ).length;
              return `${category?.page_category || "Unknown Category"
                } (${count})`;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Category"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              if (newValue.length === 0) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
                console.log(newValue, "newValue");
              } else {
                console.log(newValue, "newValue");
                let result = vendorTypes.filter((d) =>
                  newValue.includes(d.page_category_id)
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-3 mb16">
          <Autocomplete
            id="profile-type"
            options={[
              ...new Set(
                vendorTypes?.map((item) => item?.page_profile_type_id)
              ),
            ]}
            getOptionLabel={(option) => {
              const category = profileData?.data?.find(
                (e) => e?._id === option
              );
              const count = vendorTypes?.filter(
                (d) => d?.page_profile_type_id === option
              ).length;
              return `${category?.profile_type || "Unknown Profile"
                } (${count})`;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Profile Type"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
                calculateAndSetTotals(vendorTypes);
              } else {
                let result = vendorTypes.filter(
                  (d) => d.page_profile_type_id == newValue
                );
                setFilterData(result);
                calculateAndSetTotals(result);
              }
            }}
          />
        </div>
        <div className="col-md-3">
          <Autocomplete
            id="Health of Pages"
            options={[
              { value: "Done", label: "Done" },
              { value: "Not Done", label: "Not Done" },
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Completion"
                variant="outlined"
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onChange={(event, newValue) => {
              if (newValue === null) {
                setFilterData(vendorTypes);
              } else {
                let result = [];
                if (newValue.value === "Done") {
                  result = newFilterData?.filter(
                    (d) =>
                      d.hasOwnProperty("reach") &&
                      d.hasOwnProperty("impression")
                  );
                } else if (newValue.value === "Not Done") {
                  result = newFilterData.filter(
                    (d) =>
                      !d.hasOwnProperty("reach") &&
                      !d.hasOwnProperty("impression")
                  );
                }
                setFilterData(result);
              }
            }}
          />
        </div>
        <div className="col-md-3 mb16 export-excel">
          <Button
            className="btn  cmnbtn btn-primary"
            size="medium"
            onClick={handleExport}
            variant="outlined"
            color="secondary"
          >
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterWisePageOverview;
