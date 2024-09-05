import React, { useEffect, useRef } from "react";
// import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./ChatLogics";
import { Tooltip, Avatar } from "@mui/material";
import jwtDecode from "jwt-decode";

const ScrollableChat = (props) => {
  const { dataChat } = props;
  const messagesEndRef = useRef(null);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginObjId = decodedToken._id;

  console.log(loginObjId, "loginObjId>>>");
  useEffect(() => {
    scrollToBottom();
  }, [dataChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  console.log(dataChat, "dataChat>>>");
  return (
    <div>
      {dataChat &&
        dataChat.map((message, index) => (
          <div style={{ display: "flex" }} key={message?._id}>
            {(isSameSender(dataChat, message, index, loginObjId) ||
              isLastMessage(dataChat, index, loginObjId)) && (
              <Tooltip
                label={message?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="20px"
                  mr="1"
                  size="xs"
                  className="chakra-avatar css-212wue"
                  cursor="pointer"
                  name={message?.sender?.name}
                  src={message?.sender?.image}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  message?.sender?._id === loginObjId ? "#BEE3F8" : "#B9F5D0",
                borderRadius:
                  message?.sender?._id !== loginObjId
                    ? "0.8rem 0.8rem 0.8rem 0"
                    : "0.8rem 0.8rem 0 0.8rem",
                padding: "0.5rem 1rem",
                maxWidth: "60%",
                display: "inline-block",
                wordWrap: "break-word",
                marginLeft: isSameSenderMargin(
                  dataChat,
                  message,
                  index,
                  loginObjId
                ),
                marginTop: isSameUser(dataChat, message, index, loginObjId)
                  ? 3
                  : 10,
              }}
            >
              {message?.content}
            </span>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default ScrollableChat;
