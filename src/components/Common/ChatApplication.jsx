import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import UserChatData from "./UserChatData";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../utils/config";
import GroupChatModal from "./GroupChatModal";

const style = {
  position: "relative",
  top: "58%",
  left: "71%",
  transform: "translate(-50%, -50%)",
  width: 950,
  bgcolor: "background.paper",
  boxShadow: 24,
  height: 600,
  p: 4,
  mb: 30,
  mr: 2,
  borderRadius: 3,
};

const ChatApplication = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [chattingUserData, setChattingUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatIdData, setChatIdData] = useState(null);

  const searchingUserData = async () => {
    const res = await axios.get(`${baseUrl}get_chating_users/${loginUserId}`);
    setData(res?.data?.data);
  };

  const getChattingUserData = async () => {
    try {
      const res = await axios.get(`${baseUrl}chat/${loginUserId}`);
      setChattingUserData(res?.data?.data);
    } catch (error) {
      console.error("Error fetching chattingUserData:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    searchingUserData();
    getChattingUserData();
  }, []);

  // console.log(chattingUserData, "chattingUserData?>>>>>");

  const handleSearchInputChange = (e, newValue) => {
    // console.log(newValue, "newValue>>>");
    // setSelectedUserId(newValue?.value);
    setSearchInput(newValue);
    filterRows(newValue);
  };

  const filterRows = (input) => {
    const filtered = data.filter((row) =>
      row?.user_name.toLowerCase().includes(input?.label.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const handleItemClick = async (idData) => {
    try {
      const response = await axios.post(`${baseUrl}chat`, {
        userFromChatId: loginUserId,
        userToChatId: idData?.value?.user_id,
      });
      // console.log(response?.data?.data, "idData ddddddddddddddddddd>>>");
      if (response.status === 200) {
        setChatIdData(response?.data?.data?._id);
        setSelectedItem(idData?.value);
        getChattingUserData();
      } else {
        console.error("Failed to post chat data");
      }
    } catch (error) {
      console.error("Error posting chat data", error);
    }
  };

  // console.log(chattingUserData, "CHAT APPPLICATION COMPONENT ");
  return (
    <>
      {!open && (
        <div style={{ position: "fixed", right: 20, bottom: 90 }}>
          <Button
            sx={{
              color: "#141452",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderRadius: "10px",
                background: "#e6e698",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => {
              searchingUserData();
              getChattingUserData();
              handleOpen();
            }}
          >
            <ChatOutlinedIcon />
          </Button>
        </div>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="chatContainer">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* <TextField
                placeholder="Search user"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  background: "#fff",
                  color: "black",
                  borderRadius: "10px",
                  width: "188px",
                  marginBottom: "28px",
                }}
              /> */}
              <Autocomplete
                disablePortal
                id={data.map((data) => data.user_id)}
                // value={searchInput}
                // onChange={handleSearchInputChange}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    handleItemClick(newValue);
                    handleSearchInputChange(newValue);
                  }
                }}
                options={data.map((option) => ({
                  label: option.user_name,
                  value: option,
                }))}
                getOptionLabel={(option) => option.label}
                // options={Array.from(
                //   new Set(data.map((option) => option?.user_name))
                // )}
                sx={{
                  background: "#fff",
                  width: 190,
                  color: "black",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={searchInput}
                    label="Search user"
                    variant="outlined"
                  />
                )}
              />
            </Box>
            {/* Group Chat Component*/}
            <GroupChatModal />
            {/* =============== */}
            <IconButton
              onClick={handleClose}
              style={{
                color: "white",
                backgroundColor: "grey",
                marginTop: 10,
                height: 30,
                width: 30,
              }}
            >
              <CloseIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
          {data.length > 0 && (
            <UserChatData
              data={filteredRows}
              chatIdData={chatIdData}
              chattingUserData={chattingUserData}
              selectedItem={selectedItem}
              getChattingUserData={getChattingUserData}
            />
          )}
          {/* <UserChatData data={filteredRows} /> */}
          {/* < */}
        </Box>
      </Modal>
    </>
  );
};

export default ChatApplication;
