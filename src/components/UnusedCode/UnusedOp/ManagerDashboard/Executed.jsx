import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Modal, Paper, Typography, Button } from "@mui/material";
import axios from "axios";
import {baseUrl} from '../../../../utils/config'

const 
Executed = ({ executed, forceRender }) => {
  console.log(executed, "new data");
  const [open2, setOpen2] = useState(false);
  const [executedCommit, setExecutedCommit] = useState([]);
  const handleOpen2 = async (params) => {
    const _id = params.row.ass_id;
    try {
      const response = await axios.get(
        `${baseUrl}`+`assignment/commit/single/${_id}`
        // `${baseUrl}`+`assignment/commit/single/2`
      );
      setExecutedCommit(response.data.data);
      setOpen2(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose2 = () => setOpen2(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "60%",
    borderRadius: "10px",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = executed.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Pages",
      width: 180,
    },
    {
      field: "exp_name",
      headerName: "Expertise",
      width: 180,
    },
    {
      field: "postPerPage",
      headerName: "post/page",
      width: 180,
    },
    {
      field: "follower_count",
      headerName: "Followers",
      width: 180,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 180,
    },

    {
      field: "commits",
      headerName: "Commits",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
  ];
  const commitColumns = [
    {
      field: "likes",
      headerName: "Like",
      width: 180,
    },
    {
      field: "comments",
      headerName: "Comment",
      width: 180,
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 180,
    },
    {
      field: "snapshot",
      headerName: "snapshot",
      width: 180,
    },
  ];

  const handleVerified = async () => {
    // console.log(executed[0]?.ass_id, executed[0]?.campaignId);
    const response = await axios.post(
      `${baseUrl}`+`assignment/status`,
      {
        ass_id: executed[0]?.ass_id,
        campaignId: executed[0]?.campaignId,
        ass_status: "verified",
      }
    );
    alert("verified successfully");
    setOpen2(false);
    forceRender();
  };
  const handleReject = async () => {
    const response = await axios.post(
      `${baseUrl}`+`assignment/status`,
      {
        ass_id: executed[0]?.ass_id,
        campaignId: executed[0]?.campaignId,
        ass_status: "rejected",
      }
    );
    alert("rejected successfully");
    setOpen2(false);
    forceRender();
  };
  return (
    <>
      <DataGrid
        rows={executed}
        columns={columns}
        getRowId={(row) => row.p_id}
        pagination
        pageSize={5}
      />
      <>
        <Modal open={open2} onClose={handleClose2}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" sx={{ padding: "2px" }}>
              Commits
            </Typography>

            <Paper sx={{ padding: "10px" }}>
              <DataGrid
                rows={executedCommit}
                columns={commitColumns}
                getRowId={(row) => row._id}
                pagination
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleClose2}
                    color="primary"
                    sx={{ m: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleVerified}
                    sx={{ m: 2 }}
                  >
                    Verified
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReject}
                    sx={{ m: 1 }}
                  >
                    Rejected
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default Executed;
