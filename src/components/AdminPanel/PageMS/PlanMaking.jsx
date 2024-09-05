import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowPageHealthColumn,
} from "../../Store/PageOverview";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import {
  useGetAllCitiesQuery,
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetMultiplePagePriceQuery,
  useGetOwnershipTypeQuery,
  useGetPageStateQuery,
  useGetpagePriceTypeQuery,
} from "../../Store/PageBaseURL";
import Checkbox from '@mui/material/Checkbox';

const PlanMaking = () => {
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  const { data: pageStates } = useGetPageStateQuery();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('Tab1');

  const [filterData, setFilterData] = useState([]);
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(10);
  const [contextData, setContextData] = useState(false);
  const [pageUpdateAuth, setPageUpdateAuth] = useState(false);
  const [pageStatsAuth, setPageStatsAuth] = useState(false);
  
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedRows, setSelectedRows] = useState([]);
  const [postPerPageValues, setPostPerPageValues] = useState({});
  const [storyPerPageValues, setStoryPerPageValues] = useState({});
  const [costPerPostValues, setCostPerPostValues] = useState({});
  const [costPerStoryValues, setCostPerStoryValues] = useState({});
  const [costPerBothValues, setCostPerBothValues] = useState({});
  const [totalCostValues, setTotalCostValues] = useState({});
  const [totalPagesSelected, setTotalPagesSelected] = useState(0);
  const [showTotalCost, setShowTotalCost] = useState({});
  const [totalDeliverables, setTotalDeliverables] = useState(0);

  const { data: allPriceTypeList } = useGetpagePriceTypeQuery();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();

  const showPageHealthColumn = useSelector(
    (state) => state.PageOverview.showPageHelathColumn
  );

  const { data: cities } = useGetAllCitiesQuery();

  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalPostsPerPage, setTotalPostsPerPage] = useState(0);
  const [totalStoriesPerPage, setTotalStoriesPerPage] = useState(0);
  
  useEffect(() => {
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

  useEffect(() => {
    if (pageList) {
      setVendorTypes(pageList.data);
      setFilterData(pageList.data);
      const initialPostValues = {};
      const initialStoryValues = {};
      const initialCostPerPostValues = {};
      const initialCostPerStoryValues = {};
      const initialCostPerBothValues = {};
      pageList.data.forEach(page => {
        initialPostValues[page._id] = 0;
        initialStoryValues[page._id] = 0;
        initialCostPerPostValues[page._id] = page.m_post_price || 0;
        initialCostPerStoryValues[page._id] = page.m_story_price || 0;
        initialCostPerBothValues[page._id] = page.m_both_price || 0;
      });
      setPostPerPageValues(initialPostValues);
      setStoryPerPageValues(initialStoryValues);
      setCostPerPostValues(initialCostPerPostValues);
      setCostPerStoryValues(initialCostPerStoryValues);
      setCostPerBothValues(initialCostPerBothValues);
    }
  }, [pageList]);

  const { data: priceData, isLoading: isPriceLoading } =
    useGetMultiplePagePriceQuery();

  const handleCheckboxChange = (row) => (event) => {
    const updatedSelectedRows = event.target.checked
      ? [...selectedRows, row]
      : selectedRows.filter((selectedRow) => selectedRow._id !== row._id);

    setSelectedRows(updatedSelectedRows);
    setShowTotalCost({
      ...showTotalCost,
      [row._id]: event.target.checked,
    });
    updateStatistics(updatedSelectedRows);
  };

  const handlePostPerPageChange = (row) => (event) => {
    const updatedPostValues = {
      ...postPerPageValues,
      [row._id]: event.target.value
    };
    setPostPerPageValues(updatedPostValues);
    calculateTotalCost(row._id, updatedPostValues[row._id], storyPerPageValues[row._id], costPerPostValues[row._id], costPerStoryValues[row._id], costPerBothValues[row._id]);
    updateStatistics(selectedRows);
  };

  useEffect(() => {
    updateStatistics(selectedRows);
  }, [storyPerPageValues, postPerPageValues]);

  const handleStoryPerPageChange = (row) => (event) => {
    const updatedStoryValues = {
      ...storyPerPageValues,
      [row._id]: event.target.value
    };
    setStoryPerPageValues(updatedStoryValues);
    calculateTotalCost(row._id, postPerPageValues[row._id], updatedStoryValues[row._id], costPerPostValues[row._id], costPerStoryValues[row._id], costPerBothValues[row._id]);
    // updateStatistics(selectedRows);
  };

  const updateStatistics = (rows) => {
    let followers = 0;
    let cost = 0;
    let posts = 0;
    let stories = 0;
    let totalDeliverables = 0;

    rows.forEach(row => {
      const postPerPage = Number(postPerPageValues[row._id]) || 0;
      const storyPerPage = Number(storyPerPageValues[row._id]) || 0;
      const rowFollowers = row.followers_count || 0;

      followers += row.followers_count || 0;
      cost += totalCostValues[row._id] || 0;
      posts += Number(postPerPageValues[row._id]) || 0;
      stories += Number(storyPerPageValues[row._id]) || 0;
      totalDeliverables += (postPerPage + storyPerPage) * rowFollowers;
      setTotalDeliverables(totalDeliverables);
    });

    setTotalFollowers(followers);
    setTotalCost(cost);
    setTotalPostsPerPage(posts);
    setTotalStoriesPerPage(stories);
    setTotalPagesSelected(rows.length);
  };

  const calculateTotalCost = (id, postPerPage, storyPerPage, costPerPost, costPerStory, costPerBoth) => {
    let totalCost;
    if (postPerPage === storyPerPage) {
      totalCost = postPerPage * costPerBoth;
    } else {
      totalCost = (postPerPage * costPerPost) + (storyPerPage * costPerStory);
    }
    setTotalCostValues({
      ...totalCostValues,
      [id]: totalCost
    });
  };

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "Count",
      renderCell: (params) => (
        <div> {filterData.indexOf(params.row) + 1} </div>
      ),

      width: 80,
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 200,
      editable: true
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={params.row.page_link}
            className="link-primary"
          >
            {params.row.page_link}
          </a>
        );
      },
    },
    {
      field: "followers_count",
      headerName: "Followers",
      width: 100,
    },
    {
      field: "ownership_type",
      headerName: "Ownership",
      width: 100
    },
    {
      field: "est_update",
      headerName: 'Selection',
      width: 100,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={selectedRows.some((row) => row._id === params.row._id)}
            onChange={handleCheckboxChange(params.row)}
          />
        );
      },
    },
    {
      field: "created_at",
      headerName: 'Post Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{width:'70%'}}
            value={postPerPageValues[params.row._id] || ''}
            onChange={handlePostPerPageChange(params.row)}
            />
          );
      },
    },
    {
      field: "updated_by",
      headerName: 'Story Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{width:'70%'}}
            value={storyPerPageValues[params.row._id] || ''}
            onChange={handleStoryPerPageChange(params.row)}
          />
        );
      },
    },
    {
      field: "last_updated_by",
      headerName: 'Total Cost',
      width: 100,
      renderCell: (params) => {
        return (
          <div style={{border:"1px solid red", padding:'10px'}}>{'₹'}{showTotalCost[params.row._id] ? totalCostValues[params.row._id] || 0 : '-'}</div>
        );
      },
    },
    {
      field: "page_catg_id",
      headerName: "Category",
      width: 200,
      renderCell: (params) => {
        let name = cat?.find((item) => item?._id == params.row?.page_category_id)?.page_category;
        return <div>{name}</div>;
      },
    },
    {
      field: "platform_id",
      headerName: "Platform",
      renderCell: (params) => {
        let name = platformData?.find((item) => item?._id == params.row.platform_id)?.platform_name;
        return <div>{name}</div>;
      },
      width: 150,
    },
    { field: "page_status", headerName: "Status", width: 100 }
  ];

  const pageDetailColumn = [
    {
      field: "m_post_price",
      headerName: "Cost Per Post",
      width: 150,
      valueGetter: ({ row }) => {
        let mPostPrice = row.m_post_price;
        let postPrice = row.post;
        return postPrice ?? mPostPrice;
      },
    },
    {
      field: "m_story_price",
      headerName: "Cost Per Story",
      width: 150,
      valueGetter: ({ row }) => {
        let mStoryPrice = row.m_story_price;
        let storyPrice = row.story;
        return storyPrice ?? mStoryPrice;
      },
    },
    {
      field: "m_both_price",
      headerName: "Both Price",
      width: 150,
      valueGetter: ({ row }) => {
        let mBothPrice = row.m_both_price;
        let bothPrice = row.both_;
        return bothPrice ?? mBothPrice;
      },
    }
  ];

  if (!pageStatsAuth || decodedToken?.role_id === 1) {
    dataGridcolumns.push(...pageDetailColumn);
  }
  !decodedToken?.role_id === 1 &&
    dispatch(setShowPageHealthColumn(pageStatsAuth));

  if (showPageHealthColumn) {
    dataGridcolumns.push(...pageHealthColumn);
  }

  return (
    <>
      <div className="tabs">
        <h4>Plan Making</h4>
      </div>

      <div className="content">
        {activeTab === 'Tab1' &&
        <div className="">
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
                  <>
                    <Box sx={{ padding: 2 }}>
                      <Typography>Total Followers: {totalFollowers} || 
                        Total Cost: {totalCost} ||
                        Total Posts Per Page: {totalPostsPerPage} ||
                        Total Stories Per Page: {totalStoriesPerPage} ||
                        Total Deliverable: {totalDeliverables} ||
                        Total Pages: {totalPagesSelected}
                      </Typography>
                    </Box>
                  <Box sx={{ height: 700, width: "100%" }}>
                    <DataGrid
                      title="Page Overview"
                      rows={filterData}
                      columns={dataGridcolumns}
                      // onRowDoubleClick={(params) => {
                      //   navigate(`/admin/pms-page-edit/${params.row._id}`);
                      // }}
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
                      // checkboxSelection
                      disableRowSelectionOnClick
                    />
                  </Box>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </>
  );
};

export default PlanMaking;
