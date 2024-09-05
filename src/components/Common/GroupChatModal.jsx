import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MultiSelectSearch from "./MultiSelectSearch";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import CreateIcon from "@mui/icons-material/Create";

const style = {
  position: "relative",
  top: "58%",
  left: "71%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  height: 400,
  p: 4,
  mb: 30,
  mr: 2,
  borderRadius: 3,
};

const GroupChatModal = () => {
  const [open, setOpen] = useState(false);
  const [getUserData, setGetUserData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [createGroupData, setCreateGroupData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserObjId = decodedToken._id;
  const loginUserId = decodedToken.id;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const chatUserData = async () => {
    const res = await axios.get(`${baseUrl}get_chating_users/${loginUserId}`);
    setGetUserData(res?.data?.data);
  };

  const handleSelectionChange = (selected) => {
    setSelectedOptions(selected);
  };

  console.log(selectedOptions, "selectedOptions>>>>>");

  const userIds = selectedOptions.map((option) => option?.user_id);
  userIds.push(loginUserId);

  console.log(userIds, "userIds>", inputValue, "inputValue");

  const handleCreateClick = async () => {
    try {
      const response = await axios.post(`${baseUrl}group`, {
        groupName: inputValue,
        users: userIds,
        groupAdminId: loginUserObjId,
      });

      if (response.status === 200) {
        setCreateGroupData(response);
        chatUserData();
        handleClose();
      } else {
        console.error("Failed to post chat data");
      }
    } catch (error) {
      console.error("Error posting chat data", error);
    }
  };

  console.log(createGroupData, "createGroupData>>>>");
  return (
    <div>
      {!open && (
        <div style={{ bottom: 0 }}>
          <Button
            sx={{
              color: "white",
              backgroundColor: "grey",
              borderRadius: "6px",
              marginLeft: 60,
              marginTop: "10px",
            }}
            onClick={() => {
              chatUserData();
              handleOpen();
            }}
          >
            Create Group <AddIcon />
          </Button>
        </div>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // Center items vertically
                }}
              >
                <h5 id="parent-modal-title">GROUP CHAT</h5>
                <IconButton
                  onClick={() => {
                    handleClose();
                  }}
                  style={{
                    color: "white",
                    backgroundColor: "grey",
                    display: "flex",
                    justifyContent: "center",
                    height: 30,
                    width: 30,
                  }}
                >
                  <CloseIcon style={{ fontSize: "20px" }} />
                </IconButton>
                {/* <IconButton
                  style={{
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "grey",
                    marginRight: 8,
                    height: 30,
                    width: 30,
                  }}
                >
                  <CreateIcon style={{ fontSize: "20px" }} />
                </IconButton> */}
              </Box>
              <TextField
                id="outlined-basic"
                label="Enter Group Name"
                variant="outlined"
                onChange={(event) => setInputValue(event.target.value)}
                sx={{ mt: 7, width: 434 }}
              />
              <MultiSelectSearch
                getUserData={getUserData}
                handleSelectionChange={handleSelectionChange}
              />
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "grey",
                  borderRadius: "6px",
                  mt: 8,
                  ml: 42,
                }}
                onClick={() => {
                  handleCreateClick();
                }}
              >
                Create <ArrowForwardIosIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
