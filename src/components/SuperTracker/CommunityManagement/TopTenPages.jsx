import { Box, Typography, Tabs, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const TopTenPages = ({ allRows }) => {
    const [top5Pages, setTop5Pages] = useState([]);
    const [top10FollowerGrowth, setTop10FollowerGrowth] = useState([]);
    const [top10Post, setTop10Post] = useState([]);
    const [top10Media, setTop10Media] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const rowsCopy = [...allRows];

        const sortedByFollowers = [...rowsCopy].sort((a, b) => b.creatorInfo.followersCount - a.creatorInfo.followersCount);
        setTop5Pages(sortedByFollowers.slice(0, 5));

        const sortedByGrowth = [...rowsCopy].sort((a, b) => (b.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0) - (a.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0));
        setTop10FollowerGrowth(sortedByGrowth.slice(0, 10));

        const sortedByPost = [...rowsCopy].sort((a, b) => (b.reportStatus?.previousDay?.todayPostCount || 0) - (a.reportStatus?.previousDay?.todayPostCount || 0));
        setTop10Post(sortedByPost.slice(0, 10));

        const sortedByMedia = [...rowsCopy].sort((a, b) => (b.creatorInfo?.postCount || 0) - (a.creatorInfo?.postCount || 0));
        setTop10Media(sortedByMedia.slice(0, 10));
    }, [allRows]);

    const column5 = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = top5Pages.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page ', width: 150 },
        {
            field: 'count', headerName: 'Follower ', width: 150, valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
        },
    ];

    const columnGrowth = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = top10FollowerGrowth.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page ', width: 150 },
        {
            field: "yesterdayFollowerGrowth",
            headerName: "Follower-Growth",
            width: 150,
            valueGetter: (params) =>
                params.row.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0,
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
        }
    ];

    const columnPost = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = top10Post.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page ', width: 150 },
        {
            field: 'postCount', headerName: 'Post Count ', width: 150, valueGetter: (params) => params.row.reportStatus?.previousDay?.todayPostCount || 0,
        },
        {
            field: 'Image', headerName: 'Image ', width: 150, valueGetter: (params) => params.row.postTypes[0]?.count ? params.row.postTypes[0]?.count : "-" ,
        },
        {
            field: 'Carousel', headerName: 'Carousel ', width: 150, valueGetter: (params) => params.row.postTypes[1]?.count ? params.row.postTypes[1]?.count : "-",
        },
        {
            field: 'Reel', headerName: 'Reel ', width: 150, valueGetter: (params) => params.row.postTypes[2]?.count ? params.row.postTypes[2]?.count : "-",
        },

    ];

    const columnMedia = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = top10Media.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page ', width: 150 },
        {
            field: 'mediaCount', headerName: 'Media Count ', width: 150, valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
        },
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ mt: 2 }} variant="h6">Top Pages</Typography>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="tabs">
                <Tab label={<div style={{ color: 'green' }}> Followers</div>}  />
                <Tab label={<div style={{ color: 'green' }}> + Growth</div>} />
                <Tab label={<div style={{ color: 'green' }}> <KeyboardArrowUpIcon />Post </div>} />
                <Tab label={<div style={{ color: 'green' }}> <KeyboardArrowUpIcon />Media </div>} />
            </Tabs>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {activeTab === 0 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={top5Pages}
                            columns={column5}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={top10FollowerGrowth}
                            columns={columnGrowth}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 2 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={top10Post}
                            columns={columnPost}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 3 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={top10Media}
                            columns={columnMedia}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default TopTenPages;
