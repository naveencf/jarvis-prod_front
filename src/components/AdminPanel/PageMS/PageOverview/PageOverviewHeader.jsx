import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllProfileListQuery,
} from "../../../Store/PageBaseURL";
import formatString from "../../../../utils/formatString";
import { useGetPmsPlatformQuery } from "../../../Store/reduxBaseURL";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExportInventory from "../../../../components/AdminPanel/PageMS/PageOverview/ExportInventory";

function PageOverviewHeader({ onFilterChange, pagequery }) {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];
  const { data: profileData } = useGetAllProfileListQuery();
  const profileDataOptions = profileData?.data || [];

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("Meme");
  const [subCategoryFilter, setSubCategoryFilter] = useState(null);
  const [profileTypeFilter, setProfileTypeFilter] = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);
  const [ownershipFilter, setOwnershipFilter] = useState(null);
  const [activenessFilter, setActivenessFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });

  // Sorting state
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Construct page query string based on selected filters
  // Activeness options mapping
  const activenessOptions = [
    { label: "Super-Active", value: "super_active" },
    { label: "Active", value: "active" },
    { label: "Semi-Active", value: "semi_active" },
    { label: "Dead", value: "dead" },
  ];

  useEffect(() => {
    const newQuery = [
      categoryFilter
        ? `page_category_name=${categoryFilter.toLowerCase()}`
        : "",
      subCategoryFilter
        ? `page_sub_category_name=${subCategoryFilter.toLowerCase()}`
        : "",
      profileTypeFilter
        ? `page_profile_type_name=${profileTypeFilter.toLowerCase()}`
        : "",
      platformFilter ? `platform_name=${platformFilter.toLowerCase()}` : "",
      ownershipFilter ? `ownership_type=${ownershipFilter.toLowerCase()}` : "",
      activenessFilter
        ? `page_activeness=${
            activenessOptions.find(
              (option) => option.label === activenessFilter
            )?.value
          }`
        : "",
      searchTerm ? `search=${searchTerm.toLowerCase()}` : "",
      sortField ? `sort_by=${sortField}&order=${sortOrder}` : "",
    ]
      .filter(Boolean)
      .join("&");

    // setPagequery(newQuery);
    onFilterChange(newQuery);
  }, [
    categoryFilter,
    subCategoryFilter,
    profileTypeFilter,
    platformFilter,
    ownershipFilter,
    activenessFilter,
    searchTerm,
    sortField,
    sortOrder,
  ]);
  // Utility function to count matching pages based on filter
  const getCount = (list, filterKey, value) => {
    return (
      list?.filter(
        (page) => page[filterKey]?.toLowerCase() === value?.toLowerCase()
      ).length || 0
    );
  };

  const subCategoryOptionsWithCount = subCategoryData.map((res) => {
    const count = getCount(
      pageList,
      "page_sub_category_name",
      res.page_sub_category
    );
    return `${formatString(res.page_sub_category)} (${count})`;
  });

  const platformOptionsWithCount = platformData.map((res) => {
    const count = getCount(pageList, "platform_name", res.platform_name);
    return `${formatString(res.platform_name)} (${count})`;
  });

  const activenessOptionsWithCount = activenessOptions.map((res) => {
    const count = getCount(pageList, "page_activeness", res.label);
    return `${formatString(res.label)} (${count})`;
  });
  const ownershipWithCount = ["Vendor", "Own", "Partnership"].map((res) => {
    const count = getCount(pageList, "ownership_type", res); // Pass the string directly
    return `${formatString(res)} (${count})`; // Format the result with the count
  });
  // console.log(profileDataOptions,platformData)
  const profileDataOptionsWithCount = profileDataOptions.map((res) => {
    const count = getCount(
      pageList,
      "page_profile_type_name",
      res.profile_type
    );
    return `${formatString(res.profile_type)} (${count})`;
  });

  // Helper function to extract just the label (before parentheses)
  const extractLabel = (optionWithCount) => {
    if (optionWithCount) {
      return optionWithCount.split(" (")[0];
    }
    return null;
  };

  return (
    <div className="card">
      <div className="">
        <div className="card">
          <div className="card-header flexCenterBetween">
            <h5 className="card-title flexCenterBetween">
              <Typography>Inventory</Typography>
              <Typography>: {pageList?.length}</Typography>
              <Breadcrumbs sx={{ ml: 2 }} aria-label="breadcrumb">
                {platformFilter != null && (
                  <Typography>
                    {platformFilter.charAt(0).toUpperCase() +
                      platformFilter.slice(1)}
                  </Typography>
                )}
                {ownershipFilter != null && (
                  <Typography>
                    {ownershipFilter.charAt(0).toUpperCase() +
                      ownershipFilter.slice(1)}
                  </Typography>
                )}
                {profileTypeFilter != null && (
                  <Typography>
                    {profileTypeFilter.charAt(0).toUpperCase() +
                      profileTypeFilter.slice(1)}
                  </Typography>
                )}
                {categoryFilter != null && (
                  <Typography>
                    Category -{" "}
                    {categoryFilter.charAt(0).toUpperCase() +
                      categoryFilter.slice(1)}
                  </Typography>
                )}
                {subCategoryFilter != null && (
                  <Typography>
                    SubCategory -{" "}
                    {subCategoryFilter.charAt(0).toUpperCase() +
                      subCategoryFilter.slice(1)}
                  </Typography>
                )}
                {activenessFilter != null && (
                  <Typography>
                    {activenessFilter.charAt(0).toUpperCase() +
                      activenessFilter.slice(1)}
                  </Typography>
                )}
              </Breadcrumbs>
            </h5>
            <div className="flexCenter colGap8">
              <Link
                to={`/admin/pms-page-master`}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Add Profile <AddIcon />
              </Link>
              <Link
                to={`/admin/pms-vendor-overview`}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Vendor <KeyboardArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body pb4">
        <div>
          <div className="row thm_form">
            <div className="col-md-3 mb16">
              <Autocomplete
                value={categoryFilter}
                onChange={(event, newValue) => setCategoryFilter(newValue)}
                options={categoryData?.map((res) =>
                  formatString(res.page_category)
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </div>

            <div className="col-md-3 mb16">
              <Autocomplete
                value={subCategoryFilter}
                onChange={(event, newValue) =>
                  setSubCategoryFilter(extractLabel(newValue))
                }
                options={subCategoryOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Subcategory" />
                )}
              />
            </div>
            <div className="col-md-3 mb16">
              <Autocomplete
                value={profileTypeFilter}
                onChange={(event, newValue) =>
                  setProfileTypeFilter(extractLabel(newValue))
                }
                options={profileDataOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Profile Type" />
                )}
              />
            </div>
            <div className="col-md-3 mb16">
              <Autocomplete
                value={platformFilter}
                onChange={(event, newValue) =>
                  setPlatformFilter(extractLabel(newValue))
                }
                options={platformOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Platform" />
                )}
              />
            </div>

            <div className="col-md-3 mb16">
              <Autocomplete
                value={ownershipFilter}
                onChange={(event, newValue) =>
                  setOwnershipFilter(extractLabel(newValue))
                }
                options={ownershipWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Ownership" />
                )}
              />
            </div>

            <div className="col-md-3 mb16">
              <Autocomplete
                value={activenessFilter}
                onChange={(event, newValue) => {
                  setActivenessFilter(extractLabel(newValue)); // Set only the label, not the count
                }}
                options={activenessOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Activeness" />
                )}
              />
            </div>

            {decodedToken?.role_id == 1 && (
              <ExportInventory pageList={pageList} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageOverviewHeader;
