import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePickerCf from "../../CommonTool/DatePickerCf";
import { TabContext, TabList } from "@mui/lab";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";

const CategoryWisePagesHistory = () => {
    const location = useLocation();
    const { categoryId } = location.state || {};

    const [data, setData] = useState([]);
    const [overViewValue, setOverViewValue] = useState(9);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const minSelectableDate = dayjs().subtract(1, 'year').toDate();

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
            console.log(result, 'res');
            setData(result);
        } catch (error) {
            console.error("Error fetching category pages history", error);
        }
    };

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

        // Make sure not to mutate the `now` object
        setStartDate(start);
        setEndDate(end);
        setOverViewValue(newValue);
    };

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            width: 90,
            renderCell: (params) => {
                const rowIndex = data.findIndex(row => row._id === params.row._id);
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

    return (
        <div>
            <div className="card pgTab">
                <TabContext value={String(overViewValue)}>
                    <div className="card-header flex_center_between">
                        <h5 className="cardHeaderTitle">
                            {/* Page Details {startDate ? `From - ${dayjs(startDate).format('YYYY-MM-DD')} To - ${dayjs(endDate).format('YYYY-MM-DD')}` : ""} */}
                            Category - {categoryId}
                        </h5>
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

            <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row?._id}
            />
        </div>
    );
}

export default CategoryWisePagesHistory;
