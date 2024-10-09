import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  Divider,
  Button,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import ReadOnlyCaseStudyFields from "./ReadOnlyCaseStudyFields";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import { useEffect } from "react";

const CaseStudyOpenUpdate = (props) => {
  const {
    setCaseStudyDialog,
    caseStudyDialog,
    caseStudyOpenRowData,
    readOnlyAccountsData,
  } = props;
  const { toastAlert, toastError } = useGlobalContext();

  const [noOfPosts, setNoOfPosts] = useState("");
  const [reach, setReach] = useState("");
  const [impression, setImpression] = useState("");
  const [views, setViews] = useState("");
  const [engagement, setEngagement] = useState("");
  const [storyViews, setStoryViews] = useState("");
  const [linkClicks, setLinkClicks] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [cfGoogleSheetLink, setCfGoogleSheetLink] = useState("");
  const [sarcasmGoogleSheetLink, setSarcasmGoogleSheetLink] = useState("");
  const [mmcGoogleSheetLink, setMMCGoogleSheetLink] = useState("");
  const token = sessionStorage.getItem("token");

  console.log(
    caseStudyOpenRowData?.account_id,
    "caseStudyOpenRowData--->>",
    readOnlyAccountsData
  );
  console.log(readOnlyAccountsData, "case study row data ---->>>");

  const handleCloseCaseStudyDialog = () => {
    setCaseStudyDialog(false);
  };

  const handleSubmitCaseStudyOpen = async (e) => {
    e.preventDefault();

    const payloadData = {
      account_id: caseStudyOpenRowData?.account_id,
      no_of_posts: parseFloat(noOfPosts),
      reach: parseFloat(reach),
      impression: parseFloat(impression),
      views: parseFloat(views),
      engagement: parseFloat(engagement),
      story_views: parseFloat(storyViews),
      link_clicks: parseFloat(linkClicks),
      likes: parseFloat(likes),
      comments: parseFloat(comments),
      cf_google_sheet_link: cfGoogleSheetLink,
      sarcasm_google_sheet__link: sarcasmGoogleSheetLink,
      MMC_google_sheet__link: mmcGoogleSheetLink,
      case_study_status: false,
    };

    try {
      // Fetching read-only account data
      const response = await axios.post(`${baseUrl}v1/casestudy`, payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "Response---->");
      if (response) {
        toastAlert("Data Updated SuccessFully");
        handleCloseCaseStudyDialog();
      }
    } catch (error) {
      toastError(error, "Error While Updating Data");
    }
  };

  return (
    <Dialog
      open={caseStudyDialog}
      onClose={handleCloseCaseStudyDialog}
      fullWidth={"md"}
      maxWidth={"md"}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogTitle>Update Case Study</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseCaseStudyDialog}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers={true}
        sx={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="row gap-3">
          <ReadOnlyCaseStudyFields rowData={readOnlyAccountsData} />
          <Divider />

          <TextField
            type="number"
            label="No. Of Posts"
            className="col"
            onChange={(e) => setNoOfPosts(e.target.value)}
            autoFocus
            margin="dense"
            variant="outlined"
            fullWidth
          />
          <TextField
            type="number"
            label="Reach"
            className="col"
            onChange={(e) => setReach(e.target.value)}
            autoFocus
            margin="dense"
            variant="outlined"
            fullWidth
          />

          <div className="row gap-3">
            <TextField
              type="number"
              label="Impression"
              className="col"
              onChange={(e) => setImpression(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />

            <TextField
              type="number"
              label="Views"
              className="col"
              onChange={(e) => setViews(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="row gap-3">
            <TextField
              type="number"
              label="Engagement"
              className="col"
              onChange={(e) => setEngagement(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />

            <TextField
              type="number"
              label="Story Views"
              className="col"
              onChange={(e) => setStoryViews(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="row gap-3">
            <TextField
              type="number"
              label="Link Clicks"
              className="col"
              onChange={(e) => setLinkClicks(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />

            <TextField
              type="number"
              label="Likes"
              className="col"
              onChange={(e) => setLikes(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="row gap-3">
            <TextField
              type="number"
              label="Comments"
              className="col"
              onChange={(e) => setComments(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />

            <TextField
              type="text"
              label="CF Google sheet Link"
              className="col"
              onChange={(e) => setCfGoogleSheetLink(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="row gap-3">
            <TextField
              type="text"
              label="Sarcasm Google Sheet Link"
              className="col"
              onChange={(e) => setSarcasmGoogleSheetLink(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
            <TextField
              type="text"
              label="MMC Google Sheet Link"
              className="col"
              onChange={(e) => setMMCGoogleSheetLink(e.target.value)}
              autoFocus
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </div>
          <div>
            <Button
              variant="contained"
              className="mx-2"
              fullWidth
              onClick={(e) => handleSubmitCaseStudyOpen(e)}
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyOpenUpdate;
