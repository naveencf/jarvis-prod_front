import React, { useState } from "react";
import {
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/config";

const OpreationLinkUpdateDirect = ({ getPlanWisePages, planWisePage }) => {
    const [instaLink, setInstaLink] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [notMatchPhaseData, setNotMatchPhaseData] = useState([]);
    const [phaseWiseUpdateData, setPhaseWiseUpdateData] = useState(null);
    console.log(phaseWiseUpdateData, 'phaseWiseUpdateData');


    // const handleClick = async () => {
    //     if (shortcode) {
    //         const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
    //         const match = shortcode?.match(regex);

    //         if (!match || !match[2]) {
    //             // console.log("Invalid shortcode format.");
    //             return;
    //         }

    //         try {
    //             const payload = {
    //                 shortCode: match[2],
    //                 department: "660ea4d1bbf521bf783ffe18",
    //                 userId: 15,
    //             };
    //             const token =
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
    //             const config = {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             };

    //             const response = await axios.post(
    //                 `https://insights.ist:8080/api/v1/getpostDetailFromInsta`,
    //                 payload,
    //                 config
    //             );

    //             if (response.data.success === true) {
    //                 const postData = response.data?.data;

    //                 const updatePayload = {
    //                     post_url: shortcode,
    //                     all_comments: postData?.comment_count,
    //                     all_like: postData?.like_count,
    //                     all_view: postData?.play_count,
    //                     creator_follower_count: postData?.owner_info?.followers,
    //                     post_image: postData?.postImage,
    //                     title: postData?.post_caption,
    //                     post_type: postData?.postType,
    //                     posted_on: postData?.postedOn,
    //                     short_code: postData?.shortCode,
    //                     phase: "2025-01-15",
    //                 };

    //                 const PhaseDateMatch = palnWisePage.find((dt) => {
    //                     const phaseDate = new Date(dt?.phase).toISOString().split("T")[0];
    //                     const postDate = new Date(postData?.postedOn)
    //                         .toISOString()
    //                         .split("T")[0];
    //                     return phaseDate === postDate;
    //                 });

    //                 if (PhaseDateMatch) {
    //                     const sortCodesMatch = palnWisePage.filter(
    //                         (item) => item?.creator_name === postData?.owner_info?.username
    //                     );

    //                     let updated = false;
    //                     for (let i = 0; i < sortCodesMatch.length; i++) {
    //                         if (sortCodesMatch[i]?.short_code === postData?.shortCode) {
    //                             console.log(
    //                                 `Match found at index ${i} with short_code: ${sortCodesMatch[i]?.short_code}`
    //                             );

    //                             const _id = sortCodesMatch[i]?._id;
    //                             await axios.put(
    //                                 `${baseUrl}operation/operation_execution_master/${_id}`,
    //                                 updatePayload,
    //                                 config
    //                             );

    //                             updated = true;
    //                             alert("Update successful with matching short_code!");
    //                             break;
    //                         }
    //                     }

    //                     if (!updated) {
    //                         for (let i = 0; i < sortCodesMatch.length; i++) {
    //                             if (sortCodesMatch[i]?.short_code === "") {
    //                                 console.log(`Empty short_code found at index ${i}`);
    //                                 const _id = sortCodesMatch[i]?._id;

    //                                 await axios.put(
    //                                     `${baseUrl}operation/operation_execution_master/${_id}`,
    //                                     updatePayload,
    //                                     config
    //                                 );

    //                                 alert("Update successful in the next available field!");
    //                                 updated = true;
    //                                 break;
    //                             }
    //                         }
    //                     }

    //                     if (!updated) {
    //                         alert("No matching or available field found to update.");
    //                     }

    //                     setShortcode("");
    //                     getPlanWisePages();
    //                 } else {
    //                     alert("Post On Date does not match!");
    //                         const notmatchpostdate_Data = palnWisePage.filter(
    //                (item) => item?.creator_name === postData?.owner_info?.username
    //              );
    //                     console.log(notmatchpostdate_Data, "notmatchpostdate_Data");
    //             setNotMatchPhaseData(notmatchpostdate_Data);
    //             setOpenModal(true); 
    //                 }
    //             } else {
    //                 console.error("Error in API response:", response.data.message);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching page details:", error);
    //         }
    //     } else {
    //         // console.log("No shortcode provided.");
    //     }
    // };


    const handleClick = async () => {
        if (instaLink) {
            const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
            const match = instaLink?.match(regex);

            if (!match || !match[2]) {
                // console.log("Invalid instaLink format.");
                return;
            }

            try {
                const payload = {
                    shortCode: match[2],
                    department: "660ea4d1bbf521bf783ffe18",
                    userId: 15,
                };
                const token =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.post(
                    `https://insights.ist:8080/api/v1/getpostDetailFromInsta`,
                    payload,
                    config
                );

                if (response.data.success === true) {
                    const postData = response.data?.data;

                    const updatePayload = {
                        post_url: instaLink,
                        all_comments: postData?.comment_count,
                        all_like: postData?.like_count,
                        all_view: postData?.play_count,
                        creator_follower_count: postData?.owner_info?.followers,
                        post_image: postData?.postImage,
                        title: postData?.post_caption,
                        post_type: postData?.postType,
                        posted_on: postData?.postedOn,
                        short_code: postData?.shortCode,
                        phase: "2025-01-18",
                    };

                    const PhaseDateMatch = planWisePage.find((dt) => {
                        const phaseDate = new Date(dt?.phase).toISOString().split("T")[0];
                        const postDate = new Date(postData?.postedOn)
                            .toISOString()
                            .split("T")[0];
                        return phaseDate === postDate;
                    });

                    if (PhaseDateMatch) {
                        const AllPagesByUserName = planWisePage.filter(
                            (item) => item?.creator_name === postData?.owner_info?.username
                        );

                        let updated = false;
                        for (let i = 0; i < AllPagesByUserName.length; i++) {
                            if (AllPagesByUserName[i]?.short_code === postData?.shortCode) {
                                console.log(
                                    `Match found at index ${i} with short_code: ${AllPagesByUserName[i]?.short_code}`
                                );

                                const _id = AllPagesByUserName[i]?._id;
                                await axios.put(
                                    `${baseUrl}operation/operation_execution_master/${_id}`,
                                    updatePayload,
                                    config
                                );

                                updated = true;
                                alert("Update successful with matching short_code!");
                                break;
                            }
                        }

                        if (!updated) {
                            for (let i = 0; i < AllPagesByUserName.length; i++) {
                                if (AllPagesByUserName[i]?.short_code === "") {
                                    console.log(`Empty short_code found at index ${i}`);
                                    const _id = AllPagesByUserName[i]?._id;

                                    await axios.put(
                                        `${baseUrl}operation/operation_execution_master/${_id}`,
                                        updatePayload,
                                        config
                                    );

                                    alert("Update successful in the next available field!");
                                    updated = true;
                                    break;
                                }
                            }
                        }

                        if (!updated) {
                            alert("No matching or available field found to update.");
                            const notMatchPostOnWiseDate_link = planWisePage.filter(
                                (item) => item?.creator_name === postData?.owner_info?.username
                            );
                            setNotMatchPhaseData(notMatchPostOnWiseDate_link);
                            setOpenModal(true);
                        }
                        setInstaLink("");
                        getPlanWisePages();
                    } else {
                        alert("Post On Date does not match!");
                        const notMatchPostOnWiseDate_link = planWisePage.filter(
                            (item) => item?.creator_name === postData?.owner_info?.username
                        );
                        setNotMatchPhaseData(notMatchPostOnWiseDate_link);
                        setOpenModal(true);
                    }
                } else {
                    console.error("Error in API response:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching page details:", error);
            }
        } else {
            // console.log("No shortcode provided.");
        }
    };

    return (
        <div className="d-flex m-1">
            <TextField
                style={{ width: "300px" }}
                className="form-control mr-2"
                label="Link Update"
                type="text"
                value={instaLink}
                onChange={(e) => setInstaLink(e.target.value)}
            />
            <button
                className="btn cmnbtn btn_sm btn-outline-danger"
                onClick={handleClick}
                disabled={!instaLink}
            >
                Update
            </button>

            {/* MUI Modal */}
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="no-phase-found-title"
                aria-describedby="no-phase-found-description"
            >
                <DialogTitle id="no-phase-found-title">
                    No Matching Phase Date,
                </DialogTitle>
                <DialogContent className="d-flex p-2">
                    <Autocomplete
                        options={notMatchPhaseData}
                        getOptionLabel={(option) =>
                            `${option?.phase
                                ? new Date(option.phase).toISOString().split("T")[0]
                                : "No Phase"
                            }`
                        }
                        sx={{ width: 300 }}
                        onChange={(event, value) => setPhaseWiseUpdateData(value)}
                        renderInput={(params) => <TextField {...params} label="Phase Wise Update Link Data" />}
                    />
                    <Autocomplete
                        options={notMatchPhaseData}
                        getOptionLabel={(option) =>
                            `${option.creator_name || ""}  ${option?.phase
                                ? new Date(option.phase).toISOString().split("T")[0]
                                : "No Phase"
                            }`
                        }
                        sx={{ width: 300 }}

                        renderInput={(params) => (
                            <TextField {...params} label=" Pages By Phases" />
                        )}
                    />



                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OpreationLinkUpdateDirect;
