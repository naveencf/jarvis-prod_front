export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1] : users[0];
};
// export const getSender = (loggedUser, users) => {
//   console.log(loggedUser, "loggedUser>>");
//   console.log(users, "users>>");
//   // return users[0] === loggedUser ? users[1] : users[0];
//   return users[0].user_id === loggedUser ? users[1] : users[0];
// };
export const isSameSender = (messages, mess, index, userId) => {
  console.log(userId, "userId>>", mess, "mess>>");
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender?._id !== mess?.sender?._id ||
      messages[index + 1].sender?._id === undefined) &&
    messages[index].sender?._id !== userId
  );
};
export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};
export const isSameSenderMargin = (messages, mess, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender?._id === mess?.sender?._id &&
    messages[index].sender?._id !== userId
  ) {
    return 33;
  } else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender?._id !== mess?.sender?._id &&
      messages[index].sender?._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender?._id !== userId)
  ) {
    return 0;
  } else return "auto";
};
export const isSameUser = (messages, mess, index) => {
  return index > 0 && messages[index - 1].sender?._id === mess?.sender?._id;
};
