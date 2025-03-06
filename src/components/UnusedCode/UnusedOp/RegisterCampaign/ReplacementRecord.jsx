import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from '../../../utils/config'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ReplacementRecord = ({ open, data, handleClose }) => {

  const [replacementData, setReplacementData] = useState({});
  const [oldPageData, seteOldPageData] = useState({});
  const [newPageData, seteNewPageData] = useState([]);
  const [oldData, setOldData] = useState([]);

  const getRecord = async () => {
    const record = await axios.get(
      // `${baseUrl}`+`replacement/${data.replacement_id._id}`
      `${baseUrl}` + `replacement/${data.replacement_id}`
    );
    setReplacementData(record?.data?.data);
  };

  const getPageData = async () => {
    const oldPageData = await axios.get(
      // `${baseUrl}`+`replacement/${data.replacement_id._id}`
      `${baseUrl}` + `replacement/${data.replacement_id}`
    );
    seteNewPageData(oldPageData?.data?.data?.newPages);
    setOldData(oldPageData?.data?.data);
  };

  useEffect(() => {
    if (data) {
      getRecord();
    }
  }, [data]);

  useEffect(() => {
    if (replacementData) {
      getPageData();
    }
  }, [replacementData]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ mb: 2 }} variant="h6" component="h2">
          Old Page
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Page"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={oldData.old?.page_name}
            sx={{ m: 1 }}
          />

          <TextField
            label="Category"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={oldData.old?.cat_name}
            sx={{ m: 1 }}
          />
          <TextField
            label="Follower"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={oldData.old?.follower_count}
            sx={{ m: 1 }}
          />
          <TextField
            label="PlateForm"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={oldData.old?.platform}
            sx={{ m: 1 }}
          />
        </Box>
        <Typography sx={{ mb: 2 }} variant="h6" component="h2">
          New Pages
        </Typography>

        {newPageData.map((item) => (
          <>
            <Box sx={{ display: "flex" }}>
              <TextField
                label="Page"
                disabled
                fullWidth
                value={item?.page_name}
                sx={{ m: 1 }}
              />
              <TextField
                label="Category"
                disabled
                fullWidth
                value={item?.cat_name}
                sx={{ m: 1 }}
              />
              <TextField
                label="Follower"
                disabled
                fullWidth
                value={item?.follower_count}
                sx={{ m: 1 }}
              />
              <TextField
                label="PlateForm"
                disabled
                fullWidth
                value={item?.platform}
                sx={{ m: 1 }}
              />
            </Box>
          </>
        ))}
      </Box>
    </Modal>
  );
};

export default ReplacementRecord;
