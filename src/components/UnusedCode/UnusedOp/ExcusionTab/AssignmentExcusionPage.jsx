import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AssignmentExcusionPage = ({
  selectedCampaign,
  data,
  selectedCamp,
  getAssignment,
  status,
}) => {
  const [shortcode, setShortcode] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  // const handleShortcodeChange = (event, index) => {
  //   const newShortcodes = [...shortcode];
  //   newShortcodes[index] = event.target.value;
  //   setShortcode(newShortcodes);
  // };

  useEffect(() => {
    const fetchPageDetails = async (index) => {
      if (shortcode) {
        const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
        const match = shortcode.match(regex);
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
            `http://35.200.154.203:8080/api/v1/getpostDetailFromInsta`,
            payload,
            config
          );

          setPageDetails((prevPageDetails) => {
            let updatedPageDetails;
            if (Array.isArray(prevPageDetails)) {
              updatedPageDetails = [...prevPageDetails];
            } else {
              updatedPageDetails = { ...prevPageDetails };
            }
            updatedPageDetails = response?.data.data;
            return updatedPageDetails;
          });
        } catch (error) {
          console.error("Error fetching page details:", error);
        }
      } else {
        console.log("No match found or invalid shortcode.");
      }
    };
    fetchPageDetails();
  }, [shortcode]);

  //  filter hashtags and tags -->
  const extractTags = (caption) => {
    if (!caption)
      return { tags: [], hashtags: [], tagCount: 0, hashtagCount: 0 };

    const tagRegex = /@(\w+)/g;
    const tagMatches = caption.match(tagRegex);
    const tags = tagMatches
      ? tagMatches.map((match) => match.substring(1))
      : [];
    const tagCount = tags.length;
    const hashtagRegex = /#(\w+)/g;
    const hashtagMatches = caption.match(hashtagRegex);
    const hashtags = hashtagMatches
      ? hashtagMatches.map((match) => match.substring(1))
      : [];
    const hashtagCount = hashtags.length;

    return { tags, hashtags, tagCount, hashtagCount };
  };

  const { tags, hashtags, tagCount, hashtagCount } = extractTags(
    pageDetails?.post_caption
  );
  const Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => params.rowIndex + 1,
    },
    {
      field: "Date",
      headerName: " Fetched D|T",
      width: 180,
      valueGetter: () =>
        pageDetails?.postedOn ? pageDetails?.postedOn : " Not Fetched",
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
    },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
    },
    {
      field: "replacement",
      headerName: "Replacement",
      width: 150,
    },
    {
      field: "Story link",
      headerName: "Story Link",
      width: 150,
      renderCell: (params, i) => (
        <TextField
          className="form-control"
          placeholder="Story Link"
          type="text"
          value=""
          // onChange={(event) => setShortcode(event.target.value)}
        />
      ),
    },
    {
      field: "Post link",
      headerName: "Post Link",
      width: 150,
      renderCell: (params, i) => (
        <TextField
          className="form-control"
          placeholder="Post Link"
          type="text"
          value={shortcode}
          onChange={(event) => setShortcode(event.target.value)}
        />
      ),
    },
    {
      field: "Post Image",
      headerName: "Post Image",
      width: 150,
      renderCell: () => (
        <img
          src={pageDetails?.postImage}
          alt="Post Image"
          style={{ width: "100%", height: "auto" }}
        />
      ),
    },
    {
      field: "Posted Date",
      headerName: "Posted Date",
      width: 150,
      valueGetter: () => pageDetails?.postedOn,
    },
    {
      field: "Post Type",
      headerName: "Post Type",
      width: 150,
      valueGetter: () => pageDetails?.postType,
    },
    {
      field: "Like",
      headerName: "Like",
      width: 150,
      valueGetter: () => pageDetails?.like_count,
    },
    {
      field: "Comments",
      headerName: "Comments",
      width: 150,
      valueGetter: () => pageDetails?.comment_count,
    },
    {
      field: "Post",
      headerName: "Post",
      width: 150,
      valueGetter: () => pageDetails?.owner_info?.post_count,
    },
    {
      field: "Caption",
      headerName: "Caption",
      width: 150,
      valueGetter: () => pageDetails?.post_caption,
    },
    {
      field: "Tags",
      headerName: "Tags",
      width: 150,
      valueGetter: () => tags.join(", "),
    },
    {
      field: "Tag Count",
      headerName: "Tag Count",
      width: 150,
      valueGetter: () => tagCount,
    },
    {
      field: "Hashtags",
      headerName: "Hashtags",
      width: 150,
      valueGetter: () => hashtags.join(", "),
    },
    {
      field: "Hashtag Count",
      headerName: "Hashtag Count",
      width: 150,
      valueGetter: () => hashtagCount,
    },
  ];

  return (
    <>
      <DataGrid
        rows={data}
        columns={Columns}
        getRowId={(row) => row.p_id}
        pagination
        checkboxSelection
      />
    </>
  );
};

export default AssignmentExcusionPage;
