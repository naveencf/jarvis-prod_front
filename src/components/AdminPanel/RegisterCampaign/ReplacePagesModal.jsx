import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {baseUrl} from '../../../utils/config'

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

const ReplacePagesModal = ({
  open,
  handleClose,
  selection,
  planData,
  stage,
}) => {
  const [remainingPages, setRemainingPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [postPages, setPostpages] = useState([]);
  const [storyPages, setStorypages] = useState([]);

  const getAllPages = async () => {
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    const remainingData = pageData?.data?.body.filter(
      (item) =>
        !planData.some((selectedItem) => selectedItem.p_id === item.p_id)
    );
    setRemainingPages(remainingData);
  };

  useEffect(() => {
    if (planData.length > 0) {
      getAllPages();
    }
  }, [planData]);

  const handleSubmit = async () => {
    console.log(selection);
    const pagesData = selectedPages.map((page, index) => ({
      page_name: page.page_name,
      postPerPage: postPages[index] || 0,
      storyPerPage: storyPages[index] || 0,
      cat_name: page.cat_name,
      platform: page.platform,
      follower_count: page.follower_count,
      page_link: page.page_link,
      p_id: page.p_id,
      vendor_id: page.vendor_id,
    }));
    const result = await axios.post(
      baseUrl+"replacement/plan",
      {
        campaignName: selection?.campaignName,
        campaignId: selection?.campaignId,
        replacement_request_by: "12345",
        pages: pagesData,
        replacement_stage: stage,
        oldPage_id: selection?.p_id,
        planName: selection?.planName,
        newPage_id: pagesData.map((page) => page.p_id),
      }
    );
    console.log(result);
    handleClose();
  };
  const handlepagesChange = (index, value) => {
    const updatedpages = [...postPages];
    updatedpages[index] = value;
    setPostpages(updatedpages);
  };
  const handlepagesChangeNew = (index, value) => {
    const updatedpages = [...storyPages];
    updatedpages[index] = value;
    setStorypages(updatedpages);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ mb: 4 }} variant="h6" component="h2">
          Replace Page
        </Typography>
        <Autocomplete
          id="combo-box-demo"
          multiple
          options={remainingPages}
          getOptionLabel={(option) => option.page_name}
          onChange={(event, value) => setSelectedPages(value)}
          sx={{ width: 300, mb: 2 }}
          renderInput={(params) => <TextField {...params} label="Pages" />}
        />

        {selectedPages.map((page, index) => (
          <Box key={index} sx={{ display: "flex", mb: 1 }}>
            <TextField
              label="Page Name"
              value={page.page_name}
              disabled
              fullWidth
              margin="normal"
            />
            <TextField
              label="Post / Page"
              value={postPages[index]}
              fullWidth
              onChange={(e) => handlepagesChange(index, e.target.value)}
              sx={{ m: 2 }}
            />
            <TextField
              label="Story / Page"
              value={storyPages[index]}
              fullWidth
              onChange={(e) => handlepagesChangeNew(index, e.target.value)}
              sx={{ m: 2 }}
            />
            <TextField
              label="Category Name"
              value={page?.cat_name}
              disabled
              fullWidth
              sx={{ m: 2 }}
            />
            <TextField
              label="Follower Count"
              value={page.follower_count}
              disabled
              fullWidth
              margin="normal"
            />
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Replace Request
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default ReplacePagesModal;
