import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import {
  Box,
  Modal,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import {baseUrl} from '../../../../utils/config'

const Pending = ({ pending }) => {
  const [open2, setOpen2] = useState(false);
  const [pendingCommit, setPendingCommit] = useState([]);
  const handleOpen2 = async (params) => {
    const _id = params.row.ass_id;
    try {
      const response = await axios.get(
        `${baseUrl}`+`assignment/commit/single/${_id}`
        // `${baseUrl}`+`assignment/commit/single/2`
      );
      setPendingCommit(response.data.data);
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
        const rowIndex = pending.indexOf(params.row);
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
  return (
    <>
      <DataGrid
        rows={pending}
        columns={columns}
        getRowId={(row) => row.p_id}
        pagination
        pageSize={5}
      />
      <>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ padding: "2px" }}
            >
              Commits
            </Typography>
            <Paper sx={{ padding: "10px" }}>
              <DataGrid
                rows={pendingCommit}
                columns={commitColumns}
                getRowId={(row) => row._id}
                pagination
              />
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                onClick={handleClose2}
                color="primary"
              >
                Cancle
              </Button>
            </Paper>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default Pending;
