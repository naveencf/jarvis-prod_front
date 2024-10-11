import React, { useContext, useEffect, useState } from 'react'
import Brightness6Icon from "@mui/icons-material/Brightness6";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppContext } from '../../../../Context/Context';

const StatisticsWisePageOverview = ({ tabFilterData, setTabFilterData, setFilterData, setActiveTab, allVendorWhats, newFilterData }) => {
    const { usersDataContext } = useContext(AppContext);
    const [pageLevels, setPageLevels] = useState([]);
    const [pageStatus, setPageStatus] = useState([]);
    const [zeroLinksCount, setZeroLinksCount] = useState(0);
    const [oneLinkCount, setOneLinkCount] = useState(0);
    const [twoLinksCount, setTwoLinksCount] = useState(0);
    const [threeLinksCount, setThreeLinksCount] = useState(0);
    const [data, setData] = useState({
        lessThan1Lac: [],
        between1And10Lac: [],
        between10And20Lac: [],
        between20And30Lac: [],
        moreThan30Lac: [],
    });

    useEffect(() => {
        const countPageLevels = (tabFilterData) => {
            const counts = {};
            tabFilterData?.forEach((item) => {
                const category = item.preference_level;
                counts[category] = (counts[category] || 0) + 1;
            });
            return counts;
        };

        const counts = countPageLevels(tabFilterData);
        setPageLevels(counts);
    }, [tabFilterData]);

    const pageWithLevels = (level) => {
        const pagewithlevels = tabFilterData.filter(
            (item) => item.preference_level == level
        );
        setFilterData(pagewithlevels);
        setActiveTab("Tab1");
    };


    useEffect(() => {
        const countPageStatus = (tabFilterData) => {
            const counts = {};
            tabFilterData.forEach((item) => {
                const status = item.page_mast_status;
                counts[status] = (counts[status] || 0) + 1;
            });
            return counts;
        };

        const counts = countPageStatus(tabFilterData);
        setPageStatus(counts);
    }, [tabFilterData]);

    const pageWithStatus = (status) => {
        const pagewithstatus = tabFilterData.filter(
            (item) => item.page_mast_status == status
        );
        setFilterData(pagewithstatus);
        setActiveTab("Tab1");
    };
    const renderWhatsAppLinkCards = () => {
        const recordCount = { 0: 0, 1: 0, 2: 0, 3: 0 };

        newFilterData?.forEach((row) => {
            const matchedVendors = allVendorWhats?.filter(
                (item) => item.vendor_id === row?.vendor_id
            );
            const count = matchedVendors?.length || 0;

            if (count > 3) {
                recordCount[3]++;
            } else {
                recordCount[count]++;
            }
        });
        setZeroLinksCount(recordCount[0]);
        setOneLinkCount(recordCount[1]);
        setTwoLinksCount(recordCount[2]);
        setThreeLinksCount(recordCount[3]);
        // setFilterData(filtered);
    };
    useEffect(() => {
        if (allVendorWhats?.length > 0 && newFilterData?.length > 0) {
            renderWhatsAppLinkCards();
        }
    }, [allVendorWhats, newFilterData]);
    const handleFilterByWhatsAppCount = (count) => {
        setActiveTab("Tab1");
    };

    useEffect(() => {
        let newData = {
            lessThan1Lac: [],
            between1And10Lac: [],
            between10And20Lac: [],
            between20And30Lac: [],
            moreThan30Lac: [],
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
        setActiveTab("Tab1");
        setFilterData(dataArray);
    };
    const pageClosedBy = (close_by) => {
        const pageclosedby = tabFilterData.filter(
            (item) => item.page_closed_by == close_by
        );
        setFilterData(pageclosedby);
        setActiveTab("Tab1");
    };
    const closedByCounts = tabFilterData?.reduce((acc, item) => {
        acc[item.page_closed_by] = (acc[item.page_closed_by] || 0) + 1;
        return acc;
    }, {});

    const userCounts = Object.keys(closedByCounts)?.map((key) => {
        const userId = parseInt(key);
        const userName =
            usersDataContext?.find((u) => u?.user_id === parseInt(key))?.user_name || "NA";
        return { userId, userName, count: closedByCounts[key] };
    });
    return (
        <>
            <div className="vendor-container">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Profile with Levels</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {Object.entries(pageLevels).map(([level, count]) => (
                                <div
                                    key={level}
                                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <div
                                        className="card pointer"
                                        key={level}
                                        onClick={() => pageWithLevels(level)}
                                    >
                                        <div className="card-body pb20 flexCenter colGap14">
                                            <div className="iconBadge small bgPrimaryLight m-0">
                                                <span>
                                                    <Brightness6Icon />
                                                </span>
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
                    <div className="card-body ">
                        <div className="row">
                            {Object.entries(pageStatus).map(([status, count]) => (
                                <div
                                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                    key={Math.random()}
                                >
                                    <div
                                        className="card pointer"
                                        key={status}
                                        onClick={() => pageWithStatus(status)}
                                    >
                                        <div className="card-body pb20 flexCenter colGap14">
                                            <div className="iconBadge small bgPrimaryLight m-0">
                                                <span>
                                                    <ToggleOffIcon />
                                                </span>
                                            </div>
                                            <div>
                                                <h6 className="colorMedium">
                                                    {status == 0
                                                        ? "Active"
                                                        : status == 1
                                                            ? "Inactive"
                                                            : status == 2
                                                                ? "Delete"
                                                                : status == 3
                                                                    ? "Semiactive"
                                                                    : "Unknown"}
                                                </h6>
                                                <h6 className="mt4 fs_16">{count}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* WhatsAppp Links */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">WhatsApp Links</h5>
                    </div>
                    <div className="card-body">
                        <div
                            className="row"
                            onClick={() => handleFilterByWhatsAppCount(0)}
                        >
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                key={Math?.random()}
                            >
                                <div className="card ">
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">
                                                Records with 0 WhatsApp Link
                                            </h6>
                                            <h6 className="mt4 fs_16">{zeroLinksCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <div className="card">
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">
                                                Records with 1 WhatsApp Link
                                            </h6>
                                            <h6 className="mt4 fs_16">{oneLinkCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <div className="card">
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">
                                                Records with 2 WhatsApp Link
                                            </h6>
                                            <h6 className="mt4 fs_16">{twoLinksCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <div className="card">
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">
                                                Records with 3 WhatsApp Link
                                            </h6>
                                            <h6 className="mt4 fs_16">{threeLinksCount}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* =------------------= */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Profile with Followers Count</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                    onClick={() => showData(data.lessThan1Lac)}
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">Less than 1 Lac</h6>
                                            <h6 className="mt4 fs_16">
                                                {data.lessThan1Lac.length}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                    onClick={() => showData(data.between1And10Lac)}
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">1-10 Lacs</h6>
                                            <h6 className="mt4 fs_16">
                                                {data.between1And10Lac.length}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                    onClick={() => showData(data.between10And20Lac)}
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">10-20 Lacs</h6>
                                            <h6 className="mt4 fs_16">
                                                {data.between10And20Lac.length}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                    onClick={() => showData(data.between20And30Lac)}
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">20-30 Lacs</h6>
                                            <h6 className="mt4 fs_16">
                                                {data.between20And30Lac.length}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                    onClick={() => showData(data.moreThan30Lac)}
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">More than 30 Lacs</h6>
                                            <h6 className="mt4 fs_16">
                                                {data.moreThan30Lac.length}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =------------------= */}

                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Profile closed by</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {userCounts.map((item) => (
                                <div
                                    className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                    key={Math.random()}
                                >
                                    <div
                                        className="card pointer"
                                        key={item.userName}
                                        onClick={() => pageClosedBy(item.userId)}
                                    >
                                        <div className="card-body pb20 flexCenter colGap14">
                                            <div className="iconBadge small bgPrimaryLight m-0">
                                                <span>
                                                    <AccountCircleIcon />
                                                </span>
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
                            data-toggle="modal"
                            data-target="#myModal"
                        >
                            <div className="card-body pb20 flexCenter colGap14 pointer">
                                <div className="iconBadge small bgPrimaryLight m-0">
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
        </>
    )
}

export default StatisticsWisePageOverview
