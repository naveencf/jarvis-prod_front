import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Copy } from "@phosphor-icons/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGlobalContext } from "../../../Context/Context";

const PurchasePagesStats = ({ PlanData }) => {
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [topLikedPages, setTopLikedPages] = useState([]);
    const [topViewedPages, setTopViewedPages] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const { toastAlert } = useGlobalContext();

    useEffect(() => {
        if (!PlanData || PlanData.length === 0) return;
        const likes = PlanData.reduce(
            (acc, item) => acc + (item.like_count || 0),
            0
        );
        const comments = PlanData.reduce(
            (acc, item) => acc + (item.comment_count || 0),
            0
        );
        const views = PlanData.reduce(
            (acc, item) => acc + (item.play_count || 0),
            0
        );
        setTotalLikes(likes);
        setTotalComments(comments);
        setTotalViews(views);

        const sortedLikes = [...PlanData]
            .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
            .slice(0, 5);
        setTopLikedPages(sortedLikes);

        const sortedViews = [...PlanData]
            .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
            .slice(0, 5);
        setTopViewedPages(sortedViews);
    }, [PlanData]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Reusable Copy Link Function
    const handleCopyLink = (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toastAlert("Link copied!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    // Column Definitions for Like-wise Data
    const columnLikes = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => (
                <div>{topLikedPages.indexOf(params.row) + 1}</div>
            ),
        },

        {
            field: "Link",
            headerName: "Link",
            width: 350,
            renderCell: (params) => {
                const url = `https://www.instagram.com/p/${params?.row?.shortCode}`;
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                );
            },
        },
        { field: "like_count", headerName: "Likes" },
        {
            field: "CopyLink",
            headerName: "Copy Link",
            width: 150,
            renderCell: (params) => {
                const url = `https://www.instagram.com/p/${params?.row?.shortCode}`;
                return (
                    <div
                        onClick={() => handleCopyLink(url)}
                        style={{ cursor: "pointer" }}
                    >
                        <Copy size={24} />
                    </div>
                );
            },
        },
    ];

    // Column Definitions for Play-wise Data
    const columnViews = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => (
                <div>{topViewedPages.indexOf(params.row) + 1}</div>
            ),
        },

        {
            field: "Link",
            headerName: "Link",
            width: 390,
            renderCell: (params) => {
                const url = `https://www.instagram.com/p/${params?.row?.shortCode}`;
                return (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                    </a>
                );
            },
        },
        { field: "play_count", headerName: "Views" },
        {
            field: "CopyLink",
            headerName: "Copy Link",
            width: 150,
            renderCell: (params) => {
                const url = `https://www.instagram.com/p/${params?.row?.shortCode}`;
                return (
                    <div
                        onClick={() => handleCopyLink(url)}
                        style={{ cursor: "pointer" }}
                    >
                        <Copy size={24} />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                        <div className="card p16 hov-pointer">
                            <h6 className="colorMedium">Total Pages</h6>
                            <h6 className="mt8 fs_16">{PlanData?.length || 0}</h6>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                        <div className="card p16 hov-pointer">
                            <h6 className="colorMedium">Total Likes</h6>
                            <h6 className="mt8 fs_16">{totalLikes}</h6>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                        <div className="card p16 hov-pointer">
                            <h6 className="colorMedium">Total Views</h6>
                            <h6 className="mt8 fs_16">{totalViews}</h6>
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                        <div className="card p16 hov-pointer">
                            <h6 className="colorMedium">Total Comments</h6>
                            <h6 className="mt8 fs_16">{totalComments}</h6>
                        </div>
                    </div>
                </div>

                {/* Top 5 Links Section */}
                <div className="card">
                    <div className="card-header flexCenterBetween">
                        <h5 className="card-title">Top-Performing Links</h5>
                        <Tabs
                            className="pgTab tabSM"
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="tabs"
                        >
                            <Tab label={<div>Likes Wise</div>} />
                            <Tab label={<div>Views Wise</div>} />
                        </Tabs>
                    </div>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="card-body p0 m0 table table-responsive">
                                {activeTab === 0 && (
                                    <div className="thmTable">
                                        <DataGrid
                                            rows={topLikedPages}
                                            columns={columnLikes}
                                            getRowId={(row) => row._id}
                                        />
                                    </div>
                                )}
                                {activeTab === 1 && (
                                    <div className="thmTable">
                                        <DataGrid
                                            rows={topViewedPages}
                                            columns={columnViews}
                                            getRowId={(row) => row._id}
                                        />
                                    </div>
                                )}
                            </div>{" "}
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default PurchasePagesStats;
