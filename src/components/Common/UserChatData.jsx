import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
// import ConversationChat from "./ConversationChat";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../utils/config";
import { getSender } from "./ChatLogics";

const UserChatData = (props) => {
  const { chattingUserData, selectedItem, getChattingUserData, chatIdData } =
    props;

  const [getChatId, setGetChatId] = useState(null);
  const [dataChat, setDataChat] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?._id;

  const handleGetChatData = async (e, data) => {
    const chatId = data?._id;

    try {
      setGetChatId(data?._id);
      const response = await axios.get(`${baseUrl}message/${chatId}`);
      console.log(response, "response>>> ");
      if (response.status === 200) {
        console.log("HIIIIIIIIIIII 24 Line no.");
        setDataChat(response?.data?.data);
        const res = response?.data?.data;
        getChattingUserData();
        // setMessageChatData(res);
        // const msgData = res.map((item) => item?.chatId?._id);
        // console.log(msgData, "msgData>>");
        // setChatID(msgData);
      }
      // socket.emit("join chat", chatId);
    } catch (error) {
      console.error("Error fetching chat data", error);
    }
  };

  console.log(dataChat, "data chat log 43--------------");
  return (
    <div
      style={{ display: "flex", backgroundColor: "white" }}
      className="chatContainer"
    >
      <Box>
        <div
          style={{ maxHeight: "390px", width: "200px", overflowY: "scroll" }}
        >
          {chattingUserData.map((item, index) => (
            <div
              key={index}
              style={{ padding: "10px", color: "white", cursor: "pointer" }}
              onClick={(e) => handleGetChatData(e, item)}
            >
              {/* {!item.isGroupChat && (
                <b> {getSender(loginUserId, item.users).user_name}</b>
              )} */}

              {!item.isGroupChat
                ? getSender(loginUserId, item?.users)?.user_name
                : item?.chatName}
              <hr style={{ width: "30%", background: "orange" }} />
            </div>
          ))}
        </div>
      </Box>
      {/* <ConversationChat
        selectedItem={selectedItem}
        chatIdData={chatIdData}
        dataChat={dataChat}
        setDataChat={setDataChat}
        getChatId={getChatId}
      /> */}
    </div>
  );
};

export default UserChatData;
