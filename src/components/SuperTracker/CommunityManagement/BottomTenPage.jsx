import { Typography, Tabs, Tab, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const BottomTenPage = ({ rows, allRows }) => {
    const [bottom10Pages, setBottom10Pages] = useState([]);
    const [bottom10FollowerGrowth, setBottom10FollowerGrowth] = useState([]);
    const [bottom10Post, setBottom10Post] = useState([]);
    const [bottom10media, setBottom10media] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const rowsCopy = [...allRows];

        rowsCopy.sort((a, b) => a.creatorInfo.followersCount - b.creatorInfo.followersCount);
        setBottom10Pages(rowsCopy.slice(0, 10));

        rowsCopy.sort((a, b) => (a.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0) - (b.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 0));
        setBottom10FollowerGrowth(rowsCopy.slice(0, 10));

        rowsCopy.sort((a, b) => (a.reportStatus?.previousDay?.todayPostCount || 0) - (b.reportStatus?.previousDay?.todayPostCount || 0));
        setBottom10Post(rowsCopy.slice(0, 10));

        rowsCopy.sort((a, b) => (a.creatorInfo?.postCount || 0) - (b.creatorInfo?.postCount || 0));
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
        { field: '_id', headerName: 'Page', width: 150 },
        {
            field: 'count', headerName: 'Follower', width: 150, valueGetter: (params) => params.row.creatorInfo?.followersCount || 0,
        }
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
        { field: '_id', headerName: 'Page', width: 150 },
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
                const rowIndex = bottom10Post.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page', width: 150 },
        {
            field: "postCount",
            headerName: "Post Count",
            width: 100,
            valueGetter: (params) => params.row.reportStatus?.previousDay?.todayPostCount || 0,
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
                const rowIndex = bottom10media.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        { field: '_id', headerName: 'Page', width: 150 },
        {
            field: "mediaCount",
            headerName: "Media Count",
            width: 100,
            valueGetter: (params) => params.row.creatorInfo?.postCount || 0,
        }
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ mt: 2 }} variant="h6">Bottom Pages</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="tabs">
                    <Tab label={<div style={{ color: 'red' }}> Followers </div> } />
                    <Tab label={<div style={{ color: 'red' }}> - Growth</div>} />
                    <Tab label={<div style={{ color: 'red' }}> <KeyboardArrowDownIcon />Post </div>} />
                    <Tab label={<div style={{ color: 'red' }}> <KeyboardArrowDownIcon />Media </div>} />
                </Tabs>
                {activeTab === 0 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={bottom10Pages}
                            columns={column10}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={bottom10FollowerGrowth}
                            columns={columnFollowerGrowth}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 2 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={bottom10Post}
                            columns={columnPost}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
                {activeTab === 3 && (
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={bottom10media}
                            columns={columnMedia}
                            getRowId={(row) => row._id}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default BottomTenPage;
