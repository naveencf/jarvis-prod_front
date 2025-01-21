import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import NotFoundShortCodeDialog from "./NotFoundShortCodeDialog";

const OperationShortcodeUpdater = ({ fetchPlanWiseData, planWiseData }) => {
    const [inputLinks, setInputLinks] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [allPhases, setAllPhases] = useState([]);
    const [userPhases, setUserPhases] = useState([]);
    const [unmatchedData, setUnmatchedData] = useState([]);
    const [postDataList, setPostDataList] = useState([]);
    const [unmatchedShortcodes, setUnmatchedShortcodes] = useState([]);


    const extractShortcodes = (links) => {
        const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/g;
        const shortcodes = [];
        let match;
        while ((match = regex.exec(links)) !== null) {
            shortcodes.push(match[2]);
        }
        return shortcodes;
    };

    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const fetchInstagramPostDetails = async (shortcode) => {
        const payload = {
            shortCode: shortcode,
            department: "660ea4d1bbf521bf783ffe18",
            userId: 15,
        };


        try {
            const response = await axios.post(
                `https://insights.ist:8080/api/v1/getpostDetailFromInsta`,
                payload,
                config
            );
            return response.data.success ? response.data.data : null;
        } catch (error) {
            console.error(`Error fetching details for shortcode ${shortcode}:`, error);
            return null;
        }
    };

    const updatePostDetails = async (postData, shortcode) => {
        const updatePayload = {
            // post_url: shortcode,
            all_comments: postData?.comment_count,
            all_like: postData?.like_count,
            all_view: postData?.play_count,
            creator_follower_count: postData?.owner_info?.followers,
            post_image: postData?.postImage,
            title: postData?.post_caption,
            post_type: postData?.postType,
            posted_on: postData?.postedOn,
            short_code: postData?.shortCode,
            // phase: "2025-01-15",
        };

        const matchingPhase = planWiseData.find((phase) => {
            const phaseDate = new Date(phase?.phase).toISOString().split("T")[0];
            const postDate = new Date(postData?.postedOn).toISOString().split("T")[0];
            return phaseDate === postDate;
        });
        // console.log(postData, "planWiseData", planWiseData)
        if (matchingPhase) {
            const matchingRecords = planWiseData.filter(
                (item) => item?.creator_name === postData?.owner_info?.username
            );

            let updated = false;

            for (const record of matchingRecords) {
                if (record?.short_code === postData?.shortCode) {
                    await axios.put(
                        `${baseUrl}operation/operation_execution_master/${record?._id}`,
                        updatePayload, config
                    );
                    updated = true;
                    alert(`Updated successfully for shortcode: ${postData?.shortCode}`);
                    return true; // Updated successfully
                    break;
                }
            }

            if (!updated) {
                for (const record of matchingRecords) {
                    if (record?.short_code == "" && !record?.short_code) {
                        await axios.put(
                            `${baseUrl}operation/operation_execution_master/${record?._id}`,
                            updatePayload, config
                        );
                        alert(`Updated in the next available field for shortcode: ${postData?.shortCode}`);
                        updated = true;
                        return true; // Updated successfully
                        break;
                    }
                }
            }
            return false; // Updated successfully
        }
        return false; // Updated successfully

    };



    const handleUpdate = async () => {
        const shortcodes = extractShortcodes(inputLinks);
        if (shortcodes.length === 0) {
            alert("No valid shortcodes found in the input.");
            return;
        }

        setLoading(true);
        const fetchedData = [];
        const unmatched = [];
        const unmatchedfetchedData = [];

        // Fetch all post data
        for (const shortcode of shortcodes) {
            const postData = await fetchInstagramPostDetails(shortcode);
            if (postData) {
                fetchedData.push(postData);
            } else {
                unmatched.push(shortcode);
            }
        }

        setPostDataList(fetchedData);

        // Update matched data
        for (const postData of fetchedData) {
            const isUpdated = await updatePostDetails(postData);
            if (!isUpdated) {
                unmatched.push(postData.shortCode); // Add unmatched shortcode
                unmatchedfetchedData.push(postData); // Add unmatched postData

            }
        }
        // Update matched data
        if (unmatchedfetchedData.length > 0) {

            setOpenModal(true);
            setAllPhases(planWiseData.map((phase) => phase.phase));
            setUnmatchedData(unmatchedfetchedData)
            // for (const postData of unmatchedfetchedData) {
            //     setUserPhases(
            //         planWiseData
            //             .filter((item) => item?.creator_name === postData?.owner_info?.username)
            //             .map((item) => item.phase)
            //     );
            //     // const isUpdated = await updatePostDetails(postData);
            //     // if (!isUpdated) {
            //     //     unmatched.push(postData.shortCode); // Add unmatched shortcode
            //     //     unmatchedfetchedData.push(postData.shortCode); // Add unmatched shortcode

            //     // }
            // }
        }

        // // Handle unmatched shortcodes via dialog
        // if (unmatched.length > 0) {
        //     setUnmatchedShortcodes(unmatched);
        //     setOpenModal(true);
        // }

        setLoading(false);
        fetchPlanWiseData();
        setInputLinks("");
    };


    return (
        <div className="d-flex m-1">
            <TextField
                style={{ width: "300px" }}
                className="form-control mr-2"
                label="Enter Instagram Links"
                placeholder="Paste links separated by commas"
                type="text"
                value={inputLinks}
                onChange={(e) => setInputLinks(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                disabled={loading}
            >
                {loading ? "Processing..." : "Update"}
            </Button>

            {/* Phase Details Modal */}
            <NotFoundShortCodeDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                allPhases={allPhases}
                userPhases={userPhases}
                unmatchedData={unmatchedData}
                planWiseData={planWiseData}
            />
        </div>
    );
};

export default OperationShortcodeUpdater;
{/* <OperationShortcodeUpdater
            fetchPlanWiseData={getPlanWisePages}
            planWiseData={palnWisePage}

          /> */}