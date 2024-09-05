// import React, { useEffect, useState, useRef } from "react";
// import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import io from "socket.io-client";
// import axios from "axios";
// import { baseUrl, socketUrl } from "../../utils/config";
// import jwtDecode from "jwt-decode";
// // import ScrollableChat from "./ScrollableChat";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "./ChatLogics";
// import { Tooltip, Avatar } from "@mui/material";

// // const ENDPOINT = "http://192.168.1.45:8080";
// console.log(socketUrl, "socketUrl");
// var socket, selectedChatCompare;

// const ConversationChat = (props) => {
//   const { selectedItem, chatIdData, getChatId, setDataChat, dataChat } = props;

//   const token = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(token);
//   const loginObjId = decodedToken._id;

//   const [message, setMessage] = useState("");
//   const [socketConnected, setSocketConnected] = useState(false);
//   // const [dataChat, setDataChat] = useState([]);
//   const messagesEndRef = useRef(null);

//   const apiChatId = chatIdData ? chatIdData : getChatId;

//   useEffect(() => {
//     if (chatIdData) {
//       getChatData();
//     }
//   }, [chatIdData]);

//   const handleChange = (event) => {
//     setMessage(event.target.value);
//   };

//   const handleSend = async () => {
//     if (!socketConnected) {
//       console.log("Socket not connected");
//       return;
//     }
//     if (!message.trim()) {
//       console.log("Message is empty");
//       return;
//     }

//     // sending message post data----->
//     const chatPostApi = await axios.post(`${baseUrl}message`, {
//       chatId: chatIdData,
//       content: message,
//       currentUserId: loginObjId,
//     });

//     if (chatPostApi.status === 200) {
//       socket.emit("new-message", chatPostApi.data.data);
//     }
//     setDataChat((prevDataChat) => [...prevDataChat, chatPostApi?.data?.data]);
//     setMessage("");
//     getChatData();
//   };

//   // const scrollToBottom = () => {
//   //   if (messagesEndRef.current) {
//   //     console.log("Scrolling to bottom");
//   //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   //   }
//   // };

//   // While Pressing Enter Key :-

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       handleSend(); // Call handleSend function when Enter key is pressed
//     }
//   };

//   useEffect(() => {
//     // Directly assign to the outer `socket` variable without `const`
//     socket = io(socketUrl, {
//       transports: ["polling"],
//     });

//     socket.on("connect", () => {
//       setSocketConnected(true); // Set connection status
//     });

//     socket.emit("amanSocket", {
//       name: "palak",
//       email: "palak@gmail.com",
//       age: "24",
//     });

//     socket.emit("setup", decodedToken);
//     // socket.on("typing", () => setIsTyping(true));
//     // socket.on("stop typing", () => setIsTyping(false));
//     // Cleanup on component unmount
//     return () => {
//       socket.disconnect();
//       setSocketConnected(false);
//     };
//   }, []);

//   useEffect(() => {
//     socket.on("message received", (newMessageReceived) => {
//       setDataChat((prevDataChat) => [...prevDataChat, newMessageReceived]);
//       // if (
//       //   !selectedChatCompare ||
//       //   selectedChatCompare._id !== newMessageReceived.chatId._id
//       // ) {
//       //   if (!notification.includes()) {
//       //     console.log("in if !notification.includes() 11");
//       //     setNotification([newMessageReceived, ...notification]);
//       //     setFetchAgain(!fetchAgain);
//       //   }
//       // } else {
//       //   console.log("in else 111");
//       //   setMessages([...messages, newMessageReceived]);
//       // }
//     });
//   }, []);

//   const getChatData = async () => {
//     try {
//       const response = await axios.get(`${baseUrl}message/${apiChatId}`);
//       console.log(response, "response   133 line no>>>>>");
//       if (response.status === 200) {
//         console.log(" string inside Response");
//         setDataChat(response?.data?.data);
//       }
//       socket.emit("join chat", chatIdData);
//     } catch (error) {
//       console.error("Error fetching chat data", error);
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [dataChat]);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   if (!selectedItem) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           ml: 3,
//           color: "#fff",
//         }}
//       >
//         <div style={{ fontSize: "25px" }}>
//           Select a user to start a conversation.
//         </div>
//       </Box>
//     );
//   }
//   console.log(dataChat, "dataChat Data 169 log ?????");
//   return (
//     <Box
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         // background: "#fff",
//         width: "80%",
//         borderRadius: "10px",
//         height: "460px",
//       }}
//     >
//       <div className="message">
//         {/* <ScrollableChat
//           dataChat={dataChat}
//           selectedItem={selectedItem}
//           getChatId={getChatId}
//         /> */}
//         <div>
//           {console.log(dataChat, "inside div datachat calll")}
//           {dataChat &&
//             dataChat.map((message, index) => (
//               <div style={{ display: "flex" }} key={message?._id}>
//                 {(isSameSender(dataChat, message, index, loginObjId) ||
//                   isLastMessage(dataChat, index, loginObjId)) && (
//                   <Tooltip
//                     label={message?.sender?.name}
//                     placement="bottom-start"
//                     hasArrow
//                   >
//                     <Avatar
//                       mt="20px"
//                       mr="1"
//                       size="xs"
//                       className="chakra-avatar css-212wue"
//                       cursor="pointer"
//                       name={message?.sender?.name}
//                       src={message?.sender?.image}
//                     />
//                   </Tooltip>
//                 )}
//                 <span
//                   style={{
//                     backgroundColor:
//                       message?.sender?._id === loginObjId
//                         ? "#BEE3F8"
//                         : "#B9F5D0",
//                     borderRadius:
//                       message?.sender?._id !== loginObjId
//                         ? "0.8rem 0.8rem 0.8rem 0"
//                         : "0.8rem 0.8rem 0 0.8rem",
//                     padding: "0.5rem 1rem",
//                     maxWidth: "60%",
//                     display: "inline-block",
//                     wordWrap: "break-word",
//                     marginLeft: isSameSenderMargin(
//                       dataChat,
//                       message,
//                       index,
//                       loginObjId
//                     ),
//                     marginTop: isSameUser(dataChat, message, index, loginObjId)
//                       ? 3
//                       : 10,
//                   }}
//                 >
//                   {message?.content}
//                 </span>
//               </div>
//             ))}
//           <div ref={messagesEndRef} />
//         </div>
//         {/* <div ref={messagesEndRef} /> */}
//       </div>
//       <TextField
//         fullWidth
//         placeholder="Type Message here ....."
//         variant="outlined"
//         value={message}
//         onKeyDown={handleKeyPress}
//         onChange={handleChange}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconButton onClick={handleSend}>
//                 <SendIcon />
//               </IconButton>
//             </InputAdornment>
//           ),
//         }}
//         sx={{ mt: "auto", mr: 4, marginTop: "12px", backgroundColor: "white" }}
//       />
//     </Box>
//   );
// };

// export default ConversationChat;
