import React, { useEffect, useState } from "react";
import { TextField, Modal, Box, Typography } from "@mui/material";
import axios from "axios";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";

const ReplacementModal = ({
  open,
  handleOpen,
  handleClose,
  selectedRow,
  plan,
  id,
}) => {
  const [pageData, setPageData] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  useEffect(() => {
    const getPageData = async () => {
      try {
        const res = await axios.get(
          `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
        );
        const remainingData = res?.data?.body.filter(
          (item) =>
            !plan.some((selectedItem) => selectedItem.p_id === item.p_id)
        );
        setPageData(remainingData);
        console.log(remainingData);
      } catch (error) {
        console.error("Error fetching page data: ", error);
      }
    };

    getPageData();
  }, [plan]);

  const replacePlanPages = async () => {
    try {
      const oldPid = selectedRow.p_id;
      const newPidArray = selectedPages.map((selectedPage) => selectedPage);
      console.log(newPidArray);
      const response = await axios.post(`${baseUrl}replace_plan_pages`, {
        campaignId: id,
        old_pid: oldPid,
        new_pid: newPidArray,
      });
      handleClose()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Replace Pages
          </Typography>
          <hr />
          <Typography variant="h6" component="h6">
            Old page
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
          >
            <TextField
              label="Page"
              variant="outlined"
              value={selectedRow?.page_name}
              fullWidth
              disabled
            />
            <TextField
              label="Follower"
              variant="outlined"
              value={selectedRow?.follower_count}
              fullWidth
              disabled
            />
            <TextField
              label="Post"
              variant="outlined"
              value={selectedRow?.postPerPage}
              fullWidth
              disabled
            />
            <TextField
              label="Story"
              variant="outlined"
              value={selectedRow?.storyPerPage}
              fullWidth
              disabled
            />
          </Box>
          <Typography variant="h6" component="h6">
            New Page
          </Typography>
          <Select
            options={pageData.map((page) => ({
              value: page.p_id,
              label: page.page_name,
            }))}
            isMulti
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setSelectedPages(selectedValues);
            }}
          />
          <button
            className="btn btn-outline-success rounded-pill"
            onClick={() => replacePlanPages()}
            style={{ width: "30%" }}
          >
            Replace
          </button>{" "}
        </Box>
      </Modal>
    </div>
  );
};

export default ReplacementModal;
