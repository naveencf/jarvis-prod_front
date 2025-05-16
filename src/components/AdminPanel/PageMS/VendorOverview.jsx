import { useState, useEffect, useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { Box, Grid, Skeleton, TextField, Modal, Button } from "@mui/material";
import View from "../Sales/Account/View/View";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HouseSidingIcon from "@mui/icons-material/HouseSiding";
import { City } from "@phosphor-icons/react";
import {
  setRowData,
  setShowBankDetailsModal,
  setShowWhatsappModal,
} from "../../Store/PageOverview";
import { useDispatch } from "react-redux";
import VendorWhatsappLinkModla from "./VendorWhatsappLinkModla";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import VendorPageModal from "./VendorPageModal";
import {
  useGetAllVendorQuery,
  useGetAllVendorTypeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
  useGetVendorsWithPaginationQuery,
} from "../../Store/reduxBaseURL";
import VendorBankDetailModal from "./VendorBankDetailModal";
import VendorDetails from "./Vendor/VendorDetails";
import {
  useGetAllPageListQuery,
  useGetCountDocumentsQuery,
  useGetDeletedVendorDataQuery,
  useGetStateandCityVendoDataCountQuery,
  useGetVendorDataWithStateCityQuery,
  useGetVendorRetainMutation,
  useGetVendorStaticsCountDataQuery,
  useGetVendorWithCategoryQuery,
  useGetVendorWithoutWhatsappLinkQuery,
} from "../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import formatString from "../Operation/CampaignMaster/WordCapital";
import VendorMPriceModal from "./VendorMPriceModal";
import { formatNumber } from "../../../utils/formatNumber";
import CustomTableV2 from "../../CustomTable_v2/CustomTableV2";
import VendorDocCount from "./Vendor/VendorDocCount";
import { useGlobalContext } from "../../../Context/Context";
import { set } from "date-fns";
import VendorStaticsModel from "./PageOverview/VendorStaticsModel";

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
const VendorOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const dispatch = useDispatch();

  const { data: getStateandCityVendoData } =
    useGetStateandCityVendoDataCountQuery();

  const [stateDataS, setStateDataS] = useState([]);
  const [cityDataS, setCityDataS] = useState([]);

  // const queryParams = cityDataS
  //   ? { home_city: cityDataS }
  //   : stateDataS
  //   ? { home_state: stateDataS }
  //   : null;
  const [queryParams, setQueryParams] = useState(null);
  const { data: cityStateWiseData } = useGetVendorDataWithStateCityQuery(
    queryParams,
    {
      skip: !queryParams,
    }
  );

  const { data: vendorStaticCountData } = useGetVendorStaticsCountDataQuery();
  const { data: vendorWithoutWhatsappLinkData } =
    useGetVendorWithoutWhatsappLinkQuery();

 
  const vendorStaticCount = vendorStaticCountData?.vendor_category;
  const vendorCountWithPlatform = vendorStaticCountData?.vendor_platforms;

  const [queryVendorWith, setQueryVendorWith] = useState(null);
  const [cateogryChange, setCateogryChange] = useState(null);

  const { data: vendorWithStaticData } = useGetVendorWithCategoryQuery(
    queryVendorWith,
    {
      skip: !queryVendorWith,
    }
  );

  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);

  const stateWiseCountData = getStateandCityVendoData?.state;
  const cityWiseCountData = getStateandCityVendoData?.city;

  const [vendorDetails, setVendorDetails] = useState(null);
  const [openUpdateVendorMPrice, setOpenUpdateVendorMPrice] = useState(false);
  const [rowVendor, setRowVendor] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("Tab1");
  const [tabFilterData, setTabFilterData] = useState([]);

  const [categoryCounts, setCategoryCounts] = useState({});
  const [platformCounts, setPlatformCounts] = useState([]);

  const [vendorDocsCountData, setVendorDocsCountData] = useState([]);
  const [filterStateData, setFilterStateData] = useState([]);
  const [getRowData, setGetRowData] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const {
    data: vendor,
    refetch: refetchVendor,
    isLoading: isVendorLoading,
    isFetching: isVendorFetching,
  } = useGetVendorsWithPaginationQuery({ page, limit, search });
  const typeData = vendor?.data?.data;
  const vendorData = vendor?.data;
  const pagination = vendor?.pagination_data;
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;
  const { data: vendordocumentCount } = useGetCountDocumentsQuery();

  const { data: cycle } = useGetPmsPayCycleQuery();

  const [closedByCount, setClosedByCount] = useState([]);

  const [openDisabledVendor, setOpenDisabledVednor] = useState(false);
  const handleCloseDisabled = () => setOpenDisabledVednor(false);
  const { data: disabledVedorData, refetch: vendordataRefetch } =
    useGetDeletedVendorDataQuery();
  const handleDisabledVendor = async () => {
    setOpenDisabledVednor(true);
  };
  const [vendorDeletedUnrap] = useGetVendorRetainMutation();
  const handleRetainVendor = (row) => {
    const payload = {
      id: row._id,
      vendor_name: row.vendor_name,
    };

    vendorDeletedUnrap(payload)
      .unwrap()
      .then(() => {
        toastAlert("Vendor retained successfully");
        vendordataRefetch();
        // handleCloseDisabled();
      })
      .catch((err) => toastError(err.message));
  };

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };
  const cycleData = cycle?.data;
  // const {
  //   data: vendorData,
  //   isLoading: loading,
  //   refetch: refetchVendor,
  // } = useGetAllVendorQuery();

  const handleUpdateVendorMPrice = (row) => {
    setOpenUpdateVendorMPrice(true);
    setRowVendor(row);
  };
  const handleCloseVendorMPriceModal = () => {
    setOpenUpdateVendorMPrice(false);
  };

  const getData = () => {
    refetchVendor();
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (vendorData) {
      setFilterData(vendorData);
      setTabFilterData(vendorData);
    }
  }, [vendorData]);

  const handleOpenWhatsappModal = (row) => {
    return () => {
      dispatch(setShowWhatsappModal());
      dispatch(setRowData(row));
    };
  };

  const handleOpenBankDetailsModal = (row) => {
    return () => {
      dispatch(setShowBankDetailsModal());
      dispatch(setRowData(row));
    };
  };

  const handleClickVendorName = (params) => {
    setVendorDetails(params);
  };

  const showPagesOfVendor = async (data) => {
    try {
      let result;

      result = await axios.get(
        `${baseUrl}v1/vendor_wise_page_master_data/${data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPageData(result.data.data);
    } catch (error) {
      console.error("Error fetching vendor pages:", error);
    }
  };

  useEffect(() => {
    function getUniqueStatesWithCounts() {
      const stateData = {};
      for (let i = 0; i < filterData?.length; i++) {
        const state = filterData[i].home_state;
        const vendorName = filterData[i].vendor_name;

        if (state) {
          if (!stateData[state]) {
            stateData[state] = {
              count: 1,
              filterData: [vendorName],
            };
          } else {
            stateData[state].count++;
            stateData[state].filterData.push(vendorName);
          }
        }
      }
      // setStateDataS(stateData);
    }

    function getUniqueCitiesWithCounts() {
      const cityData = {};
      for (let i = 0; i < filterData?.length; i++) {
        const city = filterData[i].home_city;
        const vendorName = filterData[i].vendor_name;

        if (city) {
          if (!cityData[city]) {
            cityData[city] = {
              count: 1,
              filterData: [vendorName],
            };
          } else {
            cityData[city].count++;
            cityData[city].filterData.push(vendorName);
          }
        }
      }
      // setCityDataS(cityData);
    }
    getUniqueStatesWithCounts();
    getUniqueCitiesWithCounts();
  }, [filterData]);

  const columns = [
    {
      key: "S.No",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "page_name",
      name: "Page Name",
      renderRowCell: (row) => (
        <a href={row.page_link} target="blank">
          {formatString(row.page_name)}
        </a>
      ),
      width: 200,
    },

    {
      key: "followers",
      name: "Followers",
      // renderRowCell: (row) => row.followers_count,
      renderRowCell: (row) => {
        let followerCount = Math.max(0, row?.followers_count || 0);
        return formatNumber(followerCount);
      },
      width: 200,
    },
    // {
    //   key: "Ownership Type",
    //   name: "Ownership Type",
    //   renderRowCell: (row) => row.ownership_type,
    //   width: 200,
    // },
    {
      key: "Post Price",
      name: "Post Price",
      width: 200,
      renderRowCell: (row) => {
        const postData = row?.page_price_list?.find(
          (item) => item?.instagram_post !== undefined
        );
        const postPrice = postData ? postData.instagram_post : 0;
        return postPrice > 0 ? Number(postPrice) : 0;
      },
      compare: true,
    },
    {
      key: "Story Price",
      name: "Story Price",
      width: 200,
      renderRowCell: (row) => {
        const storyData = row?.page_price_list?.find(
          (item) => item?.instagram_story !== undefined
        );
        const storyPrice = storyData ? storyData.instagram_story : 0;
        return storyPrice > 0 ? Number(storyPrice) : 0;
      },
      compare: true,
    },
    {
      key: "Both Price",
      name: "Both Price",
      width: 200,
      renderRowCell: (row) => {
        const bothData = row?.page_price_list?.find(
          (item) => item?.instagram_both !== undefined
        );
        const bothPrice = bothData ? bothData.instagram_both : 0;
        return bothPrice;
      },
      compare: true,
    },
    {
      key: "m_story_price",
      name: "M Story",
      width: 200,
      renderRowCell: (row) => {
        const storyData = row?.page_price_list?.find(
          (item) => item?.instagram_m_story !== undefined
        );
        const storyPrice = storyData ? storyData.instagram_m_story : 0;
        return storyPrice;
      },
      compare: true,
    },
    {
      key: "m_post_price",
      name: "M Post",
      width: 200,
      renderRowCell: (row) => {
        const postData = row?.page_price_list?.find(
          (item) => item?.instagram_m_post !== undefined
        );
        const postPrice = postData ? postData.instagram_m_post : 0;
        return postPrice;
      },
      compare: true,
    },
    {
      key: "m_both_price",
      name: "M Both",
      width: 200,
      renderRowCell: (row) => {
        const bothData = row?.page_price_list?.find(
          (item) => item?.instagram_m_both !== undefined
        );
        const bothPrice = bothData ? bothData.instagram_m_both : 0;
        return bothPrice;
      },
      compare: true,
    },
  ];

  const dataGridcolumns = [
    {
      key: "sno",
      name: "S.NO",
      width: 80,
      renderRowCell: (row, index) => {
        return index + 1;
      },
    },
    {
      key: "vendorPercentage",
      name: "Vendor %",
      width: 150,
      renderRowCell: (row) => {
        const fields = [
          "vendor_name",
          "email",
          "mobile",
          "home_address",
          "payment_method",
          "Pincode",
        ];
        const totalFields = fields?.length;
        let filledFields = 0;

        fields.forEach((field) => {
          if (row[field] && row[field] !== 0) {
            filledFields++;
          }
        });

        const percentage = (filledFields / totalFields) * 100;

        if (percentage === 100) {
          return "Full";
        } else if (percentage > 50) {
          return "More than Partial";
        } else {
          return "Less than Partial";
        }
      },
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      // editable: true,
      renderRowCell: (row) => {
        return (
          <div
            onClick={() => handleClickVendorName(row)}
            className="link-primary cursor-pointer text-truncate"
          >
            {formatString(row.vendor_name)}
          </div>
        );
      },
    },
    {
      key: "Price_Update",
      name: "Price Update",
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="Price Update"
                onClick={() => handleUpdateVendorMPrice(row)}
                className="btn cmnbtn btn_sm btn-outline-primary"
              >
                Price Update
              </button>
            }
          </div>
        );
      },
      width: "20%",
    },
    {
      key: "vendor_category",
      name: "Vendor Category.",
      width: 150,
    },
    {
      key: "primary_page",
      name: "Primary Page.",
      width: 200,
      renderRowCell: (row) => {
        // let name = pageList?.data?.find(
        //   (ele) => ele._id === row.primary_page
        // )?.page_name;
        // return name ?? 'NA';
        return formatString(row?.primary_page_name);
      },
    },
    {
      key: "page_count",
      name: "Page Count",
      renderRowCell: (row) => {
        return (
          <button
            title="Page Count"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => showPagesOfVendor(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            {row.page_count}
            {/* <OpenWithIcon /> */}
          </button>
        );
      },
    },
    {
      key: "mobile",
      name: "Mobile",
      width: 200,
      editable: true,
      // compare:true
    },
    {
      key: "email",
      name: "Email",
      width: 200,
      editable: true,
    },
    {
      key: "Pincode",
      name: "Home Pincode",
      width: 200,
      editable: true,
    },
    {
      key: "home_city",
      name: "Home City",
      width: 200,
      editable: true,
    },
    {
      key: "home_state",
      name: "Home State",
      width: 200,
      editable: true,
    },
    {
      key: "home_address",
      name: "Home Address",
      width: 200,
      editable: true,
    },
    {
      key: "vendor_type",
      name: "Vendor Type",
      renderRowCell: (row) => {
        return typeData?.find((item) => item?._id == row?.vendor_type)
          ?.type_name;
      },
      width: 200,
      editable: true,
    },
    {
      key: "vendor_platform1",
      name: "Platform",
      compare: true,
      renderRowCell: (row) => {
        const fun = platformData?.find(
          (item) => item?._id == row?.vendor_platform
        )?.platform_name;
        return formatString(fun);
      },
      width: 200,
      editable: true,
    },
    {
      key: "pay_cycle",
      name: "Cycle",
      width: 200,
      renderRowCell: (row) => {
        return cycleData?.find((item) => item?._id == row?.pay_cycle)
          ?.cycle_name;
      },

      editable: true,
    },
    {
      key: "Bank Details",
      name: "Bank Details",
      width: 200,
      renderRowCell: (row) => {
        return (
          <button
            title="Bank Details"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenBankDetailsModal(row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: "whatsapp_link",
      name: "Whatsapp Link",
      width: 200,
      renderRowCell: (row) => {
        return (
          <button
            title="Whatsapp Link"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenWhatsappModal(row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: "action",
      name: "Action",
      width: 200,
      renderRowCell: (row) => (
        <>
          {/* {contextData && ( */}
          <Link to={`/admin/pms-vendor-master/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>
          {/* )} */}
          {decodedToken.role_id == 1 && (
            <div onClick={() => deletePhpData(row)}>
              <DeleteButton
                endpoint="v1/vendor"
                id={row._id}
                getData={getData}
              />
            </div>
          )}
        </>
      ),
    },
  ];

  const deletePhpData = async (row) => {
    await axios.delete(baseUrl + `node_data_to_php_delete_vendor`, {
      vendor_id: row.vendor_id,
    });
  };

  useEffect(() => {
    const fetchVendorCounts = async () => {
      try {
        const response = await axios.get(`${baseUrl}v1/get_vendor_counts`);
        setClosedByCount(response.data.data.pageClosedBYCounts);
      } catch (error) {
        console.error("Error fetching vendor counts:", error.message);
      }
    };

    fetchVendorCounts();
  }, []);

  // for category statistics
  // useEffect(() => {
  //   const countVendorCategories = (tabFilterData) => {
  //     const counts = {};
  //     tabFilterData.forEach((item) => {
  //       const category = item.vendor_category;
  //       counts[category] = (counts[category] || 0) + 1;
  //     });
  //     return counts;
  //   };

  //   const counts = countVendorCategories(tabFilterData);
  //   setCategoryCounts(counts);
  // }, [tabFilterData]);

  // for platform statistics
  useEffect(() => {
    const platformCountsMap = {};
    for (const vendor of tabFilterData) {
      const platformId = vendor.vendor_platform;
      const platform = platformData?.find((item) => item._id === platformId);
      if (platform) {
        const platformName = platform.platform_name;
        if (platformCountsMap[platformId]) {
          platformCountsMap[platformId].count++;
        } else {
          platformCountsMap[platformId] = {
            platform_name: platformName,
            count: 1,
          };
        }
      }
    }
    const platformCountsArray = Object.keys(platformCountsMap).map(
      (platformId) => ({
        platform_id: platformId,
        platform_name: platformCountsMap[platformId].platform_name,
        count: platformCountsMap[platformId].count,
      })
    );
    setPlatformCounts(platformCountsArray);
  }, [tabFilterData, platformData]);

  const vendorWithNoMobileNum = () => {
    const vendorwithnomobilenum = tabFilterData.filter(
      (item) => item.mobile == 0
    );
    setFilterData(vendorwithnomobilenum);
    setActiveTab("Tab1");
  };
  const vendorWithNoEmail = () => {
    const vendorwithnoemail = tabFilterData.filter((item) => item.email == "");
    setFilterData(vendorwithnoemail);
    setActiveTab("Tab1");
  };
  const vendorWithoutLink = (key) => {
    setFilterData(vendorWithoutWhatsappLinkData);
    setActiveTab("Tab1");
    // setActiveSection(key);
    // setLoading(true);
  };


  const vendorWithNoPages = () => {
    const vendorwithnopages = tabFilterData.filter(
      (item) => item.page_count == 0
    );
    setFilterData(vendorwithnopages);
    setActiveTab("Tab1");
  };

  useEffect(() => {
    if (filterData?.length > 0) {
      setLoading(false);
    }
  }, [filterData]);

  const vendorWithCategories = (category) => {
    const vendorwithcategories = tabFilterData.filter(
      (item) => item.home_state === category
    );
    setFilterStateData(vendorwithcategories);
    setActiveTab("Tab1");
  };

  const vendorWithCategoriesOnly = (key, category) => {
    setCateogryChange(category);
    setQueryVendorWith({ vendor_category: category });
    // const vendorwithcategories = tabFilterData.filter(
    //   (item) => item.vendor_category === category
    // );
    // setFilterStateData(vendorwithcategories);
    setActiveTab("Tab1");
    // setActiveSection(key);
  };

  const vendorWithState = (category) => {
    setStateDataS(category);
    setQueryParams({ home_state: category }); // trigger API call
    // const vendorwithcategories = tabFilterData.filter(
    //   (item) => item.home_state === category
    // );
    // setFilterStateData(cityStateWiseData);
    setActiveTab("Tab1");
  };
  const vendorWithCity = (category) => {
    setQueryParams({ home_city: category });
    setCityDataS(category);
    // const vendorwithcategories = tabFilterData.filter(
    //   (item) => item.home_city === category
    // );
    // setFilterStateData(cityStateWiseData);
    setActiveTab("Tab1");
  };
  useEffect(() => {
    if (cityStateWiseData) {
      setFilterStateData(cityStateWiseData);
    }
  }, [cityStateWiseData, cityDataS, stateDataS]);

  useEffect(() => {
    if (vendorWithStaticData) {
      setFilterStateData(vendorWithStaticData);
    }
  }, [vendorWithStaticData, cateogryChange]);

  const vendorWithPlatforms = (key, platform) => {
    setQueryVendorWith({ vendor_platform: platform });
    // const vendorwithplatforms = tabFilterData.filter(
    //   (item) => item.vendor_platform == platform
    // );
    // setFilterData(vendorwithplatforms);
    setActiveTab("Tab1");
    // setActiveSection(key);
  };

  const vendorClosedBy = (key, closeby) => {
    const vendorclosedby = tabFilterData.filter(
      (item) => item.closed_by == closeby
    );
    setFilterData(vendorclosedby);
    setActiveTab("Tab1");
    // setActiveSection(key);
  };

  useEffect(() => {
    if (vendorDocsCountData?.length) {
      setFilterData(vendorDocsCountData);
      setActiveTab("Tab1");
    }
  }, [vendorDocsCountData]);

  const ExportData = () => {
    return decodedToken?.role_id == 1; // returns false if role_id is not 1, otherwise true
  };

  const dataVendorDeletedcolumns = [
    {
      key: "sno",
      name: "S.NO",
      width: 80,
      renderRowCell: (row, index) => {
        return index + 1;
      },
    },
    {
      key: "vendor_name",
      name: "vendor_name",
      width: 200,
      editable: true,
    },
    {
      key: "vendor_category",
      name: "vendor_category",
      width: 200,
      editable: true,
    },
    {
      key: "vendor_type_name",
      name: "vendor_type_name",
      width: 200,
      editable: true,
    },
    {
      key: "Add Vendor",
      name: "Add Vendor",
      width: 200,
      renderRowCell: (row) => {
        return (
          <button
            title="Retain Vendor"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRetainVendor(row)}
          >
            Add Vendor
          </button>
        );
      },
    },
  ];

  return (
    <>
      <VendorMPriceModal
        open={openUpdateVendorMPrice}
        onClose={handleCloseVendorMPriceModal}
        rowData={rowVendor}
      />
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog" style={{ maxWidth: "40%" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Vendor Pages - {formatString(pageData[0]?.vendor_name)}
              </h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <CustomTableV2
                columns={columns}
                data={pageData}
                // isLoading={false}
                // title={"Vendor-Pages"}
                tableName={"Vendor-Pages : Price"}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Overview
        </button>
        <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          Statistics
        </button>
        <button
          className={activeTab === "Tab3" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab3")}
        >
          State/City Wise
        </button>
      </div>

      <div className="content">
        {activeTab === "Tab1" && (
          <div>
            {filterData && (
              <div className="card">
                {vendorDetails && (
                  <VendorDetails
                    vendorDetails={vendorDetails}
                    setVendorDetails={setVendorDetails}
                  />
                )}
                <VendorWhatsappLinkModla />
                <div className="card-header flexCenterBetween">
                  <h5 className="card-title">
                    Vendor :{" "}
                    {filterStateData?.length
                      ? filterStateData?.length
                      : filterData?.length}
                  </h5>
                  <div className="flexCenter colGap8">
                    <button
                      className="btn cmnbtn btn_sm btn-outline-danger"
                      onClick={handleDisabledVendor}
                    >
                      Disabled Vendor
                    </button>

                    <Link
                      to={`/admin/pms-vendor-master`}
                      className="btn cmnbtn btn_sm btn-outline-primary"
                    >
                      Add Vendor <i className="fa fa-plus" />
                    </Link>

                    <Link
                      to={`/admin/pms-page-overview`}
                      className="btn cmnbtn btn_sm btn-outline-primary"
                    >
                      Page <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
                <div className="data_tbl thm_table table-responsive card-body p0">
                  {isVendorLoading ? (
                    <Box mt={2} ml={2} mb={3} sx={{ width: "95%" }}>
                      <Grid
                        container
                        spacing={{ xs: 1, md: 10 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {Array.from(Array(5)).map((_, index) => (
                          <Grid item md={1} key={index}>
                            <Skeleton
                              sx={{
                                width: "100%",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {Array.from(Array(30)).map((_, index) => (
                          <Grid item xs={2} sm={2} md={2} key={index}>
                            <Skeleton
                              animation="wave"
                              sx={{
                                width: "100%",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    <View
                      version={1}
                      columns={dataGridcolumns}
                      data={
                        filterStateData?.length ? filterStateData : filterData
                      }
                      isLoading={false}
                      cloudPagination={true}
                      title="Vendor Overview"
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName="Vendor Overview"
                      selectedData={setGetRowData}
                      pageNavigator={{
                        prev: {
                          disabled: page === 1,
                          onClick: () =>
                            setPage((prev) => Math.max(prev - 1, 1)),
                        },
                        next: {
                          disabled: vendorData?.data?.length < limit,
                          onClick: () => setPage((prev) => prev + 1),
                        },
                        totalRows: pagination?.total_records || 0,
                        currentPage: pagination?.current_page,
                      }}
                      addHtml={
                        <>
                          <TextField
                            label="Search Vendor"
                            variant="outlined"
                            size="small"
                            value={inputValue}
                            onChange={handleSearchChange}
                          />
                        </>
                      }
                    />
                  )}

                  {/* <View version={1} columns={dataGridcolumns} data={filterData} isLoading={false} title="Vendor Overview" rowSelectable={true} pagination={[100, 200, 1000]} tableName="Vendor Overview" selectedData={setGetRowData} exportData={ExportData} /> */}
                </div>
                <VendorBankDetailModal />
                <VendorPageModal />
                <VendorWhatsappLinkModla />
              </div>
            )}
          </div>
        )}
        {activeTab === "Tab2" && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with categories</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {vendorStaticCount &&
                  typeof vendorStaticCount === "object" ? (
                    Object.entries(vendorStaticCount).map(
                      ([category, count]) => (
                        <div
                          className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                          key={category}
                        >
                          <div
                            className="card"
                            onClick={() =>
                              vendorWithCategoriesOnly(
                                "vendor_with_category",
                                category
                              )
                            }
                          >
                            <div className="card-body pb20 flexCenter colGap14">
                              <div className="iconBadge small bgPrimaryLight m-0">
                                <span>
                                  <Brightness6Icon />
                                </span>
                              </div>
                              <div>
                                <h6 className="colorMedium">{category}</h6>
                                <h6 className="mt4 fs_16">{count}</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="col-12">
                      <p>No category data available.</p>
                    </div>
                  )}
                  {activeSection === "vendor_with_category" && !loading && (
                    <VendorStaticsModel
                      vendorData={filterData}
                      dataGridcolumns={dataGridcolumns}
                    />
                  )}
                </div>

                <div className="row">
                  {Object?.entries(categoryCounts).map(([category, count]) => (
                    <div
                      className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                      key={category}
                    >
                      <div
                        className="card"
                        onClick={() => vendorWithCategories(category)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <Brightness6Icon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{category}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                {/* <div className="card" onClick={vendorWithNoPages}> */}
                <div className="card">
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with 0 pages</h6>
                      <h6 className="mt4 fs_16">
                        {vendorStaticCountData?.vendor_with_0_page_count}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                {/* <div className="card" onClick={vendorWithNoMobileNum}> */}
                <div className="card">
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">
                        Vendor with no mobile number
                      </h6>
                      <h6 className="mt4 fs_16">
                        {vendorStaticCountData?.vendor_with_no_mobile_no}
                        {/* {
                          tabFilterData.filter((item) => item.mobile == 0)
                            ?.length
                        } */}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                {/* <div className="card" onClick={vendorWithNoEmail}> */}
                <div className="card">
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with no email id</h6>
                      <h6 className="mt4 fs_16">
                        {vendorStaticCountData?.vendor_with_no_email_id}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div
                  className="card"
                  onClick={() => vendorWithoutLink("vendor_without_link")}
                >
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">
                        Vendor without Whatsapp Link
                      </h6>
                      <h6 className="mt4 fs_16">
                        {vendorWithoutWhatsappLinkData?.length}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              {activeSection === "vendor_without_link" && !loading && (
                <VendorStaticsModel
                  vendorData={filterData}
                  dataGridcolumns={dataGridcolumns}
                />
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with platforms</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {vendorCountWithPlatform?.map((data, index) => (
                    <div
                      className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"
                      key={data.platform_id}
                    >
                      <div
                        className="card"
                        onClick={() =>
                          vendorWithPlatforms(
                            "vendor_with_platform",
                            data.platform_id
                          )
                        }
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <AccountCircleIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium text-capitalize">
                              {data.platform_name}
                            </h6>
                            <h6 className="mt4 fs_16">{data.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {activeSection === "vendor_with_platform" && !loading && (
              <VendorStaticsModel
                vendorData={filterData}
                dataGridcolumns={dataGridcolumns}
              />
            )}
            <VendorDocCount
              documents={vendordocumentCount}
              setVendorDocsCountData={setVendorDocsCountData}
            />
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor Closed By</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {closedByCount.map((item, index) => (
                    <div
                      className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"
                      key={index}
                    >
                      <div
                        className="card"
                        key={index}
                        onClick={() =>
                          vendorClosedBy("closed_by", item.closed_by)
                        }
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <AccountCircleIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{item.user_name}</h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {activeSection === "closed_by" && !loading && (
              <VendorStaticsModel
                vendorData={filterData}
                dataGridcolumns={dataGridcolumns}
              />
            )}
          </div>
        )}
        {activeTab === "Tab3" && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with State</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {stateWiseCountData &&
                    typeof stateWiseCountData === "object" &&
                    Object.entries(stateWiseCountData).map(([state, data]) => (
                      <div
                        key={state}
                        className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                      >
                        <div
                          className="card"
                          onClick={() => vendorWithState(state)}
                        >
                          <div className="card-body pb20 flexCenter colGap14">
                            <div className="iconBadge small bgPrimaryLight m-0">
                              <span>
                                <HouseSidingIcon />
                              </span>
                            </div>
                            <div>
                              <h6 className="colorMedium">{state}</h6>
                              <h6 className="mt4 fs_16">{data}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with City</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {cityWiseCountData &&
                  typeof cityWiseCountData === "object" &&
                  Object.entries(cityWiseCountData).length > 0 ? (
                    Object.entries(cityWiseCountData).map(([city, data]) => (
                      <div
                        key={city}
                        className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                      >
                        <div
                          className="card"
                          onClick={() => vendorWithCity(city)}
                        >
                          <div className="card-body pb20 flexCenter colGap14">
                            <div className="iconBadge small bgPrimaryLight m-0">
                              <span>
                                <City size={32} />
                              </span>
                            </div>
                            <div>
                              <h6 className="colorMedium">{city}</h6>
                              <h6 className="mt4 fs_16">{data}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <p className="text-center text-muted">
                        No city data available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <>
        <Modal
          open={openDisabledVendor}
          onClose={handleCloseDisabled}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <button
              className="btn cmnbtn btn_sm btn-danger "
              onClick={handleCloseDisabled}
              style={{
                position: "absolute",
                top: "0px",
                right: "10px",
                margin: "5px",
                zIndex: 1000,
              }}
            >
              X
            </button>
            <View
              columns={dataVendorDeletedcolumns}
              data={disabledVedorData}
              isLoading={false}
              title={"Disabled Vendor"}
              pagination={[100, 200, 1000]}
              tableName={"Disabled Pages"}
            />
          </Box>
        </Modal>
      </>
    </>
  );
};

export default VendorOverview;
