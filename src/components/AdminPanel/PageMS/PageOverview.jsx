import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addRow } from "../../Store/Executon-Slice";
import View from "../Sales/Account/View/View";
import * as XLSX from "xlsx";

import DateFormattingComponent from "../../DateFormator/DateFormared";
import {
  openTagCategoriesModal,
  setPlatform,
  setShowPageHealthColumn,
  setShowVendorNotAssignedModal,
  setTagCategories,
} from "../../Store/PageOverview";
import TagCategoryListModal from "./TagCategoryListModal";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
  useGetnotAssignedVendorsQuery,
  useGetVendorWhatsappLinkTypeQuery,
} from "../../Store/reduxBaseURL";
import VendorNotAssignedModal from "./VendorNotAssignedModal";
import instaIcon from "../../../assets/img/icon/insta.svg";
import { Dropdown } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import avatarOne from "../../../assets/img/product/Avtrar1.png";
import {
  useGetAllCitiesQuery,
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllPriceListQuery,
  useGetMultiplePagePriceQuery,
  useGetOwnershipTypeQuery,
  useGetPageStateQuery,
  useGetpagePriceTypeQuery,
} from "../../Store/PageBaseURL";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setStatsUpdate } from "../../Store/PageMaster";
import PageDetail from "./PageOverview/PageDetail";
import { setPageRow, setShowPageInfoModal } from "../../Store/Page-slice";
import formatString from "../Operation/CampaignMaster/WordCapital";
import { useGlobalContext } from "../../../Context/Context";
import SaveAsIcon from '@mui/icons-material/SaveAs';

const PageOverview = () => {
  const { toastAlert } = useGlobalContext();
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  const { data: pageStates,

    isLoading: isPagestatLoading,

  } = useGetPageStateQuery();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('Tab1');
  const [pageLevels, setPageLevels] = useState([]);
  const [pageStatus, setPageStatus] = useState([]);
  const [tabFilterData, setTabFilterData] = useState([])
  const [topVendorData, setTopVendorData] = useState([])
  const [data, setData] = useState({
    lessThan1Lac: [],
    between1And10Lac: [],
    between10And20Lac: [],
    between20And30Lac: [],
    moreThan30Lac: []
  });
  const [tableFollowers, setTableFollowers] = useState(0)
  const [tablePosts, setTablePosts] = useState(0)
  const [tableStories, setTableStories] = useState(0)
  const [tableBoths, setTableBoths] = useState(0)

  const handleExport = () => {
    const formattedData = filterData?.map((row, index) => {

      const platformName = platformData?.find(
        (item) => item?._id === row.platform_id
      )?.platform_name;

      const categoryName = cat?.find(
        (item) => item?._id === row.page_category_id
      )?.page_category;

      const vendorName = vendorData?.find(
        (item) => item?.vendor_id === row.temp_vendor_id
      )?.vendor_name;

      return {
        "S.No": index + 1,
        "User Name": row.page_name,
        "Level": row.preference_level,
        "Status": row.page_status,
        "Ownership": row.ownership_type,
        "Platform": platformName || "N/A",
        "Category": categoryName || "N/A",
        "Followers": formatNumber(row.followers_count),
        "Vendor": vendorName || "N/A",
        "Active Platform": row.platform_active_on,


        "Closed By": row.page_closed_by,
        "Name Type": row.page_name_type,
        "Content Creation": row.content_creation,
        "Rate Type": row.rate_type,
        "Variable Type": row.variable_type,
        "Story Price": row.m_story_price,
        "Post Price": row.m_post_price,
        "Both Price": row.m_both_price,
      };
    });

    const fileName = "data.xlsx";
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const [filterData, setFilterData] = useState([]);
  const [venodr, setVenodr] = useState([{}]);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  // const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  // const [priceData, setPriceData] = useState([]);
  const [contextData, setContextData] = useState(false);
  const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [waData, setWaData] = useState([])
  const { data: linkType } = useGetVendorWhatsappLinkTypeQuery();
  const token = sessionStorage.getItem("token");
  const [categoryData, setCategoryData] = useState([]);
  const [newFilterData, setNewFilterData] = useState([]);

  // const { isLoading: isNotAssignedVendorLoading, data: notAssignedVenodrData } =
  //   useGetnotAssignedVendorsQuery();
  // function handleNotAssignedVendorClick() {
  //   dispatch(setShowVendorNotAssignedModal());
  // }

  // const handlePageChange = ()=>{
  //   // if()

  // }

  const { data: allPriceTypeList } = useGetpagePriceTypeQuery();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  // const handleEditCellChange = (params) => {
  //   (async () => {
  //     const updatedRow = {
  //       ...params.row,
  //       [params.field]: params.value,
  //     };

  //     return axios
  //       .put(baseUrl + `updatePage/${params.row._id}`, updatedRow)
  //       .then((res) => {});
  //   })();

  //   // Make API call to update the row data
  //   // Example: fetch('/api/updateRow', { method: 'POST', body: JSON.stringify(updatedRow) })

  //   // Update the local state with the updated row
  //   // setUpdatedRows((prevRows) => {
  //   //   const updatedRows = [...prevRows];
  //   //   const rowIndex = updatedRows.findIndex((row) => row.id === params.row.id);
  //   //   updatedRows[rowIndex] = updatedRow;
  //   //   return updatedRows;
  //   // });
  // };

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const { data: cities } = useGetAllCitiesQuery();
  function pageHealthToggleCheck() {
    if (showPageHealthColumn) {
      const data = filterData?.map((item) => {
        const matchingState = pageStates?.find(
          (state) => state?.page_master_id === item?._id
        );
        return {
          ...item,
          pageId: matchingState?._id,
          ...matchingState,
          _id: item._id,
        };
      });

      // setFilterData(data)
      setNewFilterData(data)
    }
    if (showPageHealthColumn == false) {
      setFilterData(pageList.data)
    }
  }

  useEffect(() => {
    pageHealthToggleCheck();
  }, [isPageListLoading, isPagestatLoading, filterData]);
  useEffect(() => {
    // if (showPageHealthColumn) {
    //   dispatch(setShowPageHealthColumn(false));
    // }
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[33].view_value === 1) {
            setContextData(true);
          }
          if (res.data[57].view_value === 1) {
            setPageUpdateAuth(true);
          }
          if (res.data[56].view_value === 1) {
            setPageStatsAuth(true);
          }
        });
    }

    getData();
  }, []);

  const handleTagCategory = (params) => {
    return function () {
      dispatch(setTagCategories(params));
      dispatch(openTagCategoriesModal());
    };
  };

  const handlePlatfrormClick = (data) => {
    return function () {
      dispatch(setPlatform(data));
      dispatch(openTagCategoriesModal());
    };
  };
  const handleSetState = () => {
    dispatch(addRow(false));
    dispatch(setStatsUpdate(false));
  };
  const handleUpdateRowClick = async (row) => {
    // await axios
    //   .get(`${baseUrl}` + `get_exe_history/${row.pageMast_id}`)
    //   .then((res) => {
    //     let data = res.data.data.filter((e) => {
    //       return e.isDeleted !== true;
    //     });
    //     data = data[0];

    //     navigate(`/admin/exe-update/${data._id}`, {
    //       state: row.pageMast_id,
    //     });
    //   });
    dispatch(setStatsUpdate(true));
  };

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row._id}`, {
      state: row.pageMast_id,
    });
  };

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;
  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
      setProgress(70);
    });
  };

  const calculateAndSetTotals = (result) => {
    let totalFollowers = 0;
    let totalPosts = 0;
    let totalStories = 0;
    let totalBoths = 0;

    for (let i = 0; i < result.length; i++) {
      totalFollowers += Number(result[i].followers_count);
      totalPosts += Number(result[i].post);
      totalStories += Number(result[i].story);
      totalBoths += Number(result[i].both_);
    }

    setTableFollowers(totalFollowers);
    setTablePosts(totalPosts);
    setTableStories(totalStories);
    setTableBoths(totalBoths);
  };

  useEffect(() => {
    if (pageList) {
      setVendorTypes(pageList.data);
      setFilterData(pageList.data);
      calculateAndSetTotals(pageList.data)
      setTabFilterData(pageList.data)
    }
  }, [pageList]);

  useEffect(() => {

  }, [tableFollowers, tablePosts, tableStories, tableBoths]);

  const { data: priceData, isLoading: isPriceLoading } =
    useGetMultiplePagePriceQuery(selectedRow, {
      skip: !selectedRow
    });

  const handlePriceClick = (row) => {
    return function () {
      setSelectedRow(row._id);
      // setPriceData(row.purchase_price);
      setShowPriceModal(true);
    };
  };

  const handleClose = () => {
    setShowPriceModal(false);
  };

  const handlePageDetailClick = (params) => {
    return () => {
      dispatch(setShowPageInfoModal(true));
      dispatch(setPageRow(params.row));
    };
  };

  const whatsAppData = async (data) => {
    const result = await axios.get(`${baseUrl}v1/vendor_group_link_vendor_id/${data.vendor_id}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setWaData(res.data.data)
      });
  }

  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => (
        // <div onClick={handlePageDetailClick(row)}>
        //   {filterData.indexOf(row) + 1}
        // </div>
        index + 1
      ),
      width: 80,
    },
    {
      key: 'WA Links',
      name: 'WA Links',
      width: 100,
      editable: false,
      renderRowCell: (row) => {
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/3536/3536445.png"
            style={{ width: '30%', height: '50%', cursor: 'pointer' }}
            data-toggle="modal" data-target="#waModal"
            onClick={() => whatsAppData(row)}
          />
        )
      }
    },
    {
      key: "page_name",
      name: "User Name",
      width: 200,

      renderRowCell: (row) => {
        let name = row.page_name;
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={row.page_link}
            className="link-primary"
          >
            {formatString(name)}
          </a>
        );
      },
    },
    {
      key: "preference_level", name: "Level", width: 200, editable: true,
      customEditElement: (row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column) => {
        return (
          <select className="form-select" value={row.preference_level} onChange={e => {
            handelchange(e, row, column)
            handleLevelChange(e, setEditFlag, row)
          }} autoFocus>
            <option value="Level 1 (High)">Level 1 (High)</option>
            <option value="Level 2 (Medium)">Level 2 (Medium)</option>
            <option value="Level 3 (Low)">Level 3 (Low)</option>
          </select>
        );
      },
    },
    { key: "page_status", name: "Status", width: 200, editable: true, renderEditCell: renderStatusEditCell },
    {
      key: "content_creation",
      name: "Content Creation",
      renderRowCell: (row) => {
        return row.content_creation != 0 ? row.content_creation : "";
      },
      width: 200,

      renderEditCell: renderContentEditCell
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 200,
    //   valueGetter: (params) => (params.row.status == 1 ? "Active" : "Inactive"),
    // },
    {
      key: "ownership_type",
      name: "Ownership",
      width: 200,
      // valueGetter: (params) => {
      //   if (!ownerShipData) {
      //     return <div>Unknown</div>;
      //   }

      //   const ownership = ownerShipData?.find(
      //     (item) => item._id === params.row.ownership_type
      //   )?.company_type_name;
      //   const finalName = ownership ? ownership : "NA";

      //   return finalName;
      // },
    },

    // {
    //   field: "link",
    //   headerNa: "Link",
    //   width: 200,
    //   renderCell: (params) => (
    //     <Link to={params.row.link} target="_blank" className="text-primary">
    //       <OpenInNewIcon />
    //     </Link>
    //   ),
    // },
    {
      key: "platform_id",
      name: "Platform",
      renderRowCell: (row) => {
        let name = platformData?.find(
          (item) => item?._id == row.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      width: 200,
    },
    {
      key: "page_catg_id",
      name: "Category",
      width: 200,
      renderRowCell: (row) => {
        // let name = cat?.find((item) => item?.page_category_id == row.row?.temp_page_cat_id)?.page_category;
        let name = cat?.find((item) => item?._id == row?.page_category_id)?.page_category;
        return <div>{name}</div>;
      },
    },
    {
      key: "followers_count",
      name: "Followers",
      width: 200,
      renderRowCell: (row) => {
        return <div>{formatNumber(row.followers_count)}</div>
      }
    },
    {
      key: "vendor_id",
      name: "Vendor",
      renderRowCell: (row) => {
        // let name = vendorData?.find(
        //   (item) => item?.vendor_id == row?.temp_vendor_id
        // )?.vendor_name;
        let name = vendorData?.find(
          (item) => item?._id == row?.vendor_id
        )?.vendor_name;

        return <div>{formatString(name)}</div>;
      },
      width: 200,
    },

    {
      key: "platform_active_on",
      name: "Active Platform",
      width: 200,
      // renderCell: (params) => {
      //   let data = platformData?.filter((item) => {
      //     return params.row.platform_active_on.includes(item._id);
      //   });
      //   return (
      //     <div>
      //       {data.length > 0 && (
      //         <Button
      //           className="text-center"
      //           onClick={handlePlatfrormClick(data)}
      //         >
      //           <KeyboardDoubleArrowUpIcon />
      //         </Button>
      //       )}
      //     </div>
      //   );
      // },
      renderRowCell: (row) => {
        let data = platformData?.filter((item) => {
          return row.platform_active_on.includes(item._id);
        });
        return data?.map((item) => item.platform_name).join(", ");
      },
    },
    {
      key: "tags_page_category",
      name: "Tag Category",
      width: 200,
      renderRowCell: (row) => {
        let data = cat
          ?.filter((item) => {
            return row?.tags_page_category?.includes(item._id);
          })
          .map((item) => item.page_category);
        return (
          <div
            style={{
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.map((item, i) => {
              return (
                <p
                  key={i}
                  onClick={handleTagCategory(data)}
                  style={{ display: "inline", cursor: "pointer" }}
                >
                  {item}
                  {i !== data?.length - 1 && ","}
                </p>
              );
            })}
          </div>
        );
      },
    },
    // {
    //   field: "engagment_rate",
    //   headerName: "ER",
    //   width: 200,
    // },
    {
      key: "page_closed_by",
      name: "Closed By",
      width: 200,
      renderRowCell: (row) => {
        let name = user?.find(
          (item) => item?.user_id == row?.page_closed_by
        )?.user_name;
        return <div>{name ?? "NA"}</div>;
      },
    },
    {
      key: "page_name_type",
      name: "Name Type",
      width: 200,
      renderRowCell: (row) => {
        return row.page_name_type != 0 ? row.page_name_type : "";
      },
      editable: true,
      renderEditCell: renderNameTypeEditCell
    },
    { key: "rate_type", name: "Rate Type", width: 200 },
    { key: "variable_type", name: "Variable Type", width: 200 },
    {
      key: "m_story_price",
      name: "Story Price",
      width: 200,
      renderRowCell: (row) => {
        let mStoryPrice = row.m_story_price;
        let storyPrice = row.story;
        return storyPrice ?? mStoryPrice;
      },
    },
    {
      key: "m_post_price",
      name: "Post Price",
      width: 200,
      renderRowCell: (row) => {
        let mPostPrice = row.m_post_price;
        let postPrice = row.post;
        return postPrice ?? mPostPrice;
      },
    },
    {
      key: "m_both_price",
      name: "Both Price",
      width: 200,
      renderRowCell: (row) => {
        let mBothPrice = row.m_both_price;
        let bothPrice = row.both_;
        return bothPrice ?? mBothPrice;
      },
    },
    {
      key: "page_price_multiple",
      name: "Price",
      width: 200,
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button
                title="Price"
                onClick={handlePriceClick(row)}
                className="btn btn-outline-primary btn-sm user-button"
              >
                <PriceCheckIcon />
              </button>
            }
          </div>
        );
      },
    },
    {
      key: "Action",
      name: "Action",
      width: 300,
      renderRowCell: (row) => (
        <div className="d-flex align-center ">
          {/* <Link
            className="mt-2"
            to={`/admin/pms-purchase-price/${row.pageMast_id}`}
          >
            <button
              title="Purchase Price"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <RequestPageIcon />{" "}
            </button>
          </Link> */}
          {pageUpdateAuth && (
            <Link
              className="mt-2"
              to={`/admin/pms-page-edit/${row._id}`}
            >
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
              >
                <FaEdit />{" "}
              </button>
            </Link>
          )}
          {decodedToken.role_id == 1 && (
            <DeleteButton
              endpoint="v1/pageMaster"
              id={row._id}
              getData={refetchPageList}
            />
          )}
        </div>
      ),
    },
    {
      key: "update",
      name: "Update",
      width: 130,
      renderRowCell: (row) => {
        const totalPercentage = row.totalPercentage;
        return (
          // totalPercentage == 100 ||
          // (totalPercentage == 0.0 && (
          <>
            {/* <button
              type="button"
              className="btn cmnbtn btn_sm btn-outline-primary"
              data-toggle="modal"
              data-target="#myModal1"
              // disabled={
              //   totalPercentage == 0 || totalPercentage == 100 ? false : true
              // }
              onClick={() => {
                dispatch(addRow(params.row));
                navigate(`/admin/stats`);
              }}
            >
              Set Stats
            </button> */}
            <Link
              to={{
                pathname: `/admin/pageStats/${row._id}`,
              }}
            >
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleSetState()}
              >
                Profile Stats
              </button>
            </Link>
          </>
          // )
          // )
        );
      },
    },
    {
      key: "history",
      width: 150,
      name: "History",
      renderRowCell: (row) => {
        return (
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={() => handleHistoryRowClick(row)}
          // disabled={
          //   params?.row?.latestEntry?.stats_update_flag
          //     ? !params?.row?.latestEntry.stats_update_flag
          //     : true
          // }
          >
            See History
          </button>
        );
      },
    },
    {
      key: "statsUpdate",
      width: 150,
      name: "Stats Update",
      renderRowCell: (row) => {
        return (
          row?.pageId && (
            <Link
              to={{
                pathname: `/admin/pageStats/${row.pageId}`,
                state: { update: true },
              }}
            >
              <button
                type="button"
                className="btn cmnbtn btn_sm btn-outline-primary"
                onClick={handleUpdateRowClick}
              >
                Update
              </button>
            </Link>
          )
        );
      },
    },
    // {
    //   field: "totalPercentage",
    //   width: 150,
    //   headerName: "Stats Update %",
    //   renderCell: (params) => {
    //     return params.row.totalPercentage > 0
    //       ? Math.round(+params.row?.totalPercentage) + "%"
    //       : params.row.totalPercentageForExeHistory + "%";
    //   },
    // },
    // {
    //   field: "stats_update_flag ",
    //   width: 150,
    //   headerName: "Stats Update Flag",
    //   renderCell: (params) => {
    //     const num = params?.row?.latestEntry?.stats_update_flag
    //       ? params?.row?.latestEntry.stats_update_flag
    //       : false;
    //     return num ? "Yes" : "No";
    //   },
    // },
    {
      key: "Age_13_17_percent",
      width: 150,
      name: "Age 13-17 %",
      renderRowCell: (row) => {
        let data = row?.Age_13_17_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_18_24_percent",
      width: 150,
      name: "Age 18-24 %",
      renderRowCell: (row) => {
        let data = row?.Age_18_24_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_25_34_percent",
      width: 150,
      name: "Age 25-34 %",
      renderRowCell: (row) => {
        let data = row?.Age_25_34_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_35_44_percent",
      width: 150,
      name: "Age 35-44 %",
      renderRowCell: (row) => {
        let data = row?.Age_35_44_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_45_54_percent",
      width: 150,
      name: "Age 45-54 %",
      renderRowCell: (row) => {
        let data = row?.Age_45_54_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_55_64_percent",
      width: 150,
      name: "Age 55-64 %",
      renderRowCell: (row) => {
        let data = row?.Age_55_64_percent;
        return +data ? data + "%" : "NA";
      },
    },
    {
      key: "Age_65_plus_percent",
      width: 150,
      name: "Age 65+ %",
      renderRowCell: (row) => {
        let data = row?.Age_65_plus_percent;
        return +data ? data + "%" : "NA";
      },
    },
    // {
    //   field: "Age_upload",
    //   width: 150,
    //   headerName: "Age Upload",
    //   renderCell: (params) => {
    //     let url = params.row?.Age_upload;
    //     return url ? (
    //       <img src={url} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    {
      key: "city1_name",
      width: 150,
      name: "City 1 and %",
      // renderCell: (params) => {
      //   let data = params.row?.city1_name;
      //   return data ? data : "NA";
      // },
      renderRowCell: (row) => {
        let data = row?.city1_name;
        let percentage = row?.percentage_city1_name;
        return data ? data + ` (${percentage}%)` : "NA";
      },
    },
    {
      key: "city2_name",
      width: 150,
      name: "City 2 and %",
      renderRowCell: (row) => {
        let data = row?.city2_name;
        let percentage = row?.percentage_city2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city3_name",
      width: 150,
      name: "City 3 and %",
      renderRowCell: (row) => {
        let data = row?.city3_name;
        let percentage = row?.percentage_city3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city4_name",
      width: 150,
      name: "City 4 and %",
      renderRowCell: (row) => {
        let data = row?.city4_name;
        let percentage = row?.percentage_city4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city5_name",
      width: 150,
      name: "City 5 and %",
      renderRowCell: (row) => {
        let data = row?.city5_name;
        let percentage = row?.percentage_city5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "city_image_url",
      width: 150,
      name: "City Image",
      renderRowCell: (row) => {
        let data = row?.city_image_url;
        return data ? (
          <a href={data} target="_blank" rel="noopener noreferrer">
            <img src={data} style={{ width: "50px", height: "50px" }} />
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "country1_name",
      width: 150,
      name: "Country 1  and %",
      renderRowCell: (row) => {
        let data = row?.country1_name;
        let percentage = row?.percentage_country1_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country2_name",
      width: 150,
      name: "Country 2 and %",
      renderRowCell: (row) => {
        let data = row?.country2_name;
        let percentage = row?.percentage_country2_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country3_name",
      width: 150,
      name: "Country 3 and %",
      renderRowCell: (row) => {
        let data = row?.country3_name;
        let percentage = row?.percentage_country3_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country4_name",
      width: 150,
      name: "Country 4 and %",
      renderRowCell: (row) => {
        let data = row?.country4_name;
        let percentage = row?.percentage_country4_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country5_name",
      width: 150,
      name: "Country 5 and %",
      renderRowCell: (row) => {
        let data = row?.country5_name;
        let percentage = row?.percentage_country5_name;
        return data ? data + `(${percentage}%)` : "NA";
      },
    },
    {
      key: "country_image_url",
      width: 150,
      name: "Country Image",
      renderRowCell: (row) => {
        let data = row?.country_image_url;
        return data ? (
          <a href={data} target="_blank" rel="noopener noreferrer">
            <img src={data} style={{ width: "50px", height: "50px" }} />
          </a>
        ) : (
          "NA"
        );
      },
    },
    {
      key: "createdAt",
      width: 150,
      name: "Creation Date",
      renderRowCell: (row) => {
        let data = row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
    },

    {
      key: "engagement",
      width: 150,
      name: "Engagement",
      renderRowCell: (row) => {
        let data = row?.engagement;
        let dataimg = row?.engagement_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
          </a>
        ) : (
          "NA"
        );
      },
    },
    // {
    //   field: "engagement_image_url",
    //   width: 150,
    //   headerName: "Engagement Image",
    //   renderCell: (params) => {
    //     let data = params.row?.engagement_image_url;
    //     return data ? (
    //       <img src={data} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },

    {
      key: "impression",
      width: 150,
      name: "Impression",
      renderRowCell: (row) => {
        let data = row?.impression;
        let dataimg = row?.impression_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
          </a>
        ) : (
          "NA"
        );
      },
    },
    // {
    //   field: "impression_image_url",
    //   width: 150,
    //   headerName: "Impression Image",
    //   renderCell: (params) => {
    //     let data = params.row?.impression_image_url;
    //     return data ? (
    //       <img src={data} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    {
      key: "female_percent",
      width: 150,
      name: "Female Percentage",
      renderRowCell: (row) => {
        let data = row?.female_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      key: "male_percent",
      width: 150,
      name: "Male Percentage",
      renderRowCell: (row) => {
        let data = row?.male_percent;
        return data ? data + "%" : "NA";
      },
    },
    {
      key: "profile_visit",
      width: 150,
      name: "Profile Visit",
      renderRowCell: (row) => {
        let data = row?.profile_visit;
        return data ? data : "NA";
      },
      editable: true,
      renderEditCell: renderProfileEditCell
    },
    // {
    //   field: "quater",
    //   width: 150,
    //   headerName: "Quater",
    //   renderCell: (params) => {
    //     let data = params.row?.quater;
    //     return data ? data : "NA";
    //   },
    // },
    {
      key: "reach",
      width: 150,
      name: "Reach",
      renderRowCell: (row) => {
        let data = row?.reach;
        let dataimg = row?.reach_image_url;
        return data ? (
          <a href={dataimg} target="_blank" rel="noopener noreferrer">
            {data}
            {/* <img src={data} style={{ width: "50px", height: "50px" }} /> */}
          </a>
        ) : (
          "NA"
        );
      },
    },
    // {
    //   field: "reach_image_url",
    //   width: 150,
    //   headerName: "Reach Image",
    //   renderCell: (params) => {
    //     let data = params.row?.reach_image_url;
    //     return data ? (
    //       <img src={data} style={{ width: "50px", height: "50px" }} />
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    {
      key: "start_date",
      width: 150,
      name: "Start Date",
      renderRowCell: (row) => {
        let data = row?.start_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    {
      key: "endDate",
      width: 150,
      name: "End Date",
      renderRowCell: (row) => {
        let data = row?.end_date;
        return data ? <DateFormattingComponent date={data} /> : "NA";
      },
    },
    // {
    //   field: "stats_for",
    //   width: 150,
    //   headerName: "Stats For",
    //   renderCell: (params) => {
    //     let data = params.row?.stats_for;
    //     return data ? data : "NA";
    //   },
    // },
    {
      key: "story_view",
      width: 150,
      name: "Story View",
      renderRowCell: (row) => {
        let data = row?.story_view;
        return data ? data : "NA";
      },
    },
    {
      key: "story_view_image_url",
      width: 150,
      name: "Story View Image",
      renderRowCell: (row) => {
        let data = row?.story_view_image_url;
        return data ? (
          <img src={data} style={{ width: "50px", height: "50px" }} />
        ) : (
          "NA"
        );
      },
    },
  ];

  // convert follower count in millions
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  }

  const handleLevelChange = async (event, setEditFlag, row) => {
    const newValue = event.target.value;
    try {
      await axios.put(`${baseUrl}v1/pageMaster/${row._id}`, {
        // ...params.row,
        preference_level: newValue,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      toastAlert('Data Updated');
    } catch (error) {
      console.error('Error updating status:', error);
    }
    finally {
      setEditFlag(false);
    }
  };
  function renderLevelEditCell(params) {

    return (
      <select className="form-select" value={params.value} onChange={handleChange} autoFocus>
        <option value="Level 1 (High)">Level 1 (High)</option>
        <option value="Level 2 (Medium)">Level 2 (Medium)</option>
        <option value="Level 3 (Low)">Level 3 (Low)</option>
      </select>
    );
  }

  function renderStatusEditCell(params) {
    const handleChange = async (event) => {
      const newValue = event.target.value;
      try {
        await axios.put(`${baseUrl}v1/pageMaster/${params.row._id}`, {
          // ...params.row,
          page_status: newValue,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        toastAlert('Data Updated');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return (
      <select className="form-select" value={params.value} onChange={handleChange} autoFocus>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Disabled">Disabled</option>
      </select>
    );
  }

  function renderContentEditCell(params) {
    const handleChange = async (event) => {
      const newValue = event.target.value;
      try {
        await axios.put(`${baseUrl}v1/pageMaster/${params.row._id}`, {
          // ...params.row,
          content_creation: newValue,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        toastAlert('Data Updated');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return (
      <select className="form-select" value={params.value} onChange={handleChange} autoFocus>
        <option value="By Vendor">By Vendor</option>
        <option value="By CF">By CF</option>
        <option value="Both">Both</option>
      </select>
    );
  }

  function renderNameTypeEditCell(params) {
    const handleChange = async (event) => {
      const newValue = event.target.value;
      try {
        await axios.put(`${baseUrl}v1/pageMaster/${params.row._id}`, {
          // ...params.row,
          page_name_type: newValue,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        toastAlert('Data Updated');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return (
      <select className="form-select" value={params.value} onChange={handleChange} autoFocus>
        <option value="Adult">Adult</option>
        <option value="Non Adult">Non Adult</option>
      </select>
    );
  }

  const pageDetailColumn = [

  ];

  const priceColumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{priceData.indexOf(params.row) + 1}</div>,
      width: 130,
    },
    {
      field: "price_type",
      headerName: "Price Type",
      width: 200,
      renderCell: (params) => {
        let name = allPriceTypeList?.find(
          (item) => item._id == params.row.page_price_type_id
        )?.name;
        return <div>{name}</div>;
      },
    },

    {
      field: "price",
      headerName: "Price",
      width: 200,
    },
  ];

  const pageHealthColumn = [

  ];

  function renderProfileEditCell(params) {
    const handleChange = async (event) => {
      const newValue = event.target.value;
      try {
        await axios.put(`${baseUrl}v1/page_states/${params.row.pageId}`, {
          // ...params.row,
          profile_visit: Number(newValue),
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        toastAlert('Data Updated');
        params.api.setEditCellValue({ id: params.row._id, field: 'profile_visit', value: newValue }, event);
        params.api.setCellMode(params.row._id, 'profile_visit', 'view');
        params.api.updateRows([{ ...params.row, profile_visit: newValue }]);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return (
      <>
        <input
          type="number"
          defaultValue={params.value}
          onBlur={handleChange}
          autoFocus
          style={{ width: '65%' }}
        />
        <button className="btn btn-success" ><SaveAsIcon /></button>
      </>
    );
  }

  // if(pageStatsAuth){
  //       dispatch(setShowPageHealthColumn(true));

  //     }else{
  //       dispatch(setShowPageHealthColumn(false));
  //       dataGridcolumns.push(...pageDetailColumn)

  //     }

  //   useEffect(() => {
  //     // Directly dispatch the value of pageStatsAuth
  //     console.log(...pageDetailColumn)
  //   console.log('pageStatsAuth', pageStatsAuth);
  // }, [pageStatsAuth]);

  // if (!pageStatsAuth || decodedToken?.role_id === 1) {
  //   dataGridcolumns.push(...pageDetailColumn);
  // }
  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));
  // !decodedToken?.role_id === 1&&  dispatch(setShowPageHealthColumn(pageStatsAuth));

  // if (showPageHealthColumn) {
  //   dataGridcolumns.push(...pageHealthColumn);
  // }

  useEffect(() => {
    const countPageLevels = (tabFilterData) => {
      const counts = {};
      tabFilterData.forEach(item => {
        const category = item.preference_level;
        counts[category] = (counts[category] || 0) + 1;
      });
      return counts;
    };

    const counts = countPageLevels(tabFilterData);
    setPageLevels(counts);
  }, [tabFilterData]);

  useEffect(() => {
    const countPageStatus = (tabFilterData) => {
      const counts = {};
      tabFilterData.forEach(item => {
        const status = item.page_status;
        counts[status] = (counts[status] || 0) + 1;
      });
      return counts;
    };

    const counts = countPageStatus(tabFilterData);
    setPageStatus(counts);
  }, [tabFilterData])

  const pageWithLevels = (level) => {
    const pagewithlevels = tabFilterData.filter((item) => item.preference_level == level);
    setFilterData(pagewithlevels)
    setActiveTab('Tab1')
  }
  const pageWithStatus = (status) => {
    const pagewithstatus = tabFilterData.filter((item) => item.page_status == status);
    setFilterData(pagewithstatus)
    setActiveTab('Tab1')
  }
  const pageClosedBy = (close_by) => {
    const pageclosedby = tabFilterData.filter((item) => item.page_closed_by == close_by);
    setFilterData(pageclosedby)
    setActiveTab('Tab1')
  }

  useEffect(() => {
    let newData = {
      lessThan1Lac: [],
      between1And10Lac: [],
      between10And20Lac: [],
      between20And30Lac: [],
      moreThan30Lac: []
    };

    for (let i = 0; i < tabFilterData.length; i++) {
      const item = tabFilterData[i];
      const followersCount = item.followers_count;

      if (followersCount < 100000) {
        newData.lessThan1Lac.push(item);
      } else if (followersCount >= 100000 && followersCount < 1000000) {
        newData.between1And10Lac.push(item);
      } else if (followersCount >= 1000000 && followersCount < 2000000) {
        newData.between10And20Lac.push(item);
      } else if (followersCount >= 2000000 && followersCount < 3000000) {
        newData.between20And30Lac.push(item);
      } else if (followersCount >= 3000000) {
        newData.moreThan30Lac.push(item);
      }
    }
    setData(newData);
  }, [tabFilterData]);

  const showData = (dataArray) => {
    setActiveTab('Tab1')
    setFilterData(dataArray)
  };

  const closedByCounts = tabFilterData.reduce((acc, item) => {
    acc[item.page_closed_by] = (acc[item.page_closed_by] || 0) + 1;
    return acc;
  }, {});

  const userCounts = Object.keys(closedByCounts).map(key => {
    const userId = parseInt(key);
    const userName = user?.find(u => u?.user_id === parseInt(key))?.user_name || 'NA';
    return { userId, userName, count: closedByCounts[key] };
  });

  useEffect(() => {
    const result = axios.get(`https://purchase.creativefuel.io/webservices/RestController.php?view=toppurchasevendor`)
      .then((res) => {
        setTopVendorData(res.data.body)
      });
  }, [])

  const categoryGridcolumns = [
    {
      field: "S.NO",
      headerName: "S.no",
      renderCell: (params) => (
        <div>
          {categoryData.indexOf(params.row) + 1}
        </div>
      ),
      width: 80,
    },
    {
      headerName: 'Category',
      width: 200,
      editable: false,
      renderCell: (params) => {
        let data = params.row?.category_name;
        return data ? data : "NA";
      },
    },
    {
      field: "Vendor Count",
      headerName: "Vendor Count",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.vendor_count;
        return (data ? data : 'NA');
      },
    },
    {
      field: "Count",
      headerName: "Count",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.category_used;
        return (data ? data : 'NA');
      },
    },
    {
      field: "Total Followers",
      headerName: "Total Followers",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_followers;
        return (data ? data : '0');
      },
    },
    {
      field: "Story",
      headerName: "Story",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_stories;
        return (data ? data : '0');
      },
    },
    {
      field: "Post",
      headerName: "Post",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let data = params.row.total_posts;
        return (data ? data : '0');
      },
    }
  ];

  useEffect(() => {
    if (pageList) {
      const pageCategoryCount = {};
      const categoryVendorMap = {};
      const categoryFollowerMap = {};
      const postMap = {};
      const storyMap = {};

      for (let i = 0; i < pageList.data?.length; i++) {
        const categoryId = pageList.data[i]?.page_category_id;
        const vendorId = pageList.data[i]?.vendor_id;
        const followers = pageList.data[i]?.followers_count || 0;
        const storys = pageList.data[i]?.story || 0;
        const posts = pageList.data[i]?.post || 0;

        if (categoryId) {
          if (pageCategoryCount[categoryId]) {
            pageCategoryCount[categoryId] += 1;
          } else {
            pageCategoryCount[categoryId] = 1;
          }

          if (!categoryVendorMap[categoryId]) {
            categoryVendorMap[categoryId] = new Set();
          }
          if (vendorId) {
            categoryVendorMap[categoryId].add(vendorId);
          }

          if (categoryFollowerMap[categoryId]) {
            categoryFollowerMap[categoryId] += followers;
          } else {
            categoryFollowerMap[categoryId] = followers;
          }

          if (storyMap[categoryId]) {
            storyMap[categoryId] += storys;
          } else {
            storyMap[categoryId] = storys;
          }

          if (postMap[categoryId]) {
            postMap[categoryId] += posts;
          } else {
            postMap[categoryId] = posts;
          }
        }
      }

      const finalResult = [];
      for (let j = 0; j < cat?.length; j++) {
        const categoryId = cat[j]?._id;
        const categoryName = cat[j]?.page_category;

        if (pageCategoryCount[categoryId]) {
          finalResult.push({
            id: categoryId,
            category_name: categoryName,
            category_used: pageCategoryCount[categoryId],
            vendor_count: categoryVendorMap[categoryId]?.size || 0,
            total_followers: categoryFollowerMap[categoryId] || 0,
            total_stories: storyMap[categoryId] || 0,
            total_posts: postMap[categoryId] || 0
          });
        }
      }

      setCategoryData(finalResult);
    }
  }, [vendorTypes, vendorData, cat, pageList]);

  return (
    <>
      <div className="tabs">
        <button
          className={activeTab === 'Tab1' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab1')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'Tab2' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab2')}
        >
          Statistics
        </button>
        <button
          className={activeTab === 'Tab3' ? 'active btn btn-primary' : 'btn'}
          onClick={() => setActiveTab('Tab3')}
        >
          Category Wise
        </button>
      </div>

      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    {/* <th>Page Name</th> */}
                    <th>Profile Count</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topVendorData && topVendorData.map((item) => (
                    <tr key={item.vendor_id}>
                      <td><a href={item.vendor_id} target="blank">{item.vendor_name}</a></td>
                      {/* <td>{item.page_name}</td> */}
                      <td>{item.page_id_count}</td>
                      <td>{item.total_credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div id="waModal" className="modal fade" role="dialog">
        <div className="modal-dialog" style={{ maxWidth: '40%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Type</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {waData.length > 0 ? (
                    waData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{linkType?.data.find((type) => type?._id == item.type)?.link_type}</td>
                        <td><a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center' }}>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        {activeTab === 'Tab1' &&
          <div className="">
            <div className="card">
              <div className="card-header flexCenterBetween">
                <h5 className="card-title flexCenterBetween">
                  {pageStatsAuth && (
                    ''
                    // <Switch
                    //   checked={showPageHealthColumn}
                    //   value={showPageHealthColumn}
                    //   onChange={() =>
                    //     dispatch(setShowPageHealthColumn(!showPageHealthColumn))
                    //   }
                    //   name="Profile Health"
                    //   color="primary"
                    // />
                  )}
                  <Typography>Profile Health</Typography>
                  <Typography>: {filterData?.length}</Typography>
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
              <div className="card-body pb4">
                <div className="row thm_form">
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="platform-autocomplete"
                      options={platformData}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d.platform_id == option._id
                        )?.length;
                        return `${option.platform_name} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Platform" variant="outlined" />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          // Reset the data when the clear button is clicked
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.platform_id == newValue._id
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    {/* <Autocomplete
                    id="ownership-type-autocomplete"
                    options={[
                      ...new Set(
                        vendorTypes?.map((item) => {
                          return item?.ownership_type;
                        })
                      ),
                    ]}
                    getOptionLabel={(option) => {
                      const count = vendorTypes.filter(
                        (d) => d.ownership_type == option
                      )?.length;
                      let item = ownerShipData?.find((item) => item._id == option);
                      let name = item ? item.company_type_name : "NA"; // Access the name property of the item
                      return `${name} (${count})`;
                    }}
                    style={{ width: 270 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ownership "
                        variant="outlined"
                      />
                    )}
                    onChange={(event, newValue) => {
                      if (newValue === null) {
                        setFilterData(vendorTypes);
                      } else {
                        let result = vendorTypes.filter(
                          (d) => d.ownership_type == newValue
                        );
                        setFilterData(result);
                      }
                    }}
                  /> */}
                    <Autocomplete
                      id="ownership-type-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => item.ownership_type)
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d.ownership_type === option
                        )?.length;
                        return `${option} (${count})`;
                      }}
                      style={{ width: 270 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ownership"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.ownership_type === newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="page-status-autocomplete"
                      options={[
                        ...new Set(
                          vendorTypes?.map((item) => {
                            return item?.status;
                          })
                        ),
                      ]}
                      getOptionLabel={(option) => {
                        const count = vendorTypes.filter(
                          (d) => d.status == option
                        )?.length;
                        let name = option == 1 ? "Active" : "Inactive";
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
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.status == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
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
                        const count = vendorTypes.filter(
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
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_name_type == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
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
                        const users = user?.find((e) => e.user_id == option);
                        const count = vendorTypes.filter(
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
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_closed_by == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3 mb16">
                    <Autocomplete
                      id="category-autocomplete"
                      options={[
                        ...new Set(vendorTypes?.map(item => item?.page_category_id))
                      ]}
                      getOptionLabel={(option) => {
                        const category = cat?.find(e => e?._id === option);
                        const count = vendorTypes?.filter(
                          d => d?.page_category_id === option
                        ).length;
                        return `${category?.page_category || 'Unknown Category'} (${count})`;
                      }}
                      renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" />}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          setFilterData(vendorTypes);
                          calculateAndSetTotals(vendorTypes)
                        } else {
                          let result = vendorTypes.filter(
                            (d) => d.page_category_id == newValue
                          );
                          setFilterData(result);
                          calculateAndSetTotals(result)
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    {showPageHealthColumn == true ? (
                      <Autocomplete
                        id="Health of Pages"
                        options={[{ value: 'Done', label: 'Done' }, { value: 'Not Done', label: 'Not Done' }]}
                        renderInput={(params) => <TextField {...params} label="Select Completion" variant="outlined" />}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={(event, newValue) => {
                          if (newValue === null) {
                            setFilterData(vendorTypes);
                          } else {
                            let result = [];
                            if (newValue.value === 'Done') {
                              result = filterData.filter(
                                (d) => d.hasOwnProperty('reach') && d.hasOwnProperty('impression')
                              );
                            } else if (newValue.value === 'Not Done') {
                              result = filterData.filter(
                                (d) => !d.hasOwnProperty('reach') && !d.hasOwnProperty('impression')
                              );
                            }
                            setFilterData(result);
                          }
                        }}
                      />
                    ) : ''}
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
                  {/* <div className="col-md-3 mb16">
                  <Autocomplete
                    id="ownership-autocomplete"
                    options={[
                      ...new Set(
                        vendorTypes?.map((item) => {
                          return item?.ownership_type;
                        })
                      ),
                    ]}
                    getOptionLabel={(option) => {
                      const count = vendorTypes.filter(
                        (d) => d.ownership_type == option
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
                      } else {
                        let result = vendorTypes.filter(
                          (d) => d.ownership_type == newValue
                        );
                        setFilterData(result);
                      }
                    }}
                  />
                </div> */}
                </div>
              </div>
              <div className="card-footer">
                <div className="flexCenterBetween">
                  <div>
                    <h5>Followers - <span className="colorMedium">{tableFollowers}</span></h5>
                  </div>
                  <div>
                    <h5>Posts - <span className="colorMedium">{tablePosts}</span></h5>
                  </div>
                  <div>
                    <h5>Stories - <span className="colorMedium">{tableStories}</span></h5>
                  </div>
                  <div>
                    <h5>Boths - <span className="colorMedium">{tableBoths}</span></h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p0">
                <div className="data_tbl thm_table table-responsive">
                  {isPageListLoading ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        position: "relative",
                        margin: "auto",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress variant="determinate" value={progress} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          color="text-primary"
                        >
                          {`${Math.round(progress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    // <Box sx={{ height: 700, width: "100%" }}>
                    //   <DataGrid
                    //     title="Profile Overview"
                    //     rows={filterData}
                    //     columns={dataGridcolumns}
                    //     // processRowUpdate={handleEditCellChange}
                    //     // onCellEditStop={handleEditCellChange}
                    //     // onCellEditStart={handleEditCellChange}
                    //     // onEditCellChange={handleEditCellChange}
                    //     // onRowDoubleClick={(params) => {
                    //     //   navigate(`/admin/pms-page-edit/${params.row._id}`);
                    //     // }}
                    //     // onCellEditStop={(params) =>
                    //     //   setTimeout(() => handleEditCellChange(params), 1000)
                    //     // }

                    //     // onPaginationModelChange={handlePageChange}
                    //     pageSize={5}
                    //     rowsPerPageOptions={[5]}
                    //     // rowHeight={38}
                    //     disableSelectionOnClick
                    //     getRowId={(row) => row._id}
                    //     slots={{ toolbar: GridToolbar }}
                    //     slotProps={{
                    //       toolbar: {
                    //         showQuickFilter: true,
                    //       },
                    //     }}
                    //     checkboxSelection
                    //     disableRowSelectionOnClick
                    //   />
                    // </Box>
                    <View
                      columns={dataGridcolumns}
                      data={newFilterData}
                      isLoading={false}
                      title={"Page Overview"}
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName={"Page Overview"}
                    />
                  )}
                </div>
              </div>
            </div>
            <Dialog
              open={showPriceModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Price Details"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {!isPriceLoading && (
                    <DataGrid
                      rows={priceData}
                      columns={priceColumn}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      getRowId={(row) => row._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <TagCategoryListModal />
            <VendorNotAssignedModal />
            <PageDetail />
          </div>
        }
        {activeTab === 'Tab2' &&
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile with Levels</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(pageLevels).map(([level, count]) => (
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={level} onClick={() => pageWithLevels(level)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div class="iconBadge small bgPrimaryLight m-0">
                            <span></span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{level}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
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
                <h5 className="card-title">Profile with Status</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(pageStatus).map(([status, count]) => (
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={status} onClick={() => pageWithStatus(status)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div class="iconBadge small bgPrimaryLight m-0">
                            <span></span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{status}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
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
                <h5 className="card-title">Profile with Followers Count</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card" onClick={() => showData(data.lessThan1Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div class="iconBadge small bgPrimaryLight m-0">
                          <span></span>
                        </div>
                        <div>
                          <h6 className="colorMedium">Less than 1 Lac</h6>
                          <h6 className="mt4 fs_16">{data.lessThan1Lac.length}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card" onClick={() => showData(data.between1And10Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div class="iconBadge small bgPrimaryLight m-0">
                          <span></span>
                        </div>
                        <div>
                          <h6 className="colorMedium">1-10 Lacs</h6>
                          <h6 className="mt4 fs_16">{data.between1And10Lac.length}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card" onClick={() => showData(data.between10And20Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div class="iconBadge small bgPrimaryLight m-0">
                          <span></span>
                        </div>
                        <div>
                          <h6 className="colorMedium">10-20 Lacs</h6>
                          <h6 className="mt4 fs_16">{data.between10And20Lac.length}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card" onClick={() => showData(data.between20And30Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div class="iconBadge small bgPrimaryLight m-0">
                          <span></span>
                        </div>
                        <div>
                          <h6 className="colorMedium">20-30 Lacs</h6>
                          <h6 className="mt4 fs_16">{data.between20And30Lac.length}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                    <div
                      className="card" onClick={() => showData(data.moreThan30Lac)}
                    >
                      <div className="card-body pb20 flexCenter colGap14">
                        <div class="iconBadge small bgPrimaryLight m-0">
                          <span></span>
                        </div>
                        <div>
                          <h6 className="colorMedium">More than 30 Lacs</h6>
                          <h6 className="mt4 fs_16">{data.moreThan30Lac.length}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profile closed by</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {userCounts.map((item) => (
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={item.userName} onClick={() => pageClosedBy(item.userId)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div class="iconBadge small bgPrimaryLight m-0">
                            <span></span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{item.userName}</h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div
                  className="card"
                  data-toggle="modal" data-target="#myModal"
                >
                  <div className="card-body pb20 flexCenter colGap14">
                    <div class="iconBadge small bgPrimaryLight m-0">
                      <span></span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Top Vendors</h6>
                      <h6 className="mt4 fs_16">10</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        }
        {activeTab === 'Tab3' &&
          <div className="">
            <Box sx={{ height: 700, width: "100%" }}>
              <DataGrid
                title="Category Wise"
                rows={categoryData}
                columns={categoryGridcolumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        }
      </div>
    </>
  );
};

export default PageOverview;