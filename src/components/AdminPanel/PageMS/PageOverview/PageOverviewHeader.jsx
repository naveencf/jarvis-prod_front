import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Breadcrumbs,
  Box,
  Modal,
  Button,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import {
  useGetAllCountWisePageQuery,
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllProfileListQuery,
} from "../../../Store/PageBaseURL";
import formatString from "../../../../utils/formatString";
import {
  useGetAllVendorWiseListQuery,
  useGetPmsPlatformQuery,
} from "../../../Store/reduxBaseURL";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExportInventory from "../../../../components/AdminPanel/PageMS/PageOverview/ExportInventory";
import SarcasmNetwork from "../SarcasmNetwork";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import View from "../../Sales/Account/View/View";
import BulkVendor from "../Vendor/BulkVendor/BulkVendor";
import { formatPageLabel } from "../../../../utils/helper";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PageOverviewHeader({
  setPage,
  setPlanFormName,
  onFilterChange,
  pagequery,
  categoryFilter,
  setCategoryFilter,
  activenessFilter,
  setActivenessFilter,
  filterFollowers,
  setFilterFollowers,
  selectedData,
  setSelectedData,
  activeTabName = (val) => val,
  showExport,
}) {
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
  const { data: vendorWiseList } = useGetAllVendorWiseListQuery();

  const vendorData = vendorWiseList?.data;

  // Filter states
  // const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState(null);
  const [profileTypeFilter, setProfileTypeFilter] = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);
  const [ownershipFilter, setOwnershipFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [disabledPagesData, setDisabledPagesData] = useState([]);
  const [openDisabledPages, setOpenDisabledPages] = useState(false);
  const [bulkVendorSum, setBulkVendorSum] = useState(0);
  const [activeTab, setActiveTab] = useState("instagram");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    activeTabName(activeTab);
  }, [activeTab]);

  const handleCloseDisabled = () => setOpenDisabledPages(false);

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID });

  const { data } = useGetAllCountWisePageQuery({ activeTab });
  const categoryOptionsWithCount =
    data?.category &&
    Object?.entries(data?.category)?.map(([label, count]) => {
      const formattedLabel = formatString(label);
      return {
        label: `${formattedLabel}: ${count}`,
        value: formattedLabel,
      };
    });
  const subCategoryOptionsWithCount =
    data?.subcategory &&
    Object.entries(data?.subcategory)?.map(([label, count]) => {
      const formattedLabel = formatString(label);
      return {
        label: `${formattedLabel}: ${count}`,
        value: formattedLabel,
      };
    });
  const profileDataOptionsWithCount =
    data?.profile_type &&
    Object.entries(data?.profile_type)?.map(([label, count]) => {
      const formattedLabel = formatString(label);
      return {
        label: `${formattedLabel}: ${count}`,
        value: formattedLabel,
      };
    });
  const ownershipWithCount =
    data?.ownership &&
    Object.entries(data?.ownership)?.map(([label, count]) => {
      const formattedLabel = formatString(label);
      return {
        label: `${formattedLabel}: ${count}`,
        value: formattedLabel,
      };
    });

  // Sorting state
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const visiblePlatforms = platformData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNext = () => {
    if (startIndex + itemsPerPage < platformData.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 4);
    }
  };
  // Construct page query string based on selected filters
  // Activeness options mapping
  const activenessOptions = [
    // { label: 'Super-Active', value: 'super_active' },
    { label: "Active", value: "active" },
    { label: "Semi-Active", value: "semi_active" },
    { label: "Dead", value: "dead" },
  ];
  const FollowerRanges = [
    { label: "0.1M To 0.3M", value: [100000, 300000] },
    { label: "0.3M To 0.5M", value: [300000, 500000] },
    { label: "0.5M To 0.7M", value: [500000, 700000] },
    { label: "0.7M To 1M", value: [700000, 1000000] },
    { label: "1M to 2M", value: [1000000, 2000000] },
    { label: "2M to 5M", value: [2000000, 5000000] },
    { label: " 5M", value: [5000000, 40000000] },
  ];
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("filters"));
    if (storedFilters) {
      setCategoryFilter(storedFilters?.categoryFilter);
      setSubCategoryFilter(storedFilters?.subCategoryFilter);
      setProfileTypeFilter(storedFilters?.profileTypeFilter);
      setPlatformFilter(storedFilters?.platformFilter);
      setOwnershipFilter(storedFilters?.ownershipFilter);
      setActivenessFilter(storedFilters?.activenessFilter);
      setFilterFollowers(storedFilters?.filterFollowers);
    }
  }, []);

  const handleDisabledPages = async () => {
    try {
      setOpenDisabledPages(true);
      const res = await axios.get(`${baseUrl}v1/get_disabled_pages`);
      setDisabledPagesData(res?.data?.data);
    } catch (error) {
      console.error("Error fetching disabled pages:", error);
    }
  };

  // Save filters to sessionStorage whenever they change
  useEffect(() => {
    const filters = {
      categoryFilter,
      subCategoryFilter,
      profileTypeFilter,
      platformFilter,
      ownershipFilter,
      activenessFilter,
      filterFollowers,
    };
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [
    categoryFilter,
    subCategoryFilter,
    profileTypeFilter,
    platformFilter,
    ownershipFilter,
    activenessFilter,
    filterFollowers,
  ]);

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      setFilterFollowers(newValue);
    } else {
      setFilterFollowers(null);
    }
  };
  // categoryFilter = categoryFilter?.replace(/[^a-zA-Z]/g, "");
  useEffect(() => {
    const queryParams = [
      activeTab && `platform_name=${activeTab}`,
      categoryFilter &&
      `page_category_name=${encodeURIComponent(
        categoryFilter?.toLowerCase()
      )}`,
      subCategoryFilter &&
      `page_sub_category_name=${encodeURIComponent(
        subCategoryFilter.toLowerCase()
      )}`,
      profileTypeFilter &&
      `page_profile_type_name=${profileTypeFilter.toLowerCase()}`,
      ownershipFilter && `ownership_type=${ownershipFilter.toLowerCase()}`,
      filterFollowers &&
      `minFollower=${filterFollowers?.value[0]}&maxFollower=${filterFollowers?.value[1]}`,
      activenessFilter &&
      `page_activeness=${activenessOptions
        .find((option) => option.value === activenessFilter.toLowerCase())
        ?.value?.toLowerCase()}`,
      searchTerm && `search=${searchTerm.toLowerCase()}`,
      sortField && `sort_by=${sortField}&order=${sortOrder}`,
    ]
      .filter(Boolean)
      .join("&");

    if (queryParams) {
      onFilterChange(queryParams);
    }
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
    filterFollowers,
    activeTab,
  ]);

  const getCount = (list, filterKey, value) => {
    return (
      list?.filter(
        (page) => page[filterKey]?.toLowerCase() === value?.toLowerCase()
      ).length || 0
    );
  };

  // const subCategoryOptionsWithCount = subCategoryData?.map((res) => {
  //   const count = getCount(
  //     pageList,
  //     "page_sub_category_name",
  //     res.page_sub_category
  //   );
  //   return `${formatString(res.page_sub_category)} (${count})`;
  // });

  // const categoryOptionsWithCount = categoryData?.map((res) => {
  //   const count = getCount(pageList, "page_category_name", res.page_category);
  //   return `${formatString(res.page_category)} (${count})`;
  // });

  const platformOptionsWithCount = platformData.map((res) => {
    const count = getCount(pageList, "platform_name", res.platform_name);
    return `${formatString(res.platform_name)} (${count})`;
  });

  const activenessOptionsWithCount = activenessOptions.map((res) => {
    const count = getCount(pageList, "page_activeness", res.value);
    return `${formatString(res.value)} (${count})`;
  });

  // const ownershipWithCount = ["Vendor", "Own", "Partnership"].map((res) => {
  //   const count = getCount(pageList, "ownership_type", res);
  //   return `${formatString(res)} (${count})`;
  // });
  // const profileDataOptionsWithCount = profileDataOptions.map((res) => {
  //   const count = getCount(
  //     pageList,
  //     "page_profile_type_name",
  //     res.profile_type
  //   );
  //   return `${formatString(res.profile_type)} (${count})`;
  // });

  // Helper function to extract just the label (before parentheses)
  const extractLabel = (optionWithCount) => {
    if (optionWithCount) {
      console.log(optionWithCount.split(" (")[0], "optionWithCount");
      return optionWithCount.split(" (")[0];
    }
    return null;
  };

  const handleAddInventory = async (id, page_name) => {
    try {
      const response = await axios.put(
        `${baseUrl}v1/convert_disable_page_to_enable_in_page_master`,
        {
          id,
          page_name,
        }
      );

      if (response.status === 200) {
        console.log("Page enabled successfully:", response.data);
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error(
        "Error enabling page:",
        error.response?.data || error.message
      );
    }
  };

  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "page_name",
      name: "Page Name ",
      width: 200,
      renderRowCell: (row) => formatPageLabel(row.page_name)
    },
    {
      key: "page_status",
      name: "Page Status",
      renderRowCell: (row) => {
        return formatString(row.page_status)
      }

    },
    {
      key: "page_category_name",
      name: "Category",
      width: 200,
      renderRowCell: (row) => formatString(row.page_category_name)
    },
    {
      key: "platform_name",
      name: "Platform Name",
      width: 200,
      renderRowCell: (row) => formatString(row.platform_name)

    },
    {
      key: "vendor_name",
      name: "Vendor",
      width: 200,
      renderRowCell: (row) => formatString(row.vendor_name)

    },
    {
      key: "page_status",
      name: "Page Status",
      width: 200,
      renderRowCell: (row) => formatString(row.page_status)
    },
    {
      key: "add_inventory",
      name: "Add Inventory",
      renderRowCell: (row) => (
        <Button
          variant="outlined"
          className="btn cmnbtn btn_sm btn-outline-primary"
          onClick={() => handleAddInventory(row._id, row.page_name)}
        >
          Add Inventory
        </Button>
      ),
      width: 100,
      sortable: true,
    },
    // {
    //   key: 'followers_count',
    //   name: 'Followers',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     return row.followers_count;
    //   },
    // },
    //  {
    //   key: 'Post Price',
    //   name: 'Post Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const postData = row?.page_price_list?.find(item => item?.instagram_post !== undefined);
    //     const postPrice = postData ? postData.instagram_post : 0;
    //     return (
    //       <>
    //         {postPrice > 0 ? `₹${postPrice}` : 'NA'}
    //       </>
    //     );
    //   },
    //   compare: true,
    // },
    // {
    //   key: 'Story Price',
    //   name: 'Story Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const storyData = row?.page_price_list?.find(item => item?.instagram_story !== undefined);
    //     const storyPrice = storyData ? storyData.instagram_story : 0;
    //     return (
    //       <>
    //         {storyPrice > 0 ? `₹${storyPrice}` : 'NA'}
    //       </>
    //     );
    //   },
    //   compare: true,
    // },
    // {
    //   key: 'Both Price',
    //   name: 'Both Price',
    //   width: 200,
    //   renderRowCell: (row) => {
    //     const bothData = row?.page_price_list?.find(item => item?.instagram_both !== undefined);
    //     const bothPrice = bothData ? bothData.instagram_both : 0;
    //     return (
    //       <>
    //         {bothPrice > 0 ? `₹${bothPrice}` : 'NA'}
    //       </>
    //     );
    //   },
    //   compare: true,
    // },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.platform_name);
    localStorage.setItem("activeTab", tab.platform_name);
    setPlanFormName(tab.platform_name);
  };

  // useEffect(() => {
  //   if (platformData && platformData.length > 0) {
  //     const platformIndex = parseInt(activeTab.replace('Tab', ''), 10); // Extract index from activeTab (e.g., "Tab0" -> 0)
  //     const platformName = platformData[platformIndex]?.platform_name || null;
  //     setPlanFormName(platformName);

  //     if (platformName) {
  //       onFilterChange(`platform_name=${platformName.toLowerCase()}`);
  //     }
  //   }
  // }, [activeTab, platformData]);

  useEffect(() => {
    if (vendorData?.length) {
      const sum = vendorData.reduce((acc, val) => val.page_count + acc, 0);
      setBulkVendorSum(sum);
    }
  }, [vendorData]);

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    setCategoryFilter(null);
    setSubCategoryFilter(null);
    setProfileTypeFilter(null);
    setOwnershipFilter(null);
    setActivenessFilter(null);
    setFilterFollowers(null);
  }, [activeTab]);

  const handleSubCategoryChange = (e, newValue) => {
    setSubCategoryFilter(newValue ? newValue.value : "");
  };

  return (
    <div className="card">
      <div className="">
        <div className="card">
          <div className="card-header flexCenterBetween">
            <h5 className="card-title flexCenterBetween">
              {/* <Typography>Total Pages </Typography>
              <Typography>: {pageList?.length + (bulkVendorSum || 0)} </Typography> */}
              <Typography sx={{ marginLeft: "16px" }}>Inventory </Typography>
              <Typography>: {pageList?.length} </Typography>
              {/* <Typography sx={{ marginLeft: '16px' }}>
                {' '}
                Bulk-Vendor Pages
              </Typography>
              {bulkVendorSum && <Typography>: {bulkVendorSum}</Typography>} */}
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
                    {categoryFilter?.charAt(0).toUpperCase() +
                      categoryFilter?.slice(1)}
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
              <SarcasmNetwork
                selectedData={selectedData}
                setSelectedData={setSelectedData}
              />

              <Link
                to={`/admin/pms-page-logs`}
                className="btn cmnbtn btn_sm btn-outline-success"
              >
                Page Logs
              </Link>
              <button
                className="btn cmnbtn btn_sm btn-outline-danger"
                onClick={handleDisabledPages}
              >
                Deleted pages
              </button>

              <Link
                to={`/admin/inventory/pms-page-master`}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Add Profile <AddIcon />
              </Link>
              <Link
                to={`/admin/inventory/pms-vendor-overview`}
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
                value={
                  categoryOptionsWithCount?.find(
                    (opt) => opt.value === categoryFilter
                  ) || null
                }
                onChange={(event, newValue) =>
                  setCategoryFilter(newValue ? newValue.value : "")
                }
                options={categoryOptionsWithCount}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
                disabled={
                  !(
                    categoryOptionsWithCount &&
                    categoryOptionsWithCount.length > 0
                  )
                }
              />

              {/* <Autocomplete
                value={categoryFilter}
                onChange={(event, newValue) =>

                  setCategoryFilter(extractLabel(newValue))
                }
                options={categoryOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              /> */}
            </div>

            <div className="col-md-3 mb16">
              <Autocomplete
                value={
                  subCategoryOptionsWithCount?.find(
                    (opt) => opt.value === subCategoryFilter
                  ) || null
                }
                onChange={(event, newValue) =>
                  handleSubCategoryChange(event, newValue)
                }
                options={subCategoryOptionsWithCount}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Subcategory" />
                )}
                disabled={
                  !(
                    subCategoryOptionsWithCount &&
                    subCategoryOptionsWithCount.length > 0
                  )
                }
              />
            </div>
            <div className="col-md-3 mb16">
              <Autocomplete
                value={
                  profileDataOptionsWithCount?.find(
                    (opt) => opt.value === profileTypeFilter
                  ) || null
                }
                onChange={(event, newValue) =>
                  setProfileTypeFilter(newValue ? newValue.value : "")
                }
                options={profileDataOptionsWithCount}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Profile Type" />
                )}
                disabled={
                  !(
                    profileDataOptionsWithCount &&
                    profileDataOptionsWithCount.length > 0
                  )
                }
              />
            </div>
            {/* <div className="col-md-3 mb16">
              <Autocomplete value={platformFilter} onChange={(event, newValue) => setPlatformFilter(extractLabel(newValue))} options={platformOptionsWithCount} renderInput={(params) => <TextField {...params} label="Platform" />} />
            </div> */}

            <div className="col-md-3 mb16">
              {/* <Autocomplete
                value={ownershipFilter}
                onChange={(event, newValue) =>
                  setOwnershipFilter(extractLabel(newValue))
                }
                options={ownershipWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Ownership" />
                )}
              /> */}
              <Autocomplete
                value={
                  ownershipWithCount?.find(
                    (opt) => opt.value === ownershipFilter
                  ) || null
                }
                onChange={(event, newValue) =>
                  setOwnershipFilter(newValue ? newValue.value : "")
                }
                options={ownershipWithCount}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Ownership" />
                )}
                disabled={
                  !(ownershipWithCount && ownershipWithCount.length > 0)
                }
              />
            </div>

            <div className="col-md-3 mb16">
              <Autocomplete
                value={activenessFilter}
                onChange={(event, newValue) => {
                  setActivenessFilter(extractLabel(newValue));
                }}
                options={activenessOptionsWithCount}
                renderInput={(params) => (
                  <TextField {...params} label="Activeness" />
                )}
              />
            </div>
            <div className="col-md-3 mb16">
              <Autocomplete
                value={filterFollowers}
                onChange={handleSelectionChange}
                options={FollowerRanges}
                /*getOptionLabel={(option) => option.label}*/ renderInput={(
                  params
                ) => <TextField {...params} label="Followers" />}
              />
            </div>
            {/* {decodedToken?.role_id == 1 && <ExportInventory pageList={pageList} />} */}
            <div className="tabs-container tabslide">
              <div className="navigation">
                {/* Left Arrow */}
                {/* {startIndex > 0 && ( */}
                <button
                  className="prev-arrow arrow-btn btn"
                  onClick={handlePrevious}
                >
                  <i className="bi bi-chevron-left"></i>
                  {/* Left Arrow */}
                </button>
                {/* )} */}

                {/* Dynamic Tabs */}
                <div className="tabs">
                  {visiblePlatforms.map((platform, index) => (
                    <button
                      key={platform._id}
                      className={
                        activeTab === platform.platform_name.toLowerCase()
                          ? "active btn btn-primary"
                          : "btn"
                      }
                      onClick={() => handleTabClick(platform)}
                    >
                      {platform.platform_name.charAt(0).toUpperCase() +
                        platform.platform_name.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                {/* {startIndex + itemsPerPage < platformData.length && ( */}
                <button
                  className="next-arrow arrow-btn btn"
                  onClick={handleNext}
                >
                  <i className="bi bi-chevron-right"></i> {/* Right Arrow */}
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <Modal
          open={openDisabledPages}
          onClose={handleCloseDisabled}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <View
              columns={dataGridcolumns}
              data={disabledPagesData}
              isLoading={false}
              title={"Deleted Pages"}
              pagination={[100, 200, 1000]}
              tableName={"Deleted Pages"}
              showExport={showExport}
            />
          </Box>
        </Modal>
      </>
    </div>
  );
}

export default PageOverviewHeader;
