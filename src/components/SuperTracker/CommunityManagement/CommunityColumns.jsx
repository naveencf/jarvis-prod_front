import { Avatar, Link } from "@mui/material";
import formatString from "../../../utils/formatString";
import formatNumber from "../../../utils/formatNumber"; // Assuming this utility function exists
import rows from "../data/rows"; // Import your data array
import pagecategory from "../data/pagecategory"; // Import your page category data
import userContextData from "../data/userContextData"; // Import your user context data

export const CommunityHomeColumn = [
  {
    field: "sno",
    headerName: "S_No",
    width: 70,
    valueGetter: (params) => rows.indexOf(params.row) + 1, // Adding 1 to start the index from 1
    renderCell: (params) => {
      const rowIndex = rows.indexOf(params.row);
      return (
        <div style={{ textAlign: "center", marginLeft: 10 }}>
          {rowIndex + 1}
        </div>
      );
    },
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 70,
    renderCell: (params) => {
      const instagramProfileUrl = `https://www.instagram.com/${params.row.creatorName}/`;
      return (
        <Link href={instagramProfileUrl} target="_blank" rel="noopener noreferrer">
          <Avatar
            src={`https://storage.googleapis.com/insights_backend_bucket/cr/${params.row.creatorName.toLowerCase()}.jpeg`}
          />
        </Link>
      );
    },
  },
  {
    field: "creatorName",
    headerName: "Page name",
    width: 220,
    valueGetter: (params) => formatString(params.row.creatorName) || "",
    renderCell: (params) => {
      const instagramProfileUrl = `/admin/instaapi/community/manager/${params.row.creatorName}`;
      return (
        <Link href={instagramProfileUrl} rel="noopener noreferrer">
          {formatString(params.row.creatorName)}
        </Link>
      );
    },
  },
  {
    field: "reportStatus.previousDay.pageCategoryId",
    headerName: "Category",
    width: 220,
    valueGetter: (params) =>
      params.row?.reportStatus?.previousDay?.pageCategoryId || 0,
    renderCell: (params) => {
      const CategoryName = pagecategory.find(
        (category) =>
          category.category_id ===
          params.row?.reportStatus?.previousDay?.pageCategoryId
      );
      return CategoryName?.category_name || "Unknown";
    },
  },
  {
    field: "teammanager",
    headerName: "Manager",
    width: 200,
    valueGetter: (params) => params.row.teamInfo?.teamManager?.user_id || 0,
    renderCell: (params) =>
      userContextData?.find(
        (user) => user.user_id === params.row.teamInfo?.teamManager?.user_id
      )?.user_name || "N/A",
  },
  {
    field: "teamtype",
    headerName: "Page Type",
    width: 200,
    valueGetter: (params) => params.row.teamInfo?.team?.team_count || 0,
    renderCell: (params) => {
      const pageType =
        params.row.teamInfo?.team?.team_count > 1
          ? "Team"
          : params.row.teamInfo?.team?.team_count === 1
          ? "Individual"
          : "Team Not Created";
      return pageType;
    },
  },
  {
    field: "teamcount",
    headerName: "Team-Count",
    width: 100,
    valueGetter: (params) => params.row.teamInfo?.team?.team_count || 0,
  },
  {
    field: "teamcost",
    headerName: "COR",
    width: 100,
    valueGetter: (params) => params.row.teamInfo?.team?.cost_of_running || 0,
  },
  // Uncomment if you want to include the StorePost column
  // {
  //   field: "postcount",
  //   headerName: "StorePost",
  //   width: 100,
  // },
  {
    field: "followersCount",
    headerName: "Follower",
    width: 100,
    valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
    renderCell: (params) => {
      const instagramfollowerCount =
        params.row.creatorInfo?.followersCount || 0;
      return formatNumber(instagramfollowerCount);
    },
  },
  {
    field: "followingCount",
    headerName: "Following",
    width: 100,
    valueGetter: (params) => params.row.creatorInfo?.followingCount || 0,
    renderCell: (params) => {
      const instagramfollowingCount =
        params.row.creatorInfo?.followingCount || 0;
      return formatNumber(instagramfollowingCount);
    },
  },
  {
    field: "mediaCount",
    headerName: "Media",
    width: 100,
    valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
    renderCell: (params) => {
      const mediaCount = params.row.creatorInfo?.postCount || 0;
      return formatNumber(mediaCount);
    },
  },
  {
    field: "nonPaidPosts.allLikes",
    headerName: "Np-Likes",
    width: 100,
    valueGetter: (params) => params.row.nonPaidPosts?.allLikes || 0,
    renderCell: (params) => {
      const nonpaidlikes = params.row.nonPaidPosts?.allLikes || 0;
      return formatNumber(nonpaidlikes);
    },
  },
  {
    field: "allViews",
    headerName: "Np-Views",
    width: 100,
    valueGetter: (params) => params.row.nonPaidPosts?.allViews || 0,
    renderCell: (params) => {
      const npViews = params.row.nonPaidPosts?.allViews || 0;
      return formatNumber(npViews);
    },
  },
  {
    field: "allComments",
    headerName: "Np-Comments",
    width: 100,
    valueGetter: (params) => params.row.nonPaidPosts?.allComments || 0,
    renderCell: (params) => {
      const allComments = params.row.nonPaidPosts?.allComments || 0;
      return formatNumber(allComments);
    },
  },
  {
    field: "yesterdaypost",
    headerName: "YesterDay-Post-Count",
    width: 150,
    valueGetter: (params) =>
      params.row.reportStatus?.previousDay?.todayPostCount || 0,
  },
  {
    field: "yesterdayFollowerGrowth",
    headerName: "YesterDay-Follower-Growth",
    width: 150,
    valueGetter: (params) =>
      params.row.reportStatus?.previousDay
        ?.todayVsYesterdayFollowersCountDiff || 0,
    renderCell: (params) => {
      const growth = params.value || 0;
      return (
        <div
          style={{
            color: growth > 0 ? "green" : growth < 0 ? "red" : "black",
          }}
        >
          {growth}
        </div>
      );
    },
  },
  {
    field: "followerdiff",
    headerName: "FollowerDifference",
    width: 100,
    renderCell: (params) => {
      const followerDiff =
        params.row?.reportStatus?.startDate?.followersCount -
        params.row?.reportStatus?.endDate?.followersCount || 0;
      return formatNumber(followerDiff);
    },
  },
  {
    field: "followerStartdate",
    headerName: "StartDate-Follower",
    width: 100,
    renderCell: (params) => {
      const instagramFollowerCount =
        params.row?.reportStatus?.startDate?.followersCount || 0;
      return instagramFollowerCount;
    },
  },
  {
    field: "followerEnddate",
    headerName: "EndDate-Follower",
    width: 100,
    renderCell: (params) => {
      const instagramFollowerCount =
        params.row?.reportStatus?.endDate?.followersCount || 0;
      return instagramFollowerCount;
    },
  },
];
