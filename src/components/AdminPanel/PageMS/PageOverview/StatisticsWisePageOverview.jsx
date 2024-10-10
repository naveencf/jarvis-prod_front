import React, { useEffect, useState } from 'react'
import Brightness6Icon from "@mui/icons-material/Brightness6";


const StatisticsWisePageOverview = ({ tabFilterData, setTabFilterData, setFilterData, setActiveTab }) => {
    const [pageLevels, setPageLevels] = useState([]);
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

                {/* <div className="card">
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
                </div> */}
                {/* WhatsAppp Links */}
                {/* <div className="card">
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
                </div> */}
                {/* =------------------= */}
                {/* <div className="card">
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
                </div> */}

                {/* <div className="card">
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
                </div> */}

                {/* <div className="row">
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
                </div> */}
            </div>
        </>
    )
}

export default StatisticsWisePageOverview
