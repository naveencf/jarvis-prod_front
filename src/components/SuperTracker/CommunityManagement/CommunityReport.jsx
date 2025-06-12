import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Stack,
  Paper,
  Box,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import BottomTenPage from "./BottomTenPage";
import TopTenPages from "./TopTenPages";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

function CommunityReport({
  rows,
  setRows,
  pagecategory,
  allRows,
  setReportView,
}) {
  const navigate = useNavigate();
  const [teamCreated, setTeamCreated] = useState({ totalCor: 0, teamCount: 0 });
  const [zeroPostData, setZeroPostData] = useState([]);
  const [oneToFivePost, setOneToFivePost] = useState([]);
  const [fivePlusPost, setFivePlusPost] = useState([]);
  const [twentyPlusPost, setTwentyPlusPost] = useState([]);
  const [negativeFollowerDiff, setNegativeFollowerDiff] = useState([]);
  const [constantFollowerDiff, setConstantFollowerDiff] = useState([]);
  const [positiveFollowerDiff, setPositiveFollowerDiff] = useState([]);
  const [blankTeamInfoCount, setBlankTeamInfoCount] = useState(0);
  // console.log(allRows, " < -----allRows 16-sep");
  const groupByPageCategoryId = (rows) => {
    let grouped = {};
    rows.forEach((row) => {
      let categoryId = row.projectxRecord.pageCategoryId;

      if (grouped[categoryId]) {
        grouped[categoryId].count++;
        grouped[categoryId].followersCount +=
          row.creatorInfo.followersCount || 0;
        grouped[categoryId].todayPostCount +=
          row.reportStatus.previousDay.todayPostCount || 0;
      } else {
        grouped[categoryId] = {
          count: 1,
          followersCount: row.creatorInfo.followersCount || 0,
          todayPostCount: row.reportStatus.previousDay.todayPostCount || 0,
        };
      }
    });
    return grouped;
  };

  useEffect(() => {
    const zeroPostData = allRows.filter(
      (row) => row.reportStatus.previousDay.todayPostCount === 0
    );
    setZeroPostData(zeroPostData);
    const oneToFivePost = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayPostCount > 0 &&
        record.reportStatus.previousDay.todayPostCount < 6
    );
    setOneToFivePost(oneToFivePost);
    const FivePlusPost = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayPostCount > 5 &&
        record.reportStatus.previousDay.todayPostCount < 20
    );
    setFivePlusPost(FivePlusPost);
    const twentyPlusPost = allRows.filter(
      (record) => record.reportStatus.previousDay.todayPostCount > 19
    );
    setTwentyPlusPost(twentyPlusPost);
    const negativeFollowerDiff = allRows.filter(
      (row) =>
        row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff < 0
    );
    setNegativeFollowerDiff(negativeFollowerDiff);
    const constantFollowerDiff = allRows.filter(
      (row) =>
        row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff == 0
    );
    setConstantFollowerDiff(constantFollowerDiff);
    const positivePostDiffRecords = allRows.filter(
      (row) =>
        row.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff > 0
    );
    setPositiveFollowerDiff(positivePostDiffRecords);
    // Calculate blank team info count
    const blankTeamInfoCount = allRows.filter(
      (row) =>
        !row.teamInfo?.team ||
        Object.keys(row.teamInfo?.team || {}).length === 0
    ).length;
    setBlankTeamInfoCount(blankTeamInfoCount);
  }, [rows, allRows]);

  const groupedData = groupByPageCategoryId(rows);
  const totalFollowers = pagecategory.reduce((total, item) => {
    const countData = groupedData[item.category_id] || {
      count: 0,
      followersCount: 0,
      todayPostCount: 0,
    };
    if (countData.count > 0) {
      return total + countData.followersCount;
    }
    return total;
  }, 0);

  const totalPosts = pagecategory.reduce((total, item) => {
    const countData = groupedData[item.category_id] || {
      count: 0,
      followersCount: 0,
      todayPostCount: 0,
    };
    if (countData.count > 0) {
      return total + countData.todayPostCount;
    }
    return total;
  }, 0);

  const formatFollowersCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  };

  useEffect(() => {
    const result = processRecords(allRows);
    setTeamCreated(result);
  }, [allRows]);

  const processRecords = (rows) => {
    let totalCor = 0;
    let teamCount = 0;
    let totalPaidPost = 0;
    rows.forEach((record) => {
      if (record.teamInfo?.team?.cost_of_running) {
        totalCor += record.teamInfo.team.cost_of_running;

        if (record.teamInfo.team.team_count > 0) {
          teamCount++;
        }
      }
      if (record.paidPosts?.count > 0) {
        totalPaidPost += record.paidPosts?.count;
      }
    });

    return {
      teamCount: teamCount,
    };
  };
  const handleZeroCount = () => {
    const ZeroPostCount = allRows.filter(
      (record) => record.reportStatus.previousDay.todayPostCount === 0
    );
    setRows(ZeroPostCount);
    setReportView(false);
  };
  const handleUnderFiveCount = () => {
    const oneToFivePost = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayPostCount > 0 &&
        record.reportStatus.previousDay.todayPostCount < 6
    );
    setRows(oneToFivePost);
    setReportView(false);
  };
  const handleUnderFivePlusCount = () => {
    const fivePlusPost = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayPostCount > 5 &&
        record.reportStatus.previousDay.todayPostCount < 20
    );
    setRows(fivePlusPost);
    setReportView(false);
  };
  const handleUnderTwentyPlusCount = () => {
    const twentyPlusPost = allRows.filter(
      (record) => record.reportStatus.previousDay.todayPostCount > 19
    );
    setRows(twentyPlusPost);
    setReportView(false);
  };
  const handleNagetiveGrowth = () => {
    const nagetiveGrowth = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff < 0
    );
    setRows(nagetiveGrowth);
    setReportView(false);
  };
  const handleConstantGrowth = () => {
    const constantGrowth = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff == 0
    );
    setRows(constantGrowth);
    setReportView(false);
  };
  const handlePositiveGrowth = () => {
    const positiveGrowth = allRows.filter(
      (record) =>
        record.reportStatus.previousDay.todayVsYesterdayFollowersCountDiff > 0
    );
    setRows(positiveGrowth);
    setReportView(false);
  };

  const handleClick = (categoryId) => {
    navigate("/admin/community/categoryWise/pagesHistoey", {
      state: { categoryId },
    });
  };

  const handleClickPostWiseData = () => {
    navigate("/admin/community/categoryWise/pagesHistoey");
  };
  return (
    <>
      <div className="row mt20">
        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">All Category</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <span>
                      <i className="bi bi-people"></i>
                    </span>
                  </div>
                  <div>
                    <h6 className="colorMedium">Followers</h6>
                    <h6 className="mt4 fs_16">
                      {formatFollowersCount(totalFollowers)}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <span>
                      <i className="bi bi-images"></i>
                    </span>
                  </div>
                  <div>
                    <h6 className="colorMedium">Posts</h6>
                    <h6 className="mt4 fs_16">{totalPosts}</h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <span>
                      <i className="bi bi-exclamation-triangle"></i>
                    </span>
                  </div>
                  <div>
                    <h6 className="colorMedium">Team not created count</h6>
                    <h6 className="mt4 fs_16">
                      {allRows?.length - teamCreated?.teamCount}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <span>
                      <i className="bi bi-person-slash"></i>
                    </span>
                  </div>
                  <div>
                    <h6 className="colorMedium">Manager Not Assigned</h6>
                    <h6 className="mt4 fs_16">{blankTeamInfoCount}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Pages</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 col-sm-3 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgPrimaryLight m-0">
                    <h5>{allRows.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">All</h6>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgSuccessLight m-0">
                    <h5>
                      {
                        allRows.filter(
                          (record) => record.projectxRecord.page_status == 3
                        ).length
                      }
                    </h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Active</h6>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgDangerLight m-0">
                    <h5>
                      {
                        allRows.filter(
                          (record) => record.projectxRecord.page_status == 2
                        ).length
                      }
                    </h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Disabled</h6>
                  </div>
                </div>
                <div className="col-md-3 col-sm-3 col-12 pb20 flexCenter colGap14">
                  <div className="iconBadge small bgWarningLight m-0">
                    <h5>
                      {
                        allRows.filter(
                          (record) => record.projectxRecord.page_status == 1
                        ).length
                      }
                    </h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Private</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Pages with Post</h5>
              <Tooltip title="Show History">
                <VisibilityIcon
                  color="primary"
                  onClick={handleClickPostWiseData}
                />
              </Tooltip>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgPrimaryLight m-0 pointer "
                    onClick={() => handleZeroCount()}
                  >
                    <h5>{zeroPostData.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">0</h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgPrimaryLight m-0 pointer "
                    onClick={() => handleUnderFiveCount()}
                  >
                    <h5>{oneToFivePost.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">1 - 5</h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgPrimaryLight m-0 pointer "
                    onClick={() => handleUnderFivePlusCount()}
                  >
                    <h5>{fivePlusPost.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">5 -20</h6>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgPrimaryLight m-0 pointer "
                    onClick={() => handleUnderTwentyPlusCount()}
                  >
                    <h5>{twentyPlusPost.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">20+</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Follower Growth</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 col-sm-4 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgDangerLight m-0 pointer "
                    onClick={() => handleNagetiveGrowth()}
                  >
                    <h5>{negativeFollowerDiff.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Negative</h6>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgPrimaryLight m-0 pointer "
                    onClick={() => handleConstantGrowth()}
                  >
                    <h5>{constantFollowerDiff.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Constant</h6>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-12 pb20 flexCenter colGap14">
                  <div
                    className="iconBadge small bgSuccessLight m-0 pointer "
                    onClick={() => handlePositiveGrowth()}
                  >
                    <h5>{positiveFollowerDiff.length}</h5>
                  </div>
                  <div>
                    <h6 className="fs_16">Positive</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <div className="card">
            <div className="card-body pt0 pb0">
              <ul>
                {pagecategory.map((item, index) => {
                  let countData = groupedData[item.category_id] || {
                    count: 0,
                    followersCount: 0,
                    todayPostCount: 0,
                  };

                  return (
                    <li key={index}>
                      {countData.count > 0 && (
                        <div className="flexCenterBetween border-bottom pt20 pb20">
                          <div className="flexCenter colGap12">
                            <Avatar alt={item.category_name} src="n" />
                            <div>
                              <h6 className="fs_16">
                                {`${item.category_name} - Pages: ${countData.count}`}
                              </h6>
                              <h6 className="mt4 colorMedium fw_400">
                                {
                                  <>
                                    Followers:
                                    {formatFollowersCount(
                                      countData.followersCount
                                    )}
                                    &nbsp;| Today Post:
                                    {countData.todayPostCount}
                                  </>
                                }
                              </h6>
                            </div>
                          </div>
                          <Tooltip title="Show History">
                            <HistoryIcon
                              onClick={() => handleClick(item.category_id)}
                              color="primary"
                              style={{ cursor: "pointer" }}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
          <TopTenPages rows={rows} allRows={allRows} />
          <BottomTenPage rows={rows} allRows={allRows} />
        </div>
      </div>
    </>
  );
}

export default CommunityReport;
