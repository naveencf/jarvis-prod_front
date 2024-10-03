import { Typography, Tabs, Tab, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const BottomTenPage = ({ rows, allRows }) => {
  const [bottom10Pages, setBottom10Pages] = useState([]);
  const [bottom10FollowerGrowth, setBottom10FollowerGrowth] = useState([]);
  const [bottom10Post, setBottom10Post] = useState([]);
  const [bottom10media, setBottom10media] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const rowsCopy = [...allRows];

    rowsCopy.sort(
      (a, b) => a.creatorInfo.followersCount - b.creatorInfo.followersCount
    );
    setBottom10Pages(rowsCopy.slice(0, 10));

    rowsCopy.sort(
      (a, b) =>
        (a.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0) -
        (b.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0)
    );
    setBottom10FollowerGrowth(rowsCopy.slice(0, 10));

    rowsCopy.sort(
      (a, b) =>
        (a.reportStatus?.previousDay?.todayPostCount || 0) -
        (b.reportStatus?.previousDay?.todayPostCount || 0)
    );
    setBottom10Post(rowsCopy.slice(0, 10));

    rowsCopy.sort(
      (a, b) =>
        (a.creatorInfo?.postCount || 0) - (b.creatorInfo?.postCount || 0)
    );
    setBottom10media(rowsCopy.slice(0, 10));
  }, [allRows]);

  const column10 = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = bottom10Pages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "_id", headerName: "Page", width: 150 },
    {
      field: "count",
      headerName: "Follower",
      width: 150,
      valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
    },
  ];

  const columnFollowerGrowth = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = bottom10FollowerGrowth.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "_id", headerName: "Page", width: 150 },
    {
      field: "yesterdayFollowerGrowth",
      headerName: "Follower-Growth",
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
  ];

  const columnPost = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = bottom10Post.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "_id", headerName: "Page", width: 150 },
    {
      field: "postCount",
      headerName: "Post Count",
      width: 100,
      valueGetter: (params) => params.row.postcount || 0,
    },
    {
      field: "Image",
      headerName: "Static",
      width: 110,
      renderCell: (params) => {
        const imagePost = params.row.postTypes?.find(
          (post) => post.type === "IMAGE"
        );
        return imagePost?.count || "-";
      },
    },
    {
      field: "Carousel",
      headerName: "Carousel",
      width: 110,
      renderCell: (params) => {
        const carouselPost = params.row.postTypes?.find(
          (post) => post.type === "CAROUSEL"
        );
        return carouselPost?.count || "-";
      },
    },
    {
      field: "Reel",
      headerName: "Reel",
      width: 110,
      renderCell: (params) => {
        const reelPost = params.row.postTypes?.find(
          (post) => post.type === "REEL"
        );
        return reelPost?.count || "-";
      },
    },
  ];

  const columnMedia = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = bottom10media.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "_id", headerName: "Page", width: 150 },
    {
      field: "mediaCount",
      headerName: "Media Count",
      width: 100,
      valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <div className="card-header flexCenterBetween">
        <h5 className="card-title">Bottom Pages</h5>
        <Tabs
          className="pgTab tabSM"
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs"
        >
          <Tab label={<div> Followers </div>} />
          <Tab label={<div> - Growth</div>} />
          <Tab
            label={
              <div>
                <KeyboardArrowDownIcon />
                Post
              </div>
            }
          />
          <Tab
            label={
              <div>
                <KeyboardArrowDownIcon />
                Media
              </div>
            }
          />
        </Tabs>
      </div>
      <div className="card-body p0 m0 table table-responsive">
        {activeTab === 0 && (
          <div className="thmTable">
            <DataGrid
              rows={bottom10Pages}
              columns={column10}
              getRowId={(row) => row._id}
            />
          </div>
        )}
        {activeTab === 1 && (
          <div className="thmTable">
            <DataGrid
              rows={bottom10FollowerGrowth}
              columns={columnFollowerGrowth}
              getRowId={(row) => row._id}
            />
          </div>
        )}
        {activeTab === 2 && (
          <div className="thmTable">
            <DataGrid
              rows={bottom10Post}
              columns={columnPost}
              getRowId={(row) => row._id}
            />
          </div>
        )}
        {activeTab === 3 && (
          <div className="thmTable">
            <DataGrid
              rows={bottom10media}
              columns={columnMedia}
              getRowId={(row) => row._id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomTenPage;
