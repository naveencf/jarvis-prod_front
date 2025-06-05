import { Avatar, Button, Tab } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommunityTeamCreation from "./CommunityTeamCreation";
import formatString from "../../../utils/formatString";
import CommunityHeader from "./CommunityHeader";
import { formatNumber } from "../../../utils/formatNumber";
import TableSkeleton from "../../CommonTool/TableSkeleton";
import DatePickerCf from "../../CommonTool/DatePickerCf";
import { TabContext, TabList } from "@mui/lab";
import dayjs from "dayjs";
import { formatUTCDate } from "../../../utils/formatUTCDate";
import CommunityReport from "./CommunityReport";
import jwtDecode from "jwt-decode";
import {
  ApiContextData,
  useAPIGlobalContext,
} from "../../AdminPanel/APIContext/APIContext";
import {
  useGetAllCommunityInternalCatsQuery,
  useProjectxUpdateMutation,
} from "../../Store/API/Community/CommunityInternalCatApi";
import View from "../../AdminPanel/Sales/Account/View/View";

function CustomToolbar({
  setFilterButtonEl,
  setOpenTeam,
  rowSelectionModel,
  setLeft,
  setRight,
  setSelectedManager,
  setUserNumbers,
  setEditMode,
  setTeamDetail,
}) {
  const { userContextData } = useContext(ApiContextData);

  const handleTeam = useCallback(async () => {
    if (rowSelectionModel.length === 0) {
      alert("Please select the Page first.");
      return;
    } else if (rowSelectionModel.length > 1) {
      alert("Please select only one Page.");
      return;
    }
    const pageName = rowSelectionModel[0].toLowerCase();
    try {
      const res = await axios.get(
        `https://insights.ist:8080/api/v1/community/team_by_page_name/${pageName}`
      );
      if (res.data.success) {
        alert("Team is already created for this page.");
      } else {
        setOpenTeam(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [rowSelectionModel, setOpenTeam]);

  const handleEditTeam = useCallback(async () => {
    if (rowSelectionModel.length === 0) {
      alert("Please select the Page first.");
      return;
    } else if (rowSelectionModel.length > 1) {
      alert("Please select only one Page.");
      return;
    }
    const pageName = rowSelectionModel[0].toLowerCase();
    try {
      const response = await axios.get(
        `https://insights.ist:8080/api/v1/community/team_by_page_name/${pageName}`
      );
      if (!response.data.success) {
        alert("Team is not created yet.");
      } else {
        const res = await axios.post(
          `https://insights.ist:8080/api/v1/community/team_users`,
          { page_name: pageName }
        );
        const teamData = res.data.data;
        const tempUserNumber = {};
        const detailedTeamData = teamData.map((teamUser) => {
          const userDetails = userContextData?.find(
            (user) => user.user_id === teamUser.user_id
          );
          tempUserNumber[teamUser.user_id] = teamUser?.cost_of_running;
          return {
            ...teamUser,
            ...userDetails,
            teamID: response.data.data?._id,
          };
        });
        setUserNumbers(tempUserNumber);
        const manager = detailedTeamData?.find((user) => user.role === 1);
        if (manager) setSelectedManager(manager);
        setRight(detailedTeamData);
        setTeamDetail(response.data.data);
        setOpenTeam(true);
        setEditMode(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    rowSelectionModel,
    setEditMode,
    setOpenTeam,
    setRight,
    setSelectedManager,
    setUserNumbers,
    userContextData,
  ]);

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport />

      <Button variant="contained" onClick={handleTeam}>
        Create Team
      </Button>
      <Button variant="contained" onClick={handleEditTeam}>
        Show/Edit Team
      </Button>
    </GridToolbarContainer>
  );
}

function CommunityHome() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { contextData } = useAPIGlobalContext();
  const { userContextData } = useContext(ApiContextData);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [reload, setReload] = useState(true);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [openTeam, setOpenTeam] = useState(false);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [userNumbers, setUserNumbers] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [overViewvalue, setOverViewValue] = useState(2);
  const [filterModel, setFilterModel] = useState({
    items: [{ id: 1, field: "creatorName", operator: "contains" }],
  });
  const [pagecategory, setPageCategory] = useState([]);
  const [reloadpagecategory, setReloadpagecategory] = useState(false);
  const [projectxpages, setProjectxpages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null);
  const [reportView, setReportView] = useState(false);
  const [communityManagerCategory, setCommunityManagerCategory] = useState();
  const minSelectableDate = dayjs("2023-11-01");
  const {
    data: communityInternalCats,
    isLoading: isCommunityCatsLoading,
    error: communityCatsError,
    refetch: refetchCommunityCats,
  } = useGetAllCommunityInternalCatsQuery();

  const getCommunityManagerCategory = async () => {
    try {
      const res = await axios.get(
        `https://insights.ist:8080/api/v1/community/category_manager_by_user/${loginUserId}`
      );
      setCommunityManagerCategory(res.data.data);
    } catch (error) {
      console.error("Error fetching community manager category:", error);
    }
  };

  const fetchRows = async () => {
    try {
      const res = await axios.post(
        "https://insights.ist:8080/api/v1/community/super_tracker_post_analytics",
        {
          startDate: startDate,
          endDate: endDate,
        }
      );
      if (res.status === 200) {
        let filteredData = res?.data?.data;
        if (loginUserId === communityManagerCategory?.userId) {
          const pageCategoryIds = communityManagerCategory?.pageCategoryIds;
          filteredData = filteredData?.filter((item) =>
            pageCategoryIds?.includes(item?.projectxRecord?.pageCategoryId)
          );
        }
        setRows(filteredData);
        setAllRows(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching Data: ", error);
    }
  };
  console.log("rows", rows);
  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `https://insights.ist:8080/api/projectxpagecategory`
      );

      if (res.status === 200) {
        setPageCategory(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (startDate) {
      fetchRows();
      setRowSelectionModel([]);
    }
  }, [reload, startDate, endDate]);
  useEffect(() => {
    handleOverViewChange("e", 2);
    fetchCategory();
  }, [reloadpagecategory]);

  useEffect(() => {
    try {
      axios.get("https://insights.ist:8080/api/getallprojectx").then((res) => {
        if (res.status === 200) {
          setProjectxpages(res.data.data);
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    getCommunityManagerCategory();
  }, []);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    S_No: true,
    avatar: true,
    creatorName: true,
    projectxRecord: true,
    followersCount: true,
    yesterdaypost: true,
    yesterdayFollowerGrowth: true,
    followerdiff: true,
    teamtype: true,
    teammanager: true,
    status: false,
    Date: false,
    teamcount: true,
    teamcost: false,
    followingCount: true,
    mediaCount: false,
    followerStartdate: false,
    followerEnddate: false,
    Image: false,
    Carousel: false,
    Reel: false,
  });
  const columns = [
    {
      key: "sno",
      name: "S.No",
      width: 70,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "creatorName",
      name: "Page Name",
      width: 220,
    },
    {
      key: "followersCount",
      name: "Followers",
      width: 100,
      renderRowCell: (row) =>
        formatNumber(row.creatorInfo?.followersCount) || 0,
    },
    {
      key: "followingCount",
      name: "Following",
      width: 100,
      renderRowCell: (row) => row.creatorInfo?.followingCount || 0,
    },
    {
      key: "category",
      name: "Category",
      width: 220,
      renderRowCell: (row) => {
        const category = pagecategory.find(
          (cat) => cat.category_id === row.projectxRecord?.pageCategoryId
        );
        return category?.category_name || "N/A";
      },
    },
    {
      key: "internal_category",
      name: "Internal Category",
      width: 220,
      renderRowCell: (row) => {
        const internalCat = communityInternalCats?.find(
          (cat) => cat._id === row.projectxRecord?.pageInternalCategoryId
        );
        return internalCat?.internal_category_name || "N/A";
      },
    },

    {
      key: "postcount",
      name: "Total Posts",
      width: 100,
    },
    {
      key: "page_status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => row.projectxRecord?.page_status || "N/A",
    },
    {
      key: "todayPostCount",
      name: "Y-Day Posts",
      width: 130,
      renderRowCell: (row) =>
        row.reportStatus?.previousDay?.todayPostCount || 0,
    },
    {
      key: "followerGrowth",
      name: "Y-Day Follower Growth",
      width: 170,
      renderRowCell: (row) =>
        row.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0,
    },
    {
      key: "followerDiff",
      name: "Follower Diff",
      width: 130,
      renderRowCell: (row) =>
        (row.reportStatus?.endDate?.followersCount || 0) -
        (row.reportStatus?.startDate?.followersCount || 0),
    },
    {
      key: "teamType",
      name: "Page Type",
      width: 140,
      renderRowCell: (row) => {
        const count = row.teamInfo?.team?.team_count || 0;
        return count > 1
          ? "Team"
          : count === 1
          ? "Individual"
          : "Team Not Created";
      },
    },

    {
      key: "avatar",
      name: "Avatar",
      width: 70,
      renderRowCell: (row) => {
        const instagramProfileUrl = `https://www.instagram.com/${row.creatorName}/`;
        const avatarSrc = `https://storage.googleapis.com/insights_backend_bucket/cr/${row.creatorName?.toLowerCase()}.jpeg`;
        return (
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={avatarSrc}
              alt={row.creatorName}
              style={{ width: 36, height: 36, borderRadius: "50%" }}
            />
          </a>
        );
      },
    },
  ];

  const handleOverViewChange = (event, newValue) => {
    const now = new Date();

    if (newValue == 0) {
      // Today
      setStartDate(new Date(now.setHours(0, 0, 0, 0)));
      setEndDate(new Date(now.setDate(now.getDate() + 1)));
    } else if (newValue == 1) {
      // This Week

      setStartDate(new Date(now.setDate(now.getDate() - now.getDay())));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 2) {
      // This Month
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (newValue == 3) {
      // This Year
      setStartDate(new Date(now.getFullYear(), 0, 1));
      setEndDate(new Date(now.getFullYear(), 11, 31));
    } else if (newValue == 4) {
      // Previous Week
      setStartDate(new Date(now.setDate(now.getDate() - now.getDay() - 7)));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 5) {
      // Previous Month
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (newValue == 6) {
      // Previous Year
      setStartDate(new Date(now.getFullYear() - 1, 0, 1));
      setEndDate(new Date(now.getFullYear() - 1, 11, 31));
    } else if (newValue == 7) {
      // Custom (Example: Last 30 days)
      setStartDate(new Date(now.setDate(now.getDate() - 30)));
      setEndDate(new Date());
    } else if (newValue === 8) {
      // Yesterday
      setStartDate(new Date(now.setDate(now.getDate() - 1))); // Yesterday
      setEndDate(new Date(now.setDate(now.getDate()))); // Today (end of day)
    } else if (newValue === 9) {
      // Yesterday
      setStartDate(null); // Yesterday
      setEndDate(null); // Today (end of day)
    } else if (newValue === 10) {
      // Previous Three Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (newValue === 11) {
      // Previous Six Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 6, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    }
    setOverViewValue(newValue);
  };

  return (
    <div className="workWrapper">
      {allRows.length > 0 ? (
        <>
          <div className="action_heading">
            <div className="form-heading">
              <h2 className="mb0 mt-1">Community Overview</h2>
            </div>
            <div className="action_btns">
            <Link
                className="btn cmnbtn btn-primary btn_sm"
                to={"/admin/instaapi/community/community-pages"}
              >
                Community Pages List
              </Link>
              <Link
                className="btn cmnbtn btn-primary btn_sm"
                to={"/admin/instaapi/community/internal-category"}
              >
                Add Internal Categories
              </Link>
              <Button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() => setReportView(false)}
              >
                Pages
              </Button>
              <Button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() => setReportView(true)}
              >
                Overview
              </Button>
              <Button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() => navigate("/admin/instaapi/community/user")}
              >
                Users
              </Button>
              <Button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() =>
                  navigate("/admin/instaapi/community/managerView")
                }
              >
                Manager View
              </Button>
            </div>
          </div>
          <div>
            <TabContext value={overViewvalue}>
              <div className="card-header pt20 pb16 flex_center_between border-bottom-0">
                <h5 className="cardHeaderTitle">
                  Page Overview From : <br />
                  <small>
                    <b>
                      {formatUTCDate(startDate)} To : {formatUTCDate(endDate)}
                    </b>
                  </small>
                </h5>
                <TabList
                  className="pgTab tabSM"
                  onChange={handleOverViewChange}
                  aria-label="lab API tabs example"
                >
                  {/* <Tab label="All" value={9} /> */}
                  <Tab label="Yesterday" value={0} />
                  <Tab label="This Week" value={1} />
                  <Tab label="This Month" value={2} />
                  <Tab label="This Year" value={3} />
                  {/* <Tab label="Yesterday" value={8} /> */}
                  <Tab label="Last Week" value={4} />
                  <Tab label="Last Month" value={5} />
                  <Tab label="Quaterly" value={10} />
                  <Tab label="Half Yearly" value={11} />
                  <Tab label="Last Year" value={6} />
                  <Tab label="Custom" value={7} />
                </TabList>
              </div>
              {overViewvalue == 7 && (
                <DatePickerCf
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  minSelectableDate={minSelectableDate}
                />
              )}
            </TabContext>
          </div>
          {!reportView ? (
            <div className="mt20">
              <div className="card-header pt20 pb20">
                {contextData &&
                  contextData[0] &&
                  contextData[0].view_value == 1 && (
                    <CommunityHeader
                      setRows={setRows}
                      rows={rows}
                      allRows={allRows}
                      reload={reload}
                      setReload={setReload}
                      pagecategory={pagecategory}
                      communityInternalCats={communityInternalCats}
                      rowSelectionModel={rowSelectionModel}
                      projectxpages={projectxpages}
                      setReloadpagecategory={setReloadpagecategory}
                      reloadpagecategory={reloadpagecategory}
                    />
                  )}
              </div>

              <div>
                {openTeam && (
                  <CommunityTeamCreation
                    rowSelectionModel={rowSelectionModel}
                    setRowSelectionModel={setRowSelectionModel}
                    openTeam={openTeam}
                    setOpenTeam={setOpenTeam}
                    left={left}
                    setLeft={setLeft}
                    right={right}
                    setRight={setRight}
                    selectedManager={selectedManager}
                    setSelectedManager={setSelectedManager}
                    userNumbers={userNumbers}
                    setUserNumbers={setUserNumbers}
                    reload={reload}
                    setReload={setReload}
                    editShowMode={editMode}
                    setRows={setRows}
                    teamDetail={teamDetail}
                  />
                )}
              </div>
              <div className="">
                <div className="">
                  <View
                    version={1}
                    columns={columns}
                    data={rows}
                    isLoading={isCommunityCatsLoading}
                    title="Community Pages"
                    rowSelectable={true}
                    pagination={[ 50, 100,200]}
                    tableName="Community Pages"
                  />
                </div>
              </div>
            </div>
          ) : (
            <CommunityReport
              rows={rows}
              pagecategory={pagecategory}
              allRows={allRows}
              setRows={setRows}
              setReportView={setReportView}
            />
          )}
        </>
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
}

export default CommunityHome;
