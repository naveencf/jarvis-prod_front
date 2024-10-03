import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePickerCf from "../../CommonTool/DatePickerCf";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import { Box, Button, ButtonGroup, Modal, Typography } from '@mui/material';

// Modal style
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const CategoryWisePagesHistory = () => {
    const location = useLocation();
    const { categoryId } = location.state || {};
    const [value, setValue] = useState(categoryId ? '1' : '2');
    const [data, setData] = useState([]);
    const [postWiseHistoryData, setPostWiseHistoryData] = useState([]);
    const [category, setCategory] = useState([]);
    const [overViewValue, setOverViewValue] = useState(9);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const minSelectableDate = dayjs().subtract(1, 'year').toDate();
    const [postCountRange, setPostCountRange] = useState({ start: 10, end: 20 }); // New state for range
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    console.log(selectedRow, '16-sep');

    const handleOpen = (row) => {
        console.log(row.pagesWithPostCountRange,' 16-sep <-- row ');
        setSelectedRow(row?.pagesWithPostCountRange);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    useEffect(() => {
        if (categoryId) {
            CategoryPagesHistory();
        }

    }, [categoryId, startDate, endDate, overViewValue]);

    const CategoryPagesHistory = async () => {
        try {
            const res = await axios.post('https://insights.ist:8080/api/v1/community/analysis_creators_stats_based_on_page_categories', {
                pageCategoryId: categoryId,
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : "2024-08-10",
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : "2024-09-06",
                flageForDateRange: 1,
                isCommunityPages: 1
            });
            const result = res?.data?.data?.result || [];
            setData(result);
        } catch (error) {
            console.error("Error fetching category pages history", error);
        }
    };
    useEffect(() => {
        postWiseHistory(postCountRange.start, postCountRange.end); // Pass range to function
    }, [postCountRange]);
    const postWiseHistory = async (start, end) => {
        try {
            const res = await axios.post('https://insights.ist:8080/api/v1/community/get_pages_based_on_post_count_fluctuation', {
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : "2024-08-10",
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : "2024-09-06",
                postCountRangeStart: start,
                postCountRangeEnd: end,
                flageForDateRange: 1,
                isCommunityPages: 1
            });
            const result = res?.data?.data?.result || [];
            setPostWiseHistoryData(result);
        } catch (error) {
            console.error("Error fetching post-wise history", error);
        }
    };

    const getCategory = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/projectxpagecategory');
            setCategory(res?.data?.data);
        } catch (error) {
            console.error('Error fetching categories:', error.message || error);
        }
    };
    useEffect(() => {
        getCategory();
    }, []);
    const handleOverViewChange = (event, newValue) => {
        const now = new Date();
        let start, end;

        switch (newValue) {
            case 0: // Today
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setDate(now.getDate() + 1));
                break;
            case 1: // This Week
                start = new Date(now.setDate(now.getDate() - now.getDay()));
                end = new Date(now.setDate(now.getDate() + 6 - now.getDay()));
                break;
            case 2: // This Month
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 3: // This Year
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            case 4: // Previous Week
                start = new Date(now.setDate(now.getDate() - now.getDay() - 7));
                end = new Date(now.setDate(now.getDate() - now.getDay()));
                break;
            case 5: // Previous Month
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 6: // Previous Year
                start = new Date(now.getFullYear() - 1, 0, 1);
                end = new Date(now.getFullYear() - 1, 11, 31);
                break;
            case 7: // Custom (Example: Last 30 days)
                start = new Date(now.setDate(now.getDate() - 30));
                end = new Date();
                break;
            case 8: // Yesterday
                start = new Date(now.setDate(now.getDate() - 1));
                end = new Date(now.setDate(now.getDate()));
                break;
            case 9: // All
                start = null;
                end = null;
                break;
            case 10: // Previous Three Months
                start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 11: // Previous Six Months
                start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            default:
                break;
        }
        setStartDate(start);
        setEndDate(end);
        setOverViewValue(newValue);
    };
    const handleRangeClick = (start, end) => {
        setPostCountRange({ start, end }); // Update range on button click
    };
    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            width: 90,
            renderCell: (params) => {
                const rowIndex = data?.findIndex(row => row?._id === params?.row?._id);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "_id",
            headerName: "Date",
            width: 120
        },
        {
            field: "totalPages",
            headerName: "Total Pages",
            width: 120
        },
        {
            field: "totalFollowers",
            headerName: "Total Followers",
            width: 120
        },
        {
            field: "totalPostCount",
            headerName: "Post Count",
            width: 120
        },
        {
            field: "totalReelCount",
            headerName: "Reel",
            width: 120
        },
        {
            field: "totalStaticPostCount",
            headerName: "Static Post",
            width: 120
        },
        {
            field: "totalStoryCount",
            headerName: "Story",
            width: 120
        },
    ];
    const columnsPost = [
        {
            field: "S.NO",
            headerName: "S.NO",
            width: 90,
            renderCell: (params) => {
                const rowIndex = postWiseHistoryData?.findIndex(row => row?._id === params?.row?._id);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "_id",
            headerName: "Date",
            width: 120
        },
        {
            field: "lengthOfPagesWithPostCountRange",
            headerName: " Page Length",
            width: 120
        },
        {
            field: "Pages",
            headerName: "Pages",
            width: 120,
            renderCell: (params) => {
                return <>
                    <Button onClick={() => handleOpen(params.row)}>
                        View Pages
                    </Button>
                </>

            }
        },
    ]
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            <div className="card pgTab">
                <TabContext value={String(overViewValue)}>
                    <div className="card-header flex_center_between">

                        <TabList
                            className="tabSM"
                            onChange={handleOverViewChange}
                            aria-label="tabs"
                        >
                            <Tab label="All" value={9} />
                            {/* <Tab label="Yesterday" value={8} /> */}
                            <Tab label="This Week" value={1} />
                            <Tab label="This Month" value={2} />
                            {/* <Tab label="Last Week" value={4} /> */}
                            <Tab label="Last Month" value={5} />
                            <Tab label="Quarterly" value={10} />
                            <Tab label="Month Wise" value={11} />
                            <Tab label="Custom" value={7} />
                        </TabList>
                    </div>
                    {overViewValue === 7 && (
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


            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {value === '1' ? <Tab
                                label="Category Wise History"
                                value="1"
                            /> : ""}
                            {value === '2' ? <Tab
                                label="post Wise History"
                                value="2"
                            /> : ""}
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <div className="card">
                            <h5 className="cardHeaderTitle">
                                Category - {category?.filter((item) => item?.category_id === categoryId)[0]?.category_name || 'Category Not Found'}
                            </h5>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                getRowId={(row) => row?._id}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                        <div className="card">
                            <div>
                                <ButtonGroup variant="outlined" aria-label="Basic button group">
                                    <Button onClick={() => handleRangeClick(0, 1)}>0</Button>
                                    <Button onClick={() => handleRangeClick(1, 5)}>1 - 5</Button>
                                    <Button onClick={() => handleRangeClick(5, 20)}>5 - 20</Button>
                                    <Button onClick={() => handleRangeClick(20, 100)}> 20+</Button>
                                </ButtonGroup>
                            </div>
                            <DataGrid
                                rows={postWiseHistoryData}
                                columns={columnsPost}
                                getRowId={(row) => row._id}
                            />
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
            <> {/* Modal for displaying page data */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={modalStyle}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Page Details
                        </Typography>
                        {/* <Typography id="modal-description" sx={{ mt: 2 }}>
                        {selectedRow ? JSON.stringify(selectedRow.Pages) : 'No data available'}
                    </Typography> */}
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </Modal></>
        </div>
    );
}

export default CategoryWisePagesHistory;
