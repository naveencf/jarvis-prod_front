import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../../utils/config';
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import formatString from '../../Operation/CampaignMaster/WordCapital';

const StatsOfOverview = () => {
    const [followerCount, setFollowerCount] = useState([]);
    const [preferenceLevel, setPreferenceLevel] = useState([]);
    const [status, setStatus] = useState([]);
    const [closeBy, setCloseBy] = useState([]);

    const getStaticsWisePageOverviewData = async () => {
        try {
            const res = await axios.get(`${baseUrl}v1/get_all_counts`);
            const followercount = Object.entries(res?.data?.data?.followercount).map(([range, count]) => ({
                range,
                count,
            }));
            const preferenceLevel = Object.entries(res?.data?.data?.preference_level).map(([lavel, value]) => ({
                lavel, value
            }))
            const status = Object.entries(res?.data?.data?.status).map(([lavel, value]) => ({
                lavel, value
            }))
            const closedBy = res?.data?.data?.pageClosedBYCounts.map((item) => item.count)

            setFollowerCount(followercount);
            setPreferenceLevel(preferenceLevel);
            setStatus(status);
            setCloseBy(res?.data?.data?.pageClosedBYCounts)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        getStaticsWisePageOverviewData();
    }, []);
    return (
        <div className="vendor-container">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Profile with Levels</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        {preferenceLevel?.map((item, index) => (
                            <div
                                key={index}
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                                <div
                                    className="card pointer"
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <Brightness6Icon />
                                            </span>
                                        </div>
                                        <div>
                                            {/* <h6 className="colorMedium">{item.lavel == 'high' ? "High" : item.lavel == 'medium' ? "Medium" : "Low"}</h6> */}
                                            <h6 className="colorMedium">{formatString(item.lavel)}</h6>
                                            <h6 className="mt4 fs_16">{item.value}</h6>
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
                    <h5 className="card-title">Profile with Followers Count</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        {followerCount?.map((item, index) => (
                            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                                <div
                                    className="card pointer"
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <FormatListNumberedIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">{item.range}</h6>
                                            <h6 className="mt4 fs_16">{item.count}</h6>
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
                        {status?.map((item, index) => (
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                key={index}
                            >
                                <div
                                    className="card pointer"

                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <ToggleOffIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">
                                                {formatString(item.lavel)}
                                            </h6>
                                            <h6 className="mt4 fs_16">{item.value}</h6>
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
                    <h5 className="card-title">Profile closed by</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        {closeBy.map((item, i) => (
                            <div
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                                key={i}
                            >
                                <div
                                    className="card pointer"
                                >
                                    <div className="card-body pb20 flexCenter colGap14">
                                        <div className="iconBadge small bgPrimaryLight m-0">
                                            <span>
                                                <AccountCircleIcon />
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="colorMedium">{item.count}</h6>
                                            <h6 className="mt4 fs_16">{item.page_closed_by}</h6>
                                            <h6 className="mt4 fs_16">{item.user_name}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsOfOverview