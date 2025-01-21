import React from "react";
import { TextField } from "@mui/material";

const OpreationColumns = ({
  handleChangeLike,
  handleChangeComment,
  handleChangeViews,
  handleChangeShare,
  handleChangeImpression,
  handleChangeReach,
  handleUpdateRow,
  extractTags,
  shortcode,
  setShortcode,
  setPageId,
}) => [
  {
    key: "Serial_no",
    name: "S.NO",
    renderRowCell: (row, index) => index + 1,
    width: 20,
  },
  {
    key: "fetched",
    name: "Fetched Date",
    width: 100,
    renderRowCell: (row) => {
      const updatedAt = row?.updatedAt;
      if (!updatedAt) return "N/A";
  
      const date = new Date(updatedAt);
      const istDate = date.toLocaleString("en-IN", { 
        timeZone: "Asia/Kolkata", 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
      });
      return istDate;
    },
  }
  ,
  
  {
    key: "creator_name",
    name: "Page Name",
    width: 100,
  },
  {
    key: "post_url",
    name: "Post link",
    width: 300,
    renderRowCell: (row) => (
      <TextField
        fullWidth
        className="form-control"
        placeholder="Post Link"
        type="text"
        value={row?.post_url ? row?.post_url : shortcode[row?._id]}
        onChange={(event) => {
          setShortcode(event.target.value);
          setPageId(row?._id);
        }}
      />
    ),
  },
  {
    key: "post_image",
    name: "Post Image",
    width: 150,
    renderRowCell: (row) => (
      <img
        src={row.post_image}
        alt="Post Image"
        style={{ width: "100%", height: "80px" }}
      />
    ),
  },
  {
    key: "posted_on",
    name: "Post Date",
    width: 150,
    renderRowCell: (row) => {
      const postedOn = row?.posted_on || "";
      const date = postedOn.split(" ")[0];
      return (
          <div>{date || "N/A"}</div>
      );
    },
  },
  {
    key: "posted_on",
    name: "Post Time",
    width: 150,
    renderRowCell: (row) => {
      const postedOn = row?.posted_on || "";
      const time = postedOn.split(" ")[1];
      return (
          <div>{time || "N/A"}</div>
      );
    },
  },
  
  {
    key: "post_type",
    name: "Post Type",
    width: 150,
  },
  {
    key: "all_like",
    name: "Like",
    width: 120,
    renderRowCell: (row) => (
      <TextField
        className="form-control"
        placeholder="Like"
        type="number"
        value={row?.all_like}
        onChange={(e) => handleChangeLike(row._id, e.target.value)}
        onBlur={() => handleUpdateRow(row)}
      />
    ),
  },
  {
    key: "all_comments",
    name: "Comments",
    width: 120,
    renderRowCell: (row) => (
      <TextField
        className="form-control"
        placeholder="Comment"
        type="number"
        value={row?.all_comments || ""}
        onChange={(e) => handleChangeComment(row._id, e.target.value)}
        onBlur={() => handleUpdateRow(row)}
      />
    ),
  },
  {
    key: "all_view",
    name: "Views",
    width: 120,
    renderRowCell: (row) => (
      <>
        <TextField
          fullWidth
          className="form-control"
          placeholder="View"
          type="number"
          value={row?.all_view}
          onChange={(e) => handleChangeViews(row._id, e.target.value)}
          onBlur={() => handleUpdateRow(row)}

        />
      </>
    ),
  },
  {
    key: "share",
    name: "Share",
    width: 120,
    renderRowCell: (row) => (
      <>
        <TextField
          fullWidth
          className="form-control"
          placeholder="Share"
          type="number"
          value={row?.share}
          onChange={(e) => handleChangeShare(row._id, e.target.value)}
          onBlur={() => handleUpdateRow(row)}

        />
      </>
    ),
  },
  {
    key: "impression",
    name: "Impression",
    width: 120,
    renderRowCell: (row) => (
      <>
        <TextField
          fullWidth
          className="form-control"
          placeholder="Impression"
          type="number"
          value={row?.impression}
          onChange={(e) => handleChangeImpression(row._id, e.target.value)}
          onBlur={() => handleUpdateRow(row)}

        />
      </>
    ),
  },
  {
    key: "reach",
    name: "Reach",
    width: 120,
    renderRowCell: (row) => (
      <>
        <TextField
          fullWidth
          className="form-control"
          placeholder="Reach"
          type="number"
          value={row?.reach}
          onChange={(e) => handleChangeReach(row._id, e.target.value)}
          onBlur={() => handleUpdateRow(row)}

        />
      </>
    ),
  },
  {
    key: "title",
    name: "Captions",
    width: 100,
  },
  {
    key: "Tags",
    name: "Tags",
    width: 150,
    renderRowCell: (row) => {
      const { tags } = extractTags(row.title || "");
      return tags.join(", ");
    },
  },
  {
    key: "Tag Count",
    name: "Tag Count",
    width: 150,
    renderRowCell: (row) => {
      const { tagCount } = extractTags(row.title || "");
      return tagCount;
    },
  },
  {
    key: "Hashtags",
    name: "Hashtags",
    width: 150,
    renderRowCell: (row) => {
      const { hashtags } = extractTags(row.title || "");
      return hashtags.join(", ");
    },
  },
  {
    key: "Hashtag Count",
    name: "Hashtag Count",
    width: 150,
    renderRowCell: (row) => {
      const { hashtagCount } = extractTags(row.title || "");
      return hashtagCount;
    },
  },
  // {
  //   key: "Action",
  //   name: "Action",
  //   width: 150,
  //   renderRowCell: (row) => (
  //     <div className="d-flex">
  //       <button
  //         onClick={() => handleUpdateRow(row)}
  //         title="update"
  //         className="icon-1"
  //       >
  //         <EditNoteIcon />
  //       </button>
  //     </div>
  //   ),
  // },
];

export default OpreationColumns;
